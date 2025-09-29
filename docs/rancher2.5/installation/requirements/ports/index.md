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

下表列出了运行 Rancher Server 的节点之间需要开放的端口。根据 Rancher Server 的架构，端口的要求有所不同。

从 Rancher v2.5 开始，Rancher 可以安装在任何 Kubernetes 集群上。对于 Rancher 安装在 K3s、RKE 或 RKE2 Kubernetes 集群上，请参考下面的标签。对于其他 Kubernetes 发行版，请参考该发行版的文档，了解集群节点的端口要求。

> **注意：**
>
> - Rancher 节点可能还需要为外部认证（例如 LDAP）提供额外的出站访问。
> - Kubernetes 建议 NodePort 端口使用 TCP 30000-32767。
> - 对于防火墙，可能需要在集群和 pod CIDR 内启用流量。

### K3s 上 Rancher Server 节点的端口

K3s Server 需要开放 6443 端口供节点访问。

使用 Flannel VXLAN 时，这些节点需要能够通过 UDP 端口 8472 访问其他节点。节点不应侦听其他端口。K3s 使用反向隧道，建立节点与 Server 的出站连接，所有 kubelet 通信都通过该隧道进行。但是，如果您不使用 Flannel，而是使用自定义的 CNI，则 K3s 不需要 8472 端口。

如果要使用 Metrics Server，则需要在每个节点上开放端口 10250。

:::important 重要
节点上的 VXLAN 端口不应暴露给外界，因为这会开放集群网络，任何人都可以访问它。请在禁止访问 8472 端口的防火墙/安全组后面运行节点。
:::

<figcaption> Rancher Server 节点的入站规则</figcaption>

| 协议 | 端口  | 来源                                                                                                                            | 描述                                   |
| ---- | ----- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| TCP  | 80    | Load balancer/proxy，做外部 SSL 终端                                                                                            | 使用外部 SSL 终止时的 Rancher UI/API   |
| TCP  | 443   | <ul><li>server 节点</li><li>agent 节点</li><li>托管/注册的 Kubernetes</li><li>任何需要能够使用 Rancher UI 或 API 的源</li></ul> | Rancher agent, Rancher UI/API, kubectl |
| TCP  | 6443  | K3s server 节点                                                                                                                 | Kubernetes API                         |
| UDP  | 8472  | K3s server 和 agent 节点                                                                                                        | Flannel VXLAN 需要                     |
| TCP  | 10250 | K3s server 和 agent 节点                                                                                                        | kubelet                                |

<figcaption>Rancher 节点出站规则</figcaption>

| 协议 | 端口 | 目的地                                            | 描述                                         |
| ---- | ---- | ------------------------------------------------- | -------------------------------------------- |
| TCP  | 22   | 来自使用 Node Driver 程序创建的节点的任何节点 IP  | 使用 Node Driver 程序 SSH 配置节点           |
| TCP  | 443  | git.rancher.io                                    | Rancher catalog                              |
| TCP  | 2376 | Any node IP from a node created using Node driver | Docker Machine 使用的 Docker daemon TLS 端口 |
| TCP  | 6443 | 托管/导入的 Kubernetes API                        | Kubernetes API server                        |

### RKE 上 Rancher Server 节点的端口

通常情况下，Rancher 安装在三个 RKE 节点上，这些节点都有 etcd、control plane 和 worker 角色。

下表细分了 Rancher 节点之间流量的端口要求：

<figcaption>Rancher节点之间的流量规则</figcaption>

| 协议 | 端口  | 描述                                            |
| ---- | ----- | ----------------------------------------------- |
| TCP  | 443   | Rancher agents                                  |
| TCP  | 2379  | etcd 客户端请求                                 |
| TCP  | 2380  | etcd 对等通信                                   |
| TCP  | 6443  | Kubernetes apiserver                            |
| UDP  | 8472  | Canal/Flannel VXLAN overlay 网络                |
| TCP  | 9099  | Canal/Flannel livenessProbe/readinessProbe      |
| TCP  | 10250 | Metrics server 与所有节点的通信                 |
| TCP  | 10254 | Ingress controller livenessProbe/readinessProbe |

下表细分了入站和出站流量的端口要求：

<figcaption>Rancher 节点的入站规则</figcaption>

