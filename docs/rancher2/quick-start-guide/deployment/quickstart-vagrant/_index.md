---
title: Vagrant 快速部署
description: 您可以按照以下操作步骤部署 Rancher Server 和一个单节点的 Kubernetes 集群。
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
  - Vagrant 快速部署
---

您可以按照以下操作步骤部署 Rancher Server 和一个单节点的 Kubernetes 集群。

## 先决条件

- [Vagrant](https://www.vagrantup.com)：因为 Rancher Server 基于 Vagrantfile 运行，所以已经安装和配置好了 Vagrant 是先决条件之一。

- [Virtualbox](https://www.virtualbox.org)：需要在 VirtualBox 中启动运行 Vagrant 的虚拟机。

- 至少 4 GB 的运行内存。

## 操作步骤

1. 打开命令行工具，执行`git clone https://github.com/rancher/quickstart`命令，把 Rancher 快速入门需要用的到的文件复制到本地。

1. 执行`cd quickstart/vagrant`命令，进入 Vagrant 快速部署文件夹。

1. **可选：**编辑`config.yaml`文件中的参数

   - 您可以自定义节点数量、CPU 配额和内存配额，三者对应的参数分别是`node.count` 、`node.cpus`和 `node.memory`。

   - 修改管理员用户登录时使用的密码，对应的参数是`default_password` 。

1. 执行`vagrant up`命令，运行初始化环境。

1. 完成初始化后，打开浏览器，执行`https://172.22.101.101`，访问 Rancher UI。

1. 执行用户名和密码，登录 Rancher UI。如果您跳过了上述可选步骤，没有设置密码，请输入默认用户名和密码，用户名是`admin`，密码是`admin`。如果您已经修改了密码，请输入修改后的密码登录 Rancher UI。为了保证安全性，我们建议您定期修改登录密码。

**结果：**完成 Vagrant 快速入门，在 VirtualBox 中安装了 Rancher Server 和 Kubernetes 集群。

## 后续操作

完成安装 Rancher Server 和 Kubernetes 集群的步骤后，您可以使用 Rancher 部署工作负载，详情请参考[部署工作负载](/docs/quick-start-guide/workload/_index)。

## 清理环境

快速入门为您创建了一个使用 Rancher 的沙盒，我们建议您在完成试用后清理环境内 Rancher 相关的资源和数据。具体步骤如下：

1. 执行`cd quickstart/vagrant`命令，进入 Vagrant 快速部署文件夹。

1. 执行`vagrant destroy -f`命令，删除相关的资源和数据。

1. 命令行界面显示确认信息，完成所有资源的删除。
