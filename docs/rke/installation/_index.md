---
title: 安装介绍
---

RKE 是一个快速的，多功能的 Kubernetes 安装工具，您可以参考以下步骤，使用 RKE 在您的 Linux 主机上安装 Kubernetes：

1. [下载 RKE 二进制安装包（三选一）](#download-the-rke-binary)
   - [使用 GitHub 安装 RKE](#使用-GitHub-安装-RKE)
   - [使用 Homebrew 安装 RKE](#使用-Homebrew-安装-RKE)
   - [使用 MacPorts 安装 RKE](#使用-MacPorts-安装-RKE)
1. [为 Kubernetes 集群准备节点](#为-Kubernetes-集群准备节点)
1. [创建集群配置文件](#创建集群配置文件)
1. [使用 RKE 部署 Kubernetes](#使用-RKE-部署-Kubernetes)
1. [保存文件](#保存文件)
1. [操作 Kubernetes 集群](#操作-Kubernetes-集群)

## 下载 RKE 二进制安装包

RKE 提供了三种下载安装包的方法：通过 GitHub、Homebrew 或 MacPorts 都可以下载 RKE 安装包。使用 Github 下载对您使用的主机操作系统没有要求，而使用 Homebrew 和 MacPorts 要求您的主机操作系统必须为 MacOS。

### 使用 GitHub 下载安装包

1. 登录您的主机，打开浏览器，访问[RKE 版本发布页面](https://github.com/rancher/rke/releases)，下载最新的 RKE v1.x，有以下几个版本供您下载：

   - **macOS**：`rke_darwin-amd64`
   - **Linux (Intel/AMD)**：`rke_linux-amd64`
   - **Linux (ARM 32-bit)**：`rke_linux-arm`
   - **Linux (ARM 64-bit)**：`rke_linux-arm64`
   - **Windows (32-bit)**：`rke_windows-386.exe`
   - **Windows (64-bit)**：`rke_windows-amd64.exe`

2. 运行以下命令，将下载的 RKE 二进制安装包复制到您想要保存的路径下。然后将这个安装包重命名为`rke` （Windows 用户请重命名为`rke.exe`）。

   MacOS 用户请运行以下命令：

   ```shell
   # macOS
   mv rke_darwin-amd64 rke
   ```

   Linux 用户请运行以下命令：

   ```shell
   # Linux
   mv rke_linux-amd64 rke
   ```

   Windows 用户请运行以下命令：

   ```shell
   # Windows PowerShell
   > mv rke_windows-amd64.exe rke.exe
   ```

3. 运行以下命令，将 RKE 安装包转为可执行文件。如果您使用的 Windows 操作系统，则可以跳过这个步骤，直接查看[为 Kubernetes 集群准备节点](#为-Kubernetes-集群准备节点)。

   ```shell
   $ chmod +x rke
   ```

4. 运行以下命令，检查 RKE 安装包是否已经转换成可执行文件。

   ```shell
   $ rke --version
   ```

### 使用 Homebrew 下载安装包

使用 Homebrew 下载 RKE 安装包时，请参考以下步骤：

1. 打开浏览器，访问[Homebrew 官方网站](https://brew.sh/)，按照网站列出的指示安装 Homebrew，通常只需要将网站上的命令复制粘贴到命令行工具中，单击回车键运行该命令即可，整个安装过程可能需要 3~5 分钟。

2. 运行`brew`命令，安装 RKE。

   ```shell
   brew install rke
   ```

3. 完成 Homebrew 安装后，使用`brew`命令安装 Docker。

   ```shell
   brew install rke
   ```

   如果您已经使用 Homebrew 安装过了 RKE，可以运行以下命令，升级到最新版本的 RKE。

   ```shell
   brew upgrade rke
   ```

### 使用 MacPorts 下载安装包

使用 MacPorts 下载 RKE 安装包时，请参考以下步骤：

1. 打开浏览器，访问[MacPorts 官方网站](https://www.macports.org/)，按照网站列出的指示安装 MacPorts，通常只需要将网站上的命令复制粘贴到命令行工具中，单击回车键运行该命令即可，整个安装过程可能需要 3~5 分钟。

2. 运行`port`命令，安装 RKE。

   ```shell
   port install rke
   ```

3. 完成 MacPorts 安装后，使用`port`命令安装 Docker：

   ```
   port install rke
   ```

   如果您已经使用 MacPorts 安装过了 RKE，可以运行以下命令，升级到最新版本的 RKE。

   ```shell
   port upgrade rke
   ```

## 为 Kubernetes 集群准备节点

Kubernetes 集群组件需要在 Linux 发行版上的 Docker 中运行，只要是能安装和运行 Docker 的 Linux 发行版，您都可以使用。请参考[操作系统要求](/docs/rke/os/_index)，正确地配置每一个节点。

## 创建集群配置文件

RKE 使用集群配置文件`cluster.yml`规划集群中的节点，例如集群中应该包含哪些节点，如何部署 Kubernetes。您可以通过该文件修改很多[集群配置选项](/docs/rke/config-options/_index)。在 RKE 的文档中，我们提供的代码示例假设集群中只有一个[节点](/docs/rke/config-options/nodes/_index)。

创建集群配置文件`cluster.yml`的方式有两种：

- 使用 [minimal `cluster.yml`](/docs/rke/example-yamls/_index)创建集群配置文件，然后将您使用的节点的相关信息添加到文件中。
- 使用`rke config`命令创建集群配置文件，然后将集群参数逐个输入到该文件中。

### 使用`rke config`

运行`rke config`命令，在当前路径下创建 `cluster.yml`文件。这条命令会引导您输入创建集群所需的所有参数，详情请参考[集群配置选项](/docs/rke/config-options/_index)。

```shell
rke config --name cluster.yml
```

#### 其他配置选项

在原有创建集群配置文件命令的基础上，加上 `--empty` ，可以创建一个空白的集群配置文件。

```shell
rke config --empty --name cluster.yml
```

您也可以使用`--print`，将`cluster.yml`文件的内容显示出来。

```shell
rke config --print
```

### 高可用

RKE 适配了高可用集群，您可以在`cluster.yml`文件中配置多个`controlplane`节点。RKE 会把 master 节点的组件部署在所有被列为`controlplane`的节点上，同时把 kubelets 的默认连接地址配置为`127.0.0.1:6443`。这个地址是`nginx-proxy`请求所有 master 节点的地址

创建高可用集群需要指定两个或更多的节点作为`controlplane`。

### 证书

_v0.2.0 开始可用_

默认情况下，Kubernetes 集群需要用到证书，而 RKE 会自动为所有集群组件生成证书。您也可以使用[自定义证书](/docs/rke/installation/certs/_index)。部署集群后，您可以管理这些自动生成的证书，详情请参考[管理自动生成的证书](/docs/rke/cert-mgmt/_index)。

## 使用 RKE 部署 Kubernetes

创建了`cluster.yml`文件后，您可以运行以下命令部署集群。这条命令默认`cluster.yml`已经保存在了您运行命令所处的路径下。

```
rke up

INFO[0000] Building Kubernetes cluster
INFO[0000] [dialer] Setup tunnel for host [10.0.0.1]
INFO[0000] [network] Deploying port listener containers
INFO[0000] [network] Pulling image [alpine:latest] on host [10.0.0.1]
...
INFO[0101] Finished building Kubernetes cluster successfully
```

运行该命令后，返回的最后一行信息应该是`Finished building Kubernetes cluster successfully`，表示成功部署集群，可以开始使用集群。在创建 Kubernetes 集群的过程中，会创建一个`kubeconfig` 文件，它的文件名称是 `kube_config_cluster.yml`，您可以使用它控制 Kubernetes 集群。

> **说明：**如果您之前使用的集群配置文件名称不是`cluster.yml`，那么这里生成的 kube_config 文件的名称也会随之变化为`kube_config*<FILE_NAME>.yml`。

## 保存文件

> **重要**
> 请保存下文中列出来的所有文件，这些文件可以用于维护集群，排查问题和升级集群。

请将这些文件复制并保存到安全的位置。

- `cluster.yml`：RKE 集群的配置文件。
- `kube_config_cluster.yml`：该集群的[Kubeconfig 文件](/docs/rke/kubeconfig/_index)包含了获取该集群所有权限的认证凭据。
- `cluster.rkestate`：[Kubernetes 集群状态文件](#Kubernetes-集群状态文件)，包含了获取该集群所有权限的认证凭据，使用 RKE v0.2.0 时才会创建这个文件。

> **说明：** 后两个文件的名称取决于您如何命名 RKE 集群配置文件，如果您修改的集群配置文件的名称，那么后两个文件的名称可能会跟上面列出来的文件名称不一样。

### Kubernetes 集群状态文件

Kubernetes 集群状态文件用集群配置文件`cluster.yml`以及集群中的组件证书组成。不同版本的 RKE 会将文件保存在不同的地方。

**v0.2.0 以及更新版本**的 RKE 会在保存集群配置文件 `cluster.yml`的路径下创建一个`.rkestate`文件。该文件包含当前集群的状态、RKE 配置信息和证书信息。请妥善保存该文件的副本。

**v0.2.0 之前的版本**的 RKE 会将集群状态存储以密文的形式存储。更新集群状态时，RKE 拉取这些密文，修改集群状态，然后将新的集群状态再次存储为密文。

## 操作 Kubernetes 集群

成功启动和运行集群后，您可以使用`kubectl`和[kubeconfig 文件](/docs/rke/kubeconfig/_index)控制集群。

## 相关操作

完成 RKE 安装后，可能还需要完成以下两个相关操作：

- [管理证书](/docs/rke/cert-mgmt/_index)
- [添加或移除节点](/docs/rke/managing-clusters/_index)
