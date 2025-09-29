---
title: 同步
description: 在这个场景中，Rancher 不提供 Kubernetes，因为它是由供应商安装的，例如 Google Kubernetes Engine，Amazon Elastic Container Service for Kubernetes 或 Azure Kubernetes 服务。如果您使用 Kubernetes 提供商(例如：谷歌 GKE)提供的集群，Rancher 将与相应的云 API 对接。Rancher 允许您通过 Rancher UI 在托管的集群中创建和管理基于角色的访问控制。在这种情况下，Rancher 使用云供应商的 API 向云供应商发送请求来创建或者更新托管集群。然后，提供商为您创建/更新并托管集群。当集群创建成功后，您可以像管理其他本地集群或云上集群一样，通过 Rancher UI 管理全部的集群。
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
  - 创建集群
  - 创建托管集群
  - 同步
---

## 概述

同步是 EKS 和 GKE 集群的功能，它使 Rancher 更新集群的值，使它们与托管的 Kubernetes 提供商中的相应集群对象保持一致。这使得 Rancher 不是托管集群状态的唯一所有者。其最大的局限性是，在同一时间或在 5 分钟内处理来自 Rancher 和另一个来源的更新，可能会导致一个来源的状态完全覆盖另一个来源。

## 工作原理

在 Rancher Cluster 对象上有两个字段，要理解同步是如何工作的，必须了解。

1. 集群的配置对象，位于集群的 Spec 上。

   - 对于 EKS，该字段被称为 EKSConfig
   - 对于 GKE，该字段被称为 GKEConfig。

2. 2.上游规格（UpstreamSpec）对象

   - 对于 EKS，它位于集群状态的 EKSStatus 字段上。
   - 对于 GKE，它位于集群状态的 GKEStatus 字段上。

定义这些对象的结构类型可以在其相应的操作者项目中找到。

- [eks-operator](https://github.com/rancher/eks-operator/blob/master/pkg/apis/eks.cattle.io/v1/types.go)
- [GKE-operator](https://github.com/rancher/gke-operator/blob/master/pkg/apis/gke.cattle.io/v1/types.go)

除了集群名称、位置（地区或区域）、导入和云凭证参考之外，所有字段都可以在这个 Spec 对象上填写。

EKSConfig 或 GKEConfig 代表其非零值的期望状态。配置对象中非零的字段可以被认为是 "管理的"。当一个集群在 Rancher 中被创建时，所有字段都是非空的，因此是 "被管理的"。当一个预先存在的集群在 Rancher 中注册时，所有可忽略的字段都是空的，不是 "被管理的"。一旦 Rancher 改变了这些字段的值，这些字段就会成为被管理的。

UpstreamSpec 代表集群在托管的 Kubernetes 提供商中的情况，并以 5 分钟的时间间隔刷新。在 UpstreamSpec 被刷新后，Rancher 会检查集群是否有更新在进行。如果它正在更新，则不做任何进一步处理。如果它目前没有更新，EKSConfig 或 GKEConfig 上的任何 "管理 "字段都会被最近更新的 UpstreamSpec 上的相应值覆盖。

有效的期望状态可以被认为是 UpstreamSpec + EKSConfig 或 GKEConfig 中所有非零字段。这就是在用户界面中显示的内容。

如果 Rancher 和另一个来源试图在同一时间或在更新完成后的 5 分钟刷新窗口内更新集群，那么任何 "被管理 "的字段都有可能被卷入竞争条件。以 EKS 为例，一个集群可能有 PrivateAccess 作为一个受管字段。如果 PrivateAccess 是假的，然后在 EKS 控制台中启用，然后在 11:01 完成，然后在 11:05 之前从 Rancher 更新标签，该值可能会被覆盖。如果标签在集群处理更新时被更新，这也会发生。如果集群已经注册，并且 PrivateAccess 字段为零，那么在上述情况下，这个问题应该不会发生。
