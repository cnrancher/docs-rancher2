---
title: 备份集群
weight: 2045
---

在 Rancher UI 中，你可以轻松备份和恢复 [Rancher 启动的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)的 etcd。

Rancher 建议为所有生产集群配置定期 `etcd` 快照。此外，你还可以轻松创建单次快照。

etcd 数据库的快照会保存在 [etcd 节点](#local-backup-target)或 [S3 兼容目标](#s3-backup-target)上。配置 S3 的好处是，如果所有 etcd 节点都丢失了，你的快照会保存到远端并能用于恢复集群。

本节涵盖以下主题：

- [快照的工作原理](#how-snapshots-work)
- [配置定期快照](#configuring-recurring-snapshots)
- [单次快照](#one-time-snapshots)
- [快照备份目标](#snapshot-backup-targets)
  - [本地备份目标](#local-backup-target)
  - [S3 备份目标](#s3-backup-target)
  - [为 S3 使用自定义 CA 证书](#using-a-custom-ca-certificate-for-s3)
  - [在 S3 中存储快照的 IAM 支持](#iam-support-for-storing-snapshots-in-s3)
- [查看可用快照](#viewing-available-snapshots)
- [安全时间戳](#safe-timestamps)
- [为使用 Rancher v2.2.0 之前的版本创建的集群启用快照功能](#enabling-snapshot-features-for-clusters-created-before-rancher-v2-2-0)

## 快照工作原理

### 快照组件

Rancher 创建快照时，快照里包括三个组件：

- etcd 中的集群数据
- Kubernetes 版本
- `cluster.yml` 形式的集群配置

由于 Kubernetes 版本现在包含在快照中，因此你可以将集群恢复到原本的 Kubernetes 版本。

如果你需要使用快照恢复集群，快照的多个组件允许你选择：

- **仅恢复 etcd 内容**：类似于在 Rancher v2.4.0 之前版本中的使用快照恢复。
- **恢复 etcd 和 Kubernetes 版本**：如果 Kubernetes 升级导致集群失败，并且你没有更改任何集群配置，则应使用此选项。
- **恢复 etcd、Kubernetes 版本和集群配置**：如果你在升级时同时更改了 Kubernetes 版本和集群配置，则应使用此选项。

始终建议在升级之前创建一个快照。

### 从 etcd 节点生成快照

集群中的每个 etcd 节点都会检查 etcd 集群的健康状况。如果节点报告 etcd 集群是健康的，则会从中创建一个快照，并可选择上传到 S3。

快照存储在 `/opt/rke/etcd-snapshots` 中。如果该目录在节点上配置为共享挂载，它将被覆盖。由于所有 etcd 节点都会上传快照并保留最后一个，因此 S3 上始终会保留最后一个上传的节点的快照。

在存在多个 etcd 节点的情况下，任何快照都是在集群健康检查通过后创建的，因此这些快照可以认为是 etcd 集群中数据的有效快照。

### 快照命名规则

快照的名称是自动生成的。在使用 RKE CLI 创建一次性快照时，你可以使用 `--name` 选项来指定快照的名称。

Rancher 在创建 RKE 集群的快照时，快照名称是基于快照创建类型（手动快照或定期快照）和目标（快照是保存在本地还是上传到 S3）决定的。命名规则如下：

- `m` 代表手动
- `r` 代表定期
- `l` 代表本地
- `s` 代表 S3

快照名称示例如下：

- c-9dmxz-rl-8b2cx
- c-9dmxz-ml-kr56m
- c-9dmxz-ms-t6bjb
- c-9dmxz-rs-8gxc8

### 从快照恢复的工作原理

在恢复时会发生以下过程：

1. 如果配置了 S3，则从 S3 检索快照。
2. 如果快照压缩了，则将快照解压缩。
3. 集群中的一个 etcd 节点会将该快照文件提供给其他节点。
4. 其他 etcd 节点会下载快照并验证校验和，以便都能使用相同的快照进行恢复。
5. 集群已恢复，恢复后的操作将在集群中完成。

## 配置定期快照

选择创建定期快照的频率以及要保留的快照数量。时间的单位是小时。用户可以使用时间戳快照进行时间点恢复。

默认情况下，[Rancher 启动的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)会配置为创建定期快照（保存到本地磁盘）。为防止本地磁盘故障，建议使用 [S3 目标](#s3-backup-target)或复制磁盘上的路径。

在集群配置或编辑集群期间，可以在**集群选项**的高级部分中找到快照的配置。点击**显示高级选项**。

在集群的**高级选项**中可以配置以下选项：

| 选项                     | 描述                                  | 默认值  |
| ------------------------ | ------------------------------------- | ------- |
| etcd 快照备份目标        | 选择要保存快照的位置。可以是本地或 S3 | 本地    |
| 启用定期 etcd 快照       | 启用/禁用定期快照                     | 是      |
| 定期 etcd 快照的创建周期 | 定期快照之间的间隔（以小时为单位）    | 12 小时 |
| 定期 etcd 快照的保留数量 | 要保留的快照数量                      | 6       |

## 单次快照

除了定期快照之外，你可能还想创建“一次性”快照。例如，在升级集群的 Kubernetes 版本之前，最好备份集群的状态以防止升级失败。

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，导航到要在其中创建一次性快照的集群。
1. 单击 **⋮ > 拍摄快照**。

**结果**：根据你的[快照备份目标](#snapshot-backup-targets)创建一次性快照，并将其保存在选定的备份目标中。

## 快照备份目标

Rancher 支持两种不同的备份目标：

- [本地目标](#local-backup-target)
- [S3 目标](#s3-backup-target)

### 本地备份目标

默认情况下会选择 `local` 备份目标。此选项的好处是不需要进行外部配置。快照会在本地自动保存到 [Rancher 启动的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)中 etcd 节点的 `/opt/rke/etcd-snapshots` 中。所有定期快照都是按照配置的时间间隔创建的。使用 `local` 备份目标的缺点是，如果发生全面灾难并且丢失 _所有_ etcd 节点时，则无法恢复集群。

### S3 备份目标

`S3` 备份目标允许用户配置与 S3 兼容的后端来存储快照。此选项的主要好处是，如果集群丢失了所有 etcd 节点，由于快照存储在外部，集群仍然可以恢复。Rancher 推荐使用 `S3` 备份这类外部目标。但是它的配置要求进行额外的操作，这也应该被考虑在其中。

| 选项           | 描述                             | 必填 |
| -------------- | -------------------------------- | ---- |
| S3 存储桶名称  | 将存储备份的 S3 存储桶名称       | \*   |
| S3 区域        | 备份存储桶的 S3 区域             |      |
| S3 区域端点    | 备份存储桶的 S3 区域端点         | \*   |
| S3 访问密钥    | 有权访问备份存储桶的 S3 访问密钥 | \*   |
| S3 密文密钥    | 有权访问备份存储桶的 S3 密文密钥 | \*   |
| 自定义 CA 证书 | 用于访问私有 S3 后端的自定义证书 |

### 为 S3 使用自定义 CA 证书

备份快照可以存储在自定义 `S3` 备份中，例如 [minio](https://min.io/)。如果 S3 后端使用自签名或自定义证书，请使用`自定义 CA 证书`选项来提供自定义证书，从而连接到 S3 后端。

### 在 S3 中存储快照的 IAM 支持

除了使用 API 凭证之外，`S3` 备份目标还支持对 AWS API 使用 IAM 身份验证。IAM 角色会授予应用在对 S3 存储进行 API 调用时的临时权限。要使用 IAM 身份验证，必须满足以下要求：

- 集群 etcd 节点必须具有实例角色，该角色具有对指定备份存储桶的读/写访问权限。
- 集群 etcd 节点必须对指定的 S3 端点具有网络访问权限。
- Rancher Server worker 节点必须具有实例角色，该实例角色具有对指定备份存储桶的读/写访问权限。
- Rancher Server worker 节点必须对指定的 S3 端点具有网络访问权限。

要授予应用对 S3 的访问权限，请参阅[使用 IAM 角色向在 Amazon EC2 实例上运行的应用授予权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html)的 AWS 文档。

## 查看可用快照

Rancher UI 中提供了集群所有可用快照的列表：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面中，转到要查看快照的集群并单击其名称。
1. 单击**快照**选项卡来查看已保存快照的列表。这些快照包括创建时间的时间戳。

## 安全时间戳

快照文件带有时间戳，从而简化使用外部工具和脚本处理文件的过程。但在某些与 S3 兼容的后端中，这些时间戳无法使用。

添加了选项 `safe_timestamp` 以支持兼容的文件名。当此标志设置为 `true` 时，快照文件名时间戳中的所有特殊字符都将被替换。

此选项不能直接在 UI 中使用，只能通过`以 YAML 文件编辑`使用。

## 为使用 Rancher v2.2.0 之前的版本创建的集群启用快照功能

如果你有使用 v2.2.0 之前版本创建的 Rancher 启动的 Kubernetes 集群，升级 Rancher 后，你必须[编辑集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/)并 _保存_ 它，以启用更新的快照功能。即使你已经在 v2.2.0 之前创建了快照，你也必须执行此步骤，因为旧的快照将无法用于[通过 UI 备份和恢复 etcd]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/restoring-etcd/)。
