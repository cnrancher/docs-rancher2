---
title: 对接 Active Directory
---

如果您的组织使用 Microsoft Active Directory 作为中心用户存储库，则可以将 Rancher 配置为与 Active Directory 服务器通信以对用户进行身份验证。这使 Rancher 管理员可以对外部用户系统中的用户和组进行集群和项目的访问控制，同时允许最终用户在登录 Rancher UI 时使用其 Active Directory 凭据进行身份验证。

Rancher 使用 LDAP 与 Active Directory 服务器通信。因此，Active Directory 的身份验证流与 [OpenLDAP 认证](/docs/admin-settings/authentication/openldap/_index)的身份验证流相同。

> **注意：**
>
> 在开始之前，请熟悉[外部身份验证配置和用户主体](/docs/admin-settings/authentication/_index)的概念。

## 先决条件

您需要创建或从您的 AD 管理员处获取一个新的 AD 用户，以用作 Rancher 的服务帐户。此用户必须具有足够的权限，才能执行 LDAP 搜索并读取您的 AD 域下的用户和组的属性。

通常（非管理员）**域用户** 帐户应用于此目的，因为默认情况下，该用户对域分区中的大多数对象具有只读权限。

但是，请注意，在某些锁定的 Active Directory 配置中，此默认行为可能不适用。在这种情况下，您需要确保服务帐户用户在**Base OU**（包含用户和组）上或全局范围内至少拥有 **Read** 和 **List Content** 权限。

> **使用 TLS？**
>
> 如果 AD 服务器使用的证书是自签名的或不是来自认可的证书颁发机构，请确保手头有 PEM 格式的 CA 证书（包含任何中间证书）。您必须在配置期间粘贴此证书，以便 Rancher 能够验证证书链。

## 配置步骤

### 打开 Active Directory 配置

1. 使用初始的本地`admin`帐户登录到 Rancher UI。
2. 在 **全局** 视图中，导航到 **安全 > 认证**。
3. 选择 **Active Directory** 。将显示**配置 AD 服务器**的表单。

### 配置 Active Directory 服务器设置

在标题为`1. 配置Active Directory服务器`的部分中，填写您的 Active Directory 服务器的信息字段。有关每个参数所需值的详细信息，请参阅下表。

