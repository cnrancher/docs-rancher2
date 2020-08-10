---
title: 使用外部数据库实现高可用
weight: 30
---

> **注意：** 我们在v1.0.0版本中引入了在Kubernetes集群上安装Rancher的官方支持。

本节介绍了如何使用外部数据库安装一个高可用的K3s集群。

单节点k3s server集群可以满足各种用例，但是对于需要Kubernetes控制平面稳定运行的重要环境，您可以在HA配置中运行K3s。一个K3s HA集群由以下几个部分组成:

* 两个或多个**server节点**，将为Kubernetes API提供服务并运行其他控制平面服务。
* 零个或多个**agent节点**，用于运行您的应用和服务。
* **外部数据存储** (与单个k3s server设置中使用的嵌入式SQLite数据存储相反) 
* **固定的注册地址**，位于server节点的前面，以允许agent节点向集群注册

关于这些组件如何协同工作的更多细节，请参考[架构部分。](/docs/k3s/architecture/_index#具有外部数据库的高可用k3s-server)

Agent通过固定的注册地址进行注册，但注册后直接与其中一个server节点建立连接。这是一个由`k3s agent`进程发起的websocket连接，并由作为agent进程一部分运行的客户端负载均衡器维护。

## 安装概要

设置HA集群需要以下步骤:

1. [创建一个外部数据存储](#1-创建一个外部数据存储)
2. [启动server节点](#2-启动server节点)
3. [配置固定的注册地址](#3-配置固定的注册地址)
4. [加入agent节点](#4-可选-加入-agent-节点)

### 1. 创建一个外部数据存储
你首先需要为集群创建一个外部数据存储。请参阅[集群数据存储选项](/docs/k3s/installation/datastore/_index)文档了解更多细节。

### 2. 启动server节点
K3s需要两个或更多的server节点来实现这种HA配置。请参阅[安装要求](/docs/k3s/installation/installation-requirements/_index)指南了解最低主机要求。

当在这些节点上运行`k3s server`命令时，必须设置`datastore-endpoint`参数，以便K3s知道如何连接到外部数据存储。

例如，像下面这样的命令可以用来安装以MySQL数据库作为外部数据存储的K3s server：

```
curl -sfL https://get.k3s.io | sh -s - server \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

:::note 提示
国内用户，可以使用以下方法加速安装：
```
curl -sfL https://docs.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -s - server \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```
:::

根据数据库类型的不同，数据存储端点的格式也不同。详情请参考[数据存储端点格式](/docs/k3s/installation/datastore/_index#数据存储端点格式和功能)章节。

启动server节点时，若要设置TLS证书，请参考[数据存储配置指南](/docs/k3s/installation/datastore/_index#外部数据存储配置参数)。

> **注意：** 单台server安装时可用的安装选项也适用于高可用安装。更多详情，请参见[安装和配置选项](/docs/k3s/installation/install-options/_index)文档。

默认情况下，server节点将是可调度的，因此你的工作负载可以在它们上启动。如果你希望有一个专用的控制平面，在这个平面上不会运行用户工作负载，你可以使用taints。`node-taint` 参数将允许你用污点配置节点，例如`--node-taint k3s-controlplane=true:NoExecute`。

在所有server节点上启动`k3s server`进程后，用`k3s kubectl get nodes`确保集群正常运行。你应该会看到你的server节点处`Ready`状态。

### 3. 配置固定的注册地址

Agent节点需要一个URL来注册。这可以是任何server节点的IP或主机名，但在许多情况下，这些节点可能会随着时间的推移而改变。例如，如果您在支持缩放组的云中运行集群，您可能会随着时间的推移上下缩放server节点组，导致节点被创建和销毁，从而具有与初始server节点不同的IP。因此，你应该在server节点前面有一个稳定的端点，不会随时间推移而改变。可以使用许多方法来设置此端点，例如：

* 一个4层（TCP）负载均衡器
* 轮询 DNS
* 虚拟或弹性IP地址

这个端点也可以用来访问Kubernetes API。因此，你可以修改你的[kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)文件来指向它，而不是特定的节点。为了避免在这样的配置中出现证书错误，你应该使用`--tls-san YOUR_IP_OR_HOSTNAME_HERE`选项安装server节点。这个选项在TLS证书中增加了一个额外的主机名或IP作为备用名称，如果你想通过IP和主机名访问，可以多次指定。

### 4. 可选: 加入 Agent 节点

因为K3s server节点默认是可调度的，所以HA K3s server集群的最小节点数是两个server节点和零个agent节点。要添加指定运行您的应用和服务的节点，请将agent节点加入到您的集群中。

在 HA 集群中加入agent节点与在单个server集群中加入agent节点是一样的。你只需要指定agent应该注册到的URL和它应该使用的token即可。

```
K3S_TOKEN=SECRET k3s agent --server https://fixed-registration-address:6443
```
