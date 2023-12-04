---
title: 不宕机升级集群
description: RKE v1.1.0+优化了升级集群的流程，提供了不宕机升级的功能。本节讲述了如何在使用`rke up`命令升级集群的时候保证集群内的 pods 可用，实现不宕机升级。
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
  - RKE
  - 升级指南
  - 不宕机升级集群
---

_v1.1.0 开始可用_

## 概述

RKE v1.1.0+优化了升级集群的流程，提供了不宕机升级的功能。本节讲述了如何在使用`rke up`命令升级集群的时候保证集群内的 pods 可用，实现不宕机升级。

不宕机升级的功能的工作原理是批量升级 worker 节点的同时，保证工作负载在至少一个节点上运行，详情请参考[RKE v1.1.0+ 升级工作原理](/docs/rke/upgrades/how-upgrades-work/_index)。

实现不宕机升级，需要在升级集群的过程中始终保持工作负载在至少一个节点上可用，并且保持工作负载所需的所有重要的插件（如 Ingress 和 DNS）可用。在不宕机升级的过程中，开发人员可以持续将应用程序部署到集群，用户也可以持续使用服务而不会受到干扰。不宕机升级对于集群架构和 Kubernetes 版本也有要求。具体要求请参考下文。

## Kubernetes 版本要求

升级集群现有的 Kubernetes 时，必须是从一个小版本升级到另一个小版本，例如从 v1.16.0 升级到 v1.17.0，或是升级到同一个小版本内的补丁版，例如从 v1.16.0 升级到 v1.16.1。

## 集群要求

集群必须满足以下条件：

1. 集群具有至少 3 个 etcd 节点。
1. 集群具有至少 2 个 controlplane 节点。
1. 集群具有至少 2 个 worker 节点。
1. 集群内的 Ingress 和 DNS 等插件可以被至少一个节点调度，工作负载部署在这个节点上。

## 工作负载要求

工作负载必须满足以下条件：

1. 应用和 Ingress 部署在至少一个节点上。
1. 应用必须使用存活探针（liveness probes）和就绪探针（readiness probes）。

## 相关链接

请参考[Kubernetes 官方文档](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/)，获取使用 node selector 将 pod 分配给节点的操作指导。

配置插件副本的操作指导请参考[配置升级策略](/docs/rke/upgrades/configuring-strategy/_index)。
