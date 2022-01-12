---
title: 端口要求
description: 了解 Rancher 正常运行所需的端口要求，包括 Rancher 节点和下游 Kubernetes 集群节点
weight: 300
---

为了确保能正常运行，Rancher 需要在 Rancher 节点和下游 Kubernetes 集群节点上开放一些端口。

- [Rancher 节点](#rancher-nodes)
   - [K3s 上 Rancher Server 节点的端口](#ports-for-rancher-server-nodes-on-k3s)
   - [RKE 上 Rancher Server 节点的端口](#ports-for-rancher-server-nodes-on-rke)
   - [RKE2 上 Rancher Server 节点的端口](#ports-for-rancher-server-nodes-on-rke2)
   - [Docker 安装的 Rancher Server 的端口](#ports-for-rancher-server-in-docker)
- [下游 Kubernetes 集群节点](#downstream-kubernetes-cluster-nodes)
   - [Rancher 使用节点池启动 Kubernetes 集群的端口](#ports-for-rancher-launched-kubernetes-clusters-using-node-pools)
   - [Rancher 使用自定义节点启动 Kubernetes 集群的端口](#ports-for-rancher-launched-kubernetes-clusters-using-custom-nodes)
   - [托管 Kubernetes 集群的端口](#ports-for-hosted-kubernetes-clusters)
   - [已注册集群的端口](#ports-for-registered-clusters)
- [其他端口注意事项](#other-port-considerations)
   - [常用端口](#commonly-used-ports)
   - [本地节点流量](#local-node-traffic)
   - [Rancher AWS EC2 安全组](#rancher-aws-ec2-security-group)
   - [打开 SUSE Linux 端口](#opening-suse-linux-ports)

# Rancher 节点

下表列出了运行 Rancher Server 的节点之间需要开放的端口。

不同的 Rancher Server 架构有不同的端口要求。

Rancher 可以安装在任何 Kubernetes 集群上。如果你的 Rancher 安装在 K3s、RKE 或 RKE2 Kubernetes 集群上，请参考下面的标签页。对于其他 Kubernetes 发行版，请参见该发行版的文档，了解集群节点的端口要求。

> **注意**：
>
> - Rancher 节点可能要求额外出站访问已配置的外部验证提供程序（如 LDAP）。
> - Kubernetes 建议节点端口服务使用 TCP 30000-32767。
> - 对于防火墙，可能需要在集群和 Pod CIDR 内启用流量。
> - Rancher 节点可能还需要出站访问用于存储集群备份（如 Minio）的外部 S3 上的位置。

### K3s 上 Rancher Server 节点的端口



K3s server 需要开放端口 6443 才能供节点访问。

使用 Flannel VXLAN 时，节点需要能够通过 UDP 端口 8472 访问其他节点。节点不应监听任何其他端口。K3s 使用反向隧道，建立节点与 Server 的出站连接，所有 kubelet 流量都通过该隧道进行。但是，如果你不使用 Flannel，而是使用自定义的 CNI，K3s 则不需要打开 8472 端口。

如果要使用 Metrics Server，则需要在每个节点上打开端口 10250。

> **重要提示**：节点上的 VXLAN 端口会开放集群网络，让任何人均能访问集群。因此，不要将 VXLAN 端口暴露给外界。请使用禁用 8472 端口的防火墙/安全组来运行节点。

下表描述了入站和出站流量的端口要求：

<figcaption>Rancher Server 节点的入站规则</figcaption>

| 协议 | 端口 | 源 | 描述 |
|-----|-----|----------------|---|
| TCP | 80 | 执行外部 SSL 终止的负载均衡器/代理 | 使用外部 SSL 终止时的 Rancher UI/API |
| TCP | 443 | <ul><li>Server 节点</li><li>Agent 节点</li><li>托管/注册的 Kubernetes</li><li>任何需要使用 Rancher UI 或 API 的源</li></ul> | Rancher Agent，Rancher UI/API，kubectl |
| TCP | 6443 | K3s Server 节点 | Kubernetes API |
| UDP | 8472 | K3s Server 和 Agent 节点 | 仅 Flannel VXLAN 需要 |
| TCP | 10250 | K3s Server 和 Agent 节点 | kubelet |

<figcaption>Rancher 节点的出站规则</figcaption>

| 协议 | 端口 | 目标 | 描述 |
| -------- | ---- | -------------------------------------------------------- | --------------------------------------------- |
| TCP | 22 | 使用 Node Driver 创建的节点的任何节点 IP | 使用 Node Driver SSH 配置节点 |
| TCP | 443 | git.rancher.io | Rancher catalog |
| TCP | 2376 | 使用 Node Driver 创建的节点的任何节点 IP | Docker Machine 使用的 Docker daemon TLS 端口 |
| TCP | 6443 | 托管/导入的 Kubernetes API | Kubernetes API 服务器 |



### RKE 上 Rancher Server 节点的端口



通常情况下，Rancher 安装在三个 RKE 节点上，这些节点都有 etcd、control plane 和 worker 角色。



下表描述了 Rancher 节点之间流量的端口要求：

<figcaption>Rancher 节点的流量规则</figcaption>

| 协议 | 端口 | 描述 |
|-----|-----|----------------|
| TCP | 443 | Rancher Agent |
| TCP | 2379 | etcd 客户端请求 |
| TCP | 2380 | etcd 对等通信 |
| TCP | 6443 | Kubernetes apiserver |
| UDP | 8472 | Canal/Flannel VXLAN 覆盖网络 |
| TCP | 9099 | Canal/Flannel livenessProbe/readinessProbe |
| TCP | 10250 | Metrics Server 与所有节点的通信 |
| TCP | 10254 | Ingress controller livenessProbe/readinessProbe |

下表描述了入站和出站流量的端口要求：

<figcaption>Rancher 节点的入站规则</figcaption>

| 协议 | 端口 | 源 | 描述 |
|-----|-----|----------------|---|
| TCP | 22 | RKE CLI | RKE 通过 SSH 配置节点 |
| TCP | 80 | 负载均衡器/反向代理 | 到 Rancher UI/API 的 HTTP 流量 |
| TCP | 443 | <ul><li>负载均衡器/反向代理</li><li>所有集群节点和其他 API/UI 客户端的 IP</li></ul> | 到 Rancher UI/API 的 HTTPS 流量 |
| TCP | 6443 | Kubernetes API 客户端 | 到 Kubernetes API 的 HTTPS 流量 |

<figcaption>Rancher 节点的出站规则</figcaption>

| 协议 | 端口 | 目标 | 描述 |
|-----|-----|----------------|---|
| TCP | 443 | `35.160.43.145`，`35.167.242.46`，`52.33.59.17` | Rancher catalog（git.rancher.io） |
| TCP | 22 | 使用 Node Driver 创建的任何节点 | Node Driver 通过 SSH 配置节点 |
| TCP | 2376 | 使用 Node Driver 创建的任何节点 | Node Driver 使用的 Docker daemon TLS 端口 |
| TCP | 6443 | 托管/导入的 Kubernetes API | Kubernetes API 服务器 |
| TCP | 提供商依赖 | 托管集群中 Kubernetes API 端点的端口 | Kubernetes API |



### RKE2 上 Rancher Server 节点的端口



RKE2 server 需要开放端口 6443 和 9345 才能供集群中的其他节点访问。

使用 Flannel VXLAN 时，所有节点都需要能够通过 UDP 端口 8472 访问其他节点。

如果要使用 Metrics Server，则需要在每个节点上打开端口 10250。

**重要提示**：节点上的 VXLAN 端口会开放集群网络，让任何人均能访问集群。因此，不要将 VXLAN 端口暴露给外界。请使用禁用 8472 端口的防火墙/安全组来运行节点。

<figcaption>RKE2 Server 节点的入站规则</figcaption>

| 协议 | 端口 | 源 | 描述 |
|-----|-----|----------------|---|
| TCP | 9345 | RKE2 Agent 节点 | Kubernetes API |
| TCP | 6443 | RKE2 Agent 节点 | Kubernetes API |
| UDP | 8472 | RKE2 Server 和 Agent 节点 | 仅 Flannel VXLAN 需要 |
| TCP | 10250 | RKE2 Server 和 Agent 节点 | kubelet |
| TCP | 2379 | RKE2 Server 节点 | etcd 客户端端口 |
| TCP | 2380 | RKE2 Server 节点 | etcd 对等端口 |
| TCP | 30000-32767 | RKE2 Server 和 Agent 节点 | NodePort 端口范围 |
| TCP | 5473 | Calico-node pod 连接到 typha pod | 使用 Calico 部署时需要 |
| HTTP | 8080 | 执行外部 SSL 终止的负载均衡器/代理 | 使用外部 SSL 终止时的 Rancher UI/API |
| HTTPS | 8443 | <ul><li>托管/注册的 Kubernetes</li><li>任何需要使用 Rancher UI 或 API 的源</li></ul> | Rancher Agent，Rancher UI/API，kubectl。如果负载均衡执行 TLS 终止，则不需要。 |

所有出站流量通常都是允许的。


### Docker 安装的 Rancher Server 的端口



下表描述了 Rancher 节点入站和出站流量的端口要求：

<figcaption>Rancher 节点的入站规则</figcaption>

| 协议 | 端口 | 源 | 描述 |
|-----|-----|----------------|---|
| TCP | 80 | 执行外部 SSL 终止的负载均衡器/代理 | 使用外部 SSL 终止时的 Rancher UI/API |
| TCP | 443 | <ul><li>托管/注册的 Kubernetes</li><li>任何需要使用 Rancher UI 或 API 的源</li></ul> | Rancher Agent，Rancher UI/API，kubectl |

<figcaption>Rancher 节点的出站规则</figcaption>

| 协议 | 端口 | 源 | 描述 |
|-----|-----|----------------|---|
| TCP | 22 | 使用 Node Driver 创建的节点的任何节点 IP | 使用 Node Driver SSH 配置节点 |
| TCP | 443 | git.rancher.io | Rancher catalog |
| TCP | 2376 | 使用 Node Driver 创建的节点的任何节点 IP | Docker Machine 使用的 Docker daemon TLS 端口 |
| TCP | 6443 | 托管/导入的 Kubernetes API | Kubernetes API 服务器 |



# 下游 Kubernetes 集群节点

下游 Kubernetes 集群用于运行你的应用和服务。本节介绍了哪些端口需要在下游集群的节点上打开，以便 Rancher 能够与它们进行通信。

不同的下游集群的启动方式有不同的端口要求。下面的每个标签都列出了不同[集群类型]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/)所需打开的端口。

下图描述了为每个[集群类型]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning)打开的端口。

<figcaption>Rancher 管理面板的端口要求</figcaption>

![基本端口要求]({{<baseurl>}}/img/rancher/port-communications.svg)

> **提示**：
>
> 如果你对安全性的关注不是太高，而且也愿意多打开几个端口，你可以参考[常用端口](#commonly-used-ports)中列出的端口，而不是参考下方的表格。

### Rancher 使用节点池启动 Kubernetes 集群的端口



下表描述了节点在[云提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/)中创建的情况下，[Rancher 启动 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 的端口要求。

> **注意**：
> 在 AWS EC2 或 DigitalOcean 等云提供商中创建集群期间，Rancher 会自动打开所需的端口。

{{< ports-iaas-nodes >}}



### Rancher 使用自定义节点启动 Kubernetes 集群的端口



下表描述了使用[自定义节点]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes/)的情况下，[Rancher 启动 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 的端口要求。

{{< ports-custom-nodes >}}



### 托管 Kubernetes 集群的端口



下表描述了[托管集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters)的端口要求。

{{< ports-imported-hosted >}}



### 注册集群的端口

注意：在 Rancher 2.5 之前，注册集群被称为导入集群。



下表描述了[注册集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/registered-clusters/)的端口要求。

{{< ports-imported-hosted >}}




# 其他端口注意事项

### 常用端口

无论集群是什么类型，常用端口通常在你的 Kubernetes 节点上打开。

{{% include file="/rancher/v2.6/en/installation/requirements/ports/common-ports-table" %}}

----

### 本地节点流量

上述要求中标记为`本地流量`（例如 `9099 TCP`）的端口会用于 Kubernetes 健康检查 （`livenessProbe` 和 `readinessProbe`）。
这些健康检查是在节点本身执行的。在大多数云环境中，这种本地流量是默认允许的。

但是，在以下情况下可能会阻止此流量：

- 你已在节点上应用了严格的主机防火墙策略。
- 你正在使用有多个接口（多宿主）的节点。

在这些情况下，你必须在你的主机防火墙中主动允许这种流量，如果是公共/私有云托管的机器（例如 AWS 或 OpenStack），你需要在你的安全组配置中主动允许此流量。请记住，如果你在安全组中使用安全组作为源或目标，主动开放端口只适用于节点/实例的私有接口。

### Rancher AWS EC2 安全组

当你使用 [AWS EC2 Node Driver]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/ec2/) 在 Rancher 中配置集群节点时，你可以让 Rancher 创建一个名为 `rancher-nodes` 的安全组。以下规则会自动添加到该安全组中。

| 类型 | 协议 | 端口范围 | 源/目标 | 规则类型 |
|-----------------|:--------:|:-----------:|------------------------|:---------:|
| SSH | TCP | 22 | 0.0.0.0/0 | 入站 |
| HTTP | TCP | 80 | 0.0.0.0/0 | 入站 |
| 自定义 TCP 规则 | TCP | 443 | 0.0.0.0/0 | 入站 |
| 自定义 TCP 规则 | TCP | 2376 | 0.0.0.0/0 | 入站 |
| 自定义 TCP 规则 | TCP | 2379-2380 | sg-xxx (rancher-nodes) | 入站 |
| 自定义 UDP 规则 | UDP | 4789 | sg-xxx (rancher-nodes) | 入站 |
| 自定义 TCP 规则 | TCP | 6443 | 0.0.0.0/0 | 入站 |
| 自定义 UDP 规则 | UDP | 8472 | sg-xxx (rancher-nodes) | 入站 |
| 自定义 TCP 规则 | TCP | 10250-10252 | sg-xxx (rancher-nodes) | 入站 |
| 自定义 TCP 规则 | TCP | 10256 | sg-xxx (rancher-nodes) | 入站 |
| 自定义 TCP 规则 | TCP | 30000-32767 | 0.0.0.0/0 | 入站 |
| 自定义 UDP 规则 | UDP | 30000-32767 | 0.0.0.0/0 | 入站 |
| 所有流量 | 全部 | 全部 | 0.0.0.0/0 | 出站 |

### 打开 SUSE Linux 端口

SUSE Linux 可能有一个防火墙，默认情况下会阻止所有端口。要打开将主机添加到自定义集群所需的端口：

{{% tabs %}}
{{% tab "SLES 15 / openSUSE Leap 15" %}}
1. SSH 进入实例。
1. 以文本模式启动 YaST：
```
sudo yast2
```

1. 导航到**安全和用户** > **防火墙** > **区域：公共** > **端口**。要在界面内导航，请参照[指示](https://doc.opensuse.org/documentation/leap/reference/html/book.opensuse.reference/cha-yast-text.html#sec-yast-cli-navigate)。
1. 要打开所需的端口，把它们输入到 **TCP 端口** 和 **UDP 端口** 字段。在这个例子中，端口 9796 和 10250 也被打开，用于监控。由此产生的字段应类似于以下内容：
```yaml
TCP Ports
22, 80, 443, 2376, 2379, 2380, 6443, 9099, 9796, 10250, 10254, 30000-32767
UDP Ports
8472, 30000-32767
```

1. 所有必须端口都输入后，选择**接受**。

</TabItem>
{{% tab "SLES 12 / openSUSE Leap 42" %}}
1. SSH 进入实例。
1. 编辑 /`etc/sysconfig/SuSEfirewall2` 并打开所需的端口。在这个例子中，端口 9796 和 10250 也被打开，用于监控。
```
FW_SERVICES_EXT_TCP="22 80 443 2376 2379 2380 6443 9099 9796 10250 10254 30000:32767"
FW_SERVICES_EXT_UDP="8472 30000:32767"
FW_ROUTE=yes
```
1. 用新的端口重启防火墙：
```
SuSEfirewall2
```
</TabItem>
</Tabs>

**结果** ：该节点已打开添加到自定义集群所需的端口。
