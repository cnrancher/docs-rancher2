---
title: 配置树外 vSphere 云提供商
shortTitle: 树外云提供商
weight: 10
---

Kubernetes 正在逐渐不在树内维护云提供商。vSphere 有一个树外云提供商，可通过安装 vSphere 云提供商和云存储插件来使用。

本页介绍如何在启动集群后安装 Cloud Provider Interface (CPI) 和 Cloud Storage Interface (CSI) 插件。

## 前提

支持的 vSphere 版本：

- 6.7u3
- 7.0u1 或更高版本。

Kubernetes 版本必须为 1.19 或更高版本。

树外 vSphere 云提供商要求使用 Linux 节点，不支持 Windows 节点。

## 安装

在安装云存储接口 (CSI) 之前，应先安装云提供商接口 (CPI)。

### 1. 创建 vSphere 集群

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面上，单击**创建**。
1. 单击 **VMware vSphere** 或 **自定义**。
1. 在**集群配置**的**基本信息**选项卡中，将**云提供商**设置为 **vSphere**。
1. 在**附加配置**选项卡中，设置 vSphere Cloud Provider (CPI) 和 Storage Provider (CSI) 选项。
1. 完成集群创建。

### 2. 安装 CPI 插件

1. 点击 **☰ > 集群管理**。
1. 转到将安装 vSphere CPI 插件的集群，然后单击 **Explore**。
1. 单击**应用 & 应用商店 > Chart**。
1. 单击 **vSphere CPI**。
1. 填写所需的 vCenter 详细信息。
1. vSphere CPI 使用 vSphere CSI 驱动所需的 ProviderID 来初始化所有节点。在使用以下命令安装 CSI 驱动之前，检查是否所有节点都使用 ProviderID 进行了初始化：

   ```
   	kubectl describe nodes | grep "ProviderID"
   ```

### 3. 安装 CSI 插件

1. 点击 **☰ > 集群管理**。
1. 转到将安装 vSphere CSI 插件的集群，然后单击 **Explore**。
1. 单击**应用 & 应用商店 > Chart**。
1. 单击 **vSphere CSI**。
1. 单击**安装**。
1. 填写所需的 vCenter 详细信息。在**功能**选项卡中，将**启用 CSI 迁移**设置为 **false**。
1. 在**存储**选项卡中，填写 StorageClass 的详细信息。此 Chart 使用 `csi.vsphere.vmware.com` 作为置备程序来创建一个 StorageClass。
1. 单击**安装**。

## 使用 CSI 驱动来置备卷

CSI chart 默认创建一个 storageClass。

如果在启动 chart 时未选择该选项，请使用 `csi.vsphere.vmware.com` 作为置备程序来创建一个 storageClass。

使用此 StorageClass 置备的所有卷都将由 CSI 驱动配置。
