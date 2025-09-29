---
title: 监控和告警介绍
description: description
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
  - 监控和告警
  - rancher2.5
---

使用 `rancher-monitoring` 应用程序，你可以快速部署领先的开源监控和告警解决方案到你的集群。

- [功能](#功能)
- [监控的工作原理](#监控的工作原理)
- [默认组件和部署](#默认组件和部署)
- [基于角色的访问控制](#基于角色的访问控制)
- [指南](#指南)
- [Windows 群集支持](#windows-集群支持)
- [已知问题](#已知的问题)

## 功能

Prometheus 让你从 Rancher 和 Kubernetes 对象中查看指标。通过使用时间戳，Prometheus 可以让你通过 Rancher UI 或 Grafana（与 Prometheus 一起部署的分析查看平台）查询并易于阅读的图表和视觉效果查看这些指标。

通过查看 Prometheus 从集群控制平面、节点和 deployment 中采集的数据，你可以随时了解集群中发生的一切。然后，你可以使用这些分析来更好地运行你的环境：在系统紧急情况开始之前就阻止它们，制定维护策略，或恢复崩溃的服务器。

Rancher v2.5 中引入的 `rancher-monitoring` operator 由[Prometheus](https://prometheus.io/)、[Grafana](https://grafana.com/grafana/)、[Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)、[Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) 和 [Prometheus 适配器](https://github.com/DirectXMan12/k8s-prometheus-adapter)提供支持。

监控应用程序允许你：

- 监控你的集群节点、Kubernetes 组件和软件部署的状态和进程
- 根据通过 Prometheus 收集的指标定义告警
- 创建自定义的 Grafana 仪表盘
- 使用 Prometheus Alertmanager 通过电子邮件、Slack、PagerDuty 等配置基于告警的通知
- 根据通过 Prometheus 收集的指标，将预先计算的、经常需要的或计算成本高的表达式定义为新的时间序列
- 通过 Prometheus 适配器将收集的指标从 Prometheus 暴露给 Kubernetes 自定义指标 API，以便在 HPA 中使用

## 监控的工作原理

关于监控组件如何协同工作的说明，请参阅[本页面](/docs/rancher2.5/monitoring-alerting/how-monitoring-works/)

## 默认组件和部署

#### 内置仪表盘

默认情况下，监控应用会将 Grafana 仪表盘（由 [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus) 项目管理）部署到集群上。

它还部署了一个 Alertmanager UI 和一个 Prometheus UI。关于这些工具的更多信息，请参见[内置仪表盘](/docs/rancher2.5/monitoring-alerting/dashboards/)。

#### 默认的 Metrics Exporters

默认情况下，Rancher 监控部署了 exporters（如 [node-exporter](https://github.com/prometheus/node_exporter) 和 [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)）。

这些默认的 exporters 会自动从你的 Kubernetes 集群的所有组件（包括你的工作负载）收集 CPU 和内存指标。

#### 默认告警

监控应用程序默认部署了一些告警。要查看默认告警，请进入 [Alertmanager UI](./dashboards/#alertmanager-ui) 并点击 **展开所有组**。

#### Rancher UI 中暴露的组件

关于 Rancher UI 中公开的监控组件的列表，以及编辑这些组件的常见用例，请参见[本节。](/docs/rancher2.5/monitoring-alerting/how-monitoring-works/#44-rancher-ui-中暴露的组件)

## 基于角色的访问控制

关于配置监控访问的信息，请参阅[此页面](./rbac/)

## 指南

- [启用监控](./guides/enable-monitoring/)
- [卸载监控](./guides/uninstall/)
- [监控工作负载](./guides/monitoring-workloads/)
- [自定义 Grafana 仪表盘](./guides/customize-grafana/)
- [持久化 Grafana 仪表盘](./guides/persist-grafana/)
- [调试高内存使用率](./guides/memory-usage/)
- [从监控 V1 迁移到 V2](./guides/migrating/)

## 配置

### 在 Rancher 中配置监控资源

> 配置参考假定您熟悉监控组件如何协同工作。有关更多信息，请参阅[监控的工作原理](./how-monitoring-works/)。

- [ServiceMonitor 和 PodMonitor](./configuration/servicemonitor-podmonitor/)
- [Receiver](./configuration/receiver/)
- [Route](./configuration/route/)
- [PrometheusRule](./configuration/advanced/prometheusrules/)
- [Prometheus](./configuration/advanced/prometheus/)
- [Alertmanager](./configuration/advanced/alertmanager/)

### 配置 Helm chart 选项

关于 `rancher-monitoring` chart 选项的更多信息，包括设置资源限制和请求的选项，请参阅[此页](./configuration/helm-chart-options/)

# Windows 集群支持

_从 v2.5.8 版本可用_

当部署到 RKE1 Windows 集群上时，Monitoring V2 会自动部署一个 [windows-exporter](https://github.com/prometheus-community/windows_exporter) DaemonSet，并设置一个 ServiceMonitor，从每个部署的 Pod 中收集指标。这将为 Prometheus 提供`windows_`指标，与 Linux 主机的 [node_exporter](https://github.com/prometheus/node_exporter) 的 `node_` 指标相似。

为了能够完全部署 Windows 的 Monitoring V2，你的所有 Windows 主机必须有至少 [wins](https://github.com/rancher/wins) v0.1.0 的版本。

关于如何在现有的 Windows 主机上升级 wins 的更多细节，请参阅 [Windows 集群对监控 V2 的支持](./windows-clusters/)一节。

# 已知的问题

有一个[已知问题](https://github.com/rancher/rancher/issues/28787#issuecomment-693611821)，K3s 群集需要更多的默认内存。如果你在 K3s 集群上启用监控，我们建议将`prometheus.prometheusSpec.resources.memory.limit`设为 2500 Mi，`prometheus.prometheusSpec.resources.memory.request`设为 1750 Mi。

关于调试高内存使用率的技巧，请参见[本页](./guides/memory-usage/)
