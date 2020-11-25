---
title: 设置指南
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
  - subtitles1
  - subtitles2
  - subtitles3
  - subtitles4
  - subtitles5
  - subtitles6
---

本节介绍如何启用 Istio 并开始在项目中使用它。

如果您使用 Istio 进行流量管理，您将需要允许外部流量进入集群。在这种情况下，您需要遵循以下所有步骤。

## 前提条件

This guide assumes you have already [installed Rancher,]({{<baseurl>}}/rancher/v2.x/en/installation) and you have already [provisioned a separate Kubernetes cluster]({{<baseurl>}}/rancher/v2.x/en/cluster-provisioning) on which you will install Istio.

The nodes in your cluster must meet the [CPU and memory requirements.]({{<baseurl>}}/rancher/v2.x/en/cluster-admin/tools/istio/resources/)

The workloads and services that you want to be controlled by Istio must meet [Istio's requirements.](https://istio.io/docs/setup/additional-setup/requirements/)

## 安装 Istio

> **Quick Setup** If you don't need external traffic to reach Istio, and you just want to set up Istio for monitoring and tracing traffic within the cluster, skip the steps for [setting up the Istio gateway]({{<baseurl>}}/rancher/v2.x/en/cluster-admin/tools/istio/setup/gateway) and [setting up Istio's components for traffic management.]({{<baseurl>}}/rancher/v2.x/en/cluster-admin/tools/istio/setup/set-up-traffic-management)

**快速设置** 如果您不需要外部流量到达 Istio，而只是想设置 Istio 来监控和追踪集群内的流量，请跳过[设置 Istio 网关]({{<baseurl>}}/rancher/v2.x/en/cluster-admin/tools/istio/setup/gateway)和[设置-Istio-的流量管理组件](/rancher/v2.x/en/cluster-admin/tools/istio/setup/gateway）和[设置 Istio 的流量管理组件]({{<baseurl>}}/rancher/v2.x/en/cluster-admin/tools/istio/setup/setup-traffic-management)的步骤。

1. [在集群中启用 Istio]({{<baseurl>}}/rancher/v2.x/en/cluster-admin/tools/istio/setup/enable-istio-in-cluster)
1. [在你想使用 Istio 的所有命名空间中启用 Istio]({{<baseurl>}}/rancher/v2.x/en/cluster-admin/tools/istio/setup/enable-istio-in-namepace)
1. [添加注入了 Istio sidecar 的部署和服务。]({{<baseurl>}}/rancher/v2.x/en/cluster-admin/tools/istio/setup/deploy-workloads)
1. [设置 Istio 网关]({{<baseurl>}}/rancher/v2.x/en/cluster-admin/tools/istio/setup/gateway)
1. [设置 Istio 的流量管理组件]({{<baseurl>}}/rancher/v2.x/en/cluster-admin/tools/istio/setup/set-up-traffic-management)
1. [产生流量并看到 Istio 在行动。](/docs/rancher2/istio/2.5/setup/view-traffic/_index)
