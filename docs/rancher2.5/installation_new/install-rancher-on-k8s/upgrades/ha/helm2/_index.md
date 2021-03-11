---
title: 高可用升级指南（Helm 2）
description: 本节提供了使用 Helm 2 升级 Rancher 的旧版指南，适用于无法升级到 Helm 3 的情况。
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
  - 高可用升级指南（Helm 2）
---

:::important 重要
在发布 Helm 3 之后，[Rancher 高可用升级指南](../_index)已更新为使用 Helm 3 的升级指南。

如果您使用的是 Helm 2，我们建议[迁移到 Helm 3](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)，因为 Helm 3 使用起来更简单，而且比 Helm 2 更安全。

本节提供了使用 Helm 2 升级 Rancher 的旧版指南，适用于无法升级到 Helm 3 的情况。
:::

以下说明将指导您使用 Helm 升级 Kubernetes 集群上安装的 Rancher Server。

要升级 Kubernetes 集群中的组件，[Kubernetes 服务](/docs/rke/config-options/services/_index)或[add-ons](/docs/rke/config-options/add-ons/_index)，请参阅[RKE 的升级文档](/docs/rke/upgrades/_index)，Rancher Kubernetes Engine。

如果您使用 RKE Add-on 的方式安装了 Rancher，请按照[迁移或升级](/docs/rancher2.5/installation_new/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/_index)的说明进行操作。

