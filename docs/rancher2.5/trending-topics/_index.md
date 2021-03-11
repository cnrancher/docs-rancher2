---
title: 热点问题
description: Rancher 整理了近期微信粉丝群内经常提及的问题和用户经常访问的页面，并将这些热点问题汇总到本文这个页面。初次整理出来的热点问题囊括了安装指南、用户指南、集群管理员指南、创建集群、和常见问题这 5 本手册中，用户经常访问的页面。尽管初次整理的过程比较繁琐，但是我们希望这个页面的内容能够帮助新手用户或是之前没了解过相关模块的用户，解决在使用 Rancher 的过程中碰到的问题。
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
  - 热点问题
---

## 概述

Rancher 整理了近期微信粉丝群内经常提及的问题和用户经常访问的页面，并将这些热点问题汇总到本文这个页面。整理出来的热点问题囊括了安装指南、用户指南、集群管理员指南、创建集群、和常见问题这 5 本手册中，用户经常访问的页面。尽管整理的过程比较繁琐，但是我们希望这个页面的内容能够帮助新手用户或是之前没了解过相关模块的用户，解决在使用 Rancher 的过程中碰到的问题。我们会定期更新这个页面，以保证这些问题能够满足大多数用户的需求。

## 安装指南

### 离线安装指南

Rancher 的离线安装有四个步骤：

1. [准备节点和私有镜像仓库](/docs/rancher2/installation_new/other-installation-methods/air-gap/prepare-nodes/_index)：离线环境是指在没有外网访问的环境，或在防火墙后安装 Rancher Server 的环境。本文提供了在离线环境中为 Rancher Server 配置基础设施和私有 Docker 镜像仓库的操作指导。
2. [同步镜像到私有镜像仓库](/docs/rancher2/installation_new/other-installation-methods/air-gap/populate-private-registry/_index)：本节介绍如何配置私有镜像仓库，以便在安装 Rancher 时，Rancher 可以从此私有镜像仓库中拉取所需的镜像。
3. [部署 Kubernetes 集群](/docs/rancher2/installation_new/other-installation-methods/air-gap/launch-kubernetes/_index)（Docker 单节点安装请跳过此步骤）：本节描述了如何根据 Rancher Server 环境的最佳实践来安装 Kubernetes 集群。该集群应仅用于运行 Rancher Server。
4. [安装 Rancher](/docs/rancher2/installation_new/other-installation-methods/air-gap/install-rancher/_index)：本节介绍如何为离线环境部署 Rancher。您可以离线安装 Rancher Server，它可能处于防火墙之后或在代理之后。本文将介绍高可用离线安装（推荐）和单节点离线安装。

请按照上述步骤完成离线安装。

### 高可用安装 Helm Chart 选项

高可用安装 Helm Chart 选项包括一般选项和高级选项，如果您使用的安装方式是高可用 Helm Chart，请参考[高可用安装 Helm Chart 选项](/docs/rancher2/installation_new/resources/chart-options/_index)完成相关的选项配置。

### 配置 NGINX 负载均衡

我们将使用 NGINX 作为`L4`层负载均衡器(TCP)，它将请求轮训转发到后端的 Rancher server 节点。在此配置中，负载均衡器位于 Rancher server 节点的前面。负载均衡器可以是任何能够运行 NGINX 的主机。我们不建议使用任意一个 Rancher server 节点作为负载均衡器节点，因为默认配置下每个 K8S 节点都会运行 ingress 控制器，而 ingress 控制器以为`host`网络模式运行，并默认监听了`80`和`443`端口，所以默认情况下会出现端口冲突。如果一定要将 NGINX 安装在 Rancher server 某个节点上，那么可以编辑 ingress 控制器配置文件，在`args`中添加参数，端口根据实际情况修改 `--http-port=8880 --http-port=8443`。 ingress 控制器修改默认端口后，nginx 配置中代理的后端 server 端口也需要一并修改。

**详情请参考[配置 NGINX 负载均衡](/docs/rancher2/installation_new/resources/advanced/helm2/create-nodes-lb/nginx/_index)。**

## 用户指南

### 镜像仓库凭证

在 Rancher 项目或命名空间的上下文中，资源是用来支持运行 Pod 的文件和数据。在 Rancher 中，镜像仓库凭证被视为资源，而 Kubernetes 将镜像仓库凭证归类为密文。因此，在单个项目或命名空间中，镜像仓库凭证必须具有唯一的名称，从而避免冲突。

镜像库凭证其实也是一个 Kubernetes Secret。这个 Secret 包含用于向私有 Docker 镜像库进行身份验证的凭据。当前，仅当在 Rancher UI 中创建工作负载时，部署才会自动获取相应的私有镜像库凭证。而在通过 kubectl 创建工作负载时，部署则不会自动获取私有镜像库凭证，需要您在 YAML 中手动指定。

