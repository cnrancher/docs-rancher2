---
title: 添加 Ingress
description: 你可以为工作负载添加 Ingress，从而提供负载均衡、SSL 终止和基于主机/路径的路由。了解如何添加 Rancher Ingress
weight: 3042
---

你可以为工作负载添加 Ingress，从而提供负载均衡、SSL 终止和基于主机/路径的路由。在项目中使用 Ingress 时，你可以通过设置全局 DNS 条目来将 Ingress 主机名编程到外部 DNS。

1. 点击左上角 **☰ > 集群管理**。
1. 转到要添加 Ingress 的集群，然后单击 **Explore**。
1. 点击**服务发现 > Ingresses**。
1. 单击**创建**。
1. 从下拉列表中选择一个现有的**命名空间**。
1. 输入 Ingress 的**名称**。
1. 创建 Ingress 转发**规则**。有关配置规则的帮助，请参阅[本节](#ingress-rule-configuration)。如果你的任何 Ingress 规则处理加密端口的请求，请添加证书以加密/解密通信。
1. **可选**：点击**添加规则**来创建其他 Ingress 规则。例如，在创建 Ingress 规则以引导主机名请求后，你可能想创建一个默认后端来处理 404。
1. 点击右下角的**创建**。

**结果**：已将 Ingress 添加到项目中。Ingress 会开始执行你的 Ingress 规则。

