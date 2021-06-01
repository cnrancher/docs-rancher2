---
title: 产品介绍
description:
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
  - Harvester
  - 产品介绍
---

## 概述

开发者模式（dev mode）旨在用于测试和开发目的。

这个视频展示了开发模式的安装。

<iframe width="950" height="475" src="https://www.youtube.com/embed/TG0GaAD_6J4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 要求

- 我们假设**Multus**已经在你的集群中安装，并且创建了相应的`NetworkAttachmentDefinition`CRD。
- 如果你使用的是[RKE](https://rancher.com/docs/rke/latest/en/)集群，请确保 CNI 插件的`ipv4.ip_forward`被启用，以便 pod 网络能按预期工作，相关问题：[#94](https://github.com/harvester/harvester/issues/94)。

## 作为一个应用程序安装

Harvester 可以通过以下方式安装在 Kubernetes 集群上。

- 使用[Helm](https://helm.sh/)CLI 进行安装
- 作为 Rancher 目录应用安装，在这种情况下，[harvester/harvester](https://github.com/harvester/harvester) repo 会作为 Helm `v3`应用添加到 Rancher 目录中。

请参考 Harvester [Helm chart](https://github.com/harvester/harvester/blob/master/deploy/charts/harvester/README.md)了解更多关于安装和配置 Helm 图表的细节。

### 前提条件

Kubernetes 节点必须有硬件虚拟化支持。

要验证该支持，请使用此命令。

```bash
cat /proc/cpuinfo | grep vmx
```

### 选项 1：使用 Helm 安装

1. 克隆 GitHub 仓库。

   ```bash
   git clone https://github.com/harvester/harvester.git --depth=1
   ```

1. 转到 Helm chart:

   ```bash
   cd harvester/deploy/charts
   ```

1. 用以下命令安装 Harvester chart。

   ```bash
   ### To install the chart with the release name `harvester`:

   ## Create the target namespace
   kubectl create ns harvester-system

   ## Install the chart to the target namespace
   helm install harvester harvester \
   --namespace harvester-system \
   --set longhorn.enabled=true,minio.persistence.storageClass=longhorn
   ```

### 选项 2：使用 Rancher 安装

:::tip
你可以在 Rancher 中使用 Digital Ocean 云提供商创建一个测试 Kubernetes 环境。详情请见[本节](#Digital-Ocean-测试环境)。
:::

1. 通过点击**Global > Tools > Catalogs**，将 Harvester repo`https://github.com/harvester/harvester`添加到你的 Rancher 目录中。
1. 指定 URL 和名称。如果你需要一个稳定的发布版本，将分支设置为`stable`。设置`Helm版本`为`Helm v3`。
   ![harvester-catalog.png](/img/harvester/harvester-catalog.png)
1. 点击**创建**。
1. 导航到你的项目级`Apps.`。
1. 点击 "启动"，选择 Harvester 应用程序。
1. 可选）如果需要，你可以修改配置。否则，使用默认选项。
1. 点击**Launch**，等待应用程序的组件准备好。
1. 点击`/index.html`链接，导航到 Harvester 用户界面，如下图所示。
   ![harvester-app.png](/img/harvester/harvester-app.png)

### Digital Ocean 测试环境

[Digital Ocean](https://www.digitalocean.com/)默认支持嵌套虚拟化。

你可以在 Rancher 中使用 Digital Ocean 云提供商创建一个测试 Kubernetes 环境。

我们推荐使用 "8 核、16GB 内存 "的节点，它将默认启用嵌套虚拟化。

这个截图显示了如何创建一个 Rancher 节点模板，让 Rancher 在 Digital Ocean 中配置这样一个节点。

![do.png](/img/harvester/do.png)

关于如何用 Rancher 启动 Digital Ocean 节点的更多信息，请参阅[Rancher 文档](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/digital-ocean/_index)。
