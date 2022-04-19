---
title: GKE 集群配置参考
shortTitle: GKE 集群配置
weight: 3
---

## Rancher 2.6 变更

- 支持额外的配置选项：
  - 项目网络隔离
  - 网络标签

## 集群位置

| 值       | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 位置类型 | 地区 (zone) 或区域 (region)。借助 GKE，你可以根据工作负载的可用性要求和预算创建一个量身定制的集群。默认情况下，集群的节点在单个计算区域中运行。选择多个区域时，集群的节点将跨越多个计算区域，而 control plane 则只位于单个区域中。区域集群也增加了 control plane 的可用性。有关选择集群可用性类型的帮助，请参阅[这些文档](https://cloud.google.com/kubernetes-engine/docs/best-practices/scalability#choosing_a_regional_or_zonal_control_plane)。 |
| 地区     | 计算引擎中的每个区域都包含多地区。有关可用区域和可用区的更多信息，请参阅[这些文档](https://cloud.google.com/compute/docs/regions-zones#available)。                                                                                                                                                                                                                                                                                                |
| 其他地区 | 对于地区性集群，你可以选择其他地区来创建[多地区集群](https://cloud.google.com/kubernetes-engine/docs/concepts/types-of-clusters#multi-zonal_clusters)。                                                                                                                                                                                                                                                                                            |
| 区域     | 对于[区域性集群](https://cloud.google.com/kubernetes-engine/docs/concepts/types-of-clusters#regional_clusters)，你可以选择一个区域。有关可用区域和可用区的更多信息，请参阅[本节](https://cloud.google.com/compute/docs/regions-zones#available)。地区名称的前面部分是区域的名称。                                                                                                                                                                  |

## 集群选项

### Kubernetes 版本

_可变：是_

有关 GKE Kubernetes 版本的更多信息，请参阅[这些文档](https://cloud.google.com/kubernetes-engine/versioning)。

### 容器地址范围

_可变：否_

集群中 Pod 的 IP 地址范围。必须是有效的 CIDR 范围，例如 10.42.0.0/16。如果未指定，则会自动从 10.0.0.0/8 中选择一个随机范围，并排除已分配给 VM、其他集群或路由的范围。自动选择的范围可能与预留的 IP 地址、动态路由或与集群对等的 VPC 中的路由发生冲突。

### 网络

_可变：否_

集群连接的 Compute Engine 网络。将使用此网络创建路由和防火墙。如果使用[共享 VPC](https://cloud.google.com/vpc/docs/shared-vpc)，与你的项目共享的 VPC 网络将显示在此处。你将可以在此字段中进行选择。有关详细信息，请参阅[此页面](https://cloud.google.com/vpc/docs/vpc#vpc_networks_and_subnets)。

### 节点子网/子网

_可变：否_

集群连接到的 Compute Engine 子网。该子网必须属于**网络**字段中指定的网络。选择一个现有的子网，或选择“自动创建子网”来自动创建一个子网。如果不使用现有网络，则需要使用**子网名称**来生成一个。如果使用[共享 VPC](https://cloud.google.com/vpc/docs/shared-vpc)，与你的项目共享的 VPC 子网将显示在此处。如果使用共享 VPC 网络，则无法选择“自动创建子网”。如需更多信息，请参阅[此页面](https://cloud.google.com/vpc/docs/vpc#vpc_networks_and_subnets)。

### 子网名称

_可变：否_

使用提供的名称自动创建子网。如果为**节点子网**或**子网**选择了“自动创建子网”，则为必填。有关子网的更多信息，请参阅[此页面](https://cloud.google.com/vpc/docs/vpc#vpc_networks_and_subnets)。

### IP 别名

_可变：否_

启用[别名 IP](https://cloud.google.com/vpc/docs/alias-ip)。这将启用 VPC 原生流量路由。如果使用[共享 VPC](https://cloud.google.com/vpc/docs/shared-vpc)，则为必填。

### 网络策略

_可变：是_

在集群上启用的网络策略。网络策略定义了集群中 pod 和 service 之间可以发生的通信级别。有关详细信息，请参阅[此页面](https://cloud.google.com/kubernetes-engine/docs/how-to/network-policy)。

### 项目网络隔离

_可变：是_

选择启用或禁用项目间通信。请注意，如果启用**项目网络隔离**，则将自动启用**网络策略**和**网络策略配置**，反之则不然。

### 节点 IPv4 CIDR 块

_可变：否_

此集群中实例 IP 的 IP 地址范围。如果为**节点子网**或**子网**选择了“自动创建子网”，则可以进行设置。必须是有效的 CIDR 范围，例如 10.96.0.0/14。有关如何确定 IP 地址范围的详细信息，请参阅[此页面](https://cloud.google.com/kubernetes-engine/docs/concepts/alias-ips#cluster_sizing)。

### 集群次要范围名称

_可变：否_

Pod IP 地址的现有次要范围的名称。如果选中，将自动填充**集群 Pod 地址范围**。如果使用共享 VPC 网络，则为必填。

### 集群 Pod 地址范围

_可变：否_

分配给集群中 pod 的 IP 地址范围。必须是有效的 CIDR 范围，例如 10.96.0.0/11。如果未提供，将自动创建。如果使用共享 VPC 网络，则必须提供。有关如何确定 pod 的 IP 地址范围的更多信息，请参阅[本节](https://cloud.google.com/kubernetes-engine/docs/concepts/alias-ips#cluster_sizing_secondary_range_pods)。

### Service 次要范围名称

_可变：否_

Service IP 地址的现有次要范围的名称。如果选中，将自动填充 **Service 地址范围**。如果使用共享 VPC 网络，则为必填。

### Service 地址范围

_可变：否_

分配给集群中 Service 的地址范围。必须是有效的 CIDR 范围，例如 10.94.0.0/18。如果未提供，将自动创建。如果使用共享 VPC 网络，则必须提供。有关如何确定 Service 的 IP 地址范围的详细信息，请参阅[本节](https://cloud.google.com/kubernetes-engine/docs/concepts/alias-ips#cluster_sizing_secondary_range_svcs)。

### 私有集群

_可变：否_

> 警告：私有集群需要在 Rancher 之外进行额外的规划和配置。请参阅[私有集群指南]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/gke-config-reference/private-clusters/)。

仅分配节点内部 IP 地址。除非在 GCP 中执行了额外的联网步骤，否则私有集群节点无法访问公共互联网。

### 启用私有端点

> 警告：私有集群需要在 Rancher 之外进行额外的规划和配置。请参阅[私有集群指南]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/gke-config-reference/private-clusters/)。

_可变：否_

锁定对 control plane 端点的外部访问。仅当**私有集群**也被选中时可用。如果选中，并且 Rancher 无法直接访问集群所在的虚拟私有云网络，Rancher 将提供在集群上运行的注册命令，以使 Rancher 能够连接到集群。

### 主 IPV4 CIDR 块

_可变：否_

control plane VPC 的 IP 范围。

### 主授权网络

_可变：是_

启用 control plane 授权网络，以阻止不受信任的非 GCP 源 IP 通过 HTTPS 访问 Kubernetes master。如果选择，则可以添加额外的授权网络。如果集群是使用公共端点创建的，则此选项可用于将公共端点的访问锁定到特定网络（例如运行 Rancher 服务的网络）。如果集群只有一个私有端点，则需要此设置。

## 其他选项

### 集群插件

其他 Kubernetes 集群组件。有关详细信息，请参阅[此页面](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters#Cluster.AddonsConfig)。

#### 水平 Pod 自动缩放

_可变：是_

Horizo​​ntal Pod Autoscaler 通过自动增加或减少 Pod 的数量来调整 Kubernetes 工作负载，从而响应工作负载的 CPU 或内存消耗，以及 Kubernetes 内部报告的自定义指标或集群外部设置的指标。详情请参见[本页面](https://cloud.google.com/kubernetes-engine/docs/concepts/horizontalpodautoscaler)。

#### HTTP (L7) 负载均衡

_可变：是_

HTTP (L7) 负载均衡将 HTTP 和 HTTPS 流量分配到托管在 GKE 上的后端。有关详细信息，请参阅[此页面](https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer)。

#### 网络策略配置（仅限 master）

_可变：是_

NetworkPolicy 的配置。仅跟踪 master 节点上是否启用了插件，不跟踪是否为节点启用了网络策略。

### 集群特征（Alpha 功能）

_可变：否_

打开集群的所有 Kubernetes alpha API 组和功能。启用后，集群无法升级，并且会在 30 天后自动删除。由于 GKE SLA 未支持 alpha 集群，因此不建议将 Alpha 集群用于生产环境。有关详细信息，请参阅[此页面](https://cloud.google.com/kubernetes-engine/docs/concepts/alpha-clusters)。

### 日志管理服务

_可变：是_

集群用于写入日志的日志管理服务。要么使用 [Cloud Logging](https://cloud.google.com/logging)，要么不使用日志管理服务（不会从集群中导出日志）。

### 监控服务

_可变：是_

集群用于写入指标的监控服务。要么使用 [Cloud Monitoring](https://cloud.google.com/monitoring)，要么不使用集群监控服务（不会从集群中导出指标）。

### 维护窗口

_可变：是_

设置时长 4 小时的维护窗口的开始时间。使用 HH:MM 格式在 UTC 时区中指定时间。有关详细信息，请参阅[此页面](https://cloud.google.com/kubernetes-engine/docs/concepts/maintenance-windows-and-exclusions)。

## 节点池

在此部分中，输入描述节点池中每个节点的配置的详细信息。

### Kubernetes 版本

_可变：是_

节点池中每个节点的 Kubernetes 版本。有关 GKE Kubernetes 版本的更多信息，请参阅[这些文档](https://cloud.google.com/kubernetes-engine/versioning)。

### 镜像类型

_可变：是_

节点操作系统镜像。有关 GKE 为每个操作系统提供的节点镜像选项，请参阅[此页面](https://cloud.google.com/kubernetes-engine/docs/concepts/node-images#available_node_images)。

> 注意：默认选项是 “Container-Optimized OS with Docker”。GCP Container-Optimized OS 上的只读文件系统与 Rancher 中的 [legacy logging]({{<baseurl>}}/rancher/v2.0-v2.4/en/cluster-admin/tools/logging) 实现不兼容。如果你需要使用旧版日志管理功能，请选择 “Ubuntu with Docker” 或 “Ubuntu with Containerd”。[current logging feature]({{<baseurl>}}/rancher/v2.6/en/logging) 与 Container-Optimized OS 镜像兼容。

> 注意：如果节点池镜像类型选择 “Windows Long Term Service Channel” 或 “Windows Semi-Annual Channel”，还必须至少添加一个 Container-Optimized OS 或 Ubuntu 节点池。

### 机器类型

_可变：否_

节点实例可用的虚拟化硬件资源。有关 Google Cloud 机器类型的详细信息，请参阅[此页面](https://cloud.google.com/compute/docs/machine-types#machine_types)。

### 根磁盘类型

_可变：否_

标准永久性磁盘由标准磁盘驱动器 (HDD) 支持，而 SSD 永久性磁盘由固态硬盘 (SSD) 支持。有关详细信息，请参阅[本节](https://cloud.google.com/compute/docs/disks)。

### 本地 SSD 磁盘

_可变：否_

配置每个节点的本地 SSD 磁盘存储（以 GB 为单位）。本地 SSD 物理连接到托管你的 VM 实例的服务器。与标准永久性磁盘或 SSD 永久性磁盘相比，本地 SSD 具有更高的吞吐量和更低的延迟。存储在本地 SSD 上的数据只会保留到实例停止或删除。有关详细信息，请参阅[本节](https://cloud.google.com/compute/docs/disks#localssds)。

### 抢占式节点（beta）

_可变：否_

抢占式节点也称为抢占式虚拟机。通常是最长持续 24 小时的 Compute Engine 虚拟机实例，不提供可用性保证。详情请参见[本页面](https://cloud.google.com/kubernetes-engine/docs/how-to/preemptible-vms)。

### 污点

_可变：否_

将污点应用于节点时，仅允许容忍该污点的 Pod 在该节点上运行。在 GKE 集群中，你可以将污点应用到节点池，这会将污点应用到池中的所有节点。

### 节点标签

_可变：否_

你可以将标签应用到节点池，这会将标签应用到池中的所有节点。

无效标签会阻止升级，或阻止 Rancher 启动。有关标签语法要求的详细信息，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)。

### 网络标签

_可变：否_

你可以将网络标签添加到节点池以制定防火墙规则和子网之间的路由。标签将应用于池中的所有节点。

有关标签语法和要求的详细信息，请参阅 [Kubernetes 文档](https://cloud.google.com/vpc/docs/add-remove-network-tags)。

## 组详细信息

在此部分中，输入描述节点池的详细信息。

### 名称

_可变：否_

输入节点池的名称。

### 初始节点数

_可变：是_

节点池中初始节点数的整数。

### 每个节点的最大 Pod 数量

_可变：否_

GKE 的硬性限制是每个节点 110 个 Pod。有关 Kubernetes 限制的更多信息，请参阅[本节](https://cloud.google.com/kubernetes-engine/docs/best-practices/scalability#dimension_limits)。

### 自动缩放

_可变：是_

节点池自动缩放会根据工作负载的需求动态创建或删除节点。详情请参见[本页面](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler)。

### 自动修复

_可变：是_

GKE 的节点自动修复功能可帮助你将集群中的节点保持在健康的运行状态。启用后，GKE 会定期检查集群中每个节点的运行状况。如果某个节点在较长时间段内连续未通过健康检查，GKE 会为该节点启动修复过程。有关详细信息，请参阅[自动修复节点](https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-repair)。

### 自动升级

_可变：是_

启用后，当你的 control plane [按照你的需求更新](https://cloud.google.com/kubernetes-engine/upgrades#automatic_cp_upgrades)时，自动升级功能会使集群中的节点与集群 control plane（master）版本保持同步。有关自动升级节点的更多信息，参见[此页面。](https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-upgrades)

### 访问范围

_可变：否_

设置访问范围是为你的节点指定权限的旧版方法。

- **允许默认访问**：新集群的默认访问是 [Compute Engine 默认服务账号](https://cloud.google.com/compute/docs/access/service-accounts?hl=en_US#default_service_account)。
- **允许完全访问所有 Cloud API**：通常，你只需设置云平台访问范围来允许完全访问所有 Cloud API，然后仅授予服务帐户相关的 IAM 角色。授予虚拟机实例的访问范围和授予服务账号的 IAM 角色的组合决定了服务账号对该实例的访问量。
- **为每个 API 设置访问权限**：或者，你可以设置服务将调用的特定 API 方法的访问范围。

有关详细信息，请参阅[为 VM 启用服务账号](https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances)。

### 配置刷新间隔

刷新间隔可以通过 “gke-refresh” 来配置，它是一个代表秒的整数。

默认值为 300 秒。

你可以通过运行 `kubectl edit setting gke-refresh` 来更改同步间隔。

刷新窗口越短，争用条件发生的可能性就越小。但这确实增加了遇到 GCP API 可能存在的请求限制的可能性。
