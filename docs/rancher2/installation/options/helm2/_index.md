---
title: 安装指南（Helm2）
description: 对于生产环境，我们建议以高可用配置的方式来安装 Rancher，以便用户可以一直访问 Rancher 服务。在 Kubernetes 集群中安装 Rancher 时，Rancher 会与集群的 etcd 数据库集成，并利用 Kubernetes 调度来实现高可用。以下步骤将指导您使用 Rancher Kubernetes Engine(RKE)来部署三个节点的集群，并使用 Helm 安装 Rancher。
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
  - 资料、参考和高级选项
  - Rancher高可用Helm2安装
  - 安装指南（Helm2）
---

> Helm 3 已经发布，Rancher 提供了使用 Helm 3 安装 Rancher 的操作指导。
> Helm 3 的易用性和安全性都比 Helm 2 更高，如果您使用的是 Helm 2，我们建议您首先将 Helm 2[迁移到 Helm 3](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)，然后使用 Helm3 安装 Rancher。
> 本文提供了较早版本的使用 Helm 2 安装 Rancher 高可用的安装方法，如果无法升级到 Helm 3，可以使用此方法。

我们建议使用高可用配置的方式在生产环境安装 Rancher，用户可以一直访问 Rancher 服务。在 Kubernetes 集群中安装 Rancher 时，Rancher 会与集群的 etcd 数据库集成，并利用 Kubernetes 调度来实现高可用。

以下步骤将指导您使用 Rancher Kubernetes Engine（RKE）来部署三个节点的集群，并使用 Helm 安装 Rancher。

**说明：**

- Rancher 的管理服务只能在 RKE 管理的 Kubernetes 集群上运行。不支持将 Rancher 运行在托管的 Kubernetes 服务或者其他供应商的托管服务。
- 为了达到最佳的性能，我们建议使用专用 Kubernetes 集群来运行 Rancher Server 服务，不建议在此集群上运行用户的工作负载。部署 Rancher 之后，您可以通过[创建或导入集群](/docs/cluster-provisioning/_index/#cluster-creation-in-rancher)来运行您的工作负载。

## 推荐架构

- Rancher 的 DNS 应为 4 层负载均衡器（TCP）。
- 负载均衡器应允许 Kubernetes 集群中全部三个节点的 TCP/80 和 TCP/443 端口访问。
- Ingress controller 会将 HTTP 重定向到 HTTPS，并在端口 TCP/443 终止 SSL/TLS。
- Ingress controller 会将流量转发到 Rancher Pod 的 TCP/80 端口。

<figcaption>访问结合四层负载均衡（TCP）的高可用 Rancher 时，SSL 在 ingress controller 处终止。</figcaption>

![基于Kubernetes的高可用安装](/img/rancher/ha/rancher2ha.svg)

## 依赖工具

在安装 Rancher 的过程中，您需要用到以下 CLI 工具，请确保在安装 Rancher 前，已经将这些工具安装到您的环境中，并且配置到环境变量 `$PATH` 中。

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl) - Kubernetes 命令行工具。
- [rke](https://rancher.com/docs/rke/latest/en/installation/) - Rancher Kubernetes Engine, 构建 Kubernetes 集群的 cli 工具。
- [helm](https://docs.helm.sh/using_helm/#installing-helm) - Kubernetes 包管理工具。可参考[Helm 版本要求](/docs/installation/options/helm-version/_index)来选择合适的 Helm 版本安装 Rancher。

## 安装大纲

- [创建节点和负载均衡](/docs/installation/options/helm2/create-nodes-lb/_index)
- [使用 rke 安装 Kubernetes](/docs/installation/options/helm2/kubernetes-rke/_index)
- [初始化 Helm (tiller)](/docs/installation/options/helm2/helm-init/_index)
- [安装 Rancher](/docs/installation/options/helm2/helm-rancher/_index)

## 其他安装选项

- [从 RKE Add-on 安装迁移到 Helm 安装](/docs/upgrades/upgrades/migrating-from-rke-add-on/_index)

## 较早的安装方法

[RKE add-on 安装](/docs/installation/options/rke-add-on/_index/)

> **重要: RKE add-on 安装方式仅支持到 Rancher v2.0.8**
>
> 请在 Kubernetes 集群中使用 Rancher Helm Chart 来安装 Rancher。更多内容，请参考[Rancher 高可用安装](/docs/installation/options/helm2/_index)。
>
> 如果您当前正在使用 RKE add-on 安装方法，请参考[从 RKE Add-on 安装迁移到 Helm 安装](/docs/upgrades/upgrades/migrating-from-rke-add-on/_index)。
