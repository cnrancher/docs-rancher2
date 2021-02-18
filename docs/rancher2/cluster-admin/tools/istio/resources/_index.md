---
title: CPU 和内存分配
description: 本节介绍了集群中 Istio 组件的最低推荐计算资源。每个组件的 CPU 和内存分配都是可配置的。启用 Istio 之前，建议您确认 Rancher worker 节点具有足够的 CPU 和内存来运行 Istio 的所有组件。在较大型的部署中，强烈建议通过为每个 Istio 组件添加节点选择器，将基础结构放置在集群中的专用节点上。
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
  - CPU 和内存分配
---

_从 v2.3.0 版本开始支持_

## 概述

本节介绍了集群中 Istio 组件的最低推荐计算资源。每个组件的 CPU 和内存分配都是可调整的。启用 Istio 之前，建议您确认 Rancher worker 节点具是否有足够的 CPU 和内存资源，运行 Istio 的所有组件。在较大型的部署中，我们建议通过为每个 Istio 组件添加节点选择器，将基础结构放置在集群中的专用节点上。

在 Kubernetes 中，资源请求意味着除非该节点至少具有指定数量的可用内存和 CPU，否则不会在该节点上部署工作负载。如果工作负载超过 CPU 或内存的限制，则可以终止该工作负载或将其从节点中逐出。有关管理容器资源限制的更多信息，请参考 [Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)。

下表汇总了建议的最低资源要求以及每个 Istio 核心组件的 CPU 和内存限制。

| 工作负载        | 容器       | CPU - 请求 | Mem - 请求 | CPU - 限制  | Mem - 限制   | 是否可配置 |
| :-------------- | :--------- | :--------- | :--------- | :---------- | :----------- | :--------- |
| istio-pilot     | discovery  | 500m       | 2048Mi     | 1000m       | 4096Mi       | 是         |
| istio-telemetry | mixer      | 1000m      | 1024Mi     | 4800m       | 4096Mi       | 是         |
| istio-policy    | mixer      | 1000m      | 1024Mi     | 4800m       | 4096Mi       | 是         |
| istio-tracing   | jaeger     | 100m       | 100Mi      | 500m        | 1024Mi       | 是         |
| prometheus      | prometheus | 750m       | 750Mi      | 1000m       | 1024Mi       | 是         |
| grafana         | grafana    | 100m       | 100Mi      | 200m        | 512Mi        | 是         |
| Others          | -          | 500m       | 500Mi      | -           | -            | 否         |
| **Total**       | **-**      | **3950m**  | **5546Mi** | **>12300m** | **>14848Mi** | **-**      |

## 操作步骤

您可以为每种 Istio 组件类型分别配置资源分配。本节包括每个组件的默认资源分配。

为了更轻松地将工作负载调度到节点，集群管理员可以减少对该组件的 CPU 和内存资源请求。但是，默认的 CPU 和内存分配是我们建议的最小值。

