---
title: Rancher名词解释
description: 本文提供了使用 Rancher 过程中针对Rancher常见的名词和对应的解析。
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
  - 产品介绍
  - Rancher名词解释
---

本文提供了使用 Rancher 过程中针对 Rancher 常见的名词和对应的解析。

## 仪表盘

仪表盘会显示 Prometheus 收集到的监控数据。点击右边的 Grafana 图标，浏览器会打开一个新的页签，在 Grafana 里呈现这些监控数据。

![仪表盘](/img/rancher/dashboard.png)

#### CPU

- `已预留6中的2.4`：**6**为集群节点的 CPU 总和，**2.4**为集群中所有工作负载`spec.containers.resources.requests.cpu` 的总和。
- `已使用6中的0.2`：**6**为集群节点的 CPU 总和，**0.2**为集群中所有节点已使用 CPU 的总和。

#### Memory

- `已预留11.1GiB中的1.5`：**11.1GiB**为集群节点的 memory 总和，**1.5**为集群中所有工作负载`spec.containers.resources.requests.memory` 的总和。
- `已使用11.1GiB中的2.3`：**11.1GiB**为集群节点的 memory 总和，**2.3**为集群中所有节点已使用 memory 的总和。

#### Pods

集群可以创建的最大 Pod 数量，单节点默认**110**个 pod，可以通过设置 kubelet 的`max-pods`来修改默认最大 Pod 数量。

## 项目

项目 是 Rancher 中的一个概念，能够帮助您管理 Kubernetes 集群中的命名空间，您可使用项目创建多租户集群，这种集群允许多个用户使用相同的底层资源创建应用，而应用之间不会相互影响。

更多详情，请参阅[项目管理](/docs/rancher2/project-admin/_index)文档。

## 多集群应用

通常，大多数应用都部署在单个 Kubernetes 集群上，但是有时您可能希望跨不同的集群和/或项目部署同一个应用的多个副本。在 Rancher 中多集群应用使用 Helm Chart ，并可以跨多个集群部署应用。因为能够跨多个集群部署相同的应用，因此可以避免在对每个集群上重复执行相同的操作期间引入的人为错误。使用多集群应用，您可以确保应用在所有项目/集群中具有相同的配置，并能够根据目标项目来覆盖不同的参数。由于多集群应用被视为单个应用，因此易于管理和维护。

更多详情，请参阅[多集群应用](/docs/rancher2/helm-charts/legacy-catalogs/multi-cluster-apps/_index)文档。

## 应用商店

Rancher 提供了基于 Helm 的应用商店的功能，该功能使部署和管理相同的应用变得更加容易。

- **应用商店**可以是 GitHub 代码库或 Helm Chart 库，其中包含了可部署的应用。应用打包在称为 **Helm Chart** 的对象中。
- **Helm Charts** 是描述一组相关 Kubernetes 资源的文件的集合。单个 Chart 可能用于部署简单的内容（例如 Mencached Pod）或复杂的内容（例如带有 HTTP 服务，数据库，缓存等的完整的 Web 应用）。

Rancher 改进了 Helm 应用商店和 Chart。所有原生 Helm Chart 都可以在 Rancher 中使用，但是 Rancher 添加了一些增强功能以改善用户体验。

更多详情，请参阅[应用商店](/docs/rancher2/helm-charts/legacy-catalogs/_index)文档。

## Rancher Server URL

第一次登录 Rancher 后，Rancher 将提示您输入一个**Rancher Server URL**。您应该将 URL 设置为 Rancher Server 的主入口点。当负载均衡器位于 Rancher Server 集群前面时，URL 应该设置为负载均衡地址。系统会自动尝试从运行 Rancher Server 的主机的 IP 地址或主机名推断 Rancher Server 的 URL，但只有在运行单节点的 Rancher Server 时，上述推断才会正确。因此，在大多数情况下，您需要自己将 Rancher Server URL 设置为正确的值。

