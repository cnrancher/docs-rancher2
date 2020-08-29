---
title: 关于监控
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Octopus 基于[sigs.k8s.io/controller-runtime](https://github.com/kubernetes-sigs/controller-runtime)上搭建，因此某些指标与控制器运行时和[client-go](https://github.com/kubernetes/client-go)相关。 同时[github.com/prometheus/client_golang](https://github.com/prometheus/client_golang)为[Go runtime](https://golang.org/pkg/runtime/)提供了一些指标和过程状态。

## 指标类别

在 “种类”列中，使用第一个字母代表相应的单词：G - 仪表（Gauge），C - 计数器（Counter），H - 柱状图（Histogram），S - 摘要（Summary）。

### Controller Runtime 指标对照表

#### Controller 参数

| 种类 | 名称                                                                                                                                                                                     | 描述                              |
| :--- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------- |
| C    | [`controller_runtime_reconcile_total`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/internal/controller/metrics/metrics.go#L25-L32)        | 每个控制器的 reconcile 总数       |
| C    | [`controller_runtime_reconcile_errors_total`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/internal/controller/metrics/metrics.go#L34-L39) | 每个控制器的 reconcile error 总数 |
| H    | [`controller_runtime_reconcile_time_seconds`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/internal/controller/metrics/metrics.go#L41-L46) | 每个控制器的 reconcile 时间       |

#### Webhook 参数

| 种类 | 名称                                                                                                                                                                                   | 描述                     |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- |
| H    | [`controller_runtime_webhook_latency_seconds`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/webhook/internal/metrics/metrics.go#L26-L34) | 处理请求的延迟时间柱状图 |

### Kubernetes 客户端指标对照表

#### Rest 客户端参数

| 种类 | 名称                                                                                                                                                                     | 描述                                          |
| :--- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------- |
| C    | [`rest_client_requests_total`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/metrics/client_go_adapter.go#L44-L49)          | HTTP 请求的数量，按状态码、方法和主机划分。   |
| H    | [`rest_client_request_latency_seconds`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/metrics/client_go_adapter.go#L35-L42) | 请求延迟时间，以秒为单位。按动词和 URL 分类。 |

#### Workqueue 参数

| 种类 | 名称                                                                                                                                                                       | 描述                                                                                                                                            |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| G    | [`workqueue_depth`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/metrics/workqueue.go#L44-L49)                               | 工作队列的当前深度                                                                                                                              |
| G    | [`workqueue_unfinished_work_seconds`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/metrics/workqueue.go#L90-L98)             | 正在进行中，还没有被 work_duration 观察到，且正在进行中的工作数量，数值表示卡住的线程数量。可以通过观察这个数值的增加速度来推断卡死线程的数量。 |
| G    | [`workqueue_longest_running_processor_seconds`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/metrics/workqueue.go#L104-L110) | 工作队列运行时间最长的处理器已经运行了多少秒                                                                                                    |
| C    | [`workqueue_adds_total`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/metrics/workqueue.go#L55-L60)                          | 工作队列处理的添加总数                                                                                                                          |
| C    | [`workqueue_retries_total`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/metrics/workqueue.go#L116-L121)                     | 工作队列处理的重试数量                                                                                                                          |
| H    | [`workqueue_queue_duration_seconds`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/metrics/workqueue.go#L66-L72)              | 一个 item 在被请求之前在工作队列中停留的时间，以秒为单位                                                                                        |
| H    | [`workqueue_work_duration_seconds`](https://github.com/cnrancher/octopus/blob/master/vendor/sigs.k8s.io/controller-runtime/pkg/metrics/workqueue.go#L78-L84)               | 从工作队列处理一个项目需要多长时间，以秒为单位                                                                                                  |

### Prometheus 客户端指标对照表

#### Go runtime 参数

| 种类 | 名称                                                                                                                                                                   | 描述                                                     |
| :--- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------- |
| G    | [`go_goroutines`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L66-L69)                      | 目前存在的 goroutines 的数量                             |
| G    | [`go_threads`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L70-L73)                         | 创建的操作系统线程数                                     |
| G    | [`go_info`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L78-L81)                            | GO 环境的信息                                            |
| S    | [`go_gc_duration_seconds`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L74-L77)             | 垃圾收集周期的暂停时间汇总                               |
| G    | [`go_memstats_alloc_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L88-L94)            | 已分配且仍在使用的字节数                                 |
| C    | [`go_memstats_alloc_bytes_total`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L96-L102)     | 分配的字节总数，包括已经被释放的字节                     |
| G    | [`go_memstats_sys_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L104-L110)            | 从系统获得的字节数                                       |
| C    | [`go_memstats_lookups_total`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L112-L118)        | 指针查找的总次数                                         |
| C    | [`go_memstats_mallocs_total`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L120-L126)        | 已分配内存的总数                                         |
| C    | [`go_memstats_frees_total`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L128-L134)          | 已释放内存的总数                                         |
| G    | [`go_memstats_heap_alloc_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L136-L142)     | 已分配且仍在使用的 heap 字节数。                         |
| G    | [`go_memstats_heap_sys_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L144-L150)       | 从系统获得的 heap 数量                                   |
| G    | [`go_memstats_heap_idle_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L152-L158)      | 未使用的 heap 字节数                                     |
| G    | [`go_memstats_heap_inuse_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L160-L166)     | 正在使用的 heap 字节数                                   |
| G    | [`go_memstats_heap_released_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L168-L174)  | 释放给 OS 的 heap 字节数                                 |
| G    | [`go_memstats_heap_objects`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L176-L182)         | 已分配对象的数量                                         |
| G    | [`go_memstats_stack_inuse_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L184-L190)    | stack allocator 使用的字节数                             |
| G    | [`go_memstats_stack_sys_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L192-L198)      | stack allocator 从系统获取的字节数                       |
| G    | [`go_memstats_mspan_inuse_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L200-L206)    | 内存跨度结构所使用的字节数。                             |
| G    | [`go_memstats_mspan_sys_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L208-L214)      | 内存跨度结构从系统获取的字节数                           |
| G    | [`go_memstats_mcache_inuse_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L216-L222)   | 内存缓存结构使用的字节数。                               |
| G    | [`go_memstats_mcache_sys_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L224-L230)     | 内存缓存结构从系统获取的字节数                           |
| G    | [`go_memstats_buck_hash_sys_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L232-L238)  | profile bucket 哈希表使用的字节数                        |
| G    | [`go_memstats_gc_sys_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L240-L246)         | 用于垃圾收集系统元数据的字节数                           |
| G    | [`go_memstats_other_sys_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L248-L254)      | 用于其他系统分配的字节数                                 |
| G    | [`go_memstats_next_gc_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L256-L262)        | 下一次进行垃圾收集时的 heap 字节数                       |
| G    | [`go_memstats_last_gc_time_seconds`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L264-L270) | 自 1970 年以来最后一次收集垃圾时间，精确到秒数           |
| G    | [`go_memstats_gc_cpu_fraction`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/go_collector.go#L272-L278)      | 自程序启动以来，GC 使用的该程序可用 CPU 时间，精确到分钟 |

#### Running process 参数

| 种类 | 名称                                                                                                                                                                      | 描述                                 |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------- |
| C    | [`process_cpu_seconds_total`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/process_collector.go#L71-L75)        | 用户和系统 CPU 总耗时，单位是秒      |
| G    | [`process_open_fds`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/process_collector.go#L76-L80)                 | 打开的的 file descriptors 的数量。   |
| G    | [`process_max_fds`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/process_collector.go#L81-L85)                  | file descriptors 数量的最大限额      |
| G    | [`process_virtual_memory_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/process_collector.go#L86-L90)     | 虚拟内存大小（单位：字节）           |
| G    | [`process_virtual_memory_max_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/process_collector.go#L91-L95) | 虚拟内存大小的最大限额（单位：字节） |
| G    | [`process_resident_memory_bytes`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/process_collector.go#L96-L100)   | 预留内存大小，单位：字节             |
| G    | [`process_start_time_seconds`](https://github.com/cnrancher/octopus/blob/master/vendor/github.com/prometheus/client_golang/prometheus/process_collector.go#L101-L105)     | 进程自 unix 纪元以来的开始时间（秒） |

### Octopus 指标对照表

#### Limb 参数

| 种类 | 名称                                                                                                                | 描述                                 |
| :--- | :------------------------------------------------------------------------------------------------------------------ | :----------------------------------- |
| G    | [`limb_connect_connections`](https://github.com/cnrancher/octopus/blob/master/pkg/metrics/limb/metrics.go#L12-L19)  | 连接适配器当前的连接数量             |
| C    | [`limb_connect_errors_total`](https://github.com/cnrancher/octopus/blob/master/pkg/metrics/limb/metrics.go#L21-L28) | 连接适配器时出现的错误总数           |
| C    | [`limb_send_errors_total`](https://github.com/cnrancher/octopus/blob/master/pkg/metrics/limb/metrics.go#L30-L37)    | 适配器所需发送设备的错误总数         |
| H    | [`limb_send_latency_seconds`](https://github.com/cnrancher/octopus/blob/master/pkg/metrics/limb/metrics.go#L39-L46) | 适配器所需发送设备的延迟时间的柱状图 |

## 监控

默认情况下，指标将在端口 `8080`上公开 (请参阅[brain options](https://github.com/cnrancher/octopus/blob/master/cmd/brain/options)和[limb options](https://github.com/cnrancher/octopus/blob/master/cmd/limb/options)，则可以通过[Prometheus](https://prometheus.io/)进行收集，并通过[Grafana](https://grafana.com/)进行可视化分析。 Octopus 提供了一个[ServiceMonitor 定义 YAML](https://github.com/cnrancher/octopus/blob/master/deploy/e2e/integrate_with_prometheus_operator.yaml)与[Prometheus Operator](https://github.com/coreos/prometheus-operator)集成用于配置和管理 Prometheus 实例的工具。

### Grafana 仪表板

为方便起见，Octopus 提供了[Grafana 仪表板](https://github.com/cnrancher/octopus/blob/master/deploy/e2e/integrate_with_grafana.json)来可视化展示监视指标。

![monitoring](/img/octopus/monitoring.png)

### 与 Prometheus Operator 集成

使用[prometheus-operator HELM 图表](https://github.com/helm/charts/blob/master/stable/prometheus-operator)，您可以轻松地设置 Prometheus Operator 来监视 Octopus。 以下步骤演示了如何在本地 Kubernetes 集群上运行 Prometheus Operator：

1. 使用[`cluster-k3d-spinup.sh`](https://github.com/cnrancher/octopus/blob/master/hack/cluster-k3d-spinup.sh)通过[k3d](https://github.com/rancher/k3s)创建本地 Kubernetes 集群。
1. 按照[HELM 的安装指南](https://helm.sh/docs/intro/install/)安装 helm 工具，然后使用`helm fetch --untar --untardir /tmp stable/prometheus-operator` 将 prometheus-operator 图表移至本地`/ tmp`目录。
1. 从 prometheus-operator 图表生成部署 YAML，如下所示。
   ```shell
   helm template --namespace octopus-monitoring \
     --name octopus \
     --set defaultRules.create=false \
     --set global.rbac.pspEnabled=false \
     --set prometheusOperator.admissionWebhooks.patch.enabled=false \
     --set prometheusOperator.admissionWebhooks.enabled=false \
     --set prometheusOperator.kubeletService.enabled=false \
     --set prometheusOperator.tlsProxy.enabled=false \
     --set prometheusOperator.serviceMonitor.selfMonitor=false \
     --set alertmanager.enabled=false \
     --set grafana.defaultDashboardsEnabled=false \
     --set coreDns.enabled=false \
     --set kubeApiServer.enabled=false \
     --set kubeControllerManager.enabled=false \
     --set kubeEtcd.enabled=false \
     --set kubeProxy.enabled=false \
     --set kubeScheduler.enabled=false \
     --set kubeStateMetrics.enabled=false \
     --set kubelet.enabled=false \
     --set nodeExporter.enabled=false \
     --set prometheus.serviceMonitor.selfMonitor=false \
     --set prometheus.ingress.enabled=true \
     --set prometheus.ingress.hosts={localhost} \
     --set prometheus.ingress.paths={/prometheus} \
     --set prometheus.ingress.annotations.'traefik\.ingress\.kubernetes\.io\/rewrite-target'=/ \
     --set prometheus.prometheusSpec.externalUrl=http://localhost/prometheus \
     --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
     --set prometheus.prometheusSpec.podMonitorSelectorNilUsesHelmValues=false \
     --set prometheus.prometheusSpec.ruleSelectorNilUsesHelmValues=false \
     --set grafana.adminPassword=admin \
     --set grafana.rbac.pspUseAppArmor=false \
     --set grafana.rbac.pspEnabled=false \
     --set grafana.serviceMonitor.selfMonitor=false \
     --set grafana.testFramework.enabled=false \
     --set grafana.ingress.enabled=true \
     --set grafana.ingress.hosts={localhost} \
     --set grafana.ingress.path=/grafana \
     --set grafana.ingress.annotations.'traefik\.ingress\.kubernetes\.io\/rewrite-target'=/ \
     --set grafana.'grafana\.ini'.server.root_url=http://localhost/grafana \
     /tmp/prometheus-operator > /tmp/prometheus-operator_all_in_one.yaml
   ```
1. 通过`kubectl create ns octopus-monitoring`创建`octopus-monitoring`命名空间。
1. 通过`kubectl apply -f /tmp/prometheus-operator_all_in_one.yaml`将 prometheus-operator `all-in-ine`部署于本地集群。
1. (可选)通过`kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/deploy/e2e/all_in_one.yaml`来部署 Octopus
1. 通过`kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/deploy/e2e/integrate_with_prometheus_operator.yaml` 将监视集成部署于本地集群。
1. 访问`http://localhost/prometheus`以通过浏览器查看 Prometheus Web 控制台，或访问`http://localhost/grafana`以查看 Grafana 控制台(管理员帐户为`admin/admin`)。
1. (可选)从 Grafana 控制台导入[Octopus 概述仪表板](https://raw.githubusercontent.com/cnrancher/octopus/master/deploy/e2e/integrate_with_grafana.json)。
