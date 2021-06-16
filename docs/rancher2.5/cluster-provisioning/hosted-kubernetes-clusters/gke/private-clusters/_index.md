---
title: 私有集群
description: 使用Google Kubernetes Engine创建服务账户。GKE 使用这个帐户来操作您的集群。创建此帐户还将生成用于身份验证的私钥。
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
  - 创建集群
  - 创建托管集群
  - 创建谷歌 GKE 集群
  - 私有集群
---

在 GKE 中，[私有集群](https://cloud.google.com/kubernetes-engine/docs/concepts/private-cluster-concept)是一种集群，其节点仅通过分配内部 IP 地址与入站和出站流量相隔离。GKE 中的私有集群可以选择将控制平面端点作为公开访问的地址或作为私有地址。这与其他 Kubernetes 供应商不同，他们可能会将拥有私有控制平面端点的集群称为 "私有集群"，但仍然允许节点之间的流量。你可能想创建一个有私有节点的集群，有或没有公共控制平面端点，这取决于你的组织的网络和安全要求。从 Rancher 配置的 GKE 集群可以通过在集群选项中选择 "私有集群"（在 "显示高级选项 "下）来使用隔离的节点。通过选择 "启用私有端点"，控制平面端点可以选择成为私有。

### 私有节点

由于私有集群中的节点只有内部 IP 地址，它们将无法安装集群代理，Rancher 将无法完全管理集群。这可以通过一些方法来克服。

#### 云端 NAT

> **注意**
> 云 NAT 将[产生费用](https://cloud.google.com/nat/pricing)。

如果限制外出的互联网访问对你的组织来说不是一个问题，可以使用谷歌的[云端 NAT](https://cloud.google.com/nat/docs/using-nat)服务，允许私有网络中的节点访问互联网，使它们能够从 Dockerhub 下载所需的镜像，并联系 Rancher 管理服务器。这是最简单的解决方案。

#### 私有镜像仓库

> **注意**
> 这个方案没有得到官方支持，但描述的是使用云端 NAT 服务不够的情况。

如果限制节点的传入和传出流量是一个要求，请按照空中加注的安装说明，在集群所在的 VPC 上设置一个私有容器镜像[镜像仓库](https://rancher.com/docs/rancher/v2.x/en/installation/other-installation-methods/air-gap/)，允许集群节点访问和下载它们运行集群代理所需的镜像。如果控制平面端点也是私有的，Rancher 将需要[直接访问](#direct-access)到它。

###私有控制平面端点

如果集群有一个公开的端点，Rancher 将能够到达该集群，不需要采取额外的步骤。但是，如果集群没有公共端点，那么必须考虑确保 Rancher 能够访问集群。

#### Cloud NAT

> **注意**
> 云 NAT 将[产生费用](https://cloud.google.com/nat/pricing)。

如上所述，如果限制节点的外向互联网访问不是一个问题，那么可以使用谷歌的[云 NAT](https://cloud.google.com/nat/docs/using-nat)服务来允许节点访问互联网。当集群正在配置的时候，Rancher 将提供一个注册命令，在集群上运行。下载新集群的[kubeconfig](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl)，并在集群上运行提供的 kubectl 命令。获得访问
可以通过创建一个临时节点或使用 VPC 中的现有节点，或通过登录或创建一个 SSH 隧道通过其中一个集群节点来获得对集群的访问以运行该命令。

#### 直接访问

如果 Rancher 服务器与集群的控制平面运行在同一个 VPC 上，它将可以直接访问控制平面的私有端点。集群节点将需要访问[私有镜像仓库](#private-registry)来下载上述的图像。

你也可以使用谷歌的服务，如[Cloud VPN](https://cloud.google.com/network-connectivity/docs/vpn/concepts/overview)或[Cloud Interconnect VLAN](https://cloud.google.com/network-connectivity/docs/interconnect)，以促进你的组织的网络和谷歌 VPC 之间的连接。
