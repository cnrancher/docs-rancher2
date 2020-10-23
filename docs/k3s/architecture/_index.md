---
title: 架构介绍
description: 本页介绍了高可用 K3s 集群的架构，以及它与单节点集群的不同之处，描述了如何在 K3s server 上注册 agent 节点。K3s server 节点被定义为运行k3s server命令的机器（裸机或虚拟机）。工作节点定义为运行`k3s agent`命令的机器。
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
  - 架构介绍
---

本页介绍了高可用 K3s 集群的架构，以及它与单节点集群的不同之处。

它还描述了如何在 K3s server 上注册 agent 节点。

K3s server 节点被定义为运行`k3s server`命令的机器（裸机或虚拟机）。工作节点定义为运行`k3s agent`命令的机器。

本页涉及以下主题：

- [具有嵌入式数据库的单节点 server 设置](#具有嵌入式数据库的单节点server设置)
- [具有外部数据库的高可用 K3s server](#具有外部数据库的高可用k3s-server)
  - [固定 agent 节点的注册地址](#固定agent节点的注册地址)
- [Agent 节点如何注册](#agent节点如何注册)
- [自动部署的清单](#自动部署的清单)

## 具有嵌入式数据库的单节点 server 设置

下图显示了一个集群的例子，该集群有一个内嵌 SQLite 数据库的单节点 K3s server。

在这种配置中，每个 agent 节点都注册到同一个 server 节点。K3s 用户可以通过调用 server 节点上的 K3s API 来操作 Kubernetes 资源。

<figcaption>单节点k3s server的架构</figcaption>

![Architecture](/img/k3s/k3s-architecture-single-server.png)

## 具有外部数据库的高可用 K3s server

单节点 k3s 集群可以满足各种用例，但对于 Kubernetes 控制平面的正常运行至关重要的环境，您可以在 HA 配置中运行 K3s。一个 HA K3s 集群由以下几个部分组成：

- 两个或更多`server节点`将为 Kubernetes API 提供服务并运行其他控制平面服务
- `外部数据存储`（与单节点 k3s 设置中使用的嵌入式 SQLite 数据存储相反）

<figcaption>K3s高可用架构</figcaption>

![Architecture](/img/k3s/k3s-architecture-ha-server.png)

### 固定 agent 节点的注册地址

在高可用 k3s server 配置中，每个节点还必须使用固定的注册地址向 Kubernetes API 注册，如下图所示：

注册后，agent 节点直接与其中一个 server 节点建立连接。

![k3s HA](/img/k3s/k3s-production-setup.svg)

## Agent 节点如何注册

Agent 节点用`k3s agent`进程发起的 websocket 连接注册，连接由作为代理进程一部分运行的客户端负载均衡器维护。

Agent 节点将使用节点集群密钥以及在`/etc/rancher/node/password`中存储的随机生成的节点密码向服务器注册。服务器会将每个节点的密码存储在`/var/lib/rancher/k3s/server/cred/node-passwd`中，任何后续尝试都必须使用相同的密码。

如果删除了 agent 的`/etc/rancher/node`目录，则应为该 agent 重新创建密码文件，或者从 server 中删除该条目。

通过使用`--with-node-id`标志启动 K3s server 或 agent，可以将唯一的节点 ID 附加到主机名。

## 自动部署的清单

位于目录路径`/var/lib/rancher/k3s/server/manifests` 的清单在构建时被捆绑到 K3s 二进制文件中。 这些将由[rancher/helm-controller](https://github.com/rancher/helm-controller#helm-controller)在运行时安装。
