---
title: RKE 模板和基础设施
description: 在 Rancher 中，RKE 模板用于提供 Kubernetes 和定义 Rancher 设置，而节点模板用于配置节点。因此，即使启用了 RKE 模板强制，最终用户在创建 Rancher 集群时仍然可以灵活地选择底层硬件。RKE 模板的最终用户仍然可以选择基础设施提供商和他们想要使用的节点。如果要标准化集群中的硬件，请将 RKE 模板与节点模板或服务器配置工具(如 Terraform)结合使用。
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
  - 系统管理员指南
  - RKE模板
  - RKE 模板和基础设施
---

在 Rancher 中，RKE 模板用于提供 Kubernetes 和定义 Rancher 设置，而节点模板用于配置节点。

因此，即使启用了 RKE 模板强制，最终用户在创建 Rancher 集群时仍然可以灵活地选择底层硬件。RKE 模板的最终用户仍然可以选择基础设施提供商和他们想要使用的节点。

如果要标准化集群中的硬件，请将 RKE 模板与节点模板或服务器配置工具(如 Terraform)结合使用。

## 节点模板

[节点模板](/docs/rancher2/user-settings/node-templates/_index)负责 Rancher 中的节点配置和节点设置。从用户配置文件中，可以设置节点模板以定义在每个节点池中使用的模板。启用节点池后，可以确保每个节点池中都有所需数量的节点，并确保池中的所有节点都相同。

## Terraform

Terraform 是一个服务器配置工具。它使用基础设施作为代码，允许您使用 Terraform 配置文件创建基础设施的几乎每个方面。它可以自动执行服务器配置过程，这种方式是自文档化的，并且在版本控制中易于跟踪。

本节重点介绍如何将 Terraform 与 [Rancher 2 Terraform Provider](https://www.terraform.io/docs/providers/rancher2/)一起使用，这是标准化 Kubernetes 集群硬件的推荐选项。如果使用 Rancher Terraform Provider 创建基础设施，然后使用 RKE 模板在该基础设施上创建 Kubernetes 集群，则可以快速创建一个全面的、可用于生产的集群。

Terraform 允许您:

- 将几乎任何类型的基础设施定义为代码，包括服务器、数据库、负载均衡器、监控、防火墙设置和 SSL 证书
- 利用应用商店应用和多集群应用
- 跨多个平台（包括 Rancher 和主要云提供商）对基础设施进行编码
- 将基础设施作为代码提交到版本控制工具中
- 轻松重复配置和设置基础设施
- 将基础设施更改纳入标准开发实践
- 防止由于配置漂移，导致其中一些服务器的配置与其他服务器不同

## Terraform 是如何工作的？

Terraform 是用扩展名为`.tf`的文件编写的。它是用 HashiCorp 配置语言编写的，HashiCorp 配置语言是一种声明性语言，允许您在集群中定义所需的基础设施、正在使用的云供应商以及供应商的凭据。然后 Terraform 向供应商发出 API 调用，以便有效地创建基础设施。

要使用 Terraform 创建 Rancher 配置的集群，请转到 Terraform 配置文件并将供应商定义为 Rancher 2。您可以使用 Rancher API 密钥设置 Rancher 2 Provider。注意：API 密钥具有与其关联的用户相同的权限和访问级别。

然后 Terraform 调用 Rancher API 来创建基础设施，Rancher 调用基础设施供应商。例如，如果您想使用 Rancher 在 AWS 上提供基础设施，您可以在 Terraform 配置文件或环境变量中提供 Rancher API 密钥和 AWS 凭据，以便它们可以用于创建基础设施。

当需要更改基础设施时，您可以在 Terraform 配置文件中进行更改，而不是手动更新服务器。然后，可以将这些文件提交到版本控制、验证，并根据需要进行审阅。然后当您运行`terraform apply`时，将部署更改。

## 使用 Terraform 的技巧

- 请参阅[Terraform Rancher 2 Provider 文档](https://www.terraform.io/docs/providers/rancher2/)

- 在 Terraform 设置中，可以使用 Docker Machine 节点驱动程序安装 Docker Machine。

- 也可以在 Terraform Provider 中修改 auth。

- 您可以通过更改 Rancher 中的设置来反向工程如何在 Terraform 中定义设置，然后返回并检查 Terraform 状态文件以查看其如何映射到基础设施的当前状态。

- 如果您想在一个地方管理 Kubernetes 集群设置、Rancher 设置和硬件设置，请使用[Terraform 模块](https://github.com/rancher/terraform-modules)。您可以将集群配置的 YAML 文件或 RKE 模板配置文件传递给 Terraform 模块，以便 Terraform 模块创建它。在这种情况下，可以将基础设施当作代码来管理，从而可以管理 Kubernetes 集群及其底层硬件的版本和修订历史。

## 创建符合 CIS 基准的集群的技巧

本节描述了一种方法，可以使安全合规的配置文件为集群的标准配置文件。

创建 [符合 CIS 基准的集群时](/docs/rancher2/security/_index)，有一个加密配置文件和一个审计日志配置文件。
您的基础设施配置系统可以将这些文件写入磁盘。然后在 RKE 模板中，指定这些文件的位置，然后将加密配置文件和审计日志配置文件作为额外的挂载添加到`kube-api-server`。

然后确保 RKE 模板中的`kube-api-server`标志使用符合 CIS 的配置文件。

通过这种方式，可以创建符合 CIS 基准的配置参数。

## 资源

- [Terraform 文档](https://www.terraform.io/docs/)
- [Rancher2 Terraform Provider 文档](https://www.terraform.io/docs/providers/rancher2/)
- [RanchCast - 第 1 集：Rancher 2 Terraform Provider](https://youtu.be/YNCq-prI8-8)：在本演示中，社区主管 Jason van Brackel 使用 Rancher 2 Terraform Provider 创建了节点并创建自定义集群。
