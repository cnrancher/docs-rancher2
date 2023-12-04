---
title: SELinux RPM
description: Rancher 可以运行安全扫描，以根据 CIS (Center for Internet Security，互联网安全中心) Kubernetes 基准测试中定义的安全最佳实践来检查已部署 Kubernetes 的是否满足安全标准。互联网安全中心（CIS）是一个`501(c)(3)`非营利组织，成立于 2000 年 10 月，其使命是“通过识别，开发，验证，推广和维护最佳实践解决方案来防御网络攻击，并建立和引导社区打造安全可信的网络环境”。该组织的总部位于纽约东格林布什，成员包括大型公司，政府机构和学术机构。CIS 基准测试是安全配置目标系统的最佳实践。CIS 基准是通过领域专家，技术供应商，公共和私人社区成员以及 CIS 基准开发团队的不懈努力而制定的。基准提供两种类型的建议：计分和不记分。我们仅运行与“计分建议”相关的测试。
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
  - 安全
  - SELinux RPM
---

_从 v2.5.8 版起可用_

[安全增强的 Linux（SELinux）](https://en.wikipedia.org/wiki/Security-Enhanced_Linux)是对 Linux 的安全增强。

它由 Red Hat 开发，是 Linux 上强制性访问控制（MAC）的一个实现。强制性访问控制允许系统管理员定义应用程序和用户如何访问不同的资源，如文件、设备、网络和进程间通信。SELinux 还通过使操作系统在默认情况下具有限制性而增强了安全性。

在历史上被政府机构使用后，SELinux 现在是行业标准，在 CentOS 7 和 8 上默认启用。要检查 SELinux 是否在你的系统上启用和执行，请使用`getenforce`。

```bash
getenforce
Enforcing
```

我们提供了两个 RPM（红帽软件包），使 Rancher 产品能够在执行 SELinux 的主机上正常运行。`rancher-selinux`和`rke2-selinux`。

- [rancher-selinux](#rancher-selinux)
- [rke2-selinux](#rke2-selinux)
- [安装 rancher-selinux RPM](#installing-therancher-selinux-rpm)
- [配置日志应用程序以与 SELinux 一起工作](#configuring-the-logging-application-to-work-with-selinux)

## rancher-selinux

为了让 Rancher 与 SELinux 一起工作，必须为 SELinux 节点手动启用一些功能。为了帮助解决这个问题，Rancher 提供了一个 SELinux RPM。

从 v2.5.8 开始，`rancher-selinux` RPM 只包含 [rancher-logging application](https://github.com/rancher/charts/tree/dev-v2.5/charts/rancher-logging) 的策略。

`rancher-selinux`的 GitHub 仓库是[这里。](https://github.com/rancher/rancher-selinux)

## rke2-selinux

rke2-selinux 为 RKE2 提供策略。当 RKE2 安装脚本检测到它在基于 RPM 的发行版上运行时，它会自动安装。

`rke2-selinux`的 GitHub 仓库是[这里。](https://github.com/rancher/rke2-selinux)

关于在支持 SELinux 的主机上安装 RKE2 的更多信息，请参阅[RKE2 文档。](https://docs.rke2.io/install/methods/#rpm)

## 安装 Rancher-selinux RPM

> **要求：** rancher-selinux RPM 已在 CentOS 7 和 8 上测试。

### 1. 设置 yum repo

设置 yum repo 以直接在集群中的所有主机上安装`rancher-selinux`。

为了使用 RPM 仓库，在 CentOS 7 或 RHEL 7 系统上，运行以下 bash 片段。

```bash
# cat << EOF > /etc/yum.repos.d/rancher.repo
[rancher]
name=Rancher
baseurl=https://rpm.rancher.io/rancher/production/centos/7/noarch
enabled=1
gpgcheck=1
gpgkey=https://rpm.rancher.io/public.key
EOF
```

为了使用 RPM 资源库，在 CentOS 8 或 RHEL 8 系统上，运行下面的 bash 片段。

```bash
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

安装 RPM。

```bash
yum -y install rancher-selinux
```

## 配置日志应用程序以与 SELinux 一起工作

> **要求：** Logging v2 在 RHEL/CentOS 7 和 8 上用 SELinux 测试。

一旦 "rancher-selinux "RPM 安装在主机上，应用程序不会自动工作。它们需要被配置为在 RPM 提供的允许的 SELinux 容器域中运行。

要配置`rancher-logging`图表为 SELinux 感知，在安装图表时将`values.yaml`中的`global.seLinux.enabled`改为 true。
