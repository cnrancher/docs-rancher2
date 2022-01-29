---
title: 概述
description: Rancher Desktop 是一款在桌面上提供容器管理和 Kubernetes 的应用。它适用于 Mac（包括 Intel 和 Apple Silicon）、Windows 和 Linux。
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
  - 概述
---

Rancher Desktop 是一款在桌面上提供容器和 Kubernetes 管理的应用。它适用于 Mac（包括 Intel 和 Apple Silicon）、Windows 和 Linux。

![](/img/rancherdesktop/intro/intro.png)
_上图左边是 Mac 上的 Kubernetes 设置，右边是 Windows。_

## 容器管理

Rancher Desktop 提供了构建、推送和拉取容器镜像以及运行容器的能力。这是由 Docker CLI（当你选择 Moby/dockerd 作为引擎时）或 nerdctl（当你选择 containerd 作为引擎时）提供。[nerdctl](https://github.com/containerd/nerdctl) 是 containerd 项目提供的 "兼容 containerd 的 Docker CLI"。

## Kubernetes

Kubernetes 内置在 Rancher Desktop 中。Kubernetes 由 [k3s](https://k3s.io/) 提供，这是一个经过认证的轻量级发行版。通过 Rancher Desktop，你能够**选择你的 Kubernetes 版本**，并且**点击一个按钮就可以重置 Kubernetes 或 Kubernetes 以及整个容器运行时**。
