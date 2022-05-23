---
title: 配置 PrometheusRule
weight: 3
---

PrometheusRule 定义了一组 Prometheus 告警和/或记录规则。

> 本节参考假设你已经熟悉 Monitoring 组件的协同工作方式。有关详细信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/how-monitoring-works)。


### 在 Rancher UI 中创建 PrometheusRule

> **先决条件**：已安装 Monitoring 应用。

要在 Rancher UI 中创建规则组：

1. 转到要创建规则组的集群。单击**监控**，然后单击 **Prometheus 规则**。
1. 单击**创建**。
1. 输入**组名称**。
1. 配置规则。在 Rancher 的 UI 中，规则组需要包含告警规则或记录规则，但不能同时包含两者。如需获取填写表单的帮助，请参阅下方的配置选项。
1. 单击**创建**。

**结果**：告警可以向接收器发送通知。

### 关于 PrometheusRule 自定义资源

当你定义规则时（在 PrometheusRule 资源的 RuleGroup 中声明），[规则本身的规范](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#rule)会包含标签，然后 Alertmanager 会使用这些标签来确定接收此告警的路由。例如，标签为 `team: front-end` 的告警将​​发送到与该标签匹配的所有路由。

Prometheus 规则文件保存在 PrometheusRule 自定义资源中。PrometheusRule 支持定义一个或多个 RuleGroup。每个 RuleGroup 由一组 Rule 对象组成，每个 Rule 对象均能表示告警或记录规则，并具有以下字段：

- 新告警或记录的名称
- 新告警或记录的 PromQL 表达式
- 用于标记告警或记录的标签（例如集群名称或严重性）
- 对需要在告警通知上显示的其他重要信息进行编码的注释（例如摘要、描述、消息、Runbook URL 等）。记录规则不需要此字段。

有关可以指定的字段的更多信息，请查看 [Prometheus Operator 规范。](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#prometheusrulespec)

你可以使用 Prometheus 对象中的标签选择器字段 `ruleSelector` 来定义要挂载到 Prometheus 的规则文件。

如需查看示例，请参阅 Prometheus 文档中的[记录规则](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)和[告警规则](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)。

## 配置

### 规则组

| 字段 | 描述 |
|-------|----------------|
| 组名称 | 组的名称。在规则文件中必须是唯一的。 |
| 覆盖组间隔 | 组中规则的评估时间间隔（单位：秒）。 |


### 告警规则

[告警规则](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)可以让你根据 PromQL（Prometheus 查询语言）表达式来定义告警条件，并将触发告警的通知发送到外部服务。

| 字段 | 描述 |
|-------|----------------|
| 告警名称 | 告警的名称。必须是有效的标签值。 |
| 告警触发等待时间 | 时长，以秒为单位。当告警触发时间到达该指定时长时，则视为触发。当告警未触发足够长的时间，则视为待处理。 |
| PromQL 表达式 | 要评估的 PromQL 表达式。Prometheus 将在每个评估周期评估此 PromQL 表达式的当前值，并且所有生成的时间序列都将成为待处理/触发告警。有关详细信息，请参阅 [Prometheus 文档](https://prometheus.io/docs/prometheus/latest/querying/basics/)或我们的 [PromQL 表达式示例](../../../expression)。 |
| 标签 | 为每个告警添加或覆盖的标签。 |
| 严重程度 | 启用后，标签​​会附加到告警或记录中，这些标签通过严重程度来标识告警/记录。 |
| 严重标签值 | Critical，warning 或 none |
| 注释 | 注释是一组信息标签，可用于存储更长的附加信息，例如告警描述或 Runbook 链接。[Runbook](https://en.wikipedia.org/wiki/Runbook) 是一组有关如何处理告警的文档。注释值可以是[模板化](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/#templating)的。 |

### 记录规则

[记录规则](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/#recording-rules)允许你预先计算常用或计算量大的 PromQL（Prometheus 查询语言）表达式，并将其结果保存为一组新的时间序列。

| 字段 | 描述 |
|-------|----------------|
| 时间序列名称 | 要输出的时间序列的名称。必须是有效的指标名称。 |
| PromQL 表达式 | 要评估的 PromQL 表达式。Prometheus 将在每个评估周期评估此 PromQL 表达式的当前值，并且将结果记录为一组新的时间序列，其指标名称由“记录”指定。有关表达式的更多信息，请参阅 [Prometheus 文档](https://prometheus.io/docs/prometheus/latest/querying/basics/)或我们的 [PromQL 表达式示例](../expression)。 |
| 标签 | 在存储结果之前要添加或覆盖的标签。 |
