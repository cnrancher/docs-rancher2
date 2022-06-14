---
title: rancher-logging Helm Chart 选项
shortTitle: Helm Chart 选项
weight: 4
---

- [启用/禁用 Windows 节点 Logging](#enable-disable-windows-node-logging)
- [使用自定义 Docker 根目录](#working-with-a-custom-docker-root-directory)
- [为自定义污点添加 NodeSelector 设置和容忍度](#adding-nodeselector-settings-and-tolerations-for-custom-taints)
- [启用 Logging 应用程序以使用 SELinux](#enabling-the-logging-application-to-work-with-selinux)
- [其他日志记录源](#additional-logging-sources)
- [Systemd 配置](#systemd-configuration)

### 启用/禁用 Windows 节点 Logging

要启用或禁用 Windows 节点 Logging，你可以在 `values.yaml` 中将 `global.cattle.windows.enabled` 设置为 `true` 或 `false`。

默认情况下，如果使用 Cluster Dashboard UI 在 Windows 集群上安装了 Logging 应用程序，Windows 节点的 Logging 就会启用。

在这种情况下，将 `global.cattle.windows.enabled` 设置为 `false` 会禁用集群上的 Windows 节点 Logging。
禁用后，仍会从 Windows 集群中的 Linux 节点收集日志。

> 注意：目前存在一个[问题](https://github.com/rancher/rancher/issues/32325)，在 Windows 集群中禁用 Windows Logging 后执行 `helm upgrade` 时不会删除 Windows nodeAgent。在这种情况下，如果已安装 Windows nodeAgents，用户可能需要手动卸载它们。

### 使用自定义 Docker 根目录

如果使用了自定义 Docker 根目录，你可以在 `values.yaml` 中设置 `global.dockerRootDirectory`。

这将确保创建的 Logging CR 使用你指定的路径，而不是使用默认的 Docker `data-root` 位置。

请注意，这只影响 Linux 节点。

如果集群中有任何 Windows 节点，则更改将不适用于这些节点。

### 为自定义污点添加 NodeSelector 设置和容忍度

你可以添加 `nodeSelector` 设置，并通过编辑 Logging Helm Chart 值来添加其他`容忍度`。有关详细信息，请参阅[此页面](../taints-tolerations)。

### 启用 Logging 应用程序以使用 SELinux

> **要求**：Logging v2 已在 RHEL/CentOS 7 和 8 上使用 SELinux 进行了测试。

[安全增强型 Linux (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux) 是对 Linux 的安全增强。被政府机构使用之后，SELinux 已成为行业标准，并在 CentOS 7 和 8 上默认启用。

要配合使用 Logging v2 与 SELinux，我们建议你根据[此页面]({{<baseurl>}}/rancher/v2.6/en/security/selinux/#installing-the-rancher-selinux-rpm)的安装说明安装 `rancher-selinux` RPM。

然后，在安装 Logging 应用程序时，在 `values.yaml` 中将 `global.seLinux.enabled` 更改为 `true`，使 Chart 支持 SELinux。

### 其他日志来源

默认情况下，Rancher 会收集所有类型集群的 [control plane 组件](https://kubernetes.io/docs/concepts/overview/components/#control-plane-components)和[节点组件](https://kubernetes.io/docs/concepts/overview/components/#node-components)的日志。

在某些情况下，Rancher 也能收集其他的日志。

下表总结了每种节点类型可以收集的其他日志来源：

| 日志来源 | Linux 节点（包括在 Windows 集群中） | Windows 节点 |
| --- | --- | ---|
| RKE | ✓ | ✓ |
| RKE2 | ✓ | |
| K3s | ✓ | |
| AKS | ✓ | |
| EKS | ✓ | |
| GKE | ✓ | |

要将托管 Kubernetes 的提供商作为额外的日志来源，在安装或升级 Logging Helm Chart 时，请启用 **Enable enhanced cloud provider logging** 选项。

启用后，Rancher 会收集提供商开放可用的所有其他节点和 control plane 日志，不同提供商可能有所不同。

如果你已经使用了云提供商的日志解决方案，例如 AWS CloudWatch 或 Google Cloud Operations Suite（以前称为 Stackdriver），由于原生解决方案可以不受限制地访问所有日志，因此你无需启用此选项。

### Systemd 配置

在 Rancher Logging 中，你必须为 K3s 和 RKE2 Kubernetes 发行版配置 `SystemdLogPath`。

K3s 和 RKE2 Kubernetes 发行版将日志写入到 journald，它是 systemd 的子系统，用于日志记录。要收集这些日志，你需要定义 `systemdLogPath`。默认路径是 `run/log/journal`，但某些 Linux 发行版不默认使用该路径。例如，Ubuntu 默认使用 `var/log/journal`。要确定你的 `systemdLogPath` 配置，请参阅以下步骤。

**Systemd 配置步骤：**

* 在其中一个节点上运行 `cat /etc/systemd/journald.conf | grep -E ^\#?Storage | cut -d"=" -f2`。
* 如果返回 `persistent`，则你的 `systemdLogPath` 是 `/var/log/journal`。
* 如果返回 `volatile`，则你的 `systemdLogPath` 是 `/run/log/journal`。
* 如果返回 `auto`，则检查 `/var/log/journal` 是否存在。
   * 如果 `/var/log/journal` 存在，则使用 `/var/log/journal`。
   * 如果 `/var/log/journal` 不存在，则使用 `/run/log/journal`。

> **注意**：如果返回的值不包括在上述描述中，Rancher Logging 将无法收集 control plane 日志。要解决此问题，你需要在每个 control plane 节点上执行以下操作。

> * 在 journald.conf 中设置 `Storage=volatile`。
> * 重启机器。
> * 将 `systemdLogPath` 设置为 `/run/log/journal`。