| 协议 | 端口 | 来源                                                                                | 描述                            |
| ---- | ---- | ----------------------------------------------------------------------------------- | ------------------------------- |
| TCP  | 22   | RKE CLI                                                                             | RKE 通过 SSH 配置节点           |
| TCP  | 80   | 负载均衡器/反向代理                                                                 | 到 Rancher UI/API 的 HTTP 流量  |
| TCP  | 443  | <ul><li>负载均衡器/反向代理</li><li>所有集群节点和其他 API/UI 客户端的 IP</li></ul> | 到 Rancher UI/API 的 HTTPS 流量 |
| TCP  | 6443 | Kubernetes API 客户端                                                               | 到 Kubernetes API 的 HTTPS 流量 |

<figcaption>Rancher 节点的出站规则</figcaption>

| Protocol | Port               | 目的地                                        | 描述                                        |
| -------- | ------------------ | --------------------------------------------- | ------------------------------------------- |
| TCP      | 443                | `35.160.43.145`,`35.167.242.46`,`52.33.59.17` | Rancher catalog (git.rancher.io)            |
| TCP      | 22                 | 使用 node driver 创建的任何节点               | 通过 node driver 对节点进行 SSH 配置        |
| TCP      | 2376               | 使用 node driver 创建的任何节点               | node driver 使用的 Docker 守护进程 TLS 端口 |
| TCP      | 6443               | 托管/导入的 Kubernetes API                    | Kubernetes API server                       |
| TCP      | Provider dependent | 托管集群中 Kubernetes API endpoint 的端口     | Kubernetes API                              |

### RancherD 或 RKE2 上 Rancher Server 节点的端口

RancherD（或 RKE2）Server 需要 6443 和 9345 端口才能被集群中的其他节点访问。

当使用 Flannel VXLAN 时，所有节点都需要能够通过 UDP 端口 8472 访问其他节点。

如果你想使用 metrics server，你需要在每个节点上打开 10250 端口。

:::important 重要
节点上的 VXLAN 端口不应暴露给外界，因为这会开放集群网络，任何人都可以访问它。请在禁止访问 8472 端口的防火墙/安全组后面运行节点。
:::

<figcaption>RancherD或RKE2 Server 节点的入站规则</figcaption>

| 协议  | 端口        | 来源                                                                                     | 描述                                                                        |
| ----- | ----------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| TCP   | 9345        | RancherD/RKE2 agent 节点                                                                 | Kubernetes API                                                              |
| TCP   | 6443        | RancherD/RKE2 agent 节点                                                                 | Kubernetes API                                                              |
| UDP   | 8472        | RancherD/RKE2 server 和 agent 节点                                                       | 仅要求用于 Flannel VXLAN                                                    |
| TCP   | 10250       | RancherD/RKE2 server 和 agent 节点                                                       | kubelet                                                                     |
| TCP   | 2379        | RancherD/RKE2 server 节点                                                                | etcd 客户端端口                                                             |
| TCP   | 2380        | RancherD/RKE2 server 节点                                                                | etcd 对等端口                                                               |
| TCP   | 30000-32767 | RancherD/RKE2 server 和 agent 节点                                                       | NodePort 端口范围                                                           |
| HTTP  | 8080        | 负载均衡器/代理，进行外部 SSL 终端                                                       | 使用外部 SSL 终端时的 Rancher UI/API                                        |
| HTTPS | 8443        | <ul><li>托管/注册的 Kubernetes</li><li>任何需要能够使用 Rancher UI 或 API 的源</li></ul> | Rancher agent，Rancher UI/API，kubectl。如果你有 LB 做 TLS 终止，则不需要。 |

通常情况下，允许所有出站流量。

### Docker 安装的 Rancher Server 的端口

下表细分了 Rancher 节点对入站和出站流量的端口要求：

<figcaption>Rancher节点的入站规则</figcaption>

| 协议 | 端口 | 来源                                                                                     | 描述                                   |
| ---- | ---- | ---------------------------------------------------------------------------------------- | -------------------------------------- |
| TCP  | 80   | 负载均衡器/代理，进行外部 SSL 终端的处理                                                 | 使用外部 SSL 终端时的 Rancher UI/API   |
| TCP  | 443  | <ul><li>托管/注册的 Kubernetes</li><li>任何需要能够使用 Rancher UI 或 API 的源</li></ul> | Rancher agent，Rancher UI/API，kubectl |

<figcaption>Rancher节点的出站规则</figcaption>

