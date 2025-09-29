---
title: 回滚必读
description: 本节包含有关如何将 Rancher Server 回滚到以前版本的信息。
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
  - 安装指南
  - 高可用安装指南
  - 回滚必读
---

## 回滚到 v2.2.x-v2.4.x

要回滚到 v2.5 之前的 Rancher，请按照这里的步骤进行。[恢复备份 - Kubernetes 安装](/docs/rancher2/backups/restore/ha-restore/) 恢复 Rancher 服务器集群的快照会将 Rancher 恢复到快照时的版本和状态。

有关如何回滚安装了 Docker 的 Rancher 的信息，请参考[本页](/docs/rancher2/installation/other-installation-methods/single-node-docker/single-node-rollbacks/)

> 受管集群对其状态具有权威性。这意味着恢复 rancher 服务器不会恢复工作负载部署或快照后在托管集群上所做的更改。

## 回滚到 v2.0.x-v2.1.x

不再支持回滚到 Rancher v2.0-v2.1。回滚到这些版本的说明保留在[这里](/docs/rancher2/backups/restore/ha-restore/2.0-2.1/)，仅用于升级到 Rancher v2.2+不可行的情况。
