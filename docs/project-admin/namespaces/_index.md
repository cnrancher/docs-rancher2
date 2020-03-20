---
title: 命名空间
---
使用 Rancher，您可以进一步将项目分为多个[命名空间](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/_index)。命名空间是项目内的虚拟集群。当项目和默认的命名空间不能满足您的管理需时，您可以创建自定义命名空间，实现多个应用之间的隔离，或应用和项目资源之间的隔离。

虽然您在项目层级定义了资源的分配方式，项目中的每个命名空间都会沿用该方式分配资源，但是您也可以创建新的命名空间，单独定义这个命名空间的资源分配方式。

在命名空间层级可以直接分配的资源类型包括：

* [工作负载](/docs/k8s-in-rancher/workloads/_index)
* [负载均衡和应用路由](/docs/k8s-in-rancher/load-balancers-and-ingress/_index)
* [服务发现记录](/docs/k8s-in-rancher/service-discovery/_index)
* [存储卷](/docs/k8s-in-rancher/volumes-and-storage/persistent-volume-claims/_index)
* [证书](/docs/k8s-in-rancher/certificates/_index)
* [ConfigMaps](/docs/k8s-in-rancher/configmaps/_index)
* [镜像仓库](/docs/k8s-in-rancher/registries/_index)
* [秘钥](/docs/k8s-in-rancher/secrets/_index)

在原生 Kubernetes 集群中管理访问权限，集群管理员需要给每一个命名空间配置角色控制策略。在 Rancher 中管理访问权限则更加简单，在项目层级分配用户访问访问权限，项目中的所有命名空间都会自动沿用这个配置。

> **说明：**如果您使用 `kubectl` 创建了命名空间，可能会导致该命名空间不适用上述的项目层级管理权限分配策略，因为 `kubectl` 没有强制要求创建的命名空间位于您有权限访问的项目内。如果您没有全局访问权限，而是只有某个项目的权限，建议您[使用Rancher创建命名空间](/docs/project-admin/namespaces/_index#creating-namespaces)。

## 创建命名空间

创建命名空间的目的是隔离项目内的应用和资源。

处理 [workloads](/docs/k8s-in-rancher/workloads/deploy-workloads/_index) 、 [certificates](/docs/k8s-in-rancher/certificates/_index) 或 [ConfigMaps](/docs/k8s-in-rancher/configmaps/_index) 这些可分配给命名空间的项目资源时，只需额外执行少许操作，就可以创建自定义命名空间，具体步骤如下：

1. 访问Rancher UI **全局** 页面，单击项目，跳转到项目详情页。

   > **提示：** 虽然在集群层级和项目层级都可以创建命名空间，但是为了保证操作和描述的一致性，我们建议在项目层级创建命名空间。

1. 从主菜单中选择**命名空间**，然后单击**添加命名空间**，新建命名空间。

1. **可选：**如果您的项目的[资源配额](/docs/k8s-in-rancher/projects-and-namespaces/resource-quotas/_index)已经生效，您可以修改默认的资源配额，给命名空间可消费的资源设置最大限额。

1. 输入新建命名空间的**名称**，单击**创建**，创建命名空间。

**输出结果：**完成创建命名空间，而且该命名空间已经自动添加到了项目中。您可以开始将集群资源分配给这个命名空间。

## 如何在项目间迁移命名空间

集群管理员和集群成员也许偶尔有命名空间迁移的需求，例如，另外一个团队需要使用这个应用的场景中，就涉及到了将一个集群中的命名空间搬迁到另一个集群中的情况。所以 Rancher 提供了迁移命名空间的功能，具体操作步骤如下：

1. 访问 Rancher UI **全局** 页面，打开含有您想移动的命名空间的集群。

1. 打开主菜单，选择 **项目/命名空间**。

1. 勾选您想要移动到其他项目的命名空间，单击**移动**，移动命名空间。您可以一次勾选多个命名空间，移动多个命名空间到另一个项目中。

   > **注意事项：**
   >
   > - 请勿移动 `System` 项目内的任何命名空间。移动该项目内的命名空间会严重影响集群内的网络连接。
   > - Rancher 不支持移动[资源配额](/docs/k8s-in-rancher/projects-and-namespaces/resource-quotas/_index)已经生的命名空间。
   > - 如果命名空间的源端项目有资源配额，而目标端项目没有，移动该命名空间到目标端项目后，命名空间不会沿用源端的资源配额。完成迁移之后，您需要重新设置该命名空间的资源配额。

**输出结果：** 您的命名空间已经移动到目标端项目，或已经从所有项目中移除。如果命名空间和源端项目中的资源有关联，移动命名空间会解除源端项目资源和命名空间的关联关系，并且移动以后，目标端项目资源会与命名空间形成关联。

## 修改命名空间的资源配额

您可以修改命名空间默认的资源配额限制，让一个或多个指定的命名空间拥有更多或更少的项目资源配额。详情请参考[修改命名空间的资源配额](/docs/project-admin//resource-quotas/override-namespace-default/_index)。

