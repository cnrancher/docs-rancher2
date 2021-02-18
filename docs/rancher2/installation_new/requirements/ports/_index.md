---
title: 端口要求
description: 为了保证正常运行，Rancher 要求在 Rancher 节点和下游 Kubernetes 集群节点上开放一些端口。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 安装指南
  - 安装要求
  - 端口要求
---

为了保证正常运行，Rancher 要求在 Rancher 节点和下游 Kubernetes 集群节点上开放一些端口。

## Rancher 节点

下表列出了运行 Rancher Server 的节点之间需要开放的端口。

端口要求因 Rancher 是安装在 K3s Kubernetes 集群，RKE Kubernetes 集群还是单个 Docker 容器中而有所不同。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="k3s"
values={[
{ label: 'K3s', value: 'k3s', },
{ label: 'RKE', value: 'rke', },
{ label: 'Docker', value: 'docker', },
{ label: 'RancherD', value: 'RancherD', },
]}>

<TabItem value="k3s">

K3s Server 需要开放 6443 端口供节点访问。

使用 Flannel VXLAN 时，这些节点需要能够通过 UDP 端口 8472 访问其他节点。节点不应侦听其他端口。K3s 使用反向隧道，建立节点与服务器的出站连接，所有 kubelet 通信都通过该隧道进行。但是，如果您不使用 Flannel，而是使用自定义的 CNI，则 K3s 不需要 8472 端口。

如果要使用指标服务器（Metrics Server），则需要在每个节点上开放端口 10250。

> **重要：** 节点上的 VXLAN 端口不应暴露给外界，因为这会开放集群网络，任何人都可以访问它。请在禁止访问 8472 端口的防火墙/安全组后面运行节点。

<figcaption> Rancher Server 节点的入站规则</figcaption>

| 协议 | 端口  | 源                       | 描述               |
| ---- | ----- | ------------------------ | ------------------ |
| TCP  | 6443  | K3s server 节点          | Kubernetes API     |
| UDP  | 8472  | K3s server 和 agent 节点 | Flannel VXLAN 需要 |
| TCP  | 10250 | K3s server 和 agent 节点 | kubelet            |

通常情况下，可以允许全部出站流量。

</TabItem>

<TabItem value="rke">

<figcaption>Rancher 节点的入站规则</figcaption>

| 协议 | 端口 | 源                                                                                  | 描述                            |
| ---- | ---- | ----------------------------------------------------------------------------------- | ------------------------------- |
| TCP  | 80   | 负载均衡或反向代理                                                                  | 到 Rancher UI/API 的 HTTP 流量  |
| TCP  | 443  | <ul><li>负载均衡或反向代理</li><li>所有集群节点的 IP 和其他 API/UI 客户端</li></ul> | 到 Rancher UI/API 的 HTTPS 流量 |

<figcaption>Rancher 节点的出站规则</figcaption>

| 协议 | 端口         | 目的                                                     | 描述                                             |
| ---- | ------------ | -------------------------------------------------------- | ------------------------------------------------ |
| TCP  | 22           | 使用主机驱动创建的节点中的任何节点 IP                    | 使用主机驱动通过 SSH 进行节点配置                |
| TCP  | 443          | `35.160.43.145/32`，`35.167.242.46/32`，`52.33.59.17/32` | git.rancher.io (应用商店)                        |
| TCP  | 2376         | 使用主机驱动创建的节点中的任何节点 IP                    | Docker Machine 使用的 Docker 守护进程的 TLS 端口 |
| TCP  | 取决于供应商 | 托管集群的 Kubernetes API 端口                           | Kubernetes API                                   |

</TabItem>

<TabItem value="RancherD">
RancherD（或RKE2）服务器需要6443和9345端口才能被集群中的其他节点访问。

当使用 Flannel VXLAN 时，所有节点都需要能够通过 UDP 端口 8472 到达其他节点。

如果希望利用度量服务器，则需要在每个节点上打开 10250 端口。

重要的是：节点上的 VXLAN 端口不应该暴露在世界范围内，因为它打开了你的集群网络，任何人都可以访问。在防火墙/安全组后面运行您的节点，禁止访问端口 8472。

RancherD 或 RKE2 服务器节点的入站规则如下：

