---
title: 部署项目级别应用
---

在项目层级内部署应用商店应用时，显示的可用应用列表是由[商店作用范围](/docs/catalog/_index)决定的。

如果您的应用使用 Ingress，则可以通过设置[全局 DNS](/docs/catalog/globaldns/_index) 将主机名编程到外部 DNS。

## 先决条件

要在 Rancher2.x 中部署项目级别应用，必须满足以下一个权限：

- 目标集群的[项目成员角色](/docs/admin-settings/rbac/cluster-project-roles/_index)，使您能够创建，读取，更新和删除工作负载
- 目标集群的[集群所有者角色](/docs/admin-settings/rbac/cluster-project-roles/_index)

## 从应用商店中创建应用

启用[内置全局商店](/docs/catalog/built-in/_index)或[添加自定义商店](/docs/catalog/adding-catalogs/_index)之后，可以开始部署商店的应用。

1. 从**全局**视图中，导航到要开始部署应用的项目。

2. 从主导航栏中，选择**应用商店**。在 v2.2.0 之前的版本中，在主导航栏上选择**应用商店**。点击**启动**。

3. 找到您要启动的应用，然后单击**查看详细信息**。

4. (可选)查看详细说明，该说明来自 Helm 应用的**README**。

5. 在**配置选项**下，输入**名称**。默认情况下，该名称还用于为应用创建 Kubernetes 命名空间。

   - 如果您想更改**命名空间**，请单击**自定义**并更改命名空间的名称。
   - 如果要使用已经存在的其他命名空间，请单击 **自定义**，然后单击**使用现有的命名空间**。从列表中选择一个命名空间。

6. 选择一个**模板版本**。

7. 完成其余的**配置选项**。Rancher 会根据自定义应用是否包含 questions.yml 文件来处理配置选项。

8. 可以在**预览**部分中查看 Chart 中到 YAML 文件。如果确认，请单击**启动**。

**结果：** 您的应用已部署到所选的命名空间。您可以从项目的以下位置查看应用状态：

- **资源 > 工作负载**
- **应用商店 > 应用列表**

#### 配置选项

对于每个 Helm Chart，输入答案时，必须遵守[使用 Helm：--set 的格式和限制](https://helm.sh/docs/intro/using_helm/#the-format-and-limitations-of-set)，因为 Rancher 将其作为`--set`标志传递给 Helm。

> 例如，当输入包含两个用逗号分隔的值(即`abc, bcd`)的答案时，要求用双引号将这些值引起来(即`"abc，bcd"`)。

### 通过 UI 配置参数

#### 使用`questions.yml`文件

如果您要部署的 Helm 应用包含了一个`questions.yml`文件，则 Rancher UI 将转换该文件，并允许用户以表单的形式来填写答案。

#### 原生 Helm Chart 的键值对

对于原生的 Helm Chart(即，来自**Helm Stable**或**Helm Incubator**的应用或没有配置`questions.yml`文件的[自定义的应用商店](/docs/catalog/adding-catalogs/_index)，答案在“答案”部分中需要通过键值对的方式进行配置。这些答案用于覆盖应用的默认值。

### 通过 YAML 配置参数

_自 v2.1.0 起可用_

如果您不想使用表单输入答案，则可以选择**编辑 YAML**选项。您可以通过 YAML 直接覆盖应用参数。

示例 YAML：

```yaml
outer:
  inner: value
servers:
  - port: 80
    host: example
```

#### 使用 YAML 文件

_自 v2.1.0 起可用_

您可以直接将 YAML 格式的内容粘贴到 YAML 编辑器中。通过使用 YAML 格式设置自定参数，您能够轻松的自定义更复杂的输入值（例如，多行，数组和 JSON 对象）。
