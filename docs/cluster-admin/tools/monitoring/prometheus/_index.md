---
title: Prometheus 参数
---

_自 v2.2.0 起可用_

在配置[集群监控](/docs/cluster-admin/tools/monitoring/_index)或[项目监控](/docs/project-admin/tools/monitoring/_index)时，有以下的可配置项：

| 选项                                                                                                                             | 描述                                                                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 数据留存                                                                                                                         | 设定 Prometheus 留存监控数据的时间。                                                                                                                                                                                                                                                       |
| 激活 Node Exporter                                                                                                               | 是否部署 Node Exporter。                                                                                                                                                                                                                                                                   |
| Node Exporter 主机端口                                                                                                           | 设定 Node Exporter 主机端口，用于暴露主机相关的指标。如果部署 Node Exporter，则为必填项。                                                                                                                                                                                                  |
| 启动 Proemtheus 持久化存储                                                                                                       | 是否为 Prometheus 配置存储，以便即使 Prometheus Pod 发生故障也可以保留指标。                                                                                                                                                                                                               |
| 启动 Grafana 持久化存储                                                                                                          | 是否为 Grafana 配置存储，以便即使 Grafana Pod 发生故障也可以保留 Grafana 仪表板和配置。                                                                                                                                                                                                    |
| Prometheus [CPU 限制值](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-cpu)    | Prometheus Pod 的 CPU 资源限制。                                                                                                                                                                                                                                                           |
| Prometheus [CPU 预留值](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-cpu)    | Prometheus Pod 的 CPU 资源预留。                                                                                                                                                                                                                                                           |
| Prometheus [内存限制值](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-memory) | Prometheus Pod 的内存资源限制。                                                                                                                                                                                                                                                            |
| Prometheus [内存预留值](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-memory) | Prometheus Pod 的内存预留值。                                                                                                                                                                                                                                                              |
| 节点选择器                                                                                                                       | 设定选择标签以将 Prometheus Pod 和 Grafana Pod 部署到对应的节点。 如果使用此选项，节点必须具有对应的标签。                                                                                                                                                                                 |
| 高级选项                                                                                                                         | 由于监控是符合 [Rancher 应用商店](/docs/catalog/_index)的[应用](https://github.com/rancher/system-charts/tree/dev/charts/rancher-monitoring)，因此它可以[像其他应用一样进行参数配置](/docs/catalog/apps/_index) _警告：在不了解整个监控应用的情况下对其进行任何修改可能会导致灾难性错误。_ |

## Node Exporter

[Node Exporter](https://github.com/prometheus/node_exporter/blob/master/README.md) 是一款流行且开源的 exporter，用于暴露主机硬件和类 Unix 内核操作系统的指标，它旨在监视主机系统。但是，完全在容器内运行 Node Exporter 时，仍然存在一些问题，所以为了获得实际的网络指标，我们必须以`hostNetwork`模式部署 Node Exporter。

在配置 Prometheus 并启用 Node Exporter 时，请在 **Node Exporter 主机端口**中输入一个与现有应用不会产生冲突的端口号。所填选的端口号必须是打开的（允许内网访问即可），以允许 Prometheus Pod 与 Node Exporter 进行通讯。

> **警告：** 为了能让 Prometheus 刮取 Node Exporter 暴露的指标，在启动集群监控后，必须打开 **Node Exporter 主机端口**的防火墙以支持**内网**访问。默认是使用`9796`作为 Node Exporter 的主机端口。

## 持久化存储

> **先决条件：** 配置一个或多个[存储类](/docs/cluster-admin/volumes-and-storage/_index)来作为 Prometheus 或者 Grafana 的[持久化存储](/docs/cluster-admin/volumes-and-storage/_index)。

默认情况下，启动集群监控或者项目监控，Prometheus 只会把监控数据临时存储在自己的 Pod 里面。当 Prometheus 或者 Grafana 意外宕掉后，您将面临所有监控数据丢失的问题。因此，Rancher 推荐使用外部持久化存储，在 Prometheus 或者 Grafana 恢复后，之前所有的监控数据不会有任何的损失。

在配置 Prometheus 或者 Grafana 使用持久化存储时，请指定持久卷的大小以及选择对应的[存储类](/docs/cluster-admin/volumes-and-storage/_index)。
