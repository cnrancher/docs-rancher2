---
title: 安装要求介绍
description: K3s 非常轻巧，但有一些最低要求，如下所述。无论您是将 K3s 集群配置为在 Docker 还是 Kubernetes 设置中运行，运行 K3s 的每个节点都应该满足以下最低要求。你可能需要更多的资源来满足你的需求。
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
  - 安装要求介绍
---

K3s 非常轻巧，但有一些最低要求，如下所述。

无论您是将 K3s 集群配置为在 Docker 还是 Kubernetes 设置中运行，运行 K3s 的每个节点都应该满足以下最低要求。你可能需要更多的资源来满足你的需求。

## 先决条件

-两个节点不能有相同的主机名。如果您的所有节点都有相同的主机名，请使用`--with-node-id`选项为每个节点添加一个随机后缀，或者为您添加到集群的每个节点设计一个独特的名称，用`--node-name`或`$K3S_NODE_NAME`传递。

## 操作系统

K3s 有望在大多数现代 Linux 系统上运行。

有些操作系统有特定要求：

- 如果您使用的是**Raspbian Buster**，请按照[这些步骤](/docs/k3s/advanced/_index#在-raspbian-buster-上启用旧版的-iptables)切换到传统的 iptables。
- 如果您使用的是**Alpine Linux**，请按照[这些步骤](/docs/k3s/advanced/_index#alpine-linux-安装的额外准备工作)进行额外设置。
- 如果您使用的是**Red Hat/CentOS**，请按照[这些步骤](/docs/k3s/advanced/_index#Red-Hat-和-CentOS-的额外准备)进行额外设置。

关于 Rancher 管理的 K3s 集群测试了哪些操作系统的更多信息，请参考[Rancher 支持和维护条款。](https://rancher.com/support-maintenance-terms/)

## 硬件

硬件要求根据您部署的规模而变化。这里列出了最低建议。

### CPU 和内存

- CPU： 最低 1
- 内存： 最低 512MB（建议至少为 1GB）

[本节](/docs/k3s/installation/installation-requirements/resource-profiling/_index)的测试结果是为了确定 K3s agent、具有工作负载的 K3s server 和具有一个 agent 的 K3s server 的最低资源要求。它还包含了有关对 K3s server 和 agent 利用率产生最大影响的分析，以及如何保护集群数据存储免受 agent 和工作负载的干扰。

### 磁盘

K3s 的性能取决于数据库的性能。为了确保最佳速度，我们建议尽可能使用 SSD。在使用 SD 卡或 eMMC 的 ARM 设备上，磁盘性能会有所不同。

## 网络

K3s server 需要 6443 端口才能被所有节点访问。

当使用 Flannel VXLAN 时，节点需要能够通过 UDP 端口 8472 访问其他节点，或者当使用 Flannel Wireguard 后端时，节点需要能够通过 UDP 端口 51820 和 51821（使用 IPv6 时）访问其他节点。该节点不应侦听任何其他端口。 K3s 使用反向隧道，以便节点与服务器建立出站连接，并且所有 kubelet 流量都通过该隧道运行。但是，如果你不使用 Flannel 并提供自己的自定义 CNI，那么 K3s 不需要 Flannel 所需的端口。

如果要使用`metrics server`，则需要在每个节点上打开端口 10250 端口。

如果计划使用嵌入式 etcd 实现高可用性，则 server 节点必须在端口 2379 和 2380 上可以相互访问。

:::important 重要
节点上的 VXLAN 端口不应公开暴露，因为它公开了集群网络，任何人都可以访问它。应在禁止访问端口 8472 的防火墙/安全组后面运行节点。
:::

> **警告：** Flannel 依靠 [Bridge CNI plugin](https://www.cni.dev/plugins/current/main/bridge/) 来创建一个可以交换流量的 L2 网络。具有 NET_RAW 功能的 Rogue pod 可以滥用该 L2 网络来发动攻击，如 [ARP 欺骗](https://static.sched.com/hosted_files/kccncna19/72/ARP%20DNS%20spoof.pdf)。因此，正如 [kubernetes 文档](https://kubernetes.io/docs/concepts/security/pod-security-standards/)中记载的那样，请设置一个受限配置文件，在不可信任的 pod 上禁用 NET_RAW。

K3s Server 节点的入站规则如下：

| 协议 | 端口      | 源                       | 描述                                          |
| :--- | :-------- | :----------------------- | :-------------------------------------------- |
| TCP  | 6443      | K3s agent 节点           | Kubernetes API Server                         |
| UDP  | 8472      | K3s server 和 agent 节点 | 仅对 Flannel VXLAN 需要                       |
| UDP  | 51820     | K3s server 和 agent 节点 | 只有 Flannel Wireguard 后端需要               |
| UDP  | 51821     | K3s server 和 agent 节点 | 只有使用 IPv6 的 Flannel Wireguard 后端才需要 |
| TCP  | 10250     | K3s server 和 agent 节点 | Kubelet metrics                               |
| TCP  | 2379-2380 | K3s server 节点          | 只有嵌入式 etcd 高可用才需要                  |

通常情况下，所有出站流量都是允许的。

## 大型集群

硬件要求取决于您的 K3s 集群的大小。对于生产和大型集群，我们建议使用具有外部数据库的高可用性设置。对于生产中的外部数据库，建议使用以下选项：

- MySQL
- PostgreSQL
- etcd

### CPU 和 内存

以下是高可用 K3s server 中节点的最低 CPU 和内存要求：

| 部署规模 | 节点      | VCPUS | 内存  |
| :------- | :-------- | :---- | :---- |
| Small    | Up to 10  | 2     | 4 GB  |
| Medium   | Up to 100 | 4     | 8 GB  |
| Large    | Up to 250 | 8     | 16 GB |
| X-Large  | Up to 500 | 16    | 32 GB |
| XX-Large | 500+      | 32    | 64 GB |

### 磁盘

集群性能取决于数据库性能。为了确保最佳的读写速度，我们建议始终使用 SSD 磁盘来支持你的 K3s 集群。在云提供商上，您还需要使用允许最大 IOPS 的最小 size。

### 网络

你应该考虑增加集群 CIDR 的子网大小，以免 Pod 的 IP 耗尽。你可以通过在启动时向 K3s 服务器传递`--cluster-cidr`选项来实现。

### 数据库

K3s 支持不同的数据库，包括 MySQL、PostgreSQL、MariaDB 和 etcd，以下是运行大型集群所需的数据库资源的大小指南：

| 部署规模 | 节点      | VCPUS | 内存  |
| :------- | :-------- | :---- | :---- |
| Small    | Up to 10  | 1     | 2 GB  |
| Medium   | Up to 100 | 2     | 8 GB  |
| Large    | Up to 250 | 4     | 16 GB |
| X-Large  | Up to 500 | 8     | 32 GB |
| XX-Large | 500+      | 16    | 64 GB |
