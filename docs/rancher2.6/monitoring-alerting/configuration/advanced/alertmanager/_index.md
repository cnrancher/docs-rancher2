---
title: Alertmanager 配置
weight: 1
---

通常情况下，你不需要直接编辑 Alertmanager 自定义资源。对于大多数用例，只需要编辑接收器和路由即可配置通知。

当路由和接收器更新时，Monitoring 应用将自动更新 Alertmanager 自定义资源来与这些更改保持一致。

> 本节参考假设你已经熟悉 Monitoring 组件的协同工作方式。有关 Alertmanager 的详细信息，请参阅[本节](../../../how-monitoring-works/#3-how-alertmanager-works)。

## 关于 Alertmanager 自定义资源

默认情况下，Rancher Monitoring 将单个 Alertmanager 部署到使用默认 Alertmanager Config Secret 的集群上。

如果你想使用 Rancher UI 表单中未公开的高级选项（例如创建超过两层深的路由树结构），你可能需要编辑 Alertmanager 自定义资源。

你也可以在集群中创建多个 Alertmanager 来实现命名空间范围的监控。在这种情况下，你应该使用相同的底层 Alertmanager Config Secret 来管理 Alertmanager 自定义资源。

### 深度嵌套的路由

虽然 Rancher UI 仅支持两层深度的路由树，但你可以通过编辑 Alertmanager YAML 来配置更深的嵌套路由结构。

### 多个 Alertmanager 副本

作为 Chart 部署选项的一部分，你可以选择增加部署到集群上的 Alertmanager 副本的数量。这些副本使用相同的底层 Alertmanager Config Secret 进行管理。

此 Secret 可以按照你的需求随时更新或修改：

- 添加新的通知程序或接收器
- 更改应该发送给指定通知程序或接收器的告警
- 更改发出的告警组

默认情况下，你可以选择提供现有的 Alertmanager Config Secret（即 `cattle-monitoring-system` 命名空间中的任何 Secret），或允许 Rancher Monitoring 将默认的 Alertmanager Config Secret 部署到你的集群上。

默认情况下，在升级或卸载 `rancher-monitoring` Chart 时，Rancher 创建的 Alertmanager Config Secret 不会被修改或删除。这个限制可以防止用户在 Chart 上执行操作时丢失或覆盖他们的告警配置。

有关可以在 Alertmanager Config Secret 中指定的字段的更多信息，请查看 [Prometheus Alertmanager 文档](https://prometheus.io/docs/alerting/latest/alertmanager/)。

你可以在[此处](https://prometheus.io/docs/alerting/latest/configuration/#configuration-file)找到 Alertmanager 配置文件的完整规范及其内容。