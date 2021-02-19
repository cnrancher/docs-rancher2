---
title: 在设置了 PSP 的集群中启用 Istio
description: 由于 Istio 需要某些权限才能安装自身并管理 Pod 的基础结构，如果启用了限制性 Pod 安全策略，则 Istio 可能无法正确运行。在本节中，我们在配置了 PSP 的集群中启用 Istio，然后设置 Istio CNI 插件。
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
  - 集群管理员指南
  - 集群访问控制
  - 告警
  - Istio
  - Istio使用指南
  - 在设置了 PSP 的集群中启用 Istio
---

> **注意：** 以下指南仅适用于 RKE 配置的集群。

由于 Istio 需要某些权限才能安装自身并管理 Pod 的基础结构，如果启用了限制性 Pod 安全策略，则 Istio 可能无法正确运行。在本节中，我们在配置了 PSP 的集群中启用 Istio，然后设置 Istio CNI 插件。

使用 Istio CNI 插件后，应用程序的 Pod 中的容器将不再必须拥有`NET_ADMIN`特权。有关更多信息，请参见 [Istio CNI 插件文档](https://istio.io/docs/setup/additional-setup/cni)。请注意，[Istio CNI 插件仍为 Alpha 阶段](https://istio.io/about/feature-stages/)。

## 配置系统项目的 PSP 策略以允许安装 Istio

1. 从主菜单中，选择**项目/命名空间**。
1. 找到**项目：系统**项目，然后选择**省略号 > 编辑**。
1. 将**Pod 安全策略**选项更改为不受限制，然后单击**保存**。

## 在系统项目中安装 CNI 插件

1. 从的主菜单中，选择**项目/命名空间**。
1. 选择**项目：系统**项目。
1. 在导航栏中选择**工具>商店设置**。
1. 添加具有以下内容的应用商店：
   1. 名称：istio-cni
   1. 应用商店 URL：https://github.com/istio/cni
   1. 分支：与您当前 Istio 版本匹配的分支，例如：`release-1.4`。
1. 从主菜单中选择**应用商店**
1. 单击启动，然后选择 istio-cni
1. 将命名空间更新为`kube-system`
1. 在答案部分中，单击`编辑 YAML`并粘贴以下内容，然后单击启动：

   ```
   ---
     logLevel: "info"
     excludeNamespaces:
       - "istio-system"
       - "kube-system"
   ```

## 安装 Istio

按照[启动 Istio](/docs/rancher2/istio/2.5/configuration-reference/selectors-and-scrape/_index) 的说明执行，并添加一个自定义答案：`istio_cni.enabled = true`。

Istio 完成安装后，系统项目中的应用商店页面应显示成功部署了的 istio 和`istio-cni`应用。Istio 的 Sidecar 自动注入功能现在应该可以正常工作了。
