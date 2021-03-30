---
title: 功能介绍
description: AutoK3s 是用于简化 K3s 集群管理的轻量级工具，您可以使用 AutoK3s 在任何地方运行 K3s，Run K3s Everywhere。您可以使用 AutoK3s 快速创建并启动 K3s 集群，也可以使用它来为已有的 K3s 集群添加节点，不仅提升公有云的使用体验，同时还继承了 kubectl，提供了便捷的集群能力。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - AutoK3s
  - 功能介绍
---

## 什么是 AutoK3s

[K3s](https://github.com/k3s-io/k3s)是经过完全认证的 Kubernetes 产品，在某些情况下可以替代完整的 K8s。使用 K3s 在公有云中创建集群的过程比较复杂，在各个公有云中创建 K3s 集群所需填写的参数也有差异。为了降低 K3s 的使用门槛，简化使用 K3s 的过程，我们开发了 AutoK3s 这一款辅助工具。

AutoK3s 是用于简化 K3s 集群管理的轻量级工具，您可以使用 AutoK3s 在任何地方运行 K3s，Run K3s Everywhere。您可以使用 AutoK3s 快速创建并启动 K3s 集群，也可以使用它来为已有的 K3s 集群添加节点，不仅提升公有云的使用体验，同时还继承了 kubectl，提供了便捷的集群能力。目前 AutoK3s 支持的云服务提供商包括**阿里云、腾讯云和 AWS**，如果您使用的云服务提供商不属于以上三家，您可以使用`native`模式，在任意类型的虚拟机实例中初始化 K3s 集群。在后续的开发过程中，我们会根据社区反馈，为其他云服务提供商提供适配。

AutoK3s 是一款开源的工具，如果您需要提交产品需求，或者是在使用过程中遇到任何问题或，请访问[AutoK3s-GitHub](https://github.com/cnrancher/autok3s)网站，创建 Issue 并描述您的需求或问题，我们会尽快回复。如果您喜欢这款工具，请一键三连（Watch、star 和 fork）！

## 关键特性

- 通过 API、CLI 和 UI 等方式快速创建 K3s。
- 云提供商集成（简化每个云的[CCM](https://kubernetes.io/docs/concepts/architecture/cloud-controller)设置）。
- 灵活的安装选项，例如 K3s 集群 HA 和数据存储（内置 etcd、RDS、SQLite 等）。
- 低成本（尝试每个云中的竞价实例）。
- 通过 UI 简化操作。
- 多云之间弹性迁移，借助诸如[backup-restore-operator](https://github.com/rancher/backup-restore-operator)这样的工具进行弹性迁移。

## 支持的云提供商

AutoK3s 可以支持以下云厂商，我们会根据社区反馈添加更多支持：

- [阿里云](/docs/k3s/autok3s/alibaba/_index) - 在阿里云的 ECS 中初始化 K3s 集群
- [AWS](/docs/k3s/autok3s/aws/_index) - 在亚马逊 EC2 中初始化 K3s 集群
- [腾讯云](/docs/k3s/autok3s/tencent/_index) - 在腾讯云 CVM 中初始化 K3s 集群
- [Native](/docs/k3s/autok3s/native/_index) - 在任意类型 VM 实例中初始化 K3s 集群

## 常用命令

- `autok3s create`：创建和启动 K3s 集群。
- `autok3s join`：为已有的 K3s 集群添加节点。

## 常用参数

AutoK3s 命令中常用的参数如下：

- `-d`或`--debug`：开启 debug 模式。
- `-p`或`--provider`：provider，即云服务提供商。
- `-n`或`--name`：指定将要创建的集群的名称。
- `--master`：指定创建的 master 节点数量。
- `--worker`：指定创建的 worker 节点数量。

## 安装脚本

在 MacOS 或者 Linux 系统环境使用以下脚本安装 AutoK3s，Windows 用户请前往 Releases 页面下载对应的可执行程序。

```bash
curl -sS http://rancher-mirror.cnrancher.com/autok3s/install.sh  | INSTALL_AUTOK3S_MIRROR=cn sh
```

## 快速体验

运行以下命令，即可在阿里云 ECS 上快速创建和启动一个 K3s 集群。

```bash
export ECS_ACCESS_KEY_ID='<Your access key ID>'
export ECS_ACCESS_KEY_SECRET='<Your secret access key>'

autok3s -d create -p alibaba --name myk3s --master 1 --worker 1
```

## 使用指南

AutoK3s 有两种运行模式：Local Mode 和 Rancher Mode。

## Local Mode

在 Local Mode 模式下，您可以使用 CLI 或本地 UI 运行 AutoK3s。

### CLI

以下代码是创建 K3s 集群和添加节点的示例，请在运行之前检查[前提条件](/docs/k3s/autok3s/alibaba/_index)。

#### 创建 K3s 集群

使用`autok3s create`命令可以创建 K3s 集群，这条命令的表达式可以概括为：

```bash
autok3s -d create -p <云服务提供商> --name <集群名称> --master <master节点数量> --worker <worker节点数量>
```

**示例**：

这个命令使用了阿里云`alibaba`作为云提供商，在阿里云上创建了一个名为 “myk3s”的集群，并为该集群配置了 1 个 master 节点和 1 个 worker 节点：

```bash
export ECS_ACCESS_KEY_ID='<Your access key ID>'
export ECS_ACCESS_KEY_SECRET='<Your secret access key>'

autok3s -d create -p alibaba --name myk3s --master 1 --worker 1
```

#### 为 K3s 集群添加节点

使用`autok3s join`命令可以为 K3s 集群添加节点，这条命令的表达式可以概括为：

```bash
autok3s -d join -p <云服务提供商> --name <集群名称> --master <master节点数量> --worker <worker节点数量>
```

其中，`-p <云服务提供商>`和`--name <集群名称>`为必填项，用于指定云服务提供商和添加的集群名称；`--master <master节点数量>`和`--worker <worker节点数量>`为选填项，用于指定添加的节点数量，如果您只需要单独添加 master 或 worker 节点，则可以不填写另一个类型节点的参数，也不需要指定这个类型的节点数量。

**示例**：

以下代码是为已有的 K3s 集群添加 K3s 节点的示例。名为“myk3s”的集群是已经运行在阿里云上 的 K3s 集群。这个命令使用了阿里云`alibaba`作为云提供商，为“myk3s”集群添加了 1 个 worker 节点。

```bash
autok3s -d join --provider alibaba --name myk3s --worker 1
```

### UI

如果要启用本地 UI，请运行 `autok3s serve` 或者 使用 docker 运行 `docker run -itd -p 8080:8080 cnrancher/autok3s:<tag> serve --bind-address 0.0.0.0`，如下图所示。

![快速开始](/img/k3s/quick-start.jpg)
![集群详情](/img/k3s/cluster-detail.jpg)
![操作集群资源](/img/k3s/kubectl.jpg)
![SSH集群节点](/img/k3s/node-ssh.jpg)

## Rancher Mode

_此模式正在开发中_

在这种模式下，您可以将 AutoK3s 放入[Rancher](https://github.com/rancher/rancher)。
它将作为 Rancher 的扩展，使您可以构建一套托管 K3s 服务。

AutoK3s 创建的 K3s 集群可以自动导入 Rancher，并充分利用 Rancher 的 Kubernetes 管理功能。

## 演示视频

在以下演示中，我们将在 1 分钟左右的时间内把 K3s 安装到 Alibaba ECS 云主机上。

观看演示：
[![asciicast](https://asciinema.org/a/EL5P2ILES8GAvdlhaxLMnY8Pg.svg)](https://asciinema.org/a/EL5P2ILES8GAvdlhaxLMnY8Pg)

## 开发者指南

使用 `Makefile` 管理项目的编译、测试与打包。
项目支持使用 `dapper`，`dapper`安装步骤请参考[dapper](https://github.com/rancher/dapper)。

- 依赖： `GO111MODULE=on go mod vendor`
- 编译： `BY=dapper make autok3s`
- 测试： `BY=dapper make autok3s unit`
- 打包： `BY=dapper make autok3s package only`
