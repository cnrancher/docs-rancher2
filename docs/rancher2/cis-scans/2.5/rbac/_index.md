---
title: RBAC
description: description
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
  - subtitles1
  - subtitles2
  - subtitles3
  - subtitles4
  - subtitles5
  - subtitles6
---

本节介绍了使用 rancher-cis-benchmark App 所需的权限。

rancher-cis-benchmark 默认情况下是一个只有集群管理员的功能。

但是，`rancher-cis-benchmark`图安装了这两个默认的`ClusterRoles`。

- cis-admin
- Home

在 Rancher 中，只有集群所有者和全局管理员默认拥有`cis-admin`访问权限。

注意：如果您使用的是 Rancher v2.5 设置中添加的 "cis-edit "角色，那么它现在已经被删除了，原因是
Rancher v2.5.2，因为它本质上和`cis-admin`是一样的。如果你碰巧创建了任何 clusterrolebindings。
对于 "cis-edit"，请更新为使用 "cis-admin "ClusterRole。

## Cluster-Admin 权限

Rancher CIS 扫描在默认情况下是一个仅有集群管理员的功能。
这意味着只有 Rancher 全局管理员，以及集群的集群所有者可以。

- 安装/卸载 Rancher -CIS -benchmark 应用。
- 请参阅 CIS 基准 CRD 的导航链接--ClusterScanBenchmarks, ClusterScanProfiles, ClusterScans。
- 列出默认的 ClusterScanBenchmarks 和 ClusterScanProfiles。
- 创建/编辑/删除新的 ClusterScanProfiles。
- 创建/编辑/删除一个新的 ClusterScan，以便在集群上运行 CIS 扫描。
- 查看和下载在 ClusterScan 完成后创建的 ClusterScanReport。

## Kubernetes 默认角色的默认权限摘要

rancher-sis-benchmark 创建了三个`ClusterRoles`，并将 CIS 基准 CRD 的访问权限添加到以下默认的 K8s`ClusterRoles`中。

| ClusterRole created by chart | Default K8s ClusterRole | Permissions given with Role                                                                        |
| ---------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| `cis-admin`                  | `admin`                 | Ability to CRUD clusterscanbenchmarks, clusterscanprofiles, clusterscans, clusterscanreports CR    |
| `cis-view`                   | `view `                 | Ability to List(R) clusterscanbenchmarks, clusterscanprofiles, clusterscans, clusterscanreports CR |

默认情况下，只有集群所有者角色才有能力管理和使用 "rancher-cis-benchmark "功能。

其他 Rancher 角色（集群成员、项目所有者、项目成员）没有任何默认权限来管理和使用 rancher-cis-benchmark 资源。

但是如果集群所有者想要将访问权委托给其他用户，可以通过在这些用户和上述 CIS 集群角色之间手动创建 ClusterRoleBindings 来实现。
对于 "rancher-cis-benchmark "ClusterRoles 不支持自动角色聚合。
