---
title: 通过 Kubectl 管理 HPA
description: 本节介绍了使用 `kubectl` 进行的 HPA 管理。本文档包含有关如何执行以下操作的说明
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
  - 用户指南
  - Pod 弹性伸缩
  - 通过 Kubectl 管理 HPA
---

本节介绍了使用 `kubectl` 进行的 HPA 管理。本文档包含有关如何执行以下操作的说明：

- 创建 HPA
- 查看 HPA 相关信息
- 删除 HPA
- 配置 HPA 以根据 CPU 或内存利用率进行弹性扩缩容
- 配置 HPA 以使用自定义指标进行扩展，例如使用 Prometheus 之类的第三方工具

## 对于 Rancher v2.3.x 版本的说明

在 Rancher v2.3.x 版本中，您可以从 Rancher UI 中创建，查看和删除 HPA。您还可以配置它们以根据 Rancher UI 中的 CPU 或内存使用量进行扩展。有关更多信息，请参阅[使用 Rancher UI 管理 HPA](/docs/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-rancher-ui/_index)。如果需要基于 CPU 或内存以外的其他指标扩展 HPA，您仍然需要使用 `kubectl` 工具。

## v2.0.7 之前的 Rancher 的说明

使用较早版本的 Rancher 创建的集群不会自动满足创建 HPA 的所有要求。要在这些集群上安装 HPA，请参考 [在 Rancher v2.0.7 之前创建的集群的手动 HPA 安装](/docs/k8s-in-rancher/horitzontal-pod-autoscaler/hpa-for-rancher-before-2_0_7/_index)。

## 管理 HPA 的基本 kubectl 命令

如果您有 HPA manifest 文件，则可以使用 `kubectl` 创建，管理和删除 HPA：

- 创建 HPA

  - 有 manifest 文件: `kubectl create -f <HPA_MANIFEST>`

  - 没有 manifest 文件 (仅仅支持 CPU): `kubectl autoscale deployment hello-world --min=2 --max=5 --cpu-percent=50`

- 获取 HPA 信息

  - 基本信息: `kubectl get hpa hello-world`

  - 详细信息: `kubectl describe hpa hello-world`

- 删除 HPA

  - `kubectl delete hpa hello-world`

## HPA manifest 定义示例

HPA manifest 是用于通过 `kubectl` 管理 HPA 的配置文件。

以下代码段演示了 HPA manifest 中不同指令的使用。请参阅示例下面的列表以了解每个指令的目的。

```yml
apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: hello-world
spec:
  scaleTargetRef:
    apiVersion: extensions/v1beta1
    kind: Deployment
    name: hello-world
  minReplicas: 1
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        targetAverageUtilization: 50
    - type: Resource
      resource:
        name: memory
        targetAverageValue: 100Mi
```

| 指示                              | 描述                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `apiVersion: autoscaling/v2beta1` | 正在使用的 Kubernetes `autoscaling` API 组的版本。此示例清单使用 beta 版本，因此启用了按 CPU 和内存进行缩放。 |
| `name: hello-world`               | 表示 HPA 正在为 `hello-word` 部署执行自动扩展。                                                               |
| `minReplicas: 1`                  | 表示正在运行的最小副本数不能低于 1。                                                                          |
| `maxReplicas: 10`                 | 表示部署中的最大副本数不能超过 10。                                                                           |
| `targetAverageUtilization: 50`    | 表示当平均运行的 Pod 使用超过其请求 CPU 的 50％时，部署将扩展 Pod。                                           |
| `targetAverageValue: 100Mi`       | 表示当平均运行的 Pod 使用超过 100Mi 的内存时，部署将扩展 Pod。                                                |

## 配置 HPA 以使用资源指标（CPU 和内存）进行弹性扩缩容

在 Rancher v2.0.7 及更高版本中创建的集群具有使用 Horizontal Pod Autoscaler 所需的全部要求（metrics-server 和 Kubernetes 集群配置）。运行以下命令以检查 mecrics 组件是否安装成功：

