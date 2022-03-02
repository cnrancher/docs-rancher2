---
title: 配置 OpenLDAP
weight: 1113
---

如果你的组织使用 LDAP 进行用户身份验证，则可以配置 Rancher 与 OpenLDAP 服务器通信，从而对用户进行身份验证。这使 Rancher 管理员可以对外部用户系统中的用户和组进行集群和项目的访问控制，同时允许最终用户在登录 Rancher UI 时使用 LDAP 凭证进行身份验证。

## 前提

必须为 Rancher 配置 LDAP 绑定账号（即服务账号），来搜索和检索应该具有访问权限的用户和组的 LDAP 条目。建议不要使用管理员账号或个人账号，而应在 OpenLDAP 中创建一个专用账号，该账号对配置的搜索库下的用户和组需要具有只读权限（参见下文）。

> **使用 TLS？**
>
> 如果 OpenLDAP 服务器使用的证书是自签名的或不是来自认可的证书颁发机构，请确保手头有 PEM 格式的 CA 证书（包含所有中间证书）。你必须在配置期间粘贴此证书，以便 Rancher 能够验证证书链。

## 在 Rancher 中配置 OpenLDAP

配置 OpenLDAP 服务器，组和用户的设置。有关填写每个字段的帮助，请参见[配置参考](./openldap-config)。

> 在开始之前，请熟悉[外部身份验证配置和主体用户]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/#external-authentication-configuration-and-principal-users)的概念。

1. 在左上角，单击 **☰ > 用户 & 认证**。
1. 在左侧导航栏，单击**认证**。
1. 单击 **OpenLDAP**。填写**配置 OpenLDAP 服务器**表单。
1. 点击**启用**。

### 测试身份验证

完成配置后，请测试与 OpenLDAP 服务器的连接。如果测试成功，则表明 OpenLDAP 身份验证已启用。

> **注意**：
>
> 与此步骤中输入的凭据相关的 OpenLDAP 用户将映射到本地主体账号，并在 Rancher 中分配系统管理员权限。因此，你应该决定使用哪个 OpenLDAP 账号来执行此步骤。

1. 输入应映射到本地主体账号的 OpenLDAP 账号的**用户名**和**密码** 。
2. 点击**启用 OpenLDAP 认证**来测试 OpenLDAP 的连接并完成设置。

**结果**：

- OpenLDAP 验证配置成功。
- 与输入凭证对应的 LDAP 用户被映射到本地主体（管理员）账号。

> **注意**：
>
> 如果 LDAP 服务中断，你仍然可以使用本地配置的 `admin` 账号和密码登录。

## 附录：故障排查

如果在测试与 OpenLDAP 服务器的连接时遇到问题，请首先仔细检查为服务账号输入的凭证以及搜索库配置。你还可以检查 Rancher 日志来查明问题的原因。调试日志可能包含有关错误的更详细信息。详情请参见[如何启用调试日志]({{<baseurl>}}/rancher/v2.6/en/faq/technical/#how-can-i-enable-debug-logging)。
