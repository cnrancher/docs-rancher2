---
title: 日志审计
---

只有[管理员](/docs/rancher1/configurations/environments/access-control/_index#管理员)用户有权限访问审计日志。审计日志在**系统管理**->**审计日志**。

Rancher 的审计日志是不同事件类型的集合。

- 任何带有前缀`api`的事件是 API 的一次调用。事件类型将记录 API 操作，谁执行的操作以及 API 调用的方式(即通过 UI，通过 API 密钥)。
- 任何没有带`api`前缀的事件都是 Rancher Server 做的事情。例如，在协调服务的容器期间，在实例创建时会产生一个`instance.create`事件。
