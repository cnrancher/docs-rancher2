---
title: 启用监控
---

作为[管理员](/docs/rancher2.5/admin-settings/rbac/global-permissions/)或[集群所有者](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/#集群角色)，你可以通过 Rancher 来部署 Prometheus 来监控 Kubernetes 集群。

本页描述了如何使用新的监控应用程序在集群内启用监控和告警。

你可以在有或没有 SSL 的情况下启用监控。

# 要求

- 确保每个节点都允许 9796 端口的流量，因为 Prometheus 将从这个端口抓取指标。
- 确保你的集群满足资源要求。集群应该至少有 1950Mi 内存，2700m CPU 和 50Gi 存储。资源限制和请求的明细在[这里](/docs/rancher2.5/monitoring-alerting/configuration/helm-chart-options/#配置资源限制和请求)
- 在使用 RancherOS 或 Flatcar Linux 节点的 RKE 集群上安装监控时，将 etcd 节点的证书目录改为`/opt/rke/etc/kubernetes/ssl`。

> **注意：**如果你想设置 Alertmanager、Grafana 或 Ingress，必须在 Helm chart deployment 上进行设置。在 deployment 之外创建 Ingress 是有问题的。

# 设置资源限制和请求

资源请求和限制可以在安装 `rancher-monitoring` 时配置。 要从 Rancher UI 配置 Prometheus 资源，请点击左上角的**应用程序和市场>监控**。

有关默认限制的更多信息，请参见[本页](/docs/rancher2.5/monitoring-alerting/configuration/helm-chart-options/#配置资源限制和请求)

# 安装监控应用程序

### Rancher v2.5.8

#### 不使用 SSL 启用监控

1. 在 Rancher UI 中，进入你要安装监控的集群，并点击**集群浏览器。**
1. 点击**应用程序**。
1. 点击 `rancher-monitoring` 应用程序。
1. 可选：点击**chart 选项**，配置告警、Prometheus 和 Grafana。如需帮助，请参阅[配置参考。](/docs/rancher2.5/monitoring-alerting/configuration/helm-chart-options/)
1. 滚动到 Helm chart README 的底部，点击**安装。**

**结果：**监控应用被部署在 `cattle-monitoring-system` 命名空间。

#### 使用 SSL 启用监控

1. 按照[本页](/docs/rancher2.5/k8s-in-rancher/secrets/)上的步骤，创建一个 secret，以便 SSL 被用于告警。

- Secret 应该在 `cattle-monitoring-system` 命名空间中创建。如果它不存在，先创建它。
- 将 `ca` `cert` 和 `key` 文件添加到 secret 中。

1. 在 Rancher UI 中，进入你要安装监控的集群，点击**集群浏览器。**
1. 单击**应用程序。**
1. 点击 `rancher-monitoring` 应用程序。
1. 单击**告警**。
1. 单击**附加 Secrets**并添加先前创建的 secrets。

**结果：**监控应用程序被部署在 `cattle-monitoring-system` 命名空间。

当[创建接收器时，](/docs/rancher2.5/monitoring-alerting/configuration/receiver/)启用 SSL 的接收器，如 email 或 webhook，将有一个**SSL**部分，将有一个 **SSL** 部分，其中包含 **CA 文件路径**、**证书文件路径** 和 **密钥文件路径** 的字段。在这些字段中填写 `ca`、`cert` 和 `key` 的路径。路径的形式为`/etc/alertmanager/secrets/name-of-file-in-secret`。

例如，如果你用这些键值对创建了一个 secret:

```yaml
ca.crt=`base64-content`
cert.pem=`base64-content`
key.pfx=`base64-content`
```

那么**证书文件路径**将被设置为 `/etc/alertmanager/secrets/cert.pem`。

### Rancher v2.5.0-2.5.7

1. 在 Rancher UI 中，进入你要安装监控的集群，点击**集群浏览器。**
1. 点击**应用程序**。
1. 点击 `rancher-monitoring` 应用程序。
1. 可选：点击**Chart 选项**，配置告警、Prometheus 和 Grafana。如需帮助，请参阅[配置参考。](/docs/rancher2.5/monitoring-alerting/configuration/helm-chart-options/)
1. 滚动到 Helm chart README 的底部，点击**安装。**

**结果：**监控应用被部署在 `cattle-monitoring-system` 命名空间。
