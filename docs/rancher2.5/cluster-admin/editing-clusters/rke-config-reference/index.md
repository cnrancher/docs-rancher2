---
title: RKE集群配置参考
---

## Rancher 用户界面中的配置选项

要编辑你的集群，请打开**全球**视图，确保**集群**标签被选中，然后为你要编辑的集群选择**&#8942;>编辑**。

一些高级配置选项没有在 Rancher UI 表单中公开，但可以通过编辑 YAML 中的 RKE 集群配置文件来启用这些选项。关于 YAML 中 RKE Kubernetes 集群可配置选项的完整参考，请参阅[RKE 文档](/docs/rke/config-options/)。

### Kubernetes 版本

每个集群节点上安装的 Kubernetes 的版本。详情请见[升级 Kubernetes]（/docs/rancher/cluster-admin/upgrading-kubernetes/）。

### 网络供应商

容器网络接口（CNI），为你的集群提供网络动力。

:::note 说明
你只能在配置你的集群时选择这个选项。以后不能再编辑了。
:::

### 项目网络隔离

如果你的网络供应商允许项目网络隔离，你可以选择是否启用或禁用项目间通信。

在 Rancher v2.5.8 之前，项目网络隔离只有在你使用 RKE 的 Canal 网络插件时才能使用。

在 v2.5.8+版本中，如果你使用任何支持执行 Kubernetes 网络策略的 RKE 网络插件，如 Canal 或 Cisco ACI 插件，则项目网络隔离可用。

### Nginx Ingress

如果你想在一个高可用性的配置中发布你的应用程序，并且你在一个没有本地负载平衡功能的云提供商那里托管你的节点，启用这个选项，在集群中使用 Nginx ingress。

### 指标服务器监控

每个能够使用 RKE 启动集群的云提供商都可以为你的集群节点收集指标和监控。启用该选项可以从云提供商的门户查看你的节点指标。

### Pod 安全策略支持

启用集群的[pod 安全策略](/docs/rancher2.5/admin-settings/pod-security-policies/) 。启用此选项后，使用**默认的 Pod 安全策略**下拉选择一个策略。

### 节点上的 Docker 版本节点上的 Docker 版本

配置是否允许节点运行 Rancher 不正式支持的 Docker 版本。如果你选择要求支持的 Docker 版本，Rancher 将阻止 Pod 在没有安装支持的 Docker 版本的节点上运行。

### Docker 根目录

你在集群节点上安装 Docker 的目录。如果你在节点上安装 Docker 到一个非默认的目录，请更新这个路径。

### 默认 Pod 安全策略

如果你启用了**Pod 安全策略支持**，使用这个下拉菜单来选择应用于集群的 Pod 安全策略。

### 云供应商云供应商

如果你使用云提供商来托管由 RKE 启动的集群节点，请启用[此选项](/docs/rancher2.5/cluster-provisioning/rke-clusters/cloud-providers/)，以便你能使用云提供商的本地功能。如果你想为你的云托管集群存储持久性数据，这个选项是必需的。

## 用 YAML 编辑群组

高级用户可以创建一个 RKE 配置文件，而不是使用 Rancher UI 来为集群选择 Kubernetes 选项。通过使用配置文件，你可以在 YAML 中指定 RKE 安装中的任何选项，除了 system_images 配置外，都可以设置。

- 要从 Rancher 用户界面直接编辑 RKE 配置文件，请点击**Edit as YAML**。
- 要从现有的 RKE 文件中读取，请点击**从文件中读取**。

![image](/img/rancher/cluster-options-yaml.png)

关于 RKE 配置文件语法的例子，见[RKE 文档](/docs/rke/example-yamls/)。

关于 YAML 中 RKE Kubernetes 集群的可配置选项的完整参考，见[RKE 文档](/docs/rke/config-options/)

## 更新 ingress-nginx

Clusters that were created before Kubernetes 1.16 will have an `ingress-nginx` `updateStrategy` of `OnDelete`. Clusters that were created with Kubernetes 1.16 or newer will have `RollingUpdate`.

If the `updateStrategy` of `ingress-nginx` is `OnDelete`, you will need to delete these pods to get the correct version for your deployment.

在 Kubernetes 1.16 之前创建的集群将有一个` ingress-nginx``updateStrategy``OnDelete `。在 Kubernetes 1.16 或更新版本中创建的集群将具有`RollingUpdate`。

如果`ingress-nginx`的`updateStrategy`是`OnDelete`，你将需要删除这些 pod，以便为你的部署获得正确版本。
