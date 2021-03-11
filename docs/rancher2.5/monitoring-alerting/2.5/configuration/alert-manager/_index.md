---
title: Alertmanager
---

[Alertmanager Config](https://prometheus.io/docs/alerting/latest/configuration/#configuration-file) Secret 包含 Alertmanager 实例的配置，该实例根据从 Prometheus 收到的告警发送通知。

## 概述

默认情况下，Rancher Monitoring 将单个 Alertmanager 部署到使用默认 Alertmanager Config Secret 的集群上。作为 Chart 部署选项的一部分，您可以选择增加部署到集群上的 Alertmanager 的副本数量，这些副本都可以使用相同的底层 Alertmanager Config Secret 进行管理。

这个密钥应该随时更新或修改：

- 添加新的通知器或接收器。
- 更改应发送至特定通知者或接收者的告警。
- 更改发送的告警群组。

默认情况下，您可以选择提供一个现有的 Alertmanager Config Secret（即`cattle-monitoring-system`命名空间中的任何 Secret），或者允许 Rancher Monitoring 在您的集群上部署一个默认的 Alertmanager Config Secret。默认情况下，Rancher 创建的 Alertmanager Config Secret 将永远不会在升级/卸载`rancher-monitoring`Chart 时被修改/删除，以防止用户在 Chart 上执行操作时丢失或覆盖其告警配置。

关于这个密钥中可以指定哪些字段的更多信息，请看[Prometheus Alertmanager docs.](https://prometheus.io/docs/alerting/latest/alertmanager/)

Alertmanager 配置文件的完整规格以及它所包含的内容可以在[这里](https://prometheus.io/docs/alerting/latest/configuration/#configuration-file)找到。

更多信息，请参考[关于配置路由的 Prometheus 官方文档](https://www.prometheus.io/docs/alerting/latest/configuration/#route)

## 连接路由和 PrometheusRules

当您定义一个规则（在 PrometheusRule 资源中的 RuleGroup 中声明）时，[规则本身的规格](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#rule)包含 Prometheus 用于确定哪些路由应收到此 Alert 的标签。例如，带有标签 "team: front-end "的 Alert 将被发送到所有符合该标签的 Routes。

## 在 Rancher 用户界面中创建接收器

_从 v2.5.4 开始提供_

### 前提条件

- 需要安装监控应用程序。
- 如果您使用现有的 Alertmanager Secret 配置了监控，那么它的格式必须是 Rancher 的用户界面所支持的。否则，您只能直接基于修改 Alertmanager Secret 进行更改。注意：我们将继续对使用路由和接收器用户界面可以支持的 Alertmanager 配置种类进行增强，因此如果您有功能增强的请求，请 [提交问题](https://github.com/rancher/rancher/issues/new)。

### 操作步骤

1. 单击**集群资源管理器 > 监控**，然后单击**接收器**。
1. 为接收器输入一个名称。
1. 为接收器配置一个或多个提供者。有关填写表格的帮助，请参阅下面的配置选项。
1. 点击**创建**

**结果：**告警可以配置为向接收器发送通知。

## 接收器配置

通知集成是用`receiver`配置的，这在[Prometheus 文档](https://prometheus.io/docs/alerting/latest/configuration/#receiver)中有解释。

Rancher v2.5.4 引入了通过在 Rancher 用户界面中填写表格来配置接收机的功能。

### v2.5.4+

在 Rancher 用户界面中可以配置以下类型的接收器：

- Slack
- Email
- PagerDuty
- Opsgenie
- Webhook
- Custom

自定义接收器选项可以用来配置 YAML 中的任何接收器，这些接收器不能通过填写 Rancher UI 中的其他表格来配置。

#### Slack

| 参数                        | 类型   | 描述                                                                                                                                                             |
| --------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| URL                         | String | 输入你的 Slack webhook URL。有关创建 Slack webhook 的说明，请参阅[Slack 文档](https://get.slack.help/hc/en-us/articles/115005265063-Incoming-WebHooks-for-Slack) |
| Default Channel             | String | 输入要发送警报通知的通道名称，格式如下：`#<channelname>`。                                                                                                       |
| Proxy URL                   | String | Webhook 通知使用的代理。                                                                                                                                         |
| Enable Send Resolved Alerts | Bool   | 如果警报已解决，是否要发送后续通知（如已解决问题或未解决问题等通知）。                                                                                           |

#### Email

| 参数                        | 类型   | 描述                                                                 |
| --------------------------- | ------ | -------------------------------------------------------------------- |
| Default Recipient Address   | String | 接收通知的电子邮箱地址。                                             |
| Enable Send Resolved Alerts | Bool   | 如果警报已解决，是否要发送后续通知（如已解决问题或未解决问题等通知） |

**SMTP 选项**

| 参数     | 类型   | 描述                                                             |
| -------- | ------ | ---------------------------------------------------------------- |
| Sender   | String | 在您的 SMTP 邮件服务器上输入一个您想发送通知的电子邮件地址。     |
| Host     | String | 输入您的 SMTP 服务器的 IP 地址或主机名。例如：`smtp.email.com`。 |
| Use TLS  | Bool   | 是否使用 TLS 加密。                                              |
| Username | String | 用于验证 SMTP 服务器的用户名。                                   |
| Password | String | 用于验证 SMTP 服务器的密码。                                     |

#### PagerDuty

| 参数                        | 类型   | 描述                                                                                                                  |
| --------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| Integration Type            | String | 集成的类型，可选值为：`Events API v2` 或 `Prometheus`.                                                                |
| Default Integration Key     | String | 关于获取集成密钥的说明，请参见[PagerDuty 文档](https://www.pagerduty.com/docs/guides/prometheus-integration-guide/)。 |
| Proxy URL                   | String | PagerDuty 通知使用的代理。                                                                                            |
| Enable Send Resolved Alerts | Bool   | 如果警报已解决，是否要发送后续通知（如已解决问题或未解决问题等通知）                                                  |

#### Opsgenie

| 参数                        | 描述                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| API Key                     | 关于获取集成密钥的说明，请参见[Opsgenie documentation.](https://docs.opsgenie.com/docs/api-key-management)。 |
| Proxy URL                   | Opsgenie 通知使用的代理。                                                                                    |
| Enable Send Resolved Alerts | 如果警报已解决，是否要发送后续通知（如已解决问题或未解决问题等通知）                                         |

**Opsgenie Responders**：

| 参数    | 类型   | 描述                                                                                                                            |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Type    | String | 团队、用户或升级。有关警报响应器的更多信息，请参阅 [Opsgenie 文档](https://docs.opsgenie.com/docs/alert-recipients-and-teams)。 |
| Send To | String | Opsgenie 接收者的 ID、姓名或用户名。                                                                                            |

#### Webhook

| 参数                        | 描述                                                                 |
| --------------------------- | -------------------------------------------------------------------- |
| URL                         | 应用的 Webhook URL 地址                                              |
| Proxy URL                   | Webhook 通知使用的代理。                                             |
| Enable Send Resolved Alerts | 如果警报已解决，是否要发送后续通知（如已解决问题或未解决问题等通知） |

#### 自动预定义 YAML

这里提供的 YAML 将直接附加到你的接收器的配置密钥中。

### v2.5.0-2.5.3

Alertmanager 必须在 YAML 中配置，如这个[例子](#example-alertmanager-config)所示。

## 路由配置

### v2.5.4+

#### 接收器

路由需要引用一个已经配置好的[receiver](#receiver-configuration)。

#### 分组

| 参数            | 默认值 | 描述                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Group By        | N/a    | 对收到的警报进行分组的标签。例如，`[ group_by: '[' <labelname>,... ']' ]` 多个标签（如`cluster=A`和`alertname=LatencyHigh`）的警报可以分批归入一个组。要按所有可能的标签进行汇总，请使用特殊值`'...'`作为唯一的标签名称，例如：`group_by: ['...']`按`...`进行分组可以有效地完全禁用聚合，按原样通过所有警报。这不太可能是您想要的，除非您的警报量很低，或者您的上游通知系统执行自己的分组。 |
| Group Wait      | 30s    | 在初次发送之前，等待多长时间来缓冲同组的警报。                                                                                                                                                                                                                                                                                                                                              |
| Group Interval  | 5m     | 在发送已添加到已发送初始通知的警报组中的警报之前，需要等待多长时间。                                                                                                                                                                                                                                                                                                                        |
| Repeat Interval | 4h     | 发送两次重复告警消息之间的间隔时间。                                                                                                                                                                                                                                                                                                                                                        |

#### Matching 字段

**Match**字段指的是一组平等的匹配器，用于根据在该警报上定义的标签来确定哪些警报要发送到给定的路由。当您将键值对添加到 Rancher 用户界面时，它们对应于这种格式的 YAML。

```yaml
match: [<labelname>: <labelvalue>, ...]
```

匹配**Regex**字段指的是一组 regex-matchers，用于根据在该警报上定义的标签来确定哪些警报要发送到指定的 Route。当您在 Rancher 用户界面中添加键值对时，它们与 YAML 对应的格式是这样的。

```yaml
match_re: [<labelname>: <regex>, ...]
```

### v2.5.0-2.5.3

Alertmanager 必须在 YAML 中配置，如这个[例子](#alertmanager-config-示例)所示。

## Alertmanager Config 示例

要通过 Slack 设置通知，可以将以下 Alertmanager 配置 YAML 放入 Alertmanager 配置密钥的`alertmanager.yaml`键中，其中`api_url`应该更新为使用 Slack 的 Webhook URL。

```yaml
route:
  group_by: ["job"]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 3h
  receiver: "slack-notifications"
receivers:
  - name: "slack-notifications"
    slack_configs:
      - send_resolved: true
        text: '{{ template "slack.rancher.text" . }}'
        api_url: <user-provided slack webhook url here>
templates:
  - /etc/alertmanager/config/*.tmpl
```

## CIS 扫描警报的路由配置示例

在为`rancher-cis-benchmark`警报配置路由时，可以使用`job: rancher-cis-scan`键值对指定匹配。

例如，以下示例路由配置可以与名为`test-cis`的 Slack 接收器一起使用：

```yaml
spec:
  receiver: test-cis
  group_by:
  #    - string
  group_wait: 30s
  group_interval: 30s
  repeat_interval: 30s
  match:
    job: rancher-cis-scan
  #    key: string
  match_re: {}
#    key: string
```

关于为 "rancher-cis-benchmark "启用警报的更多信息，请参见[本节](/docs/rancher2.5/cis-scans/2.5/_index)
