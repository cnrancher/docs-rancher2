---
title: vSphere
---

在本节中，您将了解如何在 vSphere 中为 Rancher 管理的 RKE Kubernetes 集群设置 vSphere 云提供商。

在 Rancher 中创建 vSphere 群集时，请遵循这些步骤：

1. 将**云提供商**选项设置为 "custom"。
1. 单击**以 YAML 形式编辑**。
1. 在预先填充的集群 YAML 中插入以下结构。
   从 Rancher v2.3+开始，这个结构必须放在`rancher_kubernetes_engine_config`下。在 v2.3 之前的版本中，它必须被定义为一个顶层字段。注意`name`必须设置为`vsphere`。

   ```yaml
   rancher_kubernetes_engine_config: # Required as of Rancher v2.3+
     cloud_provider:
       name: vsphere
       vsphereCloudProvider: [Insert provider configuration]
   ```

Rancher 使用 RKE（Rancher Kubernetes Engine）来配置 Kubernetes 群集。有关`vsphereCloudProvider`指令属性的详细信息，请参考[RKE 文档中的 vSphere 配置参考](/docs/rke/config-options/cloud-providers/vsphere/config-reference/_index)。
