---
title: 通过托管 Kubernetes 提供商设置集群
weight: 3
---

在这种情况下，Rancher 不会配置 Kubernetes，因为它是由 Google Kubernetes Engine (GKE)、Amazon Elastic Container Service for Kubernetes 或 Azure Kubernetes Service 等提供商安装的。

如果你使用 Kubernetes 提供商，例如 Google GKE，Rancher 将与对应的云 API 集成，允许你从 Rancher UI 为托管集群创建和管理基于角色的访问控制。

在这个用例中，Rancher 使用提供商的 API 向托管提供商发送请求。然后，提供商会为你配置和托管集群。集群创建成功后，你可以像管理本地集群或云上集群一样，通过 Rancher UI 对集群进行管理。

Rancher 支持以下 Kubernetes 提供商：

- [Google GKE (Google Kubernetes Engine)](https://cloud.google.com/kubernetes-engine/)
- [Amazon EKS (Amazon Elastic Container Service for Kubernetes)](https://aws.amazon.com/eks/)
- [Microsoft AKS (Azure Kubernetes Service)](https://azure.microsoft.com/en-us/services/kubernetes-service/)
- [Alibaba ACK (Alibaba Cloud Container Service for Kubernetes)](https://www.alibabacloud.com/product/kubernetes)
- [Tencent TKE (Tencent Kubernetes Engine)](https://intl.cloud.tencent.com/product/tke)
- [Huawei CCE (Huawei Cloud Container Engine)](https://www.huaweicloud.com/en-us/product/cce.html)

## 托管 Kubernetes 提供商的身份验证

使用 Rancher 创建由提供商托管的集群时，你需要输入身份验证信息。Rancher 会使用验证信息来访问云厂商的 API。有关如何获取此信息的详情，请参阅：

- [创建 GKE 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/gke)
- [创建 EKS 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/eks)
- [创建 AKS 群集]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/aks)
- [创建 ACK 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/ack)
- [创建 TKE 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/tke)
- [创建 CCE 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/cce)
