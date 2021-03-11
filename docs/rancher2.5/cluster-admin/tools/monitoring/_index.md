---
title: 功能介绍
description: 通过 Rancher 您可以使用先进的开源监控解决方案Prometheus来监控集群节点，Kubernetes 组件和软件部署的状态和过程。
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
  - 集群管理员指南
  - 集群工具
  - 监控
  - 功能介绍
---

_自 v2.2.0 起可用_

通过 Rancher 您可以使用先进的开源监控解决方案[Prometheus](https://prometheus.io/)来监控集群节点，Kubernetes 组件和软件部署的状态和过程。

## Prometheus 简介

根据[官方文档](https://prometheus.io/docs/concepts/data_model/)介绍，Prometheus 提供了时序型数据，这种时序型数据是指：一个带有时间戳（时刻数值）的数值流，其中任何一个数值都属于同一个指标和同一组标签（维度）。

因此您可以配置 Prometheus 去收集集群级别或者项目级别的监控数据。本章节将介绍如何启用对集群的监控。有关对项目的监控，可以浏览[项目管理部分](/docs/rancher2/project-admin/tools/monitoring/_index)。

Prometheus 让您可以查看 Rancher 及其纳管的各个 Kubernetes 集群的指标。通过时间戳，您可以使用 Rancher UI 或者 [Grafana](https://grafana.com/)（这是一种与分析工具一起部署的分析查看平台）通过易于阅读的 Chart 和可视化仪表盘查询这些指标。

通过查看 Prometheus 从集群 control-plane，节点和部署的工作负载中刮取的监控数据，您可以掌握集群中发生的所有事情。然后，您可以使用这些数据进行分析，从而更好地进行管控工作：在系统紧急情况发生之前阻止它们，制定维护策略，还原崩溃的服务器等。

在集群和项目之间的多租户管理也是支持的。

## 监控访问

通过 Prometheus，您可以在 Rancher 上在集群级别和[项目级别](/docs/rancher2/project-admin/tools/monitoring/_index)进行监控。对于每个启用了监控的集群和项目，Rancher 都会部署一个 Prometheus 服务。

- 集群监控可让您查看 Kubernetes 集群的运行状况。Prometheus 从下面的集群组件中收集指标，您可以在 Chart 中查看这些指标。

  - [Kubernetes Control Plane](/docs/rancher2.5/monitoring-alerting/cluster-monitoring/cluster-metrics/_index)
  - [etcd 数据库](/docs/rancher2.5/monitoring-alerting/cluster-monitoring/cluster-metrics/_index)
  - [所有节点](/docs/rancher2.5/monitoring-alerting/cluster-monitoring/cluster-metrics/_index)

- [项目监控](/docs/rancher2/project-admin/tools/monitoring/_index)允许您查看在具体某个项目内运行的 Pods 的状态。项目级别的 Prometheus 可以从本项目内部署的工作负载中采集自定义指标，这些工作负载必须通过 HTTP 和 TCP/UDP 暴露指标。

## 启用集群监控

作为[系统管理员](/docs/rancher2/admin-settings/rbac/global-permissions/_index)或[集群所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)，您可以通过配置来监控您的 Kubernetes 集群。

> **先决条件：** 如果需要启用 node-exporter 的话，请确保放行在内网中每个节点的 9796 端口的流量，因为 Prometheus 将从此处抓取节点指标。

1. 在**全局**页面中导航到您想要配置的集群。
1. 在导航栏中下拉**工具**，选择**监控**。
1. 查看[资源消耗建议](#资源消耗)，以确保您有足够的资源用于 Prometheus 及其相关组件。根据需要，配置 [Prometheus 选项](/docs/rancher2.5/monitoring-alerting/cluster-monitoring/expression/_index)。
1. 单击**启动**。

**结果：**将部署 Prometheus 服务以及两个监控[应用商店应用](/docs/rancher2/helm-charts/legacy-catalogs/launching-apps/_index)。这两个监控应用商店应用是`cluster-monitoring`和`monitoring-operator`，它们会被添加到集群的`系统（System）`项目中。当这两个应用处于`Active`后，您可以通过 [Rancher 集群仪表盘](/docs/rancher2.5/monitoring-alerting/cluster-monitoring/viewing-metrics/_index)开始查看[集群指标](/docs/rancher2.5/monitoring-alerting/cluster-monitoring/cluster-metrics/_index)或直接从 [Grafana](/docs/rancher2/cluster-admin/tools/monitoring/_index)中查看。

> Grafana 实例的默认用户名和密码为 "admin/admin"。然而，Grafana 仪表板是通过 Rancher 认证代理提供服务的，因此只有当前通过认证进入 Rancher 服务器的用户才能访问 Grafana 仪表板

## 资源消耗

启用集群监控时，需要确保您的工作节点和 Prometheus Pod 有足够的资源。下表提供了关于资源消耗方面的指南。在较大型的部署中，强烈建议将监控组件（Prometheus 及其相关组件）调度到集群中的专用节点上。

### Prometheus Pods 的资源消耗

该表是 Prometheus Pod 的资源消耗，它基于集群中所有节点的数量。节点数包括工作节点，control-plane 和 etcd 节点。总磁盘空间分配应通过在集群级别设置的`rate * retention`来估算。启用集群级别监控时，应该根据您的情况，调整 CPU 和内存的限制值及预留值。

| 集群节点数目 | CPU (milli CPU) | 内存   | 磁盘       |
| :----------- | :-------------- | :----- | :--------- |
| 5            | 500             | 650 MB | ~1 GB/Day  |
| 50           | 2000            | 2 GB   | ~5 GB/Day  |
| 256          | 4000            | 6 GB   | ~18 GB/Day |

集群监控中其他的 Pod 资源的要求：

| 工作负载            | 容器                            | CPU 预留值 | 内存预留值 | CPU 限制值 | 内存限制值 | 是否可配置 |
| :------------------ | :------------------------------ | :--------- | :--------- | :--------- | :--------- | :--------- |
| Prometheus          | prometheus                      | 750m       | 750Mi      | 1000m      | 1000Mi     | Y          |
|                     | prometheus-proxy                | 50m        | 50Mi       | 100m       | 100Mi      | Y          |
|                     | prometheus-auth                 | 100m       | 100Mi      | 500m       | 200Mi      | Y          |
|                     | prometheus-config-reloader      | -          | -          | 50m        | 50Mi       | N          |
|                     | rules-configmap-reloader        | -          | -          | 100m       | 25Mi       | N          |
| Grafana             | grafana-init-plugin-json-copy   | 50m        | 50Mi       | 50m        | 50Mi       | Y          |
|                     | grafana-init-plugin-json-modify | 50m        | 50Mi       | 50m        | 50Mi       | Y          |
|                     | grafana                         | 100m       | 100Mi      | 200m       | 200Mi      | Y          |
|                     | grafana-proxy                   | 50m        | 50Mi       | 100m       | 100Mi      | Y          |
| Kube-State Exporter | kube-state                      | 100m       | 130Mi      | 100m       | 200Mi      | Y          |
| Node Exporter       | exporter-node                   | 200m       | 200Mi      | 200m       | 200Mi      | Y          |
| Operator            | prometheus-operator             | 100m       | 50Mi       | 200m       | 100Mi      | Y          |

### 其他 Pods 的资源消耗

除了 Prometheus Pod 之外，还部署了一些组件，这些组件在工作节点上还需要额外的资源：

| Pod                                 | CPU (milli CPU) | 内存 (MB) |
| :---------------------------------- | :-------------- | :-------- |
| Node Exporter (每个节点均部署)      | 100             | 30        |
| Kube State Cluster Monitor          | 100             | 130       |
| Grafana                             | 100             | 150       |
| Prometheus Cluster Monitoring Nginx | 50              | 50        |
