---
title: 功能介绍
description: 用 Rancher 和 vSphere，您可以在本地体验云环境的操作。Rancher 可以在 vSphere 中创建节点并在其上安装 Kubernetes。在 vSphere 中创建 Kubernetes 集群时，Rancher 首先通过与 vCenter API 通信来创建指定数量的虚拟机。然后将 Kubernetes 安装在节点上。vSphere 集群可能由具有不同属性（例如内存或 vCPU 数量）的多组虚拟机组成。该分组允许对每个 Kubernetes 角色的节点大小进行细粒度的控制。
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
  - 功能介绍
---

## 概述

您可以使用 Rancher 和 vSphere 在本地体验云环境的操作。Rancher 可以在 vSphere 中创建节点并在其上安装 Kubernetes。创建 Kubernetes 集群时，Rancher 首先通过与 vCenter API 通信来创建指定数量的虚拟机，然后将 Kubernetes 安装在节点上。vSphere 集群可能由具有不同属性（例如内存或 vCPU 数量）的多组虚拟机组成。该分组允许对每个 Kubernetes 角色的节点大小进行细粒度的控制。

## Rancher v2.3.0 的 vSphere 改进

我们优化了 vSphere 节点驱动，使您可以通过以下增强功能在本地体验云环境的部署操作：

### 自我修复的节点池

_从 Rancher v2.3.0 开始可用_

自我修复节点池，也称为[节点自动替换功能](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/_index)，是使用 Rancher 设置 vSphere 节点的最大优势。自我修复节点池可以帮助您替换无状态应用程序的工作节点，当您使用 Rancher 通过节点模板创建节点时，Rancher 可以自动替换无法访问的节点。

> **重要：** 不建议在 master 节点或具有持久卷连接的节点的节点池上启用节点自动替换。当节点池中的节点失去与集群的连接时，其持久卷会被破坏，从而导致有状态应用程序丢失数据。

### 实例配置选项的动态获取

_从 Rancher v2.3.3 开始可用_

增强后的 vSphere 的节点模板在使用 vSphere 凭证创建节点模板时，模板选项会自动获取与在 vSphere 控制台中配置 VM 相同的选项。

对于要自动获取的字段，您的设置需要满足一些[先决条件](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/_index)。

### 更多操作系统的支持

在 Rancher v2.3.3+中，您可以在创建虚拟机时选择任意支持`cloud-init`的操作系统。目前 [cloud config](https://cloudinit.readthedocs.io/en/latest/topics/examples.html) 只支持 YAML 格式。

在 v2.3.3 之前版本的 Rancher 中包含的 vSphere 节点驱动程序仅支持以 [RancherOS](https://rancher.com/docs/os/v1.x/en/) 作为 VM 的操作系统。

## v2.3.3 节点模板功能的视频介绍

在这段 YouTube 视频中，我们演示了如何使用新的节点模板来帮助您在本地环境体验云环境一样的操作。

https://www.youtube.com/watch?v=dPIwg6x1AlU&feature=emb_logo

## 创建一个 vSphere Cluster

在 [本节](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/_index) 中，您将学习如何使用 Rancher 在 vSphere 中安装 [RKE]({{<baseurl>}}/rke/latest/en/) Kubernetes 集群。

## 配置存储

有关如何使用 Rancher 在 vSphere 中供应存储的示例，请参阅 [本节](/docs/rancher2/cluster-admin/volumes-and-storage/examples/vsphere/_index)。为了在 vSphere 中动态供应存储，必须 [启用 vSphere provider](/docs/rancher2/cluster-provisioning/rk-clusters/cloud-providers/vsphere/_index)

## 启用 vSphere Cloud Provider

在 Rancher 中设置云提供商时，Rancher 服务器可以自动为集群配置新的基础设施，包括新的节点或持久性存储设备。

有关详细信息，请参阅 [启用 vSphere 云提供商](/docs/rancher2/cluster-provisioning/rke-clusters/cloud-providers/vsphere/_index) 一节。
