---
title: 升级回滚指南
description: Rancher 提供了以下手册，帮助您升级或回滚集群。
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
  - 升级回滚指南
---

## 升级 Rancher

Rancher 提供了以下手册，帮助您升级或回滚集群：

- [升级必读](/docs/rancher2/upgrades/upgrades/_index)
- [高可用升级指南](/docs/rancher2/upgrades/upgrades/ha/_index)
- [高可用升级指南（Helm2）](/docs/rancher2/upgrades/upgrades/ha/helm2/_index)
- [升级单节点 Rancher](/docs/rancher2/upgrades/upgrades/namespace-migration/_index)
- [从 RKE Add-on 安装迁移到 Helm 安装](/docs/rancher2/upgrades/upgrades/migrating-from-rke-add-on/_index)
- [升级到 v2.0.7+ 版本时的命名空间迁移](/docs/rancher2/upgrades/upgrades/namespace-migration/_index)

## 回滚失败的升级

如果您的 Rancher Server 没有成功升级，您可以回滚到升级之前的版本：

- [回滚单节点 Rancher](/docs/rancher2/upgrades/rollbacks/single-node-rollbacks/_index)
- [回滚高可用 Rancher](/docs/rancher2/upgrades/rollbacks/ha-server-rollbacks/_index)

如果要在以下两种情况下回滚版本，您必须执行一些额外的步骤来使集群正常工作详情请参考[回滚必读](/docs/rancher2/upgrades/rollbacks/_index)。

- 从 v2.1.6+ 回滚到 v2.1.0-v2.1.5 或 v2.0.0-v2.0.10 之间的任何版本。
- 从 v2.0.11+ 回滚到 v2.0.0-v2.0.10 之间的任何版本。
