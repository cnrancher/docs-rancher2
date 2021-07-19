---
title: GKE集群配置参考
description: 使用Google Kubernetes Engine创建服务账户。GKE 使用这个帐户来操作您的集群。创建此帐户还将生成用于身份验证的私钥。
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
  - 集群管理员指南
  - 集群访问控制
  - 配置参考
---

## Changes in v2.5.8+

- 我们现在支持私有 GKE 集群。注意：这种高级设置在集群配置过程中可能需要更多步骤。详情请见[本节](/docs/rancher2.5/cluster-provisioning/hosted-kubernetes-clusters/gke/_index)。
- 现在支持[Shared VPCs](https://cloud.google.com/vpc/docs/shared-vpc)了。
- 我们现在支持 Rancher 管理的 GKE 集群的更多配置选项。
  - 项目
  - 网络策略
  - 网络策略配置
  - 节点池和节点配置选项。
    - 节点可以使用更多的镜像类型
    - 可以配置每个节点的最大 Pod 数
  - 在配置 GKE 集群时可以添加节点池
- 在配置 GKE 集群时，你现在可以使用可重复使用的云凭证，而不是直接使用服务账户令牌来创建集群。

## 2.5.8 及之后

### 集群位置

| 值       | 描述                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 位置类型 | 区域性或地区性。通过 GKE，你可以根据你的工作负载和预算的可用性要求来创建一个集群。默认情况下，一个集群的节点运行在一个计算区。当选择多个区域时，集群的节点将跨越多个计算区，而控制板位于一个区域内。区域集群也会增加控制板的可用性。关于选择集群可用性类型的帮助，请参阅[这些文档。](https://cloud.google.com/kubernetes-engine/docs/best-practices/scalability#choosing_a_regional_or_zonal_control_plane) |
| 区域     | 计算引擎中的每个区域都包含一些区域。有关可用区域和区域的更多信息，请参阅[这些文档](https://cloud.google.com/compute/docs/regions-zones#available)                                                                                                                                                                                                                                                           |
| 其他区域 | 对于分区集群，你可以选择额外的区域来创建一个[多区集群](https://cloud.google.com/kubernetes-engine/docs/concepts/types-of-clusters#multi-zonal_clusters)。                                                                                                                                                                                                                                                   |
| Region   | 对于[区域集群](https://cloud.google.com/kubernetes-engine/docs/concepts/types-of-clusters#regional_clusters)，你可以选择一个区域。关于可用区域和区的更多信息，请参考[本节](https://cloud.google.com/compute/docs/regions-zones#available)。每个区域名称的第一部分是该区域的名称。                                                                                                                           |

### 集群选项

#### Kubernetes 版本

关于 GKE Kubernetes 版本的更多信息，请参阅[这些文档](https://cloud.google.com/kubernetes-engine/versioning)。

#### 容器 IP 地址取值范围

集群中的 pod 的 IP 地址范围。必须是一个有效的 CIDR 范围，例如 10.42.0.0/16。如果不指定，将从 10.0.0.0/8 中自动选择一个随机范围，并将排除已经分配给虚拟机、其他集群或路由的范围。自动选择的范围可能与保留的 IP 地址、动态路由或与集群对等的 VPC 内的路由冲突。

#### 网络

集群所连接的计算引擎网络。路由和防火墙将使用该网络创建。如果使用 [Shared VPCs](https://cloud.google.com/vpc/docs/shared-vpc)，共享给你的项目的 VPC 网络将出现在这里。将可以在这个领域中选择。欲了解更多信息，请参考[本页面](https://cloud.google.com/vpc/docs/vpc#vpc_networks_and_subnets)。

#### 节点子网/子网

集群所连接的计算引擎子网。该子网络必须属于**网络**字段中指定的网络。选择一个现有的子网络，或者选择 "自动创建子网络 "来自动创建一个。如果不使用现有的网络，需要**子网络名称**来生成一个。如果使用[共享 VPC](https://cloud.google.com/vpc/docs/shared-vpc)，共享给你的项目的 VPC 子网将出现在这里。如果使用共享的 VPC 网络，你不能选择 "自动创建子网络"。欲了解更多信息，请参考[本页](https://cloud.google.com/vpc/docs/vpc#vpc_networks_and_subnets)

#### 子网络名称

用提供的名称自动创建一个子网络。如果为**节点子网**或**子网**选择了 "自动创建子网"，则需要。有关子网络的更多信息，请参阅[本页。](https://cloud.google.com/vpc/docs/vpc#vpc_networks_and_subnets)

#### Ip 别名

启用[别名 IP](https://cloud.google.com/vpc/docs/alias-ip)。这将启用 VPC 本机流量路由。如果使用 [Shared VPCs] (https://cloud.google.com/vpc/docs/shared-vpc) 则需要。

#### 网络策略

启用集群上的网络策略执行。网络策略定义了集群中的 pod 和服务之间可以发生的通信级别。欲了解更多信息，请参阅[本页](https://cloud.google.com/kubernetes-engine/docs/how-to/network-policy)

#### 节点 Ipv4 CIDR 块

这个集群中实例 IP 的 IP 地址范围。如果为**节点子网**或**子网**选择了 "自动创建子网"，则可以设置。必须是一个有效的 CIDR 范围，例如 10.96.0.0/14。关于如何确定 IP 地址范围的更多信息，请参考[本页面。](https://cloud.google.com/kubernetes-engine/docs/concepts/alias-ips#cluster_sizing)

#### 集群二级范围名称

Pod IP 地址的现有二级范围的名称。如果选择，**集群 Pod 地址范围**将自动填入。如果使用共享的 VPC 网络，则需要。

#### Cluster Pod Address Range

分配给集群中的 Pod 的 IP 地址范围。必须是一个有效的 CIDR 范围，例如 10.96.0.0/11。如果不提供，将自动创建。如果使用共享的 VPC 网络，必须提供。关于如何确定你的 pod 的 IP 地址范围的更多信息，请参阅[本节。](https://cloud.google.com/kubernetes-engine/docs/concepts/alias-ips#cluster_sizing_secondary_range_pods)

###服务二级范围名称

服务 IP 地址的现有二级范围的名称。如果选择，**服务地址范围**将被自动填入。如果使用共享的 VPC 网络，则需要。

#### 服务地址范围

分配给集群中服务的地址范围。必须是一个有效的 CIDR 范围，例如 10.94.0.0/18。如果不提供，将自动创建。如果使用共享的 VPC 网络，必须提供。关于如何确定服务的 IP 地址范围的更多信息，请参阅[本节。](https://cloud.google.com/kubernetes-engine/docs/concepts/alias-ips#cluster_sizing_secondary_range_svcs)

#### 私有集群

> 警告：私有集群需要 Rancher 之外的额外规划和配置。请参考[私有集群指南](/docs/rancher2.5/cluster-provisioning/hosted-kubernetes-clusters/gke/private-clusters/_index) 。

只给节点分配内部 IP 地址。除非在 GCP 中采取额外的网络步骤，否则私有集群节点不能访问公共互联网。

#### 启用私有端点

> 警告：私有集群需要 Rancher 之外的额外规划和配置。请参考[私有集群指南]({{< baseurl >}}/rancher/v2.5/en/cluster-provisioning/hosted-kubernetes-clusters/gke/#private-clusters）。)

锁定对控制平面端点的外部访问。只有当**私有集群**也被选中时才可用。如果选择了，并且如果 Rancher 不能直接访问集群运行的虚拟私有云网络，Rancher 将提供一个注册命令，在集群上运行，使 Rancher 能够连接到它。

#### 主站 IPV4 CIDR 块

控制平面 VPC 的 IP 范围。

#＃＃附加选项

#### Cluster Addons

额外的 Kubernetes 集群组件。欲了解更多信息，请参考[本页面。](https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters#Cluster.AddonsConfig)

##### Horizontal Pod Autoscaling

Horizontal Pod Autoscaler 改变你的 Kubernetes 工作负载的形状，通过自动增加或减少 Pod 的数量来响应工作负载的 CPU 或内存消耗，或响应来自 Kubernetes 内部报告的自定义指标或来自集群外的外部指标。欲了解更多信息，请参阅[本页面。](https://cloud.google.com/kubernetes-engine/docs/concepts/horizontalpodautoscaler)

##### HTTP（L7）负载平衡

HTTP（L7）负载平衡将 HTTP 和 HTTPS 流量分配到 GKE 上托管的后端。更多信息请参考[本页](https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer)

##### 网络策略配置（仅限主站

NetworkPolicy 的配置。它只跟踪主控端是否启用了插件，并不跟踪节点是否启用了网络策略。

#### Cluster Features (Alpha Features)

开启集群的所有 Kubernetes alpha API 组和功能。启用后，集群不能升级，30 天后将自动删除。Alpha 集群不建议在生产中使用，因为它们不在 GKE SLA 的范围内。欲了解更多信息，请参阅[本页面。](https://cloud.google.com/kubernetes-engine/docs/concepts/alpha-clusters)

#### 日志服务

集群用于写入日志的日志服务。使用[Cloud Logging](https://cloud.google.com/logging)或不使用日志服务，在这种情况下，不会从集群中导出日志。

#### 监控服务

集群用于写入指标的监控服务。使用 [Cloud Monitoring](https://cloud.google.com/monitoring) 或监控服务，在这种情况下，不会从集群中导出指标。

#### 维护窗口

设置 4 小时维护窗口的开始时间。该时间在 UTC 时区使用 HH:MM 格式指定。更多信息，请参考[本页面。](https://cloud.google.com/kubernetes-engine/docs/concepts/maintenance-windows-and-exclusions)

###节点池

在这一部分，输入描述节点池中每个节点配置的细节。

### Kubernetes 版本

节点池中每个节点的 Kubernetes 版本。关于 GKE Kubernetes 版本的更多信息，请参考[这些文档](https://cloud.google.com/kubernetes-engine/versioning)

#### 镜像类型

节点操作系统镜像。关于 GKE 为每个操作系统提供的节点镜像选项的更多信息，请参考[本页面](https://cloud.google.com/kubernetes-engine/docs/concepts/node-images#available_node_images)。

> 注意：默认选项是 "使用 Docker 的容器优化操作系统"。GCP 的容器优化操作系统的只读文件系统与 Rancher 中的传统日志实现不兼容。如果你需要使用传统的日志功能，请选择 "Ubuntu with Docker "或 "Ubuntu with Containerd"。截至 v2.5 的日志功能与容器优化的操作系统镜像兼容。

> 注意：如果为节点池镜像类型选择 "Windows 长期服务通道 "或 "Windows 半年度通道"，则必须同时添加至少一个容器优化操作系统或 Ubuntu 节点池。

#### 机器类型

节点实例可用的虚拟化硬件资源。有关谷歌云机器类型的更多信息，请参阅[本页。](https://cloud.google.com/compute/docs/machine-types#machine_types)

#### 根磁盘类型

标准持久性磁盘由标准硬盘（HDD）支持，而 SSD 持久性磁盘由固态驱动器（SSD）支持。欲了解更多信息，请参考[本节。](https://cloud.google.com/compute/docs/disks)

#### 本地 SSD 磁盘

配置每个节点的本地 SSD 磁盘存储，单位是 GB。本地 SSD 是物理上连接到承载你的虚拟机实例的服务器上的。本地 SSD 比标准持久化磁盘或 SSD 持久化磁盘有更高的吞吐量和更低的延迟。你存储在本地 SSD 上的数据只持续到实例停止或删除。欲了解更多信息，请参阅[本节。](https://cloud.google.com/compute/docs/disks#localssds)

#### 可抢占节点(beta)

可抢占节点，也称为可抢占虚拟机，是计算引擎虚拟机实例，一般情况下最多持续 24 小时，不提供可用性保证。欲了解更多信息，请参阅[本页面。](https://cloud.google.com/kubernetes-engine/docs/how-to/preemptible-vms)

#### 污点

当你对一个节点应用污点时，只有能容忍污点的 Pod 才允许在节点上运行。在 GKE 集群中，你可以将污点应用到节点池中，这样就可以将污点应用到所有的节点上。

#### 节点标签

你可以将标签应用到节点池，将标签应用到池中的所有节点。

无效的标签会阻止升级，或者会阻止Rancher启动。关于标签语法要求的详细信息，请参见[Kubernetes文档。](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)

### 组细节

在这一部分，输入描述节点池的详细信息。

#### 名称

输入节点池的名称。

#### 初始节点数

节点池中的起始节点数的整数。

#### 每个节点的最大 Pod

GKE 的硬性限制是每个节点 110 个 Pod。关于 Kubernetes 限制的更多信息，请参见[本节。](https://cloud.google.com/kubernetes-engine/docs/best-practices/scalability#dimension_limits)

#### Autoscaling

节点池自动缩放可以根据工作负载的需求动态地创建或删除节点。欲了解更多信息，请参阅[本页面。](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler)

#### 自动修复

GKE 的节点自动修复功能可以帮助你保持集群中的节点处于健康、运行状态。启用后，GKE 会对集群中每个节点的健康状态进行定期检查。如果一个节点在较长的时间内没有通过连续的健康检查，GKE 就会为该节点启动修复程序。欲了解更多信息，请参阅[自动修复节点。](https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-repair)

#### 自动升级

启用自动升级功能后，当你的控制平面[代表你更新](https://cloud.google.com/kubernetes-engine/upgrades#automatic_cp_upgrades)时，自动升级功能会使你集群中的节点与集群控制平面（主控）的版本保持一致。](https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-upgrades) 关于自动升级节点的更多信息，请参阅[本页面。

#### 访问作用域

访问作用域是为你的节点指定权限的传统方法。

- **允许默认访问：**新集群的默认访问是[计算引擎默认服务账户。](https://cloud.google.com/compute/docs/access/service-accounts?hl=en_US#default_service_account)
- **允许完全访问所有云 API**一般来说，你可以只设置云平台的访问范围，允许完全访问所有云 API，然后只授予服务账户相关的 IAM 角色。授予虚拟机实例的访问范围和授予服务账户的 IAM 角色的组合决定了服务账户对该实例的访问量。
- **为每个 API 设置访问权限：**或者，您可以选择设置特定的作用域，允许访问服务将调用的特定 API 方法。

欲了解更多信息，请参阅[关于为虚拟机启用服务账户的部分。](https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances)

## v2.5.8 之前

### 标签和注释

在集群中添加 Kubernetes 的[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)或[注释](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/)。

无效的标签会阻止升级，或者会阻止Rancher启动。关于标签语法要求的详细信息，请参见[Kubernetes文档。](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)

### Kubernetes 选项

#### 位置类型

区域性或地区性。通过 GKE，你可以根据工作负载的可用性要求和预算来创建一个集群。默认情况下，一个集群的节点运行在一个计算区。当选择多个区域时，集群的节点将跨越多个计算区，而控制板位于一个区域内。区域集群也会增加控制板的可用性。关于选择集群可用性类型的帮助，请参考[这些文档。](https://cloud.google.com/kubernetes-engine/docs/best-practices/scalability#choosing_a_regional_or_zonal_control_plane)

对于[区域集群，](https://cloud.google.com/kubernetes-engine/docs/concepts/types-of-clusters#regional_clusters)你可以选择一个区域。关于可用区域和区域的更多信息，请参阅[本节](https://cloud.google.com/compute/docs/regions-zones#available)。每个区域名称的第一部分是该区域的名称。

在集群创建后，位置类型不能被改变。

#### 区域

计算引擎中的每个区域都包含一些区。

有关可用区域和区域的更多信息，请参阅[这些文档。](https://cloud.google.com/compute/docs/regions-zones#available)

#### 额外的区域

对于分区集群，你可以选择额外的区域来创建一个[多区集群。](https://cloud.google.com/kubernetes-engine/docs/concepts/types-of-clusters#multi-zonal_clusters)

#### Kubernetes 版本

链接到 GKE 的 kubernetes 版本列表

#### 容器地址范围

集群中的 pod 的 IP 地址范围。必须是一个有效的 CIDR 范围，例如 10.42.0.0/16。如果不指定，将从 10.0.0.0/8 中自动选择一个随机范围，并将排除已经分配给虚拟机、其他集群或路由的范围。自动选择的范围可能与保留的 IP 地址、动态路由或与集群对等的 VPC 内的路由冲突。

#### Alpha 功能

开启集群的所有 Kubernetes alpha API 组和功能。启用后，集群不能升级，30 天后将自动删除。Alpha 集群不建议在生产中使用，因为它们不在 GKE SLA 的范围内。更多信息请参考[本页](https://cloud.google.com/kubernetes-engine/docs/concepts/alpha-clusters)。

#### 遗留授权

该选项已被废弃，建议将其禁用。更多信息请参考[本页](https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#leave_abac_disabled)

#### Stackdriver 日志记录

启用谷歌云的运营套件（以前称为 Stackdriver）的日志记录。有关详细信息，请参阅[文档。](https://cloud.google.com/logging/docs/basic-concepts)

#### Stackdriver 监控

启用 Google Cloud 的运营套件（以前称为 Stackdriver）的监控。详情请见 [document.](https://cloud.google.com/monitoring/docs/monitoring-overview)

#### Kubernetes 仪表板

启用[Kubernetes 仪表盘插件。](https://cloud.google.com/kubernetes-engine/docs/concepts/dashboards#kubernetes_dashboard) 从 GKE v1.15 开始，你将不再能够通过使用插件 API 启用 Kubernetes 仪表盘。

#### Http Load Balancing

设置[HTTP(S)负载平衡。](https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer) 要使用 Ingress，你必须启用 HTTP(S)负载平衡插件。

#### Horizontal Pod Autoscaling

Horizontal Pod Autoscaler 通过自动增加或减少 Pod 的数量来改变你的 Kubernetes 工作负载的形状，以响应工作负载的 CPU 或内存消耗，或响应从 Kubernetes 内部报告的自定义指标或来自你的集群之外的外部指标。欲了解更多信息，请参阅[文档。](https://cloud.google.com/kubernetes-engine/docs/concepts/horizontalpodautoscaler)

#### 维护窗口

设置 4 小时维护窗口的开始时间。时间是在 UTC 时区使用 HH:MM 格式指定的。更多信息，请参考[本页面。](https://cloud.google.com/kubernetes-engine/docs/concepts/maintenance-windows-and-exclusions)

#### 网络

集群所连接的计算引擎网络。将使用该网络创建路由和防火墙。如果使用 [Shared VPCs](https://cloud.google.com/vpc/docs/shared-vpc)，共享给你的项目的 VPC 网络将出现在这里。将可以在这个领域中选择。欲了解更多信息，请参考[本页面](https://cloud.google.com/vpc/docs/vpc#vpc_networks_and_subnets)。

#### 节点子网/子网

集群所连接的计算引擎子网。该子网络必须属于**网络**字段中指定的网络。选择一个现有的子网络，或者选择 "自动创建子网络 "来自动创建一个。如果不使用现有的网络，需要**子网络名称**来生成一个。如果使用[共享 VPC](https://cloud.google.com/vpc/docs/shared-vpc)，共享给你的项目的 VPC 子网将出现在这里。如果使用共享的 VPC 网络，你不能选择 "自动创建子网络"。欲了解更多信息，请参考[本页](https://cloud.google.com/vpc/docs/vpc#vpc_networks_and_subnets)

#### Ip 别名

启用[别名 IP](https://cloud.google.com/vpc/docs/alias-ip)。这将启用 VPC 本机流量路由。如果使用 [Shared VPCs] (https://cloud.google.com/vpc/docs/shared-vpc) 则需要。

#### Pod 地址范围

当你创建一个 VPC-native 集群时，你在 VPC 网络中指定一个子网。集群为节点、吊舱和服务使用三个唯一的子网 IP 地址范围。有关 IP 地址范围的更多信息，请参阅[本节。](https://cloud.google.com/kubernetes-engine/docs/concepts/alias-ips#cluster_sizing)

#### 服务地址范围

当你创建一个 VPC-native 集群时，你在 VPC 网络中指定一个子网。该集群为节点、pod 和服务使用三个唯一的子网 IP 地址范围。有关 IP 地址范围的更多信息，请参阅[本节。](https://cloud.google.com/kubernetes-engine/docs/concepts/alias-ips#cluster_sizing)

#### 集群标签

[集群标签](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-managing-labels)是一个键值对，帮助你组织你的谷歌云集群。你可以给每个资源附加一个标签，然后根据它们的标签来过滤资源。关于标签的信息会被转发到计费系统，所以你可以根据标签来细分你的计费费用。

###节点选项

#### 节点计数

节点池中节点的起始数量的整数。

#### 机器类型

关于谷歌云机器类型的更多信息，请参考[本页面。](https://cloud.google.com/compute/docs/machine-types#machine_types)

#### 镜像类型

可以使用 Ubuntu 或容器优化的操作系统镜像。

关于 GKE 节点镜像选项的更多信息，请参考[此页面。](https://cloud.google.com/kubernetes-engine/docs/concepts/node-images#available_node_images)

#### 根基磁盘类型

标准持久化磁盘由标准硬盘（HDD）支持，而 SSD 持久化磁盘由固态硬盘（SSD）支持。欲了解更多信息，请参考[本节。](https://cloud.google.com/compute/docs/disks)

#### 根磁盘大小

根磁盘的大小（GB）。](https://cloud.google.com/compute/docs/disks)

#### 本地 SSD 磁盘

配置每个节点的本地 SSD 磁盘存储，单位是 GB。

本地 SSD 在物理上连接到承载你的虚拟机实例的服务器上。与标准持久性磁盘或 SSD 持久性磁盘相比，本地 SSD 具有更高的吞吐量和更低的延时。你存储在本地 SSD 上的数据只持续到实例停止或删除。欲了解更多信息，请参阅[本节。](https://cloud.google.com/compute/docs/disks#localssds)

#### 可抢占节点(beta)

可抢占节点，也称为可抢占虚拟机，是计算引擎虚拟机实例，一般情况下最多持续 24 小时，不提供可用性保证。欲了解更多信息，请参阅[本页面。](https://cloud.google.com/kubernetes-engine/docs/how-to/preemptible-vms)

#### 自动修复

GKE 的节点自动修复功能可以帮助你保持集群中的节点处于健康、运行状态。启用后，GKE 会对集群中每个节点的健康状态进行定期检查。如果一个节点在较长的时间内没有通过连续的健康检查，GKE 就会为该节点启动修复程序。欲了解更多信息，请参阅[自动修复节点。](https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-repair)

#### 节点池自动缩放

启用基于集群负载的节点池自动缩放。欲了解更多信息，请参阅[添加具有自动缩放功能的节点池](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-autoscaler#adding_a_node_pool_with_autoscaling)的文档。

#### 污点

当你对一个节点应用污点时，只有能容忍污点的 Pod 才允许在该节点上运行。在 GKE 集群中，你可以将污点应用到节点池中，从而将污点应用到池中的所有节点。

#### 节点标签

你可以给节点池贴上标签，将标签应用到池中的所有节点上。

无效的标签会阻止升级，或者会阻止Rancher启动。关于标签语法要求的详细信息，请参见[Kubernetes文档。](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)

### 安全选项

#### 服务帐户

用 JSON 私钥创建一个[服务账户](https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts)，并在这里提供 JSON。参见[Google Cloud docs](https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances)了解更多关于创建服务账户的信息。这些 IAM 角色是必需的。计算浏览器（`roles/compute.viewer`），（项目）浏览器（`roles/viewer`），Kubernetes 引擎管理员（`roles/container.admin`），服务账户用户（`roles/iam.serviceAccountUser`）。关于角色的更多信息可以找到[这里。](https://cloud.google.com/kubernetes-engine/docs/how-to/iam-integration)

#### 访问作用域

访问作用域是为你的节点指定权限的传统方法。

- **允许默认访问：**新集群的默认访问是[计算引擎默认服务账户。](https://cloud.google.com/compute/docs/access/service-accounts?hl=en_US#default_service_account)
- **允许完全访问所有云 API**：一般来说，你可以只设置云平台的访问范围，允许完全访问所有云 API，然后只授予服务账户相关的 IAM 角色。授予虚拟机实例的访问范围和授予服务账户的 IAM 角色的组合决定了服务账户对该实例的访问量。
- **为每个 API 设置访问权限：**或者，您可以选择设置特定的作用域，允许访问服务将调用的特定 API 方法。

欲了解更多信息，请参阅[关于为虚拟机启用服务账户的部分。](https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances)
