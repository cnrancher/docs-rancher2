---
title: 功能介绍
description: Rancher 的流水线提供了简单的 CI / CD 体验。使用它可以自动拉取代码，运行构建或脚本，发布 Docker 镜像或应用商店应用以及部署更新的软件。建立流水线可以帮助开发人员尽快，高效地交付新软件。使用 Rancher，您可以与 GitHub 等版本控制系统集成，以设置持续集成（CI）流水线。配置 Rancher 和 GitHub 等版本控制系统后，Rancher 将部署运行 Jenkins 的容器以自动化执行流水线。
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
  - 用户指南
  - 流水线
  - 功能介绍
---

Rancher 的流水线提供了简单的 CI / CD 体验。使用它可以自动拉取代码，运行构建或脚本，发布 Docker 镜像或应用商店应用以及部署更新的软件。

建立流水线可以帮助开发人员尽快，高效地交付新软件。使用 Rancher，您可以与 GitHub 等版本控制系统集成，以设置持续集成（CI）流水线。

配置 Rancher 和 GitHub 等版本控制系统后，Rancher 将部署运行 Jenkins 的容器以自动化执行流水线：

- 构建镜像
- 验证镜像
- 部署镜像到集群
- 执行单元测试
- 执行回归测试

> **注意：**
>
> - 流水线是 Rancher v2.1 版本之后新增和改进功能! 因此，如果您在 v2.0.x 版本已经配置了流水线功能，则需要您在升级到 v2.1 版本之后重新配置流水线功能。
> - 还在使用 v2.0.x 版本吗? 请参阅[早期版本](/docs/rancher2.5/k8s-in-rancher/pipelines/docs-for-v2.0.x/_index)的流水线配置文档。
> - Rancher 的流水线提供了简单的持续集成\持续交付（CI/CD）体验，但是它是简化版的流水线，并不能提供典型流水线的全部功能。Rancher 的流水线不是一个企业级 Jenkins 或其他企业级持续集成工具的替代品。

## 概念

有关本节中使用的概念和术语的说明，请参阅[本页](/docs/rancher2.5/k8s-in-rancher/pipelines/concepts/_index)。

## 流水线的工作原理

Rancher 项目启用了流水线功能后，您可以给每一个 Rancher 项目配置多条流水线。每一条流水线都是独立的，您可以单独配置每一条流水线的参数。

流水线是配置到源代码仓库的一组文件。用户可以使用 Rancher UI 配置流水线，或在代码库中添加一个`.rancher-pipeline.yml`，配置流水线。

在设置任何流水线之前，请确保此项目已经对接了您的版本管理工具，例如，GitHub，GitLab，Bitbucket。如果您没有配置版本管理工具，您可以使用[Rancher 提供的示例代码库](/docs/rancher2.5/k8s-in-rancher/pipelines/example-repos/_index)去预览一些常见的流水线部署流程。

当您配置项目流水线的时候，Rancher 会自动创建一个供流水线使用的命名空间。以下的组件会部署到这个命名空间里面：

- **Jenkins：**

  Jenkins 是构建流水线引擎。因为项目用户不会直接与 Jenkins 交互，它是被托管的，所以您不能直接管理它。

  > **说明：** Rancher 不支持使用已有的 Jenkins 作为流水线引擎，Rancher 将在集群内部署一个 Jenkins。

- **Docker 镜像仓库：**

  Docker 镜像仓库是存储镜像的组件。您使用 Rancher 构建-发布的镜像或应用，默认会推送到 Rancher 内部的 Docker 镜像仓库。但是您可以修改默认配置，把镜像推送到远端仓库。Rancher 内部的 Docker 镜像仓库只能通过集群内的节点访问，用户不能直接访问。镜像留存的时间不会超过项目流水线的生命周期，而且镜像应该只用于流水线运行。如果您需要在流水线运行以外的时间访问镜像，请使用外部镜像仓库。

- **Minio：**

  Minio 是存储 Rancher 流水线日志的组件。

  > **说明：** 托管的 Jenkins 实例的工作负载是无状态的，所以您不用担心数据持久化的问题。Docker 镜像仓库和 Minio 实例默认使用临时存储，临时存储足以应对对大多数情况。如果您希望保证流水线日志在节点失败的情况下能被保存下来，您可以给日志配置持久存储，详情请参考[流水线组件数据持久存储](/docs/rancher2.5/k8s-in-rancher/pipelines/storage/_index)。

## 流水线的基于角色的访问控制

如果您可以访问一个项目，您就能激活代码库来构建流水线。

