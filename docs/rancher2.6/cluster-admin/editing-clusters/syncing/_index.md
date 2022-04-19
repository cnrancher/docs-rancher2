---
title: 同步
weight: 10
---

同步是 EKS 和 GKE 集群的功能，它使 Rancher 更新集群的值，以便它们与托管在 Kubernetes 提供商中的相应集群对象保持一致。这使得 Rancher 不是托管集群状态的唯一所有者。其最大的局限性是，在同一时间或在 5 分钟内处理 Rancher 和另一个来源的更新时，可能会导致其中一个来源的状态被完全覆盖。

### 工作原理

要理解同步是如何工作的，则必须理解 Rancher Cluster 对象上的两个字段：

1. 集群的 config 对象，位于集群的规范上：

   - 对于 EKS，该字段称为 EKSConfig
   - 对于 GKE，该字段称为 GKEConfig

2. UpstreamSpec 对象

   - 对于 EKS，它位于集群状态的 EKSStatus 字段中。
   - 对于 GKE，它位于集群状态的 GKEStatus 字段中。

定义这些对象的结构类型可以在它们对应的 operator 项目中找到：

- [eks-operator](https://github.com/rancher/eks-operator/blob/master/pkg/apis/eks.cattle.io/v1/types.go)
- [gke-operator](https://github.com/rancher/gke-operator/blob/master/pkg/apis/gke.cattle.io/v1/types.go)

除集群名称、位置（区域或地区）、导入和云凭证引用之外，所有字段在此 Spec 对象上都是可为空的。

EKSConfig 和 GKEConfig 代表其非零值的期望状态。配置对象中非零的字段可以被认为是“管理的”。在 Rancher 中创建集群时，所有字段都是非零的，因此都是“管理”的。在把一个已存在的集群注册到 Rancher 时，所有可为空字段都是 nil 并且不是“管理”的。一旦 Rancher 更改了这些字段的值，这些字段就会被管理。

UpstreamSpec 代表集群在托管的 Kubernetes 提供商中的情况，并以 5 分钟的时间间隔刷新。刷新 UpstreamSpec 后，Rancher 会检查集群是否正在进行更新。如果它正在更新，则不做任何进一步处理。如果它目前没有更新，EKSConfig 或 GKEConfig 上的任何 "管理" 字段都会被最近更新的 UpstreamSpec 上的相应值覆盖。

有效的期望状态可以被认为是 UpstreamSpec + EKSConfig 或 GKEConfig 中的所有非零字段。这是 UI 中显示的内容。

如果 Rancher 和另一个来源试图在同一时间或在更新完成后的 5 分钟尝试更新集群，那么任何 "管理" 的字段都有可能陷入争用状态。以 EKS 为例，集群可能将 PrivateAccess 作为管理字段。如果 PrivateAccess 为 false，然后在 EKS 控制台中启用，且在 11:01 完成。在这种情况下，在 11:05 之前从 Rancher 更新的标签的值可能会被覆盖。如果在集群处理更新时更新了标签，也会发生这种情况。如果集群已注册并且 PrivateAccess 字段为零，那么在上述情况下，这个问题应该不会发生。
