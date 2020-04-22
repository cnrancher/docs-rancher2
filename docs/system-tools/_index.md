---
title: 介绍
description: 安装 Rancher 的方式有两种：单节点安装和高可用集群安装。因为单节点安装只适用于测试和 demo 环境，而且单节点安装和高可用集群安装之间不能进行数据迁移，所以我们推荐从一开始就使用高可用集群安装的方式安装 Rancher。本文将详细介绍高可用集群安装的配置方式。如果您仍然准备在单节点上安装 Rancher，本文只有分开部署 Rancher 与下游集群的部分适用于单节点安装。
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
  - 系统工具
---

## 概述

系统工具是 Rancher 自带的运维工具，您可以使用系统工具管理[RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)和[高可用集群](/docs/installation/k8s-install/kubernetes-rke/_index)。系统工具提供了`logs`、`stats`和`remove`三类指令，分别对应以下三种用途：

- [收集 Kubernetes 日志](#收集-kubernetes-日志)：从节点收集 Kubernetes 集群组件的日志。
- [查看节点系统指标](#查看节点系统指标)：从节点收集系统指标。
- [移除 Kubernetes 资源](#移除-kubernetes-资源)：移除 Kubernetes 集群内 Rancher 创建的资源。

## 下载系统工具

您可以从[GitHub](https://github.com/rancher/system-tools/releases/latest)下载最新版的系统工具，下载时请根据您的操作系统选择对应的版本。

| 操作系统 | 文件名称                         |
| :------- | :------------------------------- |
| MacOS    | `system-tools_darwin-amd64`      |
| Linux    | `system-tools_linux-amd64`       |
| Windows  | `system-tools_windows-amd64.exe` |

完成下载后，请完成以下步骤：

1. 重命名您下载的系统工具文件为`system-tools`。

1. 执行以下命令，对`system-tools`文件开放执行权限。

   > **说明**
   > 如果系统工具已经是可执行文件，可以跳过此步骤。

   ```
   chmod +x system-tools
   ```

## 收集 Kubernetes 日志

### 指令介绍

收集 Kubernetes 日志的命令`logs`，它的用途是收集 [RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)和[高可用集群](/docs/installation/k8s-install/kubernetes-rke/_index)节点中，核心 Kubernetes 组件的日志文件。请参考[常见故障排查](/docs/troubleshooting/_index)，查看核心 Kubernetes 组件的列表。

系统工具使用 kubeconfig 文件部署 DaemonSet。这个 DaemonSet 的作用是将核心 Kubernetes 组件的所有日志文件复制一遍后，打包成一个 `tar` 文件（默认文件名称是`cluster-logs.tar`）。如果您需要收集单节点的日志，您可以在命令中指定节点，例如`--node NODENAME`和 `-n NODENAME`，将`NODENAME`替换为节点名称后，可以指定单个节点，只收集该节点的日志。

### 使用方法

```
./system-tools_darwin-amd64 logs --kubeconfig <KUBECONFIG>
```

`logs`指令有以下几种选项和使用方式：

| 选项                                                   | 描述                                                                                                                                     |
| :----------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `--kubeconfig <KUBECONFIG_PATH>, -c <KUBECONFIG_PATH>` | 集群 kubeconfig 文件的路径                                                                                                               |
| `--output <FILENAME>, -o cluster-logs.tar`             | 系统工具 DaemonSet 打包的文件名称，默认文件名称是`cluster-logs.tar` ，您也可以修改为其他名称。                                           |
| `--node <NODENAME>, -n node1`                          | 收集日志的节点范围。把 `NODENAME` 修改为节点名称后，您可以指定收集某一个节点的日志。如果没有指定节点，则默认收集该集群中全部节点的日志。 |

## 查看节点系统指标

### 指令介绍

查看节点系统指标的命令`stats`，它的用途是查看[RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)和[高可用集群](/docs/installation/k8s-install/kubernetes-rke/_index)中，节点的系统指标。

系统工具部署的 DaemonSet，会运行基于`sar`（System Activity Report）的预先定义好的指令，收集和显示系统指标。

### 使用方法

```
./system-tools_darwin-amd64 stats --kubeconfig <KUBECONFIG>
```

`stats`指令有以下几种选项和使用方式：

| 选项                                                   | 描述                                                                                                                                                 |
| :----------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--kubeconfig <KUBECONFIG_PATH>, -c <KUBECONFIG_PATH>` | 集群 kubeconfig 文件的路径。                                                                                                                         |
| `--node <NODENAME>, -n node1`                          | 收集系统指标的节点范围。把 `NODENAME` 修改为节点名称后，您可以指定收集某一个节点的系统指标。如果没有指定节点，则默认收集该集群中全部节点的系统指标。 |
| `--stats-command value, -s value`                      | 触发系统工具，显示系统参数的命令，默认命令是`/usr/bin/sar -u -r -F 1 1`。                                                                            |

## 移除 Kubernetes 资源

### 指令介绍

> **警告：** 这条命令会从 etcd 中移除数据。执行这条命令前，请检查是否已经完成[etcd 节点备份](/docs/backups/backups/_index)。

当您在 Kubernetes 集群中安装 Rancher 的时候，Rancher 会创建 Kubernetes 资源，用于运行 Rancher Server 和配置存储。如果您需要删除集群中的 Rancher，您可以使用`remove`命令，移除 Kubernetes 资源。执行`remove`命令会移除以下资源：

- Rancher 部署的命名空间，默认名称是`cattle-system`。

- Rancher 通过`cattle.io/creator:norman`标签标记的`serviceAccount`、 `clusterRoles`和`clusterRoleBindings`。使用 Rancher v2.1.0 或更新版本创建的所有及资源都会被打上`cattle.io/creator:norman`的标签。
- 标签、备注和 finalizers。
- Rancher Deployment。
- 机器、集群、项目和用户相关的 CRD。
- `management.cattle.io` API Group 内创建的所有资源。
- 使用 Rancher v2.x 创建的所有 CRD。

> **说明：**
> 如果您使用的**2.0.8**或之前的版本，执行`remove`命令后需要手动删除`serviceAccount`、`clusterRole`和`clusterRoleBindings` 资源。

### 使用方法

执行`remove` 命名后，会从集群中移除上述的所有资源。

> **警告：** 这条命令会从 etcd 中移除数据。执行这条命令前，请检查是否已经完成[etcd 节点备份](/docs/backups/backups/_index)

```
./system-tools remove --kubeconfig <KUBECONFIG> --namespace <NAMESPACE>
```

`remove`指令有以下几种选项和使用方式：

| 选项                                                   | 描述                                                                      |
| :----------------------------------------------------- | :------------------------------------------------------------------------ |
| `--kubeconfig <KUBECONFIG_PATH>, -c <KUBECONFIG_PATH>` | 集群 kubeconfig 文件的路径。                                              |
| `--namespace <NAMESPACE>, -n cattle-system`            | Rancher 2.x 部署的命名空间，如果没有指定命名空间，默认是`cattle-system`。 |
| `--force`                                              | 跳过确认信息，强制执行移除命令。                                          |
