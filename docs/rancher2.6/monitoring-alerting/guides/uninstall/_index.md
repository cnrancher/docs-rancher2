---
title: 卸载 Monitoring
weight: 2
---

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 在左侧导航栏中，点击**应用 & 应用市场**。
1. 点击**已安装的应用**。
1. 转到 `cattle-monitoring-system` 命名空间并选中 `rancher-monitoring-crd` 和 `rancher-monitoring`。
1. 单击**删除**。
1. 确认**删除**。

**结果**：已卸载 `rancher-monitoring`。

> **持久化 Grafana 仪表板注意事项**：如果你的 Monitoring V2 版本是 v9.4.203 或更低版本，卸载 Monitoring chart 将同时删除 cattle-dashboards 命名空间，所有持久化的仪表板将被删除（除非命名空间带有注释 `helm.sh/resource-policy: "keep"`）。Monitoring V2 v14.5.100+ 会默认添加此注释。但如果你的集群上安装了旧版本的 Monitoring Chart，你可以在卸载它之前手动将注释应用到 cattle-dashboards 命名空间。