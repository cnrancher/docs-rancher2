---
title: 变量替换
---

使用`rancher up`时，可以在`docker-compose.yml`和`rancher-compose.yml`文件中使用运行`rancher`命令的机器中的环境变量。 这仅仅在`rancher`命令中支持，在 Rancher UI 中不支持。

## 如何使用

通过使用`docker-compose.yml`和`rancher-compose.yml`文件，您可以引用机器上的环境变量。 如果机器上没有环境变量，它将用空白字符串替换。 `Rancher`将会提示一个警告，指出哪些环境变量没有设置。 如果使用环境变量作为镜像标签时，请注意，`rancher`不会从镜像中自动删除`:`来获取 latest 镜像。 因为镜像名，比如`<镜像名>:`是一个无效的镜像名，所以不会部署成功。用户需要确定机器中所有的环境变量的有效性。

### 例子

在我们运行`rancher`的机器上，我们有一个环境变量`IMAGE_TAG = 14.04`。

```bash
# Image tag is set as environment variable
$ env | grep IMAGE
IMAGE_TAG=14.04
# Run rancher
$ rancher up
```

**例子: `docker-compose.yml`**

```yaml
version: "2"
services:
  ubuntu:
    tty: true
    image: ubuntu:$IMAGE_TAG
    stdin_open: true
```

在 Rancher 中，一个`ubuntu`服务将使用`ubuntu:14.04`镜像来部署。

## 变量替换格式

`Rancher`支持与'docker-compose'相同的格式。

```yaml
version: '2'
services:
  web:
    # unbracketed name
    image: "$IMAGE"

    # bracketed name
    command: "${COMMAND}"

    # array element
    ports:
    - "${HOST_PORT}:8000"

    # dictionary item value
    labels:
      mylabel: "${LABEL_VALUE}"

    # unset value - this will expand to "host-"

    # escaped interpolation - this will expand to "${ESCAPED}"
    command: "$${ESCAPED}"
```

## 模板

在`docker-compose.yml`里面，Rancher 能够支持使用[Go 模板系统](https://golang.org/pkg/text/template/)，这样我们可以在`docker-compose.yml`里面使用逻辑条件语句。模板可以与 Rancher CLI 一起使用，也可以与[应用商店](/docs/rancher1/configurations/catalog/_index)组合使用，这样可以让您配置您的应用商店模板，也可以让您根据答案来改变您的模板文件。

> **注意:**目前我们只支持对`string`的比较。

## 例子

如果您希望能够生成一个在内部暴露端口或者在外部暴露端口的服务，那么您可以设置逻辑条件来实现这样的功能。 在这个例子中，如果`public`变量设置为`ture`，那么`ports`下面的`8000`端口将对外开放。 否则，这些端口将在`expose`下开放。在我们的示例中，默认值为 true。

`docker-compose.yml`

```yaml
::: v-pre

version: '2'
services:
  web:
    image: nginx
    {{- if eq .Values.PUBLIC "true" }}
    ports:
    - 8000
    {{- else }}
    expose:
    - 8000
    {{- end }}
:::

```

`rancher-compose.yml`

```bash
version: '2'
catalog:
  version: v0.0.1
  questions:
  - variable: PUBLIC
    label: Publish Ports?
    required: true
    default: true
    type: boolean
```

`config.yml`

```bash
version: v0.0.1
```

## 应用栈名称替换

从 Rancher v1.6.6 开始，我们支持在`docker-compose.yml`文件中替换
::: v-pre
`{{ .Stack.Name }}`
:::

。这样可以在 compose 文件中使用应用栈名称。

Docker Compose 文件可以用于创建新的应用栈，可以通过 Rancher 命令行或 UI 来创建。 如下面中的例子，您可以创建一个基于应用栈名称的标签。

### 示例 `docker-compose.yml`

```yaml
version: "2"
services:
  web:
    image: nginx
    labels:
```

如果您通过 Rancher 命令行来创建应用，例如`rancher up -s myawesomestack -f docker-compose.yml`，那么这个应用将会创建一个带有标签`stack-name=myawesomestack`的服务。

> **注意:** 替换只是发生在应用栈创建时，之后对应用名称的修改无法触发替换。

#### 双括号使用

随着 Rancher 引入了模板系统，双括号 ::: v-pre (`{{` or `}}`) ::: 将被视为模板的一部分。如果您不想将这些字符转换为模板，您可以在包含字符的 compose 文件的顶部添加上`＃notemplating`。

```yaml
# notemplating

version: '2'
services:
  web:
    image: nginx
    labels:
    ::: v-pre
      key: "{{`{{ value }}`}}"
    :::
```
