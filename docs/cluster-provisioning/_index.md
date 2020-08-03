---
title: 创建集群的几种方式
description: 创建集群的步骤通常是复杂而繁琐的，用户需要输入多个配置参数才可以完成集群创建。Rancher 创建集群的过程则非常简单快捷，您只需要通过 Rancher UI 界面，填写一些简单的的参数即可创建集群。而且 Rancher 支持的集群种类繁多，包括云供应商托管的 Kubernetes 集群、RKE 集群、基础设施提供商创建节点并创建 Kubernetes 集群、在自定义节点上创建 Kubernetes 集群、导入现有 Kubernetes 集群和导入 K3s 集群。
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
  - 创建集群
  - 创建集群的几种方式
---

创建集群的步骤通常是复杂而繁琐的，用户需要输入多个配置参数才可以完成集群创建，但是使用 Rancher 创建集群的过程非常简单快捷，您只需要通过 Rancher UI 界面，填写一些简单的的参数即可创建集群。而且 Rancher 支持的集群种类繁多：云供应商托管的 Kubernetes 集群、RKE 集群、基础设施提供商创建节点并创建 Kubernetes 集群、在自定义节点上创建 Kubernetes 集群、导入现有 Kubernetes 集群和导入 K3s 集群，都是 Rancher 支持的创建集群的方式。

> 本节假设您基本熟悉 Docker 和 Kubernetes，有关 Kubernetes 组件如何协同工作的简要说明，请参阅[Kubernetes 概念](/docs/overview/concepts/_index)页面。

有关 Rancher Server 是如何创建集群以及使用什么工具来创建集群的概述，请参阅[产品架构](/docs/overview/architecture/_index)页面。

下表总结了每种集群类型的可用选项，“✓”表示支持该操作，“\*”表示在特定情况下支持该操作，详情请参考注释，空白格表示暂不支持该操作。

