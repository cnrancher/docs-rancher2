---
title: 对接 Azure AD
description: 如果您在 Azure 中托管了一个 Active Directory（AD）实例，您可以将 Rancher 配置为允许您的用户使用 AD 帐户登录。Azure AD 外部身份验证的配置要求您在 Azure 和 Rancher 中进行配置。Azure AD 集成仅支持服务提供者发起的登录。
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
  - 系统管理员指南
  - 登录认证
  - 对接 Azure AD
---

_自 v2.0.3 版本起可用_

## 概述

如果您在 Azure 中托管了一个 Active Directory（AD）实例，您可以将 Rancher 配置为允许您的用户使用 AD 帐户登录。Azure AD 外部身份验证的配置要求您在 Azure 和 Rancher 中进行配置。

> **注意：** Azure AD 集成仅支持服务提供者发起的登录。
>
> **先决条件：** 已配置 Azure AD 实例。
>
> **注意：** 此过程的大部分是从[Microsoft Azure 门户网站](https://portal.azure.com/)执行的。

将 Rancher 配置为允许用户使用其 Azure AD 帐户进行身份验证涉及多个过程。开始之前，请查看下文操作步骤。

> **提示：** 在开始之前，我们建议您创建一个空文本文件。您可以使用此文件从 Azure 复制值，稍后将其粘贴到 Rancher 中。

## 注册 Rancher

在 Rancher 中启用 Azure AD 之前，必须向 Azure 注册 Rancher。

1.  以管理用户身份登录到 [Microsoft Azure](https://portal.azure.com/)。以后步骤中的配置需要管理访问权限。

1.  使用搜索功能打开**App registrations**服务。

    ![Open App Registrations](/img/rancher/search-app-registrations2.png)

1.  单击**New registrations**，完成**创建**表单。

    ![New App Registration](/img/rancher/new-app-registration.png)

    1.  输入**名称**（类似于`Rancher`）。

    1.  在 **Supported account types**，选择 “Accounts in this organizational directory only (AzureADTest only - Single tenant)”。这对应于旧版应用程序注册选项。

    1.  在 **Redirect URI** 部分中，确保从下拉列表中选择了 **Web**，然后在下拉菜单旁边的文本框中输入 Rancher Server 的 URL。该 Rancher Server URL 应附加验证路径：`<MY_RANCHER_URL>/verify-auth-azure`

        > **提示：** 您可以在 Rancher 中的 Azure AD 身份验证页上的找到您自己的 Azure 回调 URL（全局视图 > 安全 > 认证 > Azure AD）。

    1.  单击 **Register**。

> **注意：** 此更改最多可能需要五分钟才能生效，因此，如果在配置 Azure AD 之后无法立即进行身份验证，请不要惊慌。

## 创建客户端密钥

在 Azure 门户中，创建客户端密钥。 Rancher 将使用此密钥向 Azure AD 进行身份验证。

1. 使用搜索打开**App registrations**服务。然后打开您在上一个过程中创建的 Rancher 条目。

   ![Open Rancher Registration](/img/rancher/open-rancher-app2.png)

1. 在左侧的导航窗格中，单击 **Certificates and Secrets**。

1. 从**设置**页中，选择**键**。

1. 单击 **New client secret**。

   ![Create new client secret](/img/rancher/select-client-secret.png)

   1. 输入**描述**（例如，`Rancher`）。

   1. 从 **Expires** 下的选项中选择密钥的持续时间。此下拉菜单设置密钥的到期日期。较短的持续时间更安全，但要求您在到期后创建新密钥。

   1. 单击 **Add**（您无需输入值，保存后它将自动填充）。

1. 复制键值并将其保存到空文本文件。

   稍后，您将此密钥作为**应用程序机密**输入 Rancher UI。

   您将无法在 Azure UI 中再次访问密钥值。

## 设置 Rancher 所需权限

接下来，在 Azure 中为 Rancher 设置 API 权限。

1. 在左侧的导航窗格中，选择 **API permissions**。

   ![Open Required Permissions](/img/rancher/select-required-permissions.png)

1. 单击 **Add a permission**。

1. 从 **Azure Active Directory Graph**，选中以下的 **Delegated Permissions**：

   ![Select API Permissions](/img/rancher/select-required-permissions-2.png)

   - **Access the directory as the signed-in user**
   - **Read directory data**
   - **Read all groups**
   - **Read all users' full profiles**
   - **Read all users' basic profiles**
   - **Sign in and read user profile**

1. 单击**保存**。

1. 在**所需权限**中，单击**授予权限**。然后单击**是**。

> **注意：** 必须以 Azure 管理员身份登录才能成功保存权限设置。

## 添加回调 URL

要将 Azure AD 与 Rancher 一起使用，必须将 Rancher 与 Azure 一起白名单。您可以通过向 Azure 提供 Rancher 的回调 URL 来完成此白名单，该 URL 是您的 Rancher Server URL，后跟验证路径。

1. 从**设置**页中，选择**回调 URL**。

   ![Azure: Enter Reply URL](/img/rancher/enter-azure-reply-url.png)

1. 从**回调 URL**blade 中，输入您的 Rancher Server 的 URL，并附加验证路径:`<MY_Rancher_URL>/verify auth azure`。

   > **提示：**您可以在 Rancher 的 Azure AD 身份验证页面(全局视图> 认证> Azure AD)中找到您的个性化 Azure 回调 URL。

1. 单击**保存**。

   **结果：** 您的回调 URL 已保存。

> **注意：** 此更改最长可能需要 5 分钟才能生效，因此如果在 Azure AD 配置之后无法立即进行身份验证，请不要惊慌。

## 复制 Azure 应用程序数据

作为在 Azure 中的最后一步，复制将用于为 Azure AD 身份验证配置 Rancher 的数据，并将其粘贴到空文本文件中。

1. 获取您的 Rancher**租户 ID**。

   1. 使用搜索打开 **Azure Active Directory** 服务。

      ![Open Azure Active Directory](/img/rancher/search-azure-ad.png)

   1. 在左侧导航窗格中，打开 **Overview**。

   1. 复制**目录 ID**并粘贴到您的文本文件。

您将把这个值作为**租户 ID**粘贴到 Rancher 中。

1. 获取您的 Rancher**申请 ID**。

   1 使用搜索打开**应用程序注册**。

   ![Open App Registrations](/img/rancher/search-app-registrations2.png)

   1. 找到您为 Rancher 创建的条目。

   1. 复制**应用程序 ID**并粘贴到文本文件。

1. 获取 Rancher**图形端点**、**令牌端点**和**身份验证端点**。

   1. 在**应用注册**中，单击**端点**。

      ![Click Endpoints](/img/rancher/click-endpoints.png)

   2. 将下列端点复制到剪贴板并粘贴到文本文件(这些值将是您的 Rancher 端点值)。

      - **Microsoft Graph API 端点** (图形端点)
      - **OAuth 2.0 令牌端点(v1)** (令牌端点)
      - **OAuth 2.0 授权端点(v1)** (身份验证端点)

> **注意：** 复制端点的 v1 版本

## 配置 Azure AD

从 Rancher UI 中，输入有关托管在 Azure 中的 AD 实例的信息以完成配置。

输入复制到文本文件的值。

1. 登录到 Rancher。在**全局**视图中，选择**安全性>身份验证**。

1. 选择**Azure AD**。

1. 使用完成`复制 Azure 应用程序数据`时复制的信息完成**配置 Azure AD 帐户**表单。

   > **重要提示：** 输入图形端点时，从 URL 中删除租户 ID，如下所示。
   >
   > <code>http<span>s://g</span>raph.windows.net/<del>abb5adde-bee8-4821-8b03-e63efdc7701c</del></code>

   下表将您在 Azure 门户中复制的值映射到 Rancher 中的字段。

   | Rancher  | AZURE 值                           |
   | :------- | :--------------------------------- |
   | 租户 ID  | 目录 ID                            |
   | 应用 ID  | 应用程序 ID                        |
   | 应用密文 | 密钥值                             |
   | 端点     | https://login.microsoftonline.com/ |
   | 图形端点 | Microsoft Azure AD Graph API 端点  |
   | 令牌端点 | OAuth 2.0 令牌端点                 |
   | 认证端点 | OAuth 2.0 授权端点                 |

1. 单击 **使用 Azure 进行身份验证**。

**结果：** 已配置 Azure Active Directory 身份验证。
