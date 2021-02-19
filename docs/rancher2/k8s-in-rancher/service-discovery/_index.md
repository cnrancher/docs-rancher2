---
title: 服务发现
description: 对于创建的每个工作负载，都会创建一个相应的服务发现。此服务发现使用以下命名约定为工作负载的容器启用 DNS 解析`<workload>.<namespace>.svc.cluster.local`。您还可以创建其他服务发现。您可以使用这些 DNS 记录，让用户可以通过 DNS 解析到一个或多个外部 IP 地址，外部主机名，另一个 DNS 记录的别名，其他工作负载或一组与您创建的选择器匹配的 Pod。
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
  - 用户指南
  - 服务发现
---

对于创建的每个工作负载，都会创建一个相应的服务发现。此服务发现使用以下命名约定为工作负载的容器启用 DNS 解析：
`<workload>.<namespace>.svc.cluster.local`。

您还可以创建其他服务发现。您可以使用这些 DNS 记录，让用户可以通过 DNS 解析到一个或多个外部 IP 地址，外部主机名，另一个 DNS 记录的别名，其他工作负载或一组与您创建的选择器匹配的 Pod。

1. 从**全局**视图中，打开要添加 DNS 记录的项目。

1. 在主导航栏中单击**资源**。单击**服务发现**标签。（在 v2.3.0 之前的版本中，只需单击**服务发现**选项卡。）然后单击**添加记录**。

1. 输入 DNS 记录的**名称**。此名称用于 DNS 解析。

1. 从下拉列表中选择一个**命名空间**。或者您可以通过单击**添加到新命名空间**来动态创建新命名空间。

1. 选择一个**解析为**选项，以将请求路由到 DNS 记录。

   1. **一个或多个外部 IP 地址**

      在**目标 IP 地址**字段中输入 IP 地址。通过单击**添加 目标 IP**添加更多 IP 地址。

   1. **外部主机名**

      输入**目标主机名**。

   1. **另一个 DNS 记录值的别名**

      单击**添加目标记录**，然后从**值**下拉列表中选择另一个 DNS 记录。

   1. **一个或多个工作负载**

      单击 **添加目标工作负载** 然后从**值**下拉列表中选择另一个工作量.

   1. **与选择器匹配的 Pods**

   输入的键值对[标签选择器](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors)为与您的参数匹配的所有 Pod 创建记录。

1. 单击 **创建**

**结果：** 创建了一个新的 DNS 记录。

- 您可以通过项目的**服务发现**选项卡查看记录。
- 您可以通过 `<recordname>.<namespace>.svc.cluster.local` 来使用新创建的 DNS 记录，它将按照您的配置进行解析。

## 相关链接

- [使用 HostAliases 参数将记录添加到 Pod 中的 /etc/hosts](https://kubernetes.io/docs/concepts/services-networking/add-entries-to-pod-etc-hosts-with-host-aliases/)
