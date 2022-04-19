---
title: 证书轮换
weight: 2040
---

> **警告**：轮换 Kubernetes 证书可能会导致集群在组件重启时暂时不可用。对于生产环境，建议在维护时段内执行此操作。

默认情况下，Kubernetes 集群需要证书，Rancher 启动的 Kubernetes 集群会自动为 Kubernetes 组件生成证书。在证书过期之前或被泄露后轮换证书非常重要。证书轮换后，Kubernetes 组件会自动重启。

可以为以下服务轮换证书：

- etcd
- kubelet（节点证书）
- kubelet（服务证书，如果[启用]({{<baseurl>}}/rke/latest/en/config-options/services/#kubelet-options)）
- kube-apiserver
- kube-proxy
- kube-scheduler
- kube-controller-manager

> **注意**：如果你未轮换 webhook 证书，且证书用了一年后已经过期，请参阅此[页面]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/expired-webhook-certificates/)。
