---
title: 环境插值
---

在使用 Rancher Compose 时，`docker-compose.yml` 和 `rancher-compose.yml` 文件中可以使用运行 Rancher Compose 的机器中的环境变量。
这个特性只在 Rancher Compose 命令中有效，在 Rancher UI 中是没有这个特性的。

### 怎么使用

在 `docker-compose.yml` 和 `rancher-compose.yml` 文件中，您可以引用您机器中的环境变量。如果没有该环境变量，它的值会被替换为空字符串，请注意的是 Rancher Compose 不会自动去除 `:` 两侧的空字符来适配相近的镜像。例如 `<imagename>:` 是一个非法的镜像名称，不能部署出容器。它需要用户自己来保证环境变量在该机器上是存在并有效的。

#### 例子

在我们运行 Rancher Compose 的机器上有一个这样的环境变量，`IMAGE_TAG=14.04` 。

```
# Image tag is set as environment variable
$ env | grep IMAGE
IMAGE_TAG=14.04
# Run Rancher Compose
$ rancher-compose up
```

**样例文件 `docker-compose.yml`**

```
version: '2'
services:
  ubuntu:
    tty: true
    image: ubuntu:$IMAGE_TAG
    stdin_open: true
```

在 Rancher 里，一个 `ubuntu` 服务会使用镜像 `ubuntu:14.04` 部署。

### 环境插值格式

Rancher Compose 支持和 Docker Compose 一样的格式。

```
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
