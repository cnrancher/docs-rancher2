---
title: 选择 Rancher 版本
weight: 1
---

本节介绍如何选择 Rancher 版本。

在我们推荐用于生产环境的 Rancher 高可用安装中，Rancher Server 是通过 Kubernetes 集群上的 **Helm Chart** 安装的。请参见 [Helm 版本要求]({{<baseurl>}}/rancher/v2.6/en/installation/resources/helm-version)选择 Helm 版本来安装 Rancher。

如果你在开发和测试中使用 Docker 来安装 Rancher，你需要把 Rancher 作为一个 **Docker 镜像**来安装。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


<Tabs
defaultValue="helm"
values={[
{ label: 'Helm Chart', value: 'helm', },
{ label: 'Docker 镜像', value: 'docker', },
]}>
<TabItem value="helm">

如果 Rancher Server 是[安装在 Kubernetes 集群上]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/)的，Rancher Server 的安装，升级和回滚中，都是使用 Kubernetes 集群上的 Helm Chart 来安装 Rancher 的。因此，在准备安装或升级 Rancher 高可用时，必须添加包含用于安装 Rancher 的 Chart 的 Helm Chart 仓库。

请参见 [Helm 版本要求]({{<baseurl>}}/rancher/v2.6/en/installation/resources/helm-version)选择 Helm 版本来安装 Rancher。

### Helm Chart 仓库

Rancher 提供几个可选的 Helm Chart 仓库供你选择。最新版或稳定版的 Helm Chart 仓库与用于 Docker 安装中的 Docker 标签对应。因此，`rancher-latest` 仓库包含所有标记为 `rancher/rancher:latest` 的 Rancher 版本 Chart。当 Rancher 版本升级到 `rancher/rancher:stable`，它会被添加到 `rancher-stable` 仓库中。

| 类型 | 添加仓库的命令 | 仓库描述 |
| -------------- | ------------ | ----------------- |
| rancher-latest | `helm repo add rancher-latest https://releases.rancher.com/server-charts/latest` | 添加最新版本的 Rancher 的 Helm Chart 仓库。建议使用此仓库来测试新版本的 Rancher。 |
| rancher-stable | `helm repo add rancher-stable https://releases.rancher.com/server-charts/stable` | 添加较旧的，稳定的版本的 Rancher 的 Helm Chart 仓库。建议在生产环境中使用此仓库。 |
| rancher-alpha | `helm repo add rancher-alpha https://releases.rancher.com/server-charts/alpha` | 添加 alpha 版本的 Rancher 的 Helm Chart 仓库，以预览即将发布的版本。不建议在生产环境中使用这些版本。无论是什么仓库，均不支持 _升级_ 或 _升级到_ rancher-alpha 仓库中的任何 Chart。 |

了解何时选择这些仓库，请参见[切换到不同 Helm Chart 仓库](#切换到不同-helm-chart-仓库)。

> :::note 注意
>  `rancher-stable` 仓库中的所有 Chart 都与 `stable` 标记的 Rancher 版本对应。
> :::

### Helm Chart 版本

Rancher Helm Chart 版本与 Rancher 版本（即 `appVersion`）对应。添加仓库后，你可以运行以下命令搜索可用版本：<br/>
&nbsp;&nbsp;&nbsp;&nbsp;`helm search repo --versions`

如果你有多个仓库，你可指定仓库名称，即：`helm search repo rancher-stable/rancher --versions` <br/>
详情请访问 https://helm.sh/docs/helm/helm_search_repo/

要获取所选仓库的指定版本，参见如下示例指定 `--version` 参数：<br/>
&nbsp;&nbsp;&nbsp;&nbsp;`helm fetch rancher-stable/rancher --version=2.4.8`

### 切换到不同 Helm Chart 仓库

安装 Rancher 后，如果想修改安装 Rancher 的 Helm Chart 仓库，按照以下步骤操作。

> :::note 注意
> 由于 rancher-alpha 仓库只包含 alpha 版本 Chart，因此不支持从 rancher alpha 仓库切换到 rancher-stable 或 rancher-latest 仓库以进行升级。
> :::
>



1. 列出当前 Helm Chart 仓库。

   ```plain
   helm repo list

   NAME          	      URL
   stable        	      https://charts.helm.sh/stable
   rancher-<CHART_REPO>		https://releases.rancher.com/server-charts/<CHART_REPO>
   ```

2. 删除包含安装 Rancher 时用的 Chart  的 Helm Chart 仓库。是 `rancher-stable` 或 `rancher-latest` 取决于你初始安装时的选择。

   ```plain
   helm repo remove rancher-<CHART_REPO>
   ```

3. 添加你要用于安装 Rancher 的 Helm Chart 仓库。

   ```plain
   helm repo add rancher-<CHART_REPO> https://releases.rancher.com/server-charts/<CHART_REPO>
   ```

4. 按照以下步骤，从新的 Helm Chart 仓库[升级 Rancher]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/upgrades)。
   </TabItem>
   <TabItem value="docker">
   进行 [Docker 安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker)，升级或回滚时，你可使用 _标签_ 来安装指定版本的 Rancher。

### Server 标签

Rancher Server 以 Docker 镜像的形式分发并附有标签。你可以在输入命令部署 Rancher 时指定标签。请记住，如果你指定了标签，但是没有指定版本（如 `latest` 或 `stable`），你必须显式拉取该镜像标签的新版本。否则，将使用缓存在主机上的镜像。

| 标签 | 描述 |
| -------------------------- | ------ |
| `rancher/rancher:latest` | 最新的开发版本。这些版本通过了我们的 CI 自动化验证。不推荐在生产环境使用这些版本。 |
| `rancher/rancher:stable` | 最新的稳定版本。推荐将此标签用于生产环境。 |
| `rancher/rancher:<v2.X.X>` | 你可以使用以前版本中的标签来指定要安装的 Rancher 版本。访问 DockerHub 查看可用的版本。 |

> :::note 注意
>
>
> - `master` 和带有 `-rc` 或其他后缀的标签是供 Rancher 测试团队验证用的。这些标签不受官方支持，因此请不要使用这些标签。
> - 安装 alpha 版本进行预览：使用我们的[公告页面](https://forums.rancher.com/c/announcements)中列出的 alpha 标签（例如，`v2.2.0-alpha1`）进行安装。不支持升级或升级到 Alpha 版本。

</TabItem>
</Tabs>
