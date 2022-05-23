---
title: 接收器配置
shortTitle: 接收器
weight: 1
---

[Alertmanager Config](https://prometheus.io/docs/alerting/latest/configuration/#configuration-file) Secret 包含 Alertmanager 实例的配置，该实例根据 Prometheus 发出的告警发送通知。

> 本节参考假设你已经熟悉 Monitoring 组件的协同工作方式。有关 Alertmanager 的详细信息，请参阅[本节](../../how-monitoring-works/#3-how-alertmanager-works)。

- [在 Rancher UI 中创建接收器](#creating-receivers-in-the-rancher-ui)
- [接收器配置](#receiver-configuration)
   - [Slack](#slack)
   - [电子邮件](#email)
   - [PagerDuty](#pagerduty)
   - [Opsgenie](#opsgenie)
   - [Webhook](#webhook)
   - [自定义](#custom)
   - [Teams](#teams)
   - [SMS](#sms)
- [配置多个接收器](#configuring-multiple-receivers)
- [Alertmanager 配置示例](../examples/#example-alertmanager-config)
- [CIS 扫描告警的示例路由配置](#example-route-config-for-cis-scan-alerts)
- [Notifiers 的可信 CA](#trusted-ca-for-notifiers)

## 在 Rancher UI 中创建接收器
_从 v2.5.4 起可用_

> **前提**：
>
> - 已安装 Monitoring 应用。
> - 如果你使用现有的 Alertmanager Secret 配置 Monitoring，则它必须具有 Rancher 的 UI 支持的格式。否则，你将只能直接修改 Alertmanager Secret 来进行更改。请注意，对于通过使用路由和接收器 UI 支持的 Alertmanager 配置类型，我们会继续进行强化。因此如果你有增强功能的请求，请[提交 issue](https://github.com/rancher/rancher/issues/new)。

要在 Rancher UI 中创建通知接收器：

1. 转到要创建接收器的集群。单击**监控**，然后单击**接收器**。
2. 输入接收器的名称。
3. 为接收器配置一个或多个提供程序。如需获取填写表单的帮助，请参阅下方的配置选项。
4. 单击**创建**。

**结果**：告警可以向接收器发送通知。

## 接收器配置

通知集成是通过 `receiver` 配置的，[Prometheus](https://prometheus.io/docs/alerting/latest/configuration/#receiver) 文档对此进行了说明。

### 原生和非原生接收器

默认情况下，AlertManager 提供与一些接收器的原生集成，这些接收器在[本节](https://prometheus.io/docs/alerting/latest/configuration/#receiver)中列出。所有原生支持的接收器都可以通过 Rancher UI 进行配置。

对于 AlertManager 不提供原生支持的通知机制，可使用 [webhook 接收器](https://prometheus.io/docs/alerting/latest/configuration/#webhook_config)实现集成。你可以在[此处](https://prometheus.io/docs/operating/integrations/#alertmanager-webhook-receiver)找到提供此类集成的第三方驱动程序列表。Alerting Drivers 应用能让你访问这些驱动程序，以及它们相关的集成。启用后，你将可以在 Rancher UI 中配置非原生的接收器。

目前 Rancher Alerting Drivers 应用支持访问以下集成：
- Microsoft Teams，基于 [prom2teams](https://github.com/idealista/prom2teams) 驱动程序
- SMS，基于 [Sachet](https://github.com/messagebird/sachet) 驱动程序

你可以在 Rancher UI 中可以配置以下类型的接收器：

- <a href="#slack">Slack</a>
- <a href="#email">电子邮件</a>
- <a href="#pagerduty">PagerDuty</a>
- <a href="#opsgenie">Opsgenie</a>
- <a href="#webhook">Webhook</a>
- <a href="#custom">自定义</a>
- <a href="#teams">Teams</a>
- <a href="#sms">SMS</a>

你可以在 YAML 中使用自定义接收器选项，从而配置无法通过 Rancher UI 表单配置的接收器。

## Slack

| 字段 | 类型 | 描述 |
|------|--------------|------|
| URL | String | 输入你的 Slack webhook URL。有关创建 Slack webhook 的说明，请参阅 [Slack 文档](https://get.slack.help/hc/en-us/articles/115005265063-Incoming-WebHooks-for-Slack)。 |
| 默认频道 | String | 输入要发送告警通知的频道名称。格式：`#<channelname>`。 |
| 代理 URL | String | webhook 通知的代理。 |
| 发送已解决告警 | Bool | 如果告警已解决（例如 [已解决] CPU 使用率过高问题），是否发送后续通知。 |

## 电子邮件

| 字段 | 类型 | 描述 |
|------|--------------|------|
| 默认收件人地址 | String | 接收通知的电子邮件地址。 |
| 发送已解决告警 | Bool | 如果告警已解决（例如 [已解决] CPU 使用率过高问题），是否发送后续通知。 |

SMTP 选项：

| 字段 | 类型 | 描述 |
|------|--------------|------|
| 发件人 | String | 你的 SMTP 邮件服务器上可用的电子邮件地址，用于发送通知。 |
| 主机 | String | SMTP 服务器的 IP 地址或主机名。示例：`smtp.email.com`。 |
| 使用 TLS | Bool | 使用 TLS 进行加密。 |
| 用户名 | String | 用户名，用于通过 SMTP 服务器进行身份验证。 |
| 密码 | String | 密码，用于通过 SMTP 服务器进行身份验证。 |

## PagerDuty

| 字段 | 类型 | 描述 |
|------|------|-------|
| 集成类型 | String | `Events API v2` 或 `Prometheus`。 |
| 默认集成密钥 | String | 有关获取集成密钥的说明，请参阅 [PagerDuty 文档](https://www.pagerduty.com/docs/guides/prometheus-integration-guide/)。 |
| 代理 URL | String | PagerDuty 通知的代理。 |
| 发送已解决告警 | Bool | 如果告警已解决（例如 [已解决] CPU 使用率过高问题），是否发送后续通知。 |

## Opsgenie

| 字段 | 描述 |
|------|-------------|
| API 密钥 | 有关获取 API 密钥的说明，请参阅 [Opsgenie 文档](https://docs.opsgenie.com/docs/api-key-management)。 |
| 代理 URL | Opsgenie 通知的代理。 |
| 发送已解决告警 | 如果告警已解决（例如 [已解决] CPU 使用率过高问题），是否发送后续通知。 |

Opsgenie 响应者：

| 字段 | 类型 | 描述 |
|-------|------|--------|
| 类型 | String | 计划程序、团队、用户或升级。有关告警响应者的更多信息，请参阅 [Opsgenie 文档](https://docs.opsgenie.com/docs/alert-recipients-and-teams)。 |
| 发送至 | String | Opsgenie 收件人的 ID、名称或用户名。 |

## Webhook

| 字段 | 描述 |
|-------|--------------|
| URL | 你所选的应用的 Webhook URL。 |
| 代理 URL | webhook 通知的代理。 |
| 发送已解决告警 | 如果告警已解决（例如 [已解决] CPU 使用率过高问题），是否发送后续通知。 |

<!-- TODO add info on webhook for teams and sms and link to them -->

## 自定义

此处提供的 YAML 将直接附加到 Alertmanager Config Secret 的接收器中。

## Teams

### 为 Rancher 管理的集群启用 Teams 接收器

Teams 接收器不是原生接收器，因此需要启用后才能使用。你可以通过转到应用页面，安装 rancher-alerting-drivers 应用，然后选择 Teams 选项，从而为 Rancher 管理的集群启用 Teams 接收器。

1. 在 Rancher UI 中，转到要安装 rancher-alerting-drivers 的集群，然后单击**应用 & 应用市场**。
1. 点击 **Alerting Drivers** 应用。
1. 单击 **Helm 部署选项**选项卡。
1. 选择 **Teams** 并单击**安装**。
1. 记下使用的命名空间，后续步骤中将需要该命名空间。

### 配置 Teams 接收器

可以通过更新 ConfigMap 来配置 Teams 接收器。例如，以下是最小的 Teams 接收器配置：

```yaml
[Microsoft Teams]
teams-instance-1: https://your-teams-webhook-url
```

配置完成后，按照[本节](#creating-receivers-in-the-rancher-ui)中的步骤添加接收器。

使用以下示例作为 URL，其中：

- 将 `ns-1` 替换为安装 `rancher-alerting-drivers` 应用的命名空间。

```yaml
url: http://rancher-alerting-drivers-prom2teams.ns-1.svc:8089/v2/teams-instance-1
```

<!-- https://github.com/idealista/prom2teams -->

## SMS

### 为 Rancher 管理的集群启用 SMS 接收器

SMS 接收器不是原生接收器，因此需要启用后才能使用。你可以通过转到应用页面，安装 rancher-alerting-drivers 应用，然后选择 SMS 选项，从而为 Rancher 管理的集群启用 SMS 接收器。

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要安装 `rancher-alerting-drivers` 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**应用 & 应用市场**。
1. 点击 **Alerting Drivers** 应用。
1. 单击 **Helm 部署选项**选项卡。
1. 选择 **SMS** 并单击**安装**。
1. 记下使用的命名空间，后续步骤中将需要该命名空间。

### 配置 SMS 接收器

可以通过更新 ConfigMap 来配置 SMS 接收器。例如，以下是最小的 SMS 接收器配置：

```yaml
providers:
  telegram:
    token: 'your-token-from-telegram'

receivers:
- name: 'telegram-receiver-1'
  provider: 'telegram'
  to:
    - '123456789'
```

配置完成后，按照[本节](#creating-receivers-in-the-rancher-ui)中的步骤添加接收器。

使用以下示例作为名称和 URL，其中：

- 分配给接收器的名称（例如 `telegram-receiver-1`）必须与 ConfigMap 中 `receivers.name` 字段中的名称（例如 `telegram-receiver-1`）匹配。
- 将 URL 中的 `ns-1` 替换为安装 `rancher-alerting-drivers` 应用的命名空间。

```yaml
name: telegram-receiver-1
url http://rancher-alerting-drivers-sachet.ns-1.svc:9876/alert
```

<!-- https://github.com/messagebird/sachet -->


## 配置多个接收器

你可以编辑 Rancher UI 中的表单来设置一个 Receiver 资源，其中包含 Alertmanager 将告警发送到你的通知系统所需的所有信息。

也可以向多个通知系统发送告警。一种方法是使用自定义 YAML 来配置接收器。如果你需要让两个系统接收相同的消息，则可以为多个通知系统添加配置。

你还可以通过使用路由的 `continue` 选项来设置多个接收器。这样，发送到接收器的告警会在路由树（可能包含另一个接收器）的下一级进行评估。


## Alertmanager 配置示例

### Slack
要通过 Slack 设置通知，你可以将以下 Alertmanager Config YAML 放入 Alertmanager Config Secret 的 `alertmanager.yaml` 键中，你需要更新 `api_url` 来使用来自 Slack 的 Webhook URL：

```yaml
route:
  group_by: ['job']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 3h
  receiver: 'slack-notifications'
receivers:
- name: 'slack-notifications'
  slack_configs:
  - send_resolved: true
    text: '{{ template "slack.rancher.text" . }}'
    api_url: <user-provided slack webhook url here>
templates:
- /etc/alertmanager/config/*.tmpl
```

### PagerDuty
要通过 PagerDuty 设置通知，请使用 [PagerDuty 文档](https://www.pagerduty.com/docs/guides/prometheus-integration-guide/) 中的以下示例作为指导。此示例设置了一个路由，该路由捕获数据库服务的告警，并将告警发送到链接到服务的接收器，该服务将直接通知 PagerDuty 中的 DBA，而其他告警将被定向到具有不同 PagerDuty 集成密钥的默认接收器。

你可以将以下 Alertmanager Config YAML 放入 Alertmanager Config Secret 的 `alertmanager.yaml` 键中。你需要将 `service_key` 更新为使用你的 PagerDuty 集成密钥，可以根据 PagerDuty 文档的 "Integrating with Global Event Routing" 找到该密钥。有关配置选项的完整列表，请参阅 [Prometheus 文档](https://prometheus.io/docs/alerting/latest/configuration/#pagerduty_config)。

```yaml
route:
 group_by: [cluster]
 receiver: 'pagerduty-notifications'
 group_interval: 5m
 routes:
  - match:
      service: database
    receiver: 'database-notifcations'

receivers:
- name: 'pagerduty-notifications'
  pagerduty_configs:
  - service_key: 'primary-integration-key'

- name: 'database-notifcations'
  pagerduty_configs:
  - service_key: 'database-integration-key'
```

## CIS 扫描告警的示例路由配置

在为 `rancher-cis-benchmark` 告警配置路由时，你可以使用键值对 `job:rancher-cis-scan` 来指定匹配。

例如，以下路由配置示例可以与名为 `test-cis` 的 Slack 接收器一起使用：

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
  match_re:
    {}
#    key: string
```

有关为 `rancher-cis-benchmark` 启用告警的更多信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cis-scans/#enabling-alerting-for-rancher-cis-benchmark)。


## Notifiers 的可信 CA

如果你需要将受信任的 CA 添加到 Notifiers，请按照[本节](../helm-chart-options/#trusted-ca-for-notifiers)中的步骤操作。