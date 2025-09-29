---
title: Windows集群匹配表
description: 您可以让 Rancher 使用任何节点启动 Kubernetes 集群。Rancher 使用Rancher Kubernetes Engine（RKE）来部署 Kubernetes 集群，这是 Rancher 自己的轻量级 Kubernetes 安装程序。它可以在任何计算机上启动 Kubernetes，包括：裸金属服务器、本地虚拟机、由云服务商托管的虚拟机。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 创建集群
  - 创建RKE集群
  - RKE集群说明
  - Windows集群匹配表
---

Windows 集群与 Linux 集群不共享相同的功能支持。

下表描述了截至 Rancher v2.5.8，Rancher 上 Windows 和 Linux 之间的功能对等情况。

| **组件**                | **Linux** | **Windows**         |
| ----------------------- | --------- | ------------------- |
| **发行版**              | -         | -                   |
| RKE                     | 支持      | 支持                |
| RKE2                    | 支持      | 暂定 2.6.x 开始支持 |
| K3S                     | 支持      | 不支持              |
| EKS                     | 支持      | 不支持              |
| GKE                     | 支持      | 不支持              |
| AKS                     | 支持      | 不支持              |
| **Rancher 组件**        | -         | -                   |
| Server                  | 支持      | 不支持              |
| Agent                   | 支持      | 支持                |
| Fleet                   | 支持      | 支持                |
| EKS Operator            | 支持      | 不支持              |
| AKS Operator            | 不支持    | 不支持              |
| GKE Operator            | 不支持    | 不支持              |
| Alerting v1             | 支持      | 支持                |
| Monitoring v1           | 支持      | 支持                |
| Logging v1              | 支持      | 支持                |
| Monitoring/Alerting v2  | 支持      | 2.5.8 开始支持      |
| Logging v2              | 支持      | 2.5.8 开始支持      |
| Istio                   | 支持      | 不支持              |
| Catalog v1              | 支持      | 不支持              |
| Catalog v2              | 支持      | 不支持              |
| OPA                     | 支持      | 不支持              |
| Longhorn                | 支持      | 不支持              |
| CIS Scans               | 支持      | 不支持              |
| Backup/Restore Operator | 支持      | 不支持              |
| **CNI 及其他网络插件**  | -         | -                   |
| Flannel                 | 支持      | 支持                |
| Canal                   | 支持      | 不支持              |
| Calico                  | 支持      | 暂定 2.6.x 开始支持 |
| Cilium                  | 支持      | 不支持              |
| Multus                  | 支持      | 不支持              |
| Traefik                 | 支持      | 不支持              |
| NGINX Ingress           | 支持      | 不支持              |

关于功能支持的最新信息，你可以访问 GitHub 上的[rancher/windows](https://github.com/rancher/windows)。
