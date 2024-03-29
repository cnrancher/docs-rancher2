---
title: 对接 Keycloak (SAML)
description: 如果您的组织使用 Keycloak Identity Provider (IdP)进行用户身份验证，您可以配置 Rancher 来允许您的用户使用他们的 IdP 凭证登录。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 系统管理员指南
  - 登录认证
  - 对接 Keycloak (SAML)
---

_v2.1.0 版本可用_

如果您的组织使用 Keycloak Identity Provider (IdP)进行用户身份验证，您可以配置 Rancher 来允许您的用户使用他们的 IdP 凭证登录。

## 先决条件

- 您必须有一个[Keycloak IdP 服务器](https://www.keycloak.org/docs/latest/server_installation/)。
- 在 Keycloak 中，创建一个新的 SAML 客户端，设置如下。参见[Keycloak 文档](https://keycloak.org/docs/latest/server_admin/#saml-clients)获得帮助。

  | 设置                 | 值                                                                      |
  | :------------------- | :---------------------------------------------------------------------- |
  | `Sign Documents`     | `ON` <sup>1</sup>                                                       |
  | `Sign Assertions`    | `ON` <sup>1</sup>                                                       |
  | 所有其它`ON/OFF`设置 | `OFF`                                                                   |
  | `Client ID`          | `https://yourRancherHostURL/v1-saml/keycloak/saml/metadata`<sup>2</sup> |
  | `Client Name`        | <CLIENT_NAME> (e.g. `rancher`)                                          |
  | `Client Protocol`    | `SAML`                                                                  |
  | `Valid Redirect URI` | `https://yourRancherHostURL/v1-saml/keycloak/saml/acs`                  |

  > - 1：您可以选择启用这些设置中的一个或两个。
  > - 2：在配置和保存 SAML 提供者之前，不会生成 Rancher SAML 元数据。
  >   ![keycloak-saml-client-configuration](/img/rancher/keycloak-saml-client-configuration.png)

  在新的 SAML 客户端中，创建 Mappers 来暴露用户字段。

  - 添加所有 "内置协议映射器"
    ![keycloak-saml-client-builtin-mappers](/img/rancher/keycloak-saml-client-builtin-mappers.png)
  - 创建一个新的 "组列表 "映射器，将成员属性映射到用户的组。
    ![keycloak-saml-client-group-mapper](/img/rancher/keycloak-saml-client-group-mapper.png)

- 从 Keycloak 客户端导出`metadata.xml`文件：
  在`安装`选项卡中，选择`SAML Metadata IDPSSODescriptor`格式选项并下载文件。

> **说明：**
> Keycloak 6.0.0 及以上版本不再在 "安装 "标签下提供 IDP 元数据。
> 你仍然可以从以下网址获取 XML：
>
> `https://{KEYCLOAK-URL}/auth/realms/{REALM-NAME}/protocol/saml/descriptor`
>
> 从这个 URL 获得的 XML 包含`EntitiesDescriptor`作为根元素。Rancher 希望根元素是`EntityDescriptor`而不是`EntitiesDescriptor`。因此，在将这个 XML 传递给 Rancher 之前，请按照以下步骤调整：
>
> - 将`EntitiesDescriptor`中所有不存在的属性复制到 `EntityDescriptor`中。
> - 删除开头的`<EntitiesDescriptor>`标签。
> - 删除结尾的的`</EntitiesDescriptor>`。
>
> 完成后，会留下类似下面的代码：
>
> ```
> <EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" entityID="https://{KEYCLOAK-URL}/auth/realms/{REALM-NAME}">
>   ....
> </EntityDescriptor>
> ```

## 在 Rancher 中配置 Keycloak

1.  在**全局**视图中，从主菜单中选择**安全 > 认证**。
1.  选择**Keycloak**。
1.  完成**配置 Keycloak 账户**表单。有关填写表格的帮助，请参阅[配置参考](#配置参考)。
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

## 配置参考

| Field                     | 描述                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Display Name Field        | 包含用户的显示名称的属性。例如: `givenName`                                                                  |
| User Name Field           | 包含用户名/姓名的属性。 例如: `email`                                                                        |
| UID Field                 | 一个对每个用户来说都是独一无二的属性。 例如: `email`                                                         |
| Groups Field              | 为管理组成员资格创建条目。 例如: `member`                                                                    |
| Entity ID Field           | Keycloak 客户端需要配置为客户端 ID 的 ID。 默认: `https://yourRancherHostURL/v1-saml/keycloak/saml/metadata` |
| Rancher API Host          | Rancher Server 的 URL。                                                                                      |
| Private Key / Certificate | 一个密钥/证书对，在 Rancher 和你的 IdP 之间创建一个安全的外壳。                                              |
| IDP-metadata              | 从 IdP 服务器导出的 `metadata.xml` 文件。                                                                    |

> **提示：**你可以使用 openssl 命令生成一个密钥/证书对。比如说：
>
>        openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout myservice.key -out myservice.cert

## 附录: 故障诊断

如果在测试到 Keycloak 服务器的连接时遇到了问题，首先需要再次检查 SAML 客户机的配置选项。您还可以检查 Rancher 日志，以帮助确定问题的原因。调试日志可能包含关于错误的更详细的信息。请参考本文档中的[如何启用调试日志](/docs/rancher2.5/faq/technical/_index)。

### 没有被重定向到 Keycloak

当您单击**启用 Keycloak 认证**时，没有被重定向到 Keycloak IdP。

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
