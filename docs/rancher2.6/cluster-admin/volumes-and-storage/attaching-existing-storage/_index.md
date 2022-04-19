---
title: 设置现有存储
weight: 1
---

本文介绍如何在 Rancher 中为工作负载设置现有的持久存储。

> 本节假设你了解 Kubernetes 的持久卷和持久卷声明的概念。如需更多信息，请参阅[存储的工作原理](../how-storage-works)。

要设置存储，请执行以下步骤：

1. [设置持久存储](#1-set-up-persistent-storage)。
2. [添加一个引用持久存储的 PersistentVolume](#2-add-a-persistentvolume-that-refers-to-the-persistent-storage)。
3. [为使用 StatefulSet 部署的 Pod 使用 PersistentVolume](#3-use-the-persistentvolume-for-pods-deployed-with-a-statefulset)。

### 前提

- 要将持久卷创建为 Kubernetes 资源，你必须具有`管理卷`的[角色。]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#project-role-reference)
- 如果你要为云集群配置存储，则存储和集群主机必须使用相同的云提供商。

### 1. 设置持久存储

在 Rancher 中创建持久卷不会创建存储卷。它只创建映射到现有卷的 Kubernetes 资源。因此，在你可以将持久卷创建为 Kubernetes 资源之前，你必须先配置存储。

设置持久存储设备的步骤会因你的基础设施而异。我们提供了使用 [vSphere](../examples/vsphere)、[NFS](../examples/nfs) 或 [Amazon EBS ](../examples/ebs)设置存储的示例。

如果你有一个块存储池并且不想使用云提供商，你可以使用 Longhorn 为 Kubernetes 集群提供持久存储。详情请参见[本页面]({{<baseurl>}}/rancher/v2.6/en/longhorn)。

### 2. 添加一个引用持久存储的 PersistentVolume

这些步骤描述了如何在 Kubernetes 的集群级别设置 PersistentVolume。

1. 点击 **☰ > 集群管理**。
1. 转到要添加持久卷的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**存储 > 持久卷**。
1. 单击**创建**。
1. 输入持久卷的**名称**。
1. 为正在使用的磁盘类型或服务选择**卷插件**。将存储添加到由云提供商托管的集群时，请使用云提供商的云存储插件。例如，如果你有一个 Amazon EC2 集群并且想要使用云存储，则必须使用 `Amazon EBS 磁盘`卷插件。
1. 输入卷的**容量**（单位：GB）。
1. 填写**插件配置**表单。每个插件类型都需要磁盘类型供应商的信息。有关每个插件的表单和所需信息的帮助，请参阅插件的供应商文档。
1. 可选：在**自定义**表单中，配置[访问模式](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)。此选项设置可以访问卷的节点数量，以及节点的读/写权限。[Kubernetes 文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)中的表格列出了插件支持的访问模式。
1. 可选：在**自定义**表单中，配置[挂载选项](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options)。每个卷插件都允许你在安装过程中指定其他命令行选项。请查阅每个插件的供应商文档以获取可用的挂载选项。
1. 单击**创建**。

**结果**：已创建你的新持久卷。

### 3. 为使用 StatefulSet 部署的 Pod 使用存储类

StatefulSet 管理 Pod 的部署和扩展，同时为每个 Pod 维护一个粘性标识。在这个 StatefulSet 中，我们将配置一个 VolumeClaimTemplate。StatefulSet 管理的每个 Pod 都将部署一个基于此 VolumeClaimTemplate 的 PersistentVolumeClaim。PersistentVolumeClaim 将引用我们创建的 PersistentVolume。因此，在部署 StatefulSet 管理的每个 Pod 时，都会绑定一个 PersistentVolumeClaim 中定义的 PersistentVolume。

你可以在工作负载创建期间或之后为 StatefulSet 配置存储。

以下步骤描述了如何将现有存储分配给新的 StatefulSet：

1. 点击 **☰ > 集群管理**。
1. 转到要为 StatefulSet 配置存储的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**工作负载 > StatefulSets**。
1. 单击**创建**。
1. 选择要部署工作负载的命名空间。
1. 输入 StatefulSet 的名称。
1. 在**卷声明模板**选项卡上，单击**添加声明模板**。
1. 单击**使用现有的持久卷**。
1. 在**持久卷**字段中，选择你创建的持久卷。
1. 在**挂载点**字段中，输入工作负载将用于访问卷的路径。
1. 点击**启动**。

**结果**：当工作负载被部署时，它会向 Kubernetes master 请求指定的磁盘空间。如果在部署工作负载时具有指定资源的 PV 是可用的，则 Kubernetes master 会将 PV 绑定到 PVC。

以下步骤描述了如何将持久存储分配给现有工作负载：

1. 点击 **☰ > 集群管理**。
1. 转到要为 StatefulSet 配置存储的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**工作负载 > StatefulSets**。
1. 转到要添加持久存储的工作负载。单击 **⋮ > 编辑**。
1. 在**卷声明模板**选项卡上，单击**添加声明模板**。
1. 单击**使用现有的持久卷**。
1. 在**持久卷**字段中，选择你创建的持久卷。
1. 在**挂载点**字段中，输入工作负载将用于访问卷的路径。
1. 点击**启动**。

**结果**：工作负载将向 Kubernetes master 请求指定的磁盘空间。如果在部署工作负载时具有指定资源的 PV 是可用的，则 Kubernetes master 会将 PV 绑定到 PVC。