> **注意：**
>
> 如果您不确定要在`用户/组 Search Base`字段中输入的正确值，请参阅[使用 ldapsearch 确认 Search Base 和架构](#附件：使用-ldapsearch-确认-search-base-和架构)。

**表 1：AD 服务器参数**

| 参数             | 说明                                                                                                                                                                                                                                                                 |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 主机名           | 指定 AD 服务器的主机名或 IP 地址。                                                                                                                                                                                                                                   |
| 端口             | 指定 Active Directory 服务器侦听连接的端口。未加密的 LDAP 通常使用 389 的标准端口，而 LDAPS 使用 636 端口                                                                                                                                                            |
| TLS              | 选中此框可启用 SSL/TLS 上的 LDAP(通常称为 LDAPS)                                                                                                                                                                                                                     |
| 服务器连接超时   | Rancher 在认为无法访问 AD 服务器之前等待的持续时间(秒)。                                                                                                                                                                                                             |
| 服务帐户用户名   | 输入对域分区具有只读访问权限的 AD 帐户的用户名。请参阅[先决条件](#先决条件)。用户名可以用 NetBIOS 格式（例如“DOMAIN\serviceaccount”）或 UPN 格式（例如“serviceaccount@domain.com”）输入。                                                                            |
| 服务帐户密码     | 服务帐户的密码。                                                                                                                                                                                                                                                     |
| 默认登录域       | 当您使用 AD 域的 NetBIOS 名称配置此字段时，当绑定到 AD 服务器时，在没有域的情况下输入的用户名(例如“jdoe”)将自动转换为斜杠的 NetBIOS 登录（例如，“LOGIN_DOMAIN\jdoe”）。如果您的用户以 UPN（例如，“jdoe@acme.com”）作为用户名进行身份验证，则此字段**必**须保留为空。 |
| 用户 Search Base | 目录树中开始搜索用户对象的节点的可分辨名称。所有用户都必须是此基本 DN 的后代。例如：“ou=people,dc=acme,dc=com”                                                                                                                                                       |
| 组 Search Base   | 如果组位于`用户 Search Base`下配置的节点之外的其他节点下，则需要在此处提供可分辨名称。否则就空着。例如：“ou=groups,dc=acme,dc=com”                                                                                                                                   |

---

### 配置用户/组架构

在标题为`2. 自定义架构`的部分中，必须为 Rancher 提供与目录中使用的架构对应的用户和组属性的正确映射。

Rancher 使用 LDAP 查询来搜索和检索关于 Active Directory 中的用户和组的信息。本节中配置的属性映射用于构造搜索筛选器和解析组成员身份。因此，最重要的是所提供的设置反映了您的 AD 域的真实情况。

> **注意：**
>
> 如果您不熟悉 Active Directory 域中使用的架构，请参阅[使用 ldapsearch 确认 Search Base 和架构](#附件：使用-ldapsearch-确认-search-base-和架构)以确定正确的配置值。

#### 用户架构

下表详细说明了用户架构部分配置的参数。

**表 2：用户架构配置参数**

| 参数           | 说明                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 对象类型       | 域中用于用户对象的对象类的名称。如果定义，则仅指定对象类的名称 - 请勿将其放在 LDAP 包装器中，例如`&(objectClass=xxxx)`                                                                                                                                                                                                                                                                                                |
| 用户名属性     | 其值适合作为显示名称的用户属性。                                                                                                                                                                                                                                                                                                                                                                                      |
| 登录属性       | 其值与用户登录 Rancher 时输入的凭据的用户名部分匹配的属性。如果您的用户以其 UPN（例如`jdoe@acme.com`）作为用户名进行身份验证，则此字段通常必须设置为`userPrincipalName`。否则，对于旧的 NetBIOS 风格的登录名（例如`jdoe`），通常是`sAMAccountName`。                                                                                                                                                                  |
| 用户成员属性   | 包含用户所属组的属性。                                                                                                                                                                                                                                                                                                                                                                                                |
| 搜索属性       | 当用户输入文本以在用户界面中添加用户或组时，Rancher 会查询 AD 服务器，并尝试根据此设置中提供的属性匹配用户。可以通过使用管道(“\|”)符号分隔属性来指定多个属性。要匹配 UPN 用户名(例如 jdoe@acme.com)，通常应将此字段的值设置为`userPrincipalName`。                                                                                                                                                                    |
| 搜索筛选器     | 当 Rancher 尝试将用户添加到网站访问列表或尝试将成员添加到集群或项目时，此筛选器将应用于搜索的用户列表。例如，用户搜索过滤器可以是 <code>(&#124;(memberOf=CN=group1,CN=Users,DC=testad,DC=rancher,DC=io)(memberOf=CN=group2,CN=Users,DC=testad,DC=rancher,DC=io))</code>。注意：如果搜索筛选器未使用[有效的 AD 搜索语法](https://docs.microsoft.com/en-us/windows/win32/adsi/search-filter-syntax)，则用户列表将为空。 |
| 用户启用属性   | 它是一个整数值，用来标识用户帐户。Rancher 使用此选项来确定用户帐户是否已禁用。通常应将此设置为 AD 标准的`userAccountControl`。                                                                                                                                                                                                                                                                                        |
| 禁用状态位掩码 | 这是指定禁用用户帐户的`用户启用属性`的值。通常，您应该将此设置为 Microsoft Active Directory 架构中指定的默认值`2`（请参见[此处](https://docs.microsoft.com/en-us/windows/win32/adschema/a-useraccountcontrol#remarks)）。                                                                                                                                                                                             |

---

#### 组架构

下表详细说明了组架构配置的参数。

**表 3：组架构配置参数**

| 参数           | 说明                                                                                                                                                                                                                                                                                                            |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 对象类型       | 用于在域中对对象进行分组的对象类的名称。如果定义，则仅指定对象类的名称 - 请勿将其放在 LDAP 包装器中，例如`&(objectClass=xxxx)`                                                                                                                                                                                  |
| 名称属性       | 其值适合显示名称的组属性。                                                                                                                                                                                                                                                                                      |
| 组成员用户属性 | **用户属性** 的名称，其格式与`组成员映射属性`中的组成员匹配。                                                                                                                                                                                                                                                   |
| 组成员映射属性 | 包含组成员的组属性的名称。                                                                                                                                                                                                                                                                                      |
| 搜索属性       | 用于在将组添加到集群或项目时构造搜索筛选器的属性。请参见用户架构`Search Attribute`的说明。                                                                                                                                                                                                                      |
| 搜索筛选器     | 当 Rancher 尝试将组添加到站点访问列表或尝试将组添加到集群或项目时，此筛选器将应用于搜索的组列表。例如，组搜索筛选器可以是<code>(&#124;(cn=group1)(cn=group2))</code>。注意:如果搜索筛选器未使用[有效的 AD 搜索语法](https://docs.microsoft.com/en-us/windows/win32/adsi/search-filter-syntax)，则组列表将为空。 |
| 组 DN 属性     | 其格式与描述用户成员身份的用户属性中的值匹配的组属性的名称。请参见`用户成员属性`。                                                                                                                                                                                                                              |
| 嵌套组成员身份 | 此设置定义 Rancher 是否应解析嵌套组成员身份。仅当您的组织使用这些嵌套成员身份时才使用（即您有包含其他组作为成员的组）。                                                                                                                                                                                         |

---

### 测试身份验证

完成配置后，请测试与 AD 服务器的连接。如果测试成功，将启用与配置的 Active Directory 的身份验证。

> **注意：**
>
> 与此步骤中输入的凭据相关的 AD 用户将映射到本地主体帐户并在 Rancher 中分配系统管理员权限。因此，您应该有意识地决定使用哪个 AD 帐户来执行此步骤。

1. 输入应映射到本地主体帐户的 AD 帐户的**用户名**和**密码**。
2. 单击**启用 Active Directory 认证**以完成设置。

**结果：**

- 已启用 Active Directory 身份验证。
- 您已使用提供的 AD 凭据以系统管理员身份登录到 Rancher。

> **注意：**
>
> 如果 LDAP 服务中断，您仍然可以使用本地配置的`admin`帐户和密码登录。

## 附件：使用 ldapsearch 确认 Search Base 和架构

为了成功配置 AD 身份验证，必须提供与 AD 服务器的层次结构和架构相关的正确配置。

[ldapsearch](http://manpages.ubuntu.com/manpages/artful/man1/ldapsearch.1.html) 工具允许您查询您的 AD 服务器以了解用于用户和组对象的架构。

对于下面提供的示例命令，我们假设：

- Active Directory 服务器的主机名为`ad.acme.com`
- 服务器正在监听端口`389上的未加密连接`
- Active Directory 域是`acme`
- 您有一个用户名为`jdoe`和密码为`secret`的有效 AD 帐户

### 确认 Search Base

首先，我们将使用`ldapsearch`来找到用户和组的父节点的可分辨名称（DN）：

```
$ ldapsearch -x -D "acme\jdoe" -w "secret" -p 389 \
-h ad.acme.com -b "dc=acme,dc=com" -s sub "sAMAccountName=jdoe"
```

此命令执行 LDAP 搜索，Search Base 设置为域根目录(`-b "dc=acme,dc=com"`)，并执行针对用户帐户的筛选器(`sAMAccountNam=jdoe`)，返回所述用户的属性:

![LDAP User](/img/rancher/ldapsearch-user.png)

因为在这种情况下，用户的 DN 是`CN=John Doe,CN=Users,DC=acme,DC=com`[5]，所以我们应该使用父节点 DN`CN=Users,DC=acme,DC=com`配置**用户 Search Base**。

同样，基于 **memberOf** 属性[4]中引用的组的 DN，**组 Search Base**的正确值将是该值的父节点，即`OU=Groups,DC=acme,DC=com`。

### 确认用户架构

上述`ldapsearch`查询的输出还允许确定在用户架构配置中使用的正确值:

- `对象类型`: **person**[1]
- `用户名属性`: **name**[2]
- `登录属性`: **sAMAccountName**[3]
- `用户成员属性`: **memberOf**[4]

> **注意：**
>
> 如果我们组织中的 AD 用户使用其 UPN（例如 jdoe@acme.com）而不是短登录名进行身份验证，则我们必须将`登录属性`设置为**userPrincipalName**。

我们还将`搜索属性`参数设置为**sAMAccountName|name**。这样，用户可以通过输入用户名或全名添加到 Rancher UI 中的集群/项目中。

### 确认组架构

接下来，我们将查询与此用户关联的组之一，在本例中为`CN=examplegroup，OU=groups，DC=acme，DC=com`:

```
$ ldapsearch -x -D "acme\jdoe" -w "secret" -p 389 \
-h ad.acme.com -b "ou=groups,dc=acme,dc=com" \
-s sub "CN=examplegroup"
```

此命令将通知我们用于组对象的属性:

![LDAP Group](/img/rancher/ldapsearch-group.png)

同样，这允许我们确定要在组架构配置中输入的正确值:

- `对象类型`: **group**[1]
- `名称属性`: **name**[2]
- `组成员映射属性`: **member**[3]
- `搜索属性`: **sAMAccountName**[4]

查看 **member** 属性的值，我们可以看到它包含被引用用户的 DN。这对应于我们的用户对象中的 **distinguishedName** 属性。因此，必须将`组成员映射属性`参数的值设置为此属性。

同样，我们可以看到用户对象中 **memberOf** 属性中的值对应于组的 **distinguishedName**[5]。因此，我们需要将`组DN属性`参数的值设置为此属性。

## 附件：故障排查

如果在测试与 Active Directory 服务器的连接时遇到问题，请首先仔细检查为服务帐户输入的凭据以及 Search Base 配置。您还可以检查 Rancher 日志，以帮助查明问题的原因。调试日志可能包含有关错误的更详细信息。请参阅本文档中的[如何启用调试日志](/docs/faq/technical/_index)。
