---
title: Rancher v2.5
---

Rancher v2.5 引入了在任何 Kubernetes 集群上部署 Rancher 的功能。出于这个原因，我们现在为 Rancher 在每个 Rancher 的 Kubernetes 发行版上的部署提供单独的安全加固指南。
Rancher 有以下 Kubernetes 发行版。

- [**RKE,**](/docs/rke/_index) Rancher Kubernetes Engine，是一个经过 CNCF 认证的 Kubernetes 发行版，完全在 Docker 容器内运行。
- [**K3s,**](/docs/k3s/_index)是一个完全符合要求的轻量级 Kubernetes 发行版。它易于安装，内存只有上游 Kubernetes 的一半，所有的二进制文件不到 100MB。
- [**RKE2**](https://docs.rke2.io/)是一个完全符合的 Kubernetes 发行版，专注于美国联邦政府部门内的安全和合规性。
  要在 Rancher 发行版之外加固 Kubernetes 集群，请参考您的 Kubernetes 提供商文档。

## 指南

这些指南已经和 Rancher v2.5 版本一起进行了测试。每个自评指南都附有加固指南，并在特定的 Kubernetes 版本和 CIS 基准版本上进行了测试。如果您的 Kubernetes 版本的 CIS 基准尚未得到验证，您可以选择使用现有的指南，直到有更新的版本加入。

### RKE 指南

| Kubernetes 版本   | CIS 基准版 | 自评指南                                                   | 加固指南                                                               |
| :---------------- | :--------- | :--------------------------------------------------------- | :--------------------------------------------------------------------- |
| Kubernetes v1.15+ | CIS v1.5   | [链接](/docs/rancher2.5/security/1.5-benchmark-2.5/_index) | [链接](/docs/rancher2.5/security/rancher-2.5/1.5-hardening-2.5/_index) |
| Kubernetes v1.18+ | CIS v1.6   | [链接](/docs/rancher2.5/security/1.6-benchmark-2.5/_index) | [链接](/docs/rancher2.5/security/rancher-2.5/1.6-hardening-2.5/_index) |

### RKE2 指南

| Kubernetes 版本   | CIS 基准版 | 自评指南                                                   | 加固指南                                               |
| :---------------- | :--------- | :--------------------------------------------------------- | :----------------------------------------------------- |
| Kubernetes v1.18+ | CIS v1.5   | [链接](https://docs.rke2.io/security/cis_self_assessment/) | [链接](https://docs.rke2.io/security/hardening_guide/) |

### K3s 指南

Coming soon ...
