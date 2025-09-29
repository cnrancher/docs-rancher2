---
title: 工作原理
description: 持久卷（PersistantVolume，简称 PV）是 Kubernetes 集群中一部分的存储，而持久卷声明（PersistantVolumeClaim，简称 PVC）是存储的请求。在 Kubernetes 中有两种使用持久存储的方法：使用已存在的持久卷或动态配置新的持久卷。要使用现有的 PV，您的应用程序需要使用已经绑定到 PV 的 PVC，并且 PV 应该包含 PVC 所需的最少资源（容量）。
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
  - 存储卷和存储类
  - 工作原理
---

持久卷（PersistantVolume，简称 PV）是 Kubernetes 集群中一部分的存储，而持久卷声明（PersistantVolumeClaim，简称 PVC）是存储的请求。

在 Kubernetes 中有两种使用持久存储的方法：

- 使用现有的持久卷
- 配置新的动态存储持久卷

要使用现有的 PV，您的应用程序需要使用已经绑定到 PV 的 PVC，并且 PV 应该包含 PVC 所需的最少资源（容量）。例如，Kubernetes 集群已经绑定了一个 PV，它向 PV 发出了存储请求，需要存储的数据大小为 5GB，如果 PV 的剩余空间大于 5GB，就可以使用该 PV 存储数据；如果 PV 的剩余空间小于 5GB，PVC 所需的资源超过了 PV 能提供的资源，则用户需要配置新的动态存储持久卷。

对于动态存储的配置，您的应用程序需要使用已经绑定到存储类的 PVC，并且存储类应该包含创建新的持久卷的权限。

![Setting Up New and Existing Persistent Storage](/img/rancher/rancher-storage.svg)

了解更多信息, 请参阅 [Kubernetes 存储的官方文档](https://kubernetes.io/docs/concepts/storage/volumes/)。

## 持久卷声明简介

持久卷声明（PVC）是向集群请求存储资源的对象。它们类似于您的部署应用可以兑换存储访问的凭证。PVC 作为卷挂载在工作负载中，以便工作负载可以声明其指定的持久化存储份额。

要访问持久化存储，容器必须具有作为卷挂载的 PVC。该 PVC 可让您将部署在 Pod 内的应用数据存储在 Pod 外，如果 Pod 发生故障，您可以启用新的 Pod ，访问外部存储的应用数据，避免应用中断。

Rancher 内每个项目都包含您创建的 PVC 列表，可从导航栏单击**资源**展开下拉菜单，单击**工作负载 > 卷**，查看已创建的 PVC（在早于 v2.3.0 的版本，PVC 位于**卷**页签中）。已经创建的 PVC 可以重复使用。

### 新的和现有的持久化存储都需要 PVC

PVC 是 Pod 使用持久化存储的前提条件，无论是使用已有的存储还是配置新存储，都需要挂载 PVC。

如果要为工作负载设置现有存储，则该工作负载会挂载一个 PVC，该 PVC 指向现有 PV，与现有存储基础结构相对应。

如果要为作负载配置新的存储，则该工作负载将挂载 PVC，该 PVC 指的是存储类（StorageClass），该类具有创建 PV 及其基础存储基础结构的能力。

Rancher 允许您在项目中创建任意数量的 PVC。您可以在创建工作负载时将 PVC 挂载到工作负载中，也可以稍后在工作负载运行后将其挂载到工作负载中。

## 使用 PVC 和 PV 设置已存在的存储

您的 Pod 可以将数据存储在[卷](https://kubernetes.io/docs/concepts/storage/volumes/)中，但是如果 Pod 发生故障，该数据会丢失。为了解决此问题，Kubernetes 提供了持久卷（PV），PV 是与 Pod 可以访问的外部存储磁盘或文件系统相对应的 Kubernetes 资源，Pod 将应用数据存储在 Pod 外。如果正在运行 Pod 崩溃了，则用户可以使用新的 Pod 访问持久化存储中的数据，把 Pod 崩溃的影响降到最低。

PV 可以是您在内部托管的本地物理磁盘或文件系统，也可以是云供应商托管的存储资源，例如 Amazon EBS 或 Azure Disk。

在 Rancher 中，创建 PV 和创建存储卷是两个独立的过程，创建 PV 并不会创建存储卷，它只会创建一个 Kubernetes 资源，映射到现有的卷。因此，**必须先配置存储，然后再创建 PV**。

> **重要：** PV 是在集群级别创建的，一个集群中可能存在多个项目和命名空间，在多租户集群中，多个用户可以访问同一个 PV。

### 将 PV 绑定到 PVC

设置 Pod 的持久化存储时，会挂载一个持久性卷声明（PVC），该声明与其他 Kubernetes 卷的挂载方式相同。当创建 PVC 时，Kubernetes Master 将其视为存储请求，并将其绑定到与 PVC 的最低资源（容量）要求匹配的 PV。并非所有 PVC 都能保证绑定到 PV。根据[Kubernetes 的文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)：

> 如果不存在匹配的卷，则声明将一直保持未绑定的状态。声明变成已绑定状态仅当存在匹配的卷。比如，集群里有很多 50Gi 的 PV，但是无法匹配 100Gi 的声明。当将 100Gi 的 PV 加入集群后，声明将得到绑定。

您可以创建无限量的 PVC，但是只有当 Kubernetes 找到至少匹配其所需的磁盘空间量的 PV 时，它们才会绑定到 PV。

为了动态地提供新的存储，挂载在容器中的 PVC 必须与存储类相对应，而不是与 PV 相对应。

## 使用 PVC 和存储类型设置新存储

存储类让您可以动态创建 PV，而不必先在基础设施中创建持久化存储。

例如，如果工作负载绑定到 PVC，并且 PVC 引用 Amazon EBS 的存储类，则该存储类可以动态创建 EBS 卷和相应的 PV。

然后 Kubernetes Master 将新创建的 PV 绑定到工作负载的 PVC，从而使您的工作负载可以使用持久化存储。
