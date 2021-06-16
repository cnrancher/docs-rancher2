---
title: 基于角色的访问控制
description: Rancher 日志有两个角色，`logging-admin`和`logging-view`。
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
  - 日志服务
  - Rancher v2.5 的日志功能
  - 基于角色的访问控制
---

Rancher 日志有两个角色，`logging-admin`和`logging-view`。

- `logging-admin`让用户可以完全访问被命名的`流量'和`Output`。
- `logging-view`允许用户查看命名的`Flow`和`Output`，以及`ClusterFlow`和`ClusterOutput`。

> **为什么选择一个角色而不是另一个？**对`ClusterFlow`和`ClusterOutput`资源的编辑权限是强大的。任何拥有它的用户对集群中的所有日志都有编辑权限。
> 在 Rancher 中，集群管理员角色是唯一对所有`rancher-logging`资源有完全访问权的角色。集群成员不能编辑或读取任何日志资源。项目所有者和成员有以下权限。

| 项目所有者                                         | 成员                                         |
| :------------------------------------------------- | :------------------------------------------- |
| 能够在其项目的命名空间中创建命名的`Flow`和`Output` | 只能在项目的命名空间中查看`Flow`和`Output`。 |
| 可以收集其项目名称空间中任何东西的日志             | 不能收集其项目名称空间中的任何日志           |

项目所有者和项目成员都需要在他们的项目中至少有*1*个命名空间来使用日志记录。如果他们不这样做，那么他们可能不会看到顶部导航下拉菜单中的日志按钮。
