---
title: 如何选择 Rancher 版本
description: 我们建议在生产环境中使用 Rancher 高可用安装，在开发环境和测试环境中使用单节点安装。高可用安装：使用Helm Chart 将 Rancher 安装在 Kubernetes 集群上。请参阅Helm 版本要求，选择安装 Rancher 的 Helm 版本。单节点安装：对于使用 Docker 安装的单节点 Rancher，一般用于开发和测试，Rancher 将以Docker 镜像的形式安装。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 安装指南
  - 资料、参考和高级选项
  - 如何选择 Rancher 版本
---

我们建议在生产环境中使用 Rancher 高可用安装，在开发环境和测试环境中使用单节点安装。

- 高可用安装：使用 **Helm Chart** 将 Rancher 安装在 Kubernetes 集群上。请参阅[Helm 版本要求](/docs/rancher2/installation/options/helm-version/_index)，选择安装 Rancher 的 Helm 版本。

- 单节点安装：对于使用 Docker 安装的单节点 Rancher，一般用于开发和测试，Rancher 将以 **Docker 镜像**的形式安装。

## Helm Charts

在安装、升级或回滚[Rancher 高可用](/docs/rancher2/installation/k8s-install/_index)时，您将使用 **Helm Chart** 在 Kubernetes 集群上对 Rancher 进行操作。因此，在准备安装或升级 Rancher 高可用时，必须添加包含用于安装 Rancher 的 Helm Chart 的 Helm Chart 仓库。

请参阅[Helm 版本要求](/docs/rancher2/installation/options/helm-version/_index)，选择用于安装 Rancher 的 Helm 版本。

### Helm Chart 仓库

Rancher 提供了几种不同的 Helm Chart 仓库供您选择。最新版或稳定版的 Rancher Helm Chart 与用于 Docker 安装的 Rancher 的 Docker 镜像标签对应。因此，`rancher-latest`仓库包含被标记为`rancher/rancher:latest`的版本。当 Rancher 版本升级到`rancher/rancher:stable`后，它将被添加到`rancher-stable`仓库中。

| 类别           | 添加仓库命令                                                                     | 仓库描述                                                                                                                                                                |
| :------------- | :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rancher-latest | `helm repo add rancher-latest https://releases.rancher.com/server-charts/latest` | 添加最新版本的 Rancher 的 Helm Chart 仓库。我们建议使用此仓库来测试新版本的 Rancher。                                                                                   |
| rancher-stable | `helm repo add rancher-stable https://releases.rancher.com/server-charts/stable` | 添加较旧的，稳定的版本的 Rancher 的 Helm Chart 仓库。我们建议将此仓库用于生产环境。                                                                                     |
| rancher-alpha  | `helm repo add rancher-alpha https://releases.rancher.com/server-charts/alpha`   | 添加 alpha 版本的 Rancher 的 Helm Chart 仓库，以预览即将发布的版本.不建议在生产环境中使用这些版本。我们不支持从 rancher alpha 仓库中的 chart 升级到任何其他版本 chart。 |

如何选择这些仓库，请参考[切换到不同 Helm Chart 仓库](#切换到不同-helm-chart-仓库)。

> **注意：** `rancher-latest` 和 `rancher-stable` Helm Chart 仓库是在 Rancher v2.1.0 后引入的，因此`rancher-stable`仓库包含一些从来没有被标记为`rancher/rancher:stable`标签的 Rancher 版本。在 v2.1.0 之前标记为`rancher/rancher:stable`的 Rancher 版本是 v2.0.4，v2.0.6，v2.0.8。在 v2.1.0 版本之后，`rancher-stable`仓库中的所有 charts 将与标记为`stable`的 Rancher 版本对应。

### Helm Chart 版本

Rancher Helm Chart 版本必须匹配 Rancher 版本（即`appVersion`）。

有一些 Rancher v2.1.x 版本，Helm Chart 版本使用的版本号是构建版本号，即`yyyy.mm.<build-number>`，这些 charts 已经被等效的 Rancher 版本替换，并且不再可用。

### 切换到不同 Helm Chart 仓库

安装 Rancher 之后，如果想要修改安装 Rancher 的 Helm Chart 仓库，需要执行以下步骤。

> **注意：** 由于 rancher-alpha 仓库只包含 alpha 版本 charts，因此不支持在 rancher alpha 仓库和 rancher stable 或 rancher latest 仓库之间切换以进行升级。

请替换命令中的`<CHART_REPO>`，替换为`latest`、`stable`或`alpha`。

- `latest`：推荐在尝试新功能时使用。
- `stable`：推荐生产环境中使用。（推荐）
- `alpha`：未来版本的实验性预览。

1. 输入`helm repo list`命令，列出当前 Helm Chart 仓库。

   ```plain
   helm repo list

   NAME          	        URL
   stable        	        https://kubernetes-charts.storage.googleapis.com
   rancher-<CHART_REPO>	https://releases.rancher.com/server-charts/<CHART_REPO>
   ```

2. 输入`helm repo remove rancher-<CHART_REPO>`命令移除您安装 Rancher 时用的 Helm Chart 仓库，是`rancher-stable` 还是 `rancher-latest`仓库取决于您初始安装时选择的是哪个库。

   ```plain
   helm repo remove rancher-<CHART_REPO>
   ```

3. 输入`helm repo add rancher-<CHART_REPO> https://releases.rancher.com/server-charts/<CHART_REPO>`命令，添加安装 Rancher 所需要的 Helm Chart 仓库。

   ```plain
   helm repo add rancher-<CHART_REPO> https://releases.rancher.com/server-charts/<CHART_REPO>
   ```

4. 继续按照这个步骤从新的 Helm Chart 仓库[升级 Rancher](/docs/rancher2/installation_new/upgrades-rollbacks/upgrades/ha/_index)。

## Docker 镜像

在执行[Docker 单节点安装](/docs/rancher2/installation/other-installation-methods/single-node-docker/_index/)升级或回滚时，您可以使用*标签*安装特定版本的 Rancher。

### Server 标签

Rancher Server 作为 Docker 镜像分发，其中附加了标签。您可以在输入用于部署 Rancher 的命令时指定此标签。请记住，如果您使用的标签没有显式指定版本（例如`latest`或`stable`），则必须显式拉取该镜像标签的新版本。否则，主机上缓存的镜像会被使用。

| 标签                       | 描述                                                                                   |
| :------------------------- | :------------------------------------------------------------------------------------- |
| `rancher/rancher:latest`   | 我们的最新版本。这些构建通过了我们的 CI 自动化验证。我们不建议将这些版本用于生产环境。 |
| `rancher/rancher:stable`   | 我们最新的稳定版本。建议将此标签用于生产。                                             |
| `rancher/rancher:<v2.X.X>` | 您可以使用标签来安装特定版本的 Rancher。您到 DockerHub 上查看有哪些可用的版本          |

> **注意：**
>
> - `master`标签或带有`-rc`或其他后缀的标签都是给 Rancher 测试团队验证用的版本。您不应该使用这些标签的版本，因为这些构建不受官方支持。
> - 想要安装 alpha 版本体验吗？使用我们[公告页面](https://forums.rancher.com/c/announcements) (例如 `v2.2.0-alpha1`)上列出的某个 alpha 标签进行安装。注意：Alpha 版本无法升级到任何其他版本或从任何其他版本升级。
