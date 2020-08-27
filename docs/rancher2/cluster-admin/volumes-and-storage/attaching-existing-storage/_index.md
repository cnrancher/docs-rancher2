---
title: 使用已有存储
description: 本章节描述了如何在 Rancher 里为工作负载配置现有的持久化存储。请按照以下步骤配置持久卷和持久卷声明。
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
  - 集群管理员指南
  - 存储卷和存储类
  - 使用已有存储
---

本章节描述了如何在 Rancher 里为工作负载配置现有的持久化存储。请按照以下步骤配置持久卷和持久卷声明。

> 本章节假定您已了解 Kubernetes 持久卷和持久卷声明的概念，如果您想了解持久卷和持久卷声明的工作原理，请参考[存储是如何工作的](/docs/rancher2/cluster-admin/volumes-and-storage/how-storage-works/_index)。

## 先决条件

- 配置持久化存储前，请检查您的账户是否有 `管理卷（Manage Volumes）` 权限，具有该权限的[角色](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)可以配置持久化存储。
- 如果要在基础设施提供商托管的集群中设置存储，则需要保证存储和集群主机是来自同一个基础设施提供商。

## 设置持久化存储

在 Rancher 中，创建 PV 并不会创建真正的存储卷，它只会创建一个 Kubernetes 资源，映射到现有的卷。因此，必须先配置存储，然后再创建 PV。

设置持久化存储设备的步骤将根据基础设施而有所不同。我们提供了一些例子来展示如何进行存储设置：[NFS](/docs/rancher2/cluster-admin/volumes-and-storage/examples/nfs/_index)，[vSphere](/docs/rancher2/cluster-admin/volumes-and-storage/examples/vsphere/_index) 以及[亚马逊 EBS](/docs/rancher2/cluster-admin/volumes-and-storage/examples/ebs/_index)。

## 添加持久卷

1. 在集群页面中，单击**存储**，打开下拉菜单，选择**持久卷**。
1. 单击**添加卷**。
1. 输入持久卷的**名称**。
1. 根据使用的磁盘类型或服务选择 `卷插件`。在基础设施提供商托管的集群中设置存储，请使用基础设施提供商的卷插件。例如，如果您有 Amazon EC2 集群，并且想要为其使用云存储，则必须使用 `Amazon EBS Disk` 卷插件。
1. 输入卷的 **Capacity**，单位是 GB。
1. 填写**插件配置**表单。每种插件类型都需要特定于磁盘类型供应商的信息。有关每个插件的形式和所需信息的帮助，请参阅插件的服务文档以获取更多信息。
1. **可选：** 在**自定义**表单中，配置[访问模式](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)。该选项设置了可访问卷的节点数及节点的读写权限。在[Kubernetes 文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)中包含了一个列表，列出了可用插件支持的访问模式。
1. **可选：** 在**自定义**表单中，配置[挂载选项](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options)。每个卷插件都可以在挂载过程中指定其命令行选项。有关可用的挂载选项，请查阅每个插件的供应商文档。
1. 单击**保存**。

**结果：** 创建了新的存储卷。

## 添加持久卷声明

1. 进入包含要向其添加持久性批量声明的工作负载的项目。
1. 单击**卷**页签，然后单击**添加卷**(在早于 v2.3.0 的版本中，可以单击导航栏上的**工作负载**，然后单击**卷**)。
1. 输入卷声明的**名称**。
1. 选择要将持久化存储添加到的工作负载的[命名空间](/docs/rancher2/cluster-admin/projects-and-namespaces/_index/)。
1. 在**使用现有的持久卷**中，进入**持久卷**下拉列表并选择您创建的持久卷。
1. **可选：** 在**自 定义**中，选择要使用的[访问模式](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)。
1. 单击**创建**。

**结果：** 创建了新的 PVC，可以把它附加到项目中任意的工作负载上。

## 挂载持久卷声明

您可以在工作负载部署期间或创建工作负载之后挂载 PVC。

以下的步骤描述了如何将 PVC 分配给有状态的新工作负载：

1. 在**项目**页面中，进入**工作负载**页签。
1. 单击**部署**。
1. 输入工作负载的名称。
1. 在**工作负载类型**旁边, 单击**更多选项**。
1. 单击**StatefulSet**（可选）配置 Pod 的数量。
1. 选择将在其中部署工作负载的命名空间。
1. 展开**卷**，并单击**添加卷**，选择**使用现有的持久卷（声明）**。
1. 在**持久卷声明**中，选择创建的 PVC。
1. 在**挂载点**中，输入工作负载将用来访问卷的路径。
1. 单击**启动**。

**结果：** 部署工作负载后，它将向 Kubernetes Master 请求指定数量的磁盘空间。如果在部署工作负载时具有资源匹配且可用的 PV，则 Kubernetes Master 会将 PV 绑定到 PVC。

以下的步骤描述了如何将 PVC 分配给现有工作负载：

1. 在**项目**页面中，进入**工作负载**页签.
1. 进入要向其添加持久性存储的工作负载。工作负载类型应为有状态集合（StatefulSet）。单击 **...**，选择**编辑**。
1. 展开**卷**，然后单击**添加卷**，选择**使用现有的持久卷（声明）**。
1. 在**持久卷声明**中，选择创建的 PVC。
1. 在**挂载点**中，输入工作负载将用来访问卷的路径。
1. 单击**保存**。

**结果：** 部署工作负载后，它将向 Kubernetes Master 请求指定数量的磁盘空间。如果在部署工作负载时具有资源匹配且可用的 PV，则 Kubernetes Master 会将 PV 绑定到 PVC。
