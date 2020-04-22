---
title: 升级回滚指南
description: 如果您的 Rancher Server 没有成功升级，您可以回滚到升级之前的版本
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

- [升级](/docs/upgrades/upgrades/_index)

## 回滚 失败的升级

如果您的 Rancher Server 没有成功升级，您可以回滚到升级之前的版本：

- [回滚单节点 Rancher](/docs/upgrades/rollbacks/single-node-rollbacks/_index)
- [回滚高可用 Rancher](/docs/upgrades/rollbacks/ha-server-rollbacks/_index)

> **注意:** 如果要在以下两种情况下回滚版本，您必须执行一些[额外的步骤](/docs/upgrades/rollbacks/_index)来使集群正常工作。
>
> - 从 v2.1.6+ 回滚到 v2.1.0-v2.1.5 或 v2.0.0-v2.0.10 之间的任何版本。
> - 从 v2.0.11+ 回滚到 v2.0.0-v2.0.10 之间的任何版本。
