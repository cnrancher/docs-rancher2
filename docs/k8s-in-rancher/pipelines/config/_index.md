---
title: 流水线配置参考
---

## 步骤类型

在每个阶段中，您可以任意添加多个步骤。在一个阶段中有多个步骤时，它们会同时运行。

步骤类型包括：

- [运行脚本](#步骤类型---运行脚本)
- [构建并发布镜像](#步骤类型---构建并发布镜像)
- [发布应用模板](#步骤类型---发布应用模板)
- [部署 YAML](#步骤类型---部署-yaml)
- [部署应用商店应用](#步骤类型---部署应用商店应用)

### 通过 UI 配置阶段和步骤

如果您尚未添加任何阶段，通过 UI 界面点击**设置流水线**来配置这个分支的流水线。

1. 通过点击**添加阶段**将阶段添加到流水线。

   1. 为您流水线的每个阶段输入一个**名称**。
   1. 对于每个阶段，您可以通过单击**显示高级选项**来配置[触发规则](#触发规则)。注意：此设置可以随时更新。

1. 创建阶段后，通过单击**添加步骤**开始[添加步骤](#步骤类型)。您可以在每个阶段添加多个步骤。

### 通过 YAML 配置阶段和步骤

对于每个阶段，您可以添加多个步骤。阅读有关每个[步骤类型](#步骤类型)和[高级选项](#高级选项)的更多信息，以获取有关如何配置 YAML 的详细信息。下面是一个每个`阶段`有单个`步骤`的例子。

```yaml
# 示例
stages:
  - name: Build something
    # 触发阶段的条件
    when:
      branch: master
      event: [push，pull_request]
    # 同步运行的多个步骤
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
          # （可选）是否推送到远端仓库
          pushRemote: true
          registry: reg.example.com
```

## 步骤类型 - 运行脚本

**运行脚本**步骤可以在指定容器内的工作空间中执行任意命令。您可以使用它来构建，测试和执行更多操作，您可以使用这个指定的基础镜像内的全部工具。您可以通过`变量替换`的方式使用流水线元数据。有关可用变量的列表，请参考[流水线变量替换列表](#流水线变量替换列表)。

### 通过 UI 设置运行脚本

1. 从**步骤类型**下拉列表中，选择**运行脚本**并填写表格。

1. 点击 **添加**。

### 通过 YAML 设置运行脚本

```yaml
## 示例
stages:
  - name: Build something
    steps:
      - runScriptConfig:
          image: golang
          shellScript: go build
```

### 步骤类型 - 构建并发布镜像

_可用于 Rancher v2.1.0_

**构建并发布镜像**步骤将构建并发布 Docker 镜像。此过程需要您源代码库中的 Dockerfile 才能成功完成。

> UI 中没有暴露允许将镜像发布到不安全的镜像库的选项，但是您可以在 YAML 中，通过设置环境变量来允许将镜像发送到不安全的镜像库。

### 通过 UI 设置构建并发布镜像

1. 在 **步骤类型** 下拉列表中，选择 **构建并发布镜像**。

1. 填写表格的其余部分。下面列出了每个字段的说明。完成后，点击 **添加**。

   | 字段                        | 描述                                                                                                                                                                                             |
   | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | Dockerfile 路径             | Dockerfile 文件在您代码库中的相对路径。默认值为`./Dockerfile`，它意味着 Rancher 将使用您的代码库根目录中的 Dockerfile 文件。根据需要，您可以把这个设置为其他值。例如，`./path/to/myDockerfile`。 |
   | 镜像名称                    | 以`name:tag`为格式的镜像名称。不需要包括镜像库地址。例如，构建`example.com/repo/my-image:dev`镜像，输入`repo/my-image:dev`。                                                                     |
   | 推送镜像到远端镜像仓库      | 选择是否将流水线中构建的镜像发布到远端镜像仓库中。如果需要，请选中该项，并且在下拉菜单中选择要推送的镜像仓库。如果没有选择该项，您构建的镜像将被推送到流水线内置的镜像库                         |
   | 构建上下文 （在高级选项中） | 默认值为源代码根目录(`.`)。获取更多详情，请参阅[Docker 构建命令文档](https://docs.docker.com/engine/reference/commandline/build/)。                                                              |

### 通过 YAML 设置构建并发布镜像

您可以为 Docker 守护进程和构建使用特定的参数。它们没有显示在 UI 中，但是可以在 YAML 中设置它们，如下例所示。可用的环境变量包括:

| 变量名            | 描述                                   |
| ----------------- | -------------------------------------- |
| PLUGIN_DRY_RUN    | 禁用 docker push                       |
| PLUGIN_DEBUG      | 以 Debug 模式运行 Docker 守护进程      |
| PLUGIN_MIRROR     | 配置 Docker 守护进程的镜像库 mirror    |
| PLUGIN_INSECURE   | 允许 Docker 守护进程使用不安全的镜像库 |
| PLUGIN_BUILD_ARGS | 由逗号分隔的 Docker 构建参数           |

```yaml
# 本示例显示了使用的环境变量
# 在“发布镜像”步骤中。此变量允许您将镜像发布到不安全的镜像库

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
          PLUGIN_INSECURE: 'true'
```

## 步骤类型 - 发布应用模板

_可用于 v2.2.0_

**发布应用模板** 步骤将应用商店模板的版本文件（即 Helm chart）发布到[git 托管的 chart 代码库](/docs/catalog/adding-catalogs/_index)。Rancher 将生成一个 git commit 并将其推送到您的 chart 代码库。此过程需要在源代码库中有一个 chart 文件夹。并且需要您在流水线专用的命名空间中预先配置的好可以访问 git 的密文。您可以在 chart 文件夹中的任何文件中使用[流水线变量替换功能](#流水线变量替换列表)。

### 通过 UI 设置发布应用模板

1.  在**步骤类型**下拉列表中，选择**发布应用模板**。

1.  填写表格的其余部分。下面列出了每个字段的说明。完成后，点击 **添加**。

    | 字段         | 描述                                                                                                                                                                                                                                                                          |
    | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Chart 目录   | chart 目录在代码库中的相对路径。也就是`Chart.yaml`所在的目录。                                                                                                                                                                                                                |
    | 应用模板名称 | 所发布应用模板的名称。例如，wordpress。                                                                                                                                                                                                                                       |
    | 应用模板版本 | 所发布应用模板的版本。这个版本应该和您`Chart.yaml`文件中的版本号匹配。                                                                                                                                                                                                        |
    | 协议         | 您可以选择通过 HTTP(s)或者 SSH 的方式发布到代码库中。                                                                                                                                                                                                                         |
    | 密文         | 选择包含您的 Git 访问凭证的密文。您需要在流水线专用的命名空间中创建一个密文。如果您用的是 HTTP 或者 HTTPS 的方式，请把 Git 的用户名和密码保存在这个密文的`USERNAME`和`PASSWORD`键值对中。如果您使用 SSH 的方式，请把 Git 的 deploy key 保存在这个密文的`DEPLOY_KEY`键值对中。 |
    | Git 地址     | 把应用模板发布到这个 Git 地址。                                                                                                                                                                                                                                               |
    | Git 分支     | 把应用模板发布到这个 Git 分支。                                                                                                                                                                                                                                               |
    | 作者         | 提交信息中所包含的作者信息。                                                                                                                                                                                                                                                  |
    | 作者邮箱     | 提交信息中所包含的作者邮箱信息。                                                                                                                                                                                                                                              |

### 通过 YAML 设置发布应用模板

您可以直接在 `.rancher-pipeline.yml` 文件中添加 **发布应用模板**步骤。

在 `步骤` 部分下，使用 `publishCatalogConfig` 添加一个步骤。您将提供以下信息:

- Path: 源代码库中 `Chart.yaml` 文件所在的 chart 文件夹的相对路径。
- CatalogTemplate: 模板名称。
- Version: 您要发布的模板版本，应与 `Chart.yaml` 文件中定义的版本一致。
- GitUrl: 模板将发布到的 chart 代码库的 git URL。
- GitBranch: 模板将发布到的 chart 代码库的 git 分支。
- GitAuthor: 提交消息中使用的作者姓名。
- GitEmail: 提交消息中使用的作者电子邮件。
- Credentials: 包含您的 Git 访问凭证的密文。您需要在流水线专用的命名空间中创建一个密文。如果您用的是 HTTP 或者 HTTPS 的方式，请把 Git 的用户名和密码保存在这个密文的`USERNAME`和`PASSWORD`键值对中。如果您使用 SSH 的方式，请把 Git 的 deploy key 保存在这个密文的`DEPLOY_KEY`键值对中。

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

## 步骤类型 - 部署 YAML

此步骤将任意 Kubernetes 资源部署到项目。此部署要求您的源代码库中存在 Kubernetes YAML 文件。您可以在 Kubernetes YAML 文件中使用流水线变量替换功能。您可以在[GitHub](https://github.com/rancher/pipeline-example-go/blob/master/deployment.yaml)上查看示例文件。有关可用变量的列表，请参考[流水线变量替换列表](#流水线变量替换列表)。

### 通过 UI 设置部署 YAML

1. 从 **步骤类型** 下拉列表中，选择 **部署 YAML** 并填写表格。

1. 输入 **YAML 路径**，这是源代码中 Kubernetes YAML 文件的路径。

1. 点击 **添加**。

### 通过 YAML 设置部署 YAML

```yaml
# 示例
stages:
  - name: Deploy
    steps:
      - applyYamlConfig:
          path: ./deployment.yaml
```

## 步骤类型 - 部署应用商店应用

_可用于 v2.2.0_

**部署应用商店应用** 步骤在项目中部署应用商店应用。如果应用不存在，它将安装一个新应用。如果存在，它将升级一个已有的应用。

### 通过 UI 设置部署应用商店应用

1. 在 **步骤类型** 下拉列表中，选择 **部署应用**。

1. 填写表格的其余部分。下面列出了每个字段的说明。完成后，点击 **添加**。

   | 字段     | 描述                              |
   | -------- | --------------------------------- |
   | 应用商店 | 应用模板所在的应用商店。          |
   | 应用模板 | 应用模板的名称。例如，wordpress。 |
   | 模板版本 | 您要部署的应用模板的版本。        |
   | 命名空间 | 部署应用的命名空间。              |
   | 应用名称 | 部署应用的应用名称。              |
   | 应答     | 用来部署应用的键值对形式的应答。  |

### 通过 YAML 设置部署应用商店应用

您可以直接在 `.rancher-pipeline.yml` 文件中添加 **部署应用商店应用** 步骤。

在 `步骤` 部分下，通过 `applyAppConfig` 添加一个步骤。您将提供以下信息:

- CatalogTemplate: 应用模板的 ID。可以在应用商店页单击 `启动`。找到并点击您要部署的应用。应用部署页 url 的最后一部分就是您要找的`CatalogTemplate`值。
- Version: 您要部署的应用模板的版本。
- Answers: 用来部署应用的键值对形式的应答
- Name: 部署应用的应用名称。
- TargetNamespace: 部署应用的命名空间。

```yaml
# 示例
stages:
  - name: Deploy App
    steps:
      - applyAppConfig:
          catalogTemplate: cattle-global-data:library-mysql
          version: 0.3.8
          answers:
            persistence.enabled: 'false'
          name: testmysql
          targetNamespace: test
```

## 设置超时时间

默认情况下，每个流水线执行都有 60 分钟的超时时间限制。如果流水线执行无法在其超时时间内完成，流水线将会被自动中止。

### 通过 UI 配置超时时间

在**高级选项 > 超时时间**字段中输入新值。

### 通过 YAML 配置超时时间

在**timeout**部分中，输入以分钟为单位的超时值。

```yaml
# 示例
stages:
  - name: Build something
    steps:
      - runScriptConfig:
          image: busybox
          shellScript: ls
# 以分钟为单位的超时时间
timeout: 30
```

## 设置流水线通知

_可用于 v2.2.0_

**通知：** 您可以决定是否要为流水线设置通知。您可以根据流水线的构建状态，启用任何[通知](/docs/cluster-admin/tools/notifiers/_index)。在启用流水线通知之前，您需要[配置通知](/docs/cluster-admin/tools/notifiers/_index)，这样可以轻松地添加接收者。

### 通过 UI 配置通知

_可用于 v2.2.0_

1. 在**通知**部分中，单击**启用**以启用通知。

1. 选择通知的条件。您可以选择获得下列状态的通知：`Failed`，`Success`，`Changed`。例如，如果您想在执行失败时接收通知，请选择**Failed**.

1. 如果您没有任何现有的[通知](/docs/cluster-admin/tools/notifiers/_index)，Rancher 将警告您未设置任何通知，并提供一个链接，可转到设置通知页面。按照[相关说明文档](/docs/cluster-admin/tools/notifiers/_index)添加通知。如果您已有接收者，则可以通过单击**添加接收者**按钮将其添加到通知中。

   > **注意：**通知是在集群级别配置的，需要不同级别的权限。

1. 对于每个接收者，从下拉列表中选择哪种通知类型。根据接收者的类型，您可以使用默认接收者，也可以使用其他接收者替换默认接收者。例如，如果您有*Slack*的通知，则可以将通知发送到的*Slack Channel*。您可以通过单击**添加接收者**来添加其他接收者。

### 通过 YAML 配置通知

_可用于 v2.2.0_

在`通知`部分，您将提供以下信息:

- **Recipients：** 这是将接收通知的接收者的列表。
  - **Notifier：** 通知的 ID。可以通过找到通知并选择**在 API 中查看**来获取 ID。
  - **Recipient：** 根据接收者的类型，可以使用“默认接收者”，也可以用其他接收者覆盖它。例如，在配置一个 stack 接收者时，您选择一个频道作为默认接收者，但是如果要将通知发送到其他频道，则可以选择其他接收者。
- **Condition：** 选择您希望发送通知的条件。
- **Message (可选)：** 如果要更改默认通知消息，则可以在 Yaml 中进行编辑。注意：此选项在用户界面中不可用。

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
    - # 接收者
      recipient: '#mychannel'
      # 通知的ID
      notifier: 'c-wdcsr:n-c9pg7'
    - recipient: 'test@example.com'
      notifier: 'c-wdcsr:n-lkrhd'
  # 选择您想要发送通知的条件
  condtions: ['Failed'，'Success'，'Changed']
  # 用来覆盖默认通知内容 (可选)
  message: 'my-message'
```

## 配置触发器和触发规则

配置完流水线之后，可以使用不同的方法来触发它：

- **手动触发：**

  完成流水线配置后，您可以从 Rancher UI 中使用最新的 CI 定义触发构建。触发流水线构建的时候，Rancher 动态创建一个 Kubernetes Pod 运行您的 CI 任务，然后在流水线完成的时候移除这个 Pod。

* **自动触发：**

  当您允许流水线对接远端代码仓库的时候，您使用的版本控制工具中会自动添加 webhook。当项目用户尝试修改远端代码仓库中的代码时，例如推送代码到远端代码仓库、发起 pull request 或创建 tag，版本控制工具会发送一个 webhook 给 Rancher Server，这就会触发一次流水线运行。

  您需要有远端代码仓库的 webhook 管理权限，才可以使用自动触发流水线的功能。因此，当用户认证和拉取远端代码仓库的时候，只能认证和拉取到用户有 webhook 管理权限的远端代码仓库。

可以创建触发规则，以对流水线的执行进行细粒度的控制。触发规则有两种:

- **当满足条件时运行：**

  在触发事件发生时，将启动流水线，阶段或步骤。

- **当满足条件时不运行：**

  在触发事件发生时，将跳过流水线，阶段或步骤。

只有所有触发规则都满足时，才会执行流水线/阶段/步骤。否则将被跳过。如果跳过流水线，整个流水线都不会被执行。如果跳过某个阶段或步骤，则认为该阶段/步骤执行成功，并且继续执行后续阶段/步骤。

在设置`分支`条件时，支持通配符（`*`）。

### 通过 UI 设置流水线触发规则

1. 从 **全局** 视图，导航到要配置流水线触发规则的项目。

1. 点击 **资源 > 流水线.** 在 v2.3.0 之前的版本中，点击 **工作负载 > 流水线**。

1. 从要管理触发规则的代码库中，选择**省略号（...）> 编辑配置**。

1. 点击 **显示高级选项**。

1. 在 **触发规则** 部分中，配置规则以运行或跳过流水线。

1. 点击 **添加规则**。在 **值** 字段中，输入触发流水线的分支名称。

1. **可选:** 添加更多触发构建的分支。

1. 点击 **完成**。

### 通过 UI 设置阶段触发规则

1. 从 **全局** 视图,导航到要配置阶段触发规则的项目。

1. 点击 **资源 > 流水线**。在 v2.3.0 之前的版本中，点击 **工作负载 > 流水线**。

1. 从要管理触发规则的代码库中，选择**省略号（...）>编辑配置**。

1. 找到您要管理触发规则的 **阶段**，单击该阶段的 **编辑** 图标。

1. 点击 **显示高级选项**。

1. 在 **触发规则** 部分中，配置规则以运行或跳过阶段。

   1. 点击 **添加规则**。

   1. 选择触发阶段的 **类型** 并输入一个值。

   | 类型 | 值                                                |
   | ---- | ------------------------------------------------- |
   | 分支 | 触发阶段的分支名称                                |
   | 事件 | 触发阶段的事件名称：`Push`，`Pull Request`，`Tag` |

1. 点击 **保存**。

## 通过 UI 设置步骤触发规则

1. 从 **全局** 视图，导航到要配置阶段触发规则的项目。

1. 点击 **资源 > 流水线**。在 v2.3.0 之前的版本中，点击 **工作负载 > 流水线**。

1. 从要管理触发规则的代码库中，选择**省略号（...）>编辑配置**。

1. 找到您要管理触发规则的 **步骤**，单击该步骤的 **编辑** 图标。

1. 点击 **显示高级选项**。

1. 在 **触发规则** 部分中，配置规则以运行或跳过阶段。

   1. 点击 **添加规则**。

   1. 选择触发阶段的 **类型** 并输入一个值。

   | 类型 | 值                                                |
   | ---- | ------------------------------------------------- |
   | 分支 | 触发步骤的分支名称                                |
   | 事件 | 触发步骤的事件名称：`Push`，`Pull Request`，`Tag` |

1. 点击 **保存**。

### 通过 YAML 设置触发规则

```yaml
# 示例
stages:
  - name: Build something
    # 阶段条件
    when:
      branch: master
      event: [push，pull_request]
    # 多个步骤同时运行
    steps:
      - runScriptConfig:
          image: busybox
          shellScript: date -R
        # 阶段条件
        when:
          branch: [master，dev]
          event: push
# 流水线的分支条件
branch:
  include: [master，feature/*]
  exclude: [dev]
```

## 环境变量

配置流水线时，某些[步骤类型](#步骤类型)允许您使用环境变量来配置步骤的脚本。

### 通过 UI 设置环境变量

1. 从 **全局** 视图，导航到要配置的流水线的项目。

1. 点击 **资源 > 流水线**。在 v2.3.0 之前的版本中，点击 **工作负载 > 流水线**。

1. 从要管理的流水线中，选择**省略号（...）>编辑配置**。

1. 找到您要管理的**步骤**，单击该步骤的 **编辑** 图标。

1. 点击 **显示高级选项**。

1. 单击 **添加变量**，然后在出现的字段中输入键和值。根据需要添加更多变量。

1. 将环境变量添加到脚本或文件中。

1. 点击 **保存**。

### 通过 YAML 设置环境变量

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

如果您需要在流水线脚本中使用对安全敏感的信息（例如密码），则可以使用 Kubernetes [密文](/docs/k8s-in-rancher/secrets/_index)传递它们。

### 先决条件

在与流水线相同的项目中或在运行流水线构建 Pod 的命名空间中显式创建密文。

> **注意:** 密文注入功能不能在 Pull Request 事件触发的流水线中使用。

### 通过 UI 配置密文

1. 从 **全局** 视图，导航到要配置的流水线的项目。

1. 点击 **资源 > 流水线**。在 v2.3.0 之前的版本中，点击 **工作负载 > 流水线**。

1. 从要管理的流水线中，选择**省略号（...）>编辑配置**。

1. 找到您要管理的**步骤**，单击该步骤的 **编辑** 图标。

1. 点击 **显示高级选项**。

1. 点击 **从密文中添加**。选择您要使用的密文文件。然后选择一个键。您也可以输入密钥的别名。

1. 点击 **保存**。

### 通过 YAML 配置密文

```yaml
# 示例
stages:
  - name: Build something
    steps:
      - runScriptConfig:
          image: busybox
          shellScript: echo ${ALIAS_ENV}
        # 项目密文中的环境变量
        envFrom:
          - sourceName: my-secret
            sourceKey: secret-key
            targetKey: ALIAS_ENV
```

## 流水线变量替换列表

为了方便起见，以下变量可用于流水线的配置脚本中。在流水线执行期间，这些变量将被替换为元数据。您可以通过 `$ {VAR_NAME}` 的形式引用它们.

| 变量名                    | 描述                                                                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CICD_GIT_REPO_NAME`      | 代码库名称                                                                                                                                                                                                         |
| `CICD_GIT_URL`            | 代码库 Git 地址                                                                                                                                                                                                    |
| `CICD_GIT_COMMIT`         | 触发流水线的 Git commit ID                                                                                                                                                                                         |
| `CICD_GIT_BRANCH`         | 触发流水线的 Git 分支                                                                                                                                                                                              |
| `CICD_GIT_REF`            | 触发流水线的 Git 详细信息                                                                                                                                                                                          |
| `CICD_GIT_TAG`            | 触发流水线的 Tag 名称。仅在由 tag 事件触发时可用。                                                                                                                                                                 |
| `CICD_EVENT`              | 触发流水线的的事件名称 (`push`，`pull_request` 或 `tag`)。                                                                                                                                                         |
| `CICD_PIPELINE_ID`        | 这个流水线在 Rancher 中的 ID                                                                                                                                                                                       |
| `CICD_EXECUTION_SEQUENCE` | 流水线的 Build Number                                                                                                                                                                                              |
| `CICD_EXECUTION_ID`       | 内容组成为`{CICD_PIPELINE_ID}-{CICD_EXECUTION_SEQUENCE}`。                                                                                                                                                         |
| `CICD_REGISTRY`           | 在发布镜像步骤中使用的镜像仓库地址。这个变量在`部署 YAML`步骤中的 Kubernetes YAML 文件中可用。                                                                                                                     |
| `CICD_IMAGE`              | 在发布镜像步骤中使用的镜像名称。这个变量在`部署 YAML`步骤中的 Kubernetes YAML 文件中可用。这个名称不包括镜像的标签。点击[这里](https://github.com/rancher/pipeline-example-go/blob/master/deployment.yaml)查看示例 |

## 项目级别流水线执行配置

配置了版本控制提供商 后，您可以配置一些项目级别的[流水线](/docs/k8s-in-rancher/pipelines/_index)相关的选项。

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**。

### 执行器配额

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**。

选择最大数量的流水线执行器。_执行器配额_ 决定了项目中可以同时运行多少个构建，如果触发的构建数量超过了执行器配额，构建会形成队列，执行器先执行一部分构建，执行完成后，再执行另一部分构建。执行器的默认配额是`2`，将这个配额的值修改为`0`或负数会取消配额限制。

### 执行器资源配额

_v2.2.0 或更新版本可用_

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**。

1. 配置 Jenkins Agent 容器的计算资源。

   触发流水线执行的时候，Rancher 会动态创建一个构建 Pod 运行您的 CI 任务。这个 Pod 由一个 Jenkins Agent 容器和多个流水线步骤容器构成。您可以管理 Pod 内每一个容器的[计算资源](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)。编辑**内存预留**、**内存限制**、**CPU 预留**、**CPU 限制**。

1. 单击**修改限制和预留**，完成修改。

### 通过 YAML 编辑流水线步骤容器的计算资源

您可以在`.rancher-pipeline.yml`文件中配置流水线步骤容器的计算资源。

在[步骤类型](/docs/k8s-in-rancher/pipelines/_index)中，你需要提供以下预留和限制：

- **CPU 预留**: 预留给流水线步骤容器的 CPU 配额。
- **CPU 限制**: 流水线步骤容器的能使用 CPU 的最大限额。
- **Memory 预留**: 预留给流水线步骤容器的内存配额。
- **Memory 限制**: 流水线步骤容器的能使用内存最大配额。

以下是一个通过 YAML 编辑流水线步骤容器计算资源的示例：

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
        memoryRequest: 100Mi
        memoryLimit: 1Gi
      - publishImageConfig:
          dockerfilePath: ./Dockerfile
          buildContext: .
          tag: repo/app:v1
        cpuRequest: 100m
        cpuLimit: 1
        memoryRequest: 100Mi
        memoryLimit: 1Gi
```

> **说明：** Rancher 配置了除`构建和发布镜像`和 `运行脚本`以外的其他流水线步骤的默认计算资源。您可以覆盖原有的资源配额。

### 自定义 CA 证书

_v2.2.0 或更新版本可用_

如果您需要配合自定义/内部 CA 根证书使用版本控制提供商，CA 根证书需要被添加到版本控制提供商的配置中，才可以保证流水线构建 Pod 成功运行。

1. 从全局页面导航到需要配置流水线的项目。

1. 从导航栏选择 **工具 > 流水线**。如果您使用的是 v2.2.0 以前的版本，请选择**资源 > 流水线**

1. 单击**编辑证书**。

1. 复制粘贴 CA 根证书，单击**保存 CA 证书**。

**结果：** 流水线和新 Pod 可以配合自签名证书使用。

## 配置流水线组件的持久存储

Docker 镜像仓库和 MinIO 工作负载默认使用临时存储，临时存储足以应对对大多数情况。如果您希望流水线内嵌的镜像仓库中的镜像和流水线日志在节点失败的情况下能被保存下来，您可以给镜像日志配置持久存储。下文提供了配置持久存储的操作指导。

有关为流水线设置持久化存储的详细信息，请参阅[此页面](/docs/k8s-in-rancher/pipelines/storage/_index)。

## rancher-pipeline.yml 示例

[本页](/docs/k8s-in-rancher/pipelines/example/_index)上有一个示例流水线配置文件。
