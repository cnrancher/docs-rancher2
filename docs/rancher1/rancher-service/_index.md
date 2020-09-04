---
title: 概述
---

当启动 Rancher 时，每个[环境](/docs/rancher1/configuration/environments/)的创建都基于[环境模版](/docs/rancher1/configuration/environments/_index#什么是环境模版)。在启动一个环境时，您可以在环境模版中选择需要启动的基础设施服务。这些基础设施服务包括编排引擎，[外部 DNS](/docs/rancher1/infrastructure/cattle/external-dns-service/_index)，[网络](/docs/rancher1/rancher-services/networking/_index)，[存储](/docs/rancher1/rancher-services/storage-service/_index)，框架服务 (例如: [内部 DNS](/docs/rancher1/rancher-services/dns-service/_index)，[Metadata 服务](/docs/rancher1/rancher-services/metadata-service/_index)，和[健康检查服务](/docs/rancher1/infrastructure/cattle/health-checks/_index))。

基础设施服务位于[Rancher 应用商店](https://github.com/rancher/rancher-catalog)和[社区应用商店](https://github.com/rancher/community-catalog)中的`infra-templates`文件夹中。Rancher 应用商店和社区应用商店是默认开启的，它们提供了一系列可以在环境模版中使用的基础服务。

当创建一个环境模版时，默认开启运行一个环境所需的一系列基础服务。
