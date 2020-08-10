---
title: 架构
weight: 1
---

本页介绍了高可用K3s集群的架构，以及它与单节点集群的不同之处。

它还描述了如何在K3s server上注册agent节点。

K3s server节点被定义为运行`k3s server`命令的机器（裸机或虚拟机）。工作节点定义为运行`k3s agent`命令的机器。

本页涉及以下主题：

- [具有嵌入式数据库的单节点server设置](具有嵌入式数据库的单节点server设置)
- [具有外部数据库的高可用K3s server](#具有外部数据库的高可用k3s-server)
   - [固定agent节点的注册地址](#固定agent节点的注册地址)
- [Agent节点如何注册](#agent节点如何注册)
- [自动部署的清单](#自动部署的清单)

## 具有嵌入式数据库的单节点server设置

下图显示了一个集群的例子，该集群有一个内嵌SQLite数据库的单节点K3s server。

在这种配置中，每个agent节点都注册到同一个server节点。K3s用户可以通过调用server节点上的K3s API来操作Kubernetes资源。

<figcaption>单节点k3s server的架构</figcaption>

![Architecture](/img/k3s/k3s-architecture-single-server.png)

## 具有外部数据库的高可用K3s server

单节点k3s集群可以满足各种用例，但对于Kubernetes控制平面的正常运行至关重要的环境，您可以在HA配置中运行K3s。一个HA K3s集群由以下几个部分组成:

* 两个或更多`server节点`将为Kubernetes API提供服务并运行其他控制平面服务
* `外部数据存储`（与单节点k3s设置中使用的嵌入式SQLite数据存储相反）

<figcaption>K3s高可用架构</figcaption>

![Architecture](/img/k3s/k3s-architecture-ha-server.png)

### 固定agent节点的注册地址

在高可用k3s server配置中，每个节点还必须使用固定的注册地址向Kubernetes API注册，如下图所示：

注册后，agent节点直接与其中一个server节点建立连接。

![k3s HA](/img/k3s/k3s-production-setup.svg)

## Agent节点如何注册

Agent节点用`k3s agent`进程发起的websocket连接注册，连接由作为代理进程一部分运行的客户端负载均衡器维护。

Agent节点将使用节点集群密钥以及在`/etc/rancher/node/password`中存储的随机生成的节点密码向服务器注册。服务器会将每个节点的密码存储在`/var/lib/rancher/k3s/server/cred/node-passwd`中，任何后续尝试都必须使用相同的密码。

如果删除了agent的`/etc/rancher/node`目录，则应为该agent重新创建密码文件，或者从server中删除该条目。

通过使用`--with-node-id`标志启动K3s server或agent，可以将唯一的节点ID附加到主机名。

## 自动部署的清单

位于目录路径`/var/lib/rancher/k3s/server/manifests` 的清单在构建时被捆绑到K3s二进制文件中。
