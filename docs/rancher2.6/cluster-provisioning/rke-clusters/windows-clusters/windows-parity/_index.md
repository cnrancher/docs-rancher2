---
title: Windows 和 Linux 集群的功能奇偶一致性
weight: 3
---

Windows 集群与 Linux 集群的功能支持不相同。

下图描述了 Rancher 上 Windows 和 Linux 之间的功能奇偶一致性：

| **组件**                | **Linux** | **Windows**                                               |
| ----------------------- | --------- | --------------------------------------------------------- |
| **发行版**              |           |
| RKE                     | 支持      | 支持                                                      |
| RKE2                    | 支持      | Rancher 2.6.0 预览版计划为 Rancher 2.6.4 提供通用可用性。 |
| K3S                     | 支持      | 不支持                                                    |
| EKS                     | 支持      | 不支持                                                    |
| GKE                     | 支持      | 不支持                                                    |
| AKS                     | 支持      | 不支持                                                    |
| **Rancher 组件**        |           |
| Server                  | 支持      | 不支持                                                    |
| Agent                   | 支持      | 支持                                                      |
| Fleet                   | 支持      | 支持                                                      |
| EKS Operator            | 支持      | 不支持                                                    |
| AKS Operator            | 不支持    | 不支持                                                    |
| GKE Operator            | 不支持    | 不支持                                                    |
| Alerting v1             | 支持      | 支持                                                      |
| Monitoring v1           | 支持      | 支持                                                      |
| Logging v1              | 支持      | 支持                                                      |
| Monitoring/Alerting v2  | 支持      | 支持                                                      |
| Logging v2              | 支持      | 支持                                                      |
| Istio                   | 支持      | 不支持                                                    |
| Catalog v1              | 支持      | 不支持                                                    |
| Catalog v2              | 支持      | 不支持                                                    |
| OPA                     | 支持      | 不支持                                                    |
| Longhorn                | 支持      | 不支持                                                    |
| CIS Scans               | 支持      | 不支持                                                    |
| Backup/Restore Operator | 支持      | 不支持                                                    |
| **CNI / Add-ons**       |           |
| Flannel                 | 支持      | 支持                                                      |
| Canal                   | 支持      | 不支持                                                    |
| Calico                  | 支持      | Rancher 2.6.0 预览版计划为 Rancher 2.6.4 提供通用可用性。 |
| Cilium                  | 支持      | 不支持                                                    |
| Multus                  | 支持      | 不支持                                                    |
| Traefik                 | 支持      | 不支持                                                    |
| NGINX Ingress           | 支持      | 不支持                                                    |

有关功能支持的更新信息，你可以访问 GitHub 上的 [rancher/windows](https://github.com/rancher/windows)。
