---
title: 概述
description: Rancher Desktop 概述
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
  - Rancher Desktop
  - rancher desktop
  - rancherdesktop
  - RancherDesktop
  - 产品介绍
  - Rancher Desktop 介绍
---

Rancher Desktop 是一款在桌面上提供容器和 Kubernetes 管理的应用。它适用于 Mac（包括 Intel 和 Apple 芯片）、Windows 和 Linux。

![](/img/rancherdesktop/intro/intro.png)
_上图左边是 Mac 上的 Kubernetes 设置，右边是 Windows。_

## 容器管理

Rancher Desktop 提供了构建、推送和拉取容器镜像以及运行容器的功能，这些功能可以通过 Docker CLI（当你选择 Moby/dockerd 作为引擎时）或 nerdctl（当你选择 containerd 作为引擎时）实现，而 [nerdctl](https://github.com/containerd/nerdctl) 是 containerd 项目提供的 "兼容 containerd 的 Docker CLI"。

## Kubernetes

Kubernetes 内置在 Rancher Desktop 中，由 [K3s](https://k3s.io/) 提供。K3s 是一个经过认证的轻量级发行版。通过 Rancher Desktop，你能够 _选择你的 Kubernetes 版本_，并且_一键重置 Kubernetes 或 Kubernetes 以及整个容器运行时_。

## Rancher 与 Rancher Desktop

虽然 [Rancher](https://rancher.com/) 和 Rancher Desktop 的名字里都包含 _Rancher_，但它们的功能是有差别的。Rancher Desktop 不是桌面版 Rancher。Rancher 是管理 Kubernetes 集群的强大解决方案，Rancher Desktop 提供本地 Kubernetes 和容器管理平台，这两种解决方案相辅相成。

如果要在本地系统上运行 Rancher，你可以将 Rancher 安装到 Rancher Desktop 中。
