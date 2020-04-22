---
title: 在 Amazon EC2 中配置节点
description: 在本教程中，您将学习一种为 Rancher 管理面的服务器创建 Linux 节点的方法。这些节点将满足 Rancher 对 OS，Docker，硬件和网络的要求。如果要将 Rancher Server 安装在 RKE Kubernetes 集群上，则应创建三个实例。如果要将 Rancher Server 安装在 K3s Kubernetes 集群上，则仅需创建两个实例。如果要将 Rancher Server 安装在单个 Docker 容器中，则仅需创建一个实例。
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
  - 安装指南
  - 资料、参考和高级选项
  - 在 Amazon EC2 中配置节点
---

在本教程中，您将学习一种为 Rancher 管理面的服务器创建 Linux 节点的方法。这些节点将满足 Rancher 对 [OS，Docker，硬件和网络的要求](/docs/installation/requirements/_index)。

- 如果要将 Rancher Server 安装在 RKE Kubernetes 集群上，则应创建三个实例。

- 如果要将 Rancher Server 安装在 K3s Kubernetes 集群上，则仅需创建两个实例。

- 如果要将 Rancher Server 安装在单个 Docker 容器中，则仅需创建一个实例。

## 1、准备工作（可选）

- **创建 IAM 角色：** 要允许 Rancher 操作 AWS 资源，例如创建新存储或新节点，您需要将 Amazon 配置为 Cloud Provider。在 EC2 上设置 Cloud Provider 需要做几件事，此过程的一部分是为 Rancher Server 节点设置 IAM 角色。有关设置 Cloud Provider 的完整详细信息，请参阅此[页面](/docs/cluster-provisioning/rke-clusters/options/cloud-providers/_index)。

* **创建安全组：** 我们还建议为 Rancher 节点设置一个符合 [Rancher 节点端口要求](/docs/installation/requirements/_index)的安全组。确切的端口要求会有所不同，具体取决于您要使用 RKE 还是 K3s 来安装 Kubernetes。

## 2、创建实例

1. 登录[Amazon AWS EC2 控制台](https://console.aws.amazon.com/ec2/)。请记下创建 EC2 实例（Linux 节点）的**区域**，因为 Rancher 管理面的服务器的所有基础设施都应位于同一区域。
1. 在左侧面板中，单击**实例**。
1. 单击**启动实例**。
1. 在**步骤 1：选择 Amazon Machine Image（AMI）**中，转到 Ubuntu AMI，然后单击**选择**，选择`ami-0d1cd67c26f5fca19（64 位 x86）`，我们将使用 Ubuntu 18.04 作为 Linux 操作系统。
1. 在**步骤 2：选择实例类型**部分中，选择`t2.medium`类型。
1. 单击**下一步：配置实例详细信息**。
1. 在**实例数量**字段中，输入实例数。创建高可用 K3s 集群仅需要两个实例，而创建高可用 RKE 集群则需要三个实例。
1. 可选：如果您为 Rancher 创建了一个 IAM 角色来操作 AWS 资源，请在**IAM 角色**字段中选择新的 IAM 角色。
1. 单击**下一步：添加存储**，**下一步：添加标签**，**下一步：配置安全组**。
1. 在**步骤 6：配置安全组**中，选择一个符合[端口要求的](/docs/installation/requirements/_index)安全组。
1. 单击**查看并启动**。
1. 点击**启动**。
1. 选择一个新的或现有的密钥对，以后将用于连接到您的实例。如果您使用的是现有的密钥对，请确保您已经可以访问相应的私钥。
1. 单击**启动实例**。

**结果：** 您已经创建了满足 OS、硬件和网络要求的 Rancher 节点。接下来，您将在每个节点上安装 Docker。

## 3、安装 Docker 并创建用户

1. 在[AWS EC2 控制台](https://console.aws.amazon.com/ec2/)中，单击左侧面板中的**实例**。
1. 转到要在其上安装 Docker 的实例。选择实例，然后单击**操作 > 连接**。
1. 按照出现的屏幕上的说明连接到实例。复制实例的公共 DNS。 SSH 进入实例的示例命令如下：

   ```
   sudo ssh -i [path-to-private-key] ubuntu@[public-DNS-of-instance]
   ```

1. 连接到实例后，在实例上运行以下命令以创建用户：

   ```
   sudo usermod -aG docker ubuntu
   ```

1. 在实例上运行以下命令，使用 Rancher 的安装脚本之一安装 Docker：

   ```
   curl https://releases.rancher.com/install-docker/18.09.sh | sh
   ```

1. 重复这些步骤，在运行 Rancher 管理面的服务器的每个节点上安装 Docker。

> 要了解是否有可用于安装指定的 Docker 版本的脚本，请参阅此[GitHub 代码库](https://github.com/rancher/install-docker)，其中包含所有 Rancher 的 Docker 安装脚本。

**结果：** 您已创建了 Rancher 服务器节点，这些节点满足了 Rancher 对 OS，Docker，硬件和网络的要求。

## RKE 集群节点的后续步骤

如果要在新节点上安装 RKE 集群，请注意每个节点的**IPv4 公有 IP**和**私有 IP**。创建每个节点后，可在每个节点的**描述**选项卡上的找到此信息。公有和私有 IP 将用于设置 RKE 集群配置文件`rancher-cluster.yml`中每个节点的`address`和`internal_address`字段。

RKE 还需要访问私钥才能连接到每个节点。因此，您要记下连接到节点的私钥的路径，它将用于设置 RKE 集群配置文件`rancher-cluster.yml`中每个节点的`ssh_key_path`字段。
