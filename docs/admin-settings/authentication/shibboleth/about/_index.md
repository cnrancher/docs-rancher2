---
title: 用户组权限
---

_自 Rancher v2.4 起可用_

该页面为打算在 Rancher 中设置 Shibboleth 身份验证提供者的 Rancher 用户提供背景信息和上下文。

由于 Shibboleth 是 SAML 提供者，因此它不支持搜索用户组的功能。 Shibboleth 集成可以验证用户凭据，但是如果没有其他配置，则不能在 Rancher 中给用户组分配权限。

解决此问题的一种方法是配置 OpenLDAP 身份提供者。使用 Shibboleth 的 OpenLDAP 后端，您将能够在 Rancher UI 中搜索用户组，并将资源分配给用户组，例如集群，项目或命名空间。

## 名词解释

- **Shibboleth：** 是用于计算机网络和 Internet 的单点登录系统。它允许人们仅使用一种身份登录各种系统。它会验证用户凭据，但不会自行处理组成员身份。
- **SAML：** 安全声明标记语言，一种用于在身份提供者和服务提供者之间交换身份验证和授权数据的开放标准。
- **OpenLDAP：** 轻型目录访问协议（LDAP）的免费开源实现。它用于管理组织的计算机和用户。 OpenLDAP 对 Rancher 用户有价值，因为它支持组。只要组已存在于身份提供者中，在 Rancher 中就可以为组分配权限，以便它们可以访问资源，例如集群，项目或命名空间。
- **IdP 或 IDP：** 身份提供者。OpenLDAP 是身份提供者的一个例子。

## 向 Rancher 资源添加 OpenLDAP 组权限

下图说明了 OpenLDAP 组的成员如何访问该组有权访问的 Rancher 中的资源。

例如，集群所有者可以将 OpenLDAP 组添加到集群，以便他们有权查看大多数集群级别的资源并创建新项目。然后，OpenLDAP 组成员一旦登录到 Rancher，便可以访问集群。

在这种情况下，OpenLDAP 允许集群所有者在分配权限时搜索组。如果没有 OpenLDAP，将不支持搜索组的功能。

当 OpenLDAP 组的成员登录到 Rancher 时，用户将被重定向到 Shibboleth 并在那里输入用户名和密码。

Shibboleth 验证用户的凭据，并从 OpenLDAP 检索用户属性，其中包括用户所在的组信息。然后，Shibboleth 将包括用户属性的 SAML 断言发送给 Rancher。Rancher 使用组的信息，允许用户访问其组有权访问的所有资源。

![向 Rancher 资源添加 OpenLDAP 组权限](/img/rancher/shibboleth-with-openldap-groups.svg)
