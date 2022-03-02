---
title: 配置 Keycloak (SAML)
description: 创建 Keycloak SAML 客户端并配置 Rancher 以使用 Keycloak。你的用户将能够使用他们的 Keycloak 登录名登录 Rancher。
weight: 1200
---

如果你的组织使用 Keycloak Identity Provider (IdP) 进行用户身份验证，你可以通过配置 Rancher 来允许用户使用 IdP 凭证登录。

## 前提

- 你必须配置了 [Keycloak IdP 服务器](https://www.keycloak.org/docs/latest/server_installation/)。
- 在 Keycloak 中，使用以下设置创建一个[新的 SAML 客户端](https://www.keycloak.org/docs/latest/server_admin/#saml-clients)。如需获取帮助，请参见 [Keycloak 文档](https://www.keycloak.org/docs/latest/server_admin/#saml-clients)。

  | 设置                   | 值                                                                                                                                |
  | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
  | `Sign Documents`       | `ON` <sup>1</sup>                                                                                                                 |
  | `Sign Assertions`      | `ON` <sup>1</sup>                                                                                                                 |
  | 所有其他 `ON/OFF` 设置 | `OFF`                                                                                                                             |
  | `Client ID`            | 输入 `https://yourRancherHostURL/v1-saml/keycloak/saml/metadata`，或在 Rancher Keycloak 配置<sup>2</sup> 中 `Entry ID 字段`的值。 |
  | `Client Name`          | <CLIENT_NAME> (例如 `rancher`)                                                                                                    |
  | `Client Protocol`      | `SAML`                                                                                                                            |
  | `Valid Redirect URI`   | `https://yourRancherHostURL/v1-saml/keycloak/saml/acs`                                                                            |

  > <sup>1</sup>：可以选择启用这些设置中的一个或两个。
  > <sup>2</sup>：在配置和保存 SAML 身份提供商之前，不会生成 Rancher SAML 元数据。

  {{< img "/img/rancher/keycloak/keycloak-saml-client-configuration.png" "">}}

- 在新的 SAML 客户端中，创建 Mappers 来公开用户字段。
  - 添加所有 "Builtin Protocol Mappers"：
    {{< img "/img/rancher/keycloak/keycloak-saml-client-builtin-mappers.png" "">}}
  - 创建一个 "Group list" mapper，来将成员属性映射到用户的组：
    {{< img "/img/rancher/keycloak/keycloak-saml-client-group-mapper.png" "">}}
- 在 Keycloak 客户端导出 `metadata.xml` 文件：
  在 `Installation` 选项卡中，选择 `SAML Metadata IDPSSODescriptor` 格式并下载文件。

  > **注意**
  > Keycloak 6.0.0 及以上版本不再在 `Installation` 选项卡下提供 IDP 元数据。
  > 你仍然可以从以下 URL 获取 XML：
  >
  > `https://{KEYCLOAK-URL}/auth/realms/{REALM-NAME}/protocol/saml/descriptor`
  >
  > 从这个 URL 获得的 XML 包含 `EntitiesDescriptor` 作为根元素。然而，Rancher 希望根元素是 `EntityDescriptor` 而不是 `EntitiesDescriptor`。因此，在将这个 XML 传递给 Rancher 之前，请按照以下步骤调整：
  >
  > - 将所有不存在的属性从 `EntitiesDescriptor` 复制到 `EntityDescriptor`。
  > - 删除开头的 `<EntitiesDescriptor>` 标签。
  > - 删除 xml 末尾的 `</EntitiesDescriptor>`。
  >
  > 最后的代码会是如下：
  >
  > ```
  > <EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" entityID="https://{KEYCLOAK-URL}/auth/realms/{REALM-NAME}">
  >   ....
  > </EntityDescriptor>
  > ```

## 在 Rancher 中配置 Keycloak

1. 在左上角，单击 **☰ > 用户 & 认证**。
1. 在左侧导航栏，单击**认证**。
1. 单击 **Keycloak SAML**。
1. 填写**配置 Keycloak 账号**表单。有关填写表单的帮助，请参见[配置参考](#configuration-reference)。
1. 完成**配置 Keycloak 账号**表单后，单击**启用**。

   Rancher 会将你重定向到 IdP 登录页面。输入使用 Keycloak IdP 进行身份验证的凭证，来验证你的 Rancher Keycloak 配置。

   > **注意**：你可能需要禁用弹出窗口阻止程序才能看到 IdP 登录页面。

**结果**：已将 Rancher 配置为使用 Keycloak。你的用户现在可以使用 Keycloak 登录名登录 Rancher。

> SAML 身份验证提供者警告：
>
> - SAML 协议不支持搜索或查找用户或组。因此，将用户或组添加到 Rancher 时不会对其进行验证。
> - 添加用户时，必须正确输入确切的用户 ID（即 `UID` 字段）。键入用户 ID 时，将不会搜索可能匹配的其他用户 ID。
> - 添加组时，必须从文本框旁边的下拉列表中选择组。Rancher 假定来自文本框的任何输入都是用户。
>   - 用户组下拉列表仅显示你所属的用户组。如果你不是某个组的成员，你将无法添加该组。

## 配置参考

| 字段             | 描述                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| 显示名称字段     | 包含用户显示名称的属性。<br/><br/>示例：`givenName`                                                                   |
| 用户名字段       | 包含用户名/给定名称的属性。<br/><br/>示例：`email`                                                                    |
| UID 字段         | 每个用户独有的属性。<br/><br/>示例：`email`                                                                           |
| 用户组字段       | 创建用于管理组成员关系的条目。<br/><br/>示例：`member`                                                                |
| Entity ID 字段   | Keycloak 客户端中需要配置为客户端的 ID。<br/><br/>默认值：`https://yourRancherHostURL/v1-saml/keycloak/saml/metadata` |
| Rancher API 主机 | Rancher 服务器的 URL。                                                                                                |
| 私钥/证书        | 在 Rancher 和你的 IdP 之间创建安全外壳（SSH）的密钥/证书对。                                                          |
| IDP 元数据       | 从 IdP 服务器导出的 `metadata.xml` 文件。                                                                             |

> **提示**：你可以使用 openssl 命令生成一个密钥/证书对。例如：
>
>        openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout myservice.key -out myservice.cert

## 附录：故障排查

如果你在测试与 Keycloak 服务器的连接时遇到问题，请先检查 SAML 客户端的配置选项。你还可以检查 Rancher 日志来查明问题的原因。调试日志可能包含有关错误的更详细信息。详情请参见[如何启用调试日志]({{<baseurl>}}/rancher/v2.6/en/faq/technical/#how-can-i-enable-debug-logging)。

### 不能重定向到 Keycloak

点击**使用 Keycloak 认证**时，没有重定向到你的 IdP。

- 验证你的 Keycloak 客户端配置。
- 确保 `Force Post Binding` 设为 `OFF`。

### IdP 登录后显示禁止消息

你已正确重定向到你的 IdP 登录页面，并且可以输入凭证，但是之后收到 `Forbidden` 消息。

- 检查 Rancher 调试日志。
- 如果日志显示 `ERROR: either the Response or Assertion must be signed`，确保 `Sign Documents` 或 `Sign assertions` 在 Keycloak 客户端中设置为 `ON`。

### 访问 `/v1-saml/keycloak/saml/metadata` 时返回 HTTP 502

常见原因：配置 SAML 提供商之前未创建元数据。
尝试配置 Keycloak，并将它保存为你的 SAML 提供商，然后访问元数据。

### Keycloak 错误："We're sorry, failed to process response"

- 检查你的 Keycloak 日志。
- 如果日志显示 `failed: org.keycloak.common.VerificationException: Client does not have a public key`，请在 Keycloak 客户端中将 `Encrypt Assertions` 设为 `OFF`。

### Keycloak 错误："We're sorry, invalid requester"

- 检查你的 Keycloak 日志。
- 如果日志显示 `request validation failed: org.keycloak.common.VerificationException: SigAlg was null`，请在 Keycloak 客户端中将 `Client Signature Required` 设为 `OFF`。
