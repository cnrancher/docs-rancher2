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

本文档为 RKE2 的生产安装提供了规范性的指导。它概述了应对互联网安全中心（CIS）的 Kubernetes 基准控制所需的配置和控制。

更多关于根据 CIS 官方基准评估加固集群的细节，请参考 CIS 基准 Rancher 自我评估指南 [v1.6](/docs/rke2/security/cis_self_assessment16/)。

RKE2 被设计为 "默认加固"，无需修改即可通过大部分 Kubernetes 的 CIS 控制。但有几个例外，需要人工干预才能完全通过 CIS 基准测试。

1. RKE2 不会修改主机操作系统。因此，你或操作者，必须做一些主机级的修改。
2. CIS 对 `PodSecurityPolicies` 和 `NetworkPolicies` 的某些策略控制将限制该集群的功能。你必须选择让 RKE2 配置这些开箱即用的功能。

为了帮助确保满足上述要求，RKE2 可以在启动时将 `profile` 标志设置为 `cis-1.6`。这个标志通常做两件事：

1. 检查主机级要求是否已经满足。如果没有，RKE2 将退出，出现一个致命的错误，描述未满足的要求。
2. 配置运行时 Pod 安全策略和网络策略，允许集群通过相关控制。

:::note 注意：
配置文件的标志唯一有效的值是 `cis-1.5` 或 `cis-1.6`。它接受一个字符串值，以便在未来允许其他配置文件。
:::

:::note 注意：
CIS v1.5（`cis-1.5`）的自我评估指南已从本文档中删除，因为该版本只适用于不再支持的 Kubernetes v1.15。然而，该配置文件在 RKE2 中仍然可用。
:::

以下部分概述了当 `profile` 标志被设置为 `cis-1.6` 时的具体操作。

## 主机级的要求

主机级的要求有两个方面：内核参数和 etcd 进程/目录配置。这些都在本节中概述。

### 确保设置 `protect-kernel-defaults`

这是一个 kubelet 标志，如果所需的内核参数没有设置或设置的值与 kubelet 的默认值不同，将导致 kubelet 退出。

当`profile`标志被设置时，RKE2 将把该标志设置为 `true`。

:::warning 注意：
`protect-kernel-defaults`被暴露为 RKE2 的一个顶级标志。如果你将`profile`设置为 "cis-1.x"，而将`protect-kernel-defaults`明确设置为 false，RKE2 将以错误退出。
:::

RKE2 也将检查与 kubelet 相同的内核参数，并按照与 kubelet 相同的规则以错误退出。这样做是为了方便操作者更快、更容易地识别哪些内核参数违反了 kubelet 的默认值。

### 确保 etcd 配置正确

CIS 基准测试要求 etcd 数据目录由`etcd`用户和组拥有。这隐含地要求 etcd 进程以主机级`etcd`用户的身份运行。为了实现这一点，RKE2 在以有效的 `cis-1.x` 配置文件启动时采取了几个步骤：

1. 检查主机上是否存在`etcd`用户和组。如果不存在，则以错误方式退出。
2. 创建 etcd 的数据目录，将 `etcd` 作为用户和组的所有者。
3. 通过适当设置 etcd 静态 pod 的 `SecurityContext`，确保 etcd 进程以 `etcd` 用户和组的身份运行。

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
sudo sysctl -p /usr/local/share/rke2/rke2-cis-sysctl.conf
```

在使用 RKE2 部署 Kubernetes 之前，请在新安装的主机上执行这一步骤。许多 Kubernetes 组件，包括 CNI 插件，都在设置自己的 sysctls。重启运行在 Kubernetes 集群上的 `systemd-sysctl` 服务可能会产生意想不到的后果。

#### 创建 etcd 用户

在某些 Linux 发行版上，`useradd`命令不会创建一个组。下面的 `-U` 标志是为了说明这个问题。这个标志告诉 `useradd` 创建一个与用户同名的组。

```bash
sudo useradd -r -c "etcd user" -s /sbin/nologin -M etcd -U
```

## Kubernetes 运行时要求

通过 CIS 基准的运行时要求主要是围绕 Pod 安全和网络策略。这些要求在本节中列出。

### PodSecurityPolicies

RKE2 在运行时总是打开 PodSecurityPolicy 接纳控制器。然而，当它不是以有效的 "cis-1.x" 配置文件启动时，RKE2 将设置一个不受限制的策略，允许 Kubernetes 运行，就像 PodSecurityPolicy 接纳控制器没有启用一样。

当使用有效的 "cis-1.x" 配置文件运行时，RKE2 将设置一套更严格的策略。这些策略符合 CIS 基准的第 5.2 节所述的要求。

:::note 注意：
Kubernetes 的控制平面组件和关键的附加组件，如 CNI、DNS 和 Ingress，是作为`kube-system`命名空间中的 pod 运行。因此，这个命名空间将有一个限制性较小的策略，以便这些组件能够正常运行。
:::

### NetworkPolicies

使用有效的 `cis-1.x` 配置文件运行时，RKE2 将设置 `NetworkPolicies` 以通过 Kubernetes 内置命名空间的 CIS Benchmark。这些命名空间是分别是 `kube-system`、`kube-public`、`kube-node-lease` 和 `default`。

使用的 `NetworkPolicy` 只允许同一命名空间内的 Pod 相互通信。一个例外情况是它允许解析 DNS 请求。

:::note 注意：
操作人员需要照常管理其他命名空间的网络策略。
:::

### 配置 default ServiceAccount

**将 `default` ServiceAccount 的 `automountServiceAccountToken` 设置为 `false`**

Kubernetes 为集群工作负载提供了一个 `default` ServiceAccount，但没有为 pod 分配特定 ServiceAccount 。如果需要从 pod 访问 Kubernetes API，则需要为该 pod 创建一个特定的 ServiceAccount 并授予权限。你还需要配置 `default`  ServiceAccount，使其不提供 ServiceAccount 令牌并且没有任何显式的权限分配。

对于标准 RKE2 中的每个命名空间（包括 `default` 和 `kube-system`），`default` ServiceAccount 必须包含以下值：

```yaml
automountServiceAccountToken: false
```

对于集群操作人员创建的命名空间，你可以使用以下脚本和配置文件来配置 `default` ServiceAccount。

请将下面的配置保存到名为 `account_update.yaml` 的文件中：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: default
automountServiceAccountToken: false
```

