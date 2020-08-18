---
title: 安装 Docker
description: 任何运行 Rancher Server 的节点上都需要安装 Docker。有两种安装 Docker 的选择。一种选择是参考[官方 Docker 文档](https://docs.docker.com/install/)来了解如何在 Linux 上安装 Docker。这些安装步骤将根据 Linux 发行版而有所不同。另一种选择是使用 Rancher 提供的 Docker 安装脚本，该脚本可用于安装较新的 Docker 版本。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 安装指南
  - 安装要求
  - 安装 Docker
---

任何运行 Rancher Server 的节点上都需要安装 Docker。

有两种安装 Docker 的选择。一种选择是参考[官方 Docker 文档](https://docs.docker.com/install/)来了解如何在 Linux 上安装 Docker。这些安装步骤将根据 Linux 发行版而有所不同。

另一种选择是使用 Rancher 提供的 Docker 安装脚本，该脚本可用于安装较新的 Docker 版本。

例如，此命令可用于在 Ubuntu 上安装 Docker 18.09：

```
curl https://releases.rancher.com/install-docker/18.09.sh | sh
```

要了解某个 Docker 版本是否有可用的安装脚本，请参考这个[GitHub 仓库](https://github.com/rancher/install-docker)，这里包含了 Rancher 的所有 Docker 安装脚本。
