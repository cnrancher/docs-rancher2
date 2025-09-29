---
title: Etcd 备份和恢复
description: 在本节中，你将学习如何创建 rke2 集群数据的备份并从备份中恢复集群。
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
  - RKE2
  - Etcd 备份和恢复
  - 备份和恢复
  - 备份
  - 恢复
---

在本节中，你将学习如何创建 rke2 集群数据的备份并从备份中恢复集群。

:::note 注意：
`/var/lib/rancher/rke2`是 rke2 的默认数据目录，但它可以通过`data-dir`参数进行配置。
:::

## 创建快照

快照在默认情况下是启用的。

快照目录默认为`/var/lib/rancher/rke2/server/db/snapshots`。

要配置快照时间间隔或保留的快照数量，请参考[选项章节.](#选项)

在 RKE2 中，快照存储在每个 etcd 节点上。如果您有多个 etcd 或 etcd + control-plane 节点，您将拥有多个本地 etcd 快照副本。

在 RKE2 运行的时候，你可以使用 `etcd-snapshot` 子命令来手动获取快照，例如 `rke2 etcd-snapshot save --name pre-upgrade-snapshot`。如需查看 etcd-snapshot 子命令的完整列表，见[子命令页面](https://docs.rke2.io/subcommands/#etcd-snapshot)。

## 集群重置

RKE2 支持通过传递 `--cluster-reset` 标志将集群重置为一个成员集群，当传递这个标志给 rke2 server 时，它将以相同的数据目录重置集群，etcd 的数据目录存在于`/var/lib/rancher/rke2/server/db/etcd`，这个标志可以在集群中的仲裁丢失事件中传递。

要传递重置标志，首先你需要停止 RKE2 server，如果它通过 systemd 启用：

```
systemctl stop rke2-server
rke2 server --cluster-reset
```

**结果：**日志中的一条消息说，RKE2 可以在没有标志的情况下重新启动。再次启动 rke2，它应该将 rke2 启动为一个 1 个成员的集群。

### 将快照恢复到现有的节点上

当 RKE2 从备份中恢复时，旧的数据目录将被移动到 `/var/lib/rancher/rke2/server/db/etcd-old-%date%/`。然后，RKE2 将尝试通过创建一个新的数据目录来恢复快照，并使用具有一个 etcd 成员的新 RKE2 集群启动 etcd。

1. 如果 RKE2 服务是通过 systemd 启用的，你必须在所有 server 节点上停止 RKE2 server 服务。使用下面的命令来完成：

```
systemctl stop rke2-server
```

2. 接下来，可以使用以下命令在第一个 server 节点上启动快照恢复：

```
rke2 server \
  --cluster-reset \
  --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
```

3. 恢复完成后，在第一个 server 节点上启动 rke2-server 服务：

```
systemctl start rke2-server
```

4. 移除其他 server 节点上的 rke2 db 目录，方法如下：

```
rm -rf /var/lib/rancher/rke2/server/db
```

5. 用以下命令在其他 server 节点上启动 rke2-server 服务:

```
systemctl start rke2-server
```

**结果：**还原成功后，日志中出现一条消息说 etcd 正在运行，RKE2 可以在没有标志的情况下重新启动。再次启动 RKE2，它应该成功运行并从指定的快照中恢复。

当 rke2 重置集群时，它在 `/var/lib/rancher/rke2/server/db/reset-flag` 创建一个空文件。这个文件留在原地是无害的，但为了执行后续的重置或恢复，必须删除。这个文件在 rke2 正常启动时被删除。

### 将快照恢复到新节点上

**警告：**对于 rke2 v.1.20.9 及更早的所有版本，你需要先备份和恢复证书，因为有一个已知的问题，即引导数据在恢复时可能无法保存（以下步骤 1-3 假设这种情况）。请参阅下面的[注意](#关于恢复快照的其他注意事项)，了解关于恢复的其他特定版本的恢复注意事项。

1. 备份以下内容：`/var/lib/rancher/rke2/server/cred`, `/var/lib/rancher/rke2/server/tls`, `/var/lib/rancher/rke2/server/token`, `/etc/rancher`。

2. 将上述步骤 1 中的证书恢复到第一个新的 server 节点。

3. 在第一个新的 server 节点上安装 rke2 v1.20.8+rke2r1，如下所示：

```
curl -sfL https://get.rke2.io | INSTALL_RKE2_VERSION="v1.20.8+rke2r1" sh -`
```

4. 停止所有 server 节点上的 RKE2 服务（如果已启用）并使用以下命令从第一个 server 节点上的快照启动恢复：

```
systemctl stop rke2-server
rke2 server \
  --cluster-reset \
  --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
```

5. 恢复完成后，在第一个 server 节点上启动 rke2-server 服务，如下所示：

```
systemctl start rke2-server
```

6. 你可以继续按照标准[RKE2 HA 安装文档](/docs/rke2/install/ha/#3-启动其他-server-节点)向集群添加新的 server 和 worker 节点。

### 关于恢复快照的其他注意事项

> - 当执行从备份中恢复时，用户不需要使用创建快照时所用的相同 RKE2 版本来恢复快照。用户可以使用较新的版本进行还原。当在恢复时改变版本时，要注意使用哪个 etcd 版本。
> - 默认情况下，快照是启用的，并计划每 12 小时进行一次。快照被写入 `${data-dir}/server/db/snapshots`，默认的 `${data-dir}` 是 `/var/lib/rancher/rke2`。
>   
> **rke2 v1.20.11+rke2r1 的特定版本要求**:
> - rke2 v1.20.11+rke2r1 从备份中恢复 RKE2 到新节点时，您应该通过运行 `rke2-killall.sh` 确保所有 Pod 在初始恢复后停止，如下所示：
```
curl -sfL https://get.rke2.io | sudo INSTALL_RKE2_VERSION=v1.20.11+rke2r1
rke2 server \
 --cluster-reset \
 --cluster-reset-restore-path=<PATH-TO-SNAPSHOT> \
 --token=<token used in the original cluster>
rke2-killall.sh
```
> 恢复完成后，在第一个 server 节点上启用并启动 rke2-server 服务，方法如下。：
```
systemctl enable rke2-server
systemctl start rke2-server
```

### 选项

这些选项可以在配置文件中设置：

| 选项                                | 描述                                                                       |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `etcd-disable-snapshots`            | 禁用自动 etcd 快照                                                         |
| `etcd-snapshot-schedule-cron` value | 例如，每 4 小时一次 `0 */4 * * *`(默认：`0 */12 * * *`))                   |
| `etcd-snapshot-retention` value     | 要保留的快照数量 (default: 5)                                              |
| `etcd-snapshot-dir` value           | 保存数据库快照的目录。(默认位置：`${data-dir}/db/snapshots`)               |
| `cluster-reset`                     | 成为新集群的唯一成员。这也可以通过环境变量`[$RKE2_CLUSTER_RESET]`来设置。. |
| `cluster-reset-restore-path` value  | 要恢复的快照文件的路径                                                     |

### 支持 S3 兼容的 API

rke2 支持将 etcd 快照写入具有 S3 兼容 API 的系统，并从该系统恢复 etcd 快照。S3 支持按需和计划快照。

下面的参数已经被添加到`server`子命令中。这些标志也存在于`etcd-snapshot`子命令中，但是删除了`--etcd-s3`部分以避免冗余。

| 选项                        | 描述                                               |
| --------------------------- | -------------------------------------------------- |
| `--etcd-s3`                 | 启用备份到 S3                                      |
| `--etcd-s3-endpoint`        | S3 endpoint url                                    |
| `--etcd-s3-endpoint-ca`     | S3 自定义 CA 证书连接到 S3 端点                    |
| `--etcd-s3-skip-ssl-verify` | 禁用 S3 的 SSL 证书验证                            |
| `--etcd-s3-access-key`      | S3 access key                                      |
| `--etcd-s3-secret-key`      | S3 secret key"                                     |
| `--etcd-s3-bucket`          | S3 bucket 名称                                     |
| `--etcd-s3-region`          | S3 region / bucket 位置 (可选). 默认为： us-east-1 |
| `--etcd-s3-folder`          | S3 folder                                          |

要执行一个按需的 etcd 快照并将其保存到 S3：

```
rke2 etcd-snapshot \
  --s3 \
  --s3-bucket=<S3-BUCKET-NAME> \
  --s3-access-key=<S3-ACCESS-KEY> \
  --s3-secret-key=<S3-SECRET-KEY>
```

要从 S3 执行按需的 etcd 快照恢复，首先确保 rke2 没有运行。然后运行以下命令：

```
rke2 server \
  --cluster-reset \
  --etcd-s3 \
  --cluster-reset-restore-path=<SNAPSHOT-NAME> \
  --etcd-s3-bucket=<S3-BUCKET-NAME> \
  --etcd-s3-access-key=<S3-ACCESS-KEY> \
  --etcd-s3-secret-key=<S3-SECRET-KEY>
```
