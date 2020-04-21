---
title: RKE 集群说明
description: 您可以让 Rancher 使用任何节点启动 Kubernetes 集群。Rancher 使用Rancher Kubernetes Engine（RKE）来部署 Kubernetes 集群，这是 Rancher 自己的轻量级 Kubernetes 安装程序。它可以在任何计算机上启动 Kubernetes，包括：裸金属服务器、本地虚拟机、由云服务商托管的虚拟机。
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
  - 创建集群
  - 创建RKE集群
  - RKE集群说明
---

您可以让 Rancher 使用任何节点启动 Kubernetes 集群。Rancher 使用 [Rancher Kubernetes Engine](http://docs.rancher.com/docs/rke/latest/en/)（RKE）来部署 Kubernetes 集群，这是 Rancher 自己的轻量级 Kubernetes 安装程序。它可以在任何计算机上启动 Kubernetes，包括：

- 裸金属服务器
- 本地虚拟机
- 由云服务商托管的虚拟机

Rancher 可以在现有节点上安装 Kubernetes，也可以在云服务商中动态创建节点并在其上安装 Kubernetes。

RKE 集群包括 Rancher 在 Windows 节点或其他现有自定义节点上启动的集群，以及 Rancher 在 Azure、Digital Ocean、EC2、阿里云 或 vSphere 等上使用新节点启动的集群。

## 要求

如果您使用 RKE 启动集群，您的节点必须满足下游集群中节点的[要求](/docs/cluster-provisioning/node-requirements/_index)。

## 在云服务商的新节点上启动 Kubernetes

使用 Rancher，您可以基于[节点模板](/docs/cluster-provisioning/rke-clusters/node-pools/_index)创建节点池。此节点模板定义的参数将用于在云提供商中启动节点。

在云提供商托管的节点池上安装 Kubernetes 的一个好处是，如果节点与集群失去连接，Rancher 可以自动创建另一个节点并加入集群，以确保节点池的个数符合预期。

有关更多信息，请参阅[在新节点上启动 Kubernetes](/docs/cluster-provisioning/rke-clusters/node-pools/_index)。

## 在现有的自定义节点上启动 Kubernetes

在这种情况下，您希望在裸金属服务器、内部部署虚拟机或云提供商中已存在的虚拟机上安装 Kubernetes。使用此选项，您将在计算机上运行 Rancher Agent Docker 容器。

如果要重复使用以前的自定义集群中的节点，请在再次使用之前[清理节点](/docs/faq/removing-rancher/_index)。如果重复使用尚未清理的节点，则启动集群可能会失败。

有关更多信息，请参阅[自定义节点](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)。
