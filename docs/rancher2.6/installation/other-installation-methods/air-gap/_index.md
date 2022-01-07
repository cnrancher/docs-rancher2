---
title: 离线 Helm CLI 安装
weight: 1
---

本文介绍如何使用 Helm CLI 在离线环境中安装 Rancher Server。离线环境可以是 Rancher Server 离线安装、防火墙后面或代理后面。

Rancher 安装在 RKE Kubernetes 集群、K3s Kubernetes 集群，或单个 Docker 容器上对应的安装步骤会有所不同。

如需了解各个安装方式的更多信息，请参见[本页]({{<baseurl>}}/rancher/v2.6/en/installation/)。

在安装指导中，我们为不同的安装选项提供对应的 _页签_ 。

> **重要提示**：如果你按照 Docker 安装指南安装 Rancher，你将没有把 Docker 安装转换为 Kubernetes 安装的升级途径。

# 安装概要

1. [设置基础设施和私有镜像仓库]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/prepare-nodes/)
2. [收集镜像到私有镜像仓库]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/populate-private-registry/)
3. [设置 Kubernetes 集群（如果你使用 Docker 安装，请跳过此步骤）]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/launch-kubernetes/)
4. [安装 Rancher]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/install-rancher/)

# 升级

如需在离线环境中使用 Helm CLI 升级 Rancher，请按照[升级步骤]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/upgrades/)进行操作。

### 后续操作
[准备节点]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/prepare-nodes/)
