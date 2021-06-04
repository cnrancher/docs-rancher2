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

更多关于根据 CIS 官方基准评估加固集群的细节，请参考 CIS 基准 Rancher 自我评估指南[v1.5](cis_self_assessment15/_index.md)或[v1.6](cis_self_assessment16/_index.md)。

RKE2 被设计为 "默认加固"，无需修改即可通过大部分 Kubernetes 的 CIS 控制。但有几个例外，需要人工干预才能完全通过 CIS 基准测试。

1. RKE2 不会修改主机操作系统。因此，你或操作者，必须做一些主机级的修改。
2. CIS 对 PodSecurityPolicies 和 NetworkPolicies 的某些策略控制将限制该集群的功能。你必须选择让 RKE2 配置这些开箱即用的功能。

为了帮助确保满足上述要求，RKE2 可以在启动时将 `profile` 标志设置为 `cis-1.5` 或 `cis-1.6`。这个标志通常做两件事：

1. 检查主机级要求是否已经满足。如果没有，RKE2 将退出，出现一个致命的错误，描述未满足的要求。
2. 配置运行时 Pod 安全策略和网络策略，允许集群通过相关控制。

> **注意：** 配置文件的标志唯一有效的值是 `cis-1.5` 或 `cis-1.6`。它接受一个字符串值，以便在未来允许其他配置文件。

以下部分概述了当 `profile` 标志被设置为 `cis-1.5` 或 `cis-1.6` 时的具体操作。

## 主机级的要求

主机级的要求有两个方面：内核参数和 etcd 进程/目录配置。这些都在本节中概述。

### 确保设置 `protect-kernel-defaults`

这是一个 kubelet 标志，如果所需的内核参数没有设置或设置的值与 kubelet 的默认值不同，将导致 kubelet 退出。

当`profile`标志被设置时，RKE2 将把该标志设置为 "true"。

> **注意：** `protect-kernel-defaults`被暴露为 RKE2 的一个顶级标志。如果你将`profile`设置为 "cis-1.x"，而将`protect-kernel-defaults`明确设置为 false，RKE2 将以错误退出。

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

#### 创建 etcd 用户

```bash
useradd -r -c "etcd user" -s /sbin/nologin -M etcd
```

## Kubernetes 运行时要求

通过 CIS 基准的运行时要求主要是围绕 Pod 安全和网络策略。这些要求在本节中列出。

### PodSecurityPolicies

RKE2 在运行时总是打开 PodSecurityPolicy 接纳控制器。然而，当它不是以 cis-1.5 配置文件启动时，RKE2 将设置一个不受限制的策略，允许 Kubernetes 运行，就像 PodSecurityPolicy 接纳控制器没有启用一样。

当使用 cis-1.5 配置文件运行时，RKE2 将设置一套更严格的策略。这些策略符合 CIS 基准的第 5.2 节所述的要求。

> **注意：** Kubernetes 的控制平面组件和关键的附加组件，如 CNI、DNS 和 Ingress，是作为`kube-system`命名空间中的 pod 运行。因此，这个命名空间将有一个限制性较小的策略，以便这些组件能够正常运行。

### 网络政策

当使用 cis-1.5 配置文件运行时，RKE2 将把网络政策放在适当的位置，以通过 Kubernetes 内置命名空间的 CIS 基准测试。这些命名空间是。`kube-system`、`kube-public`、`kube-node-lease`和`default`。

使用的 NetworkPolicy 将只允许同一命名空间内的 pod 互相访问。值得注意的例外是它允许解析 DNS 请求。。

> **注意：** 对于创建的其他命名空间，操作者必须正常管理网络策略。

## 已知问题

以下是 RKE2 目前不能通过的 case。每一个问题都将被解释，并说明是否可以通过人工操作的方式通过，或者是否会在未来的版本中解决。

### Control 3.2.1

确保建立一个最低限度的审计政策 (Scored)

Logging 是所有系统的一个重要检测控制，以检测潜在的未经授权的访问。

RKE2 支持通过传递`--profile=cis-1.5`来配置审计日志。它启用了一个默认策略，不记录任何东西。要配置一个自定义的策略，你应该向 RKE2 server 进程传递`--audit-policy-file`参数。这个参数指定了审计日志策略配置的路径。关于日志策略的更多信息，你可以查看[官方文档]（https://kubernetes.io/docs/tasks/debug-application-cluster/audit/#audit-policy）。

### Control 5.1.5

确保未主动使用默认服务帐户。(得分)

Kubernetes 提供了一个默认的服务账户，在没有为 pod 分配特定服务账户的集群工作负载中使用。

如果需要从 pod 访问 Kubernetes API，应该为该 pod 创建一个特定的服务账户，并为该服务账户授予权限。

默认的服务账户应该被配置为不提供服务账户令牌，也没有任何明确的权限分配。

这方面的补救措施是将每个命名空间中的 `default` 服务账户的 `automountServiceAccountToken` 字段更新为 `false`。

对于内置命名空间（`kube-system`、`kube-public`、`kube-node-lease`和`default`）中的`default`服务账户，RKE2 不会自动这样做。你可以手动更新这些服务账户的这个字段来传递控制。

对于包括`kube-system`、`kube-public`、`kube-node-lease`和`default`在内的每个命名空间，在标准的 RKE2 安装中，默认服务账户必须设置`automountServiceAccountToken: false`。

创建一个名为 `account_update.sh` 的 bash 脚本文件。请确保`chmod +x account_update.sh`，以便脚本有执行权限。

```bash
#!/bin/bash -e

for namespace in $(kubectl get namespaces -A -o json | jq -r '.items[].metadata.name'); do
    kubectl patch serviceaccount default -n ${namespace} -p 'automountServiceAccountToken: false'
done
```

## 结论

如果你遵循本指南，你的 RKE2 集群将被配置为通过 CIS Kubernetes 基准测试。你可以查看我们的 CIS 基准自我评估指南[v1.5](/docs/rke2/security/cis_self_assessment15/_index)或[v1.6](/docs/rke2/security/cis_self_assessment16/_index)，了解我们是如何验证每项基准的，以及你如何在你的集群上做同样的事情。
