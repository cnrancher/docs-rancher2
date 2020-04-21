---
title: 集群参数
description: 当您在 Rancher 中使用 RKE 启动的集群时，您可以选择自定义 Kubernetes 选项。您可以通过Rancher UI或集群配置文件配置 Kubernetes 选项。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 创建集群
  - 集群配置参数
  - 集群参数
---

当您在 Rancher 中[使用 RKE 启动](/docs/cluster-provisioning/rke-clusters/_index)的集群时，您可以选择自定义 Kubernetes 选项。

您可以通过以下两种方式之一配置 Kubernetes 选项：

- [Rancher UI](#rancher-ui)：通过 Rancher UI 设置 Kubernetes 集群的通用自定义的选项。
- [集群配置文件](#集群配置文件)：高级用户可以创建 RKE 配置文件，而不是使用 Rancher UI 为集群设置 Kubernetes 选项。通过使用配置文件，您可以在 YAML 中指定 RKE 安装中可用的任何选项，但 `system_images`参数除外。

在 Rancher v2.0.0 至 v2.2.x，Rancher 用于配置集群的配置文件与 [Rancher Kubernetes Engine 的集群配置文件](http://docs.rancher.com/docs/rke/latest/en/config-options/)相同。在 Rancher v2.3.0 中，RKE 信息仍然包含在配置文件中，但它与其他选项的层级是分开的，因此 RKE 集群配置应在`rancher_kubernetes_engine_config`参数下。有关详细信息，请参阅关于[集群配置文件](#集群配置文件)。

## Rancher UI

创建 [RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)时，您可以使用**集群选项**部分配置基本的 Kubernetes 选项。

### Kubernetes 版本

安装在集群节点上的 Kubernetes 版本。Rancher 基于原生的 Kubernetes [Hyperkube](https://github.com/rancher/hyperkube) 打包自己的 Kubernetes 版本。

### 网络插件

集群使用的[网络插件](https://kubernetes.io/docs/concepts/cluster-administration/networking/)。有关不同网络提供商的更多详细信息，请查看我们的[网络常见问题解答](/docs/faq/networking/cni-providers/_index)。

:::important 重要
启动集群后，您无法更改网络插件。因此，请谨慎选择要使用的网络插件，因为 Kubernetes 不允许在网络插件之间切换。使用网络插件创建集群后，更改网络插件将需要删除整个集群及其所有应用程序。
:::

开箱即用，Rancher 与以下网络插件兼容：

- [Canal](https://github.com/projectcalico/canal)
- [Flannel](https://github.com/coreos/flannel#flannel)
- [Calico](https://docs.projectcalico.org/v3.11/introduction/)
- [Weave](https://github.com/weaveworks/weave) (自 v2.2.0 可用)

**Canal 注意事项：**

在 v2.0.0-v2.0.4 和 v2.0.6 中，使用 Canal 时，默认的集群网络隔离选项是开启的。在自动启用网络隔离后，它阻止了[项目](/docs/cluster-admin/projects-and-namespaces/_index)之间的 Pod 通过 Pod IP 直接通信。

从 v2.0.7 开始，如果您使用 Canal，您还可以选择使用**网络隔离**，这将启用或禁用不同[项目](/docs/cluster-admin/projects-and-namespaces/_index)中的 Pod 是否可以通过 Pod IP 直接通信。

> **Rancher v2.0.0 - v2.0.6 请用户注意：**
>
> - 在以前的 Rancher 版本中，Canal 隔离了项目网络通信，而且没有禁用它的选项。如果您正在使用任何这些 Rancher 版本，请注意，使用 Canal 会阻止不同项目中的 Pod 之间通过 Pod Ip 的所有通信。
> - 如果您有使用 Canal 的集群并且要升级到 v2.0.7，则这些集群默认情况下会启用项目网络隔离。如果要禁用项目网络隔离，请编辑集群并禁用该选项。

**Flannel 注意事项：**

在 v2.0.5 中，这是默认选项，它不会阻止项目之间的任何网络通信。

**Weave 注意事项：**

当 Weave 被选为网络插件时，Rancher 将通过生成随机密码自动启用加密。如果要手动指定密码，请参阅如何使用[RKE 配置文件](/docs/cluster-provisioning/rke-clusters/options/_index)和[Weave 网络插件选项](http://docs.rancher.com/docs/rke/latest/en/config-options/add-ons/network-plugins/#weave-network-plug-in-options)配置集群。

### Kubernetes Cloud Provider

您可以配置[Kubernetes Cloud Provider](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index)。如果您想要在 Kubernetes 中使用[卷和存储](/docs/cluster-admin/volumes-and-storage/_index), 通常，您必须选择特定的 Cloud Provider 才能使用它。例如，如果您想使用 Amazon EBS，则需要选择 `aws` Cloud Provider。

> **注意：** 如果您要使用的 Cloud Provider 不在 UI 的选项，则需要使用 [RKE 配置文件](#集群配置文件)来配置 Cloud Provider。请参考 [RKE Cloud Provider 文档](http://docs.rancher.com/docs/rke/latest/en/config-options/cloud-providers/)了解如何配置 Cloud Provider。

如果要查看集群的所有配置选项，请单击右下角的**显示高级选项**。高级选项如下所述：

### 私有镜像仓库

_v2.2.0 可用_

集群级别的私有镜像仓库配置仅用于启动集群。

在 Rancher 中设置私有镜像仓库的主要方法有两种：通过**全局**视图中的**设置**选项卡设置[全局默认镜像仓库](/docs/admin-settings/config-private-registry/_index)，以及通过集群级别设置中的高级选项设置私有镜像仓库。全局默认镜像仓库旨在用于不需要登录认证的镜像仓库的离线安装。集群级别的私有镜像仓库旨在用于所有需要登录认证的私有镜像仓库。

如果您的私有镜像仓库需要登录认证，则需要通过编辑从镜像仓库中提取镜像的每个集群的集群选项，并将登录认证信息传递给 Rancher。

私有镜像仓库配置选项告诉 Rancher 将在哪里拉取集群中使用的[系统镜像](http://docs.rancher.com/docs/rke/latest/en/config-options/system-images/)和[插件镜像](http://docs.rancher.com/docs/rke/latest/en/config-options/add-ons/)。

- **系统镜像** 是维护 Kubernetes 集群所需的组件。
- **插件镜像** 用于部署多个集群组件包括网络插件、ingress 控制器、DNS 插件或 `metrics-server`。

请参阅 [RKE 有关私有镜像仓库文档](http://docs.rancher.com/docs/rke/latest/en/config-options/private-registries/)了解私有镜像仓库在集群配置过程中组件的更多信息。

### 授权集群访问地址

_v2.2.0 可用_

授权集群端点可用于直接访问 Kubernetes API Server，无需通过 Rancher 进行通信。

> 授权的集群端点仅适用于 Rancher 启动的 Kubernetes 集群。换句话说，它只适用于 Rancher [使用 RKE](/docs/overview/architecture/_index)来配置集群的集群。它不适用于托管的 Kubernetes 集群，例如 Amazon 的 EKS。

这在 Rancher 启动的 Kubernetes 集群中默认启用，使用具有`controlplane` 角色的节点的 IP 和默认的 Kubernetes 自签名证书。

有关授权的集群端点如何工作以及使用它的原因的更多详细信息，请参阅[产品架构](/docs/overview/architecture/_index)。

我们建议将负载均衡器与授权的集群端点一起使用。有关详细信息，请参阅[推荐架构](/docs/overview/architecture-recommendations/_index)。

## 高级选项

在 Rancher UI 中创建集群时，以下选项可用。它们位于**高级选项**。

### NGINX Ingress

启用或禁用 [NGINX ingress 控制器](http://docs.rancher.com/docs/rke/latest/en/config-options/add-ons/ingress-controller/)的选项。

### Node Port 范围

更改可用于[节点端口服务](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport)的端口范围的选项默认值为`30000-32767`。

### 监控指标

启用或禁用 [metrics-server](http://docs.rancher.com/docs/rke/latest/en/config-options/add-ons/metrics-server/) 的选项。

### Pod 安全策略

启用并选择默认的[Pod 安全策略](/docs/admin-settings/pod-security-policies/_index)的选项。必须先配置 Pod 安全策略，然后才能使用此选项。

### 节点 Docker 版本检查

要求在添加到集群的集群节点上安装[受支持的 Docker 版本](/docs/installation/requirements/_index)或允许在集群节点上安装不受支持的 Docker 版本。

### Docker 根目录

如果要添加到集群的节点配置了非默认的 Docker 根目录（默认为`/var/lib/docker`），请在此选项中指定正确的 Docker 根目录。

### 定期的 etcd 快照

选项来启用或禁用[定期的 etcd 快照](http://docs.rancher.com/docs/rke/latest/en/etcd-snapshots/#etcd-recurring-snapshots)。

## 集群配置文件

高级用户可以创建 RKE 配置文件，而不是使用 Rancher UI 为集群配置 Kubernetes 选项。使用配置文件允许您使用 RKE 安装中的任何[可用选项](http://docs.rancher.com/docs/rke/latest/en/config-options/)，但`system_images`选项除外。

> **注意：** 在 Rancher v2.0.5 和 v2.0.6 中，配置文件（YAML）中的服务名称应该只包含下划线：例如，`kube_api`和`kube_controller`。

- 要直接从 Rancher UI 编辑 RKE 配置文件，请单击**编辑 YAML**。
- 要从现有 RKE 文件读取，请单击**从文件读取**。

![image](/img/rancher/cluster-options-yaml.png)

根据您的 Rancher 版本，配置文件的结构是不同的。以下是 Rancher v2.0.0-v2.2.x 和 Rancher v2.3.0+ 的示例配置文件。

### Rancher v2.3.0+ 配置文件结构

RKE（Rancher Kubernetes Engine）是 Rancher 用来配置 Kubernetes 集群的工具。Rancher 的集群配置文件过去与[RKE 配置文件](http://docs.rancher.com/docs/rke/latest/en/example-yamls/)具有相同的结构，但后来结构发生了变化，在 Rancher 中，RKE 集群配置选项与非 RKE 配置选项分开。因此，集群的配置需要嵌套在集群配置文件中的`rancher_kubernetes_engine_config`参数下。使用早期版本的 Rancher 创建的集群配置文件将需要按照此格式更新。下面是一个集群配置文件示例。

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

下面包含一个旧版本的集群配置文件示例。

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

下表显示了默认情况下部署的 DNS 插件。有关如何配置不同的 DNS 插件的详细信息，请参阅[关于 DNS 插件的文档](http://docs.rancher.com/docs/rke/latest/en/config-options/add-ons/dns/)。CoreDNS 只能在 Kubernetes v1.12.0 及更高版本上使用。

| Rancher 版本 | Kubernetes 版本 | 默认 DNS 插件 |
| ------------ | --------------- | ------------- |
| v2.2.5+      | v1.14.0+        | CoreDNS       |
| v2.2.5+      | v1.13.x-        | kube-dns      |
| v2.2.4-      | 任何版本        | kube-dns      |

## Rancher 特有选项

_v2.2.0 可用_

除了 RKE 配置文件选项之外，还有可以在配置文件（YAML）中配置 Rancher 的特有选项):

### docker_root_dir

参阅[Docker 根目录](#docker-根目录)。

### enable_cluster_monitoring

启用或禁用[集群监控](/docs/cluster-admin/tools/monitoring/_index)选项。

### enable_network_policy

启用或禁用项目网络隔离选项。

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

您可以使用 RKE 的[用户定义附加功能](http://docs.rancher.com/docs/rke/latest/en/config-options/add-ons/user-defined-add-ons/)添加自定义网络插件。您可以在部署 Kubernetes 集群后定义要部署的任何附加组件。

有两种方法可以指定附加组件:

- [行内插件](http://docs.rancher.com/docs/rke/latest/en/config-options/add-ons/user-defined-add-ons/#in-line-add-ons)
- [引用外部的 YAML 文件](http://docs.rancher.com/docs/rke/latest/en/config-options/add-ons/user-defined-add-ons/#referencing-yaml-files-for-add-ons)

有关如何通过编辑配置自定义网络插件的示例 `cluster.yml`，请参阅 [RKE 文档](http://docs.rancher.com/docs/rke/latest/en/config-options/add-ons/network-plugins/custom-network-plugins-example)。
