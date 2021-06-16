---
title: 升级指南
description: 以下说明将指导您升级使用 Helm 安装在 Kubernetes 集群上的 Rancher 服务器。这些步骤也适用于使用 Helm 进行的离线安装。
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

以下说明将指导您升级使用 Helm 安装在 Kubernetes 集群上的 Rancher 服务器。这些步骤也适用于使用 Helm 进行的离线安装。

有关使用 RancherD 升级安装在 Kubernetes 上的 Rancher 的说明，请参考[本页](/docs/rancher2.5/installation/install-rancher-on-linux/upgrades/_index)

关于安装了 Docker 的 Rancher 的升级说明，请参考[本页](/docs/rancher2/installation/other-installation-methods/single-node-docker/single-node-upgrades/_index)

要升级 Kubernetes 集群中的组件，或者定义[Kubernetes 服务](/docs/rke/config-options/services/_index)或[附加组件](/docs/rke/config-options/add-ons/_index)。参考 Rancher Kubernetes 引擎的[RKE 的升级文档](/docs/rke/upgrades/_index)。

如果你使用 RKE 附加组件 yaml 安装了 Rancher，请按照[迁移或升级](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/_index)的指示进行。

## 前提条件

### 访问 kubeconfig 的权限

Helm 应该从与你的 kubeconfig 文件相同的位置运行，或者从你运行 kubectl 命令的相同位置运行。

如果你在安装 Kubernetes 时使用了 RKE，那么配置将在你运行`rke up`的目录下创建。

