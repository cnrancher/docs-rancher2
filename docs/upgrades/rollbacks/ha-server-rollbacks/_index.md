---
title: 高可用回滚
description: 如果升级 Rancher 且升级未成功完成，则可能需要将 Rancher Server 回滚到最后的正常状态。要还原 Rancher，请遵循此处详述的过程：[恢复高可用 Rancher](/docs/backups/restorations/ha-restoration/_index)。还原 Rancher Server 集群的快照会将 Rancher 还原到该快照的版本和状态。
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

如果升级 Rancher 且升级未成功完成，则可能需要将 Rancher Server 回滚到最后的正常状态。

要还原 Rancher，请遵循此处详述的过程：[恢复高可用 Rancher](/docs/backups/restorations/ha-restoration/_index)

还原 Rancher Server 集群的快照会将 Rancher 还原到该快照的版本和状态。

:::important 警告！
集群对其状态具有权威性。如果在进行快照之后，又对集群进行了更改或者在集群中部署了工作负载，那么将 Rancher Server 回滚到这个快照时，那些在进行快照之后的改动将会丢失。
:::
