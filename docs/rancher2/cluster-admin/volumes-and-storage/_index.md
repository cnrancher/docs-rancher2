---
title: 持久化存储
description: 在部署需要保留数据的应用程序时，您需要创建永久性存储。持久化存储允许您将应用程序数据存储在运行应用程序的 Pod 外部。即使应用程序的 Pod 发生故障，这种存储方法也可以使您维护应用程序数据。
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
  - 持久化存储
---

持久化存储允许您将应用程序数据存储在运行应用程序的 Pod 外部。如果应用程序的 Pod 发生故障，这种存储方法可以保护应用程序数据不受故障影响。在部署需要保留数据的应用程序时，您需要创建永久性存储。

本章节默认您已了解 Kubernetes 持久卷、持久卷声明和存储类的概念。请参阅[存储是如何工作的](/docs/rancher2/cluster-admin/volumes-and-storage/how-storage-works/_index)，获取更多相关信息。

## 先决条件

配置持久化存储，需要用拥有 `管理卷（Manage Volumes）` 权限的[角色](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)的用户。

如果要在基础设施提供商托管的集群中设置存储，则需要使来自同一个基础设施提供商的存储和集群主机。在 Rancher 中对接新的云存储，必须配置 Cloud Provider，关于如何配置的详细信息可以浏览[这里](/docs/rancher2/cluster-provisioning/rke-clusters/cloud-providers/_index)。

如果对接现有的存储，则无需配置启用基础设施提供商。

## 设置现有的存储

设置现有存储的总体流程如下：

1. 在基础架构提供商中启动持久化存储。
2. 添加一个持久卷（PV）指向上面启动的持久化存储。
3. 添加一个持久卷声明（PVC）指向上面添加的持久卷。
4. 把上面添加的 PVC 挂载到对应的工作负载。

更多的细节和要求，请参阅[这里](/docs/rancher2/cluster-admin/volumes-and-storage/attaching-existing-storage/_index)。

## 在 Rancher 中动态设置新存储

设置新存储的总体流程如下：

1. 添加一个存储类并配置其使用对应的存储提供商。
2. 添加一个持久卷声明（PVC）指向上面添加的存储类型。
3. 把上面添加的 PVC 挂载到对应的工作负载。

更多的细节和要求，请参阅[这里](/docs/rancher2/cluster-admin/volumes-and-storage/provisioning-new-storage/_index)。

## 存储设置的实例

我们提供了一些例子来展示如何进行存储设置：[NFS](/docs/rancher2/cluster-admin/volumes-and-storage/examples/nfs/_index)，[vSphere](/docs/rancher2/cluster-admin/volumes-and-storage/examples/vsphere/_index) 以及[亚马逊 EBS](/docs/rancher2/cluster-admin/volumes-and-storage/examples/ebs/_index)。

## GlusterFS 卷

在 [Rancher 启动的 Kubernetes 集群](/docs/rancher2/cluster-provisioning/rke-clusters/_index)里，将数据存储到 GlusterFS 卷时，您可能会遇到一个问题：在重启 `kubelet` 之后，Pod 无法安装卷。关于如何防止这种情况发生的相关细节，可以参阅[这里](/docs/rancher2/cluster-admin/volumes-and-storage/glusterfs-volumes/_index)。

## iSCSI 卷

在 [Rancher 启动的 Kubernetes 集群](/docs/rancher2/cluster-provisioning/rke-clusters/_index)里，将数据存储到 iSCSI 卷时，您可能会遇到一个问题：`kubelet` 无法自动连接 iSCSI 卷。关于如何解决这个问题的相关细节，可以参阅[这里](/docs/rancher2/cluster-admin/volumes-and-storage/iscsi-volumes/_index)。

## HostPath 卷

在创建 HostPath 卷之前，您需要在您的集群配置文件中设置 [extra_bind](/docs/rke/config-options/services/services-extras/_index)。这会将这些路径作为卷挂载到您的 `kubelet` 中，然后可以在工作负载中通过 hostPath 卷使用它们。

## 相关链接

- [Kubernetes 存储文档](https://kubernetes.io/docs/concepts/storage/)。
