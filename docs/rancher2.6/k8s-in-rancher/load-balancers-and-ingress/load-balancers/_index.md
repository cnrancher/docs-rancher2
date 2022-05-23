---
title: "四层和七层负载均衡"
description: "Kubernetes 支持四层负载均衡和七层负载均衡。了解对不同 deployment 的支持"
weight: 3041
---
Kubernetes 支持四层负载均衡和七层负载均衡。

## 四层负载均衡器

四层负载均衡器（或外部负载均衡器）将流量转发到 Nodeport。四层负载均衡器支持转发 HTTP 和 TCP 流量。

通常情况下，四层负载均衡器由底层云提供商支持，因此，如果你在裸金属服务器和 vSphere 集群上部署 RKE 集群，则不支持四层负载均衡器。但是，单个[全局管理的 config-map](https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/) 可用于在 NGINX 或第三方 Ingress 上公开服务。

> **注意**：你可以使用非云负载均衡器（例如 [MetalLB](https://metallb.universe.tf/)）来部署集群。但是，该用例比云提供商支持的四层负载均衡器更高级，而且不可以在 Rancher 或 RKE 中配置。

### 四层负载均衡支持

不同底层云提供商对四层负载均衡器的支持有所不同：

| 集群部署 | 四层负载均衡器支持 |
----------------------------------------------|--------------------------------
| Amazon EKS | 由 AWS 云提供商支持 |
| Google GKE | 由 GCE 云提供商支持 |
| Azure AKS | 由 Azure 云提供商支持 |
| EC2 上的 RKE | 由 AWS 云提供商支持 |
| DigitalOcean 上的 RKE | 受限的 NGINX 或第三方 Ingress\* |
| vSphere 上的 RKE | 受限的 NGINX 或第三方 Ingress\* |
| 自定义主机上的 RKE<br/>（例如裸金属服务器） | 受限的 NGINX 或第三方 Ingress\* |
| 第三方 MetalLB | 受限的 NGINX 或第三方 Ingress\* |

\* 可以通过单个[全局管理的 config-map](https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/) 来公开服务。

## 七层负载均衡器

七层负载均衡器（或 Ingress Controller）支持基于主机和路径的负载均衡和 SSL 终止。七层负载均衡器仅转发 HTTP 和 HTTPS 流量，因此它们仅侦听端口 80 和 443。亚马逊和谷歌等云提供商支持七层负载均衡器。此外，RKE 集群部署了 Nginx Ingress Controller。

### 七层负载均衡支持

不同底层云提供商对七层负载均衡器的支持有所不同：

| 集群部署 | 七层负载均衡器支持 |
----------------------------------------------|--------------------------------
| Amazon EKS | 由 AWS 云提供商支持 |
| Google GKE | 由 GKE 云提供商支持 |
| Azure AKS | 不支持 |
| EC2 上的 RKE | Nginx Ingress Controller |
| DigitalOcean 上的 RKE | Nginx Ingress Controller |
| vSphere 上的 RKE | Nginx Ingress Controller |
| 自定义主机上的 RKE<br/>（例如裸金属服务器） | Nginx Ingress Controller |

### 七层负载均衡器中的主机名

一些托管在云上的七层负载均衡器（例如 AWS 上的 ALB Ingress Controller）会为 Ingress 规则公开 DNS 地址。你需要（使用 CNAME）将你的域名映射到七层负载均衡器生成的 DNS 地址。

其他七层负载均衡器（例如 Google Load Balancer 或 Nginx Ingress Controller）会直接公开一个或多个 IP 地址。Google Load Balancer 提供了一个可路由的 IP 地址。Nginx Ingress Controller 公开了运行 Nginx Ingress Controller 的所有节点的外部 IP。你可以执行以下任一操作：

1. 配置你自己的 DNS，从而（使用 A 记录）将你的域名映射到七层负载均衡器公开的 IP 地址。
2. <ingressname><namespace>让 Rancher 为你的 Ingress 规则生成一个 xip.io 主机名。Rancher 将使用你公开的其中一个 IP（假设是 a.b.c.d）生成一个主机名（即 ..a.b.c.d.xip.io）。

使用 xip.io 的好处是你可以在创建 Ingress 规则后立即获得一个有效的入口点 URL。此外，如果你设置自己的域名，则需要配置 DNS 服务器并等待 DNS 传播。

## 相关链接

- [创建外部负载均衡器](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/)
