---
title: 集群管理概览
description: 在 Rancher 中创建集群之后，您便可以开始使用强大的 Kubernetes 特性在开发、测试或生产环境中部署和扩展您的容器化应用程序。这部分内容会假设您基本熟悉 Docker 和 Kubernetes。有关 Kubernetes 组件是如何协同工作的简要说明，请参阅概念页面。
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
  - 集群管理员指南
  - 集群管理概览
---

在 Rancher 中创建集群之后，您便可以开始使用强大的 Kubernetes 特性在开发、测试或生产环境中部署和扩展您的容器化应用程序。

> 这部分内容默认您已经对 Docker 和 Kubernetes 有一定的了解。若需了解有关 Kubernetes 组件是如何协同工作的简要说明，请参阅 [概念](/docs/rancher2/overview/concepts/_index) 页面.

## 切换集群

您可以使用导航栏中的下拉菜单切换集群，或者在导航栏中直接在项目和集群之间切换：打开**全局**视图，从主菜单中选择**集群**，然后单击要集群的名称，切换到该集群。

## 管理集群

在 Rancher 中创建集群后，集群所有者需要管理这些集群。下表讲述了集群所有者可以对集群执行的操作，“✓”表示支持该操作，“\*”表示在特定情况下支持该操作，详情请参考注释，空白格表示暂不支持该操作。

| 功能                                                                                                              | [Rancher 启动的 Kubernetes 集群 (RKE 集群)](/docs/rancher2/cluster-provisioning/rke-clusters/_index) | [托管的 Kubernetes 集群](/docs/rancher2/cluster-provisioning/hosted-kubernetes-clusters/_index) | [导入的 Kubernetes 集群](/docs/rancher2/cluster-provisioning/imported-clusters/_index) |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [使用 kubectl 和 kubeconfig 文件访问集群](/docs/rancher2/cluster-admin/cluster-access/kubectl/_index)             | ✓                                                                                                    | ✓                                                                                               | ✓                                                                                      |
| [添加集群成员](/docs/rancher2/cluster-admin/cluster-access/cluster-members/_index)                                | ✓                                                                                                    | ✓                                                                                               | ✓                                                                                      |
| [编辑集群](/docs/rancher2/cluster-admin/editing-clusters/_index)                                                  | ✓                                                                                                    | ✓                                                                                               | \*                                                                                     |
| [管理节点](/docs/rancher2/cluster-admin/nodes/_index)                                                             | ✓                                                                                                    | ✓                                                                                               | ✓                                                                                      |
| [管理持久卷和存储类](/docs/rancher2/cluster-admin/volumes-and-storage/_index)                                     | ✓                                                                                                    | ✓                                                                                               | ✓                                                                                      |
| [管理项目和命名空间](/docs/rancher2/cluster-admin/projects-and-namespaces/_index)                                 | ✓                                                                                                    | ✓                                                                                               | ✓                                                                                      |
| [使用应用商店](/docs/rancher2/helm-charts/_index)                                                                 | ✓                                                                                                    | ✓                                                                                               | ✓                                                                                      |
| [使用配置工具（告警、通知、日志、监控和 Istio）](#使用配置工具)                                                   | ✓                                                                                                    | ✓                                                                                               | ✓                                                                                      |
| [克隆集群](/docs/rancher2/cluster-admin/cloning-clusters/_index)                                                  | ✓                                                                                                    | ✓                                                                                               |                                                                                        |
| [证书轮换的能力](/docs/rancher2/cluster-admin/certificate-rotation/_index)                                        | ✓                                                                                                    |                                                                                                 |                                                                                        |
| [备份您的 Kubernetes 集群的能力](/docs/rancher2/cluster-admin/backing-up-etcd/_index)                             | ✓                                                                                                    |                                                                                                 |                                                                                        |
| [恢复和还原 etcd 的能力](/docs/rancher2/cluster-admin/restoring-etcd/_index)                                      | ✓                                                                                                    |                                                                                                 |                                                                                        |
| [当集群不再能从 Rancher 访问时，清理 Kubernetes 组件](/docs/rancher2/cluster-admin/cleaning-cluster-nodes/_index) | ✓                                                                                                    |                                                                                                 |                                                                                        |
| [配置 Pod 安全策略](/docs/rancher2/cluster-admin/pod-security-policy/_index)                                      | ✓                                                                                                    |                                                                                                 |                                                                                        |
| [运行安全扫描](/docs/rancher2/security/security-scan/_index)                                                      | ✓                                                                                                    |                                                                                                 |                                                                                        |

\*：除了 [K3s 集群](/docs/rancher2/cluster-provisioning/imported-clusters/_index#导入的-K3s-集群的其他功能)外，Rancher 不支持为其他类型的导入集群配置集群选项。

## 使用配置工具

Rancher 提供了许多 Kubernetes 中没有的集群工具，帮助您的 DevOps 运作。Rancher 可以与外部服务集成，以帮助您的集群更有效地运行。集群工具分为：告警、通知、日志、监控、Istio 服务网格和 OPA Gatekeeper，详情请参考 [集群工具](/docs/rancher2/cluster-admin/tools/_index)。
