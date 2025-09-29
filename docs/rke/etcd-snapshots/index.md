---
title: 备份和恢复
description: RKE 集群可以自动备份 etcd 节点的快照。在灾难场景下，您可以使用这些快照恢复集群。RKE 将快照保存本地`/opt/rke/etcd-snapshots`路径下。RKE 可将集群快照上传至 AWS S3 适配的后端机器。
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
  - RKE
  - 备份和恢复
  - 概述
---

## 概述

_v0.1.7 或以上版本可用_

RKE 集群可以自动备份 etcd 节点的快照。在灾难场景下，您可以使用这些快照恢复集群。RKE 将快照保存本地`/opt/rke/etcd-snapshots`路径下。

_v0.2.0 或以上版本可用_

RKE 可将集群快照上传至 AWS S3 适配的后端机器。

**说明：**RKE v0.2.0 改变了[存储集群状态的方式](/docs/rke/installation/)，所以`pki.bundle.tar.gz`不再是必须的文件。

## 备份集群

您可以[手动创建集群备份](/docs/rke/etcd-snapshots/one-time-snapshots/)，或为集群[创建定时快照](/docs/rke/etcd-snapshots/recurring-snapshots/)。

## 恢复集群

您可以使用 RKE 备份的集群快照[恢复集群](/docs/rke/etcd-snapshots/restoring-from-backup/)。

## 示例场景

这些备份和恢复集群的[示例场景](/docs/rke/etcd-snapshots/example-scenarios/)囊括了不同版本的 RKE。

## 问题排查

如果在备份和恢复集群的过程中碰到问题，可以阅读[问题排查](/docs/rke/etcd-snapshots/troubleshooting/)，排查备份和恢复集群的每个步骤中可能出现问题的地方。
