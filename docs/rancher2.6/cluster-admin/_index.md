---
title: 集群管理
weight: 8
---

在 Rancher 中配置集群后，你可以开始使用强大的 Kubernetes 功能在开发、测试或生产环境中部署和扩展容器化应用。

本文涵盖以下主题：

- [在集群之间切换](#switching-between-clusters)
- [在 Rancher 中管理集群](#managing-clusters-in-rancher)
- [配置工具](#configuring-tools)

> 本节默认你已对 Docker 和 Kubernetes 有一定的了解。如果你需要了解 Kubernetes 组件如何协作，请参见 [Kubernetes 概念]({{<baseurl>}}/rancher/v2.6/en/overview/concepts)。

## 在 Rancher 中管理集群

将集群[配置到 Rancher]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/) 之后，[集群所有者]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#cluster-roles)需要管理这些集群。管理集群的选项如下：

{{% include file="/rancher/v2.6/en/cluster-provisioning/cluster-capabilities-table" %}}

## 配置工具

Rancher 包含 Kubernetes 中未包含的各种工具来协助你进行 DevOps 操作。Rancher 可以与外部服务集成，让你的集群更高效地运行。工具分为以下几类：

- 告警
- 通知器
- 日志管理
- 监控
- Istio 服务网格
- OPA Gatekeeper

你可以通过**应用 & 应用市场**来安装工具。
