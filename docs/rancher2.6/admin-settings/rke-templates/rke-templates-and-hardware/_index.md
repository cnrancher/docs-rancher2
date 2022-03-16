---
title: RKE 模板和基础设施
weight: 90
---

在 Rancher 中，RKE 模板用于配置 Kubernetes 和定义 Rancher 设置，而节点模板则用于配置节点。

因此，即使开启了 RKE 模板强制，最终用户在创建 Rancher 集群时仍然可以灵活选择底层硬件。RKE 模板的最终用户仍然可以选择基础设施提供商和他们想要使用的节点。

如果要标准化集群中的硬件，请将 RKE 模板与节点模板或服务器配置工具 (如 Terraform) 结合使用。

### 节点模板

[节点模板]({{<baseurl>}}/rancher/v2.6/en/user-settings/node-templates)负责 Rancher 中的节点配置和节点预配。你可以在用户配置文件中设置节点模板，从而定义在每个节点池中使用的模板。启用节点池后，可以确保每个节点池中都有所需数量的节点，并确保池中的所有节点都相同。

### Terraform

Terraform 是一个服务器配置工具。它使用基础架构即代码，支持使用 Terraform 配置文件创建几乎所有的基础设施。它可以自动执行服务器配置，这种方式是自文档化的，并且在版本控制中易于跟踪。

本节重点介绍如何将 Terraform 与 [Rancher 2 Terraform Provider](https://www.terraform.io/docs/providers/rancher2/) 一起使用，这是标准化 Kubernetes 集群硬件的推荐选项。如果你使用 Rancher Terraform Provider 来配置硬件，然后使用 RKE 模板在该硬件上配置 Kubernetes 集群，你可以快速创建一个全面的、可用于生产的集群。

Terraform 支持：

- 定义几乎任何类型的基础架构即代码，包括服务器、数据库、负载均衡器、监控、防火墙设置和 SSL 证书
- 使用应用商店应用和多集群应用
- 跨多个平台（包括 Rancher 和主要云提供商）对基础设施进行编码
- 将基础架构即代码提交到版本控制
- 轻松重复使用基础设施的配置和设置
- 将基础架构更改纳入标准开发实践
- 防止由于配置偏移，导致一些服务器的配置与其他服务器不同

## Terraform 工作原理

Terraform 是用扩展名为 `.tf` 的文件编写的。它是用 HashiCorp 配置语言编写的。HashiCorp 配置语言是一种声明性语言，支持定义集群中所需的基础设施、正在使用的云提供商以及提供商的凭证。然后 Terraform 向提供商发出 API 调用，以便有效地创建基础设施。

要使用 Terraform 创建 Rancher 配置的集群，请转到你的 Terraform 配置文件并将提供商定义为 Rancher 2。你可以使用 Rancher API 密钥设置你的 Rancher 2 提供商。请注意，API 密钥与其关联的用户具有相同的权限和访问级别。

然后 Terraform 会调用 Rancher API 来配置你的基础设施，而 Rancher 调用基础设施提供商。例如，如果你想使用 Rancher 在 AWS 上预配基础设施，你需要在 Terraform 配置文件或环境变量中提供 Rancher API 密钥和 AWS 凭证，以便它们用于预配基础设施。

如果你需要对基础设施进行更改，你可以在 Terraform 配置文件中进行更改，而不是手动更新服务器。然后，可以将这些文件提交给版本控制、验证，并根据需要进行检查。然后，当你运行 `terraform apply` 时，更改将会被部署。

## 使用 Terraform 的技巧

- [Rancher 2 提供商文档](https://www.terraform.io/docs/providers/rancher2/)提供了如何配置集群大部分的示例。

- 在 Terraform 设置中，你可以使用 Docker Machine 主机驱动来安装 Docker Machine。

- 可以在 Terraform Provider 中修改身份验证。

- 可以通过更改 Rancher 中的设置，来反向工程如何在 Terraform 中定义设置，然后返回并检查 Terraform 状态文件，以查看该文件如何映射到基础设施的当前状态。

- 如果你想在一个地方管理 Kubernetes 集群设置、Rancher 设置和硬件设置，请使用 [Terraform 模块](https://github.com/rancher/terraform-modules)。你可以将集群配置 YAML 文件或 RKE 模板配置文件传递给 Terraform 模块，以便 Terraform 模块创建它。在这种情况下，你可以使用基础架构即代码来管理 Kubernetes 集群及其底层硬件的版本控制和修订历史。

## 创建符合 CIS 基准的集群的技巧

本节描述了一种方法，可以使安全合规相关的配置文件成为集群的标准配置文件。

在你创建[符合 CIS 基准的集群]({{<baseurl>}}/rancher/v2.6/en/security/)时，你有一个加密配置文件和一个审计日志配置文件。

你的基础设施预配系统可以将这些文件写入磁盘。然后在你的 RKE 模板中，你需要指定这些文件的位置，然后将你的加密配置文件和审计日志配置文件作为额外的挂载添加到 `kube-api-server`。

然后，你需要确保 RKE 模板中的 `kube-api-server` 标志使用符合 CIS 的配置文件。

通过这种方式，你可以创建符合 CIS 基准的标志。

## 资源

- [Terraform 文档](https://www.terraform.io/docs/)
- [Rancher2 Terraform Provider 文档](https://www.terraform.io/docs/providers/rancher2/)
- [The RanchCast - 第 1 集：Rancher 2 Terraform Provider](https://youtu.be/YNCq-prI8-8)：在此演示中，社区主管 Jason van Brackel 使用 Rancher 2 Terraform Provider 创建了节点并创建自定义集群。
