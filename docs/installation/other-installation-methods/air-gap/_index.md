---
title: 离线安装指南
description: 本节介绍在离线环境中安装 Rancher Server。安装步骤因 Rancher 是安装在 RKE Kubernetes 集群、K3s Kubernetes 集群或是单个 Docker 容器上而异。
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
  - 安装指南
  - 其他安装方法
  - 离线安装
  - 离线安装指南
---

本节介绍在离线环境中安装 Rancher Server。

安装步骤因 Rancher 是安装在 RKE Kubernetes 集群、K3s Kubernetes 集群或是单个 Docker 容器上而异。

有关每个安装选项的更多信息，请参考[本页](/docs/installation/_index)。

在整个安装说明中，每个安装选项都有独立的*Tab 页*。

> **重要：** 如果您按照 Docker 安装指南安装 Rancher，以后将无法迁移到高可用安装。因为没有升级路径可以将 Docker 安装过渡到 Kubernetes 安装。

## 安装概要

- [1、准备节点和私有镜像仓库](/docs/installation/other-installation-methods/air-gap/prepare-nodes/_index)
- [2、同步镜像到私有镜像仓库](/docs/installation/other-installation-methods/air-gap/populate-private-registry/_index)
- [3、部署 Kubernetes 集群（Docker 单节点安装请跳过此步骤）](/docs/installation/other-installation-methods/air-gap/launch-kubernetes/_index)
- [4、安装 Rancher](/docs/installation/other-installation-methods/air-gap/install-rancher/_index)

## [下一步: 准备节点](/docs/installation/other-installation-methods/air-gap/prepare-nodes/_index)
