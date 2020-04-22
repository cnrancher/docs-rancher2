---
title: Azure
description: 使用 `Azure` Cloud Provider 时，您可以使用以下功能：**负载均衡：** 在特定网络安全组中启动 Azure 负载均衡器。**持久卷：** 支持使用具有标准和高级存储帐户的 Azure Blob 磁盘和 Azure 托管磁盘。**网络存储：** 通过 CIFS 挂载支持 Azure 文件。Azure 订阅不支持以下帐户类型：单租户帐户（即没有订阅的帐户）。多订阅帐户。
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
  - 配置 Cloud Provider
  - Azure
---

使用 `Azure` Cloud Provider 时，您可以使用以下功能：

- **负载均衡：** 在特定网络安全组中启动 Azure 负载均衡器。

- **持久卷：** 支持使用具有标准和高级存储帐户的 Azure Blob 磁盘和 Azure 托管磁盘。

- **网络存储：** 通过 CIFS 挂载支持 Azure 文件。

Azure 订阅不支持以下帐户类型：

- 单租户帐户（即没有订阅的帐户）。
- 多订阅帐户。

要设置 Azure Cloud Provider 需要配置以下凭据：

## 1、设置 Azure 租户 ID

打开 [Azure 控制台](https://portal.azure.com), 登录并跳转到 **Azure Active Directory** 然后选择 **属性**. 您的**目录 ID** 是您的 **租户 ID** (tenantID).

如果您想使用 Azure CLI，您可以运行命令`az account show`来获取信息。

## 2、设置 Azure 客户端 ID 和 Azure 客户端密钥

浏览[Azure Portal](https://portal.azure.com)，登录并按照以下步骤创建**应用注册**中的**Azure 客户端 ID** (aadClientId)和**Azure 客户端密钥** (aadClientSecret)。

1. 选择**Azure Active Directory**.
1. 选择**应用注册**。
1. 选择**注册应用程序**。
1. 输入**名称**, 在**Application 类型**中选择`Web app / API`和在这种情况下，可以是任何东西的**Sign-on URL**。
1. 选择**创建**。

在**应用注册**视图，您应该看到您创建的应用程序注册。列中显示的值**应用 ID**便是您需要的**Azure 客户端 ID**。

下一步是生成**Azure 客户端密钥**:

1. 打开您创建的应用程序注册。
1. 在**设置**视图中，打开**键**。
1. 输入**密钥说明**，选择到期时间并选择**保存**。
1. **Value**列中显示的生成值是您需要用作**Azure 客户端密钥**的值。此值将只显示一次。

## 3、配置应用程序注册权限

您需要做的最后一件事是为您的应用程序注册分配适当的权限

1. 转到**更多服务**，搜索**订阅**并打开它。
1. 打开**访问控制(IAM)**。
1. 选择**添加**。
1. 对于**角色**，选择`参与者`。
1. 对于**选择**，选择您创建的应用程序注册名称。
1. 选择**保存**。

## 4、设置 Azure 网络安全组名称

需要自定义 Azure 网络安全组（securityGroupName）才能允许 Azure 负载均衡器工作。

如果使用 Rancher 的 Azure 主机驱动设置主机，则需要手动编辑它们以将它们分配给此网络安全组。

在设置过程中，您应该已将自定义主机分配给此网络安全组。

只有为负载均衡后台的主机需要在此组中。
