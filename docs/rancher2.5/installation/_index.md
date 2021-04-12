---
title: 安装介绍
---

本节整体概述了 Rancher 各种安装方式，并介绍了每个选项的优点。

## 名词解释

在这个部分的主要涉及的名词如下：

- **Rancher Server：** 是用于管理和配置 Kubernetes 集群。您可以通过 Rancher Server 的 UI 与下游 Kubernetes 集群进行交互。
- **RKE（Rancher Kubernetes Engine)：**是经过认证的 Kubernetes 发行版，它拥有对应的 CLI 工具可用于创建和管理 Kubernetes 集群。在 Rancher UI 中创建集群时，它将调用 RKE 来配置 Rancher 启动的 Kubernetes 集群。
- **K3s (轻量级 Kubernetes)：** 和 RKE 类似，也是经过认证的 Kubernetes 发行版。它比 RKE 更新，更易用且更轻量化，全部组件都在一个小于 100 MB 的二进制文件中。从 Rancher v2.4 开始，Rancher 可以安装在 K3s 集群上。
- **RKE2**是一个完全合规的 Kubernetes 发行版，专注于美国联邦政府部门的安全和合规性。
- **RancherD**是安装 Rancher 的新工具，从 Rancher v2.5.4 开始提供。它是一个实验性功能。RancherD 是一个二进制文件，它首先启动一个 RKE2 Kubernetes 集群，然后在集群上安装 Rancher 服务器 Helm 图。

## Rancher v2.5 的变化

在 Rancher v2.5 中，Rancher 管理服务器可以安装在任何 Kubernetes 集群上，包括托管集群，如 Amazon EKS 集群。

对于 Docker 安装，本地 Kubernetes 集群安装在单个 Docker 容器中，Rancher 安装在本地集群上。

增加了`restrictedAdmin`Helm Chart 选项。当此选项设置为`true`时，初始 Rancher 用户对本地 Kubernetes 集群的访问受到限制，以防止权限升级。更多信息，请参见[restricted-admin 角色](/docs/rancher2.5/admin-settings/rbac/global-permissions/_index)一节。

## 安装选项概述

Rancher 的部署有以下四种架构：使用 Helm CLI 进行高可用 Kubernetes 安装、使用 RancherD 进行高可用 Kubernetes 安装、使用 Kubernetes 进行单节点安装或使用 Amazon EKS 进行安装。

### 使用 Helm CLI 进行高可用 Kubernetes 安装

我们建议使用 Kubernetes 程序包管理器 [Helm](/docs/rancher2.5/overview/concepts/_index) 在专用的 Kubernetes 集群上安装 Rancher。在 RKE 集群中，需要使用三个节点以实现高可用性。在 K3s 集群中，仅需要两个节点即可。

### 使用 RancherD 进行高可用 Kubernetes 安装

_从 v2.5.4 开始提供_

RancherD 是一个的二进制文件，它首先启动一个 RKE2 Kubernetes 集群，然后在集群上安装 Rancher 服务器的 Helm Chart。这是一个实验性的功能。在 RancherD 安装和 Helm CLI 安装中，Rancher 都是作为 Helm 图安装在 Kubernetes 集群上。使用 RancherD 也简化了配置和升级。当您升级 RancherD 二进制时，Kubernetes 集群和 Rancher Helm Chart 都会升级。

### 使用 Amazon EKS 进行安装

