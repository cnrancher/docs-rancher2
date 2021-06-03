# 已知的问题和限制

本节包含了当前 rke2 的已知问题和限制。如果你遇到这里没有记录的 rke2 的问题，请在[这里](https://github.com/rancher/rke2/issues)打开一个新问题。

## Firewalld 与默认网络冲突

Firewalld 与 RKE2 的默认 Canal（Calico + Flannel）网络堆栈有冲突。为了避免意外行为，Firewalld 应该在运行 RKE2 的系统上被禁用。

## NetworkManager

NetworkManager 操作默认网络命名空间中的接口的路由表，许多 CNI，包括 RKE2 的默认设置，为连接到容器创建 veth 对。这可能会干扰 CNI 的正确路由能力。因此，如果在启用 NetworkManager 的系统上安装 RKE2，强烈建议将 NetworkManager 配置为忽略 calico/flannel 相关网络接口。为了做到这一点，请在`/etc/NetworkManager/conf.d`中创建一个名为`rke2-canal.conf`的配置文件，其内容如下：

```bash
[keyfile]
unmanaged-devices=interface-name:cali*;interface-name:flannel*
```

如果你还没有安装 RKE2，简单的 `systemctl reload NetworkManager` 就足以安装配置。如果在已经安装了 RKE2 的系统上执行这一配置变更，则需要重启节点以有效应用这一变更。

## Selinux 中的 Istio 执行系统默认失败

这是由于 rke2 的实时内核模块加载，除非容器具有特权，否则在 Selinux 下是不允许的。为了让 Istio 在这些条件下运行，需要两个步骤：

1. [启用 CNI](https://istio.io/latest/docs/setup/additional-setup/cni/)作为 Istio 安装的一部分。请注意，这个[功能](https://istio.io/latest/about/feature-stages/)在本文写作时仍处于 Alpha 状态。 确保`values.cni.cniBinDir=/opt/cni/bin`和`values.cni.cniConfDir=/etc/cni/net.d`。
2. 安装完成后，在 CrashLoopBackoff 中应该有`cni-node` pod。手动编辑它们的守护程序，在`install-cni`容器上加入`securityContext.privileged: true`。

如果需要，也可以直接[通过 Rancher](https://github.com/rancher/rancher/issues/27377#issuecomment-739075400)进行。更多关于未执行这些步骤时故障与详细日志的信息，请参见 [Issue 504](https://github.com/rancher/rke2/issues/504)。

## Control Groups V2

越来越多的 Linux 发行版开始使用支持 cgroups v2 的内核和用户空间，例如从 Fedora 31 开始。然而，在写这篇文章的时候，RKE2 内置的`containerd`是 1.3.x 的分叉版本（有 1.4.x 版本的 SELinux 提交），不支持 cgroups v2。 在 RKE2 发布`containerd`v1.4.x 版本之前，在支持 cgroups v2 的系统上运行它需要一些前期的配置。

假设是基于 `systemd` 的系统，设置[systemd.unified_cgroup_hierarchy=0](https://www.freedesktop.org/software/systemd/man/systemd.html#systemd.unified_cgroup_hierarchy)内核参数将向 systemd 表明它应该以混合（cgroups v1 + v2）方式运行。结合上述情况，设置 [systemd.legacy_systemd_cgroup_controller](https://www.freedesktop.org/software/systemd/man/systemd.html#systemd.legacy_systemd_cgroup_controller) 内核参数将向 systemd 表明它应该以传统（cgroups v1）的方式运行。由于这些参数是内核命令行参数，因此必须在系统引导程序中设置，以便在`/sbin/init`中作为 PID 1 传递给`systemd`。

参见：

- [grub2 手册](https://www.gnu.org/software/grub/manual/grub/grub.html#linux)
- [systemd 手册](https://www.freedesktop.org/software/systemd/man/systemd.html#Kernel%20Command%20Line)
- [cgroups v2](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html)
