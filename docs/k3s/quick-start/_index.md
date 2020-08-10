---
title: "快速入门指南"
weight: 10
---

本指南将帮助您使用默认选项快速启动集群。安装部分将详细介绍如何设置K3s。

有关K3s组件如何协同工作的信息，请参阅[架构部分](/docs/k3s/architecture/_index#具有外部数据库的高可用k3s-server)。

> Kubernetes的新手？ Kubernetes官方文档已经有一些很棒的教程，在[这里](https://kubernetes.io/docs/tutorials/kubernetes-basics/)概述了基础知识。

安装脚本
--------------
K3s提供了一个安装脚本，可以方便的在systemd或openrc的系统上将其作为服务安装。这个脚本可以在 https://get.k3s.io 获得。要使用这种方法安装K3s，只需运行：
```bash
curl -sfL https://get.k3s.io | sh -
```

运行此安装后:

* K3s服务将被配置为在节点重启后或进程崩溃或被杀死时自动重启。
* 将安装其他实用程序，包括`kubectl`, `crictl`, `ctr`, `k3s-killall.sh` 和 `k3s-uninstall.sh`
* 将[kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)文件写入到`/etc/rancher/k3s/k3s.yaml`，由K3s安装的kubectl将自动使用该文件

要在工作节点上安装并将它们添加到集群，请使用`K3S_URL`和`K3S_TOKEN`环境变量运行安装脚本。这是显示如何加入工作者节点的示例：

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken sh -
```
设置`K3S_URL`参数会使K3s以worker模式运行。K3s agent将在所提供的URL上向监听的K3s服务器注册。`K3S_TOKEN`使用的值存储在你的服务器节点上的`/var/lib/rancher/k3s/server/node-token`。

注意：每台计算机必须具有唯一的主机名。如果您的计算机没有唯一的主机名，请传递`K3S_NODE_NAME`环境变量，并为每个节点提供一个有效且唯一的主机名。
