---
title: 7、负载均衡
description: 如果您的应用程序是面向公众的并且消耗大量流量，则应在集群之前放置一个负载均衡器，以便用户始终可以访问其应用程序而不会中断服务。通常，您可以通过对您的部署进行[水平扩容](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)来满足大量服务请求，随着流量的增加它会增加应用程序容器的实例。然而，此技术需要路由以高效地在您的节点之间分配流量。如果您需要根据公网流量进行扩容或者缩容，那么您需要一个负载均衡器。
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
  - 版本迁移
  - 负载均衡
---

如果您的应用程序是面向公众的并且消耗大量流量，则应在集群之前放置一个负载均衡器，以便用户始终可以访问其应用程序而不会中断服务。通常，您可以通过对您的部署进行[水平扩容](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)来满足大量服务请求，随着流量的增加它会增加应用程序容器的实例。然而，此技术需要路由以高效地在您的节点之间分配流量。如果您需要根据公网流量进行扩容或者缩容，那么您需要一个负载均衡器。

如[文档](https://docs.rancher.com/docs/rancher/v1.6/en/cattle/adding-load-balancers/)所述，Rancher v1.6 使用基于 HAProxy 的微服务提供负载均衡的能力，该服务支持 HTTP，HTTPS，TCP 主机名和基于路径的路由。v2.x 中提供了大多数这些相同的功能。但是，您在 v1.6 中使用的负载均衡器无法迁移到 v2.x。您必须在 v2.x 中手动重新创建 v1.6 中的负载均衡器。

如果在由 v1.6 Compose 文件转化为 Kubernetes 清单后，遇到下面的`output.txt`中的内容，您必须通过在 v2.x 中手动创建负载均衡器来解决它。

<figcaption>
解决“output.txt”中的Load Balancer问题
</figcaption>

![解决负载均衡器指令](/img/rancher/resolve-load-balancer.png)

## 负载均衡器协议选项

默认情况下，Rancher v2.x 用原生[Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)替换了 v1.6 负载均衡器微服务，该服务由 NGINX Ingress Controller 支持，用于 7 层负载均衡。默认情况下，Kubernetes Ingress 仅支持 HTTP 和 HTTPS 协议，不支持 TCP。使用 Ingress 时，负载均衡仅限于这两种协议。

> **需要 TCP?** 请查看[TCP 负载均衡选项](#tcp-负载均衡选项)

## 负载均衡器部署

在 Rancher v1.6 中，您可以添加端口/服务规则，配置 HAProxy 以实现目标服务的负载均衡。您还可以配置基于主机名/路径的路由规则。

Rancher v2.x 提供了类似的功能，但是负载均衡由 Ingress 处理。Ingress 是负载均衡器规则的规范，由一个控制器来将这些规则应用到您的负载均衡上。实际的负载均衡器可以在集群之外或集群中运行。

默认情况下，Rancher v2.x 在使用 RKE（Rancher 自己的 Kubernetes 安装程序）配置的集群上部署 NGINX Ingress Controller，以处理 Kubernetes Ingress 规则。默认情况下，NGINX Ingress Controller 仅安装在 RKE 配置的集群中。由云服务提供商（如 GKE）配置的集群具有自己的 Ingress Controller，用于配置负载均衡器。对于本文档，我们的范围仅限于 RKE 安装的 NGINX Ingress Controller。

RKE 将 NGINX Ingress Controller 部署为 [Kubernetes DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)，这意味着 NGINX 实例已部署在集群中的每个节点上。NGINX 会作为一个 Ingress Controller，侦听在整个集群中的 Ingress 的创建，并且还将其自身配置为负载均衡器，以满足 Ingress 规则。这个 DaemonSet 使用主机网络并且暴露了两个端口：80 和 443。

有关更多关于 NGINX Ingress Controller 的信息，部署配置选项等，请查看[RKE 文档](https://docs.rancher.com/docs/rke/latest/en/config-options/add-ons/ingress-controllers/)。

## 负载均衡器架构

将 Ingress Controller 作为 DaemonSet 部署在 v2.x 中，带来了 v1.6 用户应该了解的一些体系结构更改。

在 Rancher v1.6 中，您可以在堆栈中部署可伸缩的负载均衡器服务。如果您在 Cattle 环境中有四个主机，则可以部署规模为 2 的负载均衡器服务，并通过将端口 80 附加到两个主机 IP 地址来指向您的应用程序。您还可以在其余两台主机上启动另一个负载均衡器，以再次使用端口 80 均衡另一服务，因为您的负载均衡器正在使用不同的主机 IP 地址。

<figcaption>Rancher v1.6 负载均衡架构</figcaption>

![Rancher v1.6 负载均衡](/img/rancher/cattle-load-balancer.svg)

Rancher v2.x Ingress Controller 是一个 DaemonSet，它全局部署在所有可调度节点上，以为整个 Kubernetes 集群服务。因此，在对 Ingress 规则进行编程时，因为负载均衡器节点 IP 地址以及端口 80 和 443 是所有工作负载的共用访问点，您必须使用唯一的主机名和路径来指向您的工作负载。

<figcaption>Rancher v2.x 负载均衡架构</figcaption>

![Rancher v2.x 负载均衡](/img/rancher/kubernetes-load-balancer.svg)

## Ingress 警告

尽管 Rancher v2.x 支持基于 HTTP 和 HTTPS 的主机名和路径的负载均衡，但是在配置工作负载时必须使用唯一的主机名和路径。此限制源自：

- Ingress 限制端口为 80 和 443 (即用于路由的 HTTP[S]端口)。
- 负载均衡器和 Ingress Controller 作为 DaemonSet 在集群中全局启动。

> **需要 TCP?** Rancher v2.x 仍然支持 TCP。查看 [TCP 负载均衡选项](#tcp-负载均衡选项) 解决方法。

## 部署 Ingress

您可以启动新的负载均衡器来替换您的 v1.6 负载均衡器。使用 Rancher v2.x UI，浏览到适用的项目并选择 **资源 > 工作负载 > 负载均衡**。(在 v2.3.0 之前的版本中，单击 **工作负载 > 负载均衡**) 然后点击 **添加规则**。在部署期间，您可以选择目标项目或命名空间。

> **先决条件:** 在部署 Ingress 之前，您必须先部署好运行两个或多个 pods 的工作负载。

![工作负载规格](/img/rancher/workload-scale.png)

为了在这两个 pods 之间保持平衡，您必须创建一个 Kubernetes Ingress 规则。要创建此规则，请导航到您的集群和项目，然后单击**资源>工作负载>负载均衡。**（在 v2.3.0 之前的版本中，单击**工作负载>负载均衡**）然后单击**添加规则**。下面的 GIF 描述了如何将 Ingress 添加到您的一个项目中。

<figcaption>添加规则</figcaption>

![添加规则](/img/rancher/add-ingress.gif)

与 Rancher v1.6 中的服务/端口规则类似，您可以在此处指定针对工作负载的容器端口规则。以下各节说明了如何创建 Ingress 规则。

### 基于主机名和路径的路由

使用 Rancher v2.x，您可以添加基于主机名或 URL 路径的 Ingress 规则。根据您创建的规则，NGINX Ingress Controller 会将流量路由到多个目标工作负载或 Kubernetes 服务。

例如，假设您有多个工作负载部署到了一个命名空间里。如下图所示，您可以添加一个 Ingress，以使用相同的主机名但使用不同的路径将流量路由到这两个工作负载。对 `foo.com/name.html`的 URL 请求会将用户定向到`web`工作负载，而对`foo.com/login`的 URL 请求将用户定向到`chat`工作量。

<figcaption>Ingress: 基于路径的路由配置</figcaption>

![Ingress：基于路径的路由配置](/img/rancher/add-ingress-form.png)

Rancher v2.x 还在 Ingress 记录上提供了指向工作负载的便捷链接。如果您使用外部 DNS 来配置 DNS 记录，该主机名可以映射到 Kubernetes Ingress 地址。

<figcaption>工作负载链接</figcaption>

![负载均衡器链接到工作负载](/img/rancher/load-balancer-links.png)

Ingress 地址是 Ingress Controller 为您的工作负载分配的集群中的 IP 地址。您可以通过浏览到该 IP 地址来访问您的工作负载。使用下面的`kubectl`命令查看控制器分配的 Ingress 地址：

```
kubectl get ingress
```

### HTTPS/证书选项

Rancher v2.x Ingress 功能支持 HTTPS 协议，但如果要使用它，则需要使用有效的 SSL/TLS 证书。在配置 Ingress 规则时，请使用**SSL/TLS 证书**部分来配置证书。

- 我们推荐[上传由可信 CA 签发的证书](/docs/k8s-in-rancher/certificates/_index)（必须在配置 Ingress 之前执行此操作）。然后，在配置负载均衡器时，使用**选择证书**选项，然后选择要使用的上传了的证书。
- 如果已配置 [NGINX 默认证书](https://docs.rancher.com/docs/rke/latest/en/config-options/add-ons/ingress-controllers/#configuring-an-nginx-default-certificate)，您可以选择**使用默认的 Ingress 证书**.

<figcaption>负载均衡配置：SSL/TLS证书部分</figcaption>

![SSL/TLS 证书部分](/img/rancher/load-balancer-ssl-certs.png)

### TCP 负载均衡选项

#### 四层负载均衡器

对于 TCP 协议，Rancher v2.x 支持配置 4 层负载均衡器。这个 4 层负载均衡器是由您的集群所在的云服务提供商提供的。在您配置了 Cloud Provider 之后，当您在部署工作负载时，您可以选择`4 层负载均衡器`选项进行端口映射时。Rancher 会自动创建相应的负载均衡服务。该服务将连接相应的云提供商，来配置负载均衡器，从而将请求路由到适当的 pod。有关如何为您的云提供商配置 Cloud Provider，查看[配置 Cloud Provider](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index)。

例如，如果我们创建名为`myapp`的部署并在**端口映射**部分中指定 4 层负载均衡器，则 Rancher 会自动将一个名为`myapp-loadbalancer`的条目添加到**负载均衡器**选项卡中。

<figcaption>工作负载部署：创建4层负载均衡器</figcaption>

![创建4层负载均衡器](/img/rancher/deploy-workload-load-balancer.png)

负载均衡器的配置成功后，Rancher UI 将提供指向工作负载的公共端点的链接。

#### 通过配置 ConfigMaps 使 NGINX Ingress Controller 支持 TCP

尽管 NGINX 支持 TCP，但 Kubernetes Ingress 本身不支持 TCP 协议。所以 NGINX Ingress Controller 无法做到开箱即用的 TCP 协议支持。

然而，有一种解决方法，可以通过创建 Kubernetes ConfigMap 来使用 NGINX 的 TCP 负载均衡。如[Ingress GitHub 自述文件](https://github.com/kubernetes/ingress-nginx/blob/master/docs/user-guide/exposing-tcp-udp-services.md)。您可以创建一个 ConfigMap 对象，该对象将 pod 配置参数存储为键值对，与 pod 镜像分开，如 [Kubernetes 文档](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)。

如果要通过配置 NGINIX 以 TCP 的协议暴露您的服务，您可以配置在`ingress-nginx`命名空间中的名称为`tcp-services`的 ConfigMap。该命名空间也包含 NGINX Ingress Controller 容器。

![4层负载均衡器：ConfigMap解决方法](/img/rancher/layer-4-lb-config-map.png)

ConfigMap 条目中的键是要暴露访问的 TCP 端口：`<namespace/service name>:<service port>`。如上所示，在`Default`命名空间中列出了两个工作负载。例如，上面的 ConfigMap 中的第一个条目指示 NGINX 通过外部端口`6790`暴露`myapp`工作负载（在`default`命名空间中的工作负载，监听私有端口 80）。将这些条目添加到 ConfigMap 会自动更新 NGINX 容器，以配置这些工作负载以实现 TCP 均衡。暴露的工作负载应在`<NodeIP>:<TCP Port>`中可用。如果无法访问它们，则可能必须使用 NodePort 服务显式公开 TCP 端口。

## Rancher v2.x 负载均衡限制

Cattle 提供了功能丰富的负载均衡器支持，可以参阅[相关文档](https://docs.rancher.com/docs/rancher/v1.6/en/cattle/adding-load-balancers/#load-balancers)。其中一些功能在 Rancher v2.x 中没有等效功能。以下是这些功能的列表：

- 当前的 NGINX Ingress Controller 不支持 SNI。
- TCP 负载均衡需要集群中的云提供商启用的负载均衡器设备。Kubernetes 上没有对 TCP 的 Ingress 支持。
- 只能用 80 端口和 443 端口来路由 HTTP/HTTPS 请求。Ingress Controller 通过 DaemonSet 的方式全局部署，所以不作为可伸缩服务来启动。此外，用户不能分配随机的外部端口用于均衡。因此，用户需要确保配置唯一的主机名/路径组合，以避免使用相同的两个端口而导致的路由冲突。
- 无法指定端口规则优先级和顺序。
- Rancher v1.6 添加了对优雅停止后端连接和指定优雅停止超时的支持。Rancher v2.x 不支持此功能。
- 目前 Rancher v2.x 中不支持指定自定义粘性策略和附加到默认配置的自定义负载均衡器配置。但是，原生的 Kubernetes 中提供了一些支持，用于自定义 NGINX 配置，如[NGINX Ingress Controller 自定义配置文档](https://kubernetes.github.io/ingress-nginx/examples/customization/custom-configuration/).

## 迁移完成！
