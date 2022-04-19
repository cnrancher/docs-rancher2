---
title: RKE2 集群配置参考（技术预览）
shortTitle: RKE2 集群配置
weight: 5
---

本文介绍 Rancher 中可用于新的或现有的 RKE2 Kubernetes 集群的配置选项。

## 概述

你可以通过以下两种方式之一来配置 Kubernetes 选项：

- [Rancher UI](#configuration-options-in-the-rancher-ui)：使用 Rancher UI 来选择设置 Kubernetes 集群时常用的自定义选项。
- [集群配置文件](#cluster-config-file)：高级用户可以创建一个 RKE2 配置文件，而不是使用 Rancher UI 来为集群选择 Kubernetes 选项。配置文件允许你设置 RKE2 安装中可用的任何[选项](https://docs.rke2.io/install/install_options/install_options)。

## Rancher UI 中的配置选项

> 一些高级配置选项没有在 Rancher UI 表单中开放，但你可以通过在 YAML 中编辑 RKE2 集群配置文件来启用这些选项。有关 YAML 中 RKE2 Kubernetes 集群的可配置选项的完整参考，请参阅 [RKE2 文档](https://docs.rke2.io/install/install_options/install_options/)。

### 基本信息

#### Kubernetes 版本

这指的是集群节点上安装的 Kubernetes 版本。Rancher 基于 [hyperkube](https://github.com/rancher/hyperkube) 打包了自己的 Kubernetes 版本。

有关更多详细信息，请参阅[升级 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/upgrading-kubernetes)。

#### 容器网络提供商

这指的是集群使用的[网络提供商](https://kubernetes.io/docs/concepts/cluster-administration/networking/)。

> 启动集群后，你无法更改网络提供商。由于 Kubernetes 不允许在网络提供商之间切换，因此，请谨慎选择要使用的网络提供商。使用网络提供商创建集群后，如果你需要更改网络提供商，你将需要拆除整个集群以及其中的所有应用。

Rancher 与以下开箱即用的网络提供商兼容：

- [Canal](https://github.com/projectcalico/canal)
- [Cilium](https://cilium.io/)\*
- [Calico](https://docs.projectcalico.org/v3.11/introduction/)
- [Multus](https://github.com/k8snetworkplumbingwg/multus-cni)

\* 在 [Cilium CNI]({{<baseurl>}}/rancher/v2.6/en/faq/networking/cni-providers/#cilium) 中使用[项目网络隔离](#project-network-isolation)时，你可以开启跨节点入口路由。详情请参见 [CNI 提供商文档]({{<baseurl>}}/rancher/v2.6/en/faq/networking/cni-providers/#ingress-routing-across-nodes-in-cilium)。

有关不同网络提供商以及如何配置它们的更多详细信息，请查阅 [RKE2 文档](https://docs.rke2.io/install/network_options/)。

#### 云提供商

你可以配置 [Kubernetes 云提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers)。如果你想在 Kubernetes 中使用动态配置的[卷和存储]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/)，你通常需要选择特定的云提供商。例如，如果你想使用 Amazon EBS，则需要选择 `aws` 云提供商。

> **注意**：如果你要使用的云提供商未作为选项列出，你需要使用[配置文件选项](#cluster-config-file)来配置云提供商。请参考[本文档]({{<baseurl>}}/rke/latest/en/config-options/cloud-providers/)来了解如何配置云提供商。

#### 默认 Pod 安全策略

为集群选择默认的 [pod 安全策略]({{<baseurl>}}/rancher/v2.6/en/admin-settings/pod-security-policies/)。请参阅 [RKE2 文档](https://docs.rke2.io/security/policies/)来了解每个可用策略的规范。

#### Worker CIS 配置文件

选择一个 [CIS benchmark]({{<baseurl>}}/rancher/v2.6/en/cis-scans/) 来验证系统配置。

#### 项目网络隔离

如果你的网络提供商允许项目网络隔离，你可以选择启用或禁用项目间的通信。

如果你使用支持执行 Kubernetes 网络策略的 RKE2 网络插件（例如 Canal），则可以使用项目网络隔离。

#### SELinux

启用或禁用 [SELinux](https://docs.rke2.io/security/selinux) 支持的选项。

#### CoreDNS

默认情况下，[CoreDNS](https://coredns.io/) 会安装为默认 DNS 提供程序。如果未安装 CoreDNS，则必须自己安装备用 DNS 提供程序。有关其他 CoreDNS 配置，请参阅 [RKE2 文档](https://docs.rke2.io/networking/#coredns)。

#### NGINX Ingress

如果你想使用高可用性配置来发布应用，并且你使用没有原生负载均衡功能的云提供商来托管主机，请启用此选项以在集群中使用 NGINX Ingress。有关其他配置选项，请参阅 [RKE2 文档](https://docs.rke2.io/networking/#nginx-ingress-controller)。

有关其他配置选项，请参阅 [RKE2 文档](https://docs.rke2.io/networking/#nginx-ingress-controller)。

#### Metrics Server

这是启用或禁用 [Metrics Server]({{<baseurl>}}/rke/latest/en/config-options/add-ons/metrics-server/) 的选项。

每个能够使用 RKE2 启动集群的云提供商都可以收集指标并监控你的集群节点。如果启用此选项，你可以从你的云提供商门户查看你的节点指标。

### 附加配置

集群启动时将应用的其他 Kubernetes 清单，会作为[附加组件](https://kubernetes.io/docs/concepts/cluster-administration/addons/)来管理。有关详细信息，请参阅 [RKE2 文档](https://docs.rke2.io/helm/#automatically-deploying-manifests-and-helm-charts)。

### Agent 环境变量

为 [Rancher agent](https://rancher.com/docs/rancher/v2.6/en/cluster-provisioning/rke-clusters/rancher-agents/) 设置环境变量的选项。你可以使用键值对设置环境变量。有关详细信息，请参阅 [RKE2 文档](https://docs.rke2.io/install/install_options/linux_agent_config/)。

### etcd

#### 自动快照

启用或禁用定期 etcd 快照的选项。如果启用，用户可以配置快照的频率。有关详细信息，请参阅 [RKE2 文档](https://docs.rke2.io/backup_restore/#creating-snapshots)。请注意，如果使用 RKE2，快照存储会在每个 etcd 节点上，这与 RKE1 不同（RKE1 每个集群只存储一个快照）。

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

在 Rancher 启动的 Kubernetes 集群中，它默认启用，使用具有 `control plane` 角色的节点的 IP 和默认的 Kubernetes 自签名证书。

有关授权集群端点的工作原理以及使用的原因，请参阅[架构介绍]({{<baseurl>}}/rancher/v2.6/en/overview/architecture/#4-authorized-cluster-endpoint)。

我们建议使用具有授权集群端点的负载均衡器。有关详细信息，请参阅[推荐的架构]({{<baseurl>}}/rancher/v2.6/en/overview/architecture-recommendations/#architecture-for-an-authorized-cluster-endpoint)。

### 镜像仓库

选择要从中拉取 Rancher 镜像的镜像仓库。有关更多详细信息和配置选项，请参阅 [RKE2 文档](https://docs.rke2.io/install/containerd_registry_configuration/)。

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

高级用户可以创建一个 RKE2 配置文件，而不是使用 Rancher UI 表单来为集群选择 Kubernetes 选项。配置文件允许你设置 RKE2 安装中可用的任何[选项](https://docs.rke2.io/install/install_options/install_options)。

要直接从 Rancher UI 编辑 RKE 配置文件，单击**以 YAML 文件编辑**。
