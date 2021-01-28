---
title: 启用Istio与Pod安全策略
---

如果您启用了限制性的 Pod 安全策略，那么 Istio 可能无法正常工作，因为它需要一定的权限才能安装自己和管理 pod 基础设施。在本节中，我们将为 Istio 安装配置一个启用 PSP 的集群，同时设置 Istio CNI 插件。

Istio CNI 插件消除了每个应用 pod 拥有特权的`NET_ADMIN`容器的需求。更多信息，请参阅[Istio CNI 插件文档](https://istio.io/docs/setup/additional-setup/cni)。请注意，[Istio CNI 插件是 alpha](https://istio.io/about/feature-stages/)。

步骤根据 Rancher 版本不同而不同。

## v2.5.4+

### 前提条件

- 该集群必须是一个 RKE Kubernetes 集群。
- 群集必须是用默认的 PodSecurityPolicy 创建的。

要在 Rancher UI 中创建 Kubernetes 群集时启用 pod 安全策略支持，请转到 Advanced Options。在 Pod Security Policy Supportsection 中，单击 Enabled.然后选择一个默认的 pod 安全策略。

### 步骤 1：将 PodSecurityPolicy 设置为非限制性

只有不受限制的 Pod 安全策略允许项目安装 Istio。

在安装了 Istio 的项目或你打算安装 Istio 的项目中，将 PSP 设置为`unrestricted`，就可以将 Pod 安全策略修改为不受限制。

1. 从**群集管理器的群集视图中**，选择 **项目/命名空间**。
1. 找到**项目 > 系统**，并选择 **&#8942 > 编辑**。
1. 将 Pod 安全策略 选项改为`unrestricted`，然后单击**保存**。

### 步骤 2：启用 CNI

通过**应用程序和市场**安装或升级 Istio 时，您需要执行以下步骤启用 CNI

1. 点击**组件**。
2. 勾选**启用 CNI**旁边的方框。
3. 完成安装或升级 Istio。

除了可以通过 Rancher UI 启用 CNI 外，您也可以通过编辑`values.yaml`来启用 CNI，在`values.yaml`文件中添加以下代码即可。

```yaml
istio_cni.enabled: true
```

Istio 应该在集群中启用 CNI 后成功安装。

### 3. 验证 CNI 是否正常工作

通过部署一个[示例应用程序](https://istio.io/latest/docs/examples/bookinfo/)或部署一个您自己的应用程序来验证 CNI 是否工作。

## v2.5.3

### 前提条件

- 该集群必须是一个 RKE Kubernetes 集群。
- 群集必须是用默认的 PodSecurityPolicy 创建的。

要在 Rancher UI 中创建 Kubernetes 群集时启用 pod 安全策略支持，请转到 **高级选项**在 **Pod 安全策略支持**部分，单击 **启用**然后选择默认的 pod 安全策略。

### 步骤 1：配置系统项目策略

您需要将系统项目策略修改为不受限，以允许项目安装 Istio。

1. 从**群集管理器**的群集视图中，选择 **项目/命名空间**。
1. 找到**项目 > 系统**，并选择 **&#8942 > 编辑**。
1. 将 Pod 安全策略选项改为不受限制，然后单击 "保存"。

### 2. 在系统项目中安装 CNI 插件。

1. 从**仪表盘**的主菜单中，选择**项目/命名空间**。
1. 选择**项目 > 系统**项目。
1. 在导航栏中选择**工具 > 目录**。
1. 添加目录，内容如下。
   1. 名称：istio-cni
   1. 目录网址：https://github.com/istio/cni
   1. 分支：匹配当前版本的分支，例如：`release-1.4`。
1. 从主菜单中选择 **Apps**。
1. 单击 "启动 "并选择 istio-cni
1. 更新命名空间为 "kube-system"
1. 在答案部分，点击 "编辑为 YAML"，粘贴以下内容，然后点击启动。

```yaml
logLevel: "info"
excludeNamespaces:
  - "istio-system"
  - "kube-system"
```

### 3. 安装 Istio

按照[主要说明](/docs/rancher2/cluster-admin/tools/istio/setup/enable-istio-in-cluster/_index)，添加自定义答案。`istio_cni.enabled: true`。

当 Istio 安装完成后，在系统项目中的 Apps 页面应该会显示 istio 和`istio-cni`应用程序部署成功。Sidecar 注入现在可以使用了。
