---
title: 系统镜像
---

## 概述

RKE 在部署 Kubernetes 的时候，会从镜像仓库中拉镜像。这些镜像被用作 Kubernetes 系统组件，同时也帮助部署这些系统组件。

从`v0.1.6`开始，多个系统镜像的功能被整合到一个`rancher/rke-tools`镜像中，以简化和加快部署过程。

您可以配置[网络插件](/docs/rke/config-options/add-ons/network-plugins/_index)。[ingress controller](/docs/rke/config-options/add-ons/ingress-controllers/_index)和[dns provider](/docs/rke/config-options/add-ons/dns/_index)以及这些附加组件的选项分别在`cluster. yml`中，以及这些附加组件的选项。

下面是通过 RKE 部署 Kubernetes 所使用的系统镜像列表的一个例子。Kubernetes 的默认版本是与特定版本的系统镜像绑定的。

- 对于 RKE v0.2.x 及以下版本，版本和系统镜像版本位于：https://github.com/rancher/types/blob/release/v2.2/apis/management.cattle.io/v3/k8s_defaults.go

- 对于 RKE v0.3.0 及以上版本，版本和系统镜像版本位于：https://github.com/rancher/kontainer-driver-metadata/blob/master/rke/k8s_rke_system_images.go

> **注意：**随着 RKE 版本的发布，这些镜像的标签将不再是最新的。这个列表是针对`v1.10.3-rancher2`的。

```yaml
system_images:
  etcd: rancher/coreos-etcd:v3.2.24
  alpine: rancher/rke-tools:v0.1.24
  nginx_proxy: rancher/rke-tools:v0.1.24
  cert_downloader: rancher/rke-tools:v0.1.24
  kubernetes: rancher/hyperkube:v1.13.1-rancher1
  kubernetes_services_sidecar: rancher/rke-tools:v0.1.24
  pod_infra_container: rancher/pause-amd64:3.1

  # kube-dns images
  kubedns: rancher/k8s-dns-kube-dns-amd64:1.15.0
  dnsmasq: rancher/k8s-dns-dnsmasq-nanny-amd64:1.15.0
  kubedns_sidecar: rancher/k8s-dns-sidecar-amd64:1.15.0
  kubedns_autoscaler: rancher/cluster-proportional-autoscaler-amd64:1.0.0

  # CoreDNS images
  coredns: coredns/coredns:1.2.6
  coredns_autoscaler: rancher/cluster-proportional-autoscaler-amd64:1.0.0

  # Flannel images
  flannel: rancher/coreos-flannel:v0.10.0
  flannel_cni: rancher/coreos-flannel-cni:v0.3.0

  # Calico images
  calico_node: rancher/calico-node:v3.4.0
  calico_cni: rancher/calico-cni:v3.4.0
  calico_controllers: ""
  calico_ctl: rancher/calico-ctl:v2.0.0

  # Canal images
  canal_node: rancher/calico-node:v3.4.0
  canal_cni: rancher/calico-cni:v3.4.0
  canal_flannel: rancher/coreos-flannel:v0.10.0

  # Weave images
  weave_node: weaveworks/weave-kube:2.5.0
  weave_cni: weaveworks/weave-npc:2.5.0

  # Ingress controller images
  ingress: rancher/nginx-ingress-controller:0.21.0-rancher1
  ingress_backend: rancher/nginx-ingress-controller-defaultbackend:1.4

  # Metrics server image
  metrics_server: rancher/metrics-server-amd64:v0.3.1
```

Prior to `v0.1.6`, instead of using the `rancher/rke-tools` image, we used the following images:

在 "v0.1.6 "之前，我们不使用`rancher/rke-tools`镜像，而是使用以下镜像：

```yaml
system_images:
  alpine: alpine:latest
  nginx_proxy: rancher/rke-nginx-proxy:v0.1.1
  cert_downloader: rancher/rke-cert-deployer:v0.1.1
  kubernetes_services_sidecar: rancher/rke-service-sidekick:v0.1.0
```

## 离线安装

如果您处于离线环境，不能访问`docker.io`，您将需要在您的集群配置文件中设置您的[私有镜像仓库](/docs/rke/config-options/private-registries/_index)。设置好私有镜像仓库后，您需要更新这些镜像，以便从您的私有镜像仓库中提取最新版本的镜像。
