---
title: 配置Azure 节点模板
---

For more information about Azure, refer to the official [Azure documentation.](https://docs.microsoft.com/en-us/azure/?product=featured)

## v2.2.0 以及更新的版本

帐户访问信息以云凭证的形式存储。云凭证作为 Kubernetes 密钥存储。多个节点模板可以使用同一个云凭证。您可以使用现有的云凭证或创建新的云凭证。

- **Placement**：设置您的集群托管的地理区域和其他位置元数据。
- **Network**：配置您的集群中使用的网络。
- **Instance**：自定义您的虚拟机配置。

[Docker daemon](https://docs.docker.com/engine/docker-overview/#the-docker-daemon)配置选项包括：

- **标签**：有关标签的信息，请参考[Docker 对象标签文档](https://docs.docker.com/config/labels-custom-metadata/)。
- **Docker Engine Install URL**：确定将在实例上安装的 Docker 版本。
- **注册表镜像**：Docker 守护进程要使用的 Docker 注册表镜像。
- **其他高级选项**：请参考[Docker 守护进程选项参考](https://docs.docker.com/engine/reference/commandline/dockerd/)。

## v2.2.0 之前的版本

- **账户权限**：储存您的账户信息，用于 Azure 授权验证。
- **Placement**：设置您的集群托管的地理区域和其他位置元数据。
- **Network**：配置您的集群中使用的网络。
- **Instance**：自定义您的虚拟机配置。

[Docker daemon](https://docs.docker.com/engine/docker-overview/#the-docker-daemon)配置选项包括：

- **标签**：有关标签的信息，请参考[Docker 对象标签文档](https://docs.docker.com/config/labels-custom-metadata/)。
- **Docker Engine Install URL**：确定将在实例上安装的 Docker 版本。
- **注册表镜像**：Docker 守护进程要使用的 Docker 注册表镜像。
- **其他高级选项**：请参考[Docker 守护进程选项参考](https://docs.docker.com/engine/reference/commandline/dockerd/)。
