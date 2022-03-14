---
title: 安装 Docker
weight: 1
---

在使用 Helm 或 Docker 在节点上安装 Rancher Server 前，你需要先安装 Docker。

Docker 有几个安装方法。一种方法是参见 [Docker 官方文档](https://docs.docker.com/install/)以了解如何在 Linux 上安装 Docker。不同 Linux 发行版的安装步骤可能有所不同。

另一种方式是使用 Rancher 的 Docker 安装脚本，该脚本可用于较新的 Docker 版本。

例如，你可执行以下命令，在 Ubuntu 上安装 Docker 20.10：

```
curl https://releases.rancher.com/install-docker/20.10.sh | sh
```

Rancher 提供 Kubernetes 支持的所有上游 Docker 版本的安装脚本。如需了解我们是否提供某个 Docker 版本的安装脚本，请参见包含了 Rancher 所有的 Docker 安装脚本的 [GitHub 仓库](https://github.com/rancher/install-docker)。
