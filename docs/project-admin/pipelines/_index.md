---
title: 流水线介绍
---

您可以使用 Rancher 和 GitHub、GitLab 或 Bitbucket 代码库集成，配置持续集成（CI）流水线。本文提供了 Rancher 与代码库集成的操作指导、管理全局流水线执行配置的操作指导和配置流水线组件持久存储的操作指导。

以 GitHub 为例，如果您要集成 Rancher 流水线和 GitHub，首先您需要授权 Rancher 使用您的 GitHub 配置。Rancher UI 提供了授权指导。在 GitHub 完成授权后，您需要在 Rancher UI 中提供 GitHub 用户名和密码，完成认证。完成 Rancher 和 GitHub 的对接工作后，您可以部署运行 Jenkins 的容器，自动运行流水线。

*流水线*是一个软件开发的过程，它被分为了不同的阶段和步骤。布置流水线可以帮助开发者快速高效地开发新软件。Rancher 支持项目层级的流水线部署，您可以给每一个 Rancher 项目单独配置流水线。一条典型的流水线包括了以下几个步骤：

- 构建镜像
- 验证镜像
- 部署镜像到集群
- 执行单元测试
- 执行回归测试

一条典型的流水线应该由以下几个阶段组成：

- **构建和验证镜像：**

  每次代码合入 GitHub 代码库的时候，流水线会自动复制一份新的代码，用这份代码构建版本迭代。在这个过程中，代码通常需要通过自动化测试的验证，才可以完成版本迭代。

- **发布镜像：**

  完成版本后，会构建 Docker 镜像，发布到 Docker 镜像仓库中，或者发布一个 Catalog Template。

* **部署镜像：**

  完成发布后，你可以发行新版软件，用户可以开始使用迭代后的产品。

