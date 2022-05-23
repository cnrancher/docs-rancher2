---
title: Services
weight: 3045
---

Deployment、StatefulSet 和 Daemonset 会管理 Pod 配置，而 Service 使用选择器将流量引导到 Pod。

每个工作负载（至少配置一个端口）都会创建一个补充的服务发现条目。此服务发现条目使用以下命名约定为工作负载的 pod 启用 DNS 解析：
`<workload>.<namespace>.svc.cluster.local`。

你可以创建其它 service，这样，指定的命名空间就可以使用一个或多个外部 IP 地址、外部主机名、另一个 DNS 记录的别名、其他工作负载或与你创建的选择器匹配的一组 pod 来进行解析。

1. 点击左上角 **☰ > 集群管理**。
1. 转到要添加 service 的集群，然后单击 **Explore**。
1. 点击**服务发现 > 服务**。
1. 单击**创建**。
1. 选择要创建的 service 类型。
1. 从下拉列表中选择一个的**命名空间**。
1. 输入 service 的**名称**。此名称会用于 DNS 解析。
1. 完成表单的其余部分。如需帮助，请参阅 [service 的上游 Kubernetes 文档](https://kubernetes.io/docs/concepts/services-networking/service/)。
1. 单击**创建**。

**结果**：创建了一个新 service。

- 你可以从项目的**服务发现**选项卡查看记录。
- 访问你创建的新记录的新 DNS 名称 (`<recordname>.<namespace>.svc.cluster.local`) 时，它会解析所选的命名空间。

## 相关链接

- [使用 HostAliases 向 Pod /etc/hosts 文件添加条目](https://kubernetes.io/docs/concepts/services-networking/add-entries-to-pod-etc-hosts-with-host-aliases/)
