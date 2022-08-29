---
title: 离线运行
description: 本文介绍了离线运行的要求以及可能出现的问题。
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
  - Rancher Desktop
  - rancher desktop
  - rancherdesktop
  - RancherDesktop
  - 离线运行
  - 离线
  - 脱机
  - air gap
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Rancher Desktop 可以在离线模式下运行。本文介绍了离线运行的要求以及可能出现的问题。

### 网络敏感区域

Rancher Desktop 假设有两个的区域的网络可用，并会在离线的情况下进行恢复：

1. 将 Kubernetes `k3s` 镜像拉入 `k3s` 缓存目录

2. 使用 `kuberlr` 作为对 `kubectl` 的版本感知包装器，因此客户端与 Kubernetes Server 的差异不会超过一个次要版本。

### 现有 Deployment

如果 Rancher Desktop 安装在最初就具有网络访问权限的主机上，在关闭网络连接后，Rancher Desktop 仍能在该主机上运行。但是，下拉菜单中可用的 Kubernetes 版本会限制为已下载并存储在缓存中的版本。

由于 `kuberlr` 包装器（Windows 用户需要为每个可执行实用程序文件添加 `.exe` 后缀），因此使用 `kubectl` 客户端会存在一个问题。

在这种情况下，虽然我们的系统在初始化时已经连接到互联网，但是后续使用时会让主机脱机使用。

假设 `rancher-desktop` 缓存中有三个版本的 `k3s`：

- 1.24.3

- 1.21.14

- 1.19.16

假设在这个系统上我们只有在使用 `1.24.3` 和 `1.21.14` 时运行了 `kubectl`。换言之，`~/.kuberlr/PLATFORM-ARCH/` 目录（Windows 上为`%HOME%/.kuberlr/windows-amd64`）只包含两个文件：

- kubectl1.24.3

- kubectl1.21.14

如果我们将系统脱机，并通过 UI 切换到 Kubernetes `1.19.16`，则系统会在运行 `kubectl` 的时候失败。
问题在于 `kubectl` 是 `kuberlr` 的别名，它会尝试下载 `kubectl 1.19.16` 并将它安装到 `.kuberlr` 目录中，但却无法进行访问。

因此在这种情况下，最好的方法是选择缓存中每个可用的 Kubernetes 版本，并运行 `kubectl --context rancher-desktop cluster-info` 来确保安装了适当版本的 `kubectl` 客户端，以便在断开连接时能连接系统。

你_可以_手动安装版本化的 `kubectl`，具体内容会在下一节中介绍。

### 准备离线系统

此处假设你有某种移动媒体，你可以将其填充到联网系统上，然后移至离线系统中。

要让 Rancher Desktop 离线运行，你需要填充两个目录：

#### Cache 目录

要填充源磁盘（我们在此将其称为 `%SOURCEDISK%`，实际上它也可能是某种可移动设备，例如 USB 驱动器），你需要以下文件：

