---
title: DigitalOcean
description: 使用 Rancher 在 DigitalOcean 中创建 Kubernetes 集群。
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
  - DigitalOcean
---

## 概述

首先，您将在 Rancher 中设置您的 DigitalOcean 云证书。然后，您将使用您的云凭证创建一个节点模板，Rancher 将使用该模板在 DigitalOcean 中配置新节点。

然后，您将在 Rancher 中创建一个 DigitalOcean 集群，在配置新集群时，您将为其定义节点池。每个节点池都会有一个 etcd、controlplane 或 worker 的 Kubernetes 角色。Rancher 将在新节点上安装 RKE Kubernetes，它将用节点池定义的 Kubernetes 角色来设置每个节点。

## 创建 DigitalOcean 集群

### v2.2.0+

#### 1. 创建云凭证

1. 在 Rancher UI 中，单击右上角的用户配置文件按钮，然后单击 Cloud Credentials。
1. 单击添加云凭证。
1. 输入云凭证的名称。
1. 在云凭证类型字段中，选择 DigitalOcean。
1. 输入您的 DigitalOcean 凭证。
1. 单击创建。

结果：您已经创建了云凭证，将用于供应集群中的节点。您已创建了云凭证，该凭证将用于在集群中配置节点。您可以为其他节点模板或在其他集群中重复使用这些凭证。

#### 2. 使用您的云凭证创建节点模板

为 Azure 创建节点模板将允许 Rancher 在 Azure 中配置新节点。节点模板可以为其他集群重复使用。

1. 在 Rancher UI 中，单击右上角的用户配置文件按钮，然后单击节点模板。
2. 单击 "添加模板"。
3. 填写 Azure 的节点模板。有关填写帮助，请参阅 Azure 节点模板配置。

结果：完成创建节点模板看，可以在集群创建过程中使用这个模板。

#### 3. 使用节点模板创建一个具有节点池的集群

在所有三个节点角色（worker、etcd 和 controlplane）都出现之前，集群不会开始配置。

1. 在`集群列表`界面中，单击`添加集群`。

1. 选择 **DigitalOcean**。

1. 输入**集群名称**。

1. 通过**成员角色**来设置用户访问集群的权限。

   - 单击**添加成员**把需要访问这个集群的用户添加到成员列表中。
   - 在**角色**下拉菜单中选择每个用户的角色，每个角色对应不同的权限。

1. 使用**集群选项**设置 Kubernetes 的版本，网络插件以及是否要启用项目网络隔离。要查看更多集群选项，请单击**显示高级选项**。

1. 将一个或多个节点池添加到您的集群。

1. 检查您填写的信息以确保填写正确，然后单击 **创建**。

结果：

- 您的集群已创建并进入为 **Provisioning** 的状态。Rancher 正在启动您的集群。
- 您可以在集群的状态更新为 **Active** 后访问它。
- Rancher 为活动的集群分配了两个项目，即 `Default`（包含命名空间 `default`）和 `System`（包含命名空间 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果命名空间存在）。

### v2.2.0 之前的版本

1. 在`集群列表`界面中，单击`添加集群`。

1. 选择 **DigitalOcean**。

1. 输入**集群名称**。

1. 通过**成员角色**来设置用户访问集群的权限。

   - 单击**添加成员**把需要访问这个集群的用户添加到成员列表中。
   - 在**角色**下拉菜单中选择每个用户的角色，每个角色对应不同的权限。

1. 使用**集群选项**设置 Kubernetes 的版本，网络插件以及是否要启用项目网络隔离。要查看更多集群选项，请单击**显示高级选项**。

1. 将一个或多个节点池添加到您的集群。

1. 检查您填写的信息以确保填写正确，然后单击 **创建**。

结果：

- 您的集群已创建并进入为 **Provisioning** 的状态。Rancher 正在启动您的集群。
- 您可以在集群的状态更新为 **Active** 后访问它。
- Rancher 为活动的集群分配了两个项目，即 `Default`（包含命名空间 `default`）和 `System`（包含命名空间 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果命名空间存在）。

## 可选步骤

创建集群后，您可以通过 Rancher UI 访问它。作为最佳实践，我们建议同时设置以下访问集群的替代方法：

- **通过 kubectl CLI 访问集群：** 请按照[这些步骤](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 访问您的集群。在这种情况下，您将通过 Rancher Server 的身份验证代理进行身份验证，然后 Rancher 会将您连接到下游集群。此方法使您无需 Rancher UI 即可管理集群。

- **通过 kubectl CLI 和授权的集群地址访问您的集群：** 请按照[这些步骤](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 直接访问您的集群，而不需要通过 Rancher 进行认证。我们建议您设定此方法访问集群，这样在您无法连接 Rancher 时您仍然能够访问集群。
