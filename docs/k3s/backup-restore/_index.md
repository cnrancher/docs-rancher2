---
title: 备份和恢复
---


K3s的备份和恢复方式取决于使用哪种类型的数据存储。

- [外部数据存储备份和还原](＃外部数据存储备份和还原)
- [嵌入式etcd数据存储备份和还原（实验性）](＃嵌入式etcd数据存储备份和还原)

# 外部数据存储备份和还原

当使用外部数据存储时，备份和恢复操作是在K3s之外处理的。数据库管理员需要对外部数据库进行备份，或者从快照或转储中进行恢复。

我们建议将数据库配置为执行定期快照。

有关获取数据库快照和从快照还原数据库的详细信息，请参阅官方数据库文档：

- [MySQL 官方文档](https://dev.mysql.com/doc/refman/8.0/en/replication-snapshot-method.html)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/8.3/backup-dump.html)
- [etcd 官方文档](https://github.com/etcd-io/etcd/blob/master/Documentation/op-guide/recovery.md)

# 嵌入式etcd数据存储备份和还原（实验性）

_v1.19.1+k3s1 可用_

在本节中，您将学习如何创建 K3s 集群数据的备份，并从备份中恢复集群。

> 这是一个实验性功能，适用于内嵌 etcd 数据存储的 K3s 群集。如果你用外部数据存储安装了 K3s，请参考数据库的上游文档，以了解关于备份群集数据的信息。

### 创建快照

快照是默认启用的。

快照目录默认为`/server/db/Snapshots`。

要配置快照间隔或保留的快照数量，请参考[参数](#参数)

### 从快照恢复集群

当 K3s 从备份中恢复时，旧的数据目录将被移动到`/server/db/etcd-old/`。然后 K3s 会尝试通过创建一个新的数据目录来恢复快照，然后从一个带有一个etcd成员的新K3s集群启动etcd。

要从备份中恢复集群，运行 K3s 时，请使用`--cluster-reset`选项运行K3s，同时给出`--cluster-reset-restore-path`，如下：

```
./k3s server \
  --cluster-reset \
  --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
```

**结果：**日志中出现一条信息，说可以在没有标志的情况下重新启动 K3s。再次启动 K3s，应该可以成功运行并从指定的快照中恢复。

### 参数

这些选项可以通过命令行或[K3s 配置文件](/docs/k3s/installation/install-options/_index)传递进来，这样可能更容易使用。

| 参数                            | 描述                                                                                                                                         |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `--etcd-disable-snapshots`      | 禁用自动 etcd 快照                                                                                                                               |
| `--etcd-snapshot-schedule-cron` | 以 Cron 表达式的形式配置触发定时快照的时间点，例如：每 5 小时触发一次`* */5 * * *`，默认值为每 12 小时触发一次：`0 */12 * * *`               |
| `--etcd-snapshot-retention`     | 保留的快照数量，默认值为 5。                                                                                                                 |
| `--etcd-snapshot-dir`           | 保存数据库快照的目录路径。(默认位置：`${data-dir}/db/snapshots`)                                                                             |
| `--cluster-reset`               | 忘记所有的对等体，成为新集群的唯一成员，也可以通过环境变量`[$K3S_CLUSTER_RESET]`进行设置。  |
| `--cluster-reset-restore-path`  | 要恢复的快照文件的路径                                                                                                                       |