> **注意：**
>
> - [Let's Encrypt 于 2019 年 11 月 1 日开始屏蔽早于 0.8.0 版本的 cert-manager 实例。](https://community.letsencrypt.org/t/blocking-old-cert-manager-versions/98753) 按照[这些说明](/docs/rancher2.5/installation_new/resources/upgrading-cert-manager/_index)升级 cert-manager 到最新版本。
> - 如果要将 Rancher 从 v2.x 升级到 v2.3+，并且正在使用外部 TLS 终止，则需要编辑 cluster.yml 文件，来[配置 Ingress 使用 use-forwarded-headers](/docs/rancher2.5/installation_new/resources/chart-options/_index)。

## 先决条件

- 从 Rancher 文档中的 **[已知升级问题](/docs/rancher2.5/installation_new/install-rancher-on-k8s/upgrades/_index#已知的升级问题) 和 [警告](/docs/rancher2.5/installation_new/install-rancher-on-k8s/upgrades/_index#警告)** 查看升级 Rancher 中最值得注意的问题。可以在[GitHub](https://github.com/rancher/rancher/releases) 和 [Rancher 论坛](https://forums.rancher.com/c/announcements/12)的发行说明中找到每个 Rancher 版本的已知问题的更完整列表。
- **[仅对于离线安装](/docs/rancher2.5/installation_new/other-installation-methods/air-gap/_index)，拉取并上传新的 Rancher Server 版本的镜像**。请按照指南[准备私有仓库](/docs/rancher2.5/installation_new/other-installation-methods/air-gap/populate-private-registry/_index)，来准备您要升级的版本的镜像。

## 升级大纲

请按照以下步骤升级 Rancher Server：

- [A. 备份正在运行 Rancher Server 的 Kubernetes 集群](#a-备份运行-rancher-server-的-kubernetes-集群)
- [B. 更新 Helm Chart 仓库](#b-更新-helm-chart-仓库)
- [C. 升级 Rancher](#c-升级-rancher)
- [D. 验证升级](#d-验证升级)

### 备份运行 Rancher Server 的 Kubernetes 集群

为运行 Rancher Server 的 Kubernetes 集群[创建快照](/docs/rancher2/backups/2.0-2.4/ha-backups/_index)。
如果升级过程中出现问题，则使用快照回滚至升级前的版本。

### 更新 Helm chart 仓库

1. 更新本地的 helm 仓库

   ```
   helm repo update
   ```

1. 获取用于安装 Rancher 的仓库名称。

   请替换命令中的`<CHART_REPO>`，替换为`latest`，`stable`或`alpha`。有关仓库及其差异的信息，请参见[Helm Chart 仓库](/docs/rancher2.5/installation_new/resources/choosing-version/_index)。

   - `latest`: 推荐在尝试新功能时使用。
   - `stable`: 推荐生产环境中使用。（推荐）
   - `alpha`: 未来版本的实验性预览。

   <br/>

   ```
   helm repo list

   NAME          	        URL
   stable        	        https://charts.helm.sh/stable
   rancher-<CHART_REPO>	https://releases.rancher.com/server-charts/<CHART_REPO>
   ```

   > **注意：** 如果要切换到其他 Helm chart 仓库，请按照[切换仓库文档](/docs/rancher2.5/installation_new/resources/choosing-version/_index)进行切换。如果要切换仓库，请确保在继续执行第 3 步之前再次列出仓库，以确保添加了正确的仓库。

1. 从 Helm chart 仓库中获取最新的 chart 以安装 Rancher。

   该命令将拉取最新的 chart 并将其保存为当前目录中的一个`.tgz`文件。

   ```plain
   helm fetch rancher-<CHART_REPO>/rancher
   ```

### 升级 Rancher

本节介绍如何使用 Helm 升级 Rancher 的常规（连接 Internet） 或离线安装。

#### Rancher 高可用升级

从已安装的当前 Rancher Helm chart 中获取通过 `--set` 传递的值。

```
helm get values rancher

hostname: rancher.my.org
```

> **注意：** 此命令将列出更多的值。这只是其中一个值的示例。

如果您在将 cert-manager 从 0.11.0 之前的版本升级到最新版本，请执行 `选项 B - 重新安装 Rancher Chart`。否则，请执行 `选项 A - 升级Rancher`。

##### 选项 A - 升级 Rancher

使用所有设置将 Rancher 升级到最新版本。

取上一步中的所有值，然后使用`--set key=value`将它们附加到命令中：

```
helm upgrade --install rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org
```

> **注意：** 这里将要添加很多从上一步获取的选项。

##### 选项 B - 重新安装 Rancher Chart

如果您当前正在运行版本低于 v0.11 的 cert-manger，并且想将 Rancher 和 cert-manager 都升级到新版本，则由于 cert-manger v0.11 中的 API 更改，您需要重新安装 Rancher 和 cert-manger。

1. 卸载 Rancher

   ```
   helm delete rancher
   ```

1. 参考[升级 Cert-Manager](/docs/rancher2.5/installation_new/resources/upgrading-cert-manager/_index)，卸载并且重新安装`cert-manager`。

1. 使用所有的选项将 Rancher 重新安装到最新版本。获取步骤 1 中的所有值，然后使用`--set key=value`。将它们附加到命令中。

   ```
   helm install rancher-<CHART_REPO>/rancher \
   --name rancher \
   --namespace cattle-system \
   --set hostname=rancher.my.org
   ```

   > **注意：** 这里将要添加很多从上一步获取的选项。

#### 离线安装的 Rancher 高可用升级

1. 使用与安装 Rancher 时使用的相同参数选项来渲染 Rancher 模板。使用下面的参考表替换每个占位符。需要将 Rancher 配置为使用私有仓库，来部署 RKE 集群或 Rancher 工具。

   根据您在安装过程中所做的选择，完成以下过程之一。

   | 占位符                           | 描述                                   |
   | :------------------------------- | :------------------------------------- |
   | `<VERSION>`                      | 输出压缩包的版本号。                   |
   | `<RANCHER.YOURDOMAIN.COM>`       | 您指向负载均衡器的 DNS 名称。          |
   | `<REGISTRY.YOURDOMAIN.COM:PORT>` | 您的私有仓库的 DNS 名称。              |
   | `<CERTMANAGER_VERSION>`          | 在 k8s 集群上运行的 cert-manage 版本。 |

   #### 选项 A - 使用 Rancher 默认的自签名证书

   ```plain
   helm template ./rancher-<VERSION>.tgz --output-dir . \
   --name rancher \
   --namespace cattle-system \
   --set hostname=<RANCHER.YOURDOMAIN.COM> \
   --set certmanager.version=<CERTMANAGER_VERSION> \
   --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
   --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 自v2.2.0可用，设置默认的系统镜像仓库
   --set useBundledSystemChart=true # 自v2.3.0可用，使用内嵌的 Rancher system charts
   ```

   #### 选项 B - 使用 Kubernetes 密文中的证书

   ```plain
   helm template ./rancher-<VERSION>.tgz --output-dir . \
   --name rancher \
   --namespace cattle-system \
   --set hostname=<RANCHER.YOURDOMAIN.COM> \
   --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
   --set ingress.tls.source=secret \
   --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 自v2.2.0可用，设置默认的系统镜像仓库
   --set useBundledSystemChart=true # 自v2.3.0可用，使用内嵌的 Rancher system charts
   ```

   如果您使用的是由私有 CA 签名的证书，请在 `--set ingress.tls.source=secret` 之后添加 `--set privateCA=true`：

   ```plain
   helm template ./rancher-<VERSION>.tgz --output-dir . \
   --name rancher \
   --namespace cattle-system \
   --set hostname=<RANCHER.YOURDOMAIN.COM> \
   --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
   --set ingress.tls.source=secret \
   --set privateCA=true \
   --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 自v2.2.0可用，设置默认的系统镜像仓库
   --set useBundledSystemChart=true # 自v2.3.0可用，使用内嵌的 Rancher system charts
   ```

1. 将渲染的清单 YAML 文件目录复制到可以访问 Rancher Server 集群的系统，然后应用渲染的模板。

   使用 `kubectl` 应用渲染的清单 YAML 文件。

   ```plain
   kubectl -n cattle-system apply -R -f ./rancher
   ```

### 验证升级

登录到 Rancher。通过检查浏览器窗口左下角显示的版本，确认升级成功.

> **升级后您的下游集群中有网络问题吗？**
>
> 如果您是从 v2.0.6 或更旧的版本升级上来的，请参阅[还原集群网络](/docs/rancher2.5/installation_new/install-rancher-on-k8s/upgrades/namespace-migration/_index)。

### 回滚

如果升级异常，可以通过使用升级之前拍摄的快照，恢复集群。有关更多信息，请参阅[高可用回滚](/docs/rancher2.5/upgrades/rollbacks/ha-server-rollbacks/_index)。
