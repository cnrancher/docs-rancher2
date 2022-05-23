---
title: 部署工作负载
description: 阅读此步骤指南以部署工作负载。部署工作负载以在一个或多个容器中运行应用程序。
weight: 3026
---

部署工作负载以在一个或多个容器中运行应用程序。

1. 点击左上角 **☰ > 集群管理**。
1. 转到要升级工作负载的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**工作负载**。
1. 单击**创建**。
1. 选择工作负载的类型。
1. 选择要部署工作负载的命名空间。
1. 为工作负载设置**名称**。

1. 在**容器镜像**字段中，输入要部署到项目的 Docker 镜像的名称。你可以选择在前面加上镜像仓库主机（例如 `quay.io`、`registry.gitlab.com` 等）。部署时，Rancher 从指定的公共或私有镜像仓库中拉取镜像。如果没有提供镜像仓库主机，Rancher 将从 [Docker Hub](https://hub.docker.com/explore/) 拉取镜像。输入与镜像仓库服务器中显示的名称完全相同的名称，任何所需的路径，也可以选择所需的标签（例如 `registry.gitlab.com/user/path/image:tag`）。如果没有提供标签，将自动使用 `latest` 标签。

1. 选择现有命名空间，或单击**添加到新命名空间**并输入新命名空间。

1. 点击**添加端口**进入端口映射，这让你可以访问集群内外的应用程序。如需更多信息，请参阅 [Service]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/#services)。

1. 配置其余选项：

   - **环境变量**

      你可以在这里为工作负载指定环境变量以即时使用它们，或者从其他来源（例如密文或 [ConfigMap]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/configmaps/)）拉取它们。

   - **节点调度**
   - **健康检查**
   - **卷**

      在此处为你的工作负载添加存储。你可以手动指定要添加的卷，使用持久卷声明为工作负载动态创建卷，或从 [ConfigMap]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/configmaps/) 等文件中读取要使用的卷数据。

      部署 StatefulSet 时，应在使用持久卷时使用卷声明模板。这将确保在扩展 StatefulSet 时能动态创建持久卷。

   - **扩展/升级策略**

      > **AWS 卷注意事项**：
      >
      > 要挂载 Amazon EBS 卷：
      >
      > - 在 [AWS](https://aws.amazon.com/) 中，节点必须位于同一可用区中并具有附加/分离卷的 IAM 权限。
      >
      > - 集群必须使用 [AWS 云提供商](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#aws)选项。有关启用此选项的更多信息，请参阅[创建 AWS EC2 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/ec2/)或[创建自定义集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes)。


1. 点击**显示高级选项**并配置：

   - **命令**
   - **网络**
   - **标签 & 注释**
   - **安全和主机配置**

1. 点击**启动**。

**结果**：工作负载已部署到选定的命名空间。你可以在项目的**工作负载**视图查看工作负载的状态。
