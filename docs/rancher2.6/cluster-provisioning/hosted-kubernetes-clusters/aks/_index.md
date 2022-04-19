---
title: 创建 AKS 集群
shortTitle: Azure Kubernetes 服务
weight: 2115
---

你可以使用 Rancher 创建托管在 Microsoft Azure Kubernetes 服务 (AKS) 中的集群。

- [Microsoft Azure 中的先决条件](#prerequisites-in-microsoft-azure)
- [使用 Azure 命令行工具设置服务主体](#setting-up-the-service-principal-with-the-azure-command-line-tool)
  - [从 Azure 门户设置服务主体](#setting-up-the-service-principal-from-the-azure-portal)
- [1. 创建 AKS 云凭证](#1-create-the-aks-cloud-credentials)
- [2. 创建 AKS 集群](#2-create-the-aks-cluster)
- [基于角色的访问控制](#role-based-access-control)
- [AKS 集群配置参考](#aks-cluster-configuration-reference)
- [私有集群](#private-clusters)
- [同步](#syncing)
- [以编程方式创建 AKS 集群](#programmatically-creating-aks-clusters)

## Microsoft Azure 中的先决条件

> **注意**：
> 部署到 AKS 会产生费用。

若要与 Azure API 交互，AKS 集群需要 Azure Active Directory (AD) 服务主体。服务主体是动态创建和管理其他 Azure 资源所必需的，它为集群提供凭证来与 AKS 通信。有关服务主体的详细信息，请参阅 [AKS 文档](https://docs.microsoft.com/en-us/azure/aks/kubernetes-service-principal)。

在创建服务主体之前，你需要从 [Microsoft Azure 门户](https://portal.azure.com)获取以下信息：

- 订阅 ID
- 客户端 ID
- 客户端密码

以下介绍如何使用 Azure 命令行工具或 Azure 门户进行设置，从而满足先决条件。

### 使用 Azure 命令行工具设置服务主体

运行以下命令来创建服务主体：

```
az ad sp create-for-rbac --skip-assignment
```

结果应显示新服务主体的信息：

```
{
  "appId": "xxxx--xxx",
  "displayName": "<SERVICE-PRINCIPAL-NAME>",
  "name": "http://<SERVICE-PRINCIPAL-NAME>",
  "password": "<SECRET>",
  "tenant": "<TENANT NAME>"
}
```

你还需要向服务主体添加角色，以便它具有与 AKS API 通信的权限。它还需要访问权限才能创建和列出虚拟网络。

下面是将参与者角色分配给服务主体的示例命令。参与者可以管理 AKS 上的任何内容，但不能授予其他人访问权限：

```
az role assignment create \
  --assignee $appId \
  --scope /subscriptions/$<SUBSCRIPTION-ID>/resourceGroups/$<GROUP> \
  --role Contributor
```

你还可以通过合并两个命令，来创建服务主体并授予参与者权限。在此命令中，`scope` 需要提供 Azure 资源的完整路径：

```
az ad sp create-for-rbac \
  --scope /subscriptions/$<SUBSCRIPTION-ID>/resourceGroups/$<GROUP> \
  --role Contributor
```

### 从 Azure 门户设置服务主体

你还可以按照这些说明设置服务主体，并从 Azure 门户为它授予基于角色的访问权限。

1. 转到 Microsoft Azure 门户[主页](https://portal.azure.com)。

1. 单击 **Azure Active Directory**。
1. 单击 **App registrations**。
1. 单击 **New registration**。
1. 输入名称。这将是你服务主体的名称。
1. 可选：选择可以使用服务主体的账号。
1. 单击 **Register**。
1. 你现在应该能在 **Azure Active Directory > App registrations** 下看到服务主体的名称。
1. 单击你的服务主体的名称。记下应用 ID（也称为应用 ID 或客户端 ID），以便在预配 AKS 集群时使用。然后单击 **Certificates & secrets**。
1. 单击 **New client secret**。
1. 输入简短说明，选择过期时间，然后单击 **Add**。记下客户端密码，以便在预配 AKS 集群时使用它。

**结果**：你已经创建了一个服务主体，现在你能够在 **App registrations** 下的 **Azure Active Directory** 中找到它。你仍然需要向服务主体授予对 AKS 的访问权限。

要授予对服务主体基于角色的访问权限：

1. 点击左侧导航栏中的 **All Services**。然后单击 **Subscriptions**。
1. 单击要与 Kubernetes 集群关联的订阅的名称。记下订阅 ID，以便在预配 AKS 集群时使用它。
1. 单击 **Access Control (IAM)**。
1. 在 **Add role assignment** 中，单击 **Add**。
1. 在 **Role** 字段中，选择将有权访问 AKS 的角色。例如，你可以使用 **Contributor** 角色，该角色有权管理除授予其他用户访问权限之外的所有内容。
1. 在 **Assign access to** 字段中，选择 **Azure AD 用户、组或服务主体**。
1. 在 **Select** 字段中，选择服务主体的名称，然后单击 **Save**。

**结果**：你的服务主体现在可以访问 AKS。

## 1. 创建 AKS 云凭证

1. 在 Rancher UI 中，单击 **☰ > 集群管理**。
1. 单击**云凭证**。
1. 单击**创建**。
1. 单击 **Azure**。
1. 填写表单。有关填写表格的帮助，请参阅[配置参考]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/aks-config-reference/#cloud-credentials)。
1. 单击**创建**。

## 2. 创建 AKS 集群

使用 Rancher 配置你的 Kubernetes 集群。

1. 点击 **☰ > 集群管理**。
1. 在**集群**中，单击**创建**。
1. 单击 **Azure AKS**。
1. 填写表单。有关填写表格的帮助，请参阅[配置参考]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/aks-config-reference)。
1. 单击**创建**。

**结果**：集群已创建，并处于 **Provisioning** 状态。Rancher 已在你的集群中。

当集群状态变为 **Active** 后，你可访问集群。

## 基于角色的访问控制

在 Rancher UI 中配置 AKS 集群时，由于 RBAC 需要启用，因此 RBAC 不可配置。

注册或导入到 Rancher 的 AKS 集群需要 RBAC。

## AKS 集群配置参考

有关如何在 Rancher UI 配置 AKS 集群的更多信息，请参阅[配置参考]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/aks-config-reference)。

## 私有集群

通常情况下，无论集群是否为私有，AKS worker 节点都不会获得公共 IP。在私有集群中，control plane 没有公共端点。

Rancher 可以通过以下两种方式之一连接到私有 AKS 集群。

第一种方法是确保 Rancher 运行在与 AKS 节点相同的 [NAT](https://docs.microsoft.com/en-us/azure/virtual-network/nat-overview) 上。

第二种方法是运行命令向 Rancher 注册集群。配置集群后，你可以在任何能连接到集群的 Kubernetes API 的地方运行显示的命令。配置启用了私有 API 端点的 AKS 集群时，此命令将显示在弹出窗口中。

> **注意**：注册现有 AKS 集群时，集群可能需要一些时间（可能是数小时）才会出现在 `Cluster To register` 下拉列表中。不同区域的结果可能不同。

有关连接到 AKS 专用集群的详细信息，请参阅 [AKS 文档](https://docs.microsoft.com/en-us/azure/aks/private-clusters#options-for-connecting-to-the-private-cluster)。

## 同步

AKS 配置者可以在 Rancher 和提供商之间同步 AKS 集群的状态。有关其工作原理的技术说明，请参阅[同步]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/syncing)。

有关配置刷新间隔的信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/gke-config-reference/#configuring-the-refresh-interval)。

## 以编程方式创建 AKS 集群

通过 Rancher 以编程方式部署 AKS 集群的最常见方法是使用 Rancher 2 Terraform Provider。详情请参见[使用 Terraform 创建集群](https://registry.terraform.io/providers/rancher/rancher2/latest/docs/resources/cluster)。
