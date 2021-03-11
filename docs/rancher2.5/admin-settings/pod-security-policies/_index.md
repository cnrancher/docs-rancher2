---
title: Pod 安全策略
description: Pod 安全策略是控制 Pod 安全的规范（如是否可以使用 root 权限等）的对象。如果 Pod 不符合 PSP 中指定的条件，Kubernetes 将不允许其启动，并且 Rancher 中将显示错误消息Pod <NAME> is forbidden unable to validate...。RKE 元数据功能允许您在发布新版本的 Kubernetes 后立即为集群配置它们，而无需升级 Rancher。此功能对于使用 Kubernetes 的补丁版本非常有用，例如，如果您希望在仅支持 Kubernetes v1.14.6 的 Rancher Server 版本中，将业务集群升级到 Kubernetes v1.14.7。
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
  - Pod 安全策略
---

## 概述

**Pod 安全策略** (PSP) 是控制 Pod 安全的规范（如是否可以使用 root 权限等）的对象。如果 Pod 不符合 PSP 中指定的条件，Kubernetes 将不允许其启动，并且 Rancher 中将显示错误消息`Pod <NAME> is forbidden: unable to validate...`。

## Pod 安全策略工作原理

- 您可以在集群或项目级别分配 PSP。
- PSP 通过继承的方式工作。

  - 默认情况下，分配给集群的 PSP 由其项目以及添加到这些项目的任何命名空间继承。
  - **例外：** 无论 PSP 是分配给集群还是项目，未分配给项目的命名空间不会继承 PSP。由于这些命名空间没有 PSP，因此将工作负载部署到这些命名空间将失败，这是 Kubernetes 的默认行为。
  - 您可以通过直接向项目分配其他 PSP 来覆盖默认 PSP。

- 在分配 PSP 之前，集群或项目中已经在运行的任何工作负荷是否符合 PSP 的规定，将不会进行检查。需要克隆或升级工作负载以查看它们是否通过了 PSP。

在 [Kubernetes 文档](https://kubernetes.io/docs/concepts/policy/pod-security-policy/)中了解有关 Pod 安全策略的更多信息。

## 默认 Pod 安全策略

_自 v2.0.7 起可用_

Rancher 内置了两个默认的 Pod 安全策略（PSP）：`受限`和`不受限`策略。

### 受限策略

该策略基于 Kubernetes [示例受限策略](https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/policy/restricted-psp.yaml)。它极大地限制了可以将哪些类型的 Pod 部署到集群或项目中。这项策略：

- 阻止 Pod 以特权用户身份运行，并防止特权升级。
- 验证服务器所需的安全性机制是否到位(例如，限制哪些卷可以被挂载，以及防止添加 root 补充组)。

### 不受限策略

该策略等效于在禁用 PSP 控制器的情况下运行 Kubernetes。对于可以将哪些 Pod 部署到集群或项目中，它没有任何限制

## 创建 Pod 安全策略

### 前提条件

- Rancher 只能为[使用 RKE 启动的集群分配 Pod 安全策略](/docs/rancher2.5/cluster-provisioning/rke-clusters/_index)
- 在将 PSP 分配给项目之前，你必须先在集群层面启用 PSP。这可以通过[编辑集群](/docs/rancher2.5/cluster-admin/editing-clusters/_index)来配置。
- 最好的做法是在集群层面设置 PSP。
- 我们建议在集群和项目创建期间添加 PSP，而不是将其添加到现有的项目中。

### 操作步骤

1. 在**全局**视图中，从主菜单中选择**安全性 > Pod 安全策略**。然后单击**添加策略**。

   **步骤结果：** 将打开**添加策略**表单。

2. 命名策略。

3. 填写表格的每个部分。请参阅 [Kubernetes 文档](https://kubernetes.io/zh/docs/concepts/policy/pod-security-policy/)，以获取有关每个策略的作用的更多信息。

## 后续操作

您可以在以下场景中中添加 Pod 安全策略（PSP)：

- [创建集群时](/docs/rancher2.5/cluster-provisioning/rke-clusters/options/pod-security-policies/_index)
- [编辑现有集群时](/docs/rancher2.5/cluster-admin/editing-clusters/_index)
- [创建项目时](/docs/rancher2.5/cluster-admin/projects-and-namespaces/_index)
- [编辑现有项目时](/docs/rancher2.5/project-admin/_index)

> **注意：** 我们建议在集群和项目创建期间添加 PSP，而不是将 PSP 添加到现有的集群和项目中。
