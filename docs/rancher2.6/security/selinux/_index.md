---
title: SELinux RPM
weight: 4
---

[安全增强型 Linux (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux) 是对 Linux 的安全增强。

它由 Red Hat 开发，是 Linux 上 MAC（mandatory access controls，强制访问控制）的实现。系统管理员可以使用 MAC 设置应用程序和用户是如何访问不同资源的，例如文件、设备、网络和进程间的通信。SELinux 还通过默认限制操作系统来增强安全性。

被政府机构使用之后，SELinux 已成为行业标准，并在 CentOS 7 和 8 上默认启用。要检查 SELinux 是否在你的系统上启用和执行，请使用 `getenforce`：

```
# getenforce
Enforcing
```

我们提供了 `rancher-selinux` 和 `rke2-selinux` 两个 RPM（Red Hat 软件包），让 Rancher 产品能够在 SELinux 主机上正常运行。

- [rancher-selinux](#rancher-selinux)
- [rke2-selinux](#rke2-selinux)
- [安装 rancher-selinux RPM](#installing-the-rancher-selinux-rpm)
- [配置 Logging 应用程序以使用 SELinux](#configuring-the-logging-application-to-work-with-selinux)

## rancher-selinux

要让 Rancher 使用 SELinux，你必须手动为 SELinux 节点启用一些功能。为了解决这个问题，Rancher 提供了一个 SELinux RPM。

`rancher-selinux` RPM 仅包含 [rancher-logging 应用程序](https://github.com/rancher/charts/tree/dev-v2.5/charts/rancher-logging)的策略。

`rancher-selinux` 的 GitHub 仓库在[这里](https://github.com/rancher/rancher-selinux)。

## rke2-selinux

rke2-selinux 为 RKE2 提供策略。如果 RKE2 安装程序脚本检测到它运行在基于 RPM 的发行版上，它会自动安装。

`rke2-selinux` 的 GitHub 仓库在[这里](https://github.com/rancher/rke2-selinux)。

有关在启用 SELinux 的主机上安装 RKE2 的更多信息，请参阅 [RKE2 文档](https://docs.rke2.io/install/methods/#rpm)。

## 安装 rancher-selinux RPM

> **要求**：rancher-selinux RPM 已在 CentOS 7 和 8 上进行了测试。

### 1. 设置 yum 仓库

设置 yum 仓库，从而直接在集群中的所有主机上安装 `rancher-selinux`。

要使用 RPM 仓库，在 CentOS 7 或 RHEL 7 系统上运行以下 bash 代码片段：

```
# cat << EOF > /etc/yum.repos.d/rancher.repo
[rancher]
name=Rancher
baseurl=https://rpm.rancher.io/rancher/production/centos/7/noarch
enabled=1
gpgcheck=1
gpgkey=https://rpm.rancher.io/public.key
EOF
```

要使用 RPM 仓库，在 CentOS 8 或 RHEL 8 系统上运行以下 bash 代码片段：

```
# cat << EOF > /etc/yum.repos.d/rancher.repo
[rancher]
name=Rancher
baseurl=https://rpm.rancher.io/rancher/production/centos/8/noarch
enabled=1
gpgcheck=1
gpgkey=https://rpm.rancher.io/public.key
EOF
```
### 2. 安装 RPM

安装 RPM：

```
yum -y install rancher-selinux
```

## 配置 Logging 应用程序以使用 SELinux

> **要求**：Logging v2 已在 RHEL/CentOS 7 和 8 上使用 SELinux 进行了测试。

在主机上安装 `rancher-selinux` RPM 后，应用程序不会自动运行。它们需要在 RPM 提供的允许的 SELinux 容器域中运行。

要将 `rancher-logging` Chart 配置为支持 SELinux，请在安装 Chart 时将 `values.yaml` 中的 `global.seLinux.enabled` 更改为 true。
