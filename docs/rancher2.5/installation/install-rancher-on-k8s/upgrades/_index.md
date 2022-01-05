---
title: 升级指南
description: 以下说明将指导你升级使用 Helm 安装在 Kubernetes 集群上的 Rancher Server。这些步骤也适用于使用 Helm 进行的离线安装。
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
  - 升级指南
---

## 概述

以下说明将指导你升级使用 Helm 安装在 Kubernetes 集群上的 Rancher Server。这些步骤也适用于使用 Helm 进行的离线安装。

有关使用 RancherD 升级在 Kubernetes 上安装的 Rancher 的说明，请参考[本页](/docs/rancher2.5/installation/other-installation-methods/install-rancher-on-linux/upgrades/_index)

关于使用 Docker 安装的 Rancher 的升级说明，请参考[本页](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/single-node-upgrades/_index)

要升级 Kubernetes 集群中的组件，或者[Kubernetes 服务](/docs/rke/config-options/services/_index)或[附加组件](/docs/rke/config-options/add-ons/_index)，请参考[RKE 的升级文档](/docs/rke/upgrades/_index)。

## 前提条件

### 访问 kubeconfig 的权限

Helm 应该从与你的 kubeconfig 文件相同的位置运行，或者从你运行 kubectl 命令的相同位置运行。

如果你在安装 Kubernetes 时使用了 RKE，那么将在你运行 `rke up` 的目录下创建 kubeconfig 文件。

