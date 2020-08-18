---
title: "网络"
weight: 35
---

>**注意:** 本页解释了CoreDNS、Traefik Ingress控制器和Klipper service load balancer如何在K3s中工作。

请参阅[安装网络选项](/docs/k3s/installation/network-options/_index)页面，以获取有关Flannel配置选项和后端选择, 或如何设置自己的CNI的详细信息。

关于K3s需要开放哪些端口，请参考[安装要求](/docs/k3s/installation/installation-requirements/_index#网络)。

- [CoreDNS](#coredns)
- [Traefik Ingress Controller](#traefik-ingress-controller)
- [Service Load Balancer](#service-load-balancer)
  - [Service LB 如何工作](#service-lb-如何工作)
  - [用法](#用法)
  - [从节点中排除 Service LB](#从节点中排除-service-lb)
  - [禁用 Service LB](#禁用-service-lb)

## CoreDNS

CoreDNS会在agent启动时部署。要禁用，请在每个server上运行`--disable coredns`选项禁用coredns。

如果你不安装CoreDNS，你需要自己安装一个集群DNS提供商。

## Traefik Ingress Controller

[Traefik](https://traefik.io/)是一个现代的HTTP反向代理和负载均衡器，它是为了轻松部署微服务而生的。在设计，部署和运行应用程序时，它简化了网络复杂性。

启动server时，默认情况下会部署Traefik。更多信息请参见[自动部署清单](/docs/k3s/advanced/_index#自动部署清单)。默认的配置文件在`/var/lib/rancher/k3s/server/manifests/traefik.yaml`中，对该文件的任何修改都会以类似`kubectl apply`的方式自动部署到Kubernetes中。

Traefik ingress controller 将使用主机上的 80、443 和 8080 端口（即这些端口不能用于 HostPort 或 NodePort）。

Traefik可以通过编辑`traefik.yaml`文件进行配置。更多信息请参考官方的[Traefik配置参数](https://github.com/helm/charts/tree/master/stable/traefik#configuration)。

要禁用它，请使用`--disable traefik`选项启动每个server。

## Service Load Balancer

在你的Kubernetes集群中可以使用service load balancer（LB）。K3s提供了一个名为[Klipper Load Balancer](https://github.com/rancher/klipper-lb)的负载均衡器，它可以使用可用的主机端口。

上游Kubernetes允许创建LoadBalancer类型的Service，但不包括LB的实现。某些LB服务需要云提供商，例如Amazon EC2或Microsoft Azure。相比之下，K3s service LB使得可以在没有云提供商的情况下使用LB服务。

### Service LB 如何工作

K3s创建了一个控制器，该控制器为service load balancer创建了一个Pod，这个Pod是[Service](https://kubernetes.io/docs/concepts/services-networking/service/)类型的Kubernetes对象。

对于每个service load balancer，都会创建一个[DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)。 DaemonSet在每个节点上创建一个前缀为`svc`的Pod。

Service LB 控制器会监听其他Kubernetes Services。当它找到一个Service后，它会在所有节点上使用DaemonSet为该服务创建一个代理Pod。这个Pod成为其他Service的代理，例如，来自节点上8000端口的请求可以被路由到端口8888上的工作负载。

如果Service LB运行在有外部IP的节点上，则使用外部IP。

如果创建多个Services，则为每个Service创建一个单独的DaemonSet。

只要使用不同的端口，就可以在同一节点上运行多个Services。

如果您尝试创建一个在80端口上监听的Service LB，Service LB将尝试在集群中找到80端口的空闲主机。如果该端口没有可用的主机，LB将保持Pending状态。

### 用法

在K3s中创建一个[LoadBalancer类型的Service。](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)

### 从节点中排除 Service LB

要排除节点使用Service LB，请将以下标签添加到不应排除的节点上：

```
svccontroller.k3s.cattle.io/enablelb
```

如果使用标签，则service load balancer仅在标记的节点上运行。

### 禁用 Service LB

要禁用嵌入式LB，请使用`--disable servicelb`选项运行k3s server。

如果您希望运行其他LB，例如MetalLB，这是必需的。

## 没有主机名的节点

一些云提供商（如Linode）会以 "localhost "作为主机名创建机器，而其他提供商可能根本没有设置主机名。这可能会导致域名解析的问题。你可以用`--node-name`标志或`K3S_NODE_NAME`环境变量来运行K3s，这样就会传递节点名称来解决这个问题。
