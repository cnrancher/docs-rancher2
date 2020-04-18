---
title: 针对大型部署的 etcd 调优
description: 当运行具有 15 个或更多集群的大型 Rancher 安装时，建议将 etcd 的默认 keyspace 从默认的 2GB 增加。最大设置为 8GB，主机应具有足够的 RAM 以将整个数据集保留在内存中。增加此值时，还应该增加主机的大小。如果您预计在垃圾回收间隔期间容器的变化率很高，那么在较小的安装中也可以调整 keyspace 大小。Kubernetes 每隔五分钟会自动清理一次 etcd 数据集。在某些情况下，例如部署抖动，可以在垃圾回收发生之前将足够多的事件写入 etcd 并删除，并清理掉所有内容，从而导致 keyspace 被填满。
---

当运行具有 15 个或更多集群的大型 Rancher 安装时，建议将 etcd 的默认 keyspace 从默认的 2GB 增加。最大设置为 8GB，主机应具有足够的 RAM 以将整个数据集保留在内存中。增加此值时，还应该增加主机的大小。如果您预计在垃圾回收间隔期间容器的变化率很高，那么在较小的安装中也可以调整 keyspace 大小。

Kubernetes 每隔五分钟会自动清理一次 etcd 数据集。在某些情况下，例如部署抖动，可以在垃圾回收发生之前将足够多的事件写入 etcd 并删除，并清理掉所有内容，从而导致 keyspace 被填满。如果在 etcd 日志或 Kubernetes API 服务器日志中看到`mvcc: database space exceeded`错误，那么应该考虑增加 keyspace 的大小。这可以通过在 etcd 服务器上设置[quota-backend-bytes](https://etcd.io/docs/v3.4.0/op-guide/maintenance/#space-quota)来实现。

#### 示例：RKE cluster.yml 文件的此代码段将 keyspace 大小增加到 5GB

```yaml
## RKE cluster.yml
---
services:
  etcd:
    extra_args:
      quota-backend-bytes: 5368709120
```

## 扩展 etcd 磁盘性能

您可以遵循[etcd 文档](https://etcd.io/docs/v3.4.0/tuning/#disk)中的建议，以了解如何调整主机上的磁盘优先级。

另外，为了减少 etcd 磁盘上的 IO 争用，可以将专用设备用于 data 和 wal 目录。根据 etcd 最佳实践，镜像 RAID 配置是不必要的，因为 etcd 会在集群中的节点之间复制数据。您可以使用剥离 RAID 配置来增加可用的 IOPS。

要在 RKE 集群中实施此解决方案，`/var/lib/etcd/dataand` 和 `/var/lib/etc/wal`目录将需要在底层主机上挂载磁盘并对其进行格式化。在`etcd`服务的`extra_args`指令中，必须包含`wal_dir`目录。如果不指定`wal_dir`，则 etcd 进程将尝试在`wal`权限不足的情况下操纵基础安装。

```yaml
## RKE cluster.yml
---
services:
  etcd:
    extra_args:
      data-dir: "/var/lib/rancher/etcd/data/"
      wal-dir: "/var/lib/rancher/etcd/wal/wal_dir"
    extra_binds:
      - "/var/lib/etcd/data:/var/lib/rancher/etcd/data"
      - "/var/lib/etcd/wal:/var/lib/rancher/etcd/wal"
```
