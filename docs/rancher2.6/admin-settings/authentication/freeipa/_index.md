---
title: 配置 FreeIPA
weight: 1114
---

如果你的组织使用 FreeIPA 进行用户身份验证，你可以通过配置 Rancher 来允许你的用户使用 FreeIPA 凭证登录。

> **前提**：
>
> - 你必须配置了 [FreeIPA 服务器](https://www.freeipa.org/)。
> - 在 FreeIPA 中创建一个具有 `read-only` 访问权限的服务账号。当用户使用 API​​ 密钥发出请求时，Rancher 使用此账号来验证组成员身份。
> - 参见[外部身份验证配置和主体用户]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/#external-authentication-configuration-and-principal-users)。

1. 使用分配了 `administrator` 角色（即 _本地主体_）的本地用户登录到 Rancher。
1. 在左上角，单击 **☰ > 用户 & 认证**。
1. 在左侧导航栏，单击**认证**。
1. 单击 **FreeIPA**。
1. 填写**配置 FreeIPA 服务器**表单，

   你可能需要登录到域控制器，来查找表单中请求的信息。

   > **使用 TLS?**
   > 如果证书是自签名，或者不是来自公认的证书颁发机构的，请确保提供完整的证书链。Rancher 需要该链来验证服务器的证书。
   > 	>**用户搜索库 vs. 组搜索库**
   > 	>
   > 	>搜索库使 Rancher 可以搜索 FreeIPA 中的用户和组。这些字段仅用于搜索库，不适用于搜索筛选器。
   > 	>
   > 	>* 如果你的用户和组位于同一搜索库中，则仅填写用户搜索库。
   > 	>* 如果你的组位于其他搜索库中，则可以选择填写组搜索库。该字段专用于搜索组，但不是必需的。

1. 如果你的 FreeIPA 不同于标准的 AD Schema，则必须完成**自定义 Schema** 部分实现匹配。否则，调过此步骤。

   > **搜索属性**字段的默认值为三个特定值：`uid|sn|givenName`。配置 FreeIPA 后，当用户输入文本以添加用户或组时，Rancher 会自动查询 FreeIPA 服务器，并尝试按用户 ID，姓氏或名字来匹配字段。Rancher 专门搜索以在搜索字段中输入的文本开头的用户/组。
   >
   > 默认字段值为 `uid|sn|givenName`，但是你可以将此字段配置为这些字段的子集。管道符 (`|`) 用于分隔各个字段。
   >
   > * `uid`：用户 ID
   > * `sn`：姓
   > * `givenName`：名
   >
   > Rancher 使用此搜索属性为用户和组创建搜索筛选器，但是你*不能*在此字段中添加自己的搜索筛选器。

1. 在 **Authenticate with FreeIPA** 中输入你的 FreeIPA 用户名和密码，确认已为 Rancher 配置 FreeIPA 身份验证。
1. 点击**启用**。

**结果**：

- FreeIPA 验证配置成功。
- 你将使用你的 FreeIPA 账号（即 _外部主体_）登录到 Rancher。
