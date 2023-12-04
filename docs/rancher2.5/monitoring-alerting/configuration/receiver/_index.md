---
title: 接收器配置
---

[Alertmanager Config](https://prometheus.io/docs/alerting/latest/configuration/#configuration-file) Secret 包含一个 Alertmanager 实例的配置，该实例根据它从 Prometheus 收到的告警发出通知。

> 本节假设你熟悉监控组件如何协同工作。关于 Alertmanager 的更多信息，请参阅[本节。](/docs/rancher2.5/monitoring-alerting/how-monitoring-works/_index#3-alertmanager-如何工作)

## 在 Rancher UI 中创建接收器

_从 v2.5.4 版起可用_

> **前提条件：**
>
> - 需要安装监控应用程序。
> - 如果你使用现有的 Alertmanager Secret 配置监控，则它必须具有 Rancher UI 支持的格式。否则，你只能直接修改 Alertmanager Secret 来进行更改。注意：我们正在继续增强可以使用路由和接收器 UI 来支持哪些类型的 Alertmanager 配置，所以如果你有一个功能增强的请求，请[提交一个问题](https://github.com/rancher/rancher/issues/new)。

要在 Rancher UI 中创建通知接收器：

1. 点击**集群资源管理器>监控**，并点击**接收器**。
2. 为接收器输入一个名称。
3. 为接收器配置一个或多个 provider。关于填写表格的帮助，请参考下面的配置选项。
4. 单击**创建**。

**结果：**告警可以被配置为向接收器发送通知。

## 接收器配置

通知集成是通过 `receiver` 来配置的，这在 [Prometheus 文档](https://prometheus.io/docs/alerting/latest/configuration/#receiver)中有说明。

### 本地与非本地接收器

默认情况下，AlertManager 提供与一些接收器的本地集成，这些接收器在[本节](https://prometheus.io/docs/alerting/latest/configuration/#receiver)中列出。所有本地支持的接收器都可以通过 Rancher UI 进行配置。

对于 AlertManager 不支持的通知机制，可以使用 [webhook 接收器](https://prometheus.io/docs/alerting/latest/configuration/#webhook_config)实现集成。提供这种集成的第三方驱动列表可以在[这里](https://prometheus.io/docs/operating/integrations/#alertmanager-webhook-receiver)通过 Alerting Drivers 应用程序提供对这些驱动及其相关集成的访问。启用后，配置非本地接收器也可以通过 Rancher UI 完成。

目前，Rancher Alerting Drivers 应用提供对以下集成的访问：

- Microsoft Teams，基于 [prom2teams](https://github.com/idealista/prom2teams)驱动程序
- SMS，基于 [Sachet](https://github.com/messagebird/sachet)驱动程序

#### Rancher v2.5.8 的变化

Rancher v2.5.8 在 Rancher UI 中增加了 Microsoft Teams 和 SMS 作为可配置的接收器。

#### Rancher v2.5.4 的变化

Rancher v2.5.4 引入了通过在 Rancher UI 中填写表格来配置接收器的功能。

#### Rancher v2.5.8+

以下类型的接收器可以在 Rancher UI 中进行配置：

- <a href="#slack">Slack</a>
- <a href="#email">Email</a>
- <a href="#pagerduty">PagerDuty</a>
- <a href="#opsgenie">Opsgenie</a>
- <a href="#webhook">Webhook</a>
- <a href="#custom">Custom</a>
- <a href="#teams">Teams</a>
- <a href="#sms">SMS</a>

自定义接收器选项可用于在 YAML 中配置 Rancher UI 中不支持的接收器。

### Slack

| 字段                  | 类型   | 描述                                                                                                                                                               |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| URL                   | String | 输入你的 Slack webhook URL。关于创建 Slack webhook 的说明，请参见[Slack 文档。](https://get.slack.help/hc/en-us/articles/115005265063-Incoming-WebHooks-for-Slack) |     |
| 默认 Channel          | String | 输入你想发送告警通知的频道名称，格式如下。`#<channelname>`。                                                                                                       |
| Proxy URL             | String | Webhook 通知的代理。                                                                                                                                               |
| 启用 发送已解决的告警 | Bool   | 如果告警已经解决，是否要发送后续通知（例如：[已解决]高 CPU 使用率）。                                                                                              |

### Email

| 字段                 | 类型   | 描述                                                                |
| -------------------- | ------ | ------------------------------------------------------------------- |
| 默认收件人地址       | String | 接收通知的电子邮件地址。                                            |
| 启用发送已解决的告警 | Bool   | 如果告警已经解决，是否发送后续通知（例如：[已解决]高 CPU 使用率）。 |

**SMTP 选项：**

| 字段     | 类型   | 描述                                                               |
| -------- | ------ | ------------------------------------------------------------------ |
| 发件人   | String | 输入你的 SMTP 邮件服务器上可用的电子邮件地址，你想从那里发送通知。 |
| Host     | String | 输入你的 SMTP 服务器的 IP 地址或主机名。例如：`smtp.email.com`。   |
| 使用 TLS | Bool   | 使用 TLS 进行加密。                                                |
| 用户名   | String | 输入一个用户名来验证 SMTP 服务器。                                 |
| 密码     | String | 输入密码来验证 SMTP 服务器的身份。                                 |

### PagerDuty

| 字段                 | 类型   | 描述                                                                                                              |
| -------------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| 集成类型             | String | `Events API v2`或`Prometheus`。                                                                                   |
| 默认集成密钥         | String | 获取集成密钥的说明，请参阅[PagerDuty 文档。](https://www.pagerduty.com/docs/guides/prometheus-integration-guide/) |
| Proxy URL            | String | PagerDuty 通知的 Proxy。                                                                                          |
| 启用发送已解决的告警 | Bool   | 如果告警已经解决，是否要发送后续通知（例如：[Resolved] High CPU Usage）。                                         |

### Opsgenie

| 字段                 | 描述                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| API 密钥             | 关于获取 API 密钥的说明，请参考[Opsgenie 文档。](https://docs.opsgenie.com/docs/api-key-management) |
| Proxy URL            | Opsgenie 通知的 Proxy。                                                                             |
| 启用发送已解决的告警 | 如果告警已经解决，是否发送后续通知（例如：[已解决]高 CPU 使用率）。                                 |

Opsgenie 响应者：

| 字段   | 类型   | 描述                                                                                                                                     |
| ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 类型   | String | 时间表，团队，用户，或升级。关于告警响应者的更多信息，请参考[Opsgenie 文档。](https://docs.opsgenie.com/docs/alert-recipients-and-teams) |     |
| 发送给 | String | Opsgenie 接收器的 ID、名称或用户名。                                                                                                     |

### Webhook

| 字段                 | 描述                                                                |
| -------------------- | ------------------------------------------------------------------- |
| URL                  | 您选择的应用程序的 Webhook URL。                                    |
| Proxy URL            | Webhook 通知的 Proxy。                                              |
| 启用发送已解决的告警 | 如果告警已经解决，是否发送后续通知（例如：[已解决]高 CPU 使用率）。 |

### 自定义

这里提供的 YAML 将被直接附加到你的 Alertmanager Config Secret 中的接收器上。

### Teams

#### 为 Rancher 管理的集群启用 Teams 接收器

Teams 接收器不是一个本地接收器，必须在使用前启用。你可以为 Rancher 管理的集群启用 Teams 接收器，方法是进入应用程序页面，安装选择 Teams 选项的 `rancher-alerting-drivers` 应用程序。

1. 在 Rancher UI 中，进入你想安装 `rancher-alerting-drivers` 的集群，点击**Cluster Explorer**。
1. 单击**Apps**。
1. 点击**Alerting Drivers**应用程序。
1. 单击**Helm Deploy Options**标签
1. 选择**Teams**选项并点击**Install**。
1. 注意使用的命名空间，在后面的步骤中需要它。

#### 配置 Teams 接收器

Teams 接收器可以通过更新其 ConfigMap 进行配置。例如，下面是一个最小的 Teams 接收器配置。

```yaml
[Microsoft Teams]
teams-instance-1: https://your-teams-webhook-url
```

当配置完成后，使用[本节](#creating-receivers-in-therancher-ui)中的步骤添加接收器。

使用下面的例子作为 URL：

- `ns-1`被替换为`rancher-alerting-drivers`应用程序所安装的命名空间

```yaml
url: http://rancher-alerting-drivers-prom2teams.ns-1.svc:8089/v2/teams-instance-1
```

### SMS

#### 为 Rancher 管理的集群启用 SMS 接收器

SMS 接收器不是一个本地接收器，在使用之前必须先启用它。你可以为 Rancher 管理的集群启用 SMS 接收器，方法是进入应用程序页面，安装 `rancher-alerting-drivers` 应用程序并选择 SMS 选项。

1. 在 Rancher UI 中，进入你想安装 `rancher-alerting-drivers` 的集群，点击**Cluster Explorer**。
1. 单击**Apps**。
1. 点击**Alerting Drivers**应用程序。
1. 单击**Helm Deploy Options**标签
1. 选择**SMS**选项并点击**Install**。
1. 注意使用的命名空间，在后面的步骤中需要它。

#### 配置 SMS 接收器

SMS 接收器可以通过更新其 ConfigMap 进行配置。例如，下面是一个最小的 SMS 接收器配置：

```yaml
providers:
  telegram:
    token: "your-token-from-telegram"
receivers:
  - name: "telegram-receiver-1"
    provider: "telegram"
    to:
      - "123456789"
```

当配置完成后，使用[本节](#creating-receivers-in-therancher-ui)中的步骤添加接收器。

使用下面的例子作为名称和 URL：

- 分配给接收器的名称，如`telegram-receiver-1`，必须与 ConfigMap 中`receivers.name`字段中的名称一致，如`telegram-receiver-1`。
- URL 中的`ns-1`被替换为安装`rancher-alerting-drivers`应用程序的命名空间

```yaml
name: telegram-receiver-1
url http://rancher-alerting-drivers-sachet.ns-1.svc:9876/alert
```

#### Rancher v2.5.4-2.5.7

以下类型的接收器可以在 Rancher UI 中进行配置：

- <a href="#slack-254-257">Slack</a>
- <a href="#email-254-257">Email</a>
- <a href="#pagerduty-254-257">PagerDuty</a>
- <a href="#opsgenie-254-257">Opsgenie</a>
- <a href="#webhook-254-257">Webhook</a>
- <a href="#custom-254-257">Custom</a>

Custom 接收器选项可用于在 YAML 中配置任何无法通过填写 Rancher UI 中的其他表格进行配置的接收器。

#### Slack {#slack-254-257 }

| 字段                  | 类型   | 描述                                                                                                                                                               |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| URL                   | String | 输入你的 Slack webhook URL。关于创建 Slack webhook 的说明，请参见[Slack 文档。](https://get.slack.help/hc/en-us/articles/115005265063-Incoming-WebHooks-for-Slack) |     |
| 默认频道              | String | 输入你想发送告警通知的频道名称，格式如下。`#<channelname>`。                                                                                                       |
| Proxy URL             | String | Webhook 通知的 Proxy。                                                                                                                                             |
| 启用 发送已解决的告警 | Bool   | 如果告警已经解决，是否要发送后续通知（例如：[已解决]高 CPU 使用率）。                                                                                              |

#### Email {#email-254-257}

| 字段                 | 类型   | 描述                                                                |
| -------------------- | ------ | ------------------------------------------------------------------- |
| 默认收件人地址       | String | 将会收到通知的电子邮件地址。                                        |
| 启用发送已解决的告警 | Bool   | 如果告警已经解决，是否发送后续通知（例如：[已解决]高 CPU 使用率）。 |

**SMTP 选项：**

| 字段     | 类型   | 描述                                                               |
| -------- | ------ | ------------------------------------------------------------------ |
| 发件人   | String | 输入你的 SMTP 邮件服务器上可用的电子邮件地址，你想从那里发送通知。 |
| Host     | String | 输入你的 SMTP 服务器的 IP 地址或主机名。例如：`smtp.email.com`。   |
| 使用 TLS | Bool   | 使用 TLS 进行加密。                                                |
| 用户名   | String | 输入一个用户名来验证 SMTP 服务器。                                 |
| 密码     | String | 输入密码来验证 SMTP 服务器的身份。                                 |

#### PagerDuty {#pagerduty-254-257}

| 字段                 | 类型   | 描述                                                                                                              |
| -------------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| 集成类型             | String | `Events API v2`或`Prometheus`。                                                                                   |
| 默认集成密钥         | String | 获取集成密钥的说明，请参阅[PagerDuty 文档。](https://www.pagerduty.com/docs/guides/prometheus-integration-guide/) |
| Proxy URL            | String | PagerDuty 通知的 Proxy。                                                                                          |
| 启用发送已解决的告警 | Bool   | 如果告警已经解决，是否要发送后续通知（例如：[Resolved] High CPU Usage）。                                         |

#### Opsgenie {#opsgenie-254-257}

| 字段                 | 描述                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| API 密钥             | 关于获取 API 密钥的说明，请参考[Opsgenie 文档。](https://docs.opsgenie.com/docs/api-key-management) |
| Proxy URL            | Opsgenie 通知的 Proxy。                                                                             |
| 启用发送已解决的告警 | 如果告警已经解决，是否发送后续通知（例如：[已解决]高 CPU 使用率）。                                 |

**Opsgenie 响应者：**

| 字段   | 类型   | 描述                                                                                                                                     |
| ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 类型   | String | 时间表，团队，用户，或升级。关于告警响应者的更多信息，请参考[Opsgenie 文档。](https://docs.opsgenie.com/docs/alert-recipients-and-teams) |     |
| 发送给 | String | Opsgenie 接收器的 ID、名称或用户名。                                                                                                     |

#### Webhook {#webhook-1}

| 字段                 | 描述                                                                |
| -------------------- | ------------------------------------------------------------------- |
| URL                  | 您选择的应用程序的 Webhook URL。                                    |
| Proxy URL            | webhook 通知的 Proxy。                                              |
| 启用发送已解决的告警 | 如果告警已经解决，是否发送后续通知（例如：[已解决]高 CPU 使用率）。 |

#### Custom {#custom-254-257}

这里提供的 YAML 将被直接附加到你的接收器中，在 Alertmanager Config Secret 中。

##### Rancher v2.5.0-2.5.3

Alertmanager 必须用 YAML 进行配置，如这些[例子](#example-alertmanager-configs)所示。

### 配置多个接收器

通过编辑 Rancher UI 中的表单，你可以设置一个 Receiver 资源，其中包含 Alertmanager 向你的通知系统发送告警所需的所有信息。

也可以向多个通知系统发送告警。一种方法是使用自定义 YAML 来配置 Receiver，在这种情况下，你可以为多个通知系统添加配置，只要你确定这两个系统应该接收相同的信息。

你也可以通过使用路由的 `continue` 选项来设置多个接收器，这样发送给一个接收器的告警会在路由树的下一级继续被评估，这一级可能包含另一个接收器。

## Alertmanager 配置示例

### Slack

要想通过 Slack 设置通知，可以将下面的 Alertmanager 配置 YAML 放到 Alertmanager Config Secret 的 `alertmanager.yaml` 键中，其中 `api_url` 应该被更新为使用 Slack 的 Webhook URL。

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

### PagerDuty

要通过 PagerDuty 设置通知，请使用下面来自[PagerDuty 文档](https://www.pagerduty.com/docs/guides/prometheus-integration-guide/)的例子作为指导。这个例子设置了一个路由，用于捕获数据库服务的告警，并将其发送到与服务相关联的接收器，该接收器将直接通知 PagerDuty 中的 DBA，而所有其他的告警将被引导到一个具有不同 PagerDuty 集成密钥的默认接收器。

下面的 Alertmanager 配置 YAML 可以放在 Alertmanager Config Secret 的`alertmanager.yaml`键中。`service_key`应该更新为使用你的 PagerDuty 集成密钥，可以根据 PagerDuty 文档的 "Integrating with Global Event Routing" 部分找到。关于配置选项的完整列表，请参考[Prometheus 文档](https://prometheus.io/docs/alerting/latest/configuration/#pagerduty_config)。

```yaml
route:
  group_by: [cluster]
  receiver: "pagerduty-notifications"
  group_interval: 5m
  routes:
    - match:
        service: database
      receiver: "database-notifcations"
receivers:
  - name: "pagerduty-notifications"
    pagerduty_configs:
      - service_key: "primary-integration-key"
  - name: "database-notifcations"
    pagerduty_configs:
      - service_key: "database-integration-key"
```

## 用于 CIS 扫描告警的路由配置示例

在为 `rancher-cis-benchmark` 告警配置路由时，你可以使用键值对 `job: rancher-cis-scan` 来指定匹配。

例如，下面的路由配置例子可以用于名为 `test-cis` 的 Slack 接收器：

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

关于为 `rancher-cis-benchmark` 启用告警的更多信息，请参考[本节。](/docs/rancher2.5/security/security-scan/_index#设置告警)

## 通知者的受信 CA

如果你需要为你的通知器添加一个受信任的 CA，请参考[本节](/docs/rancher2.5/monitoring-alerting/configuration/helm-chart-options/_index#通知的受信-ca)的步骤进行。
