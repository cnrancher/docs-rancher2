---
title: 通过 firewalld 放行端口
description: Linux 的一些发行版源自 RHEL，包括 Oracle Linux，可能有默认的防火墙规则来阻止与 Helm 的通信。例如，AWS 中的一个 Oracle Linux 映像具有 REJECT 规则，可阻止 Helm 与 Tiller 通信
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
  - 安装指南
  - 资料、参考和高级选项
  - 功能开关
  - 通过 firewalld 放行端口
---

Linux 的一些发行版[源自 RHEL](https://en.wikipedia.org/wiki/Red_Hat_Enterprise_Linux#Rebuilds)，包括 Oracle Linux，可能有默认的防火墙规则来阻止与 Helm 的通信。

例如，AWS 中的一个 Oracle Linux 映像具有 REJECT 规则，可阻止 Helm 与 Tiller 通信：

```
Chain INPUT (policy ACCEPT)
target     prot opt source               destination
ACCEPT     all  --  anywhere             anywhere             state RELATED,ESTABLISHED
ACCEPT     icmp --  anywhere             anywhere
ACCEPT     all  --  anywhere             anywhere
ACCEPT     tcp  --  anywhere             anywhere             state NEW tcp dpt:ssh
REJECT     all  --  anywhere             anywhere             reject-with icmp-host-prohibited

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination
REJECT     all  --  anywhere             anywhere             reject-with icmp-host-prohibited

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination
```

您可以使用以下命令检查默认防火墙规则：

```
sudo iptables --list
```

本节介绍如何使用`firewalld`为高可用性 Rancher 服务器集群中的节点应用[防火墙端口规则](/docs/rancher2/installation_new/resources/advanced/firewall/_index/)。

## 先决条件

安装 v7.x 或更高版本的`firewalld`：

```bash
yum install firewalld
systemctl start firewalld
systemctl enable firewalld
```

## 应用防火墙端口规则

在 Rancher 高可用性安装指南中，Rancher Server 设置在三个节点上，这三个节点具有 Kubernetes 的所有角色：etcd、controlplane 和 worker。如果您的 Rancher Server 节点具有所有角色，请在每个节点上运行以下命令：

```bash
firewall-cmd --permanent --add-port=22/tcp
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --permanent --add-port=2376/tcp
firewall-cmd --permanent --add-port=2379/tcp
firewall-cmd --permanent --add-port=2380/tcp
firewall-cmd --permanent --add-port=6443/tcp
firewall-cmd --permanent --add-port=8472/udp
firewall-cmd --permanent --add-port=9099/tcp
firewall-cmd --permanent --add-port=10250/tcp
firewall-cmd --permanent --add-port=10254/tcp
firewall-cmd --permanent --add-port=30000-32767/tcp
firewall-cmd --permanent --add-port=30000-32767/udp
```

如果您的 Rancher Server 节点具有单独的非全部角色，请根据节点的角色执行以下命令：

```bash
## 对于etcd节点，运行以下命令：
firewall-cmd --permanent --add-port=2376/tcp
firewall-cmd --permanent --add-port=2379/tcp
firewall-cmd --permanent --add-port=2380/tcp
firewall-cmd --permanent --add-port=8472/udp
firewall-cmd --permanent --add-port=9099/tcp
firewall-cmd --permanent --add-port=10250/tcp

## 对于control plane节点，运行以下命令：
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --permanent --add-port=2376/tcp
firewall-cmd --permanent --add-port=6443/tcp
firewall-cmd --permanent --add-port=8472/udp
firewall-cmd --permanent --add-port=9099/tcp
firewall-cmd --permanent --add-port=10250/tcp
firewall-cmd --permanent --add-port=10254/tcp
firewall-cmd --permanent --add-port=30000-32767/tcp
firewall-cmd --permanent --add-port=30000-32767/udp

## 对于worker nodes节点，运行以下命令：
firewall-cmd --permanent --add-port=22/tcp
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --permanent --add-port=2376/tcp
firewall-cmd --permanent --add-port=8472/udp
firewall-cmd --permanent --add-port=9099/tcp
firewall-cmd --permanent --add-port=10250/tcp
firewall-cmd --permanent --add-port=10254/tcp
firewall-cmd --permanent --add-port=30000-32767/tcp
firewall-cmd --permanent --add-port=30000-32767/udp
```

在节点上运行`firewall-cmd`命令后，使用以下命令重新加载防火墙规则：

```bash
firewall-cmd --reload
```

**结果：** 防火墙已更新，因此 Helm 可以与 Rancher Server 节点通信。
