---
shortTitle: 基于角色的访问控制
title: Logging 的 RBAC
weight: 3
---

Rancher Logging 有两个角色，分别是 `logging-admin` 和 `logging-view`。

- `logging-admin` 允许用户完全访问命名空间的 `Flow` 和 `Output`。
- `logging-view` 允许用户*查看*命名空间的 `Flow` 和 `Output`，以及 `ClusterFlow` 和 `ClusterOutput`。

> **为什么选择一个角色而不是另一个角色**：对 `ClusterFlow` 和 `ClusterOutput` 资源的编辑权限非常强大。任何拥有该权限的用户都能编辑集群中的所有日志。

在 Rancher 中，集群管理员角色是唯一可以完全访问所有 `rancher-logging` 资源的角色。集群成员无法编辑或读取任何 Logging 资源。项目所有者和成员具有以下权限：

| 项目所有者 | 项目成员 |
--- | ---
| 能够在其项目命名空间中创建命名空间级别的 `Flow` 和 `Output` | 只能查看项目命名空间中的 `Flow` 和 `Output` |
| 可以从项目命名空间中收集任何日志 | 无法在其项目命名空间中收集任何日志 |

如果项目所有者和项目成员需要使用 Logging，他们需要在项目中至少有*一个*命名空间。如果没有，他们可能看不到顶部导航下拉列表中的 Logging 按钮。