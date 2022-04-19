---
title: "使用 Kubectl 和 kubeconfig 访问集群"
description: "了解如何通过 kubectl Shell 使用 kubectl，或通过 kubectl CLI 和 kubeconfig 文件，来访问和管理 Kubernetes 集群。kubeconfig 文件用于配置对 Kubernetes 的访问。当你使用 Rancher 创建集群时，Rancher 会自动为你的集群创建 kubeconfig。"
weight: 2010
---

本文介绍如何通过 Rancher UI 或工作站来使用 kubectl 操作下游 Kubernetes 集群。

有关使用 kubectl 的更多信息，请参阅 [Kubernetes 文档：kubectl 概述](https://kubernetes.io/docs/reference/kubectl/overview/)。

- [在 Rancher UI 中使用 kubectl shell 访问集群](#accessing-clusters-with-kubectl-shell-in-the-rancher-ui)
- [在工作站使用 kubectl 访问集群](#accessing-clusters-with-kubectl-from-your-workstation)
- [使用 kubectl 创建的资源的注意事项](#note-on-resources-created-using-kubectl)
- [直接使用下游集群进行身份验证](#authenticating-directly-with-a-downstream-cluster)
  - [直接连接到定义了 FQDN 的集群](#connecting-directly-to-clusters-with-fqdn-defined)
  - [直接连接到未定义 FQDN 的集群](#connecting-directly-to-clusters-without-fqdn-defined)

### 在 Rancher UI 中使用 kubectl shell 访问集群

你可以通过登录 Rancher 并在 UI 中打开 kubectl shell 来访问和管理你的集群。你无需进一步配置。

1. 点击 **☰ > 集群管理**。
1. 转到要使用 kubectl 访问的集群，然后单击 **Explore**。
1. 在顶部导航菜单中，单击 **Kubectl Shell** 按钮。使用打开的窗口与你的 Kubernetes 集群进行交互。

### 在工作站使用 kubectl 访问集群

本节介绍如何下载集群的 kubeconfig 文件、从工作站启动 kubectl 以及访问下游集群。

这种访问集群的替代方法允许你在不使用 Rancher UI 的情况下通过 Rancher 进行身份验证并管理集群。

> **先决条件**：以下说明假设你已经创建了一个 Kubernetes 集群，并且已将 kubectl 安装在工作站上。有关安装 kubectl 的帮助，请参阅官方 [Kubernetes 文档](https://kubernetes.io/docs/tasks/tools/install-kubectl/)。

1. 登录到 Rancher。点击 **☰ > 集群管理**。
1. 转到要使用 kubectl 访问的集群，然后单击 **Explore**。
1. 在顶部导航栏中，单击**下载 KubeConfig** 按钮。
1. 将 YAML 文件保存在本地计算机上。将文件移动到 `~/.kube/config`。注意：kubectl 用于 kubeconfig 文件的默认位置是 `~/.kube/config`。但是你也可以运行类似以下的命令，使用 `--kubeconfig` 标志指定任何其他目录：
   ```
   kubectl --kubeconfig /custom/path/kube.config get pods
   ```
1. 从工作站启动 kubectl。使用它与 Kubernetes 集群进行交互。

### 使用 kubectl 创建的资源的注意事项

Rancher 会发现并显示由 `kubectl` 创建的资源。但是在发现资源的时候，这些资源可能没有包括所有必须的注释。如果资源已经使用 Rancher UI/API 进行操作（例如，扩展工作负载），但是由于缺少注释，资源的重新创建可能会触发。只有在首次对发现的资源进行操作时，这种情况才会发生。

# 直接使用下游集群进行身份验证

本节旨在帮助你设置访问 [RKE 集群的替代方法]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters)。

此方法仅适用于启用了[授权集群端点]({{<baseurl>}}/rancher/v2.6/en/overview/architecture/#4-authorized-cluster-endpoint)的 RKE 集群。在 Rancher 创建 RKE 集群时，Rancher 会生成一个 kubeconfig 文件，其中包含用于访问集群的额外 kubectl 上下文。该上下文允许你使用 kubectl 通过下游集群进行身份验证，而无需通过 Rancher 进行身份验证。有关授权集群端点如何工作的详细说明，请参阅[此页面](../ace)。

我们的最佳实践是使用此方法来访问 RKE 集群。这样，万一你无法连接到 Rancher，你仍然可以访问该集群。

> **先决条件**：以下步骤假设你已经创建了一个 Kubernetes 集群，并按照步骤[从工作站使用 kubectl 连接到集群](#accessing-clusters-with-kubectl-from-your-workstation)。

要在下载的 kubeconfig 文件中查找上下文的名称，请运行：

```
kubectl config get-contexts --kubeconfig /custom/path/kube.config
CURRENT   NAME                        CLUSTER                     AUTHINFO     NAMESPACE
*         my-cluster                  my-cluster                  user-46tmn
          my-cluster-controlplane-1   my-cluster-controlplane-1   user-46tmn
```

在此示例中，当你将 `kubectl` 与第一个上下文 `my-cluster` 一起使用时，你将通过 Rancher Server 进行身份验证。

使用第二个上下文 `my-cluster-controlplane-1`，你将使用授权集群端点进行身份验证，直接与下游 RKE 集群通信。

我们建议使用具有授权集群端点的负载均衡器。有关详细信息，请参阅[推荐的架构]({{<baseurl>}}/rancher/v2.6/en/overview/architecture-recommendations/#architecture-for-an-authorized-cluster-endpoint)。

现在你已经有了直接使用集群进行身份验证所需的上下文名称，你可以在运行 kubectl 命令时将上下文名称作为选项传入。根据你的集群是否定义了 FQDN，这些命令会有所不同。以下几节提供了示例。

当 `kubectl` 正常工作时，它确认你可以绕过 Rancher 的身份验证代理访问集群。

### 直接连接到定义了 FQDN 的集群

如果集群定义了 FQDN，将会创建一个引用 FQDN 的上下文。上下文将命名为 `<CLUSTER_NAME>-fqdn`。当你想在没有 Rancher 的情况下使用 `kubectl` 访问这个集群时，你需要使用这个上下文。

假设 kubeconfig 文件位于 `~/.kube/config`：

```
kubectl --context <CLUSTER_NAME>-fqdn get nodes
```

直接引用 kubeconfig 文件的位置：

```
kubectl --kubeconfig /custom/path/kube.config --context <CLUSTER_NAME>-fqdn get pods
```

### 直接连接到未定义 FQDN 的集群

如果集群没有定义 FQDN，则会创建额外的上下文来引用 controlplane 中每个节点的 IP 地址。每个上下文将被命名为 `<CLUSTER_NAME>-<NODE_NAME>`。当你想在没有 Rancher 的情况下使用 `kubectl` 访问这个集群时，你需要使用这个上下文。

假设 kubeconfig 文件位于 `~/.kube/config`：

```
kubectl --context <CLUSTER_NAME>-<NODE_NAME> get nodes
```

直接引用 kubeconfig 文件的位置：

```
kubectl --kubeconfig /custom/path/kube.config --context <CLUSTER_NAME>-<NODE_NAME> get pods
```
