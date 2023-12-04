---
title: 离线安装
---

# 离线安装

不可对外访问的网络环境(内网)也是可以启动 Rancher 服务的。在这种拓扑下，可以通过内网提供的 IP 或者域名来访问 Rancher 的操作界面(UI 界面)。另外，也可以用 HTTP 代理或者私有镜像库来配置 Rancher。

需要注意的是，在内网中启动一个 Rancher 服务会导致一些特性无效，比如:

- 使用操作界面来启动云公有云提供商(例如 AWS，DigitalOcean，阿里云，vSphere 等)提供的主机。只能添加[自定义主机](/docs/rancher1/infrastructure/hosts/custom/_index) 来初始化 Rancher；
- Github 授权认证。

## 前提条件

为了支持这种拓扑，有些 [前提条件](/docs/rancher1/installation/installing-server/_index#安装需求) 是必须要满足的。

## Rancher Server 标签

Rancher Server 当前版本中有 2 个不同的标签。对于每一个主要的 release 标签，我们都会提供对应版本的文档。

- `rancher/server:latest` 此标签是我们的最新一次开发的构建版本。这些构建已经被我们的 CI 框架自动验证测试。但这些 release 并不代表可以在生产环境部署。
- `rancher/server:stable` 此标签是我们最新一个稳定的 release 构建。这个标签代表我们推荐在生产环境中使用的版本。

请不要使用任何带有 `rc{n}` 前缀的 release。这些构建都是 Rancher 团队的测试构建。

## 使用私有镜像仓库

假设内网已经存在私有镜像仓库，或类似的支持分布式 Docker 镜像管理的服务。如果还没有，可以浏览 Docker 官网提供的 [私有镜像仓库](https://docs.docker.com/registry/) 文档来搭建，再此不再累述.

### 将镜像上传到镜像仓库仓库

在安装或升级 Rancher 服务之前，**必须保证**对应版本号的所有镜像(例如: `rancher/server`，`rancher/agent`，以及任何 [基础服务](/docs/rancher1/rancher-service/_index) 涉及的镜像) 都必须上传到私有仓库或者类似的服务中。如果这些镜像不存在或者版本信息不对，Rancher 服务将无法正常完成安装或升级。

对于每次发布的 Rancher 服务(`rancher/server`)和对应的 Rancher 代理(`rancher/agent`)的镜像版本信息，都在发布记录中摘记。而针对其他基础服务用到的镜像版本信息，就需要查看 [官方模板](https://github.com/rancher/rancher-catalog) 的`infra-templates`目录和 [社区模板](https://github.com/rancher/community-catalog) 来获取所关联的镜像。如果用到 [应用商店](/docs/rancher1/configurations/catalog/_index)，还需要关注具体应用使用的 docker-compose.yml 来获取镜像版本信息。

#### 使用命令行将镜像上传到镜像仓库仓库

在这个例子中，假设某台机器可以同时访问私有镜像仓库和 DockerHub。首先从 DockerHub 中拉取 `rancher/server` 和 `rancher/agent` 的镜像，然后对拉取下来的镜像做标签私仓化处理，最后再推送到私有镜像仓库。一种推荐的做法是，私有镜像仓库的镜像的版本信息对照于 DockerHub 的版本信息。

```bash
# rancher/server
docker pull rancher/server:v1.6.0
docker tag rancher/server:v1.6.0 localhost:5000/<NAME_OF_LOCAL_RANCHER_SERVER_IMAGE>:v1.6.0
docker push localhost:5000/<NAME_OF_LOCAL_RANCHER_SERVER_IMAGE>:v1.6.0

# rancher/agent
docker pull rancher/agent:v1.1.3
docker tag rancher/agent:v1.1.3 localhost:5000/<NAME_OF_LOCAL_RANCHER_AGENT_IMAGE>:v1.1.3
docker push localhost:5000/<NAME_OF_LOCAL_RANCHER_AGENT_IMAGE>:v1.1.3
```

> **注意:** 对于任何基础服务镜像, 可以按照以下的步骤来获取。

### 通过私有镜像仓库启动 Rancher 服务

在主机上启动 Rancher Server 并且使用指定的 Rancher Agent 镜像。我们建议使用特定的版本号来代替`latest`，这样可以保证您使用了正确的版本。

例如:

```bash
sudo docker run -d --restart=unless-stopped -p 8080:8080 \
    -e CATTLE_BOOTSTRAP_REQUIRED_IMAGE=<Private_Registry_Domain>:5000/<NAME_OF_LOCAL_RANCHER_AGENT_IMAGE>:v1.1.3 \
    <Private_Registry_Domain>:5000/<NAME_OF_LOCAL_RANCHER_SERVER_IMAGE>:v1.6.0
```

### Rancher 操作界面

默认情况下，操作界面访问(含接口 API)是通过`8080`端口暴露的，可以用以下这个地址访问:`http://<SERVER_IP>:8080`。

### 添加主机

在操作界面，单击 **添加主机**后，如果是第一次添加主机会进入到**主机注册地址**配置界面。单击**保存**后即可添加主机。

由于不能使用公有云提供商的主机服务，所以请单击 **自定义**图标来增加主机。

操作界面上生成的主机注册命令将会使用私有镜像仓库中的 Rancher Agent 镜像。

#### 一个由操作界面生成的主机注册命令例子

```bash
sudo docker run -d --privileged -v /var/run/docker.sock:/var/run/docker.sock <Private_Registry_Domain>:5000/<NAME_OF_LOCAL_RANCHER_AGENT_IMAGE>:v1.1.3 http://<SERVER_IP>:8080/v1/scripts/<security_credentials>
```

#### 为基础设施服务配置默认仓库

默认在 Rancher 中, 所有 [基础服务](/docs/rancher1/rancher-service/_index) 都默认从 DockerHub 上拉取镜像。可以通过 **API settings(接口设置)**改变默认的的仓库，比如改成私有的镜像仓库。

- **添加一个私有镜像仓库:** 在 **基础架构** 中选择 **镜像库**，添加可以为基础设施服务提供镜像的仓库服务。

- **更新默认的仓库:** 在 **系统管理** -> **系统设置** -> **高级设置**里，单击 **我确认已经知道修改高级设置可能导致问题**。找到 **registry.default** 的设置项并单击修改按钮，修改为私有镜像仓库的地址，单击 **保存**。一旦 `registry.default` 的值被更新了，基础设施服务将从这个地址上获取镜像。

- **创建一个新环境:** 当默认的镜像仓库地址被改变后，需要重新创建环境以便于基础设施服务可以使用这个新的镜像仓库地址。原来旧的环境中，基础设施服务仍然指向 DockerHub。

> **注意:** 原来旧的环境中的基础设施服务，仍然使用原来默认的镜像仓库地址(例如，在出厂设置中就是 DockerHub，那就一直都是 DockerHub)。只有把应用删除，然后重新部署才能使用新的镜像仓库地址。可以通过 **应用商店** 中的 **官方认证**进行部署。

## 使用 HTTP 代理

提醒，在启动了 Rancher 服务以后，浏览器只要能访问内网就可以访问 Rancher UI 了。

### 通过 HTTP 代理来配置 Docker

可以通过修改 Rancher Server 和 Rancher Agent 所在的 Docker daemon 的配置文件`/etc/default/docker`，使其指向对应的 HTTP 代理地址，重启 Docker daemon 之后，即可启用 HTTP 代理。

```bash
sudo vi /etc/default/docker
```

打开配置文件后，修改或增加 `export http_proxy="http://${YOUR_PESONAL_REGISTYR_ADDRESS}/"`。然后保存它并重启 Docker deamon。不同的操作系统重启 Docker deamon(也就是重启 Docker )的方法是不一样的，请自行了解，不再累述。

> **注意:** 如果 Docker 是通过 systemd 来运行的，那么可以参考[这篇文章](https://docs.docker.com/articles/systemd/#http-proxy)来了解更多。

### 启动 Rancher Server

使用 HTTP 代理的时候，Rancher Server 不需要使用任何环境变量即可启动。所以，启动操作就和没有使用代理服务是一样的，指令如下:

```bash
sudo docker run -d --restart=unless-stopped -p 8080:8080 rancher/server
```

### Rancher 操作界面

默认情况下，操作界面访问(含接口 API)是通过`8080`端口暴露的，可以用以下这个地址访问:`http://<SERVER_IP>:8080`。

### 添加主机

在操作界面，单击 **添加主机**后，如果是第一次添加主机会进入到**主机注册地址**配置界面。单击**保存**后即可添加主机。由于不能使用公有云提供商的主机服务，所以请单击 **自定义**图标来增加主机。操作界面上生成的主机注册命令可以用在任何配置了 HTTP 代理的 Docker 的主机上。
