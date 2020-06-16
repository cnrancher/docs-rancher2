---
title: Prometheus自定义监控指标适配器
---

启用了[集群层级的监控](/docs/cluster-admin/tools/monitoring/_index)以后，您可以查看 Rancher 的监控指标。您也可以部署 Prometheus 自定义监控指标适配器，然后配合储存在集群内的监控指标，使用 HPA。

## 部署 Prometheus 自定义监控指标适配器

下文使用[Prometheus 自定义监控指标适配器 v0.5.0](https://github.com/DirectXMan12/k8s-prometheus-adapter/releases/tag/v0.5.0)。这是一个[自定义监控指标](https://github.com/kubernetes-incubator/custom-metrics-apiserver)示例。只有**集群所有者**才可以执行以下步骤。

1. 获取集群监控使用的 service account，它应该已经配置了这个 workload ID：`statefulset:cattle-prometheus:prometheus-cluster-monitoring`。如果您没有自定义任何选项，service account 的名字应该是`cluster-monitoring`。

2. 授予 service account 需要的两个权限。

   一个角色是`kube-system`中的`extension-apiserver-authentication-reader`，您需要在`kube-system`创建一个`Rolebinding`。这个权限的作用是从`kube-system`的 config map 获取 api 集合器配置。

   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     name: custom-metrics-auth-reader
     namespace: kube-system
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: Role
     name: extension-apiserver-authentication-reader
   subjects:
     - kind: ServiceAccount
       name: cluster-monitoring
       namespace: cattle-prometheus
   ```

   另一个角色是集群角色`system:auth-delegator`，您需要创建一个`ClusterRoleBinding`。这个权限的作用是允许代理身份认证和鉴权，以实现统一的身份认证和鉴权。

   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: custom-metrics:system:auth-delegator
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: ClusterRole
     name: system:auth-delegator
   subjects:
     - kind: ServiceAccount
       name: cluster-monitoring
       namespace: cattle-prometheus
   ```

3. 创建自定义参数适配器的配置文件，以下代码是一个配置文件的示例。下一节会详细讲述如何完成该配置文件。

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: adapter-config
     namespace: cattle-prometheus
   data:
     config.yaml: |
       rules:
       - seriesQuery: '{__name__=~"^container_.*",container_name!="POD",namespace!="",pod_name!=""}'
         seriesFilters: []
         resources:
           overrides:
             namespace:
               resource: namespace
             pod_name:
               resource: pod
         name:
           matches: ^container_(.*)_seconds_total$
           as: ""
         metricsQuery: sum(rate(<<.Series>>{<<.LabelMatchers>>,container_name!="POD"}[1m])) by (<<.GroupBy>>)
       - seriesQuery: '{__name__=~"^container_.*",container_name!="POD",namespace!="",pod_name!=""}'
         seriesFilters:
         - isNot: ^container_.*_seconds_total$
         resources:
           overrides:
             namespace:
               resource: namespace
             pod_name:
               resource: pod
         name:
           matches: ^container_(.*)_total$
           as: ""
         metricsQuery: sum(rate(<<.Series>>{<<.LabelMatchers>>,container_name!="POD"}[1m])) by (<<.GroupBy>>)
       - seriesQuery: '{__name__=~"^container_.*",container_name!="POD",namespace!="",pod_name!=""}'
         seriesFilters:
         - isNot: ^container_.*_total$
         resources:
           overrides:
             namespace:
               resource: namespace
             pod_name:
               resource: pod
         name:
           matches: ^container_(.*)$
           as: ""
         metricsQuery: sum(<<.Series>>{<<.LabelMatchers>>,container_name!="POD"}) by (<<.GroupBy>>)
       - seriesQuery: '{namespace!="",__name__!~"^container_.*"}'
         seriesFilters:
         - isNot: .*_total$
         resources:
           template: <<.Resource>>
         name:
           matches: ""
           as: ""
         metricsQuery: sum(<<.Series>>{<<.LabelMatchers>>}) by (<<.GroupBy>>)
       - seriesQuery: '{namespace!="",__name__!~"^container_.*"}'
         seriesFilters:
         - isNot: .*_seconds_total
         resources:
           template: <<.Resource>>
         name:
           matches: ^(.*)_total$
           as: ""
         metricsQuery: sum(rate(<<.Series>>{<<.LabelMatchers>>}[1m])) by (<<.GroupBy>>)
       - seriesQuery: '{namespace!="",__name__!~"^container_.*"}'
         seriesFilters: []
         resources:
           template: <<.Resource>>
         name:
           matches: ^(.*)_seconds_total$
           as: ""
         metricsQuery: sum(rate(<<.Series>>{<<.LabelMatchers>>}[1m])) by (<<.GroupBy>>)
       resourceRules:
         cpu:
           containerQuery: sum(rate(container_cpu_usage_seconds_total{<<.LabelMatchers>>}[1m])) by (<<.GroupBy>>)
           nodeQuery: sum(rate(container_cpu_usage_seconds_total{<<.LabelMatchers>>, id='/'}[1m])) by (<<.GroupBy>>)
           resources:
             overrides:
               instance:
                 resource: node
               namespace:
                 resource: namespace
               pod_name:
                 resource: pod
           containerLabel: container_name
         memory:
           containerQuery: sum(container_memory_working_set_bytes{<<.LabelMatchers>>}) by (<<.GroupBy>>)
           nodeQuery: sum(container_memory_working_set_bytes{<<.LabelMatchers>>,id='/'}) by (<<.GroupBy>>)
           resources:
             overrides:
               instance:
                 resource: node
               namespace:
                 resource: namespace
               pod_name:
                 resource: pod
           containerLabel: container_name
         window: 1m
   ```

4. 为您的 api server 创建 HTTPS TLS 证书。

   ```bash
   openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out serving.crt -keyout serving.key -subj "/C=CN/CN=custom-metrics-apiserver.cattle-prometheus.svc.cluster.local"
   # And you will find serving.crt and serving.key in your path. And then you are going to create a secret in cattle-prometheus namespace.
   kubectl create secret generic -n cattle-prometheus cm-adapter-serving-certs --from-file=serving.key=./serving.key --from-file=serving.crt=./serving.crt
   ```

5. 然后您可以创建 Prometheus 自定义监控指标适配器。部署前需要以导入 YAML 的方式创建一个服务。请在`cattle-prometheus`这个命名空间内创建以下资源。

   以下是 Prometheus 自定义监控指标适配器的部署示例。

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     labels:
       app: custom-metrics-apiserver
     name: custom-metrics-apiserver
     namespace: cattle-prometheus
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: custom-metrics-apiserver
     template:
       metadata:
         labels:
           app: custom-metrics-apiserver
         name: custom-metrics-apiserver
       spec:
         serviceAccountName: cluster-monitoring
         containers:
           - name: custom-metrics-apiserver
             image: directxman12/k8s-prometheus-adapter-amd64:v0.5.0
             args:
               - --secure-port=6443
               - --tls-cert-file=/var/run/serving-cert/serving.crt
               - --tls-private-key-file=/var/run/serving-cert/serving.key
               - --logtostderr=true
               - --prometheus-url=http://prometheus-operated/
               - --metrics-relist-interval=1m
               - --v=10
               - --config=/etc/adapter/config.yaml
             ports:
               - containerPort: 6443
             volumeMounts:
               - mountPath: /var/run/serving-cert
                 name: volume-serving-cert
                 readOnly: true
               - mountPath: /etc/adapter/
                 name: config
                 readOnly: true
               - mountPath: /tmp
                 name: tmp-vol
         volumes:
           - name: volume-serving-cert
             secret:
               secretName: cm-adapter-serving-certs
           - name: config
             configMap:
               name: adapter-config
           - name: tmp-vol
             emptyDir: {}
   ```

   以下是服务的部署示例。

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: custom-metrics-apiserver
     namespace: cattle-prometheus
   spec:
     ports:
       - port: 443
         targetPort: 6443
     selector:
       app: custom-metrics-apiserver
   ```

6. 为您的自定义参数 server 创建 API service。

   ```yaml
   apiVersion: apiregistration.k8s.io/v1beta1
   kind: APIService
   metadata:
     name: v1beta1.custom.metrics.k8s.io
   spec:
     service:
       name: custom-metrics-apiserver
       namespace: cattle-prometheus
     group: custom.metrics.k8s.io
     version: v1beta1
     insecureSkipTLSVerify: true
     groupPriorityMinimum: 100
     versionPriority: 100
   ```

7. 在命令行界面输入`kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1`命令，校验自定义参数 server 是否已经配置成功。如果从 api 返回了参数，则表示配置成功。

8. 现在您可以使用自定义参数创建 HPA。首先您需要在命名空间中创建一个 NGINX 部署，以下是 HPA 的示例代码。

   ```yaml
   kind: HorizontalPodAutoscaler
   apiVersion: autoscaling/v2beta1
   metadata:
     name: nginx
   spec:
     scaleTargetRef:
       # point the HPA at the nginx deployment you just created
       apiVersion: apps/v1
       kind: Deployment
       name: nginx
     # autoscale between 1 and 10 replicas
     minReplicas: 1
     maxReplicas: 10
     metrics:
       # use a "Pods" metric, which takes the average of the
       # given metric across all pods controlled by the autoscaling target
       - type: Pods
         pods:
           metricName: memory_usage_bytes
           targetAverageValue: 5000000
   ```

   然后，您的 NGINX 规模会变大，表示使用自定义参数创建的 HPA 开始运行。

## 配置 Prometheus 自定义监控指标适配器

> 每一条规则都是独立执行的，所以请保证您配置的规则之间存在互斥关系，说明适配器需要执行的每一个步骤，然后将参数在 API 中暴露。

简而言之，每一条规则由以下四个部分组成：

- 服务发现（Discovery）：告诉适配器如何找到这条规则涉及的所有参数。

- 关联（Association）：说明了参数与 Kubernetes 资源之间的关系，如参数 A 代表的是某个 Kubernetes 资源。

- 名称（Naming)：说明了适配器如何在自定义参数 API 中将特定的参数暴露出去。

- 查询（Querying）：说明了如何将查询 Kubernetes 参数的转换为 Prometheus 的查询语句。

您可以查看更加具体的配置文件[sample-config.yaml](sample-config.yaml)获取详细的配置样例，也可参考下方的代码示例，查看如何配置只有一条规则的配置文件：

```yaml
rules:
# this rule matches cumulative cAdvisor metrics measured in seconds
- seriesQuery: '{__name__=~"^container_.*",container_name!="POD",namespace!="",pod_name!=""}'
  resources:
    # skip specifying generic resource<->label mappings, and just
    # attach only pod and namespace resources by mapping label names to group-resources
    overrides:
      namespace: {resource: "namespace"},
      pod_name: {resource: "pod"},
  # specify that the `container_` and `_seconds_total` suffixes should be removed.
  # this also introduces an implicit filter on metric family names
  name:
    # we use the value of the capture group implicitly as the API name
    # we could also explicitly write `as: "$1"`
    matches: "^container_(.*)_seconds_total$"
  # specify how to construct a query to fetch samples for a given series
  # This is a Go template where the `.Series` and `.LabelMatchers` string values
  # are availabel, and the delimiters are `<<` and `>>` to avoid conflicts with
  # the prometheus query language
  metricsQuery: "sum(rate(<<.Series>>{<<.LabelMatchers>>,container_name!="POD"}[2m])) by (<<.GroupBy>>)"
```

### 服务发现（Discovery）

服务发现（Discovery）指定需要处理的 Prometheus 的参数，通过`seriesQuery`挑选需要处理的参数集合，通过`seriesFilters`精确过滤参数。`seriesQuery`用于挑选需要处理的参数集合。Prometheus 参数适配器会使用该机器的标签信息，后续还会用到 “metric-name-label-names”。

`seriesFilters`用于精确过滤参数。在大部分情况下，过滤参数只需要用到`seriesQuery`。但是当两条规则的关系不为互斥时，需要同时使用`seriesFilters`和`seriesQuery`，以达到精确过滤的目的。首先通过`seriesQuery`查询，然后通过`seriesFilters`过滤返回信息。

`seriesFilters`提供了以下两个过滤方式：

- `is: <regex>`，返回名称和`<regex>`中的字符串匹配的 series。

- `isNot: <regex>`，返回名称和`<regex>`中的字符串不匹配的 series。

例如：

```yaml
# match all cAdvisor metrics that aren't measured in seconds
seriesQuery: '{__name__=~"^container_.*_total",container_name!="POD",namespace!="",pod_name!=""}'
seriesFilters:
  isNot: "^container_.*_seconds_total"
```

### 关联（Association）

关联负责的是设置 metric 与 kubernetes resources 的映射关系，`resources`控制这个过程。

有两种关联 Kubernetes 资源和参数的方式。在这两种方式中，标签（label）的值都会变成某个对象。

一种方式是基于标签名称指定匹配某些样式的名称。这可以通过`template`实现。样式通过 GO 模板指定，`Group`和`Resource`表示组合资源。系统会自动辨别是哪个组，所以您可能不会用到`Group`，例如：

```yaml
# any label `kube_<group>_<resource>` becomes <group>.<resource> in Kubernetes
resources:
  template: "kube_<<.Group>>_<<.Resource>>"
```

另一种方式是使用`overrides`指定匹配某些样式的名称，一个`overrides`可以指定一种 Prometheus label 和 Kubernetes 资源的映射关系，例如：

```yaml
# the microservice label corresponds to the apps.deployment resource
resource:
  overrides:
    microservice: { group: "apps", resource: "deployment" }
```

上述两种方法没有互斥性，您可以在一条规则中同时使用这两种方法。使用第一种方法的目的是创建一个模板，使用第二种方式的目的是针对某些资源中的可能存在特例，可以使用该方式处理这些特例。

只要您有对应的标签，resource 可以指代 Kubernetes 集群中的任意资源。

### 命名（Naming）

命名（Naming）用于将 prometheus metrics 名称转化为 custom metrics API 所使用的 metrics 名称，但不会改变其本身的 metric 名称，`name`控制这个过程。

命名是通过指定参数名称的模板，从 Prometheus name 提取 API name，然后将 name 转换为您指定的 name。

该名称的模板通过 `matches`指定，是一个正则表达式。如果没有指定特定的值，默认值为`.*`。

名称的转换通过 `as` 指定。您可以使用在`matches`提到任何捕获组（capture group）。如果`matches`没有捕获组，`as`的默认值为`$0`。如果`matches`有 1 个捕获组，`as`的默认值为`$1`。如果`matches`有 2 个或更多的捕获组，您必须指定`as`的值。

例如：

```yaml
# match turn any name <name>_total to <name>_per_second
# e.g. http_requests_total becomes http_requests_per_second
name:
  matches: "^(.*)_total$"
  as: "${1}_per_second"
```

### 查询（Querying）

处理调用 custom metrics API 获取到的 metrics 的 value，该值最终提供给 HPA 进行扩缩容，通过 `metricsQuery`指定。

`metricsQuery`是一个 GO 模板，它会转化为一个 Prometheus 查询语句，使用 custom
metrics API 调用的某个特定 call。一个给定的 call 会被分解为 metric name、组资源和一个或多个组资源内的对象。这些参数会被转换成以下格式：

- `Series`: metric name，参数名称
- `LabelMatchers`: 以逗号分割的 objects，当前表示特定 group-resource 加上命名空间的 label(如果该 group-resource 是 namespaced 的)
- `GroupBy`: 以逗号分割的 label 的集合，当前表示 LabelMatchers 中的 group-resource label。当前`GroupBy`包含`LabelMatchers`内的所有组资源 label。

假设我们有一个 series，`http_requests_total` （以`http_requests_per_second` 在 API 中暴露），有`service`、`pod`、
`ingress`、`namespace`和`verb`这几个 label。前四个 label 有对应的 Kubernetes 资源。如果有人请求了`pod1`和`pod2`的参数`pods/http_request_per_second`，我们会有如下的代码：

- `Series: "http_requests_total"`
- `LabelMatchers: "pod=~\"pod1|pod2",namespace="somens"`
- `GroupBy`: `pod`

除了以上三个域之外，还有两个域

- `LabelValuesByName`：`LabelMatchers` 中 label 和 value 的映射。使用`|`预连接（Prometheus 使用的是`=~`）。

- `GroupBySlice`：`GroupBy`的一个子集。

大多数情况下，您只会用到 `Series`、`LabelMatchers`、和`GroupBy`，其他两个是高级选项。

这个查询语句应该为每个请求对象返回一个值。适配器会使用返回 series 的 labels 关联对应的对象。

例如：

```yaml
# convert cumulative cAdvisor metrics into rates calculated over 2 minutes
metricsQuery: "sum(rate(<<.Series>>{<<.LabelMatchers>>,container_name!="POD"}[2m])) by (<<.GroupBy>>)"
```
