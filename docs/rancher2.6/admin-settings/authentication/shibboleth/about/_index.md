---
title: Shibboleth 和 OpenLDAP 的组权限
weight: 1
---

本文为打算在 Rancher 中设置 Shibboleth 身份验证的用户提供背景信息和上下文。

由于 Shibboleth 是 SAML 提供者，因此它不支持搜索用户组的功能。虽然 Shibboleth 集成可以验证用户凭证，但是如果没有其他配置，Shibboleth 不能在 Rancher 中给用户组分配权限。

你可以通过配置 OpenLDAP 标识提供者来解决这个问题。如果让 Shibboleth 使用 OpenLDAP 后端，你将能够在 Rancher 中搜索组，并从 Rancher UI 将集群、项目或命名空间等资源分配给用户组。

### 名词解释

- **Shibboleth**：用于计算机网络和互联网的单点登录系统。它允许用户仅使用一种身份登录到各种系统。它验证用户凭证，但不单独处理组成员身份。
- **SAML**：安全声明标记语言（Security Assertion Markup Language），用于在身份提供程序和服务提供商之间交换身份验证和授权数据的开放标准。
- **OpenLDAP**：轻型目录访问协议（LDAP）的免费开源实现。它用于管理组织的计算机和用户。OpenLDAP 对 Rancher 用户很有用，因为它支持组。只要组已存在于身份提供程序中，你就可以在 Rancher 中为组分配权限，从而让组访问资源（例如集群，项目或命名空间）。
- **IdP 或 IDP**：身份提供程序。OpenLDAP 是身份提供程序的一个例子。

### 将 OpenLDAP 组权限添加到 Rancher 资源

下图说明了 OpenLDAP 组的成员如何访问 Rancher 中该组有权访问的资源。

例如，集群所有者可以将 OpenLDAP 组添加到集群，从而让组有权查看大多数集群级别的资源并创建新项目。然后，OpenLDAP 组成员在登录 Rancher 后就可以访问集群。

在这种情况下，OpenLDAP 允许集群所有者在分配权限时搜索组。如果没有 OpenLDAP，将不支持搜索组的功能。

当 OpenLDAP 组的成员登录到 Rancher 时，用户将被重定向到 Shibboleth 并在那里输入用户名和密码。

Shibboleth 会验证用户的凭证，并从 OpenLDAP 检索用户属性，其中包括用户所在的组信息。然后 Shibboleth 将向 Rancher 发送一个包含用户属性的 SAML 断言。Rancher 会使用组数据，以便用户可以访问他所在的组有权访问的所有资源。

![Adding OpenLDAP Group Permissions to Rancher Resources]({{<baseurl>}}/img/rancher/shibboleth-with-openldap-groups.svg)
