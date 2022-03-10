---
title: 在不升级 Rancher 的情况下升级 Kubernetes
weight: 30
---

RKE 元数据功能允许你在新版本 Kubernetes 发布后立即为集群配置新版本，而无需升级 Rancher。此功能对于使用 Kubernetes 的补丁版本非常有用，例如，在原本支持 Kubernetes v1.14.6 的 Rancher Server 版本中，将 Kubernetes 升级到 v1.14.7。

> **注意**：Kubernetes API 可以在次要版本之间更改。因此，我们不支持引入 Kubernetes 次要版本，例如在 Rancher 支持 v1.14 的情况下引入 v1.15。在这种情况下，你需要升级 Rancher 以添加对 Kubernetes 次要版本的支持。

Rancher 的 Kubernetes 元数据包含 Rancher 用于配置 [RKE 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)的 Kubernetes 版本信息。Rancher 会定期同步数据并为 **系统镜像**、**服务选项**和**插件模板**创建自定义资源定义 (CRD)。因此，当新的 Kubernetes 版本与 Rancher Server 版本兼容时，Kubernetes 元数据可以使 Rancher 使用新版本来配置集群。元数据概述了 [Rancher Kubernetes Engine]({{<baseurl>}}/rke/latest/en/) (RKE) 用于部署各种 Kubernetes 版本的信息。

下表描述了受周期性数据同步影响的 CRD。

> **注意**：只有管理员可以编辑元数据 CRD。除非明确需要，否则建议不要更新现有对象。

| 资源     | 描述                                                                                                                   | Rancher API URL                                |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 系统镜像 | 用于通过 RKE 部署 Kubernetes 集群的系统镜像列表。                                                                      | `<RANCHER_SERVER_URL>/v3/rkek8ssystemimages`   |
| 服务选项 | 传递给 Kubernetes 组件的默认选项，例如 `kube-api`、`scheduler`、`kubelet`、`kube-proxy` 和 `kube-controller-manager`   | `<RANCHER_SERVER_URL>/v3/rkek8sserviceoptions` |
| 插件模板 | 用于部署插件组件的 YAML 定义，例如 Canal、Calico、Flannel、Weave、Kube-dns、CoreDNS、`metrics-server`、`nginx-ingress` | `<RANCHER_SERVER_URL>/v3/rkeaddons`            |

管理员可以通过配置 RKE 元数据设置来执行以下操作：

- 刷新 Kubernetes 元数据。适用于有新的 Kubernetes 补丁版本发布，而用户希望在不升级 Rancher 的情况下为集群配置最新版本的 Kubernetes 的情景。
- 更改 Rancher 用于同步元数据的 URL。适用于要让 Rancher 从本地同步而不是与 GitHub 同步的情况。这在离线环境下非常有用。
- 防止 Rancher 自动同步元数据。这可以防止在 Rancher 中使用新的/不受支持的 Kubernetes 版本。

### 刷新 Kubernetes 元数据

默认情况下，管理员或具有**管理集群驱动**[全局角色]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)的用户，可以刷新 Kubernetes 元数据。

要强制 Rancher 刷新 Kubernetes 元数据，可以执行手动刷新操作：

1. 点击左上角 **☰ > 集群管理**。
1. 在左侧导航菜单中，单击**驱动**。
1. 单击**刷新 Kubernetes 元数据**。

你可以将 `refresh-interval-minutes` 设置为 `0`（见下文），将 Rancher 配置为仅在需要时刷新元数据，并在需要时使用此按钮手动执行元数据刷新。

### 配置元数据同步

> 只有管 ​​ 理员可以更改这些设置。

RKE 元数据的配置控制 Rancher 同步元数据的频率以及从何处下载数据。你可以通过 Rancher UI 或通过 Rancher API 端点 `v3/settings/rke-metadata-config` 配置元数据。

元数据的配置方式取决于 Rancher 版本。

要在 Rancher 中编辑元数据配置：

1. 在左上角，单击 **☰ > 全局设置**。
1. 转到 **rke-metadata-config**。单击 **⋮ > 编辑设置**。
1. 你可以选择填写以下参数：

- `refresh-interval-minutes`：Rancher 等待同步元数据的时间。如果要禁用定期刷新，请将 `refresh-interval-minutes` 设置为 0。
- `url`：Rancher 从中获取数据的 HTTP 路径。该路径必须是 JSON 文件的直接路径。例如，Rancher v2.4 的默认 URL 是 `https://releases.rancher.com/kontainer-driver-metadata/release-v2.4/data.json`。

1. 单击**保存**。

如果你没有离线环境，则无需指定 Rancher 获取元数据的 URL，因为默认是从 [Rancher 的元数据 Git 仓库获取](https://github.com/rancher/kontainer-driver-metadata/blob/dev-v2.5/data/data.json)的。

但是，如果你有[离线环境](#air-gap-setups)需求，你需要将 Kubernetes 元数据仓库镜像到 Rancher 可用的位置。然后，你需要更改 URL 来指向 JSON 文件的新位置。

### 离线环境

Rancher Server 会定期刷新 `rke-metadata-config` 来下载新的 Kubernetes 版本元数据。有关 Kubernetes 和 Rancher 版本的兼容性表，请参阅[服务条款](https://rancher.com/support-maintenance-terms/all-supported-versions/rancher-v2.2.8/)。

如果你使用离线环境，则可能无法从 Rancher 的 Git 仓库自动定期刷新 Kubernetes 元数据。在这种情况下，应该禁用定期刷新以防止在日志中显示相关错误。或者，你可以配置元数据，以便 Rancher 与本地的 RKE 元数据副本进行同步。

要将 Rancher 与 RKE 元数据的本地镜像同步，管理员需要配置 `rke-metadata-config` 来指向镜像。详情请参考[配置元数据同步](#configuring-the-metadata-synchronization)

在将新的 Kubernetes 版本加载到 Rancher Server 中之后，需要执行其他步骤才能使用它们启动集群。Rancher 需要访问更新的系统镜像。虽然只有管理员可以更改元数据设置，但任何用户都可以下载 Rancher 系统镜像并为镜像准备私有 Docker 镜像仓库。

1. 要把系统镜像下载到私有镜像仓库，请单击 Rancher UI 左下角的 Rancher Server 版本。
1. 下载适用于 Linux 或 Windows 操作系统的镜像。
1. 下载 `rancher-images.txt`。
1. 使用[离线环境安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/populate-private-registry)时使用的步骤准备私有镜像仓库，但不要使用发布页面中的 `rancher-images.txt`，而是使用上一个步骤中获取的文件。

**结果**：Rancher 的离线安装现在可以同步 Kubernetes 元数据。如果你在发布新版本的 Kubernetes 时更新了私有镜像仓库，你可以使用新版本配置集群，而无需升级 Rancher。
