---
title: 离线 Helm CLI 安装
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

本节是关于使用 Helm CLI 在离线环境中安装 Rancher Server。离线环境可以是 Rancher Server 离线安装、防火墙后面或代理后面安装 Rancher Server。

根据 Rancher 是安装在 RKE Kubernetes 集群、K3s Kubernetes 集群还是单个 Docker 容器上，安装步骤有所不同。

有关每个安装选项的更多信息，请参阅[此页面](/docs/rancher2.5/installation/)。

:::important 重要
如果你按照 Docker 安装指南安装 Rancher，则没有将 Docker 安装转换为 Kubernetes 安装的升级路径。
:::

## 安装概要

- [步骤 1：准备节点和私有镜像仓库](/docs/rancher2.5/installation/other-installation-methods/air-gap/prepare-nodes/)
- [步骤 2：同步镜像到私有镜像仓库](/docs/rancher2.5/installation/other-installation-methods/air-gap/populate-private-registry/)
- [步骤 3：部署 Kubernetes 集群（Docker 单节点安装请跳过此步骤）](/docs/rancher2.5/installation/other-installation-methods/air-gap/launch-kubernetes/)
- [步骤 4：安装 Rancher](/docs/rancher2.5/installation/other-installation-methods/air-gap/install-rancher/)

## 升级 Rancher

要在离线环境中使用 Helm CLI 升级 Rancher，请按照[升级指南](/docs/rancher2.5/installation/install-rancher-on-k8s/upgrades/)进行操作。

## 后续操作

[准备节点](/docs/rancher2.5/installation/other-installation-methods/air-gap/prepare-nodes/)
