---
title: Rancher 管理 vSphere 集群的最佳实践
shortTitle: Rancher 在 vSphere 托管的集群
---

本指南概述了在 vSphere 环境中配置下游 Rancher 集群的参考架构，以及 VMware 记录的标准 vSphere 最佳实践。

- [1. 虚拟机注意事项](#1-vm-considerations)
- [2. 网络注意事项](#2-network-considerations)
- [3. 存储注意事项](#3-storage-considerations)
- [4. 备份和灾难恢复](#4-backups-and-disaster-recovery)

<figcaption>解决方案概述</figcaption>

![解决方案概述]({{<baseurl>}}/img/rancher/solution_overview.drawio.svg)

## 1. 虚拟机注意事项

### 利用虚拟机模板来构建环境

为了保证跨环境部署的虚拟机的一致性，你可以考虑使用虚拟机模板形式的黄金镜像（golden image）。你可以使用 Packer 来实现，从而增加更多自定义选项。

### 利用 DRS 反亲和规则（可能的话）在 ESXi 主机上分离下游集群节点

这样可以确保节点虚拟机分布在多台 ESXi 主机上，从而防止主机级别的单点故障。

### 利用 DRS 反亲和规则（可能的话）在 Datastore 上分离下游集群节点

这样可以确保节点虚拟机分布在多个 Datastore 上，从而防止 Datastore 级别的单点故障。

### 为 Kubernetes 配置合适的虚拟机

在部署节点时，请遵循 K8s 和 etcd 的最佳实践，其中包括禁用 swap，检查集群中的所有机器之间是否有良好的网络连接，为每个节点使用唯一的主机名、MAC 地址和 `product_uuids`。

## 2. 网络注意事项

### 利用 ETCD 节点之间的低延迟和高带宽连接

尽可能在单个数据中心内部署 etcd 成员，来避免延迟开销并减少网络分区的可能性。大多数情况下，1Gb 的连接就足够了。对于大型集群，10Gb 的连接可以缩短恢复备份所需的时间。

### 为虚拟机提供固定的 IP 地址

你可以为使用的所有节点都配置一个静态 IP。如果使用 DHCP，则每个节点都应该有一个 DHCP 预留，以确保节点分配到相同的 IP 地址。

## 3. 存储注意事项

### 在 ETCD 节点上使用 SSD 磁盘

ETCD 对写入延迟非常敏感。因此，你可以尽量使用 SSD 磁盘来提高写入性能。

## 4. 备份和灾难恢复

### 定期备份下游集群

Kubernetes 使用 etcd 来存储其所有数据，包括配置、状态和元数据。在灾难恢复的情况下，备份这些数据是至关重要的。

### 备份下游节点虚拟机

将 Rancher 下游节点的虚拟机纳入标准的虚拟机备份策略中。