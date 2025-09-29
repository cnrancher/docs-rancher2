---
title: 监控的工作原理
description: 本文档中的 PromQL 表达式可用于配置告警。
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
  - rancher 2.5
  - 监控和告警
  - 监控的工作原理
---

1. [架构概述](#1-架构概述)
2. [Prometheus 如何工作](#2-prometheus-如何工作)
3. [Alertmanager 如何工作](#3-alertmanager-如何工作)
4. [Monitoring V2 特定组件](#4-monitoring-v2-特定组件)
5. [抓取和暴露指标](#5-抓取和暴露指标)

## 1. 架构概述

此图显示了数据如何流经 Monitoring V2 应用程序：

![数据如何流经监控应用](/img/rancher/monitoring-v2-architecture-overview.svg)

1. 规则定义了哪些 Prometheus 指标或时间序列数据库查询应触发告警。
2. ServiceMonitors 和 PodMonitors 声明性地指定应如何监控 service 和 pod。它们使用标签从 pods 中抓取指标。
3. Prometheus Operator 观察正在创建的 ServiceMonitors、PodMonitors 和 PrometheusRules。
4. 当 Prometheus 配置资源被创建时，Prometheus Operator 调用 Prometheus API 来同步新配置。
5. 记录规则不直接用于告警。它们创建新的预先计算的查询时间序列。然后，这些新的时间序列数据可以被查询到，以产生告警。
6. Prometheus 根据抓取间隔，定期抓取配置中的所有目标，将结果存储在时间序列数据库中。根据 Kubernetes master 组件和 Kubernetes 分布，某个 Kubernetes 组件的指标可以直接暴露给 Prometheus，通过 PushProx Proxy，或者不可用。详情请见 "抓取和暴露指标"。
7. Prometheus 会根据时间序列数据库评估告警规则。只要告警规则评估为正数，它就会向 Alertmanager 发出告警。
8. Alertmanager 使用路由对发送的告警进行分组、标记和过滤，将它们转化为有用的通知。
9. Alertmanager 使用接收器配置，将通知发送到 Slack、PagerDuty、SMS 或其他类型的接收器。

## 2. Prometheus 如何工作

### 2.1. 储存时间序列数据

从 exporter 收集指标后，Prometheus 将时间序列存储在本地磁盘上的时间序列数据库中。Prometheus 可以选择与远程系统集成，但 `rancher-monitoring` 使用本地存储的时间序列数据库。

然后可以使用 PromQL（Prometheus 的查询语言）来查询数据库。Grafana 仪表盘使用 PromQL 查询来生成数据的可视化。

### 2.2. 对时间序列数据库的查询

PromQL 查询语言是查询 Prometheus 时间序列数据的主要工具。

在 Grafana 中，你可以右键单击 CPU 利用率，然后点击检查。这将打开一个面板，显示[原始查询结果。](https://grafana.com/docs/grafana/latest/panels/inspect-panel/#inspect-raw-query-results)原始结果展示了每个仪表盘是如何由 PromQL 查询提供支持的。

### 2.3. 定义何时触发告警的规则

规则定义了 Prometheus 发出告警的条件。当 PrometheusRule 自定义资源创建或更新时，Prometheus Operator 会观察到变化并调用 Prometheus API，使规则配置与 Prometheus 中的告警规则和记录规则同步。

当你定义一个规则（在 PrometheusRule 资源中的 RuleGroup 内声明）时，[规则本身的规格](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#rule)包含标签，Alertmanager 使用这些标签来计算哪个路由应该接收这个告警。例如，一个标签为 `team: front-end` 的告警将被发送到所有与该标签相匹配的路由。

一个 PrometheusRule 允许你定义一个或多个 RuleGroups。每个 RuleGroup 由一组 Rule 对象组成，每个对象可以代表一个告警或记录规则，有以下字段:

- 新告警或记录的名称
- 新告警或记录的 PromQL 表达式
- 应该附加到告警或识别它的记录的标签（例如，集群名称或严重程度）
- 对需要在告警通知上显示的任何其他重要信息进行编码的注释（如摘要，描述，消息，运行手册的 URL，等等）。记录规则不需要此字段。

### 2.4. 发出告警

Prometheus 并不维护告警是否处于 active 状态。它在每个评估时间间隔重复地发送告警，依靠 Alertmanager 将告警分组并过滤为有意义的通知。

`evaluation_interval` 定义了 Prometheus 对时间序列数据库评估告警规则的频率。与 `scrape_interval` 类似，`evaluation_interval` 默认也为 1 分钟。

这些规则包含在一组规则文件中。规则文件包括告警规则和记录规则，但只有告警规则才会在评估后触发告警。

对于记录规则，Prometheus 运行一个查询，然后将其存储为一个时间序列。这种合成的时间序列对于存储非常耗时的查询结果非常有用，将来可以更快地查询。

告警规则是比较常用的。每当告警规则评估为正数时，Prometheus 就会发出告警。

规则文件在启动告警之前会根据使用情况给告警添加标签和注释：

- 标签表示识别告警的信息，并可能影响告警的路由。例如，如果在发送关于某个容器的告警时，容器 ID 可以被用作标签。
- 注释表示不影响告警路由的信息，例如，一个运行手册或错误信息。

## 3. Alertmanager 如何工作

Alertmanager 处理由客户端应用程序（如 Prometheus 服务器）发送的告警。它负责处理以下任务：

- 重复数据删除，分组，并将告警路由到正确的接收器，如 email，PagerDuty，或 OpsGenie
- 静音和抑制告警
- 跟踪随着时间推移触发的告警
- 发送告警的状态，即告警是否正在触发，或者是否已经解决。

### 3.1. 将告警路由给接收器

Alertmanager 负责协调告警的发送位置。它允许你根据标签来分组告警，并根据某些标签是否匹配来发送告警。一个顶级路由接受所有告警。从那里开始，Alertmanager 继续根据告警是否符合下一个路由的条件，将其路由到接收器。

虽然 Rancher UI 表单只允许编辑两级深度的路由树，但你可以通过编辑 Alertmanager 自定义资源 YAML 来配置更深层的嵌套路由结构。

### 3.2. 配置多个接收器

通过编辑 Rancher UI 中的表单，你可以设置一个 Receiver 资源，其中包含 Alertmanager 向你的通知系统发送告警所需的所有信息。

通过编辑 Alertmanager 或 Receiver 配置中的自定义 YAML，你也可以向多个通知系统发送告警。更多信息，请参见配置 [Receivers](/docs/rancher2.5/monitoring-alerting/configuration/receiver/#配置多个接收器) 章节。

## 4. Monitoring V2 特定组件

Prometheus Operator 引入了一套[自定义资源定义](https://github.com/prometheus-operator/prometheus-operator#customresourcedefinitions)，允许用户通过在集群上创建和修改这些自定义资源来部署和管理 Prometheus 和 Alertmanager 实例。

Prometheus Operator 将根据 Rancher UI 中编辑的资源和配置选项的实时状态，自动更新你的 Prometheus 配置。

### 4.1. 默认部署的资源

默认情况下，由 [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus) 项目管理的一组资源部署到你的集群上，作为安装 Rancher 监控应用程序的一部分，来设置一个基本的监控/告警堆栈。

为支持这一解决方案而部署到集群上的资源可以在 [`rancher-monitoring`](https://github.com/rancher/charts/tree/main/charts/rancher-monitoring) Helm chart 中找到，该 chart 密切跟踪由 Prometheus 社区维护的上游 [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) Helm chart，在 [CHANGELOG.md](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring/CHANGELOG.md) 中跟踪了某些变化。

还有一些特殊类型的 ConfigMaps 和 Secrets，比如与 Grafana Dashboards、Grafana Datasources 和 Alertmanager Configs 相对应的，它们会通过观察集群中这些资源的实时状态的 sidecar 代理自动更新你的 Prometheus 配置。

### 4.2. PushProx

PushProx 增强了监控应用的安全性，使其可以安装在加固的 Kubernetes 集群上。

为了暴露 Kubernetes 指标，PushProxes 使用客户端代理模型来暴露默认 Kubernetes 组件中的特定端口。Node exporter 通过一个出站连接将指标暴露给 PushProx。

该代理允许 `rancher-monitoring` 从 hostNetwork 上的进程（如 `kube-api-server`）抓取指标，而无需向入站连接开放节点端口。

PushProx 是一个 DaemonSet，用于监听寻求注册的客户端。一旦注册，它会通过已建立的连接代理抓取请求。然后，客户端执行对 etcd 的请求。

所有默认的 ServiceMonitors，比如 `rancher-monitoring-kube-controller-manager`，都配置为使用此代理访问客户端的指标端点。

关于 PushProx 如何工作的更多细节，请参考[使用 PushProx 抓取指标。](#55-用-pushprox-抓取指标)

### 4.3. 默认 Exporter

`rancher-monitoring` 部署了两个 exporter，将指标暴露给 Prometheus：`node-exporter`和`windows-exporter`。两者都是作为 DaemonSets 部署的。

`node-exporter` 从每个 Linux 节点导出容器、pod 和节点的 CPU 和内存指标。`windows-exporter` 做同样的事情，但是针对 Windows 节点。

关于 `node-exporter` 的更多信息，请参考 [node-exporter 文档。](https://prometheus.io/docs/guides/node-exporter/)

[kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) 也很有用，因为它为 Kubernetes 组件输出指标。

### 4.4. Rancher UI 中暴露的组件

当安装监控应用程序后，你能在 Rancher UI 中编辑以下组件：

| 组件           | 组件类型                                   | 编辑的目的和常见用例                                                                                                                                                                                                    |
| -------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ServiceMonitor | Custom resource                            | 设置 targets 来抓取自定义指标。自动更新 Prometheus 自定义资源中的抓取配置。                                                                                                                                             |
| PodMonitor     | Custom resource                            | 设置 targets 来抓取自定义指标。自动更新 Prometheus 自定义资源中的抓取配置。                                                                                                                                             |
| Receiver       | Configuration block (part of Alertmanager) | 设置一个通知系统来接收告警。自动更新 Alertmanager 自定义资源。                                                                                                                                                          |
| Route          | Configuration block (part of Alertmanager) | 添加识别信息，使告警更有意义，并定向到各个团队。自动更新 Alertmanager 自定义资源。                                                                                                                                      |
| PrometheusRule | Custom resource                            | 对于更高级的用例，你可能想定义哪些 Prometheus 指标或时间序列数据库查询应该导致告警被触发。自动更新 Prometheus 的自定义资源。                                                                                            |
| Alertmanager   | Custom resource                            | 只有当你需要更多的高级配置选项，而不是 Rancher UI 在路由和接收者部分所展示的选项时，才编辑这个自定义资源。例如，你可能想编辑这个资源来添加一个两层以上的路由树。                                                        |
| Prometheus     | Custom resource                            | 只有当你需要更高级的配置，而不是使用 ServiceMonitors、PodMonitors 或[ Rancher monitoring Helm chart 选项](/docs/rancher2.5/monitoring-alerting/configuration/helm-chart-options/)来配置时，才编辑这个自定义资源。 |

## 5. 抓取和暴露指标

### 5.1. 定义要抓取的指标

ServiceMonitors 定义了 Prometheus 抓取的目标。[Prometheus 自定义资源告诉](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/design.md#prometheus) Prometheus 应该使用哪些 ServiceMonitors 来找出从哪里抓取指标。

Prometheus Operator 观察 ServiceMonitors。当它观察到 ServiceMonitors 被创建或更新时，它会调用 Prometheus API 来更新 Prometheus 自定义资源中的抓取配置，并与 ServiceMonitors 中的抓取配置保持同步。这个抓取配置告诉 Prometheus 从哪些端点抓取指标，以及它将如何标记来自这些端点的指标。

Prometheus 每隔 `scrape_interval`（默认为 1 分钟）就会抓取其抓取配置中定义的所有指标。

抓取配置可以作为 Prometheus 自定义资源的一部分被查看，该资源在 Rancher UI 中公开。

### 5.2. Prometheus Operator 如何设置指标抓取

Prometheus Deployment 或 StatefulSet 抓取指标，Prometheus 的配置由 Prometheus 自定义资源控制。Prometheus Operator 观察 Prometheus 和 Alertmanager 资源，当它们被创建时，Prometheus Operator 会用用户定义的配置为 Prometheus 或 Alertmanager 创建一个 Deployment 或 StatefulSet。

PrometheusOperator 如何设置指标抓取:

![PrometheusOperator如何设置指标抓取](/img/rancher/set-up-scraping.svg)

当 Prometheus Operator 观察到 ServiceMonitors、PodMonitors 和 PrometheusRules 被创建时，它知道抓取配置需要在 Prometheus 中更新。它通过首先更新 Prometheus 的 Deployment 或 StatefulSet 卷中的配置和规则文件来更新 Prometheus。然后它调用 Prometheus API 来同步新的配置，最终 Prometheus Deployment 或 StatefulSet 被修改。

![PrometheusOperator如何更新Scrape配置](/img/rancher/update-scrape-config.svg)

### 5.3. Kubernetes 组件指标如何暴露

Prometheus 从称为 [exporters](https://prometheus.io/docs/instrumenting/exporters/) 的部署中抓取指标，这些部署以 Prometheus 支持的格式导出时间序列数据。在 Prometheus 中，时间序列由属于相同指标和相同标记维度集的时间戳值流组成。

为了监控能够安装在强化的 Kubernetes 集群上，`rancher-monitoring` 应用程序通过 PushProx Proxy Prometheus 和 exporter 之间的通信，用于一些 Kubernetes master 组件。

### 5.4. 在没有 PushProx 的情况下抓取指标

直接向 Prometheus 暴露指标的 Kubernetes 组件有以下几种：

- kubelet
- ingress-nginx\*
- coreDns/kubeDns
- kube-api-server

\* 对于 RKE 和 RKE2 集群，默认部署 ingress-nginx，并被视为 Kubernetes 内部组件。

### 5.5. 用 PushProx 抓取指标

这个架构的目的是允许我们抓取 Kubernetes 的内部组件，而不将这些端口暴露给入站请求。因此，Prometheus 可以跨越网络边界抓取指标。

通过 PushProx 向 Prometheus 暴露指标的 Kubernetes 组件有以下几个：

- kube-controller-manager
- kube-scheduler
- etcd
- kube-proxy

对于每个 PushProx exporter，我们在所有目标节点上部署一个 PushProx Client 。例如，一个 PushProx Client 被部署到 kube-controller-manager 的所有控制平面节点上，kube-etcd 的所有 etcd 节点，以及 kubelet 的所有节点。我们为每个 exporter 精确部署一个 PushProx Proxy。

输出指标的过程如下：

1. PushProx Client 与 PushProx Proxy 建立一个出站连接。
2. 然后，客户端对已经进入代理的抓取请求进行轮询。
3. 当代理收到来自 Prometheus 的抓取请求时，客户端将其视为轮询的结果。
4. 客户端抓取内部组件。
5. 内部组件通过将指标推回给代理来做出响应。

用 PushProx 导出指标的过程：

![用PushProx导出指标的过程](/img/rancher/pushprox-process.svg)

根据 Kubernetes 的分布情况，指标的抓取方式不同。关于术语的帮助，请参见[术语](#56-术语)。详情请见下表:

指标如何暴露给 Prometheus：

| Kubernetes Component    | RKE                                                            | RKE2                                                            | KubeADM                                               | K3s                                   |
| ----------------------- | -------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------- |
| kube-controller-manager | rkeControllerManager.enabled                                   | rke2ControllerManager.enabled                                   | kubeAdmControllerManager.enabled                      | k3sServer.enabled                     |
| kube-scheduler          | rkeScheduler.enabled                                           | rke2Scheduler.enabled                                           | kubeAdmScheduler.enabled                              | k3sServer.enabled                     |
| etcd                    | rkeEtcd.enabled                                                | rke2Etcd.enabled                                                | kubeAdmEtcd.enabled                                   | 不可用                                |
| kube-proxy              | rkeProxy.enabled                                               | rke2Proxy.enabled                                               | kubeAdmProxy.enabled                                  | k3sServer.enabled                     |
| kubelet                 | 收集由 kubelet 直接暴露的指标                                  | 收集由 kubelet 直接暴露的指标                                   | 收集由 kubelet 直接暴露的指标                         | 收集由 kubelet 直接暴露的指标         |
| ingress-nginx\*         | 收集由 kubelet 直接暴露的指标，由 rkeIngressNginx.enabled 暴露 | 收集由 kubelet 直接公开的指标，由 rke2IngressNginx.enabled 公开 | 不可用                                                | 不可用                                |
| coreDns/kubeDns         | 收集由 coreDns/kubeDns 直接暴露的指标                          | 收集由 coreDns/kubeDns 直接暴露的指标                           | 收集由 coreDns/kubeDns 直接暴露的指标                 | 收集由 coreDns/kubeDns 直接暴露的指标 |
| kube-api-server         | 收集由 kube-api-server 直接暴露的指标                          | 收集由 kube-api-server 直接暴露的指标                           | Collects metrics directly exposed by kube-appi-server | 收集由 kube-api-server 直接暴露的指标 |

\* 对于 RKE 和 RKE2 集群，默认部署 ingress-nginx，被视为 Kubernetes 内部组件。

### 5.6. 术语

- **kube-scheduler:** Kubernetes 内部组件，使用 pod spec 中的信息来决定在哪个节点上运行 pod。
- **kube-controller-manager:** Kubernetes 内部组件，负责节点管理（检测节点是否失效）、pod replication 和 endpoint 创建。
- **etcd:** Kubernetes 内部组件，是 Kubernetes 用于持久化存储所有集群信息的分布式 key/value 存储。
- **kube-proxy:** Kubernetes 内部组件，观察 API server 上的 pods/services 变化，以保持网络的最新状态。
- **kubelet:** Kubernetes 的内部组件，观察 API server 上的 pod，并确保它们正在运行。
- **ingress-nginx:** Kubernetes 的 Ingress 控制器，使用 NGINX 作为反向代理和负载均衡器。
- **coreDns/kubeDns:** 负责 DNS 的 Kubernetes 内部组件。
- **kube-api-server:** 主要的 Kubernetes 内部组件，负责为其他主组件提供 API。
