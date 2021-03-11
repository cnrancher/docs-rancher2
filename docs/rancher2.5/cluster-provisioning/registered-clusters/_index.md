---
title: 注册集群
description: 从 Rancher v2.5.0 开始，注册集群代替了原有的导入集群功能。Rancher 具有管理这些已注册集群的权限。具体权限取决于集群类型。相对 Rancher v2.5.0 之前提供的导入集群功能来说，注册集群更加方便使用和管理。
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
  - 创建集群
  - 注册集群
---

_从 v2.5 开始可用_

从 Rancher v2.5.0 开始，**注册集群**代替了原有的**导入集群**功能。

Rancher 具有管理这些已注册集群的权限。具体权限取决于集群类型。

相对 Rancher v2.5.0 之前提供的**导入集群**功能来说，**注册集群**更加方便使用和管理。

## 前提条件

如果您现有的 Kubernetes 集群已经定义了一个`cluster-admin`角色，您必须拥有这个 `cluster-admin`特权才能在 Rancher 中注册集群。

为了应用该权限，首先运行以下命令：

```bash
kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole cluster-admin \
  --user [USER_ACCOUNT]
```

然后再运行`kubectl`命令注册这个集群。

默认情况下，GKE 用户不具有此权限，因此您需要在注册 GKE 集群之前运行该命令。要了解更多关于 GKE 的基于角色的访问控制，请点击[这里](https://cloud.google.com/kubernetes-engine/docs/how-to/role-based-access-control)。

如果你要注册一个 K3s 集群，请确保`cluster.yml`是可读的。默认情况下，它是受保护的。详情请参考[配置一个 K3s 集群以启用导入 Rancher](#配置一个-K3s-集群以启用导入-Rancher)。

## 操作步骤

1. 在 **集群** 页, 单击 **添加**。
2. 选择 **注册**。
3. 输入 **集群名称**。
4. 通过**成员角色**来设置用户访问集群的权限。

   - 单击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

5. 单击 **创建**。
6. 这里显示了需要`集群管理员`特权的先决条件 (请参阅上面的**先决条件**)的提示，其中包括了达到该先决条件的示例命令。

7. 将`kubectl`命令复制到剪贴板，并在有着指向您要导入的集群的 kubeconfig 的节点上运行它。如果您不确定它是否正确配置，在运行 Rancher 中显示的命令之前，运行`kubectl get nodes`进行验证。

8. 如果您正在使用自签名证书，您将收到`certificate signed by unknown authority`消息。要解决这个验证问题，请把 Rancher 中显示的`curl`开头的命令复制到剪贴板中。并在有着指向您要导入的集群的 kubeconfig 的节点上运行它。

9. 在节点上运行完命令后，单击 **完成**。

**结果：**

- 您的集群创建成功并进入到**Pending**（等待中）的状态。Rancher 正在向您的集群部署资源。
- 在集群状态变为**Active**（激活）状态后，您将可以开始访问您的集群。
- 在**Active**的集群中，默认会有两个项目：`Default`项目（包括`default`命名空间）和`System`项目（包括`cattle-system`、`ingress-nginx`、`kube-public` 和 `kube-system`）。

:::note 注意
您不能重新注册当前在 Rancher 设置中处于**Active**状态的集群。
:::

### 配置一个 K3s 集群以启用导入 Rancher

K3s server 需要被配置为允许写入 kubeconfig 文件，以下是两种配置允许写入的方式：

- 您可以通过在安装过程中传递`--write-kubeconfig-mode 644`作为一个标志来实现：

        ```bash
        $ curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
        ```

- 该选项也可以使用环境变量`K3S_KUBECONFIG_MODE`来指定：

        ```bash
        $ curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" sh -s -
        ```

## Rancher 对于注册集群的管理权限

Rancher 具有管理这些已注册集群的权限。具体权限取决于集群类型。以下内容分别罗列了 Rancher 对于全部集群的管理权限和对于 K3s 集群的管理权限。

### 所有集群

完成注册后，集群所有者具有以下权限：

- 通过基于角色的访问控制，[管理集群访问权限](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/_index)。
- 启用[监控、告警和通知](/docs/rancher2.5/monitoring-alerting/2.5/_index)。
- 启用[日志](/docs/rancher2.5/logging/2.5/_index)。
- 启用[Istio](/docs/rancher2.5/istio/2.5/_index)。
- 使用[流水线](/docs/rancher2.5/project-admin/pipelines/_index)。
- 管理项目和工作负载。

### K3s 集群

[K3s](/docs/k3s/_index)是一个轻量化的，完全符合 Kubernetes 的发行版。

当一个 K3s 集群在 Rancher 中注册后，Rancher 会将其识别为 K3s。集群所有者对于 K3s 拥有上述的所有权限，除此之外，还有以下权限用于编辑和升级 K3s 集群：

- 能够[升级 K3s 版本](/docs/rancher2.5/cluster-admin/upgrading-kubernetes/_index)
- 能够配置同时升级的最大节点数量。
- 能够看到 K3s 集群的配置参数和环境变量的只读版本，用于启动集群中的每个节点。

### 注册 EKS 集群的附加功能

注册亚马逊 EKS 集群可以让 Rancher 将其视为在 Rancher 中创建的。

Amazon EKS 集群现在可以在 Rancher 中注册。在大多数情况下，注册的 EKS 集群和在 Rancher 中创建的 EKS 集群在 Rancher UI 中的处理方式是一样的，但删除除外。

当您删除在 Rancher 中创建的 EKS 集群时，该集群将被销毁。当您删除在 Rancher 中注册的 EKS 集群时，它将与 Rancher 服务器断开连接，但它仍然存在，您仍然可以以在 Rancher 中注册之前的方式访问它。

已注册的 EKS 集群的功能列在[本页](/docs/rancher2.5/cluster-provisioning/_index)的表格中。

## 配置 K3s 集群升级

升级前备份集群是 Kubernetes 的最佳实践。当升级具有外部数据库的高可用性 K3s 集群时，请以关系数据库厂商推荐的方式备份数据库。

在升级期间，**并发**是允许不可用的最大节点数。不可用的节点数大于**并发量**会导致升级失败。如果碰到升级失败的情况，您可能需要在升级成功之前修复或删除失败的节点。

- **controlplane 节点并发量**：一次升级的最大 server 节点数；也是最大不可用的 server 节点数。
- **worker 节点并发量**：同时升级的最大 worker 节点数；也是最大不可用的 worker 节点数。

在 K3s 文档中，controlplane 点被称为 server 节点。这些节点运行 Kubernetes master，它维护集群的期望状态。在 K3s 中，这些 controlplane 节点具有默认将工作负载调度给它们的能力。

同时在 K3s 文档中，具有 worker 角色的节点被称为 agent 节点。集群中部署的任何工作负载或 Pods 都可以默认调度到这些节点上。

## 日志调试和故障排除

节点由运行在下游集群中的系统升级控制器进行升级。根据集群配置，Rancher 部署两个[计划](https://github.com/rancher/system-upgrade-controller#example-upgrade-plan)来升级 K3s 节点：一个用于 controlplane 节点，一个用于 worker 节点。系统升级控制器按照计划对节点进行升级。

要启用系统升级控制器部署的调试日志，编辑[configmap](https://github.com/rancher/system-upgrade-controller/blob/50a4c8975543d75f1d76a8290001d87dc298bdb4/manifests/system-upgrade-controller.yaml#L32)，将调试环境变量设置为 true。然后重新启动`system-upgrade-controller` pod。

您可以通过运行以下命令查看`system-upgrade-controller`创建的日志：

```bash
kubectl logs -n cattle-system system-upgrade-controller
```

可以通过该命令查看计划的当前状态：

```bash
kubectl get plans -A -o yaml
```

如果集群在升级时卡住了，请重启`system-upgrad-controller`。

为了防止升级时出现问题，应参考[Kubernetes 升级最佳实践](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。

## 为注册集群添加注释

对于除了 K3s Kubernetes 集群以外的所有类型的注册 Kubernetes 集群，Rancher 没有任何关于启动或配置集群的信息。

因此，当 Rancher 注册一个集群时，它假设有几个功能是默认禁用的。Rancher 这样做是为了避免向用户暴露 UI 选项，即使在注册的集群中没有启用这些功能。

但是，如果集群具有某种能力，例如使用 pod 安全策略的能力，该集群的用户可能仍然希望在 Rancher UI 中为集群选择 pod 安全策略。为了做到这一点，用户需要向 Rancher 手动指示为集群启用 pod 安全策略。

通过对已注册的集群进行注释，可以向 Rancher 表明集群在 Rancher 之外被赋予了 Pod 安全策略或其他功能。

此示例注释表示启用了 pod 安全策略：

```json
"capabilities.cattle.io/pspEnabled": "true"
```

下面的注释表示 Ingress 能力。请注意，非原生对象的值需要用 JSON 编码，并加引号。

```json
"capabilities.cattle.io/ingressCapabilities": "[
  {
    "customDefaultBackend":true,
    "ingressProvider":"asdf"
  }
]"
```

如果您的集群具有这些能力，您可以为它们在集群中添加注释：

- `ingressCapabilities`
- `loadBalancerCapabilities`
- `nodePoolScalingSupported`
- `nodePortRange`
- `pspEnabled`
- `taintSupport`

所有的功能和它们的类型定义都可以在 Rancher API 视图中查看，网址是`[Rancher Server URL]/v3/schemas/capabilities`。

请参考以下步骤为注册集群添加注释：

1. 转到 Rancher 中的集群视图，选择 **&#8942；>编辑**。
1. 展开**标签和注释**部分。
1. 单击**添加注释**。
1. 向集群添加注释，格式为`capabilities/<capability>: <value>`其中`value`是将被注解覆盖的集群能力。在这种情况下，Rancher 并不知道集群的任何能力，直到你添加注解。
1. 单击**保存**。

**结果：**添加的注释仅仅只是注释，并不代表集群真的具有注释描述的能力。但注释向 Rancher 表明集群具有这些能力。
