---
title: Azure
description: 使用 Rancher 在 Azure 中创建 Kubernetes 集群。
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
  - Azure
---

## 概述

在本节中，您将学习如何通过 Rancher 在 Azure 中安装通过 RKE 创建的集群。

首先，您将在 Rancher 中设置您的 Azure 凭证。然后，您将使用您的凭证创建一个节点模板，Rancher 将使用该模板在 Azure 中配置新节点。

然后，你将在 Rancher 中创建一个 Azure 集群，在配置新集群时，你将为其定义节点池。每个节点池都会有一个 etcd、controlplane 或 worker 的 Kubernetes 角色。Rancher 将在新节点上安装 Kubernetes，它将用节点池定义的 Kubernetes 角色来设置每个节点。

有关配置 Rancher 将在 Azure 节点上安装的 Kubernetes 集群的更多信息，请参考 [RKE 集群配置参考](/docs/rancher2.5/cluster-provisioning/rke-clusters/options/_index)。

有关配置 Azure 节点模板的更多信息，请参阅 [Azure 节点模板配置参考](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/azure/azure-node-template-config/_index)

## 准备工作

在使用 Azure 等云基础设施在 Rancher 中创建**节点模板**之前，我们必须配置 Rancher 以允许操作 Azure 订阅中的资源。

要做到这一点，我们将首先在 Azure **活动目录 (AD)**中创建一个新的 Azure **服务委托人 (SP)**，在 Azure 中，它是一个拥有管理 Azure 资源权限的应用用户。

以下是创建服务委托人时需要运行的模板`az cli`脚本，在这里你需要输入 SP 名称、角色和范围：

```
az ad sp create-for-rbac \
  --name="<Rancher ServicePrincipal name>" \
  --role="Contributor" \
  --scopes="/subscriptions/<subscription Id>"
```

这个服务委托人的创建会返回三个标识信息，_应用 ID，也叫客户端 ID_，_客户端密钥_，_租户 ID_。这些信息将在下面添加**节点模板**的部分中使用。

## 创建 Azure 集群

### v2.2.0+

#### 1. 创建云凭证

1. 在 Rancher UI 中，单击右上角的用户配置文件按钮，然后单击 Cloud Credentials。
1. 单击添加云凭证。
1. 输入云凭证的名称。
1. 在云凭证类型字段中，选择 Azure。
1. 输入您的 Azure 凭证。
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

1.  访问`集群列表`界面中，单击`添加集群`。

2.  选择**Azure**。

3.  输入**集群名称**。

4.  通过**成员角色**设置用户访问集群的权限。

    - 单击**添加成员**，把需要访问这个集群的用户添加到成员列表中。
    - 在**角色**下拉菜单中选择每个用户的角色，每个角色对应不同的权限。

5.  使用**集群选项**设置 Kubernetes 的版本，网络插件以及是否要启用项目网络隔离。更多信息，请参见[集群配置参考](/docs/rancher2.5/cluster-provisioning/rke-clusters/options/_index)

6.  将一个或多个节点池添加到您的集群。

    **节点池**是基于节点模板的节点的集合。节点模板定义节点的配置，例如要使用的操作系统，CPU 数量和内存量。每个节点池必须分配一个或多个节点角色。

    :::important 注意：

    - 每个节点角色（即 `etcd`，`Control Plane` 和 `Worker`）应分配给不同的节点池。尽管可以为一个节点池分配多个节点角色，但是不应对生产集群执行此操作。
    - 推荐的设置是拥有一个具有`etcd`节点角色且数量为 3 的节点池，一个具有`Control Plane`节点角色且数量至少为 2 的节点池，以及具有`Worker`节点角色且数量为 1 的节点池。关于 `etcd` 节点角色，请参考 [etcd 管理指南](https://etcd.io/#optimal-cluster-size)。

    :::

7.  **可选：**添加额外的节点池。

8.  检查您的选项以确认其正确性。然后单击**创建**。

#### 结果

- 您的集群已创建并进入为 **Provisioning** 的状态，Rancher 正在启动您的集群。
- 您可以在集群的状态更新为 **Active** 后访问集群。
- Rancher 为活动的集群分配了两个项目，即 `Default`项目（包含命名空间 `default`）和 `System`项目（包含命名空间 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`）。

### v2.2.0 之前的版本

1.  访问`集群列表`界面中，单击`添加集群`。

2.  选择**Azure**。

3.  输入**集群名称**。

4.  通过**成员角色**设置用户访问集群的权限。

    - 单击**添加成员**，把需要访问这个集群的用户添加到成员列表中。
    - 在**角色**下拉菜单中选择每个用户的角色，每个角色对应不同的权限。

5.  使用**集群选项**设置 Kubernetes 的版本，网络插件以及是否要启用项目网络隔离。更多信息，请参见[集群配置参考](/docs/rancher2.5/cluster-provisioning/rke-clusters/options/_index)

6.  将一个或多个节点池添加到您的集群。

    **节点池**是基于节点模板的节点的集合。节点模板定义节点的配置，例如要使用的操作系统，CPU 数量和内存量。每个节点池必须分配一个或多个节点角色。

    :::important 注意：

    - 每个节点角色（即 `etcd`，`Control Plane` 和 `Worker`）应分配给不同的节点池。尽管可以为一个节点池分配多个节点角色，但是不应对生产集群执行此操作。
    - 推荐的设置是拥有一个具有`etcd`节点角色且数量为 3 的节点池，一个具有`Control Plane`节点角色且数量至少为 2 的节点池，以及具有`Worker`节点角色且数量为 1 的节点池。关于 `etcd` 节点角色，请参考 [etcd 管理指南](https://etcd.io/#optimal-cluster-size)。

    :::

7.  **可选：**添加额外的节点池。

8.  检查您的选项以确认其正确性。然后单击**创建**。

结果：

- 您的集群已创建并进入为 **Provisioning** 的状态，Rancher 正在启动您的集群。
- 您可以在集群的状态更新为 **Active** 后访问集群。
- Rancher 为活动的集群分配了两个项目，即 `Default`项目（包含命名空间 `default`）和 `System`项目（包含命名空间 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`）。

## 可选的后续步骤

创建集群后，您可以通过 Rancher UI 访问它。作为最佳实践，我们建议设置这些替代方式来访问您的集群。

- **使用 kubectl CLI 访问您的集群：**按照[这些步骤](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/_index)在您的工作站上使用 kubectl 访问集群。在这种情况下，你将通过 Rancher 服务器的认证代理进行认证，然后 Rancher 将把你连接到下游集群。这种方法可以让您在没有 Rancher 用户界面的情况下管理集群。
- **使用 kubectl CLI 访问您的集群，使用授权的集群端点：**按照[这些步骤](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/_index)直接使用 kubectl 访问您的集群，而无需通过 Rancher 进行身份验证。我们建议设置这种替代方法来访问您的集群，这样在您无法连接到 Rancher 的情况下，您仍然可以访问集群。
