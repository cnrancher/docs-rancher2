---
title: 设置 Google Compute Engine 云提供商
weight: 3
---

在本节中，你将了解如何在 Rancher 中为自定义集群启用 Google Compute Engine (GCE) 云提供商。自定义集群指的是 Rancher 在现有节点上安装 Kubernetes 的集群。

详情请参见 [GCE 云提供商的官方 Kubernetes 文档](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#gce)。

> **先决条件**：GCE 上的 `Identity` 服务账号和 API 访问需要`Computer Admin`权限。

如果你使用 Calico：

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面中，进入自定义集群，点击 **⋮ > 编辑 YAML** 并输入如下配置：

   ```
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

如果你使用 Canal 或 Flannel：

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面中，进入自定义集群，点击 **⋮ > 编辑 YAML** 并输入如下配置：

   ```
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