kubeconfig 也可以通过 `--kubeconfig` 标签来手动指定预期的集群，详情请参考[Heml 官方文档](https://helm.sh/docs/helm/helm/)。

### 已知问题

查看 Rancher 文档中的[已知升级问题](#known-upgrad-issues)，了解升级 Rancher 时需要注意的问题。

在[GitHub](https://github.com/rancher/rancher/releases)和[Rancher 论坛](https://forums.rancher.com/c/announcements/12)上的发布说明中，可以找到每个 Rancher 版本的更完整的已知问题列表。

请注意，不支持升级到[rancher-alpha 仓库](/docs/rancher2.5/installation/install-rancher-on-k8s/chart-options/_index)中的任何 chart。

### Helm 版本

本文基于 Helm 3 写作。如果你使用的是 Helm2，在按照本文进行升级之前，请先将 Helm 2 升级为 Helm 3。Helm 升级的具体操作步骤请参考[Helm 官方文档-从 Helm 2 迁移到 Helm 3](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)。

如果你希望保留 Helm2，我们也提供了基于 Helm2 升级的操作指导，详情请参考[Helm 2 升级指南](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/ha/helm2/_index)。

### 同步镜像到私有镜像仓库

这个前提条件只适用于[离线高可用安装](/docs/rancher2/installation/other-installation-methods/air-gap/_index)。同步镜像到私有镜像仓库之后，在安装 Rancher 时，Rancher 可以从此私有镜像仓库中拉取所需的镜像。详情请参考[同步镜像到私有镜像仓库](/docs/rancher2.5/installation/other-installation-methods/air-gap/populate-private-registry/_index)

### 升级 Rancher Server 并使用隐藏的本地集群

如果你从使用 Helm chart 选项 `--add-local=false` 启动的 Rancher Server 升级到 Rancher v2.5，你需要在升级时取消该标志。否则，Rancher Server 将无法启动。`restricted-admin` 角色可以用来继续限制对本地集群的访问。有关更多信息，请参见[本节](/docs/rancher2.5/admin-settings/rbac/global-permissions/_index#从-rancher-升级到隐藏的-local-集群)

### 使用 cert-manager v0.8.0 之前的版本升级

[从 2019 年 11 月 1 日开始，Let's Encrypt 将屏蔽大于 0.8.0 的 cert-manager 实例](https://community.letsencrypt.org/t/blocking-old-cert-manager-versions/98753)，请按照[这些说明](/docs/rancher2.5/installation/resources/upgrading-cert-manager/_index)将 cert-manager 升级到最新版本。

## 升级大纲

请参考以下四个步骤升级 Rancher Server：

### 步骤 1：备份运行 Rancher Server 的 Kubernetes 集群

使用[备份应用程序](/docs/rancher2.5/backups/back-up-rancher/_index)来备份 Rancher。

如果在升级过程中出现问题，你将使用备份作为恢复点。

### 步骤 2：更新 Helm Chart repository

1. 更新你的本地 helm 缓存。

   ```
   helm repo update
   ```

1. 获取你用来安装 Rancher 的存储库名称。

   关于存储库及其区别，请参见 [Helm Chart Repositories](/docs/rancher2.5/installation/install-rancher-on-k8s/chart-options/_index)。

   - Latest：推荐用于尝试最新功能
   - Stable：推荐用于生产环境
   - Alpha：即将发布的版本的实验性预览

   注意：不支持从 Alpha 升级或在 Alpha 之间升级。

   请将命令中的 `<CHART_REPO>`，替换为 `latest` ，`stable` 或 `alpha`。

   ```
   helm repo list
   NAME          	       URL
   stable        	       https://charts.helm.sh/stable
   rancher-<CHART_REPO>	 https://releases.rancher.com/server-charts/<CHART_REPO>
   ```

   > **注意：**如果你想切换到不同的 Helm chart 仓库，请按照[如何切换仓库的步骤](/docs/rancher2.5/installation/resources/choosing-version/_index#切换到不同-helm-chart-仓库)。如果你切换了存储库，请确保在继续步骤 3 之前再次列出存储库，以确保你添加的存储库是正确的。

1. 从 Helm chart 库中获取最新的 chart 来安装 Rancher。

   该命令将提取最新的 chart，并将其作为 `.tgz` 文件保存在当前目录中。

   ```plain
   helm fetch rancher-<CHART_REPO>/rancher
   ```

   你可以通过添加 `--version=` 标记来获取要升级到特定版本的 chart。例如：

   ```plain
   helm fetch rancher-<CHART_REPO>/rancher --version=v2.4.11
   ```

### 步骤 3. 升级 Rancher

本节介绍了如何使用 Helm 升级 Rancher 的普通（互联网连接）或离线安装。

> **离线说明：**如果你在离线环境中安装 Rancher，请跳过本页的其余部分，按照[本页](/docs/rancher2.5/installation/install-rancher-on-k8s/upgrades/air-gap-upgrade/_index)上的说明渲染 Helm 模板。

从当前安装的 Rancher Helm chart 中获取用 `--set` 传递的值。

```
helm get values rancher -n cattle-system
hostname: rancher.my.org
```

> **注意：**这个命令会列出更多的值。这只是其中一个值的例子。

如果你也要将 cert-manager 从 0.11.0 以前的版本升级到最新版本，请按照[选项 B：重装 Rancher 和 cert-manager](#选项-b：重新安装-rancher-和-cert-manager)进行操作。

否则，按照[选项 A：升级 Rancher](#选项-a：升级-rancher)。

#### 选项 A：升级 Rancher

使用所有设置将 Rancher 升级到最新版本。

将上一步中的所有值用`--set key=value`追加到命令中。

```
helm upgrade rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org
```

> 注意：以上是一个例子，可能有更多上一步的值需要追加。

另外，也可以将当前的值导出到一个文件中，并在升级时引用该文件。例如，只改变 Rancher 的版本:

```
helm get values rancher -n cattle-system -o yaml > values.yaml
helm upgrade rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system \
  -f values.yaml \
  --version=2.4.5
```

#### 选项 B：重新安装 Rancher 和 cert-manager

如果你目前正在运行版本比 v0.11 更老的 cert-manager，并且想把 Rancher 和 cert-manager 都升级到较新的版本，那么你需要重新安装 Rancher 和 cert-manager，因为 cert-manager v0.11 中的 API 变化。

1. 卸载 Rancher

   ```
   helm delete rancher -n cattle-system
   ```

2. 按照[升级 Cert-Manager](/docs/rancher2.5/installation/resources/upgrading-cert-manager/_index)页面的说明，卸载并重新安装 `cert-manager`。

3. 使用所有设置将 Rancher 重新安装到最新版本。将步骤 1 中的所有值用 `--set key=value` 追加到命令中。注意：步骤 1 中还有很多选项需要追加。

   ```
   helm install rancher rancher-<CHART_REPO>/rancher \
   --namespace cattle-system \
   --set hostname=rancher.my.org
   ```

### 步骤 4：验证升级是否成功

登录 Rancher，确认升级成功。

如果升级之后出现了网络问题，请参考[恢复集群网络](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/namespace-migration/_index)。

## 已知问题

每个 Rancher 版本的已知问题的更完整列表可以在[GitHub](https://github.com/rancher/rancher/releases)上的发布说明和[Rancher 论坛](https://forums.rancher.com/c/announcements/12)上找到。
