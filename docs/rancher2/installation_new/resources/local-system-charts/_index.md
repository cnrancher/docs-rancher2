---
title: 离线环境中使用本地 System Charts
description: System Charts 存储库包含监控、日志、告警和全局 DNS 等功能所需的所有应用项。在 Rancher 的离线安装中，您将需要配置 Rancher 以使用 System Charts 的本地副本。本节介绍如何在 Rancher v2.3.0 中使用 CLI 标志以及在 v2.3.0 之前的 Rancher 版本中使用 Git 镜像来使用本地 System Charts
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
  - 资料、参考和高级选项
  - 离线环境中使用本地 System Charts （System Charts）
---

该[System Charts](https://github.com/rancher/system-charts) 代码库包含监控、日志、告警和全局 DNS 等功能所需的所有应用项。

在 Rancher 的离线安装中，您将需要配置 Rancher 以使用 System Charts 的本地副本。本节介绍如何在 Rancher v2.3.0 中使用 CLI 标志以及在 v2.3.0 之前的 Rancher 版本中使用 Git 镜像来使用本地 System Charts 。

## 在 Rancher 2.3.0 中使用本地 System Charts

在 Rancher v2.3.0 中，`system-charts`的本地副本已打包到`rancher/rancher`容器中。为了能够在离线安装中使用这些功能，您将需要运行带有额外环境变量`CATTLE_SYSTEM_CATALOG=bundled`的 Rancher 安装命令，该变量将告诉 Rancher 使用图表的本地副本，而不是尝试从 GitHub 上获取它们。

[离线安装指南](/docs/rancher2/installation_new/other-installation-methods/air-gap/install-rancher/_index)中包含用于带有捆绑的`system-charts`的 Rancher 安装的示例命令。

> **注意：** 当需要从内置 `system-charts` 切换到外部 `system-charts` 时，需要更新 rancher server 容器，添加环境变量：`CATTLE_SYSTEM_CATALOG=external`。

## 在 2.3.0 之前的版本设置 System Charts

### 1. 准备 System Charts

该[System Charts](https://github.com/rancher/system-charts)存储库包含监控、日志、告警和全局 DNS 等功能所需的所有应用项。为了能够在离线安装中使用这些功能，您将需要将`system-charts`存储库镜像到网络中 Rancher 可以到达的位置，并配置 Rancher 来使用该存储库。

请参阅`system-charts`存储库中的发行说明，以查看哪个分支对应于您的 Rancher 版本。

### 2. 配置 System Charts

需要将 Rancher 配置为使用 system-charts 存储库的 Git 镜像。您可以从 Rancher UI 或 Rancher 的 API 视图配置 System Charts 存储库。

#### 通过 Rancher UI 设置

在 Rancher UI 的商店设置页面中，请按照下列步骤操作：

1. 进入**全局**视图。

1. 单击**工具>商店设置**。

1. System Charts 以 `system-library` 名称显示。要编辑 System Charts 的配置，请单击**省略号 (...) > 升级**。

1. 在**商店 URL 地址**字段中，输入`system-charts`存储库的 Git 镜像的位置。

1. 单击**保存**。

**结果：** Rancher 配置为从您的`system-charts`存储库下载所有必需的应用项。

#### 通过 Rancher API 设置

1. 登录到 Rancher。

1. 在浏览器中打开`https://<your-rancher-server>/v3/catalogs/system-library`。

   ![Open](/img/rancher/airgap/system-charts-setting.png)

1. 单击右上角的**Edit**，然后将**url**值的位置更新为`system-charts`存储库的 Git 镜像。

   ![Update](/img/rancher/airgap/system-charts-update.png)

1. 单击**Show Request**

1. 单击**Send Request**

**结果：** Rancher 配置为从您的`system-charts`存储库下载所有必需的应用项。
