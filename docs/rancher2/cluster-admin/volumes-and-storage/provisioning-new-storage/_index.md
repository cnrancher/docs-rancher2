---
title: 动态创建持久卷
description: 本章节描述了如何为 Rancher 中的工作负载配置新的持久化存储。本章节假定您已了解 Kubernetes 持久卷声明和存储类型的概念。 有关更多信息，请参阅存储是如何工作的。
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
  - 动态创建持久卷
---

本章节描述了如何为 Rancher 中的工作负载配置新的持久化存储。

> 本章节假定您已了解 Kubernetes 持久卷和持久卷声明的概念，如果您想了解持久卷和持久卷声明的工作原理，请参考[存储是如何工作的](/docs/rancher2/cluster-admin/volumes-and-storage/how-storage-works/_index)。

## 先决条件

- 配置持久化存储前，请检查您的账户是否有 `管理卷（Manage Volumes）` 权限，具有该权限的[角色](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)可以配置持久化存储。
- 如果要在基础设施提供商托管的集群中设置存储，则需要保证存储和集群主机是来自同一个基础设施提供商。并且必须启用 Cloud Provider。有关启用 Cloud Provider 的详细信息，请参阅[文档](/docs/rancher2/cluster-provisioning/rke-clusters/cloud-providers/_index)。
- 确保存储提供者是已启用的。

Rancher 默认启用以下云服务存储卷：

| 名称                   | 插件                   |
| :--------------------- | :--------------------- |
| Amazon EBS Disk        | `aws-ebs`              |
| AzureFile              | `azure-file`           |
| AzureDisk              | `azure-disk`           |
| Google Persistent Disk | `gce-pd`               |
| Longhorn               | `flex-volume-longhorn` |
| VMware vSphere Volume  | `vsphere-volume`       |
| Local                  | `local`                |
| Network File System    | `nfs`                  |
| hostPath               | `host-path`            |

如果需要使用不在上述列表内的存储提供者，您需要使用功能开关来[启用不被默认启动存储驱动](/docs/rancher2/installation_new/options/feature-flags/enable-not-default-storage-drivers/_index)。不在上述列表内的存储服务没有经过 Rancher 的测试和验证，属于实验性功能，Rancher 不能保证使用过程中是否会出现问题，请谨慎使用不在上表内的存储服务。

## 配置存储类

1. 进入要为其设置动态持久化存储卷的集群。
1. 在集群页面中，单击**存储**，选择**存储类**，单击**添加类**。
1. 输入存储类**名称**。
1. 从**提供者**下拉列表中，选择要用于动态配置存储卷的服务。例如，您有一个 Amazon EC2 集群，并且想要为其使用云存储，请使用**Amazon EBS Disk**提供者。
1. 在**参数**中，填写动态配置存储卷所需的信息。每个提供者需要不同的信息来动态供应存储卷。请查阅对应的服务文档以获取更多信息。
1. 单击**保存**。

**结果：** 创建了新的存储类，可供 PVC 使用。

有关存储类参数的完整信息，请参阅[Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#parameters)。

## 添加持久卷声明

1. 进入包含要向其添加 PVC 的工作负载的项目。
1. 在导航栏中，下拉**资源**，选择**工作负载**（在早于 v2.3.0 的版本中，在导航栏中选择**工作负载**）。然后选择**卷**页签，单击**添加卷**。
1. 输入卷声明**名称**。
1. 选择卷声明的[命名空间](/docs/rancher2/cluster-admin/projects-and-namespaces/_index)。
1. 在**源**中，单击**使用存储类来置备新的持久卷**。
1. 单击**存储类**下拉菜单，然后选择您创建的存储类。
1. 输入卷**容量**。
1. **可选：** 在**自定义**中，选择要使用的[访问模式](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)。
1. 单击**创建**。

**结果：** 创建了新的 PVC，可以把它附加到项目中任意的工作负载上。

## 挂载持久卷声明

您可以在工作负载部署期间或创建工作负载之后挂载 PVC。

以下的步骤描述了如何将 PVC 分配给有状态的新工作负载：

1. 按照[部署工作负载](/docs/rancher2/k8s-in-rancher/workloads/deploy-workloads/_index)的流程来创建工作负载.
1. 在**工作负载类型**中，选择**StatefulSet**，Pod 数量 为 1。
1. 展开**卷**列表，并单击**添加卷**，选择**添加新的永久卷（声明）**。
1. 在**持久卷声明**中，选择附加到存储类的新创建的持久卷声明。
1. 在**挂载点**中，输入工作负载将用来访问卷的路径。
1. 单击**启动**。

**结果：** 部署工作负载后，它将向 Kubernetes Master 请求指定数量的磁盘空间。如果在部署工作负载时具有资源匹配且可用的 PV，则 Kubernetes Master 会将 PV 绑定到 PVC。

以下的步骤描述了如何将 PVC 分配给现有工作负载：

1. 进入要向其添加持久性存储的工作负载。
1. 工作负载类型应为有状态集合（StatefulSet）。单击 **...**，选择**编辑**。
1. 展开**卷**，然后单击**添加卷**，选择**添加一个新的持久卷（声明）**。
1. 在**持久卷声明**中，选择附加到存储类的新创建的持久卷声明。
1. 在**挂载点**中，输入工作负载将用来访问卷的路径。
1. 单击**保存**。

**结果：** 部署工作负载后，它将向 Kubernetes Master 请求指定数量的磁盘空间。如果在部署工作负载时具有资源匹配且可用的 PV，则 Kubernetes Master 会将 PV 绑定到 PVC。否则，Kubernetes 将会配置新的 PV，然后将新的 PV 绑定到 PVC。
