---
title: 对接 Okta (SAML)
description: 如果您的组织使用 Okta Identity Provider （IdP）进行用户身份验证，您可以配置 Rancher 以允许您的用户使用他们的 IdP 凭据登录。Okta 集成仅支持服务提供者发起的登录。
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
  - 对接 Okta (SAML)
---

_v2.2.0 版本可用_

如果您的公司使用 Okta Identity Provider （IdP）进行用户身份验证，您可以在 Rancher 中配置使用 IdP 凭证登录。

**注：** Okta 仅支持服务提供者发起的登录。

## 先决条件

在 Okta 中，使用下面的设置创建一个 SAML 应用程序。参见[Okta 文档](https://developer.okta.com/standards/SAML/setting_up_a_saml_application_in_okta)以获得帮助。

| 设置                            | 值                                                      |
|---------------------------------|---------------------------------------------------------|
| `Single Sign on URL`            | `https://yourRancherHostURL/v1-saml/okta/saml/acs`      |
| `Audience URI （SP Entity ID）` | `https://yourRancherHostURL/v1-saml/okta/saml/metadata` |

## 在 Rancher 中配置 Okta

1.  在**全局**视图中，从主菜单中选择**安全 > 认证**。

1.  选择**Okta**。

1.  完成**配置 Okta 帐户**表单。下面的示例描述了如何将 Okta 属性从属性 Statement 映射到 Rancher 中的字段。

| 字段             | 描述                                                         |
|------------------|--------------------------------------------------------------|
| 显示名称         | 属性 Statement 中包含用户 display name 的属性名称。          |
| 用户名           | 属性 Statement 中包含用户 user name/given name 属性名称。    |
| UID              | 属性 Statement 中每个用户唯一的属性名称。                    |
| 组               | 组属性 Statement 中代表组信息的属性名称。                    |
| Rancher API 地址 | Rancher Server 的 URL 地址                                   |
| 私钥/证书        | 密钥/证书对，用于声明加密。                                  |
| 元数据 XML       | 在应用程序`登录`部分得到的`Identity Provider metadata`文件。 |

    > **提示：** 您可以使用 openssl 命令生成密钥/证书对。例如：
    >
    >     openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout myservice.key -out myservice.cert

1.  完成**配置 Okta 账户**表单后，点击页面底部的**启用 Okta 认证**。

    Rancher 会将您重定向到 IdP 登录页面。输入使用 Okta IdP 进行身份验证的凭据，以验证您的 Rancher Okta 配置。

    > **注：** 如果什么都没有发生，很可能是因为您的浏览器阻塞了弹出窗口。请确保您禁用了 Rancher 域的弹出窗口拦截器，并在您可能使用的任何其他扩展中将其列入白名单。

**结果：** 配置了使用 Okta 凭证的方式登录 Rancher，您的用户现在可以使用他们的 Okta 账号登录到 Rancher。

> SAML 身份验证提供者警告：
>
> - SAML 协议不支持搜索或查找用户或组。因此，将用户或组添加到 Rancher 时不会对其进行验证。
> - 添加用户时，必须正确输入确切的用户 ID（即`UID`字段）。输入用户 ID 时，将不会搜索可能匹配的其他用户 ID。
> - 添加组时，必须从文本框旁边的下拉列表中选择组。Rancher 假定来自文本框的任何输入都是用户。
>   - 用户组下拉列表仅显示您所属的用户组。您将无法添加您不是其成员的组。
