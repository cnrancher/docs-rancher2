---
title: 克隆集群
weight: 2035
---

如果你在 Rancher 中有一个集群并想将这个集群用作创建集群的模板，你可以使用 Rancher CLI 克隆集群的配置，编辑配置，然后使用这些配置来快速启动克隆的集群。

不支持复制已注册的集群。

| 集群类型 | 是否可克隆 |
|----------------------------------|---------------|
| [由基础设施提供商托管的节点]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/) | ✓ |
| [托管的 Kubernetes 提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/) | ✓ |
| [自定义集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes) | ✓ |
| [已注册集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/registered-clusters/) |               |

> **警告**：在复制集群的过程中，你将编辑一个包含所有集群设置的配置文件。但是，由于集群复制 _不是_ 大规模更改配置，因此我们建议仅编辑本文中明确列出的值。编辑其他值可能会使配置文件失效，从而导致集群部署失败。

## 前提

下载并安装 [Rancher CLI]({{<baseurl>}}/rancher/v2.6/en/cli)。如有必要，请[创建 API 持有者令牌]({{<baseurl>}}/rancher/v2.6/en/user-settings/api-keys)。


## 1. 导出集群配置

首先，使用 Rancher CLI 导出要克隆的集群的配置。

1. 打开终端并转到 Rancher CLI 二进制文件所在的位置 `rancher`。

1. 运行以下命令以列出 Rancher 管理的集群：


        ./rancher cluster ls


1. 找到要克隆的集群，并将其资源 `ID` 或 `NAME` 复制到剪贴板。从此处开始，我们将资源 `ID` 或 `NAME` 称为 `<RESOURCE_ID>`，它在接下来用作占位符。

1. 运行以下命令以导出集群的配置：


        ./rancher clusters export <RESOURCE_ID>


   **步骤结果**：已将克隆集群的 YAML 打印到终端。

1. 将 YAML 粘贴到新文件中。将文件另存为 `cluster-template.yml`（或任何其他名称，确保扩展名是 `.yml` 即可）。

## 2. 修改集群配置

使用文本编辑器为克隆集群修改 `cluster-template.yml` 中的集群配置。

> **注意**：集群配置参数必须嵌套在 `cluster.yml` 中的 `rancher_kubernetes_engine_config` 下。有关详细信息，请参阅 [Rancher 2.3.0+ 配置文件结构]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options/#config-file-structure-in-rancher-v2-3-0)。

1. 在文本编辑器中打开 `cluster-template.yml`（或你重命名了的配置文件）。

   > **警告**：仅需编辑下面明确指出的集群配置项。此文件中列出的很多值均用于配置克隆的集群，因此编辑它们的值可能会中断配置过程。


1. 如下例所示，在 `<CLUSTER_NAME>` 占位符处将原始集群的名称替换为唯一名称 (`<CLUSTER_NAME>`)。如果克隆的集群名称重复，则集群将无法成功配置。

   ```yml
   Version: v3
   clusters:
       <CLUSTER_NAME>: # 输入唯一的名称
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

1. 对于每个 `nodePools`，将原始节点池名称替换为 `<NODEPOOL_NAME>` 占位符处的唯一名称。如果克隆集群具有重复的节点池名称，则集群将无法成功配置。

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

## 3. 启动克隆的集群

将 `cluster-template.yml` 移动到 Rancher CLI 二进制文件所在的目录中。然后运行这个命令：

    ./rancher up --file cluster-template.yml

**结果**：开始配置你克隆的集群。输入 `./rancher cluster ls` 进行确认。
