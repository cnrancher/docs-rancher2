---
title: 直接通过下游集群（不经过 Rancher）进行认证的原理
description: 本节介绍 kubectl CLI、kubeconfig 文件和授权的集群终端如何协同工作，从而允许您直接访问下游的 Kubernetes 集群，而无需通过 Rancher Server进行身份验证。它的目的是为如何设置 kubectl 来直接访问集群提供背景信息和上下文的指示。
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
  - 集群管理员指南
  - 集群访问控制
  - 直接通过下游集群进行认证
---

本节提供了[如何设置 kubectl 来直接访问集群](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/_index)背景信息，介绍了 kubectl CLI、kubeconfig 文件和授权的集群终端如何协同工作，从而允许您直接访问下游的 Kubernetes 集群。

## 关于 kubeconfig 文件

_kubeconfig 文件_ 用于配置集群访问信息，每个集群都有一个 kubeconfig 文件。在开启了 TLS 的集群中，每次与集群交互时都需要身份认证，生产环境一般使用证书进行认证，其认证所需要的信息会放在 kubeconfig 文件中。您可以从 Rancher 中的 Cluster 视图下载对应的 kubeconfig 文件。下载 kubeconfig 文件后，您将能够使用 kubeconfig 文件及其 Kubernetes[上下文](https://kubernetes.io/docs/reference/kubectl/cheatsheet/#kubectl-context-and-configuration)访问下游集群。

_v2.4.6 可用_

如果管理员有[强制执行 kubeconfig token 的 TTL](/docs/rancher2.5/api/api-tokens/_index)，那么 kubeconfig 文件需要[rancher cli](/docs/rancher2.5/cli/_index)存在于你的 PATH 中。

## RKE 集群的两种身份验证方法

如果集群不是[RKE 集群](/docs/rancher2.5/cluster-provisioning/rke-clusters/_index)，kubeconfig 文件只允许您以一种方式访问集群：通过 Rancher Server 进行身份验证，然后 Rancher 允许您在集群上运行 kubectl 命令。

对于 RKE 集群，kubeconfig 文件允许您以两种方式进行身份验证:

**通过 Rancher Server 身份验证代理：** Rancher 的认证代理校验您的登录信息，然后把您连接到您想要访问的下游集群。

**直接使用下游集群的 API Server：** 默认情况下，RKE 集群会默认启用授权集群端点。这个端点允许您使用 kubectl CLI 和 kubeconfig 文件访问下游的 Kubernetes 集群，RKE 集群默认启用了该端点。在这个场景中，下游集群的 Kubernetes API Server 通过调用 Rancher 设置的 webhook ( `kube-api-auth` 微服务) 对您进行身份验证。

第二种方法是能够直接连接到集群的 Kubernetes API Server，在 Rancher 发生故障无法访问的时候，调用下游集群 API Server 这种方法提供了访问下游集群的备选方案。

要使用授权的集群端点，您需要配置 kubectl 来使用 Rancher 在创建 RKE 集群时为您生成的 kubeconfig 文件中的额外 kubectl 上下文。这个文件可以从 Rancher UI 的 cluster 视图中下载，配置 kubectl 的说明在[此页](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/_index)中

这些与下游 Kubernetes 集群通信的方法也在[架构页面](/docs/rancher2.5/overview/architecture/_index)上范围更广的上下文中解释了 Rancher 是如何工作的，以及 Rancher 是如何与下游集群通信的。

## 关于 kube-api-auth 认证 Webhook

部署 `kube-api-auth` 微服务是为了为[已授权的集群端点](/docs/rancher2.5/overview/architecture/_index)提供用户身份验证功能，该功能仅对[RKE 集群](/docs/rancher2.5/cluster-provisioning/rke-clusters/_index)可用。当您使用 `kubectl` 访问下游集群时，集群的 Kubernetes API 服务器将使用 `kube-api-auth` 作为 webhook 对您进行身份验证。

在集群创建过程中， `/etc/kubernetes/kube-api-authn-webhook.yaml` 文件被部署，而且 `kube-apiserver` 配置了 `--authentication-token-webhook-config-file=/etc/kubernetes/kube-api-authn-webhook.yaml`. 这将 `kube-apiserver` 配置为查询 `http://127.0.0.1:6440/v1/authenticate` 以确定 bearer tokens 的身份验证。

`kube-api-auth` 的调度规则如下:

_适用于 v2.3.0 及以上版本_

| 组件          | nodeAffinity nodeSelectorTerms                                                          | nodeSelector | Tolerations       |
| :------------ | :-------------------------------------------------------------------------------------- | :----------- | :---------------- |
| kube-api-auth | ` beta.kubernetes.io/os:NotIn:windows``node-role.kubernetes.io/controlplane:In:"true" ` | none         | `operator:Exists` |
