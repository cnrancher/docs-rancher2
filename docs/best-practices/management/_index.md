---
title: 关于规模，安全，可靠性的建议
description: Rancher 允许您设置许多配置组合。有些配置更适合于开发和测试，而对于生产环境，还有其他一些最佳实践可以获得最大的可用性和容错能力。生产应该遵循以下最佳实践。这些建议可以帮助您在问题发生之前解决它们。
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
  - 最佳实践
  - 关于规模，安全，可靠性的建议
---

Rancher 允许您设置许多配置组合。有些配置更适合于开发和测试，而对于生产环境，还有其他一些最佳实践可以获得最大的可用性和容错能力。生产应该遵循以下最佳实践。

## 预防和处理问题的提示

这些建议可以帮助您在问题发生之前解决它们。

### 在支持的 OS 和 Docker 版本上运行 Rancher

Rancher 是基于容器的，可以在任何基于 linux 的操作系统上运行。但是，您应该只在[需求文档](/docs/installation/requirements/_index)中列出的操作系统以及支持的 Docker 版本上运行 Rancher。这些版本经过了最彻底的测试，可以得到 Rancher 支持团队的适当支持。

### 升级 Kubernetes 版本

保持您的 Kubernetes 集群与最新的和受支持的版本保持同步。通常 Kubernetes 社区将支持当前版本和之前的三个小版本(例如: 1.14.x, 1.13.x, 1.12.x 和 1.11.x)。新版本发布后，之前的第四个支持版本达到 EOL(生命结束)状态，如果发现了安全问题并且没有可用的补丁，那么在 EOL 版本上运行可能会有风险。社区通常每个季度(每三个月)发布一些小版本。

Rancher 的 SLA 不依赖于社区，但由于 Kubernetes 是一个社区驱动的软件，当您离社区支持的目标越来越远时，体验的质量就会下降。

### 在测试中随机杀死 Pod

运行 chaoskube 或类似的机制，在测试环境中随机杀死 Pod。这将测试您的基础设施的弹性和 Kubernetes 的自愈能力，但不建议在您的生产环境中运行它。

### 使用 Terraform 部署复杂的集群

