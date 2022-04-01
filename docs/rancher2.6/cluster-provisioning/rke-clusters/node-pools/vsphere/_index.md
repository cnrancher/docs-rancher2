---
title: 创建 vSphere 集群
shortTitle: vSphere
description: 使用 Rancher 创建 vSphere 集群。集群可能包括具有不同属性的 VM 组，这些属性可用于细粒度控制节点的大小。
metaDescription: 使用 Rancher 创建 vSphere 集群。集群可能包括具有不同属性的 VM 组，这些属性可用于细粒度控制节点的大小。
weight: 2225
---

你可以结合使用 Rancher 与 vSphere，从而在本地体验云环境的操作。

Rancher 可以在 vSphere 中配置节点并在其上安装 Kubernetes。在 vSphere 中创建 Kubernetes 集群时，Rancher 首先通过与 vCenter API 通信来配置指定数量的虚拟机。然后在它们之上安装 Kubernetes。

vSphere 集群可能由多组具有不同属性的 VM 组成，例如内存量或 vCPU 数量。这种分组允许对每个 Kubernetes 角色的节点大小进行细粒度控制。

- [Rancher 2.3 中的 vSphere 增强功能](#vsphere-enhancements-in-rancher-v2-3)
- [创建 vSphere 集群](#creating-a-vsphere-cluster)
- [配置存储](#provisioning-storage)
- [启用 vSphere 云提供商](#enabling-the-vsphere-cloud-provider)

## Rancher 2.3 中的 vSphere 增强功能

我们更新了 vSphere 节点模板，使你可以通过以下增强功能在本地体验云操作：

### 自我修复的节点池

使用 Rancher 配置 vSphere 节点的最大优势之一，是允许你在本地集群中使用 Rancher 的自我修复节点池（也称为[节点自动替换功能]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#about-node-auto-replace)）。自我修复节点池的功能帮助你替换无状态应用的 worker 节点。当 Rancher 使用节点模板配置节点时，Rancher 可以自动替换无法访问的节点。

> **重要提示**：不建议在主节点或连接了持久卷的节点的节点池上启用节点自动替换，因为虚拟机会被临时处理。节点池中的节点与集群断开连接时，其持久卷将被破坏，从而导致有状态应用的数据丢失。

### 实例和调度的动态填充选项

vSphere 的节点模板已更新。当你使用 vSphere 凭证创建节点模板时，该模板会自动填充你在 vSphere 控制台中可以访问的相同的虚拟机配置选项。

要填充的字段设置需要满足[先决条件]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/#prerequisites)。

### 更多支持的操作系统

你可以使用任何支持 `cloud-init` 的操作系统来配置 VM。[cloud config](https://cloudinit.readthedocs.io/en/latest/topics/examples.html) 仅支持 YAML 格式。

### 2.3.3 节点模板功能的视频介绍

在这段 YouTube 视频中，我们演示了如何使用新的节点模板在本地环境体验云环境一样的操作。

{{< youtube id="dPIwg6x1AlU">}}

## 创建 vSphere 集群

在[本节](./provisioning-vsphere-clusters)中，你将学习如何使用 Rancher 在 vSphere 中安装 [RKE]({{<baseurl>}}/rke/latest/en/) Kubernetes 集群。

## 配置存储

有关如何使用 Rancher 在 vSphere 中配置存储的示例，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/examples/vsphere)。要在 vSphere 中动态配置存储，你必须[启用]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/vsphere) vSphere 云提供商。

## 启用 vSphere 云提供商

在 Rancher 中设置云提供商时，Rancher Server 可以自动为集群配置新的基础设施，包括新节点或持久存储设备。

有关详细信息，请参阅[启用 vSphere 云提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/vsphere)。
