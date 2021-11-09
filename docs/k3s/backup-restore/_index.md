---
title: 备份和恢复
description: K3s 的备份和恢复方式由您使用的数据存储类型决定。本文提供了基于外部数据存储和嵌入式 etcd 数据存储*两种存储方式的备份和恢复操作指导，请按需阅读以下章节完成备份和还原K3s。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - 备份和恢复
---

K3s 的备份和恢复方式由您使用的数据存储类型决定。本文提供了基于**外部数据存储**和**嵌入式 etcd 数据存储**两种存储方式的备份和恢复操作指导，请按需阅读以下章节完成备份和还原 K3s。

## 外部数据存储备份和还原

当使用外部数据存储时，备份和恢复操作是在 K3s 之外处理的。数据库管理员需要对外部数据库进行备份，或者从快照或转储中进行恢复。

我们建议将数据库配置为**执行定期快照**。

有关获取数据库快照和从快照还原数据库的详细信息，请参阅官方数据库文档：

- [MySQL 官方文档](https://dev.mysql.com/doc/refman/8.0/en/replication-snapshot-method.html)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/8.3/backup-dump.html)
- [etcd 官方文档](https://github.com/etcd-io/website/tree/master/content/en/docs)

## 嵌入式 etcd 数据存储备份和还原（实验性）

_v1.19.1+k3s1 可用_

在本节中，您将学习如何创建 K3s 集群数据的备份，并从备份中恢复集群。

> **关于带有嵌入式 SQLite 的单个 Server 注意事项：**目前，不支持 SQLite 的备份。相反，请制作一份 `/var/lib/rancher/k3s/server` 的副本，然后删除 K3s。

### 创建快照

K3s 默认启用快照。快照目录默认为`/server/db/Snapshots`。要配置快照间隔或保留的快照数量，请参考下文的参数表格。

### 从快照恢复集群

当 K3s 从备份中恢复时，旧的数据目录将被移动到`/server/db/etcd-old/`。然后 K3s 会尝试通过创建一个新的数据目录来恢复快照，然后从一个带有一个 etcd 成员的新 K3s 集群启动 etcd。

要从备份中恢复集群，运行 K3s 时，请使用`--cluster-reset`选项运行 K3s，同时给出`--cluster-reset-restore-path`，如下：

```shell
./k3s server \
  --cluster-reset \
  --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
```

**结果：**日志中出现一条信息，可以在没有标志的情况下重新启动 K3s。再次启动 K3s，可以成功运行并从指定的快照中恢复。

### 参数

这些选项可以通过命令行或[K3s 配置文件](/docs/k3s/installation/install-options/_index)传递进来，这样可以更容易使用。

| 参数                            | 描述                                                                                                                           |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------------------------- |
| `--etcd-disable-snapshots`      | 禁用自动 etcd 快照                                                                                                             |
| `--etcd-snapshot-schedule-cron` | 以 Cron 表达式的形式配置触发定时快照的时间点，例如：每 5 小时触发一次`* */5 * * *`，默认值为每 12 小时触发一次：`0 */12 * * *` |
| `--etcd-snapshot-retention`     | 保留的快照数量，默认值为 5。                                                                                                   |
| `--etcd-snapshot-dir`           | 保存数据库快照的目录路径。(默认位置：`${data-dir}/db/snapshots`)                                                               |
| `--cluster-reset`               | 忘记所有的对等体，成为新集群的唯一成员，也可以通过环境变量`[$K3S_CLUSTER_RESET]`进行设置。                                     |
| `--cluster-reset-restore-path`  | 要恢复的快照文件的路径                                                                                                         |

### S3 兼容 API 支持

K3s 支持向具有 S3 兼容 API 的系统写入 etcd 快照和从系统中恢复 etcd 快照。S3 支持按需和计划快照。

下面的参数已经被添加到`server`子命令中。这些标志也存在于`etcd-snapshot`子命令中，但是`--etcd-s3`部分被删除以避免冗余。

| 选项                        | 描述                                              |
| --------------------------- | ------------------------------------------------- |
| `--etcd-s3`                 | 启用备份到 S3                                     |
| `--etcd-s3-endpoint`        | S3 endpoint url                                   |
| `--etcd-s3-endpoint-ca`     | S3 自定义 CA 证书连接到 S3 endpoint               |
| `--etcd-s3-skip-ssl-verify` | 禁用 S3 SSL 证书验证                              |
| `--etcd-s3-access-key`      | S3 access key                                     |
| `--etcd-s3-secret-key`      | S3 secret key                                     |
| `--etcd-s3-bucket`          | S3 bucket name                                    |
| `--etcd-s3-region`          | S3 region/bucket 的位置（可选）。默认为 us-east-1 |
| `--etcd-s3-folder`          | S3 文件夹                                         |

执行按需的 etcd 快照并将其保存到 S3：

```
k3s etcd-snapshot \
  --s3 \
  --s3-bucket=<S3-BUCKET-NAME> \
  --s3-access-key=<S3-ACCESS-KEY> \
  --s3-secret-key=<S3-SECRET-KEY>
```

要从 S3 中执行按需的 etcd 快照还原，首先确保 K3s 没有运行。然后运行以下命令：

```
k3s server \
  --cluster-init \
  --cluster-reset \
  --etcd-s3 \
  --cluster-reset-restore-path=<SNAPSHOT-NAME> \
  --etcd-s3-bucket=<S3-BUCKET-NAME> \
  --etcd-s3-access-key=<S3-ACCESS-KEY> \
  --etcd-s3-secret-key=<S3-SECRET-KEY>
```

### Etcd 快照和恢复子命令

k3s 支持一组用于处理 etcd 快照的子命令

| 子命令      | 描述                         |
| ----------- | ---------------------------- |
| delete      | 删除指定的快照               |
| ls, list, l | 列出快照                     |
| prune       | 删除超过配置的保留次数的快照 |
| save        | 触发一个即时的 etcd 快照     |

_注_ `save`子命令与`k3s etcd-snapshot`相同。后者最终将被弃用，取而代之的是前者。

无论 etcd 快照是存储在本地还是存储在 S3 兼容的对象存储中，这些命令都将按预期执行。

关于 etcd 快照子命令的其他信息，请运行`k3s etcd-snapshot`。

从 S3 中删除一个快照。

```
k3s etcd-snapshot delete          \
  --s3                            \
  --s3-bucket=<S3-BUCKET-NAME>    \
  --s3-access-key=<S3-ACCESS-KEY> \
  --s3-secret-key=<S3-SECRET-KEY> \
  <SNAPSHOT-NAME>
```

用默认的保留策略（5）prune 本地快照。`prune`子命令接受一个额外的标志`--snapshot-retention`，允许覆盖默认的保留策略。

```
k3s etcd-snapshot prune
```

```
k3s etcd-snapshot prune --snapshot-retention 10
```
