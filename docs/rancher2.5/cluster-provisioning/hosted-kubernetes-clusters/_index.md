---
title: 创建托管的Kubernetes集群
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
  - 创建托管的Kubernetes集群
---

在这个场景中，Rancher 不提供 Kubernetes，因为它是由供应商安装的，例如 Google Kubernetes Engine，Amazon Elastic Container Service for Kubernetes 或 Azure Kubernetes 服务。

如果您使用 Kubernetes 提供商(例如：谷歌 GKE)提供的集群，Rancher 将与相应的云 API 对接。Rancher 允许您通过 Rancher UI 在托管的集群中创建和管理基于角色的访问控制。

在这种情况下，Rancher 使用云供应商的 API 向云供应商发送请求来创建或者更新托管集群。然后，提供商为您创建/更新并托管集群。当集群创建成功后，您可以像管理其他本地集群或云上集群一样，通过 Rancher UI 管理全部的集群。

Rancher 目前支持以下 Kubernetes 供应商：

| Kubernetes 提供商                                                                                              | 可用于 |
| -------------------------------------------------------------------------------------------------------------- | ------ |
| [谷歌 GKE (Google Kubernetes Engine)](https://cloud.google.com/kubernetes-engine/)                             | v2.0.0 |
| [亚马逊 EKS (Amazon Elastic Container Service for Kubernetes)](https://aws.amazon.com/eks/)                    | v2.0.0 |
| [微软 AKS (Azure Kubernetes Service)](https://azure.microsoft.com/en-us/services/kubernetes-service/)          | v2.0.0 |

## 托管 Kubernetes 提供商的身份验证

当使用 Rancher 创建由提供商托管的集群时，会提示您输入身份验证信息。Rancher 将用这个信息来访问云厂商的 API，详情请参阅以下文档：

- [创建 GKE 集群](/docs/rancher2.5/cluster-provisioning/hosted-kubernetes-clusters/gke/_index)
- [创建 EKS 集群](/docs/rancher2.5/cluster-provisioning/hosted-kubernetes-clusters/eks/_index)
- [创建 AKS 集群](/docs/rancher2.5/cluster-provisioning/hosted-kubernetes-clusters/aks/_index)
