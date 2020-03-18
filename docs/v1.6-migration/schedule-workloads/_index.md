---
title: '5、调度服务'
---

在 v1.6 中，称为*服务*的对象用于将容器调度到集群主机。服务包括应用程序的 Docker 镜像以及所需状态的配置。

在 Rancher v2.x 中，等效对象称为*工作负载*。Rancher v2.x 保留了 v1.6 以来的所有调度功能，但是由于从 Cattle 更改为 Kubernetes 做默认容器编排，因此用于调度工作负载的术语和机制也发生了变化。

工作负载部署是容器编排的更重要和更复杂的方面之一。将 pod 部署到可用的共享集群资源有助于在最佳使用计算资源的情况下最大化性能。

你可以在编辑部署时调度迁移的 v1.6 服务。通过调度服务 **工作负载类型** 和 **节点调度** 部分，如下所示。

<figcaption>编辑工作负载：工作负载类型和节点调度部分</figcaption>

![工作负载类型和节点调度部分](/img/rancher/migrate-schedule-workloads.png)

## 调度服务有何不同?

Rancher v2.x 保留了 v1.6 中可用的*所有*方法来调度服务。但是，由于默认的容器编排系统已从 Cattle 更改为 Kubernetes，因此每个调度选项的术语和实现都已更改。

在 v1.6 中，你可以在将服务添加到堆栈的同时调度服务到主机。在 Rancher v2.x.中，等效的操作是为工作负载设置节点调度规则。下图显示了 Rancher v2.x 与 v1.6 中用于调度的 UI 的比较。

![节点调度: Rancher v2.x vs v1.6](/img/rancher/node-scheduling.png)

## 节点调度选项

在调度节点以托管工作负载 pods 时（即在 Rancher v1.6 中为容器调度主机），Rancher 提供了多种选择。

你可以在部署工作负载时选择调度选项。术语*工作负载*是在 Rancher v1.6 中将服务添加到堆栈的同义词。你可以通过使用上下文菜单浏览到集群项目来部署工作负载 (`<CLUSTER> > <PROJECT> > Workloads`)。

以下各节提供有关使用每个调度选项的信息，以及对 Rancher v1.6 的任何显着更改。有关在 Rancher v2.x 中部署工作负载的完整说明，而不仅仅是调度选项，请参阅[部署工作负载](/docs/k8s-in-rancher/workloads/deploy-workloads/_index)。

