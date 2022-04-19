---
title: 配置 Okta (SAML)
weight: 1210
---

如果你的组织使用 Okta Identity Provider (IdP) 进行用户身份验证，你可以通过配置 Rancher 来允许用户使用 IdP 凭证登录。

> **注意**：Okta 集成仅支持服务提供商发起的登录。

## 前提

在 Okta 中，使用以下设置创建一个新的 SAML 应用。如需获取帮助，请参见 [Okta 文档](https://developer.okta.com/standards/SAML/setting_up_a_saml_application_in_okta)。

| 设置                          | 值                                                      |
| ----------------------------- | ------------------------------------------------------- |
| `Single Sign on URL`          | `https://yourRancherHostURL/v1-saml/okta/saml/acs`      |
| `Audience URI (SP Entity ID)` | `https://yourRancherHostURL/v1-saml/okta/saml/metadata` |

## 在 Rancher 中配置 Okta

1.  在左上角，单击 **☰ > 用户 & 认证**。
1.  在左侧导航栏，单击**认证**。
1.  单击 **Okta**。
1.  填写**配置 Okta 账号**表单。下面的示例描述了如何将 Okta 属性从属性语句映射到 Rancher 中的字段：

    | 字段             | 描述                                                                    |
    | ---------------- | ----------------------------------------------------------------------- |
    | 显示名称字段     | 属性语句中包含用户显示名称的属性名称。                                  |
    | 用户名字段       | 属性语句中包含用户名/给定名称的属性名称。                               |
    | UID 字段         | 属性语句中每个用户唯一的属性名称。                                      |
    | 用户组字段       | 组属性语句中公开你的组的属性名称。                                      |
    | Rancher API 主机 | Rancher Server 的 URL。                                                 |
    | 私钥/证书        | 密钥/证书对，用于断言加密。                                             |
    | 元数据 XML       | 你在应用 `Sign On` 部分中找到的 `Identity Provider metadata` 文件。 |

    > **提示**：你可以使用 openssl 命令生成一个密钥/证书对。例如：
    >
    >        openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout myservice.key -out myservice.crt

1.  完成**配置 Okta 账号**表单后，单击**启用**。

    Rancher 会将你重定向到 IdP 登录页面。输入使用 Okta IdP 进行身份验证的凭证，来验证你的 Rancher Okta 配置。

    > **注意**：如果什么都没有发生，很可能是因为你的浏览器阻止了弹出窗口。请在弹出窗口阻止程序中禁用 Rancher 域，并在其他类似扩展中将 Rancher 列入白名单。

**结果**：已将 Rancher 配置为使用 Okta。你的用户现在可以使用 Okta 登录名登录 Rancher。

> SAML 身份验证提供者警告：
>
> - SAML 协议不支持搜索或查找用户或组。因此，将用户或组添加到 Rancher 时不会对其进行验证。
> - 添加用户时，必须正确输入确切的用户 ID（即 `UID` 字段）。键入用户 ID 时，将不会搜索可能匹配的其他用户 ID。
> - 添加组时，必须从文本框旁边的下拉列表中选择组。Rancher 假定来自文本框的任何输入都是用户。
>   - 用户组下拉列表仅显示你所属的用户组。如果你不是某个组的成员，你将无法添加该组。