| 协议  | 端口        | 源                                                                                                                 | 描述                                                                                     |
| ----- | ----------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| TCP   | 9345        | RancherD/RKE2 agent nodes                                                                                          | Kubernetes API                                                                           |
| TCP   | 6443        | RancherD/RKE2 agent nodes                                                                                          | Kubernetes API                                                                           |
| UDP   | 8472        | RancherD/RKE2 server and agent nodes                                                                               | Required only for Flannel VXLAN                                                          |
| TCP   | 10250       | RancherD/RKE2 server and agent nodes                                                                               | kubelet                                                                                  |
| TCP   | 2379        | RancherD/RKE2 server nodes                                                                                         | etcd client port                                                                         |
| TCP   | 2380        | RancherD/RKE2 server nodes                                                                                         | etcd peer port                                                                           |
| TCP   | 30000-32767 | RancherD/RKE2 server and agent nodes                                                                               | NodePort port range                                                                      |
| HTTP  | 8080        | Load balancer/proxy that does external SSL termination                                                             | Rancher UI/API when external SSL termination is used                                     |
| HTTPS | 8443        | <ul><li>hosted/imported Kubernetes</li><li>any source that needs to be able to use the Rancher UI or API</li></ul> | Rancher agent, Rancher UI/API, kubectl. Not needed if you have LB doing TLS termination. |

</TabItem>

<TabItem value="docker">

<figcaption>Rancher 节点的入站规则</figcaption>

| 协议 | 端口 | 源                                                                          | 描述                                   |
| ---- | ---- | --------------------------------------------------------------------------- | -------------------------------------- |
| TCP  | 80   | 在外部进行 TLS 终止的负载均衡或反向代理                                     | 使用外部 TLS 终止时的 Rancher UI/API   |
| TCP  | 443  | <ul><li>导入的/托管的 Kubernetes</li><li>所有需要使用 API/UI 的源</li></ul> | Rancher agent，Rancher UI/API，kubectl |

<figcaption>Rancher 节点的出站规则</figcaption>

| 协议 | 端口         | 目的                                                     | 描述                                             |
| ---- | ------------ | -------------------------------------------------------- | ------------------------------------------------ |
| TCP  | 22           | 使用主机驱动创建的节点中的任何节点 IP                    | 使用主机驱动通过 SSH 进行节点配置                |
| TCP  | 443          | `35.160.43.145/32`，`35.167.242.46/32`，`52.33.59.17/32` | git.rancher.io (应用商店)                        |
| TCP  | 2376         | 使用主机驱动创建的节点中的任何节点 IP                    | Docker Machine 使用的 Docker 守护进程的 TLS 端口 |
| TCP  | 取决于供应商 | 托管集群的 Kubernetes API 端口                           | Kubernetes API                                   |

</TabItem>

</Tabs>

> **注意：**
>
> - 如果您配置了的外部[身份验证系统](/docs/rancher2/admin-settings/authentication/_index)（例如 LDAP），Rancher 节点可能还需要其他出站规则。
> - Kubernetes 建议将 TCP 30000-32767 用于节点端口服务（NodePort svc）。
> - 可能需要对防火墙进行配置，启用在集群和 Pod CIDR 中的流量。

## 下游 Kubernetes 集群节点

下游 Kubernetes 集群可运行您的业务应用。本节介绍需要在下游集群中的节点上开放哪些端口，以便 Rancher 可以与它们进行通信。

集群节点需要开放的端口会根据集群的启动方式而变化。下面列出了需要为不同[集群创建类型](/docs/rancher2/cluster-provisioning/_index)开放的端口。

