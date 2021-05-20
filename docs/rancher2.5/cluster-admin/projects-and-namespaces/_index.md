---
title: 项目和命名空间
description: 命名空间是 Kubernetes 的概念，它允许在集群中创建虚拟集群，这对于将集群划分为单独的“虚拟集群”非常有用，每个虚拟集群都有自己的访问控制和资源配额。项目是一组命名空间，是 Rancher 引入的一个概念。项目使您可以将多个命名空间作为一个组进行管理，并在其中执行 Kubernetes 操作。您可以使用项目来支持多租户，例如设置团队可以访问集群中的某个项目，但不能访问同一集群中的其他项目。
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
  - 集群管理员指南
  - 集群访问控制
  - 项目和命名空间
---

## 概述

命名空间是 Kubernetes 的概念，它允许在集群中创建虚拟集群，这对于将集群划分为单独的“虚拟集群”非常有用，每个虚拟集群都有自己的访问控制和资源配额。

项目是 Rancher 引入的一个概念，是由一个或多个命名空间构成的集合。您可以将多个命名空间作为一个组进行管理，并在其中执行 Kubernetes 操作。您可以使用项目来支持租户权限管理，例如设置团队可以访问集群中的某个项目，但不能访问同一集群中的其他项目。

## 命名空间（Namespace）

### 什么是命名空间

命名空间是 Kubernetes 引入的概念。根据[关于命名空间的 Kubernetes 官方文档](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)。

> Kubernetes 支持在同一物理集群中设置多个虚拟集群。这些虚拟集群称为命名空间。命名空间旨在用于具有多个用户的环境，这些用户分布在多个团队或项目中。对于拥十个以内用户的集群，一般来说，您根本不需要创建或考虑命名空间。

命名空间提供以下功能：

- **资源命名规范：**同一个命名空间内的资源名称必须是唯一的，但是同一个资源名称可以出现在多个命名空间里面。命名空间不能彼此嵌套，并且每个 Kubernetes 资源只能位于一个命名空间中。
- **资源配额：**命名空间提供了一种在多个用户之间划分集群资源的方法。

您可以在项目级别分配资源，以便项目中的每个命名空间都可以使用它们。您还可以通过将资源显分配给命名空间。

您可以将以下资源直接分配给命名空间：

- [工作负载](/docs/rancher2.5/k8s-in-rancher/workloads/_index)
- [负载均衡/Ingress](/docs/rancher2.5/k8s-in-rancher/load-balancers-and-ingress/_index)
- [服务发现](/docs/rancher2.5/k8s-in-rancher/service-discovery/_index)
- [PVC](/docs/rancher2.5/cluster-admin/volumes-and-storage/how-storage-works/_index)
- [证书](/docs/rancher2.5/k8s-in-rancher/certificates/_index)
- [配置映射](/docs/rancher2.5/k8s-in-rancher/configmaps/_index)
- [镜像仓库凭证](/docs/rancher2.5/k8s-in-rancher/registries/_index)
- [密文](/docs/rancher2.5/k8s-in-rancher/secrets/_index)

为了管理原生的 Kubernetes 集群中的权限，集群管理员需要为每个命名空间都配置基于角色的访问策略。使用 Rancher，用户权限将改为在项目级别分配，某个项目中都任何命名空间都将自动继承这些访问策略。

有关创建和移动命名空间的更多信息，请参见[命名空间](/docs/rancher2.5/project-admin/namespaces/_index)。

### 命名空间和 kubectl 的基于角色的访问控制问题

由于项目是 Rancher 引入的概念，因此 kubectl 不能将命名空间的创建限制在创建者可以访问的项目中。

这意味着当具有项目范围权限的标准用户使用`kubectl`创建命名空间时，新的命名空间可能无法使用，因为`kubectl`不需要将新命名空间限制在特定项目中。

如果您的权限仅限于项目级别，则最好[通过 Rancher 创建命名空间](/docs/rancher2.5/project-admin/namespaces/_index)，从而确保您有权访问命名空间。

如果标准用户是项目所有者，则该用户将能够在该项目中创建命名空间。 Rancher UI 将阻止该用户在他们有权访问的项目范围之外创建命名空间。

## 项目（Project）

集群、项目和命名空间之间的关系如下：

- 集群包含项目
- 项目包含命名空间

一个集群中可以有多个项目，一个项目中可以有多个命名空间。

您可以使用项目进行租户隔离，例如设置团队可以访问集群中的某个项目，但不能访问同一集群中的其他项目。

在原生的 Kubernetes 中，诸如基于角色的访问权限或集群资源之类的功能只能在命名空间级别进行配置。个人或团队需要同时访问多个命名空间时，项目可以使您节省时间。

您可以使用项目执行以下操作：

- 将用户分配到一组命名空间（例如，[项目成员](/docs/rancher2.5/project-admin/project-members/_index)）。
- 在项目中为用户分配特定角色。角色可以是所有者，成员，只读或[自定义角色](/docs/rancher2.5/admin-settings/rbac/default-custom-roles/_index)。
- 为项目分配资源配额。
- 分配 Pod 安全策略。

创建一个集群时，将在其中自动创建两个项目：

