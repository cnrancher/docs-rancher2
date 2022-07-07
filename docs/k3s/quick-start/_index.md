---
title: 快速入门指南
description: 本指南将帮助您使用默认选项快速启动集群。安装部分将详细介绍如何设置K3s。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - 快速入门指南
---

## 概述

本指南将帮助您使用默认选项快速启动集群。安装部分将详细介绍如何设置 K3s。

## 相关链接

[具有嵌入式数据库的单节点 server 设置](/docs/k3s/architecture/_index#具有外部数据库的高可用-K3s-server)：有关 K3s 组件如何协同工作的信息，请参阅本文。

[AutoK3s 使用指南](/docs/k3s/autok3s/_index)：如果您使用的云厂商是 Alibaba、Tencent 或 AWS，建议您使用 AutoK3s 进行快速入门，详情请参考本文。

[基础教程](https://kubernetes.io/zh/docs/tutorials/kubernetes-basics/)：Kubernetes 官方文档已经有一些很棒的教程，如果您是 Kubernetes 的新手，请参考本文了解 Kubernetes 基础知识。

## 安装脚本

K3s 提供了一个安装脚本，可以方便的在 systemd 或 openrc 的系统上将其作为服务安装。这个脚本可以在 https://get.k3s.io 获得。要使用这种方法安装 K3s，只需运行以下命令：

```bash
curl -sfL https://get.k3s.io | sh -
```

:::tip 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL https://rancher-mirror.oss-cn-beijing.aliyuncs.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
```

:::

运行此安装后：

- K3s 服务将被配置为在节点重启后或进程崩溃或被杀死时自动重启。
- 将安装其他实用程序，包括`kubectl`、`crictl`、`ctr`、`k3s-killall.sh` 和 `k3s-uninstall.sh`。
- 将[kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)文件写入到`/etc/rancher/k3s/k3s.yaml`，由 K3s 安装的 kubectl 将自动使用该文件

要在工作节点上安装并将它们添加到集群，请使用`K3S_URL`和`K3S_TOKEN`环境变量运行安装脚本。以下示例演示了如何加入 worker 节点：

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken sh -
```

:::tip 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL https://rancher-mirror.oss-cn-beijing.aliyuncs.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken sh -
```

:::

设置`K3S_URL`参数会使 K3s 以 worker 模式运行。K3s agent 将在所提供的 URL 上向监听的 K3s 服务器注册。`K3S_TOKEN`使用的值存储在你的服务器节点上的`/var/lib/rancher/k3s/server/node-token`路径下。

:::note 注意
每台计算机必须具有唯一的主机名。如果您的计算机没有唯一的主机名，请传递`K3S_NODE_NAME`环境变量，并为每个节点提供一个有效且唯一的主机名。
:::
