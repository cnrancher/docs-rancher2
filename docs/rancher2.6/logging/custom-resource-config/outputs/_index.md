---
title: Outputs 和 ClusterOutputs
weight: 2
---

有关配置 `Output` 和 `ClusterOutput` 的完整详细信息，请参阅 [Banzai Cloud Logging Operator 文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/output/)。

- [配置](#configuration)
- [YAML 示例](#yaml-examples)
   - [ClusterOutput 设为 ElasticSearch](#cluster-output-to-elasticsearch)
   - [Output 设为 Splunk](#output-to-splunk)
   - [Output 设为 Syslog](#output-to-syslog)
   - [不支持的 Output](#unsupported-outputs)

## 配置

- [Outputs](#outputs)
- [ClusterOutputs](#clusteroutputs)

## Outputs

`Output` 资源定义了你的 `Flow` 可以发送日志消息的位置。`Output` 是 Logging `Flow` 的最后阶段。

`Output` 是命名空间资源，换言之，只有同一命名空间内的 `Flow` 可以访问它。

你可以在这些定义中使用密文，但这些密文也必须位于同一命名空间中。

你可以通过在 Rancher UI 中填写表单来配置 `Output`。

有关 `Output` 自定义资源的更多详细信息，请参阅 [OutputSpec](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/crds/v1beta1/output_types/)。

Rancher UI 提供了用于配置以下类型 `Output` 的表单：

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

Rancher UI 提供了用于配置 `Output` 类型、目标和访问凭证（如果适用）的表单。

有关 Logging Operator 支持的日志插件配置示例，请参阅 [Logging Operator 文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/plugins/outputs/)。

## ClusterOutputs

`ClusterOutput` 定义了一个没有命名空间限制的 `Output`。只有在与 Logging Operator 部署在同一命名空间中时，它才能生效。

你可以通过在 Rancher UI 中填写表单来配置 `ClusterOutput`。

有关 `ClusterOutput` 自定义资源的更多详细信息，请参阅 [ClusterOutput](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/crds/v1beta1/clusteroutput_types/)。

## YAML 示例

安装 Logging 后，你可以参考以下示例来构建你自己的 Logging 管道：

- [ClusterOutput 设为 ElasticSearch](#cluster-output-to-elasticsearch)
- [Output 设为 Splunk](#output-to-splunk)
- [Output 设为 Syslog](#output-to-syslog)
- [不支持的 Output](#unsupported-outputs)

### ClusterOutput 设为 ElasticSearch

假设你想将集群中的所有日志发送到 `elasticsearch` 集群。首先，创建一个集群 `Output`：

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

在与 Operator 相同的命名空间（`cattle-logging-system`）中，我们创建了这个 `ClusterOutput`（没有 elasticsearch 配置）。每次创建 `ClusterFlow` 或 `ClusterOutput` 时，我们都必须将其放在 `cattle-logging-system` 命名空间中。

配置日志的目的位置后，我们可以尝试将所有日志都配置到该 `ClusterOutput`：

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

现在，我们应该能看到配置的包含日志的索引。


### Output 设为 Splunk

有时候，你的应用程序团队可能只想将某个命名空间的日志发送到 `splunk` 服务器。对于这种情况，你可以使用命名空间范围的 `Output` 和 `Flow`。

在开始之前，先设置该团队的应用程序 `coolapp`。

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

`coolapp` 运行时，我们将使用与创建 `ClusterOutput` 时类似的路径。但是，我们不使用 `ClusterOutput`，而是在应用程序的命名空间中创建 `Output`。

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

然后，再次为 `Output` 提供一些日志：

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


### Output 设为 Syslog

假设你想将集群中的所有日志发送到 `syslog` 服务器。首先，我们创建一个 `ClusterOutput`：

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

配置日志的目的位置后，我们可以尝试将所有日志都配置到该 `Output`：

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

### 不支持的 Output

对于最后一个示例，我们创建一个 `Output` 来将日志写入到不是开箱即用的目标位置：

> **Syslog 注意事项**：`syslog` 是受支持的 `Output`。但是，此示例仍提供了不受支持的插件概述。

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

现在，我们分解这里的内容。首先，我们创建一个容器 Deployment，该容器具有额外的 `syslog` 插件并支持转发自另一个 `fluentd` 的日志。接下来，我们创建一个配置为 Deployment 转发器的 `Output`。然后，Deployment `fluentd` 会将所有日志转发到配置的 `syslog` 目标。
