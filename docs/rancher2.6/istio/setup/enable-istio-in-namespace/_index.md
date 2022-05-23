---
title: 2. 在命名空间中启用 Istio
weight: 2
---

你需要在需要由 Istio 跟踪或控制的每个命名空间中手动启用 Istio。在命名空间中启用 Istio 时，Envoy sidecar 代理将自动注入到部署在命名空间中的所有新工作负载中。

此命名空间设置只会影响命名空间中的新工作负载。之前的工作负载需要重新部署才能使用 sidecar 自动注入。

> **先决条件**：要在命名空间中启用 Istio，集群必须安装 Istio。

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 单击**集群 > 项目/命名空间**。
1. 转到要启用 Istio 的命名空间，然后单击**⋮ > 启用 Istio 自动注入**。或者，你也可以单击命名空间，然后在命名空间详情页面上，单击**⋮ > 启用 Istio 自动注入**。

**结果**：命名空间带有了 `istio-injection=enabled` 标签。默认情况下，部署在此命名空间中的所有新工作负载都将注入 Istio sidecar。

### 验证是否启用了自动 Istio Sidecar 注入

要验证 Istio 是否已启用，请在命名空间中部署一个 hello-world 工作负载。转到工作负载并单击 pod 名称。在**容器**中，你应该能看到 `istio-proxy` 容器。

### 排除工作负载的 Istio Sidecar 注入

要排除 Istio sidecar 被注入某工作负载，请在工作负载上使用以下注释：

```
sidecar.istio.io/inject: “false”
```

要将注释添加到工作负载：

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 点击**工作负载**。
1. 转到不需要 sidecar 的工作负载并以 yaml 编辑。
1. 将键值 `sidecar.istio.io/inject: false` 添加为工作负载的注释。
1. 单击**保存**。

**结果**：Istio sidecar 不会被注入到工作负载中。

> **注意**：如果你遇到部署的 job 未完成的问题，则需要使用提供的步骤将此注释添加到 pod 中。由于 Istio Sidecars 会一直运行，因此即使任务完成了，也不能认为 Job 已完成。


### 后续步骤
[使用 Istio Sidecar 添加部署]({{<baseurl>}}/rancher/v2.6/en/istio/setup/deploy-workloads)
