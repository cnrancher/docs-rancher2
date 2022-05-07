---
title: 安装配置选项
description: 本页主要介绍设置 RKE2 时的配置选项
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
  - 安装配置选项
  - 配置选项
---

本页主要介绍设置 RKE2 时的配置选项:

- [配置 Linux 安装脚本](#配置-linux-安装脚本)
- [配置 Windows 安装脚本](#配置-windows-安装脚本)
- [配置 RKE2 server 节点](#配置-rke2-server-节点)
- [配置 Linux RKE2 agent 节点](#配置-linux-rke2-agent-节点)
- [配置 Windows RKE2 agent 节点](#配置-windows-rke2-agent-节点)
- [使用配置文件](#配置文件)
- [直接运行二进制文件时的配置](#直接运行二进制文件时的配置)

配置 RKE2 的主要方式是通过其[配置文件](#配置文件)。也可以使用命令行参数和环境变量，但是 RKE2 是作为 systemd 服务安装的，因此使用起来并不容易。

## 配置 Linux 安装脚本

正如[快速入门指南](/docs/rke2/install/quickstart/_index)中提到的，你可以使用 https://get.rke2.io ，将 RKE2 作为服务进行安装。

这个命令的最简单形式是以 root 用户身份或通过 `sudo` 运行，如下所示：

```sh
# curl -sfL https://get.rke2.io | sudo sh -
curl -sfL https://get.rke2.io | sh -
```

:::note 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL http://rancher-mirror.rancher.cn/rke2/install.sh | INSTALL_RKE2_MIRROR=cn sh -
```

:::

当使用这种方法来安装 RKE2 时，可以使用以下环境变量来配置安装：

| 环境变量                   | 描述                                                                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `INSTALL_RKE2_VERSION`     | 从 GitHub 下载 RKE2 的版本。如果没有指定，将尝试从`stable`频道下载最新版本。如果在基于 RPM 的系统上安装，并且所需的版本不存在于`stable`频道中，则应该设置 `INSTALL_RKE2_CHANNEL`。 |
| `INSTALL_RKE2_TYPE`        | 创建 systemd 服务的类型，可以是 "server"或 "agent"，默认为 "server"。                                                                                                              |
| `INSTALL_RKE2_CHANNEL_URL` | 用于获取 RKE2 下载地址的通道 URL。默认为 `https://update.rke2.io/v1-release/channels`。                                                                                             |
| `INSTALL_RKE2_CHANNEL`     | 用于获取 RKE2 下载 URL 的通道。默认为`stable`。选项包括: `stable`, `latest`, `testing`.                                                                                            |
| `INSTALL_RKE2_METHOD`      | 要使用的安装方法。在基于 RPM 的系统中默认为`rpm`，其他都是`tar`。                                                                                                                  |

这个安装脚本简单明了，将做以下工作：

1. 根据上述参数，获取所需的版本进行安装。如果没有提供参数，将使用最新的官方版本。
2. 确定并执行安装方法。有两种方法：rpm 和 tar。如果设置了 `INSTALL_RKE2_METHOD` 变量，则将遵循该变量，否则，在使用该软件包管理系统的操作系统上将使用 "rpm"。在所有其他系统上，将使用 tar。在使用 tar 方法的情况下，脚本将简单地解压与所需版本相关的 tar 归档文件。在使用 rpm 的情况下，将建立一个 yum 仓库，并使用 yum 安装 rpm。

## 配置 Windows 安装脚本

**从 v1.21.3+rke2r1 开始，Windows 支持目前是实验性的**。**Windows 支持需要选择 Calico 作为 RKE2 集群的 CNI**

正如[快速入门指南](/docs/rke2/install/quickstart/_index)中提到的，你可以使用https://github.com/rancher/rke2/blob/master/install.ps1 中的安装脚本在 Windows agent 节点上安装 RKE2。

该命令的最简单形式如下。

```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/rancher/rke2/master/install.ps1 -Outfile install.ps1
```

当使用这种方法安装 Windows RKE2 agent 时，可以通过以下参数来配置安装脚本：

```
语法：

install.ps1 [[-Channel] <String>] [[-Method] <String>] [[-Type] <String>] [[-Version] <String>] [[-TarPrefix] <String>] [-Commit] [[-AgentImagesDir] <String>] [[-ArtifactPath] <String>] [[-ChannelUrl] <String>] [<CommonParameters>]

选项：

-Channel 用于获取RKE2下载URL的通道（默认："stable"）。
-Method 使用的安装方法。目前支持tar或choco安装。(默认值："tar")
-Type RKE2服务的类型。在Windows上只支持 "agent" 类型。(默认值: "agent")
-Version 从Github下载的rke2版本
-TarPrefix 使用tar安装方法时的安装前缀。(默认值：`C:/usr/local`，除非`C:/usr/local`是只读的或者有专门的挂载点，在这种情况下会使用`C:/opt/rke2`代替)
-Commit (experimental/agent) 从临时云存储中下载RKE2的commit。如果设置，这将强制`--Method=tar`。仅用于开发目的。
-AgentImagesDir 当从CI提交安装时，离线镜像的安装路径。(默认：`C:/var/lib/rancher/rke2/agent/images`)
-ArtifactPath 如果设置，安装脚本将使用本地路径来获取`rke2.windows-$SUFFIX`和`sha256sum-$ARCH.txt`文件，而不是从GitHub下载这些文件。默认情况下是禁用的。
```

### 其他 Windows 安装脚本使用实例

#### 安装最新版本而不是稳定版

```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/rancher/rke2/master/install.ps1 -Outfile install.ps1
./install.ps1 -Channel Latest
```

#### 使用 Tar 安装方法安装最新版本

```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/rancher/rke2/master/install.ps1 -Outfile install.ps1
./install.ps1 -Channel Latest -Method Tar
```

## 配置 RKE2 server 节点

关于配置 RKE2 server 的细节，请参考[server 配置参考。](/docs/rke2/install/install_options/server_config/_index)

## 配置 Linux RKE2 agent 节点

关于配置 RKE2 agent 的细节，请参考[agent 配置参考](/docs/rke2/install/install_options/linux_agent_config/_index)

## 配置 Windows RKE2 agent 节点

关于配置 RKE2 Windows agent 的细节，请参考[Windows agent 配置参考。](/docs/rke2/install/install_options/windows_agent_config/_index)

## 配置文件

默认情况下，RKE2 将使用位于`/etc/rancher/rke2/config.yaml`的 YAML 文件中的值启动。

下面是一个基本的 `server` 配置文件的例子：

```yaml
write-kubeconfig-mode: "0644"
tls-san:
  - "foo.local"
node-label:
  - "foo=bar"
  - "something=amazing"
```

配置文件参数直接映射到 CLI 参数，可重复的 CLI 参数表示为 YAML 列表。

下面是一个仅使用 CLI 参数的相同配置，以证明这一点：

```bash
rke2 server \
  --write-kubeconfig-mode "0644"    \
  --tls-san "foo.local"             \
  --node-label "foo=bar"            \
  --node-label "something=amazing"
```

也可以同时使用配置文件和 CLI 参数。在这些情况下，将从两个源中加载值，但 CLI 参数将被优先考虑。 对于可重复的参数，如`--node-label`，CLI 参数将覆盖列表中的所有值。

最后，配置文件的位置可以通过 CLI 参数`--config FILE, -c FILE`，或者环境变量`$RKE2_CONFIG_FILE`来改变。

## 直接运行二进制文件时的配置

如前所述，安装脚本主要是为了配置 RKE2 作为一个服务来运行。如果你选择不使用脚本，你可以通过从我们的[发布页](https://github.com/rancher/rke2/releases/latest)下载二进制文件，把它放在你的路径上，然后执行它。RKE2 二进制文件支持以下命令：

| 命令          | 描述                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `rke2 server` | 运行 RKE2 server，这也将启动 Kubernetes 的控制平面组件，如 API server、controller-manager 和 scheduler。仅支持 Linux               |
| `rke2 agent`  | 运行 RKE2 agent。这将导致 RKE2 作为一个 worker 节点运行，启动 Kubernetes 节点的服务 `kubelet`和`kube-proxy`。支持 Linux 和 Windows |
| `rke2 help`   | 显示命令列表或一个命令的帮助                                                                                                       |

`rke2 server`和`rke2 agent`命令有额外的配置选项，可以用`rke2 server --help`或`rke2 agent --help`查看。
