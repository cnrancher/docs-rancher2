---
title: Docker命令运行Rancher
---

Rancher 整合了原生 Docker CLI，所以 Rancher 可以和其它 DevOps 和 Docker 工具同时使用。从高层次上，这意味着如果您在 Rancher 外启动、停止、或销毁一个容器，Rancher 能检测到相应的变化和更新。

## Docker 事件监控

Rancher 通过实时监控所有主机上 Docker 事件来更新自己的状态。因此，当容器在 Rancher 外启动、停止、或销毁时(比如，直接在主机上执行`docker stop sad_einstein`)，Rancher 能检测到这些变化和更新，并且相应地更新自己的状态。

> **注意:** 目前的一个局限是:我们要等到容器启动(而不是创建)才能把容器导入到 Rancher。 运行`docker create ubuntu`不会使相应的容器出现在 Rancher UI，但运行`docker start ubuntu`或`docker run ubuntu`会.

您可以在主机上运行`docker events`来观察 Docker 事件流。这个事件流就是 Rancher 正在监听的事件流。

## 添加 Docker 直接启动的容器到 Rancher 的网络

您可以在 Rancher 外启动容器，然后把它们添加到 Rancher 管理的网络中。 这意味着这些容器可以参与夸主机网络。要激活这个功能，创建容器时把`io.rancher.container.network`标签设为`true` 。下面是一个例子:

```bash
docker run -l io.rancher.container.network=true -itd ubuntu bash
```

请查阅[Rancher 中的网络](/docs/rancher1/rancher-service/networking/_index)了解更多关于 Rancher 管理的网络和夸主机网络的详情。

## 导入已有容器

Rancher 支持在注册主机的时候倒入已有的容器。当您用 Rancher UI 上的[自定义命令](/docs/rancher1/infrastructure/hosts/custom/_index)注册主机时， 任何当前在该主机上的容器都能被检测到，并且会被导入到 Rancher。

## 周期性同步状态

除了实时监控 Docker 事件之外，Rancher 还会周期性地和主机同步状态。每 5 秒钟主机就会向 Rancher 报告主机上的所有容器的状态，以保证 Rancher 中的状态和主机中的状态同步。这能够防止由于网络中断或服务器重启而导致 Rancher 遗漏某些 Docker 事件。 用这种方式来保持同步，主机上的容器的状态为单一数据源。比如, 如果 Rancher 认为一个容器正在运行，但它在主机上实际是停止的，Rancher 会把容器的状态更新为`停止`，但 Rancher 不会尝试重启容器。
