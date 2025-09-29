---
title: 已知的问题和限制
description: 本节包含了当前 rke2 的已知问题和限制。如果你遇到这里没有记录的 rke2 的问题，请在[这里](https://github.com/rancher/rke2/issues)打开一个新问题。
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
  - 已知的问题和限制
---

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

在一些操作系统中，如 RHEL 8.4，NetworkManager 包括两个额外的服务，称为`nm-cloud-setup.service`和`nm-cloud-setup.timer`。这些服务添加了一个路由表，干扰了 CNI 插件的配置。不幸的是，没有任何配置可以避免，正如[issue](https://github.com/rancher/rke2/issues/1053)中解释的那样。因此，如果存在这些服务，它们应该被禁用，并且节点必须重新启动。

## Selinux 中的 Istio 执行系统默认失败

这是由于 rke2 的实时内核模块加载，除非容器具有特权，否则在 Selinux 下是不允许的。为了让 Istio 在这些条件下运行，需要两个步骤：

1. [启用 CNI](https://istio.io/latest/docs/setup/additional-setup/cni/)作为 Istio 安装的一部分。请注意，这个[功能](https://istio.io/latest/about/feature-stages/)在本文写作时仍处于 Alpha 状态。 确保`values.cni.cniBinDir=/opt/cni/bin`和`values.cni.cniConfDir=/etc/cni/net.d`。
2. 安装完成后，在 CrashLoopBackoff 中应该有`cni-node` pod。手动编辑它们的守护程序，在`install-cni`容器上加入`securityContext.privileged: true`。

这可以通过自定义 overlay 来执行，如下所示：

```yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
spec:
  components:
    cni:
      enabled: true
      k8s:
        overlays:
          - apiVersion: "apps/v1"
            kind: "DaemonSet"
            name: "istio-cni-node"
            patches:
              - path: spec.template.spec.containers.[name:install-cni].securityContext.privileged
                value: true
  values:
    cni:
      image: rancher/mirrored-istio-install-cni:1.9.3
      excludeNamespaces:
        - istio-system
        - kube-system
      logLevel: info
      cniBinDir: /opt/cni/bin
      cniConfDir: /etc/cni/net.d
```

如果需要，也可以直接[通过 Rancher](https://github.com/rancher/rancher/issues/27377#issuecomment-739075400)进行。更多关于未执行这些步骤时故障与详细日志的信息，请参见 [Issue 504](https://github.com/rancher/rke2/issues/504)。

## Control Groups V2

RKE2 v1.19.5+ 内置 `containerd` v1.4.x 或更高版本，因此应该在支持 cgroups v2 的系统上运行。较旧的版本（< 1.19.5）内置 containerd 1.3.x ，它不支持 cgroups v2 并且需要一些前期配置：

假设是基于 `systemd` 的系统，设置[systemd.unified_cgroup_hierarchy=0](https://www.freedesktop.org/software/systemd/man/systemd.html#systemd.unified_cgroup_hierarchy)内核参数将向 systemd 表明它应该以混合（cgroups v1 + v2）方式运行。结合上述情况，设置 [systemd.legacy_systemd_cgroup_controller](https://www.freedesktop.org/software/systemd/man/systemd.html#systemd.legacy_systemd_cgroup_controller) 内核参数将向 systemd 表明它应该以传统（cgroups v1）的方式运行。由于这些参数是内核命令行参数，因此必须在系统引导程序中设置，以便在`/sbin/init`中作为 PID 1 传递给`systemd`。

参见：

- [grub2 手册](https://www.gnu.org/software/grub/manual/grub/grub.html#linux)
- [systemd 手册](https://www.freedesktop.org/software/systemd/man/systemd.html#Kernel%20Command%20Line)
- [cgroups v2](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html)

## Calico 与 vxlan 封装

Calico 在使用 vxlan 封装且 vxlan 接口的校验和卸载开启时遇到了一个内核错误。这个问题在[calico 项目](https://github.com/projectcalico/calico/issues/3145)和[rke2 项目](https://github.com/rancher/rke2/issues/1541)。我们的临时解决方法是通过应用值来禁用校验和卸载，在[calico helm chart](https://github.com/rancher/rke2-charts/blob/main/charts/rke2-calico/rke2-calico/v3.19.2-203/values.yaml#L51-L53)中使用 `ChecksumOffloadBroken=true` 的值。

这个问题已经在 Ubuntu 18.04、Ubuntu 20.04 和 openSUSE Leap 15.3 中被观察到。

## Wicked

Wicked 根据 sysctl 配置文件（例如，在 /etc/sysctl.d/ 目录下）来配置主机的网络设置。即使 rke2 将 `/net/ipv4/conf/all/forwarding` 等参数设置为 1，但每当 Wicked 重新应用网络配置时，该配置可能会被 Wicked 恢复（有几个事件会导致重新应用网络配置以及 rcwicked 在更新期间重新启动）。因此，在 sysctl 配置文件中启用 ipv4（如果是双堆栈，则启用 ipv6）转发是非常重要的。例如，建议创建一个名为 `/etc/sysctl.d/90-rke2.conf` 的文件，其中包含这些参数（ipv6 仅在双栈的情况下需要）：

```bash
net.ipv4.conf.all.forwarding=1
net.ipv6.conf.all.forwarding=1
```

## Canal 和 IP 地址枯竭

默认情况下，Canal 通过在 `/var/lib/cni/networks/k8s-pod-network` 中为每个 IP 创建一个 lockfile 来保持对 pod IP 的跟踪。每个 IP 都属于一个 pod，一旦该 pod 被删除，IP 就会被删除。但是，如果 containerd 失去了对正在运行的 pod 的追踪，lockfile 可能会被泄露，Canal 将不能再重新使用这些 IP。如果发生这种情况，你可能会遇到 IP 地址枯竭的错误，例如：

```console
failed to allocate for range 0: no IP addresses available in range set
```

要解决这个问题，你可以手动删除该目录中未使用的 IP。如果你需要这样做，请通过 GitHub 报告这个问题，并指定它是如何被触发的。

## CIS 模式的 Ingress

默认情况下，当 RKE2 以 `profile: cis-1.6` 参数运行的时候，RKE2 所应用的网络策略可能对 Ingress 有限制。此外，`rke2-ingress-nginx` Chart 默认设置为 `hostNetwork: false`，因此，用户需要设置自己的网络策略来允许访问 Ingress URL。以下是一个网络策略的示例，该示例允许进入它所应用的命名空间中的任何工作负载。如需了解更多配置选项，请参阅[本文](https://kubernetes.io/docs/concepts/services-networking/network-policies/)。
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ingress-to-backends
spec:
  podSelector: {}
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: kube-system
      podSelector:
        matchLabels:
          app.kubernetes.io/name: rke2-ingress-nginx
  policyTypes:
  - Ingress
```
有关详细信息，请参见此 [issue](https://github.com/rancher/rke2/issues/3195) 中的 comment。