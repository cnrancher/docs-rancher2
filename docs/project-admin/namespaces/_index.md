---
title: 命名空间
---

在 Rancher 中，您可以进一步将项目分隔为多个[命名空间](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces)。项目是由物理集群支持的。而命名空间是项目中的虚拟集群。当项目和`default`命名空间不能满足您的管理需时，您可以在项目中创建多个命名空间来隔离您的应用和资源。

您可以在项目层级分配资源，从而使项目中的每个命名空间可以使用这些资源。但您也可以单独给某个命名空间分配资源。

可以直接分配给命名空间的资源类型包括：

- [工作负载](/docs/k8s-in-rancher/workloads/_index)
- [负载均衡和 Ingress](/docs/k8s-in-rancher/load-balancers-and-ingress/_index)
- [服务发现记录](/docs/k8s-in-rancher/service-discovery/_index)
- [存储卷声明](/docs/cluster-admin/volumes-and-storage/how-storage-works/_index)
- [证书](/docs/k8s-in-rancher/certificates/_index)
- [配置映射](/docs/k8s-in-rancher/configmaps/_index)
- [镜像仓库凭证](/docs/k8s-in-rancher/registries/_index)
- [密文](/docs/k8s-in-rancher/secrets/_index)

在原生 Kubernetes 集群中管理访问权限，集群管理员需要给每一个命名空间配置角色控制策略 RBAC。在 Rancher 中管理访问权限则更加简单，用户可以在项目层级配置 RBAC，项目中的所有命名空间都会自动继承这个 RBAC 配置。

> **说明：** 如果您使用 `kubectl` 创建了命名空间，可能会导致该命名空间不适用上述的项目层级管理权限分配策略，因为 `kubectl` 没有强制要求创建的命名空间位于您有权限访问的项目某个内。如果您只有某个项目的权限，我们建议您[通过 Rancher 来创建命名空间](/docs/project-admin/namespaces/_index)。

## 创建命名空间

创建命名空间的目的是隔离项目内的应用和资源。

当您在操作可以分配到命名空间的资源时，例如[工作负载](/docs/k8s-in-rancher/workloads/deploy-workloads/_index)、[证书](/docs/k8s-in-rancher/certificates/_index)或[配置映射](/docs/k8s-in-rancher/configmaps/_index)，只需额外执行少许操作，就可以创建新的命名空间，具体步骤如下：

1. 访问 Rancher UI **全局** 页面，单击项目，跳转到某个项目。

   > **提示：** 虽然在集群层级和项目层级都可以创建命名空间，但是为了保证操作和描述的一致性，我们建议在项目层级创建命名空间。

1. 从主菜单中选择**命名空间**，然后单击**添加命名空间**，新建命名空间。

1. **可选：** 如果您的项目的[资源配额](/docs/project-admin/resource-quotas/_index)已经生效，您可以修改默认的命名空间资源配额，您可以覆盖默认的资源限制（这个命名空间可以使用的资源上限）。

1. 输入新建命名空间的**名称**，单击**创建**，创建命名空间。

**结果：** 完成创建命名空间，而且该命名空间已经自动添加到了项目中。您可以开始将集群资源分配给这个命名空间。

## 如何在项目间迁移命名空间

集群管理员和集群成员也许偶尔有迁移命名空间的需求，例如，当您想让另外一个团队使用这个应用。所以 Rancher 提供了迁移命名空间的功能，具体操作步骤如下：

1. 访问 Rancher UI **全局** 页面，打开含有您想移动的命名空间的集群。

1. 打开主菜单，选择 **项目/命名空间**。

1. 勾选您想要移动到其他项目的命名空间，单击**移动**，移动命名空间。您可以一次勾选多个命名空间，移动多个命名空间到另一个项目中。

   > **注意事项：**
   >
   > - 请勿移动 `System` 项目内的任何命名空间。移动该项目内的命名空间会严重影响集群内的网络连接。
   > - Rancher 不支持将命名空间移动到已经配置了[资源配额](/docs/project-admin/resource-quotas/_index)的项目中。
   > - 如果把命名空间从一个已经配置了配额的项目中，移动到一个没有配置配额的项目中，这个命名空间的配额将会被移除。

1. 给命名空间选择一个新的项目。然后点击**移动**。同时，您也可以通过选择**None**，把命名空间从所有项目中移除。

**结果：** 您的命名空间已经移动到了新的项目中，或已经从所有项目中移除。如果命名空间和原来的项目中的资源有关联，移动命名空间会解除关联，并在新的项目中创建关联。

## 修改命名空间的资源配额

您可以修改命名空间默认的资源配额限制，让一个或多个指定的命名空间拥有更多或更少的项目资源配额。详情请参考[修改命名空间的资源配额](/docs/project-admin/resource-quotas/override-namespace-default/_index)。
