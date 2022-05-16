---
title: Monitoring V2 的 Windows 集群支持
shortTitle: Windows 支持
weight: 5
---

_从 v2.5.8 起可用_

从 Monitoring V2 14.5.100（Rancher 2.5.8 的默认版本）开始，Monitoring V2 可以部署在 Windows 集群上，并将使用 [prometheus-community/windows_exporter](https://github.com/prometheus-community/windows_exporter)（旧名是 `wmi_exporter`）来抓取 Windows 节点的指标。

- [与 Monitoring V1 的对比](#comparison-to-monitoring-v1)
- [集群要求](#cluster-requirements)
   - [将现有集群升级到 wins v0.1.0](#upgrading-existing-clusters-to-wins-v0-1-0)

## 与 Monitoring V1 的对比

由于命名已根据上游从 `wmi_exporter` 更改为 `windows_exporter`，因此 `windows_exporter` 收集的指标会标记为 `windows_` 而不是 `wmi_`。

此外，由于主机指标将直接发布到暴露在 windows-exporter Pod 上的端口上，因此 Monitoring V2 for Windows 将不再要求用户在 Windows 主机上保持打开端口 9796。此功能由 `wins` v0.1.0 最近的更改提供，以支持在 Pod 上发布暴露在 hostNetwork 上的端口，这些 Pod 使用 wins 来运行一个有特权的 Windows 二进制文件作为主机进程。

## 集群要求

Monitoring V2 for Windows 只能从最低是 `wins` v0.1.0 的 Windows 主机中抓取指标。要完全部署 Monitoring V2 for Windows，你的所有主机都必须满足此要求。

如果你在 Rancher 2.5.8 中配置新的 RKE1 集群，你的集群应该已经满足此要求。

### 将现有集群升级到 wins v0.1.0

如果集群是在 Rancher 2.5.8 之前配置的（即使当前 Rancher 版本是 2.5.8），你将无法成功部署 Monitoring V2 for Windows，除非你将每台主机的 wins 版本升级到 v0.1.0 或以上版本。

为了方便此次升级，Rancher 2.5.8 发布了一个全新的 Helm Chart，名为 `rancher-wins-upgrader`。

> **先决条件**：确保已卸载 Monitoring V1 for Windows。

1. 使用以下覆盖部署 `rancher-wins-upgrader`：
   ```yaml
   # 通过先前已列入白名单的进程路径
   # 来引导 win-upgrader 安装，这是因为正常安装路径
   # c:\\etc\\rancher\\wins\\wins-upgrade.exe 通常不会被列入白名单。
   # 因此，我们使用 Monitoring V1 之前所用的
   # 已列入白名单的进程路径。
   masquerade:
     enabled: true
     as: c:\\etc\wmi-exporter\wmi-exporter.exe
   ```
   > **非默认 Windows 前缀路径注意事项**：如果你使用具有非默认 `win_prefix_path` 的 `cluster.yml` 来设置 RKE 集群，你需要将 `c:\\` 替换为你的前缀路径字段的值来修改 `masquerade.as`。
   >
   > 例如，如果你使用 `win_prefix_path: 'c:\host\opt\'`，则需要设置为 `as: c:\host\opt\etc\wmi-exporter\wmi-exporter.exe`。
2. 成功升级所有主机后，请再次使用默认值部署 Helm Chart，以避免与以下设置发生冲突：
   ```yaml
   masquerade:
     enabled: false
   ```

**结果**：主机已准备好安装 Monitoring V2。你可以选择卸载 `rancher-wins-upgrader` Chart，或将其保留在集群中以方便将来升级。

有关如何使用它的更多信息，请参阅 Chart 的 [README.md](https://github.com/rancher/wins/blob/master/charts/rancher-wins-upgrader/README.md)。
