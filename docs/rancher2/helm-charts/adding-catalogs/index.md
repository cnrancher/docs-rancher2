---
title: 添加自定义应用商店
description: 添加应用商店，只需要添加应用商店名称，URL 和分支名称。添加自定义 Git 仓库。it URL 必须是`git clone`可以处理的 URL，并且必须以.git 结尾。分支名称必须是应用商店 URL 中的一个分支。如果没有提供分支名称，则默认使用`master`分支。每当您将应用商店添加到 Rancher 时，它将几乎立即可用。添加自定义 Helm 仓库。Helm Chart 仓库是一个 HTTP 服务器，其中包含一个或多个打包的 Chart。可以提供 YAML 文件和 tar 文件并可以处理 GET 请求的任何 HTTP 服务器都可以用作应用商店仓库。
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
  - 应用商店
  - 添加自定义应用商店
---

[自定义应用商店](/docs/rancher2/helm-charts/adding-catalogs/)可以被添加到 Rancher 的全局范围，集群范围或者项目范围。

**提示：** [系统管理员](/docs/rancher2/admin-settings/rbac/global-permissions/)可以在 Rancher 中的任何范围内管理应用商店，包括全局级别，集群级别或者项目级别的应用商店。

## 添加应用商店仓库

添加应用商店，只需要添加应用商店名称，URL 和分支名称。

### 添加自定义 Git 仓库

Git URL 必须是`git clone`[可以处理的 URL](https://git-scm.com/docs/git-clone#_git_urls_a_id_urls_a)，并且必须以.git 结尾。分支名称必须是应用商店 URL 中的一个分支。如果没有提供分支名称，则默认使用`master`分支。每当您将应用商店添加到 Rancher 时，它将几乎立即可用。

### 添加自定义 Helm 仓库

Helm Chart 仓库是一个 HTTP 服务器，其中包含一个或多个打包的 Chart。可以提供 YAML 文件和 tar 文件并可以处理 GET 请求的任何 HTTP 服务器都可以用作应用商店仓库。

Helm 带有用于开发人员测试的内置软件包服务器（`helm serve`）。Helm 团队已经测试了其他服务器，包括启用了网站模式的 Google Cloud Storage，启用了网站模式的 S3 或使用 [ChartMuseum](https://github.com/helm/chartmuseum) 等开源项目托管自定义应用商店 Chart 的服务器。

在 Rancher 中，您可以仅使用名称和 Chart 仓库的 URL 地址添加自定义 Helm 应用商店。

### 添加私有 Git/Helm 仓库

_自 v2.2.0 起可用_

Rancher v2.2.0 起，用户可以使用任一凭据（即`用户名`和`密码`）将私有 Git 或 Helm Chart 库添加到 Rancher 中。私有 Git 库还支持使用 OAuth 令牌进行身份验证。

[阅读有关添加私有 Git/Helm 应用商店的更多信息](/docs/rancher2/helm-charts/adding-catalogs/)

1. 从**全局**视图中，在导航栏中选择**工具>应用商店**。在 v2.2.0 之前的版本中，您可以直接在导航栏中选择**应用商店**。
2. 单击**添加**。
3. 填写表格，然后单击**创建**。

**结果**：您的应用商店已添加到 Rancher。

## 添加全局应用商店

> **先决条件：** 为了激活内置的应用商店或[管理全局应用商店](/docs/rancher2/helm-charts/adding-catalogs/)，您需要具有以下权限之一：
>
> - [系统管理员权限](/docs/rancher2/admin-settings/rbac/global-permissions/)。
> - 包含 [Manage Catalogs](/docs/rancher2/admin-settings/rbac/global-permissions/) 权限的[自定义全局权限](/docs/rancher2/admin-settings/rbac/global-permissions/)。

1. 从**全局**界面中，在导航栏中选择**工具 > 应用商店**。在 v2.2.0 之前的版本中，您可以直接在导航栏中选择**应用商店**。

2. 单击**添加应用商店**。

3. 填写表格，然后单击**创建**。

**结果：** 您的自定义全局级别应用商店已添加到 Rancher。**Active** 状态，代表已经完成了同步，您将可以开始部署[多集群应用](/docs/rancher2/helm-charts/multi-cluster-apps/)或[项目级别应用](/docs/rancher2/helm-charts/)。

## 添加集群级别应用商店

_自 v2.1.0 起可用_

> **先决条件：** 为了管理集群范围的应用商店，您需要具有以下权限之一：
>
> - [系统管理员权限](/docs/rancher2/admin-settings/rbac/global-permissions/)
> - [集群所有者权限](/docs/rancher2/admin-settings/rbac/cluster-project-roles/)
> - 包含 [Manage Cluster Catalogs](/docs/rancher2/admin-settings/rbac/cluster-project-roles/) 权限的[自定义集群权限](/docs/rancher2/admin-settings/rbac/cluster-project-roles/)。

1. 从**全局**界面，导航到要添加自定义应用商店的集群。
2. 在导航栏中选择**工具 > 商店设置**。
3. 单击**添加应用商店**。
4. 填写表格。 默认情况下，在该表格中可以选择应用商店的**范围**。当您从**集群**范围添加应用商店时，默认为`cluster`。
5. 单击**创建**。

**结果：** 您的自定义集群级别应用商店已添加到 Rancher。**Active** 状态，代表已经完成了同步，您将可以从此应用商店在该集群的任何项目中部署[项目级别应用](/docs/rancher2/helm-charts/)。

## 添加项目级别应用商店

_自 v2.1.0 起可用_

> **先决条件：** 为了管理项目范围的应用商店，您需要具有以下权限之一：
>
> - [系统管理员权限](/docs/rancher2/admin-settings/rbac/global-permissions/)
> - [集群所有者权限](/docs/rancher2/admin-settings/rbac/cluster-project-roles/)
> - [项目所有者权限](/docs/rancher2/admin-settings/rbac/cluster-project-roles/)
> - 包含 [Manage Project Catalogs](/docs/rancher2/admin-settings/rbac/cluster-project-roles/) 权限的[自定义项目权限](/docs/rancher2/admin-settings/rbac/cluster-project-roles/)。

1. 从**全局**界面，导航到要添加自定义应用商店的项目。
2. 在导航栏中选择**工具 > 商店设置**。
3. 单击**添加应用商店**。
4. 填写表格。默认情况下，在该表格中可以选择应用商店的**范围**。当您从**项目**范围添加应用商店时，默认范围为`project`。
5. 单击**创建**。

**结果**：您的自定义项目级别应用商店已添加到 Rancher。**Active** 状态，代表已经完成了同步，您将可以从此应用商店在该项目中部署[项目级别应用](/docs/rancher2/helm-charts/)。

## 自定义应用商店配置参考

有关配置自定义应用商店的更多信息，请参考[本页](/docs/rancher2/helm-charts/catalog-config/)。