> **提示：**
>
> 如果安全不是一个大问题，并且可以开放一些其他端口，可以将[常用端口](#常用端口)作为端口参考，而不是使用下面的完整列表。

### 节点池中节点的端口要求

下表描述了在[基础设施提供商](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/_index)中创建节点用于[Rancher 启动 Kubernetes](/docs/rancher2/cluster-provisioning/rke-clusters/_index)的端口需求。

> **注意：**
> 在 Amazon EC2 或阿里云等云提供商中创建集群时，Rancher 会自动开放所需的端口。

import PortsIaasNodes from '@theme/PortsIaasNodes';

<PortsIaasNodes/>

### 自定义节点的端口要求

下表描述了带有[自定义节点](/docs/rancher2/cluster-provisioning/rke-clusters/custom-nodes/_index)的[RKE 集群](/docs/rancher2/cluster-provisioning/rke-clusters/_index)的端口要求。

import PortsCustomNodes from '@theme/PortsCustomNodes';

<PortsCustomNodes/>

### 托管集群的端口要求

下表描述了[托管集群](/docs/rancher2/cluster-provisioning/hosted-kubernetes-clusters/_index)的端口要求。

import PortsImportedHosted from '@theme/PortsImportedHosted';

<PortsImportedHosted/>

### 导入集群的端口要求

下表描述了[导入集群](/docs/rancher2/cluster-provisioning/imported-clusters/_index)的端口要求。

<PortsImportedHosted/>

## 其他端口注意事项

### 常用端口

通常情况下，可以将这些端口在 Kubernetes 节点上开放，无论它是哪种类型的集群。

|  协议   |    端口     | 描述                                             |
| :-----: | :---------: | ------------------------------------------------ |
|   TCP   |     22      | 使用主机驱动通过 SSH 进行节点配置                |
|   TCP   |    2376     | 主机驱动与 Docker 守护进程通信的 TLS 端口        |
|   TCP   |    2379     | etcd 客户端请求                                  |
|   TCP   |    2380     | etcd 节点通信                                    |
|   UDP   |    8472     | Canal/Flannel VXLAN overlay 网络                 |
|   UDP   |    4789     | Windows 集群中 Flannel VXLAN overlay 网络        |
|   TCP   |    9099     | Canal/Flannel 健康检查                           |
|   TCP   |    9796     | 集群监控拉取节点指标的默认端口（仅需要内网可达） |
|   TCP   |    6783     | Weave 端口                                       |
|   UDP   |  6783-6784  | Weave UDP 端口                                   |
|   TCP   |    10250    | kubelet API                                      |
|   TCP   |    10254    | Ingress controller 健康检查                      |
| TCP/UDP | 30000-32767 | NodePort 端口范围                                |

---

### 本地节点流量

标记为`local traffic`（即: 9099 TCP）的端口用于 Kubernetes 健康检查(`livenessProbe` 和`readinessProbe`)。这些健康检查在节点本身上执行。在大多数云环境中，默认情况下会允许此本地流量。

但是在以下情况下，此流量可能会被阻止：

- 您已在节点上应用了严格的主机防火墙策略。
- 您正在使用具有多个接口（多宿主）的节点。

在这些情况下，您必须在您的主机防火墙，或者在公有/私有云托管机器(AWS 或 OpenStack)安全组配置中显式地允许这些流量。请记住，在将安全组用作安全组中的源或目标时，显式打开端口只适用于节点/实例的私有接口。

### Rancher AWS EC2 安全组

在使用[AWS EC2 主机驱动](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/ec2/_index)在 Rancher 中配置集群节点时，您可以选择让 Rancher 创建一个名为 rancher-nodes 的安全组。以下规则将自动添加到此安全组。

| 类型            | 协议 |  端口范围   | 源/目的                | 规则类型 |
| --------------- | :--: | :---------: | ---------------------- | :------: |
| SSH             | TCP  |     22      | 0.0.0.0/0              |   入站   |
| HTTP            | TCP  |     80      | 0.0.0.0/0              |   入站   |
| 自定义 TCP 规则 | TCP  |     443     | 0.0.0.0/0              |   入站   |
| 自定义 TCP 规则 | TCP  |    2376     | 0.0.0.0/0              |   入站   |
| 自定义 TCP 规则 | TCP  |  2379-2380  | sg-xxx (rancher-nodes) |   入站   |
| 自定义 UDP 规则 | UDP  |    4789     | sg-xxx (rancher-nodes) |   入站   |
| 自定义 TCP 规则 | TCP  |    6443     | 0.0.0.0/0              |   入站   |
| 自定义 UDP 规则 | UDP  |    8472     | sg-xxx (rancher-nodes) |   入站   |
| 自定义 TCP 规则 | TCP  | 10250-10252 | sg-xxx (rancher-nodes) |   入站   |
| 自定义 TCP 规则 | TCP  |    10256    | sg-xxx (rancher-nodes) |   入站   |
| 自定义 TCP 规则 | TCP  | 30000-32767 | 0.0.0.0/0              |   入站   |
| 自定义 UDP 规则 | UDP  | 30000-32767 | 0.0.0.0/0              |   入站   |
| 全部流量        | All  |     All     | 0.0.0.0/0              |   出站   |

### 打开 SUSE Linux Portslink

SUSE Linux 可能有一个默认情况下会阻止所有端口的防火墙。要打开将主机添加到自定义集群所需的端口。

1. SSH 进入实例。
2. 编辑/etc/sysconfig/SuSEfirewall2，打开所需端口。在本例中，也打开 9796 和 10250 端口进行监控。FW_SERVICES_EXT_TCP="22 80 443 2376 2379 2380 6443 9099 9796 10250 10254 30000:32767" FW_SERVICES_EXT_UDP="8472 30000:32767" FW_ROUTE=yes
3. 用新的端口重新启动防火墙。SuSEfirewall2

结果：该节点拥有添加到自定义集群所需的开放端口。节点有开放的端口，需要添加到自定义集群。
