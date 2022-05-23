---
title: 添加 Sidecar
weight: 3029
---
_sidecar_ 是一个容器，用于扩展或增强 pod 中的主容器。主容器和 Sidecar 共享一个 pod，因此共享相同的网络空间和存储。你可以使用**添加 Sidecar** 选项将 Sidecar 添加到现有工作负载。

1. 点击左上角 **☰ > 集群管理**。
1. 转到要添加 Sidecar 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**工作负载**。

1. 找到要扩展的工作负载。选择 **⋮ > + 添加 Sidecar**。

1. 输入 Sidecar 的**名称**。

1. 在**通用**中，选择 Sidecar 类型。此选项确定 Sidecar 容器是在主容器之前还是之后部署。

   - **标准容器**：

      Sidecar 容器部署在主容器之后。

   - **初始化容器**：

      Sidecar 容器部署在主容器之前。

1. 在**容器镜像**字段中，输入要部署来支持主容器的容器镜像的名称。部署时，Rancher 会从 [Docker Hub](https://hub.docker.com/explore/) 拉取这个镜像。输入与 Docker Hub 上完全相同的名称。

1. 设置其余选项。你可以在[部署工作负载](../deploy-workloads)中了解它们。

1. 点击**启动**。

**结果**：已根据你的参数部署 Sidecar。部署后，你可以选择 **⋮ > 编辑** 来查看 Sidecar。

## 相关链接

- [分布式系统工具包：复合容器的模式](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns/)
