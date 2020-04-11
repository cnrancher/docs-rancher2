---
title: 创建应用
---

_自 v2.3.0 起可用_

在 Chart 的 [questions.yml](https://github.com/rancher/integration-test-charts/blob/master/charts/chartmuseum/v1.6.0/questions.yml) 文件支持`rancher_min_version`和`rancher_max_version`字段，以指定 Chart 兼容的 Rancher 版本。

使用 Rancher UI 部署应用时，将仅显示对当前运行的 Rancher 版本有效的应用版本，从而禁止启动不满足 Rancher 版本要求的应用。如果在升级 Rancher 前已经部署了应用，但这个应用不支持新版本的 Rancher，在这种情况下升级 Rancher 不会影响这个已有应用。

## Charts 类型

Rancher 支持两种不同类型的 Chart：

- **Helm Chart**

  原生 Helm Charts 包括应用程序以及运行它所需的其他软件。部署原生 Helm Chart 时，您将需要了解学习每个 Chart 的参数，然后使用**应答**（它们是键值对的集合）来配置这些参数。

  Rancher 中的 Helm Stable 和 Helm Incubators 均为原生的 Helm Chart。您也可以添加其他的 Helm Charts（尽管我们建议使用 Rancher Chart）。

- **Rancher Chart**

  Rancher Chart 基本与原生 Helm Chart 一样。Rancher Chart 添加了两个额外的文件`app-readme.md`和`questions.yaml`来增强用户体验，但它们与原生 Helm Chart 的使用方式完全相同。在 [Rancher Chart 详解](#rancher-chart-详解)中了解有关它们的更多信息。

  Rancher Charts 的优点包括：

  - **增强的修订跟踪**

    虽然 Helm 支持版本化的部署，但 Rancher 添加了修订跟踪历史记录，以显示 Charts 的不同版本之间的更改。

  - **简化的应用启动流程**

    Rancher Chart 添加了简化的 Chart 说明和配置表单，以简化应用商店中应用的部署。Rancher 用户无需阅读整个 Helm Chart 变量的列表即可了解如何启动应用。

  - **应用资源管理**

    Rancher 将跟踪由特定应用创建的所有资源。用户可以轻松地在 UI 上进行故障排除，该页面列出了此应用的所有工作负载和其他相关对象。

## 应用商店的文件结构

下表为应用商店 Chart 的结构，展示了`charts/<APPLICATION>/<APP_VERSION>/`目录下的结构。在为自定义应用商店定制 Chart 时，此信息很有用。带有 **\*** 的文件代表 Rancher Chart 独有的文件，但这些文件不是必须的。

```bash
charts/<APPLICATION>/<APP_VERSION>/
| --charts /            # 包含依赖的 Chart 的应用商店。
| --templates/          # 包含应用商店的模板，当与 values.yml 结合使用时，将生成 Kubernetes YAML。
| --app-readme.md       # 文本为显示在 Rancher UI 的 Chart 标题中。*
| --Chart.yml           # 必需的 Helm Chart 信息文件。
| --questions.yml       # 用于生成在 Rancher UI 中显示的应答表单。它们将显示在配置选项中。*
| --README.md           # 可选：在 Rancher UI 中显示的 Helm 自述文件。该文本显示在“详细描述”中。
| --requirements.yml    # 可选：YAML 文件列出了 Chart 的依赖关系。
| --values.yml          # Chart 的默认配置值。
```

## Rancher Chart 详解

在创建自己的自定义应用商店之前，您应该对 Rancher Chart 与本地 Helm Chart 的区别有基本的了解。Rancher Chart 的应用商店结构与 Helm Chart 略有不同。Rancher Chart 包含了两个 Helm Chart 不包含的文件。

- `app-readme.md`

  在 Chart 的 UI 标题中提供描述性文本的文件。下图显示了 Rancher Chart（包括`app-readme.md`）和原生 Helm Chart（不包括`app-readme.md`）之间的差异。

   <figcaption>带有 “app-readme.md” 的 Rancher Chart(左)与没有“app-readme.md”的 Helm Chart(右)</figcaption>

  ![app-readme.md](/img/rancher/app-readme.png)

- `questions.yml`

  包含 Chart 问题的文件。这些问题简化了 Chart 的部署。没有它，您必须使用键值对配置部署。下图显示了 Rancher Chart（包括`questions.yml`）和原生 Helm Chart（不包括`questions.yml`）之间的差异。

   <figcaption>带有 “questions.yml” 的 Rancher Chart(左)与没有“questions.yml”的 Helm Chart(右)</figcaption>

  ![questions.yml](/img/rancher/questions.png)

## Questions.yml 详解

在`questions.yml`中，大多数内容都围绕着用户关心的应用配置的问题，但是也可以在此文件中设置一些其他字段。

### 最小/最大 Rancher 版本

_自 v2.3.0 起可用_

对于每个 Chart，您可以添加最小和/或最大的 Rancher 版本，该版本确定是否可以从 Rancher 部署此 Chart。

> **注意：** 即使 Rancher 发行版的前缀为`v`，使用该选项时发行版的前缀也为**空**。

```
rancher_min_version: 2.3.0
rancher_max_version: 2.3.99
```

### 问题变量参考

以下选项可在`questions.yml`文件中嵌套的`questions:`部分中使用。

| 变量                | 类型          | 必填 | 描述                                                                                                                                             |
| ------------------- | ------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| variable            | string        | 是   | 定义`values.yml`文件中指定的变量名。如果是嵌套对象，可以使用`foo.bar`这种形式。                                                                  |
| label               | string        | 是   | 指定变量的标题显示内容。                                                                                                                         |
| description         | string        | 否   | 指定变量的描述显示内容。                                                                                                                         |
| type                | string        | 否   | 变量类型，如果未指定，则默认为`string`(当前支持的类型为 string，multiline，boolean，int，enum，password，storageclass，hostname，pvc 和 secret。 |
| required            | bool          | 否   | 定义变量是否为必填(true \| false)                                                                                                                |
| default             | string        | 否   | 指定默认值。                                                                                                                                     |
| group               | string        | 否   | 根据输入值对变量进行分组。                                                                                                                       |
| min_length          | int           | 否   | 最小字符长度。                                                                                                                                   |
| max_length          | int           | 否   | 最大字符长度。                                                                                                                                   |
| min                 | int           | 否   | 最小整数值。                                                                                                                                     |
| max                 | int           | 否   | 最大整数值。                                                                                                                                     |
| options             | []string      | 否   | 当变量类型为`enum`时指定选项，例如：options:<br /> - "ClusterIP" <br /> - "NodePort" <br /> - "LoadBalancer"                                     |
| valid_chars         | string        | 否   | 用于对输入字符进行验证的正则表达式。                                                                                                             |
| invalid_chars       | string        | 否   | 用于对无效输入字符验证的正则表达式。                                                                                                             |
| subquestions        | []subquestion | 否   | 添加一个子问题数组。                                                                                                                             |
| show_if             | string        | 否   | 如果条件变量为 true，则显示当前变量。例如`show_if: "serviceType=Nodeport"`                                                                       |
| show_subquestion_if | string        | 否   | 如果条件变量为 true，或等于某个选项，则显示它的子问题。例如`show_subquestion_if: "true"`                                                         |

> **注意：** `subquestions[]` 不能包含 subquestions 或 show_subquestions_if 键，但是支持上表中的所有其他键。

## 创建应用的示例

您可以把 Helm Chart 或 Rancher Chart 添加到应用商店里，但是我们建议使用 Rancher Chart，因为它们的用户体验更好。

> **注意：** 有关开发 Chart 的完整步骤，请参阅 Helm Chart [开发人员参考](https://helm.sh/docs/chart_template_guide/)。

1. 在您应用商店的 GitHub 仓库中，创建应用商店结构，该应用商店结构请参考[应用商店的文件结构](#应用商店的文件结构)中列出的结构。`app-readme.md`和`questions.yml`是可选的。

   > **提示：**
   >
   > - 要创建自定义 Chart，请从 [Rancher Library](https://github.com/rancher/charts) 或 [Helm Stable](https://github.com/kubernetes/charts/tree/master/stable) 复制一个 Chart。
   > - 有关开发 Chart 的完整介绍，请参见上游 Helm Chart [开发人员参考](https://docs.helm.sh/developing_charts/)。

2. **推荐：** 创建一个`app-readme.md`文件。

   使用此文件可为 Rancher UI 中的 chart 标题创建自定义文本。您可以使用此文本来通知用户该 chart 是针对您的环境定制的，或者提供有关如何使用它的特殊说明。

   **例如** ：

   ```
   $ cat ./app-readme.md

   # Wordpress ROCKS!
   ```

3. **推荐：** 添加一个`questions.yml`文件。

   该文件为用户创建一个表单，供用户在部署自定义 Chart 时指定部署参数。如果没有此文件，则用户**必须**使用键值对手动指定参数，这对用户不友好。

   下面的示例创建一个表单，提示用户输入持久卷大小和存储类。

   有关创建`questions.yml`文件时可以使用的变量列表，请参见[问题变量参考](#问题变量参考)

   ```yaml
   categories:
     - Blog
     - CMS
   questions:
     - variable: persistence.enabled
       default: 'false'
       description: 'Enable persistent volume for WordPress'
       type: boolean
       required: true
       label: WordPress Persistent Volume Enabled
       show_subquestion_if: true
       group: 'WordPress Settings'
       subquestions:
         - variable: persistence.size
           default: '10Gi'
           description: 'WordPress Persistent Volume Size'
           type: string
           label: WordPress Volume Size
         - variable: persistence.storageClass
           default: ''
           description: 'If undefined or null, uses the default StorageClass. Default to null'
           type: storageclass
           label: Default StorageClass for WordPress
   ```

4. 将自定义的 Chart 推送到 GitHub 仓库中。

**结果：** 您的自定义 Chart 已添加到仓库中。您的 Rancher Server 将在几分钟内同步 Chart。您可以在 Rancher UI 上手动刷新该应用商店，强制刷新。
