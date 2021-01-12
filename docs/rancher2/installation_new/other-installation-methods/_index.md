---
title: 其他安装方式说明
description: 单节点 Docker 安装适用于想要测试 Rancher 的用户。无需使用 Helm 在 Kubernetes 集群上运行 Rancher，而是使用 docker run 命令在单个节点上安装 Rancher Server 组件。私有安装可能是离线安装，也可能是在防火墙或者代理之后安装。
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
  - 其他安装方式说明
---

## 通过 Docker 安装

[单节点 Docker 安装](/docs/rancher2/installation/other-installation-methods/single-node-docker/_index)适用于想要测试 Rancher 的用户。无需使用 Helm 在 Kubernetes 集群上运行 Rancher，而是使用 docker run 命令在单个节点上安装 Rancher Server 组件。

由于只有一个节点和一个 Docker 容器，因此，如果该节点发生故障，并且其他节点上没有可用的 Rancher 数据副本，您将丢失 Rancher Server 的所有数据。

将 Rancher 迁移到高可用性集群的能力取决于 Rancher 版本。

- 对于 Rancher v2.0-v2.4，没有从 Docker 安装到高可用性安装的迁移路径。因此，如果您使用的是 v2.5 之前的 Rancher，您可能希望从一开始就使用 Kubernetes 安装。

- 对于 Rancher v2.5+，可以使用 Rancher 备份操作员将 Rancher 从单个 Docker 容器安装迁移到高可用性 Kubernetes 集群上的安装。有关详细信息，请参考[将 Rancher 迁移到新的集群。](/docs/rancher2/backups/2.5/migrating-rancher/_index)的文档。

## 私有环境安装

请按照[这些步骤](/docs/rancher2/installation/other-installation-methods/air-gap/_index)在私有环境中安装 Rancher Server。

私有安装可能是离线安装，也可能是在防火墙或者代理之后安装。
