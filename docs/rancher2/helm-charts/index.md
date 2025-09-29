---
title: 功能介绍
description: Rancher 提供了基于 Helm 的应用商店的功能，该功能使部署和管理相同的应用变得更加容易。应用商店可以是 GitHub 代码库或 Helm Chart 库，其中包含了可部署的应用。应用打包在称为Helm Chart的对象中。Helm Charts是描述一组相关 Kubernetes 资源的文件的集合。单个 Chart 可能用于部署简单的内容（例如 Mencached Pod）或复杂的内容（例如带有 HTTP 服务，数据库，缓存等的完整的 Web 应用）。Rancher 改进了 Helm 应用商店和 Chart。所有原生 Helm Chart 都可以在 Rancher 中使用，但是 Rancher 添加了一些增强功能以改善用户体验。
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
  - 应用商店
  - 功能介绍
---

Rancher 提供了基于 Helm 的应用商店的功能，该功能使部署和管理相同的应用变得更加容易。

- **应用商店**可以是 GitHub 代码库或 Helm Chart 库，其中包含了可部署的应用。应用打包在称为 **Helm Chart** 的对象中。
- **Helm Charts** 是描述一组相关 Kubernetes 资源的文件的集合。单个 Chart 可能用于部署简单的内容（例如 Mencached Pod）或复杂的内容（例如带有 HTTP 服务，数据库，缓存等的完整的 Web 应用）。

Rancher 改进了 Helm 应用商店和 Chart。所有原生 Helm Chart 都可以在 Rancher 中使用，但是 Rancher 添加了一些增强功能以改善用户体验。

## 应用商店范围

在 Rancher 中，您可以在三个不同的范围内管理应用商店。全局应用商店在所有集群和项目之间共享。在某些用例中，您可能不想跨不同集群甚至不想在同一集群中的项目共享应用商店。通过利用集群和项目范围的应用商店，您将能够为特定团队提供应用，而无需与所有集群和/或项目共享它们。

| 范围 | 描述                                                    | 可用版本 |
| ---- | ------------------------------------------------------- | -------- |
| 全局 | 所有集群和所有项目都可以访问此应用商店中的 Helm Chart   | v2.0.0   |
| 集群 | 特定集群中的所有项目都可以访问此应用商店中的 Helm Chart | v2.2.0   |
| 项目 | 该特定集群中的特定项目可以访问此应用商店中的 Helm Chart | v2.2.0   |

## 应用商店使用的 Helm 版本

_自 v2.4.0 起可用_

