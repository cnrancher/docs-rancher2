---
title: 路由配置
shortTitle: 路由
weight: 5
---

路由（Route）配置是 Alertmanager 自定义资源的一部分，用于控制 Prometheus 触发的告警在到达接收器之前的分组和过滤方式。

当路由更改时，Prometheus Operator 会重新生成 Alertmanager 自定义资源以反映更改。

有关配置路由的更多信息，请参阅[官方 Alertmanager 文档](https://www.prometheus.io/docs/alerting/latest/configuration/#route)。

> 本节参考假设你已经熟悉 Monitoring 组件的协同工作方式。有关详细信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/how-monitoring-works)。

- [路由限制](#route-restrictions)
- [路由配置](#route-configuration)
   - [接收器](#receiver)
   - [分组](#grouping)
   - [匹配](#matching)

## 路由限制

Alertmanager 根据接收器和路由树来代理 Prometheus 的告警，该路由树根据标签将告警过滤到指定接收器。

Alerting Drivers 为 Alertmanager 将告警代理到非原生接收器，例如 Microsoft Teams 和 SMS。

在配置路由和接收器的 Rancher UI 中，你可以配置有一个根的路由树，然后再配置一个深度，这样的树就有两个深度。但是如果在直接配置 Alertmanager 时使用 `continue` 路由，你可以让树更深。

每个接收器用于一个或多个通知提供商。因此，如果你需要将发送到 Slack 的每个告警也发送到 PagerDuty，你可以在同一个接收器中配置两者。

## 路由配置

### 标签和注释的注意事项

标签用于识别可能影响通知路由的信息。告警的标识信息可能包括容器名称，或应接收通知的团队的名称。

注释用于标识不影响告警接收者的信息，例如 Runbook URL 或错误消息。


### 接收器
路由需要引用一个已经配置好的[接收器](#receiver-configuration)。

### 分组

| 字段 | 默认 | 描述 |
|-------|--------------|---------|
| 分组依据 | N/A | 将传入告警进行分组的标签。例如，`[ group_by: '[' <labelname>, ... ']' ]`。针对 `cluster=A` 和 `alertname=LatencyHigh` 等标签的多个告警可以批处理到一个组中。要按所有可能的标签进行聚合，请使用特殊值 `'...'` 作为唯一标签名称，如 `group_by: ['...']`。以 `...` 进行分组能有效地完全禁用聚合，并按原样传递所有告警。除非你的告警量非常低或者你的上游通知系统能执行分组，否则你不太需要这样做。 |
| 组等待时长 | 30s | 在发送之前，缓冲同一组告警的等待时间。 |
| 组间隔 | 5m | 等待多长时间才发送已添加到告警组的告警，其中该告警组的初次通知已被发送。 |
| 重复间隔 | 4h | 等待多长时间后，才重新发送已发送的告警。 |

### 匹配

**Match** 字段指一组相等匹配器，用于根据告警上定义的标签来识别要发送到指定路由的告警。在 Rancher UI 中添加键值对时，它们对应于以下格式的 YAML：

```yaml
match:
  [ <labelname>: <labelvalue>, ... ]
```

**Match Regex** 字段指一组正则表达式匹配器，用于根据在该告警上定义的标签来识别要发送到指定路由的告警。在 Rancher UI 中添加键值对时，它们对应于以下格式的 YAML：

```yaml
match_re:
  [ <labelname>: <regex>, ... ]
```
