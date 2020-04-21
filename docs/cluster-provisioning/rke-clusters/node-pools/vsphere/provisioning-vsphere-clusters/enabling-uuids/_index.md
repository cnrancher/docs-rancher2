---
title: 开启磁盘 UUIDs
description: 从 Rancher v2.0.4 开始，在 vSphere 节点模板中已经默认启用了磁盘 UUIDs。如果您在使用 2.0.4 以上的版本，请跳过此步骤。对于 v2.0.4 之前版本的 Rancher，我们建议在配置 vSphere 节点模板时自动启用磁盘 UUIDs，因为 Rancher 在操作 vSphere 资源时需要磁盘 UUIDs。
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
  - 创建节点和集群
  - vSphere
  - 开启磁盘 UUIDs
---

:::note 提示
从 Rancher v2.0.4 开始，在 vSphere 节点模板中已经默认启用了磁盘 UUIDs。如果您在使用 2.0.4 以上的版本，请跳过此步骤。
:::

对于 v2.0.4 之前版本的 Rancher，我们建议在配置 vSphere 节点模板时自动启用磁盘 UUIDs，因为 Rancher 在操作 vSphere 资源时需要磁盘 UUIDs。

为所有创建的 VM 启动磁盘 UUIDs，

1. 在 Rancher UI 中以管理员登录，然后跳转到 **节点模板** 页面。

2. 添加或编辑现有的 vSphere 节点模板。

3. 在 **实例选项** 中点击 **添加参数**。

4. 输入 `disk.enableUUID` 作为 key，填写 value 为 **TRUE**.

   ![vsphere-nodedriver-enable-uuid](/img/rke/vsphere-nodedriver-enable-uuid.png)

5. 点击 **创建** 或 **保存**。

**结果：** vSphere 节点模板已启用磁盘 UUID。
