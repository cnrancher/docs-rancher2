---
title: 在 vSphere 环境中安装 Rancher
description: description
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
  - subtitles1
  - subtitles2
  - subtitles3
  - subtitles4
  - subtitles5
  - subtitles6
---

本指南概述了在vSphere环境中的RKE Kubernetes集群上安装Rancher的参考架构，以及VMware记录的标准vSphere最佳实践。

- [1. 负载均衡器的注意事项](#1-负载均衡器的注意事项)
- [2. VM 注意事项](#2-vm-注意事项)
- [3. 网络注意事项](#3-网络注意事项)
- [4. 储存注意事项](#4-储存注意事项)
- [5. 备份和灾难恢复](#5-备份和灾难恢复)

**解决方案概述**

![Solution Overview](/img/rancher/rancher-on-prem-vsphere.svg)

## 1. 负载均衡器的注意事项

需要一个负载均衡器将流量引导到RKE节点上的Rancher工作负载。

#### 利用容错和高可用性

充分利用具有继承高可用功能的外部（硬件或软件）负载均衡器（如：F5、NSX-T、Keepalived等）。

#### 备份负载均衡器配置

在发生灾难恢复时，负载均衡器配置的可用性将加快恢复过程。

#### 配置健康检查

配置负载均衡器在健康检查失败时自动将节点标记为不可用。例如，NGINX可以通过以下配置来实现这一功能：

`max_fails=3 fail_timeout=5s`

#### 充分利用外部负载均衡器

避免在管理集群内实施软件负载均衡器。

#### 安全访问Rancher

配置适当的防火墙/ACL规则，只允许对Rancher的访问。

## 2. VM 注意事项

#### 根据Rancher文档确定虚拟机的大小

https://rancher.com/docs/rancher/v2.x/en/installation/requirements/

#### 充分利用虚拟机模板来构建环境

为了促进整个环境中部署的虚拟机的一致性，可以考虑使用虚拟机模板形式的 "Golden Images"。可以使用Packer来实现这一点，增加更多的自定义选项。

#### 利用 DRS 反亲和规则（如果可能）在 ESXi 主机上分离 Rancher 集群节点

这样做将确保节点虚拟机分布在多台ESXi主机上--防止主机级别的单点故障。

#### 利用 DRS 反亲和规则（如果可能）在整个数据存储区中分离Rancher群集节点

这样做可以确保节点虚拟机分布在多个数据存储上，防止在数据存储层面出现单点故障。

#### 为Kubernetes配置合适的虚拟机

在部署节点时，遵循K8s和etcd的最佳实践是很重要的，包括禁用swap，仔细检查你在集群中的所有机器之间有完好的网络连接，为每个节点使用唯一的主机名、MAC地址和product_uuids。

## 3. 网络注意事项

#### 利用ETCD节点之间的低延迟、高带宽连接

尽可能在单个数据中心内部署etcd成员，以避免延迟开销并减少网络分区的可能性。对于大多数设置，1Gb连接就足够了。对于大型集群，10Gb连接可以减少从备份恢复所需的时间。

#### 为虚拟机提供固定的IP地址

使用的每个节点都应该配置一个静态IP。在DHCP的情况下，每个节点应该有一个DHCP预留，以确保节点获得相同的IP分配。

## 4. 储存注意事项

#### 建议ETCD节点使用SSD硬盘

ETCD对写入延迟非常敏感。因此，尽可能地使用SSD磁盘。

## 5. 备份和灾难恢复

#### 定期执行管理集群备份

Rancher将其数据存储在其所在的Kubernetes集群的ETCD数据存储中。与任何Kubernetes群集一样，对该群集执行频繁且经过测试的备份。

#### 备份Rancher集群节点虚拟机

将Rancher管理节点的虚拟机纳入标准的虚拟机备份策略中。