但只有[系统管理员](/docs/rancher2.5/admin-settings/rbac/global-permissions/_index)，[集群所有者或集群成员](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/_index)，或者[项目所有者](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/_index)能够授权版本管理工具并修改其他项目层级的流水线参数设置。

项目成员只能配置代码库和流水线。

## 配置流水线

要设置流水线，您需要执行以下操作：

### 1、配置版本控制工具提供商

配置流水线前，您必须配置和授权版本控制工具提供商 。Rancher 支持的版本控制工具提供商 包括：GitHub、GitLab 和 Bitbucket，详情如下表所示。

| 提供商    | 版本                          |
| :-------- | :---------------------------- |
| GitHub    | Rancher v2.0.0 或更新版本可用 |
| GitLab    | Rancher v2.1.0 或更新版本可用 |
| Bitbucket | Rancher v2.2.0 或更新版本可用 |

选择一个版本控制工具提供商 然后按照以下步骤操作。

#### GitHub

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**。

1. 按照 UI 界面的的提示，**配置 Github 应用**。Rancher 会打开 Github 网页，在里面配置一个 OAuth 应用。

1. 把从 GitHub 复制的**Client ID** 和 **Client Secret**，粘贴到 Rancher UI 的对应位置。

1. 如果您使用的企业版 GitHub，选择**使用 Github 私有部署**，输入安装 GitHub 的主机地址。

1. 单击**认证**，完成认证。

#### GitLab

_v2.1.0 或更新版本可用_

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**。

1. 按照 UI 界面的的提示，**配置 GitLab 应用**。Rancher 会打开 GitLab 网页。

1. 从 GitLab 复制**Applicat ion ID**和 **Secret**，粘贴到 Rancher UI 的对应位置。

1. 如果您使用的是企业版 GitLab，选择**使用私有 GitLab 部署**，输入安装 GitLab 的主机地址。

1. 单击**认证**，完成认证。

