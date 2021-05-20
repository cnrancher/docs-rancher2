---
title: Windows集群监控和告警
description: description
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
  - 监控和告警
  - rancher2.5
  - Windows集群监控和告警
---

从 V2.5.8 版起可用\_

从监控 V2 14.5.100 开始（在 Rancher 2.5.8 中默认使用），监控 V2 现在可以部署在 Windows 集群上，并将使用[prometheus-community/windows_exporter](https://github.com/prometheus-community/windows_exporter)（之前名为`wmi_exporter`）从 Windows 节点刮取指标。

- [与监控 V1 比较](#comparison-to-monitoring-v1)
- [集群要求](#cluster-requirements)
  - [将现有集群升级到 wins v0.1.0](#upgrading-existing-clusters to-wins-v0-1-0)

##与监控 V1 的比较

与 Monitoring V1 for Windows 不同的是，根据上游从 "wmi*exporter "到 "windows_exporter "的命名变化，"windows_exporter "收集的指标将被标注为 "windows*"而不是 "wmi\_"。

此外，Monitoring V2 for Windows 将不再要求用户在 Windows 主机上保持 9796 端口开放，因为主机指标将直接发布到 windows-exporter Pod 上的端口。这个功能是由`wins` v0.1.0 最近做出的修改提供的，以支持在 Pod 上发布暴露在 hostNetwork 上的端口，这些 Pod 使用 wins 来运行一个有特权的 Windows 二进制文件作为主机进程。

## 集群要求

Windows 的监控 V2 只能从 Windows 主机上刮取指标，这些主机的最小`wins`版本为 v0.1.0。为了能够完全部署 Monitoring V2 for Windows，你的所有主机必须满足这个要求。

如果你在 Rancher 2.5.8 中配置一个新的 RKE1 集群，你的集群应该已经满足这个要求。

###将现有集群升级到 wins v0.1.0

如果集群是在 Rancher 2.5.8 之前配置的（即使当前的 Rancher 版本是 2.5.8），在你将每台主机上的 wins 版本升级到至少 v0.1.0 之前，你将无法成功部署 Windows 的监控 V2。

为了促进这一升级，Rancher 2.5.8 发布了一个全新的 Helm 图，名为`rancher-wins-upgrader`。

> **前提条件：**确保 Windows 的监控 V1 已卸载。

1. 部署`rancher-wins-upgrader`，使用以下覆盖。

   ```yaml
   # Masquerading 通过以下方式引导 wins-upgrader 的安装
   # 一个先前的白名单进程路径，因为正常的安装路径。
   # c:\etc\rancher\wins\wins-upgrade.exe 通常不是白名单。
   # 在这种情况下，我们使用之前的白名单进程
   # Monitoring V1 使用的路径。
   masquerade:
   enabled: true
   as: c:\\etc\wmi-exporter\wmi-exporter.exe
   ```

   > **非默认 Windows 前缀路径的注意事项：**如果你用`cluster.yml`设置的 RKE 集群有一个非默认的`win_prefix_path`，你将需要用你的前缀路径来更新`masquerade.as`字段，以代替`c:\``。
   >
   > 例如，如果你有`win_prefix_path: 'c:\host\opt\'，那么你需要设置`as: c:\host\opt\etc\wmi-exporter\wmi-exporter.exe`。

   ```

   ```

2. 一旦你的所有主机都成功升级，请确保你再次以默认值部署 Helm 图表，以避免与以下设置冲突。
   `yaml masquerade: enabled: false`。
   **结果：**主机已准备好安装监控 V2。你可以选择卸载`rancher-wins-upgrader`图表，或将其保留在集群中以方便将来的升级。

关于如何使用它的更多信息，请参见图表的[README.md](https://github.com/rancher/wins/blob/master/charts/rancher-wins-upgrader/README.md)。
