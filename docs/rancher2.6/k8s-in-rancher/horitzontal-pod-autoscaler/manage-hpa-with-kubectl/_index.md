---
title: 使用 kubectl 管理 HPA
weight: 3029
---

本文介绍如何使用 `kubectl` 管理 HPA。本文对以下操作进行了说明：

- 创建 HPA
- 获取 HPA 的信息
- 删除 HPA
- 配置 HPA 以根据 CPU 或内存利用率进行扩缩
- 如果你使用 Prometheus 等第三方工具的指标，配置 HPA 以使用自定义指标进行扩缩


你可以在 Rancher UI 中创建、查看和删除 HPA。你还可以根据 Rancher UI 中的 CPU/内存使用情况进行扩缩。有关详细信息，请参阅[使用 Rancher UI 管理 HPA]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-rancher-ui)。如果要使用 CPU/内存以外的指标来扩缩 HPA，你需要使用 `kubectl`。

##### 管理 HPA 的基本 kubectl 命令

如果你有 HPA 清单文件，则可以使用 `kubectl` 来创建、管理和删除 HPA：

- 创建 HPA

   - 有清单：`kubectl create -f <HPA_MANIFEST>`

   - 没有清单（仅支持 CPU）：`kubectl autoscale deployment hello-world --min=2 --max=5 --cpu-percent=50`

- 获取 HPA 信息

   - 基本：`kubectl get hpa hello-world`

   - 详细描述：`kubectl describe hpa hello-world`

- 删除 HPA

   - `kubectl delete hpa hello-world`

##### HPA 清单定义示例

HPA 清单是用于使用 `kubectl` 管理 HPA 的配置文件。

以下代码片段在 HPA 清单中使用了不同的指令。请参阅示例下方的列表以了解每个指令的用途。

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


| 指令 | 描述 |
---------|----------|
| `apiVersion: autoscaling/v2beta1` | 正在使用的 Kubernetes `autoscaling` API 组的版本。此示例清单使用 beta 版本，因此启用了按 CPU./内存进行扩缩。 |
| `name: hello-world` | 表示 HPA 在为 `hello-word` deployment 执行自动扩缩。 |
| `minReplicas: 1` | 表示运行的最小副本数不能低于 1。 |
| `maxReplicas: 10` | 指示 deployment 中的最大副本数不能超过 10。 |
| `targetAverageUtilization: 50` | 表示当平均运行的 pod 使用超过请求 CPU 的 50% 时，deployment 将扩展 pod。 |
| `targetAverageValue: 100Mi` | 表示当平均运行的 pod 使用超过 100Mi 的内存时，deployment 将扩展 pod。 |
<br/>

##### 使用资源指标（CPU 和内存）配置 HPA 以进行扩缩

在 Rancher 2.0.7 及更高版本中创建的集群满足使用 Horizontal Pod Autoscaler 的所有要求（metrics-server 和 Kubernetes 集群配置）。

运行以下命令以检查你的安装中是否有可用的指标：

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


##### 配置 HPA 以使用 Prometheus 自定义指标进行扩缩

你可以将 HPA 配置为根据第三方软件提供的自定义指标进行自动扩缩。使用第三方软件进行自动扩缩的最常见用例是使用应用程序级别的指标（即每秒 HTTP 请求数）。HPA 使用 `custom.metrics.k8s.io` API 来使用这些指标。通过为指标收集解决方案部署自定义指标适配器，你可以启用此 API。

