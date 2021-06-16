---
title: 创建集群
description: 本节说明了如何在 Rancher 中配置 vSphere 凭证，在 vSphere 中创建节点以及在这些节点上启动 Kubernetes 集群。
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
  - 创建集群
  - 创建节点和集群
  - vSphere
  - 创建集群
---

## 概述

在本节中，您将学习如何使用 Rancher 在 vSphere 中安装 RKE Kubernetes 集群。

首先，您将在 Rancher 中设置您的 vSphere 云凭证。然后，您将使用您的云凭证创建一个节点模板，Rancher 将使用该模板在 vSphere 中配置新节点。

然后您将在 Rancher 中创建一个 vSphere 集群，在配置新集群时，您将为其定义节点池。每个节点池都会有一个 etcd、controlplane 或 worker 的 Kubernetes 角色。Rancher 将在新节点上安装 RKE Kubernetes，它将用节点池定义的 Kubernetes 角色来设置每个节点。

## 先决条件

本节介绍了使用 vSphere 在 Rancher 中创建节点和集群需要的必要条件。该节点模板的文档使用 vSphere Web Services API 6.5 版本中进行了测试。

### 在 vSphere 中创建凭证

在继续创建集群之前，必须确保您的 vSphere 账户拥有足够的权限。当您设置节点模板时，该模板将需要使用这些 vSphere 凭证。

有关如何在 vSphere 中创建具有所需权限的用户，请参考此[使用指南](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/creating-credentials/_index)。通过这些步骤您将创建出需要提供给 Rancher 的用户名和密码，从而允许 Rancher 在 vSphere 中创建资源。

### 网络权限

必须确保运行 Rancher 的节点能够建立以下网络连接：

- 能够访问 vCenter 服务中的 vSphere API（通常使用端口： 443/TCP）。
- 能够访问位于实例化虚拟机的所有 ESXi 节点上的 Host API（端口 443/TCP）(_仅在使用 ISO 创建节点时需要_)。
- 能够访问虚拟机的端口 22/TCP 和 2376/TCP。

请参照[节点网络需求](/docs/rancher2.5/cluster-provisioning/node-requirements/_index)来获取详细的端口需求。

### 适用于 vSphere API 访问的有效 ESXi 许可证

vSphere 服务器必须具生效的，经过评估的 ESXi 许可证。免费的 ESXi 许可证不支持 API 访问。

## 使用 vSphere 创建集群(new)

### Rancher v2.2.0+ 版本

#### 1. 创建云凭证

1. 在 Rancher 用户界面中，单击右上角的用户个人资料按钮，然后单击**云凭证**。
1. 单击**添加云凭证**，进入云凭证信息页面。
1. 输入云凭证名称。
1. 选择云凭证类型，在**云凭证类型**选项中，选择**vSphere**。
1. 填写您的 vSphere 访问密钥。
1. 单击**创建**。

**结果：** 您已经创建了用于配置集群中节点的云凭证，您可以将这些云凭证用于其他节点模板或其他集群。

#### 2. 使用云凭证和 vSphere 信息创建节点模板

为 vSphere 创建节点模板将允许 Rancher 在 vSphere 中配置新节点。节点模板可以为其他集群重复使用。

1. 在 Rancher UI 中，单击右上角的用户配置文件按钮，然后单击 Node Templates。
1. 单击添加模板。
1. 填写 vSphere 的节点模板。有关填写表格的帮助，请参阅 vSphere 节点模板配置参考。请参考配置参考的最新版本，该版本小于或等于您的 Rancher 版本。
   - v2.3.3
   - v2.3.0
   - v2.2.0

#### 使用节点模板创建一个具有节点池的集群

在所有三个节点角色（worker、etcd 和 controlplane）都出现之前，集群不会开始配置。

1. 导航至全局视图中的集群。
1. 单击添加集群并选择 vSphere 基础架构提供商。
1. 输入集群名称。
1. 使用成员角色为集群配置用户授权。单击添加成员以添加可以访问集群的用户。使用 Role 下拉菜单为每个用户设置权限。
1. 使用集群选项选择将安装的 Kubernetes 版本，将使用什么网络提供商，以及是否要启用项目网络隔离。要查看更多集群选项，请单击 "显示高级选项"。有关配置集群的帮助，请参考 RKE 集群配置参考。
1. 如果以后要动态配置持久性存储或其他基础设施，则需要通过修改集群 YAML 文件来启用 vSphere 云提供商。有关详细信息，请参阅本节。
1. 将一个或多个节点池添加到集群。每个节点池使用节点模板来供应新节点。有关节点池的更多信息，包括为节点分配 Kubernetes 角色的最佳实践，请参阅本节。
1. 检查您的选项以确认它们是否正确。然后单击 "创建"。

#### 结果

- 您的集群已创建并进入为 **Provisioning** 的状态。Rancher 正在启动您的集群。
- 您可以在集群的状态更新为 **Active** 后访问它。
- Rancher 为活动的集群分配了两个项目，即 `Default`（包含命名空间 `default`）和 `System`（包含命名空间 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果命名空间存在）。

### Rancher v2.2.0+ 之前的版本

1. 导航至全局视图中的集群。
1. 单击添加集群并选择 vSphere 基础架构提供商。
1. 输入集群名称。
1. 使用成员角色为集群配置用户授权。单击添加成员以添加可以访问集群的用户。使用 Role 下拉菜单为每个用户设置权限。
1. 使用集群选项选择将安装的 Kubernetes 版本，将使用什么网络提供商，以及是否要启用项目网络隔离。要查看更多集群选项，请单击 "显示高级选项"。有关配置集群的帮助，请参考 RKE 集群配置参考。
1. 如果以后要动态配置持久性存储或其他基础设施，则需要通过修改集群 YAML 文件来启用 vSphere 云提供商。有关详细信息，请参阅本节。
1. 将一个或多个节点池添加到集群。每个节点池使用节点模板来供应新节点。有关节点池的更多信息，包括为节点分配 Kubernetes 角色的最佳实践，请参阅本节。1. 填写 vSphere 的节点模板。有关填写表格的帮助，请参阅 vSphere 节点模板配置参考。请参考配置参考的最新版本，该版本小于或等于您的 Rancher 版本。
   - v2.0.4
   - v2.0.4 之前
1. 检查您的选项以确认它们是否正确。然后单击 "创建"。

## 使用 vSphere 创建集群

本节介绍了如何使用 Rancher UI 设置 vSphere 凭证，节点模板和 vSphere 集群。

## 可选步骤

创建集群后，您可以通过 Rancher UI 访问它。作为最佳实践，我们建议同时设置以下访问集群的替代方法：

- **通过 kubectl CLI 访问集群：** 请按照[这些步骤](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 访问您的集群。在这种情况下，您将通过 Rancher Server 的身份验证代理进行身份验证，然后 Rancher 会将您连接到下游集群。此方法使您无需 Rancher UI 即可管理集群。

- **通过 kubectl CLI 和授权的集群地址访问您的集群：** 请按照[这些步骤](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 直接访问您的集群，而不需要通过 Rancher 进行认证。我们建议您设定此方法访问集群，这样在您无法连接 Rancher 时您仍然能够访问集群。
