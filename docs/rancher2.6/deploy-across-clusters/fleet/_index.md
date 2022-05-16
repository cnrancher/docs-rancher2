---
title: Fleet - 大规模的 GitOps
weight: 1
---

Fleet 是大规模的 GitOps。你可以使用 Fleet 管理多达一百万个集群。Fleet 非常轻量，可以很好地用于[单个集群](https://fleet.rancher.io/single-cluster-install/)，但是在你达到[大规模](https://fleet.rancher.io/multi-cluster-install/)时，它能发挥更强的实力。此处的大规模指的是大量集群、大量部署、或组织中存在大量团队的情况。

Fleet 是一个独立于 Rancher 的项目，你可以使用 Helm 将它安装在任何 Kubernetes 集群上。

- [架构](#architecture)
- [在 Rancher UI 中访问 Fleet](#accessing-fleet-in-the-rancher-ui)
- [Windows 支持](#windows-support)
- [GitHub 仓库](#github-repository)
- [在代理后使用 Fleet](#using-fleet-behind-a-proxy)
- [Helm Chart 依赖](#helm-chart-dependencies)
- [故障排查](#troubleshooting)
- [文档](#documentation)

## 架构

有关 Fleet 工作原理的信息，请参阅[此页面](./architecture)。

## 在 Rancher UI 中访问 Fleet

Fleet 预装在 Rancher 中，通过 Rancher UI 中的**持续交付**选项管理。有关持续交付和 Fleet 故障排除技巧的更多信息，请参阅[此处](https://fleet.rancher.io/troubleshooting/)。

用户可以通过遵循 **gitops** 的实践，利用持续交付将应用部署到 git 仓库中的 Kubernetes 集群，而无需任何手动操作。

按照以下步骤在 Rancher UI 中访问持续交付：

1. 单击 **☰ > 持续交付**。

1. 在菜单顶部选择你的命名空间，注意以下几点：
   - 默认情况下会选中 `fleet-default`，其中包括注册到 Rancher 的所有下游集群。
   - 你可以切换到仅包含 `local` 集群的 `fleet-local`，或者创建自己的工作空间，并将集群分配和移动到该工作空间。
   - 然后，你可以单击左侧导航栏上的**集群**来管理集群。

1. 单击左侧导航栏上的 **Git 仓库**将 git 仓库部署到当前工作空间中的集群中。

1. 选择你的 [git 仓库](https://fleet.rancher.io/gitrepo-add/)和[目标集群/集群组](https://fleet.rancher.io/gitrepo-structure/)。你还可以单击左侧导航栏中的**集群组**在 UI 中创建集群组。

1. 部署 git 仓库后，你可以通过 Rancher UI 监控应用。

## Windows 支持

有关对具有 Windows 节点的集群的支持的详细信息，请参阅[此页面](./windows)。


## GitHub 仓库

你可以单击此处获取 [Fleet Helm Chart](https://github.com/rancher/fleet/releases/latest)。


## 在代理后使用 Fleet

有关在代理后使用 Fleet 的详细信息，请参阅[此页面](./proxy)。

## Helm Chart 依赖

由于用户需要完成依赖列表，因此为了成功部署具有依赖项的 Helm Chart，你必须手动运行命令（如下所列）。如果你不这样做，并继续克隆仓库并运行 `helm install`，由于依赖项将丢失，因此你的安装将失败。

git 仓库中的 Helm Chart 必须在 Chart 子目录中包含其依赖项。你必须手动运行 `helm dependencies update $chart`，或在本地运行 `helm dependencies build $chart`，然后将完整的 Chart 目录提交到你的 git 仓库。请注意，你需要使用适用的参数修改命令。

## 故障排查

---
* **已知问题**：Fleet git 仓库的 clientSecretName 和 helmSecretName 密文不包含在 [backup-restore-operator]({{<baseurl>}}/rancher/v2.6/en/backups/back-up-rancher/#1-install-the-rancher-backups-operator) 创建的备份或恢复中。如果我们有了永久的解决方案，我们将通知社区。

* **临时解决方法：** </br>
   默认情况下，用户定义的密文不会在 Fleet 中备份。如果执行灾难恢复或将 Rancher 迁移到新集群，则需要重新创建密文。要修改 resourceSet 以包含需要备份的其他资源，请参阅[此文档](https://github.com/rancher/backup-restore-operator#user-flow)。

---

## 文档

Fleet 文档链接：[https://fleet.rancher.io/](https://fleet.rancher.io/)
