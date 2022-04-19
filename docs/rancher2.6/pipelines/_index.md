---
title: 管道
weight: 10
---

> Rancher 2.5 开始已弃用基于 Git 的部署管道。我们建议使用由 [Fleet]({{<baseurl>}}/rancher/v2.6/en/deploy-across-clusters/fleet) 提供支持的 Rancher Continuous Delivery (CD) 来处理管道。如需在 Rancher 中访问 Fleet，请单击 <b>☰ > 持续交付</b>。
>
> **注意**：
>
> - 不再支持 Kubernetes 1.21+ 中的管道。
> - Fleet 不会取代 Rancher 管道，只是 Rancher 管道现在由 Fleet 提供支持。

Rancher 的管道提供了简单的 CI/CD 体验。你可以使用管道来自动签出代码、运行构建或脚本、发布 Docker 镜像或商店应用，以及将更新的软件部署给用户。

设置管道可以帮助开发者快速高效地上线新软件。你可以使用 Rancher 与 GitHub 仓库集成，从而设置持续集成（CI）管道。

配置 Rancher 和 GitHub 后，你可以部署运行 Jenkins 的容器来自动化执行管道：

- 将应用代码构建为镜像。
- 验证构建。
- 将构建的镜像部署到集群。
- 运行单元测试。
- 运行回归测试。

> **注意**：Rancher 的管道提供简单的 CI/CD 体验，但不提供完整的功能和灵活性，也不能替代你团队正在使用的企业级 Jenkins 或其他 CI 工具。

本节涵盖以下主题：

