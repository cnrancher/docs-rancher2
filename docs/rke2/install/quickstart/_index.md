---
title: 快速开始
description: 本指南将帮助你用默认选项快速启动一个集群。
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
  - RKE2
  - 快速开始
---

本指南将帮助你用默认选项快速启动一个集群。

> 刚接触 Kubernetes？Kubernetes 官方文档已经有一些很好的教程，[这里](https://kubernetes.io/docs/tutorials/kubernetes-basics/)概述了基础知识。

## 先决条件

- 请确保你的环境满足[要求](/docs/rke2/install/requirements/_index)。如果在主机上安装并启用了 NetworkManager，[确保它被配置为忽略 CNI 管理的接口](/docs/rke2/known_issues/_index#networkmanager)。

- 对于 1.21 及以上的 RKE2 版本，如果主机内核支持[AppArmor](https://apparmor.net/)，那么在安装 RKE2 之前，AppArmor 工具（通常通过`apparmor-parser`包获得）也必须存在。

- RKE2 安装过程必须以 root 用户或通过 `sudo` 运行。

## Server 节点安装

RKE2 提供了一个安装脚本，这是一个在基于 systemd 的系统上将其作为服务安装的便捷方式。这个脚本可以从 https://get.rke2.io 获得。要使用此方法安装 RKE2，请执行以下操作：

#### 1. 运行安装程序

```sh
curl -sfL https://get.rke2.io | sh -
```

:::note 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL http://rancher-mirror.rancher.cn/rke2/install.sh | INSTALL_RKE2_MIRROR=cn sh -
```

:::

这将在你的机器上安装 `rke2-server` 服务和 `rke2` 二进制文件。需要注意的是，除非以 root 用户身份或通过 `sudo` 运行，否则会失败。

#### 2. 启用 rke2-server 服务

```sh
systemctl enable rke2-server.service
```

#### 3. 启动服务

```sh
systemctl start rke2-server.service
```

#### 4. 如果你愿意，可以关注一下日志

```sh
journalctl -u rke2-server -f
```

运行此安装程序后：

- `rke2-server` 服务将被安装。`rke2-server` 服务将被配置为在节点重启后或进程崩溃或被杀时自动重启。
- 其他的实用程序将被安装在`/var/lib/rancher/rke2/bin/`。它们包括 `kubectl`, `crictl`, 和 `ctr`. 注意，这些东西默认不在你的路径上。
- 还有两个清理脚本会安装到 `/usr/local/bin/rke2` 的路径上。它们是 `rke2-killall.sh`和`rke2-uninstall.sh`。
- 一个 [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 文件将被写入`/etc/rancher/rke2/rke2.yaml`。
- 一个可用于注册其他 server 或 agent 节点的令牌将在 `/var/lib/rancher/rke2/server/node-token` 文件中创建。

:::warning 注意：
如果你要添加额外的 server 节点，则总数必须为奇数。需要奇数来维持选举数。更多细节请参见[高可用文档](/docs/rke2/install/ha/_index) 。
:::

## Linux Agent（Worker）节点的安装

本节中的步骤需要 root 级别访问权限或 `sudo` 才能工作。

#### 1. 运行安装程序

```sh
curl -sfL https://get.rke2.io | INSTALL_RKE2_TYPE="agent" sh -
```

:::note 提示
国内用户，可以使用以下方法加速安装：

```sh
curl -sfL http://rancher-mirror.rancher.cn/rke2/install.sh | INSTALL_RKE2_MIRROR=cn INSTALL_RKE2_TYPE="agent"  sh -
```

:::

这将在你的机器上安装 `rke2-agent` 服务和 `rke2 `二进制文件。

#### 2. 启用 rke2-agent 服务

```sh
systemctl enable rke2-agent.service
```

#### 3. 配置 rke2-agent 服务

```sh
mkdir -p /etc/rancher/rke2/
vim /etc/rancher/rke2/config.yaml
```

config.yaml 的内容。

```yaml
server: https://<server>:9345
token: <token from server node>
```

:::note 注意：
`rke2 server` 进程通过端口 `9345` 监听新节点的注册。正常情况下，Kubernetes API 仍可在端口 6443 上使用。
:::

#### 4. 启动服务

```sh
systemctl start rke2-agent.service
```

**如果你愿意，可以关注一下日志**。

```sh
journalctl -u rke2-agent -f
```

:::warning 注意：
每台机器必须有一个唯一的主机名。如果你的机器没有唯一的主机名，请在 `config.yaml` 文件中设置 `node-name` 参数，并为每个节点提供一个有效和唯一的主机名。
:::

要阅读更多关于 config.yaml 文件的信息，请参见[安装选项文档。](/docs/rke2/install/install_options/install_options/_index#配置文件)

## Windows Agent（Worker）节点的安装

**从 v1.21.3+rke2r1 开始，Windows 支持目前是实验性的**。**Windows 支持需要选择 Calico 作为 RKE2 集群的 CNI**。

#### 1. 准备好 Windows Agent 节点

**注意：**需要启用 Windows Server Containers，以便 RKE2 agent 工作。

以管理员权限打开一个新的 Powershell 窗口

```powershell
powershell -Command "Start-Process PowerShell -Verb RunAs"
```

在新的 Powershell 窗口中，运行以下命令。

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName containers –All
```

这将需要重新启动以使 `Containers` 功能正常运行。

#### 2. 下载安装脚本

```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/rancher/rke2/master/install.ps1 -Outfile install.ps1
```

这个脚本将下载 Windows 二进制文件 `rke2.exe` 到你的机器上。

#### 3. 为 Windows 配置 rke2-agent

```powershell
New-Item -Type Directory c:/etc/rancher/rke2 -Force
Set-Content -Path c:/etc/rancher/rke2/config.yaml -Value @"
server: https://<server>:9345
token: <token from server node>
"@
```

要阅读更多关于 config.yaml 文件的信息，请参见[安装选项文档。](/docs/rke2/install/install_options/install_options/_index#配置文件)

#### 4. 配置 PATH

```powershell
$env:PATH+=";c:\var\lib\rancher\rke2\bin;c:\usr\local\bin"

[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine) + ";c:\var\lib\rancher\rke2\bin;c:\usr\local\bin",
    [EnvironmentVariableTarget]::Machine)
```

#### 5. 运行安装程序

```powershell
./install.ps1
```

#### 6. 启动 Windows RKE2 服务

```powershell
rke2.exe agent service --add
```

**注意：**每台机器必须有一个唯一的主机名。

如果你希望只使用 CLI 参数，请使用所需参数运行二进制文件。

```
rke2.exe agent --token <> --server <>
```
