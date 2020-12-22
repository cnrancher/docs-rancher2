---
title: 添加Amazon EC2主机
---

Rancher 支持使用`docker machine`部署[Amazon EC2](http://aws.amazon.com/ec2/)。

## 找到 AWS 凭据

在 AWS 上开启一台主机之前，您需要找到您的 AWS 账号凭证和您的安全组信息。通过亚马逊的[文档](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSGettingStartedGuide/AWSCredentials.html)找到正确的密钥，从而找到您的**账号访问**信息。对新创建的密钥对**access key**和**secret key**，务必将它们保存好，一旦丢失将会不可用。

## 启动 Amazon EC2 主机

通过**基础架构** -> **主机**进入主机主界面，单击**添加主机**，选中**Amazon EC2**图标，选择您所在的**区域**，并提供您访问 AWS 的密钥对**Access key**和**Secret Key**，单击**下一步:验证及选择网络**。Rancher 将会根据您提供的凭据决定是否在 AWS 上创建新的实例。

为了创建实例，您需要选择一个可用的区域，根据您选择的区域，会显示可用的 VPC IDs 和 Subnet IDs，选择一个**VPC ID**或者**子网 ID**，并单击**下一步:选择一个安全组**.

接下来，为您的主机使用选择一个安全组，这里有两种模式可供选择。一种是**Standard**，该模式将会创建或者直接使用已经存在的`rancher-machine`安全组，这种安全组默认会开放所有必要的端口，以便 Rancher 能够正常工作。`docker machine`将会自动打开`2376`，该端口是 Docker 守护进程用到的端口。

另一种是**Custom**，该模式下您可以选择一个存在的安全组，但是需要自己确定指定的端口已经打开，以便 Rancher 能够正常工作。

<a id="EC2Ports"></a>

## Rancher 需要用到的端口:

- Rancher Server 访问的 TCP 端口 `22` (通过 SSH 安装和配置 Docker)
- 如果您正在使用 IPsec [网络驱动](/docs/rancher1/rancher-service/networking/_index), 所有主机都需要打开 UDP 端口`500`和`4500`
- 如果您正在使用 VXLAN [网络驱动](/docs/rancher1/rancher-service/networking/_index), 所有主机需要打开 UDP 端口`4789`

> **注意:** 如果您再次使用`rancher-machine`安全组, 之前任何丢失的端口都不会再次打开。如果主机没有正常启动，您需要检查 AWS 上的安全组。

选择安全组选项之后，单击**下一步:设置实例选项**。

最后，您只需要完成填写主机的的一些细节信息。

1. 使用滚动条选择需要启动的主机的数量。
2. 如果需要为主机提供一个**名字**和**描述**。
3. 根据您的需要选择**实例类型**。
4. 选择镜像的**根大小**，`docker machine`中默认大小为 16G，这也是 Rancher 默认需要的大小。
5. (可选) 对于**AMI**，`docker machine` 默认是该特定区域的一个 Ubuntu 16.04 LTS 镜像。您也可以选择您自己的 AMI，但是如果您选择自己的 AMI，请确保以下几点:
   1. 在前面选中的区域中是可访问的；
   2. 定义正确的**SSH User**。如果是使用的[RancherOS AMI](https://github.com/rancher/os#amazon)，SSH User 就应该是`rancher`。
6. (可选)提供用作实例概要的**IAM 简介**。
7. (可选)向主机添加**[标签](/docs/rancher1/infrastructure/hosts/_index#labels)**，以帮助组织主机并[调度服务/负载均衡器](/docs/rancher1/infrastructure/cattle/scheduling/_index)或者是[使用除主机 IP 之外的其他 IP 解析外部 DNS 记录](/docs/rancher1/infrastructure/cattle/external-dns-service/_index#为外部dns使用特定的ip)。
8. (可选)在**\*高级选项**中，您可以定制`docker-machine create`命令[Docker 引擎配置选项](https://docs.docker.com/machine/reference/create/#specifying-configuration-options-for-the-created-docker-engine)。
9. 完成之后，单击**创建**。

Rancher 将会创建 EC2 的实例，并在实例中开启 _rancher-agent_ 容器。几分钟之后，主机将会启动并正常提供[服务](/docs/rancher1/infrastructure/cattle/adding-services/_index)。
