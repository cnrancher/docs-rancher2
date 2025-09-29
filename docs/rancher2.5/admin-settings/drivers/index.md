---
title: 驱动介绍
description: 使用 Rancher 中的驱动，您可以管理可以使用哪些供应商来创建托管的 Kubernetes 集群或节点，以允许 Rancher 部署和管理 Kubernetes。使用 Rancher 驱动，您可以启用/禁用 Rancher 中内置的驱动。另外，如果相关驱动 Rancher 尚未实现，您可以添加自己的驱动。
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
  - 系统管理员指南
  - 驱动管理
  - 驱动介绍
---

## 概述

使用 Rancher 中的驱动，您可以管理可以使用哪些供应商来创建[托管的 Kubernetes 集群](/docs/rancher2.5/cluster-provisioning/hosted-kubernetes-clusters/)或[节点](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/)，以允许 Rancher 部署和管理 Kubernetes。

Rancher 有两种驱动：

- [集群驱动](#集群驱动)
- [节点驱动](#节点驱动)

您可以启用或禁用 Rancher 中内置的驱动。如果相关驱动 Rancher 尚未实现，您可以添加自己的驱动。

## 集群驱动

_自 v2.2.0 起可用_

集群驱动用于配置[托管的 Kubernetes 集群](/docs/rancher2.5/cluster-provisioning/hosted-kubernetes-clusters/)，例如 GKE，EKS，AKS 等。在创建集群时显示哪个供应商的可用性是根据集群驱动的状态决定的。在创建托管 Kubernetes 集群的选项中，UI 仅显示集群驱动状态为`Active`的选项。默认情况下，Rancher 与几个现有的集群驱动打包在一起，但是您也可以创建自定义集群驱动，并添加到 Rancher 中。

默认情况下，Rancher 已激活了多个托管的 Kubernetes 云供应商，包括：

- [Amazon EKS](/docs/rancher2.5/cluster-provisioning/hosted-kubernetes-clusters/eks/)
- [Google GKE](/docs/rancher2.5/cluster-provisioning/hosted-kubernetes-clusters/gke/)
- [Azure AKS](/docs/rancher2.5/cluster-provisioning/hosted-kubernetes-clusters/aks/)

## 节点驱动

节点驱动用于创建节点，Rancher 可以用这些节点启动和管理 Kubernetes 集群。节点驱动就是[Docker Machine](https://docs.docker.com/machine/drivers/)。在创建集群时显示哪个供应商的可用性是根据节点驱动的状态决定的。在创建供应商提供节点的 Kubernetes 集群的选项中，UI 仅显示节点驱动状态为`Active`的选项。默认情况下，Rancher 内置了许多现有的 Docker Machine 驱动，但是您也可以创建自定义节点驱动，并添加到 Rancher 中。

如果您不想向用户显示特定的节点驱动，则需要停用这些节点驱动。

Rancher 支持几个主要的云供应商，默认情况下，这些节点驱动是激活的并可用于部署：

- [Amazon EC2](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/ec2/)
- [Azure](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/azure/)
- [Digital Ocean](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/digital-ocean/)
- [vSphere](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/vsphere/)
- 阿里云 （需要手动激活）
- 平安云 （需要手动激活）
