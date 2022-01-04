---
title: 资源及高级选项配置
weight: 4
aliases:
  - /rancher/v2.x/en/installation/options
---

## Docker 安装

[单节点 Docker 安装](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/_index)是为想要测试 Rancher 的用户准备的。你不需要使用 Helm 在 Kubernetes 集群上运行，而是使用`docker run`命令在单个节点上安装 Rancher 服务器组件。

由于只有一个节点和一个 Docker 容器，如果节点宕机，其他节点上就没有可用的 etcd 数据副本，你将失去 Rancher 服务器的所有数据。

## 离线安装

按照[这些步骤](/docs/rancher2.5/installation/other-installation-methods/air-gap/_index)将 Rancher 服务器安装在一个离线环境中。

离线环境可能是指 Rancher 服务器将被安装在离线、防火墙后或代理服务器后。

## 高级选项

在安装 Rancher 时，可以在安装过程中启用一些高级选项。在每个安装指南中，已经介绍过这些选项了。下面可以了解这些选项的更多信息：

| 高级选项                                                                                     | 截至版本 |
| :------------------------------------------------------------------------------------------- | :------- |
| [自定义 CA 证书](/docs/rancher2.5/installation/resources/custom-ca-root-certificate/_index)  | v2.0.0   |
| [API 审计日志](/docs/rancher2.5/installation/resources/advanced/api-audit-log/_index/#开启-api-审计日志)        | v2.0.0   |
| [TLS 设置](/docs/rancher2.5/installation/resources/tls-settings/_index)                      | v2.1.7   |
| [etcd 配置](/docs/rancher2.5/installation/resources/advanced/etcd/_index)                    | v2.2.0   |
| [离线部署 System Charts](/docs/rancher2.5/installation/resources/local-system-charts/_index) | v2.3.0   |
