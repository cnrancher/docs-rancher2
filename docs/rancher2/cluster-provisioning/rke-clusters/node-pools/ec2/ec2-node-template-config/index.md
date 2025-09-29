---
title: EC2 Node Template Configuration
---

关于 EC2 节点的更多细节，请参考[EC2 管理控制台](https://aws.amazon.com/ec2)的官方文档。

## v2.2.0 以及更新的版本

### 区域（Region）

在**Region**字段中，选择您在创建云证书时使用的相同区域。

### 云凭证（Cloud Credential）

您的 AWS 账户访问信息，存储在[云凭证](/docs/rancher2/user-settings/cloud-credentials/)中。

请参阅 [Amazon Documentation: Creating Access Keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey) 如何创建访问密钥和秘钥。

请参阅 [Amazon Documentation: Creating IAM Policies (Console)](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html#access_policies_create-start) 如何创建 IAM 策略。

请参阅 [Amazon Documentation: Adding Permissions to a User (Console)](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console)，如何附加 IAM 策略。

请参考以下三个 JSON 策略示例：

- [示例 IAM 策略](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/ec2/)
- [示例 IAM 策略与 PassRole](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/ec2/)（如果你想使用[Kubernetes Cloud Provider](/docs/rancher2/cluster-provisioning/rke-clusters/cloud-providers/)，或者想要将 IAM Profile 传递给实例时，需要用到。)
- [允许加密 EBS 卷的 IAM 策略示例](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/ec2/)策略给用户。

### 验证和配置节点

请为您的集群选择可用区和网络配置。

### 安全组（Security Group）

选择默认的安全组或配置安全组。

请参考[使用节点驱动时的 Amazon EC2 安全组](/docs/rancher2/installation/requirements/ports/)，查看`rancher-nodes`安全组中创建了哪些规则。

### 实例选项

配置将要创建的实例。确保为配置的 AMI 配置正确的**SSH 用户**。

如果您需要传递**IAM 实例配置文件名**（而不是 ARN），例如，当您要使用[Kubernetes 云提供商](/docs/rancher2/cluster-provisioning/rke-clusters/cloud-providers/)时，您将需要在策略中增加一个权限。请参阅[带 PassRole 的 IAM 策略示例](#example-iam-policy-with-passrole)以了解
一个策略范例。

### 引擎选项

在节点模板的**引擎选项**部分，您可以配置 Docker 守护进程。您可能希望指定 docker 版本或 Docker 镜像仓库镜像。

## v2.2.0 之前的版本

### 账户权限

**账户访问**是您配置节点的区域，以及用于创建机器的凭证（访问密钥和秘钥）。

请参阅 [Amazon Documentation: Creating Access Keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey) 如何创建访问密钥和秘钥。

请参阅 [Amazon Documentation: Creating IAM Policies (Console)](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html#access_policies_create-start) 如何创建 IAM 策略。

请参阅 [Amazon Documentation: Adding Permissions to a User (Console)](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console)，如何附加 IAM 策略。

请参考以下三个 JSON 策略示例：

- [示例 IAM 策略](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/ec2/)
- [示例 IAM 策略与 PassRole](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/ec2/)（如果你想使用[Kubernetes Cloud Provider](/docs/rancher2/cluster-provisioning/rke-clusters/cloud-providers/)，或者想要将 IAM Profile 传递给实例时，需要用到。)
- [允许加密 EBS 卷的 IAM 策略示例](/docs/rancher2/cluster-provisioning/rke-clusters/node-pools/ec2/)策略给用户。

### 可用区和网络

请为您的集群选择可用区和网络配置。

### 安全组（Security Group）

选择默认的安全组或配置安全组。

请参考[使用节点驱动时的 Amazon EC2 安全组](/docs/rancher2/installation/requirements/ports/)，查看`rancher-nodes`安全组中创建了哪些规则。

### 实例

**Instance**配置将要创建的实例。

### SSH 用户

确保为配置的 AMI 配置正确的**SSH 用户**。

### IAM 实例配置文件名称

如果您需要传递**IAM 实例配置文件名**（而不是 ARN），例如，当您要使用[Kubernetes 云提供商](/docs/rancher2/cluster-provisioning/rke-clusters/cloud-providers/)时，您将需要在策略中增加一个权限。请参阅 [Example-iam-policy-with-passrole](#example-iam-policy-with-passrole)，了解一个策略的示例。

### Docker 守护程序

[Docker daemon](https://docs.docker.com/engine/docker-overview/#the-docker-daemon)配置选项包括：

- **标签：**关于标签的信息，请参考[Docker 对象标签文档](https://docs.docker.com/config/labels-custom-metadata/)。
- **Docker Engine Install URL：** 确定将在实例上安装的 Docker 版本。
- **镜像仓库镜像**：Docker 守护进程要使用的 Docker 镜像仓库镜像。
- **其他高级选项：**请参考[Docker 守护进程选项参考](https://docs.docker.com/engine/reference/commandline/dockerd/)。
