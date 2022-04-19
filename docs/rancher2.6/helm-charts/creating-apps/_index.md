---
title: 创建应用
weight: 400
---

Rancher 的应用市场基于 Helm 仓库和 Helm Chart。你可以添加基于 HTTP 的标准 Helm 仓库以及任何包含 Chart 的 Git 仓库。

> 有关开发 Chart 的完整演示，请参阅 Helm 官方文档中的 [Chart 模板开发者指南](https://helm.sh/docs/chart_template_guide/)。

- [Chart 类型](#chart-types)
   - [Helm 类型](#helm-charts)
   - [Rancher Chart](#rancher-charts)
- [Chart 目录结构](#chart-directory-structure)
- [Rancher Chart 的附加文件](#additional-files-for-rancher-charts)
   - [questions.yml](#questions-yml)
   - [最低/最高 Rancher 版本](#min-max-rancher-versions)
   - [问题变量参考](#question-variable-reference)
- [教程：自定义 Chart 创建示例](#tutorial-example-custom-chart-creation)

## Chart 类型

Rancher 支持两种不同类型的 Chart，分别是 Helm Chart 和 Rancher Chart。

### Helm Chart

原生 Helm Chart 包括一个应用以及运行它所需的软件。部署原生 Helm Chart 时，你可以在 YAML 编辑器中提供 Chart 的参数值。

### Rancher Chart

Rancher Chart 是原生 helm Chart，包含两个可增强用户体验的文件 `app-readme.md` 和 `questions.yaml`。在 [Rancher Chart 的附加文件](#additional-files-for-rancher-charts)中了解更多信息。

Rancher Chart 添加了简化的 Chart 描述和配置表单，使应用部署变得容易。Rancher 用户无需通读整个 Helm 变量列表即可了解如何启动应用。

## Chart 目录结构

你可以在基于 HTTP 的标准 Helm 仓库中提供 Helm Chart。有关更多信息，请参阅 Helm 官方文档中的 [Chart 仓库指南](https://helm.sh/docs/topics/chart_repository)。

或者，你可以在 Git 仓库中组织 Chart 并将其直接添加到应用市场。

下表演示了 Git 仓库的目录结构。`charts` 目录是仓库基础下的顶层目录。将仓库添加到 Rancher 将公开其中包含的所有 Chart。`questions.yaml`、`README.md` 和 `requirements.yml` 文件是针对于 Rancher Chart 的，但对于自定义 Chart 是可选的。

```
<Repository-Base>/
 │
 ├── charts/
 │   ├── <Application Name>/	  # 这个目录名称将作为 Chart 名称出现在 Rancher UI 中。
 │   │   ├── <App Version>/	  # 这个级别的每个目录提供了不同的应用版本，可以在 Rancher UI 的 Chart 中选择。
 │   │   │   ├── Chart.yaml	  # 必需的 Helm Chart 信息文件。
 │   │   │   ├── questions.yaml	  # 在 Rancher UI 中显示的表单问题。问题显示在配置选项中。*
 │   │   │   ├── README.md         # 可选：在 Rancher UI 中显示的 Helm 自述文件。此文本显示在详细说明中。
 │   │   │   ├── requirements.yml  # 可选：列出 Chart 的依赖项的 YAML 文件。
 │   │   │   ├── values.yml        # Chart 的默认配置值。
 │   │   │   ├── templates/        # 包含模板的目录，与 values.yml 一起能生成 Kubernetes YAML。
```

## Rancher Chart 的附加文件

在创建你的自定义目录之前，你需要大致了解 Rancher chart 与原生 Helm chart 的区别。Rancher Chart 的目录结构与 Helm Chart 略有不同。Rancher Chart 包含两个 Helm Chart 没有的文件：

- `app-readme.md`

   在 Chart 的 UI 标头中提供描述性文本的文件。

- `questions.yml`

   包含表单问题的文件。这些表单问题简化了 Chart 的部署。没有它，你必须使用更复杂的 YAML 配置来配置部署。下图显示了 Rancher Chart（包含 `questions.yml`）和原生 Helm Chart（不包含）之间的区别。


<figcaption>带有 <code>questions.yml</code> 的 Rancher Chart（上）与 Helm Chart（下）</figcaption>

   ![questions.yml]({{<baseurl>}}/img/rancher/rancher-app-2.6.png)
   ![values.yaml]({{<baseurl>}}/img/rancher/helm-app-2.6.png)


### Chart.yaml 注释

Rancher 支持你添加到 `Chart.yaml` 文件的其他注释。这些注释允许你定义应用依赖项或配置其他 UI 默认值：

| 注解 | 描述 | 示例 |
| --------------------------------- | ----------- | ------- |
| catalog.cattle.io/auto-install | 如果设置，将在安装此 Chart 之前先安装指定 Chart 的指定版本。 | other-chart-name=1.0.0 |
| catalog.cattle.io/display-name | 要在应用市场中显示的名称，而不是 Chart 本身的名称。 | Chart 的显示名称 |
| catalog.cattle.io/namespace | 用于部署 Chart 的固定命名空间。如果设置，则用户无法更改。 | fixed-namespace |
| catalog.cattle.io/release-name | Helm 安装的固定版本名称。如果设置，则用户无法更改。 | fixed-release-name |
| catalog.cattle.io/requests-cpu | 应该在集群中保留的 CPU 总量。如果可用 CPU 资源少于该值，将显示警告。 | 2000m |
| catalog.cattle.io/requests-memory | 应该在集群中保留的内存总量。如果可用内存资源少于该值，将显示警告。 | 2Gi |
| catalog.cattle.io/os | 限制可以安装此 Chart 的操作系统。可用值：`linux`、`windows`。默认：无限制 | linux |

### questions.yml

`questions.yml` 中大部分是向最终用户提出的问题，但也有一部分可以在此文件中设置字段。

### 最低/最高 Rancher 版本

你可以为每个 Chart 添加最低和/或最高的 Rancher 版本，这决定了该 Chart 是否可以从 Rancher 部署。

> **注意**：Rancher 版本带有 `v` 前缀，但是使用此选项时请*不要*包括前缀。

```
rancher_min_version: 2.3.0
rancher_max_version: 2.3.99
```

### 问题变量参考

此参考包含可以嵌套在 `questions:` 下的 `questions.yml` 中的变量：

| 变量 | 类型 | 必填 | 描述 |
| ------------- | ------------- | --- |------------- |
| variable | string | true | 定义 `values.yml` 文件中指定的变量名，嵌套对象使用 `foo.bar`。 |
| label | string | true | 定义 UI 标签。 |
| description | string | false | 指定变量的描述。 |
| type | string | false | 如果未指定，则默认为 `string`（支持的类型为 string、multiline、boolean、int、enum、password、storageclass、hostname、pvc 和 secret）。 |
| required | bool | false | 定义变量是否是必须的（true \| false）。 |
| default | string | false | 指定默认值。 |
| group | string | false | 按输入值对问题进行分组。 |
| min_length | int | false | 最小字符长度。 |
| max_length | int | false | 最大字符长度。 |
| min | int | false | 最小整数长度。 |
| max | int | false | 最大整数长度。 |
| options | []string | false | 为 `enum` 类型的变量指定选项，例如：options:<br> - "ClusterIP" <br> - "NodePort" <br> - "LoadBalancer" |
| valid_chars | string | false | 输入字符验证的正则表达式。 |
| invalid_chars | string | false | 无效输入字符验证的正则表达式。 |
| subquestions | []subquestion | false | 添加一组子问题。 |
| show_if | string | false | 如果条件变量为 true，则显示当前变量。例如 `show_if: "serviceType=Nodeport"` |
| show\_subquestion_if | string | false | 如果为 true 或等于某个选项，则显示子问题。例如 `show_subquestion_if: "true"` |

> **注意**：`subquestions[]` 不能包含 `subquestions` 或 `show_subquestions_if` 键，但支持上表中的所有其他键。