> **说明：**
>
> 1. Rancher 流水线使用的 GitLab API 接口是 [v4 API](https://docs.gitlab.com/ee/api/v3_to_v4.html)。流水线支持的 GitLab 版本是 9.0 及更新版本。
> 2. 如果您使用的是 GitLab 10.7 或更新版本，且在本地安装了 Rancher，请启用 GitLab admin setting 的 **Allow requests to the local network from hooks and services** 功能。

#### Bitbucket Cloud

_v2.2.0 或更新版本可用_

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。

1. 选择**使用 Bitbucket Cloud**选项。

1. 按照 UI 界面的的提示，**配置 Bitbucket Cloud 应用**。Rancher 会打开 Bitbucket 网页，在里面配置一个 OAuth consumer。

1. 从 Bitbucket 复制 consumer **Key**和 **Secret**，粘贴到 Rancher UI 的对应位置。

1. 单击**认证**，完成认证。

#### Bitbucket Server

_v2.2.0 或更新版本可用_

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。

1. 选择**使用私有 Bitbucket Server**选项。

1. 按照 UI 界面的的提示，**配置 Bitbucket Server 应用**。

1. 输入安装 Bitbucket 的主机地址。

1. 单击**认证**，完成认证。

> **说明：**
> Bitbucket Server 发送 webhooks 到 Rancher 的时候需要对 Rancher 进行 SSL 认证，请保证 Rancher Server 使用的证书可以被 Bitbucket Server 信任。有两种方法可以保证 Rancher Server 使用的证书可以被 Bitbucket Server 信任：
>
> 1. 配置 Rancher Server 的时候，使用可信任证书颁发机构发出的证书。
> 1. 如果您使用的是自签名证书，请将 Rancher Server 的证书导入到 Bitbucket Server，详情请参考[如何配置自签名证书](https://confluence.atlassian.com/bitbucketserver/if-you-use-self-signed-certificates-938028692.html)。

**结果：** 完成版本控制工具提供商认证后，Rancher 会重新导向到开始[配置代码库](/docs/rancher2.5/k8s-in-rancher/pipelines/_index)的页面。启用代码库后，您可以开始[配置流水线](/docs/rancher2.5/k8s-in-rancher/pipelines/_index)。

### 2、配置代码库

授权版本管理工具后，UI 将自动重定向，您可以开始配置您的代码库来激活流水线。如果其他人也设置了版本管理工具，您也将看到他们的代码库并可以运行相应的流水线。

1. 从**全局**视图，导航到您想要配置流水线的项目。

1. 单击**资源 > 流水线**。在 v2.3.0 之前版本，单击**工作负载 > 流水线**。

1. 单击**设置代码库**。

1. 显示代码库列表。如果您是第一次配置代码库，单击 **认证 & 同步代码库**去刷新您的代码库列表。

1. 对于您想设置流水线的每个代码库，单击**启用**。

1. 当您启用所有代码库后，单击**完成**。

**效果:** 您已经有了一列可以用来配置流水线的代码库。

### 3、配置流水线

现在代码库已经添加到了您的项目中，您可以开始添加自动化的阶段和步骤来配置流水线了。这里有多种内置的步骤类型便您使用。

1. 从 **全局** 视图，导航到您想要配置流水线的项目。

1. 单击 **资源 > 流水线**。在 v2.3.0 之前版本，单击 **工作负载 > 流水线**。

1. 找到您想设置流水线的代码库。

1. 通过 UI 或者使用代码库中的 yml 文件，例如 `.rancher-pipeline.yml` 或者 `.rancher-pipeline.yaml`进行流水线的配置。流水线的配置分为`阶段`和`步骤`。在进入下一个`阶段`之前，当前`阶段`必须全部完成，但是一个`阶段`中的`步骤`是同时运行的。对于每个阶段，您可以添加不同的步骤类型。注意：在构建每个步骤时，根据步骤类型有不同的高级选项。高级选项包括触发规则，环境变量和密文。有关通过 UI 或 YAML 文件配置流水线的更多信息，请参考[流水线配置参考](/docs/rancher2.5/k8s-in-rancher/pipelines/config/_index)。

   - 如果您正在使用 UI，选择 **省略号 (...) > 编辑配置** 来使用 UI 配置流水线，流水线配置之后，您需要查看 YAML 文件并推送此文件到远端代码库。您也可以直接在 Rancher UI 上将更新后的 YAML 文件同步到代码库中。
   - 如果正在使用 YAML 文件，选择 **省略号(...) > 查看/编辑 YAML** 来配置流水线。如果您选择使用 YAML 文件，您需要在进行任何更改后将其推送到代码库中。您也可以直接在 Rancher UI 上将更新后的 YAML 文件同步到代码库中。当编辑流水线配置时，Rancher 会花一些时间去检查现有流水线配置。

1. 从分支列表中选择要使用的代码`分支`。

1. _自 v2.2.0 起可用_ 可选：设置通知。

1. 设置流水线的触发规则。

1. 输入流水线的**超时时间**。

1. 配置完所有阶段和步骤后，单击**完成**。

**结果：**您的流水线现已完成配置并可以运行。

## 流水线配置参考

请参考[流水线配置参考](/docs/rancher2.5/k8s-in-rancher/pipelines/config/_index)，了解更多关于如何配置流水线的细节。

- 运行脚本
- 构建和发布镜像
- 发布应用模板
- 部署 YAML
- 部署应用商店应用

配置参考还介绍了如何配置：

- 通知
- 超时
- 触发流水线的规则
- 环境变量
- 密文

## 运行流水线

现在可以开始运行流水线了。从 Rancher 的项目视图中，转到 **资源 > 流水线。** (在 v2.3.0 之前的版本中，转到 **流水线** 选项卡)找到您的流水线，选择 **省略号(...) > 运行**。

在此第一次运行流水线的时候，Rancher 会将以下[流水线组件](/docs/rancher2.5/project-admin/pipelines/_index)作为工作负载部署到项目的新命名空间中，作为专用于流水线的工作负载:

- `docker-registry`
- `jenkins`
- `minio`

此过程需要几分钟。完成后，您可以从项目的**工作负载**选项卡中查看每个流水线组件。

## 触发流水线

启用代码库后，将在版本控制工具中自动设置一个 Webhook。默认情况下，流水线是由向代码库的**push**事件触发的，但是您可以修改触发运行流水线的事件。

可用事件:

- **Push**: 当将代码推送到代码库中的分支时，触发流水线。
- **Pull Request**: 每当对代码库提 Pull Request 时，触发流水线。
- **Tag**: 在代码库中创建 tag 时，触发流水线。

> **注意：** 对于 Rancher 的[示例代码库](/docs/rancher2.5/k8s-in-rancher/pipelines/example-repos/_index)，流水线的`设置`项不存在。

### 修改代码库的触发事件

1. 从 **全局** 视图，导航到要修改流水线触发事件的项目。

1. 单击 **资源 > 流水线**。在 v2.3.0 之前的版本中，单击 **工作负载 > 流水线**

1. 找到您要修改事件触发器的代码库。选择**省略号(...)> 设置**。

1. 选择要用于代码库的事件触发器(**Push**，**Pull Request** 或者 **Tag**)。

1. 单击**保存**。
