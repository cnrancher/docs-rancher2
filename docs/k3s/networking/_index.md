---
title: "网络"
description: 已知问题会定期更新，旨在告知您有关在下一发行版本中可能不会立即解决的问题。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - 网络
---

本页解释了 CoreDNS、Traefik Ingress 控制器和 Klipper service load balancer 如何在 K3s 中工作。

关于 Flannel 配置选项和后端选择的细节，或如何设置自己的 CNI，请参考[安装网络选项](/docs/k3s/installation/network-options/_index)页面。

关于 K3s 需要开放哪些端口，请参考[安装要求](/docs/k3s/installation/installation-requirements/_index#网络)。

- [CoreDNS](#coredns)
- [Traefik Ingress Controller](#traefik-ingress-controller)
- [Service Load Balancer](#service-load-balancer)
  - [Service LB 如何工作](#service-lb-如何工作)
  - [用法](#用法)
  - [从节点中排除 Service LB](#从节点中排除-service-lb)
  - [禁用 Service LB](#禁用-service-lb)
- [没有主机名的节点](#没有主机名的节点)

# CoreDNS

CoreDNS 是在 agent 节点启动时部署的。要禁用，请在每台服务器上运行`--disable coredns`选项。

如果你不安装 CoreDNS，你将需要自己安装一个集群 DNS 提供商。

## Traefik Ingress Controller

[Traefik](https://traefik.io/)是一个现代的 HTTP 反向代理和负载均衡器，它是为了轻松部署微服务而生的。在设计，部署和运行应用程序时，它简化了网络复杂性。

启动 server 时，默认情况下会部署 Traefik。更多信息请参见[自动部署清单](/docs/k3s/advanced/_index#自动部署清单)。默认的配置文件在`/var/lib/rancher/k3s/server/manifests/traefik.yaml`中，对该文件的任何修改都会以类似`kubectl apply`的方式自动部署到 Kubernetes 中。

Traefik ingress controller 将使用主机上的 80 和 443 端口（即这些端口不能用于 HostPort 或 NodePort）。

Traefik 可以通过编辑`traefik.yaml`文件进行配置。为了防止 k3s 使用或覆盖修改后的版本，请使用`--no-deploy traefik`部署 k3s，并将修改后的副本存储在`k3s/server/manifests`目录中。更多信息请参考官方的[Traefik 配置参数](https://github.com/helm/charts/tree/master/stable/traefik#configuration)。

要禁用它，请使用`--disable traefik`选项启动每个 server。

如果未禁用 Traefik，则 K3s 1.20 及更早版本将安装 Traefik v1，而 K3s 1.21 及更高版本将安装 Traefik v2（如果 v1 不存在）。

要从较旧的 Traefik v1 实例进行迁移，请参考[Traefik 文档](https://doc.traefik.io/traefik/migration/v1-to-v2/) 和[迁移工具](https://github.com/traefik/traefik-migration-tool)。

## Service Load Balancer

在你的 Kubernetes 集群中可以使用 service load balancer（LB）。K3s 提供了一个名为[Klipper Load Balancer](https://github.com/rancher/klipper-lb)的负载均衡器，它可以使用可用的主机端口。

上游 Kubernetes 允许创建 LoadBalancer 类型的 Service，但不包括 LB 的实现。某些 LB 服务需要云提供商，例如 Amazon EC2 或 Microsoft Azure。相比之下，K3s service LB 使得可以在没有云提供商的情况下使用 LB 服务。

### Service LB 如何工作

一些云提供商（如 Linode）会以 "localhost "作为主机名创建机器，而其他提供商可能根本没有设置主机名。这可能会导致域名解析的问题。你可以用`--node-name`标志或`K3S_NODE_NAME`环境变量来运行 K3s，这样就会传递节点名称来解决这个问题。
K3s 创建了一个控制器，该控制器为 service load balancer 创建了一个 Pod，这个 Pod 是[Service](https://kubernetes.io/docs/concepts/services-networking/service/)类型的 Kubernetes 对象。

对于每个 service load balancer，都会创建一个[DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)。 DaemonSet 在每个节点上创建一个前缀为`svc`的 Pod。

Service LB 控制器会监听其他 Kubernetes Services。当它找到一个 Service 后，它会在所有节点上使用 DaemonSet 为该服务创建一个代理 Pod。这个 Pod 成为其他 Service 的代理，例如，来自节点上 8000 端口的请求可以被路由到端口 8888 上的工作负载。

如果 Service LB 运行在有外部 IP 的节点上，则使用外部 IP。

如果创建多个 Services，则为每个 Service 创建一个单独的 DaemonSet。

只要使用不同的端口，就可以在同一节点上运行多个 Services。

如果您尝试创建一个在 80 端口上监听的 Service LB，Service LB 将尝试在集群中找到 80 端口的空闲主机。如果该端口没有可用的主机，LB 将保持 Pending 状态。

### 用法

在 K3s 中创建一个[LoadBalancer 类型的 Service](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)。

### 从节点中排除 Service LB

要排除节点使用 Service LB，请将以下标签添加到不应排除的节点上：

```
svccontroller.k3s.cattle.io/enablelb
```

如果使用标签，则 service load balancer 仅在标记的节点上运行。

### 禁用 Service LB

要禁用嵌入式 LB，请使用`--disable servicelb`选项运行 k3s server。

如果您希望运行其他 LB，例如 MetalLB，这是必需的。

## 没有主机名的节点

一些云提供商（如 Linode）会以 "localhost "作为主机名创建机器，而其他提供商可能根本没有设置主机名。这可能会导致域名解析的问题。你可以用`--node-name`标志或`K3S_NODE_NAME`环境变量来运行 K3s，这样就会传递节点名称来解决这个问题。
