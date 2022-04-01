---
title: 配置树内 vSphere 云提供商
shortTitle: 树内云提供商
weight: 10
---

要设置树内 vSphere 云提供商，请在 Rancher 中创建 vSphere 集群时按照以下步骤操作：

1. 将 **Cloud Provider** 选项设置为 `Custom` 或 `Custom (In-Tree)`。
1. 单击**以 YAML 文件编辑**。
1. 将以下结构插入到预填充的集群 YAML。这个结构必须放在 `rancher_kubernetes_engine_config` 下。请注意，`name` *必须*设置为 `vsphere`。

   ```yaml
   rancher_kubernetes_engine_config:
     cloud_provider:
         name: vsphere
         vsphereCloudProvider:
             [Insert provider configuration]
   ```

Rancher 使用 RKE（Rancher Kubernetes Engine）来配置 Kubernetes 集群。有关 `vsphereCloudProvider` 的属性的详细信息，请参阅 RKE 文档中的 [vSphere 配置参考]({{<baseurl>}}/rke/latest/en/config-options/cloud-providers/vsphere/config-reference/)。
