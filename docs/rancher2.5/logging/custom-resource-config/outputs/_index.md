---
title: Outputs 和 ClusterOutputs
description: 关于配置`Outputs`和`ClusterOutputs`的全部细节，请参阅[Banzai Cloud 官方文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/output/)。
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
  - rancher 2.5
  - 日志服务
  - Rancher v2.5 的日志功能
  - 配置自定义资源
  - Outputs 和 ClusterOutputs
---

## 概述

关于配置`Outputs`和`ClusterOutputs`的全部细节，请参阅[Banzai Cloud 官方文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/output/)。

## v2.5.8 的变化

现在可以通过在 Rancher 用户界面上填写表格来配置`Outputs`和`ClusterOutputs`。

### Outputs

`Output`资源定义了你的`Flows`可以发送日志信息的地方。`Outputs`是一个日志`Flow`的最后阶段。

`Output`是一个命名空间的资源，这意味着只有同一命名空间内的`Flow`可以访问它。

你可以在这些定义中使用秘密，但它们也必须在同一命名空间中。

关于`Output`自定义资源的细节，见[OutputSpec](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/crds/v1beta1/output_types/).

Rancher 用户界面提供了配置以下`Output`类型的表格。

- Amazon ElasticSearch
- Azure Storage
- Cloudwatch
- Datadog
- Elasticsearch
- File
- Fluentd
- GCS
- Kafka
- Kinesis Stream
- LogDNA
- LogZ
- Loki
- New Relic
- Splunk
- SumoLogic
- Syslog

Rancher 用户界面提供了配置`Output`类型、目标和访问凭证（如果适用）的表格。

关于 logging operator 支持的每个日志插件的配置实例，请参见[logging operator 文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/plugins/outputs/)。

### ClusterOutputs

`ClusterOutput`定义了一个没有命名空间限制的`Output`。它只有在部署在与日志操作者相同的命名空间时才有效。

关于`ClusterOutput`自定义资源的细节，见[ClusterOutput 文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/crds/v1beta1/clusteroutput_types/)

## Rancher v2.5.8 之前

### Outputs

`Output`资源定义了你的 "流程 "可以发送日志信息的地方。`Outputs`是一个日志`流程`的最后阶段。

`Output`是一个命名空间的资源，这意味着只有同一命名空间内的`Flow`可以访问它。

你可以在这些定义中使用密钥，但它们也必须在同一个命名空间中。

`Outputs`是用 YAML 配置的。关于`Output`自定义资源的细节，见[OutputSpec](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/crds/v1beta1/output_types/).

关于 logging operator 支持的每个日志插件的配置例子，见[logging operator 文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/plugins/outputs/)。

### ClusterOutputs

`ClusterOutput`定义了一个没有命名空间限制的`Output`。它只有在部署在与记录操作员相同的命名空间时才有效。

Rancher 用户界面提供了配置`ClusterOutput`类型、目标和访问证书（如果适用）的表格。

`ClusterOutputs`是用 YAML 配置的。关于`ClusterOutput`自定义资源的细节，见[ClusterOutput 文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/crds/v1beta1/clusteroutput_types/)。

关于日志操作员支持的每个日志插件的配置实例，请参见[日志操作员文档。](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/plugins/outputs/)

## YAML 示例

安装了日志后，你可以使用这些例子来帮助制作你自己的日志 pipelines。

