---
title: "2、同步镜像到私有镜像仓库"
description: 本节描述如何设置您的私有镜像库，以便在安装 Rancher 时，Rancher 从此私有镜像库拉取所有必需的镜像。
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
  - 安装指南
  - 资料、参考和高级选项
  - Rancher 高可用 Helm2 离线安装
  - 同步镜像到私有镜像仓库
---

> Helm 3 已经发布，Rancher 提供了使用 Helm 3 安装 Rancher 的操作指导。
> Helm 3 的易用性和安全性都比 Helm 2 更高，如果您使用的是 Helm 2，我们建议您首先将 Helm 2[迁移到 Helm 3](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)，然后使用 Helm3 安装 Rancher。
> 本文提供了较早版本的使用 Helm 2 安装 Rancher 高可用的安装方法，如果无法升级到 Helm 3，可以使用此方法。

> **先决条件：** 已创建[私有镜像仓库](https://docs.docker.com/registry/deploying/)。
>
> **注意：**
> 对于高可用安装和单节点安装而言，同步镜像到私有镜像仓库的过程是相同的。但是同步用来创建 Linux 集群的镜像和用来创建 Windows 集群的镜像过程是不同的。

默认情况下，Rancher 中所有用于[创建 Kubernetes 集群](/docs/rancher2/cluster-provisioning/_index)或运行任何[工具](/docs/rancher2/cluster-admin/tools/_index)的镜像都从 Docker Hub 中拉取，如： 监控、日志、告警、流水线等镜像。但是在离线环境下安装 Rancher 的步骤略有不同。您需要创建一个私有镜像库，将所有镜像下载到这个私有镜像库里，然后使用 Rancher Server 访问这个仓库，从仓库中拉取镜像。

本节描述如何在离线环境中设置您的私有镜像库，以便在安装 Rancher 时，Rancher 从私有镜像库拉取所需的镜像。

默认情况下，我们假设只配置 Linux 集群，所以本文只提供了如何推送 Linux 需要的镜像到私有镜像库的步骤。如果您需要创建 Windows 集群，请参考[创建 Windows 集群](/docs/rancher2/cluster-provisioning/rke-clusters/windows-clusters/_index)。

## 只需要通过 Rancher 创建 Linux 集群

对于只用来创建 Linux 集群的 Rancher Server，请按以下步骤推送镜像到私有镜像库。

- A. 查找您用的 Rancher 版本所需要的资源
- B. 搜集所有必需的镜像
- C. 将镜像保存到您的工作站中
- D. 推送镜像到私有镜像库

#### 先决条件

这些步骤要求您使用一个 Linux 工作站，它可以访问互联网和您的私有镜像库。请确保至少有 **20GB** 的磁盘空间可用。

如果要使用 ARM64 主机，则镜像库必须支持 docker manifest 功能。截至 2020 年 5 月，Amazon Elastic Container Registry 不支持 docker manifest。

#### A. 查找您用的 rancher 版本所需要的资源

1. 浏览我们的[版本发布页面](https://github.com/rancher/rancher/releases)，查找您想安装的 Rancher v2.x.x 版本。不要下载标记为 `rc` 或 `Pre-release` 的版本，因为它们在生产环境下是不稳定的。

1. 从发行版 **Assets** 部分下载以下文件：

| Release 文件             | 描述                                                                                                                 |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------- |
| `rancher-images.txt`     | 此文件包含安装 Rancher、创建集群和运行 Rancher 工具所需的镜像列表。                                                  |
| `rancher-save-images.sh` | 这个脚本会从 DockerHub 中拉取在文件`rancher-images.txt`中描述的所有镜像，并将它们保存为文件`rancher-images.tar.gz`。 |
| `rancher-load-images.sh` | 这个脚本会载入文件`rancher-images.tar.gz`中的镜像，并将它们推送到您自己的私有镜像库。                                |

#### B. 收集所有必需的镜像（针对使用 Rancher 生成的自签名证书的高可用安装）

在安装高可用过程中，如果选择使用 Rancher 默认的自签名 TLS 证书，则还必须将 [`cert-manager`](https://hub.helm.sh/charts/jetstack/cert-manager) 镜像添加到 `rancher-images.txt` 文件中。如果使用自己的证书，则跳过此步骤。

1.  获取最新的`cert-manager` Helm chart，并解析模板以获取镜像详细信息：

    > **注意：** 由于`cert-manager`最近的改动，您需要升级`cert-manager`版本。果您要升级 Rancher 并且使用`cert-manager`的版本低于 v0.12.0，请看我们的[升级文档](/docs/rancher2/installation/options/upgrading-cert-manager/_index)。

    ```plain
    helm repo add jetstack https://charts.jetstack.io
    helm repo update
    helm fetch jetstack/cert-manager --version v0.12.0
    helm template ./cert-manager-<version>.tgz | grep -oP '(?<=image: ").*(?=")' >> ./rancher-images.txt
    ```

2.  对镜像列表进行排序和唯一化，以去除重复的镜像源。

    ```plain
    sort -u rancher-images.txt -o rancher-images.txt
    ```

#### C. 将镜像保存到您的工作站中

1. 添加 `rancher-save-images.sh`文件的可执行权限。

   ```
   chmod +x rancher-save-images.sh
   ```

1. 执行脚本`rancher-save-images.sh`并以`--image-list ./rancher-images.txt` 作为参数，创建所需镜像的压缩包。

   ```plain
   ./rancher-save-images.sh --image-list ./rancher-images.txt
   ```

   **结果：** Docker 开始会拉取用于离线安装所需的镜像。这个过程会花费几分钟时间。完成时，您的当前目录会输出名为`rancher-images.tar.gz`的压缩包。请确认文件存在这个目录里。

#### D. 推送镜像到私有镜像库

使用脚本将文件 `rancher-images.tar.gz` 中的镜像转移到您自己的私有镜像库。文件 `rancher-images.txt` 应该位于工作站中运行 `rancher-load-images.sh` 脚本的同一目录下。

1.  登录私有镜像库。
    ```plain
    docker login <REGISTRY.YOURDOMAIN.COM:PORT>
    ```
1.  添加 `rancher-load-images.sh`文件的可执行权限。

    ```
    chmod +x rancher-load-images.sh
    ```

1.  使用脚本 `rancher-load-images.sh`提取`rancher-images.tar.gz`文件中的镜像，根据文件`rancher-images.txt`中的镜像列表对提取的镜像文件重新打 tag 并推送到您的私有镜像库中。

    ```
    ./rancher-load-images.sh --image-list ./rancher-images.txt --registry <REGISTRY.YOURDOMAIN.COM:PORT>`
    ```

## 需要通过 Rancher 创建 Linux 集群 和 Windows 集群

_v2.3.0 及以后版本可用_

对于用来创建 Linux 和 Windows 集群的 Rancher Server，会有不同的步骤来为您的私有镜像库同步 Windows 镜像和 Linux 镜像。因为一个 Windows 集群会包含 Linux 和 Windows 的混合节点。

### 同步 Windows 镜像

从 Windows 工作站中收集和推送 Windows 镜像。

- A. 查找您用的 rancher 版本所需要的资源
- B. 将镜像保存到您的 Windows 服务工作站中
- C. 准备 Docker 守护进程
- D. 推送镜像到私有镜像库

#### 先决条件

这些步骤要求您使用 Windows Server 1809 工作站，该工作站能访问网络、能访问您的私有镜像库 以及至少 50 GB 的磁盘空间。

工作站必须安装 Docker 18.02+版本，因为这个版本的 Docker 支持 manifests，这个特性是设置 Windows 集群所必须的。

如果要使用 ARM64 主机，则镜像库必须支持 docker manifest 功能。截至 2020 年 5 月，Amazon Elastic Container Registry 不支持 docker manifest。

#### A. 查找您用的 Rancher 版本所需要的资源

1. 浏览我们的[版本发布页面](https://github.com/rancher/rancher/releases)并查找您想要安装的 Rancher v2.x.x 版本。不要下载标记为 `rc` 或 `Pre-release` 的版本，因为它们在生产环境下不稳定。

2. 从发行版本的 "Assets" 部分，下载下列文件：

   | Release 文件                 | 描述                                                                                                                                   |
   | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
   | `rancher-windows-images.txt` | 这个文件包含设置 Windows 集群所需的 Windows 镜像列表。                                                                                 |
   | `rancher-save-images.ps1`    | 这个脚本会从 DockerHub 上拉取所有在文件`rancher-windows-images.txt`中列举的镜像，并将它们保存到`rancher-windows-images.tar.gz`文件中。 |
   | `rancher-load-images.ps1`    | 这个脚本会从压缩包`rancher-windows-images.tar.gz`中加载镜像，并把它们推送到您的私有镜像库 中。                                         |

#### B. 将镜像保存到您的 Windows 服务工作站中

1. 在 `powershell`中，进入上一步有下载文件的目录里。

1. 运行脚本 `rancher-save-images.ps1`， 去创建所有必需的压缩包：

   ```plain
   ./rancher-save-images.ps1
   ```

   **步骤结果：** Docker 会开始拉取离线安装所需要的镜像。这个过程需要几分钟时间，请耐心等待。拉取镜像结束后，您的当前目录会输出名为`rancher-windows-images.tar.gz`的压缩包。请确认输出文件是否存在。

#### C. 准备 Docker 守护进程

将您的私有镜像库地址追加到 Docker 守护进程配置文件(`C:\ProgramData\Docker\config\daemon.json`)的`allow-nondistributable-artifacts`配置字段中。由于 Windows 镜像的基础镜像是由`mcr.microsoft.com` Registry 维护的，这一步是必须的，因为 Docker Hub 中缺少 Microsoft 注册表层，需要将其拉入私有镜像库。

```
{
  ...
  "allow-nondistributable-artifacts": [
    ...
    "<REGISTRY.YOURDOMAIN.COM:PORT>"
  ]
  ...
}
```

#### D. 推送镜像到私有镜像库

通过脚本将文件`rancher-windows-images.tar.gz`中的镜像移入到您私有镜像库中。在工作站中，文件`rancher-windows-images.txt`要放在与运行脚本`rancher-load-images.ps1`同一目录下。

1. 如果需要，请使用 `powershell`，登录到您的私有镜像库：

   ```plain
   docker login <REGISTRY.YOURDOMAIN.COM:PORT>
   ```

1. 在 `powershell`中，使用 `rancher-load-images.ps1`脚本，提取文件`rancher-images.tar.gz`中的镜像，重新打 tag 并将它们推送到您的私有镜像库中：

   ```plain
   ./rancher-load-images.ps1 --registry <REGISTRY.YOURDOMAIN.COM:PORT>
   ```

### 同步 Linux 镜像

Linux 镜像需要从 Linux 主机上收集和推送，但是必须先将 Windows 镜像推送到您的私有镜像库，然后再推送 Linux 镜像。这些步骤不同于只支持 Linux 集群设置步骤，因为被推送的 Linux 镜像实际是支持 Windows 和 Linux 镜像的 manifest 镜像。

- A. 查找您用的 rancher 版本所需要的资源
- B. 收集所有需要的镜像
- C. 将镜像保存到您的 Linux 服务工作站中
- D. 推送镜像到私有镜像库

#### 先决条件

在把 Linux 镜像推送到私有镜像库中之前，必须先把 Windows 镜像推送到私有镜像库中。如果您已经把 Linux 镜像推送到私有镜像库中，则需要再次按照这些说明重新推送，因为它们将发布支持 Windows 和 Linux 镜像的 manifest 镜像。

这些步骤要求您使用一个 Linux 工作站，它能访问互联网，而且可以访问您的私有镜像库。并且至少有 20GB 的磁盘空间。

因为需要支持 manifest 特性，工作站必须装有 Docker 18.02+ 版本，这是配置 Windows 集群的先决条件。

#### A. 查找您用的 Rancher 版本所需要的资源

1. 浏览我们的[版本发布页面](https://github.com/rancher/rancher/releases)并查找您想要安装的 Rancher v2.x.x 版本。不要下载标记为 rc or Pre-release 的版本，因为它们在生产环境下不稳定。

2. 从发行版 **Assets** 部分下载以下文件，这些文件是离线环境下安装 Rancher 所必需的:

   | Release 文件                 | 描述                                                                                                                  |
   | :--------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
   | `rancher-images.txt`         | 此文件包含安装 Rancher、设置集群和用户 Rancher 工具所需的镜像列表。                                                   |
   | `rancher-windows-images.txt` | 此文件包含需要设置 Windows 集群所需的镜像列表。                                                                       |
   | `rancher-save-images.sh`     | 这个脚本会从 Docker Hub 中拉取所有在文件`rancher-images.txt`中列举的镜像并将它们保存到`rancher-images.tar.gz`文件中。 |
   | `rancher-load-images.sh`     | 这个脚本会从压缩包`rancher-images.tar.gz`中加载镜像，并把它们推送到您的私有镜像库 中。                                |

#### B. 收集所有必需的镜像

**针对使用 Rancher 生成的自签名证书安装的高可用：** 在安装 Kubernetes 过程中，如果选择使用 Rancher 默认的自签名 TLS 证书，则还必须将[`cert-manager`](https://hub.helm.sh/charts/jetstack/cert-manager)镜像添加到`rancher-images.txt`文件中。如果使用自己的证书，则跳过此步骤。

1.  获取最新的`cert-manager` Helm chart，并解析模板以获取镜像详细信息：

    > **注意：** 由于`cert-manager`最近的改动，您需要升级`cert-manager`版本。如果您要升级 Rancher 并且使用`cert-manager`的版本低于 v0.12.0，请看我们的[升级文档](/docs/rancher2/installation/options/upgrading-cert-manager/_index)。

    ```plain
    helm repo add jetstack https://charts.jetstack.io
    helm repo update
    helm fetch jetstack/cert-manager --version v0.12.0
    helm template ./cert-manager-<version>.tgz | grep -oP '(?<=image: ").*(?=")' >> ./rancher-images.txt
    ```

2.  对镜像列表进行排序和唯一化，以去除重复的镜像源：

    ```plain
    sort -u rancher-images.txt -o rancher-images.txt
    ```

#### C. 将镜像保存到您的工作站中

1. 给脚本添加 `rancher-save-images.sh` 可执行权限：

   ```
   chmod +x rancher-save-images.sh
   ```

1. 以镜像列表文件`rancher-images.txt`为参数执行脚本 `rancher-save-images.sh`来创建所有必须镜像的压缩包：

   ```plain
   ./rancher-save-images.sh --image-list ./rancher-images.txt
   ```

   **结果：** Docker 会开始拉取用于离线安装所需的镜像。这个过程会花费几分钟时间。完成时，您的当前目录会输出名为 rancher-images.tar.gz 的压缩包。请确认文件存在这个目录里。

#### D. 推送镜像到私有镜像库

用脚本`rancher-load-images.sh`将文件`rancher-images.tar.gz`中的镜像移入到您私有镜像库中。在工作站中，镜像列表文件 `rancher-images.txt` / `rancher-windows-images.txt`要放在与运行脚本`rancher-load-images.sh`同一目录下。

1. 请先登录到自己的私有镜像库 中：

   ```plain
   docker login <REGISTRY.YOURDOMAIN.COM:PORT>
   ```

1. 给文件 `rancher-load-images.sh` 添加可执行权限：

   ```
   chmod +x rancher-load-images.sh
   ```

1. 使用 `rancher-load-images.sh`脚本，提取文件`rancher-images.tar.gz`中的镜像，重新打 tag 并将它们推送到您的私有镜像库 中：
   ```plain
   ./rancher-load-images.sh --image-list ./rancher-images.txt \
     --windows-image-list ./rancher-windows-images.txt \
     --registry <REGISTRY.YOURDOMAIN.COM:PORT>
   ```

## 后续操作

[安装 Rancher 高可用](/docs/rancher2/installation/options/air-gap-helm2/launch-kubernetes/_index)
或
[安装 Rancher 单节点](/docs/rancher2/installation/options/air-gap-helm2/install-rancher/_index)
