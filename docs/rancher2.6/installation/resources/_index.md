---
title: 资源
weight: 5
---

### Docker 安装

[单节点 Docker 安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker)适用于想要测试 Rancher 的用户。你无需使用 Helm 在 Kubernetes 集群上运行 Rancher，你可以使用 `docker run` 命令，把 Rancher Server 组件安装到单个节点上。

由于只有一个节点和一个 Docker 容器，因此，如果该节点发生故障，由于其他节点上没有可用的 etcd 数据副本，你将丢失 Rancher Server 的所有数据。

### 离线安装

按照[以下步骤]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap)在离线环境中安装 Rancher Server。

离线环境可以是 Rancher Server 离线安装、防火墙后面或代理后面。

### 高级选项

安装 Rancher 时，有如下几个可开启的高级选项：每个安装指南中都提供了对应的选项。了解选项详情：

- [自定义 CA 证书]({{<baseurl>}}/rancher/v2.6/en/installation/resources/custom-ca-root-certificate/)
- [API 审计日志]({{<baseurl>}}/rancher/v2.6/en/installation/resources/advanced/api-audit-log/)
- [TLS 设置]({{<baseurl>}}/rancher/v2.6/en/installation/resources/tls-settings/)
- [etcd 配置]({{<baseurl>}}/rancher/v2.6/en/installation/resources/advanced/etcd/)
- [离线安装 Local System Chart]({{<baseurl>}}/rancher/v2.6/en/installation/resources/local-system-charts)
