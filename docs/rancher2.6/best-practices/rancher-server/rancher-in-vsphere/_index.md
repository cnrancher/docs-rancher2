---
title: 在 vSphere 环境中安装 Rancher
shortTitle: vSphere 环境中的 Rancher
weight: 3
---

本指南概述了在 vSphere 环境中在 RKE Kubernetes 集群上安装 Rancher 的参考架构，以及 VMware 记录的标准 vSphere 最佳实践。

- [1. 负载均衡器注意事项](#1-load-balancer-considerations)
- [2. 虚拟机注意事项](#2-vm-considerations)
- [3. 网络注意事项](#3-network-considerations)
- [4. 存储注意事项](#4-storage-considerations)
- [5. 备份和灾难恢复](#5-backups-and-disaster-recovery)

<figcaption>解决方案概述</figcaption>

![解决方案概述](/docs/img/rancher/rancher-on-prem-vsphere.svg)

## 1. 负载均衡器注意事项

你需要使用一个负载均衡器将流量转发到 RKE 节点上的 Rancher 工作负载。

### 利用容错和高可用性

请充分利用具有继承高可用功能的外部（硬件或软件）负载均衡器（如：F5、NSX-T、Keepalived 等）。

### 备份负载均衡器配置

在灾难恢复时，可用的负载均衡器配置可以加快恢复过程。

### 配置健康检查

让负载均衡器在健康检查失败时自动将节点标记为不可用。例如，NGINX 可以通过以下配置来实现这一功能：

`max_fails=3 fail_timeout=5s`

### 利用外部负载均衡器

避免在管理集群内使用软件负载均衡器。

### 安全访问 Rancher

将防火墙/ACL 规则配置为只允许 Rancher 访问。

## 2. 虚拟机注意事项

### 根据 Rancher 文档确定虚拟机的大小

请参见[安装要求](https://rancher.com/docs/rancher/v2.6/en/installation/requirements/)来确定虚拟机的大小。

### 利用虚拟机模板来构建环境

为了保证跨环境部署的虚拟机的一致性，你可以考虑使用虚拟机模板形式的黄金镜像（golden image）。你可以使用 Packer 来实现，从而增加更多自定义选项。

### 利用 DRS 反亲和规则（可能的话）在 ESXi 主机上分离 Rancher 集群节点

这样可以确保节点虚拟机分布在多台 ESXi 主机上，从而防止主机级别的单点故障。

### 利用 DRS 反亲和规则（可能的话）在 Datastore 上分离 Rancher 集群节点

这样可以确保节点虚拟机分布在多个 Datastore 上，从而防止 Datastore 级别的单点故障。

### 为 Kubernetes 配置合适的虚拟机

在部署节点时，请遵循 K8s 和 etcd 的最佳实践，其中包括禁用 swap，检查集群中的所有机器之间是否有良好的网络连接，为每个节点使用唯一的主机名、MAC 地址和 `product_uuids`。

## 3. 网络注意事项

### 利用 ETCD 节点之间的低延迟和高带宽连接

尽可能在单个数据中心内部署 etcd 成员，来避免延迟开销并减少网络分区的可能性。大多数情况下，1Gb 的连接就足够了。对于大型集群，10Gb 的连接可以缩短恢复备份所需的时间。

### 为虚拟机提供固定的 IP 地址

你可以为使用的所有节点都配置一个静态 IP。如果使用 DHCP，则每个节点应该有一个 DHCP 预留，以确保节点分配到相同的 IP 地址。

## 4. 存储注意事项

### 在 ETCD 节点上使用 SSD 磁盘

ETCD 对写入延迟非常敏感。因此，你可以尽量使用 SSD 磁盘来提高写入性能。

## 5. 备份和灾难恢复

### 定期备份管理集群

Rancher 将数据存储在它所在的 Kubernetes 集群的 ETCD datastore 中。与其它 Kubernetes 集群一样，你需要对该集群进行频繁且经过测试的备份。

### 备份 Rancher 集群节点虚拟机

将 Rancher 管理节点的虚拟机纳入标准的虚拟机备份策略中。
