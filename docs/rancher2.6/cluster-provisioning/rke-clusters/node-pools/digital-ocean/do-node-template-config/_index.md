---
title: DigitalOcean 节点模板配置
weight: 1
---

账户访问信息存储在云凭证中。云凭证存储在 Kubernetes 密文中。多个节点模板可以使用相同的云凭证。你可以使用现有的云凭证或创建新的凭证。

### Droplet 选项

**Droplet 选项**用于配置集群的地理区域和规范。

### Docker Daemon

[Docker daemon](https://docs.docker.com/engine/docker-overview/#the-docker-daemon) 配置选项包括：

- **标签**：有关标签的信息，请参阅 [Docker 对象标签文档](https://docs.docker.com/config/labels-custom-metadata/)。
- **Docker 引擎安装 URL**：确定要在实例上安装的 Docker 版本。
- **镜像仓库 mirror**：Docker daemon 使用的 Docker 镜像仓库镜像。
- **其他高级选项**：参见 [Docker daemon 选项参考](https://docs.docker.com/engine/reference/commandline/dockerd/)。
