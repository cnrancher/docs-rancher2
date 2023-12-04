---
title: Alertmanager 配置
---

通常没有必要直接编辑 Alertmanager 的自定义资源。对于大多数使用场景，你只需要编辑接收器和路由来配置通知。

当接收器和路由被更新时，监控应用程序将自动更新 Alertmanager 的自定义资源，使这些变化一致。

> 本节假设你已经熟悉监控组件如何协同工作。关于 Alertmanager 的更多信息，请参见[本节。](/docs/rancher2.5/monitoring-alerting/how-monitoring-works/_index#3-alertmanager-如何工作)

## 关于 Alertmanager 自定义资源

默认情况下，Rancher 监控将一个单一的 Alertmanager 部署到一个集群上，该集群使用默认的 Alertmanager Config Secret。

如果你想利用 Rancher UI 表单中没有暴露的高级选项，例如创建一个超过两层的路由树结构，你可能需要编辑 Alertmanager 自定义资源。

也可以在一个集群中创建一个以上的 Alertmanager，如果你想实现命名空间范围的监控，这是很有用的。在这种情况下，你应该使用相同的底层 Alertmanager Config Secret 来管理 Alertmanager 的自定义资源。

### 深度嵌套的路由

虽然 Rancher UI 只支持两层深度的路由树，但你可以通过编辑 Alertmanager YAML 来配置更多深度嵌套的路由结构。

### 多个 Alertmanager Replicas

作为 chart 部署选项的一部分，你可以选择增加部署在集群上的 Alertmanager 的副本数量。这些副本都可以使用相同的底层 Alertmanager Config Secret 来管理。

这个 Secret 应该在任何时候被更新或修改：

- 添加新的通知器或接收器
- 更改应该发送给特定通知者或接收者的告警
- 改变发送告警的组别

默认情况下，你可以选择提供一个现有的 Alertmanager Config Secret（即 `cattle-monitoring-system` 命名空间中的任何 Secret），或者允许 Rancher Monitoring 在你的集群中部署一个默认的 Alertmanager Config Secret。

默认情况下，Rancher 创建的 Alertmanager Config Secret 在升级或卸载 `rancher-monitoring` chart 时将不会被修改或删除。这个限制可以防止用户在 chart 上执行操作时丢失或改写他们的告警配置。

关于在 Alertmanager Config Secret 中可以指定哪些字段的更多信息，请看[Prometheus Alertmanager 文档.](https://prometheus.io/docs/alerting/latest/alertmanager/)

Alertmanager 配置文件的完整规格以及它所接收的内容可以在[这里查看。](https://prometheus.io/docs/alerting/latest/configuration/#configuration-file)
