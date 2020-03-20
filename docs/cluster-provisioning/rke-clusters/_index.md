---
title: Rancher 部署的 Kubernetes 集群
---

您可以让 Rancher 在您想要的任何节点上启动 Kubernetes 集群。在 Rancher 将 Kubernetes 部署到这些节点上时，它底层使用的是[Rancher Kubernetes Engine](http://docs.rancher.com/docs/rke/latest/en/) (RKE)。这是 Rancher 自己的轻量级 Kubernetes 安装程序。它可以在任何计算机上启动 Kubernetes，包括：

- 裸金属服务器
- 本地虚拟机
- 由设备提供商托管的虚拟机

Rancher 可以在现有节点上安装 Kubernetes，也可以在云提供商中动态创建节点，并在这些节点上安装 Kubernetes。

RKE 集群包括 Rancher 在现有 Windows 节点或 Linux 节点上部署的集群，以及 Rancher 在 Azure，Digital Ocean，EC2，阿里云 或 vSphere 等云上先创建新的节，再在这些节点上部署的集群。

## 要求

如果您使用 RKE 来设置集群，那么您的节点必须满足业务集群中的节点[需求](/docs/cluster-provisioning/node-requirements/_index)。

## 在云提供商的新节点上启动 Kubernetes

使用 Rancher，您可以基于[主机模版](/docs/cluster-provisioning/rke-clusters/node-pools/_index)创建节点池。这个主机模版定义了您希望用来启动云提供商中的节点的参数。

在设备提供商托管的节点池上安装 Kubernetes 的一个好处是，如果一个节点与集群失去连接，Rancher 可以自动创建另一个节点并加入集群，以确保节点池的节点数量与预期保持一致。

有关更多信息，请参阅[在新节点上启动 Kubernetes](/docs/cluster-provisioning/rke-clusters/node-pools/_index)一节。

## 在现有的自定义节点上启动 Kubernetes

在这个场景中，您希望在裸金属服务器、本地虚拟机或已经存在于云提供商中的虚拟机上安装 Kubernetes。使用此选项，您将在节点上运行一个 Rancher Agent 容器。

:::important 重要
如果要重用以前自定义集群中的节点，请在再次使用该节点之前[清理该节点](/docs/cluster-admin/cleaning-cluster-nodes/_index#docker-容器、镜像和卷)。如果重用尚未清理的节点，集群配置可能会失败。
:::

有关更多信息，请参考[自定义节点](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)一节.
