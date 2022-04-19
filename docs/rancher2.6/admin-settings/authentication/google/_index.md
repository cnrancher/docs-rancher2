---
title: 配置 Google OAuth
weight: 10
---

如果你的组织使用 G Suite 进行用户身份验证，你可以通过配置 Rancher 来允许你的用户使用 G Suite 凭证登录。

只有 G Suite 域的管理员才能访问 Admin SDK。因此，只有 G Suite 管理员可以配置 Rancher 的 Google OAuth。

在 Rancher 中，只有具有 **Manage Authentication** [全局角色]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)的管理员或用户才能配置身份验证。

## 前提

- 你必须配置了 [G Suite 管理员账号](https://admin.google.com)。
- G Suite 需要一个[顶级私有域 FQDN](https://github.com/google/guava/wiki/InternetDomainNameExplained#public-suffixes-and-private-domains) 作为授权域。获取 FQDN 的一种方法是在 Route53 中为 Rancher Server 创建 A 记录。你不需要使用该记录更新 Rancher Server 的 URL 设置，因为可能有集群使用该 URL。
- 你的 G Suite 域必须启用了 Admin SDK API。你可以按照[此页面](https://support.google.com/a/answer/60757?hl=en)中的步骤启用它。

启用 Admin SDK API 后，你的 G Suite 域的 API 页面应如下图所示：
![Enable Admin APIs]({{<baseurl>}}/img/rancher/Google-Enable-APIs-Screen.png)

## 在 Rancher 中为 OAuth 设置 G Suite

在 Rancher 中设置 Google OAuth 之前，你需要登录到你的 G Suite 账号并完成以下设置：

1. [在 G Suite 中将 Rancher 添加为授权域](#1-adding-rancher-as-an-authorized-domain)
1. [为 Rancher Server 生成 OAuth2 凭证](#2-creating-oauth2-credentials-for-the-rancher-server)
1. [为 Rancher Server 创建服务账号凭证](#3-creating-service-account-credentials)
1. [将服务账号密钥注册成 OAuth Client](#4-register-the-service-account-key-as-an-oauth-client)

### 1. 将 Rancher 添加为授权域

1. 点击[此处](https://console.developers.google.com/apis/credentials)前往你的 Google 域的凭证页面。
1. 选择你的项目，然后点击 **OAuth consent screen**。
   ![OAuth Consent Screen]({{<baseurl>}}/img/rancher/Google-OAuth-consent-screen-tab.png)
1. 前往 **Authorized Domains**，并在列表中输入你的 Rancher Server URL 的顶级私有域。顶级私有域是最右边的超级域。例如，`www.foo.co.uk` 是 `foo.co.uk` 的顶级私有域。有关顶级私有域的更多信息，请参见[此处](https://github.com/google/guava/wiki/InternetDomainNameExplained#public-suffixes-and-private-domains)。
1. 前往 **Scopes for Google APIs**，并确保已启用 **email**，**profile** 和 **openid**。

**结果**：Rancher 已被添加为 Admin SDK API 的授权域。

### 2. 为 Rancher Server 生成 OAuth2 凭证

1. 前往 Google API 控制台，选择你的项目并前往 [credentials ](https://console.developers.google.com/apis/credentials)页面。
   ![Credentials]({{<baseurl>}}/img/rancher/Google-Credentials-tab.png)
1. 在 **Create Credentials** 下拉框中，选择 **OAuth client ID**。
1. 点击 **Web application**。
1. 输入一个名称。
1. 填写 **Authorized JavaScript origins** 和 **Authorized redirect URIs**。请注意，设置 Google OAuth 的 Rancher UI 页面（**Security > Authentication > Google** 下的全局视图）为你提供了这一步要输入的准确链接。

- 在 **Authorized JavaScript origins** 处，输入你的 Rancher Server URL。
- 在 **Authorized redirect URIs** 处，输入你的 Rancher Server 的 URL 并附加路径 `verify-auth`。例如，如果你的 URI 是 `https://rancherServer`，你需要输入 `https://rancherServer/verify-auth`。

1. 点击 **Create**。
1. 创建凭证之后，你将看到一个页面，其中显示你的凭证列表。选择刚刚创建的凭证，然后在最右边的行中单击 **Download JSON**。保存该文件，以便向 Rancher 提供这些凭证。

**结果**：你已成功创建 OAuth 凭证。

### 3. 创建服务账号凭证

由于 Google Admin SDK 只对管理员可用，普通用户不能使用它来检索其他用户或其组的配置文件。普通用户甚至不能检索他们自己的组。

由于 Rancher 提供基于组的成员访问，我们要求用户能够获得自己的组，并在需要时查找其他用户和组。

为了解决这个问题，G Suite 建议创建一个服务账号，并将你的 G Suite 域的权限委托给该服务账号。

本节介绍如何：

- 创建一个服务账号
- 为服务账号创建一个密钥并下载 JSON 格式的凭证

1. 点击[此处](https://console.developers.google.com/iam-admin/serviceaccounts)并选择要生成 OAuth 凭证的项目。
1. 点击 **Create Service Account**。
1. 输入名称，并点击 **Create**。
   ![Service account creation Step 1]({{<baseurl>}}/img/rancher/Google-svc-acc-step1.png)
1. 不要在 **Service account permissions** 页面设置任何角色，然后单击 **Continue**。
   ![Service account creation Step 2]({{<baseurl>}}/img/rancher/Google-svc-acc-step2.png)
1. 点击 **Create Key** 并选择 JSON 选项。下载并保存 JSON 文件，以便你可以将其作为服务账号凭证提供给 Rancher。
   ![Service account creation Step 3]({{<baseurl>}}/img/rancher/Google-svc-acc-step3-key-creation.png)

**结果**：你的服务账号已创建成功。

### 4. 将服务账号密钥注册成 OAuth Client

你需要为在上一步中创建的服务账号授予一些权限。Rancher 仅要求为用户和组授予只读权限。

使用服务账号密钥的唯一 ID，按照以下步骤将其注册为 Oauth Client：

1. 获取你刚刚创建的密钥的唯一 ID。如果它没有显示在你创建的键旁边的键列表中，你需要先启用 Unique ID 列。点击 **Unique ID** 然后点击 **OK**。这将向服务账号密钥列表中添加 **Unique ID** 列。保存你创建的服务账号对应的唯一 ID。注意：这是一个数字 Key，不要与字母数字字段 **Key ID** 混淆。

   ![Service account Unique ID]({{<baseurl>}}/img/rancher/Google-Select-UniqueID-column.png)

1. 前往 [**Domain-wide Delegation** 页面。](https://admin.google.com/ac/owl/domainwidedelegation)
1. 在 **Client Name** 字段中添加上一步中获得的唯一 ID。
1. 在 **One or More API Scopes** 字段中，添加以下作用域：
   ```
   	openid,profile,email,https://www.googleapis.com/auth/admin.directory.user.readonly,https://www.googleapis.com/auth/admin.directory.group.readonly
   ```
1. 点击 **Authorize**。

**结果**：服务账号在你的 G Suite 账号中已注册为 OAuth 客户端。

## 在 Rancher 中配置 Google OAuth

1. 使用分配了 [administrator]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions) 角色的本地用户登录到 Rancher。这个用户也称为本地主体。
1. 在左上角，单击 **☰ > 用户 & 认证**。
1. 在左侧导航栏，单击**认证**。
1. 单击 **Google**。UI 中的说明介绍了使用 Google OAuth 设置身份验证的步骤。
   1. 管理员邮箱：提供 GSuite 设置中的管理员账户的电子邮箱。为了查找用户和组，Google API 需要管理员的电子邮件和服务账号密钥。
   1. 域名：提供配置了 G Suite 的域。请提供准确的域，而不是别名。
   1. 属于多个用户组的用户：选中此框以启用嵌套组成员关系。Rancher 管理员可以在配置认证后的任何时候禁用它。
   - **步骤一**是将 Rancher 添加为授权域（详情请参见[本节](#1-adding-rancher-as-an-authorized-domain)）。
   - **步骤二**提供你完成[本节](#2-creating-oauth2-credentials-for-the-rancher-server)后下载的 OAuth 凭证 JSON。你可以上传文件或将内容粘贴到 **OAuth Credentials** 字段。
   - **步骤三**提供在[本节](#3-creating-service-account-credentials)末尾下载的服务账号凭证 JSON。仅当你成功[在 G Suite 账号中将服务账号密钥注册为 OAuth Client](#4-register-the-service-account-key-as-an-oauth-client) 后，凭证才能正常工作。
1. 点击**使用 Google 认证**。
1. 点击**启用**。

**结果**：Google 验证配置成功。
