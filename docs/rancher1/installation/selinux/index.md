---
title: SELinux 模式
---

# SELinux 模式

_从 1.6+版本后支持_ 在 SELinux 模式下安装 Rancher-RHEL/CentOS

为了使 Rancher 在 RHEL/CentOS 的 SELinux 模式下正常工作，您需要在安装有 RPM 包`container-selinux-2.14`(或更高的版本)的主机上运行 Rancher Server 容器。同时，全部的 agent[主机](/docs/rancher1/infrastructure/hosts/)也要安装这个包。如果您安装了较低版本的`container-selinux`包，您需要构建额外的 SELinux 模块，从而使 Rancher 正常工作。

您可以通过这个命令来查看这个包的版本:`rpm -q container-selinux`。

```
# Check container-selinux version
$ rpm -q container-selinux
container-selinux-2.19-2.1.el7.noarch
```

## 构建额外的 SELinux 模块

### 安装包并构建 SELinux 模块

为了安装另外的 SELinux 模块，您需要安装 `selinux-policy-devel` 这个包。

```
$ yum install selinux-policy-devel
```

### 构建模块

创建一个名叫 `virtpatch.te` 的文件并写入以下内容

```
policy_module(virtpatch, 1.0)

gen_require(`
  type svirt_lxc_net_t;
')

allow svirt_lxc_net_t self:netlink_xfrm_socket create_netlink_socket_perms;
```

构建模块

```
$ make -f /usr/share/selinux/devel/Makefile
```

运行 `make` 命令后，当构建成功后，一个名叫 `virtpatch.pp` 的文件将会被创建。`virtpatch.pp` 是编译后的 SELinux 模块

### 加载模块

在 SELinux 模块被构建后，使用以下命令加载。

```
# Load the module
$ semodule -i virtpatch.pp
# Verify the module is loaded
$ semodule -l
```
