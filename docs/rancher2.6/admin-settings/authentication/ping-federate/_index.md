---
title: 配置 PingIdentity (SAML)
weight: 1200
---

如果你的组织使用 Ping Identity Provider (IdP) 进行用户身份验证，你可以通过配置 Rancher 来允许用户使用 IdP 凭证登录。

> **前提**：
>
> - 你必须配置了 [Ping IdP 服务器](https://www.pingidentity.com/)。
> - 以下是 Rancher Service Provider 配置所需的 URL：
>   元数据 URL：`https://<rancher-server>/v1-saml/ping/saml/metadata`
>   断言使用者服务 (ACS) URL：`https://<rancher-server>/v1-saml/ping/saml/acs`
>   请注意，在 Rancher 中保存验证配置之前，这些 URL 不会返回有效数据。
> - 从 IdP 服务器导出 `metadata.xml` 文件。详情请参见 [PingIdentity 文档](https://documentation.pingidentity.com/pingfederate/pf83/index.shtml#concept_exportingMetadata.html)。

1. 在左上角，单击 **☰ > 用户 & 认证**。
1. 在左侧导航栏，单击**认证**。
1. 单击 **Ping Identity**。
1. 填写**配置 Ping 账号**表单。Ping IdP 允许你指定要使用的数据存储。你可以添加数据库或使用现有的 ldap 服务器。例如，如果你选择 Active Directory (AD) 服务器，下面的示例将描述如何将 AD 属性映射到 Rancher 中的字段：

   1. **显示名称字段**：包含用户显示名称的 AD 属性（例如：`displayName`）。

   1. **用户名字段**：包含用户名/给定名称的 AD 属性（例如：`givenName`）。

   1. **UID 字段**：每个用户唯一的 AD 属性（例如：`sAMAccountName`、`distinguishedName`）。

   1. **用户组字段**: 创建用于管理组成员关系的条目（例如：`memberOf`）。

   1. **Entity ID 字段**（可选）：你的合作伙伴已公布的、依赖协议的、唯一的标识符。该 ID 将你的组织定义为将服务器用于 SAML 2.0 事务的实体。这个 ID 可以通过带外传输或 SAML 元数据文件获得。

   1. **Rancher API 主机**：你的 Rancher Server 的 URL。

   1. **私钥**和**证书**：密钥/证书对，用于在 Rancher 和你的 IdP 之间创建一个安全外壳（SSH）。

      你可以使用 openssl 命令进行创建。例如：

      ```
      openssl req -x509 -newkey rsa:2048 -keyout myservice.key -out myservice.cert -days 365 -nodes -subj "/CN=myservice.example.com"
      ```

   1. **IDP 元数据**：[从 IdP 服务器导出的 `metadata.xml` 文件](https://documentation.pingidentity.com/pingfederate/pf83/index.shtml#concept_exportingMetadata.html)。

1. 完成**配置 Ping 账号**表单后，单击**启用**。

   Rancher 会将你重定向到 IdP 登录页面。输入使用 Ping IdP 进行身份验证的凭证，来验证你的 Rancher PingIdentity 配置。

   > **注意**：你可能需要禁用弹出窗口阻止程序才能看到 IdP 登录页面。

**结果**：已将 Rancher 配置为使用 PingIdentity。你的用户现在可以使用 PingIdentity 登录名登录 Rancher。

> SAML 身份验证提供者警告：
>
> - SAML 协议不支持搜索或查找用户或组。因此，将用户或组添加到 Rancher 时不会对其进行验证。
> - 添加用户时，必须正确输入确切的用户 ID（即 `UID` 字段）。键入用户 ID 时，将不会搜索可能匹配的其他用户 ID。
> - 添加组时，必须从文本框旁边的下拉列表中选择组。Rancher 假定来自文本框的任何输入都是用户。
>   - 用户组下拉列表仅显示你所属的用户组。如果你不是某个组的成员，你将无法添加该组。