对于这个例子，我们将使用 [Prometheus](https://prometheus.io/)。我们假设：

- Prometheus 部署在集群中。
- Prometheus 配置正确，并从 pod、节点、命名空间等收集合适的指标。
- Prometheus 暴露在以下 URL 和端口：`http://prometheus.mycompany.io:80`

Prometheus 可用于 Rancher 2.0 应用商店中的 Deployment。如果它还没有运行在你的集群中，请在 Rancher 应用商店中部署它。

为了让 HPA 使用来自 Prometheus 的自定义指标，[k8s-prometheus-adapter](https://github.com/DirectXMan12/k8s-prometheus-adapter) 包需要在你集群的 `kube-system` 命名空间中。要安装 `k8s-prometheus-adapter`，使用 [banzai-charts](https://github.com/banzaicloud/banzai-charts) 提供的 Helm Chart。

1. 在集群中初始化 Helm。
   ```
   # kubectl -n kube-system create serviceaccount tiller
   kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
   helm init --service-account tiller
   ```

1. 从 GitHub 克隆 `banzai-charts` 仓库：
   ```
   # git clone https://github.com/banzaicloud/banzai-charts
   ```

1. 安装 `prometheus-adapter` Chart，指定 Prometheus URL 和端口号：
   ```
   # helm install --name prometheus-adapter banzai-charts/prometheus-adapter --set prometheus.url="http://prometheus.mycompany.io",prometheus.port="80" --namespace kube-system
   ```

1. 检查 `prometheus-adapter` 是否正常运行。检查服务 pod 并在 `kube-system` 命名空间中登录。

   1. 检查服务 pod 是否处于 `Running` 状态。输入以下命令：
      ```
      # kubectl get pods -n kube-system
      ```
      在输出结果中查找 `Running` 状态。
         ```
         NAME                                  READY     STATUS    RESTARTS   AGE
         ...
         prometheus-adapter-prometheus-adapter-568674d97f-hbzfx   1/1       Running   0          7h
         ...
         ```
   1. 通过输入以下命令检查服务日志，确保服务正常运行：
      ```
      # kubectl logs prometheus-adapter-prometheus-adapter-568674d97f-hbzfx -n kube-system
      ```
      然后查看日志输出以确认服务正在运行。
      {{% accordion id="prometheus-logs" label="Prometheus Adaptor 日志" %}}
      ...
      I0724 10:18:45.696679       1 round_trippers.go:436] GET https://10.43.0.1:443/api/v1/namespaces/default/pods?labelSelector=app%3Dhello-world 200 OK in 2 milliseconds
      I0724 10:18:45.696695       1 round_trippers.go:442] Response Headers:
      I0724 10:18:45.696699       1 round_trippers.go:445]     Date: Tue, 24 Jul 2018 10:18:45 GMT
      I0724 10:18:45.696703       1 round_trippers.go:445]     Content-Type: application/json
      I0724 10:18:45.696706       1 round_trippers.go:445]     Content-Length: 2581
      I0724 10:18:45.696766       1 request.go:836] Response Body: {"kind":"PodList","apiVersion":"v1","metadata":{"selfLink":"/api/v1/namespaces/default/pods","resourceVersion":"6237"},"items":[{"metadata":{"name":"hello-world-54764dfbf8-q6l82","generateName":"hello-world-54764dfbf8-","namespace":"default","selfLink":"/api/v1/namespaces/default/pods/hello-world-54764dfbf8-q6l82","uid":"484cb929-8f29-11e8-99d2-067cac34e79c","resourceVersion":"4066","creationTimestamp":"2018-07-24T10:06:50Z","labels":{"app":"hello-world","pod-template-hash":"1032089694"},"annotations":{"cni.projectcalico.org/podIP":"10.42.0.7/32"},"ownerReferences":[{"apiVersion":"extensions/v1beta1","kind":"ReplicaSet","name":"hello-world-54764dfbf8","uid":"4849b9b1-8f29-11e8-99d2-067cac34e79c","controller":true,"blockOwnerDeletion":true}]},"spec":{"volumes":[{"name":"default-token-ncvts","secret":{"secretName":"default-token-ncvts","defaultMode":420}}],"containers":[{"name":"hello-world","image":"rancher/hello-world","ports":[{"containerPort":80,"protocol":"TCP"}],"resources":{"requests":{"cpu":"500m","memory":"64Mi"}},"volumeMounts":[{"name":"default-token-ncvts","readOnly":true,"mountPath":"/var/run/secrets/kubernetes.io/serviceaccount"}],"terminationMessagePath":"/dev/termination-log","terminationMessagePolicy":"File","imagePullPolicy":"Always"}],"restartPolicy":"Always","terminationGracePeriodSeconds":30,"dnsPolicy":"ClusterFirst","serviceAccountName":"default","serviceAccount":"default","nodeName":"34.220.18.140","securityContext":{},"schedulerName":"default-scheduler","tolerations":[{"key":"node.kubernetes.io/not-ready","operator":"Exists","effect":"NoExecute","tolerationSeconds":300},{"key":"node.kubernetes.io/unreachable","operator":"Exists","effect":"NoExecute","tolerationSeconds":300}]},"status":{"phase":"Running","conditions":[{"type":"Initialized","status":"True","lastProbeTime":null,"lastTransitionTime":"2018-07-24T10:06:50Z"},{"type":"Ready","status":"True","lastProbeTime":null,"lastTransitionTime":"2018-07-24T10:06:54Z"},{"type":"PodScheduled","status":"True","lastProbeTime":null,"lastTransitionTime":"2018-07-24T10:06:50Z"}],"hostIP":"34.220.18.140","podIP":"10.42.0.7","startTime":"2018-07-24T10:06:50Z","containerStatuses":[{"name":"hello-world","state":{"running":{"startedAt":"2018-07-24T10:06:54Z"}},"lastState":{},"ready":true,"restartCount":0,"image":"rancher/hello-world:latest","imageID":"docker-pullable://rancher/hello-world@sha256:4b1559cb4b57ca36fa2b313a3c7dde774801aa3a2047930d94e11a45168bc053","containerID":"docker://cce4df5fc0408f03d4adf82c90de222f64c302bf7a04be1c82d584ec31530773"}],"qosClass":"Burstable"}}]}
      I0724 10:18:45.699525       1 api.go:74] GET http://prometheus-server.prometheus.34.220.18.140.xip.io/api/v1/query?query=sum%28rate%28container_fs_read_seconds_total%7Bpod_name%3D%22hello-world-54764dfbf8-q6l82%22%2Ccontainer_name%21%3D%22POD%22%2Cnamespace%3D%22default%22%7D%5B5m%5D%29%29+by+%28pod_name%29&time=1532427525.697 200 OK
      I0724 10:18:45.699620       1 api.go:93] Response Body: {"status":"success","data":{"resultType":"vector","result":[{"metric":{"pod_name":"hello-world-54764dfbf8-q6l82"},"value":[1532427525.697,"0"]}]}}
      I0724 10:18:45.699939       1 wrap.go:42] GET /apis/custom.metrics.k8s.io/v1beta1/namespaces/default/pods/%2A/fs_read?labelSelector=app%3Dhello-world: (12.431262ms) 200 [[kube-controller-manager/v1.10.1 (linux/amd64) kubernetes/d4ab475/system:serviceaccount:kube-system:horizontal-pod-autoscaler] 10.42.0.0:24268]
      I0724 10:18:51.727845       1 request.go:836] Request Body: {"kind":"SubjectAccessReview","apiVersion":"authorization.k8s.io/v1beta1","metadata":{"creationTimestamp":null},"spec":{"nonResourceAttributes":{"path":"/","verb":"get"},"user":"system:anonymous","group":["system:unauthenticated"]},"status":{"allowed":false}}
      ...
      {{% /accordion %}}



