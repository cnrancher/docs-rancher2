---
title: 在集群中启用Istio
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
  - Istio
  - 在集群中启用Istio
---

## 安装 Istio

**前提条件：**只有分配了`cluster-admin`[Kubernetes 默认角色](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)的用户才能在 Kubernetes 集群中配置和安装 Istio。

1. 从**集群资源管理器**导航到**应用市场**中的可用**Chart**。
1. 选择 Istio 图表。
1. 如果您还没有安装自己的监控应用，系统会提示您安装`rancher-monitoring-app`。可选：在安装 rancher-监控应用时设置您的选择器或 Scrape 配置选项。
1. 可选：配置成员权限和资源限额。为 Istio 组件配置成员访问和[资源限额]({{<baseurl>}}/rancher/v2.x/en/cluster-admin/tools/istio/resources/)。确保你的工作节点上有足够的资源来启用 Istio。
1. 可选：如果需要，对 values.yaml 进行额外的配置更改。
1. 可选：通过[覆盖文件](#overlay-file)添加额外的资源或配置。
1. 单击**安装**。

**结果：** 已在集群内安装了 Istio。

默认情况下，sidecar 自动注入是被禁用的。请在安装或升级时在`values.yaml`中将变量`sidecarInjectorWebhook.enableNamespacesByDefault`的值设置为`true`，启用这个功能。这将自动启用 Istio sidecar 注入到所有新部署的命名空间中。

## 启用 Istio sidecar

**注意：**在以下三种集群中：**正在使用[Canal 网络插件](/docs/rancher2/cluster-provisioning/rke-clusters/options/_index)的集群**、**已启用项目网络隔离选项的集群**和**安装了 Istio Ingress 模块的集群**，Istio Ingress Gateway pod 默认情况下无法将入口流量重定向到工作负载。因为所有的命名空间都无法从安装 Istio 的命名空间中获得。有两个方法可以启用 Istio sidecar。

### 添加一个新的网络策略

第一个选项是在您打算由 Istio 控制入口的每个命名空间中添加一个新的网络策略。您的策略应该包括以下几行内容。

```yaml
- podSelector:
    matchLabels:
      app: istio-ingressgateway
```

### 将 `istio-system` 命名空间移到 `system` 项目中

第二种选择是将 `istio-system` 命名空间移到 `system` 项目中，默认情况下， `system` 项目不受网络隔离限制。

## 其他配置选项

### Overlay File

Overlay File 的设计是为了支持您的 Istio 安装的扩展配置。它允许您对[IstioOperator API](https://istio.io/latest/docs/reference/config/istio.operator.v1alpha1/)中的任何值进行更改。这将确保您可以自定义默认安装以适应任何情况。

Overlay File 将在 Istio 图表安装提供的默认安装之上添加配置。这意味着你不需要重新定义已经定义安装的组件。

关于 Overlay File 的更多信息，请参考[文档](https://istio.io/latest/docs/setup/install/istioctl/#configure-component-settings)。

## Selectors 和 Scrape 配置

监控应用程序设置`prometheus.prometheusSpec.ignoreNamespaceSelectors=false`，默认情况下可以跨所有命名空间进行监控。这确保你可以查看部署在带有`istio-injection=enabled`标签的命名空间中的资源的流量、指标和图表。

如果你想将 prometheus 限制在特定的命名空间，请设置`prometheus.prometheusSpec.ignoreNamespaceSelectors=true`。一旦你这样做，你将需要添加额外的配置来继续监控你的资源。

**将 ingnoreNamspaceSelectors 设置为 True**

将监控限制在特定的命名空间：

1. 在**集群资源管理器**中，如果已经安装了监控，请导航到**安装的应用程序**，或**应用商店**中的**Chart**。
1. 如果开始新的安装，点击**rancher-monitoring**chart，然后在**chart 选项**中点击**以 Yaml 形式编辑**。
1. 如果更新现有的安装，请点击**升级**，然后在**图 chart 选项**中点击**以 Yaml 形式编辑**。
1. 设置`prometheus.prometheusSpec.ignoreNamespaceSelectors=true`。
1. 完成安装或升级。

**结果：** Prometheus 将被限制在特定的命名空间，这意味着需要设置以下配置之一，以继续在各种仪表板中查看数据。

当`prometheus.prometheusSpec.ignoreNamespaceSelectors=true`时，有两种不同的方法可以让 prometheus 检测其他命名空间的资源。

1. 在有你要拉取数据的命名空间中添加一个 Service Monitor 或 Pod Monitor。
1. 在您的 rancher-monitoring 实例中添加一个`additionalScrapeConfig`，以拉取所有命名空间中的所有目标。

### 选项 1：创建服务监控或 Pod 监控

**前提条件**：为`<namaspace>`定义一个 ServiceMonitor 或 PodMonitor。下面提供了 ServiceMonitor 的示例。

此选项允许您定义您希望在特定命名空间中监控的特定服务或 pod。

> 可用性的权衡是，你必须为每个命名空间创建 Service Monitor 或 Pod Monitor。，因为你不能跨命名空间监控。

1. 从**集群资源管理器**，打开 kubectl shell。
   如果该文件存储在您的集群中的本地，请运行`kubectl create -f <name of service/pod monitor file>.yaml`。
1. 或者运行`cat<< EOF | kubectl apply -f -`，将文件内容粘贴到终端，然后运行`EOF`完成命令。
1. 如果开始新的安装，**点击**rancher-monitoring**图，向下滚动到**Preview Yaml\*\*。
1. 运行`kubectl label namespace <your namespace> istio-injection=enabled`启用 envoy sidecar 注入。

**结果:** `<namspace>`可以被 prometheus 拉取。

**Istio 代理的服务监控示例**

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

### 选项 2：将 ingnoreNamspaceSelectors 设置为 False

通过给 prometheus 提供额外的 scrape 配置，可以跨命名空间进行监控。

> 可用性的权衡是，所有 prometheus 的`additionalScrapeConfigs`都维护在一个 Secret 中。如果在安装 Istio 之前，监控已经部署了额外的 ScrapeConfigs，这可能会给升级带来困难。

1. 如果开始新的安装，**点击**rancher-monitoring**图表，然后在**图表选项中点击**编辑为 Yaml**。
1. 如果更新现有的安装，请点击**升级**，然后在**图表选项**中点击**编辑为 Yaml**。
1. 如果更新现有的安装，点击**升级**，然后点击**预览 Yaml**。
1. 设置`prometheus.prometheusSpec.additionalScrapeConfigs`数组为下面提供的**Additional Scrape Config**。
1. 完成安装或升级。

**结果:**所有带有`istio-injection=enabled`标签的命名空间都将被 prometheus 拉取。

**附加的 Scrape 配置：**

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
