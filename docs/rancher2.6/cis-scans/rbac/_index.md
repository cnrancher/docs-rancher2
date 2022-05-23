---
title: 基于角色的访问控制
shortTitle: RBAC
weight: 3
---

本文介绍使用 rancher-cis-benchmark 应用所需的权限。

默认情况下，rancher-cis-benchmark 是集群管理员独有的功能。

但是，`rancher-cis-benchmark` Chart 安装了这两个默认的 `ClusterRole`：

- cis-admin
- cis-view

在 Rancher 中，默认情况下只有集群所有者和全局管理员具有 `cis-admin` 访问权限。

注意：如果你使用在 Rancher 2.5 中添加的 `cis-edit` 角色，该角色从 2.5.2 开始已被删除，删除的原因是该角色本质上与 `cis-admin` 相同。如果你为 `cis-edit` 创建了任何 clusterrolebinding，请更新这些绑定以使用 `cis-admin` ClusterRole。

## Cluster-Admin 访问

默认情况下，Rancher CIS 扫描是集群管理员独有的功能。
换言之，只有 Rancher 全局管理员和集群的集群所有者可以：

- 安装/卸载 rancher-cis-benchmark 应用。
- 查看 CIS Benchmark CRD 的导航链接 - ClusterScanBenchmarks、ClusterScanProfiles、ClusterScans。
- 列出默认的 ClusterScanBenchmarks 和 ClusterScanProfiles。
- 创建/编辑/删除新的 ClusterScanProfiles。
- 创建/编辑/删除新的 ClusterScan，从而在集群上运行 CIS 扫描。
- 在 ClusterScan 完成后查看并下载 ClusterScanReport。


## Kubernetes 默认角色的默认权限摘要

rancher-cis-benchmark 创建了三个 `ClusterRole`，并将 CIS Benchmark CRD 访问权限添加到以下默认 K8s `ClusterRole`：

| Chart 创建的 ClusterRole | 默认 K8s ClusterRole | 角色赋予的权限 |
| ------------------------------| ---------------------------| ---------------------------|
| `cis-admin` | `admin` | 增刪查改（CRUD）clusterscanbenchmarks、clusterscanprofiles、clusterscans、clusterscanreports CR |
| `cis-view` | `view ` | 列出 (R) clusterscanbenchmarks、clusterscanprofiles、clusterscans、clusterscanreports CR |


默认情况下，只有 cluster-owner 角色能管理和使用 `rancher-cis-benchmark` 功能。

默认情况下，其他 Rancher 角色（cluster-member、project-owner 和 project-member）没有管理和使用 rancher-cis-benchmark 资源的权限。

但是，如果 cluster-owner 想将访问权限分配给其他用户，他们可以手动创建目标用户与上述 CIS ClusterRole 之间的 ClusterRoleBinding，从而实现权限分配。
`rancher-cis-benchmark` ClusterRole 不支持自动角色聚合。
