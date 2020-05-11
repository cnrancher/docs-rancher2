---
title: 卸载 Rancher
description: 本节旨在回答关于当您不再需要 Rancher，不想集群被 Rancher 管理或 Rancher Server 被删除时该怎么做的问题。
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
  - 常见问题
  - 卸载 Rancher
---

本节旨在回答关于当您不再需要 Rancher，不想集群被 Rancher 管理或 Rancher Server 被删除时该怎么做的问题。

## 如果删除了 Rancher Server，Rancher 下管集群的工作负载会如何？

如果 Rancher 集群被删除了且不可恢复，所有 Rancher 的下管集群的工作负载会继续正常工作。

## 如果删除了 Rancher Server，我该如何访问下管集群？

在没有 Rancher 的情况下访问下管集群的能力取决于集群的类型和创建集群的方法：

- **导入集群：** 集群不会受到影响，您仍然可以使用导入到 Rancher 之前访问集群的方法。

- **托管的 Kubernetes 集群：** 如果您是在公有云提供商（例如 EKS，GKE 或者 AKS）中创建的集群，您可以继续使用公有云厂商提供的凭证访问集群。

- **RKE 集群：** 要访问[RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)，集群必须开启[授权集群端点](/docs/overview/architecture/_index) ，而且您必须从 Rancher UI 上下载集群的 kubeconfig 文件（RKE 集群的授权集群端点是默认开启的）。您可以通过授权集群端口用 kubectl 访问 Kubernets 集群，而不必通过 Rancher 的[认证代理](/docs/overview/architecture/_index) 。更多关于如何配置 kubectl 使用授权集群端点的指导，请参阅[通过 Kubectl 和 kubeconfig 访问集群](/docs/cluster-admin/cluster-access/kubectl/_index)章节中配置 kubectl 直接访问集群的部分。当 Rancher 被删除时这些集群会创建一个授权快照。

## 不再需要 Rancher 时该怎么做？

如果您是[Rancher 高可用安装](/docs/installation/k8s-install/_index)，可通过[系统工具](/docs/system-tools/_index) 的 `remove` 子命令移除 Rancher。

如果您通过 Docker 单节点安装的 Rancher，可以通过移除 Docker 容器的方式移除 Rancher。

导入集群不会因为 Rancher 被移除而受到影响。关于其他类型的集群，请参阅[如果删除了 Rancher Server，我该如何访问的的下管集群？](##如果删除了-rancher-server，我该如何访问下管集群？)部分。

## 不需要被 Rancher 管理导入的集群该怎么做？

如果导入集群从 Rancher UI 删除了，这个集群就不受 Rancher 管理了。集群本身不会受到影响，并可以使用导入到 Rancher 之前的方法访问集群。

删除导入集群的步骤如下：

1. 在**全局**视图，进入**集群**菜单。
2. 选择需要删除的导入集群，点击**更多 (...) > 删除**。
3. 点击**删除**。

**结果：** 导入集群从 Rancher 中删除，在 Rancher 之外集群正常运行。

## 不需要被 Rancher 管理 RKE 集群或托管 Kubernetes 集群该怎么做？

目前并没有提供从 Rancher 移除关联这些集群的功能。移除关联意味着从集群中移除 Rancher 组件并保持集群的独立管理。

关于独立管理 RKE 集群和托管集群的能力的开发进展，请在 Github 上跟踪[这个问题](https://github.com/rancher/rancher/issues/25234)。

关于删除 Rancher 时如何访问集群的更多信息，请参阅[这部分](#如果删除了-rancher-server，我该如何访问的的下管集群？)。
