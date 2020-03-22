---
title: 对接 PingIdentity (SAML)
---

_v2.0.7 版本可用_

如果您的组织使用 Ping Identity Provider (IdP)进行用户身份验证，您可以配置 Rancher 以允许您的用户使用他们的 IdP 凭据登录。

> **先决条件：**
>
> - 您必须配置一个[Ping IdP 服务器](https://www.pingidentity.com/)。
> - 以下是 Rancher 服务提供商配置所需的 URLs：
>   - Metadata URL：`https://<rancher-server>/v1-saml/ping/saml/metadata`
>   - Assertion Consumer Service(ACS) URL：`https://<rancher-server>/v1-saml/ping/saml/acs`
> - 从 IdP 服务器导出元数据`metadata.xml`文件。有关更多信息，请参见[PingIdentity 文档](https://document.pingidentity.com/pingfederate/pf83/index.shtml#concept_exportingMetadata.html)。

1. 在**全局**视图中，从主菜单中选择**安全 > 认证**。

1. 选择**PingIdentity**。

1. 完成**配置 Ping 帐户**表单。Ping IdP 允许您指定要使用的数据存储。您可以添加数据库，也可以使用现有的 ldap 服务器。例如，如果您选择 Active Directory (AD)服务器，下面的示例将描述如何将 AD 属性映射到 Rancher 中的字段。

   1. **显示名称**： 输入包含用户显示名称的 AD 属性(例如:`displayName`)。

   1. **用户名**： 输入包含用户名/给定名的 AD 属性(例如:`givenName`)。

   1. **UID**： 输入每个用户唯一的 AD 属性(例如:`sAMAccountName`，`ishedname`)。

   1. **组**： 创建用于管理组成员关系的条目(例如:`memberOf`)。

   1. **Rancher API 地址**： 输入 Rancher 服务器的 URL。

   1. **私钥**和**证书**：这是一个密钥-证书对，用于在 Rancher 和您的 IdP 之间创建一个安全 shell。

      您可以使用 openssl 命令生成一个密钥-证书对。示例如下:

      ```
      openssl req -x509 -newkey rsa:2048 -keyout myservice.key -out myservice.cert -days 365 -nodes -subj "/CN=myservice.example.com"
      ```

   1. **元数据 XML**： [从你的 IdP 服务器导出](https://documentation.pingidentity.com/pingfederate/pf83/index.shtml#concept_exportingMetadata.html)的`metadata.xml`文件。

1. 完成**配置 Ping 帐号**表单后，点击页面底部的**启用 Ping 认证**。

   Rancher 会将您重定向到 IdP 登录页面。输入使用 Ping IdP 进行身份验证的凭据，以验证您的 Rancher PingIdentity 配置。

   **注：** 您可能需要禁用弹出窗口拦截器才能看到 IdP 登录页面。

**结果：** Rancher 被配置为使用 PingIdentity 认证。您的用户现在可以使用他们的 PingIdentity 账号登录到 Rancher。

> SAML 身份验证提供商警告：
>
> - SAML 协议不支持搜索或查找用户或组。因此，将用户或组添加到 Rancher 时不会对其进行验证。
> - 添加用户时，必须正确输入确切的用户 ID（即`UID`字段）。键入用户 ID 时，将不会搜索可能匹配的其他用户 ID。
> - 添加组时，必须从文本框旁边的下拉列表中选择组。 Rancher 假定来自文本框的任何输入都是用户。
>   - 群组下拉列表仅显示您所属的群组。您将无法添加您不是其成员的组。
