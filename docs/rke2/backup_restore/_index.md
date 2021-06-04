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

要配置快照时间间隔或保留的快照数量，请参考[options.](#选项)

## 集群重置

RKE2 支持通过传递 `--cluster-reset` 标志将集群重置为一个成员集群，当传递这个标志给 rke2 server 时，它将以相同的数据目录重置集群，etcd 的数据目录存在于`/var/lib/rancher/rke2/server/db/etcd`，这个标志可以在集群中的仲裁丢失事件中传递。

要传递重置标志，首先你需要停止 RKE2 server，如果它通过 systemd 启用：

```
systemctl stop rke2-server
rke2 server --cluster-reset
```

**结果：**日志中的一条消息说，RKE2 可以在没有标志的情况下重新启动。再次启动 rke2，它应该将 rke2 启动为一个 1 个成员的集群。

## 从快照中恢复群集

当 RKE2 从备份中恢复时，旧的数据目录将被移到`/var/lib/rancher/rke2/server/db/etcd-old-%date%/`。然后，RKE2 将试图通过创建一个新的数据目录来恢复快照，然后用一个新的 RKE2 集群启动 etcd，并有一个 etcd 成员。

要从备份中恢复集群，可以使用`--cluster-reset`选项运行 RKE2，并给出`--cluster-reset-restore-path`。

```
rke2 server \
  --cluster-reset \
  --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
```

**结果：**日志中的一条消息说，RKE2 可以在没有标志的情况下重新启动。再次启动 RKE2，应该能成功运行并从指定的快照中恢复。

当 rke2 重置集群时，它会在`/var/lib/rancher/rke2/server/db/etc/reset-file`处创建一个文件。如果你想再次重置集群，你将需要删除这个文件。

## 选项

这些选项可以在配置文件中设置：

| 选项                                | 描述                                                                       |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `etcd-disable-snapshots`            | 禁用自动 etcd 快照                                                         |
| `etcd-snapshot-schedule-cron` value | 例如，每 5 小时一次 `* */5 * * *`(默认：`0 */12 * * *`))                   |
| `etcd-snapshot-retention` value     | 要保留的快照数量 (default: 5)                                              |
| `etcd-snapshot-dir` value           | 保存数据库快照的目录。(默认位置：`${data-dir}/db/snapshots`)               |
| `cluster-reset`                     | 成为新集群的唯一成员。这也可以通过环境变量`[$RKE2_CLUSTER_RESET]`来设置。. |
| `cluster-reset-restore-path` value  | 要恢复的快照文件的路径                                                     |

## 支持 S3 兼容的 API

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