只有[管理员](/docs/admin-settings/rbac/global-permissions/_index)、[集群所有者或集群成员](/docs/admin-settings/rbac/cluster-project-roles/_index)和 [项目所有者](/docs/admin-settings/rbac/cluster-project-roles/_index)可以[配置版本控制供应商](#version-control-providers)和[管理全局流水线执行配置](#managing-global-pipeline-execution-settings)。项目成员只能够配置[repositories](/docs/k8s-in-rancher/pipelines/_index)和[流水线](/docs/k8s-in-rancher/pipelines/_index)。

> **说明：**
>
> - Rancher v2.1 改进了流水线功能。如果您使用 v2.1 以前的版本配置了流水线，当您升级到 v2.1 后，需要重新配置一遍流水线。
> - 如果您仍在使用 Rancher v2.0.x，请参考[Rancher v2.0.x 文档](/docs/tools/pipelines/docs-for-v2.0.x/_index)。

## 概述

Rancher 的流水线提供了简单的持续集成/持续开发（CI/CD）体验。您可以使用 Rancher 流水线自动添加代码，运行构建或脚本，发布 Docker 镜像或 catalog applications，然后部署升级的软件供用户使用。

Rancher 项目启用了流水线功能后，您可以给每一个 Rancher 项目配置多条流水线。每一条流水线都是独立的，您可以单独配置每一条流水线的参数。

流水线是配置到源代码 repository 的一组文件。用户可以使用 Rancher UI 配置流水线，或在 repository 添加一个`.rancher-pipeline.yml` ，配置流水线。

> **说明：** Rancher 的流水线提供了简单的持续集成\持续开发（CI/CD ）体验，但是它是简化版的流水线，并不能提供典型流水线的全部功能。Rancher 的流水线不是一个企业级 Jenkins 或其他企业级持续集成工具的替代品。

## 流水线的工作原理

当您配置项目流水线的时候，Rancher 会自动创建一个供流水线使用的命名空间。以下的组件会部署到这个命名空间里面：

- **Jenkins：**

  Jenkins 是构建流水线引擎。因为项目用户不会直接与 Jenkins 交互，所以它是被管理和被锁定的状态。

  > **说明：** Rancher 不支持使用已有的 Jenkins 作为流水线引擎。

- **Docker 镜像仓库：**

  Docker 镜像仓库是存储镜像的组件。您使用 Rancher 构建-发布的镜像或 catalog application，默认会推送到 Rancher 内部的 Docker 镜像仓库。但是您可以修改默认配置，把修改后的代码推送到远端仓库。Rancher 内部的 Docker 镜像仓库只能通过集群节点访问，而用户不能直接访问。镜像留存的时间不会超过流水线的生命周期，而且镜像应该只用于流水线运行。如果您在流水线运行以外的时间访问镜像，请使用外部镜像仓库。

- **MinIO：**

  MinIO 是存储 Rancher 流水线日志的组件。

  > **说明：** 被管理的 Jenkins 实例的工作是无状态的，所以您不用担心数据持久化的问题。Docker 镜像仓库和 MinIO 实例默认使用短暂存储，短暂存储足以应对对大多数情况。如果您希望保证流水线日志在节点失败的情况下能被保存下来，您可以给日志配置持久存储，详情请参考[流水线组件数据持久存储](#配置流水线组件的持久存储)。

## 流水线的触发方式

完成流水线的配置后，您可以手动或自动触发流水线：

- **手动触发：**

  完成流水线配置后，您可以从 Rancher UI 中最新的 CI 定义触发构建。触发流水线构建的时候，Rancher 动态提供一个 Kubernetes Pod 运行您的 CI 任务，然后在流水线完成的时候移除这个 Pod。

* **自动触发：**

  当您允许流水线对接远端代码仓库（repository）的时候，您使用的版本控制工具中会自动添加 webhook。当项目用户尝试修改远端代码仓库中的代码时，例如使用远端代码仓库中的代码、发起 pull request 或创建 tag，版本控制工具会发送一个 webhook 给 Rancher Server，这就会触发一次流水线运行。

  您需要有远端代码仓库的 webhook 管理权限，才可以使用自动触发流水线的功能。因此，当用户认证和 fetch 远端代码仓库的时候，只能认证和 fetch 到用户有 webhook 管理权限的远端代码仓库。

## Rancher 支持的版本控制系统

配置流水线前，您必须配置和授权版本控制系统服务商 。Rancher 支持的版本控制系统服务商 包括：GitHub、GitLab 和 Bitbucket，详情如下表所示。

| 服务商    | 版本                          |
| :-------- | :---------------------------- |
| GitHub    | Rancher v2.0.0 或更新版本可用 |
| GitLab    | Rancher v2.1.0 或更新版本可用 |
| Bitbucket | Rancher v2.2.0 或更新版本可用 |

选择一个版本控制系统服务商 然后按照以下步骤操作。

### GitHub

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**。

1. 按照 UI 界面的的提示，**配置 Github 应用**。Rancher 会打开 Github 网页，在里面配置一个 OAuth 应用。

1. Paste them into Rancher.从复制 GitHub 的**Client ID** 和 **Client Secret**，粘贴到 Rancher UI 的对应位置。

1. 如果您使用的企业版 GitHub，选择**Use a private github enterprise installation**，输入安装 GitHub 的主机地址。

1. 单击**认证**，完成认证。

### GitLab

_v2.1.0 或更新版本可用_

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**。

1. 按照 UI 界面的的提示，**配置 GitLab 应用**。Rancher 会打开 Github 网页。

1. 从 GitLab 复制**Application ID**和 **Secret**，粘贴到 Rancher UI 的对应位置。

1. 如果果您使用的是企业版 GitLab，选择**Use a private gitlab enterprise installation**，输入安装 GitHub 的主机地址。

1. 单击**认证**，完成认证。

> **说明：**
>
> 1. Rancher 流水线使用的 GitLab API 接口是[v4 API](https://docs.gitlab.com/ee/api/v3_to_v4.html)。流水线支持的 GitHub 版本是 9.0 及更新版本。
> 2. 如果您使用的是 GitLab 10.7 或更新版本，且在本地安装了 Rancher，请启用 GitLab admin setting 的**Allow requests to the local network from hooks and services**功能。

### Bitbucket Cloud

_v2.2.0 或更新版本可用_

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。

1. 选择**使用 Bitbucket Cloud**选项。

1. 按照 UI 界面的的提示，**配置 Bitbucket Cloud 应用**。Rancher 会打开 Bitbucket 网页，在里面配置一个 OAuth consumer。

1. Paste them into Rancher.从 Bitbucket 复制 consumer **Key**和 **Secret**，粘贴到 Rancher UI 的对应位置。

1.单击**Authenticate**，完成认证。

### Bitbucket Server

_v2.2.0 或更新版本可用_

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。

1. 选择**使用私有 Bitbucket Server**选项。

1. 按照 UI 界面的的提示，**配置 Bitbucket Server 应用**。

1. 输入安装 GitHub 的主机地址。

1. 单击**认证**，完成认证。

> **说明：**
> Bitbucket server 发送 webhooks 到 Rancher 的时候需要对 Rancher 进行 SSL 认证，请保证 Rancher Server 使用的证书可以被 Bitbucket server 信任。有两种方法可以保证 Rancher Server 使用的证书可以被 Bitbucket server 信任：
>
> 1. 配置 Rancher Server 的时候，使用可信任证书颁发机构发出的证书。
> 1. 如果您使用的是自签名证书，请将 Rancher Server 的证书导入到 Bitbucket server，详情请参考[如何配置自签名证书](https://confluence.atlassian.com/bitbucketserver/if-you-use-self-signed-certificates-938028692.html)。

**结果：** 完成版本控制系统服务商 认证后，Rancher 会重新导向到开始[配置 repositories](/docs/k8s-in-rancher/pipelines/_index)页面。启用 repository 后，您可以开始[配置流水线](/docs/k8s-in-rancher/pipelines/_index)。

## 管理全局流水线执行配置

配置了版本控制服务商 后，您可以全局配置一些[流水线](/docs/k8s-in-rancher/pipelines/_index)相关的选项。

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**。

### 执行器配额（Executor Quota）

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**。

择最大数量的流水线执行器。_执行器配额_ 决定了项目中可以同时运行多少个构建，如果触发的构建数量超过了执行器配额，构建会形成队列，执行器先执行一部分构建，执行完成后，再执行另一部分构建。执行器的默认配额是`2`，将这个配额的值修改为`0`或负数会取消配额限制。

### 执行器资源配额（Resource Quota for Executors）

_Available as of v2.2.0_

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**。

1. 配置 Jenkins agent 容器的计算资源。

   触发流水线执行的时候，Rancher 会动态提供一个构建 Pod 运行您的 CI 任务。这个 Pod 由一个 Jenkins agent 容器和多个流水线步骤容器构成。您可以管理 Pod 内每一个容器的计算资源 [计算资源](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)。编辑**内存预留**、**内存限制**、 **CPU 预留**、 **CPU 限制**。

1. 单击**修改限制和预留**，完成修改。

### 通过 YAML 编辑流水线步骤容器的计算资源

您可以在`.rancher-pipeline.yml`文件中配置流水线步骤容器的计算资源。

在[步骤类型](/docs/k8s-in-rancher/pipelines/_index)中，你需要提供以下预留和限制：

- **CPU 预留 ( `CpuRequest` )**: 预留给流水线步骤容器的 CPU 额度。
- **CPU 限制 ( `CpuLimit` )**: 流水线步骤容器的能使用 CPU 的最大限额。
- **Memory 预留 ( `MemoryRequest` )**:预留给流水线步骤容器的内存额度
- **Memory 限制 ( `MemoryLimit` )**:流水线步骤容器的能使用内存最大限额

以下是一个通过 YAML 编辑流水线步骤容器计算资源的示例：

```yaml

## 示例

stages:

  + name: Build something

    steps:

    - runScriptConfig:

        image: busybox
        shellScript: ls
      cpuRequest: 100m
      cpuLimit: 1
      memoryRequest:100Mi
      memoryLimit: 1Gi

    - publishImageConfig:

        dockerfilePath: ./Dockerfile
        buildContext: .
        tag: repo/app:v1
      cpuRequest: 100m
      cpuLimit: 1
      memoryRequest:100Mi
      memoryLimit: 1Gi
```

> **说明：** Rancher 配置了除`构建和发布镜像`和 `运行脚本`以外的其他流水线步骤都配置了默认的计算资源。您可以覆盖原有的资源配额。

### 自定义 CA 证书

_v2.2.0 或更新版本可用_

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**

如果您需要配合自定义/内部 CA 根证书使用版本控制服务商 ，CA 根证书需要被添加到版本控制服务商的配置中，才可以保证流水线构建 Pod 成功运行。

1. 单击**编辑证书**。

1. 复制粘贴 CA 根证书，单击**保存 CA 证书**。

**结果：** 流水线和新 Pod 可以配合自签名证书使用。

## 配置流水线组件的持久存储

[Docker 镜像仓库](#流水线的工作原理) 和 [MinIO](#流水线的工作原理) 工作负载默认使用短暂存储，短暂存储足以应对对大多数情况。如果您希望镜像和流水线日志在节点失败的情况下能被保存下来，您可以给镜像日志配置持久存储。下文提供了配置持久存储的操作指导。

> **前提条件：**
>
> 集群必须有可用的[持久存储](/docs/k8s-in-rancher/volumes-and-storage/_index)。

### 配置镜像仓库的持久存储

1. 从需要配置流水线的项目选择**资源 > 工作负载**。如果您使用的是 v2.3.0 之前的版本，请选择**工作负载**。

1. 找到 `docker-registry`的工作负载，选择 **... > 编辑**。

1. 找到“持久卷”的部分，展开选项。单击**添加卷**，从下列两个选项中选择一个：

   - **添加卷 > 添加新的持久卷**
   - **添加卷 > 使用已有的持久卷**

1. 填写 UI 界面提供的表格，选择内部镜像仓库使用的持久卷。

#### 添加新的持久卷

1. 输入持久卷的**名称**。

1. 选择持久卷的**源**

   - 如果您选择的是**使用 Storage Class 启动持久存储卷**，你需要选择[Storage Class](/docs/k8s-in-rancher/volumes-and-storage/_index) ，输入 **容量**。

   - 如果您选择 **使用已有的存储卷**，请直接输入**容量**。

1. 在**自定义**的部分勾选存储卷的读写权限。

1. 单击**定义**。

#### 使用已有的持久卷

1. 输入持久卷的**名称**。

1. 选择一个持久卷。

1. 在**自定义**的部分勾选存储卷的读写权限。

1. 单击**定义**。

#### 后续步骤

1. 在**挂载**对应的文本框输入镜像仓库数据存储的路径： `/var/lib/registry`。

1. 单击 **升级**。

### 配置 MinIO 的数据存储

1. 从项目视图选择**资源 > 工作负载**（如果您使用的是 v2.3.0 之前的版本，请单击**工作负载**）。找到`minio`工作负载，然后选择 **... > 编辑**。

1. 找到“持久卷”的部分，展开选项。单击**添加卷**，从下列两个选项中选择一个：

   - **添加卷 > 添加新的持久卷**
   - **添加卷 > 使用已有的持久卷**

1. 填写 UI 界面提供的表格，选择内部镜像仓库使用的持久卷

#### 添加新的持久卷

1. 输入持久卷的**名称**。

1. 选择持久卷的**源**

   - 如果您选择的是**Use a Storage Class to provision a new persistent volume**，你需要选择[Storage Class](/docs/k8s-in-rancher/volumes-and-storage/_index) ，输入 **Capacity**。
   - 如果您选择 **Use an existing persistent volume**，请直接输入**Capacity**

1. 在**自定义**的部分勾选存储卷的读写权限。

1. 单击 **Define**。

#### 使用已有的持久卷

1. 输入持久卷的**名称**。

1. 选择一个持久卷。

1. 在**自定义**的部分勾选存储卷的读写权限。

1. 单击**定义**。

#### 后续步骤

1. 在**挂载**对应的文本框输入 MinIO 数据存储的路径： `/var/lib/registry`。

1. 单击 **升级**。

**结果：** 完成流水组件的持久存储配置。
