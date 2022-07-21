---
title: 安装要求
description: RKE2 非常轻便，但有一些最低要求，如下所述。
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
  - RKE2
  - 安装要求
---

RKE2 非常轻便，但有一些最低要求，如下所述。

## 先决条件

两个节点不能有相同的主机名。

如果你的所有节点都有相同的主机名，请在 RKE2 配置文件中设置 `node-name` 参数，让你添加到集群中的每个节点都有不同的节点名。

## 操作系统

### Linux

RKE2 已经在以下操作系统及其后续的非主要版本上进行了测试和验证：

- Ubuntu 18.04 and 20.04 (amd64)
- CentOS/RHEL 7.8 (amd64)
- Rocky/RHEL 8.5 (amd64)
- SLES 15 SP3, OpenSUSE, SLE Micro 5.1 (amd64)

### Windows

**从 v1.21.3+rke2r1 开始，Windows 支持目前是实验性的**。**Windows 支持需要选择 Calico 作为 RKE2 集群的 CNI**。

RKE2 的 Windows 节点（Worker）agent 已经在以下操作系统及其后续非主要版本上进行了测试和验证：

- Windows Server 2019 LTSC (amd64) (OS Build 17763.2061)
- Windows Server 2022 LTSC (amd64) (OS Build 20348.169)

**注意：**需要启用 Windows Server Containers，以便 RKE2 agent 工作。

用管理员权限打开一个新的 Powershell 窗口

```powershell
powershell -Command "Start-Process PowerShell -Verb RunAs"
```

在新的 Powershell 窗口中，运行以下命令。

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Containers –All
```

这将需要重新启动以使 `Containers` 功能正常运行。

## 硬件

硬件要求根据你的部署规模而扩展。这里列出了最低建议：

### Linux

### Linux/Windows

- RAM: 最低 4GB (我们建议至少有 8GB)
- CPU: 最低 2 个 (我们建议至少有 4 个 CPU)

#### 磁盘

RKE2 的性能取决于数据库的性能，由于 RKE2 以嵌入式方式运行 etcd，并将数据目录存储在磁盘上，我们建议尽可能使用 SSD 以确保最佳性能。

## 网络

**重要：** 如果你的节点安装并启用了 NetworkManager，[确保它被配置为忽略 CNI 管理的接口](/docs/rke2/known_issues/_index#networkmanager)。如果你的节点安装并启用了 Wicked，[确保启用了转发 sysctl 配置](https://docs.rke2.io/known_issues/#wicked)。

RKE2 server 需要 6443 和 9345 端口，以便被集群中的其他节点访问。

当使用 Flannel VXLAN 时，所有节点都需要能够通过 UDP 端口 8472 到达其他节点。

如果你想使用 metrics server，你将需要在每个节点上打开 10250 端口。

:::note 注意：
节点上的 VXLAN 端口不应该暴露给外界，因为它将你的集群网络开放给任何人访问。在禁止访问端口 8472 的防火墙/安全组后面运行节点。
:::

RKE2 server 节点的入站规则：

| 协议 | 端口        | 来源                      | 描述                                     |
| ---- | ----------- | ------------------------- | ---------------------------------------- |
| TCP  | 9345        | RKE2 agent 节点           | Kubernetes API                           |
| TCP  | 6443        | RKE2 agent 节点           | Kubernetes API                           |
| UDP  | 8472        | RKE2 server 和 agent 节点 | 仅要求用于 Flannel VXLAN                 |
| TCP  | 10250       | RKE2 server 和 agent 节点 | kubelet                                  |
| TCP  | 2379        | RKE2 server 节点          | etcd client port                         |
| TCP  | 2380        | RKE2 server 节点          | etcd peer port                           |
| TCP  | 30000-32767 | RKE2 server 和 agent 节点 | NodePort 端口范围                        |
| UDP  | 8472        | RKE2 server 和 agent 节点 | Cilium CNI VXLAN                         |
| TCP  | 4240        | RKE2 server 和 agent 节点 | Cilium CNI 健康检查                      |
| ICMP | 8/0         | RKE2 server 和 agent 节点 | Cilium CNI 健康检查                      |
| TCP  | 179         | RKE2 server 和 agent 节点 | Calico CNI with BGP                      |
| UDP  | 4789        | RKE2 server 和 agent 节点 | Calico CNI with VXLAN                    |
| TCP  | 5473        | RKE2 server 和 agent 节点 | Calico CNI with Typha                    |
| TCP  | 9098        | RKE2 server 和 agent 节点 | Calico Typha 健康检查                    |
| TCP  | 9099        | RKE2 server 和 agent 节点 | Calico 健康检查                          |
| TCP  | 5473        | RKE2 server 和 agent 节点 | Calico CNI with Typha                    |
| UDP  | 8472        | RKE2 server 和 agent 节点 | Canal CNI with VXLAN                     |
| TCP  | 9099        | RKE2 server 和 agent 节点 | Canal CNI 健康检查                       |
| UDP  | 51820       | RKE2 server 和 agent 节点 | Canal CNI with WireGuard IPv4            |
| UDP  | 51821       | RKE2 server 和 agent 节点 | Canal CNI with WireGuard IPv6/dual-stack |

通常情况下，所有出站流量都是允许的。

### Windows 特定的入站网络规则

| 协议 | 端口 | 来源             | 描述                         |
| ---- | ---- | ---------------- | ---------------------------- |
| UDP  | 4789 | RKE2 server 节点 | Calico 和 Flannel VXLAN 需要 |

通常情况下，所有出站流量都将被允许。
