---
title: 配置指南
---

_自 v2.4.0 起可用_

如果您的组织使用 Shibboleth 认证系统（IdP）进行用户身份验证，可以将 Rancher 与 Shibboleth 进行对接，从而允许用户使用 Shibboleth 凭据登录到 Rancher。

在此配置中，当 Rancher 用户登录时，他们将被重定向到 Shibboleth IdP 以输入其凭据。身份验证结束后，它们将被重定向回 Rancher UI。

如果您将 OpenLDAP 配置为了 Shibboleth 的后端，它将返回一个 SAML 断言给 Rancher，其中包含用户的属性（其中包括用户所在的组的信息）。 然后，通过身份验证的用户将能够访问其所在的组有权访问的 Rancher 中的资源。

> 本节中的说明假定您了解 Rancher，Shibboleth 和 OpenLDAP 是如何协同工作的。有关其工作原理的详细说明，请参阅[本页](/docs/admin-settings/authentication/shibboleth/about/_index)。

## 在 Rancher 中设置 Shibboleth

### Shibboleth 先决条件

> - 您必须有配置好的 Shibboleth IdP 服务器。
> - 以下是配置所需的 Rancher 服务 Provider URL：
>   元数据 URL：`https://<rancher-server>/v1-saml/shibboleth/saml/metadata`
>   断言消费者服务（ACS）URL：`https://<rancher-server>/v1-saml/shibboleth/saml/acs`
> - 从您的 IdP 服务器导出`metadata.xml`文件。有关更多信息，请参见[Shibboleth 文档](https://wiki.shibboleth.net/confluence/display/SP3/Home)。

### 在 Rancher 中配置 Shibboleth

如果您的组织使用 Shibboleth 进行用户身份验证，则可以配置 Rancher 允许用户使用其 IdP 凭据登录。

1. 在**全局**视图中，从主菜单中选择**安全 > 认证**。

1. 选择 **Shibboleth**。

1. 填写**配置 Shibboleth 帐户**表单。Shibboleth IdP 允许您指定要使用的数据存储。您可以添加数据库或使用现有的 ldap 服务器。例如，如果选择 Active Directory（AD）服务器，则以下示例说明如何将 AD 属性映射到 Rancher 中的字段。

   1. **显示名称字段**：输入包含用户显示名称的 AD 属性（例如：`displayName`）。

   1. **用户名字段**：输入包含用户名的 AD 属性（例如：`givenName`）。

   1. **UID 字段**：输入每个用户唯一的 AD 属性（例如：`sAMAccountName`，`distinguishedName`）。

   1. **Groups 字段**：输入用于管理组成员身份的条目（例如：`memberOf`）。

   1. **Rancher API 地址**：输入 Rancher Server 的 URL。

   1. **私钥**和**证书**：这是一个密钥证书对，用于在 Rancher 和您的 IdP 之间创建安全的连接。

      您可以使用 openssl 命令生成一个。例如：

      ```
      openssl req -x509 -newkey rsa:2048 -keyout myservice.key -out myservice.cert -days 365 -nodes -subj "/CN=myservice.example.com"
      ```

   1. **IDP-metadata**：您从 IdP 服务器导出的`metadata.xml`文件。

1. 在完成**配置 Shibboleth 帐户**表单后，单击页面底部的**启用 Shibboleth 认证**。

   Rancher 将您重定向到 IdP 登录页面。输入通过 Shibboleth IdP 进行身份验证的凭据，以验证您的 Rancher Shibboleth 配置。

   > **注意：** 您可能必须禁用阻止浏览器弹出窗口的程序才能查看 IdP 登录页面。

**结果：** Rancher 配置为可与 Shibboleth 一起使用。您的用户现在可以使用其 Shibboleth 登录名登录 Rancher。

### SAML 身份验证提供者警告

因为 SAML 协议不支持用户或用户组的搜索或查找，如果您没有使用 OpenLDAP 的配置 Shibboleth，则以下警告适用。

- 将用户或组添加到 Rancher 时不会对其进行验证。

- 添加用户时，必须正确输入确切的用户 ID（即`UID`字段）。键入用户 ID 时，将不会搜索可能匹配的其他用户 ID。

- 添加组时，必须从文本框旁边的下拉列表中选择组。Rancher 假定来自文本框的任何输入都是用户。

- 添加组时，必须从文本框旁边的下拉列表中选择组。 Rancher 假定来自文本框的任何输入都是用户。

- 用户组下拉列表仅显示您所属的用户组。您将无法添加您不是其成员的组。

要在 Rancher 中分配权限时支持搜索组的功能，您需要为支持组的 SAML 身份验证提供者配置一个后端（例如 OpenLDAP）。

## 在 Rancher 中设置 OpenLDAP

如果您将 OpenLDAP 配置为了 Shibboleth 的后端，它将返回一个 SAML 断言给 Rancher，其中包含用户的属性（其中包括用户所在的组的信息）。 然后，通过身份验证的用户将能够访问其所在的组有权访问的 Rancher 中的资源。

### OpenLDAP 先决条件

必须为 Rancher 配置 LDAP 绑定帐户（即服务帐户），以搜索和检索有权限访问的用户和用户组的 LDAP 条目。建议不要在这里使用管理员帐户或个人帐户，应该在 OpenLDAP 中创建一个专用帐户，该帐户对配置的 Search Base 下的用户和组具有只读访问权限（请参见下文）。

> **使用 TLS?**
>
> 如果 OpenLDAP 服务器使用的证书是自签名的，或者不是来自公认的证书颁发机构的，则请确保手头有 PEM 格式的 CA 证书（包括任何中间证书）。在配置过程中，您将必须粘贴此证书，以便 Rancher 能够验证证书链。

### 在 Rancher 中配置 OpenLDAP

配置 OpenLDAP 服务器，组和用户的设置。有关填写每个字段的帮助，请参考[配置参考](/docs/admin-settings/authentication/openldap/openldap-config/_index)。注意，嵌套的组成员身份不适用于 Shibboleth。

> 在进行配置之前，请阅读并了解[外部身份验证配置和用户主体](/docs/admin-settings/authentication/_index)

1. 使用默认本地`admin`帐户登录 Rancher UI。

2. 从**全局**视图中，导航到**安全 > 认证**。

3. 选择 **OpenLDAP**。将会显示**配置 OpenLDAP 服务器**表单。

# 故障排查

如果在测试 Rancher 与 OpenLDAP 服务器的连接时遇到问题，请首先仔细检查输入的服务帐户的凭据以及 Search Base 配置。您也可以检查 Rancher 日志以帮助查明问题原因。调试日志可能包含有关该错误的更多详细信息。请参阅本文档中的[如何启用 debug 级别日志](/docs/faq/technical/_index)。
