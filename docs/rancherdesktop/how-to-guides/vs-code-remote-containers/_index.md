---
title: VS Code Remote Containers
description: 使用 VS Code Remote Containers 的操作指南
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
  - VS Code Remote Containers
  - VS Code 扩展
---

[Visual Studio Code Remote - Containers] 扩展支持将 Docker 容器用作功能齐全的开发环境，这有助于确保开发人员主机的环境一致，并使新的团队成员和贡献者可以轻松启动工作。由于 Rancher Desktop 通过 [Moby] 来支持 Docker CLI，因此你可以使用开箱即用的 VS Code Remote - Containers 扩展。

### 使用示例开发容器的步骤

1. 安装并启动 Rancher Desktop。从 `Kubernetes Settings` 菜单中，将 **Container Runtime** 选为 `dockerd (moby)`：

![](/img/rancherdesktop/vscoderemotecontainers/rd-main.png)

2. 安装并启动 Visual Studio Code 或 Visual Studio Code Insiders。本教程使用 Visual Studio Code：

![](/img/rancherdesktop/vscoderemotecontainers/vscode-main.png)

3. 安装 Remote Development 扩展包：

![](/img/rancherdesktop/vscoderemotecontainers/vscode-remotedevelopment-marketplace.png)

4. 安装扩展后，你将在侧栏中看到扩展项，左下角有一个显示命令面板的绿色按钮，其中包含与 `Remote Development` 相关的各种选项/命令：

![](/img/rancherdesktop/vscoderemotecontainers/vscode-remotedevelopment-installed.png)

5. Microsoft 在此 GitHub 仓库 (https://github.com/microsoft/vscode-dev-containers.git) 中提供了许多示例开发容器。将此仓库克隆到你的本地主机：

```
git clone https://github.com/microsoft/vscode-dev-containers.git
```

6. 单击窗口左下角的 ![](/img/rancherdesktop/vscoderemotecontainers/vscode-remotedevelopment-commandbutton.png) 按钮，然后从命令面板中选择 `Open Folder in Container...`。浏览克隆仓库中的其中一个示例，例如 `javascript-node`：

![](/img/rancherdesktop/vscoderemotecontainers/vscode-remotedevelopment-commandpalette.png)

![](/img/rancherdesktop/vscoderemotecontainers/vscode-remotedevelopment-openfolder.png)


7. 选择示例后，你会在容器加载时看到进度通知 ![](/img/rancherdesktop/vscoderemotecontainers/vscode-remotedevelopment-containerprogress.png)，容器启动成功后，左下角会显示容器名称 ![](/img/rancherdesktop/vscoderemotecontainers/vscode-remotedevelopment-containersuccess.png)。

8. 容器启动后，在 VS Code IDE 中按 `F5` 启动示例应用程序。你将看到应用程序已启动并在 `localhost:3000` 上提供服务：

![](/img/rancherdesktop/vscoderemotecontainers/vscode-remotedevelopment-appinbrowser.png)

恭喜！你已经使用 Rancher Desktop 和 VS Code 成功加载并运行了一个示例开发容器。


### 后续步骤

Microsoft 在[此处]提供了在各种场景中使用开发容器的大量文档。请参阅以下教程，尝试使用与你的需求类似的用例。

[Visual Studio Code Remote - Containers]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers
[Moby]: https://mobyproject.org/
[此处]: https://code.visualstudio.com/docs/remote/remote-overview

现在，体验使用 Rancher Desktop 进行容器化的快乐吧！
