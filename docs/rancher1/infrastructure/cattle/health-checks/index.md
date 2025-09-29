---
title: 健康检查
---

Cattle 环境中，Rancher 通过运行一个叫`healthcheck`的基础设施服务部署了一套健康检查系统，其原理为在每台主机上部署了`healthcheck`的容器来实现分布式的健康检查。这些容器在内部利用 HAProxy 来检查应用的健康状态。一旦容器或服务上启用了健康检查，每个容器将最多被三个运行在不同主机上的`healthcheck` 容器监控起来。只要有一个 HAProxy 实例认为其状态正常，该容器将被视为正常。如果所有 HAProxy 实例都认为其状态不正常，该容器将被视为状态异常。

> **注意:** 该模式下唯一的例外为您的环境中只有一台主机，这种情况下健康检查将在同一台主机上被执行。

Rancher 利用了不同网络位置的主机进行健康检查，这种方式比基于客户端的健康检查更高效。利用 HAProxy 来进行健康检查，Rancher 使用户可以在服务和负载均衡上使用相同的健康检查策略。

> **注意:** 健康检查将只能在使用托管网络的服务上生效。如果您选择了其他的网络类型，该服务将不会被监控。

### 配置

可以通过如下选项来配置健康检查:

**检查类型**: 有两种检查方式 - _TCP 连接_ (只验证端口是否打开) 以及 _HTTP 响应 2xx/3xx_ (进行 HTTP 请求并确保收到正确的回复)。

**HTTP 请求**: 如果检查类型是 _HTTP 响应 2xx/3xx_, 您必须制定一个可以接受查询的 URL。 您可以选择方法 (`GET`, `POST`, etc) 以及 HTTP 版本 (`HTTP/1.0`, `HTTP/1.1`).

**端口**: 需要进行检查的端口

**初始化超时:** 在退出初始化之前等待的毫秒数。

**重新初始化超时:** 在退出重新初始化之前等待的毫秒数。

**检查间隔**: 在每次检查之间的时间间隔(毫秒)。

**检查超时**: 在检查未得到回复并超时之前等待的毫秒数。

**健康阈值**: 在一个不健康容器被标记为健康之前需要收到的健康检查回复的次数。

**不健康阈值**: 在健康容器被标记为不健康之前需要收到的健康检查回复的次数。

**不健康门槛**: T
当容器被认为是不健康时，有 3 种选择。`不进行操作`意味着容器将保持不健康状态。`重新创建`意味着 Rancher 会破坏不健康的容器并为服务创建一个新的容器。 `重新创建，仅当至少X个容器健康时`意味着如果有`X`多个容器健康，不健康的容器将被破坏并重新创建。

### 在 UI 中添加 Health Checks

对于[服务](/docs/rancher1/infrastructure/cattle/adding-services/)或[负载均衡](/docs/rancher1/infrastructure/cattle/adding-load-balancers/)，可以通过导航到**Health Check**选项卡来添加 Health check 服务。您可以检查服务的 TCP 连接或 HTTP 响应，并更改 health check 配置的默认值。

### 通过 Rancher Compose 添加 Health Checks

使用[Rancher Compose](/docs/rancher1/infrastructure/cattle/rancher-compose/)，health checks 能添加在`rancher-compose.yml`文件中。

在我们的示例中，如果容器发现不健康，我们会显示三种不同策略的健康检查配置。

