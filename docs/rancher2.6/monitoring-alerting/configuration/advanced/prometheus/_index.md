---
title: Prometheus 配置
weight: 1
---

通常情况下，你不需要直接编辑 Prometheus 自定义资源，因为 Monitoring 应用会根据 ServiceMonitor 和 PodMonitor 的更改自动更新资源。

> 本节参考假设你已经熟悉 Monitoring 组件的协同工作方式。有关详细信息，请参阅[本节](../../../how-monitoring-works/)。

## 关于 Prometheus 自定义资源

Prometheus CR 定义了所需的 Prometheus deployment。Prometheus Operator 会观察 Prometheus CR。当 CR 发生变化时，Prometheus Operator 会创建 `prometheus-rancher-monitoring-prometheus`，即根据 CR 配置的 Prometheus deployment。

Prometheus CR 指定了详细信息，例如规则以及连接到 Prometheus 的 Alertmanager。Rancher 会为你构建这个 CR。

Monitoring V2 仅支持每个集群一个 Prometheus。如果你想将监控限制到指定命名空间，你需要编辑 Prometheus CR。