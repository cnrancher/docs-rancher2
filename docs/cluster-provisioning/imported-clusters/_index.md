---
title: 将现有集群导入 Rancher
description: 当管理一个导入的集群时，Rancher 将连接到一个已经设置好的 Kubernetes 集群。因此，Rancher 不提供 Kubernetes，而只设置 Rancher Agent 来与集群通信。Rancher 的集群管理，基于角色的访问控制，策略管理和工作负载等功能在导入集群中可用。请注意，Rancher 中不能配置或扩展导入的集群。对于除 K3s 集群外的所有导入的 Kubernetes 集群，必须在 Rancher 外部编辑集群的配置。例如您需要自己在 Rancher 外部修改 Kubernetes 组件的参数，升级 Kubernetes 版本以及添加删除节点。Rancher v2.4 支持编辑导入的 K3s 集群，您可以在 Rancher UI 中编辑集群来升级 Kubernetes 的功能。
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
  - 创建集群
  - 将现有集群导入 Rancher
---

当管理一个导入的集群时，Rancher 将连接到一个已经设置好的 Kubernetes 集群。因此，Rancher 不提供 Kubernetes，而只设置 Rancher Agent 来与集群通信。

Rancher 的集群管理，基于角色的访问控制，策略管理和工作负载等功能在导入集群中可用。请注意，Rancher 中不能配置或扩展导入的集群。

对于除 K3s 集群外的所有导入的 Kubernetes 集群，必须在 Rancher 外部编辑集群的配置。例如您需要自己在 Rancher 外部修改 Kubernetes 组件的参数，升级 Kubernetes 版本以及添加删除节点。

Rancher v2.4 支持编辑导入的 K3s 集群，您可以在 Rancher UI 中编辑集群来升级 Kubernetes 的功能。

## 功能

在将集群导入到 Rancher 以后，集群所有者可以：

- 通过基于角色的访问控制[管理集群访问](/docs/admin-settings/rbac/cluster-project-roles/_index)。
- 启用[监控](/docs/cluster-admin/tools/monitoring/_index)和[日志](/docs/cluster-admin/tools/logging/_index)
- 启用[Istio](/docs/cluster-admin/tools/istio/_index)
- 启用[OPA Gatekeeper](/docs/cluster-admin/tools/opa-gatekeeper/_index)
- 使用[流水线](/docs/project-admin/pipelines/_index)
- 配置[告警](/docs/cluster-admin/tools/alerts/_index)和[通知](/docs/cluster-admin/tools/notifiers/_index)
- 管理[项目](/docs/project-admin/_index)和[工作负载](/docs/k8s-in-rancher/workloads/_index)

导入 K3s 集群后，集群所有者还可以[从 Rancher UI 升级 Kubernetes 版本](/docs/cluster-admin/upgrading-kubernetes/_index)。

## 先决条件

如果您现有的 Kubernetes 集群已经定义了一个`集群管理员`角色，那么您必须拥有这个`集群管理员`特权才能将集群导入 Rancher。

为了获得特权, 您需要运行：

```bash
kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole cluster-admin \
  --user [USER_ACCOUNT]
```

在运行`kubectl`命令以导入集群之前。

