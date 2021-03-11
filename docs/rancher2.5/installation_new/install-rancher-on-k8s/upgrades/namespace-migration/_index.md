---
title: 升级到 v2.0.7+ 版本时的命名空间迁移
description: 本节仅适用于从 v2.0.6 或更早版本升级到 v2.0.7 或更高版本的 Rancher。从 v2.0.7 升级到更高版本不受影响。在 Rancher v2.0.6 及更低版本中，默认情况下，未将对 Rancher 和 Kubernetes 操作至关重要的系统命名空间分配给任何 Rancher 项目。相反，这些命名空间独立于所有 Rancher 项目而存在，但是您可以将这命名空间移至任何项目中而不会影响集群操作。
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
  - 安装指南
  - 高可用安装指南
  - 升级指南
  - 高可用升级指南
  - 升级到 v2.0.7+ 版本时的命名空间迁移
---

本节仅适用于从 v2.0.6 或更早版本升级到 v2.0.7 或更高版本的 Rancher。从 v2.0.7 升级到更高版本不受影响。

在 Rancher v2.0.6 及更低版本中，默认情况下，Rancher 不会将系统命名空间分配给任何 Rancher 项目。这些命名空间独立于所有 Rancher 项目而存在。但是您可以将这命名空间移至任何项目中，不会影响集群操作。

这些命名空间包括：

- `kube-system`
- `kube-public`
- `cattle-system`
- `cattle-alerting`<sup>1</sup>
- `cattle-logging`<sup>1</sup>
- `cattle-pipeline`<sup>1</sup>
- `ingress-nginx`

> <sup>1</sup> 仅在集群启用了此功能时显示。

但是，随着 Rancher v2.0.7 的发布，引入了`System`项目。在升级过程中，将自动创建的该项目，并将上面的系统命名空间移动到该项目，存放这些关键组件。

在从 Rancher v2.0.6- 升级到 Rancher v2.0.7+ 的过程中，所有系统命名空间均从其位于所有项目之外的默认位置移至新创建的`System`项目中。但是，如果在升级之前您已经将任何系统的命名空间分配给了某个项目，那么在升级之后可能会遇到集群网络相关的问题。发生此问题是因为系统命名空间在升级过程中不在升级所期望的位置，因此 Rancher 无法将其移至`System`项目。