创建一个名为 `account_update.sh` 的 bash 脚本文件。确保为脚本设置了 `sudo chmod +x account_update.sh`，使脚本具有执行权限：

```bash
#!/bin/bash -e

for namespace in $(kubectl get namespaces -A -o=jsonpath="{.items[*]['metadata.name']}"); do
  echo -n "Patching namespace $namespace - "
  kubectl patch serviceaccount default -n ${namespace} -p "$(cat account_update.yaml)"
done
```

执行此脚本，将 `account_update.yaml` 配置应用到所有命名空间中的 `default` ServiceAccount。

### API Server 审计配置

CIS 1.2.22 到 1.2.25 要求为 API Server 配置审计日志。如果 RKE2 在 `profile` 标志设置为 `cis-1.6` 的情况下启动，它会自动在 API Server 中配置强化的 `--audit-log-` 参数来通过这些 CIS 检查。

RKE2 的默认审计策略不会在 API Server 中记录请求。这样，集群操作人员就能灵活地定制符合其审计要求和需求的审计策略，从而满足不同用户的不同环境和策略需求。

如果启动时 `profile` 标志设置为 `cis-1.6`，RKE2 会创建默认审计策略。该策略在 `/etc/rancher/rke2/audit-policy.yaml` 中定义。

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
metadata:
  creationTimestamp: null
rules:
- level: None
```

要开始记录对 API Server 的请求，你至少必须修改 `level` 参数，例如将其修改为 `Metadata`。有关 API Server 策略配置的详细信息，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)。

调整审计策略后，RKE2 必须重新启动才能加载新配置。

```shell
sudo systemctl restart rke2-server.service
```

API Server 审计日志将写入 `/var/lib/rancher/rke2/server/logs/audit.log`。

## 已知问题

以下是 RKE2 目前没有通过的管控。此处将解释各个差距，以及这些差距是否可以通过手动干预或在未来的版本中解决。

### 管控  1.1.12
确保 etcd 数据目录所有权设置为 `etcd:etcd`

**原因**
etcd 是 Kubernetes deployment 使用的高可用键值存储，用于持久存储其所有 REST API 对象。你需要保护此数据目录，避免任何未经授权的读取或写入。它的所有者应该是 `etcd:etcd`。

**修正措施**
创建如上所述的 `etcd` 用户和组。

### 管控 5.1.5
确保未主动使用默认 ServiceAccount

**原因**：Kubernetes 为集群工作负载提供了一个 `default` ServiceAccount，但没有为 pod 分配特定 ServiceAccount 。

如果需要从 pod 访问 Kubernetes API，则需要为该 pod 创建一个特定的 ServiceAccount 并授予权限。

你还需要配置 `default` ServiceAccount，使其不提供 ServiceAccount 令牌并且没有任何显式的权限分配。

可以通过将每个命名空间中 `default` ServiceAccount 的 `automountServiceAccountToken` 字段更新为 `false` 来解决此问题。

**修正措施**
手动更新集群中服务账户上的此字段。

### 管控 5.3.2
确保所有命名空间都定义了网络策略

**原因**
如果你在同一个 Kubernetes 集群上运行不同的应用程序，被感染的应用程序可能会攻击相邻的应用程序。要确保容器只进行所需的通信，网络分段非常重要。网络策略指的是如何允许 Pod 与其他 Pod 以及与其他网络端点进行通信。

网络策略是命名空间范围的。为某个命名空间配置网络策略后，该策略不允许的所有其他流量都会被拒绝。但是，如果命名空间没有配置网络策略，则所有流量都会允许进出该命名空间中的 Pod。

**修正措施**
在 RKE2 模板配置文件 `/etc/rancher/rke2/config.yaml` 中设置 `profile: "cis-1.6"`。你可以在下方找到示例。

## RKE2 配置

以下是强化 RKE2 以通过 Rancher 中可用的 CIS v1.6 强化配置文件 `rke2-cis-1.6-profile-hardened` 所需的最低配置。

```yaml
secrets-encryption: "true"
profile: "cis-1.6"           # CIS 4.2.6, 5.2.1, 5.2.8, 5.2.9, 5.3.2
```

配置文件必须命名为 `config.yaml` 并放在 `/etc/rancher/rke2` 中。该目录需要在安装 RKE2 之前创建。

## 结论

如果你遵循本指南，你的 RKE2 集群将被配置为通过 CIS Kubernetes 基准测试。你可以查看我们的 CIS 基准自我评估指南[v1.6](/docs/rke2/security/cis_self_assessment16/)，了解我们是如何验证每项基准的，以及你如何在你的集群上做同样的事情。
