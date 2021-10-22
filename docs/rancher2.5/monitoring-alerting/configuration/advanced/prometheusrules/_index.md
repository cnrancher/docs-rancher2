---
title: PrometheusRules 配置
---

一个 PrometheusRule 定义了一组 Prometheus 告警或记录规则。

> 本节假设你熟悉监控组件如何协同工作。要了解更多信息，请参阅[本节](/docs/rancher2.5/monitoring-alerting/how-monitoring-works/_index)

### 在 Rancher UI 中创建 PrometheusRules

_从 v2.5.4 版起可用_

> **前提条件：**需要安装监控应用程序。

要在 Rancher UI 中创建规则组：

1. 点击**集群资源管理器>监控**，并点击**Prometheus 规则**。
1. 单击 **创建。**
1. 输入一个**组名称**。
1. 配置规则。在 Rancher UI 中，我们希望一个规则组包含告警规则或记录规则，但不能同时包含。关于填写表格的帮助，请参考下面的配置选项。
1. 点击**创建**。

**结果：**告警可以被配置为向接收器发送通知。

### 关于 PrometheusRule 自定义资源

当你定义一个规则（在 PrometheusRule 资源的 RuleGroup 中声明）时，[规则本身的规格](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#rule)包含标签，这些标签被 Alertmanager 用来计算哪个路由应该接收这个 Alert。例如，一个标签为 `team: front-end` 的告警将被发送到所有与该标签相匹配的路由。

Prometheus 规则文件被保存在 PrometheusRule 自定义资源中。一个 PrometheusRule 允许你定义一个或多个 RuleGroups。每个 RuleGroup 由一组 Rule 对象组成，每个对象可以代表一个告警或记录规则，有以下字段：

- 新告警或记录的名称
- 新告警或记录的 PromQL 表达式
- 应该附加到告警或记录的标签，以识别它（例如，集群名称或严重程度）。
- 注释，编码任何额外的重要信息，需要显示在告警的通知上（如摘要，描述，消息，运行手册的 URL，等等）。这个字段对于记录规则来说是不需要的。

关于可以指定哪些字段的更多信息，请查看[Prometheus Operator.](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#prometheusrulespec)

使用 Prometheus 对象中的标签选择器字段 `ruleSelector` 来定义你想装入 Prometheus 中的规则文件。

关于例子，请参考 Prometheus 文档中的[记录规则](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)和[告警规则。](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)

## 配置

### Rancher v2.5.4

Rancher v2.5.4 引入了通过在 Rancher UI 上填写表格来配置 PrometheusRules 的功能。

#### 规则组

| 字段             | 描述                                     |
| ---------------- | ---------------------------------------- |
| 组名称           | 组的名称。在一个规则文件中必须是唯一的。 |
| 覆盖组的时间间隔 | 该组中的规则被评估的时间，以秒为单位。   |

#### 告警规则

[告警规则](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)允许你根据 PromQL(Prometheus Query Language)表达式来定义告警条件，并向外部服务发送关于发射告警的通知。

| 字段             | 描述                                                                                                                                                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 告警名称         | 告警的名称。必须是一个有效的标签值。                                                                                                                                                                                                                                                   |
| 等待 Fire 的时间 | 持续时间，单位是秒。告警一旦被返回到这个时间段就被认为是 Fire 了。还没有 Fire 足够长的时间的告警被认为是待定的。                                                                                                                                                                       |
| PromQL 表达式    | 要评估的 PromQL 表达式。Prometheus 将在每个评估周期评估这个 PromQL 表达式的当前值，所有产生的时间序列将成为 pending/firing 告警。欲了解更多信息，请参考 [Prometheus 文档](https://prometheus.io/docs/prometheus/latest/querying/basics/)或我们的 [PromQL 表达式示例。](/docs/rancher2.5/monitoring-alerting/expression/_index) | 标签 |
| 标签             | 为每个告警添加或重写的标签。                                                                                                                                                                                                                                                           |
| 严重性           | 启用后，标签将被附加到告警或记录上，通过严重性等级来识别它。                                                                                                                                                                                                                           |
| 严重程度标签值   | Critical, warning, 或 none                                                                                                                                                                                                                                                             |
| 注释             | 注释是一组信息标签，可用于存储更长的附加信息，例如警报描述或运行手册链接。一个 [runbook](https://en.wikipedia.org/wiki/Runbook) 是一组关于如何处理告警的文档。注释值可以是[模板化的。](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/#templating)          | 。   |

### 记录规则

[记录规则](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/#recording-rules)允许你预先计算经常需要的或计算成本高的 PromQL（Prometheus 查询语言）表达式，并将其结果保存为一组新的时间序列。

| 字段          | 描述                                                                                                                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 时间序列名称  | 要输出的时间序列的名称。必须是一个有效的 metric 名称。                                                                                                                                                                                                                                                  |
| PromQL 表达式 | 要评估的 PromQL 表达式。Prometheus 将在每个评估周期评估这个 PromQL 表达式的当前值，结果将被记录为一组新的时间序列，其指标名称由 'record' 给出。 关于表达式的更多信息，请参考[Prometheus 文档](https://prometheus.io/docs/prometheus/latest/querying/basics/)或我们的 [PromQL 表达式示例。](/docs/rancher2.5/monitoring-alerting/expression/_index) | 标签 |
| 标签          | 在存储结果之前要添加或覆盖的标签。                                                                                                                                                                                                                                                                      |

### Rancher v2.5.0-v2.5.3

对于 Rancher v2.5.0-v2.5.3，PrometheusRules 必须用 YAML 配置。关于例子，请参考 Prometheus 文档中的[记录规则](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)和[告警规则。](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)
