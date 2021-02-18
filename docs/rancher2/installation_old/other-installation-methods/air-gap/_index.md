---
title: 离线安装指南
description: 本节介绍在离线环境中安装 Rancher Server 的操作步骤。具体步骤因安装方式而异，有关每个安装选项的更多信息，详情请参考安装介绍。
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
  - 离线安装指南
---

本节介绍在离线环境中安装 Rancher Server 的操作步骤。具体步骤因安装方式而异，详情请参考[安装介绍](/docs/rancher2/installation/_index)。

> **重要：** Docker 单节点安装 Rancher 无法迁移到高可用安装。因为没有升级路径可以将 Docker 安装过渡到 Kubernetes 安装。

## 安装概要

- [1、准备节点和私有镜像仓库](/docs/rancher2/installation/other-installation-methods/air-gap/prepare-nodes/_index)
- [2、同步镜像到私有镜像仓库](/docs/rancher2/installation/other-installation-methods/air-gap/populate-private-registry/_index)
- [3、部署 Kubernetes 集群（Docker 单节点安装请跳过此步骤）](/docs/rancher2/installation/other-installation-methods/air-gap/launch-kubernetes/_index)
- [4、安装 Rancher](/docs/rancher2/installation/other-installation-methods/air-gap/install-rancher/_index)

## 后续操作

[准备节点](/docs/rancher2/installation/other-installation-methods/air-gap/prepare-nodes/_index)
