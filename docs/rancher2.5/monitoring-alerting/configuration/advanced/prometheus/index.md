---
title: Prometheus 配置
---

通常没有必要直接编辑 Prometheus 自定义资源，因为监控应用程序会根据 ServiceMonitors 和 PodMonitors 的变化自动更新它。

> 本节假设你熟悉监控组件如何协同工作。要了解更多信息，请参阅[本节。](/docs/rancher2.5/monitoring-alerting/how-monitoring-works/)

## 关于 Prometheus 自定义资源

Prometheus CR 定义了一个期望的 Prometheus deployment。Prometheus Operator 观察 Prometheus CR。当 CR 发生变化时，Prometheus Operator 会创建 `prometheus-rancher-monitoring-prometheus`，这是一个基于 CR 配置的 Prometheus deployment。

Prometheus 的 CR 指定了一些细节，如规则和哪些 Alertmanagers 连接到 Prometheus。Rancher 为你建立了这个 CR。

监控 V2 版本只支持每个集群一个 Prometheus。然而，如果你想把监控限制在某些命名空间，你可能想编辑 Prometheus 的 CR。
