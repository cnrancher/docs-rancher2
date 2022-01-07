---
title: CIS 加固指南
description: 本文档为 RKE2 的生产安装提供了规范性的指导。它概述了应对信息安全中心（CIS）的 Kubernetes 基准控制所需的配置和控制。
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
  - CIS 加固指南
  - CIS
---

本文档为 RKE2 的生产安装提供了规范性的指导。它概述了应对信息安全中心（CIS）的 Kubernetes 基准控制所需的配置和控制。

更多关于根据 CIS 官方基准评估加固集群的细节，请参考 CIS 基准 Rancher 自我评估指南[v1.5](/docs/rke2/security/cis_self_assessment15/_index)或[v1.6](/docs/rke2/security/cis_self_assessment16/_index)。

RKE2 被设计为 "默认加固"，无需修改即可通过大部分 Kubernetes 的 CIS 控制。但有几个例外，需要人工干预才能完全通过 CIS 基准测试。

1. RKE2 不会修改主机操作系统。因此，你或操作者，必须做一些主机级的修改。
2. CIS 对 PodSecurityPolicies 和 NetworkPolicies 的某些策略控制将限制该集群的功能。你必须选择让 RKE2 配置这些开箱即用的功能。

为了帮助确保满足上述要求，RKE2 可以在启动时将 `profile` 标志设置为 `cis-1.5` 或 `cis-1.6`。这个标志通常做两件事：

1. 检查主机级要求是否已经满足。如果没有，RKE2 将退出，出现一个致命的错误，描述未满足的要求。
2. 配置运行时 Pod 安全策略和网络策略，允许集群通过相关控制。

:::note 注意：
配置文件的标志唯一有效的值是 `cis-1.5` 或 `cis-1.6`。它接受一个字符串值，以便在未来允许其他配置文件。
:::

以下部分概述了当 `profile` 标志被设置为 `cis-1.5` 或 `cis-1.6` 时的具体操作。

## 主机级的要求

主机级的要求有两个方面：内核参数和 etcd 进程/目录配置。这些都在本节中概述。

### 确保设置 `protect-kernel-defaults`

这是一个 kubelet 标志，如果所需的内核参数没有设置或设置的值与 kubelet 的默认值不同，将导致 kubelet 退出。

当`profile`标志被设置时，RKE2 将把该标志设置为 "true"。

:::warning 注意：
`protect-kernel-defaults`被暴露为 RKE2 的一个顶级标志。如果你将`profile`设置为 "cis-1.x"，而将`protect-kernel-defaults`明确设置为 false，RKE2 将以错误退出。
:::

RKE2 也将检查与 kubelet 相同的内核参数，并按照与 kubelet 相同的规则以错误退出。这样做是为了方便操作者更快、更容易地识别哪些内核参数违反了 kubelet 的默认值。

### 确保 etcd 正常启动

CIS 基准测试要求 etcd 数据目录由`etcd`用户和组拥有。这隐含地要求 etcd 进程以主机级`etcd`用户的身份运行。为了实现这一点，RKE2 在以 cis-1.5 配置文件启动时采取了几个步骤：

1. 检查主机上是否存在`etcd`用户和组。如果不存在，则以错误方式退出。
2. 创建 etcd 的数据目录，将 `etcd` 作为用户和组的所有者。
3. 通过适当设置 etcd 静态 pod 的 SecurityContext，确保 etcd 进程以 `etcd` 用户和组的身份运行。

### 设置主机

本节给出了配置主机以满足上述要求的必要命令。

#### 设置内核参数

当 RKE2 安装完毕后，它会创建一个 sysctl 配置文件来适当地设置所需的参数。然而，它并没有自动配置主机来使用这个配置。你必须手动完成这项工作。配置文件的位置取决于所使用的安装方法。

如果 RKE2 是通过 RPM、YUM 或 DNF（默认使用 RPM 的操作系统，如 CentOS）安装的，运行以下命令：

```bash
sudo cp -f /usr/share/rke2/rke2-cis-sysctl.conf /etc/sysctl.d/60-rke2-cis.conf
sudo systemctl restart systemd-sysctl
```

如果 RKE2 是通过 tarball 安装的（在 Ubuntu 等不使用 RPM 的操作系统），运行以下命令：

```bash
sudo cp -f /usr/local/share/rke2/rke2-cis-sysctl.conf /etc/sysctl.d/60-rke2-cis.conf
sudo systemctl restart systemd-sysctl
```

如果你的系统缺少 `systemd-sysctl.service` 和 `/etc/sysctl.d` 目录，您将需要通过在启动期间运行以下命令来确保在启动时应用 sysctl：

```bash
sysctl -p /usr/local/share/rke2/rke2-cis-sysctl.conf
```

在使用 RKE2 部署 Kubernetes 之前，请在新安装的主机上执行这一步骤。许多 Kubernetes 组件，包括 CNI 插件，都在设置自己的 sysctls。重启 `systemd-sysctl` 服务可能会产生意想不到的后果。

#### 创建 etcd 用户

在某些 Linux 发行版上，`useradd`命令不会创建一个组。下面的 `-U` 标志是为了说明这个问题。这个标志告诉 `useradd` 创建一个与用户同名的组。

```bash
useradd -r -c "etcd user" -s /sbin/nologin -M etcd -U
```

## Kubernetes 运行时要求

通过 CIS 基准的运行时要求主要是围绕 Pod 安全和网络策略。这些要求在本节中列出。

### PodSecurityPolicies

RKE2 在运行时总是打开 PodSecurityPolicy 接纳控制器。然而，当它不是以 cis-1.5 配置文件启动时，RKE2 将设置一个不受限制的策略，允许 Kubernetes 运行，就像 PodSecurityPolicy 接纳控制器没有启用一样。

当使用 cis-1.5 配置文件运行时，RKE2 将设置一套更严格的策略。这些策略符合 CIS 基准的第 5.2 节所述的要求。

:::note 注意：
Kubernetes 的控制平面组件和关键的附加组件，如 CNI、DNS 和 Ingress，是作为`kube-system`命名空间中的 pod 运行。因此，这个命名空间将有一个限制性较小的策略，以便这些组件能够正常运行。
:::

### 网络策略

当使用 cis-1.5 配置文件运行时，RKE2 将把网络策略放在适当的位置，以通过 Kubernetes 内置命名空间的 CIS 基准测试。这些命名空间是。`kube-system`、`kube-public`、`kube-node-lease`和`default`。

使用的 NetworkPolicy 将只允许同一命名空间内的 pod 互相访问。值得注意的例外是它允许解析 DNS 请求。。

:::note 注意：
对于创建的其他命名空间，操作者必须正常管理网络策略。
:::

## 已知问题

以下是 RKE2 目前不能通过的 case。每一个问题都将被解释，并说明是否可以通过人工操作的方式通过，或者是否会在未来的版本中解决。

## 结论

如果你遵循本指南，你的 RKE2 集群将被配置为通过 CIS Kubernetes 基准测试。你可以查看我们的 CIS 基准自我评估指南[v1.5](/docs/rke2/security/cis_self_assessment15/_index)或[v1.6](/docs/rke2/security/cis_self_assessment16/_index)，了解我们是如何验证每项基准的，以及你如何在你的集群上做同样的事情。
