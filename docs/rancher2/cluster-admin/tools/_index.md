---
title: 集群工具
description: Kubernetes 只提供了一个创建和管理容器的平台，Rancher 在此基础上集成了通知和告警、日志、监控等工具，让容器的运维和管理变得更加简单。同时，Rancher 也可以与外部服务集成，使集群运行更加高效。Rancher 内置的工具包括以下几类：通知和告警、日志、监控、Istio、OPA Gatekeeper。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 集群管理员指南
  - 集群工具
---

Kubernetes 只提供了一个创建和管理容器的平台，Rancher 在此基础上集成了通知和告警、日志、监控等工具，让容器的运维和管理变得更加简单。同时，Rancher 也可以与外部服务集成，使集群运行更加高效。Rancher 内置的工具包括以下几类：

## 通知和告警

通知和告警是两个协同工作的功能，向您通知 Rancher 系统中的事件。

[通知](/docs/rancher2/monitoring-alerting/2.0-2.4/notifiers/_index)是通知您告警事件的服务。您可以配置通知接收者，以将告警通知发送给最适合采取措施的人员。目前 Rancher 支持的通知发送方式包括：Slack、电子邮件、PagerDuty、微信、钉钉和 Webhooks。

[告警](/docs/rancher2/monitoring-alerting/2.0-2.4/cluster-alerts/_index)是触发通知的规则。在接收告警之前，必须在 Rancher 中配置一个或多个通知接收者。告警范围可以在集群或项目级别设置。

## 日志

日志服务提供了以下功能：

- 捕获并分析集群的状态
- 在您的环境中分析趋势，寻找集群变化的规律
- 将日志保存到集群外的安全位置
- 随时了解容器崩溃，Pod 驱逐或节点死亡等事件
- 更轻松地调试和排除故障

Rancher 可以与 Elasticsearch、Splunk、Kafka、Syslog 和 Fluentd 集成。

请参考[集群日志](/docs/rancher2/cluster-admin/tools/logging/_index)，获取配置 Rancher 和外部日志服务集成的详细操作步骤。

## 监控

_自 v2.2.0 起可用_

您可以通过领先的开源监控解决方案 [Prometheus](https://prometheus.io/) 监控集群节点、Kubernetes 系统组件、软件部署的状态和过程。请参考[Rancher 监控概述](/docs/rancher2/cluster-admin/tools/monitoring/_index)，获取配置 Rancher 和 Prometheus 对接的详细操作步骤。

## Istio

[Istio](https://istio.io/) 是一个开源工具，可使 DevOps 团队更轻松地观察，控制，排查故障和在复杂的微服务网络中的保证流量传输。有关如何在 Rancher 中启用 Istio 的详细信息，请参阅[Istio 功能介绍](/docs/rancher2/istio/_index)。

## OPA Gatekeeper

[OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper) 是一个开源项目，它对 OPA 和 Kubernetes 进行了集成，以通过准入控制器 Webhooks 提供策略控制。有关如何在 Rancher 中启用 Gatekeeper 的详细信息，请参阅[OPA Gatekeeper](/docs/rancher2/cluster-admin/tools/opa-gatekeeper/_index)。
