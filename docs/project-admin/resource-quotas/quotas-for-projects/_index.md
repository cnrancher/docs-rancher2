---
title: 项目配额工作原理
---

Rancher 资源配额不仅包含了[原生 Kubernetes](https://kubernetes.io/docs/concepts/policy/resource-quotas/) 资源配额的所有功能，也对原生 Kubernetes 的资源配额做了扩展。在 Rancher 中，您可以把资源配额应用到[项目](/docs/cluster-admin/projects-and-namespaces/_index)层级。

在一个标准的 Kubernetes 部署中，资源配额是作用于每个命名空间上的。然而，原生 Kubernetes 不支持一键更新所有命名空间的资源配额。如果需要更新所有命名空间的资源配额，需要操作多次，逐个修改。

下图描述了一个 Kubernetes 管理员在没有使用 Rancher 的情况下尝试设置集群中每一个命名空间的资源配额。管理员想给每个命名空间（ `Namespace 1-4` ） 设置相同的 CPU 和内存限制。但是在原生 Kubernetes 里面，每个命名空间都需要一个独立的资源配额。管理员必须创建四个参数相同的资源配额（ `Resource Quota 1-4` ），分别应用到四个命名空间中，只有这样才能完成这个集群内所有命名空间的资源配额修改。

<sup>原生 Kubernetes：每个命名空间都需要一个独立的资源配额</sup>

![原生 Kubernetes 资源配额实现过程](/img/rancher/kubernetes-resource-quota.svg)

和原生 Kubernetes 相比，Rancher 的资源配额有一些不同。在 Rancher 中，您可以把资源配额应用到[项目](/docs/cluster-admin/projects-and-namespaces/_index)层级，然后资源配额会传播到项目内的每一个命名空间。而原生 Kubernetes 只能在命名空间层级应用资源配额，如果需要修改指定命名空间的资源配额，您还可以使用 Rancher [覆盖命名空间默认资源配额](/docs/project-admin/resource-quotas/override-namespace-default/_index)。

资源配额包括两个限制：项目资源限制和命名空间默认资源限制，创建或修改项目时可以修改。

- **项目资源限制：**

  项目资源限制是项目总体的资源限制。如果您尝试在项目中新建命名空间， Rancher 会使用您配置的项目资源限制校验项目是否有足够多的资源适配新建的命名空间。换句话说，如果您尝试把一个命名空间移到项目中，而这个操作会导致项目资源超出限制的话， Rancher 会禁止您执行这个操作。

- **命名空间默认资源限制：**

  它是每个命名空间的默认资源限制。创建了项目层级的资源限制后，命名空间默认资源限制会自动下发到项目内的每个命名空间。每个命名空间的资源限制都是这个值，除非您手动修改，[覆盖命名空间默认资源限制](/docs/project-admin/resource-quotas/override-namespace-default/_index)。

下图说明了 Rancher 管理员给项目内所有命名空间（ `Namespace 1-4` ）配置统一的 CPU 限额和内存限额的过程。管理员可以设置项目资源配额（ `Project Resource Quota` ），而不是单独设置每个命名空间的资源配额。完成项目资源配额的设置以后，配额包括的项目整体的项目资源限制（ `Project Limit` ），和每个命名空间的命名空间默认资源限制（ `Namespace Default Limit` ）。然后 Rancher 把命名空间默认资源限制( `Namespace Default Limit` )下发到每个命名空间( `Namespace Resource Quota` )。

<sup>Rancher：资源配额下发到每个命名空间</sup>

![Rancher 资源配额实现过程](/img/rancher/rancher-resource-quota.svg)

如果在项目层级删除了一个资源配额，无论命名空间层级是否有自定义的资源配额，该项目内的所有命名空间也会移除这个资源配额。在项目层级修改已有的默认资源配额，不会影响命名空间内的资源配额，修改后的项目层级资源配额只会对以后新建的命名空间生效。如果要修改命名空间层级的默认资源配额，您可以在项目层级删除现有的资源配额，然后创建一个新的资源配额并应用到该命名空间。这种操作方式会使项目内的所有命名空间都应用新建的资源配额。

下表说明了 Rancher 资源配额和 Kubernetes 资源配额的主要不同点。

| Rancher 资源配额                                                   | Kubernetes 资源配额              |
| :----------------------------------------------------------------- | :------------------------------- |
| 可应用于项目层级和命名空间层级                                     | 只能应用于命名空间层级           |
| 给项目内的所有命名空间创建了一个资源池，资源可以动态分配给命名空间 | 每个命名空间都应用了静态资源限制 |
| 可以通过传播/继承的方式，下发资源配额                              | 只能应用于指定的命名空间         |
