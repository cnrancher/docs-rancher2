---
title: 基于角色的访问控制
description: 在 Rancher 中，每个人都以一个用户身份进行身份验证，它是授予您访问 Rancher 权限的登录名。如身份验证中所述，用户可以是本地用户，也可以是外部用户。配置外部身份验证后，在用户页面上显示的用户会发生变化。如果您以本地用户身份登录，则仅显示本地用户。如果您以外部用户身份登录，则同时显示外部用户和本地用户。
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
  - 基于角色的访问控制
---

在 Rancher 中，每个人都以一个**用户**身份进行身份验证，它是授予您访问 Rancher 权限的登录名。如[身份验证](/docs/rancher2.5/admin-settings/authentication/_index)中所述，用户可以是本地用户，也可以是外部用户。

配置外部身份验证后，在**用户**页面上显示的用户会发生变化。

- 如果您以本地用户身份登录，则仅显示本地用户。

- 如果您以外部用户身份登录，则同时显示外部用户和本地用户。

## 用户和角色

一旦用户登录到 Rancher 中，他们的**授权**，也就是用户在系统中的访问权限，将由**全局权限**，**集群角色**和**项目角色**决定。

- [全局权限](/docs/rancher2.5/admin-settings/rbac/global-permissions/_index)：

  定义用户在任何特定集群之外的授权。

- [集群和项目角色](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/_index)：

  定义用户在分配了角色的集群和项目中的授权。

全局权限以及集群和项目角色是基于 [Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)实现的。因此，权限和角色的底层实现是由 Kubernetes 完成的。
