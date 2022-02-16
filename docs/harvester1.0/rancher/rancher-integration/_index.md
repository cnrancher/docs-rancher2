---
title: Rancher 集成
keywords:
  - Harvester
  - harvester
  - Rancher
  - rancher
  - Rancher 集成
  - Harvester Rancher 集成
description: Rancher 是一个开源的多集群管理平台。从 Rancher v2.6.1 开始，Harvester 默认集成 Rancher。
---

## 概述

_从 v0.3.0 起可用_

[Rancher](https://github.com/rancher/rancher) 是一个开源的多集群管理平台。从 Rancher v2.6.1 开始，Harvester 默认集成 Rancher。

> 注意
> Harvester v1.0.0 仅与 Rancher v2.6.3 或更高版本兼容。

你现在可以使用 Rancher 的[可视化管理](virtualization-management.md)页面导入和管理多个 Harvester 集群，并利用 Rancher 的[认证](https://rancher.com/docs/rancher/v2.6/en/admin-settings/authentication/)功能和 RBAC 控制来实现[多租户](https://rancher.com/docs/rancher/v2.6/en/admin-settings/rbac/)支持。

<div class="text-center">
<iframe width="950" height="475" src="https://www.youtube.com/embed/fyxDm3HVwWI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

![virtualization-management](assets/virtualization-management.png)

## 部署 Rancher

要通过 Harvester 使用 Rancher，请将 Rancher 和 Harvester 安装在两个独立的服务器中。如果你想试用集成功能，你可以在 Harvester 中创建一个虚拟机，然后安装 Rancher v2.6.3 或以上版本。

### 快速入门指南

1. 配置 Linux 主机来创建自定义集群。你的主机可以是以下任何一种：
   - 云虚拟机
   - 本地虚拟机
   - 服务器
1. 使用你惯用的 shell（例如 PuTTy 或远程终端连接）登录你的 Linux 主机。
1. 在 shell 中，输入以下命令：

```shell
# 为了快速评估，你可以使用以下命令运行 Rancher Server
$ sudo docker run -d --restart=unless-stopped -p 80:80 -p 443:443 --privileged rancher/rancher:v2.6.3
```

> 注意
> 有关如何部署 Rancher Server 的更多信息，请参见 [Rancher 文档](https://rancher.com/docs/rancher/v2.6/en/quick-start-guide/deployment/)。

## 虚拟化管理

借助 Rancher 的虚拟化管理功能，你可以导入和管理 Harvester 集群。
通过单击其中一个集群，你可以查看和管理导入的 Harvester 集群资源，例如主机、虚拟机、镜像、卷等。此外，`虚拟化管理`利用了现有的 Rancher 功能，例如通过各种验证提供程序进行身份验证和多租户支持。

详情请查看[虚拟化管理](virtualization-management.md)页面。

![import-cluster](assets/import-harvester-cluster.png)

## 使用 Harvester 主机驱动创建 Kubernetes 集群

[Harvester Node Driver](node-driver.md) 用于在 Harvester 集群中配置虚拟机，而 Rancher 会使用这些虚拟机来启动和管理 Kubernetes 集群。

从 Rancher `v2.6.1` 开始，默认添加了 Harvester Node Driver。详情请参见 [node-driver](node-driver.md) 页面。

> 注意
> 带有 RKE2/K3s 的 Harvester 主机驱动处于技术预览阶段。
