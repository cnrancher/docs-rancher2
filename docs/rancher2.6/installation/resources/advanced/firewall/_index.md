---
title: 使用 firewalld 打开端口
weight: 1
---

> 我们建议禁用 firewalld。如果你的 Kubernetes 版本是 1.19，请务必禁用 firewalld。

某些 [源自 RHEL](https://en.wikipedia.org/wiki/Red_Hat_Enterprise_Linux#Rebuilds) 的 Linux 发行版（包括 Oracle Linux）的默认防火墙规则可能会阻止与 Helm 的通信。

例如，AWS 中的一个 Oracle Linux 镜像具有 REJECT 规则，这些规则会阻止 Helm 与 Tiller 通信：

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

你可运行以下命令检查默认防火墙规则：

```
sudo iptables --list
```

下文介绍如何使用 `firewalld`，将[防火墙端口规则]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/ports)应用到高可用 Rancher Server 集群中的节点。

## 前提

安装 v7.x 或更高版本的 `firewalld`：

```
yum install firewalld
systemctl start firewalld
systemctl enable firewalld
```

## 应用防火墙端口规则

在 Rancher 高可用安装中，Rancher Server 设置在三个节点上，三个节点均具有 Kubernetes 的所有三个角色（etcd、controlplane 和 worker）。如果你的 Rancher Server 节点同时具有这三个角色，请在每个节点上运行以下命令：

```
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
如果你的 Rancher Server 节点配置了单独的角色，请根据节点角色运行以下命令：

```
# 在 etcd 节点上运行以下命令：
firewall-cmd --permanent --add-port=2376/tcp
firewall-cmd --permanent --add-port=2379/tcp
firewall-cmd --permanent --add-port=2380/tcp
firewall-cmd --permanent --add-port=8472/udp
firewall-cmd --permanent --add-port=9099/tcp
firewall-cmd --permanent --add-port=10250/tcp

# 在 controlplane 节点上运行以下命令：
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

# 在 worker 节点上运行以下命令：
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

在节点上运行 `firewall-cmd` 命令后，使用以下命令启用防火墙规则：

```
firewall-cmd --reload
```

**结果**：防火墙已更新，因此 Helm 可以与 Rancher Server 节点通信了。
