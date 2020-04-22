---
title: 高可用 RKE Add-On 安装 常见问题
description: 这一小节中包含了一些进行 Kubernetes 安装时会遇到的常见问题。
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
  - 安装指南
  - 资料、参考和高级选项
  - RKE Add-on 安装
  - 高可用 RKE Add-On 安装 常见问题
---

:::important 重要提示
RKE add-on 安装仅支持 Rancher v2.0.8 之前的版本。
请使用 Rancher helm chart 将 Rancher 安装在 Kubernetes 集群上。有关详细信息，请参见[Rancher 高可用安装](/docs/installation/k8s-install/_index)。
如果您当前正在使用 RKE add-on 安装方法，参见[将 RKE add-on 安装的 Rancher 迁移到 Helm 安装](/docs/upgrades/upgrades/migrating-from-rke-add-on/_index)，获取有关如何使用 Helm chart 的详细信息。
:::

这一小节中包含了一些进行 Kubernetes 安装时会遇到的常见问题。

在下面的条目中选择一个：

- [一般常见问题](/docs/installation/options/rke-add-on/troubleshooting/generic-troubleshooting/_index)

  在这一节中，您可以了解调试 Kubernetes 集群的一些通用方法。

- [为主机设置 SSH tunneling 时失败](https://rancher.com/docs/rke/latest/en/troubleshooting/ssh-connectivity-errors/)

  在这一节中，您可以找到有关在使用 `rke` 命令配置节点时，可能遇到的有关 SSH tunneling 的创建错误的问题。

- [获取 job 完整状态时失败时](/docs/installation/options/rke-add-on/troubleshooting/job-complete-status/_index)

  在这一节中，您可以了解到有关部署时产生的错误处理方法。

- [404 - default backend](/docs/installation/options/rke-add-on/troubleshooting/404-default-backend/_index)

  在这一节中，您可以了解到有关在尝试访问 Rancher 时页面显示 `404 - default backend` 的问题处理方法。
