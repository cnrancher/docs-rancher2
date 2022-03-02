---
title: 配置 Microsoft AD FS (SAML)
weight: 1205
---

如果你的组织使用 Microsoft 联合身份验证服务 (AD FS) 进行用户身份验证，你可以通过配置 Rancher 来允许用户使用 AD FS 凭证登录。

## 前提

已安装 Rancher。

- 获取你的 Rancher Server URL。配置 AD FS 时，请使用该 URL 替换 `<RANCHER_SERVER>` 占位符。
- 你的 Rancher 必须具有全局管理员账号。

你必须配置 [Microsoft AD FS 服务器](https://docs.microsoft.com/en-us/windows-server/identity/active-directory-federation-services)。

- 获取你的 AD FS 服务器 IP/DNS 名称。配置 AD FS 时，请使用该 IP/DNS 名称替换 `<AD_SERVER>` 占位符。
- 你必须有在 AD FS 服务器上添加 [Relying Party Trusts](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/operations/create-a-relying-party-trust) 的权限。

## 配置概要

要让 Rancher Server 使用 Microsoft AD FS，你需要在 Active Directory 服务器上配置 AD FS，并将 Rancher 配置为使用 AD FS 服务器。如果需要获取在 Rancher 中设置 Microsoft AD FS 身份验证的指南，请参见：

- [1. 在 Microsoft AD FS 中配置 Rancher]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/microsoft-adfs/microsoft-adfs-setup)
- [2. 在 Rancher 中配置 Microsoft AD FS]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/microsoft-adfs/rancher-adfs-setup)

> SAML 身份验证提供者警告：
>
> - SAML 协议不支持搜索或查找用户或组。因此，将用户或组添加到 Rancher 时不会对其进行验证。
> - 添加用户时，必须正确输入确切的用户 ID（即 `UID` 字段）。键入用户 ID 时，将不会搜索可能匹配的其他用户 ID。
> - 添加组时，必须从文本框旁边的下拉列表中选择组。Rancher 假定来自文本框的任何输入都是用户。
>   - 用户组下拉列表仅显示你所属的用户组。如果你不是某个组的成员，你将无法添加该组。

### 后续操作

[在 Microsoft AD FS 中配置 Rancher]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/microsoft-adfs/microsoft-adfs-setup)
