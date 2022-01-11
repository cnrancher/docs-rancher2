---
title: 安装/升级 Rancher
description: 了解如何在开发和生产环境中安装 Rancher。了解单节点和高可用安装
weight: 3
---

本节介绍了 Rancher 各种安装方式以及每个安装方式的优点。

# 名词解释

本章节涉及以下名词：

- **Rancher Server**：用于管理和配置 Kubernetes 集群。你可以通过 Rancher Server 的 UI 与下游 Kubernetes 集群进行交互。Rancher Management Server 可以安装到任意 Kubernetes 集群上，包括托管的集群，如 Amazon EKS 集群。
- **RKE（Rancher Kubernetes Engine）**：是经过认证的 Kubernetes 发行版，也是用于创建和管理 Kubernetes 集群的 CLI 工具和库。
- **K3s（轻量级 Kubernetes）**：也是经过认证的 Kubernetes 发行版。它比 RKE 更新，更易用且更轻量，其所有组件都在一个小于 100 MB 的二进制文件中。
- **RKE2**：一个完全合规的 Kubernetes 发行版，专注于安全和合规性。

`restrictedAdmin` Helm Chart 选项在 **Rancher Server** 可用。如果该选项设置为 true，初始的 Rancher 用户访问本地 Kubernetes 集群会受到限制，以避免权限升级。详情请参见 [restricted-admin 角色]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/#restricted-admin)。

# 安装方式概述

Rancher 可以安装在以下主要架构上：

### 使用 Helm CLI 安装的高可用 Kubernetes

我们建议使用 Kubernetes 包管理器 Helm 在专用的 Kubernetes 集群上安装 Rancher。在 RKE 集群中，需要使用三个节点才能实现高可用集群。在 K3s 集群中，只需要两个节点即可。

### 在 Amazon EKS 上部署 Rancher 的快速入门

Rancher 和 Amazon Web Services 合作编写了一份快速入门指南，用于按照 AWS 的最佳实践，在 EKS Kubernetes 集群上部署 Rancher。详情请参见[部署指南](https://aws-quickstart.github.io/quickstart-eks-rancher/)。

### 单节点 Kubernetes 安装

Rancher 可以安装在单节点 Kubernetes 集群上。但是，在单节点安装的情况下，Rancher Server 没有高可用性。而高可用性对在生产环境中运行 Rancher 非常重要。

但是，如果你想要短期内使用单节点节省资源，同时又保留高可用性迁移路径，那么单节点 Kubernetes 安装也是合适的。你也可以之后向集群中添加节点，获得高可用的 Rancher Server。

### Docker 安装

如果你的目的是测试或演示，你可以使用 Docker 把 Rancher 安装到单个节点中。本地 Kubernetes 集群是安装到单个 Docker 容器中的，而 Rancher 是安装到本地集群中的。

Rancher backup operator 可将 Rancher 从单个 Docker 容器迁移到高可用 Kubernetes 集群上。详情请参见[把 Rancher 迁移到新集群]({{<baseurl>}}/rancher/v2.6/en/backups/migrating-rancher)。

### 其他方式

如果你需要在离线环境中或使用 HTTP 代理安装 Rancher，请参见以下独立的说明文档：

| 网络访问方式 | 基于 Kubernetes 安装（推荐）	 | 基于 Docker 安装 |
| ---------------------------------- | ------------------------------ | ---------- |
| 可直接访问互联网 | [文档]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/) | [文档]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker) |
| 使用 HTTP 代理 | [文档]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/behind-proxy/) | [文档]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker)及[配置]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/proxy/) |
| 离线环境 | [文档]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap) | [文档]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap) |

我们建议在 Kubernetes 集群上安装 Rancher，因为在多节点集群中，Rancher Server 可以实现高可用。高可用配置可以提升 Rancher 访问其管理的下游 Kubernetes 集群的稳定性。

因此，我们建议在生产级别的架构中，设置一个高可用的 Kubernetes 集群，然后在这个集群上安装 Rancher。安装 Rancher 后，你可以使用 Rancher 部署和管理 Kubernetes 集群。

如果你的目的是测试或演示，你可以将 Rancher 安装到单个 Docker 容器中。Docker 安装可以让你实现开箱即用，以使用 Rancher 设置 Kubernetes 集群。Docker 安装主要是用于探索 Rancher Server 的功能，只适用于开发和测试。

[在 Kubernetes 上安装 Rancher 的说明]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s)介绍了如何首先使用 K3s 或 RKE 创建和管理 Kubernetes 集群，然后再将 Rancher 安装到该集群上。

如果 Kubernetes 集群中的节点正在运行且满足[节点要求]({{<baseurl>}}/rancher/v2.6/en/installation/requirements)，你可以使用 Helm 将 Rancher 部署到 Kubernetes 上。Helm 使用 Rancher 的 Helm Chart 在 Kubernetes 集群的每个节点上安装 Rancher 的副本。我们建议使用负载均衡器将流量定向到集群中的每个 Rancher 副本上。

如需进一步了解 Rancher 架构，请参见[架构概述]({{<baseurl>}}/rancher/v2.6/en/overview/architecture)，[生产级别架构推荐]({{<baseurl>}}/rancher/v2.6/en/overview/architecture-recommendations)或[最佳实践指南]({{<baseurl>}}/rancher/v2.6/en/best-practices/rancher-server/deployment-types)。

# 前提
安装 Rancher 之前，请确保你的节点满足所有[安装要求]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/)。

# 架构建议

为了达到最佳性能和安全性，我们建议你为 Rancher Management Server 使用单独的专用 Kubernetes 集群。不建议在此集群上运行用户工作负载。部署 Rancher 后，你可以[创建或导入集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/)来运行你的工作负载。

详情请参见[架构推荐]({{<baseurl>}}/rancher/v2.6/en/overview/architecture-recommendations)。

### 在 Kubernetes 上安装 Rancher 的更多选项

参见 [Helm Chart 选项]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)以了解在 Kubernetes 集群上安装 Rancher 的其他配置，包括：

- [开启 API 审计日志]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#api-audit-log)
- [负载均衡器上的 TLS 终止]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#external-tls-termination)
- [自定义 Ingress]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#customizing-your-ingress)

在 Rancher 的安装指南中，我们推荐使用 K3s 或 RKE 来配置 Kubernetes 集群，然后再在这个集群中安装 Rancher。K3s 和 RKE 均提供许多配置选项，用于为你的具体环境自定义 Kubernetes 集群。有关选项和功能的完整列表，请参见：

- [RKE 配置选项]({{<baseurl>}}/rke/latest/en/config-options/)
- [K3s 配置选项]({{<baseurl>}}/k3s/latest/en/installation/install-options/)

### 在 Docker 上安装 Rancher 的更多选项

参见 [Docker 安装选项]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker)，以了解其他配置，包括：

- [开启 API 审计日志]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/advanced/#api-audit-log)
- [外部负载均衡器]({{<baseurl>}}/rancher/v2.6/en/installation/resources/advanced/single-node-install-external-lb/)
- [持久化数据存储]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/advanced/#persistent-data)
