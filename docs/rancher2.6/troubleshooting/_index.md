---
title: 故障排查
weight: 26
---

本文用于帮助你解决使用 Rancher 时遇到的问题。

- [Kubernetes 组件]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/kubernetes-components/)

   对以下核心 Kubernetes 集群组件进行故障排查：
   * `etcd`
   * `kube-apiserver`
   * `kube-controller-manager`
   * `kube-scheduler`
   * `kubelet`
   * `kube-proxy`
   * `nginx-proxy`

- [Kubernetes resources]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/kubernetes-resources/)

   本节介绍了对节点、Ingress Controller 和 Rancher Agent 等 Kubernetes 资源进行故障排查的选项。

- [网络]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/networking/)

   介绍了解决网络问题的步骤。

- [DNS]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/dns/)

   解决集群的名称解析问题。

- [对安装在 Kubernetes 上的 Rancher 进行故障排除]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/rancherha/)

   解决[安装在 Kubernetes 上的 Rancher Server]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/) 的问题。

- [日志管理]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/logging/)

   了解可以配置哪些日志级别，以及如何配置日志级别。

- [审计日志中的用户 ID 跟踪]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/userid-tracking-in-audit-logs/)

   了解 Rancher 管理员如何通过外部身份提供程序用户名从 Rancher 审计日志和 Kubernetes 审计日志中跟踪事件。

- [过期的 Webhook 证书]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/expired-webhook-certificates/)

   了解如何在每年到期后轮换 Rancher webhook 证书密钥。
