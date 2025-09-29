---
title: Dual-stack
description: nodes是cluster.yml文件中唯一需要填写的部分，它被 RKE 用来指定集群节点、用于访问节点的 ssh 凭证以及这些节点在 Kubernetes 集群中的角色。它被 RKE 用来指定集群节点、用于访问节点的 ssh 凭证以及这些节点在 Kubernetes 集群中的角色。
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
  - RKE
  - 配置选项
  - Dual-stack
---

从 RKE `v1.3.0`开始，增加了 [Dual-stack](https://kubernetes.io/docs/concepts/services-networking/dual-stack/) 网络支持，它允许同时分配 IPv4 和 IPv6 地址给 pod 和 services。

## 要求

为了使用 Dual-stack 功能，RKE 和它所部署的基础设施必须配置如下：

- 使用 Kubernetes 1.21 或更新版本。
- RKE 配置为使用 Calico 作为容器网络接口（CNI）提供商。不支持其他供应商。
- RKE 部署在具有以下先决条件的 Amazon EC2 实例上：
  - 启用 IPv6 支持：在 VPC 及其子网设置网络范围。
  - 在 VPC 路由中添加一个 IPv6 默认网关。
  - 在集群的安全组中添加 IPv6 流量的入站/出站规则。
  - 确保实例已启用 `Auto-assign IPv6 IP`。请参阅 [AWS 文档](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html)了解相关说明。
  - 禁用集群中所有实例的源/目的地检查。请参阅 [AWS 文档](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html#EIP_Disable_SrcDestCheck) 以了解相关说明。

关于为 IPv6 配置 AWS 系统的更多信息，请参考 AWS [Getting started with IPv6](https://docs.aws.amazon.com/vpc/latest/userguide/get-started-IPv6.html) 文档。

## RKE 配置示例

下面是一个 RKE 配置的例子，可以用来部署配置了 Dual-stack 支持的 RKE：

```
kubernetes_version: "v1.21.1-rancher2-1"
services:
  kube-api:
    service_cluster_ip_range: 10.43.0.0/16,fd98::/108
  kube-controller:
    service_cluster_ip_range: 10.43.0.0/16,fd98::/108
    cluster_cidr: 10.42.0.0/16,fd01::/64
network:
  plugin: calico
```
