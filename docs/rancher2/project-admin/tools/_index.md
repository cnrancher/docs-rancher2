---
title: 工具介绍
---

Rancher 集成了很多 Kubernetes 缺少的监控和运维工具，可以辅助您进行 DevOps 开发工作。Rancher 可以跟其他服务集成，帮助您的集群更高效地运行。工具分为以下几个种类：

<!-- TOC -->

- [通知和告警](#通知和告警)
- [日志](#日志)
- [监控](#监控)

<!-- /TOC -->

## 通知和告警

通知和告警需要互相配合，才能发挥作用。它们把 Rancher 系统中发生的事件以 Slack、电子邮件、PagerDuty、微信或 webhook 的形式告知用户。

[通知](/docs/rancher2/monitoring-alerting/2.0-2.4/notifiers/_index)的功能是告知用户 Rancher 中正在发生的事件。您可以配置告警，把通知发送给最适合解决这个问题的员工，让他采取行动。Rancher 已经和 Slack、电子邮件、PagerDuty、微信和 webhook 对接，您可以使用这些应用发送通知。

[告警](/docs/rancher2/monitoring-alerting/2.0-2.4/cluster-alerts/_index)是触发 Rancher 发送通知的规则。只有完成了告警的配置，您才会收到通知。您可以设置集群层级的告警或项目层级的告警。

## 日志

日志对 Rancher 的日常运维提供了帮助，因为它允许您进行以下操作：

- 捕获和分析您的集群状态。
- 寻找环境的变化趋势。
- 在集群以外的位置保存日志。
- 告知下游集群或项目中的异常情况，如容器崩溃、Pod 驱逐、节点死亡等。
- 让系统调试和问题定位变得更加简单。

Rancher 可以和 Elasticsearch、 splunk、 kafka、 syslog、 fluentd 等工具集成。详情请参考[日志](/docs/rancher2/cluster-admin/tools/logging/_index)章节。

## 监控

_v2.2.0 或更新版可用_

您可以使用 Rancher 对接[Prometheus](https://prometheus.io/)，监控集群节点的状态和进程，详细信息参考[监控](/docs/rancher2/cluster-admin/tools/monitoring/_index)章节。