**详情请参考[镜像仓库凭证](/docs/rancher2/k8s-in-rancher/registries/_index)。**

### 流水线功能介绍

Rancher 的流水线提供了简单的 CI / CD 体验。使用它可以自动拉取代码，运行构建或脚本，发布 Docker 镜像或应用商店应用以及部署更新的软件。

建立流水线可以帮助开发人员尽快，高效地交付新软件。使用 Rancher，您可以与 GitHub 等版本控制系统集成，以设置持续集成（CI）流水线。

配置 Rancher 和 GitHub 等版本控制系统后，Rancher 将部署运行 Jenkins 的容器以自动化执行流水线：

- 构建镜像
- 验证镜像
- 部署镜像到集群
- 执行单元测试
- 执行回归测试

**详情请参考[流水线功能介绍](/docs/rancher2/pipelines/_index)。**

### Pod 弹性伸缩（HPA)

[Pod 弹性伸缩器](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)（HPA）是 Kubernetes 的一项功能，可以对您的应用进行自动扩容和自动缩容。

Rancher 提供了一些额外功能来帮助您管理 HPA，具体取决于 Rancher 的版本。

您可以在 Rancher v2.3.0 或更高版本中的 Rancher UI 创建、管理和删除 HPA，**详情请参考[Pod 弹性伸缩（HPA）](/docs/rancher2/k8s-in-rancher/horitzontal-pod-autoscaler/_index)**。

### 工作负载类型

Kubernetes 将工作负载分为不同类型。Kubernetes 支持的类型包括：

