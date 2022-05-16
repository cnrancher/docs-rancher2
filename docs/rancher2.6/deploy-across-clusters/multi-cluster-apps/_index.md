---
title: 多集群应用
weight: 2
---

> Rancher v2.5 开始已弃用多集群应用。我们现在建议使用 [Fleet]({{<baseurl>}}/rancher/v2.6/en/deploy-across-clusters/fleet) 来跨集群部署应用。

通常，大多数应用都部署在单个 Kubernetes 集群上，但有时你可能需要跨不同集群和/或项目部署同一应用的多个副本。在 Rancher 中，_多集群应用_ 指的是使用 Helm Chart 跨多个集群部署的应用。由于能够跨多个集群部署相同的应用，因此可以避免在每个集群上重复执行相同的应用配置操作而引入的人为错误。使用多集群应用，你可以通过自定义在所有项目/集群中使用相同的配置，并根据你的目标项目更改配置。由于多集群应用被视为单个应用，因此更容易管理和维护。

全局应用商店中的任何 Helm Chart 都可用于部署和管理多集群应用。

创建多集群应用后，你可以对全局 DNS 条目进行编程，以便更轻松地访问应用。

- [前提](#prerequisites)
- [启动多集群应用](#launching-a-multi-cluster-app)
- [多集群应用配置选项](#multi-cluster-app-configuration-options)
   - [目标](#targets)
   - [升级](#upgrades)
   - [角色](#roles)
- [应用配置选项](#application-configuration-options)
   - [使用 questions.yml 文件](#using-a-questions-yml-file)
   - [原生 Helm Chart 的键值对](#key-value-pairs-for-native-helm-charts)
   - [成员](#members)
   - [覆盖特定项目的应用配置选项](#overriding-application-configuration-options-for-specific-projects)
- [升级多集群应用角色和项目](#upgrading-multi-cluster-app-roles-and-projects)
- [多集群应用管理](#multi-cluster-application-management)
- [删除多集群应用](#deleting-a-multi-cluster-application)

## 前提

### 权限

要在 Rancher 中创建多集群应用，你至少需要具有以下权限之一：

- 目标集群中的[项目成员角色]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#project-roles)，能够创建、读取、更新和删除工作负载
- 目标项目所在集群的[集群所有者角色]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#cluster-roles)

### 启用旧版功能

由于 Rancher 2.5 已弃用多集群应用并使用 Fleet 取代它，你需要使用功能开关以启用多集群应用。

1. 在左上角，单击 **☰ > 全局设置**。
1. 单击**功能开关**。
1. 转到`旧版应用 `功能开关并单击**激活**。

## 启动多集群应用

1. 在左上角，单击**☰ > 多集群应用**。
1. 点击**启动**。
1. 找到要启动的应用。
1. （可选）查看来自 Helm Chart `README` 的详细描述。
1. 在**配置选项**下输入多集群应用的**名称**。默认情况下，此名称还用于在每个[目标项目](#targets)中为多集群应用创建一个 Kubernetes 命名空间。命名空间命名为 `<MULTI-CLUSTER_APPLICATION_NAME>-<PROJECT_ID>`。
1. 选择一个**模板版本**。
1. 完成[多集群应用配置选项](#multi-cluster-app-configuration-options)以及[应用配置选项](#application-configuration-options)。
1. 选择可以[与多集群应用交互](#members)的**成员**。
1. 添加[自定义应用配置答案](#overriding-application-configuration-options-for-specific-projects)，这将更改默认应用配置答案中特定项目的配置。
1. 查看**预览**中的文件。确认后，单击**启动**。

**结果**：应用已部署到所选的命名空间。你可以从项目中查看应用状态。

## 多集群应用配置选项

Rancher 将多集群应用的配置选项分为以下几个部分。

### 目标

在**目标**部分中，选择用于部署应用的项目。项目列表仅显示你有权访问的项目。所选的每个项目都会被添加到列表中，其中显示了所选的集群名称和项目名称。要移除目标项目，单击 **-**。

### 升级

在**升级**部分中，选择升级应用时需要使用的升级策略。

* **滚动更新（批量）**：选择此升级策略时，每次升级的应用数量取决于选择的**批量大小**和**间隔**（多少秒后才开始下一批更新）。

* **同时升级所有应用**：选择此升级策略时，所有项目的所有应用都将同时升级。

### 角色

在**角色**中，你可以定义多集群应用的角色。通常，当用户[启动商店应用]({{<baseurl>}}/rancher/v2.6/en/helm-charts)时，该用户的权限会用于创建应用所需的所有工作负载/资源。

多集群应用由 _系统用户_ 部署，系统用户还被指定为所有底层资源的创建者。由于实际用户可以从某个目标项目中删除，因此使用 _系统用户_ 而不是实际用户。如果实际用户从其中一个项目中删除，则该用户将不再能够管理其他项目的应用。

Rancher 允许你选择**项目**或**集群**的角色选项。Rancher 将允许你根据用户的权限使用其中一个角色进行创建。

- **项目** - 相当于[项目成员]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#project-roles)。如果你选择此角色，Rancher 将检查用户是否在所有目标项目中至少具有[项目成员]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#project-roles)的角色。虽然用户可能没有被明确授予 _项目成员_ 角色，但如果用户是[管理员]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)、[集群所有者]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#cluster-roles)或[项目所有者]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#project-roles)，则认为该用户具有所需的权限级别。

- **集群** - 相当于[集群所有者]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#cluster-roles)。如果你选择此角色，Rancher 将检查用户是否在所有目标项目中至少具有[集群所有者]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/cluster-project-roles/#project-roles)的角色。虽然用户可能没有被明确授予 _集群所有者_ 角色，但如果用户是[管理员]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)，则认为该用户具有所需的权限级别。

在启动应用时，Rancher 会在启动应用之前确认你在目标项目中是否拥有这些权限。

> **注意**：某些应用（如 _Grafana_ 或 _Datadog_）需要访问特定集群级别的资源。这些应用将需要 _集群_ 角色。如果你之后发现应用需要集群角色，则可以升级多集群应用以更新角色。

## 应用配置选项

对于每个 Helm Chart，你需要输入一个必须的答案列表才能成功部署 Chart。由于 Rancher 会将答案作为 `--set` 标志传递给 Helm，因此你必须按照[使用 Helm：–set 的格式和限制](https://helm.sh/docs/intro/using_helm/#the-format-and-limitations-of---set)中的语法规则来格式化这些答案。

> 例如，当输入的答案包含用逗号分隔的两个值（即 `abc, bcd`）时，你需要用双引号将值括起来（即 ``"abc, bcd" ``）。

### 使用 questions.yml 文件

如果你部署的 Helm Chart 包含 `questions.yml` 文件，Rancher UI 会将此文件转换成易于使用的 UI 来收集问题的答案。

### 原生 Helm Chart 的键值对

对于原生 Helm Chart（即来自 **Helm Stable** 或 **Helm Incubator** 应用商店或自定义 Helm Chart 仓库的 Chart），答案会在 **Answers** 中以键值对的形式提供。这些答案能覆盖默认值。

### 成员

默认情况下，多集群应用只能由应用的创建者管理。你可以在**成员**中添加其他用户，以便这些用户管理或查看多集群应用。

1. 在**成员**搜索框中键入成员的名称，查找要添加的用户。

2. 为该成员选择**访问类型**。多集群项目有三种访问类型，请仔细阅读并了解这些访问类型的含义，以了解多集群应用权限的启用方式。

   - **所有者**：此访问类型可以管理多集群应用的任何配置，包括模板版本、[多集群应用配置选项](#多集群应用配置选项)，[应用配置选项](#application-configuration-options)，可以与多集群应用交互的成员，以及[自定义应用配置答案](#overriding-application-configuration-options-for-specific-projects)。由于多集群应用的创建使用与用户不同的权限集，因此多集群应用的任何 _所有者_ 都可以管理/删除[目标项目](#targets)中的应用，而不需要显式授权访问这些项目。请仅为受信任的用户配置此访问类型。

   - **成员**：此访问类型只能修改模板版本、[应用配置选项](#application-configuration-options)和[自定义应用配置答案](#overriding-application-configuration-options-for-specific-projects)。由于多集群应用的创建使用与用户不同的权限集，因此多集群应用的任何 _成员_ 都可以修改应用，而不需要显式授权访问这些项目。请仅为受信任的用户配置此访问类型。

   - **只读**：此访问类型不能修改多集群应用的任何配置选项。用户只能查看这些应用。

   > **注意**：请确保仅为受信任的用户授予 _所有者_ 或 _成员_ 访问权限，因为这些用户即使无法直接访问项目，也将自动能够管理为此多集群应用创建的应用。

### 覆盖特定项目的应用配置选项

多集群应用的主要优势之一，是能够在多个集群/项目中使用相同配置部署相同的应用。在某些情况下，你可能需要为某个特定项目使用稍微不同的配置选项，但你依然希望统一管理该应用与其他匹配的应用。此时，你可以为该项目覆盖特定的[应用配置选项](#application-configuration-options)，而不需要创建全新的应用。

1. 在**答案覆盖**中，单击**添加覆盖**。

2. 对于每个覆盖，你可以选择以下内容：

   - **范围**：在配置选项中选择要覆盖哪些目标项目的答案。

   - **问题**：选择要覆盖的问题。

   - **答案**：输入要使用的答案。

## 升级多集群应用角色和项目

- **在现有的多集群应用上更改角色**
   多集群应用的创建者和任何具有“所有者”访问类型的用户都可以升级其**角色**。添加新角色时，我们会检查用户在所有当前目标项目中是否具有该角色。Rancher 会根据 `Roles` 字段的安装部分，相应地检查用户是否具有全局管理员、集群所有者或项目所有者的角色。

- **添加/删除目标项目**
1. 多集群应用的创建者和任何具有“所有者”访问类型的用户都添加或移除目标项目。添加新项目时，我们检查此请求的调用者是否具有多集群应用中定义的所有角色。Rancher 会检查用户是否具有全局管理员、集群所有者和项目所有者的角色。
2. 删除目标项目时，我们不会进行这些成员资格检查。这是因为调用者的权限可能与目标项目有关，或者由于该项目已被删除导致调用者希望将该项目从目标列表中删除。


## 多集群应用管理

与同一类型的多个单独应用相比，使用多集群应用的好处之一是易于管理。你可以克隆、升级或回滚多集群应用。

> **先决条件**：`旧版应用`功能开关已启用。

1. 在左上角，单击**☰ > 多集群应用**。

2. 选择要对其执行操作的多集群应用，然后单击 **⋮**。选择以下选项之一：

   * **克隆**：创建另一个具有相同配置的多集群应用。通过使用此选项，你可以轻松复制多集群应用。
   * **升级**：升级多集群应用以更改某些配置。在为多集群应用执行升级时，如果你有合适的[访问类型](#members)，则可以修改[升级策略](#upgrades)。
   * **回滚**：将你的应用回滚到特定版本。如果你的一个或多个[目标](#targets)的多集群应用在升级后出现问题，你可以使用 Rancher 存储的多达 10 个多集群应用版本进行回滚。回滚多集群应用会恢复**所有**目标集群和项目的应用，而不仅仅是受升级问题影响的目标。

## 删除多集群应用

> **先决条件**：`旧版应用`功能开关已启用。

1. 在左上角，单击**☰ > 多集群应用**。

2. 选择要删除的多集群应用，然后单击**⋮ > 删除**。删除多集群应用会删除所有目标项目中的所有应用和命名空间。

   > **注意**：不能独立删除在目标项目中为多集群应用创建的应用。只有删除多集群应用后才能删除这些应用。