更多详情，请参阅[配置 Rancher Server URL](/docs/rancher2/admin-settings/_index/#配置-rancher-server-url)文档。

## Rke 模板

RKE 的全称是[Rancher Kubernetes Engine](/docs/rke/_index)，它是 Rancher 用来创建 Kubernetes 集群的工具。RKE 集群模板制定了 DevOps 和安全团队的标准，简化了 Kubernetes 集群的创建过程。

多集群管理面临着如何强制实施安全策略和附加配置的挑战，在将集群移交给最终用户之前，管理员需要标准化这些配置。RKE 集群模板提供了标准化集群配置的方式。无论是使用 Rancher UI、Rancher API 还是自动化流程创建的集群，Rancher 都将保证从 RKE 集群模板创建的每个集群在生成方式上是一致的。

更多详情，请参阅[RKE 模板](/docs/rancher2/admin-settings/rke-templates/_index)文档。

## CIS 扫描

Rancher 充分利用了[kube-bench](https://github.com/aquasecurity/kube-bench)来对 Kubernetes 集群进行安全扫描。Rancher 会检查 Kubernetes 集群是否遵循了 CIS (Center for Internet Security，互联网安全中心) Kubernetes Benchmark 中定义的最佳实践。

CIS Kubernetes Benchmark 是一个可以用来给 Kubernetes 创建安全基准的参考文档。

互联网安全中心（CIS）是一个`501(c)(3)`非营利组织，成立于 2000 年 10 月，其使命是“通过识别，开发，验证，推广和维护最佳实践解决方案来防御网络攻击，并建立和引导社区打造安全可信的网络环境”。

CIS 基准测试是安全配置目标系统的最佳实践。CIS 基准是通过领域专家，技术供应商，公共和私人社区成员以及 CIS 基准开发团队的不懈努力而制定的。

基准提供两种类型的建议：计分和不记分。我们仅运行与“计分建议”相关的测试。

当 Rancher 对一个集群进行 CIS 安全扫描时，它会生成一个展示每个测试结果的报告。报告中包括`通过`，`跳过`和`失败`的测试数量的汇总。报告中同时也给`失败`的测试提供了补救办法。

更多详情，请参阅[安全扫描](/docs/rancher2/security/security-scan/_index)文档。

## 工具

### OPA Gatekeeper

_自 v2.4.0 起可用_

> 这是 Rancher v2.4 版本的实验性功能。

为了确保一致性和合规性，每个组织都需要具有在其环境中定义和执行策略的能力。[OPA](https://www.openpolicyagent.org/)（Open Policy Agent）是一种策略引擎，可对云原生环境进行基于策略的控制。Rancher 提供了在 Kubernetes 集群中启用 OPA Gatekeeper 的功能，并且还安装了一些内置策略定义，也称为约束模板。

OPA 提供了一种声明性语言，您可以使用代码来定义策略，并具有扩展简单 API 的能力以减轻策略决策的负担。

[OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper) 是一个支持 OPA 与 Kubernetes 集成的项目。OPA Gatekeeper 提供：

- 可扩展的参数化策略库。
- 用于实例化策略库的原生 Kubernetes CRD，也称为“约束”。
- 原生 Kubernetes CRD，用于扩展策略库，也称为“约束模板”。
- 审核功能。

更多详情，请参阅[OPA Gatekeeper](/docs/rancher2/cluster-admin/tools/opa-gatekeeper/_index)文档。

### 流水线

使用 Rancher，您可以与 GitHub 等版本控制系统集成，以设置持续集成（CI）流水线。

配置 Rancher 和 GitHub 等版本控制系统后，Rancher 将部署运行 Jenkins 的容器以自动化执行流水线：

- 构建镜像
- 验证镜像
- 部署镜像到集群
- 执行单元测试
- 执行回归测试

更多详情，请参阅[流水线](/docs/rancher2/k8s-in-rancher/pipelines/_index)文档。

### 告警

为了保证集群和应用程序的健康，提高组织的生产力，您需要随时了解集群和项目里计划内和计划外发生的事件。发生事件时，将触发您的告警，并向您发送通知。然后，您可以根据需要采取应对措施。

通知和告警功能是基于 [Prometheus Alertmanager](https://prometheus.io/docs/alerting/alertmanager/) 的。利用这些工具，Rancher 可以通知[集群所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)和[项目所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)有需要处理的告警。

在接收告警之前，必须在 Rancher 中配置一个或多个通知接收者。

创建集群时，Rancher 已经配置了一些内置的告警规则。为它们配置[接收者](/docs/rancher2/monitoring-alerting/2.0-2.4/notifiers/_index)后就能收到相应告警。

更多详情，请参阅[告警](/docs/rancher2/monitoring-alerting/2.0-2.4/cluster-alerts/_index)文档。

### 日志

日志服务很有用，因为它使您能够：

- 捕获并分析集群的状态
- 在您的环境中发现趋势
- 将日志保存到集群之外的安全位置
- 随时了解容器崩溃，Pod 驱逐或节点死亡等事件
- 更轻松地调试和排除故障

Rancher 支持与以下日志收集目标服务集成：

- Elasticsearch
- Splunk
- Kafka
- Syslog
- Fluentd

关于更多集群日志详情，请参阅[集群日志](/docs/rancher2/logging/2.0.x-2.4.x/project-logging/_index)文档，项目日志请参阅[项目日志](/docs/rancher2/project-admin/tools/logging/_index)文档

### 监控

通过 Rancher 您可以使用先进的开源监控解决方案[Prometheus](https://prometheus.io/)来监控集群节点，Kubernetes 组件和软件部署的状态和过程。

关于更多集群监控详情，请参阅[集群监控](/docs/rancher2/cluster-admin/tools/monitoring/_index)文档，项目监控请参阅[项目监控](/docs/rancher2/project-admin/tools/monitoring/_index)文档

### 通知

通知服务是通知您告警事件的服务。您可以配置通知服务，以将告警通知发送给最适合采取措施的人员。

Rancher 集成了多种通知服务，包括：

- **Slack**： 将告警通知发送到您的 Slack 频道。
- **Email**： 选择电子邮件收件人以接收告警通知。
- **PagerDuty**： 通过电话，短信或个人电子邮件将告警发送给员工。
- **WebHooks**： 将告警发送到 Webhook 服务器。
- **WeChat**： 向您的企业微信联系人发送告警通知。

更多详情，请参阅[通知](/docs/rancher2/monitoring-alerting/2.0-2.4/notifiers/_index)文档。
