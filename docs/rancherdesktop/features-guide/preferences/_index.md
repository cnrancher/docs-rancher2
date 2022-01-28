---
title: 偏好设置
description: Rancher Desktop 偏好设置
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
  - 偏好设置
---

## General（常规）

**General**选项卡提供有关项目状态的一般信息，以及讨论项目、报告问题或了解有关项目的更多信息的链接。

### 自动检查更新

当一个新版本发布时，用户会得到一个通知和升级目标的发行版说明。无论是否启用了自动更新，都会发生这种情况。如果启用此选项，更新会被下载，然后在下次启动 Rancher Desktop 时安装更新。

### 允许收集匿名统计数据，帮助我们改进 Rancher Desktop

该选项允许 Rancher Desktop 收集关于你与 Rancher Desktop 应用程序交互的信息。但不会收集你运行的工作负载等信息。

## Kubernetes Settings（Kubernetes 设置）

在**Kubernetes Settings**选项卡上，你可以管理虚拟机的设置。

### Kubernetes Version（Kubernetes 版本）

该选项显示了 Rancher Desktop 实例可以使用的 Kubernetes 版本列表。

升级时：

- 会进行检查，看目标 Kubernetes 版本在本地是否可用。如果没有，它会下载对应文件。
- 保留工作负载。
- 保留镜像。

降级时：

- 移除工作负载。
- 保留镜像。

要切换版本：

1. 点击**Kubernetes version**下拉菜单。
1. 选择你想转换的版本。
1. 在确认窗口中，点击**OK**继续。

### Container Runtime（容器运行时）

为 Rancher Desktop 设置[容器运行时](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)。用户可以选择 [containerd](https://containerd.io/) 为容器提供命名空间，也可以使用 nerdctl 或 [dockerd (moby)](https://mobyproject.org/) 来启用 D​​ocker API 和 Docker CLI。一次只能运行一个容器运行时。

当切换到不同的容器运行时:

- 需要重新启动 Kubernetes。
  使用现有容器运行时构建或拉取的工作负载和镜像在切换到的容器运行时将会不可用。

### Memory (macOS & Linux)

要分配给 Rancher Desktop 的内存。可选择的范围取决于你的系统。该范围内的红色区域表示分配可能影响系统服务。

此选项不适用于 Windows 上的 Rancher Desktop。通过 WSL，内存分配是在所有的 Linux 发行版中全局配置的。请参考[WSL 文档](https://docs.microsoft.com/en-us/windows/wsl/wsl-config#options-for-wslconfig)中的说明。

### CPUs (macOS & Linux)

要分配给 Rancher Desktop 的 CPU 数量。可选择的范围取决于你的系统。该范围内的红色区域表示分配可能影响系统服务。

此选项不适用于 Windows 上的 Rancher Desktop。通过 WSL，CPU 分配是在所有的 Linux 发行版中全局配置的。请参考[WSL 文档](https://docs.microsoft.com/en-us/windows/wsl/wsl-config#options-for-wslconfig)中的说明。

### Port

设置 Kubernetes 暴露的端口。如果有多个 K3s 实例正在运行，使用此设置可以避免端口冲突。

### Reset Kubernetes/Reset Kubernetes and Container Images

该选项会删除所有工作负载和 Kubernetes 配置。当重置发生时，已经被拉取的镜像不会被删除。

1. 在确认窗口，点击**OK**继续。

此时，Kubernetes 将停止，然后删除工作负载和配置。最后，Kubernetes 将再次启动。

## WSL Integration（Windows）

**WSL Integration** 选项卡提供了一个选项，使 Rancher Desktop Kubernetes 配置能够被任何为 WSL 配置的 Linux 发行版所访问。一旦启用，你可以使用 WSL 发行版中的 `kubectl` 等工具与 Rancher Desktop Kubernetes 集群进行通信。

## Port Forwarding (Windows)

转发端口：

1. 找到 service 并点击 **Forward**，分配一个随机端口。
1. 可选的：点击 **Cancel** 来删除分配的端口。

## Supporting Utilities (macOS & Linux)

在 **Supporting Utilities** 选项卡上，你可以创建指向 /usr/local/bin 中工具的符号链接。默认情况下，如果工具尚未链接，就会创建一个符号链接。

可以为以下工具创建（或删除）符号链接，这些工具是作为 Rancher Desktop 的一部分安装的：

- helm
- kubectl
- nerdctl
- docker

## Images

**Images** 选项卡允许你管理虚拟机上的镜像。

要使用 nerdctl 来管理你的镜像，请参考 [Images](/docs/rancherdesktop/features-guide/images/_index) 部分。

### Scanning Images（扫描镜像）

这个功能使用 [Trivy](https://github.com/aquasecurity/trivy) 来扫描你的镜像是否存在漏洞和配置问题。

要扫描镜像：

1. 从镜像列表中，找到你要扫描的镜像。
1. 单击 **⋮ > Scan**。
1. 查看结果，然后点击 **Close Output to Continue**。

### Adding Images

#### Pulling Images

使用这个选项从镜像仓库中拉取镜像到你的虚拟机。

要拉取一个镜像：

1. 点击右上角的 **+** 按钮。
1. 点击 **Pull** 选项卡。
1. 输入要拉取的镜像的名称。
   > 注意：默认情况下，镜像从 [Docker Hub](https://hub.docker.com/) 中拉取，使用 `repo/image[:tag]` 格式。要从其他镜像仓库中拉取，请包括主机名 `registry.example.com/repo/image[:tag]`。
1. 点击 **Pull**。

#### Building Images

使用这个选项来构建一个镜像，并将镜像添加到你的虚拟机中。

要构建一个镜像：

1. 点击右上角的 **+** 按钮。
1. 点击 **Build** 选项卡。
1. 为正在构建的镜像输入一个名称。例如：`repo/image`，`repo/image:tag`，`registry.example.com/repo/image`，或`registry.example.com/repo/image:tag`。
1. 点击 **Build**。
1. 在文件浏览器中，选择要用来构建镜像的 Dockerfile。

## Troubleshooting（故障排查）

### Show Logs（显示日志）

使用该选项可以打开包含所有 Rancher Desktop 日志文件的文件夹。

### Factory Reset（恢复出厂设置）

删除集群和所有其他 Rancher Desktop 设置。必须重新进行初始设置程序。

要执行恢复出厂设置：

1. 单击 **Reset**。
1. 在确认窗口，点击 **OK** 继续。Kubernetes 停止，Rancher Desktop 关闭。
1. 再次启动 Rancher Desktop。
