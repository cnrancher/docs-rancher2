---
title: 通知
---

通知服务是通知您告警事件的服务。您可以配置通知服务，以将告警通知发送给最适合采取措施的人员。

Rancher 集成了多种通知服务，包括：

- **Slack**： 将告警通知发送到您的 Slack 频道。
- **Email**： 选择电子邮件收件人以接收告警通知。
- **PagerDuty**： 通过电话，短信或个人电子邮件将告警发送给员工。
- **WebHooks**： 将告警发送到 Webhook 服务器。
- **WeChat**： 向您的企业微信联系人发送告警通知。

## 基于角色的访问控制

通知程序是在集群级别配置的。可确保仅集群所有者需要配置通知程序，而项目所有者则可以仅在其项目范围内使用已经定义好的通知作为告警接收者。无需考虑 SMTP 服务器访问或云帐户访问权限等问题。

## 添加通知接收者

设置通知接收者，以便您可以开始配置和发送告警。

1. 在**全局视图**中，打开要添加通知的集群。

1. 在主菜单中，选择**工具>通知**。然后单击**添加通知**。

1. 选择要用作接收者的服务，然后填入所需配置。

   - Slack

     1. 输入通知接收者的**名称**
     1. From Slack，创建一个 Webhook。有关说明，请参见 [Slack 文档](https://get.slack.help/hc/en-us/articles/115005265063-Incoming-WebHooks-for-Slack)。
     1. 在 Rancher 中，输入您的 Slack Webhook **URL**。
     1. 以以下格式输入要发送告警的频道名称: `#<channelname>`。
        支持公有和私有频道。
     1. 单击**测试**。如果测试成功，则您配置的 Slack 频道将收到 `Slack setting validated`。

   - 邮件

     1. 输入通知接收者的**名称**。
     1. 在**发件人**字段中，输入要发送通知的邮件服务器上可用的电子邮件地址。
     1. 在**主机**字段中，输入 SMTP 服务器的 IP 地址或主机名。示例： `smtp.email.com`。
     1. 在**端口**字段中，输入用于电子邮件服务的端口。通常，TLS 使用`587` ，而 SSL 使用`465`。如果您使用的是 TLS，请确保勾选**使用 TLS**。
     1. 输入通过 SMTP 服务器进行身份验证的**用户名**和**密码**。
     1. 在**默认收件人**字段中，输入要接收通知的电子邮件地址。
     1. 单击**测试**。如果测试成功，Rancher 将打印 `settings validated`，并且您会收到测试通知电子邮件。

   - PagerDuty

     1. 输入通知接收者的**名称**。
     1. 从 PagerDuty 创建一个 Prometheus 集成。有关说明，请参阅 [PagerDuty 文档](https://www.pagerduty.com/docs/guides/prometheus-integration-guide/)。
     1. 从 PagerDuty 中，复制 Prometheus 集成的 **Integration Key**。
     1. 在 Rancher 中，在 **Service Key** 中输入密钥。
     1. 单击 **测试**。如果测试成功，则您的 PagerDuty 端点将输出 `PagerDuty setting validated`.

   - WebHook

     1. 输入通知接收者的**名称**。
     1. 输入您的 Webhook **URL**。
     1. 单击 **测试**。如果测试成功，您配置的 Webhook 地址将会收到 `Webhook setting validated`。

   - WeChat

     _自 v2.2.0 起可用_

     1. 输入通知接收者的**名称**
     1. 在 **企业 ID** 字段中，输入您公司的 "EnterpriseID"，您可以在企业微信的[设置页面](https://work.weixin.qq.com/wework_admin/frame#profile)获取。
     1. 从企业微信中，在[应用页面](https://work.weixin.qq.com/wework_admin/frame#apps)创建一个应用程序，然后将应用的`AgentId`和`Secret`填入**应用代理 ID** 和**应用密钥**字段。
     1. 选择**接收者类型**然后在**默认接收者**字段中输入相应的 ID，例如，您要接收通知的参与者 ID，标签 ID 或部门 ID。您可以从[联系人页面](https://work.weixin.qq.com/wework_admin/frame#contacts)获取联系信息。

1. _自 v2.3.0 起可用_ - 如果希望通知已解决的告警，请勾选**发送已解决的告警**
1. 单击**添加**以完成添加通知接收者。

**结果：** 您的通知接收者已添加到 Rancher。

## 管理通知

设置通知程序后，您可以对其进行管理。从**全局**视图中，打开要管理通知者的集群。选择**工具>通知程序**。您可以：

- **编辑**初始配置。
- **克隆**通知，快速设置略有不同的通知。
- **删除**不再需要的通知。

## Webhook 类型告警通知的 Payload 示例

```json
{
  "receiver": "c-2a3bc:kube-components-alert",
  "status": "firing",
  "alerts": [
    {
      "status": "firing",
      "labels": {
        "alert_name": "Scheduler is unavailable",
        "alert_type": "systemService",
        "cluster_name": "mycluster (ID: c-2a3bc)",
        "component_name": "scheduler",
        "group_id": "c-2a3bc:kube-components-alert",
        "logs": "Get http://127.0.0.1:10251/healthz: dial tcp 127.0.0.1:10251: connect: connection refused",
        "rule_id": "c-2a3bc:kube-components-alert_scheduler-system-service",
        "severity": "critical"
      },
      "annotations": {},
      "startsAt": "2020-01-30T19:18:13.321684733Z",
      "endsAt": "0001-01-01T00:00:00Z",
      "generatorURL": ""
    }
  ],
  "groupLabels": {
    "component_name": "scheduler",
    "rule_id": "c-2a3bc:kube-components-alert_scheduler-system-service"
  },
  "commonLabels": {
    "alert_name": "Scheduler is unavailable",
    "alert_type": "systemService",
    "cluster_name": "mycluster (ID: c-2a3bc)"
  }
}
```

## 后续操作

创建通知程序接收者后，设置告警以接收 Rancher 告警事件。

- [集群所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)可以设置[集群级别](/docs/rancher2/cluster-admin/tools/cluster-alerts/_index)的告警。
- [项目所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)可以设置[项目级别](/docs/rancher2/project-admin/tools/project-alerts/_index)的告警。
