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

## 通过 Docker 安装

[单节点 Docker 安装](/docs/rancher2/installation/other-installation-methods/single-node-docker/_index)适用于想要测试 Rancher 的用户。无需使用 Helm 在 Kubernetes 集群上运行 Rancher，而是使用 docker run 命令在单个节点上安装 Rancher Server 组件。

由于只有一个节点和一个 Docker 容器，因此，如果该节点发生故障，并且其他节点上没有可用的 Rancher 数据副本，您将丢失 Rancher Server 的所有数据。

## 私有环境安装

请按照[这些步骤](/docs/rancher2/installation/other-installation-methods/air-gap/_index)在私有环境中安装 Rancher Server。

私有安装可能是离线安装，也可能是在防火墙或者代理之后安装。
