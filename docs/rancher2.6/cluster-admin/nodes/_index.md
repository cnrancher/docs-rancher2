---
title: 节点和节点池
weight: 2030
---

在 Rancher 中启动 Kubernetes 集群后，你可以从集群的**节点**选项卡管理各个节点。不同的配置集群[选项]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/)对应不同的可用节点选项。

> 如果你想管理 _集群_ 而不是单个节点，请参阅[编辑集群](/docs/rancher2.6/cluster-admin/editing-clusters/_index.md)。

本节涵盖以下主题：

- [每个集群创建选项的可用节点选项](#node-options-available-for-each-cluster-creation-option)
  - [由基础设施提供商托管的节点](#nodes-hosted-by-an-infrastructure-provider)
  - [由托管 Kubernetes 提供商配置的节点](#nodes-provisioned-by-hosted-kubernetes-providers)
  - [注册节点](#registered-nodes)
- [管理和编辑单个节点](#managing-and-editing-individual-nodes)
- [在 Rancher API 中查看节点](#viewing-a-node-in-the-rancher-api)
- [删除节点](#deleting-a-node)
- [扩缩节点](#scaling-nodes)
- [通过 SSH 连接到由基础设施提供商托管的节点](#ssh-into-a-node-hosted-by-an-infrastructure-provider)
- [封锁节点](#cordoning-a-node)
- [清空节点](#draining-a-node)
  - [激进和安全的清空选项](#aggressive-and-safe-draining-options)
  - [宽限期](#grace-period)
  - [超时](#timeout)
  - [清空和封锁状态](#drained-and-cordoned-state)
- [标记 Rancher 忽略的节点](#labeling-a-node-to-be-ignored-by-rancher)

## 每个集群创建选项的可用节点选项

下表列出了 Rancher 中每种集群类型的可用节点选项。单击**选项**列中的链接以获取每个功能的更多信息。

| 选项                                                              | [由基础设施提供商托管的节点][1] | [自定义节点][2] | [托管集群][3] | [注册的 EKS 节点][4] | [所有其他注册节点][5] | 描述                                       |
| ----------------------------------------------------------------- | ------------------------------- | --------------- | ------------- | -------------------- | --------------------- | ------------------------------------------ |
| [封锁](#cordoning-a-node)                                         | ✓                               | ✓               | ✓             | ✓                    | ✓                     | 将节点标记为不可调度。                     |
| [清空](#draining-a-node)                                          | ✓                               | ✓               | ✓             | ✓                    | ✓                     | 将节点标记为不可调度 _并且_ 驱逐所有 pod。 |
| [编辑](#managing-and-editing-individual-nodes)                    | ✓                               | ✓               | ✓             | ✓                    | ✓                     | 输入节点的自定义名称、描述、标签或污点。   |
| [查看 API](#viewing-a-node-in-the-rancher-api)                    | ✓                               | ✓               | ✓             | ✓                    | ✓                     | 查看 API 数据。                            |
| [删除](#deleting-a-node)                                          | ✓                               | ✓               |               | \*                   | \*                    | 从集群中删除有缺陷的节点。                 |
| [下载密钥](#ssh-into-a-node-hosted-by-an-infrastructure-provider) | ✓                               |                 |               |                      |                       | 下载 SSH 密钥以通过 SSH 连接到节点。       |
| [节点缩放](#scaling-nodes)                                        | ✓                               |                 |               | ✓                    |                       | 向上或向下扩展节点池中的节点数。           |

[1]: {{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/
[2]: {{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes/
[3]: {{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/
[4]: {{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/registered-clusters/
[5]: {{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/registered-clusters/

\* 可通过 View API 访问的删除选项

### 由基础设施提供商托管的节点

在[托管在基础设施提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/)中的节点上配置由 Rancher 启动的 Kubernetes 集群时，你可以使用节点池。

如果节点池被编辑，通过[节点池选项]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-pools)配置的集群可以纵向扩容或缩容。

如果启用[节点自动替换功能]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#about-node-auto-replace)，节点池还可以自动维护在初始集群配置期间设置的节点规模。该规模决定了 Rancher 为集群维护的 active 节点的数量。

Rancher 使用[节点模板]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-templates)来替换节点池中的节点。每个节点模板都使用云提供商凭证来允许 Rancher 在基础设施提供商中设置节点。

### 由托管 Kubernetes 提供商配置的节点

用于管理[由 Kubernetes 提供商托管](/docs/rancher2.6/cluster-provisioning/hosted-kubernetes-clusters/_index.md)的节点的选项在 Rancher 中有些限制。例如，你不能使用 Rancher UI 向上或向下缩放节点数量，而是需要直接编辑集群。

### 注册节点

虽然你可以使用 Rancher 将工作负载部署到[已注册集群](/docs/rancher2.6/cluster-provisioning/registered-clusters/_index.md)，但你无法管理单个集群节点。导入的集群节点的所有管理都必须在 Rancher 之外进行。

## 管理和编辑单个节点

编辑节点可让你：

- 更改其名称
- 更改其描述
- 添加[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
- 添加/删除[污点](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)

要管理单个节点，请浏览到要管理的集群，然后从主菜单中选择**节点**。你可以通过单击节点的 **⋮** (**...**) 图标来打开选项菜单。

## 在 Rancher API 中查看节点

选择此选项以查看节点的 [API 端点](/docs/rancher2.6/api/_index)。

## 删除节点

使用 **Delete** 从云提供商中删除有缺陷的节点。

当你删除有缺陷的节点时，如果该节点在节点池中并启用了[节点自动替换]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#about-node-auto-replace)，Rancher 可以自动将其替换为具有相同配置的节点。

> **提示**：如果你的集群由基础设施提供商托管，并且你希望缩容集群，而不是删除有缺陷的节点，请进行[缩容](#scaling-nodes)而不是删除。

## 扩缩节点

对于由基础设施提供商托管的节点，你可以使用缩放控件来缩放每个[节点池]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-pools)中的节点数量。此选项不适用于其他集群类型。

## 通过 SSH 连接到由基础设施提供商托管的节点

对于[由基础设施提供商托管的节点]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/)，你可以选择下载其 SSH 密钥，以便从桌面远程连接到它。

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要通过 SSH 连接到节点的集群，然后单击集群名称。
1. 在**机器池**选项卡上，找到要远程访问的节点，然后单击 **⋮ > 下载 SSH 密钥**。这将下载用于 SSH 的文件的 ZIP 包。
1. 将 ZIP 文件解压缩到任何位置。
1. 打开终端。转到解压了的 ZIP 文件的位置。
1. 输入以下命令：

   ```
   ssh -i id_rsa root@<IP_OF_HOST>
   ```

## 封锁节点

_封锁_ 节点表示将节点标记为不可调度。此功能适用于在短期维护（如重启，升级或停用）时在节点上执行短期任务。完成后，重新打开电源并通过取消封锁使节点再次可调度。

## 清空节点

_清空_ 指的是先封锁节点，然后驱逐其所有 pod 的过程。此功能对于执行节点维护（如内核升级或硬件维护）很有用。它可以防止新的 pod 部署到节点，同时能重新分配现有的 pod，从而避免用户遇到服务中断的情况。

- 具有副本集的 pod 将被一个新的 pod 替换，该新 pod 将被调度到一个新节点。此外，如果 pod 是服务的一部分，则客户端将自动重定向到新的 pod。

- 对于没有副本集的 pod，你需要调出 pod 的新副本。如果该 pod 不是服务的一部分，将客户端重定向到它。

你可以清空处于 `cordoned` 或 `active` 状态的节点。清空一个节点时，该节点会被封锁，然后会评估节点是否满足清空的必备要求，如果满足要求，则会驱逐节点的 pod。

但是，你可以在启动清空时覆盖清空条件。你还有机会设置宽限期和超时值。

### 激进和安全的清空选项

为集群配置升级策略时，你将能够启用节点清空。如果启用了节点清空，你将能够配置如何删除和重新调度 pod。

- **激进模式**

  在这种模式下，即使 pod 没有控制器也不会被重新调度到新节点。Kubernetes 会认为你拥有自己的 pod 删除逻辑。

  Kubernetes 还会认为你有处理使用 emptyDir 的 pod 的实现。如果 Pod 使用 emptyDir 存储本地数据，你可能无法安全地删除该 pod，因为一旦 Pod 从节点中删除，emptyDir 中的数据将被删除。选择激进模式将删除这些 pod。

- **安全模式**

  如果一个节点有独立的 pod 或临时数据，它将被封锁但不会被清空。

### 宽限期

给每个 pod 清理的超时时间，从而让它们优雅地退出。例如，pod 可能需要完成任何未完成的请求、回滚事务或将状态保存到某个外部存储。如果该值为负数，将使用 pod 中指定的默认值。

### 超时

在清空放弃之前应该继续等待的时间。

> **Kubernetes 已知问题**：Kubernetes 1.12 之前的版本中，在清空节点时不会强制执行[超时设置](https://github.com/kubernetes/kubernetes/pull/64378)。

### 清空和封锁状态

如果有任何与用户输入相关的错误，节点会由于清空失败进入 `cordoned` 状态。你可以更正输入并再次尝试清空节点，也可以通过解封节点来中止。

如果清空没有错误，则节点会进入 `draining` 状态。当节点处于此状态时，你可以选择停止清空，这将停止清空过程并将节点的状态更改为 `cordoned`。

清空成功完成后，节点将处于 `drained` 状态。然后你可以关闭或删除节点。

> 有关**封锁和清空**的更多信息，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/tasks/administer-cluster/cluster-management/#maintenance-on-a-node)。

## 标记 Rancher 忽略的节点

某些解决方案（例如 F5 的 BIG-IP 集成）可能需要创建一个不会注册到集群的节点。

由于节点永远不会完成注册，因此它在 Rancher UI 中总是显示为不健康。

在这种情况下，你可能希望将节点标记为 Rancher 忽略的节点，从而让 Rancher 仅在节点实际发生故障时将节点状态显示为不健康。

你可以使用 Rancher UI 或 `kubectl` 标记要忽略的节点。

> **注意**：已知一个[未解决的问题](https://github.com/rancher/rancher/issues/24172)，即标记为被忽略的节点可能会卡在更新状态。

### 使用 kubectl 标记要忽略的节点

要添加 Rancher 忽略的节点，请使用 `kubectl` 创建具有以下标签的节点：

```
cattle.rancher.io/node-status: ignore
```

**结果**：如果将节点添加到集群中，Rancher 将不会尝试与该节点同步。该节点仍然可以是集群的一部分，并且可以使用 `kubectl` 列出。

如果在将节点添加到集群之前添加了标签，则该节点将不会显示在 Rancher UI 中。

如果在将节点添加到 Rancher 集群后添加标签，则不会从 UI 中删除该节点。

如果你使用 Rancher UI 或 API 从 Rancher server 中删除节点，假如 `nodeName` 在 Rancher API 下的 `v3/settings/ignore-node-name` 中列出，则不会从集群中删除该节点。
