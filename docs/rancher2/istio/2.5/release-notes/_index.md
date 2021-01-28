---
title: Istio版本说明
description: 本文介绍了Istio 1.5.9和1.5.8的版本说明和已知问题。
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
  - rancher 2.5
  - Istio
  - 基于角色的访问控制策略
---

## Istio 1.5.9

**问题修复**

- 修复了 Kiali 流量图无法使用的问题[#28109](https://github.com/rancher/rancher/issues/28109)。

**已知问题**

- Kiali 流量图在 UI 中偏移[#28207](https://github.com/rancher/rancher/issues/28207)。

## Istio 1.5.8

### 1.5.8 的重要说明

当从 Istio 的任何一个 1.4 版本升级到任何一个 1.5 版本时，Rancher 安装程序将删除一些资源以完成升级，此时它们将被立即重新安装。这包括`istio-reader-service-account`。如果您的 Istio 安装使用的是这个服务账户，请注意任何与服务账户绑定的密钥都将被删除。最值得注意的是，这将**破坏特定的[多集群部署](https://archive.istio.io/v1.4/docs/setup/install/multicluster/)**。不可能降级回 1.4。

有关 1.5 版本和从 1.4 升级的更多信息，请参见 [Istio 官方升级说明](https://istio.io/latest/news/releases/1.5.x/announcing-1.5/upgrade-notes/)。

:::note 说明
Rancher 继续使用 Helm 安装方法，它产生的架构与 istioctl 安装不同。
:::

### 已知问题

- Kiali 流量图目前无法使用[#24924](https://github.com/istio/istio/issues/24924)
