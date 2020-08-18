---
title: "3、暴露服务"
description: 在测试环境中，通常需要使用未发布的 IP 和端口号将外部流量路由到集群容器，以便用户能够访问其应用程序。您可以使用端口映射来实现此目标，只要您知道节点 IP 地址，该映射就会通过特定端口暴露工作负载（即服务）。您可以使用 HostPorts（在单个节点的指定端口上公开服务）或 NodePorts（在单个端口的*所有*节点上公开服务）映射端口。使用本文档修改在`output.txt`中列出`ports`的工作负载。您可以通过设置 HostPort 或 NodePort 来修改它。
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
  - 暴露服务
---

在测试环境中，通常需要使用未发布的 IP 和端口号将外部流量路由到集群容器，以便用户能够访问其应用程序。您可以使用端口映射来实现此目标，只要您知道节点 IP 地址，该映射就会通过特定端口暴露工作负载（即服务）。您可以使用 HostPorts（在单个节点的指定端口上公开服务）或 NodePorts（在单个端口的*所有*节点上公开服务）映射端口。

使用本文档修改在`output.txt`中列出`ports`的工作负载。您可以通过设置 HostPort 或 NodePort 来修改它。

<figcaption>
为“web”工作负载解决“ports”问题
</figcaption>

![解析端口](/img/rancher/resolve-ports.png)

## 在 Rancher v2.x 中公开服务有何不同?

在 Rancher v1.6 中，我们使用了*Port Mapping*来公开您和您的用户可以访问服务的 IP 地址和端口。

在 Rancher v2.x 中，暴露服务的机制和术语已更改和扩展。现在，您有两个端口映射选项：_HostPorts_（与 v1.6 端口映射最相似，允许您将应用程序暴露在单个 IP 和端口上）和*NodePorts*（允许您在集群*所有*节点上映射端口， 不只是一个）。

