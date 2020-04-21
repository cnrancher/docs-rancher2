---
title: 通过 Kubectl 和 kubeconfig 访问集群
description: 本节描述如何从 Rancher UI 或您的虚拟机使用 kubectl 操作下游 Kubernetes 集群。有关如何使用 kubectl 的更多信息，请参阅Kubernetes 文档：kubectl 概述。
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
  - 集群管理员指南
  - 集群访问控制
  - 通过 Kubectl 和 kubeconfig 访问集群
---

本节描述如何从 Rancher UI 或您的虚拟机使用 kubectl 操作下游 Kubernetes 集群。

有关如何使用 kubectl 的更多信息，请参阅[Kubernetes 文档：kubectl 概述](https://kubernetes.io/docs/reference/kubectl/overview/).

## 在 Rancher UI 中使用 kubectl Shell 访问集群

您可以通过登录 Rancher 并在 UI 中打开 kubectl shell 来访问和管理集群。无需进一步配置。

1. 在 **全局** 视图中，打开您希望使用 kubectl 访问的集群。

2. 点击 **启动 kubectl**，使用打开的窗口与 Kubernetes 集群进行交互。

## 从您的虚拟机上使用 kubectl 访问集群

本节介绍如何下载集群的 kubeconfig 文件，从您的虚拟机上启动 kubectl，并访问下游集群。

这种访问集群的替代方法允许您使用 Rancher 进行身份验证，并在不使用 Rancher UI 的情况下管理集群。

> **先决条件:** 这些说明假定您已经创建了一个 Kubernetes 集群，并且 kubectl 已经安装在您的虚拟机上。有关安装 kubectl 的帮助，请参阅官方[Kubernetes 文档](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

1. 登录 Rancher. 从 **全局** 视图中，打开您希望使用 kubectl 访问的集群。
1. 点击 **Kubeconfig 文件**.
1. 将显示的内容复制到剪贴板。
1. 将内容粘贴到本地计算机上的新文件中。将文件移动到 `~/.kube/config`。注意: kubectl 用于 kubeconfig 文件存放的默认位置是 `~/.kube/config`, 但是您可以使用任何目录，并使用 `--kubeconfig` 标记来指定它，如以下命令所示:

   ```
   kubectl --kubeconfig /custom/path/kube.config get pods
   ```

1. 从您的虚拟机启动 kubectl。使用它与 kubernetes 集群进行交互。

### 使用 kubectl 创建的资源注意事项

Rancher 将发现和显示由 `kubectl`创建的资源。但是，这些资源可能没有关于发现的所有必要注释。如果使用 Rancher UI/API 对资源执行操作(例如，扩展工作负载)，这可能会由于缺少注释而触发对资源的重新创建。只有在对发现的资源执行操作时才会发生这种情况。

## 直接使用下游集群进行身份验证

本节的目的是帮助您设置另一种方法来访问[RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)。

此方法仅对启用了[已授权的集群端点](/docs/overview/architecture/_index) 的 RKE 集群可用，当 Rancher 创建这个 RKE 集群时，它会生成一个 kubeconfig 文件，其中包含用于访问您的集群的其他 kubectl 上下文。这个额外的上下文允许您使用 kubectl 与下游集群进行身份验证，而无需通过 Rancher 进行身份验证。有关授权的集群端点如何工作的详细说明，请参阅[此页](/docs/cluster-admin/cluster-access/ace/_index)。

我们建议，作为一种最佳实践，您应该设置此方法来访问您的 RKE 集群，以便万一无法连接到 Rancher 时，您仍然可以访问集群。

> **先决条件:** 下面的步骤假设您已经创建了一个 Kubernetes 集群，并按照以下步骤[从您的虚拟机上用 kubectl 连接到您的集群](#从您的虚拟机上使用-kubectl-访问集群)。

要在下载的 kubeconfig 文件中找到上下文的名称，请运行：

```
kubectl config get-contexts --kubeconfig /custom/path/kube.config
CURRENT   NAME                        CLUSTER                     AUTHINFO     NAMESPACE
*         my-cluster                  my-cluster                  user-46tmn
          my-cluster-controlplane-1   my-cluster-controlplane-1   user-46tmn
```

在本例中，当您将 `kubectl` 与第一个上下文 `my-cluster`一起使用时，将通过 Rancher 服务器对您进行身份验证。

对于第二个上下文 `my-cluster-controlplane-1`，您将使用授权的集群端点进行身份验证，直接与下游 RKE 集群通信。

我们建议使用具有经过授权的集群端点的负载均衡器。有关详细信息，请参阅[推荐的架构部分](/docs/overview/architecture-recommendations/_index)。

现在您已经有了直接使用集群进行身份验证所需的上下文的名称，您可以在运行 kubectl 命令时将上下文的名称作为一个选项传递进来。这些命令将根据您的集群是否定义了 FQDN 而有所不同。下面几节提供了示例。

当 `kubectl` 正常工作时，它确认您可以绕过 Rancher 的身份验证代理访问您的集群。

### 直接连接到有 FQDN 的集群

如果为集群定义了 FQDN，则将创建引用 FQDN 的单个上下文。上下文将被命名为 `<CLUSTER_NAME>-fqdn`。当您想使用 `kubectl` 来访问这个集群而不需要 Rancher 时，您将需要使用这个上下文。

假设 kubeconfig 文件位于 `~/.kube/config`:

```
kubectl --context <CLUSTER_NAME>-fqdn get nodes
```

直接引用 kubeconfig 文件的位置:

```
kubectl --kubeconfig /custom/path/kube.config --context <CLUSTER_NAME>-fqdn get pods
```

### 直接连接到没有 FQDN 的集群

如果没有为集群定义 FQDN，则会创建引用控制平面中每个节点的 IP 地址的额外上下文。每个上下文将被命名为`<CLUSTER_NAME>-<NODE_NAME>`。当您想使用`kubectl` 来访问这个集群而不需要 Rancher 时，您将需要使用这个上下文。

假设 kubeconfig 文件位于 `~/.kube/config`:

```
kubectl --context <CLUSTER_NAME>-<NODE_NAME> get nodes
```

直接引用 kubeconfig 文件的位置:

```
kubectl --kubeconfig /custom/path/kube.config --context <CLUSTER_NAME>-<NODE_NAME> get pods
```
