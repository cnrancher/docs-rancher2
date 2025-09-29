---
title: rancher-logging Helm Chart 选项
description: 你可以通过在`values.yaml`中设置`global.cattle.windows.enabled`为`true`或`false`来启用或禁用 Windows 节点日志记录。
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
  - rancher 2.5
  - 日志服务
  - Rancher v2.5 的日志功能
  - rancher-logging Helm Chart 选项
---

## 启用/停用 Windows 节点日志

_从 v2.5.8 开始可用_

你可以通过在`values.yaml`中设置`global.cattle.windows.enabled`为`true`或`false`来启用或禁用 Windows 节点日志记录。

默认情况下，如果在 Windows 集群上使用 Cluster Explorer UI 来安装日志应用程序，Windows 节点日志将被启用。

在这种情况下，将`global.cattle.windows.enabled`设置为`false`将禁用集群上的 Windows 节点日志记录。
禁用后，仍然会从 Windows 集群中的 Linux 节点收集日志。

:::note 注意
目前存在一个[issue](https://github.com/rancher/rancher/issues/32325)，在 Windows 集群中禁用 Windows 日志后，执行`helm 升级'时，Windows nodeAgents 不会被删除。在这种情况下，如果已经安装了 Windows nodeAgents，用户可能需要手动删除它们。
:::

## 使用自定义 Docker 根目录工作

_适用于 v2.5.6+_

如果使用自定义的 Docker 根目录，你可以在`values.yaml`中设置`global.dockerRootDirectory`。

这将确保创建的日志 CR 将使用你指定的路径，而不是默认的 Docker `data-root`位置。

注意，这只影响到 Linux 节点。

如果集群中存在任何 Windows 节点，该变化将不适用于这些节点。

## 为自定义污点添加 NodeSelector 设置和容忍度

你可以添加你自己的`nodeSelector`设置，并通过编辑日志 Helm chart 值为额外的污点添加`tolerations`，详情请见[本页面](/docs/rancher2.5/logging/taints-tolerations/)。

## 启用日志应用程序以与 SELinux 一起工作

_从 v2.5.8 开始可用_

**要求：** Logging v2 在 RHEL/CentOS 7 和 8 上用 SELinux 进行了测试。
[安全增强型 Linux（SELinux）](https://en.wikipedia.org/wiki/Security-Enhanced_Linux)是对 Linux 的安全增强。在历史上被政府机构使用后，SELinux 现在是行业标准，在 CentOS 7 和 8 上默认启用。

要在 SELinux 下使用日志 v2，我们建议按照[本页](/docs/rancher2.5/security/selinux/)上的说明安装`rancher-selinux` RPM。

然后，在安装日志应用程序时，通过将`values.yaml`中的`global.seLinux.enabled`改为`true`，将图表配置为 SELinux 感知。

## 额外的日志来源

默认情况下，Rancher 会收集所有集群类型的[控制平面组件](https://kubernetes.io/docs/concepts/overview/components/#control-plane-components)和[节点组件](https://kubernetes.io/docs/concepts/overview/components/#node-components)的日志。

在某些情况下，Rancher 可能能够收集额外的日志。

下表总结了可以为每种节点类型收集额外日志的来源。

| 日志的来源 | Linux 节点（包括 Windows 集群） | Windows 节点 |
| :--------- | :------------------------------ | :----------- |
| RKE        | ✓                               | ✓            |
| RKE2       | ✓                               |              |
| K3s        | ✓                               |              |
| AKS        | ✓                               |              |
| EKS        | ✓                               |              |
| GKE        | ✓                               |              |

要启用托管的 Kubernetes 提供商作为额外的日志来源，请到**集群资源管理器>日志>图表选项**，选择**启用增强的云提供商日志**选项。

启用后，Rancher 会收集供应商提供的所有额外的节点和控制面日志，不同的供应商可能会有不同的日志。

如果你已经在使用云提供商自己的日志解决方案，如 AWS CloudWatch 或谷歌云操作套件（以前的 Stackdriver），就没有必要启用这个选项，因为本地解决方案将不受限制地访问所有日志。