```
$ kubectl top nodes
NAME                              CPU(cores)   CPU%      MEMORY(bytes)   MEMORY%
node-controlplane   196m         9%        1623Mi          42%
node-etcd           80m          4%        1090Mi          28%
node-worker         64m          3%        1146Mi          29%
$ kubectl -n kube-system top pods
NAME                                   CPU(cores)   MEMORY(bytes)
canal-pgldr                            18m          46Mi
canal-vhkgr                            20m          45Mi
canal-x5q5v                            17m          37Mi
canal-xknnz                            20m          37Mi
kube-dns-7588d5b5f5-298j2              0m           22Mi
kube-dns-autoscaler-5db9bbb766-t24hw   0m           5Mi
metrics-server-97bc649d5-jxrlt         0m           12Mi
$ kubectl -n kube-system logs -l k8s-app=metrics-server
I1002 12:55:32.172841       1 heapster.go:71] /metrics-server --source=kubernetes.summary_api:https://kubernetes.default.svc?kubeletHttps=true&kubeletPort=10250&useServiceAccount=true&insecure=true
I1002 12:55:32.172994       1 heapster.go:72] Metrics Server version v0.2.1
I1002 12:55:32.173378       1 configs.go:61] Using Kubernetes client with master "https://kubernetes.default.svc" and version
I1002 12:55:32.173401       1 configs.go:62] Using kubelet port 10250
I1002 12:55:32.173946       1 heapster.go:128] Starting with Metric Sink
I1002 12:55:32.592703       1 serving.go:308] Generated self-signed cert (apiserver.local.config/certificates/apiserver.crt, apiserver.local.config/certificates/apiserver.key)
I1002 12:55:32.925630       1 heapster.go:101] Starting Heapster API server...
[restful] 2018/10/02 12:55:32 log.go:33: [restful/swagger] listing is available at https:///swaggerapi
[restful] 2018/10/02 12:55:32 log.go:33: [restful/swagger] https:///swaggerui/ is mapped to folder /swagger-ui/
I1002 12:55:32.928597       1 serve.go:85] Serving securely on 0.0.0.0:443
```

