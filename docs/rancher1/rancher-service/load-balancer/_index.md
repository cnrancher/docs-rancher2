---
title: 负载均衡
---

Rancher 支持在 Rancher 内使用不同负载均衡器驱动。您可以通过向目标服务添加规则使负载均衡器将网络和应用程序流量分配到容器中。Rancher 将自动将目标服务的容器自动注册为 Rancher 的负载平衡目标。

默认情况下，Rancher 提供了一个基于 HAProxy 的托管负载均衡器，您可以手动扩容到多个主机上。我们计划添加额外的负载均衡器驱动，所有负载均衡器的选项将是相同的，不管负载均衡器种类。

对于 Cattle 引擎的环境，可以参考[UI](/docs/rancher1/infrastructure/cattle/adding-load-balancers/_index#如何在ui上新增一个负载均衡)和[Rancher Compose](/docs/rancher1/infrastructure/cattle/adding-load-balancers/_index#用rancher-compose-添加负载均衡)了解更多信息，并且在[UI](/docs/rancher1/infrastructure/cattle/adding-load-balancers/_index#adding-a-load-balancer-in-the-ui)和[Rancher Compose](/docs/rancher1/infrastructure/cattle/adding-load-balancers/_index#adding-a-load-balancer-with-rancher-compose)中有相关的例子。

对于 Kubernetes 的环境，详细了解如何启动云厂商提供的外部负载均衡器服务，或者使用 Rancher 负载均衡器实现 Kubernetes 环境中的 Ingress 支持。
