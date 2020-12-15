---
title: Rancher 部署策略
description: 本文提供了两种部署 Rancher 的策略：轴心方式拓扑和区域性拓扑，每种方法都有优缺点，请按照您的场景选择最适合的部署策略。
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
  - 最佳实践及使用技巧
  - Rancher 部署策略
---

本文提供了两种部署 Rancher 的策略，每种方法都有优缺点，请按照您的场景选择最适合的部署策略：

## 轴心方式拓扑

在轴心部署场景中，由一个 Rancher control-plane 来管理遍布全球的 Kubernetes 集群。control-plane 在一个高可用的 Kubernetes 集群上运行，但这种部署策略会受到延迟的影响。

![Hub and Spoke Deployment](/img/rancher/bpg/hub-and-spoke.png)

### 优点

- 环境可以具有跨区域的节点和网络连接。
- 单一 control-plane 界面，查看所有区域和环境。
- Kubernetes 不需要 Rancher 操作，并且可以容忍失去与 Rancher control-plane 的连接。

### 缺点

- 受制于网络延迟。
- 如果 control-plane 失效，在恢复之前全球范围内无法新建集群，但是每个 Kubernetes 集群可以继续单独管理。

## 区域性拓扑

在区域部署模中，多个 Rancher control-plane 被部署在靠近计算节点的地方，不会受到延迟的影响。

![Regional Deployment](/img/rancher/bpg/regional.png)

### 优点

- 即使另一个区域的 control-plane 发生故障，本区域内的 Rancher 功能仍然可以保持运行状态。
- 网络延迟大大降低，提高 Rancher 的性能。
- Rancher control-plane 的升级可以在每个区域独立完成。

### 缺点

- 管理多个 Rancher 安装的开销较大。
- 需要在多个界面中才能查看到全球所有的 Kubernetes 集群。
- 在 Rancher 中部署多集群应用时，需要在每个 Rancher Server 中重复这个过程。
