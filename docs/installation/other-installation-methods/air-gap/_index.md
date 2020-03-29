---
title: 离线安装说明
---

本节介绍在离线环境中安装 Rancher Server，我们将采取离线安装方式，同时要考虑防火墙和代理设置的因素。

以下为您准备了基于 Kubernetes 的高可用安装方式和基于 Docker 的单节点安装方式。

## 离线高可用安装

这些说明介绍了如何在离线环境中的 Kubernetes 集群上安装 Rancher。
Kubernetes 组件本身和 Rancher Server 都通过三个节点组成，持久层（etcd）也可以在这三个节点上复制，以便节点之一发生故障时提供冗余和数据复制。

## 离线单节点安装

这些说明介绍了如何在离线环境中的单个节点上安装 Rancher。

Docker 安装适用于想要测试 Rancher 的用户。您可以使用 docker run 命令在单个节点上安装 Rancher Server 组件，而不是在 Kubernetes 集群上运行。由于只有一个节点和一个 Docker 容器，因此，如果该节点发生故障，并且其他节点上没有可用的 Rancher 数据副本时，您将丢失 Rancher 服务器的所有数据。

> **重要：** 如果您按照 Docker 安装指南安装 Rancher，以后将无法迁移到高可用安装。因为没有升级路径可以将 Docker 安装过渡到 Kubernetes 安装。

如果为了节省资源，你也可以不使用 Docker 单节点安装指南。您可以选择使用 Rancher 高可用安装指南，但是也仅使用一个节点来安装 Kubernetes 和 Rancher。之后，您可以扩展 Kubernetes 集群中的 etcd 节点，使其成为真正的高可用安装。

## 安装概要

- [1、准备节点](/docs/installation/other-installation-methods/air-gap/prepare-nodes/_index)
- [2、同步镜像到私有镜像库](/docs/installation/other-installation-methods/air-gap/populate-private-registry/_index)
- [3、使用 RKE 部署 Kubernetes 集群](/docs/installation/other-installation-methods/air-gap/launch-kubernetes/_index)
- [4、安装 Rancher](/docs/installation/other-installation-methods/air-gap/install-rancher/_index)

## [下一步: 准备节点](/docs/installation/other-installation-methods/air-gap/prepare-nodes/_index)
