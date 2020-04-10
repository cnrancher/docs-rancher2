---
title: 内置全局应用商店
---

我们默认将一些[全局应用商店](/docs/catalog/#global-catalogs)打包到了 Rancher 中。

## 管理内置的全局应用商店

> **先决条件：** 为了管理内置应用商店或[管理全局应用商店](/docs/catalog/custom/adding/_index)，您需要具有以下权限之一：
>
> - [管理员全局权限](/docs/admin-settings/rbac/global-permissions/_index)
> - 包含 [Manage Catalogs](/docs/admin-settings/rbac/global-permissions/_index) 权限的[自定义全局权限](/docs/admin-settings/rbac/global-permissions/_index)。

1. 从**全局**界面中，在导航栏中选择**工具 > 应用商店**。在 v2.2.0 之前的版本中，您可以直接在导航栏中选择**应用商店**。

2. 将要使用的默认应用商店切换为**启用**状态。

   - **Library**
   - **Helm Stable**
   - **Helm Incubator**

**结果：**启用所选应用商店。等待几分钟，Rancher 需要复制应用商店模板。复制完成后，在项目级别菜单里，您可以在导航栏中选择**工具 > 应用商店**，从而查看它们。在 v2.2.0 之前的版本中，您可以从导航栏中选择**应用商店**。
