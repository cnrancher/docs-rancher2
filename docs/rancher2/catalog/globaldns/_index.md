---
title: 全局 DNS
description: Rancher 的全局 DNS 功能提供了一种对外部 DNS 提供商进行编程的方法，以将流量路由到您的 Kubernetes 应用程序。由于 DNS 编程支持跨不同 Kubernetes 集群的应用程序，因此需要在全局级别配置全局 DNS。一个应用程序可以变得高度可用，因为它允许您在不同的 Kubernetes 集群上运行同一个应用程序。如果您的 Kubernetes 集群中有一个集群发生了故障，该应用程序仍可以正常对外提供服务。
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
  - 应用商店
  - 全局 DNS
---

_自 v2.2.0 起可用_

Rancher 的全局 DNS 功能提供了一种对外部 DNS 提供商进行编程的方法，以将流量路由到您的 Kubernetes 应用程序。由于 DNS 编程支持跨不同 Kubernetes 集群的应用程序，因此需要在全局级别配置全局 DNS。一个应用程序可以变得高度可用，因为它允许您在不同的 Kubernetes 集群上运行同一个应用程序。如果您的 Kubernetes 集群中有一个集群发生了故障，该应用程序仍可以正常对外提供服务。

> **注意：** 全局 DNS 仅在启用了 [local](/docs/rancher2/installation/options/chart-options/_index) 集群的[高可用安装](/docs/rancher2/installation/k8s-install/_index)中可用。

## 全局 DNS 提供商

在添加全局 DNS 服务之前，您将需要配置对外部 DNS 提供商的访问。

下表列出了每个提供商首次发布的 Rancher 版本。

