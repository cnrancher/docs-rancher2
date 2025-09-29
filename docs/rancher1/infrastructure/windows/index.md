---
title: Windows (实验性)
---

在 Rancher 中部署 Windows，您首先需要添加一个新的[环境](/docs/rancher1/configurations/environments/)。这个环境需要使用编排引擎为**Windows**的[环境模版](/docs/rancher1/configurations/environments/#什么是环境模版)进行创建。

目前 Rancher 只支持在特定主机上创建容器。大多数在 Cattle 和 Rancher UI 上有的特性目前都不支持**Windows**(如 服务发现, 健康检查, 元数据, DNS, 负载均衡)。

> **注意:** Rancher 中有一个默认的 Windows 环境模版。如果您想创建您自己的 Windows 环境模版，您需要禁用所有其它的基础设施服务，因为这些服务目前都不兼容 Windows。

## 创建一个 Windows 环境

在左上角的环境的下拉菜单中，单击**环境管理**。通过单击**添加环境**去创建一个新的环境，需要填写**名称**，**描述**(可选)，并选择 Windows 作为编排引擎的环境模版。如果启用了[访问控制](/docs/rancher1/configurations/environments/access-control/)，您可以在环境中[编辑成员](/docs/rancher1/configurations/environments/#成员编辑)并选择他们的[成员角色](/docs/rancher1/configurations/environments/#成员角色)。所有被添加到成员列表的用户都能访问您的环境。

在创建 Windows 环境后，您可以在左上角环境的下拉菜单中切换到您的环境，或者在环境管理页面中，在对应环境的下拉选项中单击**切换到此环境**。

> **注意:** Rancher 支持多种容器编排引擎框架，但 Rancher 目前不支持在已有运行服务的环境里切换容器编排引擎。

## 添加 Windows 主机

在 Rancher 中添加一个 Windows 主机，您需要先有一个运行了 Docker 的[Windows Server 2016](https://msdn.microsoft.com/en-us/virtualization/windowscontainers/about/index)主机。

在**基础架构**->**主机**->**添加主机**页面，您可以按照指示用自动生产的自定义命令启动 Rancher Agent。

在主机上，Rancher 的二进制客户端会被下载到`C:/Program Files/rancher`目录，您可以在`C:/ProgramData/rancher/agent.log`找到客户端日志。

## 移除 Windows 主机

作为一个 Rancher 中的主机，Rancher 客户端已经被安装并且注册在了主机上。您必须在 Windows 主机上删除已经存在的 Rancher 客户端服务，您可以在 powershell 中运行如下命令来删除客户端。删除客户端后您可以在 Windows 环境中重用这个主机

```
& 'C:\Program Files\rancher\agent.exe' -unregister-service
```

## Windows 中的网络

我们默认支持 NAT 和[透明网络](https://docs.microsoft.com/zh-cn/virtualization/windowscontainers/).

目前，默认的 **Windows** 环境模版支持名为 transparent 的透明网络
这个透明网络是在运行 `docker network create -d transparent transparent`时创建的。

如果您要创建一个名字不是 `transparent` 的透明网络，您需要创建一个新的环境模版，并把 Windows 设为容器编排平台。选择**Windows**后，您可以单击 **编辑配置** 来更改透明网络的名字。您可以用这个环境模版创建一个环境。但在 Rancher UI 中这个透明网络的默认名字依然是 `transparent`。 因此，您需要把命令更新为 `docker network create -d transparent <NEW_NAME_IN_TEMPLATE`.
