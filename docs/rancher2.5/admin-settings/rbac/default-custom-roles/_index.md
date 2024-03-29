---
title: 自定义角色
description: 在 Rancher 中，角色决定了用户可以在集群或项目中执行哪些操作。请注意，角色与访问权限不同，后者决定了您可以访问哪些集群和项目。
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
  - 系统管理员指南
  - 基于角色的访问控制
  - 自定义角色
---

在 Rancher 中，**角色**决定了用户可以在集群或项目中执行哪些操作。

请注意，**角色**与**访问权限**不同，后者决定了您可以访问哪些集群和项目。

> 自定义角色有可能启用权限升级。详情请见[本节。](#特权升级)

本节包括以下主题。

- [先决条件](#先决条件)
- [为集群或项目创建自定义角色](#为集群或项目创建自定义角色)
- [创建自定义全局角色](#创建自定义全局角色)
- [删除自定义全局角色](#删除自定义全局角色)
- [分配自定义全局角色](#分配自定义全局角色)
- [特权升级](#特权升级)

## 先决条件

要完成此页面上的操作时，需要以下权限之一：

- [系统管理员权限](/docs/rancher2.5/admin-settings/rbac/global-permissions/_index)。
- 分配了 [Manage Roles](/docs/rancher2.5/admin-settings/rbac/global-permissions/_index) 角色的[自定义全局权限](/docs/rancher2.5/admin-settings/rbac/global-permissions/_index)。

## 为集群或项目创建自定义角色

Rancher 提供了一组开箱即用的默认用户角色，您也可以创建默认的自定义角色，以向 Rancher 中的用户提供指定的权限。

添加自定义角色的步骤因 Rancher 的版本而异。

#### 在 Rancher v2.0.7 或之后 的版本中

1. 在**全局**视图中，从主菜单中选择 **安全>角色**。

2. 选择一个选项卡以确定要添加的角色的范围。选项卡是：

   - **集群：** 仅在添加/管理集群成员时，可以分配该角色。
   - **项目：** 仅在添加/管理项目成员时，可以分配该角色。

3. 单击**添加集群/项目角色**。

4. 输入角色的**名称**。

5. 可选：选择**集群/项目创建者默认角色**选项，以在用户创建新集群或项目时将此角色分配给用户。使用此功能，可以扩展或限制集群/项目创建者的默认角色。

   > 开箱即用，**集群创建者默认角色**和**项目创建者默认角色**分别是**集群所有者**和**项目所有者**。

6. 使用**资源授权**选项将单个[Kubernetes API 资源](https://kubernetes.io/docs/reference/)分配给角色。

   > 查看与 Rancher 创建的默认角色相关的资源时，如果在一行上有多个 Kubernetes API 资源，则该资源将带有**(Custom)**标识。这些不是自定义资源，仅表示把多个 Kubernetes API 资源作为一种资源。

   > 资源文本字段提供了一种方法，用于搜索预定义的 Kubernetes API 资源，或为授予输入自定义资源名称。在该字段中输入资源名称后，必须从下拉菜单中选择预定义或`（自定义）`资源。

   您还可以给每个资源设置单独的 cURL 方法(**Create**，**Delete**，**Get**等)。

7. 使用**角色继承**选项将单个 Rancher 角色分配给您的自定义角色。注意：当有自定义角色从父角色继承时，只有删除子角色才能删除父角色。

8. 单击**创建**。

#### 在 Rancher v2.0.7 之前的版本中

1. 在**全局**视图中，从主菜单中选择**安全>角色**。

2. 单击**添加角色**。

3. 输入角色的**名称**。

4. 选择是否将角色设置为[已锁定](/docs/rancher2.5/admin-settings/rbac/locked-roles/_index)。

   > **注意：** 无法将锁定角色分配给用户。

5. 在**上下文**下拉菜单中，选择分配给用户的角色范围。上下文是：

   - **全部：** 不论上下文如何，用户都可以分配这些角色。在向集群或项目中添加/管理成员时，可以分配该角色。

   - **集群：** 仅在添加/管理集群成员时，可以分配该角色。

   - **项目：** 仅在添加/管理项目成员时，可以分配该角色。

6. 使用**资源授权**选项将单个 [Kubernetes API 资源](https://kubernetes.io/docs/reference/)分配给角色。

   > 查看与 Rancher 创建的默认角色相关的资源时，如果在一行上有多个 Kubernetes API 资源，则该资源将带有**(Custom)**标识。这些不是自定义资源，仅表示把多个 Kubernetes API 资源作为一种资源。

   > 资源文本字段提供了一种方法，用于搜索预定义的 Kubernetes API 资源，或为授予输入自定义资源名称。在该字段中输入资源名称后，必须从下拉菜单中选择预定义或`（自定义）`资源。

   您还可以给每个资源设置单独的 cURL 方法(**Create**，**Delete**，**Get**等)。

7. 使用**角色继承**选项将单个 Rancher 角色分配给您的自定义角色。注意：当有自定义角色从父角色继承时，只有删除子角色才能删除父角色。

8. 单击**创建**。

## 创建自定义全局角色

_自 v2.4.0 起可用_

### 克隆其他角色创建自定义全局角色

如果您有一组需要在 Rancher 中具有相同访问级别的人员，则可以节省时间来创建自定义全局角色，该角色将来自另一个角色（例如管理员角色）的所有规则，这些规则将被复制到一个新角色中。这使您可以仅配置现有角色和新角色之间的不同的地方。

然后，可以将自定义全局角色分配给用户或组，用户首次登录 Rancher 时，这个自定义全局角色就会生效。

要基于现有角色创建自定义全局角色，

1. 转到**全局**视图，然后单击**安全 > 角色**。
2. 在**全局**选项卡上，转到自定义全局角色想要复制的角色。单击**省略号(...)>克隆**。
3. 输入角色名称。
4. 可选：如果要将这个角色设置为新用户的默认角色，请转到**新用户默认角色**部分，然后单击**是: 新用户的默认角色**。
5. 在**资源授权**部分中，选择该自定义角色包含的 Kubernetes 资源操作权限。
   > 资源文本字段提供了一种方法，用于搜索预定义的 Kubernetes API 资源，或为授予输入自定义资源名称。在该字段中输入资源名称后，必须从下拉菜单中选择预定义或`（自定义）`资源。
6. 单击**保存**。

### 创建全新的自定义全局角色

自定义全局角色不必基于现有角色。要从头创建自定义全局角色，请执行以下步骤：

1. 转到**全局**视图，然后单击**安全 > 角色**。
2. 在**全局**选项卡上，单击**添加全局角色**。
3. 输入角色名称。
4. 可选：如果要将这个角色设置为新用户的默认角色，请转到**新用户默认角色**部分，然后单击**是: 新用户的默认角色**。
5. 在**资源授权**部分中，选择该自定义角色包含的 Kubernetes 资源操作权限。
   > 资源文本字段提供了一种方法，用于搜索预定义的 Kubernetes API 资源，或为授予输入自定义资源名称。在该字段中输入资源名称后，必须从下拉菜单中选择预定义或`（自定义）`资源。
6. 单击**保存**。

## 删除自定义全局角色

_自 v2.4.0 起可用_

删除自定义全局角色时，具有此自定义角色的所有全局角色绑定（Global Role Bindings）都将被删除。

如果仅为用户分配一个自定义全局角色，并且删除了该角色，则该用户将失去对 Rancher 的访问权限。为了使用户重新获得访问权限，管理员需要编辑用户并应用新的全局权限。

可以删除自定义全局角色，但是不能删除内置的全局角色。

要删除自定义全局角色，

1. 转到**全局**视图，然后单击**安全 > 角色**。
2. 在**全局**选项卡上，转到应删除的自定义全局角色，然后单击**省略号(…)>删除**。
3. 单击**删除**。

## 分配自定义全局角色

_自 v2.4.0 起可用_

如果您有一组需要在 Rancher 中具有相同访问级别的人员，那么创建一个自定义全局角色可以节省您的时间。将角色分配给组后，组中的用户首次登录 Rancher 时就会具有相应的访问级别。

当组中的用户登录时，默认情况下，用户将获得内置的**标准用户**全局角色。用户还将获得分配给其组的权限。

如果将用户从外部身份验证系统的组中删除，用户将失去分配给该组的自定义全局角色的权限。用户将仍然拥有**标准用户**角色。

> **先决条件：** 您只能在以下情况下为组分配全局角色：
>
> - 您已经设置了[外部身份验证系统](/docs/rancher2.5/admin-settings/authentication/_index)。
> - 外部身份验证系统支持[用户组](/docs/rancher2.5/admin-settings/authentication/user-groups/_index)。
> - 您已经通过身份验证系统建立了至少一个用户组。

要将自定义全局角色分配给组，请按照下列步骤操作：

1. 从**全局**视图中，转到**安全 > 用户组**。
2. 单击**分配全局角色**。
3. 在**选择要添加的组**字段中，选择将被分配自定义全局角色的已经存在的组。
4. 在**自定义**部分中，选择将分配给该组的任何自定义全局角色。
5. 可选：在**全局权限**或**内置角色**部分中，选择组应具有的任何其他权限。
6. 单击**创建**。

**结果：** 自定义全局角色将在组中的用户登录到 Rancher 时生效。

## 特权升级

`Configure Catalogs` 的自定义权限很强大，应该谨慎使用。当管理员将 `Configure Catalogs` 权限分配给一个标准用户时，可能会导致权限升级，该用户可以给自己提供 Rancher 配置集群的管理权限。任何拥有此权限的人都应被视为等同于管理员。

`Manager Users` 角色授予创建、更新和删除任何用户的能力。这带来了权限升级的风险，因为即使是拥有此角色的非管理员用户也能创建、更新和删除管理员用户。管理员在分配这个角色时应该小心谨慎。