- [Cluster Output to ElasticSearch](#cluster-output-to-elasticsearch)
- [Output to Splunk](#output-to-splunk)
- [Output to Syslog](#output-to-syslog)
- [Unsupported Outputs](#unsupported-outputs)

### ElasticSearch

假设你想把你的集群中的所有日志发送到`elasticsearch`集群。首先，我们创建一个集群`Output`：

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterOutput
metadata:
  name: "example-es"
  namespace: "cattle-logging-system"
spec:
  elasticsearch:
    host: elasticsearch.example.com
    port: 9200
    scheme: http
```

我们已经创建了这个`ClusterOutput`，没有 elasticsearch 配置，和我们的操作者在同一个命名空间：`cattle-logging-system`。任何时候我们创建一个`ClusterFlow`或`ClusterOutput`，我们都必须把它放在`cattle-logging-system`命名空间中。

现在我们已经配置了我们想要的日志的位置，让我们配置所有的日志到那个`ClusterOutput`。

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterFlow
metadata:
  name: "all-logs"
  namespace: "cattle-logging-system"
spec:
  globalOutputRefs:
    - "example-es"
```

现在我们应该看到我们配置的索引，里面有日志。

### Splunk

如果我们有一个应用团队只想把特定命名空间的日志发送到`splunk`服务器上，该怎么办？对于这种情况，我们可以使用命名空间的`Outputs`和`Flows`。

在我们开始之前，让我们设置该团队的应用程序：`coolapp`。

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: devteam
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: coolapp
  namespace: devteam
  labels:
    app: coolapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: coolapp
  template:
    metadata:
      labels:
        app: coolapp
    spec:
      containers:
        - name: generator
          image: paynejacob/loggenerator:latest
```

随着`coolapp`的运行，我们将遵循与创建`ClusterOutput`时类似的路径。然而，与`ClusterOutputs`不同的是，我们在应用程序的命名空间中创建我们的`Output`。

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
kind: Output
metadata:
  name: "devteam-splunk"
  namespace: "devteam"
spec:
  splunkHec:
    hec_host: splunk.example.com
    hec_port: 8088
    protocol: http
```

再一次，让我们给我们的`output`提供一些日志。

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
kind: Flow
metadata:
  name: "devteam-logs"
  namespace: "devteam"
spec:
  localOutputRefs:
    - "devteam-splunk"
```

### Syslog

假设你想把你的集群中的所有日志发送到一个`syslog`服务器。首先，我们创建一个`ClusterOutput`：

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterOutput
metadata:
  name: "example-syslog"
  namespace: "cattle-logging-system"
spec:
  syslog:
    buffer:
      timekey: 30s
      timekey_use_utc: true
      timekey_wait: 10s
      flush_interval: 5s
    format:
      type: json
      app_name_field: test
    host: syslog.example.com
    insecure: true
    port: 514
    transport: tcp
```

现在我们已经配置好日志的去向，让我们把所有的日志都配置到`output`。

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterFlow
metadata:
  name: "all-logs"
  namespace: cattle-logging-system
spec:
  globalOutputRefs:
    - "example-syslog"
```

### 其他不支持的输出类型

在最后一个例子中，我们创建了一个`output`，将日志写到一个不支持的目的地。

**关于 syslog 的说明**从 Rancher v2.5.4 开始，`syslog`是一个被支持的`output`。然而，这个例子仍然提供了一个关于使用不支持的插件的概述。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: syslog-config
  namespace: cattle-logging-system
type: Opaque
stringData:
  fluent-bit.conf: |
    [INPUT]
        Name              forward
        Port              24224
    [OUTPUT]
        Name              syslog
        InstanceName      syslog-output
        Match             *
        Addr              syslog.example.com
        Port              514
        Cluster           ranchers
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fluentbit-syslog-forwarder
  namespace: cattle-logging-system
  labels:
    output: syslog
spec:
  selector:
    matchLabels:
      output: syslog
  template:
    metadata:
      labels:
        output: syslog
    spec:
      containers:
        - name: fluentbit
          image: paynejacob/fluent-bit-out-syslog:latest
          ports:
            - containerPort: 24224
          volumeMounts:
            - mountPath: "/fluent-bit/etc/"
              name: configuration
      volumes:
        - name: configuration
          secret:
            secretName: syslog-config
---
apiVersion: v1
kind: Service
metadata:
  name: syslog-forwarder
  namespace: cattle-logging-system
spec:
  selector:
    output: syslog
  ports:
    - protocol: TCP
      port: 24224
      targetPort: 24224
---
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterFlow
metadata:
  name: all-logs
  namespace: cattle-logging-system
spec:
  globalOutputRefs:
    - syslog
---
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterOutput
metadata:
  name: syslog
  namespace: cattle-logging-system
spec:
  forward:
    servers:
      - host: "syslog-forwarder.cattle-logging-system"
    require_ack_response: false
    ignore_network_errors_at_startup: false
```

让我们来分析一下这里发生了什么。首先，我们创建一个容器的部署，它有额外的`syslog`插件，接受从另一个`fluentd`转发的日志。接下来我们创建一个`Output`，配置为我们部署的转发器。部署的`fluentd`将转发所有的日志到配置的`syslog`目的地。
