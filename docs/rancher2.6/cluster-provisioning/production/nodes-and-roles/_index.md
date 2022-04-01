---
title: Kubernetes 中节点的角色
weight: 1
---

本节介绍 Kubernetes 中 etcd 节点、controlplane 节点和 worker 节点的角色，以及这些角色如何在集群中协同工作。

此图适用于 [Rancher 通过 RKE 部署的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)：

![Cluster diagram]({{<baseurl>}}/img/rancher/clusterdiagram.svg)<br/>
<sup>线条表示组件之间的通信。而颜色纯粹用于视觉辅助。</sup>

## etcd

具有 `etcd` 角色的节点运行 etcd，这是一个一致且高可用的键值存储，用作 Kubernetes 所有集群数据的后备存储。etcd 将数据复制到每个节点。

> **注意：** 具有 `etcd` 角色的节点在 UI 中显示为`不可调度`，即默认情况下不会将 Pod 调度到这些节点。

## controlplane

具有 `controlplane` 角色的节点运行 Kubernetes 主组件（不包括 `etcd`，因为它是一个单独的角色）。有关组件的详细列表，请参阅 [Kubernetes：主组件](https://kubernetes.io/docs/concepts/overview/components/#master-components)。

> **注意：** 具有 `controlplane` 角色的节点在 UI 中显示为`不可调度`，即默认情况下不会将 Pod 调度到这些节点。

### kube-apiserver

Kubernetes API Server (`kube-apiserver`) 能水平扩展。如果节点具有需要访问 Kubernetes API Server 的组件，则每个具有 `controlplane` 角色的节点都将被添加到节点上的 NGINX 代理中。这意味着如果一个节点变得不可访问，该节点上的本地 NGINX 代理会将请求转发到列表中的另一个 Kubernetes API Server。

### kube-controller-manager

Kubernetes Controller Manager 使用 Kubernetes 中的端点进行 Leader 选举。`kube-controller-manager` 的一个实例将在 Kubernetes 端点中创建一个条目，并在配置的时间间隔内更新该条目。其他实例将看到一个状态为 Active 的 Leader，并等待该条目过期（例如节点无响应）。

### kube-scheduler

Kubernetes 调度器使用 Kubernetes 中的端点进行 Leader 选举。`kube-scheduler` 的一个实例将在 Kubernetes 端点中创建一个条目，并在配置的时间间隔内更新该条目。其他实例将看到一个状态为 Active 的 Leader，并等待该条目过期（例如节点无响应）。

## worker

具有 `worker` 角色的节点运行 Kubernetes 节点组件。有关组件的详细列表，请参阅 [Kubernetes：节点组件](https://kubernetes.io/docs/concepts/overview/components/#node-components)。

## 参考

- [Kubernetes：节点组件](https://kubernetes.io/docs/concepts/overview/components/#node-components)
