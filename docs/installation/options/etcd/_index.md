---
title: 针对大型部署的 etcd 调优
description: etcd 的默认的 keyspace 大小为 2GB，上限为 8GB。当您运行具有 15 个或更多集群的大型 Rancher 安装时，建议您扩大 keyspace 容量和主机大小。如果您预计在垃圾回收间隔期间容器的变化率很高，在较小的安装中也可以调整 keyspace 大小，适应变化率。Kubernetes 每隔五分钟会自动清理一次 etcd 数据集。如果发生了部署抖动，Kubernetes 会在垃圾回收发生之前，将足够多的事件写入 etcd。五分钟后，Kubernetes 执行自动清理时，会将 etcd 数据集删除，清理所有内容，导致 keyspace 被填满。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 安装指南
  - 资料、参考和高级选项
  - 针对大型部署的 etcd 调优
---

## 扩展 keyspace 容量

etcd 的默认的 keyspace 大小为 2GB，上限为 8GB。当您运行具有 15 个或更多集群的大型 Rancher 安装时，建议您扩大 keyspace 容量和主机大小。如果您预计在垃圾回收间隔期间容器的变化率很高，在较小的安装中也可以调整 keyspace 大小，适应变化率。

Kubernetes 每隔五分钟会自动清理一次 etcd 数据集。如果发生了部署抖动，Kubernetes 会在垃圾回收发生之前，将足够多的事件写入 etcd。五分钟后，Kubernetes 执行自动清理时，会将 etcd 数据集删除，清理所有内容，导致 keyspace 被填满。如果在 etcd 日志或 Kubernetes API 服务器日志中看到`mvcc: database space exceeded`错误，您可以通过在 etcd 服务器上设置[quota-backend-bytes](https://etcd.io/docs/v3.4.0/op-guide/maintenance/#space-quota)。增加 keyspace 的大小。

#### 示例：将 keyspace 大小增加到 5GB

```yaml
## RKE cluster.yml
---
services:
  etcd:
    extra_args:
      quota-backend-bytes: 5368709120
```

## 扩展 etcd 磁盘性能

您可以参考[etcd 文档](https://etcd.io/docs/v3.4.0/tuning/#disk)，了解如何调整主机上的磁盘优先级。

另外，为了减少 etcd 磁盘上的 IO 争用，可以将专用设备放在 data 和 wal 目录下。另外，etcd 最佳实践中有说明 etcd 的特性：etcd 会在集群中的节点之间复制数据，所以镜像 RAID 配置是不必要的。您可以不配置 RAID 镜像，使用这部分计算资源增加可用的 IOPS，提升磁盘性能。

要在 RKE 集群中实施此解决方案，`/var/lib/etcd/data` 和 `/var/lib/etc/wal`目录将需要在底层主机上挂载磁盘并对其进行格式化。在`etcd`服务的`extra_args`指令中，必须包含`wal_dir`目录。如果不指定`wal_dir`，则 etcd 进程将尝试在`wal`权限不足的情况下操纵基础安装。

#### 示例：调整主机上的磁盘优先级

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