您可以在[Istio 官方文档](https://istio.io/docs/concepts/what-is-istio)中找到有关 Istio 配置的更多信息。

要配置分配给 Istio 组件的资源，

1. 在 Rancher 中，转到已安装 Istio 的集群。
1. 单击 **工具 > Istio**。这将打开 Istio 配置页面。
1. 更改 CPU 或内存分配，每个组件要被调度到的节点，或节点容忍。
1. 单击 **保存**。

**结果：** Istio 组件的资源分配已更新。

## Pilot

[Pilot](https://istio.io/docs/ops/deployment/architecture/#pilot) 组件提供以下功能：

- 认证配置
- Envoy sidecar 的服务发现
- 用于智能路由的流量管理功能（A/B 测试和金丝雀发布）
- 弹性配置（超时，重试，断路器等）

有关 Pilot 组件的更多信息，请参阅[文档](https://istio.io/docs/concepts/traffic-management/#pilot-and-envoy).

| 选项              | 描述                                                                                                 | 是否必填项 | 默认值 |
| :---------------- | :--------------------------------------------------------------------------------------------------- | :--------- | :----- |
| Pilot CPU 限制    | Istio-pilot pod 的 CPU 资源限制。                                                                    | 是         | 1000   |
| Pilot CPU 预留    | Istio-pilot pod 的 CPU 资源预留。                                                                    | 是         | 500    |
| Pilot Memory 限制 | Istio-pilot pod 的内存资源限制。                                                                     | 是         | 4096   |
| Pilot Memory 预留 | Istio-pilot pod 的内存资源预留。                                                                     | 是         | 2048   |
| 跟踪抽样比例      | [跟踪抽样的比例](https://istio.io/docs/tasks/telemetry/distributed-tracing/overview/#trace-sampling) | 是         | 1      |
| Pilot 结点选择器  | 能够选择将 istio-pilot pod 部署到的节点。要使用此选项，节点必须带有对应标签。                        | 否         | n/a    |

## Mixer

[Mixer](https://istio.io/docs/ops/deployment/architecture/#mixer) 组件跨服务网格实施访问控制和使用策略。它还与用于监视工具（例如 Prometheus）的插件集成。Envoy sidecar 将遥测数据和监视数据传递给 Mixer，而 Mixer 将监视数据传递给 Prometheus。

有关 Mixer，策略和遥测的更多信息，请参阅[文档](https://istio.io/docs/concepts/policies-and-telemetry/)。

| 选项                        | 描述                                                                                               | 是否必填项           | 默认值 |
| :-------------------------- | :------------------------------------------------------------------------------------------------- | -------------------- | :----- |
| Mixer Telemetry CPU 限制    | Istio-telemetry pod 的 CPU 资源限制。                                                              | 是                   | 4800   |
| Mixer Telemetry CPU 预留    | Istio-telemetry pod 的 CPU 资源预留。                                                              | 是                   | 1000   |
| Mixer Telemetry Memory 限制 | Istio-telemetry pod 的内存资源限制。                                                               | 是                   | 4096   |
| Mixer Telemetry Memory 预留 | Istio-telemetry pod 的内存资源预留。                                                               | 是                   | 1024   |
| Enable Mixer Policy         | 是否部署 istio-policy。                                                                            | 是                   | False  |
| Mixer Policy CPU 限制       | Istio-policy pod 的 CPU 资源限制。                                                                 | 是，当 Policy 启用时 | 4800   |
| Mixer Policy CPU 预留       | Istio-policy pod 的 CPU 资源预留。                                                                 | 是，当 Policy 启用时 | 1000   |
| Mixer Policy Memory 限制    | Istio-policy pod 的内存资源限制。                                                                  | 是，当 Policy 启用时 | 4096   |
| Mixer Policy Memory 预留    | Istio-policy pod 的内存资源预留。                                                                  | 是，当 Policy 启用时 | 1024   |
| Mixer 结点选择器            | 能够选择将 istio-policy 和 istio-telemetry pods 部署到的节点。要使用此选项，节点必须带有对应标签。 | 否                   | n/a    |

## Tracing

[分布式跟踪](https://istio.io/docs/tasks/telemetry/distributed-tracing/overview/)使用户可以通过服务网格跟踪请求。这使解决延迟，并行性和序列化问题变得更加容易。

| 选项                | 描述                                                                      | 是否必填项 | 默认值 |
| :------------------ | :------------------------------------------------------------------------ | ---------- | :----- |
| 启用跟踪            | 是否部署 istio-tracing。                                                  | 是         | 是     |
| Tracing CPU 限制    | Istio-tracing pod 的 CPU 资源限制。                                       | 是         | 500    |
| Tracing CPU 预留    | Istio-tracing pod 的 CPU 资源预留。                                       | 是         | 100    |
| Tracing Memory 限制 | Istio-tracing pod 的内存资源限制。                                        | 是         | 1024   |
| Tracing Memory 预留 | Istio-tracing pod 的内存资源预留。                                        | 是         | 100    |
| Tracing 结点选择器  | 能够选择将 tracing pod 部署到的节点。要使用此选项，节点必须带有对应标签。 | 否         | n/a    |

## Ingress 网关

Istio 网关允许将 Istio 功能（例如监视和路由规则）应用于进入集群的流量。此网关是外部流量向 Istio 发出请求的先决条件。

详情请参阅[文档](https://istio.io/docs/tasks/traffic-management/ingress/).

| 选项                        | 描述                                                                                   | 是否必填项 | 默认值   |
| :-------------------------- | :------------------------------------------------------------------------------------- | :--------- | -------- |
| 启用 Ingress 网关           | 是否部署 istio-ingressgateway。                                                        | 是         | 否       |
| Ingress 网关的服务类型      | 暴露网关服务的方式。您可以选择 NodePort 或 Loadbalancer                                | 是         | NodePort |
| Http2 端口                  | http2 请求的 NodePort 端口                                                             | 是         | 31380    |
| Https 端口                  | https 请求的 NodePort 端口                                                             | 是         | 31390    |
| Load Balancer IP            | Ingress 网关的负载均衡器 IP                                                            | 否         | n/a      |
| 负载均衡器 IP 源范围        | Ingress 网关负载均衡器 IP 源的范围                                                     | 否         | n/a      |
| Ingress Gateway CPU 限制    | Istio-ingressgateway 的 CPU 资源限制。                                                 | 是         | 2000     |
| Ingress Gateway CPU 预留    | Istio-ingressgateway 的 CPU 资源预留。                                                 | 是         | 100      |
| Ingress Gateway Memory 限制 | Istio-ingressgateway 的内存资源限制。                                                  | 是         | 1024     |
| Ingress Gateway Memory 预留 | Istio-ingressgateway 的内存资源预留。                                                  | 是         | 128      |
| Ingress Gateway 结点选择器  | 能够选择将 Istio-ingressgateway pod 部署到的节点。要使用此选项，节点必须带有对应标签。 | 否         | n/a      |

## Prometheus

Prometheus 是一个开源系统监视和警报工具包，您可以使用 Prometheus 查询 Istio 指标。

| 选项                   | 描述                                                                         | 是否必填项 | 默认值 |
| :--------------------- | :--------------------------------------------------------------------------- | :--------- | :----- |
| Prometheus CPU 限制    | Prometheus pod 的 CPU 资源限制。                                             | 是         | 1000   |
| Prometheus CPU 预留    | Prometheus pod 的 CPU 资源预留。                                             | 是         | 750    |
| Prometheus Memory 限制 | Prometheus pod 的内存资源限制。                                              | 是         | 1024   |
| Prometheus Memory 预留 | Prometheus pod 的内存资源预留。                                              | 是         | 750    |
| Prometheus 数据保留    | Prometheus 实例保留数据的时长                                                | 是         | 6      |
| Prometheus 结点选择器  | 能够选择将 Prometheus pod 部署到的节点。要使用此选项，节点必须带有对应标签。 | 否         | n/a    |

## Grafana

Grafana 可让您可视化 Prometheus 抓取的 Istio 流量数据，您可以使用 Grafana 可视化指标。

| 选项                  | 描述                                                                      | 是否必填项                                                    | 默认值           |
| :-------------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------ | :--------------- |
| 启用 Grafana          | 是否部署 Grafana。                                                        | 是                                                            | 是               |
| Grafana CPU 限制      | Grafana pod 的 CPU 资源限制。                                             | 是，当 Grafana 启用时                                         | 200              |
| Grafana CPU 预留      | Grafana pod 的 CPU 资源预留。                                             | 是，当 Grafana 启用时                                         | 100              |
| Grafana Memory 限制   | Grafana pod 的内存资源限制。                                              | 是，当 Grafana 启用时                                         | 512              |
| Grafana Memory 预留   | Grafana pod 的内存资源预留。                                              | 是，当 Grafana 启用时                                         | 100              |
| Grafana 结点选择器    | 能够选择将 Grafana pod 部署到的节点。要使用此选项，节点必须带有对应标签。 | 否                                                            | n/a              |
| 启用 Grafana 持久存储 | 启用 Grafana 持久存储                                                     | 是，当 Grafana 启用时                                         | 否               |
| 存储源                | 使用存储类来配置新的持久卷或使用现有的持久卷声明                          | 是，当 Grafana 及其持久存储启用时                             | 使用存储类       |
| 存储类                | Grafana 存储使用的存储类型                                                | 是，当 Grafana 及其持久存储启用，且存储源为存储类时           | 使用默认存储类型 |
| 持久卷大小            | Grafana 所用的持久卷大小                                                  | 是，当 Grafana 及其持久存储启用，且存储源为存储类时           | 5Gi              |
| 现有的持久卷声明      | Grafana 使用的现有的持久卷声明                                            | 是，当 Grafana 及其持久存储启用，且存储源为现有的持久卷声明时 | n/a              |
