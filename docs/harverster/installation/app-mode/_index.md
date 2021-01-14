---
title: App 模式
description:
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
  - Harvester
  - 安装指南
  - App 模式
---

## 概述

App 模式用于测试和开发的目的。

## 前提条件

- 已为整群都安装了 multus，并创建了相应的 NetworkAttachmentDefinition CRD。
- 如果你使用的是[RKE](/docs/rke/_index)集群，请确保 CNI 插件启用了`ipv4.ip_forward`，这样 pod 网络才能正常工作。
- 硬件需要满足以下要求，才可以启动和运行 Harvester。
- Node 节点支持嵌套虚拟化。

## 以应用程序的形式安装

Harvester 可以通过以下方式安装在 Kubernetes 集群上。

- 通过[Helm](https://helm.sh/)的 CLI 进行安装。
- 作为 Rancher 应用安装，在这种情况下，[rancher/harvester](https://github.com/rancher/harvester)repo 将作为 Helm`v3`应用添加到 Rancher 目录中。

关于安装和配置 Helm chart 的详细信息，请参考 Harvester[Helm chart](https://github.com/rancher/harvester/tree/master/deploy/charts/harvester)。

### 前提条件

Kubernetes 节点必须有硬件虚拟化支持。

请运行以下命令验证 Kubernetes 节点是否支持硬件虚拟化

```bash
cat /proc/cpuinfo | grep vmx
```

### 选项 1：使用 Helm 安装

1.  克隆 GitHub 仓库：

    ```
    $ git clone https://github.com/rancher/harvester.git --depth=1
    ```

1.  进入 Helm chart。

    ```
    $ cd deploy/charts
    ```

1.  使用以下命令安装 Harvester chart。

        ```bash
        ### To install the chart with the release name `harvester`:

        ## Create the target namespace
        $ kubectl create ns harvester-system

        ## Install the chart to the target namespace
        $ helm install harvester harvester \
        --namespace harvester-system \
        --set longhorn.enabled=true,minio.persistence.storageClass=longhorn
        ```

### 选项 2：安装为 Rancher 应用程序

1. 单击**全局 > 工具 > 目录**，将 Harvester repo `https://github.com/rancher/harvester`添加到 Rancher 目录中。
1. 指定 URL 和名称。默认的分支是 master。将`Helm version`设置为`Helm v3`。
   ![harvester-catalog.png](/img/harvester/harvester-catalog.png)
1. 单击**创建**。
1. 导航到你的项目级`Apps`。
1. 单击`Launch`并选择 Harvester 应用程序。
1. （可选）如果需要，你可以修改配置。否则，使用默认选项。
1. 单击**启动**，等待应用程序的组件准备好。
1. 单击`/index.html`链接，导航到 Harvester 用户界面。
   ![harvester-app.png](/img/harvester/harvester-app.png)

:::tip 提示
您可以使用 Digital Ocean 云提供商在 Rancher 中创建一个测试 Kubernetes 环境。有关详细信息，请参阅本文“Digital Ocean 测试环境”章节。
:::

### Digital Ocean 测试环境

您可以使用 Digital Ocean 云提供商在 Rancher 中创建一个测试 Kubernetes 环境。

我们建议使用`8 core, 16 GB RAM`节点，它将默认启用嵌套虚拟化。

这个截图显示了如何创建一个 Rancher 节点模板，允许 Rancher 在 Digital Ocean 中配置这样一个节点。

![do.png](/img/harvester/do.png)

关于如何使用 Rancher 启动 Digital Ocean 节点的更多信息，请参考[Rancher 文档](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/digital-ocean/_index)。
