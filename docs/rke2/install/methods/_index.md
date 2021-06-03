---
title: 安装方式
description: RKE2 可以通过多种方式安装到系统中，其中两种方式是首选和支持的。这两种方法是 tarball 和 RPM。快速入门中提到的安装脚本是对这两种方法的一种封装。
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
  - 安装方式
---


**重要说明:** 如果你的节点已安装并启用 NetworkManager，[确保它被配置为忽略 CNI 管理的接口。](https://docs.rke2.io/known_issues/#networkmanager)

RKE2 可以通过多种方式安装到系统中，其中两种方式是首选和支持的。这两种方法是 tarball 和 RPM。快速入门中提到的安装脚本是对这两种方法的一种封装。

本文件更详细地解释了这些安装方法。

### Tarball

要安装 RKE2，你首先需要获得安装脚本。这可以通过多种方式实现。

在这里，你可以获得脚本并立即开始安装。

```bash
curl -sfL https://get.rke2.io | sh -
```

下载安装脚本并添加可执行权限。

```bash
curl -sfL https://get.rke2.io --output install.sh
chmod +x install.sh
```

#### 安装

默认安装最新的 RKE2 版本，不需要其他限定符。然而，如果你想指定一个版本，则应该设置`INSTALL_RKE2_CHANNEL`环境变量。下面是一个例子：

```bash
INSTALL_RKE2_CHANNEL=latest ./install.sh
```

当安装脚本被执行时，它会判断它是什么类型的系统。如果它是一个使用 RPM 的操作系统（比如 CentOS 或 RHEL），它将执行基于 RPM 的安装，否则脚本会默认为 tarball。基于 RPM 的安装将在下面介绍。

接下来，安装脚本下载 tarball，通过比较 SHA256 哈希值进行验证，最后将内容提取到`/usr/local`。如果需要，操作者可以在安装后自由移动文件。这个操作只是提取 tarball，并没有做其他系统的修改。

Tarball 结构/内容

- bin - 包含 RKE2 可执行文件以及`rke2-killall.sh`和`rke2-uninstall.sh`脚本。
- lib - 包含 server 和 agent 的 systemd 单元文件
- share - 包含 RKE2 许可证以及用于在 CIS 模式下运行 RKE2 时使用的 sysctl 配置文件

要进一步配置系统，你需要参考[server](install_options/server_config.md)或[agent](install_options/agent_config.md)文档。

### RPM

为了启动 RPM 的安装过程，你需要得到上面提到的安装脚本。该脚本将检查你的系统是否有 `rpm`、`yum` 或 `dnf`，如果有的话，它将确定该系统是基于 Redhat 的，并启动 RPM 安装过程。

文件的安装前缀为`/usr`，而不是`/usr/local`。

#### Repositories

在 RPM 存储库`rpm-testing.rancher.io`和`rpm.rancher.io`中为 RKE2 发布了已签名的 RPM。如果你在支持 RPM 的节点上运行https://get.rke2.io 脚本，它将默认使用这些 RPM rpeos。但你也可以自己安装它们。

RPM 提供了用于管理 `rke2` 的 `systemd` 单元，但是在首次启动服务之前，需要通过配置文件进行配置。

#### Enterprise Linux 7

为了使用 RPM 资源库，在 CentOS 7 或 RHEL 7 系统上，运行以下 bash 片段：

```bash
cat << EOF > /etc/yum.repos.d/rancher-rke2-1-18-latest.repo
[rancher-rke2-common-latest]
name=Rancher RKE2 Common Latest
baseurl=https://rpm.rancher.io/rke2/latest/common/centos/7/noarch
enabled=1
gpgcheck=1
gpgkey=https://rpm.rancher.io/public.key

[rancher-rke2-1-18-latest]
name=Rancher RKE2 1.18 Latest
baseurl=https://rpm.rancher.io/rke2/latest/1.18/centos/7/x86_64
enabled=1
gpgcheck=1
gpgkey=https://rpm.rancher.io/public.key
EOF
```

#### Enterprise Linux 8

为了使用 RPM 资源库，在 CentOS 8 或 RHEL 8 系统上，运行以下 bash 片段：

```bash
cat << EOF > /etc/yum.repos.d/rancher-rke2-1-18-latest.repo
[rancher-rke2-common-latest]
name=Rancher RKE2 Common Latest
baseurl=https://rpm.rancher.io/rke2/latest/common/centos/8/noarch
enabled=1
gpgcheck=1
gpgkey=https://rpm.rancher.io/public.key

[rancher-rke2-1-18-latest]
name=Rancher RKE2 1.18 Latest
baseurl=https://rpm.rancher.io/rke2/latest/1.18/centos/8/x86_64
enabled=1
gpgcheck=1
gpgkey=https://rpm.rancher.io/public.key
EOF
```

#### 安装

存储库配置好后，你可以运行以下任一命令：

```bash
yum -y install rke2-server
```
or

```bash
yum -y install rke2-agent
```

RPM 会安装一个相应的`rke2-server.service`或`rke2-agent.service`系统单元，可以像这样调用：`systemctl start rke2-server`。在启动 rke2 之前，请确保按照下面的`配置文件`说明对其进行配置。

### 手动

RKE2 二进制文件是静态编译和链接的，这使得 RKE2 二进制文件可以在不同的 Linux 发行版中移植，而不必担心依赖性问题。最简单的安装方法是下载二进制文件，确保其可执行，并将其复制到`${PATH}`，一般是`/usr/local/bin`。第一次执行后，RKE2 将创建所有必要的目录和文件。要进一步配置系统，你需要参考[配置文件](install_options/install_options.md)文档。
