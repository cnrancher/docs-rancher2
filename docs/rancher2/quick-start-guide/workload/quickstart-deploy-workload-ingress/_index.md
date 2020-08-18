---
title: 部署带有 Ingress 的工作负载
description: 以下步骤讲解了如何在 Rancher Server 中部署带有 Ingress 的工作负载。本文部署的工作负载是一个“Hello-World”应用。
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
  - 部署工作负载
  - 部署带有 Ingress 的工作负载
---

## 先决条件

已经有一个正在运行的集群，且集群中有至少一个节点

## 部署工作负载

参考前文完成 [Rancher Server 的快速部署](/docs/quick-start-guide/deployment/_index)后，您可以创建 _工作负载_。工作负载即 Kubernetes 对一组 Pod 的抽象模型，用于描述业务的运行载体，包括 Deployment、Statefulset、Daemonset、Job、CronJob 等多种类型，详情请参考[名词解释](/docs/overview/glossary/_index)。

以下步骤讲解了如何在 Rancher Server 中部署带有 Ingress 的工作负载。本文部署的工作负载是一个“Hello-World”应用。

1. 访问**集群**页面，选择您刚刚创建的集群，进入集群页面。

1. 从集群页面的主菜单中选择**项目/命名空间**。

1. 打开 **项目：Default**。

1. 单击**资源 > 工作负载**。如果您使用的是 v2.3.0 之前的版本，请单击 **工作负载 > 工作负载**。

1. 单击**部署**。

   **结果：** 打开**部署工作负载** 页面。

1. 输入工作负载的名称。

1. 在**Docker 镜像**一栏，输入`rancher/hello-world`，请注意区分大小写字母。

1. 余下的选项保持默认配置即可。

1. 单击**运行**。

**结果：**

- 部署了工作负载。这个过程可能需要几分钟完成。
- 当您的工作负载部署完成后，它的状态将变为**Active**，您可以从项目的**工作负载**页面查看工作负载当前的状态。

## 暴露服务

上述步骤帮助您完成了工作负载的部署，现在您需要将服务暴露出来，让其他服务可以通过网络连接和调用这个工作负载。

1.  访问**集群**页面，选择您刚刚创建的集群，进入集群页面。

1.  从集群页面的主菜单中选择**项目/命名空间**。

1.  打开 **项目 > Default**。

1.  单击**资源 > 工作负载 > 负载均衡**。如果您使用的是 v2.3.0 之前的版本，请单击 **工作负载 > 负载均衡**。

1.  单击**添加 Ingress**

1.  输入 Ingress 负载均衡的名称，如 “hello”。

1.  在**目标**一栏，从下拉菜单选择您服务的名称。

1.  在**端口**一栏输入 `80`。

1.  余下的选项保持默认配置即可，单击**保存**。

**结果：** 这个工作负载分配到了一个`xip.io`地址，已经暴露出去了。可能需要 1~2 分钟完成服务关联。

## 查看您的应用

从**负载均衡**页面单击目标链接`hello.default.xxx.xxx.xxx.xxx.xip.io > hello-world`，您的应用会在一个新窗口中打开。

## 结果

成功部署工作负载并通过 Ingress 暴露该工作负载。

## 后续操作

使用完您通过快速入门搭建的 Rancher 沙盒后，您可能想要清理遗留在环境中与 Rancher 相关的资源，并删除 Rancher Server 和您的集群，请单击下方链接查看操作指导。

- [清理环境：Amazon AWS](/docs/quick-start-guide/deployment/amazon-aws-qs/_index)
- [清理环境：DigitalOcean](/docs/quick-start-guide/deployment/digital-ocean-qs/_index)
- [清理环境：Vagrant](/docs/quick-start-guide/deployment/quickstart-vagrant/_index)
