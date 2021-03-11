---
title: "3、安装 Kubernetes 集群"
description: 本节介绍如何准备启动 Kubernetes 集群，该集群用于为私有环境部署 Rancher Server。
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
  - Rancher 高可用 Helm2 离线安装
  - 安装 Kubernetes 集群
---

> Helm 3 已经发布，Rancher 提供了使用 Helm 3 安装 Rancher 的操作指导。
> Helm 3 的易用性和安全性都比 Helm 2 更高，如果您使用的是 Helm 2，我们建议您首先将 Helm 2[迁移到 Helm 3](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)，然后使用 Helm3 安装 Rancher。
> 本文提供了较早版本的使用 Helm 2 安装 Rancher 高可用的安装方法，如果无法升级到 Helm 3，可以使用此方法。

本节介绍如何准备启动 Kubernetes 集群，该集群用于为私有环境部署 Rancher Server。

因为 Rancher 高可用安装需要 Kubernetes 集群，所以需要使用[Rancher Kubernetes Engine](/docs/rke/_index)（RKE）来部署 Kubernetes 集群。在安装 Kubernetes 之前，您需要先[安装 RKE](/docs/rke/installation/_index)，并且创建一个 RKE 配置文件。

## 创建 RKE 配置文件

在可以访问主机节点上的端口 22 / tcp 和 6443 / tcp 的系统上，使用以下示例创建一个名为`rancher-cluster.yml`的新文件。该文件是 Rancher Kubernetes Engine 的配置文件（RKE 配置文件）。

使用您创建的[3 个节点](/docs/rancher2.5/installation/options/air-gap-helm2/prepare-nodes/_index)的 IP 地址或 DNS 名称，替换下面的代码示例中的值。

> **提示：**有关可用选项的更多详细信息，请参见 RKE [配置选项](/docs/rke/config-options/_index)。

<figcaption>RKE 选项</figcaption>

| 选项               | 必选             | 描述                                                       |
| :----------------- | :--------------- | :--------------------------------------------------------- |
| `address`          | ✓                | 离线环境中节点的 DNS 或 IP                                 |
| `user`             | ✓                | 可以在节点上执行 docker 命令的用户                         |
| `role`             | ✓                | 给节点分配的 Kubernetes 角色列表                           |
| `internal_address` | 可选<sup>1</sup> | 离线环境中节点的内部 DNS 或内网 IP                         |
| `ssh_key_path`     |                  | 用来登录节点的 SSH 私钥文件路径（默认值为`~/.ssh/id_rsa`） |

> <sup>1</sup> 如果您想使用自引用安全组或防火墙，某些服务（如 AWS EC2）需要设置`internal_address`。

```yaml
nodes:
  - address: 10.10.3.187 # 离线环境节点 IP
    internal_address: 172.31.7.22 # 节点内网 IP
    user: rancher
    role: ["controlplane", "etcd", "worker"]
    ssh_key_path: /home/user/.ssh/id_rsa
  - address: 10.10.3.254 # 离线环境节点 IP
    internal_address: 172.31.13.132 # 节点内网 IP
    user: rancher
    role: ["controlplane", "etcd", "worker"]
    ssh_key_path: /home/user/.ssh/id_rsa
  - address: 10.10.3.89 # 离线环境节点 IP
    internal_address: 172.31.3.216 # 节点内网 IP
    user: rancher
    role: ["controlplane", "etcd", "worker"]
    ssh_key_path: /home/user/.ssh/id_rsa

private_registries:
  - url: <REGISTRY.YOURDOMAIN.COM:PORT> # 私有镜像库地址
    user: rancher
    password: "*********"
    is_default: true
```

## 执行 RKE

配置完`rancher-cluster.yml`之后，启动您的 Kubernetes 集群：

```
rke up --config ./rancher-cluster.yml
```

## 保存文件

故障排查和升级集群时，需要用到以下文件，请将它们的的副本保存在安全的位置：

- `rancher-cluster.yml`：RKE 配置文件
- `kube_config_rancher-cluster.yml`：[Kubeconfig 文件](/docs/rke/kubeconfig/_index)
- `rancher-cluster.rkestate`：[Kubernetes 集群状态文件](/docs/rke/installation/_index)

> **注意：** 后两个文件名的“rancher-cluster”部分取决于您如何命名 RKE 集群的配置文件。

## 遇到了问题？

如果您在使 Helm 2 离线安装 Rancher 的过程中碰到问题，请查看[问题排查](/docs/rancher2.5/installation/options/troubleshooting/_index)。

## 后续操作

[安装 Rancher](/docs/rancher2.5/installation/options/air-gap-helm2/install-rancher/_index)
