---
title: vSphere
description: 本文介绍了配置vSphere的操作步骤。
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
  - RKE
  - 配置选项
  - 云服务提供商
  - vSphere
---

## 概述

要在 vSphere 中使用 RKE CLI 配置 Kubernetes 集群，必须启用 vSphere 云提供商。

还必须启用 vSphere 云提供商才能使用 Rancher 配置集群，Rancher 在配置 [RKE 集群时使用 RKE 作为库](/docs/rancher2/cluster-provisioning/rke-clusters/_index)。

[vSphere Cloud Provider](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/)与 VMware 基础架构（vCenter 或独立的 ESXi 服务器）交互，以便为 Kubernetes 集群中的持久卷配置和管理存储。

本节介绍如何启用 vSphere 云提供商。您需要在集群 YAML 文件中使用 `cloud_provider` 指令。

## 相关链接

- **配置：**有关 RKE 中 vSphere 配置的详细信息，请参阅[配置参考](/docs/rke/config-options/cloud-providers/vsphere/config-reference/_index)
- **故障排除：**有关在启用 vSphere 云提供商的情况下对集群进行故障排除的指导，请参阅 [故障排除部分。](/docs/rke/config-options/cloud-providers/vsphere/troubleshooting/_index)
- **存储：** 如果您正在设置存储，请参阅 [关于 Kubernetes 存储的官方 vSphere 文档](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/) 或 [关于持久卷的官方 Kubernetes 文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) 如果您正在使用 Rancher，请参阅 [关于在 vSphere 中供应存储的 Rancher 文档](/docs/rancher2/cluster-admin/volumes-and-storage/examples/vsphere/_index)。
- **对于 Rancher 用户：**请参考 Rancher 文档中关于[创建 vSphere Kubernetes 集群](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/vsphere/_index)和[供应存储](/docs/rancher2/cluster-admin/volumes-and-storage/examples/vsphere/_index)的内容。

## 先决条件

- 凭证：您需要拥有 vCenter/ESXi 用户帐户的凭证，该帐户具有允许云提供商与 vSphere 基础架构交互以供应存储的权限。  请参阅 [本文档](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/vcp-roles.html)，在 vCenter 中创建和分配具有所需权限的角色。
- 集群中的所有节点必须在 Guest OS 中运行 **VMware Tools**。
- 磁盘 UUID：所有节点必须配置磁盘 UUID。这是必需的，这样连接的 VMDK 才能向虚拟机呈现一致的 UUID，使磁盘能够正确挂载。请参阅[启用磁盘 UUID](/docs/rke/config-options/cloud-providers/vsphere/enabling-uuid/_index)一节。

## 使用 RKE CLI 启用 vSphere Provider

要在集群中启用 vSphere Cloud Provider，必须将顶层的`cloud_provider`指令添加到集群配置文件中，将`name`属性设置为`vsphere`，并添加包含与您的基础架构相匹配的配置的`vsphereCloudProvider`指令。详见[配置参考](/docs/rke/config-options/cloud-providers/vsphere/config-reference/_index)。
