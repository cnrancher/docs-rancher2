---
title: 高可用 RKE Add-On 安装 常见问题
---

> #### **重要：RKE add-on 安装 仅支持至 Rancher v2.0.8 版本**
>
> 你可以使用 Helm chart 在 Kubernetes 集群中安装 Rancher。获取更多细节，请参考[安装 Kubernetes - 安装概述](/docs/installation/k8s-install/_index)。
>
> 如果您正在使用 RKE add-on 安装的方法，请参阅[从一个 RKE Add-on 安装的 Rancher 迁移到 Helm 安装](/docs/upgrades/upgrades/migrating-from-rke-add-on/_index) 获取如何迁移至使用 helm chart 的更多细节。

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