- [概念](#concepts)
- [管道的工作原理](#how-pipelines-work)
- [管道的 RBAC](#roles-based-access-control-for-pipelines)
- [设置管道](#setting-up-pipelines)
  - [配置版本控制提供商](#1-configure-version-control-providers)
  - [配置仓库](#2-configure-repositories)
  - [配置管道](#3-configure-the-pipeline)
- [管道配置参考](#pipeline-configuration-reference)
- [运行管道](#running-your-pipelines)
- [触发管道](#triggering-a-pipeline)
  - [修改仓库的事件触发器](#modifying-the-event-triggers-for-the-repository)

## 概念

有关本节中使用的概念和术语说明，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/pipelines/concepts)。

## 管道的工作原理

为项目中启用管道功能后，你可以在每个项目中配置多个管道。每个管道都是独一无二的，可以独立配置。

管道是由一组签入源代码仓库的文件配置的。用户可以通过 Rancher UI 或通过将 `.rancher-pipeline.yml` 添加到仓库来配置管道。

在配置管道之前，你需要为版本控制提供商（例如 GitHub、GitLab 或 Bitbucket）配置身份验证。如果你还没有配置版本控制提供商，你可以随时使用 [Rancher 的示例仓库]({{<baseurl>}}/rancher/v2.6/en/pipelines/example-repos/)来查看​​常见的管道部署。

在项目中配置管道时，会自动创建一个专门用于该管道的命名空间。以下组件会部署到该命名空间中：

- **Jenkins**：

  管道的构建引擎。由于项目用户不直接与 Jenkins 交互，因此 Jenkins 是被托管和锁定的。

  > **注意**：没有使用现有 Jenkins deployment 作为管道引擎的选项。

- **Docker 镜像仓库**：

  内部 Docker 镜像仓库是开箱即用，用于构建到发布步骤的默认目标。你也可以进行配置以推送到远程镜像仓库。内部 Docker 镜像仓库只能从集群节点访问，用户不能直接访问它。镜像不会在管道的生命周期之外被持久化，并且只能在管道运行使用。如果你需要在管道运行之外访问镜像，请将镜像推送到外部镜像仓库。

- **Minio**：

  Minio 存储用于存储管道执行的日志。

> **注意**：托管的 Jenkins 实例是无状态工作的，因此你不用担心它的数据持久性。Docker 镜像仓库和 Minio 实例默认使用临时卷，这种做法适用于大多数用例。如果你想确保管道日志能够在节点故障的情况下也能保存，你可以为它们配置持久卷（参见[管道组件的数据持久性]({{<baseurl>}}/rancher/v2.6/en/pipelines/storage)）。

## 管道的 RBAC

如果你可以访问项目，则可以启用仓库来开始构建管道。

只有[管理员]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)、[集群所有者或成员]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#cluster-roles)或[项目所有者]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#project-roles)可以配置版本控制提供商和管理全局管道的执行设置。

项目成员只能配置仓库和管道。

## 设置管道

### 前提

> **先决条件**：由于管道应用已被弃用并替换为 Fleet，因此在使用管道之前，你需要打开旧版功能的功能开关。请注意，我们不再支持 Kubernetes 1.21+ 中的管道。
>
> 1. 在左上角，单击 **☰ > 全局设置**。
> 1. 单击**功能开关**。
> 1. 转到`旧版应用 `功能开关并单击 **⋮ > 激活**。

1. [配置版本控制提供商](#1-configure-version-control-providers)
2. [配置仓库](#2-configure-repositories)
3. [配置管道](#3-configure-the-pipeline)

### 1. 配置版本控制提供商

在为仓库配置管道之前，你必须配置和授权版本控制提供商：

- GitHub
- GitLab
- Bitbucket

在下方选择你的提供商对应的选项卡，然后按照说明进行操作。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="github"
values={[
{ label: 'GitHub', value: 'github', },
{ label: 'GitLab', value: 'gitlab', },
{ label: 'Bitbucket Cloud', value: 'bitbucketcloud', },
{ label: 'Bitbucket Server', value: 'bitbucketserver', },
]}>

<TabItem value="github">

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 单击**配置**选项卡。
1. 按照说明**设置 Github 应用**。Rancher 会将你重定向到 GitHub 以在 GitHub 中设置 OAuth 应用。
1. 从 GitHub 复制 **Client ID** 和 **Client Secret**。将它们粘贴到 Rancher 中。
1. 如果你使用的是企业版 GitHub，请选择**使用私有 GitHub 企业版安装**。输入 GitHub 安装的主机地址。
1. 单击**验证**。

</TabItem>
<TabItem value="gitlab">

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 单击**配置**选项卡。
1. 单击 **GitLab**。
1. 按照说明**设置 GitLab 应用**。Rancher 会将你重定向到 GitLab。
1. 从 GitLab 复制 **Application ID** 和 **Secret**。将它们粘贴到 Rancher 中。
1. 如果你使用的是企业版 GitLab，请选择**使用私有 GitLab 企业版安装**。输入 GitLab 安装的主机地址。
1. 单击**验证**。

> **注意**：
>
> 1. 管道使用 GitLab [v4 API](https://docs.gitlab.com/ee/api/v3_to_v4.html)，支持的 GitLab 版本为 9.0+。
> 2. 如果你使用 GitLab 10.7+ 并且你的 Rancher 设置位于本地网络中，请在 GitLab 管理设置中启用 **Allow requests to the local network from hooks and services** 选项。
>
</TabItem>
<TabItem value="bitbucketcloud">

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 单击**配置**选项卡。
1. 单击 **Bitbucket** 并保留默认选中的**使用 Bitbucket Cloud**。
1. 按照说明**设置 Bitbucket Cloud 应用**。Rancher 会将你重定向到 Bitbucket 以在 Bitbucket 中设置 OAuth 使用者。
1. 从 Bitbucket 复制使用者 **Key** 和 **Secret**。将它们粘贴到 Rancher 中。
1. 单击**验证**。

</TabItem>
<TabItem value="bitbucketserver">

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 单击**配置**选项卡。
1. 点击 **Bitbucket** 并选择**使用私有 Bitbucket Server 设置**选项。
1. 按照说明**设置 Bitbucket Server 应用**。
1. 输入 Bitbucket Server 安装的主机地址。
1. 单击**验证**。

> **注意：**
> Bitbucket server 在向 Rancher 发送 webhook 时需要进行 SSL 验证。请确保 Rancher server 的证书被 Bitbucket server 信任。有两种选择：
>
> 1. 使用受信任的 CA 签发的证书来设置 Rancher server。
> 1. 如果你使用的是自签名证书，请将 Rancher server 的证书导入 Bitbucket server。有关说明，请参阅 Bitbucket sever 文档以了解如何[配置自签名证书](https://confluence.atlassian.com/bitbucketserver/if-you-use-self-signed-certificates-938028692.html)。

</TabItem>
</Tabs>

**结果**：版本控制提供商通过身份验证后，你将被自动重定向以配置你希望使用管道的仓库。

### 2. 配置仓库

授权版本控制提供商后，你将被自动重定向以配置你希望使用管道的仓库。即使其他人设置了版本控制提供商，你也能看到他们的仓库并构建管道：

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 单击**配置仓库**。

1. 此处会显示仓库列表。如果你是第一次配置仓库，请单击 **Authorize & Fetch Your Own Repositories** 来获取你的仓库列表。

1. 在要设置管道的仓库处单击**启用**。

1. 启用所有仓库后，单击**完成**。

**结果**：你有了一个可以配置管道的仓库列表。

### 3. 配置管道

现在仓库已添加到你的项目中。你可以通过添加自动化阶段和步骤来配置管道。为方便起见，我们提供了多种用于特有任务的内置步骤类型。

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 找到要设置管道的仓库。
1. 通过 UI 或使用仓库中的 YAML 文件（即 `.rancher-pipeline.yml` 或 `.rancher-pipeline.yaml`）配置管道。管道配置分为阶段和步骤。必须完全完成阶段后才能进入下一个阶段，但一个阶段中的步骤可以同时运行。你可以在每个阶段中添加不同的步骤类型。请注意，在构建步骤时，会根据步骤类型提供不同的高级选项。高级选项包括触发规则、环境变量和密文。有关通过 UI 或 YAML 文件配置管道的更多信息，请参阅[管道配置参考]({{<baseurl>}}/rancher/v2.6/en/pipelines/config)。

   - 如果要使用 UI，请选择 **⋮ > 编辑配置**以使用 UI 配置管道。配置管道后，你必须查看 YAML 文件并将其推送到仓库。
   - 如果你要使用 YAML 文件，请选择 **⋮ > 查看/编辑 YAML** 来配置管道。如果你使用 YAML 文件，你需要在更改文件后将更新的文件推送到仓库，以便更新仓库中的内容。在编辑管道配置时，Rancher 需要花一些时间检查现有的管道配置。

1. 从分支列表中选择要使用的`分支`。

1. 可选：设置通知。

1. 设置管道的触发规则。

1. 为管道输入**超时**。

1. 配置完所有阶段和步骤后，单击**完成**。

**结果** ：你的管道已配置好并可以运行了。

## 管道配置参考

参见[此页面]({{<baseurl>}}/rancher/v2.6/en/pipelines/config)以了解如何通过配置管道实现以下目的：

- 运行脚本
- 构建和发布镜像
- 发布应用商店模板
- 部署 YAML
- 部署商店应用

配置参考还包括如何配置：

- 通知
- 超时
- 触发管道的规则
- 环境变量
- 密文

## 运行管道

首次运行你的管道。找到你的管道并选择 **⋮ > 运行**。

在此初始运行期间将测试你的管道。以下管道组件将作为工作负载部署到你的项目专用于该管道的命名空间：

- `docker-registry`
- `jenkins`
- `minio`

这个过程需要几分钟。完成后，你可以从项目的**工作负载**选项卡中查看每个管道组件。

## 触发管道

启用仓库后，会在版本控制提供商中自动设置 webhook。默认情况下，管道会由 **push** 事件触发到仓库，但你也可以修改触发运行管道的事件。

可用事件：

- **Push**：当提交被推送到仓库中的分支时，触发管道。
- **Pull Request**：对仓库发起 PR 时，触发管道。
- **Tag**：在仓库中创建标签时，触发管道。

> **注意**：Rancher 的[示例仓库]({{<baseurl>}}/rancher/v2.6/en/pipelines/example-repos/)不存在此选项。

### 修改仓库的事件触发器

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 找到要修改事件触发器的仓库。选择 **⋮ > 设置**。
1. 为仓库选择所需的事件触发器（**Push**、**Pull Request** 或 **Tag**）。
1. 单击**保存**。
