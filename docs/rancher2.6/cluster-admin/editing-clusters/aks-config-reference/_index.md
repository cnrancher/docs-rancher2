---
shortTitle: AKS 集群配置
title: AKS 集群配置参考
weight: 4
---

## Rancher 2.6 变更

- 支持添加多个节点池
- 支持私有集群
- 启用自动缩放节点池
- 在云凭证中配置 AKS 权限

## 基于角色的访问控制

在 Rancher UI 中配置 AKS 集群时，无法禁用 RBAC。如果在 AKS 中为集群禁用了基于角色的访问控制，则无法在 Rancher 中注册或导入集群。

Rancher 可以使用与其他集群一样的方式为 AKS 集群配置成员角色。有关详细信息，请参阅[基于角色的访问控制]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac)。

## 云凭证

> 本节中的配置信息假设你已经为 Rancher 设置了服务主体。有关如何设置服务主体的分步说明，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/aks/#prerequisites-in-microsoft-azure)。

### 订阅 ID

要获取订阅 ID，请单击左侧导航栏中的 **All Services**。然后单击 **Subscriptions**。转到要与 Kubernetes 集群关联的订阅的名称，然后复制 **Subscription ID**。

### 客户端 ID

要获取客户端 ID，请转到 Azure 门户，然后单击 **Azure Active Directory**，单击 **App registrations**，然后单击服务主体的名称。客户端 ID 在 app registration 详细信息页面上列为 **Application (client) ID**。

### 客户端密码

在创建客户端密码值后，你无法再获取它的值。因此如果你还没有客户端密码值，则需要创建一个新的客户端密码。

要获取新的客户端密码，请转到 Azure 门户，然后单击 **Azure Active Directory**，单击 **App registrations**，然后单击服务主体的名称。

然后点击 **Certificates & secrets** 并点击 **New client secret**。单击 **Add**。然后复制新客户端密码的 **Value**。

### 环境

