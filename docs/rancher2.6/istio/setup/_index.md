---
title: 设置指南
weight: 2
---

本文介绍如何启用 Istio 并在你的项目中使用它。

如果你使用 Istio 进行流量管理，则需要允许外部流量进入集群。在这种情况下，你将需要执行以下所有步骤。

## 前提

本指南假设你已经[安装 Rancher]({{<baseurl>}}/rancher/v2.6/en/installation)，且已经[配置了一个单独的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning)并要在该集群上安装 Istio。

集群中的节点必须满足 [CPU 和内存要求]({{<baseurl>}}/rancher/v2.6/en/istio/resources/)。

Istio 控制的工作负载和服务必须满足 [Istio 要求](https://istio.io/docs/setup/additional-setup/requirements/)。


## 安装

> **快速设置**：如果你不需要外部流量到达 Istio，而只想设置 Istio 以监控和跟踪集群内的流量，请跳过[设置 Istio Gateway]({{<baseurl>}}/rancher/v2.6/en/istio/setup/gateway) 和[设置 Istio 的流量管理组件]({{<baseurl>}}/rancher/v2.6/en/istio/setup/set-up-traffic-management)步骤。

1. [在集群中启用 Istio]({{<baseurl>}}/rancher/v2.6/en/istio/setup/enable-istio-in-cluster)
1. [在要使用 Istio 的所有命名空间中启用 Istio]({{<baseurl>}}/rancher/v2.6/en/istio/setup/enable-istio-in-namespace)
1. [添加注入了 Istio sidecar 的部署和服务]({{<baseurl>}}/rancher/v2.6/en/istio/setup/deploy-workloads)
1. [设置 Istio Gateway]({{<baseurl>}}/rancher/v2.6/en/istio/setup/gateway)
1. [设置 Istio 的流量管理组件]({{<baseurl>}}/rancher/v2.6/en/istio/setup/set-up-traffic-management)
1. [生成流量并查看 Istio 的运行情况]({{<baseurl>}}/rancher/v2.6/en/istio/setup/view-traffic/)
