---
title: 安装 Docker
description: 任何运行 Rancher Server 的节点上都需要安装 Docker。有两种安装 Docker 的选择。一种选择是参考[官方 Docker 文档](https://docs.docker.com/install/)来了解如何在 Linux 上安装 Docker。这些安装步骤将根据 Linux 发行版而有所不同。另一种选择是使用 Rancher 提供的 Docker 安装脚本，该脚本可用于安装较新的 Docker 版本。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 安装指南
  - 安装要求
  - 安装 Docker
---

对于 Helm CLI 安装，需要在运行 Rancher 服务器的任何节点上安装 Docker。

有两种安装 Docker 的选择。一种选择是参考[官方 Docker 文档](https://docs.docker.com/install/)来了解如何在 Linux 上安装 Docker。这些安装步骤将根据 Linux 发行版而有所不同。

另一种选择是使用 Rancher 提供的 Docker 安装脚本，该脚本可用于安装较新的 Docker 版本。

例如，此命令可用于在 Ubuntu 上安装 Docker 19.03：

```bash
curl https://releases.rancher.com/install-docker/19.03.sh | sh
```

Rancher 为 Kubernetes 支持的每个上游 Docker 版本都有安装脚本。要想知道是否有安装某个 Docker 版本的脚本，可以参考这个[GitHub 仓库](https://github.com/rancher/install-docker)，其中包含了 Rancher 所有的 Docker 安装脚本。
