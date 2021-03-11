---
title: 创建凭证
description: 本节介绍了如何创建 vSphere 用户名和密码。您需要将这些 vSphere 凭证提供给 Rancher，以便 Rancher 可以在 vSphere 中创建资源。
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
  - 创建凭证
---

本节介绍了如何创建 vSphere 用户名和密码。您需要将这些 vSphere 凭证提供给 Rancher，以便 Rancher 可以在 vSphere 中创建资源。

下面的表格列出了 vSphere 用户账户需要的权限：

| 权限组          | 操作                                                                                                                                               |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datastore       | AllocateSpace <br /> Browse <br /> FileManagement (Low level file operations) <br /> UpdateVirtualMachineFiles <br /> UpdateVirtualMachineMetadata |
| Network         | Assign                                                                                                                                             |
| Resource        | AssignVMToPool                                                                                                                                     |
| Virtual Machine | Config (All) <br /> GuestOperations (All) <br /> Interact (All) <br /> Inventory (All) <br /> Provisioning (All)                                   |

以下步骤将创建具有所需权限的角色，并在 vSphere 控制台中将其分配给指定用户：

1. 从**vSphere**控制台中，进入**Administration**页面。

2. 进入**Roles**选项卡。

3. 创建一个新角色并命名，然后选择上面的表格中列出的权限。

   ![image](/img/rancher/rancherroles1.png)

4. 选择 **Users and Groups** 选项卡。

5. 创建一个新用户，填写表单，然后单击**OK**。请确保记下用户名和密码，在 Rancher 中配置节点模板时需要用到这里的用户名和密码。

   ![image](/img/rancher/rancheruser.png)

6. 选择 **Global Permissions** 选项卡。

7. 创建一个新的全局权限。添加您先前创建的用户，并将先前创建的角色应用到该用户，单击**OK**。

   ![image](/img/rancher/globalpermissionuser.png)

   ![image](/img/rancher/globalpermissionrole.png)

**结果:** 获得可用于操作 vSphere 资源的凭证。
