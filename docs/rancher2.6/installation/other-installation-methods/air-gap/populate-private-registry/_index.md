---
title: '2. 收集镜像并发布到私有仓库'
weight: 200
---

本文介绍如何配置私有镜像仓库，以便在安装 Rancher 时，Rancher 可以从此私有镜像仓库中拉取所需的镜像。

默认情况下，所有用于[配置 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/)或启动 Rancher 中的工具（如监控，管道，告警等）的镜像都是从 Docker Hub 中拉取的。在 Rancher 的离线安装中，你需要一个私有仓库，该仓库位于你的 Rancher Server 中某个可访问的位置。然后，你可加载该存有所有镜像的镜像仓库。

使用 Docker 安装 Rancher，和把 Rancher 安装到 Kubernetes 集群，其对应的推送镜像到私有镜像仓库步骤是一样的。

你使用 Rancher 配置的下游集群是否有运行 Windows 的节点，决定了本文涉及的步骤。我们提供的推送镜像到私有镜像仓库步骤，是基于假设 Rancher 仅配置运行 Linux 节点的下游 Kubernetes 集群的。但是，如果你计划[在下游 Kubernetes 集群中使用 Windows 节点]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/windows-clusters/)，我们有单独的文档来介绍如何为需要的镜像提供支持。