| 协议 | 端口 | 来源                                     | 描述                                         |
| ---- | ---- | ---------------------------------------- | -------------------------------------------- |
| TCP  | 22   | 使用 Node Driver 创建的节点的任何节点 IP | 使用 Node Driver 对节点进行 SSH 配置         |
| TCP  | 443  | git.rancher.io                           | Rancher catalog                              |
| TCP  | 2376 | 使用 node driver 创建的节点的任何节点 IP | Docker Machine 使用的 Docker daemon TLS 端口 |
| TCP  | 6443 | 托管/导入的 Kubernetes API               | Kubernetes API server                        |

## 下游 Kubernetes 集群节点

下游 Kubernetes 集群运行你的应用程序和服务。本节介绍了需要在下游集群的节点上打开哪些端口，以便 Rancher 能够与它们进行通信。

根据下游集群的启动方式，对端口的要求有所不同。下面的每个标签都列出了不同[集群类型](/docs/rancher2.5/cluster-provisioning//)所需打开的端口。

下图描述了为每个[集群类型](/docs/rancher2.5/cluster-provisioning//)打开的端口。

<figcaption>Rancher管理平面的端口要求</figcaption>

![基本端口要求](/img/rancher/port-communications.svg)

> **_提示：_**
>
> 如果安全不是一个很大的问题，并且你对开放一些额外的端口，你可以使用[常用端口](#常用的端口)中的表格作为你的端口参考，而不是下面的综合表格。

### Rancher 使用节点池启动 Kubernetes 集群的端口

下表描述了 [Rancher Launched Kubernetes](/docs/rancher2.5/cluster-provisioning/) 的端口要求，节点在[基础设施提供商](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/)中创建。

> **注意：**
> 在 Amazon EC2 或 DigitalOcean 等云提供商中创建集群期间，Rancher 会自动打开所需的端口。

import PortsIaasNodes from '@theme/PortsIaasNodes';

<PortsIaasNodes/>

### Rancher 使用自定义节点启动 Kubernetes 集群的端口

下表描述了使用[自定义节点](/docs/rancher2.5/cluster-provisioning/rke-clusters/custom-nodes/)启动 Kubernetes 集群的端口要求。

import PortsCustomNodes from '@theme/PortsCustomNodes';

<PortsCustomNodes/>

### 托管的 Kubernetes 集群的端口

下表描述了[托管集群](/docs/rancher2.5/cluster-provisioning/hosted-kubernetes-clusters/) 的端口要求。

import PortsHosted from '@theme/PortsHosted';

<PortsHosted/>

### 注册集群的端口

注意：在 Rancher v2.5 版之前，注册集群被称为导入集群。

下表描述了[注册集群](/docs/rancher2.5/cluster-provisioning/registered-clusters/)的端口要求。

import PortsImported from '@theme/PortsImported';

<PortsImported/>

## 其他端口注意事项

### 常用的端口

这些端口通常在你的 Kubernetes 节点上打开，无论它是什么类型的集群。

| 协议    | 端口        | 描述                                                        |
| :------ | :---------- | :---------------------------------------------------------- |
| TCP     | 22          | 使用主机驱动通过 SSH 进行节点配置                           |
| TCP     | 179         | Calico BGP 端口                                             |
| TCP     | 2376        | 主机驱动与 Docker 守护进程通信的 TLS 端口                   |
| TCP     | 2379        | etcd 客户端请求                                             |
| TCP     | 2380        | etcd 节点通信                                               |
| UDP     | 8472        | Canal/Flannel VXLAN overlay 网络                            |
| UDP     | 4789        | Windows 集群中 Flannel VXLAN overlay 网络                   |
| UDP     | 8443        | Rancher webhook                                             |
| TCP     | 9099        | Canal/Flannel 健康检查                                      |
| TCP     | 9100        | Monitoring 从 Linux node-exporters 中抓取指标所需的默认端口 |
| TCP     | 9443        | Rancher webhook                                             |
| TCP     | 9796        | 集群监控拉取节点指标的默认端口（仅需要内网可达）            |
| TCP     | 6783        | Weave 端口                                                  |
| UDP     | 6783-6784   | Weave UDP 端口                                              |
| TCP     | 10250       | Metrics server 与所有节点的通信                             |
| TCP     | 10254       | Ingress controller 健康检查                                 |
| TCP/UDP | 30000-32767 | NodePort 端口范围                                           |

### 本地节点流量

上述要求中标记为 `本地流量` 的端口（即 `9099 TCP`）被用于 Kubernetes 健康检查（`livenessProbe` 和 `readinessProbe`）。
这些健康检查是在节点本身执行的。在大多数云环境中，这种本地流量默认是允许的。

但是，在以下情况下可能会阻止此流量

- 你已经在节点上应用了严格的主机防火墙策略。
- 你正在使用有多个接口（多宿主）的节点。

在这些情况下，你必须在你的主机防火墙中明确地允许这种流量，如果是公共/私有云托管的机器（即 AWS 或 OpenStack），在你的安全组配置中明确允许此流量。请记住，当在你的安全组中使用安全组作为源或目标时，明确开放端口只适用于节点/实例的私有接口。

### Rancher AWS EC2 安全组

当使用[AWS EC2 node driver](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/ec2/) 在 Rancher 中配置集群节点时，你可以选择让 Rancher 创建一个名为 `rancher-nodes` 的安全组。以下规则会自动添加到该安全组中。

| 类型            | 协议 |  端口范围   | 来源/目的地            | 规则类型 |
| --------------- | :--: | :---------: | ---------------------- | :------: |
| SSH             | TCP  |     22      | 0.0.0.0/0              | Inbound  |
| HTTP            | TCP  |     80      | 0.0.0.0/0              | Inbound  |
| Custom TCP Rule | TCP  |     443     | 0.0.0.0/0              | Inbound  |
| Custom TCP Rule | TCP  |    2376     | 0.0.0.0/0              | Inbound  |
| Custom TCP Rule | TCP  |  2379-2380  | sg-xxx (rancher-nodes) | Inbound  |
| Custom UDP Rule | UDP  |    4789     | sg-xxx (rancher-nodes) | Inbound  |
| Custom TCP Rule | TCP  |    6443     | 0.0.0.0/0              | Inbound  |
| Custom UDP Rule | UDP  |    8472     | sg-xxx (rancher-nodes) | Inbound  |
| Custom TCP Rule | TCP  | 10250-10252 | sg-xxx (rancher-nodes) | Inbound  |
| Custom TCP Rule | TCP  |    10256    | sg-xxx (rancher-nodes) | Inbound  |
| Custom TCP Rule | TCP  | 30000-32767 | 0.0.0.0/0              | Inbound  |
| Custom UDP Rule | UDP  | 30000-32767 | 0.0.0.0/0              | Inbound  |
| All traffic     | All  |     All     | 0.0.0.0/0              | Outbound |

### 打开 SUSE Linux Ports

SUSE Linux 可能有一个防火墙，默认情况下会阻止所有端口。要打开将主机添加到自定义集群所需的端口，

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="SLES15"
values={[
{ label: 'SLES15/ openSUSE LEAP 15', value: 'SLES15', },
{ label: 'SLES 12/ openSUSE LEAP 42', value: 'SLES12', },
]}>

<TabItem value="SLES15">

1. SSH 进入实例。
1. 在文本模式下启动 YaST。

   ```
   sudo yast2
   ```

1. 导航到**安全和用户** > **防火墙** > **区域：公共** > **端口**。要在界面内导航，请按照指示[这里](https://doc.opensuse.org/)。
1. 要打开所需的端口，将它们输入**TCP 端口**和**UDP 端口**字段。在这个例子中，9796 和 10250 端口也被打开，用于监控。由此产生的字段应类似于以下内容。

   ```yaml
   TCP Ports
   22, 80, 443, 2376, 2379, 2380, 6443, 9099, 9796, 10250, 10254, 30000-32767
   UDP Ports
   8472, 30000-32767
   ```

1. 当所有需要的端口都输入后，选择**接受**。

</TabItem>

<TabItem value="SLES12">

SUSE Linux 可能有一个默认情况下会阻止所有端口的防火墙。要打开将主机添加到自定义集群所需的端口。

1. SSH 进入实例。
2. 编辑 `/etc/sysconfig/SuSEfirewall2` ，打开所需端口。在本例中，也打开 9796 和 10250 端口进行监控。`FW_SERVICES_EXT_TCP="22 80 443 2376 2379 2380 6443 9099 9796 10250 10254 30000:32767" FW_SERVICES_EXT_UDP="8472 30000:32767" FW_ROUTE=yes`
3. 用新的端口重新启动防火墙: SuSEfirewall2

结果：该节点拥有添加到自定义集群所需的开放端口。节点有开放的端口，需要添加到自定义集群。


</TabItem>

</Tabs>
