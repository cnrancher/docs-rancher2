---
title: RKE 集群说明
description: 您可以让 Rancher 使用任何节点启动 Kubernetes 集群。Rancher 使用Rancher Kubernetes Engine（RKE）来部署 Kubernetes 集群，这是 Rancher 自己的轻量级 Kubernetes 安装程序。它可以在任何计算机上启动 Kubernetes，包括：裸金属服务器、本地虚拟机、由云服务商托管的虚拟机。
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
  - 创建集群
  - 创建RKE集群
  - RKE集群说明
---

Rancher 可以使用 RKE[Rancher Kubernetes Engine（简称 RKE，Rancher 的轻量级 Kubernetes 安装程序）](/docs/rke/)在任何节点部署 Kubernetes 集群。它可以在裸金属服务器（BMS)、本地虚拟机、云服务商托管的虚拟机等机器上启动 Kubernete。

Rancher 可以在现有节点上安装 Kubernetes，也可以在云服务商中创建节点并在其上安装 Kubernetes。

为了方便理解，我们把通 RKE 部署的 Kubernetes 集群称为“RKE 集群”，RKE 集群包括 Rancher 在 Windows 节点或其他现有自定义节点上启动的集群，以及 Rancher 在 Azure、Digital Ocean、EC2、阿里云 或 vSphere 等上使用新节点启动的集群。

## 节点配置要求

如果您使用 RKE 启动集群，您的节点必须满足下游集群中节点的[要求](/docs/rancher2.5/cluster-provisioning/node-requirements/)。

## 在云服务商的新节点上启动 Kubernetes

使用 Rancher，您可以基于[节点模板](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/)创建节点池。此节点模板定义的参数将用于在云提供商中启动节点。

在云提供商托管的节点池上安装 Kubernetes 的一个好处是，如果节点与集群失去连接，Rancher 可以自动创建另一个节点并加入集群，以确保节点池的个数符合预期。

有关更多信息，请参阅[在新节点上启动 Kubernetes](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/)。

## 在现有的自定义节点上启动 Kubernetes

在这种情况下，您希望在裸金属服务器、内部部署虚拟机或云提供商中已存在的虚拟机上安装 Kubernetes。使用此选项，您将在计算机上运行 Rancher Agent Docker 容器。

如果要重复使用以前的自定义集群中的节点，请在再次使用之前[清理节点](/docs/rancher2.5/cluster-admin/cleaning-cluster-nodes/)。如果重复使用尚未清理的节点，则启动集群可能会失败。

有关更多信息，请参阅[自定义节点](/docs/rancher2.5/cluster-provisioning/rke-clusters/custom-nodes/)。
