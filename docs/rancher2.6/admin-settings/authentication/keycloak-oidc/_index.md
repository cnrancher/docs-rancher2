---
title: 配置 Keycloak (OIDC)
description: 创建 Keycloak OpenID Connect (OIDC) 客户端并配置 Rancher 以使用 Keycloak。你的用户将能够使用他们的 Keycloak 登录名登录 Rancher。
weight: 1200
---

如果你的组织使用 [Keycloak Identity Provider (IdP)](https://www.keycloak.org) 进行用户身份验证，你可以通过配置 Rancher 来允许用户使用 IdP 凭证登录。Rancher 支持使用 OpenID Connect (OIDC) 协议和 SAML 协议来集成 Keycloak。与 Rancher 一起使用时，这两种实现在功能上是等效的。本文描述了配置 Rancher 以通过 OIDC 协议与 Keycloak 一起使用的流程。

如果你更喜欢将 Keycloak 与 SAML 协议一起使用，请参见[此页面]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/keycloak-saml/)。

如果你有使用 SAML 协议的现有配置并希望切换到 OIDC 协议，请参见[本节](#migrating-from-saml-to-oidc)。

## 前提

- 已在 Rancher 上禁用 Keycloak (SAML)。
- 你必须配置了 [Keycloak IdP 服务器](https://www.keycloak.org/docs/latest/server_installation/)。
- 在 Keycloak 中，使用以下设置创建一个[新的 OIDC 客户端](https://www.keycloak.org/docs/latest/server_admin/#oidc-clients)。如需获取帮助，请参见 [Keycloak 文档](https://www.keycloak.org/docs/latest/server_admin/#oidc-clients)。

  | 设置                 | 值                                       |
  | -------------------- | ---------------------------------------- |
  | `Client ID`          | &lt;CLIENT_ID> (例如 `rancher`)          |
  | `Name`               | &lt;CLIENT_NAME> (例如 `rancher`)        |
  | `Client Protocol`    | `openid-connect`                         |
  | `Access Type`        | `confidential`                           |
  | `Valid Redirect URI` | `https://yourRancherHostURL/verify-auth` |

- 在新的 OIDC 客户端中，创建 [Mappers](https://www.keycloak.org/docs/latest/server_admin/#_protocol-mappers) 来公开用户字段。

  - 使用以下设置创建一个新的 "Groups Mapper"：

    | 设置                  | 值                 |
    | --------------------- | ------------------ |
    | `Name`                | `Groups Mapper`    |
    | `Mapper Type`         | `Group Membership` |
    | `Token Claim Name`    | `groups`           |
    | `Add to ID token`     | `OFF`              |
    | `Add to access token` | `OFF`              |
    | `Add to user info`    | `ON`               |

  - 使用以下设置创建一个新的 "Client Audience" ：

    | 设置                       | 值                |
    | -------------------------- | ----------------- |
    | `Name`                     | `Client Audience` |
    | `Mapper Type`              | `Audience`        |
    | `Included Client Audience` | &lt;CLIENT_NAME>  |
    | `Add to access token`      | `ON`              |

  - 使用以下设置创建一个新的 "Groups Path"：

    | 设置               | 值                 |
    | ------------------ | ------------------ |
    | `Name`             | `Group Path`       |
    | `Mapper Type`      | `Group Membership` |
    | `Token Claim Name` | `full_group_path`  |
    | `Full group path`  | `ON`               |
    | `Add to user info` | `ON`               |

## 在 Rancher 中配置 Keycloak

1. 在 Rancher UI 中，单击 **☰ > 用户 & 认证**。
1. 单击左侧导航栏的**认证**。
1. 选择 **Keycloak (OIDC)**。
1. 填写**配置 Keycloak OIDC 账号**表单。有关填写表单的帮助，请参见[配置参考](#configuration-reference)。
1. 完成**配置 Keycloak OIDC 账号**表单后，单击**启用**。

   Rancher 会将你重定向到 IdP 登录页面。输入使用 Keycloak IdP 进行身份验证的凭证，来验证你的 Rancher Keycloak 配置。

   > **注意**：你可能需要禁用弹出窗口阻止程序才能看到 IdP 登录页面。

**结果**：已将 Rancher 配置为使用 OIDC 协议与 Keycloak 一起工作。你的用户现在可以使用 Keycloak 登录名登录 Rancher。

## 配置参考

| 字段           | 描述                                                                                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 客户端 ID      | 你的 Keycloak 客户端的 `Client ID`。                                                                                                                       |
| 客户端密文     | 你的 Keycloak 客户端生成的 `Secret`。在 Keycloak 控制台中，单击 **Clients**，选择你创建的客户端，选择 **Credentials** 选项卡，然后复制 `Secret` 字段的值。 |
| 私钥/证书      | 在 Rancher 和你的 IdP 之间创建安全外壳（SSH）的密钥/证书对。如果你的 Keycloak 服务器上启用了 HTTPS/SSL，则为必填。                                         |
| 端点           | 选择为 `Rancher URL`、`发行者`和 `Auth 端点`字段使用生成的值，还是在不正确时进行手动覆盖。                                                                 |
| Keycloak URL   | 你的 Keycloak 服务器的 URL。                                                                                                                               |
| Keycloak Realm | 创建 Keycloak 客户端的领域的名称。                                                                                                                         |
| Rancher URL    | Rancher Server 的 URL。                                                                                                                                    |
| 发行者         | 你的 IdP 的 URL。                                                                                                                                          |
| Auth 端点      | 重定向用户进行身份验证的 URL。                                                                                                                             |

## 从 SAML 迁移到 OIDC

本节描述了将使用 Keycloak (SAML) 的 Rancher 过渡到 Keycloak (OIDC) 的过程。

### 重新配置 Keycloak

1. 将现有客户端更改为使用 OIDC 协议。在 Keycloak 控制台中，单击 **Clients**，选择要迁移的 SAML 客户端，选择 **Settings** 选项卡，将 `Client Protocol` 从 `saml` 更改为 `openid-connect`，然后点击 **Save**。

1. 验证 `Valid Redirect URIs` 是否仍然有效。

1. 选择 **Mappers** 选项卡并使用以下设置创建一个新的 Mapper：

   | 设置                  | 值                 |
   | --------------------- | ------------------ |
   | `Name`                | `Groups Mapper`    |
   | `Mapper Type`         | `Group Membership` |
   | `Token Claim Name`    | `groups`           |
   | `Add to ID token`     | `ON`               |
   | `Add to access token` | `ON`               |
   | `Add to user info`    | `ON`               |

### 重新配置 Rancher

在将 Rancher 配置为使用 Keycloak (OIDC) 之前，必须先禁用 Keycloak (SAML)：

1. 在 Rancher UI 中，单击 **☰ > 用户 & 认证**。
1. 单击左侧导航栏的**认证**。
1. 选择 **Keycloak (SAML)**。
1. 单击**禁用**。

按照[本节](#configuring-keycloak-in-rancher)中的步骤将 Rancher 配置为使用 Keycloak (OIDC)。

> **注意**：配置完成后，由于用户权限不会自动迁移，你需要重新申请 Rancher 用户权限。

## 附录：故障排查

如果你在测试与 Keycloak 服务器的连接时遇到问题，请先检查 OIDC 客户端的配置选项。你还可以检查 Rancher 日志来查明问题的原因。调试日志可能包含有关错误的更详细信息。详情请参见[如何启用调试日志]({{<baseurl>}}/rancher/v2.6/en/faq/technical/#how-can-i-enable-debug-logging)。

所有与 Keycloak 相关的日志条目都将添加 `[generic oidc]` 或 `[keycloak oidc]`。

### 不能重定向到 Keycloak

完成**配置 Keycloak OIDC 账号**表单并单击**启用**后，你没有被重定向到你的 IdP。

- 验证你的 Keycloak 客户端配置。

### 生成的`发行者`和 `Auth 端点`不正确

- 在**配置 Keycloak OIDC 账号**表单中，将**端点**更改为`指定（高级设置）`并覆盖`发行者` 和 `Auth 端点`的值。要查找这些值，前往 Keycloak 控制台并选择 **Realm Settings**，选择 **General** 选项卡，然后单击 **OpenID Endpoint Configuration**。JSON 输出将显示 `issuer` 和 `authorization_endpoint` 的值。

### Keycloak 错误："Invalid grant_type"

- 在某些情况下，这条错误提示信息可能有误导性，实际上造成错误的原因是 `Valid Redirect URI` 配置错误。
