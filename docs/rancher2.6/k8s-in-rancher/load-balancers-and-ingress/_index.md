---
title: 在 Rancher 中设置负载均衡器和 Ingress Controller
description: 了解如何设置负载均衡器和 Ingress Controller 以在 Rancher 中重定向服务请求，并了解负载均衡器的限制
weight: 3040
---

在 Rancher 中，你可以通过设置负载均衡器和 Ingress Controller 来重定向服务请求。

## 负载均衡器

启动应用程序后，该应用程序仅在集群内可用。你无法从集群外部访问它。

如果你希望从外部访问应用程序，则必须向集群添加负载均衡器或 Ingress。如果用户知道负载均衡器的 IP 地址和应用的端口号，负载均衡器可以为外部连接创建一个访问集群的网关。

Rancher 支持两种类型的负载均衡器：

- [Layer-4 负载均衡器]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/load-balancers/#layer-4-load-balancer)
- [Layer-7 负载均衡器]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/load-balancers/#layer-7-load-balancer)

有关详细信息，请参阅[负载均衡器]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/load-balancers)。

### 负载均衡器限制

负载均衡器有几个需要注意的限制：

- 负载均衡器只能处理每个 service 的一个 IP 地址。换言之，如果你在集群中运行了多个 service，则必须为每个 service 配备一个负载均衡器。运行多个负载均衡器的花费可能非常高昂。

- 如果你想将负载均衡器与托管的 Kubernetes 集群（即托管在 GKE、EKS 或 AKS 中的集群）一起使用，则负载均衡器必须运行在该云提供商的基础设施上。请根据你配置集群的方式查看负载均衡器的兼容列表：


   - [支持 Layer-4 负载均衡]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/load-balancers/#support-for-layer-4-load-balancing)

   - [支持 Layer-7 负载均衡]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/load-balancers/#support-for-layer-7-load-balancing)

## Ingress

如上所述，使用负载均衡器的缺点是：

- 每个服务负载均衡器只能处理一个 IP 地址。
- 如果你在集群中运行多个服务，则每个服务都必须配备一个负载均衡器。
- 为每个服务配备负载均衡器的花费可能非常高昂。

相反，如果将某个 Ingress 用作集群的入口点，Ingress 可以更灵活地将流量路由到多个 service。它可以将多个 HTTP 请求映射到 service，而无需为每个 service 提供单独的 IP 地址。

因此，如果你需要使用相同的 IP 地址、Layer 7 协议或特权节点端口（80 和 443）来公开多个 service，你可以使用一个 Ingress。

Ingress 与一个或多个 Ingress Controller 一起动态路由 service 的请求。Ingress 收到请求时，集群中的 Ingress Controller 会根据你配置的 service 子域或路径规则将请求定向到正确的 service。

每个 Kubernetes Ingress 资源都对应一个 `/etc/nginx/sites-available/` 中的文件，其中包含一个配置对特定文件和文件夹的请求的 `server{}` 配置块。

Ingress 能为你的集群创建一个入口端口（与负载均衡器类似），可以位于集群的内部或外部。RKE 启动的集群中的 Ingress 和 Ingress Controller 由 [Nginx](https://www.nginx.com/) 提供支持。

Ingress 还支持其他功能，例如 SSL 终止、基于名称的虚拟主机等。

> **在高可用性配置中使用 Rancher：**
>
> 请避免将 Ingress 添加到 `local` 集群。Rancher 将 Nginx Ingress Controller 作为 Rancher 管理的 _所有_ 集群的全局入口点，其中包括 `local` 集群。因此，当用户尝试访问应用程序时，Rancher 可能会由于重新加载 Nginx 配置而断开连接。要解决这个问题，我们建议你仅在通过 Rancher 启动的集群中部署应用程序。

- 有关如何在 Rancher 中设置 Ingress 的更多信息，请参阅 [Ingress]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/ingress)。
- 有关 Ingress 和 Ingress Controller 的完整信息，请参阅 [Kubernetes Ingress 文档](https://kubernetes.io/docs/concepts/services-networking/ingress/)。
- 在项目中使用 Ingress 时，你可以通过设置全局 DNS 条目来将 Ingress 主机名编程到外部 DNS。
