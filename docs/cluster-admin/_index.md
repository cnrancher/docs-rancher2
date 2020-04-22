---
title: 集群管理概览
description: 在 Rancher 中创建集群之后，您便可以开始使用强大的 Kubernetes 特性在开发、测试或生产环境中部署和扩展您的容器化应用程序。这部分内容会假设您基本熟悉 Docker 和 Kubernetes。有关 Kubernetes 组件是如何协同工作的简要说明，请参阅概念页面。
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
  - 集群管理员指南
  - 集群管理概览
---

在 Rancher 中创建集群之后，您便可以开始使用强大的 Kubernetes 特性在开发、测试或生产环境中部署和扩展您的容器化应用程序。

> 这部分内容会假设您基本熟悉 Docker 和 Kubernetes。有关 Kubernetes 组件是如何协同工作的简要说明，请参阅 [概念](/docs/overview/concepts/_index) 页面.

## 集群之间切换

要在集群之间切换，可以使用导航栏中的下拉菜单。

或者，您可以在导航栏中直接在项目和集群之间切换。打开**全局**视图，从主菜单中选择**集群**。然后选择要打开集群的名称。

## 在 Rancher 中管理集群

当在 Rancher 中创建集群完成之后，集群所有者将需要管理这些集群

当在 Rancher 中 [创建集群](/docs/cluster-provisioning/_index) 完成之后, [集群所有者](/docs/admin-settings/rbac/cluster-project-roles/_index) 将需要管理这些集群. 关于如何管理集群，有许多不同的功能选择。

| 功能                                                                                                     | [Rancher 启动的 Kubernetes 集群 (RKE 集群)](/docs/cluster-provisioning/rke-clusters/_index) | [托管的 Kubernetes 集群](/docs/cluster-provisioning/hosted-kubernetes-clusters/_index) | [导入的 Kubernetes 集群](/docs/cluster-provisioning/imported-clusters/_index) |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [使用 kubectl 和 kubeconfig 文件访问集群](/docs/cluster-admin/cluster-access/kubectl/_index)             | \*                                                                                          | \*                                                                                     | \*                                                                            |
| [添加集群成员](/docs/cluster-admin/cluster-access/cluster-members/_index)                                | \*                                                                                          | \*                                                                                     | \*                                                                            |
| [编辑集群](/docs/cluster-admin/editing-clusters/_index)                                                  | \*                                                                                          | \*                                                                                     | \*                                                                            |
| [管理节点](/docs/cluster-admin/nodes/_index)                                                             | \*                                                                                          | \*                                                                                     | \*                                                                            |
| [管理持久卷和存储类](/docs/cluster-admin/volumes-and-storage/_index)                                     | \*                                                                                          | \*                                                                                     | \*                                                                            |
| [管理项目和命名空间](/docs/cluster-admin/projects-and-namespaces/_index)                                 | \*                                                                                          | \*                                                                                     | \*                                                                            |
| [配置工具](#配置工具)                                                                                    | \*                                                                                          | \*                                                                                     | \*                                                                            |
| [克隆集群](/docs/cluster-admin/cloning-clusters/_index)                                                  |                                                                                             | \*                                                                                     | \*                                                                            |
| [证书轮换的能力](/docs/cluster-admin/certificate-rotation/_index)                                        | \*                                                                                          |                                                                                        |                                                                               |
| [备份您的 Kubernetes 集群的能力](/docs/cluster-admin/backing-up-etcd/_index)                             | \*                                                                                          |                                                                                        |                                                                               |
| [恢复和还原 etcd 的能力](/docs/cluster-admin/restoring-etcd/_index)                                      | \*                                                                                          |                                                                                        |                                                                               |
| [当集群不再能从 Rancher 访问时，清理 Kubernetes 组件](/docs/cluster-admin/cleaning-cluster-nodes/_index) | \*                                                                                          |                                                                                        |                                                                               |

## 配置工具

Rancher 包含许多 Kubernetes 中没有的工具来帮助您的 DevOps 运作。Rancher 可以与外部服务集成，以帮助您的集群更有效地运行。工具分为以下几类:

- 告警
- 通知
- 日志
- 监控

更多信息，请参见 [工具](/docs/cluster-admin/tools/_index)
