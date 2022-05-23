---
title: 基于角色的访问控制
weight: 3
---

本文介绍访问 Istio 功能所需的权限。

Rancher Istio Chart 安装了三个 `ClusterRole`。

## Cluster-Admin 访问

默认情况下，只有具有 `cluster-admin` `ClusterRole` 的用户可以：

- 在集群中安装 Istio 应用。
- 为 Istio 配置资源分配。

## Admin 和 Edit 权限

默认情况下，只有 Admin 和 Edit 角色可以：

- 为命名空间启用和禁用 Istio sidecar 自动注入。
- 将 Istio sidecar 添加到工作负载。
- 查看集群的流量指标和流量图。
- 配置 Istio 的资源（例如网关、目标规则或虚拟服务）。

## Kubernetes 默认角色的默认权限摘要

Istio 创建了三个 `ClusterRole`，并将 Istio CRD 访问权限添加到以下默认 K8s `ClusterRole`：

| Chart 创建的 ClusterRole | 默认 K8s ClusterRole | Rancher 角色 |
| -----------------------: | -------------------: | -----------: |
|            `istio-admin` |                admin |   项目所有者 |
|             `istio-edit` |                 edit |     项目成员 |
|             `istio-view` |                 view |         只读 |

Rancher 将继续使用 cluster-owner、cluster-member、project-owner、project-member 等作为角色名称，但会使用默认角色来确定访问权限。每个默认的 K8s `ClusterRole` 都有不同的 Istio CRD 权限以及可以执行的 K8s 操作，包括 Create (C)，Get (G)，List (L)，Watch (W)，Update (U)，Patch (P)，Delete (D) 和 All (\*)。

| CRD                                                                                                                                                                                                                                                                       | Admin | Edit | View |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ---- | ---- |
| <ul><li>`config.istio.io`</li><ul><li>`adapters`</li><li>`attributemanifests`<li>`handlers`</li><li>`httpapispecbindings`</li><li>`httpapispecs`</li><li>`instances`</li><li>`quotaspecbindings`</li><li>`quotaspecs`</li><li>`rules`</lli><li>`templates`</li></ul></ul> | GLW   | GLW  | GLW  |
| <ul><li>`networking.istio.io`</li><ul><li>`destinationrules`</li><li>`envoyfilters`<li>`gateways`</li><li>`serviceentries`</li><li>`sidecars`</li><li>`virtualservices`</li><li>`workloadentries`</li></ul></ul>                                                          | \*    | \*   | GLW  |
| <ul><li>`security.istio.io`</li><ul><li>`authorizationpolicies`</li><li>`peerauthentications`<li>`requestauthentications`</li></ul></ul>                                                                                                                                  | \*    | \*   | GLW  |
