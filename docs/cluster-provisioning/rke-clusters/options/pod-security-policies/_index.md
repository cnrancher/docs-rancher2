---
title: 配置 Pod 安全策略
description: Pod 安全策略 可以用来控制安全敏感的 Pod 字段（如 root 权限等）。当您创建一个新的 RKE 集群时，您可以立即配置集群使用 PSP。创建集群时，使用 集群选项 启用 PSP。分配给集群的 PSP 将成为该集群中项目的默认 PSP。
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
  - 集群配置参数
  - 配置 Pod 安全策略
---

_Pod 安全策略_ 可以用来控制安全敏感的 Pod 字段（如 root 权限等）。

### 添加一个默认的 Pod 安全策略

当您创建一个新的 RKE 集群时，您可以立即配置集群使用 PSP。创建集群时，使用 **集群选项** 启用 PSP。分配给集群的 PSP 将成为该集群中项目的默认 PSP。

> **先决条件:**
> 在 Rancher 中创建 Pod 安全策略。在将默认 PSP 分配给新集群之前，必须有可用于分配的 PSP。有关说明，请参阅[创建 Pod 安全策略](/docs/admin-settings/pod-security-policies/_index).

> **注意:**
> 出于安全考虑，我们建议您在创建集群时分配 PSP。

如果要启用默认 Pod 安全策略，您需要设置 RKE 集群的 **Pod 安全策略** 选项为 **启用**，然后在 **默认的 Pod 安全策略** 下拉菜单中进行选择。

当集群完成创建时，您选择的 PSP 将应用于集群中的所有项目。
