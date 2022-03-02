---
title: OpenLDAP 配置参考
weight: 2
---

本文提供在 Rancher 中设置 OpenLDAP 身份验证的参考。

有关配置 OpenLDAP 的更多详细信息，请参见[官方文档](https://www.openldap.org/doc/)。

> 在开始之前，请熟悉[外部身份验证配置和主体用户]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/#external-authentication-configuration-and-principal-users)的概念。

- [背景：OpenLDAP 认证流程](#background-openldap-authentication-flow)
- [OpenLDAP 服务器配置](#openldap-server-configuration)
- [用户/组 Schema 配置](#user-group-schema-configuration)
  - [用户 Schema 配置](#user-schema-configuration)
  - [组 Schema 配置](#group-schema-configuration)

## 背景：OpenLDAP 认证流程

1. 当用户尝试使用其 LDAP 凭证登录时，Rancher 会使用具有搜索目录和读取用户/组属性权限的服务账号，创建与 LDAP 服务器的初始绑定。
2. 然后，Rancher 使用搜索筛选器根据用户名和配置的属性映射为用户搜索目录。
3. 找到用户后，将使用用户的 DN 和提供的密码，通过另一个 LDAP 绑定请求对用户进行身份验证。
4. 身份验证成功后，Rancher 将基于用户对象的成员属性和配置的用户映射属性执行组搜索，来解析组成员。

## OpenLDAP 服务器配置

你将需要输入地址，端口和协议来连接到 OpenLDAP 服务器。不安全流量的标准端口为 `389`，TLS 流量的标准端口为 `636`。

> **使用 TLS？**
>
> 如果 OpenLDAP 服务器使用的证书是自签名的或不是来自认可的证书颁发机构，请确保手头有 PEM 格式的 CA 证书（包含所有中间证书）。你必须在配置期间粘贴此证书，以便 Rancher 能够验证证书链。

如果你不确定要在用户/组`搜索库`字段中输入什么值，请咨询你的 LDAP 管理员，或参见 Active Directory 身份验证文档中的[使用 ldapsearch 确定搜索库和 Schema]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/ad/#annex-identify-search-base-and-schema-using-ldapsearch) 章节。

<figcaption>OpenLDAP 服务器参数</figcaption>

| 参数             | 描述                                                                                                                                 |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| 主机名           | 指定 OpenLDAP 服务器的主机名或 IP 地址。                                                                                             |
| 端口             | 指定 OpenLDAP 服务器监听连接的端口。未加密的 LDAP 通常使用 389 的标准端口，而 LDAPS 使用 636 端口。                                  |
| TLS              | 选中此框可启用 SSL/TLS 上的 LDAP（通常称为 LDAPS）。如果服务器使用自签名/企业签名的证书，则还需要粘贴 CA 证书。                      |
| 服务器连接超时   | Rancher 在认为无法访问服务器之前等待的时间（秒）。                                                                                   |
| 服务账号标识名称 | 输入用于绑定，搜索和检索 LDAP 条目的用户的标识名称（DN）。                                                                           |
| 服务账号密码     | 服务账号的密码。                                                                                                                     |
| 用户搜索库       | 输入目录树中开始搜索用户对象的节点的标识名称（DN）。所有用户都必须是此基础标识名称的后代。例如，"ou=people,dc=acme,dc=com"。         |
| 组搜索库         | 如果组位于`用户搜索库`下配置的节点之外的其他节点下，则需要在此处提供标识名称。否则，将此字段留空。例如："ou=groups,dc=acme,dc=com"。 |

## 用户/组 Schema 配置

如果你的 OpenLDAP 目录不同于标准的 OpenLDAP Schema，则必须完成**自定义 Schema** 部分实现匹配。

请注意，Rancher 使用本节中配置的属性映射来构造搜索筛选器和解析组成员。因此，我们建议你验证此处的配置是否与你在 OpenLDAP 中使用的 Schema 匹配。

如果你不确定 OpenLDAP 服务器中使用的用户/组 Schema，请咨询你的 LDAP 管理员，或参见 Active Directory 身份验证文档中的[使用 ldapsearch 确定搜索库和 Schema]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/ad/#annex-identify-search-base-and-schema-using-ldapsearch) 章节。

### 用户 Schema 配置

下表详细说明了用户 Schema 配置的参数。

<figcaption>用户 Schema 配置参数</figcaption>

| 参数                    | 描述                                                                                                                                                               |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Object Class            | 域中用于用户对象的对象类别名称。如果定义了此参数，则仅指定对象类别的名称 - *请勿*将其放在 LDAP 包装器中，例如 `&(objectClass=xxxx)`。                              |
| Username Attribute      | 用户属性的值适合作为显示名称。                                                                                                                                     |
| Login Attribute         | 登录属性的值与用户登录 Rancher 时输入的凭证的用户名部分匹配。通常是 `uid`。                                                                                        |
| User Member Attribute   | 包含用户所属组的标识名称的用户属性。通常是 `memberOf` 或 `isMemberOf`。                                                                                            |
| Search Attribute        | 当用户输入文本以在用户界面中添加用户或组时，Rancher 会查询 LDAP 服务器，并尝试根据此设置中提供的属性匹配用户。可以通过使用管道（“\|”）符号分隔属性来指定多个属性。 |
| User Enabled Attribute  | 如果 OpenLDAP 服务器的 Schema 支持使用用户属性的值来评估账号是禁用还是关闭，请输入该属性的名称。默认的 OpenLDAP Schema 不支持此功能，因此此字段通常留空。          |
| Disabled Status Bitmask | 禁用/锁定的用户账号的值。如果 `User Enabled Attribute` 是空的，则忽略此参数。                                                                                      |

### 组 Schema 配置

下表详细说明了组 Schema 配置的参数。

<figcaption>组 Schema 配置参数<figcaption>

| 参数                           | 描述                                                                                                                                                           |
| :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Object Class                   | 域中用于组条目的对象类别名称。如果定义了此参数，则仅指定对象类别的名称 - *请勿*将其放在 LDAP 包装器中，例如 `&(objectClass=xxxx)`。                            |
| Name Attribute                 | 名称属性的值适合作为显示名称。                                                                                                                                 |
| Group Member User Attribute    | **用户属性**的名称。它的格式与 `Group Member Mapping Attribute` 中的组成员匹配。                                                                               |
| Group Member Mapping Attribute | 包含组成员的组属性的名称。                                                                                                                                     |
| Search Attribute               | 在 UI 中将组添加到集群或项目时，用于构造搜索筛选器的属性。请参见用户 Schema 的 `Search Attribute`。                                                            |
| Group DN Attribute             | 组属性的名称，其格式与用户的组成员属性中的值匹配。参见 `User Member Attribute`。                                                                               |
| Nested Group Membership        | 此设置定义 Rancher 是否应解析嵌套组成员身份。仅当你的组织使用这些嵌套成员身份时才使用（即你有包含其他组作为成员的组）。如果你使用 Shibboleth，此选项会被禁用。 |
