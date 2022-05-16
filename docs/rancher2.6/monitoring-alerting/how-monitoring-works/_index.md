---
title: Monitoring 的工作原理
weight: 1
---

1. [架构概述](#1-architecture-overview)
2. [Prometheus 的工作原理](#2-how-prometheus-works)
3. [Alertmanager 的工作原理](#3-how-alertmanager-works)
4. [Monitoring V2 特定组件](#4-monitoring-v2-specific-components)
5. [抓取和公开指标](#5-scraping-and-exposing-metrics)
6. [监控 RKE2 集群](#6-monitoring-on-rke2-clusters)

## 1. 架构概述

此图显示了数据如何流经 Monitoring V2 应用：

{{% row %}}
{{% column %}}

![数据如何流经 monitoring 应用]({{<baseurl>}}/img/rancher/monitoring-v2-architecture-overview.svg)

{{% /column %}}
{{% column %}}

1. 规则定义了应该触发告警的 Prometheus 指标或时间序列数据库查询。
2. ServiceMonitors 和 PodMonitors 以声明方式指定监视服务和 Pod 的方式。它们使用标签从 pod 中抓取指标。
3. Prometheus Operator 观察正在创建的 ServiceMonitors、PodMonitors 和 PrometheusRules。
4. 在创建 Prometheus 配置资源时，Prometheus Operator 会调用 Prometheus API 来同步新配置。
5. 记录规则不直接用于告警。它们创建预计算查询的新时间序列。然后可以查询这些新时间序列数据来生成告警。
6. Prometheus 根据抓取间隔定期抓取配置的所有目标，并将结果存储在其时间序列数据库中。根据 Kubernetes master 组件和 Kubernetes 分布，来自某个 Kubernetes 组件的指标可以直接暴露给 Prometheus，通过 PushProx 代理，或不可用。有关详细信息，请参阅抓取和公开指标。
7. Prometheus 根据时间序列数据库评估告警规则。每当告警规则评估为正数时，它都会向 Alertmanager 发出告警。
8. Alertmanager 使用路由对触发的告警进行分组、标记和过滤，以将它们转换为有用的通知。
9. Alertmanager 使用接收器（Receiver）配置向 Slack、PagerDuty、SMS 或其他接收器发送通知。

{{% /column %}}
{{% /row %}}

## 2. Prometheus 的工作原理

### 2.1. 存储时间序列数据

收集 Exporter 的指标后，Prometheus 将时间序列存储在本地磁盘时间序列数据库中。Prometheus 可以选择与远程系统集成，但 `rancher-monitoring` 使用本地存储来存储时间序列数据库。

然后可以使用 PromQL（Prometheus 的查询语言）来查询数据库。Grafana 仪表板使用 PromQL 查询来生成数据可视化。

### 2.2. 查询时间序列数据库

PromQL 查询语言是向 Prometheus 查询时间序列数据的主要工具。

在 Grafana 中，你可以右键单击 CPU 利用率，然后单击 **Inspect**。这将打开一个显示[原始查询结果](https://grafana.com/docs/grafana/latest/panels/inspect-panel/#inspect-raw-query-results)的面板。原始结果展示了每个仪表板是如何由 PromQL 查询提供支持的。

### 2.3. 定义何时触发告警的规则

规则定义了 Prometheus 触发告警的条件。当创建或更新了 PrometheusRule 自定义资源后，Prometheus Operator 会观察变化并调用 Prometheus API，从而将规则配置与 Prometheus 中的告警规则和记录规则同步。

当你定义规则时（在 PrometheusRule 资源的 RuleGroup 中声明），[规则本身的规范](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#rule)会包含标签，然后 Alertmanager 会使用这些标签来确定接收此告警的路由。例如，标签为 `team: front-end` 的告警将​​发送到与该标签匹配的所有路由。

PrometheusRule 支持定义一个或多个 RuleGroup。每个 RuleGroup 由一组 Rule 对象组成，每个 Rule 对象均能表示告警或记录规则，并具有以下字段：

- 新告警或记录的名称
- 新告警或记录的 PromQL 表达式
- 用于标记告警或记录的标签（例如集群名称或严重性）
- 对需要在告警通知上显示的其他重要信息进行编码的注释（例如摘要、描述、消息、Runbook URL 等）。记录规则不需要此字段。

### 2.4. 发出告警

Prometheus 不会维护告警是否处于 active 状态。它在每个评估间隔内重复触发告警，并根据 Alertmanager 对告警进行分组和过滤成有意义的通知。

`evaluation_interval` 常量定义了 Prometheus 根据时间序列数据库评估告警规则的频率。与 `scrape_interval` 类似，`evaluation_interval` 的默认值也是一分钟。

规则包含在一组规则文件中。规则文件包括告警规则和记录规则，但只有告警规则才会在评估后触发告警。

对于记录规则，Prometheus 会运行查询，然后将其存储为时间序列。如果需要存储非常昂贵或耗时的查询的结果，这种合成的时间序列则非常有用，因此你可以在后续更快地进行查询它们。

告警规则是更常用的。每当告警规则评估为正数时，Prometheus 都会触发告警。

在触发告警之前，Rule 文件会根据实际用例将标签和注释添加到告警中：

- 标签用于标识告警的信息，并可能影响告警的路由。例如，如果在发送有关某个容器的告警时，你可以使用容器 ID 作为标签。
- 注释用于表示不影响告警路由位置的信息，例如 Runbook 或错误消息。

## 3. Alertmanager 的工作原理

Alertmanager 处理由 Prometheus server 等客户端应用发送的告警。它负责以下任务：

- 删除重复数据，分组，并将告警路由到正确的接收器集成（例如电子邮件、PagerDuty 或 OpsGenie）
- 静音和抑制告警
- 跟踪随时间触发的告警
- 发送告警的状态，即告警是否正在触发，或者是否已经解决

### 3.1. 将告警路由到接收器

Alertmanager 负责协调告警的发送位置。它允许你根据标签对告警进行分组，并根据标签匹配情况来触发告警。一个最顶层路由会接受所有告警。然后，Alertmanager 会根据告警是否匹配下一个路由的条件，继续将告警路由到接收器。

虽然 Rancher UI 表单只允许编辑两层深的路由树，但你可以通过编辑 Alertmanager 自定义资源 YAML 来配置更深的嵌套路由结构。

### 3.2. 配置多个接收器

你可以编辑 Rancher UI 中的表单来设置一个 Receiver 资源，其中包含 Alertmanager 将告警发送到你的通知系统所需的所有信息。

通过在 Alertmanager 或 Receiver 配置中编辑自定义 YAML，你还可以将告警发送到多个通知系统。有关详细信息，请参阅[接收器配置](../configuration/receiver/#configuring-multiple-receivers)。

## 4. Monitoring V2 特定组件

Prometheus Operator 引入了一组[自定义资源定义](https://github.com/prometheus-operator/prometheus-operator#customresourcedefinitions)，允许用户通过在集群上创建和修改这些自定义资源来部署和管理 Prometheus 和 Alertmanager 实例。

Prometheus Operator 会根据 Rancher UI 中编辑的资源和配置选项的实时状态来自动更新 Prometheus 配置。

### 4.1. 默认部署的资源

默认情况下，由 [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus) 项目策划的一组资源会作为 Rancher Monitoring 安装的一部分部署到你的集群上，用来设置基本的 Monitoring/Alerting 堆栈。

你可以在 [`rancher-monitoring`](https://github.com/rancher/charts/tree/main/charts/rancher-monitoring) Helm Chart 中找到部署到你的集群以支持此解决方案的资源，该 chart 密切跟踪由 Prometheus 社区维护的上游 [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) Helm Chart，并在 [CHANGELOG.md](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring/CHANGELOG.md) 中跟踪变更。

还有一些特殊类型的 ConfigMap 和 Secret（例如与 Grafana Dashboards、Grafana Datasources 和 Alertmanager Configs 对应的），它们会通过观察集群中资源的实时状态的 sidecar 代理来自动更新你的 Prometheus 配置。

### 4.2. PushProx

PushProx 增强了 monitoring 应用的安全性，允许将其安装到强化的 Kubernetes 集群上。

为了公开 Kubernetes 指标，PushProxes 使用客户端代理模型来公开默认 Kubernetes 组件中的特定端口。Node exporter 通过出站连接向 PushProx 公开指标。

代理允许 `rancher-monitoring` 从 hostNetwork 上的进程（如 `kube-api-server`）中抓取指标，而无需向入站连接开放节点端口。

PushProx 是一个 DaemonSet，用于监听寻求注册的客户端。注册后，客户端会通过已建立的连接代理抓取请求。然后，客户端执行对 etcd 的请求。

所有默认的 ServiceMonitors（如 `rancher-monitoring-kube-controller-manager`）都配置为使用此代理访问客户端的指标端点。

有关 PushProx 工作原理的更多详细信息，请参阅[使用 PushProx 抓取指标](#5-5-scraping-metrics-with-pushprox)。

### 4.3. 默认 Exporter

`rancher-monitoring` 部署两个 Exporter 来向 prometheus 公开指标，分别是 `node-exporter` 和 `windows-exporter`。两者都部署为 DaemonSet。

`node-exporter` 从每个 Linux 节点导出容器、pod 和节点的 CPU 和内存指标。`windows-exporter` 也是一样，只是它只针对 Windows 节点。

有关 `node-exporter` 的更多信息，请参阅[上游文档](https://prometheus.io/docs/guides/node-exporter/)。

[kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)也很有用，因为它导出 Kubernetes 组件的指标。

## 4.4. Rancher UI 中公开的组件

安装 monitoring 应用后，你将能够在 Rancher UI 中编辑以下组件：

| 组件           | 组件类型                        | 编辑的目的和常见用例                                                                                                                                           |
| -------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ServiceMonitor | 自定义资源                      | 设置目标以从中抓取自定义指标。自动更新 Prometheus 自定义资源中的抓取配置。                                                                                     |
| PodMonitor     | 自定义资源                      | 设置目标以从中抓取自定义指标。自动更新 Prometheus 自定义资源中的抓取配置。                                                                                     |
| Receiver       | 配置块（Alertmanager 的一部分） | 设置通知系统以接收告警。自动更新 Alertmanager 自定义资源。                                                                                                     |
| Route          | 配置块（Alertmanager 的一部分） | 添加识别信息使告警更有意义，并将告警定向到各个团队。自动更新 Alertmanager 自定义资源。                                                                         |
| PrometheusRule | 自定义资源                      | 如果需要使用更高级的用例，你可能需要定义需要触发告警的 Prometheus 指标或时间序列数据库查询。自动更新 Prometheus 自定义资源。                                   |
| Alertmanager   | 自定义资源                      | 仅当你需要使用未在 Rancher UI 中的 Route 和 Receiver 中公开的高级配置选项时，才编辑此自定义资源。例如，你可能想要编辑此资源来添加具有两个以上级别的路由树。    |
| Prometheus     | 自定义资源                      | 仅当你需要使用 ServiceMonitors、PodMonitors 或 [Rancher monitoring Helm Chart 选项](../configuration/helm-chart-options)之外的高级配置时，才编辑此自定义选项。 |

## 5. 抓取和公开指标

### 5.1. 定义要抓取的指标

ServiceMonitors 定义了 Prometheus 要抓取的目标。[Prometheus 自定义资源](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/design.md#prometheus)告诉 Prometheus 应该使用哪个 ServiceMonitors 来找出从哪里抓取指标。

Prometheus Operator 观察 ServiceMonitors。当它观察到 ServiceMonitors 被创建或更新时，它会调用 Prometheus API 来更新 Prometheus 自定义资源中的抓取配置，并使该配置与 ServiceMonitors 中的抓取配置保持同步。此抓取配置告诉 Prometheus 从哪些端点抓取指标，以及如何标记这些端点的指标。

Prometheus 会根据 `scrape_interval`（默认为一分钟）来抓取定义在抓取配置中的所有指标。

抓取配置可以作为 Prometheus 自定义资源的一部分被查看，该资源在 Rancher UI 中公开。

### 5.2. Prometheus Operator 如何设置指标抓取

Prometheus Deployment 或 StatefulSet 能抓取指标，而 Prometheus 的配置由 Prometheus 自定义资源控制。Prometheus Operator 会观察 Prometheus 和 Alertmanager 资源，当它们被创建时，Prometheus Operator 使用用户定义的配置，为 Prometheus 或 Alertmanager 创建一个 Deployment 或 StatefulSet。

<figcaption>Prometheus Operator 如何设置指标抓取</figcaption>

![Prometheus Operator 如何设置指标抓取]({{<baseurl>}}/img/rancher/set-up-scraping.svg)

如果 Prometheus Operator 观察到正在创建的 ServiceMonitors、PodMonitors 和 PrometheusRules，它就知道需要在 Prometheus 中更新抓取配置。首先，会通过更新 Prometheus 的 Deployment 或 StatefulSet 卷中的配置和规则文件来更新 Prometheus。然后，再调用 Prometheus API 来同步新配置，从而将 Prometheus Deployment 或 StatefulSet 修改到位。

![Prometheus Operator 如何更新 Scrape 配置]({{<baseurl>}}/img/rancher/update-scrape-config.svg)

### 5.3. 如何公开 Kubernetes 组件指标

Prometheus 从称为 [exporter](https://prometheus.io/docs/instrumenting/exporters/) 的 deployment 中抓取指标，exporter 以 Prometheus 可以抓取的格式导出时间序列数据。在 Prometheus 中，时间序列由属于相同指标和相同标记维度集的时间戳值流组成。

为了在强化的 Kubernetes 集群上安装 monitoring，`rancher-monitoring` 使用 PushProx 来代理某些 Kubernetes master 组件的 Prometheus 和 Exporter 之间的通信。

### 5.4. 不使用 PushProx 抓取指标

直接向 Prometheus 公开指标的 Kubernetes 组件如下：

- kubelet
- ingress-nginx\*
- coreDns/kubeDns
- kube-api-server

\* RKE 和 RKE2 集群默认部署 ingress-nginx，并将其视为内部 Kubernetes 组件。

### 5.5. 使用 PushProx 抓取指标

这种架构能让我们抓取内部 Kubernetes 组件，而不需要将这些端口暴露给入站请求。因此，Prometheus 可以跨网络边界抓取指标。

通过 PushProx 向 Prometheus 公开指标的 Kubernetes 组件如下：

- kube-controller-manager
- kube-scheduler
- etcd
- kube-proxy

对于每个 PushProx Exporter，我们在所有目标节点上都部署一个 PushProx 客户端。例如，将 PushProx 客户端部署到 kube-controller-manager 的所有 controlplane 节点、kube-etcd 的所有 etcd 节点上，和 kubelet 的所有节点上。我们为每个 Exporter 部署了一个 PushProx 代理。

导出指标的流程如下：

1. PushProx 客户端与 PushProx 代理建立出站连接。
2. 然后，客户端会轮询代理以获取进入代理的抓取请求。
3. 当代理收到来自 Prometheus 的抓取请求时，客户端会将其视为轮询的结果。
4. 客户端抓取内部组件。
5. 内部组件通过将指标推回代理来响应。

<figcaption>使用 PushProx 导出指标的过程</figcaption>

![使用 PushProx 导出指标的过程]({{<baseurl>}}/img/rancher/pushprox-process.svg)

指标的抓取方式根据 Kubernetes 发行版而有所不同。有关术语的帮助，请参阅下方的名词解释。详情见下表：

<figcaption>指标如何暴露给 Prometheus</figcaption>

| Kubernetes 组件         | RKE                                                          | RKE2                                                          | KubeADM                              | K3s                                 |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- | ------------------------------------ | ----------------------------------- |
| kube-controller-manager | rkeControllerManager.enabled                                 | rke2ControllerManager.enabled                                 | kubeAdmControllerManager.enabled     | k3sServer.enabled                   |
| kube-scheduler          | rkeScheduler.enabled                                         | rke2Scheduler.enabled                                         | kubeAdmScheduler.enabled             | k3sServer.enabled                   |
| etcd                    | rkeEtcd.enabled                                              | rke2Etcd.enabled                                              | kubeAdmEtcd.enabled                  | 不可用                              |
| kube-proxy              | rkeProxy.enabled                                             | rke2Proxy.enabled                                             | kubeAdmProxy.enabled                 | k3sServer.enabled                   |
| kubelet                 | 收集 kubelet 直接公开的指标                                  | 收集 kubelet 直接公开的指标                                   | 收集 kubelet 直接公开的指标          | 收集 kubelet 直接公开的指标         |
| ingress-nginx\*         | 收集 kubelet 直接公开的指标，由 rkeIngressNginx.enabled 公开 | 收集 kubelet 直接公开的指标，由 rke2IngressNginx.enabled 公开 | 不可用                               | 不可用                              |
| coreDns/kubeDns         | 收集 coreDns/kubeDns 直接公开的指标                          | 收集 coreDns/kubeDns 直接公开的指标                           | 收集 coreDns/kubeDns 直接公开的指标  | 收集 coreDns/kubeDns 直接公开的指标 |
| kube-api-server         | 收集 kube-api-server 直接公开的指标                          | 收集 kube-api-server 直接公开的指标                           | 收集 kube-appi-server 直接公开的指标 | 收集 kube-api-server 直接公开的指标 |

\* RKE 和 RKE2 集群默认部署 ingress-nginx，并将其视为内部 Kubernetes 组件。

### 5.6. 名词解释

- **kube-scheduler**：内部 Kubernetes 组件，该组件使用 pod 规范中的信息来决定在哪个节点上运行 pod。
- **kube-controller-manager**：负责节点管理（检测节点是否失败）、pod 复制，以及端点创建的内部 Kubernetes 组件。
- **etcd**：Kubernetes 内部组件，它是 Kubernetes 用于持久存储所有集群信息的分布式键/值存储。
- **kube-proxy**：内部 Kubernetes 组件，用于监视 API server 的 pod/service 更改以保持网络最新状态。
- **kubelet**：内部 Kubernetes 组件，用于为 pod 监视节点上的 API server 并确保这些 pod 能运行。
- **ingress-nginx**：用于 Kubernetes 的 Ingress controller，使用 NGINX 作为反向代理和负载均衡器。
- **coreDns/kubeDns**：负责 DNS 的内部 Kubernetes 组件。
- **kube-api-server**：负责为其他 master 组件公开 API 的主要内部 Kubernetes 组件。

## 6. 监控 RKE2 集群

Rancher 2.6 支持使用 [RKE2](https://docs.rke2.io/) 来配置新 Kubernetes 集群。RKE2 是 Rancher 推出的完全符合标准的 Kubernetes 发行版，它专注于安全性和合规性。为了在 RKE2 Kubernetes 集群上安装 Monitoring V2，我们引入了 `rkeIngressNginx` 和 `rke2IngressNginx` 两个子 Chart，分别在 RKE 和 RKE2 集群的 `ingress-nginx` Deployment/DaemonSet 中抓取指标。

PushProx pod 需要与 `ingress-nginx` pod 运行在相同的节点上。

如果 RKE2 集群的 Kubernetes 版本 <= 1.20，则 `ingress-nginx` 的工作负载类型是一个 Deployment。`pushprox-ingress-nginx-client` 部署为一个 Deployment，且 Rancher UI 将 Helm Chart 的值设为 `rke2IngressNginx.deployment.enabled=true`.

如果 Kubernetes 版本 >= 1.21，则 `ingress-nginx` 的工作负载类型是 DaemonSet。`pushprox-ingress-nginx-client` 默认部署为一个 DaemonSet。