Rancher 和 Amazon 合作制定了一份快速入门指南，用于在 EKS Kubernetes 集群上按照 AWS 最佳实践部署 Rancher。详情请参考[Rancher on the AWS Cloud](https://aws-quickstart.github.io/quickstart-eks-rancher/)。

### 使用 Kubernetes 进行单节点安装

另一个选择是在 Kubernetes 集群上使用 Helm 安装 Rancher，仅在集群中使用单个节点。虽然在这种情况下的 Rancher Server 不具有高可用性，但是这种架构既节省了资源，又保留了可扩展性。如果您想在短期内通过使用单个节点来节省资源，同时又保留高可用性迁移路径，最合适的架构就是单节点 Kubernetes 安装。

关于在私有环境中或 HTTP 代理后面安装 Rancher，我们有单独的说明文档：

| 网络访问水平        | 基于 Kubernetes 安装（推荐）                                                                                                                              | 基于 Docker 安装                                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 可直接访问 Internet | [文档](/docs/rancher2.5/installation/install-rancher-on-k8s/_index)                                                                                       | [文档](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/_index)                                                                                                                   |
| 依托 HTTP 代理      | 基于[此文档](/docs/rancher2.5/installation/install-rancher-on-k8s/_index)，并附加[相关配置](/docs/rancher2.5/installation/resources/chart-options/_index) | 基于[此文档](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/_index)，并附加[相关配置](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/proxy/_index) |
| 私有网络环境        | [文档](/docs/rancher2.5/installation/other-installation-methods/air-gap/_index)                                                                           | [文档](/docs/rancher2.5/installation/other-installation-methods/air-gap/_index)                                                                                                                              |

我们建议在 Kubernetes 集群上安装 Rancher，因为在多节点集群中，Rancher Server 可以实现高可用。这种高可用配置可以提升访问下游集群的稳定性。

因此，我们建议对于生产级别的架构，您应该使用 RKE 或 K3s 创建高可用的 Kubernetes 集群，然后在这个集群上安装 Rancher。安装 Rancher 后，您可以使用 Rancher 部署和管理 Kubernetes 集群。

为了测试或演示目的，您可以在单个节点上通过 Docker 安装 Rancher，这个过程非常简洁，基本上可以实现开箱即用。

我们的[在 Kubernetes 上安装 Rancher 的说明](/docs/rancher2.5/installation/install-rancher-on-k8s/_index)描述了如何使用 K3s 或 RKE 创建和管理 Kubernetes 集群，然后在这个集群上安装 Rancher。

当 Kubernetes 集群中的节点正在运行并满足[节点要求](/docs/rancher2.5/installation/requirements/_index)时，您可以使用 Helm 将 Rancher 部署到 Kubernetes 上。Helm 使用 Rancher 的 Helm Chart 在 Kubernetes 集群的每个节点上安装 Rancher 的副本。我们建议使用负载均衡器将流量定向到集群中每个 Rancher 副本。

有关 Rancher 部署架构的详细讨论，请参考[产品架构](/docs/rancher2.5/overview/architecture/_index)、[推荐架构](/docs/rancher2.5/overview/architecture-recommendations/_index)或[最佳实践指南](/docs/rancher2.5/best-practices/rancher-server/deployment-types/_index)。

## 先决条件

在安装 Rancher 之前，请确保您的节点满足所有[安装要求](/docs/rancher2.5/installation/requirements/_index)。

## 架构技巧

为了获得最佳性能和更高的安全性，我们建议为 Rancher 管理服务器使用单独的专用 Kubernetes 集群，不在此集群上运行用户工作负载。部署 Rancher 后，您可以[创建或导入集群](/docs/rancher2.5/cluster-provisioning/_index)运行您的工作负载。

有关更多架构建议，请参考[本页](/docs/rancher2.5/overview/architecture-recommendations/_index)。

## 在 Kubernetes 上安装 Rancher 的更多选项

关于在 Kubernetes 上安装 Rancher 的详细配置，请参考[Helm Chart 选项](/docs/rancher2.5/installation/resources/chart-options/_index)：

- [开启 API 审计日志](/docs/rancher2.5/installation/resources/chart-options/_index)
- [在负载均衡器上做 TLS termination](/docs/rancher2.5/installation/resources/chart-options/_index)
- [自定义 Ingress](/docs/rancher2.5/installation/resources/chart-options/_index)

在 Rancher 安装指南中，推荐使用 K3s 或 RKE 配置 Kubernetes 集群，并在这个集群中部署 Rancher。K3s 和 RKE 都有许多配置选项可用于自定义 Kubernetes 以适合您的特定环境。有关选项和功能的完整列表，请参见文档：

- [RKE 配置选项](/docs/rke/config-options/_index)
- [K3s 配置选项](/docs/k3s/installation/install-options/_index)

## 在 Docker 上安装 Rancher 的更多选项

有关其详细配置，请参考 [Docker 单节点安装](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/_index)：

- [开启 API 审计](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/_index)
- [外部负载均衡](/docs/rancher2.5/installation/resources/advanced/single-node-install-external-lb/_index)
- [持久化存储](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/_index)