Rancher UI 的 `添加集群` 更适合于使用 Kubernetes 集群的初级阶段或简单的用例。但是，对于更复杂或要求更高的用例，建议使用 CLI/API 驱动的方法。我们建议使用 [Terraform](https://www.terraform.io/) 作为实现此功能的工具。当您使用带有版本控制和 CI/CD 环境的 Terraform 时，您可以在部署 Kubernetes 集群时获得高度的一致性和可靠性保证。这种方法还提供了最多的定制选项。

Rancher 维护的 [Terraform Provider](https://rancher.com/blog/2019/rancher-2-terraform-provider/) 用于部署 Rancher 2.x 中的集群，它被称为[Rancher2 Provider](https://www.terraform.io/docs/providers/rancher2/index.html)。

### 预生产环境中升级 Rancher

所有的升级，包括补丁和功能升级，都应该在升级产品之前先在预生产环境中进行测试。预生产环境越接近生产环境，您的生产升级成功的机会就越大。

### 更新集群证书

您组织中的多个人应为续订证书设置日历提醒。考虑提前两周到一个月更新证书。如果要跟踪多个证书，请考虑使用监控和告警机制来跟踪证书到期。

由 Rancher 提供的 Kubernetes 集群将使用在十年内到期的证书。通过其他方式配置的集群的到期时间可能更长或更短。

对于通过 Rancher 创建的 Kubernetes 集群，证书可以通过 Rancher [用户界面](/docs/cluster-admin/certificate-rotation/_index)进行更新。

### 集群启用循环快照

确保启用 etcd 循环快照， 将快照保持时间延长到满足业务需求的一段时间。在发生灾难性故障或数据删除时，这可能是您进行恢复的惟一途径。有关配置快照的详细信息，请参阅 [RKE 文档](https://rancher.com/docs/rke/latest/en/etcd-snapshots/) 或者 [Rancher 备份](/docs/backups/_index)。

### Rancher 部署 Kubernetes 集群

如果可能，使用 Rancher 来部署您的 Kubernetes 集群，而不是导入集群。这将确保最佳的兼容性和可支持性。

### 使用稳定的和受支持的 Rancher 版本进行生产部署

不要将生产环境升级到 alpha、beta、rc 或`latest`版本，这些版本通常不稳定，而且可能没有未来的升级路径。

在将非生产环境安装或升级到早期版本时，要预料到一些问题，如功能无法工作、数据丢失、宕机以及无法在不重新安装的情况下升级。

确保您在生产环境中使用 `stable` 版本，可以在测试、开发或演示环境中使用 beta、rc 和`latest`版本来尝试新功能特性。一些 bug 修复和大多数功能都没有移植到旧版本中，所以在大版本发布时，例如 2.1.x 到 2.2 x，应该考虑进行升级。

请记住，Rancher 也有 EOL。在一段时间后，我们会终止对旧版本的支持，所以您需要通过升级来更新补丁或者功能。

有关 Rancher 产品生命周期的更多细节，请参考[技术支持条款](https://rancher.com/support-maintenance-terms/)。

## 网络拓扑结构

这些提示可以帮助 Rancher 更顺利的在您的网络中运行。

### 在集群中使用低延迟网络进行通信

Kubernetes 集群最好使用低延迟网络。对于control plane组件和 etcd 尤其如此，在 etcd 中会出现大量的协调和领袖选举流量。Rancher Server 和它管理的 Kubernetes 集群之间的网络对延迟的容忍度更高。

### 允许 Rancher 直接与 Kubernetes 集群通信

避免 Rancher Server 和 Kubernetes 集群之间使用代理或负载均衡器。由于 Rancher 维持的是长生命周期的 web sockets 连接，这些中间件可能会干扰连接的生命周期，因为它们通常没有考虑到这个用例。

## 关于规模和可靠性的提示

这些技巧可以帮助您更轻松地扩展集群。

### 每个主机使用一个 Kubernetes 角色

将 etcd、control plane 和 worker 角色分离到不同的主机上。不要将多个角色分配给同一台主机，如 control plane 和 worker 角色在一起，这将为您提供最大的可扩展性。

### 在虚拟机上运行 control plane 和 etcd

在虚拟机上运行 etcd 和 control plane 节点，如果将来需要，您可以轻松地扩展 CPU 和内存。

### 至少使用三个 etcd 节点

使用 3 或 5 个 etcd 节点。Etcd 需要一个 quorum 来通过大多数节点来确定 leader，因此不建议使用偶数集群。对于较小的集群，三个 etcd 节点就足够了，对于大型集群，五个 etcd 节点就足够了。

### 使用至少两个control plane节点

提供两个或多个control plane节点。一些control plane组件，比如：`kube-apiserver`，运行在[双活](https://www.jscape.com/blog/active-active-vs-active-passive-high-availability-cluster) 模式下，将为您提供更多的规模。其他组件，如`kube-scheduler`和`kube-controller`运行在`主被`模式下，提供更多的容错。

### 监控集群

根据需要密切监控和扩展节点。您应该启用[集群监控](/docs/cluster-admin/tools/monitoring/_index)并使用 Prometheus 指标和 Grafana 可视化选项。

## 安全提示

下面是一些提高 Rancher 安全的基本技巧。有关保护集群的更详细信息，请参考以下参考资料:

- Rancher 的[Kubernetes 安全加固指南](/docs/security/_index)
- [Kubernetes 安全最佳实践](https://rancher.com/blog/2019/2019-01-17-101-more-kubernetes-security-best-practices/)

### 更新 Rancher 安全补丁

让您的 Rancher 安装最新的补丁。补丁更新包含重要的软件补丁，有时还包含安全补丁。当带有安全补丁的补丁发布时，持有 Rancher 许可证的客户将收到电子邮件通知。这些更新也公布在 Rancher 的[论坛](https://forums.rancher.com/)。

### 直接向 Rancher 报告安全问题

如果您认为您已经发现了 Rancher 的安全相关问题，请立即与 Rancher 团队进行沟通(security@rancher.com)。在 Twitter、Rancher Slack、GitHub 等公共论坛上发布安全问题可能会危及所有 Rancher 客户的安全。安全补丁通常具有较高的优先级，并尽可能快地发布。

### 一次只升级一个组件

除了 Rancher 软件更新之外，还要密切监视相关软件(如 Docker、Linux 和工作负载使用的任何库)的安全修复。对于生产环境，请尝试避免在单个维护窗口期间升级太多实体。升级多个组件在发生故障时很难从根本上解决问题。在业务需求允许的情况下，一次升级一个组件。

## 关于多租户集群的提示

### 命名空间

每个租户在集群中都应该有自己独特的命名空间。这避免了命名冲突，并允许通过使用 RBAC 策略只对资源的所有者可见。

### 项目隔离

使用 Rancher 的项目隔离在项目之间自动生成网络策略(命名空间集)，这进一步保护了工作负载免受干扰。

### 资源限制

为集群中的每个应用部署强制使用资源限制定义。这不仅保护了部署的所有者，还保护了邻近的资源不受其他租户的影响。请记住，命名空间不会在节点级别隔离，因此节点上资源的过度消耗会影响其他命名空间部署。可以编写 Admission controllers 来要求定义资源限制。或者使用 Rancher 2.4 的新功能 OPA 来进行限制。

### 资源预留

为集群中的每个应用部署强制使用资源预留定义，这使调度器能够适当地调度工作负载。否则，某些节点会调度很多 Pod 导致节点资源耗尽。

## 服务类和 Kubernetes 集群

一类服务描述了围绕集群正常运行时间、持久性和维护窗口持续时间的期望。通常，组织将这些特征分组到标签中，如`dev`或`prod`。

### 考虑故障域

Kubernetes 集群可以运行多种服务的工作负载，所以需要考虑一种工作负载对另一种工作负载的影响，比如：没有适当的部署实践(如资源限制、预留等)，运行不佳的工作负载可能会影响集群的健康状况。

### 升级风险

Kubernetes 的升级并非没有风险，预测升级结果的最佳方法是在与生产集群负载和用例类似的集群上进行尝试。这就是拥有非 prod 类服务集群的优势所在。

### 资源效率

可以使用不同程度的冗余来构建集群。在对正常运行时间期望较低的一类服务中，可以通过构建没有冗余 Kubernetes 控制组件的集群来节约资源和成本。这种方法还可以释放更多的预算/资源来增加生产级别的冗余。

## 网络安全

通常，您可以在 Rancher 和 Kubernetes 集群中使用网络安全最佳实践。

### 在您的主机和互联网之间使用防火墙

应该在主机和 Internet(或公司内部网)之间使用防火墙。这可以是数据中心的企业防火墙设备，也可以是云中的 SDN 结构，比如 vpc、安全组、入口和出口规则。尝试将入站访问限制为只允许需要的端口和 IP 地址。如果环境有敏感信息需要此限制，则可以关闭出站访问(离线环境)。如果可能，使用带有入侵检测和 DDoS 预防的防火墙。

### 定期安全扫描

定期对您的环境运行安全性和渗透扫描，即使拥有良好的基础设施，糟糕的微服务也可能危及整个环境。
