---
title: 故障排除提示
description: 提供了 Rancher Desktop 相关问题的故障排除提示。
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
  - 故障排除
  - Troubleshooting
---

此页面提供了 Rancher Desktop 相关问题的故障排除提示。

#### 问：为什么我在 Rancher Desktop 的 WSL 集成页面下看不到我的 WSL 发行版？

**答**：你可能使用的是 WSL 1 发行版。Rancher Desktop 仅支持 WSL 2 发行版。你可以通过运行 `wsl --set-version <distro-name> 2` 命令将 WSL 1 发行版转换为 WSL 2 发行版。你还可以运行 `wsl --set-default-version 2` 命令来将你之后可能安装的所有发行版设置为使用 WSL 2。

#### 问：运行 `kubectl config get-contexts` 时，我没有看到 Rancher Desktop 的条目，它在哪里？

**答**：Rancher Desktop 将配置放置在默认位置 `~/.kube/config`。你的 `KUBECONFIG` 环境变量可能被设置为在其他位置查找配置文件。

#### 问：Rancher Desktop 卡在 `Waiting for Kubernetes API`，我该怎么办？

**答**：没有额外信息我们很难确定原因。导航到 **Troubleshooting** 选项卡并访问日志。然后，转到 [Rancher Desktop GitHub] 页面并提交附加了你的日志的 Issue。

[Rancher Desktop Github]: https://github.com/rancher-sandbox/rancher-desktop/issues

<!-- RD #1262 -->
#### 问：安装 Rancher Desktop 并卸载 Docker Desktop 后，我无法再运行 `docker compose`，为什么？

**答**：这是 Rancher Desktop 早期版本（1.1.0 之前）的问题。Rancher Desktop 1.1.0 及以上版本附带了 `docker-compose`，并在 `~/.docker/cli-plugins` 提供了 CLI 插件。我们强烈建议你升级到最新版本的 Rancher Desktop。

如果你仍然无法使用 `docker-compose`，请在 [Github](https://github.com/rancher-sandbox/rancher-desktop/issues/new?assignees=&labels=kind%2Fbug&template=bug_report.yml)上报告这个 Bug。

<!-- #966 -->
#### 问：我使用 Homebrew 来安装 Rancher Desktop，但是 `brew install rancher-desktop` 提示失败，为什么？

**答**：Homebrew cask 的命名约定规定了 `-desktop` 后缀要从 cask formula 名称中删除。因此，请改用 `brew install rancher`。

<!-- #1156 -->
#### 问：尝试在 WSL 上使用 Docker 时，如何修复 `permission denied` 错误？

**答**：你需要写权限才能访问 docker socket。解决这个问题的方法有很多，以下是常见的方法之一。使用 Ubuntu WSL 命令行：

```bash
sudo groupadd docker
sudo adduser $USER docker
sudo chown root:docker /var/run/docker.sock
sudo chmod g+w /var/run/docker.sock
newgrp docker
```

#### 问：如何解决 Linux 上的 `kubectl: command not found` 问题？

**A:** 默认情况下，Rancher Desktop 会在 Linux 的 `/home/<user>/.local/bin` 下创建 `kubectl`、`docker`、`helm` 和 `nerdctl` 二进制文件的符号链接。要直接从控制台调用这些命令，你可以在控制台中执行以下命令，并执行注销和登录来将目录添加到你的 `PATH` 环境变量中：

```bash
echo "export PATH=\$PATH:/home/$(whoami)/.local/bin" >> ~/.bashrc
```
