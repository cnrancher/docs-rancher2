---
title: 功能
description: 本文介绍了 Rancher Desktop 的功能。
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
  - 功能
  - 功能介绍
---

## General

**General** 选项卡提供项目状态的常规信息，还提供了用于讨论项目、报告 issue 或了解项目详细信息的链接。

### Check for updates automatically

当一个新版本发布时，用户会得到一个通知和升级目标的发行版说明。无论是否启用了自动更新，用户都会收到通知。如果启用此选项，更新会被下载，然后在下次启动 Rancher Desktop 时安装更新。

### Allow collection of anonymous statistics to help us improve Rancher Desktop

该选项允许 Rancher Desktop 收集关于你与 Rancher Desktop 应用程序交互的信息，但不会收集你运行的工作负载等信息。

## Kubernetes Settings

在 **Kubernetes Settings** 选项卡上，你可以管理虚拟机的设置。

### Kubernetes Version

该选项显示了 Rancher Desktop 实例可以使用的 Kubernetes 版本列表。

升级时：

- 会进行检查，看目标 Kubernetes 版本是否可以在本地使用。如果没有，它会下载对应文件。
- 保留工作负载。
- 保留镜像。

降级时：

- 移除工作负载。
- 保留镜像。

要切换版本：

1. 点击 **Kubernetes version** 下拉菜单。
1. 选择要转换的版本。
1. 在确认窗口中，单击 **OK**。

### Enable Kubernetes

此选项允许你启用或禁用 Kubernetes。禁用 Kubernetes 后，你可以只运行 `containerd` 或 `dockerd` 来减少资源消耗。默认情况下，Kubernetes 是启用的。

要启用/禁用 Kubernetes，只需选中/取消选中 `Enable Kubernetes` 复选框。启用/禁用 Kubernetes 时，该应用程序将重新启动。禁用 Kubernetes 不会删除现有资源，重新启用 Kubernetes 时，你可以再次使用这些资源。

### Enable Traefik

此选项允许你启用或禁用 Traefik。禁用 Traefik 后，你可以释放端口 80 和 443，以便将其用于备用 ingress 配置。默认情况下，Traefik 是启用的。

要启用/禁用 Traefik，只需选中/取消选中 `Enable Traefik` 复选框。启用/禁用 Traefik 时，你需要手动重启应用。即将发布的版本中将更改该行为，它会提示你重新启动应用程序。禁用 Traefik 不会删除现有资源。

### Container Runtime

为 Rancher Desktop 设置[容器运行时]。用户可以选择 [containerd] 为容器提供命名空间，也可以使用 nerdctl 或 [dockerd (moby)] 来启用 D​​ocker API 和 Docker CLI。一次只能运行一个容器运行时。

切换到不同的容器运行时：

- 需要重新启动 Kubernetes。
- 使用现有容器运行时构建或拉取的工作负载和镜像在切换的容器运行时不可用。

[容器运行时]: https://kubernetes.io/docs/setup/production-environment/container-runtimes/

[containerd]: https://containerd.io/

[dockerd (moby)]: https://mobyproject.org/

### Memory (macOS & Linux)

分配给 Rancher Desktop 的内存。可选范围取决于你的系统。红色区域表示分配可能会影响系统服务。

此选项不适用于 Windows 上的 Rancher Desktop。WSL 让你在所有 Linux 发行版中全局配置内存分配。请参阅 [WSL 文档]中的说明。

[WSL 文档]: https://docs.microsoft.com/en-us/windows/wsl/wsl-config#options-for-wslconfig

### CPUs (macOS & Linux)

分配给 Rancher Desktop 的 CPU 数量。可选范围取决于你的系统。红色区域表示分配可能会影响系统服务。

此选项不适用于 Windows 上的 Rancher Desktop。WSL 让你在所有 Linux 发行版中全局配置 CPU 分配。请参阅 [WSL 文档]中的说明。

[WSL 文档]: https://docs.microsoft.com/en-us/windows/wsl/wsl-config#options-for-wslconfig

### Port

设置 Kubernetes 暴露的端口。如果有多个 K3s 实例正在运行，使用此设置可以避免端口冲突。

### Reset Kubernetes/Reset Kubernetes and Container Images

该选项会删除所有工作负载和 Kubernetes 配置。
重置时，已经拉取的镜像不会被删除。
1. 在确认窗口中，单击 **OK**。

此时，Kubernetes 将停止，然后工作负载和配置会被删除。之后，Kubernetes 会再次启动。

### Working with Kubernetes Clusters

**启动 Kubernetes 集群**：

