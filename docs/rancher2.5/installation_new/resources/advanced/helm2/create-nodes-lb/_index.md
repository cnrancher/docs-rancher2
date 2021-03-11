---
title: 节点和负载均衡
description: 本文讲述了安装负载均衡器时的节点配置要求、绑定端口和示例。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 安装指南
  - 资料、参考和高级选项
  - Rancher高可用Helm2安装
  - 配置基础设施
  - 节点和负载均衡
---

本文讲述了安装负载均衡器时的节点配置要求、绑定端口和示例。

> **注意事项:** 您可以将这些服务器放在单独的可用区中，但是这些节点必须和 Rancher 的其他节点位于相同的区域/数据中心。

## 节点要求

在 [节点需求](/docs/rancher2.5/installation_new/requirements/_index) 中查看运行 Rancher 的节点支持的操作系统和硬件/软件/网络需求。

在 [RKE 需求](/docs/rke/os/_index) 中查看 RKE 的操作系统需求。

## 负载均衡

RKE 将在每个节点上配置一个 Ingress controller pod。Ingress controller pods 被绑定到主机网络的 TCP/80 和 TCP/443 端口上，并且是到 Rancher Server 的 HTTPS 流量的入口点。

将负载均衡器配置为基本的 4 层 TCP 转发器。确切的配置将取决于您的环境。

> **重要:**
> 安装后，请勿使用此负载均衡器（即`local`集群 Ingress）对 Rancher 以外的应用程序进行负载均衡。与其他应用程序共享此 Ingress 可能会在其他应用的 Ingress 配置重新加载后导致 Rancher 出现 websocket 错误。我们建议将`local`集群专用于 Rancher，而不应使用其他任何应用程序。

## 示例

- [Nginx](/docs/rancher2.5/installation_new/resources/advanced/helm2/create-nodes-lb/nginx/_index)
- [Amazon NLB](/docs/rancher2.5/installation_new/resources/advanced/helm2/create-nodes-lb/nlb/_index)

## 后续步骤

[使用 RKE 安装 Kubernetes](/docs/rancher2.5/installation_new/resources/advanced/helm2/kubernetes-rke/_index)
