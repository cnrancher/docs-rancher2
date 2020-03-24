---
title: 升级回滚指南
---

## 升级 Rancher

- [升级](/docs/upgrades/upgrades/_index)

## 回滚不成功的升级

如果你的 Rancher Server 没有成功升级，你可以回滚到升级之前的版本：

- [回滚单节点 Rancher](/docs/upgrades/rollbacks/single-node-rollbacks/_index)
- [回滚高可用 Rancher](/docs/upgrades/rollbacks/ha-server-rollbacks/_index)

> **注意:** 如果要在以下两种情况下回滚版本，您必须执行一些[额外的步骤](/docs/upgrades/rollbacks/_index)来使集群正常工作。
>
> - 从 v2.1.6+ 回滚到 v2.1.0-v2.1.5 或 v2.0.0-v2.0.10 之间的任何版本。
> - 从 v2.0.11+ 回滚到 v2.0.0-v2.0.10 之间的任何版本。
