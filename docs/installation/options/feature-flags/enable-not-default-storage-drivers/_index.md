---
title: 允许使用非默认支持的存储驱动
description: 此功能允许您使用默认没有被启用的存储提供商的存储类和存储卷类型。
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
  - 安装指南
  - 资料、参考和高级选项
  - 功能开关
  - 允许使用非默认支持的存储驱动
---

_自 v2.3.0 起可用_

此功能允许您使用默认没有被启用的存储提供商的存储类和存储卷类型。

要启用或禁用此功能，请参阅[关于启用实验性功能的主页](/docs/installation/options/feature-flags/_index)。

| 环境变量 Key                  | 默认值  | 描述                                                         |
| ----------------------------- | ------- | ------------------------------------------------------------ |
| `unsupported-storage-drivers` | `false` | 此功能启用了默认没有被启用的存储提供商的存储类和存储卷类型。 |

## 默认情况下启用的持久卷插件的类型

以下是默认情况下启用的持久卷插件的存储类型的列表。启用此功能开关时，未在此列表中的所有持久卷插件都被视为实验性的，在 UI 中不显示：

| 名称                   | 插件                   |
| ---------------------- | ---------------------- |
| Amazon EBS Disk        | `aws-ebs`              |
| AzureFile              | `azure-file`           |
| AzureDisk              | `azure-disk`           |
| Google Persistent Disk | `gce-pd`               |
| Longhorn               | `flex-volume-longhorn` |
| VMware vSphere Volume  | `vsphere-volume`       |
| Local                  | `local`                |
| Network File System    | `nfs`                  |
| hostPath               | `host-path`            |

## 默认情况下启用的 StorageClass 的类型

以下是默认情况下启用的 StorageClass 的存储类型的列表。启用此功能开关时，未在此列表中的所有 StorageClass 都被视为实验性的，在 UI 中不显示：

| 名称                   | 插件                   |
| ---------------------- | ---------------------- |
| Amazon EBS Disk        | `aws-ebs`              |
| AzureFile              | `azure-file`           |
| AzureDisk              | `azure-disk`           |
| Google Persistent Disk | `gce-pd`               |
| Longhorn               | `flex-volume-longhorn` |
| VMware vSphere Volume  | `vsphere-volume`       |
| Local                  | `local`                |
