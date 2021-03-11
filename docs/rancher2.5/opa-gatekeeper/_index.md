---
title: OPA Gatekeeper
description: 为了确保一致性和合规性，每个组织都需要具有在其环境中定义和执行策略的能力。OPA（Open Policy Agent）是一种策略引擎，可对云原生环境进行基于策略的控制。Rancher 提供了在 Kubernetes 集群中启用 OPA Gatekeeper 的功能，并且还安装了一些内置策略定义，也称为约束模板。
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
  - OPA Gatekeeper
---

_自 v2.4.0 起可用_

为了确保一致性和合规性，每个组织都需要具有在其环境中定义和执行策略的能力。[OPA](https://www.openpolicyagent.org/)（Open Policy Agent）是一种策略引擎，可对云原生环境进行基于策略的控制。Rancher 提供了在 Kubernetes 集群中启用 OPA Gatekeeper 的功能，并且还安装了一些内置策略定义，也称为约束模板。

OPA 提供了一种声明性语言，您可以使用代码来定义策略，并具有扩展简单 API 的能力以减轻策略决策的负担。

[OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper) 是一个支持 OPA 与 Kubernetes 集成的项目。OPA Gatekeeper 提供：

- 可扩展的参数化策略库。
- 用于实例化策略库的原生 Kubernetes CRD，也称为“约束”。
- 原生 Kubernetes CRD，用于扩展策略库，也称为“约束模板”。
- 审核功能。

要了解有关 OPA 的更多信息，请参阅[官方文档](https://www.openpolicyagent.org/docs/latest/)。

## OPA Gatekeeper 集成的工作方式

Kubernetes 提供通过准入控制器（Admission Controller）Webhooks 扩展 API Server 功能的能力。在创建，更新或删除资源时，Kubernetes 就会调用这些 Webhooks。 Gatekeeper 被作为验证 Webhook，并执行 Kubernetes CRD 中定义的策略。除了使用准入控制外，Gatekeeper 还提供了审核 Kubernetes 集群中现有资源并标记当前违反策略的功能。

Rancher 的 Helm System Chart 里包含了 OPA Gatekeeper。启用后，它将被安装到`gatekeeper-system`命名空间中。

## 在集群中启用 OPA Gatekeeper

> **先决条件：**
>
> - 只有系统管理员和集群所有者才能启用 OPA Gatekeeper。
> - 需要通过`dashboard`功能开关启用仪表板。有关更多信息，请参阅[启用实验性功能](/docs/rancher2.5/installation_new/resources/feature-flags/_index)的部分。

1. 导航到集群的**仪表板**视图。
1. 在左侧菜单上，展开集群菜单，然后单击**OPA Gatekeeper**。
1. 要使用默认配置安装 Gatekeeper，请单击**启用具有默认设置的 Gatekeeper（v0.1.0）**。
1. 要更改任何默认配置，请单击**自定义 Gatekeeper yaml 配置**。

## 约束模板

[约束模板](https://github.com/open-policy-agent/gatekeeper#constraint-templates) 是 Kubernetes CRD，用于定义 Gatekeeper 将实施的 OPA 策略的结构和 Rego 逻辑。有关 Rego 策略语言的更多信息，请参阅[官方文档](https://www.openpolicyagent.org/docs/latest/policy-language/)。

启用 OPA Gatekeeper 后，Rancher 会默认安装一些模板。

要列出集群中安装的约束模板，请转到 OPA Gatekeeper 下的左侧菜单，然后单击**模版**。

Rancher 还支持通过导入 YAML 文件的方式来创建自己的约束模板。

## 创建和配置约束

[约束](https://github.com/open-policy-agent/gatekeeper#constraints)是 Kubernetes CRD，用于定义在什么范围内实施特定约束模板。完整的策略由约束模板和约束共同定义。

> **先决条件：** 必须在集群中启用 OPA Gatekeeper。

要列出已安装的约束，请转到 OPA Gatekeeper 下的左侧菜单，然后单击**约束**。

可以从约束模板创建新约束。

Rancher 提供了通过表单的形式创建约束的能力，该形式使您可以输入各种约束字段。（在 2.4.2 中，两个默认的约束模版需要数组类型的参数，由于仪表盘目前不支持数组的参数，所以请使用 YAML 使用 Rancher 的两个默认约束模版）。

还可以使用**编辑 YAML** 选项来配置约束的 YAML 定义。

### 确保 Rancher 的系统命名空间不受约束

创建约束后，请确保它不适用于任何 Rancher 或 Kubernetes 系统命名空间。如果不排除系统命名空间，则可能会看到其下的许多资源都被标记为违反了约束。

要仅将约束的范围限制为用户命名空间，请始终在约束的**匹配**字段下指定这些命名空间。

同样，该约束可能会干扰其他 Rancher 功能并阻止系统工作负载的部署。为了避免这种情况，请从约束中排除所有 Rancher 专用的命名空间。

## 在集群中实施约束

当**强制执行措施**为**拒绝**时，该约束将立即启用，并将拒绝任何违反已定义策略的请求。默认情况下，强制值为**拒绝**。

当**强制执行措施**为**试运行**时，则任何违反策略的资源都将仅记录在约束的状态字段下。

要强制执行约束，请使用表单创建约束。在**强制执行措施**字段中，选择**拒绝**。

## 集群中的审核和违规

OPA Gatekeeper 会定期对集群进行审核，以检查是否有任何现有资源违反任何强制约束。启用 Gatekeeper 时可以配置`audit-interval`（默认值为 300s）。

在 Gatekeeper 页面上，列出了所有违反约束的情况。

同样在**约束**下，可以找到违反约束的次数。

每个约束的详细信息视图列出了有关违反约束的资源的信息。

## 禁用 OPA Gatekeeper

1. 导航到集群的仪表板视图
1. 在左侧菜单上，展开集群菜单，然后单击**OPA Gatekeeper**。
1. 单击 **省略号 > 禁用**。

**结果：** 禁用 OPA Gatekeeper 后，所有约束模板和约束也将被删除。
