---
title: 负载均衡
description: Kubernetes 通过四层负载均衡和七层负载均衡两种方式支持负载均衡。四层负载均衡器（或外部负载均衡器）将流量转发到 Pod 端口。第四层负载均衡器允许您转发 HTTP 和 TCP 通信。七层负载均衡器（或 Ingress 控制器）支持基于主机和路径的负载均衡以及 SSL 终止。第七层负载均衡器仅转发 HTTP 和 HTTPS 通信，因此它们仅侦听端口 80 和 443。像 Amazon 和 Google 这样的云提供商都支持七层负载均衡器。另外，RKE 集群会部署 Nginx Ingress 控制器作为七层负载均衡器。
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
  - 用户指南
  - 负载均衡和Ingress
  - 负载均衡
---

Kubernetes 通过**四层负载均衡**和**七层负载均衡**两种方式支持负载均衡。

## 什么是四层负载均衡器

四层负载均衡器（或外部负载均衡器）将流量转发到 Pod 端口。第四层负载均衡器允许您转发 HTTP 和 TCP 流量。

大部分云服务供应商都支持第四层负载均衡器，但是裸金属服务器和 VSphere 并不支持第四层负载均衡器。您可以通过配置[全局的配置映射](https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/)，在 NGINX 或第三方入口上公开集群内的服务。

> **注意：** 可以在集群中部署非云供应商的负载均衡器（例如 [MetalLB](https://metallb.universe.tf/)）。但是相对云提供商所支持的四层负载均衡器，它部署起来更复杂，并且不能在 Rancher 或 RKE 中进行配置。

## 不同的云服务供应商支持哪些四层负载均衡

对四层负载均衡器的支持因云服务供应商而异，详情请参考下表。

| 集群                                  | 是否支持四层负载均衡                    |
| :------------------------------------ | :-------------------------------------- |
| Amazon EKS                            | 是，由 AWS Cloud Provider 支持          |
| Google GKE                            | 是，由 GCE Cloud Provider 支持          |
| Azure AKS                             | 是，由 Azure Cloud Provider 支持        |
| RKE on EC2                            | 是，由 AWS Cloud Provider 支持          |
| RKE on DigitalOcean                   | 是，仅支持 NGINX 或其他第三方 Ingress\* |
| RKE on vSphere                        | 是，仅支持 NGINX 或其他第三方 Ingress\* |
| RKE on Custom Hosts(例如裸金属服务器) | 是，仅支持 NGINX 或其他第三方 Ingress\* |
| Third-party MetalLB                   | 是，仅支持 NGINX 或其他第三方 Ingress\* |

\* 可以通过一个唯一的[全局配置映射](https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/)暴露服务。

## 什么是七层负载均衡器

七层负载均衡器（或 Ingress 控制器）支持基于主机和路径的负载均衡以及 SSL 终止。第七层负载均衡器仅转发 HTTP 和 HTTPS 通信，因此它们仅侦听端口 80 和 443。像 Amazon 和 Google 这样的云服务供应商都支持七层负载均衡器。另外，RKE 集群会部署 Nginx Ingress 控制器作为七层负载均衡器。

## 不同的云服务供应商支持哪些七层负载均衡

对七层负载均衡器的支持因云提供商而异，详情请参考下表。

| 集群                                  | 是否支持七层负载均衡              |
| :------------------------------------ | :-------------------------------- |
| Amazon EKS                            | 是，由 AWS Cloud Provider 支持    |
| Google GKE                            | 是，由 GKE Cloud Provider 支持    |
| Azure AKS                             | 否，Azure AKS 不支持七层负载均衡  |
| RKE on EC2                            | 是，支持 Nginx Ingress Controller |
| RKE on DigitalOcean                   | 是，支持 Nginx Ingress Controller |
| RKE on vSphere                        | 是，支持 Nginx Ingress Controller |
| RKE on Custom Hosts(例如裸金属服务器) | 是，支持 Nginx Ingress Controller |

## 七层负载均衡器中的主机名称

云服务提供商托管的七层负载均衡器（例如 AWS 上的 ALB Ingress 控制器）暴露了 Ingress 规则的 DNS 地址。您需要（通过 CNAME）将域名映射到七层负载均衡器生成的 DNS 地址。

其他七层负载均衡器（例如 Google 负载均衡器或 Nginx Ingress Controller）直接暴露一个或多个 IP 地址。Google 负载均衡器提供了一个可路由的 IP 地址。Nginx Ingress 控制器暴露了运行 Nginx Ingress 控制器的所有节点的外部 IP。您可以执行以下任一操作：

- 配置您自己的 DNS，将您的域名映射到第七层负载均衡器暴露的 IP 地址。设置您自己的域名需要您配置 DNS 服务器并等待 DNS 生效。Rancher 将采用您暴露的 IP 之一，例如 a.b.c.d，并生成一个主机名 `<ingressname>.<namespace>.a.b.c.d.xip.io`
- 要求 Rancher 为您的 Ingress 规则生成 `xip.io` 主机名。使用 `xip.io` 的好处是，您可以在创建 Ingress 规则后立即获得一个有效的入口 URL。

## 相关链接

- [创建一个外部负载均衡器](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/)
