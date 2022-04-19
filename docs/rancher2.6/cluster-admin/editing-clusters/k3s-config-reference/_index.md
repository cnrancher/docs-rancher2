---
title: K3s 集群配置参考（技术预览）
shortTitle: K3s 集群配置
weight: 6
---

本文介绍 Rancher 中可用于新的或现有的 K3s Kubernetes 集群的配置选项。

## 概述

你可以通过以下两种方式之一来配置 Kubernetes 选项：

- [Rancher UI](#configuration-options-in-the-rancher-ui)：使用 Rancher UI 来选择设置 Kubernetes 集群时常用的自定义选项。
- [集群配置文件](#cluster-config-file)：高级用户可以创建一个 K3s 配置文件，而不是使用 Rancher UI 来为集群选择 Kubernetes 选项。配置文件允许你设置 K3s 安装中可用的任何[选项](https://rancher.com/docs/k3s/latest/en/installation/install-options/)。

## Rancher UI 中的配置选项

> 一些高级配置选项没有在 Rancher UI 表单中开放，但你可以通过在 YAML 中编辑 K3s 集群配置文件来启用这些选项。有关 YAML 中 K3s 集群的可配置选项的完整参考，请参阅 [K3s 文档](https://rancher.com/docs/k3s/latest/en/installation/install-options/)。

### 基本信息

#### Kubernetes 版本

这指的是集群节点上安装的 Kubernetes 版本。Rancher 基于 [hyperkube](https://github.com/rancher/hyperkube) 打包了自己的 Kubernetes 版本。

有关更多详细信息，请参阅[升级 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/upgrading-kubernetes)。

#### 加密密文

启用或禁用密文加密的选项。启用后，密文将使用 AES-CBC 密钥进行加密。如果禁用，则在再次启用加密之前无法读取任何以前的密文。有关详细信息，请参阅 [K3s 文档](https://rancher.com/docs/k3s/latest/en/advanced/#secrets-encryption-config-experimental)。

#### 项目网络隔离

如果你的网络提供商允许项目网络隔离，你可以选择启用或禁用项目间的通信。

#### SELinux

启用或禁用 [SELinux](https://rancher.com/docs/k3s/latest/en/advanced/#selinux-support) 支持的选项。

#### CoreDNS

默认情况下，[CoreDNS](https://coredns.io/) 会安装为默认 DNS 提供程序。如果未安装 CoreDNS，则必须自己安装备用 DNS 提供程序。有关详细信息，请参阅 [K3s 文档](https://rancher.com/docs/k3s/latest/en/networking/#coredns)。

#### Klipper Service LB

启用或禁用 [Klipper](https://github.com/rancher/klipper-lb) 服务负载均衡器的选项。有关详细信息，请参阅 [K3s 文档](https://rancher.com/docs/k3s/latest/en/networking/#service-load-balancer)。

#### Traefik Ingress

启用或禁用 [Traefik](https://traefik.io/) HTTP 反向代理和负载均衡器的选项。有关更多详细信息和配置选项，请参阅 [K3s 文档](https://rancher.com/docs/k3s/latest/en/networking/#traefik-ingress-controller)。

#### Local Storage

在节点上启用或禁用 [Local Storage](https://rancher.com/docs/k3s/latest/en/storage/) 的选项。

#### Metrics Server

启用或禁用 [metrics server](https://github.com/kubernetes-incubator/metrics-server) 的选项。如果启用，请确保为入站 TCP 流量打开 10250 端口。

### 附加配置

集群启动时将应用的其他 Kubernetes 清单，会作为[附加组件](https://kubernetes.io/docs/concepts/cluster-administration/addons/)来管理。有关详细信息，请参阅 [K3s 文档](https://rancher.com/docs/k3s/latest/en/helm/#automatically-deploying-manifests-and-helm-charts)。

### Agent 环境变量

为 [K3s agent](https://rancher.com/docs/k3s/latest/en/architecture/) 设置环境变量的选项。你可以使用键值对设置环境变量。有关详细信息，请参阅 [K3s 文档](https://rancher.com/docs/k3s/latest/en/installation/install-options/agent-config/)。

### etcd

#### 自动快照

启用或禁用定期 etcd 快照的选项。如果启用，用户可以配置快照的频率。有关详细信息，请参阅 [K3s 文档](https://rancher.com/docs/k3s/latest/en/backup-restore/#creating-snapshots)。

#### 指标

选择向公众公开或仅在集群内公开 etcd 指标的选项。

### 网络

#### 集群 CIDR

用于 pod IP 的 IPv4/IPv6 网络 CIDR（默认：10.42.0.0/16）。

#### Service CIDR

用于 Service IP 的 IPv4/IPv6 网络 CIDR（默认：10.43.0.0/16）。

#### 集群 DNS

用于 coredns 服务的 IPv4 集群 IP。应该在你的 service-cidr 范围内（默认：10.43.0.10）。

#### 集群域名

选择集群的域。默认值为 `cluster.local`。

#### NodePort 服务端口范围

更改可用于 [NodePort 服务](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport)的端口范围的选项。默认值为 `30000-32767`。

#### TLS 可选名称

在服务器 TLS 证书上添加其他主机名或 IPv4/IPv6 地址作为使用者可选名称。

#### 授权集群端点

授权集群端点（ACE）可用于直接访问 Kubernetes API server，而无需通过 Rancher 进行通信。

有关授权集群端点的工作原理以及使用的原因，请参阅[架构介绍]({{<baseurl>}}/rancher/v2.6/en/overview/architecture/#4-authorized-cluster-endpoint)。

我们建议使用具有授权集群端点的负载均衡器。有关详细信息，请参阅[推荐的架构]({{<baseurl>}}/rancher/v2.6/en/overview/architecture-recommendations/#architecture-for-an-authorized-cluster-endpoint)。

### 镜像仓库

选择要从中拉取 Rancher 镜像的镜像仓库。有关更多详细信息和配置选项，请参阅 [K3s 文档](https://rancher.com/docs/k3s/latest/en/installation/private-registry/)。

### 升级策略

#### Control Plane 并发

选择可以同时升级多少个节点。可以是固定数字或百分比。

#### Worker 并发

选择可以同时升级多少个节点。可以是固定数字或百分比。

#### 清空节点（control plane）

在升级之前从节点中删除所有 pod 的选项。

#### 清空节点（worker 节点）

在升级之前从节点中删除所有 pod 的选项。

### 高级配置

为不同节点设置 kubelet 选项。有关可用选项，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/)。

## 集群配置文件

高级用户可以创建一个 K3s 配置文件，而不是使用 Rancher UI 表单来为集群选择 Kubernetes 选项。配置文件允许你设置 K3s 安装中可用的任何[选项](https://rancher.com/docs/k3s/latest/en/installation/install-options/)。

要直接从 Rancher UI 编辑 K3s 配置文件，单击**以 YAML 文件编辑**。
