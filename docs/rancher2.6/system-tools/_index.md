---
title: 系统工具
weight: 22
---

系统工具（System Tools）用于在 [Rancher 启动的 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 集群上执行操作任务或[在 RKE 集群上安装 Rancher]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/)。其任务包括：

* 收集节点的日志记录和系统指标。
* 移除 Rancher 创建的 Kubernetes 资源。

以下命令可用：

| 命令 | 描述 |
|---|---
| [logs](#logs) | 从节点收集 Kubernetes 集群组件日志。 |
| [stats](#stats) | 从节点流式传输系统指标。 |
| [remove](#remove) | 移除 Rancher 创建的 Kubernetes 资源。 |

## 下载系统工具

你可以从 [GitHub 发布页面](https://github.com/rancher/system-tools/releases/latest)下载最新版本的系统工具。请下载用于与集群交互的操作系统对应的 `system-tools` 版本。

| 操作系统 | 文件名 |
-----------------|-----
| MacOS | `system-tools_darwin-amd64` |
| Linux | `system-tools_linux-amd64` |
| Windows | `system-tools_windows-amd64.exe` |

下载工具后，请完成以下操作：

1. 将文件重命名为 `system-tools`。

1. 运行以下命令授予文件可执行权限：

   > **使用 Windows？**
   > 该文件已经是可执行文件，你可以跳过此步骤。

   ```
   chmod +x system-tools
   ```

## Logs

logs 子命令会从 [Rancher 启动的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)或[安装 Rancher 的 RKE Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/)上的节点收集核心 Kubernetes 集群组件的日志文件。有关核心 Kubernetes 集群组件的列表，请参阅[疑难解答]({{<baseurl>}}//rancher/v2.6/en/troubleshooting/)。

System Tools 使用 kubeconfig 文件来部署 DaemonSet，DaemonSet 会复制核心 Kubernetes 集群组件的所有日志文件，并将这些文件压缩到单个 tar 包（默认为 `cluster-logs.tar`）。如果要收集单个节点的日志，你可以使用 `--node NODENAME` 或 `-n NODENAME` 来指定节点。

### 用法

```
./system-tools_darwin-amd64 logs --kubeconfig <KUBECONFIG>
```

以下是 logs 命令的选项：

| 选项 | 描述 |
| ------------------------------------------------------ | ------------------------------------------------------
| `--kubeconfig <KUBECONFIG_PATH>, -c <KUBECONFIG_PATH>` | 集群的 kubeconfig 文件。 |
| `--output <FILENAME>, -o cluster-logs.tar` | 创建的包含日志文件的 tarball 名称。如果未指定输出文件名，则默认为 `cluster-logs.tar`。 |
| `--node <NODENAME>, -n node1` | 指定要从中收集日志的节点。如果未指定节点，则收集集群中所有节点的日志。 |

## Stats

stats 子命令会显示 [Rancher 启动的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)或[安装 Rancher 的 RKE Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/)上节点的系统指标。

System Tools 会部署一个 DaemonSet，并运行基于 `sar`（系统活动报告，System Activity Report）的预定义命令来显示系统指标。

### 用法

```
./system-tools_darwin-amd64 stats --kubeconfig <KUBECONFIG>
```

以下是 stats 命令的选项：

| 选项 | 描述 |
| ------------------------------------------------------ | ------------------------------
| `--kubeconfig <KUBECONFIG_PATH>, -c <KUBECONFIG_PATH>` | 集群的 kubeconfig 文件。 |
| `--node <NODENAME>, -n node1` | 指定要显示系统指标的节点。如果未指定节点，则显示集群中所有节点的日志。 |
| `--stats-command value, -s value` | 用于显示系统指标的命令。如果未指定命令，则默认为 `/usr/bin/sar -u -r -F 1 1`。 |

## Remove

> **警告**：此命令将删除 etcd 节点中的数据。在执行命令之前，请确保你已经创建了 [etcd 的备份]({{<baseurl>}}/rancher/v2.6/en/backups/back-up-rancher)。

在 Kubernetes 集群上安装 Rancher 时，它将创建 Kubernetes 资源来运行和存储配置数据。如果要从集群中删除 Rancher，可以使用 `remove` 子命令来删除 Kubernetes 资源。`remove` 子命令将删除以下资源：

- Rancher deployment 命名空间（默认为 `cattle-system`）。
- Rancher 应用了 `cattle.io/creator:norman` 标签的任何 `serviceAccount`、`clusterRoles` 和 `clusterRoleBindings`。Rancher 创建的任何资源都会应用此标签。
- 标签、注释和终结器。
- Rancher Deployment。
- 机器、集群、项目和用户自定义资源部署 (CRD)。
- 在 `management.cattle.io` API Group 下创建的所有资源。
- Rancher v2.x 创建的所有 CRD。

> **使用 2.0.8 或更早版本？**
>
> 这些 Rancher 版本不会在运行 job 后自动删除 `serviceAccount`、`clusterRole` 和 `clusterRoleBindings` 资源。你需要自行删除它们。

### 用法

运行以下命令时，[上述](#remove)列出的所有资源都将从集群中删除。

> **警告**：此命令将删除 etcd 节点中的数据。在执行命令之前，请确保你已经创建了 [etcd 的备份]({{<baseurl>}}/rancher/v2.6/en/backups/back-up-rancher)。

```
./system-tools remove --kubeconfig <KUBECONFIG> --namespace <NAMESPACE>
```

以下是 `remove` 命令的选项：

| 选项 | 描述 |
| ---------------------------------------------- | ------------
| `--kubeconfig <KUBECONFIG_PATH>, -c <KUBECONFIG_PATH>` | 集群的 kubeconfig 文件。 |
| `--namespace <NAMESPACE>, -n cattle-system` | Rancher 2.x deployment 命名空间 (`<NAMESPACE>`)。如果没有指定命名空间，则默认为 `cattle-system`。 |
| `--force` | 跳过交互式删除确认，并在没有提示的情况下删除 Rancher deployment。 |
