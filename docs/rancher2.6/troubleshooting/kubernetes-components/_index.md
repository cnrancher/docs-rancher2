---
title: Kubernetes 组件
weight: 100
---

本文列出的命令和步骤适用于 [Rancher 启动的 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 集群上的核心 Kubernetes 组件。

本文包括以下类别的故障排除提示：

- [etcd 节点故障排除]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/kubernetes-components/etcd)
- [Control Plane 节点故障排除]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/kubernetes-components/controlplane)
- [nginx-proxy 节点故障排除]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/kubernetes-components/nginx-proxy)
- [Worker 节点和通用组件故障排除]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/kubernetes-components/worker-and-generic)

## Kubernetes 组件图

![集群图]({{<baseurl>}}/img/rancher/clusterdiagram.svg)<br/>
<sup>线条表示组件之间的通信。而颜色纯粹用于视觉辅助。</sup>