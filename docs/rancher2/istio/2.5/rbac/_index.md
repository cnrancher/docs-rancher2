---
title: 基于角色的访问控制策略（RBAC）
description: 本节介绍了访问 Istio 功能所需的权限。
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
  - rancher 2.5
  - Istio
  - 基于角色的访问控制策略
---

## 概述

本节介绍了访问 Istio 功能所需的权限。

## 集群管理权限

默认情况下，`cluster-admin`可以执行以下操作：

- 在集群中安装 istio 应用。
- 为 Istio 配置资源分配。

## 管理和编辑权限

默认情况下，只有`istio-admin`和`istio-edit`可以执行以下操作：

- 启用和禁用 Istio 侧边框自动注入命名空间的功能。
- 将 Istio sidecar 添加到工作负载中。
- 查看该集群的流量指标和流量图。
- 配置 Istio 的资源（如网关、目标规则或虚拟服务）。

## Kubernetes 的默认权限摘要

Istio 创建了三个`ClusterRoles`，并将 Istio CRD 访问权限添加到以下默认的 K8s`ClusterRole`中。

| 通过 chart 创建 ClusterRole | 默认 K8s ClusterRole | Rancher 角色 |
| :-------------------------- | :------------------- | :----------- |
| `istio-admin`               | admin                | 项目所有者   |
| `istio-edit`                | edit                 | 项目成员     |
| `istio-view`                | view                 | 只读         |

Rancher 将继续使用集群所有者、集群成员、项目所有者、项目成员等作为角色名称，但将利用默认角色来确定访问权限。对于每个默认的 K8s`ClusterRole`都有不同的 Istio CRD 权限和 K8s 操作权限（Create（C）、Get（G）、List（L）、Watch（W）、Update（U）、Patch（P）、Delete（D）、All（\*））可以执行。详情请参考下表：

| CRDs                   | admin | edit | view |
| :--------------------- | :---- | :--- | :--- |
| config.istio.io        | GLW   | GLW  | GLW  |
| adapters               | GLW   | GLW  | GLW  |
| attributemanifests     | GLW   | GLW  | GLW  |
| handlers               | GLW   | GLW  | GLW  |
| httpapispecbindings    | GLW   | GLW  | GLW  |
| httpapispecs           | GLW   | GLW  | GLW  |
| instances              | GLW   | GLW  | GLW  |
| quotaspecbindings      | GLW   | GLW  | GLW  |
| quotaspecs             | GLW   | GLW  | GLW  |
| rules                  | GLW   | GLW  | GLW  |
| templates              | GLW   | GLW  | GLW  |
| networking.istio.io    | \*    | \*   | GLW  |
| destinationrules       | \*    | \*   | GLW  |
| envoyfilters           | \*    | \*   | GLW  |
| gateways               | \*    | \*   | GLW  |
| serviceentries         | \*    | \*   | GLW  |
| sidecars               | \*    | \*   | GLW  |
| virtualservices        | \*    | \*   | GLW  |
| workloadentries        | \*    | \*   | GLW  |
| security.istio.io      | \*    | \*   | GLW  |
| authorizationpolicies  | \*    | \*   | GLW  |
| peerauthentications    | \*    | \*   | GLW  |
| requestauthentications | \*    | \*   | GLW  |
