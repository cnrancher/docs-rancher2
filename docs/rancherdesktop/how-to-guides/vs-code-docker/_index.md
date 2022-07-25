---
title: 使用 VS Code Docker 扩展来调试容器应用程序
description: 使用 VS Code Docker 的操作指南。
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
  - VS Code Docker
  - VS Code Docker 扩展
---

VS Code Docker 扩展能让你轻松在 VS Code 中构建、管理、调试和部署容器化应用程序。

### 调试容器化应用程序的步骤

1. 安装并启动 Rancher Desktop。从 `Kubernetes Settings` 菜单中，将 **Container Runtime** 选为 `dockerd (moby)`：

![](/img/rancherdesktop/vscodedocker/rd-main.png)

2. 安装并启动 Visual Studio Code 或 Visual Studio Code Insiders。本教程使用 Visual Studio Code：

![](/img/rancherdesktop/vscodedocker/vscode-main.png)

[VS Code Docker]: https://code.visualstudio.com/docs/containers/overview

3. 在扩展市场中安装 Docker 扩展。

![](/img/rancherdesktop/vscodedocker/vscode-docker-marketplace.png)

4. 你可以使用此 Github 仓库 (https://github.com/bwateratmsft/samples) 中提供的示例。克隆此仓库并在 VS Code 会话中打开 `expressapp` 文件夹。

6. 打开命令面板（Ctrl+Shift+P、F1 或 Cmd+Shift+P）并运行 “Add Docker Files to Workspace”。由于这是一个 Express 应用程序，因此选择 `Node.js` 作为应用程序平台，选择 `3000`（或任何其他可用端口）作为 `port`。由于这是一个简单的示例，请在 `Include optional Docker Compose files` 选择 `No`。此步骤添加了调试应用程序所需的 `Dockerfile` 和 `Launch Configuration`。

![](/img/rancherdesktop/vscodedocker/vscode-docker-add-docker-files-1.png)

7. 在代码中插入断点：

![](/img/rancherdesktop/vscodedocker/vscode-docker-debug-breakpoint.png)

8. 在顶部的 **Debug** 窗口中，将活动调试配置切换为 **Docker Node.js Launch**。按 `F5` 以 `Debug` 模式启动应用程序容器。示例应用程序的登录页面将在你的浏览器中打开，而且代码会在断点处停止执行。你可以在这里调试应用程序，就像应用程序运行在你的主机上一样。

![](/img/rancherdesktop/vscodedocker/vscode-docker-debug-configuration.png)

![](/img/rancherdesktop/vscodedocker/vscode-docker-debug-breakpoint-hit.png)

9. 有时候，由于调试进程可能尚未启动，因此应用程序可能不会在第一次运行时在设置的断点处中断。在这种情况下，你可以刷新浏览器来再次触发执行，从而命中断点。你还可以通过在 `task.json` 文件中设置 `inspectMode: 'break'` 属性来避免此行为，从而防止应用程序在连接调试器之前运行。

10. 在某些主机上，防火墙设置可能会阻止调试进程在主机和容器进程之间建立连接。在这种情况下，你可以添加防火墙规则，以允许运行容器的 VM 与运行 VS Code 会话的主机进行通信。在 Windows 上，你可以通过在特权 powershell 中运行以下命令来添加防火墙规则：

```powershell
New-NetFirewallRule -Action Allow -Description 'Allow communication from WSL containers' -Direction Inbound -Enabled True -InterfaceAlias 'vEthernet (WSL)' -Name 'WSL Inbound' -DisplayName 'WSL Inbound'
```
