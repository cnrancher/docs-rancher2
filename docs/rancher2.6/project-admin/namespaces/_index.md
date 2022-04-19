---
title: 命名空间
weight: 2520
---

在 Rancher 中，你可以将项目进一步划分为多个[命名空间](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)，项目是由物理集群支持的，而命名空间是项目中的虚拟集群。当项目和 `default` 命名空间不能满足你的需求时，你可以在项目中创建多个命名空间来隔离应用和资源。

你可以在项目层级分配资源，从而使项目中的每个命名空间可以使用这些资源，也可以单独给某个命名空间显式分配资源。

可以直接分配给命名空间的资源包括：

- [工作负载]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/)
- [负载均衡器/Ingress]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/)
- [服务发现记录]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/service-discovery/)
- [持久卷声明]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/)
- [证书]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/certificates/)
- [ConfigMap]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/configmaps/)
- [镜像仓库]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/registries/)
- [密文]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/secrets/)

为了在 vanilla Kubernetes 集群中管理权限，集群管理员要为每个命名空间配置基于角色的访问策略。Rancher 在项目级别上分配用户权限，项目中的命名空间会自动继承项目的权限。

> **注意**：如果你使用 `kubectl`创建命名空间，由于 `kubectl` 不要求将新命名空间限定在你可以访问的项目内，因此你可能无法使用该命名空间。如果你的权限仅限于项目级别，则最好[通过 Rancher 创建命名空间]({{<baseurl>}}/rancher/v2.6/en/project-admin/namespaces)，以确保你有权访问该命名空间。


### 创建命名空间

创建一个新的命名空间来隔离项目中的应用和资源。

> **提示**：使用可以分配给命名空间的项目资源（例如，[工作负载]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/deploy-workloads/)、[证书]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/certificates/)、[ConfigMap]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/configmaps) 等）时，你可以动态创建命名空间。

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要在其中创建命名空间的集群，然后单击 **Explore**。
1. 单击**集群 > 项目/命名空间**。
1. 转到要添加命名空间的项目，并单击**创建命名空间**。或者，你也可以转到**不在项目内**以创建不与项目关联的命名空间。

1. **可选**：如果你的项目具有有效的[资源配额]({{<baseurl>}}/rancher/v2.6/en/project-admin/resource-quotas)，你可以覆盖默认资源**限制**（限制命名空间可以使用的资源）。

1. 输入**名称**，然后单击**创建**。

**结果**：已将命名空间添加到项目中。你可以开始将集群资源分配给命名空间。

### 将命名空间移动到另一个项目

在某些情况下（例如希望其他团队使用该应用时），集群管理员和成员可能需要将命名空间移动到另一个项目：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到需要移动命名空间的集群，然后单击 **Explore**。
1. 单击**集群 > 项目/命名空间**。
1. 转到要移动的命名空间，然后单击 **⋮ > 移动**。

1. 选择要移动到另一个项目的命名空间。然后单击**移动**。你可以同时移动多个命名空间。

   > **注意**：
   >
   > - 不要移动 `System` 项目中的命名空间。移动命名空间可能会对集群网络产生不利影响。
   > - 你不能将命名空间移动到已配置[资源配额]({{<baseurl>}}/rancher/v2.6/en/project-admin/resource-quotas)的项目中。
   > - 如果你将命名空间从已设置配额的项目移动到未设置配额的项目，则会删除该命名空间的配额。

1. 为新命名空间选择一个新项目，然后单击**移动**。你也可以选择**无**，从而将命名空间从所有项目中移除。

**结果**：你的命名空间已移至其他项目（或从所有项目中移除）。如果命名空间绑定了项目资源，命名空间会释放这些资源，然后绑定新项目的资源。

### 编辑命名空间资源配额

你可以覆盖命名空间默认限制，从而为特定命名空间提供对更多（或更少）项目资源的访问权限：

有关详细信息，请参阅[编辑命名空间资源配额]({{<baseurl>}}/rancher/v2.6/en/project-admin//resource-quotas/override-namespace-default/)。