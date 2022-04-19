---
title: 私有集群
weight: 2
---

在 GKE 中，[私有集群](https://cloud.google.com/kubernetes-engine/docs/concepts/private-cluster-concept)是一种集群，其节点仅通过分配内部 IP 地址与入站和出站流量相隔离。GKE 中的私有集群可以选择将 control plane 端点作为公开访问的地址或作为私有地址。这与其他 Kubernetes 提供商不同，后者可能将具有私有 control plane 端点的集群称为“私有集群”，但仍允许进出节点的流量。基于你的组织的网络和安全要求，你可能想创建一个有私有节点的集群，其中有或没有公共 control plane 端点。从 Rancher 配置的 GKE 集群可以通过在**集群选项**中选择**私有集群**（在**显示高级选项**下）来使用隔离的节点。通过选择**启用私有端点**，可以选择将 control plane 端点设为私有。

### 私有节点

由于私有集群中的节点只有内部 IP 地址，它们将无法安装 cluster agent，Rancher 将无法完全管理集群。这可以通过几种方式来处理。

#### Cloud NAT

> **注意**：
> Cloud NAT 将[产生费用](https://cloud.google.com/nat/pricing)。

如果限制外出的互联网访问对你的组织来说不是一个问题，可以使用 Google 的 [Cloud NAT](https://cloud.google.com/nat/docs/using-nat) 服务来允许私有网络中的节点访问互联网，使它们能够从 Dockerhub 下载所需的镜像并与 Rancher management server 通信。这是最简单的解决方案。

#### 私有镜像仓库

> **注意**：
> 此方案不受官方支持。如果 Cloud NAT 服务不足以满足你的需求，则可以参考此方案。

如果要求限制节点的传入和传出流量，请按照离线安装说明，在集群所在的 VPC 上设置一个私有容器[镜像仓库](https://rancher.com/docs/rancher/v2.6/en/installation/other-installation-methods/air-gap/)，从而允许集群节点访问和下载运行 cluster agent 所需的镜像。如果 control plane 端点也是私有的，Rancher 将需要[直接访问](#direct-access)它。

### 私有 Control Plane 端点

如果集群暴露了公共端点，Rancher 将能够访问集群，且无需执行额外的步骤。但是，如果集群没有公共端点，则必须确保 Rancher 可以访问集群。

#### Cloud NAT

> **注意**：
> Cloud NAT 将[产生费用](https://cloud.google.com/nat/pricing)。

如上所述，如果不考虑限制对节点的传出互联网访问，则可以使用 Google 的 [Cloud NAT](https://cloud.google.com/nat/docs/using-nat) 服务来允许节点访问互联网。当集群进行配置时，Rancher 将提供一个在集群上运行的注册命令。下载新集群的 [kubeconfig](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl) 并在集群上运行提供的 kubectl 命令。如果要通过获取集群访问权来运行此命令，你可以创建临时节点或使用 VPC 中的现有节点，或者登录到某个集群节点或使用某个集群节点创建 SSH 隧道。

#### 直接访问

如果 Rancher server 与集群的 control plane 运行在同一 VPC 上，它将直接访问 control plane 的私有端点。集群节点将需要访问[私有镜像仓库](#private-registry)以下载上述的镜像。

你还可以使用 Google 的服务（例如 [Cloud VPN](https://cloud.google.com/network-connectivity/docs/vpn/concepts/overview) 或 [Cloud Interconnect VLAN](https://cloud.google.com/network-connectivity/docs/interconnect)）来促进组织网络与 Google VPC 之间的连接。
