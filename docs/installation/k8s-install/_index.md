---
title: 安装介绍
---

对于生产环境，我们建议以高可用配置安装 Rancher，以便您的用户始终可以访问 Rancher Server。当 Rancher 安装在 Kubernetes 集群中时，Rancher 将与集群的 etcd 或 MySQL 等数据库集成，并利用 Kubernetes 调度来实现高可用。

本节介绍如何使用 RKE 或 K3s 创建和管理集群，然后将 Rancher 安装到该集群上。对于这种类型的架构，您将需要在基础设施提供商中创建节点（通常为虚拟机）。您还需要配置负载均衡器，将前端流量定向到这些节点中。当节点运行起来并满足[节点要求](/docs/installation/requirements/_index)时，可以使用 RKE 或 K3s 将 Kubernetes 部署到这些节点上，然后使用 Helm 软件包管理器将 Rancher 部署到 Kubernetes 上。

## 可选：在单节点 Kubernetes 集群上安装 Rancher

如果您只有一个节点，但您想在将来的生产中使用 Rancher Server，则最好将 Rancher 安装在单节点 Kubernetes 集群上，而不是使用 Docker 安装它。

要创建单节点 RKE 集群，只需在`cluster.yml`中配置一个节点。这个节点应该具有所有三个角色：`etcd`、`controlplane`和`worker`。

要创建单节点 K3s 集群，只需在一个节点上运行安装命令即可，并不需要像高可用集群一样在两个节点上安装。

配置完单节点的 Kubernetes 集群后，就可以像在其他高可用集群上安装一样，使用 Helm 安装 Rancher。

### 通过 RKE 安装

通过为 RKE 配置 Kubernetes 集群时，可以通过在`cluster.yml`中只描述一个节点就可以实现单节点 Kubernetes 的安装。这个节点将具有所有三个角色：`etcd`，`controlplane`和`worker`。

### 通过 K3s 安装

通过 K3s 安装 Kubernetes 集群时，可以将这个节点同时作为 Server 和 Agent 节点

然后，就像在其他任何集群上安装一样，使用 Helm 将 Rancher 安装在集群上。

## 关于架构的重要说明

Rancher Server 只能在使用 RKE 或 K3s 安装的 Kubernetes 集群中运行。不支持在托管的 Kubernetes 集群（例如 EKS）上使用 Rancher。

为了获得最佳性能和安全性，我们建议为 Rancher Server 使用专用的 Kubernetes 集群。不建议在此集群上运行用户的其他工作负载。部署完 Rancher 之后，您可以[创建或导入](/docs/cluster-provisioning/_index)用于运行用户工作负载的集群。

有关 Rancher 是如何工作的（与安装方法无关），请参阅[产品架构](/docs/overview/architecture/_index)。

## 需要的 CLI 工具

此安装需要以下 CLI 工具。请确保这些工具已经安装并在`$PATH`中可用

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl) - Kubernetes 命令行工具.
- [rke](https://rancher.com/docs/rke/latest/en/installation/) - Rancher Kubernetes Engine，用于构建 Kubernetes 集群的 cli。
- [k3s](https://rancher.com/docs/k3s/latest/en/) - Rancher K3s。
- [helm](https://docs.helm.sh/using_helm/#installing-helm) - Kubernetes 的软件包管理工具。请参阅[Helm 版本要求](/docs/installation/options/helm-version/_index)选择 Helm 的版本来安装 Rancher。

## 安装摘要

- [配置基础设施](/docs/installation/k8s-install/create-nodes-lb/_index)
- [安装 Kubernetes 集群](/docs/installation/k8s-install/kubernetes-rke/_index)
- [安装 Rancher](/docs/installation/k8s-install/helm-rancher/_index)

## 其他安装选项

- [从 RKE Add-on 安装的 Rancher 高可用迁移到 Helm 安装](/docs/upgrades/upgrades/migrating-from-rke-add-on/_index)
- [使用 Helm 2 安装 Rancher 高可用](/docs/installation/options/helm2/_index)：本节提供了使用 Helm 2 安装高可用 Rancher 的说明，如果无法升级到 Helm 3，则可以使用该说明。

## 已经弃用的安装方法

[RKE add-on 安装](/docs/installation/options/rke-add-on/_index)

> **重要说明：RKE ADD-ON 安装仅在 RANCHER v2.0.8 之前到版本中支持**
>
> 请使用 Rancher Helm Chart 在 Kubernetes 集群上安装 Rancher 高可用。更多信息请参阅[Rancher 高可用安装](/docs/installation/k8s-install/_index)
>
> 如果您当前正在使用 RKE add-on 安装方式，请参阅[从 RKE Add-on 安装的 Rancher 高可用迁移到 Helm 安装](/docs/upgrades/upgrades/migrating-from-rke-add-on/_index)以获取有关如何使用 Helm Chart 的详细信息。