1. 启动 Rancher Desktop 应用程序。

1. 单击 **Kubernetes Settings**，然后选择所需的 **Kubernetes version**。

1. 为你的容器运行时选择 **containerd** 或 **dockerd**。

![](/img/rancherdesktop/kubernetes-settings-main-page.png)

请注意应用程序左下角的进度条，它表示 Kubernetes 的下载进度和 API 设置。该栏的初始化完成后，你的集群就完成设置了。

![](/img/rancherdesktop/kubernetes-cluster-progress.png)

**停止 Kubernetes 集群**：

你可以通过退出 Rancher Desktop 来停止 Kubernetes 集群。你可以右键单击屏幕底部的托盘图标或选择 **File** > **Exit** 来关闭 Rancher Desktop。

**重置 Kubernetes 集群**：

如需了解如何重置 Kubernetes 集群，请参阅[此处](#reset-kubernetesreset-kubernetes-and-container-images)。请注意，重置将删除所有工作负载和配置。

![](/img/rancherdesktop/reset-kubernetes.png)

## WSL Integration (Windows)

**WSL Integration** 选项卡提供了一个选项，使 Rancher Desktop Kubernetes 配置能够被任何 WSL 配置的 Linux 发行版所访问。一旦启用，你可以使用 WSL 发行版中的 `kubectl` 等工具与 Rancher Desktop Kubernetes 集群进行通信。

## Port Forwarding (Windows)

如需转发端口：

1. 找到 service 并单击 **Forward**，这会分配一个随机端口。
1. 可选：单击 **Cancel** 来移除分配的端口。

## Supporting Utilities (macOS & Linux)

Rancher Desktop 附带命令行实用程序，用于与其各种功能交互。这些实用程序包括 `docker`、`nerdctl`、`kubectl` 和 `helm` 等。这些实用程序位于 `~/.rd/bin`，因此你可以通过运行 `ls ~/.rd/bin` 来查看你的安装中包含了哪些实用程序。

要使用这些实用程序，`~/.rd/bin` 必须位于 shell 的 `PATH` 变量中。**Application Settings** 选项卡上有两个可以执行此操作的选项，分别是 **Automatic** 和 **Manual**。**Automatic** `PATH` 通过修改你的 shell .rc 文件来将 `~/.rd/bin` 添加到 `PATH` 中。**Manual** `PATH` 不会改变任何东西，在这种模式下，你必须手动将 `~/.rd/bin` 添加到 `PATH` 中。

## Images

**Images** 选项卡允许你管理虚拟机上的镜像。

要改用 nerdctl 管理镜像，请参阅[镜像](../../tutorials/working-with-images/_index)。

### Scanning Images

此功能使用 [Trivy] 来扫描你的镜像，从而查找漏洞和配置问题。

要扫描镜像：

1. 从镜像列表中，找到要扫描的镜像。
1. 单击 **⋮ > Scan**。
1. 查看结果，然后单击 **Close Output to Continue**。

[Trivy]: https://github.com/aquasecurity/trivy

### Adding Images

#### Pulling Images

此选项可以让你将镜像从镜像仓库拉取到你的虚拟机中。

要拉取镜像：

1. 单击右上角的 **+** 按钮。
1. 单击 **Pull** 选项卡。
1. 输入要拉取的镜像的名称。
   > 注意：默认情况下，镜像是从 [Docker Hub] 中提取的（格式：`repo/image[:tag]`）。要从其他镜像仓库中拉取，请包含主机名 `registry.example.com/repo/image[:tag]`。
1. 单击 **Pull**。

[Docker Hub]: https://hub.docker.com/

#### Building Images

使用此选项构建镜像并将其添加到你的虚拟机。

要构建镜像：

1. 单击右上角的 **+** 按钮。
1. 单击 **Build** 选项卡。
1. 输入构建的镜像的名称，例如 `repo/image`、`repo/image:tag`、`registry.example.com/repo/image` 或 `registry.example.com/repo/image:tag`。
1. 单击 **Build**。
1. 在文件浏览器中，选择要用来构建镜像的 Dockerfile。

## Troubleshooting

### Show Logs

使用此选项打开包含所有 Rancher Desktop 日志文件的文件夹。

### Factory Reset

删除集群和所有其他 Rancher Desktop 设置。必须再次执行初始设置程序。

要恢复出厂设置：

1. 单击 **Reset**。
1. 在确认窗口中，单击 **OK**。Kubernetes 会停止，Rancher Desktop 会关闭。
1. 再次启动 Rancher Desktop。
