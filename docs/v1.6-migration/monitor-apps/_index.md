---
title: 4、健康检查
description: Rancher v1.6 使用其自身的健康检查微服务在您的节点和服务上提供 TCP 和 HTTP 健康检查。这些健康检查监控您的容器，以确认它们是否按预期运行。如果一个容器没有通过健康检查，Rancher 将销毁不健康的容器，然后复制一个健康的容器来替换它。对于 Rancher v2.x，我们已取代了健康检查微服务，而是利用 Kubernetes 原生的健康检查进行支持。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 版本迁移
  - 负载均衡
---

Rancher v1.6 使用其自身的健康检查微服务在您的节点和服务上提供 TCP 和 HTTP 健康检查。这些健康检查监控您的容器，以确认它们是否按预期运行。如果一个容器没有通过健康检查，Rancher 将销毁不健康的容器，然后复制一个健康的容器来替换它。

对于 Rancher v2.x，我们已取代了健康检查微服务，而是利用 Kubernetes 原生的健康检查进行支持。

使用本文档修改 Rancher v2.x 的工作负载和服务并在 `output.txt`中列出`health_check`. 您可以通过配置活性探针（即健康检查）来修正它们。

例如，对于下面的图像，我们将为 `web` 和 `weblb` 工作负载配置活性探针（即迁移工具 CLI 输出的 Kubernetes 清单）。

<figcaption>
为“webLB”工作负载和“web”工作负载解决“health_check”问题
</figcaption>

![解析 health_check](/img/rancher/resolve-health-checks.png)

### Rancher v1.6 中的健康检查

在 Rancher v1.6 中，您可以添加健康检查来监控特定服务的操作。这些检查由 Rancher 健康检查微服务执行，该服务在与托管受监控服务的节点不同的节点容器中启动（但是，Rancher v1.6.20 和更高版本也运行本地健康状况检查容器，作为另一个节点上主健康检查容器的冗余）。健康检查设置存储在您堆栈的`rancher-compose.yml`文件中。

健康检查微服务具有两种类型的健康检查，它们具有超时，检查间隔等各种选项：

