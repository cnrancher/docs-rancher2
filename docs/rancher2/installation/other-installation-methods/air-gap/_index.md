---
title: 离线安装概述
description: 本节介绍使用 Helm CLI 在离线环境中安装 Rancher Server 的操作步骤。具体步骤因安装方式而异，有关每个安装选项的更多信息，详情请参考安装介绍。
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
  - 其他安装方法
  - 离线安装
  - 离线安装概述
---

本节介绍使用 Helm CLI 在离线环境中安装 Rancher Server 的操作步骤。安装 Rancher 的方式有两种：**单节点安装**和**高可用集群安装**，具体步骤因安装方式而异，详情请参考[安装介绍](/docs/rancher2/installation/_index)。

:::important 重要
因为单节点安装只适用于测试和 demo 环境，而且单节点安装和高可用集群安装之间不能进行数据迁移，所以我们推荐从一开始就使用高可用集群安装的方式安装 Rancher。
:::

## 安装概要

- [步骤 1：准备节点和私有镜像仓库](/docs/rancher2/installation/other-installation-methods/air-gap/prepare-nodes/_index)
- [步骤 2：同步镜像到私有镜像仓库](/docs/rancher2/installation/other-installation-methods/air-gap/populate-private-registry/_index)
- [步骤 3：部署 Kubernetes 集群（Docker 单节点安装请跳过此步骤）](/docs/rancher2/installation/other-installation-methods/air-gap/launch-kubernetes/_index)
- [步骤 4：安装 Rancher](/docs/rancher2/installation/other-installation-methods/air-gap/install-rancher/_index)

## 升级 Rancher

要在离线环境中使用 Helm CLI 升级 Rancher，请按照[升级指南](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/_index)进行操作。

## 后续操作

[准备节点](/docs/rancher2/installation/other-installation-methods/air-gap/prepare-nodes/_index)
