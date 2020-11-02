---
title: DNS提供商
---

## 概述

RKE 提供了以下三种 DNS 提供商，作为附加组件部署：

- NodeLocal DNS
- [CoreDNS](https://coredns.io)
- [kube-dns](https://github.com/kubernetes/dns)

| RKE 版本      | Kubernetes 版本                | 默认 DNS 提供商 |
| :------------ | :----------------------------- | :-------------- |
| v0.2.5 及以上 | v1.14.0 及以上                 | CoreDNS         |
| v0.2.5 及以上 | v1.13.x 及以下                 | kube-dns        |
| v0.2.4 及以下 | 无版本要求                     | kube-dns        |
| v1.1.0 及以上 | v1.15.11+、v1.16.8 和 v1.17.4+ | NodeLocal DNS   |

在 RKE v0.2.5 及更新版本中，使用 Kubernetes 1.14 及以上版本时，CoreDNS 是默认 DNS 提供商。如果使 RKE 版本低于 v0.2.5，则 kube-dns 是默认 DNS 提供商。

## NodeLocal DNS

### 先决条件

启用 NodeLocal DNS 选项需要满足以下条件：

- RKE 版本为 v1.1.0 或更新版本
- Kubernetes 版本为 v1.15.11+、v1.16.8+或 v1.17.4+。

NodeLocal DNS 是一个额外的组件，可以部署在每个节点上，提高 DNS 性能。由于它不能替代`provider`参数，所以仍然需要为每个节点配置一个可用的 DNS 提供商。有关 NodeLocal DNS 工作原理的更多信息，请参见[在 Kubernetes 集群中使用 NodeLocal DNS Cache](https://kubernetes.io/zh/docs/tasks/administer-cluster/nodelocaldns/)。

### 配置 NodeLocal DNS

使用`ip_address`参数配置每台主机监听的链路本地 IP 地址，请确保这个 IP 地址在主机上没有被占用。

```yaml
dns:
  provider: coredns
  nodelocal:
    ip_address: "169.254.20.10"
```

> **说明：**当在现有集群上启用 NodeLocal DNS 时，当前正在运行的 pod 不会被修改，更新后的`/etc/resolv.conf`配置只对启用 NodeLocal DNS 后启动的 pod 生效。

### 移除 NodeLocal DNS

删除`ip_address`值就会将从集群中删除 NodeLocal DNS。

> **说明：** 删除 NodeLocal DNS 时， 可能会对 DNS 造成干扰。更新后的`/etc/resolv.conf`配置仅对删除 NodeLocal DNS 后启动的 pod 生效。在一般情况下，使用默认`dnsPolicy: ClusterFirst`将需要重新部署。

> **说明：** 如果您从一个 DNS 提供商切换到另一个 DNS 提供商，在部署新的 DNS 提供商之前，现有的 DNS 提供商会被删除。

## CoreDNS

_v0.2.5 及更新版本可用_

CoreDNS 只能在 Kubernetes v1.14.0 及以上版本上使用。

RKE 将 CoreDNS 部署为一个默认副本为 1 的 Deployment，该 pod 由`coredns`一个容器组成。RKE 也会将 coredns-autoscaler 部署为 Deployment，使用核心数量和节点的数量来扩展 coredns Deployment。详情请参考[Linear Mode](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler#linear-mode)。

CoreDNS 使用的镜像在[`system_images`](/docs/rke/config-options/system-images/_index)中。对于每个 Kubernetes 版本，都有与 CoreDNS 相关联的默认镜像，但这些镜像可以通过更改`system_images`中的镜像标签来覆盖。

### 调度 CoreDNS

如果只想在特定的节点上部署 CoreDNS pod ，可以在`dns`部分设置一个`node_selector`。`node_selector`中的标签需要与要部署 CoreDNS pod 的节点上的标签相匹配。

```yaml
nodes:
  - address: 1.1.1.1
    role: [controlplane, worker, etcd]
    user: root
    labels:
      app: dns

dns:
  provider: coredns
  node_selector:
    app: dns
```

### 配置 CoreDNS

#### 上游名称服务器

默认情况下，CoreDNS 使用主机配置的命名服务器（通常保存在`/etc/resolv.conf`路径下）来解析外部查询。如果想配置特定的上游名称服务器，可以使用`upstreamnameservers`指令。

设置 `upstreamnameservers`时，还需要同步修改`provider`配置。

```yaml
dns:
  provider: coredns
  upstreamnameservers:
    - 1.1.1.1
    - 8.8.4.4
```

## kube-dns

RKE 将 kube-dns 部署为一个默认副本为 1 的 Deployment，该 pod 由`kubedns`、`dnsmasq`和`sidecar`共 3 个容器组成。RKE 也将 kube-dns-autoscaler 部署为 Deployment，通过使用核心和节点数量来扩展 kube-dns Deployment。详情请参考[Linear Mode](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler#linear-mode)。

kube-dns 使用的镜像在[`system_images`](/docs/rke/config-options/system-images/_index)下。对于每个 Kubernetes 版本，都有与 kube-dns 相关联的默认镜像，但这些图片可以通过更改`system_images`中的镜像标签来覆盖。

### 调度 kube-dns

_v0.2.0 及更新版本可用_

如果只想在特定的节点上部署 kube-dns pod，可以在`dns`部分设置一个`node_selector`。`node_selector`中的标签需要与要部署 CoreDNS pod 的节点上的标签相匹配。

```yaml
nodes:
  - address: 1.1.1.1
    role: [controlplane, worker, etcd]
    user: root
    labels:
      app: dns

dns:
  provider: kube-dns
  node_selector:
    app: dns
```

### 配置 kube-dns

#### 上游名称服务器

_v0.2.0 及更新版本可用_

默认情况下，kube-dns 使用主机配置的命名服务器（通常保存在`/etc/resolv.conf`路径下）来解析外部查询。如果想配置特定的上游名称服务器，可以使用`upstreamnameservers`指令。

设置 `upstreamnameservers`时，还需要同步修改`provider`配置。

```yaml
dns:
  provider: kube-dns
  upstreamnameservers:
    - 1.1.1.1
    - 8.8.4.4
```

## 禁用 DNS provider 的 Deployment

_v0.2.0 及更新版本可用_

您可以在集群配置中的 dns`provider`设置为`none`，禁用默认的 DNS 提供商。这个操作会阻止 pods 在集群中进行名称解析。

```yaml
dns:
  provider: none
```
