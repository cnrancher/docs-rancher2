---
title: 其他安装方式
weight: 3
---

### 离线安装

按照[以下步骤]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap)在离线环境中安装 Rancher Server。

离线环境可以是 Rancher Server 离线安装、防火墙后面或代理后面。

### Docker 安装

[单节点 Docker 安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker)适用于想要测试 Rancher 的用户。你无需使用 Helm 在 Kubernetes 集群上运行 Rancher，你可以使用 `docker run` 命令，把 Rancher Server 组件安装到单个节点上。

Docker 安装仅用于开发和测试环境。

由于只有一个节点和一个 Docker 容器，因此，如果该节点发生故障，由于其他节点上没有可用的 etcd 数据副本，你将丢失 Rancher Server 的所有数据。

Rancher backup operator 可将 Rancher 从单个 Docker 容器迁移到高可用 Kubernetes 集群上。详情请参见[把 Rancher 迁移到新集群]({{<baseurl>}}/rancher/v2.6/en/backups/migrating-rancher)。
