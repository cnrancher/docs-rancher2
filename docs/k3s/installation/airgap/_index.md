---
title: "离线安装"
description: 你可以使用两种不同的方法在离线环境中安装 K3s。你可以部署一个私有的注册表和 mirror docker.io，或者你可以手动部署镜像，比如用于小型集群。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - 安装介绍
  - 离线安装
---

你可以使用两种不同的方法在离线环境中安装 K3s。你可以部署一个私有的注册表和 mirror docker.io，或者你可以手动部署镜像，比如用于小型集群。

## 私有注册表方法

本文档假设您已经在离线环境中创建了节点，并且在您的堡垒主机上有一个 Docker 私有注册表。

如果你还没有建立私有的 Docker 注册表，请参考[官方文档](https://docs.docker.com/registry/deploying/#run-an-externally-accessible-registry)。

### 创建注册表 YAML

按照[私有注册表配置](/docs/k3s/installation/private-registry/_index) 指南创建并配置 registry.yaml 文件。

完成后，现在可以转到下面的[安装 K3s](#安装-k3s)部分。

## 手动部署镜像方法

我们假设您已经在离线环境中创建了节点。这种方法需要您手动将必要的镜像部署到每个节点，适用于运行私有注册表不可行的边缘部署场景。

### 准备镜像目录和 K3s 二进制文件

从[发布](https://github.com/rancher/k3s/releases)页面获取你所运行的 K3s 版本的镜像 tar 文件。

将 tar 文件放在`images`目录下，例如：

```sh
sudo mkdir -p /var/lib/rancher/k3s/agent/images/
sudo cp ./k3s-airgap-images-$ARCH.tar /var/lib/rancher/k3s/agent/images/
```

将 k3s 二进制文件放在 `/usr/local/bin/k3s`，并确保拥有可执行权限。

按照下一节的步骤来安装 K3s。

## 安装 K3s

只有在完成上述[私有注册表方法](#私有注册表方法)或[手动部署镜像方法](#手动部署镜像方法)后，才能安装 K3s。

从[发布](https://github.com/rancher/k3s/releases)页面获取 K3s 二进制文件，K3s 二进制文件需要与离线镜像的版本匹配。
获取 K3s 安装脚本：https://get.k3s.io

将二进制文件放在每个节点的`/usr/local/bin`中，并确保拥有可执行权限。将安装脚本放在每个节点的任意位置，并将其命名为`install.sh`。

### 安装选项

你可以在一个或多个 server 上安装 K3s，如下所述

#### 单 K3s Server 节点配置

要在单台 server 上安装 K3s，只需在 server 节点上进行以下操作：

```
INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh
```

然后，要选择添加其他 agent，请在每个 agent 节点上执行以下操作。注意将 `myserver` 替换为 server 的 IP 或有效的 DNS，并将 `mynodetoken` 替换 server 节点的 token，通常在`/var/lib/rancher/k3s/server/node-token`。

```
INSTALL_K3S_SKIP_DOWNLOAD=true K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken ./install.sh
```

#### 高可用配置

参考 [使用外部数据库实现高可用](/docs/k3s/installation/ha/_index)或 [嵌入式 DB 的高可用](/docs/k3s/installation/ha-embedded/_index)指南。您将调整安装命令，以便指定`INSTALL_K3S_SKIP_DOWNLOAD=true`并在本地运行安装脚本，而不是通过 curl。您还将利用`INSTALL_K3S_EXEC='args'`为 k3s 提供其他参数。

例如，"使用外部数据库实现高可用"指南的第二步提到了以下内容：

```
curl -sfL https://get.k3s.io | sh -s - server \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

相反，您将修改如下示例：

```
INSTALL_K3S_SKIP_DOWNLOAD=true INSTALL_K3S_EXEC='server --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"' ./install.sh
```

> **注意：** K3s 还为 kubelets 提供了一个`--resolv-conf`标志，这可能有助于在离线网络中配置 DNS。

## 升级

### 安装脚本方法

离线环境的升级可以通过以下方式完成：

1. 从[发布](https://github.com/rancher/k3s/releases)页面下载要升级到的 K3s 版本。将 tar 文件放在每个节点的`/var/lib/rancher/k3s/agent/images/`目录下。删除旧的 tar 文件。
2. 复制并替换每个节点上`/usr/local/bin`中的旧 K3s 二进制文件。复制https://get.k3s.io 的安装脚本（因为它可能在上次发布后发生了变化）。再次运行脚本，就像你过去用相同的环境变量做的那样。
3. 重启 K3s 服务（如果安装程序没有自动重新启动）。

### 自动升级方法

从 v1.17.4+k3s1 开始，K3s 支持[自动升级](/docs/k3s/upgrades/automated/_index)。要在离线环境中启用此功能，您必须确保所需镜像在您的私有注册表中可用。

你将需要与你打算升级到的 K3s 版本相对应的 rancher/k3s-upgrade 版本。注意，图像标签将 K3s 版本中的`+`替换为`-`，因为 Docker 图像不支持`+`。

你还需要在你要部署的 system-upgrad-controller manifest YAML 中指定的 system-upgrad-controller 和 kubectl 的版本。在[这里](https://github.com/rancher/system-upgrade-controller/releases/latest)检查 system-upgrad-controller 的最新版本，并下载 system-upgrad-controller.yaml 来确定你需要推送到私有注册表的版本。例如，在 system-upgrade-controller 的 v0.4.0 版本中，在 manifest YAML 中指定了这些镜像：

```
rancher/system-upgrade-controller:v0.4.0
rancher/kubectl:v0.17.0
```

一旦您将必要的 rancher/k3s-upgrade、rancher/system-upgrade-controller 和 rancher/kubectl 镜像添加到您的私有注册表中，就可以按照[自动升级](/docs/k3s/upgrades/automated/_index)指南进行操作。
