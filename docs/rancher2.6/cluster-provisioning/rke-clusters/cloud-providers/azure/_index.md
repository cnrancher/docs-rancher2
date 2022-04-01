---
title: 设置 Azure 云提供商
weight: 2
---

使用 `Azure` 云提供商时，你可以使用以下功能：

- **负载均衡器**：在特定网络安全组中启动 Azure 负载均衡器。

- **持久卷**：支持将 Azure Blob 磁盘和 Azure 托管磁盘与标准和高级 Storage Account 一起使用。

- **网络存储**：通过 CIFS 挂载支持 Azure 文件。

Azure 订阅不支持以下账号类型：

- 单租户账号（即没有订阅的账号）。
- 多订阅账号。

## RKE 和 RKE2 的先决条件

要为 RKE 和 RKE2 设置 Azure 云提供商，你需要配置以下凭证：

1. [设置 Azure 租户 ID](#1-set-up-the-azure-tenant-id)
2. [设置 Azure 客户端 ID 和 Azure 客户端密码](#2-set-up-the-azure-client-id-and-azure-client-secret)
3. [配置应用注册权限](#3-configure-app-registration-permissions)
4. [设置 Azure 网络安全组名称](#4-set-up-azure-network-security-group-name)

### 1. 设置 Azure 租户 ID

访问 [Azure 门户](https://portal.azure.com)，登录并转到 **Azure Active Directory**，然后选择 **Properties**。你的 **Directory ID** 是你的 **Tenant ID** (tenantID)。

如果要使用 Azure CLI，你可以运行 `az account show` 命令来获取信息。

### 2. 设置 Azure 客户端 ID 和 Azure 客户端密码

访问 [Azure 门户](https://portal.azure.com)，登录并按照以下步骤创建 **App Registration** 和对应的 **Azure Client ID** (aadClientId) 以及 **Azure Client Secret** (aadClientSecret)。

1. 选择 **Azure Active Directory**。
1. 选择 **App registrations**。
1. 选择 **New application registration**。
1. 选择 **Name**，选择 `Web app/API` 作为 **Application Type**，并选择任意 **Sign-on URL**。
1. 选择 **Create**。

在 **App registrations** 视图中，你应该会看到你创建的应用注册。**APPLICATION ID** 列中显示的值是需要用作 **Azure Client ID** 的值。

下一步是生成 **Azure Client Secret**：

1. 打开你创建的应用注册。
1. 在 **Settings** 视图中，打开 **Keys**。
1. 输入 **Key description**，选择过期时间，然后选择 **Save**。
1. **Value** 列中显示的生成值是需要用作 **Azure Client Secret** 的值。该值只会显示一次。

### 3. 配置应用注册权限

最后，为你的应用注册分配适当的权限：

1. 前往 **More services**，搜索 **Subscriptions** 并打开它。
1. 打开 **Access control (IAM)**。
1. 选择 **Add**。
1. 在 **Role** 中选择 `Contributor`。
1. 在 **Select** 中选择你创建的应用注册的名称。
1. 选择 **Save**。

### 4. 设置 Azure 网络安全组名称

要使 Azure 负载均衡器正常工作，你需要自定义一个 Azure 网络安全组 (securityGroupName)。

如果你使用 Rancher Machine Azure 驱动来配置主机，则需要手动编辑主机，从而将主机分配给此网络安全组。

你需要在配置期间将自定义主机分配给此网络安全组。

只有需要成为负载均衡器后端的主机才需要分配到该组。

## Rancher 中的 RKE2 集群设置

1. 在**集群配置**中的**云提供商**下拉列表中选择 **Azure**。

1. - 配置云提供商。请注意，Rancher 会自动创建新的网络安全组、资源组、可用性集、子网和虚拟网络。如果你已经创建了其中的一部分或全部，则需要在创建集群之前指定它们。
   - 你可以单击**显示高级选项**以查看更多自动生成的名称，并在需要的时候更新它们。你的云提供商配置**必须**与**机器池**中的字段匹配。如果你有多个池，它们必须使用相同的资源组、可用性集、子网、虚拟网络和网络安全组。
   - 下面提供了一个示例。你可以根据需要对其进行修改。

   {{% accordion id="v2.6.0-cloud-provider-config-file" label="Example Cloud Provider Config" %}}

```yaml
{
    "cloud":"AzurePublicCloud",
    "tenantId": "YOUR TENANTID HERE",
    "aadClientId": "YOUR AADCLIENTID HERE",
    "aadClientSecret": "YOUR AADCLIENTSECRET HERE",
    "subscriptionId": "YOUR SUBSCRIPTIONID HERE",
    "resourceGroup": "docker-machine",
    "location": "westus",
    "subnetName": "docker-machine",
    "securityGroupName": "rancher-managed-KA4jV9V2",
    "securityGroupResourceGroup": "docker-machine",
    "vnetName": "docker-machine-vnet",
    "vnetResourceGroup": "docker-machine",
    "primaryAvailabilitySetName": "docker-machine",
    "routeTableResourceGroup": "docker-machine",
    "cloudProviderBackoff": false,
    "useManagedIdentityExtension": false,
    "useInstanceMetadata": true
}
```
    {{% /accordion %}}

1. 在**集群配置 > 高级选项**、中，单击**补充的 Controller Manager 参数**下的**添加**，并添加 `--configure-cloud-routes=false` 标志。

1. 单击**创建**按钮来提交表单并创建集群。
