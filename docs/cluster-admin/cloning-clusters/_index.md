---
title: 克隆集群
---

如果在 Rancher 中有一个集群，并希望用这个集群作为模版来创建相似集群，则可以使用 Rancher CLI 克隆该集群的配置，对其进行编辑，然后使用它来快速启动克隆的集群。

仅当集群中的节点由基础设施供应商（例如 EC2，Azure 或 DigitalOcean）提供时，才可以克隆集群。

不支持克隆导入的集群，托管的 Kubernetes 集群以及自定义集群。

| 集群类型                                                                                      | 知否支持克隆 |
| --------------------------------------------------------------------------------------------- | ------------ |
| [节点运行在基础设施供应商上的集群](/docs/cluster-provisioning/rke-clusters/node-pools/_index) | ✓            |
| [托管的 Kubernetes 集群](/docs/cluster-provisioning/hosted-kubernetes-clusters/_index)        |              |
| [自定义集群](/docs/cluster-provisioning/custom-clusters/_index)                               |              |
| [导入的集群](/docs/cluster-provisioning/imported-clusters/_index)                             |              |

:::note 警告
在克隆集群的过程中，您将编辑一个很长的集群配置文件。但是，我们建议仅编辑本文档中明确列出的值，因为集群克隆是为简单的集群克隆而设计的，因此 _不能_ 进行大规模配置更改。编辑其他值可能会使配置文件无效，这将导致集群部署失败。
:::

### 先决条件

下载并安装[Rancher CLI](/docs/cli/_index)。请记住，如有必要，请[创建 API Key](/docs/user-settings/api-keys/_index)。

### 1. 导出集群配置

首先使用 Rancher CLI 导出要克隆的集群的配置。

1.  打开终端，然后将目录更改为 Rancher CLI 二进制文件 `rancher` 的位置。

1.  输入以下命令以列出 Rancher 管理的集群。

        ./rancher cluster ls

1.  找到要克隆的集群，然后将其资源 `ID` 或 `NAME` 复制到剪贴板。 从这一点开始，我们将资源 `ID` 或 `NAME` 称为 `<RESOURCE_ID>`，在下一步中将其用作占位符。

1.  输入以下命令以导出集群的配置。

        ./rancher clusters export <RESOURCE_ID>

**步骤结果：** 克隆集群的 YAML 输出到终端。

1. 将 YAML 复制到剪贴板，并将其粘贴到新文件中。 将文件另存为 `cluster-template.yml`（或其他任何名称，只要扩展名为 `.yml` 即可）。

### 2. 修改集群配置

使用您喜欢的文本编辑器为克隆的集群修改`cluster-template.yml`中的集群配置。

> **注意：**从 Rancher v2.3.0 开始，集群配置指令必须嵌套在`cluster.yml`中的`rancher_kubernetes_engine_config`指令下。有关更多信息，请参阅[Rancher v2.3.0 +中的配置文件结构](/docs/cluster-provisioning/rke-clusters/options/_index)。

1. 在您常用的文本编辑器中打开`cluster-template.yml`（或任何您命名的配置）。

   > **警告：** 仅编辑下面明确指定的集群配置值。此文件中列出的许多值用于配置克隆的集群，并且编辑它们的值可能会中断配置过程。

1. 如下例所示，在`<CLUSTER_NAME>`占位符处，用唯一的名称（`<CLUSTER_NAME>`）替换原始集群的名称。如果克隆的集群具有重复名称，则该集群将无法成功配置。

   ```yml
   Version: v3
   clusters:
     <CLUSTER_NAME>: # 输入唯一的集群名称
     dockerRootDir: /var/lib/docker
     enableNetworkPolicy: false
     rancherKubernetesEngineConfig:
     addonJobTimeout: 30
     authentication:
       strategy: x509
     authorization: {}
     bastionHost: {}
     cloudProvider: {}
     ignoreDockerVersion: true
   ```

1. 对于每个`nodePools`部分，在 `<NODEPOOL_NAME>` 占位符处用唯一名称替换原始节点池名称。 如果克隆的集群具有重复的节点池名称，则该集群将无法成功配置。

   ```yml
   nodePools:
     <NODEPOOL_NAME>:
     clusterId: do
     controlPlane: true
     etcd: true
     hostnamePrefix: mark-do
     nodeTemplateId: do
     quantity: 1
     worker: true
   ```

1. 完成后，保存并关闭配置。

### 3. 启动克隆集群

将`cluster-template.yml`移到与 Rancher CLI 二进制文件相同的目录中。 然后运行以下命令：

    ./rancher up --file cluster-template.yml

**结果：**您克隆的集群开始配置。 输入`./rancher cluster ls`进行确认。 您还可以登录 Rancher UI 并打开**全局**视图以查看新创建的集群的进度。
