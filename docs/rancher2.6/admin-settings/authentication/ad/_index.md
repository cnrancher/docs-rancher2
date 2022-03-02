---
title: 配置 Active Directory (AD)
weight: 1112
---

如果你的组织使用 Microsoft Active Directory 作为中心用户仓库，你可以将 Rancher 配置为与 Active Directory 服务器通信，从而对用户进行身份验证。这使 Rancher 管理员可以对外部用户系统中的用户和组进行集群和项目的访问控制，同时允许最终用户在登录 Rancher UI 时使用 Active Directory 凭证进行身份验证。

Rancher 使用 LDAP 与 Active Directory 服务器通信。因此，Active Directory 与 [OpenLDAP 身份验证]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/openldap)的流程相同。

> **注意**：
>
> 在开始之前，请熟悉[外部身份验证配置和主体用户]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/#external-authentication-configuration-and-principal-users)的概念。

## 前提

你需要创建或从你的 AD 管理员处获取一个新的 AD 用户，用作 Rancher 的服务账号。此用户必须具有足够的权限，才能执行 LDAP 搜索并读取你的 AD 域下的用户和组的属性。

通常可以使用（非管理员）**域用户**账号，因为默认情况下，该用户对域分区中的大多数对象具有只读特权。

但是，请注意，在某些锁定的 Active Directory 配置中，此默认操作可能不适用。在这种情况下，你需要确保服务账号用户在 Base OU（包含用户和组）上或全局范围内至少拥有域的 **Read** 和 **List Content** 权限。

> **使用 TLS？**
>
> 如果 AD 服务器使用的证书是自签名的或不是来自认可的证书颁发机构，请确保手头有 PEM 格式的 CA 证书（包含所有中间证书）。你必须在配置期间粘贴此证书，以便 Rancher 能够验证证书链。

## 配置步骤
### 打开 Active Directory 配置

1. 使用初始的本地 `admin` 账号登录到 Rancher UI。
1. 在左上角，单击 **☰ > 用户 & 认证**。
1. 在左侧导航栏，单击**认证**。
1. 单击 **ActiveDirectory**。然后会显示**验证提供程序：ActiveDirectory** 的表单。
1. 填写表单。如果需要获取帮助，请参见下方的配置选项详情。
1. 点击**启用**。

### 配置 Active Directory 服务器

在 `1. 配置 Active Directory 服务器` 的步骤中，使用你 Active Directory 的实际信息完成字段配置。有关每个参数所需值的详细信息，请参阅下表。

