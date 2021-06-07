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

- [配置安装脚本](#配置安装脚本)
- [配置 RKE2 server 节点](#配置-rke2-server-节点)
- [配置 RKE2 agent 节点](#配置-rke2-agent-节点)
- [使用配置文件](#配置文件)
- [直接运行二进制时的配置](#直接运行二进制文件时的配置)

配置 RKE2 的主要方式是通过其[配置文件](#配置文件)。也可以使用命令行参数和环境变量，但是 RKE2 是作为 systemd 服务安装的，因此使用起来并不容易。

## 配置安装脚本

正如[快速入门指南](/docs/rke2/install/quickstart/_index)中提到的，你可以使用 https://get.rke2.io ，将 RKE2 作为服务进行安装。

这个命令的最简单形式如下：

```sh
curl -sfL https://get.rke2.io | sh -
```

当使用这种方法来安装 RKE2 时，可以使用以下环境变量来配置安装：

| 环境变量                   | 描述                                                                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `INSTALL_RKE2_VERSION`     | 从 GitHub 下载 RKE2 的版本。如果没有指定，将尝试从`stable`频道下载最新版本。如果在基于 RPM 的系统上安装，并且所需的版本不存在于`stable`频道中，则应该设置 `INSTALL_RKE2_CHANNEL`。 |
| `INSTALL_RKE2_TYPE`        | 创建 systemd 服务的类型，可以是 "server"或 "agent"，默认为 "server"。                                                                                                              |
| `INSTALL_RKE2_CHANNEL_URL` | 用于获取 RKE2 下载地址的通道 URL。默认为 https://update.rke2.io/v1-release/channels 。                                                                                             |
| `INSTALL_RKE2_CHANNEL`     | 用于获取 RKE2 下载 URL 的通道。默认为`stable`。选项包括: `stable`, `latest`, `testing`.                                                                                            |
| `INSTALL_RKE2_METHOD`      | 要使用的安装方法。在基于 RPM 的系统中默认为`rpm`，其他都是`tar`。                                                                                                                  |

这个安装脚本简单明了，将做以下工作：

1. 根据上述参数，获取所需的版本进行安装。如果没有提供参数，将使用最新的官方版本。
2. 确定并执行安装方法。有两种方法：rpm 和 tar。如果设置了 `INSTALL_RKE2_METHOD` 变量，则将遵循该变量，否则，在使用该软件包管理系统的操作系统上将使用 "rpm"。在所有其他系统上，将使用 tar。在使用 tar 方法的情况下，脚本将简单地解压与所需版本相关的 tar 归档文件。在使用 rpm 的情况下，将建立一个 yum 仓库，并使用 yum 安装 rpm。

## 配置 RKE2 server 节点

关于配置 RKE2 server 的细节，请参考[server 配置参考。](/docs/rke2/install/install_options/server_config/_index)

## 配置 RKE2 agent 节点

关于配置 RKE2 agent 的细节，请参考[agent 配置参考](/docs/rke2/install/install_options/agent_config/_index)

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

| 命令          | 描述                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| `rke2 server` | 运行 RKE2 server，这也将启动 Kubernetes 的控制平面组件，如 API server、controller-manager 和 scheduler。      |
| `rke2 agent`  | 运行 RKE2 agent。这将导致 RKE2 作为一个 worker 节点运行，启动 Kubernetes 节点的服务 `kubelet`和`kube-proxy`。 |
| `rke2 help`   | 显示命令列表或一个命令的帮助                                                                                  |

`rke2 server`和`rke2 agent`命令有额外的配置选项，可以用`rke2 server --help`或`rke2 agent --help`查看。
