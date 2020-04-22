---
title: Kubernetes 中节点的角色
description: 本节描述 Kubernetes 中的 `etcd` 节点、 `controlplane` 节点和 `worker` 节点的角色，以及这些角色如何在集群中协同工作。这个图适用于Rancher 通过 RKE 部署的 Kubernetes 集群。
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
  - 生产环境检查清单
  - Kubernetes 中节点的角色
---

本节描述 Kubernetes 中的 `etcd` 节点、 `controlplane` 节点和 `worker` 节点的角色，以及这些角色如何在集群中协同工作。

这个图适用于[Rancher 通过 RKE 部署的 Kubernetes 集群](/docs/cluster-provisioning/rke-clusters/_index)。

![集群图片](/img/rancher/clusterdiagram.svg)

<sup>线条显示了组件之间的通信。颜色纯粹用于视觉辅助。</sup>

## etcd

有着 `etcd` 角色的节点讲运行 etcd，etcd 是一个有着一致性的和高可用性的键值对存储，它用于存储 Kubernetes 集群中的所有数据。etcd 会将数据复制到每个 etcd 节点上。

> **注意:** 在 UI 中如果具有 `etcd` 角色的节点显示为 `不可调度`，这意味着在默认情况下，不会将 pod 调度到这些节点。

## 管理平面

在具有 `controlplane` 角色的节点上运行 Kubernetes 的 master 组件（不包括`etcd`，因为它是一个单独的角色）。有关 master 组件的详细列表，请参阅[Kubernetes: master 组件](https://kubernetes.io/docs/concepts/overview/components/#master-components)。

> **注意:** 在 UI 中如果具有 `controlplane` 角色的节点显示为 `不可调度`，这意味着在默认情况下，不会将 pod 调度到这些节点。

### API Server

Kubernetes API Server（ `kube-apiserver` ）是可以水平扩展的。每个具有 `controlplane` 角色的节点都将被添加到集群中每个节点上的 NGINX 代理中。因为这些节点上都运行着需要访问 API Server 的组件的。这意味着如果一个`controlplane`节点变得不可调度，集群中其他节点上的本地 NGINX 代理，将把请求转发到列表中的另一个 Kubernetes API Server。

### Kubernetes 控制器

Kubernetes 控制器使用了选举机制。也就是说如果有多个实例的`kube-controller-manager`组件，那么只有一个是处于业务逻辑运行状态。它是通过一个 Kubernetes endpoint 实现的。`kube-controller-manager`的一个实例会在这个 Kubernetes endpoint 中增加一个条目，并且在一个可配置的时间间隔内定期更新这个条目。其他的实例将可以看到当前的 leader 并且等待这个条目过期（例如节点没有相应了），并重新进行选举。

### Kubernetes 调度器

Kubernetes 调度器使用了选举机制。也就是说如果有多个`kube-scheduler`组件的实例，那么只有一个是处于业务逻辑运行状态。它是通过一个 Kubernetes endpoint 实现的。`kube-scheduler`的一个实例会在这个 Kubernetes endpoint 中增加一个条目，并且在一个可配置的时间间隔内定期更新这个条目。其他的实例将可以看到当前的 leader 并且等待这个条目过期（例如节点没有相应了），并重新进行选举。

## 工作节点

具有 `worker` 角色的节点运行 Kubernetes 节点组件。参见 [Kubernetes: 节点组件](https://kubernetes.io/docs/concepts/overview/components/#node-components) 的详细列表。