| 选项                                                           | v1.6 特征 | v2.x 特征 |
| -------------------------------------------------------------- | --------- | --------- |
| [调度一定数量的 pods?](#调度一定数量的-pods)                   | ✓         | ✓         |
| [调度 pods 到特定节点?](#调度-pods-到特定节点)                 | ✓         | ✓         |
| [通过标签进行调度?](#通过标签进行调度)                         | ✓         | ✓         |
| [通过亲和性/反亲和性进行调度?](#通过亲和性反亲和性进行调度)    | ✓         | ✓         |
| [阻止将特定服务调度到特定主机?](#阻止将特定服务调度到特定主机) | ✓         | ✓         |
| [调度全局服务?](#调度全局服务)                                 | ✓         | ✓         |
| [基于资源约束的调度?](#基于资源约束的调度)                     | ✓         | ✓         |

### 调度一定数量的 pods

在 v1.6 中，你可以控制为服务部署的容器副本数量。你可以在 v2.x 中以相同的方式调度 pods，但在编辑工作负载时必须手动设置比例。

![解决规模](/img/rancher/resolve-scale.png)

在迁移期间，你可以通过设置**工作负载类型**选项为**无状态应用**，来解决`output.txt`中的`scale`的问题。

<figcaption>无状态应用选项</figcaption>

![工作负载规模](/img/rancher/workload-type-option.png)

### 调度 pods 到特定节点

正如你可以将容器调度到 Rancher v1.6 中的单个主机一样，也可以将容器调度到 Rancher v2.x 中的单个节点。

部署工作负载时，请使用**调度节点**部分选择要在其上运行 Pod 的节点。调度下面的工作负载在特定节点上部署一个具有两个 pods 规模的 Nginx 映像。

<figcaption>Rancher v2.x：部署工作负载</figcaption>

![工作负载选项卡和按节点分组图标](/img/rancher/schedule-specific-node.png)

Rancher 会将 Pod 调度到你选择的节点如果 1)该节点有足够可用的计算资源，并且 2）如果你已将端口映射配置为使用 HostPort 选项，并且这个节点上没有端口冲突。

如果你使用 NodePort 暴露工作负载，但这个 NodePort 与另一个工作负载的 NodePort 冲突。则仍将成功创建部署，但不会创建相应但 NodePort 服务。因此，工作负载不会暴露在集群外部。

创建工作负载后，你可以确认 pods 是否被调度到了所选节点。从项目视图中，单击 **资源 > 工作负载.**（在 v2.3.0 之前的版本中，单击 **工作负载**选项卡。）单击右上角**按主机分组**图标，以按节点对工作负载进行排序。请注意，两个 Nginx Pod 都调度在同一节点上。

![Pods调度到同一个节点](/img/rancher/scheduled-nodes.png)

### 通过标签进行调度

在 Rancher v2.x 中，你可以约束 pods 使它们被调度到特定节点（在 v1.6 中称为主机）。你可以使用[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)（它们是可以附加到不同 Kubernetes 对象的键/值对）配置工作负载，以便将标记的 pod 分配到特定的节点（或具有特定标签的节点自动分配到工作负载的 pods）。

<figcaption>标签调度选项</figcaption>

| 标签对象     | Rancher v1.6 | Rancher v2.x |
| ------------ | ------------ | ------------ |
| 按节点调度?  | ✓            | ✓            |
| 按 Pod 调度? | ✓            | ✓            |

#### 将标签应用于节点和 Pods

在使用标签调度 pods 之前，必须首先将标签应用于 pods 或节点。

> **注意：**
> 你在 Rancher v1.6 中手动添加的所有标签（*不是*由 Rancher 自动创建的标签）会由迁移工具 CLI 解析，这意味着你不必手动重新给应用打标签。

要将标签应用于容器，请在配置工作负载时在**标签和注释**部分中添加。完成工作负载配置后，可以通过每个被调度的 pod 来查看标签。要将标签应用于节点，请编辑你的节点并在**标签**部分中编辑标签。

### 通过亲和性/反亲和性进行调度

v1.6 中一些最常用的调度功能是亲和性和反亲和性规则。

<figcaption>output.txt 亲和性标签</figcaption>

![亲和性标签](/img/rancher/resolve-affinity.png)

- **亲和性**

  有着相同标签的 pods 都调度到同一节点。可以通过以下两种方式之一配置亲和性：

  | 亲和性 | 描述                                                                                                                                                                                                                       |
  | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **强** | 强亲和性规则意味着所选择的主机必须满足所有调度规则。如果找不到此类主机，则工作负载将无法部署。在 Kubernetes 清单中，此规则转换为`nodeAffinity`指令。<br/><br/>要使用强亲和性，请使用**必须**部分（请参见下图）来配置规则。 |
  | **弱** | Rancher v1.6 用户可能熟悉弱亲和性规则，该规则尝试按规则调度部署，但是即使任何主机都不满足该规则也可以进行部署。<br/><br/>要使用弱亲和性，请使用**首选**部分配置规则（请参见下图）。                                        |

  <figcaption>亲和性规则：强和弱 </figcaption>

  ![亲和性规则](/img/rancher/node-scheduling-affinity.png)

- **反亲和性**

  有着相同标签的 pods 都将调度到不同的节点。换句话说，亲和性彼此*吸引*了一个特定的标签，而反亲和性却从其自身*驱除*了一个标签，以便将 pod 调度到不同的节点。

  你可以使用强或弱亲和性来创建反亲和性规则。但是，在创建规则时，必须使用`在列表中`或`不在列表中`运算符。

  对于反亲和性规则，我们建议使用带有诸如`NotIn`和`DoesNotExist`之类短语的标签，因为当用户应用反亲和性规则时，这些术语会更加直观。

  <figcaption>反亲和性操作符</figcaption>

  ![亲和性](/img/rancher/node-schedule-antiaffinity.png)

有关亲和性和反亲和性的详细文档，请参见[Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity).

你在 UI 中创建的亲和性规则会更新到你的工作负载中，并向工作负载 Kubernetes 清单中添加 pods 亲和性/反亲和性指令。

### 阻止将特定服务调度到特定主机

在 Rancher v1.6 设置中，你可以使用标签阻止将服务调度到特定节点。在 Rancher v2.x 中，你可以使用原生 Kubernetes 调度选项来重现此行为。

在 Rancher v2.x 中，可以通过对节点应用*污染*来阻止将 pods 调度到特定节点。除非具有特殊权限（称为*容忍*），否则不会将 pods 调度到受污染的节点。容忍是一种特殊的标签，允许将 pods 部署到受污染的节点。编辑工作负载时，可以使用**调度节点**部分来应用容忍。点击**显示高级选项**。

<figcaption>使用Tolerations</figcaption>

![容忍](/img/rancher/node-schedule-advanced-options.png)

有关更多信息，请参阅关于[污点和容忍](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/).

### 调度全局服务

Rancher v1.6 包含功能部署 [全局服务](https://docs.rancher.com/docs/rancher/v1.6/en/cattle/scheduling/#global-service)，这些服务会将重复的容器部署到环境中的每个主机（即 Rancher v2.x 术语的集群中的节点）。如果服务声明了`io.rancher.scheduler.global: 'true'`标签，则 Rancher v1.6 会在环境中的每个主机上调度服务容器。

<figcaption>output.txt 全局服务</figcaption>

![全局服务标签](/img/rancher/resolve-global.png)

在 Rancher v2.x 中，你可以使用 [Kubernetes Daemonset](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)（这是一个特定类型的工作负载)。*DaemonSet*的功能与 Rancher v1.6 全局服务完全相同。Kubernetes 调度程序在集群的每个节点上部署一个 pod，并在添加新节点时，只要满足工作负载的调度要求，调度程序就会在它们上面启动新 pod。此外，在 v2.x 中，你还可以限制将 DaemonSet 部署到具有特定标签的节点上。

要在配置工作负载时创建 DaemonSet，请从**工作负载类型**选项中选择**每台主机部署**。

<figcaption>
工作负载配置：选择在每个节点上运行一个容器
</figcaption>

![选择在每个节点上运行一个pod](/img/rancher/workload-type.png)

### 基于资源约束的调度

在 Rancher v1.6 UI 中创建服务时，可以根据你选择的硬件要求将其容器调度到主机。然后基于带宽，内存和 CPU 容量的容器将调度到主机。

在 Rancher v2.x 中，你仍然可以指定 pod 所需的资源。

要声明资源限制，请编辑迁移的工作负载，然后编辑**安全 & 主机**部分。

- 要为你的 pod(s)保留可用的最低硬件条件，请编辑以下部分：

  - 内存预留
  - CPU 预留
  - NVIDIA GPU 预留

- 要为你的 Pod 设置最大硬件条件限制，请编辑：

  - 内存限制
  - CPU 限制

<figcaption>调度：资源约束设置</figcaption>

![资源约束设置](/img/rancher/resource-constraint-settings.png)

你可以在[Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-requests-and-limits-of-pod-and-container)中找到有关这些 Spec 以及如何使用它们的更多详细信息。

## [下一步: 服务发现](/docs/v1.6-migration/discover-services/_index)
