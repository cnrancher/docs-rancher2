---
title: 持久存储的工作原理
weight: 1
---

持久卷 (PV) 是 Kubernetes 集群中的一块存储，而持久卷声明 (PVC) 是对存储的请求。

在 Kubernetes 中使用持久存储有两种方法：

- 使用现有的持久卷
- 动态配置新的持久卷

要使用现有 PV，你的应用需要使用已绑定到 PV 的 PVC，并且 PV 应包含 PVC 所需的最少资源。

对于动态存储配置，你的应用需要使用绑定到存储类的 PVC。存储类包含配置新持久卷的授权。

![设置新的和现有的持久存储]({{<baseurl>}}/img/rancher/rancher-storage.svg)

有关更多信息，请参阅[关于存储的官方 Kubernetes 文档](https://kubernetes.io/docs/concepts/storage/volumes/)。

本节涵盖以下主题：

- [关于持久性卷声明](#about-persistent-volume-claims)
  - [新的和现有的持久存储都需要 PVC](#pvcs-are-required-for-both-new-and-existing-persistent-storage)
- [使用 PVC 和 PV 设置现有存储](#setting-up-existing-storage-with-a-pvc-and-pv)
- [将 PV 绑定到 PVC](#binding-pvs-to-pvcs)
- [使用 PVC 和存储类配置新存储](#provisioning-new-storage-with-a-pvc-and-storage-class)

# 关于持久卷声明

持久卷声明 (PVC) 是从集群请求存储资源的对象，类似于你的 deployment 用于兑换存储访问的凭证。PVC 以卷的形式挂载到工作负载中，以便工作负载可以声明其指定的持久存储份额。

要访问持久存储，Pod 必须有挂载为卷的 PVC。此 PVC 让你的 deployment 应用将其数据存储在外部位置，这样，如果 pod 发生故障，就可以用新的 pod 替换它并继续访问其外部存储的数据。

每个 Rancher 项目都包含你创建的 PVC 列表，可从**资源 > 工作负载 > 卷**中查看。你可以在将来创建 deployment 时复用这些 PVC。

### 新的和现有的持久存储都需要 PVC

无论工作负载打算使用现有存储，还是需要根据需求动态配置新存储，pod 都需要 PVC 才能使用持久存储。

如果你为工作负载设置现有存储，则工作负载会挂载引用一个 PV 的 PVC，该 PV 对应现有的存储基础设施。

如果工作负载需要请求新的存储，则工作负载会挂载引用一个存储类的 PVC，该存储类能创建新 PV 及其底层存储基础设施。

Rancher 允许你在项目中创建任意数量的 PVC。

你可以在创建 deployment 时将 PVC 挂载到 deployment 中，也可以在创建 deployment 后在 deployment 运行的时候将 PVC 挂载到 deployment 中。

# 使用 PVC 和 PV 设置现有存储

你的 pod 可以将数据存储在[卷](https://kubernetes.io/docs/concepts/storage/volumes/)中，但如果 pod 发生故障，该数据就会丢失。为了解决这个问题，Kubernetes 提供了持久卷 (PV)。PV 是 Kubernetes 资源，这些资源对应于你的 pod 可以访问的外部存储磁盘或文件系统。如果一个 pod 崩溃，它的替代 pod 可以访问持久存储中的数据，而不会丢失任何数据。

PV 可以是你本地或托管的云上（Amazon EBS 或 Azure Disk）物理磁盘或文件系统。

在 Rancher 中创建持久卷不会创建存储卷。它只创建映射到现有卷的 Kubernetes 资源。因此，在你可以将持久卷创建为 Kubernetes 资源之前，你必须先配置存储。

> **重要提示**：PV 是在集群级别创建的，这意味着在多租户集群中，有权访问不同命名空间的团队可以访问同一个 PV。

### 将 PV 绑定到 PVC

当 pod 设置为使用持久存储时，pod 会挂载持久卷声明 (PVC)，PVC 的挂载方式与其他 Kubernetes 卷相同。在创建每个 PVC 时，Kubernetes master 将 PVC 视为对存储的请求，并将其绑定到与 PVC 的最低资源要求相匹配的 PV。并非每个 PVC 都保证绑定到 PV。详情请参阅 Kubernetes [文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)。

> 如果没有匹配的卷，则声明将一直保持为未绑定状态。当匹配的卷可用时，声明将会被绑定。例如，配置有许多 50Gi PV 的集群不会匹配请求 100Gi 的 PVC。PVC 可以在 100Gi PV 添加到集群时进行绑定。

换句话说，你可以创建无限量的 PVC，但只有在 Kubernetes master 可以找到满足 PVC 所需的磁盘空间量的 PV 时，PVC 才会绑定到 PV。

要动态配置新存储，挂载在 pod 中的 PVC 对应的必须是存储类而不是持久卷。

# 使用 PVC 和存储类配置新存储

存储类允许你动态创建 PV，而无需先在基础设施提供商中创建持久存储。

例如，如果工作负载绑定到 PVC 并且 PVC 引用 Amazon EBS 存储类，则存储类可以动态创建 EBS 卷和相应的 PV。

然后 Kubernetes master 会将新创建的 PV 绑定到你的工作负载的 PVC，从而允许你的工作负载使用持久存储。
