---
title: 卸载监控
---

1. 从**集群资源管理器中，**点击 **应用和市场。**
1. 单击**已安装的应用程序**。
1. 进入 `cattle-monitoring-system` 命名空间，勾选 `rancher-monitoring-crd` 和 `rancher-monitoring`。
1. 单击**删除**。
1. 确认**删除**。

**结果：** `rancher-monitoring`被卸载。

> **关于持久化 Grafana 仪表盘的注意事项：**对于使用 Monitoring V2 v9.4.203 或以下版本的用户，卸载 Monitoring chart 将删除 cattle-dashboards 命名空间，这将删除所有持久化的仪表盘，除非该命名空间被标记为注释 `helm.sh/resource-policy: "keep"`。这个注释在 Monitoring V2 v14.5.100+中是默认添加的，但是如果你的集群中目前安装了旧版本的监控 chart，可以在卸载前手动应用在 cattle-dashboards 命名空间上。
