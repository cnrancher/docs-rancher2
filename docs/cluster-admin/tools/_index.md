---
title: 集群工具
---

Rancher 包含 Kubernetes 中未包含的各种工具，可帮助您进行 DevOps 操作。Rancher 可以与外部服务集成，以帮助您的集群更高效地运行。工具分为以下几类：

## 通知和告警

通知和告警是两个协同工作的功能，向您通知 Rancher 系统中的事件。

[通知](/docs/cluster-admin/tools/notifiers/_index)是通知您告警事件的服务。您可以配置通知接收者，以将告警通知发送给最适合采取措施的人员。通知可以通过 Slack，电子邮件，PagerDuty，微信和 Webhooks 发送。

[告警](/docs/cluster-admin/tools/alerts/_index)是触发通知的规则。在接收告警之前，必须在 Rancher 中配置一个或多个通知接收者。告警范围可以在集群或项目级别设置。

## 日志

日志服务很有用，因为它使您能够：

- 捕获并分析集群的状态
- 在您的环境中发现趋势
- 将日志保存到集群之外的安全位置
- 随时了解容器崩溃，Pod 驱逐或节点死亡等事件
- 更轻松地调试和排除故障

Rancher 可以与 Elasticsearch，Splunk，Kafka，Syslog 和 Fluentd 集成。

有关详细信息，请参阅[日志部分](/docs/cluster-admin/tools/logging/_index)。

## 监控

_自 v2.2.0 起可用_

在 Rancher，您可以通过领先的开源监控解决方案 [Prometheus](https://prometheus.io/) 监控集群节点，Kubernetes 系统组件和软件部署的状态和过程。有关详细信息，请参阅[监控部分](/docs/cluster-admin/tools/monitoring/_index)。

## Istio

[Istio](https://istio.io/) 是一个开源工具，可使 DevOps 团队更轻松地观察，控制，排查故障和在复杂的微服务网络中的保证流量传输。有关如何在 Rancher 中启用 Istio 的详细信息，请参阅[Istio 部分](/docs/cluster-admin/tools/istio/_index)。
