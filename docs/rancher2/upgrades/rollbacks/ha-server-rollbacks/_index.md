---
title: 高可用回滚
description: 如果升级 Rancher 且失败，则需要将 Rancher Server 回滚到升级前的状态。
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
  - 升级和回滚
  - 高可用回滚
---

如果升级 Rancher 且失败，则需要将 Rancher Server 回滚到升级前的状态。

详情请参考：[恢复高可用 Rancher](/docs/rancher2/backups/2.0-2.4/restorations/ha-restoration/_index)

:::important 警告！
还原 Rancher Server 集群的快照会将 Rancher 还原到该快照的版本和状态。如果在进行快照之后，又对集群进行了更改或者在集群中部署了工作负载，那么将 Rancher Server 回滚到这个快照时，这些在进行快照之后的改动将会丢失。
:::
