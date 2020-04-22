---
title: CNI 插件
description: NI (Container Network Interface) 是一个[云原生基金会项目](https://cncf.io/)，它包含了一些特性说明和库，用于编程 linux 容器网络以及一系列网络插件。CNI 只关注于提供容器之间的网络连接并在删除容器时移除分配的资源。Kubernetes 采用 CNI 作为网络插件和 Kubernetes Pod 网络之间的接口。
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
  - 常见问题
  - CNI 插件
---

## CNI 是什么？

CNI (Container Network Interface) 是一个[云原生基金会项目](https://cncf.io/)，它包含了一些特性说明和库，用于编程 linux 容器网络以及一系列网络插件。CNI 只关注于提供容器之间的网络连接并在删除容器时移除分配的资源。

Kubernetes 采用 CNI 作为网络插件和 Kubernetes Pod 网络之间的接口。

![CNI Logo](/img/rancher/cni-logo.png)

更多信息请访问[CNI 项目](https://github.com/containernetworking/cni)。

## CNI 采用了什么网络模型？

CNI 网络插件使用诸如虚拟可扩展局域网（[VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)）之类的封装网络模型来实现其网络结构。或者是非封装的网络模型，例如边界网关协议（[BGP](https://en.wikipedia.org/wiki/Border_Gateway_Protocol)）。

### 什么是封装网络？

封装网络模型提供了一个在 Kubernetes 节点形成的三层网络拓扑上的逻辑二层 L2 网络。通过这个模型不需要路由分发，您就可获得一个隔离的二层容器网络。封装网络带来了少量的数据表处理负荷以及因为 Overlay 封装的 IP 报头而增加的 IP 数据包大小。封装的信息通过 UDP 在 Kubernetes 节点中分发，并在网络控制节点间交换关于 MAC 地址之间如何相互访问的信息。封装通常采用的是 VXLAN、IPsec 和 IP-in-IP 技术。

简而言之，这种网络模型在 Kubernetes 节点之间创建了一种特别的网桥，用以连接节点中的容器。

当您需要一个扩展的二层网桥时将更加倾向于采用这种网络模型。这种网络模型对 Kubernetes 节点间的三层网络延迟非常敏感。如果数据中心分布在不同的地理位置，请确保不同位置间的网络间足够的低延迟以避免可能的网络中断。

采用这种网络模型的 CNI 网络插件包括 Flannel、Canal 和 Weave。

![Encapsulated Network](/img/rancher/encapsulated-network.png)

### 什么是非封装网络？

非封装网络模型提供了一种在容器之间进行三层路由的网络。该模型不创建一个隔离的二层网络或者封装负荷。没有封装负荷，但该网络模型需要 Kubernetes 节点进行路由分发的管理。相对于采用 IP 报头来封装，这种网络模型采用一类网络协议在 Kubernetes 节点间分发路由信息来实现 Pod 连接，诸如[BGP 协议](https://en.wikipedia.org/wiki/Border_Gateway_Protocol)。

简而言之，这种网络模型在 Kubernetes 节点之间创建了一种网络路由器，用以提供容器之间如何路由连接的信息。

当您需要一个三层路由网络时将更加倾向于采用这种网络模型。这种网络模型动态地更新 Kubernetes 节点操作系统层面的路由，它对网络延迟较小敏感。

采用这种网络模型的网络插件包括 Calico 和 Romana。

![Unencapsulated Network](/img/rancher/unencapsulated-network.png)

## Rancher 支持什么 CNI 网络插件？

网络方案相对解耦。Rancher 为其 Kubernetes 集群提供以下开箱即用的 CNI 网络插件：Canal、Flannel、Calico 和 Weave（Weave 自 v2.2.0 可用）。您在使用 Rancher 创建集群时可自由选择上述 CNI 网络插件。您也可以选择使用任何自定义的网络插件，但是需要您手动进行部署。

### Canal

![Canal Logo](/img/rancher/canal-logo.png)

Canal 是一种结合了 Flannel 和 Calico 优点的 CNI 网络方案。它允许用户把 Fannel 和 Calico 统一起来部署，把非封装网络的 Calico 中的网络策略强制以及封装网络的 Fannel 的连通能力结合起来。

Canal 网络为 Rancher 中默认的 CNI 网络插件，并默认采用 Flannel VXLAN 封装。

Kubernetes 节点应该开放 UDP 端口`8472` (VXLAN) 和 TCP 端口`9099` (健康检查)。详细要求请参见[下游集群端口要求.](/docs/cluster-provisioning/node-requirements/_index)

![Canal Diagram](/img/rancher/canal-diagram.png)

关于 Canal 的详细信息，可查阅[Canal 页面](https://github.com/projectcalico/canal)。

### Flannel

![Flannel Logo](/img/rancher/flannel-logo.png)

Flannel 一个为 Kubernetes 设计的简单易配置的 L3 网络方案。Flannel 在每个节点运行一个名为 flanneld 单一二进制 Agent，这个 Agent 用以从预配置的大地址空间里划分给每个节点分配的 subnet。Flannel 采用 Kubernetes API 或者直接 ETCD 存储网络配置、分配的 subnet 和附加的数据（如节点公网 IP）。数据包选择多种 backend 机制进行转发，默认的封装 backend 是[VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)。

封装的数据流默认是未加密的。但是，Flannel 提供了一种实验性的加密 backend，[IPSec](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#ipsec)。IPsec 通过[strongSwan](https://www.strongswan.org/)在 Kubernetes 节点间建立加密 IPsec 隧道。

Kubernetes 节点应该开放 UDP 端口`8472` (VXLAN) 和 TCP 端口`9099` (健康检查)。详细要求请参见[下游集群端口要求](/docs/cluster-provisioning/node-requirements/_index)。

![Flannel Diagram](/img/rancher/flannel-diagram.png)

关于 Canal 的详细信息，可查阅[Flannel 页面](https://github.com/coreos/flannel)。

### Calico

![Calico Logo](/img/rancher/calico-logo.png)

Calico 为跨云的 Kubernetes 集群提供了网络连通和网络策略。Calico 作为一个纯粹的非封装 IP 网络和策略引擎，为 Kubernetes 工作负载提供容器网络。工作负载可以通过公有云基础设施或私有云 BGP 协议进行互相通信。

Calico 也提供了无状态的 IP-in-IP 封装模式，同时提供隔离策略，这样被可以在使用 ingress 和 egress 策略来更安全地管理您的工作负载。

Kubernetes 节点应该开启 TCP 端口`179` (BGP)。详细要求请参见[下游集群端口要求](/docs/cluster-provisioning/node-requirements/_index)。

![Calico Diagram](/img/rancher/calico-diagram.svg)

更多信息，请参阅下列网页：

- [Calico 官网](https://www.projectcalico.org/)
- [Calico GitHub](https://github.com/projectcalico/calico)

### Weave

![Weave Logo](/img/rancher/weave-logo.png)

_自 v2.2.0 版本支持_

Weave 网络为跨云 Kubernetes 集群提供了网络连通和网络策略。另外，Weave 支持 peer 通信加密。

Kubernetes 节点应该开启 TCP 端口`6783` (控制端口)和 UDP 端口 `6783` 和 `6784`(数据端口)。详细要求请参见[下游集群端口要求](/docs/cluster-provisioning/node-requirements/_index)。

更多信息，请参阅下列网页：

- [Weave Net 官方网站](https://www.weave.works/)

## CNI 网络功能特性

下列表格总结了 Rancher 提供的各种 CNI 网络方案的差异对比。

| 网络方案 | 网络模型         | 路由分发 | 网络策略 | 跨集群网络 | 外部数据存储 | 加密   | Ingress/Egress 策略 |
| -------- | ---------------- | -------- | -------- | ---------- | ------------ | ------ | ------------------- |
| Canal    | 封装技术 (VXLAN) | 不支持   | 支持     | 不支持     | K8S API      | 不加密 | 支持                |
| Flannel  | 封装技术 (VXLAN) | 不支持   | 不支持   | 不支持     | K8S API      | 不加密 | 不支持              |
| Calico   | 非封装技术       | 支持     | 支持     | 支持       | Etcd         | 加密   | 支持                |
| Weave    | 封装技术         | 支持     | 支持     | 支持       | 不支持       | 加密   | 支持                |

- 网络模型：封装或非封装。更多信息，请查阅 [CNI 网络支持哪些网络模型?](#cni-采用了什么网络模型？)

- 路由分发：用于交换路由信息和路由可达性的外部网关协议。BGP 可以支持集群之间 pod-to-pod 的网络能力。路由分发是非封装 CNI 网络的必要条件，BGP 是最常见的实现。如果您想要建立多集群的跨网络分段的网络，路由分发是一个不错的选择。

- 网络策略：Kubernetes 提供了网络策略的能力，容器服务可以通过网络策略能力来与其他服务互相通信。网络策略功能在 Kubernetes v1.7 已进入 stable 并提供了相关的网络插件。

- 跨集群网络：不同 Kubernetes 集群之间的的服务通信。

- 外部数据存储：提供该特性的 CNI 网络方案需要配置外部数据存储。

- 加密：该特性允许网络数据加密。

- Ingress/Egress 网络策略：网络策略允许用户管理路由策略，无论是 Kubernetes 通信还是非 Kubernetes 网络通信。

### CNI 网络插件社区热度

下列表格总结了不同网络项目在 Github 上的热度指标。数据更新于 2020 一月。

| 网络方案 | Github 项目                             | Stars | Forks | 贡献者 |
| -------- | --------------------------------------- | ----- | ----- | ------ |
| Canal    | https://github.com/projectcalico/canal  | 614   | 89    | 19     |
| flannel  | https://github.com/coreos/flannel       | 4977  | 1.4k  | 140    |
| Calico   | https://github.com/projectcalico/calico | 1534  | 429   | 135    |
| Weave    | https://github.com/weaveworks/weave/    | 5737  | 559   | 73     |

## 如何选择 CNI 网络方案？

选择哪个网络方案取决于您项目的需求。上述网络方案拥有各自的功能特点，可能没有一个网络方案能满足所有人的需求。

自 Rancher v2.0.7 始，Canal 是 Rancher 的默认 CNI 网络方案。我们在大多数场景下推荐使用该网络方案，它提供了 Flannel 的封装容器网络方案，同时提供了 Calico 的网络策略。Rancher 采用 Canal 实现了项目/命名空间的网络隔离能力。

## 如何配置 CNI 网络方案？

请参阅 [Cluster 选项](/docs/cluster-provisioning/rke-clusters/options/_index)，获取关于如何配置 CNI 网络方案的指导。高级配置选项请参阅[配置文件](/docs/cluster-provisioning/rke-clusters/options/_index)和[网络插件](https://rancher.com/docs/rke/latest/en/config-options/add-ons/network-plugins/)相关文档。
