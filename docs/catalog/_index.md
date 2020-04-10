---
title: 功能介绍
---

Rancher 提供了基于 Helm 的应用商店的功能，该功能使部署和管理相同的应用变得更加容易。

- **应用商店**可以是 GitHub 代码库或 Helm Chart 库，其中包含了可部署的应用。应用打包在称为 **Helm Chart** 的对象中。
- **Helm Charts** 是描述一组相关 Kubernetes 资源的文件的集合。单个 Chart 可能用于部署简单的内容（例如 Mencached Pod）或复杂的内容（例如带有 HTTP 服务，数据库，缓存等的完整的 Web 应用）。

Rancher 改进了 Helm 应用商店和 Chart。所有原生 Helm Chart 都可以在 Rancher 中使用，但是 Rancher 添加了一些增强功能以改善用户体验。

## 先决条件

当 Rancher 部署应用商店应用时，它会启动一个临时的 Service Account 账号关联到 Helm 服务，该账号只具有部署应用商店应用的权限。因此，用户无法通过此账号或 Helm 服务获得其他资源的访问权限。

要启动应用商店应用或多集群应用，您至少应具有以下权限之一：

- 目标集群的[项目成员角色](/docs/admin-settings/rbac/cluster-project-roles/_index)，使您能够创建，读取，更新和删除工作负载。
- 目标集群的[集群所有者角色](/docs/admin-settings/rbac/cluster-project-roles/_index)。

## 应用商店范围

在 Rancher 中，您可以在三个不同的范围内管理应用商店。全局应用商店在所有集群和项目之间共享。在某些用例中，您可能不想跨不同集群甚至不想在同一集群中的项目共享应用商店。通过利用集群和项目范围的应用商店，您将能够为特定团队提供应用，而无需与所有集群和/或项目共享它们。

| 范围 | 描述                                                    | 可用版本 |
| ---- | ------------------------------------------------------- | -------- |
| 全局 | 所有集群和所有项目都可以访问此应用商店中的 Helm Chart   | v2.0.0   |
| 集群 | 特定集群中的所有项目都可以访问此应用商店中的 Helm Chart | v2.2.0   |
| 项目 | 该特定集群中的特定项目可以访问此应用商店中的 Helm Chart | v2.2.0   |

## 启用自带的应用商店

在 Rancher 中，有一些默认应用商店作为 Rancher 的一部分。这些可以由管理员启用或禁用。

1. 从**全局**视图中，在导航栏中选择**工具>应用商店**。在 v2.2.0 之前的版本中，您可以直接在导航栏中选择**应用商店**。

2. 将要使用的默认应用商店切换为**启用**。

   - **Library**
   - **Helm Stable**
   - **Helm Incubator**

**结果：**启用所选应用商店。等待几分钟，Rancher 需要复制应用商店模板。复制完成后，在项目级别菜单里，您可以在导航栏中选择**工具 > 应用商店**，从而查看它们。在 v2.2.0 之前的版本中，您可以从导航栏中选择**应用商店**。

## 添加自定义全局应用商店

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

[阅读有关添加私有 Git/Helm 应用商店的更多信息](/docs/catalog/custom/_index)

1. 从**全局**视图中，在导航栏中选择**工具>应用商店**。在 v2.2.0 之前的版本中，您可以直接在导航栏中选择**应用商店**。
2. 单击**添加**。
3. 填写表格，然后单击**创建**。

**结果**：您的应用商店已添加到 Rancher。

## 创建应用商店应用

启用内置应用商店或添加自己的自定义应用商店后，可以开始启动任何应用商店应用。

1. 从**全局**视图中，导航到要部署应用的项目。

2. 从主导航栏中，选择**工具->应用商店**。在 v2.2.0 之前的版本中，在主导航栏上选择**应用商店**。点击**启动**。

3. 找到您要启动的应用，然后单击**查看详细信息**。

4. 在**配置选项**下输入**名称**。默认情况下，该名称还用于为应用创建 Kubernetes 命名空间。

   - 如果您想更改**命名空间**，请单击**自定义**并更改命名空间的名称。
   - 如果要使用已经存在的其他命名空间，请单击**自定义**，然后单击**使用现有的命名空间**。从列表中选择一个命名空间。

5. 选择一个**模板版本**。

6. 完成其余的**配置选项**。

   - 对于原生 Helm Chart（即 Helm Stable 或 Helm Incubator 应用商店中的 Chart），在答案部分可以通过键值对来配置答案。
   - 可以在**详细说明**中找到关于键和值的可用参数。
   - 输入答案时，必须遵守[使用 Helm：--set 的格式和限制](https://helm.sh/docs/intro/using_helm/#the-format-and-limitations-of-set)，因为 Rancher 将其作为`--set`标志传递给 Helm。

     例如，输入包含两个用逗号分隔的值的答案（即`abc,bcd`）时，请用双引号将这些值引起来（即`"abc,bcd"`）。

7. 可以通过**预览**部分，查看 Chart 中的 YAML 文件。如果确认，请单击**启动**。

**结果：**您的应用已部署到所选的命名空间。您可以从项目的应用商店菜单下查看应用状态。

## 使用应用商店

Rancher 中有两种类型的应用商店。了解有关每种类型的更多信息：

- [内置全局应用商店](/docs/catalog/built-in/_index)
- [自定义应用商店](/docs/catalog/custom/_index)

### 应用

在 Rancher 中，应用是从应用商店中的模板部署的。Rancher 支持两种类型的应用：

- [多集群应用](/docs/catalog/multi-cluster-apps/_index)
- [在特定项目中部署的应用](/docs/catalog/apps/_index)

### 全局 DNS

_自 v2.2.0 起可用_

当创建跨多个 Kubernetes 集群的应用时，可以创建一个全局 DNS 记录以将流量路由到所有不同集群中的端点。将需要对外部 DNS 服务器进行编程，以为您的应用分配域名（FQDN）。Rancher 将使用您提供的 FQDN 和应用的所在的 IP 地址来对 DNS 进行编程。Rancher 将从运行您的应用的所有 Kubernetes 集群中找到端点，并对 DNS 进行编程。

有关如何使用此功能的更多信息，请参见[全局 DNS](/docs/catalog/globaldns/_index)。

### 与 Rancher 的兼容性

Chart 现在支持在 [questions.yml](https://github.com/rancher/integration-test-charts/blob/master/charts/chartmuseum/v1.6.0/questions.yml) 文件中，设置`rancher_min_version`和`rancher_max_version`字段，以指定 Chart 兼容的 Rancher 版本。

使用 Rancher UI 部署应用时，将仅显示对当前运行的 Rancher 版本有效的应用版本，从而禁止启动不满足 Rancher 版本要求的应用。如果在升级 Rancher 前已经部署了应用，但这个应用不支持新版本的 Rancher，在这种情况下升级 Rancher 不会影响这个已有应用。
