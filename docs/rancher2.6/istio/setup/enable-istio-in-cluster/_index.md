---
title: 1. 在集群中启用 Istio
weight: 1
---

> **前提**：
>
> - 只有分配了 `cluster-admin` [Kubernetes 默认角色](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)的用户可以在 Kubernetes 集群中配置和安装 Istio。
> - 如果你有 pod 安全策略，则需要安装启用了 CNI 的 Istio。有关详细信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/istio/configuration-reference/enable-istio-with-psp)。
> - 要在 RKE2 集群上安装 Istio，则需要执行额外的步骤。有关详细信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/istio/configuration-reference/rke2/)。
> - 要在启用了项目网络隔离的集群中安装 Istio，则需要执行额外的步骤。有关详细信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/istio/configuration-reference/canal-and-project-network)。

1. 点击 **☰ > 集群管理**。
1. 转到要启用 Istio 的位置，然后单击 **Explore**。
1. 单击**应用 & 应用市场**。
1. 单击 **Chart**。
1. 单击 **Istio**。
1. 如果你还没有安装 Monitoring 应用，系统会提示你安装 rancher-monitoring。你也可以选择在 Rancher-monitoring 安装上设置选择器或抓取配置选项。
1. 可选：为 Istio 组件配置成员访问和[资源限制]({{<baseurl>}}/rancher/v2.6/en/istio/resources/)。确保你的 Worker 节点上有足够的资源来启用 Istio。
1. 可选：如果需要，对 values.yaml 进行额外的配置更改。
1. 可选：通过[覆盖文件]({{<baseurl>}}/rancher/v2.6/en/istio/configuration-reference/#overlay-file)来添加其他资源或配置。
1. 单击**安装**。

**结果**：已在集群级别安装 Istio。

## 其他配置选项

有关配置 Istio 的更多信息，请参阅[配置参考]({{<baseurl>}}/rancher/v2.6/en/istio/configuration-reference)。
