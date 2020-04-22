---
title: 手动快速部署
description: 手动快速部署 Rancher Server 包括以下四个步骤。
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
  - 快速入门
  - 部署Rancher Server
  - 手动快速部署
---

## 概述

手动快速部署 Rancher Server 包括以下四个步骤：

- [运行 Linux 主机](#运行-linux-主机)
- [安装 Rancher 2.x](#安装-rancher-2x)
- [登录 Rancher 2.x 并配置初始设置](#登录-rancher-界面并配置初始设置)
- [创建业务集群](#创建业务集群)

## 运行 Linux 主机:

首先，您需要运行一台 Linux 主机，Rancher 支持的 Linux 主机类型包括：

- 云端虚拟机（如 Amazon ECS、阿里云 ECS、腾讯云 CVM、华为云 ECS 等）
- 本地数据中心的虚拟机
- 裸金属服务器（BMS）

  > **说明：**
  >
  > 如果您使用的是云端虚拟机，请开放 **80 端口**和 **443 端口**的流入流量，详情请参考云服务提供商的文档。
  >
  > 有关业务集群的端口的详细要求，请参考[下游集群节点要求](/docs/cluster-provisioning/node-requirements/_index)。

  请按照[具体要求](/docs/installation/requirements/_index)配置 Linux 主机。

## 安装 Rancher 2.x

首先连接到主机，然后使用 shell 安装 Rancher。

1.  使用 shell 工具（如 PuTTy 或其他连接工具）登录 Linux 主机。

2.  执行以下命令：

    ```
    sudo docker run -d --restart=unless-stopped -p 80:80 -p 443:443 rancher/rancher
    ```

**结果：** Rancher 已经安装在了 Linux 主机上。

## 登录 Rancher 界面并配置初始设置

您需要先登录 Rancher，然后再开始使用 Rancher。登录以后，您需要完成一些一次性的配置。

1.  打开浏览器，输入主机的 IP 地址：`https://<SERVER_IP>`

    请使用真实的主机 IP 地址替换 `<SERVER_IP>` 。

1.  首次登录时，请按照页面提示设置登录密码。

1.  设置 **Rancher Server URL**。URL 既可以是一个 IP 地址，也可以是一个主机名称。请确保您在集群内添加的每个节点都可以连接到这个 URL。如果您使用的是主机名称，请保证主机名称可以被节点的 DNS 服务器成功解析。

**结果：**完成 Rancher 管理员用户的密码设置和访问地址设置。下次使用 Rancher 时，可以输入 IP 地址或主机地址访问 Rancher 界面，然后输入管理员用户名`admin`和您设置的密码登录 Rancher 界面。

## 创建业务集群

完成安装和登录 Rancher 的步骤之后，您现在可以参考以下步骤，在 Rancher 中创建第一个 Kubernetes 集群。

在这个任务中，您可以使用**自定义集群**选项，使用的**任意** Linux 主机（云主机、虚拟机或裸金属服务器）创建集群。

1. 访问**集群**页面，单击**添加集群**。

1. 选择**自定义**选项。

1. 输入**集群名称**。

1. 跳过**集群角色**和**集群选项**。

1. 单击**下一步**。

1. 勾选**主机选项 - 角色选择**中的所有角色： **Etcd**、 **Control** 和 **Worker**。

1. **可选：** Rancher 会自动探查用于 Rancher 通信和集群通信的 IP 地址。您可以通过**主机选项 > 显示高级选项**中的`公网地址`和`内网地址`指定 IP 地址。

1. 跳过**主机标签**参数，因为对快速入门来说，这部分的参数不太重要。

1. 复制代码框中的命令。

1. 登录您的 Linux 主机，打开命令行工具，粘贴命令，单击回车键运命令。

1. 运行完成后，回到 Rancher 界面，单击**完成**。

**结果：** 在 Rancher 中创建了一个 Kubernetes 集群。

## 后续操作

创建了集群后，您可以使用 Rancher 部署工作负载，详情请参考[部署工作负载](/docs/quick-start-guide/workload/_index)。
