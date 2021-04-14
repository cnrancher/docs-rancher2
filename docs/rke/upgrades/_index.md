---
title: 升级必读
description: 使用 RKE 部署 Kubernetes 后，您可以升级 Kubernetes 集群中组件的版本、编辑Kubernetes services 列表或编辑插件。
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
  - RKE
  - 升级指南
  - 升级必读
---

## 概述

使用 RKE 部署 Kubernetes 后，您可以升级 Kubernetes 集群中组件的版本、编辑[Kubernetes services 列表](/docs/rke/config-options/services/_index)或编辑[插件](/docs/rke/config-options/add-ons/_index)。

RKE 的版本说明列出了每个 RKE 版本支持的 Kubernetes 版本，详情请参考[RKE 版本说明](https://github.com/rancher/rke/releases/)。本文基于 RKE v1.x 写作。

您也可以使用更新的 Kubernetes 版本安装集群。

每个版本的 RKE 都有对应的支持[Kubernetes 版本列表](#listing-supported-kubernetes-versions)。

如果在`kubernetes_version`和`system-images`都定义了 Kubernetes 版本号，`system-images`中的版本号优先级高于`kubernetes_version`的版本号。

## 工作原理

本文讲述了编辑或升级 RKE Kubernetes 集群时发生的事项。

## 先决条件

- 保证`cluster.yml`缺少`system_images`的说明和配置。如果您使用的是[RKE 不支持的 Kubernetes 版本](#using-an-unsupported-kubernetes-version)，则要保证只在`system——images`中说明 Kubernetes 版本号。详情请参考[Kubernetes 版本优先级](#kubernetes-version-precedence)。

* 保证工作目录中有管理[Kubernetes 集群状态](/docs/rke/installation/_index)所需的文件，不同版本的 RKE 使用不同的文件管理 Kubernetes 集群状态。

  - RKE v0.2.0 及更新版本

    RKE v0.2.0 及以上的版本使用`cluster.rkestate`文件管理集群状态。`cluster.rkestate`文件中含有集群的当前状态，包括 RKE 配置和证书等信息。

    这个文件和`cluster.yml`位于同一目录下。

    `cluster.rkestate`文件非常重要，控制集群和升级集群的时候都需要用到这个文件，请妥善保管该文件。

  - RKE v0.2.0 之前的版本

    请保证工作目录中含有`kube_config_cluster.yml`文件

    RKE 以密文的方式保存 Kubernetes 集群状态。编辑集群状态时，RKE 拉取密文，变更集群状态，然后将变更后的状态以密文的方式保存到`kube_config_cluster.yml`文件中。如果您使用的是 RKE v0.2.0 之前的版本，请妥善保管该文件。

## 升级 Kubernetes 版本

打开`cluster.yml`文件，找到 `kubernetes_version`字符串，将原有的版本号修改为新的版本号即可。每个 RKE 版本支持的 Kubernetes 版本不同，请参考[列举支持的 Kubernetes 版本](#listing-supported-kubernetes-versions)。

```yaml
kubernetes_version: "v1.15.5-rancher1-1"
```

然后在命令行工具中输入 `rke up`，使用`cluster.yml`文件指定的新版本器启动 RKE。

```shell
rke up --config cluster.yml
```

## 配置升级策略

从 v0.1.8 开始，RKE 支持升级插件（Add-on）。也可以在配置文件中直接编辑组件版本，然后运行`rke up`重启 RKE，重启后 RKE 就会使用更新后的[插件](/docs/rke/config-options/add-ons/_index)。

从 v1.1.0 开始，RKE 提供了更多的升级选项，让用户在升级插件的过程中可控的选择更多。这些选项可以使业务在升级的过程中不中断。

升级配置选项的详情请查看[配置升级策略](/docs/rke/upgrades/configuring-strategy/_index)。

## 不间断业务升级

这个文档讲述了如何实现不中断业务的升级过程，详情请参考[不中断业务的升级](/docs/rke/upgrades/maintaining-availability/_index)。

## 列举支持的 Kubernetes 版本

请参考[RKE 版本说明](https://github.com/rancher/rke/releases)，获取您当前使用的 RKE 支持的 Kubernetes 版本号。

也可以输入以下命令，快速获取支持的版本号。

```shell
rke config --list-version --all
v1.15.3-rancher2-1
v1.13.10-rancher1-2
v1.14.6-rancher2-1
v1.16.0-beta.1-rancher1-1
```

## Kubernetes 版本优先级

如果在`kubernetes_version`和`system_images`中都定义了 Kubernetes 版本，`system_images`中定义的版本会生效，而`kubernetes_version`中定义的版本不会生效。如果两者都没有定义 Kubernetes 版本，RKE 会使用默认的 Kubernetes 版本。

## 使用不支持的 Kubernetes 版本 Using an Unsupported Kubernetes Version

使用 RKEv0.2.0 或更旧的版本时，如果`kubernetes_version`定义的版本和 RKE 支持的 Kubernetes 版本不同，RKE 会无法运行。

使用 RKEv0.2.0 之后的版本是，如果`kubernetes_version`定义的版本和 RKE 支持的 Kubernetes 版本不同，RKE 会转而使用自身支持的 Kubernetes 版本。

如果您想将既定的 Kubernetes 版本替换为其他版本，请使用[system images](/docs/rke/config-options/system-images/_index)选项。

## Kubernetes 版本和服务的映射关系

在 RKE 中，`kubernetes_version`将 Kubernetes 版本映射到默认的服务、参数和选项中。

使用 v0.3.0+时，RKE 有这些[默认服务](https://github.com/rancher/kontainer-driver-metadata/blob/master/rke/k8s_service_options.go)。

使用 v0.3.0 之前的版本时，有这些[默认服务](https://github.com/rancher/types/blob/release/v2.2/apis/management.cattle.io/v3/k8s_defaults.go)。目录中的服务版本与 Rancher 版本相同。因此，使用 Rancher2.1.x 时应该使用[这个文件](https://github.com/rancher/types/blob/release/v2.1/apis/management.cattle.io/v3/k8s_defaults.go)。

## 升级服务

您可以修改服务的对象，或添加`extra_args`，然后运行`rke up`命令，升级服务。

> **说明：** `service_cluster_ip_range` 和 `cluster_cidr`不可修改。

## 手动升级节点

_v1.1.0 开始可用_

您可以手动升级每种类型的节点。建议您先升级 etcd 节点，然后升级 controlplane 节点，最后再升级 worker 节点。

## 回滚 Kubernetes 版本

_v1.1.0 开始可用_

您可以使用快照，将集群恢复到使用上一个 Kubernetes 版本的时候。

## 问题排查

_v1.1.0 开始可用_

如果一个节点在升级之后不出现，`rke up`指令会报错。

如果实际不可用的节点超出了配置文件中限定不可用节点数量的最大值，则不会升级。

如果升级停止了，您可能需要修改一些不可用的节点，或者将它从集群中移除，然后继续升级。

一个不可用的节点可能处于以下几种状态：

- 关机
- 不可用
- 用户执行了 drain 命令，将该节点上运行的 pod 驱逐到了其他节点上，导致该节点上没有 kubelets
- 升级失败

以下是升级失败的常见场景：

- 升级过程中，不可用的节点数量达到预设的最大值，RKE CLI 会报错，停止工作。
- 如果一些节点升级失败，但是不可用的节点数量小于预设的最大值，RKE CLI 会将这些节点升级失败的事项记录在日志里，然后跳过这些节点，升级其他节点和插件。完成插件升级或，RKE 会报错，然后退出。
