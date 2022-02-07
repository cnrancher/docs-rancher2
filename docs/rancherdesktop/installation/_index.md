---
title: 安装介绍
description: Rancher Desktop 作为桌面应用程序交付。你可以从 [GitHub 上的发布页面](https://github.com/rancher-sandbox/rancher-desktop/releases)下载它。
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
  - 安装介绍
---

Rancher Desktop 作为桌面应用程序交付。你可以从 [GitHub 上的发布页面](https://github.com/rancher-sandbox/rancher-desktop/releases)下载它。

首次运行或更改版本时，会下载 Kubernetes 容器的镜像。所以首次运行新的 Kubernetes 版本可能需要一些时间来加载这些镜像。

安装 Rancher Desktop 后，用户可以访问以下这些支持的工具：

- [Helm](https://helm.sh/)
- [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/)
- [nerdctl](https://github.com/containerd/nerdctl)
- [Moby](https://github.com/moby/moby)

## macOS

### 要求

Rancher Desktop 在 macOS 上运行需要以下条件：

- macOS Catalina 10.15 或更高版本。
- 带有 VT-x 的 Apple 芯片 (M1) 或 Intel CPU。
- 连接到互联网。

还建议具备以下条件:
- 8GB 的内存
- 4 个 CPU

根据你要运行在 Rancher Desktop 上的工作负载，可能还需要一些额外的资源。

### 在 macOS 上安装 Rancher Desktop

1. 转到 GitHub 上的[发布页面](https://github.com/rancher-sandbox/rancher-desktop/releases)。
1. 找到你要下载的 Rancher Desktop 的版本。
1. 展开 **Assets** 部分，下载 `Rancher.Desktop-X.Y.Z.dmg`，其中 `X.Y.Z` 是 Rancher Desktop 的版本。
1. 导航到你下载安装程序的目录，并运行安装程序。这通常是 `下载` 文件夹。
1. 双击 DMG 文件。
1. 在打开的 `访达` 窗口中，将 Rancher Desktop 图标拖到 `应用程序` 文件夹中。
1. 导航到 `应用程序` 文件夹，双击 Rancher Desktop 来启动。

安装 Rancher Desktop 后，用户将可以访问这些的工具:

- [Helm](https://helm.sh/)
- [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/)
- [nerdctl](https://github.com/containerd/nerdctl)
- [docker (moby)](https://github.com/moby/moby)

### 在 macOS 上卸载 Rancher Desktop

1. 打开**访达** > **应用程序**。
1. 找到 Rancher Desktop。
1. 选择它并选择**文件>移到废纸楼**。
1. 要删除该应用程序，**访达** > **清倒废纸篓**。

## Windows

### 要求

Rancher Desktop 在 Windows 上运行需要以下条件：

- Windows 10 build 1909 或更高版本，支持家庭版。
- 在具有[虚拟化功能](https://docs.microsoft.com/en-us/windows/wsl/troubleshooting#error-0x80370102-the-virtual-machine-could-not-be-started-because-a-required-feature-is-not-installed)的机器上运行。
- 连接到互联网。

Rancher Desktop 在 Windows 上需要用于 Linux 的 Windows 子系统；这将作为 Rancher Desktop 设置的一部分自动安装。不需要手动下载发行版。

Rancher Desktop 在 Windows 上需要 [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10)；这将作为 Rancher Desktop 的一部分自动安装。不需要手动下载发行版。

还建议具备以下条件：
- 8GB 的内存
- 4 个 CPU

根据你要运行在 Rancher Desktop 上的工作负载，可能还需要一些额外的资源。

### 在 Windows 上安装 Rancher Desktop

1. 转到 GitHub 上的[发布页面](https://github.com/rancher-sandbox/rancher-desktop/releases)。
1. 找到你要下载的 Rancher Desktop 的版本。
1. 展开 **Assets** 部分，下载 Windows 安装程序。它将被称为 `Rancher.Desktop.Setup.X.Y.Z.exe`，其中 `X.Y.Z` 是 Rancher Desktop 的版本。
1. 导航到你下载安装程序的目录，并运行安装程序。这通常是 `下载` 文件夹。
1. 查看许可协议，并点击**我同意**，继续安装。
1. 当安装完成后，点击**完成** 来关闭安装向导。

### 在 Windows 上卸载 Rancher Desktop

1. 从任务栏中，点击**开始**菜单。
1. 进入**设置 > 应用程序 > 应用程序和功能**。
1. 找到并选择 Rancher Desktop。
1. 点击**卸载**，并在出现确认时再次点击按钮。
1. 按照 Rancher Desktop 卸载程序上的提示进行操作。
1. 完成后点击**完成**。

## Linux

### 要求

Rancher Desktop 在 Linux 上运行需要以下条件：

- 一个可以安装 `.deb` 或 `.rpm` 包或 `AppImages` 的发行版。
- 连接到互联网。

还建议具备以下条件：
- 8GB 的内存
- 4 个 CPU

根据你要运行在 Rancher Desktop 上的工作负载，可能还需要一些额外的资源。

### 通过 .deb 包安装

添加 Rancher Desktop 仓库并使用以下命令安装 Rancher Desktop：

```
curl https://download.opensuse.org/repositories/isv:/Rancher:/stable/deb/Release.key | sudo apt-key add -
sudo add-apt-repository 'deb https://download.opensuse.org/repositories/isv:/Rancher:/stable/deb/ ./'
sudo apt update
sudo apt install rancher-desktop
```

### 卸载 .deb 包

您可以使用以下命令删除包、存储库和密钥：

```
sudo apt remove --autoremove rancher-desktop
sudo add-apt-repository -r 'deb https://download.opensuse.org/repositories/isv:/Rancher:/stable/deb/ ./'
sudo apt-key del <keyid>
```

其中 `keyid` 是运行 `apt-key list` 时包含 `isv:Rancher:stable` 的行的上一行。因此，如果 Rancher Desktop Key 有以下片段：

```
pub   rsa2048 2021-10-29 [SC] [expires: 2024-01-07]
      236E B3BE 8504 1EAE C40B  2641 2431 4E44 EE21 3962
uid           [ unknown] isv:Rancher:stable OBS Project <isv:Rancher:stable@build.opensuse.org>
```

那么我的`keyid` 就是 `236E B3BE 8504 1EAE C40B 2641 2431 4E44 EE21 3962`。

### 通过 .rpm 包进行安装

注意：Rancher Desktop 在 Linux 上使用 QEMU，而 RHEL、Fedora 和相关发行版打包 QEMU 的方式与其他发行版不同。因此，要在这些发行版上使用 Rancher Desktop，请使用 AppImage。

在 openSUSE 上添加仓库并安装：

```
sudo zypper addrepo https://download.opensuse.org/repositories/isv:/Rancher:/stable/rpm/isv:Rancher:stable.repo
sudo zypper install rancher-desktop
```

### 卸载 .rpm 包

确保 Rancher Desktop 已经退出（如果没有，它应该出现在 Dock 中），然后执行：

```
sudo zypper remove --clean-deps rancher-desktop
sudo zypper removerepo isv_Rancher_stable
```

### 通过 AppImage 进行安装

你可以在[这里](https://download.opensuse.org/repositories/isv:/Rancher:/stable/AppImage/rancher-desktop-latest-x86_64.AppImage)下载 AppImage。

要运行 AppImage，只需要添加可执行权限，然后执行即可。为了更好地与你的桌面结合，你可以使用 [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher)。

### 卸载 AppImage

只需删除 AppImage，就可以了!
