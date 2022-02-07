---
title: FAQ
description: 本 FAQ 是一项正在进行的工作，旨在回答我们的用户最常问到的关于 Rancher Desktop 的问题。
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
---

本 FAQ 是一项正在进行的工作，旨在回答我们的用户最常问到的关于 Rancher Desktop 的问题。

**问：Rancher Desktop 是 Rancher 的桌面版本吗？**

**答：**不是，Rancher Desktop 不是桌面上的 [Rancher](https://rancher.com/)。安装 Rancher Desktop 并不安装 Rancher，但你可以将 Rancher 作为一个工作负载来安装。

Rancher Desktop 类似于 [minikube](https://minikube.sigs.k8s.io/docs/)、[kind](https://kind.sigs.k8s.io/docs/user/quick-start/) 或 [Docker Desktop](https://docs.docker.com/desktop/) 等应用，其目标是拥有一个易于设置的本地 Kubernetes 环境来管理容器。

<!-- #1221 -->

**问：我可以同时安装 Docker Desktop 与 Rancher Desktop 吗？**

**答：**可以，但它们不能同时运行，因为 Rancher Desktop 和 Docker Desktop 都使用同一个 Docker socket（`/var/run/docker.sock`）。在启动一个之前，一定要先停止另一个。

<!-- #1074
**问：卸载Rancher Desktop后，我注意到仍有一些资源遗留。我需要手动删除的东西都有哪些，如何删除？ ***

**A:**
-->

**问：我在运行 `kubectl config get-contexts` 时没有看到 Rancher Desktop 的条目，它在哪里？**

**答：** Rancher Desktop 将其配置放在默认位置 `~/.kube/config`，并使用该位置。你的 `KUBECONFIG` 环境变量可能被设置为在其他地方寻找配置文件。

**问：Rancher Desktop 卡在 `Waiting for Kubernetes API` 上，我应该怎么办？**

**答：**如果没有其他信息，很难确定原因。导航到 Troubleshooting 选项卡并使用按钮访问日志。然后转到 [Rancher Desktop GitHub](https://github.com/rancher-sandbox/rancher-desktop/issues) 页面，提交一个 issue 并附上日志。

**问：在安装 Rancher Desktop 和卸载 Docker Desktop 后，我无法再运行 `docker compose`，这是怎么回事？**

**答：** `docker compose` 子命令作为 Docker Desktop 安装的一部分被捆绑在一起，卸载时被删除。按照这些[说明](https://github.com/docker/compose)来安装它。

<!-- #985 -->

**问：我不需要 Rancher Desktop 部署的 Kubernetes 集群，我如何禁用它来节省资源？**

**答：**作为一个临时解决方法，你可以在 Rancher Desktop 中用这些命令*禁用* Kubernetes。

```bash
kubectl config use-context rancher-desktop
kubectl delete node lima rancher-desktop
```

<!-- #726 -->

**问：Kubernetes Image Manager（kim）发生了什么？**

**答：**从 1.0 版本开始，Kim 不再被支持，而是被 nerdctl 和 Docker CLI 所取代。

<!-- #966 -->

**问：我在用 Homebrew 安装 Rancher Desktop，但 `brew install rancher-desktop` 却失败了，为什么？**

**答：**由于 Homebrew cask 的命名惯例，`-desktop` 的后缀被从 cask 的公式名称中删除。可以使用 `brew install rancher` 代替。

<!-- #776 -->

**问：为什么运行 `brew install rancher` 时出现 `It seems there is already a Binary at '/usr/local/bin/<BINARY>'` 的错误？**

**答：**如果任何支持 Rancher Desktop 的工具（Helm、kubectl、nerdctl、docker）已经被 Homebrew 管理，那么由于 Homebrew cask 公式的定义方式，安装会失败。使用 Mac 应用程序进行安装将避免这个问题。

<!-- #1155 -->

**问：Support Utilities 页面上的工具没有安装，我看到一个 `Insufficient permission to manipulate /usr/local/bin` 的错误，我该如何解决？**

**答：**当你没有 `/usr/local/bin` 的权限时就会发生这种情况。改善权限处理的长期解决方案正在开发中。同时，一个临时的解决方法是通过运行 `sudo chown $USER /usr/local/bin` 来改变 `/usr/local/bin` 的权限。当你能够写到该目录时，Rancher Desktop 就能够创建符号链接。

<!-- #981 -->

**问：Cygwin 与 Rancher Desktop 兼容吗？**

**答：**不，但有计划增加兼容性。

<!-- #1156 -->

**问：当我尝试在 WSL 上使用 Docker 时，如何解决 `permission denied` 的错误？**

**答：**你需要写权限来访问 docker socket。有很多方法可以做到这一点，但这是比较常见的方法：使用 Ubuntu WSL 的命令行：

```bash
sudo addgrp docker
sudo adduser $USER docker
sudo chown root:docker /var/run/docker.sock
sudo chmod g+w /var/run/docker.sock
newgrp docker
```

**问：如何解决 Linux 上的 `kubectl: command not found` 问题？**

**答：**默认情况下，Rancher Desktop 会在 Linux 上的 `/home/<user>/.local/bin` 目录下创建 `kubectl`、`docker`、`helm` 和 `nerdctl` 二进制文件的符号链接。为了能够从控制台直接调用这些命令，你可以通过在控制台执行以下命令并进行注销和登录，将该目录添加到你的 `PATH` 环境变量中:

```bash
echo "export PATH=\$PATH:/home/$(whoami)/.local/bin" >> ~/.bashrc
```
