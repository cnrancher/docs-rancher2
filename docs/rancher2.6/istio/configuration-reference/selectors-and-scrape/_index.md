---
title: 选择器和抓取配置
weight: 2
---

Monitoring 应用设置了 `prometheus.prometheusSpec.ignoreNamespaceSelectors=false`，即在默认情况下跨所有命名空间进行监控。

这样，你可以查看部署在具有 `istio-injection=enabled` 标签的命名空间中的资源的流量、指标和图。

如果你想将 Prometheus 限制为特定的命名空间，请设置 `prometheus.prometheusSpec.ignoreNamespaceSelectors=true`。完成此操作后，你需要添加其他配置来继续监控你的资源。

- [通过将 ignoreNamespaceSelectors 设置为 True 来限制对特定命名空间的监控](#limiting-monitoring-to-specific-namespaces-by-setting-ignorenamespaceselectors-to-true)
- [让 Prometheus 检测其他命名空间中的资源](#enabling-prometheus-to-detect-resources-in-other-namespaces)
- [监控特定命名空间：创建 ServiceMonitor 或 PodMonitor](#monitoring-specific-namespaces-create-a-service-monitor-or-pod-monitor)
- [跨命名空间监控：将 ignoreNamespaceSelectors 设置为 False](#monitoring-across-namespaces-set-ignorenamespaceselectors-to-false)

### 通过将 ignoreNamespaceSelectors 设置为 True 来限制对特定命名空间的监控

要限制对特定命名空间的监控，你需要编辑 `ignoreNamespaceSelectors` Helm Chart 选项。你可以在安装或升级 Monitoring Helm Chart 时配置此选项：

1. 安装或升级 Monitoring Helm Chart 时，编辑 values.yml 并设置 `prometheus.prometheusSpec.ignoreNamespaceSelectors=true`。
1. 完成安装或升级。

**结果**：Prometheus 将仅用于特定命名空间。换言之，你需要设置以下配置之一才能继续在各种仪表板中查看数据。

### 让 Prometheus 检测其他命名空间中的资源

如果设置了 `prometheus.prometheusSpec.ignoreNamespaceSelectors=true`，则有两种方法让 Prometheus 检测其他命名空间中的资源：

- **监控特定的命名空间**：在命名空间中添加一个 ServiceMonitor 或 PodMonitor 以及要抓取的目标。
- **跨命名空间监控**：将 `additionalScrapeConfig` 添加到你的 rancher-monitoring 实例，从而抓取所有命名空间中的所有目标。

### 监控特定命名空间：创建 ServiceMonitor 或 PodMonitor

此选项用于定义在特定命名空间中要监控的服务或 pod。

可用性权衡指的是，由于你无法跨命名空间进行监控，因此你必须为每个命名空间创建 ServiceMonitor 或 PodMonitor。

> **先决条件**：为 `<your namespace>` 定义 ServiceMonitor 或 PodMonitor。下面提供了一个 ServiceMonitor 示例。

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 在顶部导航栏中，打开 kubectl shell。
1. 如果 ServiceMonitor 或 PodMonitor 文件存储在本地集群中，请运行 `kubectl create -f <name of service/pod monitor file>.yaml`。
1. 如果 ServiceMonitor 或 PodMonitor 没有存储在本地，请运行 `cat<< EOF | kubectl apply -f -`，将文件内容粘贴到终端，然后运行 ​​`EOF` 来完成命令。
1. 运行 `kubectl label namespace <your namespace> istio-injection=enabled` 来启用 Envoy sidecar 注入。

**结果**：Prometheus 可以抓取 `<your namespace>`。

<figcaption>Istio 代理的 ServiceMonitor 示例</figcaption>

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: envoy-stats-monitor
  namespace: istio-system
  labels:
    monitoring: istio-proxies
spec:
  selector:
    matchExpressions:
    - {key: istio-prometheus-ignore, operator: DoesNotExist}
  namespaceSelector:
    any: true
  jobLabel: envoy-stats
  endpoints:
  - path: /stats/prometheus
    targetPort: 15090
    interval: 15s
    relabelings:
    - sourceLabels: [__meta_kubernetes_pod_container_port_name]
      action: keep
      regex: '.*-envoy-prom'
    - action: labeldrop
      regex: "__meta_kubernetes_pod_label_(.+)"
    - sourceLabels: [__meta_kubernetes_namespace]
      action: replace
      targetLabel: namespace
    - sourceLabels: [__meta_kubernetes_pod_name]
      action: replace
      targetLabel: pod_name
```

### 跨命名空间监控：将 ignoreNamespaceSelectors 设置为 False

此设置为 Prometheus 提供额外的抓取配置来实现跨命名空间监控。

可用性权衡指的是 Prometheus 的所有 `additionalScrapeConfigs` 都维护在一个 Secret 中。如果在安装 Istio 之前已经使用 additionalScrapeConfigs 部署了监控，升级可能会变得困难。

1. 安装或升级 Monitoring Helm Chart 时，编辑 values.yml 并将 `prometheus.prometheusSpec.additionalScrapeConfigs` 数组设置为下方的**其它抓取配置**。
1. 完成安装或升级。

**结果**：Promethe 会抓取所有带有 `istio-injection=enabled` 标签的命名空间。

<figcaption>其它抓取配置</figcaption>

```yaml
- job_name: 'istio/envoy-stats'
  scrape_interval: 15s
  metrics_path: /stats/prometheus
  kubernetes_sd_configs:
    - role: pod
  relabel_configs:
    - source_labels: [__meta_kubernetes_pod_container_port_name]
      action: keep
      regex: '.*-envoy-prom'
    - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
      action: replace
      regex: ([^:]+)(?::\d+)?;(\d+)
      replacement: $1:15090
      target_label: __address__
    - action: labelmap
      regex: __meta_kubernetes_pod_label_(.+)
    - source_labels: [__meta_kubernetes_namespace]
      action: replace
      target_label: namespace
    - source_labels: [__meta_kubernetes_pod_name]
      action: replace
      target_label: pod_name
```
