---
title: 使用 Rancher 的项目和 Kubernetes 命名空间
description: Rancher Projects 减轻了集群的管理负担并支持多租户。学习创建项目并将项目划分为 Kubernetes 命名空间
weight: 2032
---

命名空间是 Kubernetes 的概念，它允许你在集群中使用虚拟集群。这对于将集群划分为单独的“虚拟集群”很有用，每个“虚拟集群”都有自己的访问控制和资源配额。

项目是一组命名空间，是 Rancher 引入的一个概念。项目允许你将多个命名空间作为一个组进行管理，并在其中执行 Kubernetes 操作。你可以使用项目来支持多租户，以便团队可以在集群内访问项目，而无需访问同一集群中的其他项目。

> **注意**：从 Rancher v2.6 开始，项目不再强调 UI，因为不再需要在项目范围内创建任何 Kubernetes 资源。但是，如果启用了旧版功能开关，则仍可以在项目范围内创建诸如 [Secrets]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/secrets/#creating-secrets-in-projects) 之类的资源。

本文介绍项目和命名空间如何与 Rancher 一起使用。本文涵盖以下主题：

- [关于命名空间](#about-namespaces)
- [关于项目](#about-projects)
  - [集群的默认项目](#the-cluster-s-default-project)
  - [system 项目](#the-system-project)
- [项目授权](#project-authorization)
- [Pod 安全策略](#pod-security-policies)
- [创建项目](#creating-projects)
- [在集群和项目之间切换](#switching-between-clusters-and-projects)

## 关于命名空间

命名空间是 Kubernetes 引入的一个概念。详情请参见[命名空间的官方 Kubernetes 文档](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)。

> Kubernetes 支持由同一个物理集群支持的多个虚拟集群。这些虚拟集群称为命名空间。命名空间适用于多用户分布在多个团队或项目中的环境。如果你的集群只有几个到几十个用户，你不需要创建或考虑使用命名空间。

命名空间提供以下功能：

- **为名称提供范围**：资源名称在命名空间内必须是唯一的，但跨命名空间时则不需要。命名空间不能相互嵌套，每个 Kubernetes 资源只能位于一个命名空间中。
- **资源配额**：命名空间提供了在多用户之间划分集群资源的方法。

你可以在项目级别分配资源，以便项目中的每个命名空间都可以使用这些资源。你也可以通过将资源显式分配给命名空间来绕过此继承模式。

你可以将以下资源直接分配给命名空间：

- [工作负载]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/)
- [负载均衡器/Ingress]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/)
- [服务发现记录]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/service-discovery/)
- [持久卷声明]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/)
- [证书]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/certificates/)
- [ConfigMap]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/configmaps/)
- [镜像仓库]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/registries/)
- [密文]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/secrets/)

为了在 vanilla Kubernetes 集群中管理权限，集群管理员要为每个命名空间配置基于角色的访问策略。Rancher 在项目级别上分配用户权限，项目中的命名空间会自动继承项目的权限。

有关创建和移动命名空间的更多信息，请参阅[命名空间]({{<baseurl>}}/rancher/v2.6/en/project-admin/namespaces/)。

### 命名空间和 kubectl 的 RBAC 问题

由于项目是 Rancher 引入的概念，因此 kubectl 不能将命名空间的创建限制在创建者可以访问的项目中。

这意味着当具有项目范围权限的普通用户使用 `kubectl` 创建命名空间时，由于 `kubectl` 不需要将新命名空间限制在特定项目中，创建的命名空间可能无法使用。

如果你的权限仅限于项目级别，则最好[通过 Rancher 创建命名空间]({{<baseurl>}}/rancher/v2.6/en/project-admin/namespaces/)，以确保你有权访问该命名空间。

如果普通用户是项目所有者，则该用户将能够在该项目中创建命名空间。Rancher UI 将阻止该用户在他们有权访问的项目之外创建命名空间。

## 关于项目

在层次结构方面：

- 集群包含项目
- 项目包含命名空间

你可以使用项目来支持多租户，以便团队可以在集群内访问项目，而无需访问同一集群中的其他项目。

在 Kubernetes 的基础版本中，基于角色的访问控制或集群资源等功能被分配给了各个命名空间。项目允许你让个人或团队同时访问多个命名空间来节省时间。

你可以使用项目来执行以下操作：

- 将用户分配到一组命名空间（即[项目成员身份]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles)）。
- 在项目中为用户分配特定角色。角色可以是所有者、成员、只读或[自定义]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/default-custom-roles/)。
- 为项目分配资源。
- 分配 Pod 安全策略。

创建集群时，会在其中自动创建两个项目：

