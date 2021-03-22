---
title: PrometheusRules
---

## 概述

PrometheusRule 定义了一组 Prometheus 告警和记录规则。

## 关于 PrometheusRule 自定义资源

Prometheus 规则文件保存在 PrometheusRule 自定义资源中。

一个 PrometheusRule 允许您定义一个或多个 RuleGroups。每个 RuleGroup 由一组 Rule 对象组成，每个 Rule 对象可以代表具有以下字段的告警或记录规则。

- 新告警或记录的名称。
- 新告警或记录的 PromQL（Prometheus 查询语言）表达式。
- 应附在告警或记录上的标签，以识别它（如群组名称或严重性）。
- 注释，对需要在告警通知上显示的任何其他重要信息进行编码（如摘要、描述、信息、运行簿 URL 等）。记录规则不需要此字段。

告警规则基于 PromQL 查询定义告警条件。记录规则以定义的时间间隔预先计算经常需要或计算成本高的查询。

有关可以指定哪些字段的更多信息，请查看[Prometheus Operator 规范](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#prometheusrulespec)

使用 Prometheus 对象中的标签选择器字段 "ruleSelector "来定义您要挂载到 Prometheus 中的规则文件。

有关示例，请参阅 Prometheus 文档中的 [记录规则](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/) 和 [告警规则](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)。

## 连接路由和 PrometheusRules

当您定义一个规则（在 PrometheusRule 资源中的 RuleGroup 中声明）时，[规则本身的规格](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#rule)包含 Prometheus 用于确定哪些路由应收到此 Alert 的标签。例如，带有 `team: front-end` 标签的 Alert 将被发送到所有符合该标签的路由。

## 在 Rancher 用户界面中创建 PrometheusRules

_从 v2.5.4 开始提供_

前提条件：需要安装监控应用程序。

1. 单击**Cluster Explorer > Monitoring**，然后单击**Prometheus Rules**。
1. 单击**Create**。
1. 输入**组名称**。
1. 配置规则。在 Rancher 的用户界面中，我们希望一个规则组包含告警规则或记录规则，但不能同时包含。有关填写表格的帮助，请参阅下面的配置选项。
1. 单击**Create**。
1. 单击**创建**。

**结果**：告警可以配置为向接收器发送通知。

## 配置

### v2.5.4

Rancher v2.5.4 引入了通过在 Rancher UI 中填写表格来配置 PrometheusRules 的功能。

#### 规则组

| 参数                    | 描述                                           |
| :---------------------- | :--------------------------------------------- |
| Group Name              | 组名称，在一个规则文件中必须是唯一的。         |
| Override Group Interval | 持续时间，以秒为单位，用于评估组内规则的频率。 |

#### 告警规则

[告警规则](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)允许您根据 PromQL(Prometheus 表达式)表达式定义告警条件，并向外部服务发送发射告警的通知。

| 参数                 | 描述                                                                                                                                                                                                                                                                                                                                  |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Alert Name           | 告警的名称。必须是一个有效的标签值。                                                                                                                                                                                                                                                                                                  |
| Wait To Fire For     | 持续时间，以秒为单位。告警一旦被退回这么久后，即视为发送。久未发射的告警视为待发送。                                                                                                                                                                                                                                                  |
| PromQL Expression    | 要评估的 PromQL 表达式。Prometheus 将在每个评估周期评估该 PromQL 表达式的当前值，所有由此产生的时间序列将成为待定/已发送告警。有关更多信息，请参阅[Prometheus 文档](https://prometheus.io/docs/prometheus/latest/querying/basics/)或我们的[PromQL 表达式示例](/docs/rancher2.5/monitoring-alerting/configuration/expression/_index)。 |
| Labels               | 要为每个告警添加或覆盖的标签。                                                                                                                                                                                                                                                                                                        |
| Severity             | 启用时，会将标签附加到告警或记录上，以按严重性级别识别它。                                                                                                                                                                                                                                                                            |
| Severity Label Value | 危急、警告或无                                                                                                                                                                                                                                                                                                                        |
| Annotations          | 注释是一组信息标签，可用于存储较长的附加信息，如警报描述或运行手册链接[runbook](https://en.wikipedia.org/wiki/Runbook)是一组关于如何处理警报的文档。注释值可以是[模板化的](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/#templating)。                                                                   |

#### 记录规则

[记录规则](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/#recording-rules)允许你预先计算经常需要的或计算成本很高的 PromQL(Prometheus 表达式语言)表达式，并将其结果保存为一组新的时间序列。

| 参数              | 描述                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Time Series Name  | 要输出的时间序列的名称。必须是一个有效的参数名称。                                                                                                                                                                                                                                                                                    |
| PromQL Expression | 要评估的 PromQL 表达式。Prometheus 将在每个评估周期评估该 PromQL 表达式的当前值，所有由此产生的时间序列将成为待定/已发送告警。有关更多信息，请参阅[Prometheus 文档](https://prometheus.io/docs/prometheus/latest/querying/basics/)或我们的[PromQL 表达式示例](/docs/rancher2.5/monitoring-alerting/configuration/expression/_index)。 |
| Labels            | 要为每个告警添加或覆盖的标签。                                                                                                                                                                                                                                                                                                        |

### v2.5.0-v2.5.3

如果您使用的 Rancher 版本是 v2.5.0、v2.5.1、v2.5.2 或 v2.5.3，则需要在 YAML 文件中配置 PrometheusRules。请参考 Prometheus 官方文档获取配置记录规则和告警规则的示例：

- [Prometheus 官方文档-记录规则](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)
- [Prometheus 官方文档-告警规则](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)
