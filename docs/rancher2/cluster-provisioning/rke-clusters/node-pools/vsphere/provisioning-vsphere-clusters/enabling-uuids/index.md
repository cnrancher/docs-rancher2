---
title: 开启磁盘 UUIDs
description: 从 Rancher v2.0.4 开始，在 vSphere 节点模板中已经默认启用了磁盘 UUIDs。如果您在使用 2.0.4 以上的版本，请跳过此步骤。对于 v2.0.4 之前版本的 Rancher，我们建议在配置 vSphere 节点模板时自动启用磁盘 UUIDs，因为 Rancher 在操作 vSphere 资源时需要磁盘 UUIDs。
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
  - 创建节点和集群
  - vSphere
  - 开启磁盘 UUIDs
---

:::tip 提示
从 Rancher v2.0.4 开始，在 vSphere 节点模板中已经默认启用了磁盘 UUIDs。如果您在使用 2.0.4 以上的版本，请跳过此步骤。
:::

对于 v2.0.4 之前版本的 Rancher，我们建议在配置 vSphere 节点模板时自动启用磁盘 UUIDs，因为 Rancher 在操作 vSphere 资源时需要磁盘 UUIDs。

1. 以管理员身份登录 Rancher UI。

2. 跳转到 **节点模板** 页面。

3. 单击**添加或编辑现有的 vSphere 节点模板**。

4. 在 **实例选项** 中单击 **添加参数**。

5. 输入 `disk.enableUUID` 作为 key，输入 **TRUE**作为 value。

   ![vsphere-nodedriver-enable-uuid](/img/rke/vsphere-nodedriver-enable-uuid.png)

6. 单击 **创建** 或 **保存**。

**结果：** vSphere 节点模板已启用磁盘 UUID。
