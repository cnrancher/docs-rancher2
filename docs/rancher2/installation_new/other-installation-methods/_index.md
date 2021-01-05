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

The ability to migrate Rancher to a high-availability cluster depends on the Rancher version:

- For Rancher v2.0-v2.4, there was no migration path from a Docker installation to a high-availability installation. Therefore, if you are using Rancher prior to v2.5, you may want to use a Kubernetes installation from the start.

- For Rancher v2.5+, the Rancher backup operator can be used to migrate Rancher from the single Docker container install to an installation on a high-availability Kubernetes cluster. For details, refer to the documentation on [migrating Rancher to a new cluster.]({{<baseurl>}}/rancher/v2.x/en/backups/v2.5/migrating-rancher/)

## 私有环境安装

请按照[这些步骤](/docs/rancher2/installation/other-installation-methods/air-gap/_index)在私有环境中安装 Rancher Server。

私有安装可能是离线安装，也可能是在防火墙或者代理之后安装。
