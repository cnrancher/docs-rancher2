---
title: 节点和节点池
description: 在 Rancher 中启动 Kubernetes 集群后，您可以从集群的节点页面中管理各个节点。根据创建集群的方式的不同，有不同的节点选项可用。如果要管理的是*集群*而不是单个节点，请参阅编辑集群。
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
  - 节点和节点池
---

在 Rancher 中启动 Kubernetes 集群后，您可以从集群的节点页面中管理各个节点。根据[创建集群的方式](/docs/cluster-provisioning/_index)的不同，有不同的节点选项可用。

> 如果要管理的是*集群*而不是单个节点，请参阅[编辑集群](/docs/k8s-in-rancher/editing-clusters/_index)。

## 每种类型集群的节点选项

下表列出了 Rancher 中每个[类型的集群](/docs/cluster-provisioning/_index)可用的节点选项。单击 **选项** 列中的链接以获得关于每个功能模块的更详细信息。

| 选项                                           | [由基础设施提供商托管的节点][1] | [自定义的节点][2] | [托管的集群][3] | [导入的节点][4] | 描述                                                |
| ---------------------------------------------- | ------------------------------- | ----------------- | --------------- | --------------- | --------------------------------------------------- |
| [暂停](#暂停节点)                              | ✓                               | ✓                 | ✓               | ✓               | 将节点标记为不可调度。                              |
| [驱散](#驱散节点)                              | ✓                               | ✓                 | ✓               | ✓               | 将节点标记为不可调度的， _并_ 将所有 pod 驱散出去。 |
| [编辑](#管理和编辑单个节点)                    | ✓                               | ✓                 | ✓               | ✓               | 输入节点的自定义名称、描述、标签或污点。            |
| [查看 API](#查看节点-api)                      | ✓                               | ✓                 | ✓               | ✓               | 查看 API 数据。                                     |
| [删除](#删除节点)                              | ✓                               | ✓                 |                 |                 | 从集群中删除有缺陷的节点。                          |
| [下载 Keys](#ssh-到由基础设施提供商托管的节点) | ✓                               |                   |                 |                 | 下载 SSH 密钥以便 SSH 到节点。                      |
| [节点缩放](#缩放节点)                          | ✓                               |                   |                 |                 | 增加或减少节点池中的节点数。                        |

[1]: /docs/cluster-provisioning/rke-clusters/node-pools/_index
[2]: /docs/cluster-provisioning/rke-clusters/custom-nodes/_index
[3]: /docs/cluster-provisioning/hosted-kubernetes-clusters/_index
[4]: /docs/cluster-provisioning/imported-clusters/_index

### 基础设施提供商托管的节点

如果您的集群是 RKE 集群，并且其中的节点是由 Rancher 通过节点驱动在[基础设施提供商中创建的](/docs/cluster-provisioning/rke-clusters/node-pools/_index)，那么**节点池**在这个集群中可用。

编辑节点池可以对[节点池](/docs/cluster-provisioning/rke-clusters/node-pools/_index)进行扩容或者缩容。

如果启用了[节点自动替换](/docs/cluster-provisioning/rke-clusters/node-pools/_index)功能，则节点池还可以自动维护节点池的规模。这个`scale`值定义了 Rancher 要为集群维护的活动节点数量。

Rancher 使用[节点模板](/docs/cluster-provisioning/rke-clusters/node-pools/_index)来替换节点池中的节点。每个节点模板都使用基础设施提供商的相关凭据，来允许 Rancher 在基础设施中配置节点。

### 托管的 Kubernetes 集群的节点

在 Rancher 中，管理由 [Kubernetes 供应商托管的集群](/docs/cluster-provisioning/hosted-kubernetes-clusters/_index)中的节点时，将会受到一些限制。例如，您不能通过 Rancher UI 里点击加减号，来增加或减少节点，您需要直接编辑集群。

### 导入的 Kubernetes 集群的节点

尽管您可以使用 Rancher 将工作负载部署到[导入的集群](/docs/cluster-provisioning/imported-clusters/_index)，但是您无法管理集群的单个节点。导入集群节点的所有管理必须在 Rancher 之外进行。

## 管理和编辑单个节点

编辑节点可让您：

- 更改名称
- 更改描述
- 添加/删除[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
- 添加/删除[污点](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)

要管理单个节点，请浏览至要管理的集群，然后从主菜单中选择**节点**。您可以通过单击节点的**省略号图标**来打开其选项菜单。

### 查看节点 API

选择此选项以查看节点的[API endpoints](/docs/api/_index)。

### 删除节点

可以点击**删除**从云提供商删除有缺陷的节点。当您删除一个有缺陷的节点时，Rancher 会自动将其替换为具有相同配置的节点。

> **提示:** 如果您的集群由基础设施提供商托管，并且您希望降低集群规模，而不是删除有缺陷的节点，那么[降低规模](#缩放节点)而不是删除。

### 缩放节点

对于由基础设施提供商托管的节点，您可以使用 scale 控件来缩放每个节点池中的节点数量。此选项不适用于其他集群类型。

### SSH 到由基础设施提供商托管的节点

对于[由基础设施提供商托管的节点](/docs/cluster-provisioning/rke-clusters/node-pools/_index)，您可以选择下载它的 SSH 密钥，以便您可以从桌面远程连接到它。

1. 在由基础设施提供商托管的集群中，从主菜单中选择 **节点**。

1. 找到要远程进入的节点。选择 **省略号 (...)> 下载 Keys**.

   **步骤结果：** 一个包含用于 SSH 的文件的 ZIP 文件被下载。

1. 将 ZIP 文件解压缩到任何位置。

1. 打开终端。切换到解压缩的 ZIP 文件目录。

1. 输入以下命令:

   ```
   ssh -i id_rsa root@<IP_OF_HOST>
   ```

### 节点池节点注意事项

如果您使用了[这个节点池选项](/docs/cluster-provisioning/rke-clusters/node-pools/_index)，那么 Rancher 会自动维护创建的集群在初始集群配置期间设置的节点规模。这个 scale 决定了 Rancher 为集群维护的活动节点的数量。

### 暂停节点

*暂停*一个节点则将其标记为不可调度。此功能对于在小型维护窗口（如重启、升级或销毁）期间在节点上执行短任务非常有用。完成后，重新打开电源，并通过取消对节点的暂停使其可以再次调度。

### 驱散节点

_驱散_ 的过程是首先暂停节点，然后驱散所有的 pods。该功能对于执行节点维护(如内核升级或硬件维护)非常有用。它可以防止新的 pods 部署到节点，同时重新分配现有 pods，这样用户就不会遇到服务中断。

- 对于具有副本集的 pod，该 pod 将被一个新的 pod 替换，该 pod 将被调度到一个新节点。另外，如果 pod 是服务的一部分，那么客户机将自动重定向到新的 pod。

- 对于没有副本集的 pod，您需要调出一个新的 pod 副本，并假设它不是服务的一部分，将客户端重定向到它。

您可以驱散处于`暂停` 或者 `活动` 状态的节点。当您驱散一个节点时，节点被暂停，评估节点必须满足的条件来驱散，然后(如果它满足条件)节点驱散它的 pods。

然而，您可以在初始化驱散时覆盖驱散条件。您还可以设置一个优雅停止时长和超时值。

### 激进的和安全的驱散选项

不同的 Rancher 版本会有不同的节点驱散选项。

#### Rancher v2.2.x+

两种驱散模式：主动的和安全的。

- **主动模式**

  在这种模式下，pods 不会被重新调度到一个新节点，即使它们没有控制器。Kubernetes 希望您有自己的逻辑来处理删除这些 pods。

  Kubernetes 还希望实现能够决定如何使用 emptyDir 处理 pods。如果 pod 使用 emptyDir 存储本地数据，您可能无法安全地删除它，因为一旦从节点删除了 pod, emptyDir 中的数据将被删除。选择主动模式将删除这些 pods。

- **安全模式**

  如果一个节点有独立的 pods 或临时数据，它将被暂停，但不会被驱散。

#### Rancher v2.2.x 之前的版本

下面的列表描述了每个驱散选项:

- **即使存在不受 ReplicationController、ReplicaSet、Job、DaemonSet 或 StatefulSet 管理的 pod **

  这些类型的 pod 不会被重新调度到一个新节点，因为它们没有控制器。Kubernetes 希望您有自己的逻辑来处理删除这些 pods。Kubernetes 强迫您选择这个选项(它将会删除/驱散这些 pod)或者驱散不会继续。

- **即使有 daemonset 管理的 pods**

  与上面类似，如果您有任何 daemonsets，则仅在选中此选项时才会进行驱散。即使打开了这个选项，pod 也不会被删除，因为它们会立即被替换。在启动时，Rancher 当前在系统中有几个默认运行的守护进程集，因此该选项在默认情况下是打开的。

- **即使有使用 emptyDir 的 pods**

  如果 pod 使用 emptyDir 存储本地数据，您可能无法安全地删除它，因为一旦从节点删除了 pod, emptyDir 中的数据将被删除。与第一个选项类似，Kubernetes 希望实现能够决定如何处理这些 pods。选择此选项将删除这些 pods。

### 优雅停止时长

给予每个 Pod 清理的时间，这样它们就有机会优雅地停止服务。例如，当 Pod 可能需要完成任何未完成的请求时，回滚事务或将状态保存到某个外部存储中。如果是负数，将使用每个 Pod 中指定的默认值。

### 超时

在放弃驱散节点操作之前应该继续等待的时间。

> **Kubernetes 已知问题：** 在 Kubernetes 1.12 之前的版本中驱散节点时，不能强制执行[超时设置](https://github.com/kubernetes/kubernetes/pull/64378)。

### 驱散和暂停状态

如果有任何与用户输入相关的错误，节点将进入 `暂停` 状态，因为驱散失败。您可以更正输入并尝试再次驱散该节点，也可以通过解除该节点的暂停来中止。

如果驱散继续没有错误，节点进入 `驱散中` 的状态。当节点处于这种状态时，您可以选择停止驱散，这将停止驱散过程并将节点的状态更改为 `已暂停`。

一旦驱散成功完成，节点将处于`已驱散`状态。然后可以关闭或删除节点。

> **想知道更多关于暂停和驱散的信息吗?** 请残月[Kubernetes 文档](https://kubernetes.io/docs/tasks/administer-cluster/cluster-management/#maintenance-on-a-node).

## 标记需要被 Rancher 忽略的节点

_自 2.3.3 起可用_

一些解决方案，例如 F5 的 BIG-IP 集成，可能需要创建一个永远不会注册到集群的节点。

由于该节点永远不会完成注册，因此在 Rancher UI 中始终将其显示为不正常。

在这种情况下，您可能希望通知 Rancher 忽略该节点，以便 Rancher 仅在真实的节点发生故障时将其显示为不正常。

您可以使用 Rancher UI 或使用`kubectl`来标记要忽略的节点。

> **注意：** Rancher 存在一个[未解决的问题](https://github.com/rancher/rancher/issues/24172)，其中标记为忽略的节点可能会卡在更新状态。

### 使用 Rancher UI 标记要忽略的节点

要添加需要被 Rancher 忽略的节点，

1. 在**全局**视图中，单击**设置**选项卡。
1. 转到`ignore-node-name`设置，然后单击 **省略号> 编辑**。
1. 输入 Rancher 需要忽略节点的名称。具有该名称的所有节点将被忽略。
1. 点击**保存**。

**结果：** Rancher 不会等待使用该名称注册的节点。在用户界面中，节点将显示为灰色。该节点仍然是集群的一部分，可以用`kubectl`列出。

即使以后更改了`ignore-node-name`设置，这个已经被忽略的节点将继续被忽略。

### 使用 kubectl 标记要忽略的节点

要添加需要被 Rancher 忽略的节点，请使用`kubectl`创建具有以下标签的节点：

```
cattle.rancher.io/node-status: ignore
```

**结果：** 如果将节点添加到集群，Rancher 将不会尝试与此节点同步。该节点仍然是集群的一部分，并且可以用`kubectl`列出。

如果在将节点添加到集群之前添加了这个标签，则该节点将不会显示在 Rancher UI 中。

如果在将节点添加到 Rancher 集群后添加标签，UI 会继续显示该节点。

如果您使用 Rancher UI 或 Rancher API 从 Rancher Server 中删除节点时，如果节点名称与 Rancher 的设置的`ignore-node-name`匹配，则 Rancher 不会从集群中删除该节点。
