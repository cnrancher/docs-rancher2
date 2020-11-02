---
title: Azure
description: 使用 Rancher 在 Azure 中创建 Kubernetes 集群。
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
  - 创建集群
  - 创建节点和集群
  - Azure
---

## 创建 Azure 集群

在本节中，您将学习如何通过 Rancher 在 Azure 中设置 Kubernetes 集群。在此过程中，Rancher 将在 Azure 中配置新节点。
使用 Rancher 在 Azure 中创建 Kubernetes 集群。

1.  访问`集群列表`界面中，单击`添加集群`。

2.  选择**Azure**。

3.  输入**集群名称**。

4.  通过**成员角色**设置用户访问集群的权限。

    - 单击**添加成员**，把需要访问这个集群的用户添加到成员列表中。
    - 在**角色**下拉菜单中选择每个用户的角色，每个角色对应不同的权限。

5.  使用**集群选项**设置 Kubernetes 的版本，网络插件以及是否要启用项目网络隔离。更多信息，请参见[集群配置参考](/docs/rancher2/cluster-provisioning/rke-clusters/options/_index)

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

### 可选的后续步骤

创建集群后，您可以通过 Rancher UI 访问它。作为最佳实践，我们建议设置这些替代方式来访问您的集群。

- **使用 kubectl CLI 访问您的集群：**按照[这些步骤](/docs/rancher2/cluster-admin/cluster-access/kubectl/_index)在您的工作站上使用 kubectl 访问集群。在这种情况下，你将通过 Rancher 服务器的认证代理进行认证，然后 Rancher 将把你连接到下游集群。这种方法可以让您在没有 Rancher 用户界面的情况下管理集群。
- **使用 kubectl CLI 访问您的集群，使用授权的集群端点：**按照[这些步骤](/docs/rancher2/cluster-admin/cluster-access/kubectl/_index)直接使用 kubectl 访问您的集群，而无需通过 Rancher 进行身份验证。我们建议设置这种替代方法来访问您的集群，这样在您无法连接到 Rancher 的情况下，您仍然可以访问集群。

## 创建 Azure 节点模板

在使用 Azure 等云基础设施在 Rancher 中创建**节点模板**之前，我们必须配置 Rancher 以允许操作 Azure 订阅中的资源。

要做到这一点，我们将首先在 Azure **活动目录 (AD)**中创建一个新的 Azure **服务委托人 (SP)**，在 Azure 中，它是一个拥有管理 Azure 资源权限的应用用户。

以下是创建服务委托人时需要运行的模板`az cli`脚本，在这里你需要输入 SP 名称、角色和范围：

```
az ad sp create-for-rbac --name="<Rancher ServicePrincipal name>" --role="Contributor" --scopes="/subscriptions/<subscription Id>"
```

这个服务委托人的创建会返回三个标识信息，_应用 ID，也叫客户端 ID_，_客户端秘密_，_租户 ID_。这些信息将在下面添加**节点模板**的部分中使用。

### 创建模板

1. 单击 **添加节点模板**。

2. 完成 **Azure 选项** 表单的填写。

3. 单击**创建**。

结果：节点模板可以在集群创建过程中使用。节点模板可以在集群创建过程中使用。

## 模板配置

- **Account Access**存储了您的帐户信息，以便使用 Azure 进行身份验证。注意：从 v2.2.0 开始，账户访问信息以云凭证的形式存储。云凭证存储为 Kubernetes 的秘密。多个节点模板可以使用同一个云凭证。您可以使用现有的云凭证或创建新的云凭证。要创建新的云凭证，请输入名称和账户访问数据，然后单击创建。

- **Placement**设置您的集群托管的地理区域和其他位置元数据。

- **Network**配置您的集群中使用的网络。

- **Instance**自定义您的虚拟机配置。

- **Docker 守护进程**配置选项包括：

  - **Labels**有关标签的信息，请参阅 Docker 对象标签文档。

  - **Docker Engine Install URL**。确定实例上将安装什么 Docker 版本。注意：如果您使用的是 RancherOS，请在您要使用的 RancherOS 版本上使用 sudo ros engine list 检查有哪些 Docker 版本，因为配置的默认 Docker 版本可能不可用。如果在其他操作系统上安装 Docker 时遇到问题，请尝试使用配置的 Docker 引擎安装网址手动安装 Docker，以排除故障。

  - **Registry mirrors**Docker 注册表镜像将被 Docker 守护进程使用。

  - 其他高级选项：请参考[Docker 官方文档](https://docs.docker.com/engine/reference/commandline/dockerd/)。

## 可选步骤

创建集群后，您可以通过 Rancher UI 访问它。作为最佳实践，我们建议同时设置以下访问集群的替代方法：

- **通过 kubectl CLI 访问集群：** 请按照[这些步骤](/docs/rancher2/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 访问您的集群。在这种情况下，您将通过 Rancher Server 的身份验证代理进行身份验证，然后 Rancher 会将您连接到下游集群。此方法使您无需 Rancher UI 即可管理集群。

- **通过 kubectl CLI 和授权的集群地址访问您的集群：** 请按照[这些步骤](/docs/rancher2/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 直接访问您的集群，而不需要通过 Rancher 进行认证。我们建议您设定此方法访问集群，这样在您无法连接 Rancher 时您仍然能够访问集群。
