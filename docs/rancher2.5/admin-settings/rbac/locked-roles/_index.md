---
title: 锁定角色
description: 您可以将角色设置为锁定状态。管理员们不能把锁定的角色分配给用户。锁定角色：无法将它们分配给还有没被分配到该角色的用户。将用户添加到集群或项目时，成员角色下拉列表中不会显示它们。不会影响在锁定该角色之前，已经分配了该角色的用户。即使后来锁定了该角色，这些用户仍然保留该角色提供的访问权限。
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
  - 锁定角色
---

## 概述

处于锁定状态的角色具有如下特性：

- 管理员无法将它们分配给还有没被分配到该角色的用户。
- 将用户添加到集群或项目时，**成员角色**下拉列表中不会显示它们。
- 不会影响在锁定该角色之前，已经分配了该角色的用户。即使后来锁定了该角色，这些用户仍然保留该角色提供的访问权限。

  **示例：** 假设您的组织制定了一个内部策略，禁止分配给集群用户创建项目的权限。在将新用户添加到集群之前，您应该锁定以下角色：**Cluster Owner**，**Cluster Member** 和 **Create Projects**。然后，您可以创建一个新的自定义角色，该角色具有除了创建项目外的功能，还具有与**集群成员**相同的权限。然后，在将用户添加到集群时使用此新的自定义角色。

以下用户可以执行锁定角色的操作：

- 任何配了**系统管理员**权限的用户。
- 任何分配了有着 **Manage Roles** 权限的**自定义角色**。

## 锁定和解锁角色

如果要阻止将角色分配给用户，则可以将其设置为**锁定**状态。

您可以在两种情况下锁定角色：

- [添加自定义角色](/docs/rancher2.5/admin-settings/rbac/default-custom-roles/_index)时。
- 编辑现有角色时（请参见下文）。

1. 从**全局**视图中，选择**安全**>**角色**。

2. 从要锁定(或解锁)的角色中，选择**省略号(...) > 编辑**。

3. 从**锁定**选项中，选择**是**或**否**单选按钮。然后单击**保存**。
