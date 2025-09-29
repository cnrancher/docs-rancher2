---
title: 对接 FreeIPA
description: 如果您使用 FreeIPA 进行用户身份验证，则可以将 Rancher 配置为允许您的用户使用其 FreeIPA 凭据登录。先决条件:您必须配置了 [FreeIPA Server](https://www.freeipa.org/) 服务器。在 FreeIPA 中创建一个具有 read-only 访问权限的服务帐户。当用户使用 API​​ 密钥发出请求时，Rancher 使用此帐户来验证组成员身份。
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
  - 对接 FreeIPA
---

_自 v2.0.5 起开始可用_

如果您使用 FreeIPA 进行用户身份验证，则可以将 Rancher 配置为允许您的用户使用其 FreeIPA 凭据登录。

> **先决条件:**
>
> - 您必须配置了 [FreeIPA Server](https://www.freeipa.org/) 服务器。
> - 在 FreeIPA 中创建一个具有 read-only 访问权限的服务帐户。当用户使用 API​​ 密钥发出请求时，Rancher 使用此帐户来验证组成员身份。
> - 请阅读[外部身份验证配置和用户主体](/docs/rancher2/admin-settings/authentication/)。

1.  使用分配了`系统管理员`角色的本地用户（即本地主体）登录 Rancher。

2.  在**全局**视图中，从主菜单中选择**安全 > 认证**。

3.  选择 **FreeIPA**。

4.  完成 **配置 FreeIPA 访问**表单。

    您可能需要登录到域控制器以查找表单中请求的信息。

    > **使用 TLS?**
    > 如果证书是自签名的，或者不是来自公认的证书颁发机构的，请确保提供完整的链。Rancher 需要该链来验证服务器的证书。
    > **用户 Search Base 与组 Search Base**
    >
    > Search Base 使 Rancher 可以搜索 FreeIPA 中的用户和组。这些字段仅用于搜索起点，不适用于搜索过滤器。
    >
    > - 如果您的用户和组位于同一 Search Base 中，则仅填写用户 Search Base。
    > - 如果您的组位于其他 Search Base 中，则可以选择填写组 Search Base。该字段专用于搜索组，但不是必需的。

5.  如果您的 FreeIPA 与标准 AD 模式不同，请填写`自定义架构`表单以使其匹配。否则，请跳过此步骤。

    > **搜索属性** 搜索属性字段的默认值为三个特定值：`uid|sn|givenName`。配置 FreeIPA 后，当用户输入文本以添加用户或组时，Rancher 会自动查询 FreeIPA 服务器，并尝试按用户 ID，姓氏或名字来匹配字段。Rancher 专门搜索以在搜索字段中输入的文本开头的用户/组。
    >
    > 默认字段值为 `uid|sn|givenName`，但是您可以将此字段配置为这些字段的子集。字段之间的竖杠（`|`）将这些字段分隔开。
    >
    > - `uid`：用户 ID
    > - `sn`：姓
    > - `givenName`：名
    >
    > 使用此搜索属性，Rancher 可以为用户和组创建搜索过滤器，但是您**不能**在此字段中添加自己的搜索过滤器。

6.  输入您的 FreeIPA 用户名和密码，单击**启用 FreeIPA 认证**。以将 Rancher 配置为使用 FreeIPA 身份验证。

**结果：**

- FreeIPA 认证已配置。
- 您将使用您的 FreeIPA 帐户（即外部主体）登录到 Rancher。
