---
title: 自定义应用商店配置参考
---

任何用户都可以[添加自定义应用商店](/docs/catalog/creating-apps/_index)到 Rancher 中。除了应用商店的内容外，用户还必须确保能够将商店添加到 Rancher 中。

## 商店仓库类型

Rancher 支持不同类型的应用商店仓库：

- 自定义的 Github 仓库
- 自定义 Helm Chart 仓库

### 自定义 Git 仓库

Git URL 必须是`git clone`[可以处理的 URL](https://git-scm.com/docs/git-clone#_git_urls_a_id_urls_a)，并且必须以.git 结尾。分支名称必须是应用商店 URL 中的一个分支。如果没有提供分支名称，则默认使用`master`分支。每当您将应用商店添加到 Rancher 时，它将几乎立即可用。

### 自定义 Helm Chart 仓库

Helm Chart 仓库是一个 HTTP 服务器，其中包含一个或多个打包的 Chart。可以提供 YAML 文件和 tar 文件并可以处理 GET 请求的任何 HTTP 服务器都可以用作应用商店仓库。

Helm 带有用于开发人员测试的内置软件包服务器（`helm serve`）。Helm 团队已经测试了其他服务器，包括启用了网站模式的 Google Cloud Storage，启用了网站模式的 S3 或使用 [ChartMuseum](https://github.com/helm/chartmuseum) 等开源项目托管自定义应用商店 Chart 的服务器。

在 Rancher 中，您可以仅使用名称和 Chart 仓库的 URL 地址添加自定义 Helm 应用商店。

## 配置参数

在[添加应用商店](/docs/catalog/adding-catalogs/_index)到 Rancher 时，用户必须提供下列信息：

| 参数             | 描述                                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 名称             | 自定义名称以区分 Rancher 中添加的应用商店                                                                                        |
| 商店 URL 地址    | 自定义商店仓库的 URL                                                                                                             |
| 使用私有应用商店 | 如果使用的是需要身份验证的私有仓库，则选择。                                                                                     |
| 用户名 (可选)    | [用户名](#用户名)或 [OAuth 凭据](#使用-oauth-凭据)。                                                                             |
| 密码 (可选)      | 如果您正在使用[用户名](#用户名)进行身份验证，则为关联的密码。如果您使用的是[OAuth 凭据](#使用-oauth-凭据)请使用`x-oauth-basic`。 |
| 分支             | Git 仓库的分支名称，默认值为：`master`。对于 Helm Chart 仓库，该字段将被忽略。                                                   |

## 私有仓库

_自 v2.2.0 起可用_

可以使用任一凭据（即`用户名`和`密码`）将私有 Git 或 Helm Chart 仓库添加到 Rancher 中。私有 Git 仓库还支持使用 OAuth 凭据进行身份验证。

### 使用用户名与密码

1. [添加应用商店](/docs/catalog/adding-catalogs/_index)时，选中**使用私有应用商店**复选框。

2. 为您的 Git 或 Helm 仓库提供`用户名`和`密码`。

### 使用 OAuth 凭据

阅读[使用 Git 的 OAuth 验证](https://github.blog/2012-09-21-easier-builds-and-deployments-using-git-over-https-and-oauth/)了解更多有关使用 OAuth 身份验证的信息。

1. 创建一个[OAuth 凭据](https://github.com/settings/tokens)。选择`repo`权限，然后点击`生成凭据`。

2. [添加应用商店](/docs/catalog/adding-catalogs/_index)时，选中`使用私有应用商店`复选框。

3. 在`用户名`中，输入 Git 生成的 OAuth 凭据。在`密码`中，输入`x-oauth-basic`。
