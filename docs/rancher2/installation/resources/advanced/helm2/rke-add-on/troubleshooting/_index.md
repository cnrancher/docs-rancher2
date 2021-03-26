---
title: 高可用 RKE Add-On 安装 常见问题
description: 这一小节中包含了一些进行 Kubernetes 安装时会遇到的常见问题。
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
  - RKE Add-on 安装
  - 高可用 RKE Add-On 安装 常见问题
---

:::important 重要提示
RKE add-on 安装仅支持 Rancher v2.0.8 之前的版本。
请使用 Rancher helm chart 将 Rancher 安装在 Kubernetes 集群上。有关详细信息，请参见[Rancher 高可用安装](/docs/rancher2/installation/install-rancher-on-k8s/_index)。
如果您当前正在使用 RKE add-on 安装方法，参见[将 RKE add-on 安装的 Rancher 迁移到 Helm 安装](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/_index)，获取有关如何使用 Helm chart 的详细信息。
:::

这一小节中包含了一些进行 Kubernetes 安装时会遇到的常见问题。

在下面的条目中选择一个：

- [一般常见问题](/docs/rancher2/installation/resources/advanced/helm2/rke-add-on/troubleshooting/generic-troubleshooting/_index)

  在这一节中，您可以了解一些调试 Kubernetes 集群的通用方法。

- [为主机设置 SSH tunneling 时失败](/docs/rke/troubleshooting/ssh-connectivity-errors/_index)

  在这一节中，您可以了解到在使用 `rke` 配置节点时，SSH tunneling 创建失败的处理方法。

- [获取 Job 完整状态时失败时](/docs/rancher2/installation/resources/advanced/helm2/rke-add-on/troubleshooting/job-complete-status/_index)

  在这一节中，您可以了解到在部署插件时，Job 失败的处理方法。

- [404 - default backend](/docs/rancher2/installation/resources/advanced/helm2/rke-add-on/troubleshooting/404-default-backend/_index)

  在这一节中，您可以了解到在尝试访问 Rancher 时，页面显示 `404 - default backend` 的处理方法。