Microsoft 提供了多个[云](https://docs.microsoft.com/en-us/cli/azure/cloud?view=azure-cli-latest)来满足地区法律的要求：

- AzurePublicCloud
- AzureGermanCloud
- AzureChinaCloud
- AzureUSGovernmentCloud

## 账号访问

在本部分中，你需要选择现有的 Azure 云凭证或创建一个新凭证。

有关配置 Azure 云凭证的帮助，请参阅[本部分](#cloud-credentials)。

## 集群位置

配置集群和节点位置。有关 AKS 可用区的详细信息，请参阅 [AKS 文档](https://docs.microsoft.com/en-us/azure/aks/availability-zones)。

高可用性位置包括多个可用区。

## 集群选项

### Kubernetes 版本

可用的 Kubernetes 版本是从 Azure API 动态获取的。

### 集群资源组

资源组是一个容器，其中包含 Azure 解决方案的相关资源。资源组可以包括解决方案的所有资源，或者仅包括你希望作为一个组来管理的资源。你可以根据组织的需求来决定如何将资源分配给资源组。通常情况下，你可以将生命周期相同的资源添加到同一个资源组，以便轻松地将它们作为一个组来进行部署、更新和删除。

你可以使用现有资源组，也可以输入资源组的名称，然后系统将为你创建一个资源组。

使用包含现有 AKS 集群的资源组将会创建一个新资源组。Azure AKS 仅允许每个资源组对应一个 AKS 集群。

有关管理资源组的信息，请参阅 [Azure 文档](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal)。

### Linux 管理员用户名

用于创建到 Linux 节点的 SSH 连接的用户名。

AKS 节点的默认用户名是 `azureuser`。

### SSH 公钥

用于创建到 Linux 节点的 SSH 连接的密钥。

### 标签

如果你的组织使用标签来管理多个 Azure 服务的资源，那么集群标签则非常有用。这些标签不适用于集群内的资源。

## 网络选项

### 负载均衡器 SKU

Azure 负载均衡器支持 standard 和 basic SKU（stock keeping units）。

有关 standard 负载均衡器和 basic 负载均衡器的对比，请参阅官方 [Azure 文档](https://docs.microsoft.com/en-us/azure/load-balancer/skus#skus)。Microsoft 建议使用 standard 负载均衡器。

如果你选择了一个或多个可用区，或者你有多个节点池，则需要 Standard 负载均衡器。

### 网络策略

默认情况下，AKS 集群中的所有 Pod 都可以无限制地发送和接收流量。为了提高安全性，你可以定义控制流量的规则。Kubernetes 中的网络策略功能允许你定义集群中 pod 之间的入口和出口流量规则。

Azure 提供了两种实现网络策略的方法。创建 AKS 集群时会选择网络策略选项。创建集群后无法更改策略选项：

- Azure 自己的实现，称为 Azure 网络策略。Azure 网络策略需要 Azure CNI。
- Calico Network Policies，一个由 [Tigera](https://www.tigera.io/) 创立的开源网络和网络安全解决方案。

你也可以选择不使用网络策略。

有关 Azure 和 Calico 网络策略及其功能之间的差异，请参阅 [AKS 文档](https://docs.microsoft.com/en-us/azure/aks/use-network-policies#differences-between-azure-and-calico-policies-and-their-capabilities)。

### DNS 前缀

为集群的 Kubernetes API server FQDN 输入唯一的 DNS 前缀。

### 网络插件

有两个网络插件，分别是 kubenet 和 Azure CNI。

[kubenet](https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#kubenet) Kubernetes 插件是 AKS 创建的集群的默认配置。使用 kubenet 时，集群中的每个节点都会收到一个可路由的 IP 地址。Pod 使用 NAT 与 AKS 集群外部的其他资源进行通信。这种方法减少了需要在网络空间中保留以供 Pod 使用的 IP 地址数量。

如果使用 Azure CNI（高级）网络插件，Pod 可以使用完整的虚拟网络连接，并且可以从连接的网络中通过 pod 的私有 IP 地址直接访问。这个插件需要更多的 IP 地址空间。

有关 kubenet 和 Azure CNI 之间差异的详细信息，请参阅 [AKS 文档](https://docs.microsoft.com/en-us/azure/aks/concepts-network#compare-network-models)。

### HTTP 应用路由

启用后，HTTP 应用路由附加组件可以更轻松地访问部署到 AKS 集群的应用。它部署了两个组件，分别是 [Kubernetes Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress/) 和 [External-DNS](https://github.com/kubernetes-incubator/external-dns) controller。

有关详细信息，请参阅 [AKS 文档](https://docs.microsoft.com/en-us/azure/aks/http-application-routing)。

### 设置授权 IP 范围

你可以使用[授权的 IP 地址范围](https://docs.microsoft.com/en-us/azure/aks/api-server-authorized-ip-ranges#overview-of-api-server-authorized-ip-ranges)来保护对 Kubernetes API server 的访问。

Kubernetes API server 公开 Kubernetes API。该组件提供管理工具（例如 kubectl）的交互。AKS 提供带有专用 API server 的单租户集群 control plane。默认情况下，API server 分配了一个公共 IP 地址，你应该使用基于 Kubernetes 或 Azure 的 RBAC 来控制对 API server 的访问。

要保护对其他可公开的 AKS control plane 和 API server 的访问，你可以启用并使用授权的 IP 范围。这些授权的 IP 范围只允许定义的 IP 地址范围与 API server 通信。

但是，即使你使用了授权的 IP 地址范围，你仍应使用 Kubernetes RBAC 或 Azure RBAC 来授权用户及其请求的操作。

### 容器监控

容器监控使用 Metrics API 从 Kubernetes 中可用的控制器、节点和容器中收集内存和处理器指标，从而为你可视化性能数据。容器日志也能被收集。启用监控后，系统会通过 Linux 的 Log Analytics 代理的容器化版本自动为你收集指标和日志。指标会被写入指标存储，而日志数据会被写入与你的 [Log Analytics](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview) 工作区关联的日志存储。

### Log Analytics 工作区资源组

[资源组](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview#resource-groups)包含 Log Analytics 工作区。你必须至少创建一个工作区才能使用 Azure Monitor Logs。

### Log Analytics 工作区名称

Azure Monitor Logs 收集的数据存储在一个或多个 [Log Analytics 工作区中](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/design-logs-deployment)。工作区定义了数据的地理位置、访问权限（定义了哪些用户可以访问数据）以及配置设置（定价层和数据保留等）。

你必须至少创建一个工作区才能使用 Azure Monitor Logs。一个工作区可能就足以满足你的所有监控数据。你也可以根据需求创建多个工作区。例如，你可能有一个工作区用于生产数据，另一个工作区用于测试。

有关 Azure Monitor Logs 的详细信息，请参阅 [Azure 文档](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/data-platform-logs)。

### 支持私有 Kubernetes 服务

通常情况下，无论集群是否为私有，AKS worker 节点都不会获得公共 IP。在私有集群中，control plane 没有公共端点。

Rancher 可以通过以下两种方式之一连接到私有 AKS 集群。

第一种方法是确保 Rancher 运行在与 AKS 节点相同的 [NAT](https://docs.microsoft.com/en-us/azure/virtual-network/nat-overview) 上。

第二种方法是运行命令向 Rancher 注册集群。配置集群后，你可以在任何能连接到集群的 Kubernetes API 的地方运行显示的命令。配置启用了私有 API 端点的 AKS 集群时，此命令将显示在弹出窗口中。

> **注意**：注册现有 AKS 集群时，集群可能需要一些时间（可能是数小时）才会出现在 `Cluster To register` 下拉列表中。不同区域的结果可能不同。

有关连接到 AKS 专用集群的详细信息，请参阅 [AKS 文档](https://docs.microsoft.com/en-us/azure/aks/private-clusters#options-for-connecting-to-the-private-cluster)。

## 节点池

### 模式

Azure 界面允许用户指定主节点池是依赖于 `system`（通常用于 control plane）还是 `user`（Rancher 最常用的）。

对于主节点池，你可以指定模式、操作系统、数量和大小。

`system` 节点池总是需要运行节点，因此它们不能缩容到一个节点以下。至少需要一个 `system` 节点池。

对于后续的节点池，Rancher UI 强制使用默认的 `user`。`user` 节点池允许缩容到零节点。`user` 节点池不运行 Kubernetes control plane 的任何部分。

AKS 不会公开运行 Kubernetes control plane 组件的节点。

### 可用区

[可用区](https://docs.microsoft.com/en-us/azure/availability-zones/az-overview)是区域内的唯一物理位置。每个可用区由一个或多个配备独立电源、冷却系统和网络的数据中心组成。

并非所有区域都支持可用区。有关具有可用区的 Azure 区域列表，请参阅 [Azure 文档](https://docs.microsoft.com/en-us/azure/availability-zones/az-region#azure-regions-with-availability-zones)。

### 虚拟机大小

为节点池中的每个 VM 选择一个大小。有关每个 VM 大小的详细信息，请参阅[此页面](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/)。

### 操作系统磁盘类型

节点池中的节点可以使用托管磁盘或临时磁盘。

[临时 OS 磁盘](https://docs.microsoft.com/en-us/azure/virtual-machines/ephemeral-os-disks)在本地虚拟机存储上创建，并不会保存到远程 Azure 存储。临时 OS 磁盘适用于无状态工作负载，其中的应用可以容忍单个 VM 故障，但更容易受 VM 部署时间或重置单个虚拟机实例镜像的影响。使用临时 OS 磁盘，你可以体验更低的 OS 磁盘读/写延迟和更快的 VM 重置镜像过程。

[Azure 托管磁盘](https://docs.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview)是由 Azure 管理并与 Azure Virtual Machines 一起使用的块级存储卷。托管磁盘旨在实现 99.999% 的高可用性。托管磁盘通过为你提供三个数据副本来实现高可用性和高持续性。

### 操作系统磁盘大小

每个节点的磁盘大小（以 GB 为单位）。

### 节点数

节点池中的节点数。[Azure 订阅](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits)可能会限制最大节点数。

### 每个节点的最大 Pod 数量

每个节点的最大 Pod 数量默认为 110，最大为 250。

### 启用自动扩缩容

启用自动扩缩容后，你需要输入最小和最大节点数。

启用 Auto Scaling 后，你将无法手动对节点池进行扩缩容。扩缩容由 AKS autoscaler 控制。
