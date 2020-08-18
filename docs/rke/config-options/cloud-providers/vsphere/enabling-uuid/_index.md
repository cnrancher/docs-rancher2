---
title: 为 vSphere 虚拟机启用磁盘 UUIDs
---

## 概述

为了用 RKE 配置节点，必须用磁盘 UUID 配置所有节点，以便连接的 VMDK 向虚拟机呈现一致的 UUID，使磁盘能够正确挂载。

有三种方法可以为虚拟机启用磁盘 UUID，请根据您配置虚拟机的方法选择一种启用磁盘 UUID 的方式。

## 使用 vSphere 控制台

可以在 vSphere Console 中创建或修改虚拟机时设置所需属性。

1. 对于每个虚拟机，导航到**VM Options**选项卡，然后单击**Edit Configuration**。
2. 添加参数`disk.EnableUID`，其值为**TRUE**。
   ![vsphere-advanced-parameters](/img/rke/vsphere-advanced-parameters.png)

## 使用 GOVC CLI 工具

您还可以使用[govc](https://github.com/vmware/govmomi/tree/master/govc)命令行工具修改虚拟机的属性，启用磁盘 UUID。

```sh
$ govc vm.change -vm <vm-path> -e disk.enableUUID=TRUE
```

## 使用 Rancher 节点模板

在 Rancher v2.0.4+ 中，磁盘 UUID 默认在 vSphere 节点模板中启用。

如果您使用的是 v2.0.4 之前的 Rancher，请参考 [Rancher 文档](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/_index)，以了解有关如何在 Rancher 节点模板中启用 UUID 的详细信息。