> **注意**：
>
> 如果你不确定要在用户/组`搜索库`字段中输入什么值，请参见[使用 ldapsearch 确定搜索库和 Schema](#annex-identify-search-base-and-schema-using-ldapsearch)。

**表 1：AD 服务器参数**

| 参数 | 描述 |
|:--|:--|
| 主机名 | 指定 AD 服务器的主机名或 IP 地址。 |
| 端口 | 指定 AD 服务器监听连接的端口。未加密的 LDAP 通常使用 389 的标准端口，而 LDAPS 使用 636 端口。 |
| TLS | 选中此框可启用 SSL/TLS 上的 LDAP（通常称为 LDAPS）。 |
| 服务器连接超时 | Rancher 在认为无法访问 AD 服务器之前等待的时间（秒）。 |
| 服务账号用户名 | 输入对域分区具有只读访问权限的 AD 账号的用户名（参见[前提](#prerequisites)）。用户名可以用 NetBIOS（例如 "DOMAIN\serviceaccount"）或 UPN 格式（例如 "serviceaccount@domain.com"）。 |
| 服务账号密码 | 服务账号的密码。 |
| 默认登录域 | 如果你使用 AD 域的 NetBIOS 名称配置此字段，在绑定到 AD 服务器时，没有包含域的用户名（例如“jdoe”）将自动转换为带斜杠的 NetBIOS 登录（例如，“LOGIN_DOMAIN\jdoe”）。如果你的用户以 UPN（例如，"jdoe@acme.com"）作为用户名进行身份验证，则此字段必须**必须**留空。 |
| 用户搜索库 | 输入目录树中开始搜索用户对象的节点的标识名称（DN）。所有用户都必须是此基础标识名称的后代。例如，"ou=people,dc=acme,dc=com"。 |
| 组搜索库 | 如果组位于`用户搜索库`下配置的节点之外的其他节点下，则需要在此处提供标识名称。否则请留空。例如："ou=groups,dc=acme,dc=com"。 |

---

### 配置用户/组 Schema

在 `2. 自定义 Schema` 中，你必须为 Rancher 提供与目录中使用的 Schema 对应的用户和组属性的正确映射。

Rancher 使用 LDAP 查询来搜索和检索关于 Active Directory 中的用户和组的信息。本节中配置的属性映射用于构造搜索筛选器和解析组成员身份。因此，所提供的设置需要反映你 AD 域的真实情况。

> **注意**：
>
> 如果你不熟悉 Active Directory 域中使用的 Schema，请参见[使用 ldapsearch 确定搜索库和 Schema](#annex-identify-search-base-and-schema-using-ldapsearch) 来确定正确的配置值。

#### 用户 Schema

下表详细说明了用户 Schema 配置的参数。

**表 2：用户 Schema 配置参数**

| 参数 | 描述 |
|:--|:--|
| Object Class | 域中用于用户对象的对象类别名称。如果定义了此参数，则仅指定对象类别的名称 - *请勿*将其放在 LDAP 包装器中，例如 `&(objectClass=xxxx)`。 |
| Username Attribute | 用户属性的值适合作为显示名称。 |
| Login Attribute | 登录属性的值与用户登录 Rancher 时输入的凭证的用户名部分匹配。如果你的用户以他的 UPN（例如 "jdoe@acme.com"）作为用户名进行身份验证，则此字段通常必须设置为 `userPrincipalName`。否则，对于旧的 NetBIOS 风格的登录名（例如 "jdoe"），则通常设为 `sAMAccountName`。 |
| User Member Attribute | 包含用户所属组的属性。 |
| Search Attribute | 当用户输入文本以在用户界面中添加用户或组时，Rancher 会查询 AD 服务器，并尝试根据此设置中提供的属性匹配用户。可以通过使用管道（“\|”）符号分隔属性来指定多个属性。要匹配 UPN 用户名（例如 jdoe@acme.com），通常应将此字段的值设置为 `userPrincipalName`。 |
| Search Filter | 当 Rancher 尝试将用户添加到网站访问列表，或尝试将成员添加到集群或项目时，此筛选器将应用于搜索的用户列表。例如，用户搜索筛选器可能是 <code>(&#124;(memberOf=CN=group1,CN=Users,DC=testad,DC=rancher,DC=io)(memberOf=CN=group2,CN=Users,DC=testad,DC=rancher,DC=io))</code>。注意：如果搜索筛选器未使用[有效的 AD 搜索语法](https://docs.microsoft.com/en-us/windows/win32/adsi/search-filter-syntax)，则用户列表将为空。 |
| User Enabled Attribute | 该属性是一个整数值，代表用户账号标志的枚举。Rancher 使用此选项来确定用户账号是否已禁用。通常应该将此参数设置为 AD 标准的 `userAccountControl`。 |
| Disabled Status Bitmask | 指定的禁用用户账号的 `User Enabled Attribute` 的值。通常，你应该将此参数设置为 Microsoft Active Directory Schema 中指定的默认值 2（请参见[此处](https://docs.microsoft.com/en-us/windows/desktop/adschema/a-useraccountcontrol#remarks)）。 |

---

#### 组 Schema

下表详细说明了组 Schema 配置的参数。

**表 3：组 Schema 配置参数**

| 参数 | 描述 |
|:--|:--|
| Object Class | 域中用于组对象的对象类别名称。如果定义了此参数，则仅指定对象类别的名称 - *请勿*将其放在 LDAP 包装器中，例如 `&(objectClass=xxxx)`。 |
| Name Attribute | 名称属性的值适合作为显示名称。 |
| Group Member User Attribute | **用户属性**的名称。它的格式与 `Group Member Mapping Attribute` 中的组成员匹配。 |
| Group Member Mapping Attribute | 包含组成员的组属性的名称。 |
| Search Attribute | 在将组添加到集群或项目时，用于构造搜索筛选器的属性。请参见用户 Schema 的 `Search Attribute`。 |
| Search Filter | 当 Rancher 尝试将组添加到网站访问列表，或将组添加到集群或项目时，此筛选器将应用于搜索的组列表。例如，组搜索筛选器可以是 <code>(&#124;(cn=group1)(cn=group2))</code>。注意：如果搜索筛选器未使用[有效的 AD 搜索语法](https://docs.microsoft.com/en-us/windows/win32/adsi/search-filter-syntax)，则组列表将为空。 |
| Group DN Attribute | 组属性的名称，其格式与描述用户成员身份的用户属性中的值匹配。参见 `User Member Attribute`。 |
| Nested Group Membership | 此设置定义 Rancher 是否应解析嵌套组成员身份。仅当你的组织使用这些嵌套成员身份时才使用（即你有包含其他组作为成员的组。我们建议尽量避免使用嵌套组）。 |

---

### 测试身份验证

完成配置后，请**使用你的 AD 管理员账户**测试与 AD 服务器的连接。如果测试成功，将启用配置的 Active Directory 身份验证，测试时使用的账号会成为管理员。

> **注意**：
>
> 与此步骤中输入的凭据相关的 AD 用户将映射到本地主体账号，并在 Rancher 中分配系统管理员权限。因此，你应该决定使用哪个 AD 账号来执行此步骤。

1. 输入应映射到本地主体账号的 AD 账号的**用户名**和**密码** 。
2. 点击**启用 Active Directory 认证**来完成设置。

**结果**：

- 已启用 Active Directory 身份验证。
- 你已使用 AD 凭证以系统管理员身份登录到 Rancher。

> **注意**：
>
> 如果 LDAP 服务中断，你仍然可以使用本地配置的 `admin` 账号和密码登录。

## 附录：使用 ldapsearch 确定搜索库和 Schema

为了成功配置 AD 身份验证，你必须提供 AD 服务器的层次结构和 Schema 的正确配置。

[`ldapsearch`](http://manpages.ubuntu.com/manpages/artful/man1/ldapsearch.1.html) 工具允许你查询你的 AD 服务器，从而了解用于用户和组对象的 Schema。

在下面的示例命令中，我们假设：

- Active Directory 服务器的主机名是 `ad.acme.com`。
- 服务器正在监听端口 `389` 上的未加密连接。
- Active Directory 的域是 `acme`。
- 你有一个用户名为 `jdoe`，密码为 `secret` 的有效 AD 账号。

### 确认搜索库

首先，我们将使用 `ldapsearch` 来找到用户和组的父节点的标识名称：

```
$ ldapsearch -x -D "acme\jdoe" -w "secret" -p 389 \
-h ad.acme.com -b "dc=acme,dc=com" -s sub "sAMAccountName=jdoe"
```

此命令执行 LDAP 搜索，搜索起点设置为域根目录（`-b "dc=acme,dc=com"`），并执行针对用户账号（`sAMAccountNam=jdoe`）的筛选器，返回所述用户的属性：

{{< img "/img/rancher/ldapsearch-user.png" "LDAP User">}}

因为在这种情况下，用户的 DN 是 `CN=John Doe,CN=Users,DC=acme,DC=com` [5]，所以我们应该使用父节点 DN `CN=Users,DC=acme,DC=com` 来配置**用户搜索库**。

同样，基于 **memberOf** 属性 [4] 中引用的组的 DN，**组搜索库**的值将是该值的父节点，即 `OU=Groups,DC=acme,DC=com`。

### 确定用户 Schema

上述 `ldapsearch` 查询的输出还能用于确定在用户 Schema 配置中使用的值：

- `Object Class`：**person** [1]
- `Username Attribute`:：**name** [2]
- `Login Attribute`：**sAMAccountName** [3]
- `User Member Attribute`：**memberOf** [4]

> **注意**：
>
> 如果我们组织中的 AD 用户使用其 UPN（例如 `jdoe@acme.com`）而不是短登录名进行身份验证，则必须将 `Login Attribute` 设置为 **userPrincipalName**。

我们还将 `Search Attribute` 数设置为 **sAMAccountName|name**。这样，用户可以通过输入用户名或全名添加到 Rancher UI 中的集群/项目中。

### 确定组 Schema

接下来，我们将查询与此用户关联的一个组，在本例中为 `CN=examplegroup,OU=Groups,DC=acme,DC=com`：

```
$ ldapsearch -x -D "acme\jdoe" -w "secret" -p 389 \
-h ad.acme.com -b "ou=groups,dc=acme,dc=com" \
-s sub "CN=examplegroup"
```

此命令将告知我们用于组对象的属性：

{{< img "/img/rancher/ldapsearch-group.png" "LDAP Group">}}

同样，这能让我们确定要在组 Schema 配置中输入的值：

- `Object Class`：**group** [1]
- `Name Attribute`：**name** [2]
- `Group Member Mapping Attribute`：**member** [3]
- `Search Attribute`：**sAMAccountName** [4]

查看 **member** 属性的值，我们可以看到它包含被引用用户的 DN。这对应我们的用户对象中的 **distinguishedName** 属性。因此，必须将 `Group Member User Attribute` 参数的值设置为此属性。

同样，我们可以看到用户对象中 **memberOf** 属性中的值对应组的 **distinguishedName** [5]。因此，我们需要将 `Group DN Attribute` 参数的值设置为此属性。

## 附录：故障排查

如果在测试与 Active Directory 服务器的连接时遇到问题，请首先仔细检查为服务账号输入的凭证以及搜索库配置。你还可以检查 Rancher 日志来查明问题的原因。调试日志可能包含有关错误的更详细信息。详情请参见[如何启用调试日志]({{<baseurl>}}/rancher/v2.6/en/faq/technical/#how-can-i-enable-debug-logging)。