- 想在升级之前防止此问题发生，请参阅[防止集群网络问题](#防止集群网络问题)。

- 要在升级后解决此问题，请参阅[恢复集群网络](#恢复集群网络)。

> **注意：** 如果要从 Rancher v2.0.13 或更早版本或 v2.1.8 或更早版本升级，并且集群的证书已过期，则需要执行[其他步骤](/docs/rancher2.5/cluster-admin/certificate-rotation/_index)轮换证书。

## 防止集群网络问题

通过从所有 Rancher 项目中移出系统命名空间，可以防止在升级到 v2.0.7+ 时发生集群网络问题。如果您已将任何集群的系统命名空间分配给了某个 Rancher 项目，请完成此任务。

1. 升级前，登录 Rancher UI。

1. 从上下文菜单中，打开`local`集群（或任何其他集群）。

1. 从主菜单中，选择**项目/命名空间**。

1. 查找并选择以下命名空间。单击**移动**，然后选择**无**将其移出项目。再次单击**移动**。

   > **注意：** 这些命名空间中的某些或全部可能已经从所有项目中移出。

   - `kube-system`
   - `kube-public`
   - `cattle-system`
   - `cattle-alerting`<sup>1</sup>
   - `cattle-logging`<sup>1</sup>
   - `cattle-pipeline`<sup>1</sup>
   - `ingress-nginx`

   > <sup>1</sup> 仅在集群启用了此功能时显示。

   <figcaption>将命名空间移出项目</figcaption>

   ![移动命名空间](/img/rancher/move-namespaces.png)

1. 在每个已经给系统命名空间分配了项目的集群中重复这些步骤。

**结果：** 在 Rancher 项目中移出了所有系统命名空间。现在，您可以安全地开始[升级](/docs/rancher2.5/installation_new/install-rancher-on-k8s/upgrades/_index)。

## 恢复集群网络

重置集群节点的网络策略以恢复连接。

> **先决条件：**
>
> 下载并设置 [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)。

### 恢复 Rancher 高可用所在集群的网络

1.  在 **终端**中，将目录更改为在 Rancher 安装期间生成的 kubectl 文件，即`kube_config_rancher-cluster.yml`。该文件通常位于 Rancher 安装过程中运行 RKE 的目录中。

1.  在修复网络之前，请运行以下两个命令以确保您的节点的状态为 `Ready` ，并且集群组件的状态为 `Healthy`。

    ```
    kubectl --kubeconfig kube_config_rancher-cluster.yml get nodes

    NAME                          STATUS    ROLES                      AGE       VERSION
    165.227.114.63                Ready     controlplane,etcd,worker   11m       v1.10.1
    165.227.116.167               Ready     controlplane,etcd,worker   11m       v1.10.1
    165.227.127.226               Ready     controlplane,etcd,worker   11m       v1.10.1

    kubectl --kubeconfig kube_config_rancher-cluster.yml get cs

    NAME                 STATUS    MESSAGE              ERROR
    scheduler            Healthy   ok
    controller-manager   Healthy   ok
    etcd-0               Healthy   {"health": "true"}
    etcd-2               Healthy   {"health": "true"}
    etcd-1               Healthy   {"health": "true"}
    ```

1.  通过运行以下命令检查所有集群的 `networkPolicy` 命令。

        kubectl --kubeconfig kube_config_rancher-cluster.yml get cluster -o=custom-columns=ID:.metadata.name,NAME:.spec.displayName,NETWORKPOLICY:.spec.enableNetworkPolicy,APPLIEDNP:.status.appliedSpec.enableNetworkPolicy,ANNOTATION:.metadata.annotations."networking\.management\.cattle\.io/enable-network-policy"

        ID      NAME    NETWORKPOLICY   APPLIEDNP   ANNOTATION
        c-59ptz custom  <nil>           <nil>       <none>
        local   local   <nil>           <nil>       <none>

1.  对所有集群禁用`networkPolicy`，仍然指向您的`kube_config_rancher-cluster.yml`.

        kubectl --kubeconfig kube_config_rancher-cluster.yml get cluster -o jsonpath='{range .items[*]}{@.metadata.name}{"\n"}{end}' | xargs -I {} kubectl --kubeconfig kube_config_rancher-cluster.yml patch cluster {} --type merge -p '{"spec": {"enableNetworkPolicy": false},"status": {"appliedSpec": {"enableNetworkPolicy": false }}}'

    > **提示：** 如果您想为所有已创建的集群继续启用`networkPolicy`，则可以运行以下命令为`local`集群（即 Rancher Server 节点）禁用：
    >
    > ```
    >  kubectl --kubeconfig kube_config_rancher-cluster.yml patch cluster local --type merge -p '{"spec": {"enableNetworkPolicy": false},"status": {"appliedSpec": {"enableNetworkPolicy": false }}}'
    > ```

1.  删除所有集群的 network policy 注释

        kubectl --kubeconfig kube_config_rancher-cluster.yml get cluster -o jsonpath='{range .items[*]}{@.metadata.name}{"\n"}{end}' | xargs -I {} kubectl --kubeconfig kube_config_rancher-cluster.yml annotate cluster {} "networking.management.cattle.io/enable-network-policy"="false" --overwrite

    > **提示：** 如果您想为所有已创建的集群继续启用`networkPolicy`，则可以运行以下命令为`local`集群（即 Rancher Server 节点）禁用：
    >
    > ```
    >  kubectl --kubeconfig kube_config_rancher-cluster.yml annotate cluster local "networking.management.cattle.io/enable-network-policy"="false" --overwrite
    > ```

1.  再次检查所有集群的`networkPolicy` 以确保策略的状态为 `false`。

        kubectl --kubeconfig kube_config_rancher-cluster.yml get cluster -o=custom-columns=ID:.metadata.name,NAME:.spec.displayName,NETWORKPOLICY:.spec.enableNetworkPolicy,APPLIEDNP:.status.appliedSpec.enableNetworkPolicy,ANNOTATION:.metadata.annotations."networking\.management\.cattle\.io/enable-network-policy"

        ID      NAME    NETWORKPOLICY   APPLIEDNP   ANNOTATION
        c-59ptz custom  false           false       false
        local   local   false           false       false

1.  从所有命名空间中删除所有网络策略。使用 RKE 生成的 kubeconfig 为每个集群运行此命令。

    ```
    for namespace in $(kubectl --kubeconfig kube_config_rancher-cluster.yml get ns -o custom-columns=NAME:.metadata.name --no-headers); do
        kubectl --kubeconfig kube_config_rancher-cluster.yml -n $namespace delete networkpolicy --all;
    done
    ```

1.  删除为集群创建的所有项目网络策略，以确保未重新创建网络策略。

    ```
    for cluster in $(kubectl --kubeconfig kube_config_rancher-cluster.yml get clusters -o custom-columns=NAME:.metadata.name --no-headers); do
        for project in $(kubectl --kubeconfig kube_config_rancher-cluster.yml get project -n $cluster -o custom-columns=NAME:.metadata.name --no-headers); do
            kubectl --kubeconfig kube_config_rancher-cluster.yml delete projectnetworkpolicy -n $project --all
        done
    done
    ```

    > **提示：** 如果您想为所有已创建的集群继续启用`networkPolicy`，则可以运行以下命令为`local`集群（即 Rancher Server 节点）禁用：
    >
    > ```
    >  for project in $(kubectl --kubeconfig kube_config_rancher-cluster.yml get project -n local -o custom-columns=NAME:.metadata.name --no-headers); do
    >     kubectl --kubeconfig kube_config_rancher-cluster.yml -n $project delete projectnetworkpolicy --all;
    > done
    > ```

1.  等待几分钟，然后登录到 Rancher UI。

    - 如果您可以访问 Rancher，则操作已完成，因此可以跳过其余步骤。
    - 如果您仍然无法访问 Rancher，请完成以下步骤。

1.  通过输入以下命令来强制您的 Pod 重新创建。

    ```
    kubectl --kubeconfig kube_config_rancher-cluster.yml delete pods -n cattle-system --all
    ```

1.  登录到 Rancher UI 并查看您的集群。创建的集群将显示无法连接 Rancher 的错误。但是，这些错误将会自动解决。

### 恢复通过 Rancher 部署的 RKE 集群的网络

如果您可以访问 Rancher，但是使用 Rancher 启动的一个或多个 RKE 集群没有网络，则可以通过下面的方法修复它们。

- 通过集群的[内嵌的 kubectl shell](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/_index#在-rancher-ui-中使用-kubectl-shell-访问集群)。
- 在工作站中[下载集群 kubeconfig 文件](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/_index#从您的虚拟机上使用-kubectl-访问集群)并运行它。

  ```
  for namespace in $(kubectl --kubeconfig kube_config_rancher-cluster.yml get ns -o custom-columns=NAME:.metadata.name --no-headers); do
    kubectl --kubeconfig kube_config_rancher-cluster.yml -n $namespace delete networkpolicy --all;
  done
  ```
