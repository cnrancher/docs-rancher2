---
title: 常问问题
description: 本文包含了用户常见的 Rancher Desktop 问题和解答。
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
  - FAQ
  - 常见问题
  - FAQs
---

本文包含了用户常见的 Rancher Desktop 问题和解答。

#### **问：Rancher Desktop 是 Rancher 的桌面版吗？**

**答**：虽然 [Rancher](https://rancher.com/) 和 [Rancher Desktop](https://rancherdesktop.io/) 的名称都包含 _Rancher_，但他们的功能不同。Rancher Desktop 不是桌面版 Rancher。Rancher 是管理 Kubernetes 集群的强大解决方案，而 Rancher Desktop 运行本地 Kubernetes 和容器管理平台，这两种解决方案相辅相成。

#### **问：Rancher Desktop 中有 Kubernetes Cluster Explorer 吗？**

**答**：是的，Rancher Dashboard 作为功能预览包含在 1.2.1 版本中。你可以通过单击系统托盘菜单中的 **Dashboard** 选项来调用仪表板。

要了解有关 Rancher Desktop 的更多信息，请单击[此处](https://docs.rancherdesktop.io/)。
要了解有关 Rancher 的更多信息，请单击[此处](https://rancher.com/why-rancher)。

[Rancher]: https://rancher.com/

[minikube]: https://minikube.sigs.k8s.io/docs/

[kind]: https://kind.sigs.k8s.io/docs/user/quick-start/

[Docker Desktop]: https://docs.docker.com/desktop/

<!-- #1221 -->
#### **问：我可以同时安装 Docker Desktop 与 Rancher Desktop 吗？**

**答**：可以，但它们不能同时运行，因为 Rancher Desktop 和 Docker Desktop 使用相同的 Docker socket（`/var/run/docker.sock`）。在启动一个之前，一定要先停止另一个。

<!-- #1074
#### **Q: After uninstalling Rancher Desktop I noticed there are still some resources left behind. What are all the things that I need to manually remove and how?**

**A:**
-->

<!-- #640 -->
#### **问：如何彻底卸载 Rancher Desktop？**

**答**：首先，执行[恢复出厂设置](../getting-started/features/_index.md#factory-reset)，然后你将卸载该应用程序。卸载过程因操作系统而异。如需更多信息，请参阅[此处](../getting-started/installation/_index.md)。

#### **问：Windows 上的 DNS VPN 有哪些支持（如果有）？**

**答**：Windows 的替代 DNS 解析器已实现，用来解决 Windows 上的某些 VPN 问题。它支持通过 VPN 连接进行 DNS 查找。它必须通过编辑内部[配置文件](https://github.com/rancher-sandbox/rancher-desktop/issues/1899#issuecomment-1109128277)手动启用。

#### **问：“WSL 集成”选项卡有什么作用？**

**答**：它能使 Kubernetes 配置可以在显示的 WSL 发行版中访问，以便你使用 `kubectl` 之类的命令与 Kubernetes 进行通信。

#### **问：我在哪里可以找到详细的日志？**

**答**：点击 **Troubleshooting** 标签，然后点击 **Show Logs**。

#### **问：如何为 Traefik Ingress Controller 启用仪表板？**

**答**：出于安全原因，Traefik 仪表板默认不公开。但是，你可以通过多种方式公开仪表板。你可以使用下面显示的两种方法之一。

#### 使用 `port-forward` 来启用仪表板访问

```
kubectl port-forward -n kube-system $(kubectl -n kube-system get pods --selector "app.kubernetes.io/name=traefik" --output=name) 9000:9000
```

在浏览器中访问 [http://127.0.0.1:9000/dashboard/](http://127.0.0.1:9000/dashboard/) 以查看 Traefik 仪表板。

#### 使用 `HelmChartConfig` 来启用仪表板访问

将以下说明复制到文件中，例如 `expose-traefik.yaml`：

```
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: traefik
  namespace: kube-system
spec:
  valuesContent: |-
    dashboard:
      enabled: true
    ports:
      traefik:
        expose: true # Avoid this in production deployments
    logs:
      access:
        enabled: true
```

运行命令：

```
kubectl apply -f expose-traefik.yaml
```

在浏览器中访问 [http://127.0.0.1:9000/dashboard/](http://127.0.0.1:9000/dashboard/) 以查看 Traefik 仪表板。

#### **问：如何禁用 Traefik，这样会删除 Traefik 资源吗？**

**答**：是的，你可以禁用 Traefik 以释放端口 80 和 443 用于备用 ingress 配置。禁用 Traefik _不会_ 删除现有资源。**Kubernetes Settings** 下会默认选择 `Enable Traefik` 功能，取消选中此框即可禁用它。

如果要删除 Traefik 资源，请在 UI 的 **Kubernetes Settings** 面板上单击 `Reset Kubernetes`。

#### **问：是否支持内部容器端口转发？**

**答**：是的，我们已在 Linux 和 macOS 上再次启用此功能的支持。

#### **问：文件共享的工作原理与 Docker Desktop 类似吗？是否必须进行任何其他配置才能将卷挂载到 VM？**

**答**：目前默认共享以下目录：macOS 上为 `/Users/$USER`，Linux 上为 `/home/$USER`，二者均共享 `/tmp/rancher-desktop`。对于 Windows，所有文件都通过 WSL2 自动共享。

#### **问：容器是否能通过 `host.docker.internal` 回到主机服务？**

**答**：是的。在 Windows 上，你可能需要创建防火墙规则来允许主机和容器之间的通信。你可以在特权 powershell 中运行以下命令来创建防火墙规则：

```
New-NetFirewallRule -DisplayName "WSL" -Direction Inbound -InterfaceAlias "vEthernet (WSL)" -Action Allow
```

<!-- #985 -->
#### **问：我不需要 Rancher Desktop 部署的 Kubernetes 集群；如何禁用它以节省资源？**

**答**：你可以将 Kubernetes 禁用为仅运行 `containerd` 或 `dockerd`，从而减少资源消耗。**Kubernetes Settings**下会默认选择 `Enable Traefik` 功能，取消选中此框即可禁用它。

<!-- #726 -->
#### **问：Kubernetes Image Manager (kim) 发生了什么？**

**答**：从 1.0 版本开始，Kim 不再被支持，而且已被 nerdctl 和 Docker CLI 取代。

<!-- #776 -->
#### **问：为什么运行 `brew install rancher` 时出现 `It seems there is already a Binary at '/usr/local/bin/<BINARY>'` 的错误？**

**答**：如果支持 Rancher Desktop 的工具（Helm、kubectl、nerdctl、docker）已经由 Homebrew 管理，那么由于 Homebrew cask 公式的定义方式，安装会失败。你可以使用 Mac 应用程序进行安装来避免这个问题。

#### 问：我通过 Arch User Repository 安装了 `nerdctl`，但它不能与 Rancher Desktop 一起使用，为什么？

**答**：对于 Rancher Desktop，`nerdctl` 必须在 VM 内部而不是在主机上运行。主机版本只是一个 shell wrapper，用于在 VM 内执行命令。

<!-- #1155 -->
#### **问：Support Utilities 页面上的工具未安装，我看到 `Insufficient permission to modify /usr/local/bin` 错误，我该如何解决？**

**答**：当你没有 `/usr/local/bin` 的权限时就会发生这种情况。改善权限处理的长期解决方案正在开发中。同时，一个临时的解决方法是通过运行 `sudo chown $USER /usr/local/bin` 来更改 `/usr/local/bin` 的权限。当你能够写入目录时，Rancher Desktop 就能够创建符号链接。

从 1.3.0 及更高版本开始，我们不再在 /usr/local/bin 中创建符号链接，而是在 ~/.rd/bin 中创建符号链接，并将该目录放在 PATH 中，这样可以避免处理 /usr/local/bin 的写权限和文件冲突。我们强烈建议你升级到最新版本的 Rancher Desktop。

<!-- #981 -->
#### **问：Cygwin 与 Rancher Desktop 兼容吗？**

**答**：没有，但我们有增加兼容性的计划。

#### **问：如何将 Rancher Desktop 添加到 Windows 的启动程序列表中？**

**答**：在 Windows 上，你可以通过不同的方式将程序添加到启动程序列表中。例如，你可以执行以下步骤：

- 按 Windows+R 打开运行对话框。
- 输入 `shell:startup`，然后按 Enter 打开 Startup 文件夹。
- 从桌面复制 “Rancher Desktop” 快捷方式并粘贴到 Startup 文件夹中。
- 重新启动主机。

#### **问：Rancher Desktop 实际将数据卷放在哪里？**

**答**：

**Windows**：
打开运行菜单（按 Windows + R）并打开下面的路径（具体取决于活动的容器运行时）：
```
dockerd(moby): \\wsl$\rancher-desktop-data\var\lib\docker\volumes
containerd: \\wsl$\rancher-desktop-data\var\lib\nerdctl\dbb19c5e\volumes\<namespace>
```
**macOS 和 Linux**：
根据活动的容器运行时，在 (lima) VM 中导航到下面的路径。你可以使用 `rdctl shell` 访问 VM 中的这些路径。
```
dockerd(moby): /var/lib/docker/volumes
containerd: /var/lib/nerdctl/dbb19c5e/volumes/<namespace>
```