```yml
version: "2"
services:
  service1:
    scale: 1
    health_check:
      # Which port to perform the check against
      port: 80
      # For TCP, request_line needs to be '' or not shown
      # TCP Example:
      # request_line: ''
      request_line: GET /healthcheck HTTP/1.0
      # Interval is measured in milliseconds
      interval: 2000
      initializing_timeout: 60000
      unhealthy_threshold: 3
      # Strategy for what to do when unhealthy
      # In this service, no action will occur when a container is found unhealthy
      strategy: none
      healthy_threshold: 2
      # Response timeout is measured in milliseconds
      response_timeout: 2000
  service2:
    scale: 1
    health_check:
      # Which port to perform the check against
      port: 80
      # Interval is measured in milliseconds
      interval: 2000
      initializing_timeout: 60000
      reinitializing_timeout: 60000
      unhealthy_threshold: 3
      # Strategy for what to do when unhealthy
      # In this service, Rancher will recreate any unhealthy containers
      strategy: recreate
      healthy_threshold: 2
      # Response timeout is measured in milliseconds
      response_timeout: 2000
  service3:
    scale: 1
    health_check:
      # Which port to perform the check against
      port: 80
      # Interval is measured in milliseconds
      interval: 2000
      initializing_timeout: 60000
      unhealthy_threshold: 3
      # Strategy for what to do when unhealthy
      # In this service, Rancher will recreate any healthy containers only if there   is at least 1 container
      # that is healthy
      strategy: recreateOnQuorum
      recreate_on_quorum_strategy_config:
        quorum: 1
      healthy_threshold: 2
      # Response timeout is measured in milliseconds
      response_timeout: 2000
```

### 故障情况

| 状况                                                                         | 响应                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 被监测的容器停止响应 Health check。                                          | 所有的 HAProxy 实例将检测到故障，并将容器标记为“不健康”。如果容器是服务的一部分，则 Rancher 通过其服务 HA 功能将服务恢复到其预定义的规模。                                                                                                                                                                                                                                   |
| 运行启用来健康检查的容器的主机失去了网络连接或该主机上的代理失去了网络链接。 | 当主机丢失网络连接时，与 Rancher 服务连接的 Rancher 代理也会丢失网络连接。 由于代理不可访问，主机被标记为“重新连接”。这样我们知道了 Rancher Server 无法连接到该主机的主机代理。对 Rancher 的健康检查是针对容器本身而不是主机完成的; 因此，容器将无法被所有活动的 HAProxy 实例访问。如果容器是服务的一部分，则 Rancher 通过其服务 HA 功能将服务恢复到其预定义的规模。         |
| 运行启用了健康检查的容器的主机完全故障。                                     | 当主机遇到完全故障(如断电)时，与 Rancher 服务连接的 Rancher 代理也会丢失网络连接。 由于代理不可访问，主机被标记为“重新连接”。这样我们知道了 Rancher Server 无法连接到该主机的主机代理。对 Rancher 的健康检查是针对容器本身而不是主机完成的; 因此，容器将无法被所有活动的 HAProxy 实例访问。如果容器是服务的一部分，则 Rancher 通过其服务 HA 功能将服务恢复到其预定义的规模。 |
| 主机的代理失败，但主机保持在线，容器正在运行，并且正在进行健康检查。         | 在这种情况下，与 Rancher 服务连接的 Rancher 代理也会丢失网络连接。 由于代理不可访问，主机被标记为“重新连接”。这样我们知道了 Rancher Server 无法连接到该主机的主机代理。对 Rancher 的健康检查是针对容器本身而不是主机完成的; 因此，容器将无法被所有活动的 HAProxy 实例访问。如果容器是服务的一部分，则 Rancher 通过其服务 HA 功能将服务恢复到其预定义的规模。                 |

根据 health check 的结果容器会被标记成绿色或红色状态，
根据健康检查的结果，会判断容器是处于绿色或红色状态。如果运行该服务的所有容器处于绿色状态，该服务就处于绿色(或“运行”)的状态。如果运行该服务所有容器都处于红色状态，则服务处于红色(或“停止”)状态。如果 Rancher 检测到至少一个容器是处于红色状态或正在要变为绿色状态，该服务会处于黄色(或“退化”)的状态。

检测故障所用的时间是通过“间隔”值进行控制的，该值是通过 compose 或 UI 创建健康检查时定义的。

> **注意:** 故障恢复操作仅在容器状态变为绿色后执行。也就是说，如果服务的启动时间很长，则容器将不会立即重新启动，因为服务需要超过 2000ms 才能启动。健康检查首先需要在采取任何其他行动之前将容器变绿。
