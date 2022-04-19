---
title: 配置 Azure AD
weight: 1115
---

如果你在 Azure 中托管了一个 Active Directory（AD）实例，你可以将 Rancher 配置为允许你的用户使用 AD 账号登录。你需要在 Azure 和 Rancher 中进行 Azure AD 外部身份验证。

> **注意**：Azure AD 集成仅支持服务提供商发起的登录。

> **前提**：已配置 Azure AD 实例。

> **注意**：大部分操作是从 [Microsoft Azure 门户](https://portal.azure.com/)执行的。

## Azure Active Directory 配置概述

要将 Rancher 配置为允许用户使用其 Azure AD 账号进行身份验证，你需要执行多个步骤。在你开始之前，请查看下文操作步骤大纲。

<a id="tip"></a>

> **提示**：在开始之前，我们建议你创建一个空文本文件。你可以将 Azure 相关的值复制到该文件，然后再粘贴到 Rancher 中。

<!-- TOC -->

- [1. 在 Azure 注册 Rancher](#1-register-rancher-with-azure)
- [2. 创建客户端密文](#2-create-a-new-client-secret)
- [3. 设置 Rancher 所需的权限](#3-set-required-permissions-for-rancher)
- [4. 添加回复 URL](#4-add-a-reply-url)
- [5. 复制 Azure 应用数据](#5-copy-azure-application-data)
- [6. 在 Rancher 中配置 Azure AD](#6-configure-azure-ad-in-rancher)

<!-- /TOC -->

### 1. 在 Azure 注册 Rancher

在 Rancher 中启用 Azure AD 之前，你必须先向 Azure 注册 Rancher。

1. 以管理用户身份登录 [Microsoft Azure](https://portal.azure.com/)。后续配置步骤中需要管理访问权限。

1. 使用搜索功能打开 **App registrations** 服务。

   ![Open App Registrations]({{<baseurl>}}/img/rancher/search-app-registrations.png)

1. 单击 **New registrations** 并完成 **Create** 表单。

   ![New App Registration]({{<baseurl>}}/img/rancher/new-app-registration.png)

   1. 输入 **Name**（例如 `Rancher`）。

   1. 在 **Supported account types** 中，选择 **Accounts in this organizational directory only (AzureADTest only - Single tenant)**。这对应于旧版应用注册选项。

   1. 在 **Redirect URI** 部分，确保从下拉列表中选择了 **Web**，然后在下拉列表旁边的文本框中输入你 Rancher Server 的 URL。Rancher Server URL 后需要追加验证路径，例如 `<MY_RANCHER_URL>/verify-auth-azure`。

      > **提示**：你可以在 Rancher 中的 Azure AD 身份验证页上的找到你的 Azure 回复 URL（全局视图 > **用户 & 认证** > **认证** > **Active Directory**）。

   1. 单击 **Register**。

> **注意**：此更改可能需要五分钟才能生效。因此，如果在配置 Azure AD 之后无法立即进行身份验证，请不要惊慌。

### 2. 创建客户端密文

在 Azure 门户中，创建一个客户端密文。Rancher 将使用此密钥向 Azure AD 进行身份验证。

1. 使用搜索功能打开 **App registrations** 服务。然后打开你在上一个步骤中创建的 Rancher 项。

   ![Open Rancher Registration]({{<baseurl>}}/img/rancher/open-rancher-app.png)

1. 在左侧的导航窗格中，单击 **Certificates and Secrets**。

1. 单击 **New client secret**。

   ![Create new client secret]({{<baseurl>}}/img/rancher/select-client-secret.png)

   1. 输入 **Description**（例如 `Rancher`）。

   1. 从 **Expires** 下的选项中选择密钥的持续时间。此下拉菜单设置的是密钥的到期日期。日期越短则越安全，但是在到期后你需要创建新密钥。

   1. 单击 **Add**（无需输入值，保存后会自动填充）。
      <a id="secret"></a>

1. 将键值复制保存到[空文本文件](#tip)。

   稍后你将在 Rancher UI 中输入此密钥作为你的 **Application Secret**。

   你将无法在 Azure UI 中再次访问该键值。

### 3. 设置 Rancher 所需的权限

接下来，在 Azure 中为 Rancher 设置 API 权限。

1. 从左侧的导航窗格中，选择 **API permissions**。

   ![Open Required Permissions]({{<baseurl>}}/img/rancher/select-required-permissions.png)

1. 单击 **Add a permission**。

1. 在 **Azure Active Directory Graph** 中，选择以下 **Delegated Permissions**：

   ![Select API Permissions]({{<baseurl>}}/img/rancher/select-required-permissions-2.png)

   - **Access the directory as the signed-in user**
   - **Read directory data**
   - **Read all groups**
   - **Read all users' full profiles**
   - **Read all users' basic profiles**
   - **Sign in and read user profile**

1. 单击 **Add permissions**。

1. 在 **API permissions** 中，单击 **Grant admin consent**。然后单击 **Yes**。

   > **注意**：你必须以 Azure 管理员身份登录才能保存你的权限设置。

### 4. 添加回复 URL

要将 Azure AD 与 Rancher 一起使用，你必须在 Azure 中将 Rancher 列入白名单。要添加白名单，你可以向 Azure 提供 Rancher 的回复 URL，该 URL 是你的 Rancher Server URL 加上验证路径。

1. 在 **Setting** 页中，选择 **Reply URLs**。

   ![Azure: Enter Reply URL]({{<baseurl>}}/img/rancher/enter-azure-reply-url.png)

1. 在 **Reply URLs** 中，输入 Rancher Server 的 URL，并附加验证路径，例如 `<MY_RANCHER_URL>/verify-auth-azure`。

   > **提示**：你可以在 Rancher 中的 Azure AD 身份验证页上的找到你的 Azure 回复 URL（全局视图 > **用户 & 认证** > **认证** > **Active Directory**）。

1. 单击**保存**。

**结果**：你的回复 URL 已保存。

> **注意**：此更改可能需要五分钟才能生效。因此，如果在配置 Azure AD 之后无法立即进行身份验证，请不要惊慌。

### 5. 复制 Azure 应用数据

这是在 Azure 中执行的的最后一步。你需要复制用于配置 Rancher 以进行 Azure AD 身份验证的数据，并将其粘贴到一个空文本文件中。

1. 获取你的 Rancher **租户 ID**。

   1. 使用搜索功能打开 **Azure Active Directory** 服务。

      ![Open Azure Active Directory]({{<baseurl>}}/img/rancher/search-azure-ad.png)

   1. 从左侧导航窗格中，打开 **Overview**。

   1. 复制 **Directory ID** 并粘贴到你的[文本文件](#tip)。

      你将把这个值作为**租户 ID** 粘贴到 Rancher。

1. 获取你的 Rancher **应用 ID**。

   1. 使用搜索打开 **App registrations**。

      ![Open App Registrations]({{<baseurl>}}/img/rancher/search-app-registrations.png)

   1. 找到你为 Rancher 创建的项。

   1. 复制 **Application ID** 并将其粘贴到你的[文本文件](#tip)。

1. 获取你的 Rancher **图端点**、**Token 端点** 和 **Auth 端点**。

   1. 在 **App registrations** 中，点击 **Endpoints**。

      ![Click Endpoints]({{<baseurl>}}/img/rancher/click-endpoints.png)

   2. 将以下端点复制并粘贴到你的[文本文件](#tip)中（这些值将是你的 Rancher 端点值）：

      - **Microsoft Graph API endpoint**（图端点）
      - **OAuth 2.0 token endpoint (v1)**（Token 端点）
      - **OAuth 2.0 authorization endpoint (v1)** (Auth 端点)

> **注意**：请复制 v1 版本的端点。

### 6. 在 Rancher 中配置 Azure AD

在 Rancher UI 中，输入托管在 Azure 中的 AD 实例的信息以完成配置。

输入你复制到[文本文件](#tip)的值。

1. 登录到 Rancher。
1. 在左上角，单击 **☰ > 用户 & 认证**。
1. 在左侧导航栏，单击**认证**。
1. 单击 **AzureAD**。
1. 使用你在[复制 Azure 应用数据](#5-copy-azure-application-data)时复制的信息，填写**配置 Azure AD 账号**的表单。

   > **重要提示**：输入**图端点** 时，请从 URL 中删除租户 ID，如下所示：
   >
   > <code>http<span>s://g</span>raph.windows.net/<del>abb5adde-bee8-4821-8b03-e63efdc7701c</del></code>

   下表将你在 Azure 门户中复制的值映射到 Rancher 中的字段：

   | Rancher 字段 | Azure 值                              |
   | ------------ | ------------------------------------- |
   | 租户 ID      | Directory ID                          |
   | 应用 ID      | Application ID                        |
   | 应用密文     | Key Value                             |
   | 端点         | https://login.microsoftonline.com/    |
   | 图端点       | Microsoft Azure AD Graph API Endpoint |
   | Token 端点   | OAuth 2.0 Token Endpoint              |
   | Auth 端点    | OAuth 2.0 Authorization Endpoint      |

1. 点击**启用**。

**结果**：Azure Active Directory 身份验证已配置。
