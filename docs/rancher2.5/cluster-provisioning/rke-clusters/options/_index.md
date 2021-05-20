---
title: RKE集群参数
description: 当您在 Rancher 中使用 RKE 启动集群时，您可以选择自定义 Kubernetes 选项。您可以通过Rancher UI或集群配置文件配置 Kubernetes 选项。
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
  - 集群配置参数
  - 集群参数
---

[使用 RKE 启动](/docs/rancher2.5/cluster-provisioning/rke-clusters/_index)的集群时，您可以选择自定义 Kubernetes 选项，通过 Rancher UI 或集群配置文件配置 Kubernetes 选项。

- [Rancher UI](#rancher-ui)：通过 Rancher UI 设置 Kubernetes 集群的通用自定义的选项。
- [集群配置文件](#集群配置文件)：除了 Rancher UI 之外，高级用户还可以通过 RKE 配置文件，在 YAML 中指定 RKE 安装中可用的任何选项，`system_images`参数除外。

在 v2.0.0 至 v2.2.x 版本中，Rancher 用于配置集群的配置文件与 [Rancher Kubernetes Engine 的集群配置文件](/docs/rke/config-options/_index)相同。

在 v2.3.0 和更新的版本中，RKE 信息与其他选项的层级是分开的，因此，高级用户使用方法 2 在 v2.3.0 和更新版本的 Rancher 配置中 RKE 集群参数时，应在`rancher_kubernetes_engine_config`参数下修改配置 RKE 集群参数。详情请参考[集群配置文件](#集群配置文件)

## Rancher UI

创建 [RKE 集群](/docs/rancher2.5/cluster-provisioning/rke-clusters/_index)时，您可以使用**集群选项**部分配置基本的 Kubernetes 选项。

### Kubernetes 版本

安装在集群节点上的 Kubernetes 版本。Rancher 基于原生的 Kubernetes [Hyperkube](https://github.com/rancher/hyperkube) 打包自己的 Kubernetes 版本。

### 网络插件

集群使用的[网络插件](https://kubernetes.io/zh/docs/concepts/cluster-administration/networking/)。有关不同网络提供商的更多详细信息，请查看我们的[网络常见问题解答](/docs/rancher2.5/faq/networking/cni-providers/_index)。

:::important 重要
启动集群后，您无法更改网络插件，请谨慎选择要使用的网络插件。Kubernetes 不支持切换网络插件。创建集群后，如果您需要更改网络插件，只能删除整个集群及其所有应用程序，重新创建集群和配置网络插件。
:::

开箱即用，Rancher 与以下网络插件兼容：

- [Canal](https://github.com/projectcalico/canal)
- [Flannel](https://github.com/coreos/flannel#flannel)
- [Calico](https://docs.projectcalico.org/v3.11/introduction/)
- [Weave](https://github.com/weaveworks/weave) (自 v2.2.0 可用)

**Canal 注意事项：**

在 v2.0.0-v2.0.4 和 v2.0.6 中，使用 Canal 时，默认的集群网络隔离选项是开启的阻止了[项目](/docs/rancher2.5/cluster-admin/projects-and-namespaces/_index)之间的 Pod 通过 Pod IP 直接通信。

从 v2.0.7 开始，如果您使用 Canal，您还可以选择使用**网络隔离**，自行决定[项目](/docs/rancher2.5/cluster-admin/projects-and-namespaces/_index)中的 Pod 是否可以通过 Pod IP 直接通信。

> **Rancher v2.0.0 - v2.0.6 请用户注意：**
>
> - 在以前的 Rancher 版本中，Canal 隔离了项目网络通信，而且没有禁用它的选项。如果您正在使用这些 Rancher 版本，请注意，使用 Canal 会阻止不同项目中的 Pod 之间通过 Pod Ip 的所有通信。
> - 如果您有使用 Canal 的集群并且要升级到 v2.0.7，则这些集群默认情况下会启用项目网络隔离。如果要禁用项目网络隔离，请编辑集群并禁用该选项。

**Flannel 注意事项：**

Flannel 是 Rancher v2.0.5 默认使用的网络插件，不会阻止项目之间的网络通信。

**Weave 注意事项：**

当 Weave 被选为网络插件时，Rancher 将通过生成随机密码自动启用加密。如果要手动指定密码，请参考如何使用[RKE 配置文件](/docs/rancher2.5/cluster-provisioning/rke-clusters/options/_index)和[Weave 网络插件选项](/docs/rke/config-options/add-ons/network-plugins/_index)配置集群。

### 项目网络隔离

项目网络隔离是用来启用或禁用不同项目中的 pod 之间的通信。

#### 2.5.8 和更新版本

要启用项目网络隔离作为集群选项，你需要使用任何支持执行 Kubernetes 网络策略的 RKE 网络插件，如 Canal 或 Cisco ACI 插件。

#### 2.5.8 之前的版本

要启用项目网络隔离作为一个集群选项，你需要使用 Canal 作为 CNI。

### Kubernetes Cloud Provider

您可以配置[Kubernetes Cloud Provider](/docs/rancher2.5/cluster-provisioning/rke-clusters/cloud-providers/_index)。如果您想要在 Kubernetes 中使用[卷和存储](/docs/rancher2.5/cluster-admin/volumes-and-storage/_index), 通常，您必须选择特定的 Cloud Provider 才能使用它。例如，如果您想使用 Amazon EBS，则需要选择 `aws` Cloud Provider。

> **注意：** 如果您要使用的 Cloud Provider 不在 UI 的选项，则需要使用 [RKE 配置文件](#集群配置文件)来配置 Cloud Provider。请参考 [RKE Cloud Provider 文档](/docs/rke/config-options/cloud-providers/_index)了解如何配置 Cloud Provider。

如果要查看集群的所有配置选项，请单击右下角的**显示高级选项**。高级选项如下所述：

### 私有镜像仓库

_v2.2.0 可用_

集群级别的私有镜像仓库配置仅用于启动集群。

在 Rancher 中设置私有镜像仓库的主要方法有两种：通过**全局**视图中的**设置**选项卡设置[全局默认镜像仓库](/docs/rancher2.5/admin-settings/config-private-registry/_index)，以及通过集群级别设置中的高级选项设置私有镜像仓库。全局默认镜像仓库旨在用于不需要登录认证的镜像仓库的离线安装。集群级别的私有镜像仓库旨在用于所有需要登录认证的私有镜像仓库。

如果您的私有镜像仓库需要登录认证，则需要通过编辑从镜像仓库中提取镜像的每个集群的集群选项，并将登录认证信息传递给 Rancher。

私有镜像仓库配置选项告诉 Rancher 从哪里拉取集群中使用的[系统镜像](/docs/rke/config-options/system-images/_index)和[插件镜像](/docs/rke/config-options/add-ons/_index)。

- **系统镜像** 是维护 Kubernetes 集群所需的组件。
- **插件镜像** 用于部署多个集群组件包括网络插件、ingress 控制器、DNS 插件或 `metrics-server`。

请参阅 [RKE 有关私有镜像仓库文档](/docs/rke/config-options/private-registries/_index)了解配置集群组件过程中关于私有镜像仓库的更多信息。

### 授权集群访问地址

_v2.2.0 可用_

授权集群端点可用于直接访问 Kubernetes API Server，无需通过 Rancher 进行通信。

> 授权的集群端点仅适用于 Rancher 启动的 Kubernetes 集群。换句话说，它只适用于 Rancher [使用 RKE](/docs/rancher2.5/overview/architecture/_index)来配置集群的集群。它不适用于托管的 Kubernetes 集群，例如 Amazon 的 EKS。

这在 Rancher 启动的 Kubernetes 集群中默认启用，使用具有`controlplane` 角色的节点的 IP 和默认的 Kubernetes 自签名证书。

有关授权的集群端点如何工作以及使用它的原因的更多详细信息，请参阅[产品架构](/docs/rancher2.5/overview/architecture/_index)。

我们建议将负载均衡器与授权的集群端点一起使用。有关详细信息，请参阅[推荐架构](/docs/rancher2.5/overview/architecture-recommendations/_index)。

### 节点池

有关使用 Rancher UI 在 RKE 集群中设置节点池的信息，请参阅 [本页。](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/_index)。

## 高级选项

在 Rancher UI 中创建集群时，可以配置以下高级选项。

### NGINX Ingress

启用或禁用 [NGINX ingress 控制器](/docs/rke/config-options/add-ons/ingress-controllers/_index)的选项。

### Node Port 范围

更改可用于[节点端口服务](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport)的端口范围的选项默认值为`30000-32767`。

### 监控指标

启用或禁用 [metrics-server](/docs/rke/config-options/add-ons/metrics-server/_index) 的选项。

### Pod 安全策略

启用并选择默认的[Pod 安全策略](/docs/rancher2.5/admin-settings/pod-security-policies/_index)的选项。必须先配置 Pod 安全策略，然后才能使用此选项。

### 节点 Docker 版本检查

要求在添加到集群的集群节点上安装[受支持的 Docker 版本](/docs/rancher2.5/installation/requirements/_index)或允许在集群节点上安装不受支持的 Docker 版本。

### Docker 根目录

如果要添加到集群的节点配置了非默认的 Docker 根目录（默认为`/var/lib/docker`），请在此选项中指定正确的 Docker 根目录。

### 定期的 etcd 快照

选项来启用或禁用[定期的 etcd 快照](/docs/rke/etcd-snapshots/_index)。

## 集群配置文件

除了 Rancher UI 之外，高级用户还可以通过 RKE 配置文件，在 YAML 中指定 RKE 安装[可用选项](/docs/rke/config-options/_index)，`system_images`选项除外。

> **注意：** 在 Rancher v2.0.5 和 v2.0.6 中，配置文件（YAML）中的服务名称应该只包含下划线：例如，`kube_api`和`kube_controller`。

- 单击**编辑 YAML**，使用 Rancher UI 编辑 RKE 配置文件。
- 单击**从文件读取**，从现有 RKE 文件读取 RKE 参数信息。

![image](/img/rancher/cluster-options-yaml.png)

Rancher v2.0.0-v2.2.x 和 Rancher v2.3.0+ 配置文件的结构是不同的。以下是两者的配置文件示例。

### Rancher v2.3.0+ 配置文件结构

RKE（Rancher Kubernetes Engine）是 Rancher 配置 Kubernetes 集群的工具。Rancher 的集群配置文件过去与[RKE 配置文件](/docs/rke/example-yamls/_index)具有相同的结构，但后来结构发生了变化，RKE 集群配置选项与非 RKE 配置选项分，集群的配置嵌套在集群配置文件中的`rancher_kubernetes_engine_config`参数下。使用早期版本的 Rancher 创建的集群配置文件将需要按照此格式更新。下面是一个新版集群配置文件示例。

```yaml
#
## Cluster Config
#
docker_root_dir: /var/lib/docker
enable_cluster_alerting: false
enable_cluster_monitoring: false
enable_network_policy: false
local_cluster_auth_endpoint:
  enabled: true
#
## Rancher Config
#
rancher_kubernetes_engine_config: # Your RKE template config goes here.
  addon_job_timeout: 30
  authentication:
    strategy: x509
  ignore_docker_version: true
  #
  ## # Currently only nginx ingress provider is supported.
  ## # To disable ingress controller, set `provider: none`
  ## # To enable ingress on specific nodes, use the node_selector, eg:
  ##    provider: nginx
  ##    node_selector:
  ##      app: ingress
  #
  ingress:
    provider: nginx
  kubernetes_version: v1.15.3-rancher3-1
  monitoring:
    provider: metrics-server
  #
  ##   If you are using calico on AWS
  #
  ##    network:
  ##      plugin: calico
  ##      calico_network_provider:
  ##        cloud_provider: aws
  #
  ## # To specify flannel interface
  #
  ##    network:
  ##      plugin: flannel
  ##      flannel_network_provider:
  ##      iface: eth1
  #
  ## # To specify flannel interface for canal plugin
  #
  ##    network:
  ##      plugin: canal
  ##      canal_network_provider:
  ##        iface: eth1
  #
  network:
    options:
      flannel_backend_type: vxlan
    plugin: canal
  #
  ##    services:
  ##      kube-api:
  ##        service_cluster_ip_range: 10.43.0.0/16
  ##      kube-controller:
  ##        cluster_cidr: 10.42.0.0/16
  ##        service_cluster_ip_range: 10.43.0.0/16
  ##      kubelet:
  ##        cluster_domain: cluster.local
  ##        cluster_dns_server: 10.43.0.10
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

### Rancher v2.0.0-v2.2.x 配置文件结构

以下是一个旧版本的集群配置文件示例。

```yaml
addon_job_timeout: 30
authentication:
  strategy: x509
ignore_docker_version: true
#
## # Currently only nginx ingress provider is supported.
## # To disable ingress controller, set `provider: none`
## # To enable ingress on specific nodes, use the node_selector, eg:
##    provider: nginx
##    node_selector:
##      app: ingress
#
ingress:
  provider: nginx
kubernetes_version: v1.15.3-rancher3-1
monitoring:
  provider: metrics-server
#
##   If you are using calico on AWS
#
##    network:
##      plugin: calico
##      calico_network_provider:
##        cloud_provider: aws
#
## # To specify flannel interface
#
##    network:
##      plugin: flannel
##      flannel_network_provider:
##      iface: eth1
#
## # To specify flannel interface for canal plugin
#
##    network:
##      plugin: canal
##      canal_network_provider:
##        iface: eth1
#
network:
  options:
    flannel_backend_type: vxlan
  plugin: canal
#
##    services:
##      kube-api:
##        service_cluster_ip_range: 10.43.0.0/16
##      kube-controller:
##        cluster_cidr: 10.42.0.0/16
##        service_cluster_ip_range: 10.43.0.0/16
##      kubelet:
##        cluster_domain: cluster.local
##        cluster_dns_server: 10.43.0.10
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
```

### 默认 DNS 插件

下表显示了默认情况下部署的 DNS 插件。CoreDNS 只能在 Kubernetes v1.12.0 及更高版本上使用。

有关如何配置不同的 DNS 插件的详细信息，请参阅[关于 DNS 插件的文档](/docs/rke/config-options/add-ons/dns/_index)。

| Rancher 版本 | Kubernetes 版本 | 默认 DNS 插件 |
| :----------- | :-------------- | :------------ |
| v2.2.5+      | v1.14.0+        | CoreDNS       |
| v2.2.5+      | v1.13.x-        | kube-dns      |
| v2.2.4-      | 任何版本        | kube-dns      |

## Rancher 特有选项

_v2.2.0 可用_

除了 RKE 配置文件选项之外，还有可以在配置文件（YAML）中配置 Rancher 的特有选项)：`docker_root_dir`、`enable_cluster_monitoring`、`enable_network_policy`和`local_cluster_auth_endpoint`。

### docker_root_dir

参阅[Docker 根目录](#docker-根目录)。

### enable_cluster_monitoring

启用或禁用[集群监控](/docs/rancher2.5/cluster-admin/tools/cluster-monitoring/_index)选项。

### enable_network_policy

启用或禁用项目网络隔离选项。

在 Rancher v2.5.8 版之前，项目网络隔离只有在使用 RKE 的 Canal 网络插件时才可用。

在 v2.5.8+版本中，如果你使用任何支持执行 Kubernetes 网络策略的 RKE 网络插件，如 Canal 或 Cisco ACI 插件，项目网络隔离是可用的。

### local_cluster_auth_endpoint

参考[授权集群访问地址](#授权集群访问地址)。

例子:

```yaml
local_cluster_auth_endpoint:
  enabled: true
  fqdn: "FQDN"
  ca_certs: "BASE64_CACERT"
```

### 自定义网络插件

_v2.2.4 可用_

您可以使用 RKE 的[用户定义附加功能](/docs/rke/config-options/add-ons/user-defined-add-ons/_index)添加自定义网络插件。您可以在部署 Kubernetes 集群后定义要部署的任何附加组件。

有两种方法可以指定附加组件:

- [行内插件](/docs/rke/config-options/add-ons/user-defined-add-ons/_index)
- [引用外部的 YAML 文件](/docs/rke/config-options/add-ons/user-defined-add-ons/_index)

有关如何通过编辑配置自定义网络插件的示例 `cluster.yml`，请参阅 [RKE 文档](/docs/rke/config-options/add-ons/network-plugins/custom-network-plugin-example/_index)。
