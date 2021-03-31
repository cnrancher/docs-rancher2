---
title: K3s Rancher 高可用备份
description: 当将 Rancher 安装在高可用 Kubernetes 集群上时，我们建议使用外部数据库存储集群数据。数据库管理员将需要备份外部数据库，并在需要时从快照或 dump 中还原它。我们建议定期对数据库进行快照拍摄。这种 K3s 架构的一个主要优点是，它允许将集群数据保存在外部数据库中，从而可以将 K3s 服务器节点视为无状态的。
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
  - 备份和恢复指南
  - 备份
  - K3s Rancher 高可用备份
---

当将 Rancher 安装在高可用 Kubernetes 集群上时，我们建议使用外部数据库存储集群数据。

数据库管理员将需要备份外部数据库，并在需要时从快照或 dump 中还原它。

我们建议定期对数据库进行快照拍摄。

## K3s Kubernetes 集群数据

这种 K3s 架构的一个主要优点是，它允许将集群数据保存在外部数据库中，从而可以将 K3s 服务器节点视为无状态的。

<figcaption>
运行 Rancher Server 的 K3s Kubernetes 集群的架构
</figcaption>

![Architecture of an RKE Kubernetes Cluster Running the Rancher Management Server](/img/rancher/k3s-server-storage.svg)

## 创建快照并从快照还原数据库

有关获取数据库快照和从快照还原数据库的详细信息，请参阅官方数据库文档：

- [MySQL 官方文档](https://dev.mysql.com/doc/refman/8.0/en/replication-snapshot-method.html)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/8.3/backup-dump.html)
- [etcd 官方文档](https://github.com/etcd-io/website/tree/master/content/docs)
