---
title: 版本说明 - v1.5.9
description: 本节描述访问 Istio 功能所需的权限以及如何配置对 Kiali 和 Jaeger 可视化的访问。默认情况下，只有集群管理员可以为集群启用 Istio、为 Istio 配置资源分配、查看 Prometheus，Grafana，Kiali 和 Jaeger 的 UI。
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
  - 集群管理员指南
  - 集群访问控制
  - 告警
  - Istio
  - 版本说明 - v1.5.9
---

## v1.5.x 版本重要说明

当您从 Istio1.4.x 版本升级到任何一个 1.5.x 版本时，Rancher 安装程序将删除一些包括`istio-reader-service-account`在内的资源，以完成升级，此时它们将被立即重新安装。如果您的 Istio 安装使用的是这个服务账户，所有与服务账户绑定的密钥都会被删除。请注意，这将**破坏特定的[多集群部署](https://archive.istio.io/v1.4/docs/setup/install/multicluster/)**，升级为 1.5.x 后，不可降级回 1.4.x。

有关 1.5 版本和从 1.4 升级的其他信息，请参见官方升级说明：https://istio.io/latest/news/releases/1.5.x/announcing-1.5.8。

> **注意：** Rancher 继续使用 Helm 安装方法，它产生的架构与 istioctl 安装不同。

## v1.5.9 已修复的问题

- Kiali 流量图恢复正常，可以使用 [#28109](https://github.com/rancher/rancher/issues/28109)。

## v1.5.9 已知问题

- Kiali 流量图在 UI 中的显示的位置有偏移[#28207](https://github.com/rancher/rancher/issues/28207)。

## v1.5.8 已知问题

- Kiali 流量图目前无法使用[#24924](https://github.com/istio/istio/issues/24924)，已在 v1.5.9 中修复该问题。
