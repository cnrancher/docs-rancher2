---
title: 身份验证
description: Rancher 向 Kubernetes 添加的关键特性之一是集中式用户身份验证。该特性允许您的用户使用一组凭证对任何 Rancher 管理的 Kubernetes 集群进行身份验证。这种集中式的用户身份验证是使用 Rancher 身份验证代理完成的，该代理与 Rancher 的其他组件一起安装。这个代理验证您的用户，并使用一个服务帐户将用户请求转发到您的 Kubernetes 集群。
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
  - 身份验证
---

Rancher 向 Kubernetes 添加的关键特性之一是集中式用户身份验证。该特性允许您的用户使用一组凭证对任何 Rancher 管理的 Kubernetes 集群进行身份验证。

这种集中式的用户身份验证是使用 Rancher 身份验证代理完成的，该代理与 Rancher 的其他组件一起安装。这个代理验证您的用户，并使用一个服务帐户将用户请求转发到您的 Kubernetes 集群。

## 外部验证与本地验证

Rancher 身份验证代理支持与以下外部身份验证服务集成。下表列出了每个身份验证服务 Rancher 支持的最初版本。

| 外部身份验证服务                                                             | 以下版本后可用 |
| ---------------------------------------------------------------------------- | -------------- |
| [Microsoft Active Directory](/docs/admin-settings/authentication/ad/_index)  | v2.0.0         |
| [GitHub](/docs/admin-settings/authentication/github/_index)                  | v2.0.0         |
| [Microsoft Azure AD](/docs/admin-settings/authentication/azure-ad/_index)    | v2.0.3         |
| [FreeIPA](/docs/admin-settings/authentication/freeipa/_index)                | v2.0.5         |
| [OpenLDAP](/docs/admin-settings/authentication/openldap/_index)              | v2.0.5         |
| [Microsoft AD FS](/docs/admin-settings/authentication/microsoft-adfs/_index) | v2.0.7         |
| [PingIdentity](/docs/admin-settings/authentication/ping-federate/_index)     | v2.0.7         |
| [Keycloak](/docs/admin-settings/authentication/keycloak/_index)              | v2.1.0         |
| [Okta](/docs/admin-settings/authentication/okta/_index)                      | v2.2.0         |
| [Google OAuth](/docs/admin-settings/authentication/google/_index)            | v2.3.0         |
| [Shibboleth](/docs/admin-settings/authentication/shibboleth/_index)          | v2.4.0         |

同时，Rancher 也提供了[本地认证](/docs/admin-settings/authentication/local/_index)。

在大多数情况下，应该使用外部身份验证服务，而不是本地身份验证，因为外部身份验证允许对用户进行集中管理。但是您可能需要一些本地身份验证用户，以便在特定的情况下管理 Rancher，例如在外部身份验证系统不可用或正在进行维护的情况下。

## 用户和组

Rancher 依赖于用户和组以确定谁被允许登录到 Rancher，以及他们可以访问哪些资源。当使用外部系统进行身份验证时，将由外部系统提供用户和组。这些用户和组被赋予集群、项目、多集群应用程序、全局 DNS 提供者等资源的特定角色。当您授予对某个组的访问权时，身份验证提供程序中属于该组的所有用户都将能够使用您指定的权限访问该资源。有关角色和权限的更多信息，请参见[基于角色的访问控制](/docs/admin-settings/rbac/_index)。

> **注:** 本地认证不支持创建或管理用户组。

有关更多信息，请参考[用户和组](/docs/admin-settings/authentication/user-groups/_index)。

## Rancher 授权范围

| 访问级别                                 | 说明                                                                                                                                           |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 允许任何有效用户                         | 认证服务中的*任何*有效用户都可以访问 Rancher。通常情况下不建议使用该设置!                                                                      |
| 允许集群和项目成员，以及授权的用户和组织 | 认证服务中属于**集群成员**或**项目成员**的用户或组成员能够访问 Rancher。此外，添加在**授权用户和组织**列表中的用户和组成员也能够访问 Rancher。 |
| 仅限于授权用户和组织                     | 仅有在**授权用户和组织**列表中的用户和组成员能够访问 Rancher。                                                                                 |

要在授权服务中为用户设置 Rancher 访问级别，请执行以下步骤:

1. 在**全局**视图中，单击**安全 > 认证**。

1. 使用**站点访问**选项来配置用户授权范围。上表解释了每个选项的访问级别。

1. 可选:如果您选择**允许任何有效用户**以外的选项，您可以通过在出现的文本字段中搜索用户，将用户添加到授权用户和组织的列表中。

1. 点击**保存**。

**结果**：Rancher 访问配置被应用。

> SAML 身份验证提供者警告：
>
> - SAML 协议不支持搜索或查找用户或组。因此，将用户或组添加到 Rancher 时不会对其进行验证。
> - 添加用户时，必须正确输入确切的用户 ID（即`UID`字段）。键入用户 ID 时，将不会搜索可能匹配的其他用户 ID。
> - 添加组时，必须从文本框旁边的下拉列表中选择组。Rancher 假定来自文本框的任何输入都是用户。
>   - 用户组下拉列表仅显示您所属的用户组。您将无法添加您不是其成员的组。

## 外部身份验证配置和用户主体

配置外部认证需要：

- 分配了管理员角色的本地用户，以下称为*本地主体*。
- 可以使用外部认证服务进行认证的外部用户，以下简称为*外部主体*。

外部身份验证的配置将影响 Rancher 中主要用户的管理方式。按照下面的列表来更好地理解这些影响。

1. 作为本地主体登录到 Rancher 并完成外部身份验证的配置。

   ![登录](/img/rancher/sign-in.png)

2. Rancher 将外部主体与本地主体相关联。这两个用户共享本地主体的用户 ID。

   ![主体ID共享](/img/rancher/principal-ID.png)

3. 完成配置后，Rancher 将自动退出本地主体。

   ![登出本地主体](/img/rancher/sign-out-local.png)

4. 然后，Rancher 会自动将您登录外部主体。

   ![登录外部主体](/img/rancher/sign-in-external.png)

5. 因为外部主体和本地主体共享一个 ID，所以用户列中不会再单独显示一个另外的外部主体的对象。

   ![登录外部主体](/img/rancher/users-page.png)

6. 外部主体和本地主体共享相同的访问权限。
