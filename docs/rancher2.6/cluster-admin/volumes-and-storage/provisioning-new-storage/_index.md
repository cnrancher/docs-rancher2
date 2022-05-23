---
title: 在 Rancher 中动态配置新存储
weight: 2
---

本文介绍如何为 Rancher 中的工作负载配置新的持久存储。

本节假设你了解 Kubernetes 的存储类和持久卷声明的概念。如需更多信息，请参阅[存储的工作原理](../how-storage-works)。

新存储通常由 Amazon EBS 等云提供商提供。但是，新存储不一定要在云中。

如果你有一个块存储池并且不想使用云提供商，你可以使用 Longhorn 为 Kubernetes 集群提供持久存储。详情请参见[本页面]({{<baseurl>}}/rancher/v2.6/en/longhorn)。

要为你的工作负载配置新存储，请执行以下步骤：

1. [添加一个存储类并将其配置为使用你的存储](#1-add-a-storage-class-and-configure-it-to-use-your-storage)
2. [为使用 StatefulSet 部署的 Pod 使用存储类](#2-use-the-storage-class-for-pods-deployed-with-a-statefulset)

### 前提

- 设置持久存储需要`管理卷`的[角色]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#project-role-reference)。
- 如果你要为云集群配置存储，则存储和集群主机必须使用相同的云提供商。
- 必须启用云提供商。有关启用云提供商的详细信息，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/)。
- 确保你的存储卷插件可以启用。

默认情况下启用以下存储卷插件：

| 名称 | 插件 |
--------|----------
| Amazon EBS Disk | `aws-ebs` |
| AzureFile | `azure-file` |
| AzureDisk | `azure-disk` |
| Google Persistent Disk | `gce-pd` |
| Longhorn | `flex-volume-longhorn` |
| VMware vSphere Volume | `vsphere-volume` |
| 本地 | `local` |
| 网络文件系统 | `nfs` |
| hostPath | `host-path` |

如果你的存储卷插件没有在上述列表中，你需要[使用功能开关来启用不受支持的存储驱动]({{<baseurl>}}/rancher/v2.6/en/installation/resources/feature-flags/enable-not-default-storage-drivers/)。

### 1. 添加一个存储类并将其配置为使用你的存储

这些步骤描述了如何在集群级别设置存储类：

1. 点击 **☰ > 集群管理**。
1. 转到要动态配置持久存储卷的集群，然后单击 **Explore**。
1. 单击**存储 > 存储类**。
1. 单击**创建**。
1. 输入存储类的名称。
1. 从 **Provisioner** 下拉列表中，选择要用于动态配置存储卷的服务。例如，如果你有一个 Amazon EC2 集群并且想要使用云存储，请使用 `Amazon EBS Disk`。
1. 在**参数**选项卡中，填写服务用于动态配置存储卷所需的信息。每个卷插件都需要不同的信息来动态配置存储卷。有关如何获取此信息的帮助，请参阅服务文档。
1. 单击**创建**。

**结果**：存储类可供 PVC 使用。

有关存储类参数的完整信息，请参阅官方 [Kubernetes 文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#parameters)。

### 2. 为使用 StatefulSet 部署的 Pod 使用存储类

StatefulSet 管理 Pod 的部署和扩展，同时为每个 Pod 维护一个粘性标识。在这个 StatefulSet 中，我们将配置一个 VolumeClaimTemplate。StatefulSet 管理的每个 Pod 都将部署一个基于此 VolumeClaimTemplate 的 PersistentVolumeClaim。PersistentVolumeClaim 将引用我们创建的 StorageClass。因此，在部署 StatefulSet 管理的每个 Pod 时，都会使用 PersistentVolumeClaim 中定义的 StorageClass 来绑定到动态配置的存储。

1. 点击 **☰ > 集群管理**。
1. 转到要将 StorageClass 用于工作负载的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**工作负载**。
1. 单击**创建**。
1. 单击 **StatefulSet**。
1. 在**卷声明模板**选项卡上，单击**添加声明模板**。
1. 输入持久卷的名称。
1. 在*存储类*\*字段中，选择将为此 StatefulSet 管理的 pod 动态配置存储的 StorageClass。
1. 在**挂载点**字段中，输入工作负载将用于访问卷的路径。
1. 点击**启动**。

**结果**：StatefulSet 管理的每个 Pod 部署完成后，都会向 Kubernetes master 请求指定的磁盘空间。如果在部署工作负载时具有指定资源的 PV 是可用的，则 Kubernetes master 会将 PV 绑定到具有兼容 PVC 的 Pod。

要将 PVC 附加到现有工作负载，

1. 点击 **☰ > 集群管理**。
1. 转到要将 StorageClass 用于工作负载的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**工作负载**。
1. 单击 **⋮ > 编辑配置**，转到使用由 StorageClass 配置的存储的工作负载。
1. 在**卷声明模板**中，单击**添加声明模板**。
1. 输入持久卷名称。
1. 在*存储类*\*字段中，选择将为此 StatefulSet 管理的 pod 动态配置存储的 StorageClass。
1. 在**挂载点**字段中，输入工作负载将用于访问卷的路径。
1. 单击**保存**。

**结果**：工作负载将向 Kubernetes master 请求指定的磁盘空间。如果在部署工作负载时具有指定资源的 PV 是可用的，则 Kubernetes master 会将 PV 绑定到 PVC。否则，Rancher 将配置新的持久存储。