kubeconfig 也可以通过`--kubeconfig`标签来手动针对预定的集群，详情请参考[Heml 官方文档](https://helm.sh/docs/helm/helm/)。

### 已知问题

查看 Rancher 文档中的[已知升级问题](#known-upgrad-issues)，了解升级 Rancher 时需要注意的问题。

在[GitHub](https://github.com/rancher/rancher/releases)和[Rancher 论坛](https://forums.rancher.com/c/announcements/12)上的发布说明中，可以找到每个 Rancher 版本的更完整的已知问题列表。

请注意，不支持升级到[rancher-alpha 仓库](/docs/rancher2/installation/install-rancher-on-k8s/chart-options/_index)中的任何 chart。

### Helm 版本

本文基于 Helm 3 写作。如果您使用的是 Helm2，在按照本文进行升级之前，请先将 Helm 2 升级为 Helm 3。Helm 升级的具体操作步骤请参考[Helm 官方文档-从 Helm 2 迁移到 Helm 3](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)。

如果您希望保留 Helm2，我们也提供了基于 Helm2 升级的操作指导，详情请参考[Helm 2 升级指南](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/ha/helm2/_index)。

### 同步镜像到私有镜像仓库

这个前提条件只适用于离线高可用安装。同步镜像到私有镜像仓库之后，在安装 Rancher 时，Rancher 可以从此私有镜像仓库中拉取所需的镜像。详情请参考[同步镜像到私有镜像仓库](/docs/rancher2/installation/other-installation-methods/air-gap/populate-private-registry/_index)

### 升级 Rancher Server 并使用隐藏的本地集群

如果您从使用 Helm chart 选项`--add-local=false`启动的 Rancher 服务器升级到 Rancher v2.5，您需要在升级时取消该标志。否则，Rancher 服务器将无法启动。`restricted-admin`角色可以用来继续限制对本地集群的访问。有关更多信息，请参见[本节](/docs/rancher2/admin-settings/rbac/global-permissions/_index)

### 使用外部的 TLS 终端代理从 v2.0-v2.2 升级到 v2.3+

如果您将 Rancher 从 v2.x 升级到 v2.3+，并且您正在使用外部 TLS 终端，您需要编辑`cluster.yml`到[启用使用转发主机头](/docs/rancher2/installation/install-rancher-on-k8s/chart-options/_index)。

### 使用 cert-manager v0.8.0 之前的版本升级

[从 2019 年 11 月 1 日开始，Let's Encrypt 将屏蔽大于 0.8.0 的 cert-manager 实例](https://community.letsencrypt.org/t/blocking-old-cert-manager-versions/98753)，请按照[这些说明](/docs/rancher2/admin-settings/rbac/global-permissions/_index)将 cert-manager 升级到最新版本。

## 升级大纲

请参考以下四个步骤升级 Rancher Server。

### 步骤 1：备份正在运行 Rancher Server 的 Kubernetes 集群

对于 Rancher v2.0-v2.4，使用[一次性快照](/docs/rancher2/backups/backup/ha-backups/_index)进行备份。
运行 Rancher 服务器的 Kubernetes 集群的备份。

如果在升级过程中出现问题，您将使用备份作为恢复点。

### 步骤 2：升级 Helm Chart repository

1. 更新你的本地 heml 缓存。

   ```
   helm repo update
   ```

1. 获取你用来安装 Rancher 的仓库名称。

   关于资源库及其区别，请参见[Helm Chart Repositories](/docs/rancher2/installation/install-rancher-on-k8s/chart-options/_index)。

   ```
   helm repo list
   NAME          	       URL
   stable        	       https://charts.helm.sh/stable
   rancher-<CHART_REPO>	 https://releases.rancher.com/server-charts/<CHART_REPO>
   ```

   > **注意：**如果你想切换到不同的 Helm chart 仓库，请按照[如何切换仓库的步骤](/docs/rancher2/installation/resources/choosing-version/_index)。如果你切换了资源库，请确保在继续步骤 3 之前再次列出资源库，以确保你添加的资源库是正确的。

1. 从 Helm chart 库中获取最新的 chart 来安装 Rancher。

   该命令将提取最新的 chart，并将其作为`.tgz`文件保存在当前目录中。

   ```plain
   helm fetch rancher-<CHART_REPO>/rancher
   ```

   你可以通过添加`---version=`标签来获取你要升级到的特定版本的 chart。例如，你可以通过添加`---version=`标签来获取你升级到的特定版本的 chart。

   ```plain
   helm fetch rancher-<CHART_REPO>/rancher --version=v2.4.11
   ```

### 升级 Rancher

本节介绍了如何使用 Helm 升级 Rancher 的普通（互联网连接）或离线安装。

#### 升级 Kubernetes

从当前安装的 Rancher Helm chart 中获取用`--set`传递的值。

```
helm get values rancher -n cattle-system
hostname: rancher.my.org
```

> **注意：**这个命令会列出更多的值。这只是其中一个值的例子。
> 如果您也要将 cert-manager 从 0.11.0 以前的版本升级到最新版本，请按照[选项 B：重装 Rancher 和 cert-manager](#option-b-reinstalling-rancher-and-cert-manager)进行操作。

否则，按照【选项 A：升级 Rancher。】(#选项-a-升级 Rancher)

##### 选项 1：升级 Rancher

将 Rancher 升级到最新版本，并进行所有设置。

将上一步中的所有值用`--set key=value`追加到命令中。

```
helm upgrade rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org
```

注意：以上是一个例子，可能有更多上一步的值需要追加。
另外，也可以将当前的值导出到一个文件中，并在升级时引用该文件。例如，只改变 Rancher 的版本。

```
helm get values rancher -n cattle-system -o yaml > values.yaml
helm upgrade rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system \
  -f values.yaml \
  --version=2.4.5
```

##### 选项 2：卸载并重新安装 Rancher 和 cert-manager

如果你目前正在运行版本比 v0.11 更老的 cert-manager，并且想把 Rancher 和 cert-manager 都升级到较新的版本，那么你需要重新安装 Rancher 和 cert-manager，因为 cert-manager v0.11 的 API 变化。

1. 卸载 Rancher

   ```
   helm delete rancher -n cattle-system
   ```

2. 按照[升级 Cert-Manager](/docs/rancher2/installation/resources/upgrading-cert-manager/_index)页面的说明，卸载并重新安装 cert-manager。

3. 重新安装 Rancher 到最新版本，并进行所有设置。将步骤 1 中的所有值用`--set key=value`追加到命令中。注意：步骤 1 中还有很多选项需要追加。

   ```
   helm install rancher rancher-<CHART_REPO>/rancher \
   --namespace cattle-system \
   --set hostname=rancher.my.org
   ```

#### 离线升级

使用安装 Rancher 时选择的相同选项来渲染 Rancher 模板。使用下面的参考表来替换每个占位符。Rancher 需要配置为使用私有镜像仓库，以便为任何 Rancher 启动的 Kubernetes 集群或 Rancher 工具提供服务。

根据您在安装过程中做出的选择，完成以下程序之一。

| 占位符                           | 说明                                    |
| :------------------------------- | :-------------------------------------- |
| `<VERSION>`                      | 输出压缩包的版本号。                    |
| `<RANCHER.YOURDOMAIN.COM>`       | 指向负载均衡器的 DNS 名称。             |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 您的私有镜像仓库的 DNS 名称。           |
| `<CERTMANAGER_VERSION>`          | 在 k8s 集群上运行的 Cert-manager 版本。 |

##### 选项 1：使用默认的自签名证书

```plain
helm template ./rancher-<VERSION>.tgz --output-dir . \
--name rancher \
--namespace cattle-system \
--set hostname=<RANCHER.YOURDOMAIN.COM> \
--set certmanager.version=<CERTMANAGER_VERSION> \
--set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
--set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Available as of v2.2.0, set a default private registry to be used in Rancher
--set useBundledSystemChart=true # Available as of v2.3.0, use the packaged Rancher system charts
```

##### 选项 2：使用 Kubernetes Secrets 从文件中获取证书

```plain
helm template ./rancher-<VERSION>.tgz --output-dir . \
--name rancher \
--namespace cattle-system \
--set hostname=<RANCHER.YOURDOMAIN.COM> \
--set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
--set ingress.tls.source=secret \
--set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Available as of v2.2.0, set a default private registry to be used in Rancher
--set useBundledSystemChart=true # Available as of v2.3.0, use the packaged Rancher system charts
```

如果你使用的是私人 CA 签名的证书，请在`--set ingress.tls.source=secret`后面添加`--set privateCA=true`。

```plain
helm template ./rancher-<VERSION>.tgz --output-dir . \
--name rancher \
--namespace cattle-system \
--set hostname=<RANCHER.YOURDOMAIN.COM> \
--set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
--set ingress.tls.source=secret \
--set privateCA=true \
--set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Available as of v2.2.0, set a default private registry to be used in Rancher
--set useBundledSystemChart=true # Available as of v2.3.0, use the packaged Rancher system charts
```

### 步骤 3：应用渲染的模板

将渲染的清单目录复制到可以访问 Rancher 服务器集群的系统中，并应用渲染的模板。

使用 "kubectl "应用渲染的清单。

```plain
kubectl -n cattle-system apply -R -f ./rancher
```

### 步骤 4：验证升级是否成功

登录 Rancher，确认升级成功。

如果升级之后出现了网络问题，请参考[恢复集群网络](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/namespace-migration/_index)。

## 已知问题

下表列出了升级 Rancher 时需要考虑的一些最值得注意的问题。每个 Rancher 版本的已知问题的更完整列表可以在[GitHub](https://github.com/rancher/rancher/releases)上的发布说明和[Rancher 论坛](https://forums.rancher.com/c/announcements/12)上找到。

| 升级场景                        | 问题描述                                                                                                                                                                                                                                                                                                                                                     |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 升级到 v2.4.6 或 v2.4.7         | 这些 Rancher 版本存在一个问题，即创建、编辑或克隆 Amazon EC2 节点模板需要`kms:ListKeys`权限。这一要求在 v2.4.8 中被删除。建议跳过 v2.4.6 或 v2.4.7，直接升级到 v2.4.8+。                                                                                                                                                                                     |
| 升级到 v2.3.0+                  | 任何用户供应的集群将在任何编辑后自动更新，因为容忍被添加到用于 Kubernetes 供应的图像中。                                                                                                                                                                                                                                                                     |
| 升级到 v2.2.0-v2.2.x            | Rancher 引入了[system charts](https://github.com/rancher/system-charts)存储库，其中包含监控、日志、警报和全局 DNS 等功能所需的所有目录项。为了能够在 air gap 安装中使用这些功能，您需要在本地镜像`system-charts`资源库，并配置 Rancher 使用该资源库。请按照说明[配置 Rancher 系统 chart](/docs/rancher2/installation/resources/local-system-charts/_index)。 |
| 从 v2.0.13 或更早的版本进行升级 | 如果你的集群的证书已经过期，你需要执行[这些步骤](/docs/rancher2/cluster-admin/certificate-rotation/_index)来轮换证书。                                                                                                                                                                                                                                       |
| 从 v2.0.7 或更早的版本进行升级  | Rancher 引入了`system`项目，这是一个自动创建的项目，用于存储 Kubernetes 运行所需的重要命名空间。在升级到 v2.0.7+的过程中，Rancher 希望这些命名空间能够从所有项目中取消分配。在开始升级之前，请检查您的系统命名空间，确保它们未被分配，以[防止集群网络问题。](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/namespace-migration/_index)         |

## 使用 RKE Add-on 安装 Rancher

**重要：RKE 插件安装只支持到 Rancher v2.0.8**。

请使用 Rancher Helm Chart 在 Kubernetes 集群上安装 Rancher。详情请参见[Kubernetes 安装](/docs/rancher2/installation/install-rancher-on-k8s/_index)。

如果您当前使用的是 RKE 加载方式，请参见 [从 RKE add-on 迁移](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/_index)，了解如何迁移到使用 Helm Chart 的详细信息。
