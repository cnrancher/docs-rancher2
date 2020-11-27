---
title: 配置 Istio
description: description
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
  - Istio
  - 配置 Istio
---

本节介绍如何启用 Istio 并开始在项目中使用它。

如果您使用 Istio 进行流量管理，需要允许外部流量进入集群。在这种情况下，您需要遵循以下所有步骤。

## 前提条件

- 已安装了 Rancher。
- 已配置了一个 Kubernetes 集群，用于安装 Istio。
- 集群中的节点必须满足 CPU 和内存要求。
- 被 Istio 控制的工作负载和服务必须满足[Istio 的要求](https://istio.io/docs/setup/additional-setup/requirements/)。

## 安装 Istio

**快速设置** 如果您不需要外部流量到达 Istio，而只是想设置 Istio 来监控和追踪集群内的流量，请跳过[设置 Istio 网关](/docs/rancher2/istio/2.5/setup/gateway/_index)和[设置 Istio 的流量管理组件](/docs/rancher2/istio/2.5/setup/set-up-traffic-management/_index)的步骤。

1. [在集群中启用 Istio](/docs/rancher2/istio/2.5/setup/enable-istio-in-cluster/_index)。
1. [在你想使用 Istio 的所有命名空间中启用 Istio](/docs/rancher2/istio/2.5/setup/enable-istio-in-namespace/_index)。
1. [添加注入了 Istio sidecar 的部署和服务](/docs/rancher2/istio/2.5/setup/deploy-workloads/_index)。
1. [设置 Istio 网关](/docs/rancher2/istio/2.5/setup/gateway/_index)。
1. [设置 Istio 的流量管理组件](docs/rancher2/istio/2.5/setup/set-up-traffic-management/_index.md)。
1. [产生流量并看到 Istio 在行动。](/docs/rancher2/istio/2.5/setup/view-traffic/_index)
