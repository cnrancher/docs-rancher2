---
title: 添加应用商店
---

[自定义应用商店](/docs/catalog/custom/_index)可以被添加到 Rancher 的[不同的级别](/docs/catalog/_index)中。

## 添加全局应用商店

> **先决条件：** 为了激活内置的应用商店或[管理全局应用商店](/docs/catalog/custom/adding/_index)，您需要具有以下权限之一：
>
> - [系统管理员权限](/docs/admin-settings/rbac/global-permissions/_index)。
> - 包含 [Manage Catalogs](/docs/admin-settings/rbac/global-permissions/_index) 权限的[自定义全局权限](/docs/admin-settings/rbac/global-permissions/_index)。

1. 从**全局**界面中，在导航栏中选择**工具 > 应用商店**。在 v2.2.0 之前的版本中，您可以直接在导航栏中选择**应用商店**。

2. 单击**添加应用商店**。

3. 填写表格，然后单击**创建**。

**结果：** 您的自定义全局级别应用商店已添加到 Rancher。**Active** 状态，代表已经完成了同步，您将可以开始部署[多集群应用](/docs/catalog/multi-cluster-apps/_index)或[项目级别应用](/docs/catalog/apps/_index)。

## 添加集群级别应用商店

_自 v2.1.0 起可用_

> **先决条件：** 为了管理集群范围的应用商店，您需要具有以下权限之一：
>
> - [系统管理员权限](/docs/admin-settings/rbac/global-permissions/_index)
> - [集群所有者权限](/docs/admin-settings/rbac/cluster-project-roles/_index)
> - 包含 [Manage Cluster Catalogs](/docs/admin-settings/rbac/cluster-project-roles/_index) 权限的[自定义集群权限](/docs/admin-settings/rbac/cluster-project-roles/_index)。

1. 从**全局**界面，导航到要添加自定义应用商店的集群。
2. 在导航栏中选择**工具 > 商店设置**。
3. 单击**添加应用商店**。
4. 填写表格。 默认情况下，在该表格中可以选择应用商店的**范围**。当您从**集群**范围添加应用商店时，默认为`cluster`。
5. 单击**创建**。

**结果：** 您的自定义集群级别应用商店已添加到 Rancher。**Active** 状态，代表已经完成了同步，您将可以从此应用商店在该集群的任何项目中部署[项目级别应用](/docs/catalog/apps/_index)。

## 添加项目级别应用商店

_自 v2.1.0 起可用_

> **先决条件：** 为了管理项目范围的应用商店，您需要具有以下权限之一：
>
> - [系统管理员权限](/docs/admin-settings/rbac/global-permissions/_index)
> - [集群所有者权限](/docs/admin-settings/rbac/cluster-project-roles/_index)
> - [项目所有者权限](/docs/admin-settings/rbac/cluster-project-roles/_index)
> - 包含 [Manage Project Catalogs](/docs/admin-settings/rbac/cluster-project-roles/_index) 权限的[自定义项目权限](/docs/admin-settings/rbac/cluster-project-roles/_index)。

1. 从**全局**界面，导航到要添加自定义应用商店的项目。
2. 在导航栏中选择**工具 > 商店设置**。
3. 单击**添加应用商店**。
4. 填写表格。默认情况下，在该表格中可以选择应用商店的**范围**。当您从**项目**范围添加应用商店时，默认范围为`project`。
5. 单击**创建**。

**结果**：您的自定义项目级别应用商店已添加到 Rancher。**Active** 状态，代表已经完成了同步，您将可以从此应用商店在该项目中部署[项目级别应用](/docs/catalog/apps/_index)。
