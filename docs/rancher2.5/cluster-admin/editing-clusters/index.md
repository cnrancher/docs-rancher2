---
title: 设置集群
description: 使用 Rancher 创建 Kubernetes 集群之后，仍然可以编辑该集群的选项和设置。要编辑您的集群，请打开 **全局** 视图， 确保选中 **集群** 选项卡， 然后为您要编辑的集群选择 **省略号 (...) > 编辑**
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
  - 集群访问控制
  - 设置集群
---

## 概述

使用 Rancher 创建 Kubernetes 集群之后，仍然可以编辑该集群的选项和设置。

关于编辑集群成员资格的信息，请参考[将用户添加到集群中](/docs/rancher2.5/cluster-admin/cluster-access/cluster-members/)。

## 集群配置参考

集群配置选项取决于 Kubernetes 集群的类型。

- [RKE 集群配置参考](/docs/rancher2.5/cluster-admin/editing-clusters/rke-config-reference/)
- [EKS 集群配置参考](/docs/rancher2.5/cluster-admin/editing-clusters/eks-config-reference/)
- [GKE 集群配置参考](/docs/rancher2.5/cluster-admin/editing-clusters/gke-config-reference/)

## 选项和设置

### v2.5.8

| 功能                                                                                                                | Rancher 启动的 Kubernetes 集群 (RKE 集群) | EKS 集群和 GKE 集群 \* | 其他托管集群 | 除了 EKS 和 GKE 以外的其他注册集群 |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------- | ------------ | ---------------------------------- |
| [使用 kubectl 和 kubeconfig 文件访问集群](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/)             | ✓                                         | ✓                      | ✓            | ✓                                  |
| [添加集群成员](/docs/rancher2.5/cluster-admin/cluster-access/cluster-members/)                                | ✓                                         | ✓                      | ✓            | ✓                                  |
| [编辑集群](/docs/rancher2.5/cluster-admin/editing-clusters/)                                                  | ✓                                         | ✓                      | ✓            | \*\*                               |
| [管理节点](/docs/rancher2.5/cluster-admin/nodes/)                                                             | ✓                                         | ✓                      | ✓            | ✓\*\*\*                            |
| [管理持久卷和存储类](/docs/rancher2.5/cluster-admin/volumes-and-storage/)                                     | ✓                                         | ✓                      | ✓            | ✓                                  |
| [管理项目和命名空间](/docs/rancher2.5/cluster-admin/projects-and-namespaces/)                                 | ✓                                         | ✓                      | ✓            | ✓                                  |
| [使用应用商店](/docs/rancher2.5/helm-charts/)                                                                 | ✓                                         | ✓                      | ✓            | ✓                                  |
| [使用配置工具（告警、通知、日志、监控和 Istio）](#使用配置工具)                                                     | ✓                                         | ✓                      | ✓            | ✓                                  |
| [克隆集群](/docs/rancher2.5/cluster-admin/cloning-clusters/)                                                  | ✓                                         | ✓                      | ✓            |                                    |
| [证书轮换的能力](/docs/rancher2.5/cluster-admin/certificate-rotation/)                                        | ✓                                         | ✓                      |              |
| [备份您的 Kubernetes 集群的能力](/docs/rancher2.5/cluster-admin/backing-up-etcd/)                             | ✓                                         | ✓                      |              |
| [恢复和还原 etcd 的能力](/docs/rancher2.5/cluster-admin/restoring-etcd/)                                      | ✓                                         | ✓                      |              |
| [当集群不再能从 Rancher 访问时，清理 Kubernetes 组件](/docs/rancher2.5/cluster-admin/cleaning-cluster-nodes/) | ✓                                         |                        |              |
| [配置 Pod 安全策略](/docs/rancher2.5/cluster-admin/pod-security-policy/)                                      | ✓                                         | ✓                      |              |
| [运行安全扫描](/docs/rancher2.5/security/security-scan/)                                                      | ✓                                         | ✓                      | ✓            | ✓                                  |

\*：除了 [K3s 集群](/docs/rancher2/cluster-provisioning/imported-clusters/#导入的-K3s-集群的其他功能)外，Rancher 不支持为其他类型的导入集群配置集群选项。

### v2.5.0~v2.5.7

| 功能                                                                                                                | Rancher 启动的 Kubernetes 集群 (RKE 集群) | 托管的 Kubernetes 集群 | 已注册的 EKS 集群 | 已注册的其他集群 |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------- | ----------------- | ---------------- |
| [使用 kubectl 和 kubeconfig 文件访问集群](/docs/rancher2.5/cluster-admin/cluster-access/kubectl/)             | ✓                                         | ✓                      | ✓                 | ✓                |
| [添加集群成员](/docs/rancher2.5/cluster-admin/cluster-access/cluster-members/)                                | ✓                                         | ✓                      | ✓                 | ✓                |
| [编辑集群](/docs/rancher2.5/cluster-admin/editing-clusters/)                                                  | ✓                                         | ✓                      | ✓                 | \*               |
| [管理节点](/docs/rancher2.5/cluster-admin/nodes/)                                                             | ✓                                         | ✓                      | ✓                 | ✓\*\*            |
| [管理持久卷和存储类](/docs/rancher2.5/cluster-admin/volumes-and-storage/)                                     | ✓                                         | ✓                      | ✓                 | ✓                |
| [管理项目和命名空间](/docs/rancher2.5/cluster-admin/projects-and-namespaces/)                                 | ✓                                         | ✓                      | ✓                 | ✓                |
| [使用应用商店](/docs/rancher2.5/helm-charts/)                                                                 | ✓                                         | ✓                      | ✓                 | ✓                |
| [使用配置工具（告警、通知、日志、监控和 Istio）](#使用配置工具)                                                     | ✓                                         | ✓                      | ✓                 | ✓                |
| [克隆集群](/docs/rancher2.5/cluster-admin/cloning-clusters/)                                                  | ✓                                         | ✓                      | ✓                 |                  |
| [证书轮换的能力](/docs/rancher2.5/cluster-admin/certificate-rotation/)                                        | ✓                                         |                        | ✓                 |
| [备份您的 Kubernetes 集群的能力](/docs/rancher2.5/cluster-admin/backing-up-etcd/)                             | ✓                                         |                        | ✓                 |
| [恢复和还原 etcd 的能力](/docs/rancher2.5/cluster-admin/restoring-etcd/)                                      | ✓                                         |                        | ✓                 |
| [当集群不再能从 Rancher 访问时，清理 Kubernetes 组件](/docs/rancher2.5/cluster-admin/cleaning-cluster-nodes/) | ✓                                         |                        | ✓                 |
| [配置 Pod 安全策略](/docs/rancher2.5/cluster-admin/pod-security-policy/)                                      | ✓                                         |                        | ✓                 |
| [运行安全扫描](/docs/rancher2.5/security/security-scan/)                                                      | ✓                                         |                        | ✓                 |

\*已注册的 GKE 和 EKS 集群拥有与从 Rancher 用户界面创建的 GKE 和 EKS 集群相同的可用选项。不同的是，当从 Rancher 用户界面中删除注册的集群时，它不会被销毁。

\*\*除了 K3s 和 RKE2 集群外，对于导入的集群，集群配置选项不能被编辑。

\*\*\*对于已注册的集群节点，Rancher UI 暴露了 cordon draining 和编辑节点的能力。
