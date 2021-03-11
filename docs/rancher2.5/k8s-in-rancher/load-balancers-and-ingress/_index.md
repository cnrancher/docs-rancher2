---
title: 工作原理
description: 在集群内启动一个应用程序后，该应用程序仅在集群中可用，无法从集群外部访问该应用程序。负载均衡器和 Ingress 可以重定向服务请求。如果希望可以从外部访问您的应用程序，您可以将负载均衡器或 Ingress 添加到集群中。只要用户知道负载均衡器的 IP 地址和应用程序的端口号，就可以通过负载均衡器创建的网关访问您的集群。
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
  - 用户指南
  - 负载均衡和Ingress
  - 工作原理
---

在集群内启动一个应用程序后，该应用程序仅在集群中可用，无法从集群外部访问该应用程序。负载均衡器和 Ingress 可以重定向服务请求。如果希望可以从外部访问您的应用程序，您可以将负载均衡器或 Ingress 添加到集群中。只要用户知道负载均衡器的 IP 地址和应用程序的端口号，就可以通过负载均衡器创建的网关访问您的集群。

## 负载均衡器

Rancher 支持两种类型的负载均衡器：

- [4 层负载均衡器](/docs/rancher2/k8s-in-rancher/load-balancers-and-ingress/load-balancers/_index)
- [7 层负载均衡器](/docs/rancher2/k8s-in-rancher/load-balancers-and-ingress/load-balancers/_index)

详情请参考[负载均衡器](/docs/rancher2/k8s-in-rancher/load-balancers-and-ingress/load-balancers/_index)。

## 负载均衡器的使用限制

使用负载均衡器时，您需要注意以下使用限制：

- 每个负载均衡器只能处理一个 IP 地址，如果您在集群中运行多个服务（type 为 LoadBalancer 的 svc），则每个服务都必须具有一个负载均衡器。运行多个负载均衡器会导致成本高昂。

- 如果要在托管的 Kubernetes 集群中（例如，GKE，EKS 或 AKS）使用负载均衡器，则负载均衡器必须在该云提供商的基础架构中运行。请根据配置集群的方式查看有关负载均衡器支持的兼容性表：

  - [支持 4 层负载均衡](/docs/rancher2/k8s-in-rancher/load-balancers-and-ingress/load-balancers/_index)

  - [支持 7 层负载均衡](/docs/rancher2/k8s-in-rancher/load-balancers-and-ingress/load-balancers/_index)

## Ingress

如以上限制所述，使用负载均衡器的缺点是：

- 负载均衡器的每个实例只能处理一个 IP 地址。
- 如果您在集群中运行多个服务，则每个服务都必须具有一个负载均衡器。
- 为每个服务都配备一个负载均衡器成本高昂。

将 Ingress 用作集群的入口点时，Ingress 可以更灵活地将流量路由到多个服务。它可以将多个 HTTP 请求映射到服务，而无需为每个服务使用单独的 IP 地址。

因此，如果要使用相同的 IP 地址，相同的第 7 层协议或相同的特权节点端口：80 和 443 公开多个服务，则可以使用 Ingress。

Ingress 与一个或多个 Ingress 控制器配合使用完成动态路由服务请求。当 Ingress 收到请求时，集群中的 Ingress 控制器将根据您配置的服务子域或路径规则将请求定向到正确的服务。

每个 Kubernetes Ingress 资源，您可以理解为类似`/etc/nginx/sites-available/`中的一个包含`server{}`配置的文件，其中配置了对特定文件和文件夹的请求。

和负载均衡器类似，您的 Ingress 可以创建集群的入口端口，它可以在集群内部或外部。在 RKE 集群中的 Ingress 和 Ingress 控制器是由 [Nginx](https://www.nginx.com/) 提供的。

Ingress 还可以提供其他功能，例如 SSL 终止，基于名称的虚拟服务等等。

> **在 Rancher 高可用集群中使用 Ingress 的注意事项**
>
> 请勿将 Ingress 添加到`local`集群中。Rancher 使用的 Nginx Ingress Controller 充当 了 Rancher 管理的**全部**集群（包括`local`集群）的全局入口点。因此，当用户配置访问应用程序的 Ingress 时，它会导致 Nginx 重新加载配置，您的 Rancher 连接可能会断开。我们建议仅在下游集群中部署业务应用程序。

- 有关如何在 Rancher 中设置 Ingress 的更多信息, 请参见 [Ingress](/docs/rancher2/k8s-in-rancher/load-balancers-and-ingress/ingress/_index)。
- 有关 Ingress 和 Ingress 控制器的完整信息，请参见 [Kubernetes Ingress 文档](https://kubernetes.io/docs/concepts/services-networking/ingress/)。
- 在项目中使用 Ingress 时，可以设置全局 DNS 条目，从而对外部 DNS 进行编程动态设置 Ingress。请参见[全局 DNS](/docs/rancher2/helm-charts/legacy-catalogs/globaldns/_index)。
