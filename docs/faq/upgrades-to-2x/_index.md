---
title: 从 v1.x 升级到 Rancher v2.x 的问题
description: 本小节包含关于 Rancher v1.x 和 Ranhcer v2.x 版本的变化以及如何从 v1.x 升级到 v2.x 的常见问题回答。
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
  - 常见问题
  - 从 v1.x 升级到 Rancher v2.x 的问题
---

本小节包含关于 Rancher v1.x 和 Ranhcer v2.x 版本的变化以及如何从 v1.x 升级到 v2.x 的常见问题回答。

## Kubernetes

**如何理解说 Rancher v2.x 是运行在 Kubernetes 之上的？**

Rancher v2.x 是一个百分百运行在 Kubernetes 之上的容器管理平台。它是通过 Kubernetes 自定义资源和控制器框架实现的。所有的特性都通过自定义资源定义 CRD 进行编写，并利用了 Kubernetes 原生功能如 RBAC 等。

**Rancher 计划使用原生 Kubernetes 吗，还是继续运行自己的 fork？**

我们会继续提供 Rancher 的发行版。您可以在创建 Kubernetes 集群时默认选择 Rancher 发行版，该发行版非常接近原生 Kubernetes 镜像。我们基于原生的`hyperkube`的镜像进行了打包，在镜像内安装了一些必要工具，但并没有对任何 Kubernetes 代码进行改动，。具体请查看 [rancher/hyperkube](https://github.com/rancher/hyperkube)。

**Rancher v2.x 版本是否意味着我需要重新培训我们的 Support 员工关于 Kubernetes 的技能？**

是的。Rancher 会通过 kubectl 提供原生 Kubernetes 管理能力，当然也提供了 UI 面板供您方便地管理 Kubernetes 工作负载，而不需要完全理解 Kubernetes 的复杂设计。不过，为了更好地应用 Kubernetes，我们建议您对 Kubernetes 作多一番学习理解。Rancher 将不断地提升我们的产品交互体验，使得您更容易地使用它。

**可以用 Rancher Compose 创建一个 Kubernetes Pod 吗？我们需要学习这两种方式吗？我们通常使用文件系统中的文件来操作，而非 UI。**

不支持。非常抱歉，由于其中差异非常大，我们在 Rancher 2.x 将不再支持 Rancher Compose。我们会提供相关工具和指导说明来帮助您进行迁移。

**如果我们使用 Kubernetes 原生 YAML 文件进行部署资源，我们能够正常运行相应服务吗？还是我们需要通过 Rancher 或 Docker Compose 文件来部署资源？**

当然可以。可以直接使用 Kubernetes 原生 YAML 文件。

## Cattle 编排

**Rancher v2.x 如何影响 Cattle？**

Rancher v2.x 已经基于 Kubernetes 重新进行了架构设计，在 Rancher 2.x 中不再支持 Cattle 编排。您会发现，大部分 Cattle 的功能都可以在 Rancher 2.x 上实现，或者通过 Kubernetes 的类似功能呈现。我们在 Rancher v2.1 版本开发了相关的迁移工具，以帮助您将现有的 Rancher Compose 文件转换成 Kubernetes YAML 文件。

**可以将现有 Cattle 工作负载迁移到 Kubernetes 吗？**

可以。Rancher v2.1 版本我们提供了相关工具，可以帮助您将现有的 Cattle 工作负载文件从 Compose 格式转换成 Kubernetes YAML 格式。转换完成后，就可以将这些工作负载部署在 Rancher v2.x 平台上。

## 功能特性变更

**我们能在 Rancher v2.x 版本里添加如同 v1.6.x 里可以单独查看的基础设施服务吗？**

可以。您可以管理 Kubernetes 存储、网络，及其生态里的众多组件。

**现有的默认角色将会变化吗，或是继续沿用？采用 Kubernetes 会影响到角色和 RBAC 的设计吗？**

Rancher v1.6 的角色会被扩展以支持 Rancher v2.x 的新的功能特性，同时我们会利用 Kubernetes RBAC（基于角色的访问控制）能力以提供更多灵活性。

**Rancher v2.x 版本提供类似的防火墙或者网络策略用以隔离前端容器和后端容器吗？**

可以。您可以通过 Kubernetes 的网络策略进行隔离。

**那么 Rancher CLI 工具呢？它可以如之前一样以相同的方式实现相同的功能吗？**

是的，当然可以。

## 环境和集群

**我仍然可以创建环境和集群模板吗？**

自 Rancher 2.0 版本始，环境这个概念已经被 Kubernetes 集群概念替代，并且只支持 Kubernetes。

Rancher 的 Kubernetes RKE 模板已经在 v2.3 版本实现，您可以通过我们最新的 v2.3.x 版本实现您想要的 Kubernetes 集群模板能力。

**Rancher 仍然能够向环境添加一个已有的节点吗？（例如，该节点不是直接通过 Rancher 创建的）**

可以。我们仍然提供相同的方式，您可以在节点上直接运行 Rancher Agent。

## 升级和迁移

**如何进行 Rancher v1.x 到 v2.x 的版本升级和迁移？**

因为从 Docker 容器到 Kubernetes Pod 的转换存在比较大的技术困难，升级到 v2.x 版本会要求用户重新部署原来的工作负载到新的 v2.x 的集群中。我们在 v2.x 版本提供了这种将 Rancher Compose 文件转换成 Kubernetes YAML 文件的工具。您可以在转换后将工作负载部署到 rancher v2.x 中。

**能否无任何中断地从 Rancher v1.x 升级到 v2.x 版本呢？**

目前，我们仍在探索不同的场景以及收集反馈。我们预期您可能需要新建一个 Rancher 服务并在其上运行您的工作负载，然后再进行业务切换。

## 支持服务

**Rancher 将会提供对 Rancher v1.6 版本的长期支持服务吗？**

请参阅[技术支持条款](https://rancher.com/support-maintenance-terms/)。我们计划与 2020 年 6 月 30 日终止 v1.6 版本的支持。这意味着，在此日期之后，将不再发布与安全相关的维护版本，也不会通过 Rancher Labs 提供技术支持。我们建议您尽快从 Rancher v1.6 升级和迁移到 Rancher v2.x 版本。v1.6 版本信息可以参考[v1.6 版本发布](https://github.com/rancher/rancher/wiki/Rancher-1.6)。
