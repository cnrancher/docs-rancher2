---
title: OPA Gatekeeper
weight: 16
---

为了确保一致性和合规性，每个组织都需要能够以自动化的方式在环境中定义和执行策略。[OPA（Open Policy Agent）](https://www.openpolicyagent.org/) 是一个策略引擎，用于基于策略控制云原生环境。Rancher 支持在 Kubernetes 集群中启用 OPA Gatekeeper，并且还安装了一些内置的策略定义（也称为约束模板）。

OPA 提供了一种高级声明性语言，可以让你将策略指定为代码，还能扩展简单的 API，从而减轻策略决策的负担。

[OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper) 是一个提供 OPA 和 Kubernetes 集成的项目。OPA Gatekeeper 提供：

- 一个可扩展的参数化策略库。
- 用于实例化策略库的原生 Kubernetes CRD，也称为“约束”。
- 用于扩展策略库的原生 Kubernetes CRD，也称为“约束模板”。
- 审计功能。

要了解更多关于 OPA 的信息，请参阅[官方文档](https://www.openpolicyagent.org/docs/latest/)。

## OPA Gatekeeper 集成的工作原理

Kubernetes 支持通过准入控制器（准入控制器）webhook 来扩展 API Server 的功能，创建、更新或删除资源时都会调用这些 webhook。Gatekeeper 作为验证 webhook 安装，并执行由 Kubernetes CRD（Custom Resource Definition）定义的策略。除了使用准入控制之外，Gatekeeper 还能审计 Kubernetes 集群中的现有资源，并对违反当前策略的情况进行标记。

OPA Gatekeeper 由 Rancher 的 Helm system Chart 提供，它安装在名为 `gatekeeper-system` 的命名空间中。

## 在集群中启用 OPA Gatekeeper

> Rancher 2.5 改进了 OPA Gatekeeper 应用。无法从 Rancher 2.4 升级到 Rancher 2.5 中的新版本。如果你在 Rancher 2.4 中安装了 OPA Gatekeeper，则需要在旧 UI 中卸载 OPA Gatekeeper 及其 CRD，然后在 Rancher 2.5 中重新安装它。如需卸载 CRD，请在 kubectl 控制台中运行 `kubectl delete crd configs.config.gatekeeper.sh constrainttemplates.templates.gatekeeper.sh` 命令。

> **先决条件**：只有管理员和集群所有者才能启用 OPA Gatekeeper。

你可以在**应用 & 应用市场**页面安装 OPA Gatekeeper Helm Chart。

### 启用 OPA Gatekeeper

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面中，转到要启用 OPA Gatekeeper 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，点击**应用 & 应用市场**。
1. 点击 **Charts** 并点击 **OPA Gatekeeper**。
1. 单击**安装**。

**结果**：已将 OPA Gatekeeper 部署到你的 Kubernetes 集群。

## 约束模板

[约束模板](https://github.com/open-policy-agent/gatekeeper#constraint-templates)是 Kubernetes 自定义资源，用于定义要由 Gatekeeper 应用的 OPA 策略的架构和 Rego 逻辑。有关 Rego 策略语言的更多信息，请参阅[官方文档](https://www.openpolicyagent.org/docs/latest/policy-language/)。

启用 OPA Gatekeeper 后，Rancher 默认会安装一些模板。

要列出集群中安装的约束模板，请转到 OPA Gatekeeper 下的左侧菜单，然后单击**模板**。

Rancher 还支持通过导入 YAML 定义来创建你自己的约束模板。

## 创建和配置约束

[约束](https://github.com/open-policy-agent/gatekeeper#constraints)是 Kubernetes 自定义资源，用于定义要应用约束模板的对象范围。约束模板和约束共同定义一个完整的策略。

> **先决条件**：集群中已启用 OPA Gatekeeper。

要列出已安装的约束，请转到 OPA Gatekeeper 下的左侧菜单，然后单击**约束**。

可以从约束模板创建新的约束。

Rancher 支持通过使用方便的表单来创建约束，你可以在该表单中输入各种约束字段。

**以 YAML 文件编辑**选项也可以用于配置约束的 YAML 定义。

### 使 Rancher 的 System 命名空间不受约束

创建约束时，请确保该约束不应用于任何 Rancher 或 Kubernetes System 命名空间。如果不排除 System 命名空间，则可能会出现 system 命名空间下的许多资源被标记为违反约束。

要让约束仅限制用户命名空间，请在约束的**匹配**字段下指定这些命名空间。

此外，该约束可能会干扰其他 Rancher 功能并拒绝部署系统工作负载。为避免这种情况，请从你的约束中排除所有 Rancher 特定的命名空间。

## 在集群中实施约束

如果**执行动作**为 **Deny**，约束会立即启用，并拒绝任何违反策略的请求。默认情况下，执行的值为 **Deny**。

如果**执行动作** 为 **Dryrun**，违反策略的资源仅会记录在约束的状态字段中。

要强制执行约束，请使用表单创建约束。在**执行动作**字段中，选择 **Deny**。

## 集群中的审计和违规

OPA Gatekeeper 运行定期审计，以检查现有资源是否违反强制执行的约束。你可以在安装 Gatekeeper 时配置审计间隔（默认 300 秒）。

Gatekeeper 页面上列出了违反已定义的约束的情况。

此外，你也可以在**约束**页面中找到违反约束的数量。

每个约束的详细信息视图列出了违反约束的资源的信息。

## 禁用 Gatekeeper

1. 导航到集群的仪表板视图。
1. 在左侧菜单中，展开集群菜单并单击 **OPA Gatekeeper**。
1. 单击 **⋮ > 禁用**。

**结果**：禁用 OPA Gatekeeper 后，所有约束模板和约束也将被删除。

