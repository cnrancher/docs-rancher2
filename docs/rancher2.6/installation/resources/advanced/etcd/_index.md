---
title: 为大型安装进行 etcd 调优
weight: 2
---

当你运行具有 15 个或更多集群的大型 Rancher 安装时，我们建议你扩大 etcd 的默认 keyspace（默认为 2GB）。你最大可以将它设置为 8GB。此外，请确保主机有足够的 RAM 来保存整个数据集。如果需要增加这个值，你还需要同步增加主机的大小。如果你预计在垃圾回收间隔期间 Pod 的变化率很高，你也可以在较小的安装中调整 Keyspace 大小。

Kubernetes 每隔五分钟会自动清理 etcd 数据集。在某些情况下（例如发生部署抖动），在垃圾回收发生并进行清理之前，会有大量事件写入 etcd 并删除，从而导致 Keyspace 填满。如果你在 etcd 日志或 Kubernetes API Server 日志中看到 `mvcc: database space exceeded` 错误，你可在 etcd 服务器上设置 [quota-backend-bytes](https://etcd.io/docs/v3.4.0/op-guide/maintenance/#space-quota) 来增加 Keyspace 的大小。

### 示例：此 RKE cluster.yml 文件的代码片段将 Keyspace 的大小增加到 5GB

```yaml
# RKE cluster.yml
---
services:
  etcd:
    extra_args:
      quota-backend-bytes: 5368709120
```

## 扩展 etcd 磁盘性能

你可以参见 [etcd 文档](https://etcd.io/docs/v3.4.0/tuning/#disk)中的建议，了解如何调整主机上的磁盘优先级。

此外，为了减少 etcd 磁盘上的 IO 争用，你可以为 data 和 wal 目录使用专用设备。etcd 最佳实践不建议配置 Mirror RAID（因为 etcd 在集群中的节点之间复制数据）。你可以不配置 RAID 来增加可用的 IOPS，从而提高磁盘性能。

要在 RKE 集群中实现此解决方案，你需要在底层主机上为 `/var/lib/etcd/data` 和 `/var/lib/etcd/wal` 目录挂载并格式化磁盘。`etcd` 服务的 `extra_args` 指令中必须包含 `wal_dir` 目录。如果不指定 `wal_dir`，etcd 进程将尝试在权限不足的情况下操作底层的 `wal` 挂载。

```yaml
# RKE cluster.yml
---
services:
  etcd:
    extra_args:
      data-dir: '/var/lib/rancher/etcd/data/'
      wal-dir: '/var/lib/rancher/etcd/wal/wal_dir'
    extra_binds:
      - '/var/lib/etcd/data:/var/lib/rancher/etcd/data'
      - '/var/lib/etcd/wal:/var/lib/rancher/etcd/wal'
```