默认情况下，GKE 用户不会获得此权限，因此您需要在导入 GKE 集群之前运行该命令。要了解有关 GKE 基于角色的访问控制的详细信息，请单击[此处](https://cloud.google.com/kubernetes-engine/docs/how-to/role-based-access-control)。

> 如果要导入 K3s 集群，请确保`cluster.yml`可读。默认情况下它是受保护，在导入集群时，您需要访问此文件，如果您在使用`root`用户导入集群，可以跳过此配置。有关详细信息，请参阅[配置 K3s 集群来允许导入到 Rancher 中](#配置-k3s-集群以允许导入到-rancher)

## 导入一个集群

1. 在 **集群** 页, 点击 **添加**。
2. 选择 **导入**。
3. 输入 **集群名称**。
4. 通过**成员角色**来设置用户访问集群的权限。

   - 点击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

5. 单击 **创建**。
6. 这里显示了需要`集群管理员`特权的先决条件 (请参阅上面的**先决条件**)的提示，其中包括了达到该先决条件的示例命令。

7. 将`kubectl`命令复制到剪贴板，并在有着指向您要导入的集群的 kubeconfig 的节点上运行它。如果您不确定它是否正确配置，在运行 Rancher 中显示的命令之前，运行`kubectl get nodes`来验证一下。

8. 如果您正在使用自签名证书，您将收到`certificate signed by unknown authority`消息。要解决这个验证问题，请把 Rancher 中显示的`curl`开头的命令复制到剪贴板中。并在有着指向您要导入的集群的 kubeconfig 的节点上运行它。

9. 在节点上运行完命令后, 单击 **完成**。

**结果：**

- 您的集群创建成功并进入到**Pending**（等待中）的状态。Rancher 正在向您的集群部署资源。
- 在集群状态变为**Active**（激活）状态后，您将可以开始访问您的集群。
- 在**Active**的集群中，默认会有两个项目。`Default`项目（包括`default`命名空间）和`System`项目（包括`cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果这些命名空间存在的话）

> **注意:**
> 您不能重新导入当前在 Rancher 设置中处于活动状态的集群.

## 导入 K3s 集群

您现在可以将 K3s Kubernetes 集群导入 Rancher。[K3s](http://docs.rancher.com/docs/k3s/latest/en/)是一个轻量级的，经过一致性认证的 Kubernetes 发行版。您还可以通过在 Rancher UI 中编辑 K3s 集群来升级 Kubernetes。

### 导入的 K3s 集群的其他功能

_自 v2.4.0 起可用_

导入 K3s 集群时，Rancher 会将其识别为 K3s，除了其他导入的集群支持的功能之外，Rancher UI 还提供以下功能：

- 能够升级 K3s 版本
- 能够配置在升级集群时，同时可以升级的最大节点数
- 在主机详情页，能够查看（不能编辑）启动 K3s 集群时每个节点的 K3s 配置参数和环境变量。

### 升级 K3s 集群

> 在升级之前，请先备份集群。这是 Kubernetes 的最佳实践。升级使用外部数据库的高可用 K3s 集群时，请以关系数据库提供者建议的方式备份数据库。

**并发**是用来定义升级期间允许的不可用的最大节点数。如果不可用的节点的数量大于这个值，则无法升级成功。如果升级失败，您可能需要手动修复或删除发生故障的节点，并再次进行升级。

- **控制平面节并发：** 同时升级的 Server 节点数量；也是最大不可用 Server 节点数量。
- **工作节点并发：** 同时升级的 Worker 节点数量；也是最大不可用 Worker 节点数量。

在 K3s 文档中，控制平面节点称为 Server 节点。这些节点运行 Kubernetes Master 组件，该节点维护集群的所需状态。在 K3s 中，默认情况下，这些控制平面节点也可以运行用户的工作负载。

同样在 K3s 文档中，具有 Wroker 角色的节点也称为 Agent 节点。默认情况下，可以将集群中部署的所有工作负载或 Pod 调度到这些节点。

### 配置 K3s 集群以允许导入到 Rancher

如果要导入 K3s 集群，请确保`cluster.yml`可读。默认情况下它是受保护，在导入集群时，您需要访问此文件，如果您在使用`root`用户导入集群，可以跳过此配置

这可以通过在安装过程中使用`--write-kubeconfig-mode 644`参数来实现：

```
$ curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
```

您也可以使用环境变量`K3S_KUBECONFIG_MODE`指定该选项：

```
$ curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" sh -s -
```

### 导入的 K3s 集群的 debug 日志和故障排查

节点由下游集群中运行的系统升级控制器升级。根据集群配置，Rancher 部署了两个[升级计划](https://github.com/rancher/system-upgrade-controller#example-upgrade-plan)来升级 K3s 节点：一个用于控制平面节点，另一个用于工作节点。系统升级控制器将按照计划来升级节点。

要在系统升级控制器部署上启用 debug 日志，请在[这个配置映射](https://github.com/rancher/system-upgrade-controller/blob/50a4c8975543d75f1d76a8290001d87dc298bdb4/manifests/system-upgrade-controller.yaml#L32)中，想`debug`环境变量设置为 true。然后重新启动`system-upgrade-controller`的 Pod。

通过运行以下命令，可以查看`system-upgrade-controller`输出的日志：

```
kubectl logs -n cattle-system system-upgrade-controller
```

可以使用以下命令查看升级计划的当前状态：

```
kubectl get plans -A -o yaml
```

如果在升级过程中，集群停滞无法继续进行升级，请尝试重新启动`system-upgrade-controller`。

为防止升级时出现问题，请遵循 [Kubernetes 升级最佳实践](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。

## 导入的集群的注释

对于除 K3s 以外的 Kubernetes 集群，在导入到 Rancher 以后，Rancher 没有任何有关集群是如何启动或配置的信息。

因此，当 Rancher 导入集群时，Rancher 默认禁用了一些功能。这样可以避免在 UI 中暴露一些在导入集群中可能无法正常工作的功能。

但是，如果集群具有一定的**能力**（例如使用 Pod 安全策略的**能力**），则该集群的用户可能仍想在 Rancher UI 中为该集群选择 Pod 安全策略。为此，用户将需要手动通知 Rancher 已为该集群启用了 Pod 安全策略。

通过注释导入的集群，可以使 Rancher 知道该集群已在 Rancher 之外配置了 Pod 安全策略或其他**能力**。

此示例注释代表该集群已启用了 Pod 安全策略：

```json
"capabilities.cattle.io/pspEnabled": "true"
```

以下注释代表 Ingress 能力。请注意，非基本类型的值需要进行 JSON 编码，并带上引号。

```json
"capabilities.cattle.io/ingressCapabilities": "[{"customDefaultBackend":true,"ingressProvider":"asdf"}]"
```

可以为集群添加以下能力，从而使您可以在 Rancher UI 中执行更多操作：

- `ingressCapabilities`
- `loadBalancerCapabilities`
- `nodePoolScalingSupported`
- `nodePortRange`
- `pspEnabled`
- `taintSupport`

可以在 Rancher API UI 中的`[Rancher Server URL]/v3/schemas/capabilities`查看所有能力及其定义。

要注释导入的集群，

1. 转到 Rancher 中的集群视图，然后选择**省略号>编辑**。
1. 展开**标签和注释**部分。
1. 单击**添加注释**。
1. 添加格式为`capabilities/<capability>: <value>`的注释，其中`value`将覆盖 Rancher 中该导入集群的**能力开关**。除非添加相关注释，否则 Rancher 不会意识到该集群的有相关的能力。
1. 点击**保存。**

**结果：** 注释并不能将**能力**提供给集群，但可以让 Rancher 知道该集群具有这些能力，从而可以在 UI 中为这个导入集群暴露更多的功能。
