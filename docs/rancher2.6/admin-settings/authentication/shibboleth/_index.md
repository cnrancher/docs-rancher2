---
title: 配置 Shibboleth (SAML)
weight: 1210
---

如果你的组织使用 Shibboleth Identity Provider (IdP)) 进行用户身份验证，你可以通过配置 Rancher 来允许用户使用 Shibboleth 凭证登录。

在此配置中，当 Rancher 用户登录时，他们将被重定向到 Shibboleth IdP 来输入凭证。身份验证结束后，他们将被重定向回 Rancher UI。

如果你将 OpenLDAP 配置为 Shibboleth 的后端，SAML 断言会返回到 Rancher，其中包括用于引用组的用户属性。然后，通过身份验证的用户将能够访问其所在的组有权访问的 Rancher 资源。

> 本节假定你已了解 Rancher，Shibboleth 和 OpenLDAP 是如何协同工作的。有关工作原理的详细说明，请参见[本页](./about)。

本节涵盖以下主题：

- [在 Rancher 中设置 Shibboleth](#setting-up-shibboleth-in-rancher)
  - [Shibboleth 前提](#shibboleth-prerequisites)
  - [在 Rancher 中配置 Shibboleth](#configure-shibboleth-in-rancher)
  - [SAML 提供商注意事项](#saml-provider-caveats)
- [在 Rancher 中设置 OpenLDAP](#setting-up-openldap-in-rancher)
  - [OpenLDAP 前提](#openldap-prerequisites)
  - [在 Rancher 中配置 OpenLDAP](#configure-openldap-in-rancher)
  - [故障排查](#troubleshooting)

# 在 Rancher 中设置 Shibboleth

### Shibboleth 前提

> - 你必须配置了 Shibboleth IdP 服务器。
> - 以下是 Rancher Service Provider 配置所需的 URL：
>   元数据 URL：`https://<rancher-server>/v1-saml/shibboleth/saml/metadata`
>   断言使用者服务 (ACS) URL：`https://<rancher-server>/v1-saml/shibboleth/saml/acs`
> - 从 IdP 服务器导出 `metadata.xml` 文件。详情请参见 [Shibboleth 文档](https://wiki.shibboleth.net/confluence/display/SP3/Home)。

### 在 Rancher 中配置 Shibboleth

如果你的组织使用 Shibboleth 进行用户身份验证，你可以通过配置 Rancher 来允许你的用户使用 IdP 凭证登录。

1. 在左上角，单击 **☰ > 用户 & 认证**。
1. 在左侧导航栏，单击**认证**。
1. 单击 **Shibboleth**。
1. 填写**配置 Shibboleth 账号**表单。Shibboleth IdP 允许你指定要使用的数据存储。你可以添加数据库或使用现有的 ldap 服务器。例如，如果你选择 Active Directory (AD) 服务器，下面的示例将描述如何将 AD 属性映射到 Rancher 中的字段：

   1. **显示名称字段**：包含用户显示名称的 AD 属性（例如：`displayName`）。

   1. **用户名字段**：包含用户名/给定名称的 AD 属性（例如：`givenName`）。

   1. **UID 字段**：每个用户唯一的 AD 属性（例如：`sAMAccountName`、`distinguishedName`）。

   1. **用户组字段**: 创建用于管理组成员关系的条目（例如：`memberOf`）。

   1. **Rancher API 主机**：你的 Rancher Server 的 URL。

   1. **私钥**和**证书**：密钥/证书对，用于在 Rancher 和你的 IdP 之间创建一个安全外壳（SSH）。

      你可以使用 openssl 命令进行创建。例如：

      ```
      openssl req -x509 -newkey rsa:2048 -keyout myservice.key -out myservice.cert -days 365 -nodes -subj "/CN=myservice.example.com"
      ```

   1. **IDP 元数据**：从 IdP 服务器导出的 `metadata.xml` 文件。

1. 完成**配置 Shibboleth 账号**表单后，单击**启用**。

   Rancher 会将你重定向到 IdP 登录页面。输入使用 Shibboleth IdP 进行身份验证的凭证，来验证你的 Rancher Shibboleth 配置。

   > **注意**：你可能需要禁用弹出窗口阻止程序才能看到 IdP 登录页面。

**结果**：已将 Rancher 配置为使用 Shibboleth。你的用户现在可以使用 Shibboleth 登录名登录 Rancher。

### SAML 提供商注意事项

SAML 协议不支持用户或用户组的搜索或查找。因此，如果你没有为 Shibboleth 配置 OpenLDAP，则请留意以下警告。

- 在 Rancher 中为用户或组分配权限时，不会对用户或组进行验证。
- 添加用户时，必须正确输入准确的用户 ID（即 UID 字段）。在你输入用户 ID 时，将不会搜索可能匹配的其他用户 ID。
- 添加组时，你必须从文本框旁边的下拉列表中选择组。Rancher 假设文本框的所有输入都是用户。
- 组下拉列表仅显示你所属的组。如果你不是某个组的成员，你将无法添加该组。

要在 Rancher 中分配权限时启用搜索组，你需要为支持组的 SAML 身份验证提供商配置后端（例如 OpenLDAP）。

# 在 Rancher 中设置 OpenLDAP

如果你将 OpenLDAP 配置为 Shibboleth 的后端，SAML 断言会返回到 Rancher，其中包括用于引用组的用户属性。然后，通过身份验证的用户将能够访问其所在的组有权访问的 Rancher 资源。

### OpenLDAP 前提

必须为 Rancher 配置 LDAP 绑定账号（即服务账号），来搜索和检索应该具有访问权限的用户和组的 LDAP 条目。建议不要使用管理员账号或个人账号，而应在 OpenLDAP 中创建一个专用账号，该账号对配置的搜索库下的用户和组需要具有只读权限（参见下文）。

> **使用 TLS？**
>
> 如果 OpenLDAP 服务器使用的证书是自签名的或不是来自认可的证书颁发机构，请确保手头有 PEM 格式的 CA 证书（包含所有中间证书）。你必须在配置期间粘贴此证书，以便 Rancher 能够验证证书链。

### 在 Rancher 中配置 OpenLDAP

配置 OpenLDAP 服务器，组和用户的设置。有关填写每个字段的帮助，请参见[配置参考]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/openldap/openldap-config)。请注意，嵌套组成员资格不适用于 Shibboleth。

> 在开始之前，请熟悉[外部身份验证配置和主体用户]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/#external-authentication-configuration-and-principal-users)的概念。

1. 使用初始的本地 `admin` 账号登录到 Rancher UI。
1. 在左上角，单击 **☰ > 用户 & 认证**。
1. 在左侧导航栏，单击**认证**。
1. 单击 **OpenLDAP**。将显示**配置 OpenLDAP 服务器**表单。

# 故障排查

如果在测试与 OpenLDAP 服务器的连接时遇到问题，请首先仔细检查为服务账号输入的凭证以及搜索库配置。你还可以检查 Rancher 日志来查明问题的原因。调试日志可能包含有关错误的更详细信息。详情请参见[如何启用调试日志]({{<baseurl>}}/rancher/v2.6/en/faq/technical/#how-can-i-enable-debug-logging)。
