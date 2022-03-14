---
title: 使用 HTTP 代理安装 Rancher
weight: 4
---

在很多企业环境中，企业内运行的服务器或虚拟机不能直接访问互联网，但出于安全考虑，必须通过 HTTP(S) 代理连接到外部服务。本教程将分步介绍如何在这样的环境中进行高可用的 Rancher 安装。

另外，也可以在没有任何互联网访问的情况下，离线设置 Rancher。详情请参见 [Rancher 官方文档]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/)。

## 安装概要

1. [配置基础设施]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/behind-proxy/prepare-nodes/)
2. [配置 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/behind-proxy/launch-kubernetes/)
3. [安装 Rancher]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/behind-proxy/install-rancher/)
