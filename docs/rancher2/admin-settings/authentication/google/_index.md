---
title: 对接 Google OAuth
description: 如果您的组织使用 G Suite 进行用户身份验证，您可以配置 Rancher 以允许您的用户使用他们的 G Suite 凭据登录。只有 G Suite 域的管理员才能访问管理 SDK。因此，只有 G Suite 管理员可以配置 Rancher 的 Google OAuth。在 Rancher 中，只有具有Manage Authentication全局角色的管理员或用户才能配置身份验证。
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
  - 系统管理员指南
  - 登录认证
  - 对接 Google OAuth
---

_自 v2.3.0 版本起可用_

如果您的组织使用 G Suite 进行用户身份验证，您可以配置 Rancher 以允许您的用户使用他们的 G Suite 凭据登录。

只有 G Suite 域的管理员才能访问管理 SDK。因此，只有 G Suite 管理员可以配置 Rancher 的 Google OAuth。

在 Rancher 中，只有具有**Manage Authentication** [全局角色](/docs/rancher2/admin-settings/rbac/global-permissions/_index)的管理员或用户才能配置身份验证。

## 先决条件

- 您必须拥有一个配置的[G Suite 管理员帐户](https://admin.google.com)。
- G Suite 需要一个[顶级私有域 FQDN](https://github.com/google/guava/wiki/InternetDomainNameExplained#public-suffixes-private-domains)作为授权域。获取 FQDN 的一种方法是在 Route53 中为 Rancher Server 创建 A 记录。您不需要使用该记录更新 Rancher Server 的 URL 设置，因为可能有集群使用该 URL。
- 您的 G Suite 域必须启用了 Admin SDK API。您可以使用[此页](https://support.google.com/a/answer/60757?hl=en)中的步骤来启用它。

启用 Admin SDK API 后，您的 G Suite 域的 API 页面应如下图所示:
![启用管理APIs](/img/rancher/Google-Enable-APIs-Screen.png)

## 在 Rancher 中为 OAuth 设置 G Suite

在 Rancher 系统中设置 Google OAuth 之前，您需要登录到您的 G Suite 帐户，完成以下设置:

### 添加 Rancher 为授权域

1. 点击[这里](https://console.developers.google.com/apis/credentials)转到您的 Google 域的凭证页面。
1. 选择您的项目并点击**OAuth consent screen.**
   ![OAuth同意屏幕](/img/rancher/Google-OAuth-consent-screen-tab.png)
1. 进入**授权域**，并在列表中输入您的 Rancher Server URL 的顶级私有域。顶级私有域是最右边的超级域。例如，www.foo.co.uk 是 foo.co.uk 的顶级私有域。有关顶级域的更多信息，请参考[本文](https://github.com/google/guava/wiki/InternetDomainNameExplained#public-suffixes-private-domains)。
1. 进入**Scopes for Google APIs**，确保**email**, **profile**和**openid**被启用。

**结果:** Rancher 已被添加为 Admin SDK API 的授权域。

### 创建 OAuth2 凭证

1. 转到 Google API 控制台，选择您的项目，并转到[credentials](https://console.developers.google.com/apis/credentials)页面。
   ![credentials](/img/rancher/Google-Credentials-tab.png)
1. 在**Create Credentials**下拉菜单中，选择**OAuth client ID**。
1. 单击**Web 应用程序**。
1. 输入一个名称。
1. 填写**授权的 JavaScript 源**和**授权的重定向 URI**。注意:设置 Google OAuth 的 Rancher UI 页面（可在**Security > Authentication >Google**下的全局视图中获得）为您提供了这一步要输入的准确链接。

- 在**授权的 JavaScript 源**一栏，输入您的 Rancher Server 的 URL。
- 在**授权的重定向 URI**一栏，输入您的 Rancher Server 的 URL 并附加路径`verify-auth`。例如，如果您的 URI 是`https://rancherServer`，您需要输入`https://rancherServer/verify-auth`。

1. 点击**创建**。
1. 创建凭据之后，您将看到一个页面，其中显示您的凭据列表。选择刚刚创建的凭据，然后在最右边的行中单击**下载 JSON**保存文件，以便您可以在 Rancher 中设置这些凭据。

**结果:** 您的 OAuth 凭据已成功创建。

### 创建服务帐户凭证

由于 Google 管理 SDK 只对管理员可用，普通用户不能使用它来检索其他用户或其组的配置文件。普通用户甚至不能检索他们自己的组。

由于 Rancher 提供基于组的成员访问，我们要求用户能够获得自己的组，并在需要时查找其他用户和组。

作为获得此功能的一种变通方法，G Suite 建议创建一个服务帐户，并将您的 G Suite 域的权限委托给该服务帐户。

本节介绍如何:

- 创建一个服务帐户
- 为服务帐户创建一个密钥并下载 JSON 格式的凭据

1. 单击[此处](https://console.developers.google.com/iam-admin/serviceaccounts)并选择生成 OAuth 凭据的项目。
1. 点击**Create Service Account**。
1. 输入名称并单击**Create**。
   ![服务账户创建步骤1](/img/rancher/Google-svc-acc-step1.png)
1. 不要在**Service account permissions**页面设置任何角色，点击**Continue**。
   ![服务账户创建步骤2](/img/rancher/Google-svc-acc-step2.png)
1. 单击**Create Key**并选择 JSON 选项。下载 JSON 文件并保存它，以便您可以将其作为服务帐户凭据提供给 Rancher。
   ![服务帐户创建步骤3](/img/rancher/Google-svc-acc-step3-key-creation.png)

**结果:** 您的服务账户创建成功.

### 将服务账户密钥注册为 OAuth 客户端

您需要为在最后一步中创建的服务帐户授予一些权限。Rancher 仅要求为用户和组授予只读权限。

使用服务帐户密钥的唯一 ID，按照以下步骤将其注册为 Oauth 客户端:

1. 获取您刚刚创建的密钥的唯一 ID。如果它没有显示在您创建的键旁边的键列表中，则必须启用它。要启用它，请单击**Unique ID**并单击**OK**这将向服务帐户密钥列表中添加**Unique ID**列。将列出的服务帐户保存为您创建的服务帐户。注意：这是一个数字 Key，不要与字母数字字段**key ID**混淆。

![服务帐户唯一ID](/img/rancher/Google-Select-UniqueID-column.png)

1. 进入[**Manage OAuth Client Access**](https://admin.google.com/AdminHome?chromeless=1#OGX:ManageOauthClients)页。
1. 在**Client Name**字段中添加上一步中获得的唯一 ID。
1. 在**One or More API Scopes**字段中，添加以下作用域:
   ```
   openid,profile,email,https://www.googleapis.com/auth/admin.directory.user.readonly,https://www.googleapis.com/auth/admin.directory.group.readonly
   ```
1. 点击**Authorize**。

**结果:** 服务帐户在您的 G Suite 帐户中注册为 OAuth 客户端。

## 在 Rancher 中配置 Google OAuth

1. 使用分配了[administrator](/docs/rancher2/admin-settings/rbac/global-permissions/_index)角色的本地用户登录到 Rancher。这个用户也称为本地主体。
1. 在**全局**视图中，从主菜单中单击**安全 > 认证**。
1. 点击**Google** ，UI 中的说明涵盖了使用 Google OAuth 设置身份验证的步骤。

- 管理电子邮件：从您的 GSuite 设置中提供管理员账户的电子邮件。为了执行用户和组查找，谷歌 api 需要管理员的电子邮件和服务帐户密钥。
- 域：提供配置了 G Suite 的域。请提供准确的域，而不是任何别名。
- 嵌套组成员关系：选中此框以启用嵌套组成员关系。Rancher 管理员可以在配置认证后的任何时候禁用它。
- **第一步**是关于将 Rancher 添加为授权域，我们已经在[本节](#1-添加-rancher-为授权域)中讨论过了。
- **第二步**提供您完成[本节](#2-为-rancher-服务器创建-oauth2-凭证)后下载的 OAuth 凭证 JSON ，您可以上传文件或将内容粘贴到**OAuth 凭证**字段。
- **第三步**提供在[本节](#3-创建服务帐户凭证)的末尾下载的服务帐户凭据 JSON。仅当您成功按照[将服务帐户密钥注册为 OAuth 客户端](#4-将服务账户密钥注册为-oauth-客户端)步骤将其注册为 G Suite OAuth 客户端时，凭证才能正常工作。

1. 单击**使用 Googler 认证**。
1. 点击**保存**。

**结果:** Google 认证配置成功。
