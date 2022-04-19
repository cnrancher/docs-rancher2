---
title: "Kubernetes 持久存储：卷和存储类"
description: "了解在 Kubernetes 中创建持久存储的两种方式：持久卷和存储类"
weight: 2031
---
在部署需要保​​留数据的应用时，你需要创建持久存储。持久存储允许你在运行应用的 pod 之外存储应用数据。即使运行应用的 pod 发生故障，这种存储方式也能让你保留应用数据。

本文假设你已了解 Kubernetes 的持久卷、持久卷声明和存储类的概念。如需更多信息，请参阅[存储的工作原理](./how-storage-works)。

### 前提

设置持久存储需要`管理卷`的[角色]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#project-role-reference)。

如果你要为云集群配置存储，则存储和集群主机必须使用相同的云提供商。

要使用 Rancher 配置新存储，则必须启用云提供商。有关启用云提供商的详细信息，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/)。

如果要将现有的持久存储连接到集群，则不需要启用云提供商。

### 设置现有存储

设置现有存储的总体流程如下：

1. 设置你的持久存储。可以是云存储或你自己的存储。
2. 添加引用持久存储的持久卷 (PV)。
3. 添加引用 PV 的持久卷声明 (PVC)。
4. 将 PVC 挂载为工作负载中的卷。

有关详细信息和先决条件，请参阅[此页面](./attaching-existing-storage)。

### 在 Rancher 中动态配置新存储

配置新存储的总体流程如下：

1. 添加一个 StorageClass 并将它配置为使用你的存储提供商。StorageClass 可以引用云存储或你自己的存储。
2. 添加引用存储类的持久卷声明 (PVC)。
3. 将 PVC 挂载为工作负载的卷。

有关详细信息和先决条件，请参阅[此页面](./provisioning-new-storage)。

### Longhorn 存储

[Longhorn](https://longhorn.io/) 是一个轻量级、可靠、易用的 Kubernetes 分布式块存储系统。

Longhorn 是免费的开源软件。Longhorn 最初由 Rancher Labs 开发，现在正在作为云原生计算基金会的沙盒项目进行开发。它可以通过 Helm、kubectl 或 Rancher UI 安装在任何 Kubernetes 集群上。

如果你有块存储池，Longhorn 可以帮助你为 Kubernetes 集群提供持久存储，而无需依赖云提供商。有关 Longhorn 功能的更多信息，请参阅[文档](https://longhorn.io/docs/1.0.2/what-is-longhorn/)。

Rancher v2.5 简化了在 Rancher 管理的集群上安装 Longhorn 的过程。详情请参见[本页面]({{<baseurl>}}/rancher/v2.6/en/longhorn)。

### 配置存储示例

我们提供了如何使用 [NFS、](./examples/nfs) [vSphere](./examples/vsphere) 和 [Amazon EBS](./examples/ebs) 来配置存储的示例。

### GlusterFS 卷

在将数据存储在 GlusterFS 卷上的集群中，你可能会遇到重启 `kubelet` 后 pod 无法挂载卷的问题。有关避免此情况发生的详细信息，请参阅[此页面](./glusterfs-volumes)。

### iSCSI 卷

在将数据存储在 iSCSI 卷上的 [Rancher 启动的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)中，你可能会遇到 kubelet 无法自动连接 iSCSI 卷的问题。有关解决此问题的详细信息，请参阅[此页面](./iscsi-volumes)。

### hostPath 卷
在创建 hostPath 卷之前，你需要在集群配置中设置 [extra_bind]({{<baseurl>}}/rke/latest/en/config-options/services/services-extras/#extra-binds/)。这会将路径作为卷安装在你的 kubelet 中，可用于工作负载中的 hostPath 卷。

### 将 vSphere Cloud Provider 从树内迁移到树外

Kubernetes 正在逐渐不在树内维护云提供商。vSphere 有一个树外云提供商，可通过安装 vSphere 云提供商和云存储插件来使用。

有关如何从树内 vSphere 云提供商迁移到树外，以及如何在迁移后管理现有虚拟机，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/vsphere/out-of-tree)。

### 相关链接

- [Kubernetes 文档：存储](https://kubernetes.io/docs/concepts/storage/)
