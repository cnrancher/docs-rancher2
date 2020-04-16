---
title: 配置 Rancher 使用 AD FS
---

_自 v2.0.7 版本开始可用_

完成[在 Microsoft AD FS 中配置 Rancher 对接](/docs/admin-settings/authentication/microsoft-adfs/microsoft-adfs-setup/_index)后，将您的 AD FS 信息输入 Rancher，以允许 Rancher 通过 AD FS 进行身份验证。

> **有关配置 AD FS 服务器的重要说明：**
>
> - SAML 2.0 WebSSO 协议服务 URL 为: `https://<RANCHER_SERVER>/v1-saml/adfs/saml/acs`
> - 依赖方信任标识符 URL 为: `https://<RANCHER_SERVER>/v1-saml/adfs/saml/metadata`
> - 您必须从 AD FS 服务器导出`federationmetadata.xml`文件。可以在以下位置找到这个文件：`https://<AD_SERVER>/federationmetadata/2007-06/federationmetadata.xml`

1.  在**全局**视图中，选择 **安全 > 认证** 菜单。

2.  选择 **AD FS**。

3.  完成 **配置 AD FS 帐户** 表单。Microsoft AD FS 允许您指定现有的 Active Directory（AD）服务器。以下示例描述了如何将 AD 属性映射到 Rancher 中的字段。

    | 字段名           | 描述                                                                                                                                                           |
    | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | 显示名称         | 包含用户显示名称的 AD 属性. <br/><br/>例: `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`                                                    |
    | 用户名           | 包含用户名/给定名称的 AD 属性。 <br/><br/>例: `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`                                                     |
    | UID              | 每个用户唯一的 AD 属性。 <br/><br/>例: `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn`                                                             |
    | 组               | 进行输入以管理组成员身份。 <br/><br/>例: `http://schemas.xmlsoap.org/claims/Group`                                                                             |
    | Rancher API 地址 | Rancher 服务器的 URL。                                                                                                                                         |
    | 密钥 / 证书      | 这是用于在 Rancher 和您的 AD FS 之间创建安全 shell 的密钥证书对。确保将通用名称（CN）设置为 Rancher Server URL。                                               |
    | 元数据 XML       | 从 AD FS 服务器导出的`federationmetadata.xml`文件。 <br/><br/>您可以在这里找到此文件 `https://<AD_SERVER>/federationmetadata/2007-06/federationmetadata.xml`。 |

    > **提示：** 您可以使用 openssl 命令生成证书。例如：
    >
    >        openssl req -x509 -newkey rsa:2048 -keyout myservice.key -out myservice.cert -days 365 -nodes -subj "/CN=myservice.example.com"

4.  完成 **配置 AD FS 帐户** 表单后, 点击 **使用 AD FS 进行身份验证**按钮。

    Rancher 将您重定向到 AD FS 登录页面。输入通过 Microsoft AD FS 进行身份验证的凭据，以验证 Rancher AD FS 配置。

> **注意：** 您可能必须禁用弹出窗口阻止程序才能查看 AD FS 登录页面。

**结果：** Rancher 被配置为与 AD FS 一起使用。您的用户现在可以使用其 AD FS 登录名登录 Rancher。
