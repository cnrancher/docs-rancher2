---
title: Flows 和 ClusterFlows
weight: 1
---

有关配置 `Flow` 和 `ClusterFlow` 的完整详细信息，请参阅 [Banzai Cloud Logging Operator 文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/output/)。

- [配置](#configuration)
- [YAML 示例](#yaml-example)

## 配置

- [Flows](#flows)
   - [Matches](#matches)
   - [Filters](#filters)
   - [Outputs](#outputs)
- [ClusterFlows](#clusterflows)

## Flows

`Flow` 定义要收集和过滤哪些日志，以及将日志发送到哪个 Output。

`Flow` 是一个命名空间资源。换言之，只有部署了该 Flow 的命名空间日志才能被 `Flow` 收集。

你可以通过在 Rancher UI 中填写表单来配置 `Flow`。

有关 `Flow` 自定义资源的更多详细信息，请参阅 [FlowSpec](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/crds/v1beta1/flow_types/)。

### Matches

匹配语句用于选择从哪些容器中拉取日志。

你可以指定 match 语句，然后根据 Kubernetes 标签、容器和主机名来选择或排除日志。匹配语句会按照定义和处理的顺序进行评估，直到应用了第一个匹配的选择/排除规则。

你可以通过填写 Rancher UI 中的 `Flow` 或 `ClusterFlow` 表单来配置匹配。

使用 match 语句的详细示例，请参阅[日志路由的官方文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/log-routing/)。

### Filters

你可以在 `Flow` 中定义一个或多个过滤器。过滤器可以对日志执行各种操作，例如，添加其他数据、转换日志或解析记录中的值。`Flow` 中的过滤器会按定义的顺序应用。

有关 Banzai Cloud Logging Operator 支持的过滤器列表，请参阅[此页面](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/plugins/filters/)。

过滤器需要在 YAML 中配置。

### Outputs

此 `Output` 会接收来自 `Flow` 的日志。由于 `Flow` 是一个命名空间资源，因此 `Output` 必须与 `Flow` 位于相同的命名空间中。

在 Rancher UI 中填写 `Flow` 或 `ClusterFlow` 表单时，你可以引用`Output`。

## ClusterFlows

为 `ClusterFlow` 配置匹配、过滤器和 `Output` 的方式与 `Flow` 的配置方式相同。主要区别在于 `ClusterFlow` 是集群级别范围的，并且可以跨所有命名空间配置日志收集。

你可以通过在 Rancher UI 中填写表单来配置 `ClusterFlow`。

`ClusterFlow` 选择集群中所有命名空间的日志后，集群的日志会被收集并记录到所选的 `ClusterOutput`。

## YAML 示例

以下示例 `Flow` 转换了默认命名空间的日志消息，并将日志发送到 S3 `Output`：

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
kind: Flow
metadata:
  name: flow-sample
  namespace: default
spec:
  filters:
    - parser:
        remove_key_name_field: true
        parse:
          type: nginx
    - tag_normaliser:
        format: ${namespace_name}.${pod_name}.${container_name}
  localOutputRefs:
    - s3-output
  match:
    - select:
        labels:
          app: nginx
```