- **TCP 健康状况检查**:

  这些健康检查将检查是否在指定端口为受监控服务打开了 TCP 连接。有关详细信息，请参见 [Rancher v1.6 文档](https://docs.rancher.com/docs/rancher/v1.6/en/cattle/health-checks/)。

- **HTTP 健康状况检查**:

  这些健康检查会监控对指定路径的 HTTP 请求，并检查响应是否为预期响应（与健康检查一起配置）。

  下图显示了健康检查微服务，该服务评估运行 Nginx 的容器。请注意，微服务正在跨节点进行检查。

  ![Rancher v1.6 健康状况检查](/img/rancher/healthcheck.svg)

## Rancher v2.x 健康检查

在 Rancher v2.x 中，健康检查微服务已被 Kubernetes 原生的健康检查机制*探针*取代。这些探针类似于 Rancher v1.6 健康检查微服务，可监控 Pod 上 TCP 和 HTTP 的运行状况。

但是，Rancher v2.x 中的探针有一些重要的区别，如下所述。有关探针的完整详细信息，请参见 [Kubernetes 文档](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/#configure-probes).

### 本地健康检查

与 Rancher v1.6 跨主机执行的健康检查不同，Rancher v2.x 中的探针发生在由 kubelet 执行的*相同*主机上。

### 多种探针类型

Kubernetes 包含两种不同的探针类型：活性检查和就绪检查。

- **活性检查**:

  检查受监控的容器是否正在运行。如果探针报告失败，则 Kubernetes 将杀死 Pod，然后根据部署重新启动它[重新启动策略](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)。

- **就绪检查**:

  检查容器是否准备好接受和服务请求。如果探针报告失败，则从公众中隔离该 pod，直到其自愈为止。

  下图显示了 kubelet 在它们正在监控的容器上运行探针([kubelets](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/)是在每个节点上运行的主要 "agent")。左侧的节点正在运行活性探针，而右侧的节点正在运行就绪检查。请注意，kubelet 正在扫描其主机节点上的容器，而不是像 Rancher v1.6 中那样跨节点扫描容器。

  ![Rancher v2.x 探针](/img/rancher/probes.svg)

## 在 Rancher v2.x 中配置探针

[迁移工具 CLI](/docs/v1.6-migration/run-migration-tool/_index) 无法将健康检查从 Compose 文件解析为 Kubernetes 清单。因此，如果要向 Rancher v2.x 工作负载添加健康检查，则必须手动添加它们。

使用 Rancher v2.x UI 可以向 Kubernetes 工作负载添加 TCP 或 HTTP 健康检查。默认情况下，Rancher 要求您为工作负载配置就绪检查，并使用相同的配置应用活性检查。可选，您可以定义单独的活性检查。

如果探针报告失败，那么将根据工作负载规范中定义的重新启动策略重新启动容器。此设置等效于 Rancher v1.6 中的健康检查的策略参数。

编辑`output.txt`中调用的 deployments 时，使用**健康检查**部分配置探针。

<figcaption>编辑部署：健康检查部分</figcaption>

![状况健康检查部分](/img/rancher/health-check-section.png)

### 配置检查

使用 Rancher v2.x 创建工作负载时，建议您配置检查以监控部署的 Pod 的运行状况。

- TCP 检查

  TCP 检查通过尝试指定的端口打开并与 Pod 的连接来监控部署的运行状况。如果探针可以打开端口，则认为它是健康的。未能打开它被认为是不健康的，这会通知 Kubernetes 应该杀死该 pod，然后根据[重新启动策略](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)更换它。(这仅适用于活性探。对于就绪探针，它将标记 pod 为未就绪)。

  您可以通过选择**健康检查**部分中的**TCP 连接成功打开**选项来配置探针以及指定对应行为的值。有关更多信息，请参阅[部署工作负载](/docs/k8s-in-rancher/workloads/deploy-workloads/_index)。有关设置探针超时和阈值的帮助，请参见[健康检查参数映射](#健康检查参数映射)。

  ![TCP 检查](/img/rancher/readiness-check-tcp.png)

  使用 Rancher v2.x 配置就绪检查时，会将`readinessProbe`指令和您设置的值添加到部署的 Kubernetes 清单中。配置就绪检查还会自动向部署中添加活性检查（`livenessProbe`）。

- HTTP 检查

  HTTP 检查通过将 HTTP GET 请求发送到您定义的特定 URL 路径来监控部署的运行状况。如果 pod 响应的消息范围为`200`-`400`，则认为健康检查成功。如果 Pod 回复了其他任何值，则认为检查不成功，因此 Kubernetes 将终止并根据 Pod 的[重新启动策略](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)替换 Pod。(这仅适用于活性探针。对于就绪探针，它将标记容器为未就绪)。

  您可以通过选择**HTTP 返回成功状态**或**HTTPS 返回成功状态**来配置探针以及用于指定对应行为的值。有关更多信息，请参见[部署工作负载](/docs/k8s-in-rancher/workloads/deploy-workloads/_index)。有关设置探针超时和阈值的帮助，请参见[健康检查参数映射](#健康检查参数映射)。

  ![HTTP 检查](/img/rancher/readiness-check-http.png)

  使用 Rancher v2.x 配置就绪检查时，会将`readinessProbe`指令和您设置的值添加到部署的 Kubernetes 清单中。配置就绪检查还会自动向部署中添加活性检查（`livenessProbe`）。

### 配置单独的活性检查

在为 TCP 或 HTTP 协议配置就绪检查时，您可以通过单击**定义单独的活性检查**来配置单独的活性检查。有关设置探针超时和阈值的帮助，请参阅[健康检查参数映射](#健康检查参数映射)。

![单独的活性检查](/img/rancher/separate-check.png)

### 其他探针选项

与 v1.6 一样，Rancher v2.x 允许您使用 TCP 和 HTTP 协议执行健康检查。但是，Rancher v2.x 还允许您通过在 Pod 内运行命令来检查其状态。如果在运行该命令后容器以代码`0`退出，则该容器被认为是健康的。

您可以配置活性检查或就绪检查，以执行指定的命令，方法是在[部署工作负载](/docs/k8s-in-rancher/workloads/deploy-workloads/_index)时，从 **健康检查** 中选择`容器中进程退出状态码检查(0)`。

![健康检查执行命令](/img/rancher/healthcheck-cmd-exec.png)

### 健康检查参数映射

在配置就绪检查和活性检查时，Rancher 会提示您填写各种超时和阈值，这些值和值确定探针是成功还是失败。下表中的参考表显示了 Rancher v1.6 中的等效健康检查值。

| Rancher v1.6 构成参数  | Rancher v2.x Kubernetes 参数 |
| ---------------------- | ---------------------------- |
| `port`                 | `tcpSocket.port`             |
| `response_timeout`     | `timeoutSeconds`             |
| `healthy_threshold`    | `failureThreshold`           |
| `unhealthy_threshold`  | `successThreshold`           |
| `interval`             | `periodSeconds`              |
| `initializing_timeout` | `initialDelaySeconds`        |
| `strategy`             | `restartPolicy`              |

## [下一步: 调度服务](/docs/v1.6-migration/schedule-workloads/_index)