| 功能                                                                                                     | [Rancher 启动的 Kubernetes 集群 (RKE 集群)](/docs/cluster-provisioning/rke-clusters/_index) | [托管的 Kubernetes 集群](/docs/cluster-provisioning/hosted-kubernetes-clusters/_index) | [导入的 Kubernetes 集群](/docs/cluster-provisioning/imported-clusters/_index) |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [使用 kubectl 和 kubeconfig 文件访问集群](/docs/cluster-admin/cluster-access/kubectl/_index)             | ✓                                                                                           | ✓                                                                                      | ✓                                                                             |
| [添加集群成员](/docs/cluster-admin/cluster-access/cluster-members/_index)                                | ✓                                                                                           | ✓                                                                                      | ✓                                                                             |
| [编辑集群](/docs/cluster-admin/editing-clusters/_index)                                                  | ✓                                                                                           | ✓                                                                                      | \*                                                                            |
| [管理节点](/docs/cluster-admin/nodes/_index)                                                             | ✓                                                                                           | ✓                                                                                      | ✓                                                                             |
| [管理持久卷和存储类](/docs/cluster-admin/volumes-and-storage/_index)                                     | ✓                                                                                           | ✓                                                                                      | ✓                                                                             |
| [管理项目和命名空间](/docs/cluster-admin/projects-and-namespaces/_index)                                 | ✓                                                                                           | ✓                                                                                      | ✓                                                                             |
| [使用应用商店](/docs/catalog/_index)                                                                     | ✓                                                                                           | ✓                                                                                      | ✓                                                                             |
| [使用配置工具（告警、通知、日志、监控和 Istio）](#使用配置工具)                                          | ✓                                                                                           | ✓                                                                                      | ✓                                                                             |
| [克隆集群](/docs/cluster-admin/cloning-clusters/_index)                                                  | ✓                                                                                           | ✓                                                                                      |                                                                               |
| [证书轮换的能力](/docs/cluster-admin/certificate-rotation/_index)                                        | ✓                                                                                           |                                                                                        |                                                                               |
| [备份您的 Kubernetes 集群的能力](/docs/cluster-admin/backing-up-etcd/_index)                             | ✓                                                                                           |                                                                                        |                                                                               |
| [恢复和还原 etcd 的能力](/docs/cluster-admin/restoring-etcd/_index)                                      | ✓                                                                                           |                                                                                        |                                                                               |
| [当集群不再能从 Rancher 访问时，清理 Kubernetes 组件](/docs/cluster-admin/cleaning-cluster-nodes/_index) | ✓                                                                                           |                                                                                        |                                                                               |
| [配置 Pod 安全策略](/docs/cluster-admin/pod-security-policy/_index)                                      | ✓                                                                                           |                                                                                        |                                                                               |
| [运行安全扫描](/docs/security/security-scan/_index)                                                      | ✓                                                                                           |                                                                                        |                                                                               |

<<<<<<< HEAD

# \*：除了 [K3s 集群](/docs/cluster-provisioning/imported-clusters/_index#导入的-K3s-集群的其他功能)外，Rancher 不支持为其他类型的导入集群配置集群选项。

> > > > > > > 9361071... RKE and Rancher2.x modifications

## 创建云供应商托管的 Kubernetes 集群

在这个场景中，Rancher 不提供 Kubernetes，因为它是由供应商安装的，例如 Google Kubernetes Engine，Amazon Elastic Container Service for Kubernetes 或 Azure Kubernetes 服务。

如果您使用 Kubernetes 提供商(例如：谷歌 GKE)提供的集群，Rancher 将与相应的云 API 对接。Rancher 允许您通过 Rancher UI 在托管的集群中创建和管理基于角色的访问控制。

有关更多信息，请参阅[托管的 Kubernetes 集群](/docs/cluster-provisioning/hosted-kubernetes-clusters/_index)一节。

## 使用 Rancher 创建 Kubernetes 集群（RKE 集群）

当 Rancher 在您自己的节点上配置 Kubernetes 时，Rancher 底层使用的是[Rancher Kubernetes Engine (RKE)](https://rancher.com/docs/rke/latest/en/)。RKE 是 Rancher 自己的轻量级 Kubernetes 安装程序。

在这种通过 Rancher 部署的集群中，Rancher 将管理整个 Kubernetes 的部署。您可以通过 Rancher 将 RKE 集群部署在任何裸金属服务器、云提供商的虚拟机或虚拟化平台上的虚拟机上。

您可以通过 Rancher UI 动态启动这些节点，Rancher 将调用[Docker Machine](https://docs.docker.com/machine/)在各种云提供商平台上创建节点。

如果您已经有了要添加到 RKE 集群中的节点，则可以通过在其上运行 Rancher Agent 容器将其添加到集群中。

有关详细信息，请参阅有关[RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)的部分。

## 通过基础设施提供商创建节点并创建 Kubernetes 集群

Rancher 可以在 Amazon EC2、DigitalOcean、Azure、阿里云 或 vSphere 等基础设施提供商中动态地创建节点，然后在这些节点上安装 Kubernetes。

使用 Rancher，您可以基于[节点模版](/docs/cluster-provisioning/rke-clusters/node-pools/_index)来创建节点池。此模板定义了要在云提供商中创建的节点的参数。

使用基础设施提供商托管的节点的一个好处是，如果节点失去与集群的连接，Rancher 可以自动替换它，维护预期的集群配置。

是否可以通过某云提供商创建节点模版取决于在 Rancher UI 中是否有状态为 Active 的相应的[主机驱动](/docs/cluster-provisioning/rke-clusters/node-pools/_index)。

有关更多信息，请参阅关于[由设备提供商托管的节点](/docs/cluster-provisioning/rke-clusters/node-pools/_index)。

## 在现有的自定义节点上创建 Kubernetes 集群

在设置这种类型的集群时，Rancher 会在现有的[自定义节点](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)上安装 Kubernetes，这将创建一个自定义集群。

您可以使用任何节点，在 Rancher 中创建一个集群。

这些节点包括本地裸金属服务器、云托管虚拟机或本地虚拟机。

## 导入现有 Kubernetes 集群

在这种类型的集群中，Rancher 可以连接到一个已经建立好的 Kubernetes 集群。因此，Rancher 不提供 Kubernetes，只设置 Rancher Agent 来与集群通信。

请注意，在这种情况下，Rancher 不能自动启动、缩放或升级您的导入集群。所有其他 Rancher 特性，包括集群管理、基于角色的权限控制、策略管理和工作负载管理等，都可用于导入的集群。

对于除 K3s 集群外的所有导入的 Kubernetes 集群，必须在 Rancher 外部编辑导入的集群的配置。例如添加和删除节点，升级 Kubernetes 版本以及更改 Kubernetes 组件参数等。

在 Rancher v2.4 中，可以通过在 Rancher UI 中编辑导入的 K3s 集群，来升级它的 Kubernetes 版本。

有关更多信息，请参阅[导入现有集群](/docs/cluster-provisioning/imported-clusters/_index)一节。

## 导入并编辑 K3s 集群

_自 Rancher v2.4.0 起可用_

[K3s](https://rancher.com/docs/k3s/latest/en/)是轻量级的，完全兼容的 Kubernetes 发行版，现在可以将 K3s Kubernetes 集群导入 Rancher。

导入 K3s 集群时，Rancher 会将其识别为 K3s，Rancher UI 将支持全部的导入集群功能，并且针对 K3s 还将提供以下额外功能：

- 在 UI 中升级 K3s 版本
- 在 UI 中查看（只读）集群中每个节点的 K3s 配置参数和环境变量。

有关更多信息，请参阅[导入现有 K3s 集群](/docs/cluster-provisioning/imported-clusters/_index)一节。
