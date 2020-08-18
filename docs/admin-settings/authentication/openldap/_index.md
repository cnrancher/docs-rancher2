---
title: 配置指南
description: 如果您的组织使用 LDAP 进行用户身份验证，则可以配置 Rancher 与 OpenLDAP 服务器通信以对用户进行身份验证。这使 Rancher 管理员可以对外部用户系统中的用户和组进行集群和项目的访问控制，同时允许最终用户在登录 Rancher UI 时使用其 LDAP 凭据进行身份验证。
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
  - 对接 OpenLDAP
  - 配置指南
---

_自 v2.0.5 起开始可用_

如果您的组织使用 LDAP 进行用户身份验证，则可以配置 Rancher 与 OpenLDAP 服务器通信以对用户进行身份验证。这使 Rancher 管理员可以对外部用户系统中的用户和组进行集群和项目的访问控制，同时允许最终用户在登录 Rancher UI 时使用其 LDAP 凭据进行身份验证。

## 先决条件

必须为 Rancher 配置 LDAP 绑定帐户（即服务帐户），以搜索和检索与应具有访问权限的用户和组有关的 LDAP 条目。建议不要为此目的使用管理员帐户或个人帐户，而应在 OpenLDAP 中创建一个专用帐户，该帐户对配置的 Search Base 下的用户和组具有只读访问权限（请参见下文）。

> **使用 TLS?**
>
> 如果 OpenLDAP 服务器使用的证书是自签名的，或者不是来自公认的证书颁发机构的，则请确保手头有 PEM 格式的 CA 证书（包括任何中间证书）。在配置过程中，您将必须粘贴此证书，以便 Rancher 能够验证证书链。

## 在 Rancher 中配置 OpenLDAP

配置 OpenLDAP 服务器，组和用户的设置。有关填写每个字段的帮助，请参阅[配置参考](/docs/admin-settings/authentication/openldap/openldap-config/_index)。

> 在开始之前，请阅读并了解[外部身份验证配置和用户主体](/docs/admin-settings/authentication/_index)。

1. 使用初始本地`admin`帐户登录 Rancher UI
2. 在**全局**视图中，导航至**安全 > 认证**
3. 选择 **OpenLDAP**。将显示**配置 OpenLDAP 服务**的表单。

### 测试认证

完成配置后，继续测试与 OpenLDAP 服务器的连接。如果测试成功，则表明启用了 OpenLDAP 身份验证。

> **注意：**
>
> 与在此步骤中输入的凭据有关的 OpenLDAP 用户将映射到本地 admin 帐户，并在 Rancher 中分配管理员权限。因此，您应该明智地决定要使用哪个 LDAP 帐户来执行此步骤。

1. 输入应该映射到本地主体帐户的 OpenLDAP 帐户的**用户名**和**密码**。
2. 单击**启用 OpenLDAP 认证**，以测试 OpenLDAP 连接并完成设置。

**结果：**

- 已配置 OpenLDAP 身份验证。
- 与输入的凭证有关的 LDAP 用户被映射到本地主体（系统管理员）帐户。

> **注意：**
>
> 如果在 LDAP 服务中断时，您仍然可以使用本地配置的 `admin` 帐户和密码登录。

## 故障排查

如果在测试与 OpenLDAP 服务器的连接时遇到问题，请首先仔细检查为服务帐户输入的凭据以及 Search Base 配置。您也可以检查 Rancher 日志以帮助查明问题原因。debug 日志可能包含有关该错误的更多详细信息。请参阅本文档中的[如何开启 debug 级别日志](/docs/faq/technical/_index)。
