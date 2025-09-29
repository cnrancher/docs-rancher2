---
title: 架构介绍
description: 本文介绍了高可用（HA） K3s 集群的架构，以及它与单节点集群的不同之处。
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

本文介绍了高可用（HA） K3s 集群的架构，以及它与单节点集群的不同之处，描述了如何在 K3s server 上注册 agent 节点。

K3s server 是运行`k3s server`命令的机器（裸机或虚拟机），而 K3s worker 节点是运行`k3s agent`命令的机器。

## 单节点架构

K3s 单节点集群的架构如下图所示，该集群有一个内嵌 SQLite 数据库的单节点 K3s server。

在这种配置中，每个 agent 节点都注册到同一个 server 节点。K3s 用户可以通过调用 server 节点上的 K3s API 来操作 Kubernetes 资源。

<figcaption>单节点k3s server的架构</figcaption>

![Architecture](/img/k3s/k3s-architecture-single-server.png)

## 高可用架构

虽然单节点 k3s 集群可以满足各种用例，但对于 Kubernetes control-plane 的正常运行至关重要的环境，您可以在高可用配置中运行 K3s。一个高可用 K3s 集群由以下几个部分组成：

- **K3s Server 节点**：两个或更多的`server`节点将为 Kubernetes API 提供服务并运行其他 control-plane 服务
- **外部数据库**：与单节点 k3s 设置中使用的嵌入式 SQLite 数据存储相反，高可用 K3s 需要挂载一个`external database`外部数据库作为数据存储的媒介。

<figcaption>K3s高可用架构</figcaption>

![Architecture](/img/k3s/k3s-architecture-ha-server.png)

### 固定 agent 节点的注册地址

在高可用 K3s server 配置中，每个节点还必须使用固定的注册地址向 Kubernetes API 注册，注册后，agent 节点直接与其中一个 server 节点建立连接，如下图所示：

![k3s HA](/img/k3s/k3s-production-setup.svg)

## 注册 Agent 节点

Agent 节点用`k3s agent`进程发起的 websocket 连接注册，连接由作为代理进程一部分运行的客户端负载均衡器维护。

Agent 将使用节点集群 secret 以及随机生成的节点密码向 k3s server 注册，密码存储在 `/etc/rancher/node/password`路径下。K3s server 将把各个节点的密码存储为 Kubernetes secrets，随后的任何尝试都必须使用相同的密码。节点密码秘密存储在`kube-system`命名空间中，名称使用模板`<host>.node-password.k3s`。

:::note 注意

- 在 K3s v1.20.2 之前，K3s server 将密码存储在`/var/lib/rancher/k3s/server/cred/node-passwd`的磁盘上。
- 如果您删除了 agent 的`/etc/rancher/node`目录，则需要为该 agent 重新创建密码文件，或者从 server 中删除该条目。
- 通过使用`--with-node-id`标志启动 K3s server 或 agent，可以将唯一的节点 ID 附加到主机名中。

:::

## 自动部署的清单

位于目录路径`/var/lib/rancher/k3s/server/manifests` 的清单在构建时被捆绑到 K3s 二进制文件中，将由[rancher/helm-controller](https://github.com/rancher/helm-controller#helm-controller)在运行时安装。