* `k3s-versions.json`：该文件由 Rancher Desktop 创建。它从 `https://update.k3s.io/v1-release/channels` 读取原始 JSON 文件并将其转换为不同类型的 JSON 文件。目前没有实用程序来进行这种转换。获取此文件的最简单方法是在连接的系统上运行 Rancher Desktop 并保存 `CACHE/k3s-versions.json` 文件（请参阅下方不同系统的 `CACHE` 位置）。
* Kubernetes K3s 镜像的 Tar 包。你可以在 [K3s Releases](https://github.com/k3s-io​​/k3s/releases) 页面找到这些 Tar 包，你需要根据实际情况下载 `k3s-airgap-images-amd64.tar` 或 `k3s-airgap -images-arm64.tar`（分别用于 AMD/Intel 和 M1 主机）。例如，以下命令将让你离线的情况下使用 K3s v1.24.3 build 1：

```
cd .../CACHE
mkdir v1.24.3+k3s1
cd v1.24.3+k3s1
wget https://github.com/k3s-io/k3s/releases/download/v1.24.3%2Bk3s1/k3s-airgap-images-amd64.tar
wget https://github.com/k3s-io/k3s/releases/download/v1.24.3%2Bk3s1/sha256sum-amd64.txt
```

<Tabs
groupId="os"
defaultValue="windows"
values={[
{ label: 'Windows', value: 'windows', },
{ label: 'macOS', value: 'macos', },
{ label: 'Linux', value: 'linux', },
]}>
<TabItem value="windows">

在 Windows 上，缓存目录是 `%HOME%\\AppData\\Local\\rancher-desktop\\cache\\k3s`，你可以运行以下命令创建该目录：

```
mkdir --Force %HOME%\AppData\Local\rancher-desktop\cache\k3s
```

假设你已有某些源媒体，你还需要运行以下命令来预填充缓存：

```
copy-item %SOURCEDISK%\k3s-versions.json %HOME%\AppData\Local\rancher-desktop\cache\
copy-item -Recurse %SOURCEDISK%\v<MAJOR>.<MINOR>.<PATCH>+k3s<BUILD> %HOME%\AppData\Local\rancher-desktop\cache\k3s\
```

</TabItem>
  <TabItem value="macos">

在 macOS 上，缓存目录是 `$HOME/Library/Caches/rancher-desktop`，你可以运行以下命令进行填充：

```
CACHEDIR=$HOME/Library/Caches/rancher-desktop
mkdir -p $CACHEDIR/k3s
cp $SOURCEDISK/k3s-versions.json $CACHEDIR/
cp -r $SOURCEDISK/v<MAJOR>.<MINOR>.<PATCH>+k3s<BUILD> $CACHEDIR/k3s/
```

</TabItem>
  <TabItem value="linux">

在 Linux 上，缓存目录是 `$HOME/.cache/rancher-desktop`，你可以运行以下命令进行填充：

```
CACHEDIR=$HOME/.cache/rancher-desktop
mkdir -p $CACHEDIR/k3s
cp $SOURCEDISK/k3s-versions.json $CACHEDIR/
cp -r $SOURCEDISK/v<MAJOR>.<MINOR>.<PATCH>+k3s<BUILD> $CACHEDIR/k3s/
```

</TabItem>
</Tabs>

#### kuberlr 目录

这个目录的位置更直接，在所有平台上，该目录都位于 `HOME/.kuberlr/PLATFORM-ARCH`，其中：

- `HOME` 是主目录。通常情况下，在 Windows 上为 `%HOMEDRIVE%\\%HOMEPATH`，在 macOS 和 Linux 上为 `~` 或 `$HOME`。
- `PLATFORM` 是 `windows`、`linux` 或 `darwin`。
- `ARCH` 在 M1 主机上是 `aarch64`，在其它主机上是 `amd64`。

要进行填充，请确定你要使用的 Kubernetes 版本，并联网下载适当的可执行文件。它们将位于：

<Tabs
groupId="os"
defaultValue="windows"
values={[
{ label: 'Windows', value: 'windows', },
{ label: 'macOS & Linux', value: 'maclinux', },
]}>
<TabItem value="windows">

`https://dl.k8s.io/VERSION/bin/PLATFORM/CPU/kubectl.exe`

</TabItem>
  <TabItem value="maclinux">

`https://dl.k8s.io/VERSION/bin/PLATFORM/CPU/kubectl`

</TabItem>
</Tabs>

其中：

- `VERSION` 的格式是 `vMAJOR.MINOR.PATCH`（如 `v1.22.1`）
- `PLATFORM` 是 `darwin`、`linux` 或 `windows`
- `CPU` 在 M1 主机上是 `arm64`，在其他主机上是 `amd64`

例如，要获取使用 Kubernetes v1.22 且用于 Windows 的 kubectl，此 Windows 命令 shell（不是 PowerShell）命令会将其放在 `SOURCEDISK` 上：

```
wget -O %SOURCEDISK/kubectl1.22.1.exe https://dl.k8s.io/v1.22.1/bin/windows/amd64/kubectl.exe
```

##### 版本说明

Kubectl 客户端保证使用主要版本相同的 Server，且它们最多只相差一个次要版本。例如，如果你的组织使用的 Kubernetes 版本是 v1.21.x、v1.22.x 和 v1.23.x，对于任何 `x` 补丁版本，你只需在 `.kuberlr` 目录中安装 `kubectl1.22.x` 即可。但是，如果你复制一个 Kubernetes `v1.24.x` 到 `CACHE` 目录，你需要确保 `.kuberlr` 目录中也有一个兼容的 `kubectl`（`v1.23.x`、`v1.24.x` 或 `v1.25.x` 中的其中一个即可）。