1. 检查是否可以从 kubectl 访问 metrics API。

   - 如果你直接访问集群，请在 kubectl 配置中输入你的服务器 URL，格式是 `https://<Kubernetes_URL>:6443`：
      ```
      # kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1
      ```
      如果 API 可访问，你应该会看到类似以下内容的输出：
      {{% accordion id="custom-metrics-api-response" label="API 响应" %}}
      {"kind":"APIResourceList","apiVersion":"v1","groupVersion":"custom.metrics.k8s.io/v1beta1","resources":[{"name":"pods/fs_usage_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_rss","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_cpu_period","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_cfs_throttled","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_io_time","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_read","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_sector_writes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_user","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/last_seen","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/tasks_state","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_cpu_quota","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/start_time_seconds","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_limit_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_write","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_cache","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_usage_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_cfs_periods","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_cfs_throttled_periods","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_reads_merged","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_working_set_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/network_udp_usage","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_inodes_free","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_inodes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_io_time_weighted","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_failures","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_swap","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_cpu_shares","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_memory_swap_limit_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_usage","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_io_current","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_writes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_failcnt","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_reads","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_writes_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_writes_merged","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/network_tcp_usage","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_max_usage_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_memory_limit_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_memory_reservation_limit_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_load_average_10s","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_system","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_reads_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_sector_reads","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]}]}
      {{% /accordion %}}

   - 如果你通过 Rancher 访问集群，请在 kubectl 配置中输入你的服务器 URL，格式是 `https://<RANCHER_URL>/k8s/clusters/<CLUSTER_ID>`。将 `/k8s/clusters/<CLUSTER_ID>` 后缀添加到 API 路径：
      ```
      # kubectl get --raw /k8s/clusters/<CLUSTER_ID>/apis/custom.metrics.k8s.io/v1beta1
      ```
      如果 API 可访问，你应该会看到类似以下内容的输出：
      {{% accordion id="custom-metrics-api-response-rancher" label="API 响应" %}}
      {"kind":"APIResourceList","apiVersion":"v1","groupVersion":"custom.metrics.k8s.io/v1beta1","resources":[{"name":"pods/fs_usage_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_rss","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_cpu_period","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_cfs_throttled","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_io_time","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_read","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_sector_writes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_user","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/last_seen","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/tasks_state","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_cpu_quota","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/start_time_seconds","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_limit_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_write","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_cache","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_usage_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_cfs_periods","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_cfs_throttled_periods","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_reads_merged","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_working_set_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/network_udp_usage","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_inodes_free","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_inodes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_io_time_weighted","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_failures","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_swap","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_cpu_shares","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_memory_swap_limit_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_usage","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_io_current","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_writes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_failcnt","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_reads","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_writes_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_writes_merged","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/network_tcp_usage","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/memory_max_usage_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_memory_limit_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/spec_memory_reservation_limit_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_load_average_10s","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/cpu_system","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_reads_bytes","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]},{"name":"pods/fs_sector_reads","singularName":"","namespaced":true,"kind":"MetricValueList","verbs":["get"]}]}
      {{% /accordion %}}
