---
title: 使用外部数据库实现高可用安装
description: 本节介绍了如何使用外部数据库安装一个高可用的 K3s 集群。单节点 k3s server 集群可以满足各种用例，但是对于需要 Kubernetes control-plane稳定运行的重要环境，您可以在 HA 配置中运行 K3s。一个 K3s HA 集群由以下几个部分组成
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
  - 安装介绍
  - 使用外部数据库实现高可用安装
---

> **注意：** 我们在 v1.0.0 版本中引入了在 Kubernetes 集群上安装 Rancher 的官方支持。

本节介绍了如何使用外部数据库安装一个高可用的 K3s 集群。

单节点 k3s server 集群可以满足各种用例，但是对于需要 Kubernetes control-plane 稳定运行的重要环境，您可以在 HA 配置中运行 K3s。一个 K3s HA 集群由以下几个部分组成：

- 两个或多个**server 节点**，将为 Kubernetes API 提供服务并运行其他 control-plane 服务。
- 零个或多个**agent 节点**，用于运行您的应用和服务。
- **外部数据存储** (与单个 k3s server 设置中使用的嵌入式 SQLite 数据存储相反)
- **固定的注册地址**，位于 server 节点的前面，以允许 agent 节点向集群注册

关于这些组件如何协同工作的更多细节，请参考[架构部分。](/docs/k3s/architecture/_index#具有外部数据库的高可用k3s-server)

Agent 通过固定的注册地址进行注册，但注册后直接与其中一个 server 节点建立连接。这是一个由`k3s agent`进程发起的 websocket 连接，并由作为 agent 进程一部分运行的客户端负载均衡器维护。

## 安装概要

设置 HA 集群需要以下步骤：

1. [创建一个外部数据存储](#1-创建一个外部数据存储)
2. [启动 server 节点](#2-启动server节点)
3. [配置固定的注册地址](#3-配置固定的注册地址)
4. [加入 agent 节点](#4-可选-加入-agent-节点)

### 1. 创建一个外部数据存储

你首先需要为集群创建一个外部数据存储。请参阅[集群数据存储选项](/docs/k3s/installation/datastore/_index)文档了解更多细节。

### 2. 启动 server 节点

K3s 需要两个或更多的 server 节点来实现这种 HA 配置。请参阅[安装要求](/docs/k3s/installation/installation-requirements/_index)指南了解最低主机要求。

当在这些节点上运行`k3s server`命令时，必须设置`datastore-endpoint`参数，以便 K3s 知道如何连接到外部数据存储。

例如，像下面这样的命令可以用来安装以 MySQL 数据库作为外部数据存储的 K3s server：

```
curl -sfL https://get.k3s.io | sh -s - server \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

:::tip 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL http://rancher-mirror.cnrancher.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -s - server \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

:::

根据数据库类型的不同，数据存储端点的格式也不同。详情请参考[数据存储端点格式](/docs/k3s/installation/datastore/_index#数据存储端点格式和功能)章节。

启动 server 节点时，若要设置 TLS 证书，请参考[数据存储配置指南](/docs/k3s/installation/datastore/_index#外部数据存储配置参数)。

> **注意：** 单台 server 安装时可用的安装选项也适用于高可用安装。更多详情，请参见[安装和配置选项](/docs/k3s/installation/install-options/_index)文档。

默认情况下，server 节点将是可调度的，因此你的工作负载可以在它们上启动。如果你希望有一个专用的 control-plane，在这个平面上不会运行用户工作负载，你可以使用 taints。`node-taint` 参数将允许你用污点配置节点，例如`--node-taint CriticalAddonsOnly=true:NoExecute`。

在所有 server 节点上启动`k3s server`进程后，用`k3s kubectl get nodes`确保集群正常运行。你应该会看到你的 server 节点处`Ready`状态。

### 3. 配置固定的注册地址

Agent 节点需要一个 URL 来注册。这可以是任何 server 节点的 IP 或主机名，但在许多情况下，这些节点可能会随着时间的推移而改变。例如，如果您在支持缩放组的云中运行集群，您可能会随着时间的推移上下缩放 server 节点组，导致节点被创建和销毁，从而具有与初始 server 节点不同的 IP。因此，你应该在 server 节点前面有一个稳定的端点，不会随时间推移而改变。可以使用许多方法来设置此端点，例如：

- 一个 4 层（TCP）负载均衡器
- 轮询 DNS
- 虚拟或弹性 IP 地址

这个端点也可以用来访问 Kubernetes API。因此，你可以修改你的[kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)文件来指向它，而不是特定的节点。为了避免在这样的配置中出现证书错误，你应该使用`--tls-san YOUR_IP_OR_HOSTNAME_HERE`选项安装 server 节点。这个选项在 TLS 证书中增加了一个额外的主机名或 IP 作为备用名称，如果你想通过 IP 和主机名访问，可以多次指定。

### 4. 可选： 加入 Agent 节点

因为 K3s server 节点默认是可调度的，所以 HA K3s server 集群的最小节点数是两个 server 节点和零个 agent 节点。要添加指定运行您的应用和服务的节点，请将 agent 节点加入到您的集群中。

在 HA 集群中加入 agent 节点与在单个 server 集群中加入 agent 节点是一样的。你只需要指定 agent 应该注册到的 URL 和它应该使用的 token 即可。

```
K3S_TOKEN=SECRET k3s agent --server https://fixed-registration-address:6443
```
