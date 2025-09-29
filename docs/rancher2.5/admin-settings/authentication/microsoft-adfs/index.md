---
title: AD FS（SAML）
description: 如果您的公司使用 Microsoft Active Directory Federation Services（AD FS）进行用户身份验证，则可以将 Rancher 配置为允许用户使用其 AD FS 凭据登录。
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
  - AD FS（SAML）
---

_自 v2.0.7 版本起可用_

如果您使用 Microsoft Active Directory Federation Services（AD FS）进行用户身份验证，可以将 Rancher 配置为允许用户使用其 AD FS 凭据登录。

## 先决条件

- 安装好 Rancher。

  - 获取您的 Rancher Server URL。在 AD FS 配置期间，请将`<RANCHER_SERVER>`占位符替换为该 URL。

  - 您的 Rancher 必须具有全局管理员帐户。

- 您必须配置一个 [Microsoft AD FS 服务器](https://docs.microsoft.com/en-us/windows-server/identity/active-directory-federation-services)。

  - 获取您的 AD FS 服务器 IP / DNS 名称。在 AD FS 配置期间，将`<AD_SERVER>`替换为此 IP / DNS 名称。
  - 您必须有权在 AD FS 服务器上添加 [Relying Party Trusts](https://docs.microsoft.com/zh-cn/windows-server/identity/ad-fs/operations/create-a-relying-party-trust)。

## 设置方法

使用 Rancher Server 设置 Microsoft AD FS 要求在 Active Directory 服务器上配置 AD FS，并配置 Rancher 来使用 AD FS 服务器。以下页面为在 Rancher 中设置 Microsoft AD FS 身份验证的指南。

- [1. 为 Rancher 配置 AD FS](/docs/rancher2.5/admin-settings/authentication/microsoft-adfs/microsoft-adfs-setup/)
- [2. 配置 Rancher 使用 AD FS](/docs/rancher2.5/admin-settings/authentication/microsoft-adfs/rancher-adfs-setup/)

## 后续操作

[为 Rancher 配置 Microsoft AD FS](/docs/rancher2.5/admin-settings/authentication/microsoft-adfs/microsoft-adfs-setup/)
