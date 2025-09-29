---
title: 2、在命名空间中启用 Istio
description: 对于想要交由 Istio 跟踪或控制的命名空间,您需要在每个命名空间手动启用 Istio。在命名空间中启用 Istio 时，Envoy sidecar 代理将自动注入到该命名空间中部署的所有新工作负载中。这一命名空间设置只会影响命名空间中的新工作负载。所有先前存在的工作负载需要重新部署，以利用 Sidecar 自动注入功能。
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
  - Istio
  - Istio使用指南
  - 在命名空间中启用 Istio
---

对于想要交由 Istio 跟踪或控制的命名空间,您需要在每个命名空间手动启用 Istio。在命名空间中启用 Istio 时，Envoy sidecar 代理将自动注入到该命名空间中部署的所有新工作负载中。

这一命名空间设置会影响命名空间中的新工作负载，所有先前存在的工作负载需要重新部署，以利用 Sidecar 自动注入功能。

> **先决条件:** 要在命名空间中启用 Istio，集群必须启用 Istio。

1. 在 Rancher UI 中，转到集群视图。单击**项目/命名空间**标签页。
1. 找到要启用 Istio sidecar 自动注入的命名空间，然后单击**省略号 (...)**。
1. 单击**编辑**。
1. 在**Istio sidecar 自动注入**部分，单击**启用**。
1. 单击**保存**。

**结果：** 现在，该命名空间带上了`istio-injection = enabled`标签。默认情况下，在此命名空间中部署的所有新工作负载都将注入 Istio sidecar。

## 验证是否启用了 Istio Sidecar 的自动注入

要验证是否启用了 Istio，请在命名空间中部署 hello-world 工作负载。找到该工作负载，然后单击 Pod 名称。在**容器**部分，您应该看到`istio-proxy`容器。

## 避免 Istio sidecar 自动注入到某些工作负载

如果您需要避免 Istio sidecar 自动注入到某个工作负载，请在该工作负载上添加如下注释（annotation）：

```
sidecar.istio.io/inject: "false"
```

1. 从**全局**视图中，打开工作负载所在的项目。
1. 单击**资源 > 工作负载**。
1. 找到不应该有 sidecar 注入的工作负载，单击**省略号 (...) > 编辑**。
1. 单击**显示高级选项**，然后展开**标签/注释**部分。
1. 单击**添加注释**。
1. 在**键**文本框，填入`sidecar.istio.io/inject`。
1. 在**值**文本框，填入`false`。
1. 单击**保存**。

**结果：** Istio sidecar 不会被注入到该工作负载中。

> **说明：** 如果您启用了 Istio，而且部署了 Job 之后，Job 的状态一直没有变更为**Completed**，您需要参考[这些步骤](/docs/rancher2/cluster-admin/tools/istio/setup/enable-istio-in-namespace/)手动添加 annotation。因为 Istio Sidecarh 会无休止地运行，即使 Job 的任务完成了，它的状态也不能被视为**Completed**。上述步骤是在短期内处理这个问题的方法，它禁止了 Istio 和添加了 annotation 的 Pod 之间的通信。如果您使用了这种方式解决这个问题，这个 Job 就没有权限访问 service mesh，不能够用于集成测试。

## 后续操作

[选择部署 Istio 组件的节点](/docs/rancher2/cluster-admin/tools/istio/setup/node-selectors/)
