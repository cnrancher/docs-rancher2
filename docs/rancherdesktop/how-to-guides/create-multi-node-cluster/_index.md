---
title: 使用 k3d 创建多节点集群
description: 介绍如何使用 k3d 创建多节点集群
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
  - Rancher Desktop
  - rancher desktop
  - rancherdesktop
  - RancherDesktop
  - k3d 
  - 多节点集群
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Rancher Desktop 支持**单节点集群**设置，这满足大多数本地开发场景。但是，在某些用例中，你可能需要创建多节点集群，或启动多个集群并灵活地在集群之间切换。尽管 Rancher Desktop 没有内置的多节点/集群功能，但你可以同时使用 [k3d](https://k3d.io) 与 Rancher Desktop 来实现同样的功能。k3d 是一个轻量级的包装器，用于在 Docker 中运行 k3s（一个最小化的 Kubernetes 发行版，Rancher Desktop 也使用它）。k3d 能让你轻松在 Docker 中创建单节点和多节点 k3s 集群（例如用于 Kubernetes 上的本地开发）。

### 启动多节点集群的步骤

1. 确保在 **Kubernetes Settings** 页面中选择了 **dockerd(moby)** 作为容器运行时。

2. 安装 k3d。

<Tabs
defaultValue="wget"
values={[
{ label: 'wget', value: 'wget', },
{ label: 'curl', value: 'curl', },
]}>
<TabItem value="wget">

```
wget -q -O - https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
```

</TabItem>
  <TabItem value="curl">

```
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
```

</TabItem>
</Tabs>

3. 运行 `k3d cluster create` 命令来启动多节点集群。例如：

```
k3d cluster create two-node-cluster --agents 2
k3d cluster create three-node-cluster --agents 3
```

4. k3d 将新创建的集群设置为 active。你可以通过 `kubectl config use-context` 命令来切换集群。例如：

```
kubectl config use-context k3d-two-node-cluster
```
要了解有关 **k3s** 和 **k3d** 的更多信息，请参阅这些项目的文档（[k3s 文档](https://rancher.com/docs/k3s/latest/en/) 和 [k3d 文档](https://k3d.io/)）。

**:warning: 请注意，`k3d` 创建的集群不是通过 Rancher Desktop GUI 管理的。**
