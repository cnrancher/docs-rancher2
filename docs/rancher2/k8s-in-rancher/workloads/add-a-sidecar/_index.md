---
title: 添加 Sidecar
description: Sidecar是在 Pod 中延伸或增强主容器的容器。主容器和Sidecar共享一个Pod，因此共享相同的网络空间和存储空间。您可以使用添加Sidecar选项将Sidecar添加到现有的工作负载中。
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
  - 用户指南
  - 工作负载
  - 添加 Sidecar
---

_Sidecar_ 是在 Pod 中延伸或增强主容器的容器。主容器和 Sidecar 共享一个 Pod，因此共享相同的网络空间和存储空间。您可以使用**添加 Sidecar** 选项将 Sidecar 添加到现有的工作负载中。

1. 从**全局**视角中，打开要向其添加 Sidecar 的工作负载所在的项目。

1. 点击**资源 > 工作负载**。在 v2.3.0 之前的版本中，选择**工作负载**选项卡。

1. 找到要扩展的工作负载。选择**省略号 (...) > 添加 Sidecar**。

1. 为 Sidecar 输入一个**名称**。

1. 选择一个 **Sidecar 类型**。此选项决定是否在部署主容器之前或之后部署 Sidecar 容器。

   - **标准容器：**

     Sidecar 容器在主容器之后部署。

   - **初始化容器：**

     Sidecar 容器在主容器之前部署。

1. 在 **Docker 镜像**字段，输入要部署以支持主容器的 Docker 镜像的名称。在部署期间，Rancher 将从镜像库中获取与输入完全相同的镜像。

1. 设置其余选项。详情请参阅[部署工作负载](/docs/rancher2/k8s-in-rancher/workloads/deploy-workloads/_index)。

1. 点击 **启动**。

**结果：** 部署了根据您的参数配置的 Sidecar。在其部署之后，您可以选择**省略号(...) > 编辑** 来查看 Sidecar。

## 相关链接

- [分布式系统工具包：复合容器的模式](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns/)
