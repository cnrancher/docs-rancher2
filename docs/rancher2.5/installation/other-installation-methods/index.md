---
title: 其他安装方式说明
description: 单节点 Docker 安装适用于想要测试 Rancher 的用户。无需使用 Helm 在 Kubernetes 集群上运行 Rancher，而是使用 docker run 命令在单个节点上安装 Rancher Server 组件。私有安装可能是离线安装，也可能是在防火墙或者代理之后安装。
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
  - 其他安装方式说明
---

## 离线安装

按照以下[步骤](/docs/rancher2.5/installation/other-installation-methods/air-gap/)在离线环境中安装 Rancher Server。

离线环境可以是 Rancher Server 离线安装、防火墙后面或代理后面。

## 通过 Docker 安装

[单节点 Docker 安装](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/)适用于想要测试 Rancher 的用户。无需使用 Helm 在 Kubernetes 集群上运行 Rancher，而是使用 docker run 命令在单个节点上安装 Rancher Server 组件。

Docker 安装仅用于开发和测试环境。

由于只有一个节点和一个 Docker 容器，因此，如果该节点发生故障，并且其他节点上没有可用的 Rancher 数据副本，您将丢失 Rancher Server 的所有数据。

将 Rancher 迁移到高可用性集群的能力取决于 Rancher 版本。

- 对于 Rancher v2.5+，可以使用 Rancher 备份操作员将 Rancher 从单个 Docker 容器安装迁移到高可用性 Kubernetes 集群上的安装。有关详细信息，请参考[将 Rancher 迁移到新的集群。](/docs/rancher2.5/backups/migrating-rancher/)的文档。