如果您是在 Rancher v2.0.6 或更早版本中创建的集群，请参阅 [手动安装](#v207-之前的-rancher-的说明)

## 配置 HPA 以使用 Prometheus 的自定义指标进行弹性扩缩容

您可以将 HPA 配置为根据第三方软件提供的自定义指标自动扩缩容。使用第三方软件进行自动扩缩容的最常见用例是基于应用程序级别的指标（即每秒 HTTP 请求）。HPA 使用 `custom.metrics.k8s.io` API 来使用这些指标。通过为指标收集解决方案部署自定义指标适配器来启用此 API。

在这个例子中，我们将使用 [Prometheus](https://prometheus.io/)。我们从以下假设开始：

- Prometheus 部署在集群中。
- Prometheus 的配置正确，并且可以从 pod，节点，命名空间等收集适当的指标。
- Prometheus 服务暴露的 URL 及端口为: `http://prometheus.mycompany.io:80`

Prometheus 可在 Rancher v2.0 应用商店进行部署。如果您的集群中尚未运行它，请从 Rancher 应用商店中进行部署。

为了使 HPA 使用 Prometheus 的自定义指标，集群的 `kube-system` 命名空间中需要安装[k8s-prometheus-adapter](https://github.com/DirectXMan12/k8s-prometheus-adapter) 。要安装 `k8s-prometheus-adapter` ，我们使用 [banzai-charts](https://github.com/banzaicloud/banzai-charts)上可用的 Helm chart。

### 在您的集群中初始化 Helm。

```
# kubectl -n kube-system create serviceaccount tiller
# kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
# helm init --service-account tiller
```

### 从 GitHub 克隆 `banzai-charts` 仓库：

```
# git clone https://github.com/banzaicloud/banzai-charts
```

### 安装 `prometheus-adapter` chart，并指定 Prometheus URL 和端口号。

```
# helm install --name prometheus-adapter banzai-charts/prometheus-adapter --set prometheus.url="http://prometheus.mycompany.io",prometheus.port="80" --namespace kube-system
```

### 检查 `prometheus-adapter` 是否正常运行。检查服务容器并登录 `kube-system` 命名空间。

1.  检查 pod 是否正在运行。输入以下命令。

    ```
    # kubectl get pods -n kube-system
    ```

    从结果输出中，查找状态为“running”。

    ```
    NAME                                  READY     STATUS    RESTARTS   AGE
    ...
    prometheus-adapter-prometheus-adapter-568674d97f-hbzfx   1/1       Running   0          7h
    ...
    ```

1.  输入以下命令，检查 pod 日志以确保服务正常运行。

    ```
    # kubectl logs prometheus-adapter-prometheus-adapter-568674d97f-hbzfx -n kube-system
    ```

    然后查看 Prometheus Adaptor 日志输出以确认服务正在运行。

    ```
    ...
    I0724 10:18:45.696679       1 round_trippers.go:436] GET https://10.43.0.1:443/api/v1/namespaces/default/pods?labelSelector=app%3Dhello-world 200 OK in 2 milliseconds
    I0724 10:18:45.696695       1 round_trippers.go:442] Response Headers:
    I0724 10:18:45.696699       1 round_trippers.go:445]     Date: Tue, 24 Jul 2018 10:18:45 GMT
    I0724 10:18:45.696703       1 round_trippers.go:445]     Content-Type: application/json
    I0724 10:18:45.696706       1 round_trippers.go:445]     Content-Length: 2581
    I0724 10:18:45.696766       1 request.go:836] Response Body: {"kind":"PodList", "apiVersion":"v1", "metadata":{"selfLink":"/api/v1/namespaces/default/pods", "resourceVersion":"6237"}, "items":[{"metadata":{"name":"hello-world-54764dfbf8-q6l82", "generateName":"hello-world-54764dfbf8-", "namespace":"default", "selfLink":"/api/v1/namespaces/default/pods/hello-world-54764dfbf8-q6l82", "uid":"484cb929-8f29-11e8-99d2-067cac34e79c", "resourceVersion":"4066", "creationTimestamp":"2018-07-24T10:06:50Z", "labels":{"app":"hello-world", "pod-template-hash":"1032089694"}, "annotations":{"cni.projectcalico.org/podIP":"10.42.0.7/32"}, "ownerReferences":[{"apiVersion":"extensions/v1beta1", "kind":"ReplicaSet", "name":"hello-world-54764dfbf8", "uid":"4849b9b1-8f29-11e8-99d2-067cac34e79c", "controller":true, "blockOwnerDeletion":true}]}, "spec":{"volumes":[{"name":"default-token-ncvts", "secret":{"secretName":"default-token-ncvts", "defaultMode":420}}], "containers":[{"name":"hello-world", "image":"rancher/hello-world", "ports":[{"containerPort":80, "protocol":"TCP"}], "resources":{"requests":{"cpu":"500m", "memory":"64Mi"}}, "volumeMounts":[{"name":"default-token-ncvts", "readOnly":true, "mountPath":"/var/run/secrets/kubernetes.io/serviceaccount"}], "terminationMessagePath":"/dev/termination-log", "terminationMessagePolicy":"File", "imagePullPolicy":"Always"}], "restartPolicy":"Always", "terminationGracePeriodSeconds":30, "dnsPolicy":"ClusterFirst", "serviceAccountName":"default", "serviceAccount":"default", "nodeName":"34.220.18.140", "securityContext":{}, "schedulerName":"default-scheduler", "tolerations":[{"key":"node.kubernetes.io/not-ready", "operator":"Exists", "effect":"NoExecute", "tolerationSeconds":300}, {"key":"node.kubernetes.io/unreachable", "operator":"Exists", "effect":"NoExecute", "tolerationSeconds":300}]}, "status":{"phase":"Running", "conditions":[{"type":"Initialized", "status":"True", "lastProbeTime":null, "lastTransitionTime":"2018-07-24T10:06:50Z"}, {"type":"Ready", "status":"True", "lastProbeTime":null, "lastTransitionTime":"2018-07-24T10:06:54Z"}, {"type":"PodScheduled", "status":"True", "lastProbeTime":null, "lastTransitionTime":"2018-07-24T10:06:50Z"}], "hostIP":"34.220.18.140", "podIP":"10.42.0.7", "startTime":"2018-07-24T10:06:50Z", "containerStatuses":[{"name":"hello-world", "state":{"running":{"startedAt":"2018-07-24T10:06:54Z"}}, "lastState":{}, "ready":true, "restartCount":0, "image":"rancher/hello-world:latest", "imageID":"docker-pullable://rancher/hello-world@sha256:4b1559cb4b57ca36fa2b313a3c7dde774801aa3a2047930d94e11a45168bc053", "containerID":"docker://cce4df5fc0408f03d4adf82c90de222f64c302bf7a04be1c82d584ec31530773"}], "qosClass":"Burstable"}}]}
    I0724 10:18:45.699525       1 api.go:74] GET http://prometheus-server.prometheus.34.220.18.140.xip.io/api/v1/query?query=sum%28rate%28container_fs_read_seconds_total%7Bpod_name%3D%22hello-world-54764dfbf8-q6l82%22%2Ccontainer_name%21%3D%22POD%22%2Cnamespace%3D%22default%22%7D%5B5m%5D%29%29+by+%28pod_name%29&time=1532427525.697 200 OK
    I0724 10:18:45.699620       1 api.go:93] Response Body: {"status":"success", "data":{"resultType":"vector", "result":[{"metric":{"pod_name":"hello-world-54764dfbf8-q6l82"}, "value":[1532427525.697, "0"]}]}}
    I0724 10:18:45.699939       1 wrap.go:42] GET /apis/custom.metrics.k8s.io/v1beta1/namespaces/default/pods/%2A/fs_read?labelSelector=app%3Dhello-world: (12.431262ms) 200 [[kube-controller-manager/v1.10.1 (linux/amd64) kubernetes/d4ab475/system:serviceaccount:kube-system:horizontal-pod-autoscaler] 10.42.0.0:24268]
    I0724 10:18:51.727845       1 request.go:836] Request Body: {"kind":"SubjectAccessReview", "apiVersion":"authorization.k8s.io/v1beta1", "metadata":{"creationTimestamp":null}, "spec":{"nonResourceAttributes":{"path":"/", "verb":"get"}, "user":"system:anonymous", "group":["system:unauthenticated"]}, "status":{"allowed":false}}
    ...
    ```

### 检查是否可以通过 kubectl 访问 metrics API。

- 如果直接访问集群，请在 kubectl 配置中以以下格式输入服务器 URL： `https://<Kubernetes_URL>:6443` .

  ```
  # kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1
  ```

  如果可以访问该 API，则应该收到与以下类似的输出。

  ```
  {"kind":"APIResourceList", "apiVersion":"v1", "groupVersion":"custom.metrics.k8s.io/v1beta1", "resources":[{"name":"pods/fs_usage_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_rss", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_cpu_period", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_cfs_throttled", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_io_time", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_read", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_sector_writes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_user", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/last_seen", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/tasks_state", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_cpu_quota", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/start_time_seconds", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_limit_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_write", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_cache", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_usage_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_cfs_periods", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_cfs_throttled_periods", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_reads_merged", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_working_set_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/network_udp_usage", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_inodes_free", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_inodes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_io_time_weighted", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_failures", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_swap", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_cpu_shares", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_memory_swap_limit_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_usage", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_io_current", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_writes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_failcnt", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_reads", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_writes_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_writes_merged", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/network_tcp_usage", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_max_usage_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_memory_limit_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_memory_reservation_limit_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_load_average_10s", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_system", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_reads_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_sector_reads", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}]}
  ```

- 如果要通过 Rancher 访问集群，请在 kubectl 配置中以以下格式输入服务器 URL： `https://<RANCHER_URL>/k8s/clusters/<CLUSTER_ID>` 。将后缀 `/k8s/clusters/<CLUSTER_ID>` 添加到 API 路径。

  ```
  # kubectl get --raw /k8s/clusters/<CLUSTER_ID>/apis/custom.metrics.k8s.io/v1beta1
  ```

  若果 API 可以访问，您应该收到与以下类似的输出

  ```
  {"kind":"APIResourceList", "apiVersion":"v1", "groupVersion":"custom.metrics.k8s.io/v1beta1", "resources":[{"name":"pods/fs_usage_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_rss", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_cpu_period", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_cfs_throttled", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_io_time", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_read", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_sector_writes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_user", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/last_seen", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/tasks_state", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_cpu_quota", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/start_time_seconds", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_limit_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_write", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_cache", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_usage_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_cfs_periods", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_cfs_throttled_periods", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_reads_merged", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_working_set_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/network_udp_usage", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_inodes_free", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_inodes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_io_time_weighted", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_failures", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_swap", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_cpu_shares", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_memory_swap_limit_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_usage", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_io_current", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_writes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_failcnt", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_reads", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_writes_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_writes_merged", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/network_tcp_usage", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/memory_max_usage_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_memory_limit_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/spec_memory_reservation_limit_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_load_average_10s", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/cpu_system", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_reads_bytes", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}, {"name":"pods/fs_sector_reads", "singularName":"", "namespaced":true, "kind":"MetricValueList", "verbs":["get"]}]}
  ```
