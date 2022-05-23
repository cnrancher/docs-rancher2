---
title: 注册现有集群
weight: 6
---

集群注册功能取代了导入集群的功能。

Rancher 管理注册集群的范围取决于集群的类型。详情请参见[对注册集群的管理能力](#management-capabilities-for-registered-clusters)。

- [前提](#prerequisites)
- [注册集群](#registering-a-cluster)
- [对注册集群的管理能力](#management-capabilities-for-registered-clusters)
- [配置 K3s 集群升级](#configuring-k3s-cluster-upgrades)
- [已注册 K3s 集群的调试日志记录和故障排除](#debug-logging-and-troubleshooting-for-registered-k3s-clusters)
- [对 RKE2 和 K3s 集群的授权集群端点（ACE）支持](#authorized-cluster-endpoint-support-for-rke2-and-k3s-clusters)
- [注释已注册的集群](#annotating-registered-clusters)

## 前提

### Kubernetes 节点角色

已注册的 RKE Kubernetes 集群必须具有所有三个节点角色，分别是 etcd、control plane 和 worker。只有 control plane 组件的集群无法在 Rancher 中注册。

有关 RKE 节点角色的更多信息，请参阅[最佳实践]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/production/#cluster-architecture)。

### 权限

如果你现有的 Kubernetes 集群已经定义了 `cluster-admin` 角色，则你必须具有此 `cluster-admin` 权限才能在 Rancher 中注册集群。

为了应用权限，你需要先运行：

```plain
kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole cluster-admin \
  --user [USER_ACCOUNT]
```

然后再运行 `kubectl` 命令来注册集群。

默认情况下，GKE 用户没有此权限，因此你需要在注册 GKE 集群之前运行该命令。要详细了解 GKE 基于角色的访问控制，请单击[此处](https://cloud.google.com/kubernetes-engine/docs/how-to/role-based-access-control)。

如果你正在注册 K3s 集群，请确保 `cluster.yml` 是可读的。默认情况下它受到保护。详情请参考[配置 K3s 集群以导入到 Rancher](#configuring-a-k3s-cluster-to-enable-registration-in-rancher)。

### EKS 集群

EKS 集群必须至少有一个托管节点组才能导入 Rancher 或通过 Rancher 进行配置。

## 注册集群

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面上，单击**导入集群**。
1. 选择集群类型。
1. 输入**集群名称**。
1. 使用**成员角色**为集群配置用户授权。点击**添加成员**添加可以访问集群的用户。使用**角色**下拉菜单为每个用户设置权限。
1. 如果是通用自定义集群，使用**集群选项**下的 **Agent 环境变量**为 [rancher cluster agent]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/rancher-agents/) 设置环境变量。你可以使用键值对设置环境变量。如果 Rancher Agent 需要使用代理与 Rancher Server 通信，则可以使用 Agent 环境变量设置 `HTTP_PROXY`、`HTTPS_PROXY` 和 `NO_PROXY` 环境变量。
1. 单击**创建**。
1. 此处会显示 `cluster-admin` 权限的先决条件（参见上文的**先决条件**），其中包括满足先决条件的示例命令。
1. 将 `kubectl` 命令复制到剪贴板，并在配置了 kubeconfig 的节点上运行该命令，从而指向要导入的集群。如果你不确定配置是否正确，请在运行 Rancher 显示的命令之前运行 `kubectl get nodes` 进行验证。
1. 如果你使用自签名证书，你将收到 `certificate signed by unknown authority` 的消息。要解决此验证问题，请将 Rancher 中显示的以 `curl` 开头的命令复制到剪贴板。然后在配置了 kubeconfig 的节点上运行该命令，从而指向要导入的集群。
1. 在节点上运行完命令后，单击**完成**。

**结果**：

- 集群已注册并分配了 **Pending** 状态。Rancher 正在部署资源来管理你的集群。</li>
- 当集群状态变为 **Active** 后，你可访问集群。
- **Active** 集群分配了两个项目，分别是 `Default`（包含命名空间 `default`）和 `System`（包含命名空间 `cattle-system`、`ingress-nginx`、`kube-public` 和 `kube-system`）。

> **注意**：
> 无法重新注册当前在 Rancher 中处于 Active 状态的集群。

### 配置 K3s 集群以在 Rancher 中启用注册

K3s server 需要配置为允许写入 kubeconfig 文件。

这可以通过在安装期间传递 `--write-kubeconfig-mode 644` 作为标志来完成：

```
$ curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
```

你也可以使用 `K3S_KUBECONFIG_MODE` 环境变量来指定该选项：

```
$ curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" sh -s -
```

### 使用 Terraform 配置导入的 EKS 集群

你**仅**需要定义 Rancher 使用 Terraform 导入 EKS 集群所需的最少字段。请谨记这点，因为 Rancher 会使用用户提供的任何配置覆盖 EKS 集群中的配置。

> **警告**：即使当前 EKS 集群的配置与用户提供的配置之间只存在微小差异，但是微小的差异也有可能产生很大的影响。

Rancher 通过 `eks_config_v2` 使用 Terraform 导入 EKS 集群所需的最少配置字段如下：

- cloud_credential_id
- name
- region
- imported （对于导入的集群，此字段应始终设置为 `true`）

导入的 EKS 集群的示例 YAML 配置：

```
resource "rancher2_cluster" "my-eks-to-import" {
  name        = "my-eks-to-import"
  description = "Terraform EKS Cluster"
  eks_config_v2 {
    cloud_credential_id = rancher2_cloud_credential.aws.id
    name                = var.aws_eks_name
    region              = var.aws_region
    imported            = true
  }
}
```

## 对注册集群的管理能力

Rancher 管理注册集群的范围取决于集群的类型。

- [所有已注册集群的功能](#2-5-8-features-for-all-registered-clusters)
- [已注册 K3s 集群的附加功能](#2-5-8-additional-features-for-registered-k3s-clusters)
- [已注册的 EKS 和 GKE 集群的附加功能](#additional-features-for-registered-eks-and-gke-clusters)

### 所有已注册集群的功能

注册集群后，集群所有者可以：

- 通过基于角色的访问控制[管理集群访问]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/)
- 启用[监控、告警和通知]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/)
- 启用[日志管理]({{<baseurl>}}/rancher/v2.6/en/logging/)
- 启用 [Istio]({{<baseurl>}}/rancher/v2.6/en/istio/)
- 使用[管道]({{<baseurl>}}/rancher/v2.6/en/project-admin/pipelines/)
- 管理项目和工作负载

### 已注册 K3s 集群的附加功能

[K3s]({{<baseurl>}}/k3s/latest/en/) 是一个轻量且完全兼容的 Kubernetes 发行版。

K3s 集群注册到 Rancher 后，Rancher 会将它识别为 K3s。Rancher UI 将开放[所有已注册集群](#features-for-all-registered-clusters)的功能，以及以下用于编辑和升级集群的功能：

- [升级 K3s 版本]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/upgrading-kubernetes/)
- 配置能同时升级的最大节点数
- 查看 K3s 集群的配置参数和用于启动集群中每个节点的环境变量的只读版本

### 已注册的 EKS 和 GKE 集群的附加功能

如果你注册了 Amazon EKS 或 GKE 集群，Rancher 将视其为在 Rancher 中创建的集群。

你现在可以将 Amazon EKS 和 GKE 集群注册到 Rancher。在大多数情况下，注册的集群和在 Rancher UI 中创建的集群的处理方式相同（除了删除）。

删除在 Rancher 中创建的 EKS 或 GKE 集群后，该集群将被销毁。删除在 Rancher 中注册集群时，它与 Rancher Server 会断开连接，但它仍然存在。你仍然可以像在 Rancher 中注册之前一样访问它。

[此页面]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/)上的表格中列出了已注册集群的功能。

## 配置 K3s 集群升级

> Kubernetes 的最佳实践是在升级之前备份集群。使用外部数据库升级高可用 K3s 集群时，请使用关系数据库提供商推荐的方式备份数据库。

**并发**是升级期间允许不可用的最大节点数。如果不可用节点的数量大于**并发**，升级将失败。如果升级失败，你可能需要修复或移除失败的节点，然后升级才能成功。

- **Control Plane 并发**：可以同时升级的最大服务器节点数；也是最大不可用服务器节点数
- **Worker 并发**：可以同时升级的最大 worker 节点数；也是最大不可用 worker 节点数

在 K3s 文档中，Control Plane 节点也称为 server 节点。Kubernetes 主节点运行在这些节点上，用于维护集群的状态。在 K3s 中，control plane 节点默认能够让工作负载调度到节点上。

类似的，在 K3s 文档中，具有 worker 角色的节点称为 Agent 节点。默认情况下，部署在集群中的任何工作负载或 Pod 都能调度到这些节点上。

## 已注册 K3s 集群的调试日志记录和故障排除

节点由运行在下游集群中的 `system-upgrade-controller` 升级。基于集群配置，Rancher 部署了两个[计划](https://github.com/rancher/system-upgrade-controller#example-upgrade-plan)来升级 K3s 节点，分别用于升级 control plane 节点和 worker 节点。`system-upgrade-controller` 会按照计划对节点进行升级。

要在 `system-upgrade-controller` deployment 上启用调试日志记录，请编辑 [configmap](https://github.com/rancher/system-upgrade-controller/blob/50a4c8975543d75f1d76a8290001d87dc298bdb4/manifests/system-upgrade-controller.yaml#L32) 以将调试环境变量设置为 true。然后重启 `system-upgrade-controller` pod。

你可以运行以下命令查看 `system-upgrade-controller` 创建的日志：

```
kubectl logs -n cattle-system system-upgrade-controller
```

运行以下命令查看计划的当前状态：

```
kubectl get plans -A -o yaml
```

如果集群卡在升级中，请重启 `system-upgrade-controller`。

为防止升级时出现问题，应遵循 [Kubernetes 升级最佳实践](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)进行操作。

## 对 RKE2 和 K3s 集群的授权集群端点（ACE）支持

_从 v2.6.3 起可用_

授权集群端点 (ACE) 已支持注册的 RKE2 和 K3s 集群。此支持还包括你在下游集群上启用 ACE 的手动步骤。有关授权集群端点的更多信息，请单击[这里]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/ace/)。

> **注意**：
>
> - 只需要在下游集群的 control plane 节点上执行这些步骤。你必须单独配置每个 control plane 节点。
>
> - 以下步骤适用于在 v2.6.x 中注册的 RKE2 和 K3s 集群，以及从先前的 Rancher 版本注册（或导入）并升级到 v2.6.x 的集群。
>
> - 这些步骤将改变下游 RKE2 和 K3s 集群的配置并部署 `kube-api-authn-webhook`。如果 ACE 的未来实现需要更新 `kube-api-authn-webhook`，那么这也必须手动完成。有关此 webhook 的更多信息，请单击[此处]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/ace/#about-the-kube-api-auth-authentication-webhook)。

###### **在每个下游集群的 control plane 上启用 ACE 的手动执行步骤**：

1.  在 `/var/lib/rancher/{rke2,k3s}/kube-api-authn-webhook.yaml` 创建一个文件，内容如下：

        apiVersion: v1
        kind: Config
        clusters:
        - name: Default
          cluster:
            insecure-skip-tls-verify: true
            server: http://127.0.0.1:6440/v1/authenticate
        users:
        - name: Default
          user:
            insecure-skip-tls-verify: true
        current-context: webhook
        contexts:
        - name: webhook
          context:
            user: Default
            cluster: Default

1.  将以下内容添加到配置文件中（如果文件不存在，则创建一个）。请注意，默认位置是 `/etc/rancher/{rke2,k3s}/config.yaml`：

        kube-apiserver-arg:
            - authentication-token-webhook-config-file=/var/lib/rancher/{rke2,k3s}/kube-api-authn-webhook.yaml

1.  运行以下命令：

        sudo systemctl stop {rke2,k3s}-server
        sudo systemctl start {rke2,k3s}-server

1.  最后，你**必须**返回 Rancher UI 并在那里编辑导入的集群，从而完成 ACE 启用。单击 **⋮ > 编辑配置**，然后单击**集群配置**下的**网络**选项卡。最后，单击**授权端点**的**启用**按钮。启用 ACE 后，你可以输入完全限定的域名 (FQDN) 和证书信息。

    > **注意**：<b>FQDN</b> 字段是可选的。如果指定了该字段，它应该指向下游集群。仅当下游集群前面有使用了不受信任证书的负载均衡器时才需要证书信息。如果你使用的是有效证书，则不需要填写 <b>CA 证书</b>字段。

## 注释已注册的集群

Rancher 没有注册的 Kubernetes 集群（除了 K3s Kubernetes 集群之外）如何预置或配置集群的任何信息。

因此，当 Rancher 注册集群时，它假设某些功能是默认禁用的。Rancher 这样做是为了避免向用户暴露 UI 选项（即使注册的集群没有启用这些功能）。

但是，如果集群具有某种功能（例如使用 pod 安全策略），那么该集群的用户可能仍希望在 Rancher UI 中为集群选择 pod 安全策略。为此，用户需要手动让 Rancher 知道集群已启用 pod 安全策略。

通过对已注册的集群进行注释，你可以向 Rancher 表明集群在 Rancher 之外被赋予了 Pod 安全策略或其他功能。

此示例注释表示启用了 pod 安全策略：

```
"capabilities.cattle.io/pspEnabled": "true"
```

以下注释表示 Ingress 功能。请注意，非原始对象的值需要进行 JSON 编码，并转义引号：

```
"capabilities.cattle.io/ingressCapabilities": "[
  {
    "customDefaultBackend":true,
    "ingressProvider":"asdf"
  }
]"
```

你可以为集群注释以下功能：

- `ingressCapabilities`
- `loadBalancerCapabilities`
- `nodePoolScalingSupported`
- `nodePortRange`
- `pspEnabled`
- `taintSupport`

所有功能及其类型定义都可以在 Rancher API 视图中查看，地址是 `[Rancher Server URL]/v3/schemas/capabilities`。

要注释已注册的集群：

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面上，转到要注释的自定义集群，然后单击 **⋮ > 编辑配置**。
1. 展开**标签 & 注释**。
1. 单击**添加注释**。
1. 使用 `capabilities/<capability>: <value>` 格式向集群添加注释，其中 `value` 是要使用注释覆盖的集群功能。在这种情况下，Rancher 在你添加注释之前都不知道集群的任何功能。
1. 单击**保存**。

**结果**：注释并不是给集群提供功能，而是告知 Rancher 集群具有这些功能。
