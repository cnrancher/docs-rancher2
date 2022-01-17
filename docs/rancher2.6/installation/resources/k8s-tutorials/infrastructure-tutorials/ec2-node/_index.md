---
title: 在 Amazon EC2 中配置节点
weight: 3
---

在本教程中，你将学习一种为 Rancher Mangement Server 创建 Linux 节点的方法。这些节点将满足[操作系统、Docker、硬件和网络的要求]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/)。

如果 Rancher Server 安装在 RKE Kubernetes 集群上，你需要配置三个实例。

如果 Rancher Server 安装在 K3s Kubernetes 集群上，你只需要配置两个实例。

如果 Rancher Server 安装在单个 Docker 容器中，你只需要配置一个实例。

### 1. 准备工作（可选）

- **创建 IAM 角色**：要允许 Rancher 操作 AWS 资源，例如创建新存储或新节点，你需要将 Amazon 配置为云提供商。要在 EC2 上设置云提供商，你需要进行几个操作，其中包括为 Rancher Server 节点设置 IAM 角色。有关设置云提供商的详情，请参见[本页]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/)。
- **创建安全组**：我们建议为 Rancher 节点设置一个符合 [Rancher 节点端口要求]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/#port-requirements)的安全组。

### 2. 配置实例

1. 登录到 [Amazon AWS EC2 控制台](https://console.aws.amazon.com/ec2/)。由于 Rancher Management Server 的所有基础设施都需要位于同一地域，因此，请务必记下创建 EC2 实例（Linux 节点）的**地域**。
1. 在左侧面板中，点击**实例**。
1. 点击**启动示例**。
1. 在**步骤 1：选择 Amazon Machine Image (AMI)** 中，使用 `ami-0d1cd67c26f5fca19 (64-bit x86)` 来使用 Ubuntu 18.04 作为 Linux 操作系统。去到 Ubuntu AMI 并点击**选择**。
1. 在**步骤 2：选择实例类型**中，选择 `t2.medium`。
1. 点击**下一步：配置实例详细信息**。
1. 在**实例数量**字段中，输入实例数量。创建高可用 K3s 集群仅需要两个实例，而高可用 RKE 集群则需要三个实例。
1. 可选：如果你为 Rancher 创建了一个 IAM 角色来操作 AWS 资源，请在 **IAM 角色**字段中选择新 IAM 角色。
1. 分别点击**下一步：添加存储**，**下一步：添加标签**和**下一步：配置安全组**。
1. 在**步骤 6：配置安全组**中，选择一个符合 Rancher 节点[端口要求]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/#port-requirements)的安全组。
1. 点击**查看并启动**。
1. 点击**启动**。
1. 选择一个新的或现有的密钥对，用于之后连接到你的实例。如果使用现有密钥对，请确保你有访问私钥的权限。
1. 点击**启动实例**。


**结果**：你已创建满足操作系统、硬件和网络要求的 Rancher 节点。

:::note 注意
如果节点用于 RKE Kubernetes 集群，请在下一步操作中为每个节点安装 Docker 。如果节点用于 K3s Kubernetes 集群，你可以开始在节点上安装 K3s 了。
:::

### 3. 为 RKE Kubernetes 集群节点安装 Docker 并创建用户

1. 在 [AWS EC2 控制台](https://console.aws.amazon.com/ec2/)中，点击左侧面板中的**实例**。
1. 转到你想要安装 Docker 的实例。选择实例，并点击**操作 > 连接**。
1. 按照屏幕上的说明连接到实例。复制实例的公共 DNS。SSH 进入实例的示例命令如下：
```
sudo ssh -i [path-to-private-key] ubuntu@[public-DNS-of-instance]
```
1. 在实例上运行以下命令，使用 Rancher 的其中一个安装脚本来安装 Docker：
```
curl https://releases.rancher.com/install-docker/18.09.sh | sh
```
1. 连接到实例后，在实例上运行以下命令来创建用户：
```
sudo usermod -aG docker ubuntu
```
1. 在每个节点上重复上述步骤，以确保 Docker 安装到每个用于运行 Rancher Management Server 的节点上。

> 要了解我们是否提供指定的 Docker 版本的安装脚本，请访问此 [GitHub 仓库](https://github.com/rancher/install-docker)，该仓库包含 Rancher 的所有 Docker 安装脚本。

**结果**：你已配置满足操作系统、Docker、硬件和网络要求的 Rancher Server 节点。

### RKE Kubernetes 集群节点的后续步骤

如需在新节点上安装 RKE 集群，请记住每个节点的 **IPv4 公共 IP** 和 **私有 IP**。创建节点后，此信息可以在每个节点的**描述**页签中找到。公共和私有 IP 将用于设置 RKE 集群配置文件 `rancher-cluster.yml` 中每个节点的 `address` 和 `internal_address`。

RKE 还需要访问私钥才能连接到每个节点。因此，请记住连接到节点的私钥的路径，该路径也可用于设置 `rancher-cluster.yml` 中每个节点的 `ssh_key_path`。
