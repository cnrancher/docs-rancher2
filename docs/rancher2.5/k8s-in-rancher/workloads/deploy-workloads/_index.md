---
title: 部署工作负载
description: 部署工作负载以在一个或多个容器中运行应用程序。
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
  - 用户指南
  - 工作负载
  - 部署工作负载
---

部署工作负载以在一个或多个容器中运行应用程序。

1.  在**全局**视图中，打开要部署工作负载的项目。

2.  单击**资源 > 工作负载**(在 v2.3.0 之前的版本中，单击**工作负载**选项卡)。在**工作负载**视图中，单击**部署**。

3.  为工作负载输入一个**名称**。

4.  选择一个[工作负载类型](/docs/rancher2/k8s-in-rancher/workloads/_index)。工作负载默认为可伸缩的部署，通过单击**更多选项**可以更改工作负载类型。

5.  在**Docker 镜像**字段中，输入要部署到项目的 Docker 镜像的名称，可以选择使用镜像库地址作为前缀 (例如 `quay.io`，`registry.gitlab.com`等)。在部署期间，Rancher 将从指定的公共或私有镜像仓库获取此镜像。如果没有指定镜像仓库，Rancher 将从[Docker Hub](https://hub.docker.com/explore/)获取镜像。请输入与镜像库中的镜像名称完全相同的名称，包括所需的路径和所需的标记 (例如，`registry.gitlab.com/user/path/image:tag`)。如果没有提供标签，则会自动使用`latest`的标签。
6.  选择一个现有的命名空间，或者单击**添加一个新的命名空间**创建一个新的命名空间。
7.  单击**添加端口**输入端口映射，允许在集群内外访问应用程序。获取更多信息，请参见[服务](/docs/rancher2/k8s-in-rancher/workloads/_index)。

8.  配置其余选项：

    - **环境变量**

      这里可以为工作负载动态地指定环境变量，也可以从其他来源，例如[密文](/docs/rancher2/k8s-in-rancher/secrets/_index)或[配置映射](/docs/rancher2/k8s-in-rancher/configmaps/_index)，获取环境变量。

    - **节点调度**
    - **健康检查**
    - **数据卷**

      这里可以为工作负载添加存储。您可以手动指定要添加的卷，使用持久卷声明动态地为工作负载创建卷，或者从[配置映射](/docs/rancher2/k8s-in-rancher/configmaps/_index)，[密文](/docs/rancher2/k8s-in-rancher/secrets/_index)，[证书](/docs/rancher2/k8s-in-rancher/certificates/_index)等文件中读取要使用的卷的数据。

      在部署**有状态程序集**时，应该在使用持久卷时使用卷声明模板。这将确保在扩展**有状态程序集**时动态创建持久卷。Rancher v2.2.0 的 UI 中提供了该选项。

    - **缩放/升级策略**

      > **使用 Amazon EBS 卷时请注意：**
      >
      > 挂载一个 Amazon EBS 卷:
      >
      > - 在 [Amazon AWS](https://aws.amazon.com/)，节点必须位于相同的可用性区域，并且拥有附加/卸载卷的 IAM 权限。
      > - 集群必须配置了 [AWS Cloud Provider](https://v1-17.docs.kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#aws)选项。有关启用此选项的更多信息，请参见[创建 Amazon EC2 集群](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/ec2/_index)或[创建自定义集群](/docs/rancher2/cluster-provisioning/rke-clusters/custom-nodes/_index)。

9.  单击**显示高级选项**来配置：

    - **命令**
    - **网络**
    - **标签/注释**
    - **安全和主机配置**

10. 单击 **启动**。

**结果：** 工作负载被部署到所选的命名空间。您可以从项目的**工作负载**视图中查看工作负载的状态。