Helm 3 在 2019 年 11 月发布，并且 Helm2 某些功能已被弃用或重构。它并不可以[完全向后兼容 Helm 2](#Helm-3-向后兼容性)。因此，Rancher 中的应用商店需要进行区分，每个应用商店仅可以使用一个指定的 Helm 版本。这将有助于减少应用商店中应用部署相关的问题，因为您的 Rancher 用户不需要知道您的 Charts 的哪个版本与哪个 Helm 版本的兼容。用户只需选择应用商店，选择其中的应用，然后就可以部署已经过兼容性验证的版本。

创建自定义应用商店时，必须将应用商店配置为使用 Helm 2 或 Helm3。设置了此版本以后就不能更改。如果使用错误的 Helm 版本添加了应用商店，则需要将其删除并重新添加。

从应用商店启动新应用时，Rancher 根据应用商店的 Helm 版本进行不同的处理。Rancher 将使用 Helm 2 来管理所有 Helm 2 应用商店。Rancher 将使用 Helm 3 来管理所有 Helm 3 应用商店。

默认情况下，应用将使用 Helm 2 进行部署的。如果您在 v2.4.0 之前的 Rancher 中运行了某个应用，然后升级到 Rancher v2.4.0+，则该应用仍将由 Helm 2 管理。如果应用已经使用了 Helm 3 Chart（API 版本 2），它将在 v2.4.0+ 中不能正常工作。您必须降 Chart 的 API 版本或重新创建 Helm 3 的应用商店。

只能将 Helm 2 的 Chart 添加到 Helm 2 的应用商店中。同样，Helm 3 的 Chart 仅能添加到 Helm 3 的应用商店中。

## 什么时候使用 Helm 3

_自 v2.4.0 起可用_

- 如果要使用基于 kubeconfig 的安全权限
- 如果您想使用 apiVersion `v2`的功能（Helm 3 使用 v2 API），例如创建 Library Chart 以减少重复的代码，或者将 requirements 从`requirements.yaml`移至`Chart.yaml`

总体而言，Helm 3 是朝着更加标准化的 Kubernetes 迈进的一步。随着 Kubernetes 社区的发展，标准和最佳实践也随之发展。Helm 3 试图采用这些标准和最佳实践，并简化 Charts 的维护方式。

## Helm 3 向后兼容性

_自 v2.4.0 起可用_

Helm 3 通过使用 OpenAPI schema 来验证渲染的模板，所以有些在 Helm 2 中可以正常工作的 Charts 可能在 Helm 3 中不能正常工作。这将需要您更新 Chart 模板以满足新的验证要求。这是我们在 Rancher 2.4.x 中同时支持 Helm 2 和 Helm 3 的主要原因之一，因为并非所有 Charts 都可以立即通过 Helm 3 中部署。

Helm 3 不会自动为您创建命名空间，因此您必须提供一个现有的命名空间。如果您将代码与 Helm 2 集成在了一起，则可能会遇到问题，因为您可能需要更改您的代码逻辑以确保为 Helm 3 创建并传递了命名空间。如果您通过 Rancher 使用 Helm，您可以不用考虑这个事情，Rancher 将继续管理 Helm 所需的命名空间，并确保不会影响到您的应用部署。

Helm 3 Charts 使用 apiVersion `v2`。在某些较旧的 Helm 2 版本中，并没有校验 `Chart.yaml` 文件中的 apiVersion，因此您在使用中可能会遇到问题。通常，您的 Helm 2 Charts 中的 apiVersion 应该设置为 `v1`，而 Helm 3 Charts 的 apiVersion 应该设置为`v2`。您可以使用 Helm 3 安装带有 apiVersion `v1` 的 Charts，但不能在 Helm 2 中安装带有 apiVersion `v2` 的 Charts。

## 内置的全局应用商店

在 Rancher 中，有一些默认应用商店作为 Rancher 的一部分。这些可以由系统管理员启用或禁用。有关详细信息，请参阅关于管理[内置的全局应用商店](/docs/rancher2/helm-charts/built-in/)的文档。

## 自定义应用商店

Ranhcer 中有两种类型的应用商店：[内置的全局应用商店](/docs/rancher2/helm-charts/built-in/)和[自定义应用商店](/docs/rancher2/helm-charts/adding-catalogs/)。

任何用户都可以创建自定义应用商店并添加到 Rancher 中。可以在全局级别，集群级别或项目级别将自定义应用商店添加到 Rancher 中。有关详细信息，请参阅[添加自定义商店](/docs/rancher2/helm-charts/adding-catalogs/)和[应用商店配置参考](/docs/rancher2/helm-charts/catalog-config/)。

## 创建并部署应用

在 Rancher 中，应用是从应用商店中的模板部署的。本节涵盖以下主题：

- [多集群应用](/docs/rancher2/helm-charts/multi-cluster-apps/)
- [创建应用商店应用](/docs/rancher2/helm-charts/creating-apps/)
- [在项目级别部署应用](/docs/rancher2/helm-charts/)
- [管理应用](/docs/rancher2/helm-charts/managing-apps/)
- [教程：创建应用的示例](/docs/rancher2/helm-charts/tutorial/)

## 与 Rancher 的兼容性

Chart 现在支持在 [questions.yml](https://github.com/rancher/integration-test-charts/blob/master/charts/chartmuseum/v1.6.0/questions.yml) 文件中，设置`rancher_min_version`和`rancher_max_version`字段，以指定 Chart 兼容的 Rancher 版本。

使用 Rancher UI 部署应用时，将仅显示对当前运行的 Rancher 版本有效的应用版本，从而禁止启动不满足 Rancher 版本要求的应用。如果在升级 Rancher 前已经部署了应用，但这个应用不支持新版本的 Rancher，在这种情况下升级 Rancher 不会影响这个已有应用。

## 全局 DNS

_自 v2.2.0 起可用_

当创建跨多个 Kubernetes 集群的应用时，可以创建一个全局 DNS 记录以将流量路由到所有不同集群中的端点。将需要对外部 DNS 服务器进行编程，以为您的应用分配域名（FQDN）。Rancher 将使用您提供的 FQDN 和应用的所在的 IP 地址来对 DNS 进行编程。Rancher 将从运行您的应用的所有 Kubernetes 集群中找到端点，并对 DNS 进行编程。

有关如何使用此功能的更多信息，请参见[全局 DNS](/docs/rancher2/helm-charts/globaldns/)。
