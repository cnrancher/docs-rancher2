---
title: 恢复集群
description: 使用备份恢复集群的操作步骤如下，请根据您使用的 RKE 版本获取对应的操作指导说明。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - RKE
  - 备份和恢复
  - 恢复集群
---

使用备份恢复集群的操作步骤如下，请根据您使用的 RKE 版本获取对应的操作指导说明。

## RKE v0.2.0 或以上的版本

如果您的 Kubernetes 集群发生了灾难，您可以使用`rke etcd snapshot-restore`来恢复您的 etcd。这个命令可以将 etcd 恢复到特定的快照，应该在遭受灾难的特定集群的 etcd 节点上运行。

当您运行该命令时，将执行以下操作。

- 同步快照或从 S3 下载快照(如有必要)。
- 跨 etcd 节点检查快照校验和，确保它们是相同的。
- 通过运行`rke remove`删除您当前的集群并清理旧数据。这将删除整个 Kubernetes 集群，而不仅仅是 etcd 集群。
- 从选择的快照重建 etcd 集群。
- 通过运行`rke up`创建一个新的集群。
- 重新启动集群系统 pod。

> **警告：**在运行`rke etcd snapshot-restore`之前，您应该备份集群中的任何重要数据，因为该命令会删除您当前的 Kubernetes 集群，并用新的集群替换。

用于恢复 etcd 集群的快照可以存储在本地的`/opt/rke/etcd-snapshots`中，也可以从 S3 兼容的后端存储。

### 从本地快照恢复的示例

请运行以下命令，从本地快照中还原 etcd：

```shell
rke etcd snapshot-restore --config cluster.yml --name mysnapshot
```

假设快照位于`/opt/rke/etcd-snapshots`中。

**注意：**不需要`pki.bundle.tar.gz`文件，因为 RKE v0.2.0 改变了[Kubernetes 集群状态的存储方式](/docs/rke/installation/_index)。

### 在 S3 中从快照恢复的例子

> **前提条件：** 确保在开始还原之前，您的 `cluster.rkestate`已经存在，因为它包含了集群的证书数据。

当从位于 S3 的快照中还原 etcd 时，命令需要 S3 信息才能连接到 S3 后台并检索快照。

```shell
rke etcd snapshot-restore \
--config cluster.yml \
--name snapshot-name \
--s3 \
--access-key S3_ACCESS_KEY \
--secret-key S3_SECRET_KEY \
--bucket-name s3-bucket-name \
--folder s3-folder-name \ # Optional - Available as of v0.3.0
--s3-endpoint s3.amazonaws.com
```

**注：**如果您是在恢复安装了 Rancher 的集群，Rancher 用户界面应该在几分钟后启动；您不需要重新运行 Helm。

### `rke etcd snapshot-restore`的选项

| 选项                      | 描述                                                                        | S3 相关参数 |
| :------------------------ | :-------------------------------------------------------------------------- | :---------- |
| `--name`                  | 指定快照 name                                                               |             |
| `--config`                | 指定一个备用的集群 YAML 文件（默认：`cluster.yml`） [$RKE_CONFIG]           |             |
| `--s3`                    | 启用备份到 s3                                                               |             |
| `--s3-endpoint`           | 指定 s3 端点网址（默认："s3.amazonaws.com"）。                              | \*          |
| `--access-key`            | 指定 s3 accessKey                                                           | \*          |
| `--secret-key`            | 指定 s3 secretKey                                                           | \*          |
| `--bucket-name`           | 指定 s3 bucket name                                                         | \*          |
| `--folder`                | 指定存放备份的桶内文件夹。这是可选的。这是可选的。_从 v0.3.0 开始提供_。    | \*          |
| `--region`                | Specify the s3 bucket location (optional)                                   | \*          |
| `--ssh-agent-auth`        | [使用由 SSH_AUTH_SOCK 定义的 SSH 代理授权](/docs/rke/config-options/_index) |             |
| `--ignore-docker-version` | [禁用 Docker 版本检查](/docs/rke/config-options/_index)                     |

> **说明：**
>
> - 如果 AWS EC2 示例配置了 IAM 认证，则`--access-key`和`--secret-key`不是必填项。
> - 表格第三列标记为"\* "的参数，是 S3 相关的参数。

## RKE v0.2.0 之前的版本

如果您的 Kubernetes 集群发生了灾难，您可以使用`rke etcd snapshot-restore`来恢复您的 etcd。这个命令可以将 etcd 恢复到特定的快照，应该在遭受灾难的特定集群的 etcd 节点上运行。

当您运行该命令时，将执行以下操作：

- 移除旧的 etcd 集群
- 使用本地快照重建 etcd 集群。

在运行这个命令之前，您必须：

- 运行`rke remove`命令，移除 Kubernetes 集群并清理节点。
- 从 S3 下载您的 etcd 快照，将 etcd 快照和`pki.bundle.tar.gz`文件放在`/opt/rke/etcd-snapshots`中。手动同步所有`etcd`节点的快照。

还原后，您必须使用`rke up`重建 Kubernetes 集群。

> **警告：**在运行`rke etcd snapshot-restore`之前，您应该备份集群中的任何重要数据，因为该命令会删除您当前的 etcd 集群，并以一个新的集群替换。

### 从本地快照恢复的示例

请运行以下命令，从本地快照中还原 etcd：

```shell
rke etcd snapshot-restore --config cluster.yml --name mysnapshot
```

假设快照位于`/opt/rke/etcd-snapshots`中。

快照必须在所有`etcd`节点上手动同步。

`pki.bundle.tar.gz`文件也应在同一位置。

### `rke etcd snapshot-restore`的选项

| 选项                      | 描述                                                                        |
| :------------------------ | :-------------------------------------------------------------------------- |
| `--name`                  | 指定快照名称                                                                |
| `--config`                | 指定一个备用的集群 YAML 文件（默认：`cluster.yml`） [$RKE_CONFIG]           |
| `--ssh-agent-auth`        | [使用由 SSH_AUTH_SOCK 定义的 SSH 代理授权](/docs/rke/config-options/_index) |
| `--ignore-docker-version` | [禁用 Docker 版本检查](/docs/rke/config-options/_index)                     |
