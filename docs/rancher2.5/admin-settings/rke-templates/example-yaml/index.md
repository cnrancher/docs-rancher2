---
title: YAML 示例
description: 下面是一个示例 RKE 模板配置文件供参考。RKE 模板中的 YAML 使用与创建 RKE 集群时相同的自定义项。但是，由于 YAML 是在 Rancher 创建的 RKE 集群的上下文中使用，因此来自 RKE 文档的设置需要嵌套在`rancher_kubernetes_engine_config`指令下。
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
  - 系统管理员指南
  - RKE模板
  - YAML 示例
---

下面是一个示例 RKE 模板配置文件供参考。

RKE 模板中的 YAML 使用与创建 RKE 集群时相同的自定义项。但是，由于 YAML 是在 Rancher 创建的 RKE 集群的上下文中使用，因此来自 RKE 文档的设置需要嵌套在`rancher_kubernetes_engine_config`指令下。

```yaml
##
## Cluster Config
##
docker_root_dir: /var/lib/docker

enable_cluster_alerting: false
## This setting is not enforced. Clusters
## created with this sample template
## would have alerting turned off by default,
## but end users could still turn alerting
## on or off.

enable_cluster_monitoring: true
## This setting is not enforced. Clusters
## created with this sample template
## would have monitoring turned on
## by default, but end users could still
## turn monitoring on or off.

enable_network_policy: false
local_cluster_auth_endpoint:
  enabled: true
##
## Rancher Config
##
rancher_kubernetes_engine_config: # Your RKE template config goes here.
  addon_job_timeout: 30
  authentication:
    strategy: x509
  ignore_docker_version: true
  ##
  ## # Currently only nginx ingress provider is supported.
  ## # To disable ingress controller, set `provider: none`
  ## # To enable ingress on specific nodes, use the node_selector, eg:
  ##    provider: nginx
  ##    node_selector:
  ##      app: ingress
  ##
  ingress:
    provider: nginx
  kubernetes_version: v1.15.3-rancher3-1
  monitoring:
    provider: metrics-server
  ##
  ##   If you are using calico on AWS
  ##
  ##    network:
  ##      plugin: calico
  ##      calico_network_provider:
  ##        cloud_provider: aws
  ##
  ## # To specify flannel interface
  ##
  ##    network:
  ##      plugin: flannel
  ##      flannel_network_provider:
  ##      iface: eth1
  ##
  ## # To specify flannel interface for canal plugin
  ##
  ##    network:
  ##      plugin: canal
  ##      canal_network_provider:
  ##        iface: eth1
  ##
  network:
    options:
      flannel_backend_type: vxlan
    plugin: canal
  ##
  ##    services:
  ##      kube-api:
  ##        service_cluster_ip_range: 10.43.0.0/16
  ##      kube-controller:
  ##        cluster_cidr: 10.42.0.0/16
  ##        service_cluster_ip_range: 10.43.0.0/16
  ##      kubelet:
  ##        cluster_domain: cluster.local
  ##        cluster_dns_server: 10.43.0.10
  ##
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
