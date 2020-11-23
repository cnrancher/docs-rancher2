---
title: DigitalOcean
description: 使用 Rancher 在 DigitalOcean 中创建 Kubernetes 集群。
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
  - 创建集群
  - 创建节点和集群
  - DigitalOcean
---

使用 Rancher 在 DigitalOcean 中创建 Kubernetes 集群。

1.  在`集群列表`界面中，单击`添加集群`。

2.  选择 **DigitalOcean**。

3.  输入**集群名称**。

4.  通过**成员角色**来设置用户访问集群的权限。

    - 单击**添加成员**把需要访问这个集群的用户添加到成员列表中。
    - 在**角色**下拉菜单中选择每个用户的角色，每个角色对应不同的权限。

5.  使用**集群选项**设置 Kubernetes 的版本，网络插件以及是否要启用项目网络隔离。要查看更多集群选项，请单击**显示高级选项**。

6.  将一个或多个节点池添加到您的集群。

    **节点池**是基于节点模板的节点的集合。节点模板定义节点的配置，例如要使用的操作系统，CPU 数量和内存量。每个节点池必须分配一个或多个节点角色。

    :::important 注意：

    - 每个节点角色（即 `etcd`，`Control Plane` 和 `Worker`）应分配给不同的节点池。尽管可以为一个节点池分配多个节点角色，但是不应对生产集群执行此操作。
    - 推荐的设置是拥有一个具有`etcd`节点角色且数量为 3 的节点池，一个具有`Control Plane`节点角色且数量至少为 2 的节点池，以及具有`Worker`节点角色且数量为 1 的节点池。至少两个。关于 `etcd` 节点角色，请参考 [etcd 管理指南](https://etcd.io/#optimal-cluster-size)。

    :::

    1. 单击 **添加节点模板**。注意：从 v2.2.0 开始，账户访问信息存储为云凭证。云凭证会存储为 Kubernetes 的 secret。多个节点模板可以使用相同的云凭证。您可以使用现有的云凭证或创建新的云凭证。要创建新的云凭证，请输入**名称**和**账户访问**数据，然后单击**创建**。

    2. 完成 **Digital Ocean 选项** 表单的填写。

       - **访问令牌** 会存储您的 Digital Ocean 个人访问令牌. 请参照[DigitalOcean 说明：如何生成个人令牌](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-api-v2-with-ansible-2-0-on-ubuntu-16-04#how-to-generate-a-personal-access-token)。

       - **Droplet 选项** 设置集群的地理区域和规格。

    3. [Docker 守护进程](https://docs.docker.com/engine/docker-overview/#the-docker-daemon)配置选项包括：

       - **标签：** 有关标签的信息，请参阅 [Docker 对象标签文档](https://docs.docker.com/config/labels-custom-metadata/)。
       - **Docker 引擎安装 URL：** 决定将在实例上安装哪个 Docker 版本。注意：如果您使用的是 RancherOS，因为配置的默认 Docker 版本可能不可用，请先确认要使用的 RancherOS 版本上可用的 Docker 版本。可以使用 `sudo ros engine list` 检查。如果您在其他操作系统上安装 Docker 时遇到问题，请尝试使用配置的 Docker Engine 安装 URL 手动安装 Docker 进行故障排查。
       - **镜像仓库加速器：** Docker 守护进程使用的 Docker 镜像仓库加速器。
       - **其他高级选项：** 请参阅 [Docker 守护进程选项参考](https://docs.docker.com/engine/reference/commandline/dockerd/)

    4. 单击**创建**。

    5. **可选:** 添加其他节点池。

7.  检查您填写的信息以确保填写正确，然后单击 **创建**。

结果：

- 您的集群已创建并进入为 **Provisioning** 的状态。Rancher 正在启动您的集群。
- 您可以在集群的状态更新为 **Active** 后访问它。
- Rancher 为活动的集群分配了两个项目，即 `Default`（包含命名空间 `default`）和 `System`（包含命名空间 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果命名空间存在）。

## 可选步骤

创建集群后，您可以通过 Rancher UI 访问它。作为最佳实践，我们建议同时设置以下访问集群的替代方法：

- **通过 kubectl CLI 访问集群：** 请按照[这些步骤](/docs/rancher2/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 访问您的集群。在这种情况下，您将通过 Rancher Server 的身份验证代理进行身份验证，然后 Rancher 会将您连接到下游集群。此方法使您无需 Rancher UI 即可管理集群。

- **通过 kubectl CLI 和授权的集群地址访问您的集群：** 请按照[这些步骤](/docs/rancher2/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 直接访问您的集群，而不需要通过 Rancher 进行认证。我们建议您设定此方法访问集群，这样在您无法连接 Rancher 时您仍然能够访问集群。
