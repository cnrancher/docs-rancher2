---
title: 基于角色的访问控制
description: 本节描述访问 Istio 功能所需的权限以及如何配置对 Kiali 和 Jaeger 可视化的访问。默认情况下，只有集群管理员可以为集群启用 Istio、为 Istio 配置资源分配、查看 Prometheus，Grafana，Kiali 和 Jaeger 的 UI。
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
  - 基于角色的访问控制
---

本节描述访问 Istio 功能所需的权限以及如何配置对 Kiali 和 Jaeger 可视化的访问。

## 集群层级的访问

默认情况下，只有集群管理员具有以下权限：

- 启用 Istio
- 配置 Istio 资源分配
- 查看 Prometheus，Grafana，Kiali 和 Jaeger 的 UI

## 项目层级的访问

在集群中启用 Istio 后，项目所有者和成员有以下权限：

- 给命名空间启用和禁用 Istio Sidecar 自动注入
- 将 Istio Sidecar 添加到工作负载中
- 查看集群的流量指标和流量图
- 在集群管理员允许授权的情况下，查看 Kiali 和 Jaeger 视图
- 使用 `kubectl` 配置 Istio 的网关、目标规则或虚拟服务等资源（不适用于具有只读权限的项目成员）

## 可视化的访问

因为 Kiali 和 Jaeger 可能含有的敏感信息，所以默认情况下只有集群所有者有权限访问。

**Jaeger** 为分布式跟踪系统提供了一个 UI，该 UI 对分析问题根源和确定导致性能下降的原因很有用。

**Kiali** 提供了一个显示服务网格中的服务及其连接方式的 Chart。

Rancher 支持给用户组授予访问 Kiali 和 Jaeger 的权限，不支持针对单个用户的授权。请参考以下步骤，配置访问 Kiali 和 Jaeger 的权限：

1. 转到集群视图，然后单击**工具 > Istio**。
1. 然后转到 **成员访问权限** 部分。如果要限制对某些组的访问，请选择 **允许集群所有者和指定的成员访问 Kiali 和 Jaeger UI**。搜索允许访问 Kiali 和 Jaeger 的组。如果您希望所有成员都可以使用该工具，请单击 **允许所有成员访问 Kiali 和 Jaeger UI**。
1. 单击 **保存**。

**结果：** Kiali 和 Jaeger 的访问权限级别已更新。

## Istio 用户的默认权限总结

| 权限                                                             | 集群管理员 | 项目所有者 | 项目成员 | 只读的项目成员 |
| :--------------------------------------------------------------- | :--------- | :--------- | :------- | -------------- |
| 为集群启用和禁用 Istio                                           | ✓          |            |          |                |
| 配置 Istio 资源限制                                              | ✓          |            |          |                |
| 访问 Kiali 和 Jaeger UI                                          | ✓          |            |          |                |
| 为命名空间启用和禁用 Istio                                       | ✓          | ✓          | ✓        |                |
| 为工作负载启用和禁用 Istio                                       | ✓          | ✓          | ✓        |                |
| 用 `kubectl` 配置 Istio                                          | ✓          | ✓          | ✓        |                |
| 查看 Prometheus UI 和 Grafana UI                                 | ✓          |            |          |                |
| 查看 Kiali UI 和 Jaeger UI ([可配置](#access-to-visualizations)) | ✓          |            |          |                |
| 查看 Istio 项目仪表盘，包括流量指标\*                            | ✓          | ✓          | ✓        | ✓              |

> **说明：**因为流量图来源于 Kiali，而 Kiali 中可能包含敏感信息，所以在默认情况下，只有集群所有者能看到流量图，项目成员物只能看到一部分流量指标。
