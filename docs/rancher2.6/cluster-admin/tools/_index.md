---
title: 日志管理、监控和可视化工具
weight: 2033
---

Rancher 包含 Kubernetes 中未包含的各种工具来协助你进行 DevOps 操作。Rancher 可以与外部服务集成，让你的集群更高效地运行。工具分为以下几类：

<!-- TOC -->

- [日志管理](#logging)
- [监控和告警](#monitoring-and-alerts)
- [Istio](#istio)
- [OPA Gatekeeper](#opa-gatekeeper)
- [CIS 扫描](#cis-scans)

<!-- /TOC -->

## 日志管理

日志管理允许你：

- 获取和分析集群的状态
- 在你的环境中发现趋势
- 将日志保存到集群外部的安全位置
- 随时了解容器崩溃、pod 驱逐或节点死亡等事件
- 更轻松地调试和解决问题

Rancher 可以与 Elasticsearch、splunk、kafka、syslog 和 fluentd 集成。

有关详细信息，请参阅[日志管理文档]({{<baseurl>}}/rancher/v2.6/en/logging/)。

## 监控和告警

你可以使用 Rancher，通过业界领先并开源的 [Prometheus](https://prometheus.io/) 来监控集群节点、Kubernetes 组件和软件部署的状态和进程。

启用监控后，你可以通过设置告警和通知器来配置接收告警的机制。

通知器是通知你告警事件的服务。你可以通过配置通知器来向最适合采取纠正措施的员工发送告警通知。支持使用 Slack、电子邮件、PagerDuty、微信和 webhook 发送通知。

告警是触发这些通知的规则。在接收告警之前，你必须在 Rancher 中配置一个或多个通知器。你可以在集群或项目级别设置告警范围。

如需更多信息，请参阅[监控文档]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/)。

## Istio

[Istio](https://istio.io/) 是一种开源工具，可以让 DevOps 团队更轻松地观察、控制、排查并保护复杂的微服务网络中的流量。

Rancher v2.5 改进了与 Istio 的集成。

如需更多信息，请参阅 [Istio 文档]({{<baseurl>}}/rancher/v2.6/en/istio)。

## OPA Gatekeeper

[OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper) 是一个开源项目，它对 OPA 和 Kubernetes 进行了集成，以通过许可控制器 Webhook 提供策略控制。有关如何在 Rancher 中启用 Gatekeeper 的详细信息，请参阅 [OPA Gatekeeper]({{<baseurl>}}/rancher/v2.6/en/opa-gatekeper)。

## CIS 扫描

Rancher 可以通过运行安全扫描来检查 Kubernetes 是否按照 CIS Kubernetes Benchmark 中定义的安全最佳实践进行部署。

如需更多信息，请参阅 [CIS 扫描文档]({{<baseurl>}}/rancher/v2.6/en/cis-scans)。
