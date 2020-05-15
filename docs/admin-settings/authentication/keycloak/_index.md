---
title: 对接 Keycloak (SAML)
description: 如果您的组织使用 Keycloak Identity Provider (IdP)进行用户身份验证，您可以配置 Rancher 来允许您的用户使用他们的 IdP 凭证登录。
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
  - 对接 Keycloak (SAML)
---

_v2.1.0 版本可用_

如果您的组织使用 Keycloak Identity Provider (IdP)进行用户身份验证，您可以配置 Rancher 来允许您的用户使用他们的 IdP 凭证登录。

## 先决条件

- 您必须有一个[Keycloak IdP 服务器](https://www.keycloak.org/docs/latest/server_installation/)。
- 在 Keycloak 中，创建一个[新的 SAML 客户端](https://www.keycloak.org/docs/latest/server_admin/#saml-clients)，设置如下。参见[Keycloak 文档](keycloak.org/docs/latest/server_admin/#saml-clients)获得帮助。

  | 设置                 | 值                                                                      |
  | -------------------- | ----------------------------------------------------------------------- |
  | `Sign Documents`     | `ON` <sup>1</sup>                                                       |
  | `Sign Assertions`    | `ON` <sup>1</sup>                                                       |
  | 所有其它`ON/OFF`设置 | `OFF`                                                                   |
  | `Client ID`          | `https://yourRancherHostURL/v1-saml/keycloak/saml/metadata`<sup>2</sup> |
  | `Client Name`        | <CLIENT_NAME> (e.g. `rancher`)                                          |
  | `Client Protocol`    | `SAML`                                                                  |
  | `Valid Redirect URI` | `https://yourRancherHostURL/v1-saml/keycloak/saml/acs`                  |

  > - 1：您可以选择启用这些设置中的一个或两个。
  > - 2：在配置和保存 SAML 提供者之前，不会生成 Rancher SAML 元数据。

- 从 Keycloak 客户端导出`metadata.xml`文件:
  在`安装`选项卡中，选择`SAML Metadata IDPSSODescriptor`格式选项并下载文件。

## 在 Rancher 中配置 Keycloak

1.  在**全局**视图中，从主菜单中选择**安全 > 认证**。
1.  选择**Keycloak**。
1.  完成**配置 Keycloak 帐户**表单。Keycloak IdP 允许您指定要使用的数据存储。您可以添加数据库，也可以使用现有的 LDAP 服务器。例如，如果您选择 Active Directory (AD)服务器，下面的示例将描述如何将 AD 属性映射到 Rancher 中的字段。

    | 字段             | 描述                                                    |
    | ---------------- | ------------------------------------------------------- |
    | 显示名称         | 包含用户 display name 的 AD 属性。                      |
    | 用户名           | 包含用户 user name/given name 的 AD 属性                |
    | UID              | 对每个用户唯一的 AD 属性。                              |
    | 组               | 为管理组成员身份创建的条目。                            |
    | Rancher API 地址 | Rancher Server的 URL 地址                               |
    | 私钥 / 证书      | 密钥/证书对，用于在 Rancher 和 IdP 之间创建安全 shell。 |
    | 元数据 XML       | 从您的 IdP 服务器导出的`metadata.xml`文件。             |

    > **提示：** 您可以使用 openssl 命令生成密钥/证书对。例如:
    >
    >        openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout myservice.key -out myservice.cert

1.  完成**配置 Keycloak 帐户**表单后，单击页面底部的**启用 Keycloak 认证**进行身份验证。

    Rancher 将重定向到 IdP 登录页面。输入 Keycloak IdP 系统的身份验证凭据，以验证您的 Rancher Keycloak 配置。

    > **注：** 您可能需要禁用弹出窗口拦截器以访问 IdP 登录页面。

**结果：** Rancher 被配置为使用 Keycloak 认证。您的用户现在可以使用 Keycloak 账号登录 Rancher。

> SAML 身份验证提供者警告：
>
> - SAML 协议不支持搜索或查找用户或组。因此，将用户或组添加到 Rancher 时不会对其进行验证。
> - 添加用户时，必须正确输入确切的用户 ID（即`UID`字段）。输入用户 ID 时，将不会搜索可能匹配的其他用户 ID。
> - 添加组时，必须从文本框旁边的下拉列表中选择组。Rancher 假定来自文本框的任何输入都是用户。
>   - 用户组下拉列表仅显示您所属的用户组。您将无法添加您不是其成员的组。

## 附录: 故障诊断

如果在测试到 Keycloak 服务器的连接时遇到了问题，首先需要再次检查 SAML 客户机的配置选项。您还可以检查 Rancher 日志，以帮助确定问题的原因。调试日志可能包含关于错误的更详细的信息。请参考本文档中的[如何启用调试日志](/docs/faq/technical/_index)。

### 没有被重定向到 Keycloak

当您点击**启用 Keycloak 认证**时，没有被重定向到 Keycloak IdP。

- 验证您的 Keycloak 客户端配置。
- 确保`Force Post Binding`设置为`OFF`。

### IdP 登录后显示禁止消息

您被正确地重定向到 Keycloak IdP 登录页面，可以输入凭据，但得到一个`禁止`的消息。

- 检查 Rancher 调试日志。
- 如果日志显示`ERROR: either the Response or Assertion must be signed`，确保`Sign Documents`或`Sign assertions` 在您的 Keycloak 客户端中被设置为`ON`。

### 在访问 `/v1-saml/keycloak/saml/metadata` 时返回 HTTP 502

这通常是由于只有在配置了 SAML 提供者之后，才会创建元数据。
尝试将 keycloak 配置并保存为您的 SAML 提供者，然后再访问元数据。

### Keycloak 错误: "We're sorry, failed to process response"

- 检查 Keycloak 日志。
- 如果日志显示`failed: org.keycloak.common.VerificationException: Client does not have a public key`，在 Keycloak 客户端中将`Encrypt Assertions` 设置为`OFF`。

### Keycloak 错误: "We're sorry, invalid requester"

- 检查 Keycloak 日志。
- 如果日志显示`request validation failed: org.keycloak.common.VerificationException: SigAlg was null`，在 Keycloak 客户端中将`Client Signature Required`设置为`OFF`。

### Keycloak 6.0.0+: 选项中没有 IDPSSODescriptor 设置

Keycloak 6.0.0 及以上版本在“安装”选项卡下不再提供 IDP 元数据。
您仍然可以从以下网址获取 XML:

`https://{KEYCLOAK-URL}/auth/realms/{REALM-NAME}/protocol/saml/descriptor`

从这个 URL 获得的 XML 包含`EntitiesDescriptor`作为根元素。Rancher 期望的根元素是`EntityDescriptor`而不是`EntitiesDescriptor`。因此，在将此 XML 传递给 Rancher 之前，请按照以下步骤进行调整:

- 将所有标签从“EntitiesDescriptor”复制到“EntityDescriptor”
- 从文件开头删除`<EntitiesDescriptor>`标签。
- 从 xml 末尾删除`</EntitiesDescriptor>`。

您会得到类似下面的示例的文件:

```
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" entityID="https://{KEYCLOAK-URL}/auth/realms/{REALM-NAME}">
  ....

</EntityDescriptor>
```
