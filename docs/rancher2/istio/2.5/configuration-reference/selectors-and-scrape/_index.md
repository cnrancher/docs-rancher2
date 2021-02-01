---
title: Selectors和拉取配置
---

## 概述

监控应用设置`prometheus.prometheusSpec.ignoreNamespaceSelectors=false`，默认情况下可以跨所有命名空间进行监控。

这确保你可以查看部署在带有`istio-injection=enabled`标签的命名空间中的资源的流量、指标和图表。

如果你想将 Prometheus 限制在特定的命名空间，请设置`prometheus.prometheusSpec.ignoreNamespaceSelectors=true`。一旦你这样做，你将需要添加额外的配置来继续监控你的资源。

## 通过将 ignoreNamespaceSelectors 设置为 True，将监测限制在特定的命名空间。

这会将监控限制在特定的命名空间：

1. 在**集群资源管理器**中，如果已经安装了监控，请导航到**安装的应用程序**，或**应用程序和市场**中的**图表**。
1. 如果开始新的安装，**点击**rancher-monitoring 图表，然后在**图表选项中**点击**编辑为 Yaml**。
1. 如果更新现有的安装，请点击**升级**，然后在**图表选项**中点击**编辑为 Yaml**。
1. 设置`prometheus.prometheusSpec.ignoreNamespaceSelectors=true`。
1. 完成安装或升级

**结果：** Prometheus 将被限制在特定的命名空间，这意味着需要设置以下配置之一，以继续在各种仪表板中查看数据。

## 启用 Prometheus 检测其他命名空间中的资源

当`prometheus.prometheusSpec.ignoreNamespaceSelectors=true`时，有两种不同的方法可以让 Prometheus 检测其他命名空间中的资源。

- **监控特定的命名空间**：在带有您要清除的目标的命名空间中添加服务监视器或花苞监视器。
- **跨命名空间监控**：在你的 rancher-monitoring 实例中添加一个`additionalScrapeConfig`，以便刮取所有名字空间中的所有目标。

## 监视特定的命名空间：创建服务监视器或 Pod 监视器

该选项允许您定义您希望在特定命名空间中监控哪些特定的服务或 pod。

可用性的权衡是，你必须为每个命名空间创建服务监控器或 pod 监控器，因为你不能跨命名空间监控。

> **前提条件：**为`<your namespace>`定义一个 ServiceMonitor 或 PodMonitor。下面提供一个 ServiceMonitor 的例子。

1. 在**集群资源管理器**中，打开 kubectl shell。
   如果该文件存储在您的集群中的本地，请运行`kubectl create -f <name of service/pod monitor file>.yaml`。
1. 或者运行`cat<< EOF | kubectl apply -f -`，将文件内容粘贴到终端，然后运行`EOF`完成命令。
1. 如果开始新的安装，**点击**rancher-monitoring**图，向下滚动到**Preview Yaml\*\*。
1. 运行`kubectl label namespace <your namespace> istio-injection=enabled`启用 envoy sidecar 注入。

**结果：** `<your namespace>`可以被 Prometheus 拉取到。

<figcaption>Istio代理的服务监控示例</figcaption>

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
      - { key: istio-prometheus-ignore, operator: DoesNotExist }
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
          regex: ".*-envoy-prom"
        - action: labeldrop
          regex: "__meta_kubernetes_pod_label_(.+)"
        - sourceLabels: [__meta_kubernetes_namespace]
          action: replace
          targetLabel: namespace
        - sourceLabels: [__meta_kubernetes_pod_name]
          action: replace
          targetLabel: pod_name
```

## 跨命名空间监控：将 ignoreNamespaceSelectors 设置为 False

这可以通过给 Prometheus 提供额外的 scrape 配置，实现跨命名空间的监测。

可用性的权衡是，所有 Prometheus 的 "additionalScrapeConfigs "都维护在一个 Secret 中。如果在安装 Istio 之前已经使用 additionalScrapeConfigs 部署了监控，这可能会给升级带来困难。

1. 如果开始新的安装，点击**rancher-monitoring**图表，然后在**图表选项中**点击**编辑为 Yaml**。
1. 如果更新现有的安装，请点击**升级**，然后在**图表选项**中点击**编辑为 Yaml**。
1. 如果更新现有的安装，点击**升级**，然后点击**预览 Yaml**。
1. 设置`prometheus.prometheusSpec.additionalScrapeConfigs`数组为下面提供的**Additional Scrape Config**。
1. 完成安装或升级

**结果**:所有带有`istio-injection=enabled`标签的命名空间将被 prometheus 清除。

<figcaption>额外的拉取配置</figcaption>

```yaml
- job_name: "istio/envoy-stats"
  scrape_interval: 15s
  metrics_path: /stats/prometheus
  kubernetes_sd_configs:
    - role: pod
  relabel_configs:
    - source_labels: [__meta_kubernetes_pod_container_port_name]
      action: keep
      regex: ".*-envoy-prom"
    - source_labels:
        [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
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