- [部署](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

  **部署**最好用于无状态应用程序（即，您不必维护工作负载的状态）。由**部署**工作负载管理的 Pod 被视为独立且可处理的。如果 Pod 发生了问题，Kubernetes 会将其删除，然后重新创建一个新的 Pod。一个示例应用程序是 Nginx Web 服务器。

- [有状态程序集](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

  **有状态集**与部署相反，当您的应用程序需要维护其身份并存储数据时，最好使用它。类似的应用程序如 Zookeeper，即，需要存储状态的应用程序。

- [守护程序集](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)

  **守护程序集**确保集群中的每个节点都运行一个 Pod 副本。对于要收集日志或监控节点性能的用例，这种类似于守护进程的工作负载效果最佳。

- [任务](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)

  **任务**启动一个或多个 Pod，并确保指定数量的 Pod 已成功终止。与管理需要一直运行的应用程序相反，**任务**最好用于完成特定任务，例如生成报表等。

- [定时任务](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)

  **定时任务**与**任务**相似。但是，**定时任务**会按基于定义的`cron`时间表自动运行。

**详情请参考[工作负载类型](/docs/rancher2/k8s-in-rancher/workloads/_index)。**

### 流水线配置参考

在每个阶段中，您可以任意添加多个步骤。在一个阶段中有多个步骤时，它们会同时运行。

步骤类型包括：

- 运行脚本
- 构建并发布镜像
- 发布应用模板
- 部署 YAML
- 部署应用商店应用

**详情请参考[流水线配置参考](/docs/rancher2/pipelines/config/_index)。**

## 集群管理员指南

### 轮换证书

默认情况下，Kubernetes 集群所需要的证书由 Rancher 生成，如果出现证书过期，或证书泄露等情况，则需要使用新的证书轮换掉有问题的证书。轮换证书后，Kubernetes 组件将自动重新启动。

目前 Rancher 中文官方文档提供了 Rancher v2.0.x、Rancher v2.1.x 和 Rancher v2.2.x 这三个版本的轮换证书操作指导。

**详情请参考[轮换证书](/docs/rancher2/cluster-admin/certificate-rotation/_index)。**

### 集群日志

Rancher 支持与以下日志收集目标服务集成：

- Elasticsearch
- Splunk
- Kafka
- Syslog
- Fluentd

日志服务提供了以下功能：

- 捕获并分析集群的状态
- 在您的环境中分析趋势，寻找集群变化的规律
- 将日志保存到集群外的安全位置
- 随时了解容器崩溃，Pod 驱逐或节点死亡等事件
- 更轻松地调试和排除故障

**详情请参考[集群日志](/docs/rancher2/logging/2.0.x-2.4.x/project-logging/_index)。**

### 配置告警

通知和告警功能是基于 [Prometheus Alertmanager](https://prometheus.io/docs/alerting/alertmanager/) 的。利用这些工具，Rancher 可以通知[集群所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)和[项目所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)有需要处理的告警。

**详情请参考[配置告警](/docs/rancher2/monitoring-alerting/2.0-2.4/cluster-alerts/_index)。**

### 通过 Kubectl 和 kubeconfig 访问集群

本节介绍如何下载集群的 kubeconfig 文件，从您的虚拟机上启动 kubectl，并访问下游集群。这种访问集群的替代方法允许您使用 Rancher 进行身份验证，并在不使用 Rancher UI 的情况下管理集群。Rancher 将发现和显示由 `kubectl` 创建的资源。但是，这些资源可能没有关于发现的所有必要注释。如果使用 Rancher UI 或 API 对资源执行操作(例如，扩展工作负载)，这可能会由于缺少注释而触发对资源的重新创建。只有在对发现的资源执行操作时才会发生这种情况。**详情请参考[通过 Kubectl 和 kubeconfig 访问集群](/docs/rancher2/cluster-admin/cluster-access/kubectl/_index)**。

### 项目和命名空间

命名空间是 Kubernetes 的概念，它允许在集群中创建虚拟集群，这对于将集群划分为单独的“虚拟集群”非常有用，每个虚拟集群都有自己的访问控制和资源配额。

项目是 Rancher 引入的一个概念，是由一个或多个命名空间构成的集合。您可以将多个命名空间作为一个组进行管理，并在其中执行 Kubernetes 操作。您可以使用项目来支持租户权限管理，例如设置团队可以访问集群中的某个项目，但不能访问同一集群中的其他项目。

集群、项目和命名空间之间的关系如下：

- 集群包含项目
- 项目包含命名空间

一个集群中可以有多个项目，一个项目中可以有多个命名空间。

您可以使用项目进行租户隔离，例如设置团队可以访问集群中的某个项目，但不能访问同一集群中的其他项目。

在原生的 Kubernetes 中，诸如基于角色的访问权限或集群资源之类的功能只能在命名空间级别进行配置。个人或团队需要同时访问多个命名空间时，项目可以使您节省时间。

**详情请参考[项目和命名空间](/docs/rancher2/cluster-admin/projects-and-namespaces/_index)。**

## 创建集群

### 将现有集群导入 Rancher

Rancher v2.4.x 支持编辑导入的 K3s 集群，您可以在 Rancher UI 中编辑集群来升级 Kubernetes 的功能。

管理导入的集群时，Rancher 将连接到一个已经设置好的 Kubernetes 集群，设置 Rancher Agent 与集群通信，不负责提供 Kubernetes。

Rancher 的集群管理基于角色的访问控制策略，策略管理和工作负载等功能在导入集群中可用。请注意，Rancher 中不能配置或扩展导入的集群。

对于除 K3s 集群外的所有导入的 Kubernetes 集群，必须在 Rancher 外部编辑集群的配置，您需要自己在集群中修改 Kubernetes 组件的参数、升级 Kubernetes 版本以及添加或删除节点。

**详情请参考[项目和命名空间](/docs/rancher2/cluster-provisioning/imported-clusters/_index)。**

### 在自定义节点上启动集群

当您创建自定义集群时，Rancher 使用 RKE（Rancher Kubernetes Engine）在本地裸金属服务器、本地虚拟机或云提供商托管的任何节点中创建 Kubernetes 集群。

要使用此选项，您需要访问将要在 Kubernetes 集群中使用的服务器。根据[要求](/docs/rancher2/cluster-provisioning/node-requirements/_index)配置每个服务器，其中包括一些硬件规格和 Docker 版本等。在每台服务器上安装 Docker 后，运行 Rancher UI 中提供的命令，将每台服务器转换为 Kubernetes 节点。

**详情请参考[在自定义节点上启动集群](/docs/rancher2/cluster-provisioning/rke-clusters/custom-nodes/_index)。**

## 常见问题

### 卸载 Rancher

当您不再需要 Rancher，不想集群被 Rancher 管理或 Rancher Server 被删除时该怎么做的问题，在这里都有答案，**详情请参考[卸载 Rancher](/docs/rancher2/faq/removing-rancher/_index)**。

### 安装

在安装 Rancher 的过程中碰到了问题？[安装常见问题](/docs/rancher2/faq/install/_index)提供了以下几种常见问题和解决方法：

- Agent 无法连接 Rancher server
- 报错：ERROR: `https://rancher.my.org/ping` is not accessible (Could not resolve host: rancher.my.org)
- 创建 Kubernetes 集群，无法启动 ETCD 节点

### 技术问题

在使用 Rancher 管理员角色的过程中碰到了问题？[技术问题](/docs/rancher2/faq/technical/_index)提供了以下几种常见问题和解决方法：

- 如何重置系统管理员（admin）密码？
- 手抖删除或禁用了 admin 用户后，该如何修复？
- 如何开启 debug 调试日志？
- 在哪里管理节点模板？
- 为什么创建的 L4 负载均衡器一直处在`Pending`状态？
- Rancher 的状态数据存储在哪里？
- 为什么命名空间无法移动到其他项目？
- 为什么当一个节点故障时，一个 Pod 需要大于 5 分钟时间才能被重新调度？
- 如何查看服务器证书的`Common Name` 和 `Subject Alternative Names` ？
