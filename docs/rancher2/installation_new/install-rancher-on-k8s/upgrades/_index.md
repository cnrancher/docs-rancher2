---
title: 升级必读
description: 本节包含有关如何将 Rancher Server 升级到较新版本的信息。无论 Rancher Server 是否安装在内网环境中，升级步骤取决于您是在使用单节点 Rancher 还是在使用高可用 Rancher。请从以下选项中选择。
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
  - 升级和回滚
  - 升级必读
---

本节包含有关如何将 Rancher Server 升级到较新版本的信息。无论 Rancher Server 是否安装在内网环境中，升级步骤取决于您是在使用单节点 Rancher 还是在使用高可用 Rancher。请从以下选项中选择：

- [升级单节点 Rancher](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/single-node/_index)
- [升级高可用 Rancher](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/ha/_index)

## 已知的升级问题

下表列出了升级 Rancher 时要考虑的一些最值得注意的问题。可以在[GitHub](https://github.com/rancher/rancher/releases)和[Rancher 论坛](https://forums.rancher.com/c/announcements/12)的发行说明中找到有关每个 Rancher 版本的已知问题的更完整列表。

| 升级场景                  | 问题                                                                                                                                                                                                                                                                                                                                                                       |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 升级到 v2.4.6 或 v2.4.7   | 这些 Rancher 版本存在一个问题，即创建、编辑或克隆 Amazon EC2 节点模板需要`kms:ListKeys`权限。这一要求在 v2.4.8 中被删除。                                                                                                                                                                                                                                                  |
| 升级到 v2.3.0+            | 从 v2.0，v2.1 或 v2.2 版本升级到 v2.3.0 或者以上版本时，第一次修改通过 Rancher v2.3.0 之前版本部署的 RKE 集群时，由于要向系统组件中加入 Tolerations，该集群全部的系统组件将会自动重启。                                                                                                                                                                                    |
| 升级到 v2.2.x             | Rancher 引入了[System Charts](https://github.com/rancher/system-charts)代码库，其中包含监控，日志，告警和全局 DNS 等功能所需的所有应用商店应用。为了能够在离线环境中使用这些功能，您将需要在本地镜像`system-charts`代码库，并将 Rancher 配置为使用该代码库。请按照说明[配置 Rancher System Charts](/docs/rancher2/installation_new/resources/local-system-charts/_index)。 |
| 从 v2.0.13 或更早版本升级 | 如果您集群的证书已过期，则需要执行[其他步骤](/docs/rancher2/cluster-admin/certificate-rotation/_index)来轮换证书。                                                                                                                                                                                                                                                         |
| 从 v2.0.7 或更早版本升级  | Rancher 引入了 `System` 项目，这是一个自动创建的项目，用于存放 Kubernetes 需要操作的重要命名空间。在升级到 v2.0.7+ 的过程中，Rancher 希望从所有项目中移出这些命名空间。在开始升级之前，请检查这些系统命名空间，确保它们不在任何项目中，从而[防止集群网络问题](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/namespace-migration/_index)。                |

## 警告

Rancher 不支持升级到[rancher-alpha 库](/docs/rancher2/installation_new/resources/choosing-version/_index)中的任何版本，或从[rancher-alpha 库](/docs/rancher2/installation_new/resources/choosing-version/_index)中的任何版本升级到其他版本。

## 通过 RKE Add-on 安装

**重要提示：RKE Add-on 安装方式仅支持到 Rancher v2.0.8 版本**

请使用 Rancher helm chart 来安装 Rancher 高可用。有关详细信息，请参见[高可用安装 - 安装概述](/docs/rancher2/installation_new/install-rancher-on-k8s/_index)。

如果您当前正在使用 RKE Add-on 安装方法，请参阅[从 RKE Add-on 安装迁移](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/_index)了解有关如何迁移到使用 helm chart 安装 Rancher 高可用。