- [集群默认（Default）项目](#集群默认（default）项目)
- [集群系统（System）项目](#集群系统（system）项目)

### 集群默认（Default）项目

当您使用 Rancher 设置集群时，它将自动为该集群创建一个 `Default` 项目。您可以使用该项目来开始使用集群，但是您始终可以将其删除，并用具有更多描述性名称的项目替换它。

如果您不需要`default`命名空间，那么您也不需要 Rancher 中的 **Default** 项目。

如果您需要除 **Default** 项目以外的其他项目，可以在 Rancher 中创建更多项目以隔离命名空间，应用程序和资源。

### 集群系统（System）项目

_从 v2.0.7 版本开始支持_

排查故障时，您可以查看`System`项目以检查 Kubernetes 系统中的重要命名空间是否正常运行。这个易于访问的项目使您不必对单个系统命名空间容器进行故障排查。

要打开它，请打开**全局**菜单，然后选择您的集群中的`System`项目。

系统项目：

- 在配置集群时自动创建。
- 列出存在于 `v3/settings/system-namespaces` 中的所有命名空间。
- 允许您添加更多命名空间或将其命名空间移至其他项目。
- 无法删除，因为它是集群操作所必需的。

**注意：**在启用了项目网络隔离选项的 RKE 集群中，"系统 "项目覆盖了项目网络隔离选项，因此它可以与其他项目通信，收集日志，并检查健康状况。

## 项目授权

仅在两种情况下，标准用户才有权访问项目：

- 管理员，集群所有者或集群成员将标准用户明确添加到项目的**成员**选项卡中。
- 标准用户可以访问自己创建的项目。

## Pod 安全策略

Rancher 扩展了 Kubernetes 以允许在[项目级别](/docs/rancher2.5/project-admin/pod-security-policies/_index)上应用[Pod 安全策略](https://kubernetes.io/docs/concepts/policy/pod-security-policy/)，作为[集群级别](/docs/rancher2.5/cluster-admin/pod-security-policy/_index)之外的安全性策略。但是，作为最佳实践，我们建议在集群级别应用 Pod 安全策略。

## 创建项目

本节介绍如何使用名称以及可选的 Pod 安全策略，成员和资源配额创建新项目。

### 命名新项目

1. 从**全局**视图中，从主菜单中选择**集群**。从**集群**页面中，打开要从中创建项目的集群。

1. 从主菜单中，选择**项目/命名空间**。然后单击**添加项目**。

1. 输入一个**项目名称**。

### 可选：选择一个 Pod 安全策略

仅当您已经创建了 Pod 安全策略时，此选项才可用。有关说明，请参阅[创建 Pod 安全策略](/docs/rancher2.5/admin-settings/pod-security-policies/_index)。

将 PSP 分配给项目将：

- 覆盖集群的默认 PSP。
- 将 PSP 应用于项目。
- 将 PSP 应用于以后添加到项目中的任何命名空间。

### 推荐：添加项目成员

使用**成员**部分为其他用户提供项目访问权限和角色。

默认情况下，您的用户被添加为项目`成员`。

> **关于权限的说明：**
>
> - 为项目分配了`所有者`或`成员`角色的用户会自动继承`命名空间创建`角色。但是，此角色是 [Kubernetes ClusterRole](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole)，这意味着它的作用域扩展到了集群中的所有项目。因此，在某个项目中明确分配了`所有者`或`成员`角色的用户，即使在其他项目中仅分配了`只读`角色，这些用户也可以在这些项目中创建命名空间。
> - 选择`自定义`以动态创建自定义角色：[自定义项目角色](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/_index)。

要添加成员：

1. 单击`添加成员`。
1. 在`名称`组合框中，搜索要分配项目访问权限的用户或组。注意：只有启用了外部身份验证，您才可以搜索组。
1. 从`角色`下拉列表中，选择一个角色。有关更多信息，请参阅[关于项目角色的文档](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/_index)。

### 添加资源配额

_从 v2.1.0 版本开始支持_

资源配额限制了项目（及其命名空间）可以消耗的资源。详情请参考请[资源配额](/docs/rancher2.5/project-admin/resource-quotas/quota-type-reference/_index)。

1. 单击**添加配额**。
1. 选择[资源类型](/docs/rancher2.5/project-admin/resource-quotas/_index)。
1. 输入`项目限制`和`命名空间默认限制`的值。
1. **可选：**指定**容器默认资源限制**，它将应用于项目中启动的每个容器。如果您在资源配额中设置了 CPU 或内存相关的限制，则建议使用此参数。您可以在单个命名空间或容器级别上覆盖它。有关更多信息，请参见[容器默认资源限制](/docs/rancher2.5/project-admin/resource-quotas/_index)，注：此选项自 v2.2.0 起可用。
1. 单击**创建**。

**结果：**您的项目已创建。您可以从集群的**项目/命名空间**视图中查看它。

| 字段                 | 描述                                                                                             |
| :------------------- | :----------------------------------------------------------------------------------------------- |
| 项目配额限制         | 项目整体的配额限制。                                                                             |
| 命名空间默认配额限制 | 创建项目时，项目中每个命名空间默认的配额限制，项目下所有命名空间的配额限制之和不得大于项目配额。 |

## 集群与项目间切换

要在集群和项目之间切换，请使用主菜单中的**全局**下拉菜单。

![Global Menu](/img/rancher/global-menu.png)

或者，您可以使用主菜单在项目和集群之间切换。

- 要在集群之间切换，请打开**全局**视图，然后从主菜单中选择**集群**。从而打开一个集群。
- 要在项目之间切换，请打开一个集群，然后从主菜单中选择**项目/命名空间**。选择要打开的项目的链接。当然您也可以在**全局 > 项目所在集群**的下拉菜单中直接切换。
