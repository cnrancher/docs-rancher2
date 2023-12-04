---
title: 使用说明
description: API 具有独立的用户界面，您可从 Web 浏览器访问它。这是查看资源、执行操作以及查看等效 cURL 或 HTTP 请求和响应的最简便方法。要访问它，请单击右上角用户头像，在API & Keys 下，您可以找到 API 访问地址，并且可以创建API KEY。
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
  - API
  - 使用说明
  - API指南
  - API参考
---

## 如何使用 API

API 具有独立的用户界面，您可从 Web 浏览器访问它。这是查看资源、执行操作以及查看等效 cURL 或 HTTP 请求和响应的最简便方法。要访问它，请单击右上角用户头像，在 **API & Keys** 下，您可以找到 API 访问地址，并且可以创建[API KEY](/docs/rancher2.5/user-settings/api-keys/_index)。

## 认证

API 请求必须包含身份验证信息。身份验证是通过使用带有[API KEY](/docs/rancher2.5/user-settings/api-keys/_index)的 HTTP 的基本验证（Basic Auth）完成的。API KEY 可以创建新的集群，并可以通过`/v3/clusters/`访问多个集群。可以将[集群和项目角色](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/_index)绑定到这些 KEY 上，从而限制用户可以看到哪些集群和项目，以及它们可以执行哪些操作。

默认情况下，一些集群级别的 API KEY 是永不过期的，因为他们使用`ttl=0`生成。如不再需要这些 API KEY，可以删除这些 KEY 使其失效，有关操作说明请阅读[API Token 页面](/docs/rancher2.5/api/api-tokens/_index)。

## 发送请求

该 API 通常是 RESTful 的，但是还具有多种功能。这些功能可以使客户端能够发现所有内容，因此可以编写通用客户端，而不必为每种类型的资源编写特定的代码。有关通用 API 规范的详细信息，请参见[API 规范](https://github.com/rancher/api-spec/blob/master/specification.md)。

- 每种类型都有一个 Schema，这个 Schema 描述了以下内容：

  - 用于获取此类资源集合的 URL。
  - 资源可以具有的每个字段及其类型，基本验证规则（例如，是必填字段还是可选字段）。
  - 对这种类型的资源可能进行的所有操作，包括其输入和输出（也作为 Schema。）
  - 允许过滤的每个字段。
  - 哪些 HTTP 方法可用于集合本身或集合中的单个资源。

- 因此，理论上讲，您可以仅加载 Schema 列表并了解有关 API 的所有信息。实际上，这就是 API UI 的工作方式，它不包含特定于 Rancher 本身的代码。获取 Schema 的 URL 将在每个 HTTP 响应中的`X-Api-Schemas`头里。从那里，您可以按照每个 Schema 上的`collection`链接来了解在何处列出资源，以及返回资源中的其他`links`以获取任何其他信息。

- 实际上，您可能只想构造 URL 字符串。我们强烈建议将其限制在顶层列出的集合（`/v3/<type>`）或获取特定资源（`/v3/<type>/<id>`）。除此之外的任何内容都可能在将来的版本中发生更改。

- 资源之间相互之间有联系，称为链接。每个资源都包含一个`links`映射，其中包含链接名称和用于检索该信息的 URL。同样，您应该 `GET` 资源，然后使用`links`映射中的 URL，而不是自己构造这些字符串。

- 大多数资源都有操作，这些操作可以执行某些操作或更改资源的状态。要使用这些功能，请将 HTTP `POST` 请求发送到您想要的操作的`actions`映射中的 URL。有些操作需要输入或会产生输出，有关每种信息，请参阅每种类型的单独文档或 Schema。

- 要编辑资源，请将 HTTP `PUT` 请求发送到资源上的`links.update`链接，在请求中中包含您要更改的字段。如果缺少链接，则您无权更新资源。未知字段和不可编辑的字段将被忽略。

- 要删除资源，请将 HTTP `DELETE` 请求发送到资源上的`links.remove`链接。如果缺少链接，则您无权删除资源。

- 要创建新资源，请在 Schema 中的集合 URL（为`/v3/<type>`）上发送 HTTP `POST`请求。

## 过滤

可以使用 HTTP 查询参数，在服务器端过滤大多数集合。过滤器映射向您显示可以过滤哪些字段，以及相应的过滤值。API 用户界面具有用于设置过滤条件并向您显示适当请求的控件。对于简单的“等于”匹配，它只是`field = value`。您也可以将修饰符添加到字段名称中，例如 field_gt = 42 表示“field 大于 42”。有关完整详细信息，请参见[API 规范](https://github.com/rancher/api-spec/blob/master/specification.md#filtering)。

## 排序

大多数集合可以使用 HTTP 查询参数，在服务器端根据某些参数进行排序。`sortLinks`映射显示了可用的排序种类以及 URL，可以根据这些 URL 对集合进行排序。它还包括有关当前响应排序的信息（如果已指定）。

## 分页

默认情况下，API 响应的页面分页限制为每页 100 个资源。可以通过`limit`查询参数进行更改，最多可以设置为`1000`，例如：`/v3/pods?limit=1000`。集合响应中的分页映射告诉您是否拥有完整的查询结果，如果没有完整结果，则提供下一页的链接。

## 捕获 Rancher 的 API 调用

你可以使用浏览器的开发者工具来捕捉 Rancher API 的调用方式。例如，你可以按照以下步骤，使用 Chrome 浏览器的开发者工具来获取配置 RKE 集群的 API 调用：

1. 在 Rancher UI 中，进入**集群管理**，点击**创建**。
1. 点击其中一个集群类型。本例使用 Digital Ocean。
1. 在表格中填入集群名称和节点模板，但不要点击**创建**。
1. 你将需要在集群创建之前打开开发者工具，以看到正在记录的 API 调用。要打开这些工具，在 Rancher UI 上点击右键，然后点击**Inspect.**。
1. 在开发者工具中，点击**网络**标签。
1. 在**网络**标签上，确保**Fetch/XHR**被选中。
1. 在 Rancher UI 中，点击**创建**。在开发者工具中，你应该看到一个新的网络请求，名称为`cluster?_replace=true`。
1. 右键单击 `cluster?_replace=true` 并单击**复制>复制为 cURL.**。
1. 将结果粘贴到任何文本编辑器中。你将能够看到 POST 请求，包括它被发送到的 URL，所有的 headers，以及请求的完整正文。这个命令可以用来从命令行创建一个集群。注意：该请求应该保存在一个安全的地方，因为它包含证书。
