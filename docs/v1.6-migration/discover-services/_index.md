---
title: '6、服务发现'
---

服务发现是任何基于容器环境的核心功能之一。一旦打包并启动应用程序后，下一步就是使您的环境或外部环境中的其他容器可以发现它。本文档将描述如何使用 Rancher v2.x 提供的服务发现支持让您可以用名称找到它们。

本文还将向您展示当迁移到 Rancher v2.x 时，如何连接工作负载和服务。使用迁移工具 CLI 从 v1.6 解析服务时，它将为每个服务输出两个文件：一个部署清单和一个服务清单。您必须将这两个文件连接在一起，这样部署才能在 v2.x 中正常运行。

<figcaption>解决“output.text”中的“links”问题</figcaption>

![解析连接指令](/img/rancher/resolve-links.png)

## 服务发现: Rancher v1.6 vs. v2.x

对于 Rancher v2.x，我们已将 v1.6 中使用的 Rancher DNS 微服务替换为本地[Kubernetes DNS 支持](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)，它为 Kubernetes 工作负载和 pods 提供了等效的服务发现。前 Cattle 用户可以在 v2.x 中使用 Rancher v1.6 中的所有服务发现功能。并且不会有功能损失。

Kubernetes 在集群中部署了 DNS pod 和服务，这类似于[Rancher v1.6 DNS 微服务](https://docs.rancher.com/docs/rancher/v1.6/en/cattle/internal-dns-service/#internal-dns-service-in-cattle-environments)。Kubernetes 将配置它的 kubelet，从而将全部的 DNS 查询请求都转到那个 DNS 服务（例如 kube-dns 和 core-dns 等）上。

下表显示了两个 Rancher 版本中可用的每个服务发现功能。

| 服务发现功能                                      | Rancher v1.6 | Rancher v2.x | 描述                                                                                      |
| ------------------------------------------------- | ------------ | ------------ | ----------------------------------------------------------------------------------------- |
| [堆栈内部和堆栈之间的服务发现][1] (例如 clusters) | ✓            | ✓            | 堆栈内服务均可通过`<service_name>`访问，堆栈间可以通过`<service_name>.<stack_name>`访问。 |
| [容器发现][2]                                     | ✓            | ✓            | 所有容器都可以通过其名称全局可见。                                                        |
| [创建服务别名][3]                                 | ✓            | ✓            | 向服务添加别名，并使用别名连接到其他服务。                                                |
| [发现外部服务][4]                                 | ✓            | ✓            | 指向在 Rancher 外部部署的服务并使用外部 IP 或域名。                                       |

[1]: #命名空间内和跨命名空间的服务发现
[2]: #容器发现
[3]: #创建服务别名
[4]: #创建服务别名

## 命名空间内和跨命名空间的服务发现

在 v2.x 中创建*新*工作负载时 (不是迁移的，更多内容查看[下面](#连接迁移的工作负载和服务))，Rancher 会自动创建一个具有相同名称的服务，然后将服务和工作负载连接在一起。如果未显式公开端口，则使用默认端口`42`。这种做法使工作负载可以通过名称在命名空间内和命名空间之间被发现。

## 容器发现

在 Kubernetes 集群中运行的每个 pod 也将获得一个 DNS。这个 DNS 也用点表示法： `<POD_IP_ADDRESS>.<NAMESPACE_NAME>.pod.cluster.local`。例如，一个在`default`命名空间中，DNS 名称为 `cluster.local`，IP 是`10.42.2.7`的 pod 的 DNS 为 `10-42-2-7.default.pod.cluster.local`。

如果在 pods spec 中进行了设置，也可以使用 hostname 和 subdomain 字段解析 pods。有关此解析的详细信息，请参见[Kubernetes 文档](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)。

## 连接迁移的工作负载和服务

当将 v1.6 服务迁移到 v2.x 时，Rancher 不会自动为每个迁移的部署创建 Kubernetes 服务。相反，您必须使用下面列出的一些方法将部署和服务手动连接在一起。

在下图中，`web-deployment.yml` 和 `web-service.yml` 文件连接在一起。

<figcaption>连接工作负载和Kubernetes服务</figcaption>

![连接的工作负载和Kubernetes服务](/img/rancher/linked-service-workload.png)

## 创建服务别名

正如您可以为 Rancher v1.6 服务创建别名一样，您也可以为 Rancher v2.x 工作负载执行相同的操作。同样，您也可以使用主机名或 IP 地址创建指向外部运行的服务的 DNS 记录。这些 DNS 记录是 Kubernetes 服务对象。

使用 v2.x UI，在菜单中导航至 `Project` 视图. 然后单击 **资源 > 工作负载 > 服务发现**。 (在 v2.3.0 之前的版本中，单击 **工作负载 > 服务发现** 选项卡。) 为工作负载创建的所有 DNS 记录，根据命名空间，分组显示在该页。

单击 **添加记录** 以创建新的 DNS 记录。支持连接到外部服务或为另一个工作负载，DNS 记录或 Pod 组创建别名。

<figcaption>添加服务发现记录</figcaption>

![添加服务发现记录](/img/rancher/add-record.png)

下表指出了哪些别名选项由 Kubernetes 实现，哪些选项由 Rancher 利用 Kubernetes 实现。

| 选项                       | Kubernetes 实现? | Rancher 实现? |
| -------------------------- | ---------------- | ------------- |
| 指向外部主机名             | ✓                |               |
| 指向与选择器匹配的一组 pod | ✓                |               |
| 指向外部 IP 地址           |                  | ✓             |
| 指向另一个工作负载         |                  | ✓             |
| 指向另一个 DNS 记录的别名  |                  | ✓             |

## [下一步: 负载均衡](/docs/v1.6-migration/load-balancing/_index)
