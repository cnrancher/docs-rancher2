---
title: 升级
weight: 2
---
本文介绍如何升级使用 Helm 安装在 Kubernetes 集群上的 Rancher Server。这些步骤也适用于使用 Helm 进行的离线安装。

有关使用 Docker 安装的 Rancher 的升级说明，请参见[本页。]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/single-node-upgrades)

如需升级 Kubernetes 集群中的组件，或 [Kubernetes services]({{<baseurl>}}/rke/latest/en/config-options/services/) 或 [附加组件（add-on）]({{<baseurl>}}/rke/latest/en/config-options/add-ons/)的定义，请参见 [RKE 升级文档]({{<baseurl>}}/rke/latest/en/upgrades/)的 Rancher Kubernetes 引擎。

- [前提](#prerequisites)
- [升级概要](#upgrade-outline)
- [已知的升级问题](#known-upgrade-issues)
- [RKE 附加组件安装](#rke-add-on-installs)

## 前提

### 访问 kubeconfig

Helm 的运行位置，应该与你的 kubeconfig 文件，或你运行 kubectl 命令的位置相同。

如果你在安装 Kubernetes 时使用了 RKE，那么 config 将会在你运行 `rke up` 的目录下创建。

kubeconfig 也可以通过 `--kubeconfig` 标签（详情请参见 https://helm.sh/docs/helm/helm/ ）来手动指定所需的集群。

### 查看已知问题

如需查看每个 Rancher 版本的已知问题，请参见 [GitHub](https://github.com/rancher/rancher/releases) 中的发行说明，或查看 [Rancher 论坛](https://forums.rancher.com/c/announcements/12)。

不支持 _升级_ 或 _升级到_ [rancher-alpha 仓库]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#helm-chart-repositories/)中任何 Chart。

### Helm 版本

本安装指南假定你使用的是 Helm 3。

如果你使用 Helm 2，请参见 [Helm 2 迁移到 Helm 3 文档](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)。如果你不能升级到 Helm 3，[Helm 2 升级页面]({{<baseurl>}}/rancher/v2.0-v2.4/en/installation/upgrades-rollbacks/upgrades/ha/helm2)提供了使用 Helm 2 升级的旧升级指南。

### 离线安装：推送镜像到私有镜像仓库

[仅适用于离线安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap)：为新的 Rancher Server 版本收集和推送镜像。使用你需要针对 Rancher 版本升级的镜像，按照步骤[推送镜像到私有镜像仓库]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/populate-private-registry/)。

### 升级 Rancher Server 并使用隐藏的本地集群

如果你从使用 Helm Chart 选项 `--add-local=false` 启动的 Rancher Server 升级到 Rancher 2.5，你需要在升级时取消该标志。否则，Rancher Server 将无法启动。`restricted-admin` 角色可以继续用来限制对本地集群的访问。详情请参见[本章节]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/#upgrading-from-rancher-with-a-hidden-local-cluster)。

### 使用 cert-manager 0.8.0 之前的版本升级

[从 2019 年 11 月 1 日开始，Let's Encrypt 已屏蔽早于 0.8.0 的 cert-manager 实例](https://community.letsencrypt.org/t/blocking-old-cert-manager-versions/98753)。因此，请参见[说明]({{<baseurl>}}/rancher/v2.6/en/installation/resources/upgrading-cert-manager)把 cert-manager 升级到最新版本。

## 升级概要

按照以下步骤升级 Rancher Server：

- [1. 备份运行 Rancher Server 的 Kubernetes 集群](#1-back-up-your-kubernetes-cluster-that-is-running-rancher-server)
- [2. 更新 Helm Chart 仓库](#2-update-the-helm-chart-repository)
- [3. 升级 Rancher](#3-upgrade-rancher)
- [4. 验证安装](#4-verify-the-upgrade)

## 1. 备份运行 Rancher Server 的 Kubernetes 集群

使用[备份应用]({{<baseurl>}}/rancher/v2.6/en/backups/back-up-rancher)来备份 Rancher。

如果升级过程中出现问题，你将使用备份作为还原点。

## 2. 更新 Helm Chart 仓库

1. 更新本地 Helm 仓库缓存。

   ```
   helm repo update
   ```

1. 获取你用来安装 Rancher 的仓库名称。

   关于仓库及其区别，请参见 [Helm Chart Repositories]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#helm-chart-repositories)。



   ```
   helm repo list

   NAME          	       URL
   stable        	       https://charts.helm.sh/stable
   rancher-<CHART_REPO>	 https://releases.rancher.com/server-charts/<CHART_REPO>
   ```

   > **注意**：如果你想切换到不同的 Helm Chart 仓库，请按照[切换仓库步骤]({{<baseurl>}}/rancher/v2.6/en/installation/resources/choosing-version/#switching-to-a-different-helm-chart-repository)进行操作。如果你要切换存储库，请先再次列出仓库，再继续执行步骤 3，以确保添加了正确的仓库。


1. 从 Helm Chart 仓库获取最新的 Chart 来安装 Rancher。

   该命令将提取最新的 Chart，并将其作为 `.tgz`文件保存在当前目录中。

   ```plain
   helm fetch rancher-<CHART_REPO>/rancher
   ```
   你可以通过 `--version=` 标记，来指定要升级的目标 Chart 版本。例如：

   ```plain
   helm fetch rancher-<CHART_REPO>/rancher --version=v2.4.11
   ```

## 3. 升级 Rancher

本节介绍了如何使用 Helm 升级 Rancher 的一般（互联网连接）或离线安装。

> **离线说明**：如果你在离线环境中安装 Rancher，请跳过本页的其余部分，按照[本页](./air-gap-upgrade)上的说明渲染 Helm 模板。


从当前安装的 Rancher Helm Chart 中获取用 `--set`传递的值。

```
helm get values rancher -n cattle-system

hostname: rancher.my.org
```

> **注意**：这个命令会列出更多的值。此处展示的只是其中一个值的例子。

如果你也要将 cert-manager 从早于 0.11.0 的版本升级到最新版本，请选择[选项 B：重装 Rancher 和 cert-manager](#option-b-reinstalling-rancher-and-cert-manager)。

否则，请选择[选项 A：升级 Rancher](#option-a-upgrading-rancher)。

### 选项 A：升级 Rancher

保留你的所有设置把 Rancher 升级到最新版本。

将上一步中的所有值用 `--set key=value`追加到命令中。

```
helm upgrade rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org
```

> **注意**：以上是一个例子，可能有更多上一步的值需要追加。

另外，你也可以将当前的值导出到一个文件中，并在升级时引用该文件。例如，如果你只需要改变 Rancher 的版本：

```
helm get values rancher -n cattle-system -o yaml > values.yaml

helm upgrade rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system \
  -f values.yaml \
  --version=2.4.5
```

### 选项 B：重装 Rancher 和 cert-manager

如果你目前使用的 cert-manager 版本早于 0.11，并且想把 Rancher 和 cert-manager 都升级到较新版本，由于 cert-manager 0.11 的 API 更改，你需要重新安装 Rancher 和 cert-manager。

1. 卸载 Rancher

   ```
   helm delete rancher -n cattle-system
   ```

2. 按照[升级 Cert-Manager]({{<baseurl>}}/rancher/v2.6/en/installation/resources/upgrading-cert-manager) 的说明，卸载并重新安装 `cert-manager`。

3. 保留你的所有设置把 Rancher 重新安装到最新版本。将步骤 1 中的所有值用 `--set key=value`追加到命令中。注意：步骤 1 中还有很多选项需要追加。

   ```
   helm install rancher rancher-<CHART_REPO>/rancher \
   --namespace cattle-system \
   --set hostname=rancher.my.org
   ```

## 4. 验证升级

登录 Rancher 以确认升级成功。

> **升级后出现网络问题**
>
> 请参见[恢复集群网络]({{<baseurl>}}/rancher/v2.0-v2.4/en/installation/install-rancher-on-k8s/upgrades/namespace-migration)。

## 已知升级问题

如需升级 Kubernetes 集群中的如需查看每个 Rancher 版本的已知问题，请参见 [GitHub](https://github.com/rancher/rancher/releases) 中的发行说明，或查看 [Rancher 论坛](https://forums.rancher.com/c/announcements/12)。
