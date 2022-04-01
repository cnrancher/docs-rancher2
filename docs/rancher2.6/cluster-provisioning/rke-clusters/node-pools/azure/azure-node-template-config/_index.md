---
title: Azure 节点模板配置
weight: 1
---

有关 Azure 的更多信息，请参阅官方 [Azure 文档](https://docs.microsoft.com/en-us/azure/?product=featured)。

账户访问信息存储在云凭证中。云凭证存储在 Kubernetes 密文中。多个节点模板可以使用相同的云凭证。你可以使用现有的云凭证或创建新的凭证。

- **Placement** 设置托管集群的地理区域以及其他位置元数据。
- **Network** 配置集群中使用的网络。
- **Instance** 自定义你的 VM 配置。

[Docker daemon](https://docs.docker.com/engine/docker-overview/#the-docker-daemon) 配置选项包括：

- **标签**：有关标签的信息，请参阅 [Docker 对象标签文档](https://docs.docker.com/config/labels-custom-metadata/)。
- **Docker 引擎安装 URL**：确定要在实例上安装的 Docker 版本。
- **镜像仓库 mirror**：Docker daemon 使用的 Docker 镜像仓库镜像。
- **其他高级选项**：参见 [Docker daemon 选项参考](https://docs.docker.com/engine/reference/commandline/dockerd/)。
