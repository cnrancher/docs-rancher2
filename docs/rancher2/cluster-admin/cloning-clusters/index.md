---
title: 克隆集群
description: 如果您在 Rancher 中有已经创建了一个集群，并希望用这个集群作为模板，创建其他集群，您可以使用 Rancher CLI 复制该集群的配置，对其进行编辑，快速创建集群。复制集群的功能适用于创建多个具有相似参数的集群，该功能的最终目的是简化创建集群的过程，减少用户在创建多个参数类似的集群的过程中所面临的重复工作。因此，我们建议仅编辑本文档中明确列出的值，编辑其他值可能会使配置文件无效，导致集群部署失败。如果您需要创建的多个集群中包含的参数差异较大，建议您参考“创建集群”章节的操作步骤，重头开始创建集群，而不是使用复制集群的功能创建集群。
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
  - 集群管理员指南
  - 克隆集群
---

## 概述

如果您在 Rancher 中有已经创建了一个集群，并希望用这个集群作为模板，创建其他集群，您可以使用 Rancher CLI 复制该集群的配置，对其进行编辑，快速创建集群。

Rancher 支持复制的集群类型如下表所示：

| 集群类型                                                                                               | 是否支持复制 |
| :----------------------------------------------------------------------------------------------------- | :----------- |
| [节点运行在基础设施供应商上的集群](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/) | 是           |
| [托管的 Kubernetes 集群](/docs/rancher2/cluster-provisioning/hosted-kubernetes-clusters/)        | 是           |
| [自定义集群](/docs/rancher2/cluster-provisioning/rke-clusters/custom-nodes/)                     | 是           |
| [导入的集群](/docs/rancher2/cluster-provisioning/imported-clusters/)                             | 否           |

:::note 警告
复制集群的功能适用于创建多个具有相似参数的集群，该功能的最终目的是简化创建集群的过程，减少用户在创建多个参数类似的集群的过程中所面临的重复工作。因此，我们建议仅编辑本文档中明确列出的值，编辑其他值可能会使配置文件无效，导致集群部署失败。如果您需要创建的多个集群中包含的参数差异较大，建议您参考“创建集群”章节的操作步骤，重头开始创建集群，而不是使用复制集群的功能创建集群。
:::

## 先决条件

- 已下载并安装[Rancher CLI](/docs/rancher2/cli/)。
- 已创建需要复制的集群。
- 如有必要，请[创建 API Key](/docs/rancher2/user-settings/api-keys/)。

## 导出集群配置

首先使用 Rancher CLI 导出要复制的集群配置。

1.  打开终端，然后将目录更改为 Rancher CLI 二进制文件 `rancher` 的位置。

2.  输入以下命令以列出 Rancher 管理的集群。

        ./rancher cluster ls

3.  找到要复制的集群，然后将其资源 `ID` 或 `NAME` 复制到剪贴板。从这一点开始，我们统一将资源 `ID` 或 `NAME` 为 `<RESOURCE_ID>`占位符代替。

4.  输入以下命令以导出集群的配置，请将`<RESOURCE_ID>`替换为真实的资源 ID。

        ./rancher clusters export <RESOURCE_ID>

    **步骤结果：** 复制输出到终端的集群 YAML。

5.  将 YAML 复制到剪贴板，粘贴到新文件中。将文件另存为 `cluster-template.yml`或其他任何名称，只要扩展名为 `.yml` 即可。

## 修改集群配置

使用您喜欢的文本编辑器为复制的集群修改`cluster-template.yml`中的集群配置。

> **注意：**从 Rancher v2.3.0 开始，集群配置指令必须嵌套在`cluster.yml`中的`rancher_kubernetes_engine_config`配置下。有关更多信息，请参阅[Rancher v2.3.0 +中的配置文件结构](/docs/rancher2/cluster-provisioning/rke-clusters/options/)。

1. 在您常用的文本编辑器中打开`cluster-template.yml`（或任何您命名的配置）。

   > **警告：** 仅编辑下面明确指定的集群配置值。此文件中列出的许多值用于配置复制的集群，并且编辑它们的值可能会使集群创建中断。

1. 如下例所示，在`<CLUSTER_NAME>`占位符处，用唯一的名称（`<CLUSTER_NAME>`）替换原始集群的名称，集群名称不可重复。

   ```yml
   Version: v3
   clusters:
     <CLUSTER_NAME>: # 输入唯一的集群名称
     dockerRootDir: /var/lib/docker
     enableNetworkPolicy: false
     rancherKubernetesEngineConfig:
     addonJobTimeout: 30
     authentication:
       strategy: x509
     authorization: {}
     bastionHost: {}
     cloudProvider: {}
     ignoreDockerVersion: true
   ```

1. 对于每个`nodePools`部分，在 `<NODEPOOL_NAME>` 占位符处用唯一名称替换原始节点池名称，节点名称不可重复。

   ```yml
   nodePools:
     <NODEPOOL_NAME>:
     clusterId: do
     controlPlane: true
     etcd: true
     hostnamePrefix: mark-do
     nodeTemplateId: do
     quantity: 1
     worker: true
   ```

1. 完成后，保存并关闭配置。

## 启动复制集群

将`cluster-template.yml`移到与 Rancher CLI 二进制文件相同的目录中。然后运行以下命令：

    ./rancher up --file cluster-template.yml

**结果：**您复制的集群开始配置。输入`./rancher cluster ls`进行确认。您还可以登录 Rancher UI 并打开**全局**视图以查看新创建的集群的进度。
