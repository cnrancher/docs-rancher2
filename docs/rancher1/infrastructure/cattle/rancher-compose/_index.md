---
title: Rancher Compose
---

Rancher Compose 是一个多主机版本的 Docker Compose。它运行于 Rancher UI 里属于一个[环境](/docs/rancher1/configurations/environments/_index)多个[主机](/docs/rancher1/infrastructure/hosts/_index)的[应用](/docs/rancher1/infrastructure/cattle/stacks/_index)里。Rancher Compose 启动的容器会被部署在满足[调度规则](/docs/rancher1/infrastructure/cattle/scheduling/_index) 的同一环境中的任意  主机里。如果没有  设置调度规则，那么这些服务容器会被调度至最少容器运行的主机上运行。这些被 Rancher Compose 启动的容器的运行效果是和在 UI 上启动的效果是一致的.

Rancher Compose 工具的工作方式是跟 Docker Compose 的工作方式是相似的，并且兼容版本 V1 和 V2 的 `docker-compose.yml` 文件。为了启用 Rancher 的特性，您需要额外一份`rancher-compose.yml`文件，这份文件扩展并覆盖了`docker-compose.yml`文件。例如，服务缩放和健康检查这些功能就会在`rancher-compose.yml`中体现。

在阅读这份 Rancher Compose 文档之前，我们希望您已经懂得 `Docker Compose` 了。如果您还不认识 Docker Compose，请先阅读 [Docker Compose](https://docs.docker.com/compose/)文档。

###  安装

Rancher Compose 的可执行文件下载  链接可以在 UI 的右下角中找到，我们为您提供了 Windows, Mac 以及 Linux 版本  供您使用。

另外，您也可以到[Rancher Compose 的发布  页](https://github.com/rancher/rancher-compose/releases)找到可执行二进制文件的下载链接。

### 为 Rancher Compose 设置 Rancher Server

为了让 Rancher Compose 可以在 Rancher 实例中启动服务，您需要设置一些环境变量或者在 Rancher Compose 命令中送一些参数。必要的  环境变量分别是 `RANCHER_URL`, `RANCHER_ACCESS_KEY`, 以及 `RANCHER_SECRET_KEY`。 access key 和 secret key 是一个环境 API Keys, 可以在**API** -> **高级选项** 菜单  中创建得到。

> **注意:** 默认  情况下，在**API** 菜单下  创建的是账号 API Keys, 所以您需要在**高级选项**中创建环境 API Keys.

```
# Set the url that Rancher is on
$ export RANCHER_URL=http://server_ip:8080/
# Set the access key, i.e. username
$ export RANCHER_ACCESS_KEY=<username_of_environment_api_key>
# Set the secret key, i.e. password
$ export RANCHER_SECRET_KEY=<password_of_environment_api_key>
```

如果您不想  设置环境变量，那么您需要在 Rancher Compose  命令中手动  送入这些变量:

```
$ rancher-compose --url http://server_ip:8080 --access-key <username_of_environment_api_key> --secret-key <password_of_environment_api_key> up
```

现在您可以使用 Rancher Compose 配合`docker-compose.yml`文件来[启动服务](/docs/rancher1/infrastructure/cattle/adding-services/_index#使用-rancher-compose-添加服务)了。这些服务会在环境 API keys 对应的[环境](/docs/rancher1/configurations/environments/_index)中启动  服务的。

就像 Docker Compose，您可以在  命令后面加上服务名称来选择  启动全部或者仅启动指定某些`docker-compose.yml`中服务

```bash
rancher-compose up servicename1 servicename2
rancher-compose stop servicename2
```

### 调试 Rancher Compose

您可以设置环境变量`RANCHER_CLIENT_DEBUG`的值为`true`来让 Rancher Compose 输出  所有被执行的 CLI 命令。

```
# Print verbose messages for all CLI calls
$ export RANCHER_CLIENT_DEBUG=true
```

如果您不需要  所有的 CLI 命令信息，您可以在命令后上`--debug`来指定  输出哪些可视化 CLI 命令。

```
$ rancher-compose --debug up -d
```

### 删除服务或容器

在缺省情况下，Rancher Compose 不会删除任何服务或者容器。这意味着如果您在一行命令里执行两次 `up`  命令，那么第二个 `up` 命令不会起任何作用。这是因为第一个 `up` 命令会  创建出  所有东西后让他们自己  运行。即使您没有在 `up` 中使用 `-d` 参数，Rancher Compose 也不会删除您任何服务。为了删除服务，您  只能使用 `rm` 命令。

### 构建

构建 docker 镜像可以有两种方法。第一种方法是通过给 build 命令一个 git 或者 http URL 参数来利用远程资源构建，另一种方法则是让 build 利用本地目录，那么会上传构建上下文到 S3 并在需要时在各个节点执行

为了可以基于 S3 来创建，您需要[设置 AWS 认证](https://github.com/aws/aws-sdk-go/#configuring-credentials)。
