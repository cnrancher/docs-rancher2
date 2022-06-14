---
title: 审计日志中的用户 ID 跟踪
weight: 110
---

Rancher 使用以下审计日志来跟踪本地和下游集群中发生的事件：

* [Kubernetes 审计日志]({{<baseurl>}}/rke/latest/en/config-options/audit-log/)
* [Rancher API 审核日志]({{<baseurl>}}/rancher/v2.6/en/installation/resources/advanced/api-audit-log/)

Rancher 2.6 增强了审计日志，在 Rancher 和下游 Kubernetes 审计日志中都包含了外部身份提供程序名称（即外部身份提供程序中用户的通用名称）。

在 Rancher 2.6 之前，如果管理员不知道外部身份提供程序中的用户名和 Rancher 中的 userId (`u-xXXX`) 之间的映射，则无法通过 Rancher 审计日志和 Kubernetes 审计日志来追踪事件。
要知道这个映射，集群管理员需要能够访问 Rancher API、UI 和 local 管理集群。

有了这个功能之后，下游集群管理员就能够查看 Kubernetes 审计日志，并且可以不在 Rancher 中查看任何内容就能知道哪个外部身份提供程序 (IDP) 用户执行了某项操作。
如果集群传出了审计日志，日志系统的用户就能够识别外部身份提供程序中的用户。  
Rancher 管理员现在能够查看 Rancher 审计日志，并使用外部身份提供程序用户名来跟踪 Kubernetes 审计日志。

### 功能描述

- 在下游集群启用了 Kubernetes 审计日志后，会在“元数据”级别为每个请求记录外部身份提供程序的用户名。
- 在 Rancher 启用 Rancher API 审计日志后，每个到达 Rancher API Server 的请求记录（包括登录请求）对应的外部身份提供程序用户名也会记录在 `auditLog.level=1` 中。
