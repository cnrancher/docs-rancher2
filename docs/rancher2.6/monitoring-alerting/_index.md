---
title: 监控和告警
shortTitle: 监控/告警
description: Prometheus 允许你查看来自不同 Rancher 和 Kubernetes 对象的指标。了解监控范围以及如何启用集群监控
weight: 13
---

你可以使用 `rancher-monitoring` 应用，将业界领先的开源监控和告警解决方案快速部署到你的集群中。

- [功能](#features)
- [Monitoring 的工作原理](#how-monitoring-works)
- [默认组件和部署](#default-components-and-deployments)
- [基于角色的访问控制](#role-based-access-control)
- [指南](#guides)
- [Windows 集群支持](#windows-cluster-support)
- [已知问题](#known-issues)

### 功能

Prometheus 支持查看 Rancher 和 Kubernetes 对象的指标。通过使用时间戳，Prometheus 能让你通过 Rancher UI 或 Grafana（与 Prometheus 一起部署的分析查看平台）以更容易阅读的图表和视觉形式来查询和查看这些指标。

通过查看 Prometheus 从集群的 control plane、节点和 deployment 中抓取的数据，你可以随时了解集群中发生的所有事件。然后，你可以使用这些分析来更好地运行你的环境，例如在系统紧急情况发生之前阻止它们、制定维护策略，或恢复崩溃的服务器。

在 Rancher v2.5 中引入的 `rancher-monitoring` operator 由 [Prometheus](https://prometheus.io/)、[Grafana](https://grafana.com/grafana/)、[Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)， [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) 和 [Prometheus adapter](https://github.com/DirectXMan12/k8s-prometheus-adapter) 提供支持。

Monitoring 应用允许你：

- 监控集群节点、Kubernetes 组件和软件部署的状态和进程
- 根据 Prometheus 收集的指标定义告警
- 创建自定义 Grafana 仪表板
- 使用 Prometheus Alertmanager 通过电子邮件、Slack、PagerDuty 等配置告警通知
- 根据 Prometheus 收集的指标，将预先计算的、经常需要的，或计算成本高的表达式定义为新的时间序列
- 通过 Prometheus Adapter，将从 Prometheus 收集的指标公开给 Kubernetes Custom Metrics API，以便在 HPA 中使用

## Monitoring 的工作原理

有关 monitoring 组件如何协同工作的说明，请参阅[此页面](./how-monitoring-works)。

## 默认组件和部署

### 内置仪表板

默认情况下，监控应用将 Grafana 仪表板（由 [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus) 项目策划）部署到集群上。

它害部署一个 Alertmanager UI 和一个 Prometheus UI。有关这些工具的更多信息，请参见[内置仪表板](./dashboards)。
### 默认指标 Exporter

默认情况下，Rancher Monitoring 会部署 Exporter（例如 [node-exporter](https://github.com/prometheus/node_exporter) 和 [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)）。

这些默认 Exporter 会自动从 Kubernetes 集群的所有组件（包括工作负载）中抓取 CPU 和内存的指标。

### 默认告警

Monitoring 应用会默认部署一些告警。要查看默认告警，请转到 [Alertmanager UI](./dashboards/#alertmanager-ui) 并单击**展开所有组**。

### Rancher UI 中公开的组件

有关 Rancher UI 中公开的监控组件列表，以及编辑它们的常见用例，请参阅[本节](./how-monitoring-works/#components-exposed-in-the-rancher-ui)。

## 基于角色的访问控制

有关配置 monitoring 访问权限的信息，请参阅[此页面](./rbac)。

## 指南

- [启用 monitoring](./guides/enable-monitoring)
- [卸载 monitoring](./guides/uninstall)
- [Monitoring 工作负载](./guides/monitoring-workloads)
- [自定义 Grafana 仪表板](./guides/customize-grafana)
- [持久化 Grafana 仪表板](./guides/persist-grafana)
- [调试高内存使用率](./guides/memory-usage)
- [从 Monitoring V1 迁移到 V2](./guides/migrating)

## 配置

### 在 Rancher 中配置 Monitoring 资源

> 此处的配置参考假设你已经熟悉 monitoring 组件的协同工作方式。如需更多信息，请参阅 [monitoring 的工作原理](./how-monitoring-works)。

- [ServiceMonitor 和 PodMonitor](./configuration/servicemonitor-podmonitor)
- [接收器](./configuration/receiver)
- [路由](./configuration/route)
- [PrometheusRule](./configuration/advanced/prometheusrules)
- [Prometheus](./configuration/advanced/prometheus)
- [Alertmanager](./configuration/advanced/alertmanager)

### 配置 Helm Chart 选项

有关 `rancher-monitoring` Chart 选项的更多信息，包括设置资源限制和请求的选项，请参阅[此页面](./configuration/helm-chart-options)。

## Windows 集群支持

如果 Monitoring 部署到 RKE1 Windows 集群，Monitoring V2 将自动部署 [windows-exporter](https://github.com/prometheus-community/windows_exporter) DaemonSet 并设置 ServiceMonitor，以从每个部署的 Pod 中收集指标。这将使用 `windows_` 指标填充 Prometheus，这些指标与 [node_exporter](https://github.com/prometheus/node_exporter) 为 Linux 主机导出的 `node_` 指标类似。

为了能够为 Windows 完全部署 Monitoring V2，你的所有 Windows 主机都必须至少具有 v0.1.0 的 [wins](https://github.com/rancher/wins) 版本。

有关如何在现有 Windows 主机上升级 wins 版本的更多详细信息，请参阅 [Windows 集群对 Monitoring V2 的支持](./windows-clusters)。



## 已知问题

有一个[已知问题](https://github.com/rancher/rancher/issues/28787#issuecomment-693611821)，即 K3s 集群需要更多的默认内存。如果你在 K3s 集群上启用 monitoring，我们建议将 `prometheus.prometheusSpec.resources.memory.limit` 设置为 2500 Mi，并将 `prometheus.prometheusSpec.resources.memory.request` 设置为 1750 Mi。

有关调试高内存用量的提示，请参阅[此页面](./guides/memory-usage)。
