---
title: Flow 和 ClusterFlow
description: 现在可以通过在 Rancher 用户界面上填写表格来配置`Flows`和 `ClusterFlows` 。
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
  - Flow 和 ClusterFlow
---

## 配置

### v2.5.8+

#### v2.5.8 的变化

现在可以通过在 Rancher 用户界面上填写表格来配置`Flows`和 `ClusterFlows` 。

#### Flows

`Flow`定义了要收集和过滤哪些日志，以及将日志发送到哪个输出。

`Flow`是一个命名空间的资源，这意味着日志将只从`Flow`部署的命名空间中收集。

关于`Flow`自定义资源的更多细节，请参阅[FlowSpec](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/crds/v1beta1/flow_types/)。

#### Matches

匹配语句是用来选择哪些容器来提取日志的。

你可以根据 Kubernetes 标签、容器和主机名称指定匹配语句来选择或排除日志。匹配语句按照它们被定义的顺序进行评估，只处理到第一个匹配的选择或排除规则适用为止。

匹配语句可以通过填写 Rancher UI 中的`Flow`或`ClusterFlow`表格进行配置。

关于使用匹配语句的详细例子，请参阅[关于日志路由的官方文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/log-routing/)。

#### Filters

你可以在一个`Flow`中定义一个或多个过滤器。过滤器可以对日志进行各种操作，例如，添加额外的数据，转换日志，或解析记录中的值。流程中的过滤器是按照定义的顺序应用的。

关于 Banzai Cloud Logging 操作者支持的过滤器列表，见[本页](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/plugins/filters/)。

过滤器需要在 YAML 中进行配置。

#### Outputs

`Output`将从`Flow`中接收日志。因为`Flow`是一个命名空间的资源，`Output` 必须与`Flow`驻留在同一个命名空间。

`Outputs`可以在 Rancher UI 中填写`Flow`或`ClusterFlow`表格时被引用。

#### ClusterFlows

Matches、Filters 和 Outputs 是为`ClusterFlow`配置的，与为`流量`配置的方式相同。关键的区别是，`ClusterFlow`是在集群级别的范围内，可以配置所有命名空间的日志收集。

在`ClusterFlow`选择集群中所有命名空间的日志后，集群的日志将被收集并记录到选定的`ClusterOutput`。

### Rancher v2.5.8 之前

#### Flows

`Flow`定义了要收集和过滤的日志，以及要将日志发送到哪个`Output`。`Flow`是一个命名空间的资源，这意味着日志将只从`Flow`部署的命名空间中被收集。

`Flow`需要在 YAML 中定义。

关于`Flow`自定义资源的更多细节，见[FlowSpec](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/crds/v1beta1/flow_types/)。

#### Matches

匹配语句是用来选择哪些容器来提取日志的。

你可以根据 Kubernetes 标签、容器和主机名称指定匹配语句来选择或排除日志。匹配语句按照它们被定义的顺序进行评估，只处理到第一个匹配的选择或排除规则适用为止。

关于使用匹配语句的详细例子，请参阅[关于日志路由的官方文档](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/log-routing/)。

#### Filters

你可以在一个`Flow`中定义一个或多个过滤器。过滤器可以对日志进行各种操作，例如，添加额外的数据，转换日志，或解析记录中的值。流程中的过滤器是按照定义的顺序应用的。

关于 Banzai Cloud Logging 操作者支持的过滤器列表，见[本页](https://banzaicloud.com/docs/one-eye/logging-operator/configuration/plugins/filters/)。

过滤器需要在 YAML 中进行配置。

#### Outputs

`Output`将从`Flow`中接收日志。因为`Flow`是一个命名空间的资源，`Output` 必须与`Flow`驻留在同一个命名空间。

#### ClusterFlows

Matches、Filters 和 Outputs 是为`ClusterFlow`配置的，与为`流量`配置的方式相同。关键的区别是，`ClusterFlow`是在集群级别的范围内，可以配置所有命名空间的日志收集。

在`ClusterFlow`选择集群中所有命名空间的日志后，集群的日志将被收集并记录到选定的`ClusterOutput`。

`ClusterFlows`需要在 YAML 中定义。

## YAML 示例

下面的例子`Flow`转换了默认命名空间的日志信息，并将其发送到 S3 的`Output`。

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
