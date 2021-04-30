---
title: 离线安装
description: 你可以使用两种不同的方法在离线环境中安装 K3s。你可以部署一个私有的镜像仓库和 mirror docker.io，或者你可以手动部署镜像，比如用于小型集群。
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

## 概述

离线安装的过程主要分为以下两个步骤：

**步骤 1**：部署镜像，本文提供了两种部署方式，分别是**部署私有镜像仓库**和**手动部署镜像**。请在这两种方式中选择一种执行。

**步骤 2**：安装 K3s，本文提供了两种安装方式，分别是**单节点安装**和**高可用安装**。完成镜像部署后，请在这两种方式中选择一种执行。

**离线升级 K3s 版本**：完成离线安装 K3s 后，您还可以通过脚本升级 K3s 版本，或启用自动升级功能，以保持离线环境中的 K3s 版本与最新的 K3s 版本同步。

请按照下文的操作指导进行离线安装和升级。

## 部署私有镜像仓库

### 前提条件

本文档假设您已经在离线环境中创建了节点，并且在您的堡垒机上有一个 Docker 私有镜像仓库。

如果你还没有建立私有的 Docker 镜像仓库，请参考[Docker 官方文档](https://docs.docker.com/registry/deploying/#run-an-externally-accessible-registry)建立私有的 Docker 镜像仓库。

### 创建镜像仓库 YAML

请按照[私有镜像仓库配置指南](/docs/k3s/installation/private-registry/_index) 创建并配置`registry.yaml`文件。

完成后，现在可以转到下面的[安装 K3s](#安装-k3s)部分，开始安装 K3s。

## 手动部署镜像

### 前提条件

我们假设您已经在离线环境中创建了节点。这种方法需要您手动将必要的镜像部署到每个节点，适用于运行无法部署镜像仓库的边缘部署场景。

### 操作步骤

请按照以下步骤准备镜像目录和 K3s 二进制文件。

1. 从[K3s GitHub Release](https://github.com/rancher/k3s/releases)页面获取你所运行的 K3s 版本的镜像 tar 文件。

1. 将 tar 文件放在`images`目录下，例如：

   ```shell
   sudo mkdir -p /var/lib/rancher/k3s/agent/images/
   sudo cp ./k3s-airgap-images-$ARCH.tar /var/lib/rancher/k3s/agent/images/
   ```

1. 将 k3s 二进制文件放在 `/usr/local/bin/k3s`路径想，并确保拥有可执行权限。完成后，现在可以转到下面的[安装 K3s](#安装-k3s)部分，开始安装 K3s。

## 安装 K3s

### 前提条件

只有在完成上述[部署私有镜像仓库](#部署私有镜像仓库)或[手动部署镜像](#手手动部署镜像)后，才能安装 K3s。

### 操作步骤

1. 从[K3s GitHub Release](https://github.com/rancher/k3s/releases)页面获取 K3s 二进制文件，K3s 二进制文件需要与离线镜像的版本匹配。

1. 获取 K3s 安装脚本：https://get.k3s.io。

1. 将二进制文件放在每个节点的`/usr/local/bin`中，并确保拥有可执行权限。将安装脚本放在每个节点的任意位置，并将其命名为`install.sh`。

### 安装选项

您可以在离线环境中执行单节点安装，在一个 server（节点）上安装 K3s，或高可用安装，在多个 server（节点）上安装 K3s。

#### 单节点安装

1. 在 server 节点上运行以下命令：

   ```
   INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh
   ```

2. 然后，要选择添加其他 agent，请在每个 agent 节点上执行以下操作。注意将 `myserver` 替换为 server 的 IP 或有效的 DNS，并将 `mynodetoken` 替换 server 节点的 token，通常在`/var/lib/rancher/k3s/server/node-token`。

   ```
   INSTALL_K3S_SKIP_DOWNLOAD=true K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken ./install.sh
   ```

#### 高可用安装

您需要调整安装命令，以便指定`INSTALL_K3S_SKIP_DOWNLOAD=true`并在本地运行安装脚本。您还将利用`INSTALL_K3S_EXEC='args'`为 k3s 提供其他参数。

例如，[使用外部数据库实现高可用安装](/docs/k3s/installation/ha/_index)指南的第二步提到了以下内容：

```
curl -sfL https://get.k3s.io | sh -s - server \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

由于在离线环境中无法使用`curl`命令进行安装，所以您需要参考以下示例，将这条命令行修改为离线安装：

```
INSTALL_K3S_SKIP_DOWNLOAD=true INSTALL_K3S_EXEC='server --datastore-endpoint=mysql://username:password@tcp(hostname:3306)/database-name' ./install.sh
```

:::note 注意
K3s 还为 kubelets 提供了一个`--resolv-conf`标志，这可能有助于在离线网络中配置 DNS。
:::

## 升级 K3s

### 通过脚本升级

离线环境的升级可以通过以下步骤完成：

1. 从[K3s GitHub Release](https://github.com/rancher/k3s/releases)页面下载要升级到的 K3s 版本。将 tar 文件放在每个节点的`/var/lib/rancher/k3s/agent/images/`目录下。删除旧的 tar 文件。
2. 复制并替换每个节点上`/usr/local/bin`中的旧 K3s 二进制文件。复制https://get.k3s.io 的安装脚本（因为它可能在上次发布后发生了变化）。再次运行脚本。
3. 重启 K3s 服务。

### 启用自动升级功能

除了可以通过脚本升级 K3s 以外，您还可以启用自动升级功能，以保持离线环境中的 K3s 版本与最新的 K3s 版本同步。

从 **v1.17.4+k3s1** 开始，K3s 支持[自动升级](/docs/k3s/upgrades/automated/_index)。要在离线环境中启用此功能，您必须确保所需镜像在您的私有镜像仓库中可用。

1. 你将需要与你打算升级到的 K3s 版本相对应的 rancher/k3s-upgrade 版本。注意，镜像标签将 K3s 版本中的`+`替换为`-`，因为 Docker 镜像不支持`+`。

1. 你还需要在你要部署的`system-upgrad-controller manifest`YAML 中指定的 `system-upgrad-controller`和`kubectl`的版本。在[这里](https://github.com/rancher/system-upgrade-controller/releases/latest)检查 system-upgrad-controller 的最新版本，并下载 `system-upgrad-controller.yaml`来确定你需要推送到私有镜像仓库的版本。例如，在`system-upgrade-controller`的 v0.4.0 版本中，在 manifest YAML 中指定了这些镜像：

   ```shell
   rancher/system-upgrade-controller:v0.4.0
   rancher/kubectl:v0.17.0
   ```

1. 将必要的 rancher/k3s-upgrade、rancher/system-upgrade-controller 和 rancher/kubectl 镜像添加到您的私有镜像仓库中以后 ，就可以按照[K3s 自动升级指南](/docs/k3s/upgrades/automated/_index)进行操作。
