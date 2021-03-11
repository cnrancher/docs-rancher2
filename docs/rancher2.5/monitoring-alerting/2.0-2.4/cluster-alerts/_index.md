---
title: 配置告警
description: 为了保证集群和应用程序的健康，提高组织的生产力，您需要随时了解集群和项目里计划内和计划外发生的事件。发生事件时，将触发您的告警，并向您发送通知。然后，您可以根据需要采取应对措施。通知和告警功能是基于 Prometheus Alertmanager实现的。利用这些工具，Rancher 可以通知集群所有者和项目所有者有需要处理的告警。在接收告警之前，必须在 Rancher 中配置一个或多个通知接收者。创建集群时，Rancher 已经配置了一些内置的告警规则。为它们配置接收者后就能收到相应告警。
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
  - 集群管理员指南
  - 集群访问控制
  - 告警
  - 配置告警
---

在 Rancher 2.5 中，监控应用得到了改进。现在有两种方式来启用监控和警报。旧的方式在本节中进行了记录，新的监控和警报应用在[这里](/docs/rancher2.5/monitoring-alerting/2.5/_index)中进行了记录。

为了保证集群和应用程序的健康，提高组织的生产力，您需要随时了解集群和项目里计划内和计划外发生的事件。发生事件时，将触发您的告警，并向您发送通知。然后，您可以根据需要采取应对措施。

