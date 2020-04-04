---
title: '1、开始迁移'
---

通过安装 Rancher 并配置新的 Rancher 环境，来开始迁移到 Rancherv2.x。

## 安装 Rancher v2.x

从 v1.6 迁移到 v2.x 的第一步是将 Rancher v2.x Server 与 v1.6 Server 并排安装，因在迁移过程中需要使用旧的安装。由于 v1.6 和 v2.x 之间的体系结构更改，因此没有直接的升级途径。您必须独立安装 v2.x，然后将 v1.6 服务迁移到 v2.x。

v2.x 的新功能，与 Rancher Server 的所有通信均已加密。以下过程不仅指导您安装 Rancher，而且还将指导您创建和安装这些证书。

在安装 v2.x 之前，请提供一台或多台主机以用作 Rancher Server(s)。您可以在以下位置找到这些主机的要求[Server 要求](/docs/installation/requirements/_index)。

提供节点后， 开始安装 Rancher:

- [Docker 安装](/docs/installation/other-installation-methods/single-node-docker/_index)

对于开发环境，可以使用 Docker 将 Rancher 安装在单个节点上。此安装过程将单个 Rancher 容器部署到您的主机。

- [Kubernetes 安装](/docs/installation/k8s-install/_index)

对于用户需要不断访问集群的生产环境，我们推荐采用高可用 Kubernetes 集群安装的方式安装 Rancher。此安装过程将设置一个三节点集群，并使用 Helm chart 在每个节点上安装 Rancher。

> **重要区别:** 尽管您可以在每个节点上使用外部数据库和 Docker 命令以高可用 Kubernetes 配置来安装 Rancher v1.6，但 Kubernetes 安装中的 Rancher v2.x 需要现有的 Kubernetes 集群。查阅[Kubernetes 安装](/docs/installation/k8s-install/_index) 以满足所有要求。

## 配置身份验证

安装 Rancher v2.x Server 之后，我们建议配置外部身份验证（例如 Active Directory 或 GitHub），以便用户可以使用其单点登录 Rancher。有关已支持的身份验证提供程序的完整列表以及有关如何配置它们的说明， 查看[认证方式](/docs/admin-settings/authentication/_index)。

<figcaption>Rancher v2.x 中的认证</figcaption>

![Rancher v2.x 认证方式](/img/rancher/auth-providers.svg)

### 本地用户

尽管我们建议使用外部身份验证提供程序，但 Rancher v1.6 和 v2.x 都为 Rancher 本地用户提供支持。但是，这些用户无法从 Rancher v1.6 迁移到 v2.x。如果您在 Rancher v1.6 中使用了本地用户，并希望在 v2.x 中继续进行使用， 您会需要去[手动重新创建这些用户账号](/docs/admin-settings/authentication/_index)并为其分配访问权限。

最佳实践，您应该使用外部*和*本地身份验证的混合体。这种做法可在您的外部身份验证遇到中断时提供对 Rancher 的访问，因为您仍然可以使用本地用户帐户登录。设置一些本地帐户作为 Rancher 的管理用户。

### SAML 身份验证

在 Rancher v1.6 中，我们鼓励 SAML 用户使用 Shibboleth，因为它是我们提供的唯一 SAML 身份验证选项。但是，为了更好地对它们的微小差异进行支持，我们为 v2.x 添加了经过充分测试的 SAML 提供程序：Ping Identity，Microsoft ADFS 和 FreeIPA。

## 创建集群和项目

开始在 Rancher v2.x 的工作通过配置新的 Kubernetes 集群，类似于 v1.6 中的环境。该集群将托管您的应用程序部署。

在 Rancher v2.x 中结合在一起的集群和项目等效于 v1.6 环境。*集群*是计算边界（即您的主机），而*项目*是管理边界（即用于为用户分配访问权限的命名空间组）。

以下标题中提供了有关配置集群的更多基本信息，但有关完整信息， 查看[配置 Kubernetes 集群](/docs/cluster-provisioning/_index).

### 集群

在 Rancher v1.6 中，计算节点已添加到*环境*中。Rancher v2.x 避免使用*环境*来表示*集群*，因为 Kubernetes 将此术语用于一组计算机而不是*环境*。

Rancher v2.x 允许您在任何地方启动 Kubernetes 集群。使用以下方式纳管集群：

- 一个[托管的 Kubernetes 集群](/docs/cluster-provisioning/hosted-kubernetes-clusters/_index)。
- 一个[来自基础设施提供商的节点](/docs/cluster-provisioning/rke-clusters/node-pools/_index)。Rancher 在节点上启动 Kubernetes。
- 任何[自定义节点](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)。Rancher 可以在节点上启动 Kubernetes，无论是裸金属服务器，虚拟机还是不太流行的基础架构提供商上的云主机。

### 项目

此外，Rancher v2.x 引入了[项目](/docs/cluster-admin/projects-and-namespaces/_index)，该对象将集群分为不同的应用程序组，这对于应用用户权限很有用。集群和项目的这种模型允许多租户。因为主机归集群所有，并且可以将集群进一步划分为多个项目，用户可以在其中管理应用程序，而其他用户则不能。

当您创建一个集群时，将自动创建两个项目：

- `System` 项目，其中包含运行重要的 Kubernetes 资源的系统命名空间（例如 ingress 控制器和集群 dns 服务）
- `Default` 项目。

但是，对于生产环境， 我们推荐[创建自己的项目](/docs/project-admin/namespaces/_index) 并为其指定一个描述性名称。

在配置新的集群和项目之后，您可以授权用户访问和使用项目资源。与 Rancher v1.6 环境类似，Rancher v2.x 允许您[将用户分配给项目](/docs/project-admin/_index)。通过将用户分配给项目，您可以限制用户可以访问哪些应用程序和资源。

## 创建堆栈

在 Rancher v1.6 中，使用*堆栈*将属于您应用程序的服务分组在一起。在 v2.x 中，您需要去[创建命名空间](/docs/cluster-admin/projects-and-namespaces/_index)，出于相同的目的，它们相当于 v2.x 的堆栈。

在 Rancher v2.x 中，命名空间是项目的子对象。创建项目时，会向该项目添加一个`default`命名空间，但您可以创建自己的命名空间以与 v1.6 的堆栈并行。

在迁移过程中，如果您未明确定义服务应部署到的命名空间，则会将其部署到`default`命名空间。

与 v1.6 一样，Rancher v2.x 支持命名空间内和跨命名空间的服务发现 (我们很快将会了解到[服务发现](/docs/v1.6-migration/discover-services/_index))。

## [下一步: 迁移服务](/docs/v1.6-migration/run-migration-tool/_index)