> **前提**：
>
> 你有一个可用的[私有镜像仓库](https://docs.docker.com/registry/deploying/#run-an-externally-accessible-registry)。
>
> 如果镜像仓库有证书，请参见 [K3s 文档中心](https://rancher.com/docs/k3s/latest/en/installation/private-registry/)了解添加私有镜像仓库的详情。证书和镜像仓库配置文件均需要挂载到 Rancher 容器中。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


<Tabs
defaultValue="linux"
values={[
{ label: '仅包含 Linux 节点的集群', value: 'linux', },
{ label: '包含 Linux 和 Windows 节点的集群', value: 'linuxwin', },
]}>

<TabItem value="linux">

如果 Rancher Server 用于配置仅有 Linux 节点的集群，请按以下步骤将你的镜像推送到私有镜像仓库。

1. [找到你的 Rancher 版本所需的资源](#1-find-the-required-assets-for-your-rancher-version)
2. [收集 cert-manager 镜像](#2-collect-the-cert-manager-image)（除非你使用自己的证书，或在负载均衡器上终止 TLS）
3. [把镜像保存到你的工作站](#3-save-the-images-to-your-workstation)
4. [推送镜像到私有镜像仓库](#4-populate-the-private-registry)

### 前提

这些步骤要求你使用一个 Linux 工作站，该工作站需要可访问互联网和你的私有镜像仓库，且至少有 20GB 的可用磁盘空间。

如果你的主机架构是 ARM64，镜像仓库必须支持 Manifest。这是因为从 2020 年 4 月开始, Amazon Elastic Container Registry 已经不再支持 Manifest。

### 1. 找到你的 Rancher 版本所需的资源

1. 访问 Rancher 的[发布说明](https://github.com/rancher/rancher/releases)页面，找到你需要安装的 Rancher v2.x.x 版本，然后点击 **Assets**。注意不要使用带有 `rc` 或 `Pre-release` 标记的版本，因为这些版本在生产环境中不够稳定。

2. 从你所需版本的 **Assets** 处下载以下文件，这些文件是在离线环境中安装 Rancher 所必须的：

| Release 文件 | 描述 |
| ---------------- | -------------- |
| `rancher-images.txt` | 此文件包含安装 Rancher、配置集群和用户 Rancher 工具所需的镜像。 |
| `rancher-save-images.sh` | 该脚本从 Docker Hub 中拉取在文件 `rancher-images.txt` 中记录的所有镜像，并把这些镜像保存为 `rancher-images.tar.gz`。 |
| `rancher-load-images.sh` | 该脚本从 `rancher-images.tar.gz` 文件中加载镜像，并把镜像推送到你的私有镜像仓库。 |

### 2. 收集 cert-manager 镜像

> 如果你使用自己的证书，或要在外部负载均衡器上终止 TLS，请跳过此步骤。

在 Kubernetes 安装中，如果你使用的是 Rancher 默认的自签名 TLS 证书，则必须将 [`cert-manager`](https://hub.helm.sh/charts/jetstack/cert-manager) 镜像添加到 `rancher-images.txt` 文件中。

1. 获取最新的 `cert-manager` Helm Chart，并解析模板以获取镜像的详情信息：

   > **注意**：由于 cert-manager 的最新改动，你需要升级 cert-manager 版本。如果你要升级 Rancher，但你使用的 cert-manager 版本早于 0.12.0，请参见[升级文档]({{<baseurl>}}/rancher/v2.6/en/installation/resources/upgrading-cert-manager/)。

   ```plain
   helm repo add jetstack https://charts.jetstack.io
   helm repo update
   helm fetch jetstack/cert-manager --version v1.5.1
   helm template ./cert-manager-<version>.tgz | awk '$1 ~ /image:/ {print $2}' | sed s/\"//g >> ./rancher-images.txt
   ```

2. 对镜像列表进行排序和唯一化，以去除重复的镜像源：

   ```plain
   sort -u rancher-images.txt -o rancher-images.txt
   ```

### 3. 将镜像保存到你的工作站中

1. 为 `rancher-save-images.sh` 文件添加可执行权限：
   ```
   chmod +x rancher-save-images.sh
   ```

1. 使用 `rancher-images.txt` 镜像列表执行 `rancher-save-images.sh` 脚本，以创建包含所有所需镜像的压缩包：
   ```plain
   ./rancher-save-images.sh --image-list ./rancher-images.txt
   ```
   **结果**：Docker 开始拉取用于离线安装的镜像。请耐心等待。这个过程需要几分钟。完成时，你的当前目录会输出名为 `rancher-images.tar.gz` 的压缩包。请确认输出文件是否存在。

### 4. 推送镜像到私有镜像仓库

下一步，你将使用脚本将 `rancher-images.tar.gz` 中的镜像移动到你的私有镜像仓库，以方便加载镜像。

使用脚本将 `rancher-images.tar.gz` 中的镜像移动到你的私有镜像仓库，以方便加载镜像。

`rancher-images.txt` 需要位于工作站中运行 `rancher-load-images.sh` 脚本的同一目录中。`rancher-images.tar.gz` 也需要位于同一目录中。

1. 登录到你的私有镜像仓库：
```plain
docker login <REGISTRY.YOURDOMAIN.COM:PORT>
```
1. 为 `rancher-load-images.sh` 添加可执行权限：
```
chmod +x rancher-load-images.sh
```

1. 使用 `rancher-load-images.sh` 脚本来提取，标记和推送 `rancher-images.txt` 及 `rancher-images.tar.gz` 到你的私有镜像仓库：
```plain
./rancher-load-images.sh --image-list ./rancher-images.txt --registry <REGISTRY.YOURDOMAIN.COM:PORT>
```
</TabItem>
<TabItem value="linuxwin">

如果你的 Rancher Server 将用于配置 Linux 和 Windows 集群，你需要执行不同的步骤，来将 Windows 镜像和 Linux 镜像推送到你的私有镜像仓库。由于 Windows 集群同时包含 Linux 和 Windows 节点，因此推送到私有镜像仓库的 Linux 镜像是 Manifest。

## Windows 步骤

从 Windows Server 工作站中收集和推送 Windows 镜像。

1. <a href="#windows-1">找到你的 Rancher 版本所需的资源</a>
2. <a href="#windows-2">将镜像保存到你的 Windows Server 工作站</a>
3. <a href="#windows-3">准备 Docker daemon</a>
4. <a href="#windows-4">推送镜像到私有镜像仓库</a>

### 前提

以下步骤假设你使用 Windows Server 1809 工作站，该工作站能访问网络及你的私有镜像仓库，且至少拥有 50GB 的磁盘空间。

工作站必须安装 Docker 18.02+ 版本以提供 manifest 支持。Manifest 支持是配置 Windows 集群所必须的。

你的镜像仓库必须支持 Manifest。这是因为从 2020 年 4 月开始, Amazon Elastic Container Registry 已经不再支持 Manifest。

<a name="windows-1"></a>

### 1. 找到你的 Rancher 版本所需的资源

1. 访问 Rancher 的[发布说明](https://github.com/rancher/rancher/releases)页面，找到你需要安装的 Rancher v2.x.x 版本。不要下载带有 `rc` 或 `Pre-release` 标记的版本，因为这些版本在生产环境中不够稳定。

2. 从你所需版本的 **Assets** 处下载以下文件：

| Release 文件 | 描述 |
|----------------------------|------------------|
| `rancher-windows-images.txt` | 此文件包含配置 Windows 集群所需的 Windows 镜像。 |
| `rancher-save-images.ps1` | 该脚本从 Docker Hub 中拉取在文件 `rancher-windows-images.txt` 中记录的所有镜像，并把这些镜像保存为 `rancher-windows-images.tar.gz`。 |
| `rancher-load-images.ps1` | 该脚本从 `rancher-windows-images.tar.gz` 文件中加载镜像，并把镜像推送到你的私有镜像仓库。 |

<a name="windows-2"></a>

### 2. 将镜像保存到你的 Windows Server 工作站

1. 在 `powershell` 中，进入上一步下载的文件所在的目录。

1. 运行 `rancher-save-images.ps1` 以创建包含所有所需镜像的压缩包：
   ```plain
   ./rancher-save-images.ps1
   ```

   **结果**：Docker 开始拉取用于离线安装的镜像。请耐心等待。这个过程需要几分钟。完成时，你的当前目录会输出名为 `rancher-windows-images.tar.gz` 的压缩包。请确认输出文件是否存在。

<a name="windows-3"></a>

### 3. 准备 Docker daemon

将你的私有镜像仓库地址尾附到 Docker daemon (`C:\\ProgramData\\Docker\\config\\daemon.json`) 的 `allow-nondistributable-artifacts` 配置字段中。Windows 镜像的基础镜像是由 `mcr.microsoft.com` 镜像仓库维护的，而 Docker Hub 中缺少 Microsoft 镜像仓库层，且需要将其拉入私有镜像仓库，因此这一步骤是必须的。

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

<a name="windows-4"></a>

### 4. 推送镜像到私有镜像仓库

使用脚本将 `rancher-windows-images.tar.gz` 中的镜像移动到你的私有镜像仓库，以方便加载镜像。

`rancher-windows-images.txt` 需要位于工作站中运行 `rancher-load-images.ps1` 脚本的同一目录中。`rancher-windows-images.tar.gz` 也需要位于同一目录中。

1. 使用 `powershell` 登录到你的私有镜像仓库：
   ```plain
   docker login <REGISTRY.YOURDOMAIN.COM:PORT>
   ```

1. 在 `powershell` 中，使用 `rancher-load-images.ps1` 脚本来提取，标记和推送 `rancher-images.tar.gz` 中的镜像到你的私有镜像仓库：
   ```plain
   ./rancher-load-images.ps1 --registry <REGISTRY.YOURDOMAIN.COM:PORT>
   ```

## Linux 步骤

Linux 镜像需要在 Linux 主机上收集和推送，但是你必须先将 Windows 镜像推送到私有镜像仓库，然后再推送 Linux 镜像。由于被推送的 Linux 镜像实际上是支持 Windows 和 Linux 镜像的 manifest，因此涉及的步骤不同于只包含 Linux 节点的集群。

1. <a href="#linux-1">找到你的 Rancher 版本所需的资源</a>
2. <a href="#linux-2">收集所有需要的镜像</a>
3. <a href="#linux-3">将镜像保存到你的 Linux 工作站中</a>
4. <a href="#linux-4">推送镜像到私有镜像仓库</a>

### 前提

在将 Linux 镜像推送到私有镜像仓库之前，你必须先把 Windows 镜像推送到私有镜像仓库。如果你已经把 Linux 镜像推送到私有镜像仓库，则需要再次按照说明重新推送，因为它们需要发布支持 Windows 和 Linux 镜像的 manifest。

这些步骤要求你使用一个 Linux 工作站，该工作站需要可访问互联网和你的私有镜像仓库，且至少有 20GB 的可用磁盘空间。

工作站必须安装 Docker 18.02+ 版本以提供 manifest 支持。Manifest 支持是配置 Windows 集群所必须的。

<a name="linux-1"></a>

### 1. 找到你的 Rancher 版本所需的资源

1. 访问 Rancher 的[发布说明](https://github.com/rancher/rancher/releases)页面，找到你需要安装的 Rancher v2.x.x 版本。不要下载带有 `rc` 或 `Pre-release` 标记的版本，因为这些版本在生产环境中不够稳定。点击 **Assets**。

2. 从你所需版本的 **Assets** 处下载以下文件：

| Release 文件 | 描述 |
|----------------------------| -------------------------- |
| `rancher-images.txt` | 此文件包含安装 Rancher、配置集群和用户 Rancher 工具所需的镜像。 |
| `rancher-windows-images.txt` | 此文件包含配置 Windows 集群所需的镜像。 |
| `rancher-save-images.sh` | 该脚本从 Docker Hub 中拉取在文件 `rancher-images.txt` 中记录的所有镜像，并把这些镜像保存为 `rancher-images.tar.gz`。 |
| `rancher-load-images.sh` | 该脚本从 `rancher-images.tar.gz` 文件中加载镜像，并把镜像推送到你的私有镜像仓库。 |

<a name="linux-2"></a>

### 2. 收集所有需要的镜像

**在 Kubernetes 安装中，如果你使用的是 Rancher 默认的自签名 TLS 证书**，则必须将 [`cert-manager`](https://hub.helm.sh/charts/jetstack/cert-manager) 镜像添加到 `rancher-images.txt` 文件中。如果你使用自己的证书，则可跳过此步骤。

1. 获取最新的 `cert-manager` Helm Chart，并解析模板以获取镜像的详情信息：
   > **注意**：由于 cert-manager 的最新改动，你需要升级 cert-manager 版本。如果你要升级 Rancher，但你使用的 cert-manager 版本早于 0.12.0，请参见[升级文档]({{<baseurl>}}/rancher/v2.6/en/installation/resources/upgrading-cert-manager/)。
   ```plain
   helm repo add jetstack https://charts.jetstack.io
   helm repo update
   helm fetch jetstack/cert-manager --version v0.12.0
   helm template ./cert-manager-<version>.tgz | awk '$1 ~ /image:/ {print $2}' | sed s/\"//g >> ./rancher-images.txt
   ```

2. 对镜像列表进行排序和唯一化，以去除重复的镜像源：
   ```plain
   sort -u rancher-images.txt -o rancher-images.txt
   ```

<a name="linux-3"></a>

### 3. 将镜像保存到你的工作站中

1. 为 `rancher-save-images.sh` 文件添加可执行权限：
   ```
   chmod +x rancher-save-images.sh
   ```

1. 使用 `rancher-images.txt` 镜像列表执行 `rancher-save-images.sh` 脚本，以创建包含所有所需镜像的压缩包：
   ```plain
   ./rancher-save-images.sh --image-list ./rancher-images.txt
   ```

**结果**：Docker 开始拉取用于离线安装的镜像。请耐心等待。这个过程需要几分钟。完成时，你的当前目录会输出名为 `rancher-images.tar.gz` 的压缩包。请确认输出文件是否存在。

<a name="linux-4"></a>

### 4. 推送镜像到私有镜像仓库

使用 `rancher-load-images.sh script` 脚本将 `rancher-images.tar.gz` 中的镜像移动到你的私有镜像仓库，以方便加载镜像。

镜像列表，即 `rancher-images.txt` 或 `rancher-windows-images.txt` 需要位于工作站中运行 `rancher-load-images.sh` 脚本的同一目录中。`rancher-images.tar.gz` 也需要位于同一目录中。

1. 登录到你的私有镜像仓库：
   ```plain
   docker login <REGISTRY.YOURDOMAIN.COM:PORT>
   ```

1. 为 `rancher-load-images.sh` 添加可执行权限：
   ```
   chmod +x rancher-load-images.sh
   ```

1. 使用 `rancher-load-images.sh` 脚本来提取，标记和推送 `rancher-images.tar.gz` 中的镜像到你的私有镜像仓库：

```plain
./rancher-load-images.sh --image-list ./rancher-images.txt \
   --windows-image-list ./rancher-windows-images.txt \
   --registry <REGISTRY.YOURDOMAIN.COM:PORT>
```


</TabItem>
</Tabs>

### [Kubernetes 安装的后续步骤 - 启动 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/launch-kubernetes/)

### [Docker 安装的后续步骤 - 安装 Rancher]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/install-rancher/)
