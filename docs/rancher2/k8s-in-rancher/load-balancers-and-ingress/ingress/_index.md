---
title: 添加 Ingress
description: 集群内的服务（service）和 pod 仅有集群内互相访问的 IP 地址，只能实现集群内部之间的通信。Ingress 为集群内的所有服务提供了外网访问的入口，允许用户通过外网访问集群内的服务。Ingress 具有这些功能：提供服务外部访问的 URL、负载均衡、SSL 和提供基于主机和路径的路由。请参考下文，为您的工作负载添加 Ingress。
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
  - 负载均衡和Ingress
  - 添加 Ingress
---

集群内的服务（service）和 pod 仅有集群内互相访问的 IP 地址，只能实现集群内部之间的通信。Ingress 为集群内的所有服务提供了外网访问的入口，允许用户通过外网访问集群内的服务。Ingress 具有这些功能：提供服务外部访问的 URL、负载均衡、SSL 和提供基于主机和路径的路由。请参考下文，为您的工作负载添加 Ingress。

在项目中使用 Ingress 时，可以设置全局 DNS 条目，从而对外部 DNS 进行编程动态设置 Ingress。请参考[全局 DNS 条目](/docs/rancher2/helm-charts/globaldns/_index)。

1. 在**全局**视图中，打开要添加 Ingress 的项目。

1. 在主导航栏中单击“资源”。单击“负载均衡”标签。（在 v2.3.0 之前的版本中，只需单击“负载均衡”选项卡。）然后单击“添加 Ingress”。

1. 输入 Ingress 的**名称**。

1. 从下拉列表中选择一个现有的**命名空间**。

   > 如果您还没有命名空间，或您想将 Ingress 添加到新的命名空间，请单击**添加到新的命名空间**，参考[命名空间](/docs/rancher2/cluster-admin/projects-and-namespaces/_index)，创建新的命名空间。完成创建后，参考下文，添加 Ingress。

1. 创建 Ingress **转发规则**。

   - **自动生成 xip.io 主机名**

     此选项适合用于测试环境，而**非**生产环境。如果选择此选项，Ingress 会通过一个自动生成的 DNS 名称路由请求。Rancher 使用 [xip.io](http://xip.io/) 自动生成 DNS 名称。

     > **注意：**要使用此选项，您必须能够解析 `xip.io` 地址。

     1. 添加**目标后端**。默认情况下，一个工作负载会添加到 Ingress 中，您可以通过单击**服务**或**工作负载**来添加更多目标。

     1. **可选：**如果要在将请求发送到特定主机名路径时指定工作负载或服务，请为目标添加**路径**。例如，如果您希望将`www.mysite.com/contact-us`的请求发送到与`www.mysite.com`不同的服务，请在**路径**字段中输入`/contact-us`。您创建的第一个规则通常是不包含路径的。

     1. 从**目标**下拉列表中为已添加的每个目标选择工作负载或服务。

     1. 输入每个目标使用的**端口**号。

   - **指定要使用的主机名**

     如果使用此选项，Ingress 会根据这个主机名路由请求到您指定的服务或工作负载。

     1. 输入您的 Ingress 处理请求转发时用的主机名。例如，`www.mysite.com`.

     1. 添加**目标后端**。默认情况下，一个工作负载会添加到 Ingress 中，您可以通过单击**服务**或**工作负载**来添加更多目标。

     1. **可选：**如果要在将请求发送到特定主机名路径时指定工作负载或服务，请为目标添加**路径**。例如，如果您希望将`www.mysite.com/contact-us`的请求发送到与`www.mysite.com`不同的服务，请在**路径**字段中输入`/contact-us`。您创建的第一个规则通常是不包含路径的。

     1. 从**目标**下拉列表中为已添加的每个目标选择工作负载或服务。

     1. 输入每个目标使用的**端口**号。

   - **用作默认后端**

     使用此选项可以设置 Ingress 规则，以处理与任何其他 Ingress 规则都不匹配的请求。例如，使用此选项，来设置`404`页面。

     > **注意：**如果您使用 RKE 部署 Rancher，则已经配置了 404 和 202 的默认后端。

     1. 添加**目标后端**。单击**服务**或**工作负载**以添加目标。

     1. 从**目标**下拉列表中选择服务或工作负载。

1. **可选：**单击**添加规则**以创建其他 Ingress 规则。例如，在创建了包含路由请求的主机名的 Ingress 规则之后，您可能想要创建一个默认后端处理 404。

1. 如果您的任何 Ingress 规则需要处理加密端口的请求，请添加证书以加密/解密通信。

   > **注意：**您必须具有一个 SSL 证书，Ingress 可用它来加密/解密通信。有关更多信息，请参见[添加 SSL 证书](/docs/rancher2/k8s-in-rancher/certificates/_index)。

   1. 单击**添加证书**。

   1. 从下拉列表中选择一个**证书**。

   1. 输入使用加密通信的**主机**。

   1. **可选：**单击**添加主机**，添加使用证书的其他主机。

1. **可选：**添加[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)或[注释](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/)，为您的 Ingress 提供元数据。

   有关可用注释的列表，请参考 [Nginx Ingress Controller 文档](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/).

**结果：**完成 Ingress 的添加和 Ingress 转发规则的配置。您的 Ingress 已添加到项目中，Ingress 开始执行您配置的 Ingress 规则。
