---
title: 使用说明
description: 本节介绍如何启用 Istio 并开始在项目中使用它。本节假定您已安装 Rancher，并且您有一个要设置 Istio 的 Rancher 创建的 Kubernetes 集群。如果使用 Istio 进行流量管理，则需要允许外部流量进入集群。在这种情况下，您将需要执行以下所有步骤。
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
  - 集群管理员指南
  - 集群访问控制
  - 告警
  - Istio
  - 使用说明
---

本节介绍如何启用 Istio 并开始在项目中使用它。

本节假定您已安装 Rancher，并且您有一个要设置 Istio 的 Rancher 创建的 Kubernetes 集群。

如果使用 Istio 进行流量管理，则需要允许外部流量进入集群。在这种情况下，您将需要执行以下所有步骤。

> **快速设置** 如果不需要外部流量到达 Istio，而只想设置 Istio 来监控和跟踪集群中的流量，请跳过[设置 Istio 网关](/docs/cluster-admin/tools/istio/setup/gateway/_index)和[设置 Istio 流量管理组件](/docs/cluster-admin/tools/istio/setup/set-up-traffic-management/_index)的步骤。

1. [在集群中启用 Istio](/docs/cluster-admin/tools/istio/setup/enable-istio-in-cluster/_index)。
1. [在所有要使用 Istio 的命名空间中启用它](/docs/cluster-admin/tools/istio/setup/enable-istio-in-namespace/_index)。
1. [选择部署主要 Istio 组件的节点](/docs/cluster-admin/tools/istio/setup/node-selectors/_index)。
1. [添加有 Istio sidecar 注入的部署和服务](/docs/cluster-admin/tools/istio/setup/deploy-workloads/_index)。
1. [设置 Istio 网关](/docs/cluster-admin/tools/istio/setup/gateway/_index)。
1. [设置 Istio 的流量管理组件](/docs/cluster-admin/tools/istio/setup/set-up-traffic-management/_index)。
1. [产生流量并在实际操作中查看 Istio](/docs/cluster-admin/tools/istio/setup/view-traffic/_index)。

## 先决条件

本指南假定您已经[安装 Rancher](/docs/installation/_index)并且已经[创建一个单独的 Kubernetes 集群](/docs/cluster-provisioning/_index)。指南步骤将在该集群安装 Istio。

集群中的节点必须满足[CPU 和内存要求](/docs/cluster-admin/tools/istio/resources/_index)。

您希望由 Istio 控制的工作负载和服务必须满足[Istio 的要求](https://istio.io/docs/setup/additional-setup/requirements/)。