- [Default 项目](#the-cluster-s-default-project)
- [System 项目](#the-system-project)

### 集群的 Default 项目

使用 Rancher 配置集群时，Rancher 会自动为集群创建一个 `default` 项目。你可以使用这个项目来开始使用集群。但你始终可以删除该项目，并用具有更多描述性名称的项目替换它。

如果你只需要使用 `default` 命名空间，那么你就不需要 Rancher 中 **Default** 之外的其他项目。

如果你需要 **Default** 之外的其他项目，你可以在 Rancher 中创建更多项目来隔离命名空间、应用和资源。

### System 项目

故障排查时，你可以查看 `system` 项目来检查 Kubernetes 系统中重要的命名空间是否正常。这是一个易于访问的项目，能让你避免对系统命名空间容器进行逐个排查。

要打开这个项目，请打开集群视图并单击**集群 > 项目/命名空间**。该视图显示了 `system` 项目中的所有命名空间。

`system` 项目：

- 在你配置集群时自动创建。
- 列出存在于 `v3/settings/system-namespaces` 中的所有命名空间（如果存在）。
- 允许你添加更多命名空间，或将项目内的命名空间移动到其他项目。
- 无法删除，因为它是集群操作所必需的。

> **注意**：在启用了项目网络隔离的 RKE 集群中，`system` 项目会覆盖项目网络隔离选项，以便项目能与其他项目通信、收集日志和检查健康状态。

## 项目授权

普通用户仅在两种情况下会被授权访问项目：

- 管理员、集群所有者或集群成员将普通用户显式添加到项目的**成员**中。
- 普通用户可以访问他们自己创建的项目。

## Pod 安全策略

Rancher 在 Kubernetes 之上进行了扩展，除了集群级别之外，还允许在项目级别应用 [Pod 安全策略](https://kubernetes.io/docs/concepts/policy/pod-security-policy/)。但是，最佳实践是在集群级别应用 Pod 安全策略。

## 创建项目

本节介绍如何创建具有名称以及可选 pod 安全策略、成员和资源配额的新项目。

1. [命名新项目](#1-name-a-new-project)
2. [可选：选择 pod 安全策略](#2-optional-select-a-pod-security-policy)
3. [推荐：添加项目成员](#3-recommended-add-project-members)
4. [可选：添加资源配额](#4-optional-add-resource-quotas)

### 1. 命名新项目

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要在其中创建项目的集群，然后单击 **Explore**。
1. 单击**集群 > 项目/命名空间**。
1. 单击**创建项目**。
1. 输入**项目名称**。

### 2. 可选：选择 Pod 安全策略

此选项仅在 Pod 安全策略已创建时可用。有关说明，请参阅[创建 Pod 安全策略]({{<baseurl>}}/rancher/v2.6/en/admin-settings/pod-security-policies/)。

将 PSP 分配给项目将：

- 覆盖集群的默认 PSP。
- 将 PSP 应用于项目。
- 将 PSP 应用到后续添加到项目中的命名空间。

### 3. 推荐：添加项目成员

使用**成员**为其他用户提供项目访问权限和角色。

默认情况下，你的用户会被添加为项目的 `Owner`（所有者）。

> **权限说明：**
>
> - 如果用户分配到了项目的`所有者`或`成员`角色，用户会自动继承`命名空间创建`角色。然而，这个角色是 [Kubernetes ClusterRole](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole)，这表示角色的范围会延展到集群中的所有项目。因此，对于显式分配到了项目`所有者`或`成员`角色的用户来说，即使只有`只读`角色，这些用户也可以在分配给他们的其他项目中创建命名空间。
>
> - 默认情况下，Rancher 的`项目成员`角色继承自 `Kubernetes-edit` 角色，而`项目所有者`角色继承自 `Kubernetes-admin` 角色。因此，`项目成员`和`项目所有者`角色都能管理命名空间，包括创建和删除命名空间。
>
> - 选择`自定义`来立即创建自定义角色：[自定义项目角色]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#custom-project-roles)。

要添加成员：

1. 在**成员**选项卡中，单击**添加**。
1. 在**选择成员**字段中，搜索要分配项目访问权限的用户或组。请注意，如果你启用了外部身份验证，则只能搜索组。
1. 在**项目权限**中选择一个角色。如需更多信息，请参阅[项目角色文档]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/)。

### 4. 可选：添加资源配额

资源配额用于限制项目（及其命名空间）可以使用的资源。有关详细信息，请参阅[资源配额]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/projects-and-namespaces/)。

要添加资源配额：

1. 在**资源配额**选项卡中，单击**添加资源**。
1. 选择一个**资源类型**。有关详细信息，请参阅[资源配额]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/projects-and-namespaces/)。
1. 输入**项目限制**和**命名空间默认限制**的值。
1. **可选**：指定**容器默认资源限制**，这将应用于项目中启动的所有容器。如果资源配额设置了 CPU 或内存限制，则建议使用该参数。可以在单个命名空间或容器级别上覆盖它。有关详细信息，请参阅[容器默认资源限制]({{<baseurl>}}/rancher/v2.6/en/project-admin/resource-quotas/)。
1. 单击**创建**。

**结果**：项目已创建。你可以从集群的**项目/命名空间**视图中查看它。

| 字段 | 描述 |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| 项目限制 | 项目的总资源限制。 |
| 命名空间默认限制 | 每个命名空间的默认资源限制。此限制在创建时会沿用到项目中的每个命名空间。项目中所有命名空间的限制之和不应超过项目限制。 |
