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

如果您升级了 Rancher，但升级没有成功完成，您可能需要将 Rancher 服务器回滚到其最后的健康状态。

要恢复 V2.5 之前的 Rancher，请遵循这里的详细步骤。[恢复备份-Kubernetes 安装]({{<baseurl>}}/rancher/v2.x/en/backups/restorations/ha-restoration)。

要恢复 Rancher v2.5，可以使用 `rancher-backup`应用程序，根据[本节]({{<baseurl>}}/rancher/v2.x/en/backups/restoring-rancher/)从备份中恢复 Rancher。

恢复 Rancher 服务器集群的快照将使 Rancher 恢复到快照时的版本和状态。

:::important 警告
还原 Rancher Server 集群的快照会将 Rancher 还原到该快照的版本和状态。如果在进行快照之后，又对集群进行了更改或者在集群中部署了工作负载，那么将 Rancher Server 回滚到这个快照时，这些在进行快照之后的改动将会丢失。
:::
