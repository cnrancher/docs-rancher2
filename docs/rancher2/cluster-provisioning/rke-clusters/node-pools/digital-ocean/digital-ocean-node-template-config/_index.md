---
title: 配置 DigitalOcean 节点模板
weight: 1
---

## v2.2.0 以及更新的版本

帐户访问信息以云凭证的形式存储。云凭证作为 Kubernetes 密钥存储。多个节点模板可以使用同一个云凭证。您可以使用现有的云凭证或创建新的云凭证。

### Droplet Options

**Droplet Options**规定了您的集群的地理区域和规格。

### Docker Daemon

[Docker daemon](https://docs.docker.com/engine/docker-overview/#the-docker-daemon)配置选项包括：

- **标签**：有关标签的信息，请参考[Docker 对象标签文档](https://docs.docker.com/config/labels-custom-metadata/)。
- **Docker Engine Install URL**：确定将在实例上安装的 Docker 版本。
- **注册表镜像**：Docker 守护进程要使用的 Docker 注册表镜像。
- **其他高级选项**：请参考[Docker 守护进程选项参考](https://docs.docker.com/engine/reference/commandline/dockerd/)。

## v2.2.0 之前的版本

### Access Token

Access Token 存储了您的 DigitalOcean 个人访问令牌，请参阅[DigitalOcean 说明：如何生成个人访问令牌](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-api-v2#how-to-generate-a-personal-access-token)。

### Droplet Options

**Droplet Options**规定了您的集群的地理区域和规格。

### Docker Daemon

[Docker daemon](https://docs.docker.com/engine/docker-overview/#the-docker-daemon)配置选项包括：

- **标签**：有关标签的信息，请参考[Docker 对象标签文档](https://docs.docker.com/config/labels-custom-metadata/)。
- **Docker Engine Install URL**：确定将在实例上安装的 Docker 版本。
- **注册表镜像**：Docker 守护进程要使用的 Docker 注册表镜像。
- **其他高级选项**：请参考[Docker 守护进程选项参考](https://docs.docker.com/engine/reference/commandline/dockerd/)。
