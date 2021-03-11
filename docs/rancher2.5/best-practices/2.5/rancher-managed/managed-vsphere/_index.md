---
title: Rancher托管vSphere集群的最佳实践
description: description
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
  - 最佳实践
  - Rancher托管vSphere集群的最佳实践
---

除了 VMware 记录的标准 vSphere 最佳实践外，本指南还概述了在 vSphere 环境中配置下游 Rancher 集群的参考架构。

**解决方案概述**

![Solution Overview](/img/rancher/solution_overview.drawio.svg)

## 1. 虚拟机注意事项

### 充分利用模板来构建环境

为了促进整个环境中部署的虚拟机的一致性，可以考虑使用虚拟机模板形式的 "Golden Images"。可以使用 Packer 来实现这一点，增加更多的自定义选项。

### 利用 DRS 反亲和规则（如果可能）在 ESXi 主机上分离下游集群节点

这样做将确保节点虚拟机分布在多台 ESXi 主机上--防止主机级别的单点故障。

### 利用 DRS 反亲和规则（如果可能）在整个数据存储区中分离下游集群节点

这样做可以确保节点虚拟机分布在多个数据存储上，防止在数据存储层面出现单点故障。

#### 为 Kubernetes 配置合适的虚拟机

在部署节点时，遵循 K8s 和 etcd 的最佳实践是很重要的，包括禁用 swap，仔细检查你在集群中的所有机器之间有完好的网络连接，为每个节点使用唯一的主机名、MAC 地址和 product_uuids。

## 2. 网络注意事项

#### 利用 ETCD 节点之间的低延迟、高带宽连接

尽可能在单个数据中心内部署 etcd 成员，以避免延迟开销并减少网络分区的可能性。对于大多数设置，1Gb 连接就足够了。对于大型集群，10Gb 连接可以减少从备份恢复所需的时间。

### 为虚拟机提供固定的 IP 地址

使用的每个节点都应该配置一个静态 IP。在 DHCP 的情况下，每个节点应该有一个 DHCP 预留，以确保节点获得相同的 IP 分配。

## 3. 储存注意事项

#### 建议 ETCD 节点使用 SSD 硬盘

ETCD 对写入延迟非常敏感。因此，尽可能地使用 SSD 磁盘。

## 4. 备份和灾难恢复

### 定期执行下游集群备份

Kubernetes 使用 etcd 来存储其所有数据--从配置、状态和元数据。在灾难恢复的情况下，备份这些数据是至关重要的。

### 备份下游节点虚拟机

将 Rancher 下游节点虚拟机纳入标准虚拟机备份策略中。
