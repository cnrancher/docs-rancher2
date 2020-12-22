---
title: 内置全局应用商店
description: 我们默认将一些全局应用商店打包到了 Rancher 中。这些应用商店可以由系统管理员启用或禁用。
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
  - 应用商店
  - 内置全局应用商店
---

我们默认将一些[全局应用商店](/docs/rancher2/helm-charts/legacy-catalogs/_index)打包到了 Rancher 中。这些应用商店可以由系统管理员启用或禁用。

## 管理内置的全局应用商店

> **先决条件：** 为了管理内置应用商店或[管理全局应用商店](/docs/rancher2/helm-charts/legacy-catalogs/adding-catalogs/_index)，您需要具有以下权限之一：
>
> - [管理员全局权限](/docs/rancher2/admin-settings/rbac/global-permissions/_index)
> - 包含 [Manage Catalogs](/docs/rancher2/admin-settings/rbac/global-permissions/_index) 权限的[自定义全局权限](/docs/rancher2/admin-settings/rbac/global-permissions/_index)。

1. 从**全局**界面中，在导航栏中选择**工具 > 应用商店**。在 v2.2.0 之前的版本中，您可以直接在导航栏中选择**应用商店**。

2. 将要使用的默认应用商店切换为**启用**状态。

   - **Library：** Library 应用商店包括由 Rancher 维护的 Chart。 Rancher 将 Chart 存储在 Git 仓库中，以方便 Chart 的发布和更新。该应用商店中的 Rancher Chart，与原生 Helm Chart 相比，它具有一些[显着优势](/docs/rancher2/helm-charts/legacy-catalogs/creating-apps/_index)。
   - **Helm Stable：** 该应用商店由 Kubernetes 社区维护，包括原生 [Helm Chart](https://helm.sh/docs/chart_template_guide/)。该应用商店是最大的应用池。
   - **Helm Incubator：** 用户体验类似于 Helm Stable，但此应用商店中包含 **beta** 阶段的应用。

**结果：**启用所选应用商店。等待几分钟，Rancher 需要复制应用商店模板。复制完成后，在项目级别菜单里，您可以在导航栏中选择**工具 > 应用商店**，从而查看它们。在 v2.2.0 之前的版本中，您可以从导航栏中选择**应用商店**。
