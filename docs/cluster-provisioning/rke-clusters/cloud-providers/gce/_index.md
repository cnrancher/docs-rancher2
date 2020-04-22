---
title: Google
description: 在本部分中，您将学习如何为 Rancher 中的自定义集群启用 Google Compute Engine（GCE）Cloud Provider。在自定义集群中，Ranche 可以将 Kubernetes 集群安装在现有节点上。GCE Cloud Provider 的官方 Kubernetes 文档在[此处](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#gce)。
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
  - Google Compute Engine（GCE）
---

在本部分中，您将学习如何为 Rancher 中的自定义集群启用 Google Compute Engine（GCE）Cloud Provider。在自定义集群中，Ranche 可以将 Kubernetes 集群安装在现有节点上。

GCE Cloud Provider 的官方 Kubernetes 文档在[此处](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#gce)。

> **前提条件：** GCE 上 的 `Identity and API` 服务账号需要 `Computer Admin` 权限。

如果您使用 Calico，

1. 转到 Rancher UI 中的集群视图，然后单击 **省略号 >编辑**。
1. 单击**编辑 YAML**，然后输入以下配置：

   ```yaml
   rancher_kubernetes_engine_config:
     cloud_provider:
       name: gce
       customCloudProvider: |-
         [Global]
         project-id=<your project ID, optional>
         network-name=<your network, optional if using default network>
         subnetwork-name=<your subnetwork of the above network, optional if using default network>
         node-instance-prefix=<your instance group name/your instance name specific prefix, required>
         node-tags=<your network tags, must patch one or some tags, required>
     network:
       options:
         calico_cloud_provider: "gce"
       plugin: "calico"
   ```

如果您使用 Canal 或 Flannel，

1. 转到 Rancher UI 中的集群视图，然后单击 **省略号 >编辑**。
1. 单击**编辑 YAML**，然后输入以下配置：

   ```yaml
   rancher_kubernetes_engine_config:
     cloud_provider:
       name: gce
       customCloudProvider: |-
         [Global]
         project-id=<your project ID, optional>
         network-name=<your network, optional if using default network>
         subnetwork-name=<your subnetwork of the above network, optional if using default network>
         node-instance-prefix=<your instance group name/your instance name specific prefix, required>
         node-tags=<your network tags, must patch one or some tags, required>
     services:
       kube_controller:
         extra_args:
           configure-cloud-routes: true # we need to allow the cloud provider configure the routes for the hosts
   ```
