---
title: 快速入门
---

在本节中，我们将进行简单快速的 Rancher 安装，即在一台 Linux 机器上安装 Rancher，并使其能够完成所有 Rancher 必要功能。

## 准备 Linux 主机

先安装一个 64 位的 Ubuntu 16.04 Linux 主机，其内核必须高于 3.10。您可以使用笔记本、虚拟机或物理服务器。请确保该 Linux 主机内存不低于*1GB*。在该主机上安装 [支持的 Docker 版本](/docs/rancher1/infrastructure/hosts/_index#docker版本适用对比)。

在主机上安装 Docker 的方法请参照[Docker](https://docs.docker.com/engine/installation/linux/ubuntulinux/_index)网站的安装说明。

> **注意:** 目前 Rancher 尚不支持 Docker for Windows 以及 Docker for Mac。

## Rancher Server 标签

Rancher Server 当前版本中有 2 个不同的标签。对于每一个主要的 release 标签，我们都会提供对应版本的文档。

- `rancher/server:latest` 此标签是我们的最新一次开发的构建版本。这些构建已经被我们的 CI 框架自动验证测试。但这些 release 并不代表可以在生产环境部署。
- `rancher/server:stable` 此标签是我们最新一个稳定的 release 构建。这个标签代表我们推荐在生产环境中使用的版本。

请不要使用任何带有 `rc{n}` 前缀的 release。这些构建都是 Rancher 团队的测试构建。

## 启动 Rancher Server

您只需要一条命令就可以启动 Rancher Server。当 Rancher Server 容器启动以后，我们将能查看到相关的日志。

```bash
$ sudo docker run -d --restart=unless-stopped -p 8080:8080 rancher/server:stable
# Tail the logs to show Rancher
$ sudo docker logs -f <CONTAINER_ID>
```

启动 Rancher Server 只需要几分钟时间。当日志中显示 `.... Startup Succeeded, Listening on port...`的时候，Rancher UI 就能正常访问了。配置一旦完成，这行日志就会立刻出现。需要注意的是，这一输出之后也许还会有其他日志，因此，在初始化过程中这不一定是最后一行日志。

Rancher UI 的默认端口是 `8080`。所以为了访问 UI，需打开`http://<SERVER_IP>:8080`。需要注意的事，如果您的浏览器和 Rancher Server 是运行在同一主机上的，您需要通过主机的**真实 IP 地址**访问，比如 `http://192.168.1.100:8080` ，而不是 `http://localhost:8080` 或`http://127.0.0.1:8080`，以防在添加主机的时候使用了不可达的 IP 而出现问题。

> **注意:** 1. 初始安装时 Rancher 的访问控制并未配置，任何能够访问您的 IP 地址的人，都可以访问您的 UI 和 API。我们建议您配置 [访问控制](/docs/rancher1/configurations/environments/access-control/_index). 2. 国内的公有云主机，如果需要使用 80 和 8080 端口，需备案后才可以使用。


## 添加主机

在这里，为了简化操作，我们将添加运行着 Rancher Server 的主机为 Rancher 内的主机。在实际的生产环境中，请使用专用的主机来运行 Rancher Server。

想要添加主机，首先您需要进入 UI 界面，点击**基础架构**，然后您将看到**主机**界面。点击**添加主机**，Rancher 将提示您选择主机注册 URL。这个 URL 是 Rancher Server 运行所在的 URL，且它必须可以被所有您要添加的主机访问到——当 Rancher Server 会通过 NAT 防火墙或负载均衡器被暴露至互联网时，这一设定就非常重要了。如果您的主机有一个私有或本地的 IP 地址，比如 `192.168.*.*`，Rancher 将提示一个警告信息，提醒您务必确保这个 URL 可以被主机访问到。

因为我们现在只会添加 Rancher Server 主机自身，您可以暂时忽略这些警告。点击**保存**。默认选择**自定义**选项，您将得到运行 Rancher agent 容器的 Docker 命令。这里还有其他的公有云的选项，使用这些选项，Rancher 可以使用 Docker Machine 来启动主机。

Rancher UI 会给您提供一些指示，比如您的主机上应该开放的端口，还有其他一些可供选择的信息。鉴于我们现在添加的是 Rancher Server 运行的主机，我们需要添加这个主机所使用的公网 IP。页面上的一个选项提供输入此 IP 的功能，此选项会自动更新 Docker 命令中的环境变量参数以保证正确。

然后请在运行 Rancher Server 的主机上运行这个命令。

当您在 Rancher UI 上点击**关闭**按钮时，您会被返回到**基础架构->主机**界面。一两分钟之后，主机会自动出现在这里。

## 基础设施服务

当您第一次登陆 Rancher 时，您将自动进入**默认**[环境](/docs/rancher1/configurations/environments/_index)。默认已经为此环境选择了 Cattle[环境模板](/docs/rancher1/configurations/environments/_index#什么是环境模版)来启动[基础设施服务](/docs/rancher1/rancher-service/_index)。要想充分利用 Rancher 的一些功能，如[DNS](/docs/rancher1/rancher-service/dns-service/_index)、[元数据](/docs/rancher1/rancher-service/metadata-service/_index)、[网络](/docs/rancher1/rancher-service/networking/_index)、[健康检查](/docs/rancher1/infrastructure/cattle/health-checks/_index)，您需要启动这些基础设施服务。这些基础设施可以在**应用栈** -> **基础设施**中找到。在主机被添加至 Rancher 之前，这些栈会处于 `unhealthy` 状态。主机添加完成后，建议等到所有基础设施服务都处于`active`状态之后再添加服务。

在主机上，所有属于基础设施服务的容器将被隐藏，除非您单击“**显示系统容器**”复选框。

## 通过 UI 创建一个容器

导航到**应用**页面，如果您看到了欢迎屏幕，可以在欢迎屏幕中单击**定义服务**的按钮。如果您的 Rancher 设置中已有服务，您可以在任何现有应用中点击**添加服务**，或者创建一个新的应用来添加服务。应用只是将服务组合在一起的便捷方式。 如果需要创建新的应用，请单击**添加应用**，填写名称和描述，然后单击**创建**。 接着，在新的应用中单击**添加服务**。

给服务取个名字，比如“第一个服务”。您可以使用我们的默认设置，然后单击**创建**。Rancher 将开始在主机上启动容器。不论您的主机 IP 地址是什么，**_第一个容器_**的 IP 地址都将在 `10.42.*.*` 的范围内，因为 Rancher 已使用`ipsec`基础设施服务创建了一个托管网络。各容器之间是通过这个托管网络进行跨主机通信的。

如果您单击**_第一个容器_**的下拉列表，您将可以进行各种管理操作，如停止容器、查看日志或访问容器控制台。

## 通过 Docker 原生 CLI 创建一个容器

Rancher 会显示主机之上的所有容器，即使有些容器是在 UI 之外创建的。在主机的 shell 终端中创建一个容器。

```bash
docker run -d -it --name=second-container ubuntu:14.04.2
```

在 UI 中，您将看到**第二个容器**在您的主机上出现！

Rancher 会对 Docker 守护进程中发生的事件做出反应，调整自己以反映现实情况。您可以在此了解更多通过 Docker 原生 CLI 使用 Rancher 的事宜。

如果您查看**_第二个容器_**的 IP 地址，您将发现它不在`10.42.*.*` 范围内。它的 IP 地址是 Docker 守护进程分配的常用 IP 地址。这是通过 CLI 创建 Docker 容器的预期行为。

如果我们想通过 CLI 创建一个 Docker 容器，但仍希望它使用 Rancher 托管网络的 IP 地址，该怎么做呢？我们只需要在命令中添加一个标签(`io.rancher.container.network=true`)，让 Rancher 知道您希望此容器成为`托管`网络的一部分。

```bash
docker run -d -it --label io.rancher.container.network=true ubuntu:14.04.2
```

## 创建一个多容器应用

上文中我们已经介绍了如何创建单个容器以及这些单个容器之间如何进行跨主机网络通信。然而，现实情况中，大多数应用程序其实是由多个服务构成的，而每个服务又是由多个容器构成的。比如说，一个[LetsChat](http://sdelements.github.io/lets-chat/)应用程序，就是由下列几项服务构成的:

1. 一个负载均衡器。负载均衡器把 Internet 流量转发给“LetsChat”应用程序。
2. 一个由两个“LetsChat”容器组成的*web*服务。
3. 一个由一个“Mongo”容器组成的数据库服务。

负载均衡器的目标是*web*服务(即 LetsChat)，Web 服务将连接到数据库服务(即 Mongo)。

在本节中，我们将介绍如何在 Rancher 中创建和部署[LetsChat](http://sdelements.github.io/lets-chat/)应用程序。

导航到**应用**页面，如果您看到了欢迎屏幕，可以在欢迎屏幕中单击**定义服务**的按钮。 如果您的 Rancher 设置中已有服务，您可以在任何现有应用中点击**添加应用**，来创建一个新的应用。填写名称和描述，然后单击**创建**。 接着，在新的应用中单击**添加服务**。

首先，我们将创建一个名为`database`的数据库服务，并使用`mongo`镜像。单击**创建**。您将立即被带到应用页面，页面中将包含新创建的数据库服务。

接下来，再次点击**添加服务**以添加其他服务。我们将添加一个 LetsChat 服务并链接到*database*服务。让我们使用名称`web`以及`sdelements/lets-chat`镜像。在 UI 中，我们可以移动滑块，将服务扩容至 2 个容器。在**服务链接**中，添加*database*服务并将其命名为`mongo`。就像 Docker 的做法一样，Rancher 会在`letschat`容器里加入这个链接所需要的相关环境变量。单击**创建**。

最后，我们将创建我们的负载均衡器。单击**添加服务**按钮旁的下拉菜单图标。选择**添加负载均衡**。提供一个类似于`letschatapplb`这样的名字。输入访问端口(例如`80`端口)，选择目标服务(即*web*)，并选择目标端口(即`8080`端口)。*web*服务正在侦听`8080`端口。单击**创建**。

至此，我们的 LetsChat 应用程序已完成！在**应用**页面上，您可以查找到超链接形式的负载均衡所暴露端口。点击该链接，将会打开一个新的页面，您将能看到 LetsChat 应用程序了。

## 使用 Rancher CLI 创建一个多容器应用程序

在本节中，我们将介绍如何使用我们的命名行工具[Rancher CLI](/docs/rancher2/cli/_index)创建和部署跟上一节中我们创建的一样的[LetsChat](http://sdelements.github.io/lets-chat/)应用程序。

当在 Rancher 中创建服务时，Rancher CLI 工具与颇受欢迎的 Docker Compose 工具的工作方式类似。 它接收相同的`docker-compose.yml`文件，并在 Rancher 上部署应用程序。 您可以在`rancher-compose.yml`文件中指定更多的属性，该文件将扩展并覆盖`docker-compose.yml`文件。

在上一节中，我们创建了一个具有一个负载均衡器的 LetsChat 应用程序。如果您已经在 Rancher 中创建了它，您可以直接在 UI 中下载这些文件，只需在应用的下拉菜单中选择**导出配置**即可。`docker-compose.yml`文件与 `rancher-compose.yml` 文件与下方示例类似:

### docker-compose.yml 示例

```yml
version: "2"
services:
  letschatapplb:
    #If you only have 1 host and also created the host in the UI,
    # you may have to change the port exposed on the host.
    ports:
      - 80:80/tcp
    labels:
      io.rancher.container.create_agent: "true"
      io.rancher.container.agent.role: environmentAdmin
    image: rancher/lb-service-haproxy:v0.4.2
  web:
    labels:
      io.rancher.container.pull_image: always
    tty: true
    image: sdelements/lets-chat
    links:
      - database:mongo
    stdin_open: true
  database:
    labels:
      io.rancher.container.pull_image: always
    tty: true
    image: mongo
    stdin_open: true
```

### rancher-compose.yml 示例

```yml
version: "2"
services:
  letschatapplb:
    scale: 1
    lb_config:
      certs: []
      port_rules:
        path: ""
        priority: 1
        protocol: http
        service: web
        source_port: 80
        target_port: 8080
    health_check:
      port: 42
      interval: 2000
      unhealthy_threshold: 3
      healthy_threshold: 2
      response_timeout: 2000
  web:
    scale: 2
  database:
    scale: 1
```

在 Rancher UI 中单击**下载 CLI**(该按钮位于页面的右下角)，即可下载 Rancher CLI 二进制文件，Windows、Mac 和 Linux 的二进制文件均可下载。

若想使用 Rancher CLI 在 Rancher 中启动服务，您需要设置一些环境变量。您需要在 Rancher UI 中创建一个账户 API Key。单击**API** -> **密钥**。单击**添加账户 API Key**。填写一个名字，然后单击**创建**。保存**Access Key(用户名)**和**Secret Key(密码)**。通过运行`rancher config`配置 RancherCLI，使用 Rancher URL、Access Key 和 Secret Key。

```bash
# Configure Rancher CLI
$ rancher config
# Set the Rancher URL
URL []: http://<SERVER_IP>:8080/
# Set the access key, i.e. username
Access Key []: <accessKey_of_account_api_key>
# Set the secret key, i.e. password
Secret Key []:  <secretKey_of_account_api_key>
```

现在进入保存了`docker-compose.yml`和`rancher-compose.yml` 文件的目录中，运行下面这个命令。

```bash
rancher up -d -s NewLetsChatApp
```

在 Rancher 中，一个叫做**NewLetsChatApp**的应用将被创建，且所有服务都将在 Rancher 中运行起来。