| DNS 提供商                                           | 可用版本 |
| ---------------------------------------------------- | -------- |
| [AWS Route53](https://aws.amazon.com/route53/)       | v2.2.0   |
| [CloudFlare](https://www.cloudflare.com/dns/)        | v2.2.0   |
| [阿里 DNS](https://www.alibabacloud.com/product/dns) | v2.2.0   |

## 全局 DNS 服务

要将流量路由到的每个应用程序，您需要创建一个全局 DNS 服务。此服务将使用来自全局 DNS 提供商的域名（也称为 FQDN）来定位应用程序。这些应用程序可以为一个[多集群应用](/docs/rancher2/catalog/multi-cluster-apps/_index)或指定的一个或多个项目中的应用。您必须向 Ingress [添加特定的注释](#添加特定的注释)，以将流量正确路由到应用程序。没有此注释，DNS 服务的自动编程将无法进行。

## 全局 DNS 提供商/服务的权限

默认情况下，只有[系统管理员](/docs/rancher2/admin-settings/rbac/global-permissions/_index)和全局 DNS 提供商或全局 DNS 服务的创建者有权使用，编辑和删除它们。创建 DNS 提供者或 DNS 服务时，创建者可以添加其他用户，以便这些用户访问和管理他们。默认情况下，这些成员将具有`所有者`角色来管理它们。

## 为应用程序设置全局 DNS

### 添加全局 DNS 提供商

1. 在**全局**视图中，选择**工具 > 全局 DNS 提供商**。
1. 要添加提供商，请从可用的提供商选项中进行选择，并为全局 DNS 提供商配置必要的凭据和域名。
1. （可选）添加其他用户，以便这些用户在创建全局 DNS 服务时可以使用该 DNS 提供商，以及管理全局 DNS 提供商。

   - Route53

     1. 输入提供商的**名称**。
     1. （可选）输入 AWS Route53 上托管区域的**根域名**。如果未提供此选项，则 Rancher 的该全局 DNS 提供商在 AWS 密钥可以访问的所有托管区域内工作。
     1. 输入 AWS **访问密钥**。
     1. 输入 AWS **Secret Key**。
     1. 在**成员访问权限**下，搜索您希望能够使用此提供商的任何用户。通过添加此用户，他们还将能够管理全局 DNS 提供商服务。
     1. 单击**创建**。

   - CloudFlare

     1. 输入提供商的**名称**。
     1. 输入**根域名**，此字段是可选的，如果未提供，则 Rancher 的该全局 DNS 提供商将在密钥可以访问的所有域名中工作。
     1. 输入 CloudFlare **API 电子邮件**。
     1. 输入 CloudFlare **API 密钥**。
     1. 在**成员访问权限**下，搜索您希望能够使用此提供商的任何用户。通过添加此用户，他们还将能够管理全局 DNS 提供商服务。
     1. 单击**创建**。

   - 阿里 DNS

     1. 输入提供商的**名称**。
     1. 输入**根域名**，此字段是可选的，如果未提供，则 Rancher 的该全局 DNS 提供商将在密钥可以访问的所有域名中工作。
     1. 输入**访问密钥**。
     1. 输入**密钥**。
     1. 在**成员访问权限**下，搜索您希望能够使用此提供商的任何用户。通过添加此用户，他们还将能够管理全局 DNS 提供商服务。
     1. 单击**创建**。

        > **注意：**
        >
        > - 阿里云 SDK 使用 TZ 数据。它必须存在于运行 [local](/docs/rancher2/installation/options/chart-options/_index) 集群的节点的`/usr/share/zoneinfo`路径中，并挂载到外部 DNS 容器。如果 TZ 数据在节点上不可用，请按照[说明](https://www.ietf.org/timezones/tzdb-2018f/tz-link.html)进行准备。
        > - 不同类型的阿里 DNS 具有不同的允许 TTL 范围，其中全局 DNS 服务的默认 TTL 可能无效。在添加 阿里 DNS 服务之前，请参阅[参考](https://www.alibabacloud.com/help/doc-detail/34338.htm)。

### 添加全局 DNS 服务

1. 在**全局**视图中，选择**工具 > 全局 DNS 服务**。
1. 点击**添加 DNS 记录**。
1. 输入要在外部 DNS 上编程的 **FQDN**。
1. 从列表中选择一个全局 DNS **提供商**。
1. 选择此 DNS 服务是用于[多集群应用](/docs/rancher2/catalog/multi-cluster-apps/_index)还是用于不同[项目](/docs/rancher2/cluster-admin/projects-and-namespaces/_index)。您必须向目标应用程序的 Ingress 中[添加特定的注释](#添加特定的注释)。
1. 以秒为单位配置**DNS TTL**值。默认情况下为 300 秒。
1. 在**成员访问**下，搜索您希望能够管理此全局 DNS 服务的所有用户。

## 添加特定的注释

为了对全局 DNS 服务进行编程，您需要在多集群应用或目标项目的 Ingress 上添加特定的注释来匹配这个全局 DNS 服务，并且此 Ingress 需要使用特定的**主机名**。

1. 对于要作为全局 DNS 服务目标的任何应用程序，请找到与该应用程序关联的 Ingress。
1. 为了对 DNS 进行编程，必须满足以下要求：
   - 必须在 Ingress 路由规则中的使用与全局 DNS 服务的 FQDN 匹配的`主机名`。
   - Ingress 必须具有注释（`rancher.io/globalDNS.hostname`），并且此注释的值应与全局 DNS 服务的 FQDN 相同。
1. 一旦您的[多集群应用](/docs/rancher2/catalog/multi-cluster-apps/_index)或目标项目中的 Ingress 处于`Active`状态，Rancher 将对这个 FDQN 进行编程，自动在外部 DNS 上配置好 Ingress 的 IP 地址。

## 编辑全局 DNS 提供商

[系统管理员](/docs/rancher2/admin-settings/rbac/global-permissions/_index)，全局 DNS 提供商的创建者，以及作为`成员`添加到全局 DNS 提供商的任何用户，都对该资源有**所有者**访问权限。任何成员都可以编辑以下字段：

- 根域名
- 访问密钥和密钥
- 成员

1. 在**全局**视图中，选择**工具 > 全局 DNS 提供商**。

1. 对于要编辑的全局 DNS 提供商，单击**垂直省略号（...）> 编辑**。

## 编辑全局 DNS 服务

[系统管理员](/docs/rancher2/admin-settings/rbac/global-permissions/_index)，全局 DNS 服务的创建者，以及作为`成员`添加到全局 DNS 服务的任何用户，都具有对该资源有**所有者**访问权限。任何成员都可以编辑以下字段：

- FQDN
- 全局 DNS 提供商
- 目标项目或多集群应用
- DNS TTL
- 成员

任何可以访问**全局 DNS 服务**的用户都**只**可以添加他们有权访问的项目作为目标。但是，用户可以删除任何目标项目，因为 Rancher 不会检查确认该用户是否有权访问目标项目。

放宽权限检查，让用户可以删除任何目标项目，是为了支持用户在删除目标项目之前，可能已更改其权限的情况。另一个用例可能是在从全局 DNS 服务的目标项目中删除目标项目之前，已经将这个项目从集群中删除了。

1. 在**全局**视图中，选择**工具 > 全局 DNS 服务**。

1. 对于要编辑的全局 DNS 服务，单击**垂直省略号（...）>编辑**。
