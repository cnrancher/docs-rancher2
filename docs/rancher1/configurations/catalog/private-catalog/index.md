---
title: 私有应用商店
---

# 私有应用商店

---

私有应用商店要遵循应用商店服务指定的格式才可以正常的在 Rancher 中显示出来。

## 模板文件夹

应用商店将会根据环境中的调度引擎来显示不同的应用商店模板。

### 基于不同调度引擎的模板

- _Cattle_ 调度引擎: 界面中的应用模板来自`templates`文件夹
- _[Swarm](/docs/rancher1/infrastructure/swarm/)_ 调度引擎: 界面中的应用模板来自`swarm-templates`文件夹
- _[Mesos](/docs/rancher1/infrastructure/mesos/)_ 调度引擎: 界面中的应用模板来自`mesos-templates`文件夹

## 基础设施服务模板

Rancher 的[基础设施服务](/docs/rancher1/rancher-service/)可以从[环境模板](/docs/rancher1/configurations/environments/)中启用, 这些模板来自于`infra-templates`文件夹。

这些服务从**应用商店**菜单中也可以看到, 您可以看到全部的基础设施服务包括那些和当前的编排调度引擎不兼容的服务. 我们建议从环境模板中启用基础设施服务，而不是直接从应用商店中启动。

## 目录结构

```bash
-- templates (Or any of templates folder)
  |-- cloudflare
  |   |-- 0
  |   |   |-- docker-compose.yml
  |   |   |-- rancher-compose.yml
  |   |-- 1
  |   |   |-- docker-compose.yml
  |   |   |-- rancher-compose.yml
  |   |-- catalogIcon-cloudflare.svg
  |   |-- config.yml
...
```

您需要创建一个`templates`文件夹作为根目录。`templates`文件夹将包含所有您想创建的应用的文件夹。我们建议为应用的文件夹起一个简单明了的名称。

在应用模板的文件夹中 (例如 `cloudflare`), 将包含该应用模板的各个版本所对应的文件夹。第一个版本为`0`，后续每个版本加 1。比如，第二个版本应该在 `1` 文件夹中。每增加一个新版本的文件夹，您就可以使用这个新版本的应用模版来升级您的应用了。另外，您也可直接更新`0`文件夹中的内容并重新部署应用。

> **注意:** 应用文件夹名称需要为一个单词，文件名中不能包含空格。针对名字比较长的应用请使用`-` 连接符。在`config.yml`中的 `name`您可以使用空格。

## 在 Rancher 应用商店中展示出的 Rancher Catalog 文件

在应用商店模板的文件夹中，如何展示应用商店模板详细内容取决于两个文件。

- 第一个文件为 `config.yml`，包含了应用模板的详细信息。

```bash
description: |
  # 应用商店模板描述
version: # 应用商店模板对应的版本
category: # 用于模板搜索时的目录
maintainer: # 该模板的维护者
license: # 许可类型
projectURL: # 和模板相关的URL
```

- 另外一个文件为该模板的 logo。该文件的前缀必须为 `catalogIcon-`。

对于每一个应用模板，将至少有以下三个部分组成: `config.yml`, `catalogIcon-entry.svg`, 以及 `0` 文件夹 - 包含该模板的第一个版本配置。

## Rancher 应用商店模板

`docker-compose.yml`以及`rancher-compose.yml`为在 Rancher 中使用[Rancher Compose](/docs/rancher1/infrastructure/cattle/adding-services/#使用-rancher-compose-添加服务)启动服务**必须**提供的两个文件. 该文件将被保存在版本文件夹中。 (如: `0`, `1`, 等等)。

`docker-compose.yml`为一个可以使用 `docker-compose up`来启动的文件。 该服务遵循 docker-compose 格式。

`rancher-compose.yml`将包含帮助您自定义应用模板的其他信息。在`catalog`部分中，为了应用模板可以被正常使用，有一些选项是必填的。

您也可以创建一个可选的 `README.md` , 可以为模板提供一些较长的描述以及如何使用他们。

**`rancher-compose.yml`**

```bash
version: '2'
catalog:
  version: # Version of the versioned template of the Catalog Entry
  description: # Description of the versioned template of the Catalog Entry
  minimum_rancher_version: # The minimum version of Rancher that supports the template, v1.0.1 and 1.0.1 are acceptable inputs
  maximum_rancher_version: # The maximum version of Rancher that supports the template, v1.0.1 and 1.0.1 are acceptable inputs
  upgrade_from: # The previous versions that this template can be upgraded from
  questions: #Used to request user input for configuration options
```

对于 `upgrade_from`, 有三种值可以使用。

1. 只允许从某一个版本升级: `"1.0.0"`
2. 可以从高于或低于某一个版本升级: `">=1.0.0"`, `"<=2.0.0"`
3. 定义一个[区间升级](https://github.com/blang/semver#ranges): `">1.0.0 <2.0.0 || >3.0.0"`

> **注意:** 如同例子中的配置，请确保您配置的版本号或版本范围带上双引号。

## `rancher-compose.yml`中的问题部分

`应用商店`中`questions` 部分允许用户更改一个服务的一些配置选项。 其`答案` 将在被服务启动之前被预配置在 `docker-compose.yml` 中.

每一个配置选项都在`rancher-compose.yml`的 `questions` 部分配置.

```bash
version: '2'
catalog:
  questions:
    - variable: # A single word that is used to pair the question and answer.
      label: # The "question" to be answered.
      description: | # The description of the question to show the user how to answer the question.
      default: # (Optional) A default value that will be pre-populated into the UI
      required: # (Optional) Whether or not an answer is required. By default, it's considered `false`.
      type: # How the questions are formatted and types of response expected
```

### 类型

`type` 控制了问题如何在 UI 中展现以及需要什么样的答案。

合法的格式有:

- `string` UI 中将显示文本框来获取答案，获取到的答案将被设置为字符串型格式。
- `int` UI 中将显示文本框来获取答案，获取到的答案将被设置为整型格式。 UI 会在服务启动前对输入进行校验。
- `boolean` UI 中将通过单选按钮获取答案，获取到的答案将被格式化为`true` 或者 `false`。 如果用户选择了单选按钮，答案将被格式化为 `true`。
- `password` UI 中将显示文本框来获取答案，获取到的答案将被设置为字符串型格式。
- `service` UI 中将展示一个下拉框，所有该环境的服务都会显示出来。
- `enum` UI 中将展示一个下拉框，`options`中的配置将会被展示出来。

```bash
version: '2'
catalog:
  questions:
    - variable:
      label:
      description: |
      type: enum
      options: # List of options if using type of `enum`
        - Option 1
        - Option 2
```

- `multiline` 多行文本框会被显示在 UI 中。

```bash
version: '2'
catalog:
  questions:
    - variable:
      label:
      description: |
      type: multiline
      default: |
        Each line
        would be shown
        on a separate
        line.
```

- `certificate` 该环境的所有可用证书都会显示出来。

```bash
version: '2'
catalog:
  questions:
    - variable:
      label:
      description: |
      type: certificate
```

## 基于 Yeoman 的应用目录生成器

这里有一个基于[Yeoman](http://yeoman.io/)的[开源项目](https://github.com/slashgear/generator-rancher-catalog), 可以被用于创建一个空的应用商店目录。
