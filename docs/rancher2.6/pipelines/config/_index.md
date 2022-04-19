---
title: 管道配置参考
weight: 1
---

在本文中，你将学习如何配置管道。

- [步骤类型](#step-types)
- [步骤类型：运行脚本](#step-type-run-script)
- [步骤类型：构建和发布镜像](#step-type-build-and-publish-images)
- [步骤类型：发布商店应用模板](#step-type-publish-catalog-template)
- [步骤类型：部署 YAML](#step-type-deploy-yaml)
- [步骤类型：部署商店应用](#step-type-deploy-catalog-app)
- [通知](#notifications)
- [超时](#timeouts)
- [触发器和触发器规则](#triggers-and-trigger-rules)
- [环境变量](#environment-variables)
- [密文](#secrets)
- [管道变量替换参考](#pipeline-variable-substitution-reference)
- [全局管道执行设置](#global-pipeline-execution-settings)
   - [Executor 配额](#executor-quota)
   - [Executor 的资源配额](#resource-quota-for-executors)
   - [自定义 CA](#custom-ca)
- [管道组件的持久化数据](#persistent-data-for-pipeline-components)
- [示例 rancher-pipeline.yml](#example-rancher-pipeline-yml)

## 步骤类型

在每个阶段中，你都可以添加任意数量的步骤。一个阶段中的多个步骤会并发运行。

步骤类型包括：

- [运行脚本](#step-type-run-script)
- [构建和发布镜像](#step-type-build-and-publish-images)
- [发布商店应用模板](#step-type-publish-catalog-template)
- [部署 YAML](#step-type-deploy-yaml)
- [部署商店应用](#step-type-deploy-catalog-app)

<!--
### Clone

The first stage is preserved to be a cloning step that checks out source code from your repo. Rancher handles the cloning of the git repository. This action is equivalent to `git clone <repository_link> <workspace_dir>`.
-->

### 通过 UI 配置步骤

如果你还没有添加任何阶段，请单击**为此分支配置管道**以在 UI 中配置管道。

1. 通过单击**添加阶段**将阶段添加到管道执行中。

   1. 输入管道中各个阶段的**名称**。
   1. 你可以单击**显示高级选项**来配置[触发阶段的规则](#triggers-and-trigger-rules)。注意，你之后还可以更新它们。

1. 创建阶段后，单击**添加步骤**来开始[添加步骤](#step-types)。你可以向每个阶段添加多个步骤。

### 通过 YAML 配置步骤

你可以在每个阶段中添加多个步骤。如需了解如何配置 YAML，请阅读每个[步骤类型](#step-types)和高级选项的更多信息。以下是一个小示例，说明如何配置多个阶段，其中各个阶段中都只有一个步骤：

```yaml
# 示例
stages:
  - name: Build something
    # 阶段的条件
    when:
      branch: master
      event: [ push, pull_request ]
    # 多个步骤并发运行
    steps:
      - runScriptConfig:
          image: busybox
          shellScript: date -R
  - name: Publish my image
    steps:
    - publishImageConfig:
        dockerfilePath: ./Dockerfile
        buildContext: .
        tag: rancher/rancher:v2.0.0
        # 可选择推送到远端镜像仓库
        pushRemote: true
        registry: reg.example.com
```
## 步骤类型：运行脚本

**运行脚本**步骤用于在指定容器内的工作空间中执行命令。你可以根据基础镜像提供的实用程序，使用这个步骤来构建、测试，以及执行更多其他操作。为方便起见，你可以使用变量来引用管道执行的元数据。有关可用变量的列表，请参阅[管道变量替换参考](#pipeline-variable-substitution-reference)。

### 通过 UI 配置脚本

1. 从**步骤类型**下拉列表中，选择**运行脚本**并填写表单。

1. 单击**添加**。

### 通过 YAML 配置脚本
```yaml
# 示例
stages:
- name: Build something
  steps:
  - runScriptConfig:
      image: golang
      shellScript: go build
```
## 步骤类型：构建和发布镜像

**构建和发布镜像**步骤用于构建并发布 Docker 镜像。此步骤需要源代码仓库中的 Dockerfile。

UI 中不提供将镜像发布到不安全镜像仓库的选项。但你可以在 YAML 中指定一个环境变量，从而将镜像发布到不安全的镜像仓库。

### 通过 UI 配置镜像的构建和发布
1. 从**步骤类型**下拉菜单中，选择**构建和发布**。

1. 完成表单的剩余部分。下面列出了每个字段的说明。完成后，请单击**添加**。

   | 字段 | 描述 |
   ---------|----------|
   | Dockerfile 路径 | 源代码仓库中 Dockerfile 的相对路径。如果 Dockerfile 位于根目录，则默认路径为 `./Dockerfile`。你可以在不同用例中将其设置为其他路径（例如 `./path/to/myDockerfile`）。 |
   | 镜像名称 | `name:tag` 格式的镜像名称。不需要填写镜像仓库地址。例如，如果要构建 `example.com/repo/my-image:dev`，请输入 `repo/my-image:dev`。 |
   | 将镜像推送到远端仓库 | 设置用于发布已构建的镜像的镜像仓库。要使用此选项，请启用它并从下拉列表中选择一个镜像仓库。如果禁用此选项，则将镜像推送到内部镜像仓库。 |
   | 构建上下文 <br/><br/>（**显示高级选项**） | 默认是源代码的根目录 (`.`)。有关更多详细信息，请参阅 Docker [构建命令文档](https://docs.docker.com/engine/reference/commandline/build/)。 |

### 通过 YAML 配置镜像的构建和发布

你可以为 Docker daemon 和构建使用特定参数。UI 中没有开放这些参数，但你能以管道 YAML 格式配置这些参数，如下例所示。可用的环境变量包括：

| 变量名称 | 描述 |
------------------------|------------------------------------------------------------
| PLUGIN_DRY_RUN | 禁用 Docker push |
| PLUGIN_DEBUG | Docker daemon 在调试模式下执行 |
| PLUGIN_MIRROR | Docker daemon 镜像仓库 mirror |
| PLUGIN_INSECURE | Docker daemon 允许不安全的镜像仓库 |
| PLUGIN_BUILD_ARGS | Docker 构建参数（逗号分隔的列表） |

<br>

```yaml
# 此示例展示了在"推送镜像"步骤中使用的环境变量。
# 此变量允许你
# 将镜像发布到不安全的镜像仓库：

stages:
- name: Publish Image
  steps:
  - publishImageConfig:
      dockerfilePath: ./Dockerfile
      buildContext: .
      tag: repo/app:v1
      pushRemote: true
      registry: example.com
    env:
      PLUGIN_INSECURE: "true"
```

## 步骤类型：发布商店应用模板

**发布商店应用模板**步骤将商店应用模板的版本（即 Helm Chart）发布到 Git 托管的镜像仓库。它生成一个 Git commit 并将其推送到你的 chart 仓库。要让这个步骤成功完成，需要源代码仓库中的 Chart 文件夹和专用管道命名空间中的预配置密文。Chart 文件夹中的任何文件都支持[管道变量替换参考](#pipeline-variable-substitution-reference)中的变量。

### 通过 UI 配置发布商店应用的模板

1. 从**步骤类型**下拉菜单中，选择**发布商店应用模板**。

1. 完成表单的剩余部分。下面列出了每个字段的说明。完成后，请单击**添加**。

   | 字段 | 描述 |
   ---------|----------|
   | Chart 文件夹 | `Chart.yaml` 文件所在的源代码仓库中， chart 文件夹的相对路径。 |
   | 商店应用模板名称 | 模板的名称。例如，wordpress。 |
   | 商店应用模板版本 | 你要发布的模板版本，应该和 `Chart.yaml` 文件中定义的版本一致。 |
   | 协议 | 可以选择使用 HTTP(S) 或 SSH 协议发布。 |
   | 密文 | 存储 Git 凭证的密文。在添加此步骤之前，你需要在项目的专用管道命名空间中创建一个密文。如果你使用 HTTP(S) 协议，请将 Git 用户名和密码存储在密文的 `USERNAME` 和 `PASSWORD` 键中。如果你使用 SSH 协议，请将 Git 部署密钥存储在密文的 `DEPLOY_KEY` 中。创建密文后，在此选项中选择它。 |
   | Git URL | 用于发布模板的 chart 仓库的 Git URL。 |
   | Git 分支 | 用于发布模板的 chart 仓库的 Git 分支。 |
   | 提交者姓名 | Commit 消息中使用的提交者姓名。 |
   | 提交者邮箱 | Commit 消息中使用的提交者邮箱。 |


### 通过 YAML 配置发布商店应用的模板

你可以直接在 `.rancher-pipeline.yml` 文件中添加**发布商店应用模板**步骤。

在 `steps` 中，使用 `publishCatalogConfig` 添加一个步骤。你需要提供以下信息：

* Path：`Chart.yaml` 文件所在的源代码仓库中， chart 文件夹的相对路径。
* CatalogTemplate：模板的名称。
* Version：你要发布的模板版本，应该和 `Chart.yaml` 文件中定义的版本一致。
* GitUrl：用于发布模板的 chart 仓库的 Git URL。
* GitBranch：用于发布模板的 chart 仓库的 Git 分支。
* GitAuthor：Commit 消息中使用的提交者姓名。
* GitEmail：Commit 消息中使用的提交者邮箱。
* Credentials：需要通过引用专用管道命名空间中的密文来提供 Git 凭证。如果你使用 SSH 协议进行发布，请将部署密钥保存在 `DEPLOY_KEY` 环境变量中。如果你使用 HTTP(S) 协议进行发布，请将你的用户名和密码保存在 `USERNAME` 和 `PASSWORD` 环境变量中。

```yaml
# 示例
stages:
- name: Publish Wordpress Template
  steps:
  - publishCatalogConfig:
      path: ./charts/wordpress/latest
      catalogTemplate: wordpress
      version: ${CICD_GIT_TAG}
      gitUrl: git@github.com:myrepo/charts.git
      gitBranch: master
      gitAuthor: example-user
      gitEmail: user@example.com
    envFrom:
    - sourceName: publish-keys
      sourceKey: DEPLOY_KEY
```

## 步骤类型：部署 YAML

此步骤将任意 Kubernetes 资源部署到项目中。此部署需要 Kubernetes 清单文件存在于源代码仓库中。清单文件中支持管道变量替换。你可以在 [GitHub](https://github.com/rancher/pipeline-example-go/blob/master/deployment.yaml) 中查看​​示例文件。有关可用变量的列表，请参阅[管道变量替换参考](#pipeline-variable-substitution-reference)。

### 通过 UI 配置 YAML 的部署

1. 从**步骤类型**下拉列表中，选择**部署 YAML** 并填写表单。

1. 输入 **YAML 路径**，即源代码中清单文件的路径。

1. 单击**添加**。

### 通过 YAML 配置 YAML 的部署

```yaml
# 示例
stages:
- name: Deploy
  steps:
  - applyYamlConfig:
      path: ./deployment.yaml
```

## 步骤类型：部署商店应用

**部署商店应用**步骤用于在项目中部署商店应用。如果应用不存在，则将安装一个新应用，或升级现有应用。

### 通过 UI 配置商店应用的部署

1. 从**步骤类型**下拉菜单中，选择**部署商店应用**。

1. 完成表单的剩余部分。下面列出了每个字段的说明。完成后，请单击**添加**。

   | 字段 | 描述 |
   ---------|----------|
   | 商店应用 | 将使用应用模板的商店应用。 |
   | 模板名称 | 应用模板的名称。例如，wordpress。 |
   | 模板版本 | 要部署的应用模板的版本。 |
   | 命名空间 | 要部署应用的目标命名空间。 |
   | 应用名称 | 要部署的应用的名称。 |
   | 答案 | 用于部署应用的答案的键值对。 |


### 通过 YAML 配置商店应用的部署

你可以直接在 `.rancher-pipeline.yml` 文件中添加**部署商店应用**步骤。

在 `steps` 中，使用 `applyAppConfig` 添加一个步骤。你需要提供以下信息：

* CatalogTemplate：模板的 ID。你可以单击`启动应用`，并选择该应用的`查看详情`来找到 ID。它是 URL 的最后一部分。
* Version：要部署的模板的版本。
* Answers：用于部署应用的答案的键值对。
* Name：要部署的应用的名称。
* TargetNamespace：要部署应用的目标命名空间。

```yaml
# 示例
stages:
- name: Deploy App
  steps:
  - applyAppConfig:
      catalogTemplate: cattle-global-data:library-mysql
      version: 0.3.8
      answers:
        persistence.enabled: "false"
      name: testmysql
      targetNamespace: test
```

## 超时

默认情况下，每个管道执行的超时时间为 60 分钟。如果管道执行无法在超时期限内完成，则管道将中止。

### 通过 UI 配置超时

在**超时**字段中输入所需的值。

### 通过 YAML 配置超时

在 `timeout` 中，输入超时值（以分钟为单位）。

```yaml
# 示例
stages:
  - name: Build something
    steps:
    - runScriptConfig:
        image: busybox
        shellScript: ls
# 以分钟为单位的超时
timeout: 30
```

## 通知

你可以根据管道的构建状态，启用对通知器的通知。在启用通知之前，Rancher 建议你先设置通知器，以便立即添加收件人。

### 通过 UI 配置通知

1. 在**通知**中，单击**启用**以打开通知。

1. 选择通知的条件。你可以选择接收以下状态的通知：`失败`、`成功`或`已更改`。例如，如果你想在执行失败时接收通知，请选择**失败**。

1. 如果你没有现有的通知器，Rancher 会提示未设置通知器的警告，并显示跳转到通知器页面的链接。你可以按照[说明]({{<baseurl>}}/rancher/v2.0-v2.4/en/cluster-admin/tools/notifiers)添加通知器。如果你已经有通知器，你可以单击**添加收件人**按钮，将他们添加到通知中。

   > **注意**：通知器是在集群级别配置的，需要不同级别的权限。

1. 在下拉列表中为每个收件人选择通知器类型。根据通知器的类型，你可以使用默认收件人或覆盖收件人。例如，如果你有 _Slack_ 通知器，你可以更新通知发送的频道。你可以通过单击**添加收件人**来添加其他通知。

### 通过 YAML 配置通知

在 `notification` 中，你需要提供以下信息：

* **Recipients**：接收通知的通知器/收件人的列表。
   * **Notifier**：通知器的 ID。你可以先找到通知器，并选择**在 API 中查看**来获取 ID。
   * **Recipient**：根据通知器的类型，你可以使用“默认收件人”，或使用不同的收件人来覆盖默认收件人。例如，在配置 slack 通知器时，你选择一个频道作为默认收件人，但如果你想将通知发送到不同的频道，你也可以选择不同的收件人。
* **Condition**：发送通知的条件。
* **Message（可选）**：如果你想更改默认通知消息，你可以在 yaml 中进行编辑。注意：此选项在 UI 中不可用。

```yaml
# 示例
stages:
  - name: Build something
    steps:
    - runScriptConfig:
        image: busybox
        shellScript: ls
notification:
  recipients:
  - # Recipient
    recipient: "#mychannel"
    # Notifier 的 ID
    notifier: "c-wdcsr:n-c9pg7"
  - recipient: "test@example.com"
    notifier: "c-wdcsr:n-lkrhd"
  # 选择发送通知的条件
  condition: ["Failed", "Success", "Changed"]
  # 覆盖默认消息（可选）
  message: "my-message"
```

## 触发器和触发器规则

配置管道后，你可以使用不同的方法触发它：

- **手动**：

   配置管道后，你可以使用 Rancher UI 中的最新 CI 定义来触发构建。管道执行被触发后，Rancher 会动态配置一个 Kubernetes pod 来运行你的 CI 任务，然后在完成后将该 Pod 移除。

- **自动**：

   为管道启用仓库后，Webhook 会自动添加到版本控制系统中。当项目用户通过推送代码、新建 PR 或创建标签与仓库交互时，版本控制系统会向 Rancher Server 发送一个 webhook，从而触发管道执行。

   要使用此自动化，仓库需要 webhook 管理权限。因此，当用户进行身份验证并 fetch 仓库时，只会显示他们具有 webhook 管理权限的仓库。

你可以创建触发规则，从而对管道配置中的管道执行进行细粒度控制。触发规则有两种：

- **Run this when**：在触发器被显式触发时，此类规则将启动管道、阶段或步骤。

- **Do Not Run this when**：当触发器被显式触发时，这类规则会跳过管道、阶段或步骤。

如果所有条件都评估为 `true`，则执行管道/阶段/步骤。否则将会跳过。跳过管道时，不会执行任何管道。如果一个阶段/步骤被跳过了，它会被认为是成功的，而且后续阶段/步骤会继续运行。

`branch` 条件支持通配符 (`*`) 扩展。

本节涵盖以下主题：

- [配置管道触发器](#configuring-pipeline-triggers)
- [配置阶段触发器](#configuring-stage-triggers)
- [配置步骤触发器](#configuring-step-triggers)
- [通过 YAML 配置触发器](#configuring-triggers-by-yaml)

### 配置管道触发器

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 在要管理触发器规则的仓库中，选择 **⋮ > 编辑配置**。
1. 点击**显示高级选项**。
1. 在**触发器**中，配置规则以运行或跳过管道。

   1. 单击**添加规则**。在**值**字段中，输入触发管道的分支名称。

   1. **可选**：添加更多触发构建的分支。

1. 单击**完成**。

### 配置阶段触发器

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 在要管理触发器规则的仓库中，选择 **⋮ > 编辑配置**。
1. 找到要用于管理触发规则的**阶段**，单击该阶段的**编辑**图标。
1. 单击**显示高级选项**。
1. 在**触发器**中，配置规则以运行或跳过阶段。

   1. 单击**添加规则**。

   1. 选择触发阶段的**类型**并输入一个值。

      | 类型 | 值 |
      | ------ | -------------------------------------------------------------------- |
      | 分支 | 触发阶段的分支名称。 |
      | 事件 | 触发阶段的事件类型。可选值为 `Push`，`Pull Request` 和 `Tag`。 |

1. 单击**保存**。

### 配置步骤触发器

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 在要管理触发器规则的仓库中，选择 **⋮ > 编辑配置**。
1. 找到要用于管理触发规则的**步骤**，单击该步骤的**编辑**图标。
1. 单击**显示高级选项**。
1. 在**触发器**中，配置规则以运行或跳过步骤。

   1. 单击**添加规则**。

   1. 选择触发步骤的**类型**并输入一个值。

      | 类型 | 值 |
      | ------ | -------------------------------------------------------------------- |
      | 分支 | 触发步骤的分支名称。 |
      | 事件 | 触发步骤的事件类型。可选值为 `Push`，`Pull Request` 和 `Tag`。 |

1. 单击**保存**。


### 通过 YAML 配置触发器

```yaml
# 示例
stages:
  - name: Build something
    # 阶段的条件
    when:
      branch: master
      event: [ push, pull_request ]
    # 多个步骤并发运行
    steps:
    - runScriptConfig:
        image: busybox
        shellScript: date -R
      # 步骤条件
      when:
        branch: [ master, dev ]
        event: push
# 管道的分支条件
branch:
  include: [ master, feature/*]
  exclude: [ dev ]
```

## 环境变量

配置管道时，某些[步骤类型](#step-types)会允许你使用环境变量来配置步骤的脚本。

### 通过 UI 配置环境变量

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 找到要编辑构建触发器的管道，然后选择 **⋮ > 编辑配置**。
1. 在其中一个阶段中，找到要为其添加环境变量的**步骤**，然后单击**编辑**图标。
1. 单击**显示高级选项**。
1. 单击**添加变量**，然后在出现的字段中输入键和值。根据需要添加更多的变量。
1. 将你的环境变量添加到脚本或文件中。
1. 单击**保存**。

### 通过 YAML 配置环境变量

```yaml
# 示例
stages:
  - name: Build something
    steps:
    - runScriptConfig:
        image: busybox
        shellScript: echo ${FIRST_KEY} && echo ${SECOND_KEY}
      env:
        FIRST_KEY: VALUE
        SECOND_KEY: VALUE2
```

## 密文

如果你需要在管道脚本中使用安全敏感信息（如密码），你可以使用 Kubernetes [密文]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/secrets/)来传入这些信息。

### 前提
在与管道相同的项目中创建一个密文，或者在运行管道构建 pod 的命名空间中显式创建一个密文。
<br>

> **注意**：[PR 事件](#triggers-and-trigger-rules)中的密文传入是禁用的。

### 通过 UI 配置密文

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。
1. 找到要编辑构建触发器的管道，然后选择 **⋮ > 编辑配置**。
1. 在其中一个阶段中，找到要使用密文的**步骤**，然后单击**编辑**图标。
1. 单击**显示高级选项**。
1. 单击**使用密文添加**。选择要使用的密文文件。然后选择密钥。或者，你也可以输入密钥的别名。
1. 单击**保存**。

### 通过 YAML 配置密文

```yaml
# 示例
stages:
  - name: Build something
    steps:
    - runScriptConfig:
        image: busybox
        shellScript: echo ${ALIAS_ENV}
      # 来自项目密文的环境变量
      envFrom:
      - sourceName: my-secret
        sourceKey: secret-key
        targetKey: ALIAS_ENV
```

## 管道变量替换参考

为了方便你的使用，我们提供了以下在管道配置脚本中可以使用的变量。在管道执行期间，这些变量会被元数据替换。你可以使用 `${VAR_NAME}` 格式引用这些变量。

| 变量名称 | 描述 |
------------------------|------------------------------------------------------------
| `CICD_GIT_REPO_NAME` | 仓库名称（省略 GitHub 组织）。 |
| `CICD_GIT_URL` | Git 仓库的 URL。 |
| `CICD_GIT_COMMIT` | 正在执行的 Git commit ID。 |
| `CICD_GIT_BRANCH` | 此事件的 Git 分支。 |
| `CICD_GIT_REF` | 此事件的 Git 参考规范。 |
| `CICD_GIT_TAG` | Git 标签名称，在标签事件上设置。 |
| `CICD_EVENT` | 触发构建的事件（`push`、`pull_request` 或 `tag`）。 |
| `CICD_PIPELINE_ID` | 管道的 Rancher ID。 |
| `CICD_EXECUTION_SEQUENCE` | 管道的生成号（build number）。 |
| `CICD_EXECUTION_ID` | `{CICD_PIPELINE_ID}-{CICD_EXECUTION_SEQUENCE}` 的组合。 |
| `CICD_REGISTRY` | 上一个发布镜像步骤的 Docker 镜像仓库地址，可在`部署 YAML` 步骤的 Kubernetes 清单文件中找到。 |
| `CICD_IMAGE` | 上一个发布镜像步骤构建的镜像的名称，可在 `Deploy YAML` 步骤的 Kubernetes 清单文件中找到。不包含镜像标签。<br/><br/> [示例](https://github.com/rancher/pipeline-example-go/blob/master/deployment.yaml) |

## 全局管道执行设置

配置版本控制提供商后，你可以在 Rancher 中全局配置管道的几个执行选项。

### 更改管道设置

> **先决条件**：由于管道应用已被弃用并替换为 Fleet，因此在使用管道之前，你需要打开旧版功能的功能开关。请注意，我们不再支持 Kubernetes 1.21+ 中的管道。
>
> 1. 在左上角，单击 **☰ > 全局设置**。
> 1. 单击**功能开关**。
> 1. 转到`旧版应用 `功能开关并单击 **⋮ > 激活**。

要编辑这些设置：

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置管道的集群，然后单击 **Explore**。
1. 在顶部导航栏的下拉菜单中，选择要配置管道的项目。
1. 在左侧导航栏中，单击**旧版应用 > 项目 > 管道**。

- [Executor 配额](#executor-quota)
- [Executor 的资源配额](#resource-quota-for-executors)
- [自定义 CA](#custom-ca)

###  Executor 配额

选择管道 Executor 的最大数量。_executor 配额_ 决定了项目中可以同时运行多少个构建。如果触发的构建数量超过配额，后续构建将排队并等待空缺。默认情况下，配额为 `2`。如果配置为 `0` 或更小的值，则表示删除配额限制。

### Executor 的资源配额

为 Jenkins Agent 容器配置计算资源。当触发管道执行时，会动态配置构建 pod 以运行你的 CI 任务。在底层，一个构建 pod 由一个 Jenkins Agent 容器和一个用于各个管道步骤的容器组成。你可以为 pod 中的每个容器[管理计算资源](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)。

编辑**内存预留**、**内存限制**、**CPU 预留**或 **CPU 限制**，然后点击**更新限制和预留**。

要为管道步骤容器配置计算资源：

你可以在 `.rancher-pipeline.yml` 文件中为管道步骤容器配置计算资源。

在步骤中，你需要提供以下信息：

* **CPU 预留 (`CpuRequest`)**：对管道步骤的容器的 CPU 请求。
* **CPU 预留 (`CpuRequest`)**：对管道步骤的容器的 CPU 限制。
* **内存预留 (`MemoryRequest`)**：对管道步骤的容器的内存请求。
* **内存限制（`MemoryLimit`）**：对管道步骤的容器的内存限制。

```yaml
# 示例
stages:
  - name: Build something
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

> **注意**：Rancher 为管道步骤设置了默认计算资源（`构建和发布镜像`和`运行脚本`步骤除外）。你可以通过指定计算资源来覆盖默认值。

### 自定义 CA

如果你想将版本控制提供商与自定义/内部 CA 根证书一起使用，则需要将 CA 根证书添加到版本控制提供商的配置中，从而让管道构建 pod 成功运行。

1. 单击**编辑证书**。

1. 粘贴 CA 根证书并单击**保存 CA 证书**。

**结果**：你现在可以使用管道，而且新的 pod 将能够使用自签名证书。

## 管道组件的持久化数据

默认情况下，内部 Docker 镜像仓库和 Minio 工作负载都使用临时卷。这是开箱即用的默认存储方式，能让测试变得更加便利。但如果运行 Docker 镜像仓库或 Minio 的节点出现故障，你将丢失构建镜像和构建日志。在大多数情况下，这不是太大的问题。如果你希望构建镜像和日志能够在节点故障中幸免于难，你可以让 Docker 镜像仓库和 Minio 使用持久卷。

有关为管道设置持久存储的详细信息，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/pipelines/storage)。

## 示例 rancher-pipeline.yml

如果你需要查看示例管道配置文件，请参见[此页面]({{<baseurl>}}/rancher/v2.6/en/pipelines/example)。
