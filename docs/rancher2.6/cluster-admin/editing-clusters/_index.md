---
title: 集群配置
weight: 2025
---

使用 Rancher 配置 Kubernetes 集群后，你仍然可以编辑集群的选项和设置。

有关编辑集群成员资格的信息，请转至[此页面]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/cluster-members)。

### 集群配置参考

集群配置选项取决于 Kubernetes 集群的类型：

- [RKE 集群配置](./rke-config-reference)
- [RKE2 集群配置](./rke2-config-reference)（技术预览）
- [K3s 集群配置](./k3s-config-reference)（技术预览）
- [EKS 集群配置](./eks-config-reference)
- [GKE 集群配置](./gke-config-reference)
- [AKS 集群配置](./aks-config-reference)

### 不同类型集群的管理功能

对于已有集群而言，可提供的选项和设置取决于你配置集群的方法。

下表总结了每一种类型的集群和对应的可编辑的选项和设置：

{{% include file="/rancher/v2.6/en/cluster-provisioning/cluster-capabilities-table" %}}