通知和告警功能是基于 [Prometheus Alertmanager](https://prometheus.io/docs/alerting/alertmanager/) 的。利用这些工具，Rancher 可以通知[集群所有者](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/_index)和[项目所有者](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/_index)有需要处理的告警。

在接收告警之前，必须在 Rancher 中配置一个或多个通知接收者。

创建集群时，Rancher 已经配置了一些内置的告警规则。为它们配置[接收者](/docs/rancher2.5/monitoring-alerting/2.0-2.4/notifiers/_index)后就能收到相应告警。

有关触发内置告警的详细信息，请参阅[内置告警](/docs/rancher2.5/monitoring-alerting/2.0-2.4/cluster-alerts/default-alerts/_index)。

## 告警示例

- Kubernetes 组件进入不健康状态。
- 节点或者[工作负载](/docs/rancher2.5/k8s-in-rancher/workloads/_index)发生错误。
- 部署可以正常被调度。
- 节点的硬件资源过分紧张。

## Prometheus 表达式

> **先决条件：** 监控必须被[启用](/docs/rancher2.5/cluster-admin/tools/monitoring/_index)，您才能使用自定义 Prometheus 查询或表达式触发告警。

当您编辑告警规则时，您将有机会根据 Prometheus 表达式配置要触发的告警。有关表达式的示例，请参考[本页](/docs/rancher2.5/monitoring-alerting/2.0-2.4/cluster-monitoring/expression/_index)。

## 紧急程度

您可以为每个告警设置紧急程度。您收到的通知中会包含紧急程度，可帮助您决定响应操作的优先级。例如，如果您配置了告警以通知您例行部署，无需执行任何操作。这些告警可以设置为低优先级。但是，如果部署失败，将严重影响您的组织，需要您快速做出反应。所以需要为这些告警配置高优先级。

## 告警层级

告警包含集群级别和[项目级别](/docs/rancher2.5/project-admin/tools/alerts/_index)告警

在集群级别，Rancher 监控 Kubernetes 集群中的组件，并向您发送与以下内容有关的告警：

- 节点状态
- 管理 Kubernetes 集群的系统组件
- 对应 Kubernetes 资源发生的事件
- Prometheus 表达式越过阈值

## 添加一个集群级别的告警

作为[集群所有者](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/_index)，您可以配置 Rancher 向您发送有关集群事件的告警。

> **前提：** 在收到集群告警之前，您必须[添加接收者](/docs/rancher2.5/monitoring-alerting/2.0-2.4/notifiers/_index)。

1. 从 **全局** 视图，进入您需要配置告警的集群。选择 **工具 > 告警**。然后单击 **添加告警组**。

1. 输入 **名称** 及本条告警的描述，您可以将告警按照不同目的分组。

1. 根据您要创建的告警类型，查看以下对应操作。

   - 系统组件告警

     此告警类型监控 Kubernetes 系统组件状态，无论组件在哪个节点上。

     1. 选择 **系统服务** 选项，然后从下拉列表中选择一个选项。

        - [controller-manager](https://kubernetes.io/docs/concepts/overview/components/#kube-controller-manager)
        - [etcd](https://kubernetes.io/docs/concepts/overview/components/#etcd)
        - [scheduler](https://kubernetes.io/docs/concepts/overview/components/#kube-scheduler)

     1. 选择告警的紧急程度。选项包括：

        - **危险**：最紧急
        - **告警**：正常紧急
        - **信息**：最不紧急

        根据服务的重要性以及在集群中担任角色的节点数，选择紧急级别。例如，如果您要为`etcd`服务发出告警，请选择**危险**。如果您要提醒冗余调度程序，则**告警**更合适。

     1. 配置高级选项。默认情况下，以下选项将应用于组中的所有告警规则。您也可以在配置每一条规则时禁用继承来自告警组的高级选项配置，自定义每条规则的高级选项配置。

        - **告警组等待时长：** 第一次发送告警信息前，等待时间，默认为 30 秒。
        - **告警组间隔时长：** 在发送了第一次的告警之后有新告警产生时，等待是否有告警触发，经过这个时间后，可以把这段时间的告警批量发送给接受者，默认为 3 分钟。
        - **重复间隔：** 发送两条相同的告警之间的时间间隔，默认为 1 小时。

   - 资源事件告警

     此告警类型监控指定资源类型上发生的事件。

     1. 选择触发告警的事件的类型。选项包括：

        - **正常**: 在对应资源发生正常事件时触发告警
        - **告警**: 在对应资源发生告警事件时触发告警

     1. 从**选择资源**下拉列表中选择要触发告警的资源类型

        - [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
        - [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
        - [Node](https://kubernetes.io/docs/concepts/architecture/nodes/)
        - [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/)
        - [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

     1. 选择告警的紧急程度。选项包括：

        - **危险**: 最紧急
        - **告警**: 正常紧急
        - **信息**: 最不紧急

        通过考虑事件发生的频率或其重要性等因素来选择告警的紧急程度。例如：

        - 如果您为 Pod 设置了常规告警，则您可能会经常收到告警，并且 Pod 通常会自愈，因此，请选择**信息**作为紧急程度
        - 如果 StatefulSets 无法工作，则很可能无法自愈，因此，请选择**危险**作为紧急程度。

     1. 配置高级选项。默认情况下，以下选项将应用于组中的所有告警规则。您也可以在配置每一条规则时禁用继承来自告警组的高级选项配置，自定义每条规则的高级选项配置。

        - **告警组等待时长：** 第一次发送告警信息前，等待时间，默认为 30 秒。
        - **告警组间隔时长：** 在发送了第一次的告警之后有新告警产生时，等待是否有告警触发，经过这个时间后，可以把这段时间的告警批量发送给接受者，默认为 3 分钟。
        - **重复间隔：** 发送两条相同的告警之间的时间间隔，默认为 1 小时。

   - 节点告警

     此告警类型监控特定节点的情况。

     1. 选择**节点**选项，然后从**选择节点**下拉列表中选择。

     1. 选择触发告警的情况。

        - **未就绪**: 当节点无响应时发送告警。
        - **CPU 使用率**: 当节点的 CPU 分配超出所输入的百分比时发送告警。
        - **内存使用率**: 当节点的内存分配百分比提高到输入百分比以上时发送告警。

     1. 选择告警的紧急程度。选项包括：

        - **危险**: 最紧急
        - **告警**: 正常紧急
        - **信息**: 最不紧急

        根据告警对操作的影响来选择告警的紧急程度。例如，当节点的 CPU 提升到 60％以上时触发的告警，则认为紧急程度为**信息**，而节点为**未就绪**的节点则认为紧急程度为**危险**。

     1. 配置高级选项。默认情况下，以下选项将应用于组中的所有告警规则。您也可以在配置每一条规则时禁用继承来自告警组的高级选项配置，自定义每条规则的高级选项配置。

        - **告警组等待时长：** 第一次发送告警信息前，等待时间，默认为 30 秒。
        - **告警组间隔时长：** 在发送了第一次的告警之后有新告警产生时，等待是否有告警触发，经过这个时间后，可以把这段时间的告警批量发送给接受者，默认为 3 分钟。
        - **重复间隔：** 发送两条相同的告警之间的时间间隔，默认为 1 小时。

   - 节点选择器告警

     此告警类型监视在带有对应标签的任何节点的情况。详情参见 Kubernetes 文档中的[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)。

     1. 选择**节点选择器**选项，然后单击**添加选择器**以输入标签的键值对。该标签应用于一个或多个节点。可以添加任意数量的选择器。

     1. 选择触发告警的情况。

        - **未就绪**: 当节点无响应时发送告警。
        - **CPU 使用率**: 当节点的 CPU 分配超出所输入的百分比时发送告警。
        - **内存使用率**: 当节点的内存分配百分比提高到输入百分比以上时发送告警。

     1. 选择告警的紧急程度。选项包括：

        - **危险**: 最紧急
        - **告警**: 正常紧急
        - **信息**: 最不紧急

        根据告警对操作的影响来选择告警的紧急程度。例如，当节点的 CPU 提升到 60％以上时触发的告警，则认为紧急程度为**信息**，而节点为**未就绪**的节点则认为紧急程度为**危险**。

     1. 配置高级选项。默认情况下，以下选项将应用于组中的所有告警规则。您也可以在配置每一条规则时禁用继承来自告警组的高级选项配置，自定义每条规则的高级选项配置。

        - **告警组等待时长：** 第一次发送告警信息前，等待时间，默认为 30 秒。
        - **告警组间隔时长：** 在发送了第一次的告警之后有新告警产生时，等待是否有告警触发，经过这个时间后，可以把这段时间的告警批量发送给接受者，默认为 3 分钟。
        - **重复间隔：** 发送两条相同的告警之间的时间间隔，默认为 1 小时。

   - 表达式告警

     此告警类型监控 Prometheus 表达式执行结果是否超过阈值，此功能需要启动监控。

     1. 输入或选择一个**表达式**，下拉列表显示 Prometheus 的原始指标表达式，包括：

        - [**节点**](https://github.com/prometheus/node_exporter)
        - [**容器**](https://github.com/google/cadvisor)
        - [**ETCD**](https://etcd.io/docs/v3.4.0/op-guide/monitoring/)
        - [**Kubernetes 组件**](https://github.com/kubernetes/metrics)
        - [**Kubernetes 资源**](https://github.com/kubernetes/kube-state-metrics)
        - [**Fluentd**](https://docs.fluentd.org/v1.0/articles/monitoring-prometheus) ([日志](/docs/rancher2.5/logging/2.0.x-2.4.x/project-logging/_index)中用到的)
        - [**集群级别 Grafana**](https://grafana.com/docs/grafana/latest/administration/view-server/internal-metrics/#internal-grafana-metrics)
        - **集群级别 Prometheus**

     1. 选择 **对比**.

        - **等于**: 当表达式值等于阈值时触发告警。
        - **不等于**: 当表达式值不等于阈值时触发告警。
        - **大于**: 当表达式值大于阈值时触发告警。
        - **小于**: 当表达式值等于或小于阈值时触发告警。
        - **大于或等于**: 当表达式值大于等于阈值时触发告警。
        - **大小于或等于**: 当表达式值小于或等于阈值时触发告警。

     1. 输入 **阈值**，用于在表达式值超过阈值时触发告警。

     1. 选择一个持续时间，表达式值超过阈值持续时长达到配置时触发告警。

     1. 选择告警的紧急程度。选项包括：

        - **危险**: 最紧急
        - **告警**: 正常紧急
        - **信息**: 最不紧急

        根据告警对操作的影响来选择告警的紧急级别。例如，当节点的负载表达式 `sum(node_load5) / count(node_cpu_seconds_total{mode="system"})` 超过 0.6 时触发 **信息**级别告警，但是超过 1 时触发**危险**级别的告警。

     1. 配置高级选项。默认情况下，以下选项将应用于组中的所有告警规则。您也可以在配置每一条规则时禁用继承来自告警组的高级选项配置，自定义每条规则的高级选项配置。

        - **告警组等待时长：** 第一次发送告警信息前，等待时间，默认为 30 秒。
        - **告警组间隔时长：** 在发送了第一次的告警之后有新告警产生时，等待是否有告警触发，经过这个时间后，可以把这段时间的告警批量发送给接受者，默认为 3 分钟。
        - **重复间隔：** 发送两条相同的告警之间的时间间隔，默认为 1 小时。

1. 继续向该组添加更多的**告警规则**。

1. 最后，选择[接收者](/docs/rancher2.5/monitoring-alerting/2.0-2.4/notifiers/_index)。

   - 您可以设置多个接收者。
   - 您可以更改接收者的收件人。

**结果：** 您的告警已配置。触发告警时发送通知。

## 管理集群告警

设置集群告警后，可以管理每个告警对象。要管理告警，进入对应的集群，然后选择**工具>告警**。您可以：

- 停用/激活告警
- 编辑告警配置
- 删除不必要的告警
- 告警静音
- 取消告警静音
