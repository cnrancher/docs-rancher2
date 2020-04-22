---
title: 创建微软 AKS 集群
description: 您可以使用 Rancher 创建一个托管在 Microsoft Azure Kubernetes 服务 (AKS) 中的集群。要与 Azure API 交互，AKS 集群需要 Azure 活动目录 （AD） 服务主体。需要服务主体来动态创建和管理其他 Azure 资源，它为您的集群提供了与 AKS 通信的凭证。有关服务主体的详细信息，请参阅AKS 文档。
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
  - 创建托管集群
  - 创建微软 AKS 集群
---

您可以使用 Rancher 创建一个托管在 Microsoft Azure Kubernetes 服务 (AKS) 中的集群。

## 先决条件

> **注意**
> 部署到 AKS 将会产生费用。

要与 Azure API 交互，AKS 集群需要 Azure 活动目录 （AD） 服务主体。需要服务主体来动态创建和管理其他 Azure 资源，它为您的集群提供了与 AKS 通信的凭证。有关服务主体的详细信息，请参阅 [AKS 文档](https://docs.microsoft.com/zh-cn/azure/aks/kubernetes-service-principal)。

在创建服务主体之前，您需要从[Microsoft Azure 门户](https://portal.azure.com)获取以下信息：

- 您的订阅 ID
- 您的租户 ID
- 应用 ID（也称为客户端 ID）
- 客户密钥
- 资源组

下面的部分描述了如何使用 Azure 命令行工具或 Azure 门户设置这些先决条件。

### 使用 Azure 命令行工具设置服务主体

您可以通过运行以下命令来创建服务主体:

```
az ad sp create-for-rbac --skip-assignment
```

结果应显示有关新服务主体的信息：

```
{
  "appId": "xxxx--xxx",
  "displayName": "<SERVICE-PRINCIPAL-NAME>",
  "name": "http://<SERVICE-PRINCIPAL-NAME>",
  "password": "<SECRET>",
  "tenant": "<TENANT NAME>"
}
```

您还需要向服务主体添加角色，以便它具有与 AKS API 通信的权限。它还需要创建和列出虚拟网络的访问权限。

下面是将`Contributor`角色分配给服务主体的示例命令。`Contributor`角色的用户可以管理 AKS 上的任何内容，但不能授予其他人访问权限：

```
az role assignment create \
  --assignee $appId \
  --scope /subscriptions/$<SUBSCRIPTION-ID>/resourceGroups/$<GROUP> \
  --role Contributor
```

您也可以用一条命令来创建服务主体并赋予`Contributor`权限。在此命令中，设置 scope 参数时，要提供 Azure 资源的完整路径：

```
az ad sp create-for-rbac \
  --scope /subscriptions/$<SUBSCRIPTION-ID>/resourceGroups/$<GROUP> \
  --role Contributor
```

### 从 Azure 门户网站设置服务主体

还可以按照这些指示设置服务主体，并从 Azure 门户网站授予其基于角色的访问权限。

1. 跳转到 Microsoft Azure 门户网站[主页](https://portal.azure.com).

1. 单击 **Azure Active Directory**。

1. 单击 **应用注册**。

1. 单击 **新注册**。

1. 输入名称。这将是服务主体的名称。

1. 可选:选择哪些帐户可以使用服务主体。

1. 单击 **注册**。

1. 您现在应该看到服务主体的名称 **Azure Active Directory > 应用注册**。

1. 单击服务主体的名称。请注意租户 ID 和应用程序 ID（也称为应用 ID 或客户端 ID），以便在配置 AKS 集群时使用它。然后单击 **证书 & 密钥**。

1. 单击 **新客户端密钥**。

1. 输入一个简短的描述，选择一个过期时间，然后单击**添加**。记下客户端密钥，以便在配置 AKS 集群时使用它。

**结果:** 您已经创建了一个服务主体，您应该能够在**Azure 活动目录**的**应用注册**中看到它。您仍然需要授予服务主体对 AKS 的访问权限。

给您的服务主体配置基于角色的访问权限，

1. 点击左边导航栏中的 **全部服务**。然后点击 **订阅**。

1. 单击要与 Kubernetes 集群关联的订阅的名称。记下订阅 ID，以便在预配 AKS 集群时使用它。

1. 单击 **访问控制 (IAM)**。

1. 在 **添加角色分配** 部分，点击 **添加**。

1. 在 **角色** 字段中，选择可以访问 AKS 的角色。例如，您可以使用 **Contributor** 角色，该角色具有管理所有内容的权限，但不能授予其他用户访问权限。

1. 在 **分配访问权限** 字段中，选择 **Azure AD 或 访问主体**。

1. 在 **选择** 字段中，选择服务主体的名称，然后单击 **保存**。

**结果:** 您的服务主体现在有了访问 AKS 的权限。

## 创建 AKS 集群

使用 Rancher 来配置您的 Kubernetes 集群。

1. 在 **集群** 页，单击 **添加集群**。

1. 选择 **Azure Kubernetes Service**。

1. 输入 **集群名称**。

1. 通过**成员角色**来设置用户访问集群的权限。

   - 点击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

1. 使用订阅 ID、租户 ID、应用 ID 和客户端密钥授予集群对 AKS 的访问权限。如果您没有所有这些信息，则可以使用以下指引来获取这些信息：

- **应用 ID and ID、租户 ID：** 要获取应用 ID 和租户 ID，可以转到 Azure 门户网站，然后单击**Azure Active Directory**，然后单击**应用注册**，然后单击服务主体的名称。应用 ID 和租户 ID 都位于应用注册详细信息页上。
- **客户端密钥：** 如果在创建服务主体时未复制客户端密钥，在应用注册详细信息页面，可以获取新密钥，然后单击**证书 & 密钥**，然后单击**新客户端密钥**。
- **订阅 ID：** 您可以从门户网站的**全部服务 > 订阅**中获取订阅 ID。

1.  使用您的服务主体的信息完成**帐户访问**表单，并选择一个地理区域。此信息用于 Azure 进行身份验证。

1.  使用**Kubernetes 选项**来配置 Kubernetes 版本，DNS 前缀，是否启用监控等。
1.  使用**主机**部分来配置集群中的节点。

    [Microsoft 文档：如何创建和使用 SSH 公钥和私钥对](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys)

1.  检查您的选项来确认它们是正确的. 然后单击**创建**。

**结果：**

- 您的集群创建成功并进入到**Provisioning**（启动中）的状态。Rancher 正在拉起您的集群。
- 在集群状态变为**Active**（激活）状态后，您将可以开始访问您的集群。
- 在**Active**的集群中，默认会有两个项目。`Default`项目（包括`default`命名空间）和`System`项目（包括`cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果这些命名空间存在的话）
