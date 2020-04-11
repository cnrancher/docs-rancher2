---
title: 基于 RKE 的 Rancher 高可用备份
---

本节介绍如何创建 Rancher 高可用的备份。

> **先决条件：**
>
> - Rancher Kubernetes Engine v0.1.7 或更高版本
>
>   RKE v0.1.7 以及更高版本才支持`etcd`快照备份功能
>
> - `rancher-cluster.yml`
>
>   需要使用到安装 Rancher 的 RKE 配置文件`rancher-cluster.yml`，将此文件需放在与 RKE 二进制文件同级目录中。
>
> - 您必须将每个 etcd 节点还原到同一快照。在运行 `etcd snapshot-restore` 命令之前，将您正在使用的快照从一个节点复制到其他节点。

## RKE Kubernetes 集群数据架构

在 RKE 集群中，集群数据将在集群中的三个 etcd 节点上的每个节点上复制，以在一个节点发生故障的情况下提供冗余和数据复制。

<sup>运行 Rancher Server 的 RKE 集群的体系结构</sup>

![RKE](/img/rancher/rke-server-storage.svg)

## 备份大纲

备份 Rancher 高可用集群的过程涉及完成多个任务。

1. [拍摄 `etcd` 数据库的快照](#拍摄-etcd-数据库的快照)

   使用 Rancher Kubernetes Engine（RKE）拍摄当前 etcd 数据库的快照。

1. [外部存储快照](#将本地快照备份到安全位置)

   拍摄快照后，将其导出到一个安全的位置，如果您的集群遇到问题，该位置将不会受到影响。

## 拍摄 etcd 数据库的快照

拍摄 `etcd` 数据库的快照。您可以稍后使用这些快照从灾难场景中恢复。有两种拍摄快照的方法：定期拍摄或一次性拍摄。每个选项都更适合于特定的用例。阅读每个链接下方的简短描述，以了解何时使用每个选项。

- [选项 A：定期快照](#选项-a：定期快照)

  在完成 Rancher 高可用安装后，建议将 RKE 配置为自动拍摄重复快照，以便始终有一个安全的还原点可用。

- [选项 B：一次性快照](#选项-b：一次性快照)

  我们建议在升级或还原另一个快照之类的事件之前拍摄一次快照。

### 选项 A：定期快照

对于所有 Rancher 高可用安装，我们建议您定期拍摄快照，以便始终有一个安全的还原点可用。

要制作定期快照，请启用 RKE 附带的 `etcd-snapshot`服务。该服务在 `etcd` 容器旁边的服务容器中运行。您可以通过向 `rancher-cluster.yml` 添加一些代码来启用此服务。

**要启用定期快照：**

1. 编辑`rancher-cluster.yml`配置文件；

2. 编辑 service `etcd`的配置以启用自动备份。

   编辑 `etcd` 服务的代码以启用定期快照。从 RKE v0.2.0 开始，快照可以保存在与 S3 兼容的后端中。

   _RKE v0.2.0+_

   ```yaml
   services:
     etcd:
       backup_config:
         enabled: true # 设置true启用ETCD自动备份，设置false禁用；
         interval_hours: 6 # 快照创建间隔时间，单位小时；
         retention: 60 # 快照保留天数(以天为单位)
         # Optional S3
         s3backupconfig:
           access_key: 'myaccesskey'
           secret_key: 'myaccesssecret'
           bucket_name: 'my-backup-bucket'
           folder: 'folder-name' # Available as of v2.3.0
           endpoint: 's3.eu-west-1.amazonaws.com'
           region: 'eu-west-1'
   ```

   _RKE v0.1.x_

   ```yaml
   services:
     etcd:
       snapshot: true # 设置true启用ETCD自动备份，设置false禁用
       creation: 6h0s # 快照创建间隔时间，单位小时；
       retention: 24h # 快照有效期，此时间后快照将被删除；
   ```

3. 保存并关闭 `rancher-cluster.yml`.

4. 打开**命令行**并切换路径到 RKE 二进制文件所在目录。确保`rancher-cluster.yml`也在这个路径下。

5. 运行以下命令：

   ```bash
   rke up --config rancher-cluster.yml
   ```

**结果：** RKE 会在每个 `etcd` 节点上定时拍摄快照，并将快照将保存到每个 `etcd` 节点的：`/opt/rke/etcd-snapshots/`目录下。如果配置了 S3 存储配置，快照备份也会上传到 S3 兼容的存储后端。

### 选项 B：一次性快照

当您要升级 Rancher 或将其还原到以前的快照时，应该对实时映像进行快照，以使 `etcd` 的备份处于其最新的已知状态。

**制作一次性本地快照：**

1. 打开`终端`，然后将目录更改为 RKE 二进制文件的位置。您的 `rancher-cluster.yml` 文件必须位于同一目录中。
1. 输入以下命令。将`<SNAPSHOT.db>`替换为您要用于快照的任何名称（例如 upgrade.db）。
   ```bash
   rke etcd snapshot-save --name <SNAPSHOT.db> --config rancher-cluster.yml
   ```

**结果：** RKE 为在每个节点上运行的 `etcd` 拍摄快照。该文件将保存到`/opt/rke/etcd-snapshots`。

**制作一次 S3 快照：**

_自 RKE v0.2.0 起可用_

1. 打开`终端`，然后将目录更改为 RKE 二进制文件的位置。您的 `rancher-cluster.yml` 文件必须位于同一目录中。
1. 输入以下命令。将`<SNAPSHOT.db>`替换为您要用于快照的任何名称（例如 upgrade.db）。

   ```bash
   rke etcd snapshot-save --config rancher-cluster.yml --name snapshot-name  \
   --s3 --access-key S3_ACCESS_KEY --secret-key S3_SECRET_KEY \
   --bucket-name s3-bucket-name  --s3-endpoint  s3.amazonaws.com \
   --folder folder-name # 自 v2.3.0 起可用
   ```

**结果：** RKE 为在每个节点上运行的 `etcd` 拍摄快照。该文件将保存到`/opt/rke/etcd-snapshots`。它还被上传到 S3 兼容后端。

## 将本地快照备份到安全位置

> **注意：** 如果您使用的是 RKE v0.2.0，则可以直接将备份保存到与 S3 兼容的后端，然后跳过此步骤。

拍摄 etcd 快照后，请将其保存到安全的位置，以防集群遇到灾难时不受影响。这个位置应该是持久的。

作为示例，在本文档中，我们以 Amazon S3 为安全位置，以 [S3cmd](http://s3tools.org/s3cmd) 为创建备份的工具。您可以决定您使用的备份位置和备份工具。

**例如：**

```
root@node:~# s3cmd mb s3://rke-etcd-snapshots
root@node:~# s3cmd put /opt/rke/etcd-snapshots/snapshot.db s3://rke-etcd-snapshots/
```
