---
title: 配置说明
description: Cloud Provider是 Kubernetes 中的一个模块，提供用于管理节点，负载均衡器和网络路由的接口。有关更多信息，请参考有关 Cloud Provider 的 Kubernetes 官方文档。在Rancher 中设置 Cloud Provider 后，如果您使用的云提供商支持这种自动化，在部署 Kubernetes YAML 文件时，Rancher Server 可以自动创建新节点，负载均衡器或持久化存储设备。在配置了 Cloud Provider 的集群中，如果集群中的节点不满足先决条件，那么集群将无法创建成功。默认情况下， Cloud Provider选项设置为`None`。支持的 Cloud Provider 包括：Amazon和Azure。
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
  - 创建集群
  - 配置 Cloud Provider
  - 配置说明
---

**Cloud Provider** 是 Kubernetes 中的一个模块，提供用于管理节点，负载均衡器和网络路由的接口。有关更多信息，请参考[有关 Cloud Provider 的 Kubernetes 官方文档](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/)。

在 Rancher 中设置 Cloud Provider 后，如果您使用的云提供商支持这种自动化，在部署 Kubernetes YAML 文件时，Rancher Server 可以自动创建新节点，负载均衡器或持久化存储设备。

在配置了 Cloud Provider 的集群中，如果集群中的节点不满足先决条件，那么集群将无法创建成功。

默认情况下，**Cloud Provider** 选项设置为`None`。

支持的 Cloud Provider 包括:

- Amazon
- Azure

### 设置 Amazon Cloud Provider

有关启用 Amazon Cloud Provider 的详细信息，请参阅[此页面](/docs/cluster-provisioning/rke-clusters/cloud-providers/amazon/_index)。

### 设置 Azure Cloud Provider

有关启用 Azure Cloud Provider 的详细信息，请参阅[此页面](/docs/cluster-provisioning/rke-clusters/cloud-providers/azure/_index)。

### 设置 GCE Cloud Provider

有关启用 Google Compute Engine Cloud Provider 的详细信息，请参阅[此页面](/docs/cluster-provisioning/rke-clusters/cloud-providers/gce/_index)。

### 设置 自定义 Cloud Provider

任何的 [Kubernetes Cloud Provider](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/)，都可以通过`自定义` Cloud Provider 进行配置。

For the custom cloud provider option, you can refer to the [RKE docs](https://rancher.com/docs/rke/latest/en/config-options/cloud-providers/) on how to edit the yaml file for your specific cloud provider. There are specific cloud providers that have more detailed configuration :

对于自定义 Cloud Provider 选项，您可以参考 [RKE 文档](https://rancher.com/docs/rke/latest/en/config-options/cloud-providers/)，了解如何通过编辑 YAML 的方式，配置 Cloud Provider。以下还有一些更具体的 Cloud Provider 配置说明文档：

- [vSphere](https://rancher.com/docs/rke/latest/en/config-options/cloud-providers/vsphere/)
- [Openstack](https://rancher.com/docs/rke/latest/en/config-options/cloud-providers/openstack/)
