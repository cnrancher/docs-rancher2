---
title: Harvester 集成
weight: 10
---

##### _技术预览_

Harvester 是 Rancher 2.6.1 新增的功能，[Harvester 0.3.0](https://docs.harvesterhci.io/v0.3/) 是基于 Kubernetes 构建的开源超融合基础架构 (HCI) 软件。Harvester 安装在裸金属服务器集群上，提供集成的虚拟化和分布式存储功能。虽然 Harvester 使用 Kubernetes 运行，但它不需要用户了解 Kubernetes 概念，因此是一个更加用户友好的应用。

### 功能开关

你可以使用 Harvester 的功能开关来管理 Harvester 在 Rancher 虚拟化管理页面的访问，用户可以在该页面直接导航到 Harvester 集群并访问 Harvester UI。Harvester 的功能开关是默认启用的。如需了解 Rancher 中功能开关的更多详细信息，请单击[此处]({{<baseurl>}}/rancher/v2.6/en/installation/resources/feature-flags/)。

要导航到 Harvester 集群，请单击 **☰ > 虚拟化管理**。在 **Harvester 集群**页面中，单击集群以转到该 Harvester 集群的视图。

- 如果启用了 Harvester 功能开关，则会从列出 Kubernetes 集群的任何页面或应用（例如 Fleet 和多集群应用）中过滤掉 Harvester 集群。

- 如果禁用了 Harvester 功能开关，并且导入了 Harvester 集群，Harvester 集群将显示在**集群管理**页面的 Rancher 集群列表中。仅当功能开关为关闭时，Harvester 集群才会显示在集群列表中。

- 集成 Harvester 后，你可以将 Harvester 集群导入 Rancher，对应的集群类型是 `Harvester`。

- 用户只能在**虚拟化管理**页面上导入 Harvester 集群。在**集群管理**页面上导入集群是不支持的，而且会出现警告。建议你返回**虚拟化管理**页面执行此操作。

### Harvester 主机驱动

在 Rancher 的 RKE 和 RKE2 选项中，[Harvester 主机驱动](https://docs.harvesterhci.io/v0.3/rancher/node-driver/)被标记为`技术预览`。在**创建**页面和启用驱动后的页面都是一样的情况。无论 Harvester 功能开关是否启用，主机驱动都是可用的。请注意，默认情况下主机驱动是关闭的。用户只能通过**集群管理**页面在 Harvester 上创建 RKE 或 RKE2 集群。

如需了解 Rancher 中主机驱动的更多详细信息，请单击[此处]({{<baseurl>}}/rancher/v2.6/en/admin-settings/drivers/#node-drivers)。

### 限制

- Harvester 0.3.0 不支持离线环境安装。
- 不支持将 Harvester 0.2.0 升级到 0.3.0，也不支持升级到新的 1.0.0 版本。