可惜的是，迁移工具 CLI 无法解析端口映射。如果要从 v1.6 迁移到 v2.x 的服务有端口映射，则必须设置[HostPort](#什么是-hostport？)或[NodePort](#什么是-nodeport？)作为替代。

## 什么是 HostPort？

_HostPort_ 是在运行一个或多个 Pod 的节点上上向公众暴露的端口。到节点和公开端口（`<HOST_IP>：<HOSTPORT>`）的流量将路由到相应的容器端口。在 Rancher v2.x 中为 Kubernetes Pod 使用 HostPort 与在 Rancher v1.6 中为容器创建公共端口映射同义。

在下图中，用户试图访问 Nginx 实例，该实例在端口 80 的 Pod 中运行。但是，Nginx 部署的 HostPort 为 9890。用户可以通过浏览其主机 IP 地址加上正在使用的 HostPort 来连接到此 Pod（当前例子是 9890 端口）。

![HostPort图解](/img/rancher/hostPort.svg)

#### HostPort 优点

- 主机上可用的任何端口都可以暴露。
- 配置很简单，并且可以在 Kubernetes pod 规范中直接设置 HostPort。与 NodePort 不同，无需创建其他对象即可公开您的应用程序。

#### HostPort 缺点

- 限制 Pod 的调度选项，仅能使用所选端口处于空闲状态的主机。
- 如果工作负载规模大于 Kubernetes 集群中的节点数，则部署将失败。
- 指定相同 HostPort 的任何两个工作负载无法部署到同一节点。
- 如果您的 Pod 运行所在的主机不可用，Kubernetes 会将 Pod 重新调度到其他节点。因此，如果您的工作负载的 IP 地址发生更改，则应用程序的外部客户端将失去对 Pod 的访问权限。当您重新启动 Pod 时，也会发生同样的事情，Kubernetes 会将其重新调度到另一个节点。

## 设置 HostPort

您可以使用 Rancher v2.x UI 为已迁移的工作负载（即服务）设置 HostPort。要添加 HostPort，请浏览到包含您的工作负载的项目，然后编辑要公开的每个工作负载，如下所示。将服务容器公开的端口映射到目标节点上公开的 HostPort。

例如，对于我们一直用作示例的从 v1.6 解析的 web-deployment.yml 文件，我们将编辑其 Kubernetes 清单，设置发布容器使用的端口，然后声明一个监听 HostPort 的端口。所选择的端口(`9890`)，如下所示。然后，您可以通过单击 Rancher UI 中创建的链接来访问工作负载。

<figcaption>
端口映射：设置 HostPort
</figcaption>

![设置HostPort](/img/rancher/set-hostport.gif)

## 什么是 NodePort？

*NodePort*是向*每一个*集群节点开放的端口。当任何集群主机 IP 地址收到向 NodePort 指定的端口的请求时，NodePort（这是一个 Kubernetes 服务）会将流量路由到特定的 Pod，而不管它在哪个节点上运行。NodePort 提供了一个静态端点，外部请求可以可靠地到达您的 Pod。

NodePorts 可帮助您规避 IP 地址的缺点。尽管可以通过 pod 的 IP 地址访问 Pod，但它们本质上是一次性的。pod 通常会被销毁并重新创建，每次重建都会获得一个新的 IP 地址。因此，pod IP 地址不是访问 pod 的可靠方法。NodePorts 通过提供始终可以访问它们的静态服务来帮助您解决此问题。即使您的 pod 更改了其 IP 地址，依赖于它们的外部客户端也可以继续访问它们而不会受到干扰，也不会感知到后端 pod 重新创建了。

在下图中，用户试图连接到 Rancher 管理的 Kubernetes 集群中运行的 Nginx 实例。尽管他知道 NodePort Nginx 正在运行（在这种情况下为 30216），但他不知道 Pod 在哪台节点上允许。但是，启用 NodePort 后，他可以使用集群中*任何*节点的 IP 地址连接到 Pod。Kubeproxy 会将请求转发到正确的节点和 Pod。

![NodePort图解](/img/rancher/nodePort.svg)

NodePort 在 Kubernetes 集群中的节点的内部 IP 可用。如果要在集群外部公开 Pod，请结合使用 NodePort 和外部负载均衡器。来自集群外部对 `<NodeIP>:<NodePort>` 的流量请求将定向到工作负载。`<NodeIP>` 可以是 Kubernetes 集群中任何节点的 IP 地址。

#### NodePort 优点

- 创建 NodePort 服务为您的工作负载容器提供了一个静态的公共端点。在那里，即使 Pod 已被破坏，Kubernetes 也可以在集群中的任何位置部署工作负载，而无需更改公共端点。
- Pod 的规模不受集群中节点数量的限制。NodePort 允许将公共访问与 Pod 的数量和位置分离。

#### NodePort 缺点

- 使用 NodePort 时，`<NodeIP>:<NodePort>`将在您的 Kubernetes 集群中所有节点上预留，即使工作负载从未部署到其他节点。
- 您只能在可配置范围内指定端口 (默认, 是 `30000-32767` 之间)。
- 需要一个额外的 Kubernetes 对象（类型为 NodePort 的 Kubernetes 服务）来暴露您的工作负载。因此，找到应用程序的暴露方式并不直接。

## 设置 NodePort

您可以使用 Rancher v2.x UI 为迁移的工作负载（即服务）设置 NodePort。要添加 NodePort，请浏览到包含您的工作负载的项目，然后编辑要公开的每个工作负载，如下所示。将服务容器公开的端口映射到 NodePort，您可以通过每个集群节点访问该端口。

例如，对于从我们一直用作示例的 v1.6 解析的`web-deployment.yml`文件，我们将编辑其 Kubernetes 清单，设置发布容器使用的端口，然后声明一个 NodePort。然后，您可以通过单击 Rancher UI 中创建的链接来访问工作负载。

> **注意:**
>
> - 如果设置 NodePort 时未指定其值，则 Rancher 将从以下范围内随机选择一个端口： `30000-32767`。
> - 如果您手动设置 NodePort，则端口必须在 `30000-32767` 之间。

<figcaption>
端口映射：设置 NodePort
</figcaption>

![设置NodePort](/img/rancher/set-nodeport.gif)

## [下一步: 配置健康检查](/docs/rancher2/v1.6-migration/monitor-apps/_index)
