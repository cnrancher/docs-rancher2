---
title: Kubernetes 资源
weight: 18
---

你可以在 Rancher UI 中查看和操作 Kubernetes 集群中的所有自定义资源和 CRD。

## 工作负载

使用[工作负载]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/)将应用部署到集群节点，工作负载是包含用于运行应用的 pod 的对象，以及为部署行为设置规则的元数据。工作负载可以部署在集群范围内，也可以部署在一个命名空间内。

部署工作负载时，你可以使用任何镜像进行部署。可供选择的[工作负载类型]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/#workload-types)有多种，工作负载类型决定了你的应用程序的运行方式。

在工作负载部署之后，你可以继续使用它。你可以：

- 将工作负载[升级]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/upgrade-workloads)到它运行的应用的更新版本。
- 如果升级出现问题，将工作负载[回滚]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/rollback-workloads)到以前的版本。
- [添加一个 sidecar]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/add-a-sidecar)，这是一个支持主要工作负载的工作负载。

## 负载均衡和 Ingress

### 负载均衡器

启动应用程序后，它仅在集群中可用。无法从外部访问它。

如果你希望你的应用程序可以从外部访问，则必须向集群添加负载均衡器。如果用户知道负载均衡器的 IP 地址和应用的端口号，负载均衡器可以为外部连接创建一个访问集群的网关。

Rancher 支持两种类型的负载均衡器：

- [Layer-4 负载均衡器]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/load-balancers/#layer-4-load-balancer)
- [Layer-7 负载均衡器]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/load-balancers/#layer-7-load-balancer)

有关详细信息，请参阅[负载均衡器]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/load-balancers)。

#### Ingress

负载均衡器只能处理每个 service 的一个 IP 地址。换言之，如果你在集群中运行了多个 service，则必须为每个 service 配备一个负载均衡器。运行多个负载均衡器的花费可能非常高昂。因此，你可以使用 Ingress 来解决此问题。

Ingress 是一组充当负载均衡器的规则。Ingress 与一个或多个 Ingress Controller 一起动态路由 service 的请求。Ingress 收到请求时，集群中的 Ingress Controller 会对负载均衡器进行配置，从而根据你配置的 service 子域或路径规则将请求定向到正确的 service。

有关详细信息，请参阅 [Ingress]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/load-balancers-and-ingress/ingress)。

在项目中使用 Ingress 时，你可以通过设置全局 DNS 条目来将 Ingress 主机名编程到外部 DNS。

## 服务发现

使用负载均衡器和/或 Ingress 将集群公开给外部请求后，你只能通过 IP 地址访问集群。要创建可解析的主机名，你必须创建服务记录，该记录将 IP 地址、外部主机名、DNS 记录别名、工作负载或标记的 pod 映射到特定主机名。

有关详细信息，请参阅[服务发现]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/service-discovery)。

## Pipelines

在你的项目中[配置版本控制提供程序]({{<baseurl>}}/rancher/v2.6/en/project-admin/pipelines/#1-configure-version-control-providers)后，你可以添加仓库并开始为每个仓库配置管道。

有关详细信息，请参阅[管道]({{<baseurl>}}/rancher/v2.6/en/pipelines/)。

## 应用程序

除了启动应用程序的各个组件外，你还可以使用 Rancher 应用商店来启动应用，即 Helm Chart。

## Kubernetes 资源

在 Rancher 项目或命名空间的上下文中，_资源_ 是支持 Pod 操作的文件和数据。在 Rancher 中，证书、镜像仓库和密文都被视为资源。但是，Kubernetes 将资源划分为不同类型的[密文（secret）](https://kubernetes.io/docs/concepts/configuration/secret/)。因此，在单个项目或命名空间中，各个资源必须具有唯一的名称以避免冲突。资源主要用于承载敏感信息，但也有其他用途。

资源包括：

- [证书]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/certificates/)：用于加密/解密进入或离开集群的数据的文件。
- [ConfigMap]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/configmaps/)：存储一般配置信息的文件，例如一组配置文件。
- [密文]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/secrets/)：存储密码、token 或密钥等敏感数据的文件。
- [镜像仓库]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/registries/)：携带用于验证私有镜像仓库的凭证的文件。
