---
title: RKE 集群配置参考
shortTitle: RKE 集群配置
weight: 1
---

Rancher 安装 Kubernetes 时，它使用 [RKE]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 或 [RKE2](https://docs.rke2.io/) 作为 Kubernetes 发行版。

本文介绍 Rancher 中可用于新的或现有的 RKE Kubernetes 集群的配置选项。

- [概述](#overview)
- [在 Rancher UI 中使用表单编辑集群](#editing-clusters-with-a-form-in-the-rancher-ui)
- [使用 YAML 编辑集群](#editing-clusters-with-yaml)
- [Rancher UI 中的配置选项](#configuration-options-in-the-rancher-ui)
  - [Kubernetes 版本](#kubernetes-version)
  - [网络提供商](#network-provider)
  - [项目网络隔离](#project-network-isolation)
  - [Kubernetes 云提供商](#kubernetes-cloud-providers)
  - [私有镜像仓库](#private-registries)
  - [授权集群端点（ACE）](#authorized-cluster-endpoint)
  - [节点池](#node-pools)
  - [NGINX Ingress](#nginx-ingress)
  - [Metrics Server 监控](#metrics-server-monitoring)
  - [Pod 安全策略支持](#pod-security-policy-support)
  - [节点上的 Docker 版本](#docker-version-on-nodes)
  - [Docker 根目录](#docker-root-directory)
  - [默认 Pod 安全策略](#default-pod-security-policy)
  - [节点端口范围](#node-port-range)
  - [定期 etcd 快照](#recurring-etcd-snapshots)
  - [Agent 环境变量](#agent-environment-variables)
  - [更新 ingress-nginx](#updating-ingress-nginx)
- [RKE 集群配置文件参考](#rke-cluster-config-file-reference)
  - [Rancher 中的配置文件结构](#config-file-structure-in-rancher)
  - [默认 DNS 提供商](#default-dns-provider)
- [YAML 中的 Rancher 特定参数](#rancher-specific-parameters-in-yaml)
  - [docker_root_dir](#docker_root_dir)
  - [enable_cluster_monitoring](#enable_cluster_monitoring)
  - [enable_network_policy](#enable_network_policy)
  - [local_cluster_auth_endpoint](#local_cluster_auth_endpoint)
  - [自定义网络插件](#custom-network-plug-in)

## 概述

你可以通过以下两种方式之一来配置 Kubernetes 选项：

- [Rancher UI](#rancher-ui-options)：使用 Rancher UI 来选择设置 Kubernetes 集群时常用的自定义选项。
- [集群配置文件](#cluster-config-file)：高级用户可以创建一个 RKE 配置文件，而不是使用 Rancher UI 来为集群选择 Kubernetes 选项。配置文件可以让你使用 YAML 来指定 RKE 安装中可用的任何选项（除了 system_images 配置）。

RKE 集群配置选项嵌套在 `rancher_kubernetes_engine_config` 参数下。有关详细信息，请参阅[集群配置文件](#cluster-config-file)。

在 [RKE 启动的集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)中，你可以编辑任何后续剩余的选项。

有关 RKE 配置文件语法的示例，请参阅 [RKE 文档]({{<baseurl>}}/rke/latest/en/example-yamls/)。

Rancher UI 中的表单不包括配置 RKE 的所有高级选项。有关 YAML 中 RKE Kubernetes 集群的可配置选项的完整参考，请参阅 [RKE 文档]({{<baseurl>}}/rke/latest/en/config-options/)。

## 在 Rancher UI 中使用表单编辑集群

要编辑你的集群：

1. 点击左上角 **☰ > 集群管理**。
1. 转到要配置的集群，然后单击 **⋮ > 编辑配置**。

## 使用 YAML 编辑集群

高级用户可以创建一个 RKE 配置文件，而不是使用 Rancher UI 来为集群选择 Kubernetes 选项。配置文件可以让你使用 YAML 来指定 RKE 安装中可用的任何选项（除了 system_images 配置）。

RKE 集群（也称为 RKE1 集群）的编辑方式与 RKE2 和 K3s 集群不同。

要直接从 Rancher UI 编辑 RKE 配置文件：

1. 点击 **☰ > 集群管理**。
1. 转到要配置的 RKE 集群。单击并单击 **⋮ > 编辑配置**。你将会转到 RKE 配置表单。请注意，由于集群配置在 Rancher 2.6 中发生了变更，**⋮ > 以 YAML 文件编辑**可用于配置 RKE2 集群，但不能用于编辑 RKE1 配置。
1. 在配置表单中，向下滚动并单击**以 YAML 文件编辑**。
1. 编辑 `rancher_kubernetes_engine_config` 参数下的 RKE 选项。

## Rancher UI 中的配置选项

> 一些高级配置选项没有在 Rancher UI 表单中开放，但你可以通过在 YAML 中编辑 RKE 集群配置文件来启用这些选项。有关 YAML 中 RKE Kubernetes 集群的可配置选项的完整参考，请参阅 [RKE 文档]({{<baseurl>}}/rke/latest/en/config-options/)。

### Kubernetes 版本

这指的是集群节点上安装的 Kubernetes 版本。Rancher 基于 [hyperkube](https://github.com/rancher/hyperkube) 打包了自己的 Kubernetes 版本。

有关更多详细信息，请参阅[升级 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/upgrading-kubernetes)。

### 网络提供商

这指的是集群使用的[网络提供商](https://kubernetes.io/docs/concepts/cluster-administration/networking/)。有关不同网络提供商的更多详细信息，请查看我们的[网络常见问题解答]({{<baseurl>}}/rancher/v2.6/en/faq/networking/cni-providers/)。

> 启动集群后，你无法更改网络提供商。由于 Kubernetes 不允许在网络提供商之间切换，因此，请谨慎选择要使用的网络提供商。使用网络提供商创建集群后，如果你需要更改网络提供商，你将需要拆除整个集群以及其中的所有应用。

Rancher 与以下开箱即用的网络提供商兼容：

- [Canal](https://github.com/projectcalico/canal)
- [Flannel](https://github.com/coreos/flannel#flannel)
- [Calico](https://docs.projectcalico.org/v3.11/introduction/)
- [Weave](https://github.com/weaveworks/weave)

**Weave 注意事项**：

选择 Weave 作为网络提供商时，Rancher 将通过生成随机密码来自动启用加密。如果你想手动指定密码，请参阅使用[配置文件]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options/#cluster-config-file)和 [Weave 网络插件选项]({{<baseurl>}}/rke/latest/en/config-options/add-ons/network-plugins/#weave-network-plug-in-options)来配置集群。

### 项目网络隔离

如果你的网络提供商允许项目网络隔离，你可以选择启用或禁用项目间的通信。

如果你使用支持执行 Kubernetes 网络策略的 RKE 网络插件（例如 Canal 或 Cisco ACI 插件），则可以使用项目网络隔离。

### Kubernetes 云提供商

你可以配置 [Kubernetes 云提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers)。如果你想在 Kubernetes 中使用动态配置的[卷和存储]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/)，你通常需要选择特定的云提供商。例如，如果你想使用 Amazon EBS，则需要选择 `aws` 云提供商。

> **注意**：如果你要使用的云提供商未作为选项列出，你需要使用[配置文件选项](#cluster-config-file)来配置云提供商。请参考 [RKE 云提供商文档]({{<baseurl>}}/rke/latest/en/config-options/cloud-providers/)来了解如何配置云提供商。

### 私有镜像仓库

集群级别的私有镜像仓库配置仅能用于配置集群。

在 Rancher 中设置私有镜像仓库的主要方法有两种：通过[全局默认镜像仓库]({{<baseurl>}}/rancher/v2.6/en/admin-settings/config-private-registry)中的**设置**选项卡设置全局默认镜像仓库，以及在集群级别设置的高级选项中设置私有镜像仓库。全局默认镜像仓库可以用于离线设置，不需要凭证的镜像仓库。而集群级私有镜像仓库用于所有需要凭证的私有镜像仓库。

如果你的私有镜像仓库需要凭证，为了将凭证传递给 Rancher，你需要编辑每个需要从仓库中拉取镜像的集群的集群选项。

私有镜像仓库的配置选项能让 Rancher 知道要从哪里拉取用于集群的[系统镜像]({{<baseurl>}}/rke/latest/en/config-options/system-images/)或[附加组件镜像]({{<baseurl>}}/rke/latest/en/config-options/add-ons/)。

- **系统镜像**是维护 Kubernetes 集群所需的组件。
- **附加组件**用于部署多个集群组件，包括网络插件、ingress controller、DNS 提供商或 metrics server。

有关为集群配置期间应用的组件设置私有镜像仓库的更多信息，请参阅[私有镜像仓库的 RKE 文档]({{<baseurl>}}/rke/latest/en/config-options/private-registries/)。

Rancher v2.6 引入了[为 RKE 集群配置 ECR 镜像仓库]({{<baseurl>}}/rke/latest/en/config-options/private-registries/#amazon-elastic-container-registry-ecr-private-registry-setup)的功能。

### 授权集群端点

授权集群端点（ACE）可用于直接访问 Kubernetes API server，而无需通过 Rancher 进行通信。

> 授权集群端点仅适用于 Rancher 启动的 Kubernetes 集群，即只适用于 Rancher [使用 RKE]({{<baseurl>}}/rancher/v2.6/en/overview/architecture/#tools-for-provisioning-kubernetes-clusters) 来配置的集群。它不适用于托管在 Kubernetes 提供商中的集群，例如 Amazon 的 EKS。

在 Rancher 启动的 Kubernetes 集群中，它默认启用，使用具有 `control plane` 角色的节点的 IP 和默认的 Kubernetes 自签名证书。

有关授权集群端点的工作原理以及使用的原因，请参阅[架构介绍]({{<baseurl>}}/rancher/v2.6/en/overview/architecture/#4-authorized-cluster-endpoint)。

我们建议使用具有授权集群端点的负载均衡器。有关详细信息，请参阅[推荐的架构]({{<baseurl>}}/rancher/v2.6/en/overview/architecture-recommendations/#architecture-for-an-authorized-cluster-endpoint)。

### 节点池

有关使用 Rancher UI 在 RKE 集群中设置节点池的信息，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools)。

### NGINX Ingress

如果你想使用高可用性配置来发布应用，并且你使用没有原生负载均衡功能的云提供商来托管主机，请启用此选项以在集群中使用 NGINX Ingress。

### Metrics Server 监控

这是启用或禁用 [Metrics Server]({{<baseurl>}}/rke/latest/en/config-options/add-ons/metrics-server/) 的选项。

每个能够使用 RKE 启动集群的云提供商都可以收集指标并监控你的集群节点。如果启用此选项，你可以从你的云提供商门户查看你的节点指标。

### Pod 安全策略支持

为集群启用 [pod 安全策略]({{<baseurl>}}/rancher/v2.6/en/admin-settings/pod-security-policies/)。启用此选项后，使用**默认 Pod 安全策略**下拉菜单选择一个策略。

你必须有已配置的 Pod 安全策略才能使用此选项。

### 节点上的 Docker 版本

表示是否允许节点运行 Rancher 不正式支持的 Docker 版本。

如果你选择使用支持的 Docker 版本，Rancher 会禁止 pod 运行在安装了不支持的 Docker 版本的节点上。

如需了解各个 Rancher 版本通过了哪些 Docker 版本测试，请参见[支持和维护条款](https://rancher.com/support-maintenance-terms/)。

### Docker 根目录

如果要添加到集群的节点为 Docker 配置了非默认 Docker 根目录（默认为 `/var/lib/docker`），请在此选项中指定正确的 Docker 根目录。

### 默认 Pod 安全策略

如果你启用了 **Pod 安全策略支持**，请使用此下拉菜单选择应用于集群的 pod 安全策略。

### 节点端口范围

更改可用于 [NodePort 服务](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport)的端口范围的选项。默认为 `30000-32767`。

### 定期 etcd 快照

启用或禁用[定期 etcd 快照]({{<baseurl>}}/rke/latest/en/etcd-snapshots/#etcd-recurring-snapshots)的选项。

### Agent 环境变量

为 [rancher agent]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/rancher-agents/) 设置环境变量的选项。你可以使用键值对设置环境变量。如果 Rancher Agent 需要使用代理与 Rancher Server 通信，则可以使用 Agent 环境变量设置 `HTTP_PROXY`，`HTTPS_PROXY` 和 `NO_PROXY` 环境变量。

### 更新 ingress-nginx

使用 Kubernetes 1.16 之前版本创建的集群将具有 `OnDelete`的 `ingress-nginx` `updateStrategy`。使用 Kubernetes 1.16 或更高版本创建的集群将具有 `RollingUpdate`。

如果 `ingress-nginx` 的 `updateStrategy` 是 `OnDelete`，则需要删除这些 pod 以获得 deployment 正确的版本。

## RKE 集群配置文件参考

高级用户可以创建一个 RKE 配置文件，而不是使用 Rancher UI 来为集群选择 Kubernetes 选项。配置文件可以让你在 RKE 安装中设置任何[可用选项]({{<baseurl>}}/rke/latest/en/config-options/)（`system_images` 配置除外）。使用 Rancher UI 或 API 创建集群时，不支持 `system_images` 选项。

有关 YAML 中 RKE Kubernetes 集群的可配置选项的完整参考，请参阅 [RKE 文档]({{<baseurl>}}/rke/latest/en/config-options/)。

### Rancher 中的配置文件结构

RKE（Rancher Kubernetes Engine）是 Rancher 用来配置 Kubernetes 集群的工具。过去，Rancher 的集群配置文件与 [RKE 配置文件]({{<baseurl>}}/rke/latest/en/example-yamls/)的结构是一致的。但由于 Rancher 文件结构发生了变化，因此在 Rancher 中，RKE 集群配置项与非 RKE 配置项是分开的。所以，你的集群配置需要嵌套在集群配置文件中的 `rancher_kubernetes_engine_config` 参数下。使用早期版本的 Rancher 创建的集群配置文件需要针对这种格式进行更新。以下是一个集群配置文件示例：

{{% accordion id="v2.3.0-cluster-config-file" label="Example Cluster Config File" %}}

```yaml
#
# Cluster Config
#
docker_root_dir: /var/lib/docker
enable_cluster_alerting: false
enable_cluster_monitoring: false
enable_network_policy: false
local_cluster_auth_endpoint:
  enabled: true
#
# Rancher Config
#
rancher_kubernetes_engine_config: # Your RKE template config goes here.
  addon_job_timeout: 30
  authentication:
    strategy: x509
  ignore_docker_version: true
#
# # Currently only nginx ingress provider is supported.
# # To disable ingress controller, set `provider: none`
# # To enable ingress on specific nodes, use the node_selector, eg:
#    provider: nginx
#    node_selector:
#      app: ingress
#
  ingress:
    provider: nginx
  kubernetes_version: v1.15.3-rancher3-1
  monitoring:
    provider: metrics-server
#
#   If you are using calico on AWS
#
#    network:
#      plugin: calico
#      calico_network_provider:
#        cloud_provider: aws
#
# # To specify flannel interface
#
#    network:
#      plugin: flannel
#      flannel_network_provider:
#      iface: eth1
#
# # To specify flannel interface for canal plugin
#
#    network:
#      plugin: canal
#      canal_network_provider:
#        iface: eth1
#
  network:
    options:
      flannel_backend_type: vxlan
    plugin: canal
#
#    services:
#      kube-api:
#        service_cluster_ip_range: 10.43.0.0/16
#      kube-controller:
#        cluster_cidr: 10.42.0.0/16
#        service_cluster_ip_range: 10.43.0.0/16
#      kubelet:
#        cluster_domain: cluster.local
#        cluster_dns_server: 10.43.0.10
#
  services:
    etcd:
      backup_config:
        enabled: true
        interval_hours: 12
        retention: 6
        safe_timestamp: false
      creation: 12h
      extra_args:
        election-timeout: 5000
        heartbeat-interval: 500
      gid: 0
      retention: 72h
      snapshot: false
      uid: 0
    kube_api:
      always_pull_images: false
      pod_security_policy: false
      service_node_port_range: 30000-32767
  ssh_agent_auth: false
windows_prefered_cluster: false
```

{{% /accordion %}}

### 默认 DNS 提供商

下表显示了默认部署的 DNS 提供商。有关如何配置不同 DNS 提供商的更多信息，请参阅 [DNS 提供商相关的 RKE 文档]({{<baseurl>}}/rke/latest/en/config-options/add-ons/dns/)。CoreDNS 只能在 Kubernetes v1.12.0 及更高版本上使用。

| Rancher 版本      | Kubernetes 版本    | 默认 DNS 提供商 |
| ----------------- | ------------------ | --------------- |
| v2.2.5 及更高版本 | v1.14.0 及更高版本 | CoreDNS         |
| v2.2.5 及更高版本 | v1.13.x 及更低版本 | kube-dns        |
| v2.2.4 及更低版本 | 任意               | kube-dns        |

## YAML 中的 Rancher 特定参数

除了 RKE 配置文件选项外，还有可以在配置文件 (YAML) 中配置的 Rancher 特定设置如下。

### docker_root_dir

请参阅 [Docker 根目录](#docker-root-directory)。

### enable_cluster_monitoring

启用或禁用[集群监控]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/)的选项。

### enable_network_policy

启用或禁用项目网络隔离的选项。

如果你使用支持执行 Kubernetes 网络策略的 RKE 网络插件（例如 Canal 或 Cisco ACI 插件），则可以使用项目网络隔离。

### local_cluster_auth_endpoint

请参阅[授权集群端点](#authorized-cluster-endpoint)。

示例：

```yaml
local_cluster_auth_endpoint:
  enabled: true
  fqdn: "FQDN"
  ca_certs: |-
    -----BEGIN CERTIFICATE-----
    ...
    -----END CERTIFICATE-----
```

### 自定义网络插件

你可以使用 RKE 的[用户定义的附加组件功能]({{<baseurl>}}/rke/latest/en/config-options/add-ons/user-defined-add-ons/)来添加自定义网络插件。部署 Kubernetes 集群之后，你可以定义要部署的任何附加组件。

有两种方法可以指定附加组件：

- [内嵌附加组件]({{<baseurl>}}/rke/latest/en/config-options/add-ons/user-defined-add-ons/#in-line-add-ons)
- [为附加组件引用 YAML 文件]({{<baseurl>}}/rke/latest/en/config-options/add-ons/user-defined-add-ons/#referencing-yaml-files-for-add-ons)

有关如何通过编辑 `cluster.yml` 来配置自定义网络插件的示例，请参阅 [RKE 文档]({{<baseurl>}}/rke/latest/en/config-options/add-ons/network-plugins/custom-network-plugin-example)。
