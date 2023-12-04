---
title: RBAC
description: 本节介绍了使用 rancher-cis-benchmark App 所需的权限。
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
  - CIS 扫描
  - rancher 2.5
  - RBAC
---

本节介绍了使用 `rancher-cis-benchmark` 应用所需的权限。默认情况下只有集群管理员才可以使用`rancher-cis-benchmark`应用。

但是，`rancher-cis-benchmark`chart 安装了以下两个默认的`ClusterRoles`：cis-admin 和 Home

在 Rancher 中，只有集群所有者和全局管理员默认拥有`cis-admin`访问权限。

:::note 注意
如果您使用的是 Rancher v2.5 设置中添加的`cis-edit`角色，那么它现在已经被删除了。因为在 Rancher v2.5.2 中因为`cis-edit`本质上和`cis-admin`是一样的。如果你碰巧创建了任何集群角色绑定。请将`cis-edit`替换为`cis-admin`。
:::

## Cluster-Admin 权限

Rancher CIS 扫描在默认情况下是一个仅有集群管理员的功能，这意味着只有 Rancher 全局管理员，以及集群的集群所有者可以执行以下功能：

- 安装和卸载 rancher-CIS-benchmark 应用。
- 查看 CIS 基准 CRD 的导航链接--ClusterScanBenchmarks、ClusterScanProfiles 和 ClusterScans。
- 列出默认的 ClusterScanBenchmarks 和 ClusterScanProfiles。
- 创建、编辑和删除新的 ClusterScanProfiles。
- 创建、编辑和删除一个新的 ClusterScan，以便在集群上运行 CIS 扫描。
- 查看和下载在 ClusterScan 完成后创建的 ClusterScanReport。

## Kubernetes 默认角色的默认权限摘要

rancher-sis-benchmark 创建了三个`ClusterRoles`，并将 CIS 基准 CRD 的访问权限添加到以下默认的 K8s`ClusterRoles`中。

| chart 创建的 ClusterRole | K8s 默认的 ClusterRole | 角色权限                                                                                      |
| :----------------------- | :--------------------- | :-------------------------------------------------------------------------------------------- |
| `cis-admin`              | `admin`                | 能够 CRUD clusterscanbenchmarks, clusterscanprofiles, clusterscans, clusterscanreports CR。   |
| `cis-view`               | `view `                | 能够列出(R) clusterscanbenchmarks, clusterscanprofiles, clusterscans, clusterscanreports CR。 |

默认情况下，只有集群所有者角色才有能力管理和使用 `rancher-cis-benchmark`功能。

其他 Rancher 角色（集群成员、项目所有者、项目成员）没有任何默认权限来管理和使用 rancher-cis-benchmark 资源。

但是如果集群所有者想要将访问权委托给其他用户，可以通过在这些用户和上述 CIS 集群角色之间手动创建 ClusterRoleBindings 来实现。
对于 `rancher-cis-benchmark`ClusterRoles 不支持自动角色聚合。
