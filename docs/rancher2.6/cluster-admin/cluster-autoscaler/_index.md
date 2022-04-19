---
title: Cluster Autoscaler
weight: 1
---

在本文中，你将学习如何使用 AWS EC2 Auto Scaling 组在 Rancher 自定义集群上安装和使用 [Kubernetes cluster-autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/)。

Cluster Autoscaler 是一个自动调整 Kubernetes 集群大小的工具。该工具在满足以下条件之一时能自动调整集群大小：

- 集群中有 Pod 因资源不足而无法运行。
- 集群中有一些节点长时间未得到充分利用，而且它们的 Pod 可以放到其他现有节点上。

为防止你的 pod 被驱逐，请在你的 pod 规范中设置 `priorityClassName: system-cluster-critical` 属性。

Cluster Autoscaler 运行在 Kubernetes 主节点上。它可以在 `kube-system` 命名空间中运行。Cluster Autoscaler 不会缩减运行非镜像 `kube-system` pod 的节点。

你可以在 worker 节点上运行 Cluster Autoscaler 的自定义 deployment，但需要小心以保证 Cluster Autoscaler 能正常运行。

## 云提供商

Cluster Autoscaler 为不同的云提供商提供支持。有关详细信息，请参见 [Cluster Autoscaler 支持的云提供商](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#deployment)。

### 在 Amazon 上设置 Cluster Autoscaler

有关在 Amazon 上运行 Cluster Autoscaler 的详细信息，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-autoscaler/amazon)。
