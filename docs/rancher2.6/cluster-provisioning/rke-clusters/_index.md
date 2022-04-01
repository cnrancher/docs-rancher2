---
title: 使用 Rancher 启动 Kubernetes
weight: 4
---

Rancher 可以使用任意节点启动 Kubernetes 集群。Rancher 使用 [Rancher Kubernetes Engine]({{<baseurl>}}/rke/latest/en/)（简称 RKE，Rancher 的轻量级 Kubernetes 安装程序）将 Kubernetes 部署到这些节点上。RKE 可以在任何计算机上启动 Kubernetes，包括：

- 裸金属服务器
- 本地虚拟机
- 由云厂商托管的虚拟机

Rancher 可以在现有节点上安装 Kubernetes，也可以在云厂商中动态配置节点并安装 Kubernetes。

RKE 集群包括 Rancher 在 Windows 节点或其他现有自定义节点上启动的集群，以及 Rancher 在 Azure、Digital Ocean、EC2、或 vSphere 等上使用新节点启动的集群。

### Rancher 2.6 变更

_技术预览_

Rancher 2.6 支持直接使用 Rancher UI 配置 [RKE2](https://docs.rke2.io/) 集群。RKE2，也称为 RKE Government，是一个完全符合标准的 Kubernetes 发行版，它专注于安全性和合规性。

RKE2 基于使用上游[集群 API](https://github.com/kubernetes-sigs/cluster-api) 项目的新配置框架。这个新配置框架支持：

- 在 Digital Ocean、AWS EC2、Azure 和 vSphere 上配置 RKE2 集群
- 完全在 Rancher 中配置 RKE2 集群
- 除了 Canal 之外，还可以选择 CNI 选项， Calico、Cilium 和 Multus
- 在预配置的虚拟机或裸机节点上安装自定义 RKE2 集群

RKE2 配置技术预览还包括在 Windows 集群上安装 RKE2。RKE2 的 Windows 功能包括：

- 由 containerd 提供支持的使用 RKE2 的 Windows 容器
- 直接从 Rancher UI 配置 Windows RKE2 自定义集群
- 用于 Windows RKE2 自定义集群的 Calico CNI
- 技术预览包含了 Windows Server 的 SAC 版本（2004 和 20H2）

要使 Windows 支持 RKE2 自定义集群，请选择 Calico 作为 CNI。

### 要求

如果你使用 RKE 建立集群，节点必须满足下游集群的[节点要求]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/node-requirements)。

### 在云厂商的新节点上启动 Kubernetes

使用 Rancher，你可以基于[节点模板]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-templates)创建节点池。此节点模板定义了要用于在云厂商中启动节点的参数。

在托管在云厂商的节点池上安装 Kubernetes 的一个好处是，如果一个节点与集群断开连接，Rancher 可以自动创建另一个节点并将其加入集群，从而确保节点池的数量符合要求。

有关详细信息，请参阅[在新节点上启动 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/)。

### 在现有自定义节点上启动 Kubernetes

在这种情况下，你希望将 Kubernetes 安装到裸机服务器、本地虚拟机或云厂商中已存在的虚拟机上。使用此选项，你将在机器上运行 Rancher Agent Docker 容器。

如果要重复使用之前的自定义集群中的节点，请在复用之前[清理节点]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cleaning-cluster-nodes/)。如果你重复使用尚未清理的节点，则集群配置可能会失败。

有关详细信息，请参阅[自定义节点]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes/)。

## 以编程方式创建 RKE 集群

通过 Rancher 以编程方式部署 RKE 集群的最常见方法是使用 Rancher 2 Terraform Provider。详情请参见[使用 Terraform 创建集群](https://registry.terraform.io/providers/rancher/rancher2/latest/docs/resources/cluster)。
