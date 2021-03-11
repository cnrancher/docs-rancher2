---
title: Prometheus 表达式
description: 此文档中的 PromQL 表达式可用于配置告警。
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
  - 集群管理员指南
  - 集群工具
  - 监控
  - Prometheus 表达式
---

此文档中的 PromQL 表达式可用于配置[告警](/docs/rancher2/monitoring-alerting/2.0-2.4/cluster-alerts/_index)。

> 在将表达式用于告警之前，必须启用监控。有关更多信息，请参阅有关在[集群级别](/docs/rancher2/cluster-admin/tools/monitoring/_index)或[项目级别](/docs/rancher2/project-admin/tools/monitoring/_index)启用监控的文档。

有关查询 Prometheus 的更多信息，请参考官方的 [Prometheus 文档](https://prometheus.io/docs/prometheus/latest/querying/basics/)。

## 集群指标

### 集群 CPU 利用率

| 分类 | 表达式                                                                    |
| :--- | :------------------------------------------------------------------------ |
| 详情 | `1 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance))` |
| 汇总 | `1 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])))`               |

### 集群平均负载

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>load1</td><td>`sum(node_load1) by (instance) / count(node_cpu_seconds_total{mode="system"}) by (instance)`</td></tr><tr><td>load5</td><td>`sum(node_load5) by (instance) / count(node_cpu_seconds_total{mode="system"}) by (instance)`</td></tr><tr><td>load15</td><td>`sum(node_load15) by (instance) / count(node_cpu_seconds_total{mode="system"}) by (instance)`</td></tr></table> |
| 汇总 | <table><tr><td>load1</td><td>`sum(node_load1) by (instance) / count(node_cpu_seconds_total{mode="system"})`</td></tr><tr><td>load5</td><td>`sum(node_load5) by (instance) / count(node_cpu_seconds_total{mode="system"})`</td></tr><tr><td>load15</td><td>`sum(node_load15) by (instance) / count(node_cpu_seconds_total{mode="system"})`</td></tr></table>                                           |

### 集群内存利用率

| 分类 | 表达式                                                                                                  |
| :--- | :------------------------------------------------------------------------------------------------------ |
| 详情 | `1 - sum(node_memory_MemAvailable_bytes) by (instance) / sum(node_memory_MemTotal_bytes) by (instance)` |
| 汇总 | `1 - sum(node_memory_MemAvailable_bytes) / sum(node_memory_MemTotal_bytes)`                             |

### 集群磁盘利用率

| 分类 | 表达式                                                                                                                                                                                                  |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 详情 | `(sum(node_filesystem_size_bytes{device!="rootfs"}) by (instance) - sum(node_filesystem_free_bytes{device!="rootfs"}) by (instance)) / sum(node_filesystem_size_bytes{device!="rootfs"}) by (instance)` |
| 汇总 | `(sum(node_filesystem_size_bytes{device!="rootfs"}) - sum(node_filesystem_free_bytes{device!="rootfs"})) / sum(node_filesystem_size_bytes{device!="rootfs"})`                                           |

### 集群磁盘 I/O

| 分类 | 表达式                                                                                                                                                                                                |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>read</td><td>`sum(rate(node_disk_read_bytes_total[5m])) by (instance)`</td></tr><tr><td>written</td><td>`sum(rate(node_disk_written_bytes_total[5m])) by (instance)`</td></tr></table> |
| 汇总 | <table><tr><td>read</td><td>`sum(rate(node_disk_read_bytes_total[5m]))`</td></tr><tr><td>written</td><td>`sum(rate(node_disk_written_bytes_total[5m]))`</td></tr></table>                             |

### 集群网络收发包

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :--- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>receive-dropped</td><td>`sum(rate(node_network_receive_drop_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m])) by (instance)`</td></tr><tr><td>receive-errs</td><td>`sum(rate(node_network_receive_errs_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m])) by (instance)` </td></tr><tr><td>receive-packets</td><td> `sum(rate(node_network_receive_packets_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m])) by (instance)` </td></tr><tr><td>transmit-dropped</td><td> `sum(rate(node_network_transmit_drop_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m])) by (instance)` </td></tr><tr><td>transmit-errs</td><td> `sum(rate(node_network_transmit_errs_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m])) by (instance)` </td></tr><tr><td>transmit-packets</td><td> `sum(rate(node_network_transmit_packets_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m])) by (instance)` </td></tr></table> |
| 汇总 | <table><tr><td>receive-dropped</td><td>`sum(rate(node_network_receive_drop_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m]))` </td></tr><tr><td>receive-errs</td><td> `sum(rate(node_network_receive_errs_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m]))` </td></tr><tr><td>receive-packets</td><td> `sum(rate(node_network_receive_packets_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m]))` </td></tr><tr><td>transmit-dropped</td><td> `sum(rate(node_network_transmit_drop_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m]))` </td></tr><tr><td>transmit-errs</td><td> `sum(rate(node_network_transmit_errs_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m]))` </td></tr><tr><td>transmit-packets</td><td> `sum(rate(node_network_transmit_packets_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m]))` </td></tr></table>                                                                                   |

### 集群网络 I/O

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                          |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>receive</td><td> `sum(rate(node_network_receive_bytes_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m])) by (instance)` </td></tr><tr><td>transmit</td><td> `sum(rate(node_network_transmit_bytes_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m])) by (instance)` </td></tr></table> |
| 汇总 | <table><tr><td>receive</td><td> `sum(rate(node_network_receive_bytes_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m]))` </td></tr><tr><td>transmit</td><td> `sum(rate(node_network_transmit_bytes_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*"}[5m]))` </td></tr></table>                             |

## 节点指标

### 节点 CPU 利用率

| 分类 | 表达式                                                                                  |
| :--- | :-------------------------------------------------------------------------------------- |
| 详情 | `avg(irate(node_cpu_seconds_total{mode!="idle", instance=~"$instance"}[5m])) by (mode)` |
| 汇总 | `1 - (avg(irate(node_cpu_seconds_total{mode="idle", instance=~"$instance"}[5m])))`      |

### 节点平均负载

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>load1</td><td>`sum(node_load1{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr><tr><td>load5</td><td>`sum(node_load5{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr><tr><td>load15</td><td>`sum(node_load15{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr></table> |
| 汇总 | <table><tr><td>load1</td><td>`sum(node_load1{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr><tr><td>load5</td><td>`sum(node_load5{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr><tr><td>load15</td><td>`sum(node_load15{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr></table> |

### 节点内存负载

| 分类 | 表达式                                                                                                                    |
| :--- | :------------------------------------------------------------------------------------------------------------------------ |
| 详情 | `1 - sum(node_memory_MemAvailable_bytes{instance=~"$instance"}) / sum(node_memory_MemTotal_bytes{instance=~"$instance"})` |
| 汇总 | `1 - sum(node_memory_MemAvailable_bytes{instance=~"$instance"}) / sum(node_memory_MemTotal_bytes{instance=~"$instance"})` |

### 节点磁盘负载

| 分类 | 表达式                                                                                                                                                                                                                                                              |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 详情 | `(sum(node_filesystem_size_bytes{device!="rootfs",instance=~"$instance"}) by (device) - sum(node_filesystem_free_bytes{device!="rootfs",instance=~"$instance"}) by (device)) / sum(node_filesystem_size_bytes{device!="rootfs",instance=~"$instance"}) by (device)` |
| 汇总 | `(sum(node_filesystem_size_bytes{device!="rootfs",instance=~"$instance"}) - sum(node_filesystem_free_bytes{device!="rootfs",instance=~"$instance"})) / sum(node_filesystem_size_bytes{device!="rootfs",instance=~"$instance"})`                                     |

### 节点磁盘 I/O

| 分类 | 表达式                                                                                                                                                                                                                  |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>read</td><td>`sum(rate(node_disk_read_bytes_total{instance=~"$instance"}[5m]))`</td></tr><tr><td>written</td><td>`sum(rate(node_disk_written_bytes_total{instance=~"$instance"}[5m]))`</td></tr></table> |
| 汇总 | <table><tr><td>read</td><td>`sum(rate(node_disk_read_bytes_total{instance=~"$instance"}[5m]))`</td></tr><tr><td>written</td><td>`sum(rate(node_disk_written_bytes_total{instance=~"$instance"}[5m]))`</td></tr></table> |

### 节点网络收发包

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>receive-dropped</td><td> `sum(rate(node_network_receive_drop_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m])) by (device)` </td></tr><tr><td>receive-errs</td><td> `sum(rate(node_network_receive_errs_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m])) by (device)` </td></tr><tr><td>receive-packets</td><td> `sum(rate(node_network_receive_packets_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m])) by (device)` </td></tr><tr><td>transmit-dropped</td><td> `sum(rate(node_network_transmit_drop_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m])) by (device)` </td></tr><tr><td>transmit-errs</td><td> `sum(rate(node_network_transmit_errs_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m])) by (device)` </td></tr><tr><td>transmit-packets</td><td> `sum(rate(node_network_transmit_packets_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m])) by (device)` </td></tr></table> |
| 汇总 | <table><tr><td>receive-dropped</td><td> `sum(rate(node_network_receive_drop_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m]))` </td></tr><tr><td>receive-errs</td><td> `sum(rate(node_network_receive_errs_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m]))` </td></tr><tr><td>receive-packets</td><td> `sum(rate(node_network_receive_packets_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m]))` </td></tr><tr><td>transmit-dropped</td><td> `sum(rate(node_network_transmit_drop_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m]))` </td></tr><tr><td>transmit-errs</td><td> `sum(rate(node_network_transmit_errs_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m]))` </td></tr><tr><td>transmit-packets</td><td> `sum(rate(node_network_transmit_packets_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m]))` </td></tr></table>                                                                         |

### 节点网络 I/O

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                  |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 详情 | <table><tr><td>receive</td><td> `sum(rate(node_network_receive_bytes_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m])) by (device)` </td></tr><tr><td>transmit</td><td> `sum(rate(node_network_transmit_bytes_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m])) by (device)` </td></tr></table> |
| 汇总 | <table><tr><td>receive</td><td> `sum(rate(node_network_receive_bytes_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m]))` </td></tr><tr><td>transmit</td><td> `sum(rate(node_network_transmit_bytes_total{device!~"lo \| veth.* \| docker.* \| flannel.* \| cali.* \| cbr.*",instance=~"$instance"}[5m]))` </td></tr></table>                         |

## etcd 指标

### etcd 有领导者

`max(etcd_server_has_leader)`

### etcd 领导者变更次数

`max(etcd_server_leader_changes_seen_total)`

### etcd 选举提议失败次数

`sum(etcd_server_proposals_failed_total)`

### etcd GRPC 客户端流速

| 分类 | 表达式                                                                                                                                                                                                                         |
| :--- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>in</td><td>`sum(rate(etcd_network_client_grpc_received_bytes_total[5m])) by (instance)`</td></tr><tr><td>out</td><td>`sum(rate(etcd_network_client_grpc_sent_bytes_total[5m])) by (instance)`</td></tr></table> |
| 汇总 | <table><tr><td>in</td><td>`sum(rate(etcd_network_client_grpc_received_bytes_total[5m]))`</td></tr><tr><td>out</td><td>`sum(rate(etcd_network_client_grpc_sent_bytes_total[5m]))`</td></tr></table>                             |

### etcd Peer 流速

| 分类 | 表达式                                                                                                                                                                                                           |
| :--- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>in</td><td>`sum(rate(etcd_network_peer_received_bytes_total[5m])) by (instance)`</td></tr><tr><td>out</td><td>`sum(rate(etcd_network_peer_sent_bytes_total[5m])) by (instance)`</td></tr></table> |
| 汇总 | <table><tr><td>in</td><td>`sum(rate(etcd_network_peer_received_bytes_total[5m]))`</td></tr><tr><td>out</td><td>`sum(rate(etcd_network_peer_sent_bytes_total[5m]))`</td></tr></table>                             |

### etcd 数据库大小

| 分类 | 表达式                                                          |
| :--- | :-------------------------------------------------------------- |
| 详情 | `sum(etcd_debugging_mvcc_db_total_size_in_bytes) by (instance)` |
| 汇总 | `sum(etcd_debugging_mvcc_db_total_size_in_bytes)`               |

### etcd 活跃连接

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>lease-watch</td><td>`sum(grpc_server_started_total{grpc_service="etcdserverpb.Lease",grpc_type="bidi_stream"}) by (instance) - sum(grpc_server_handled_total{grpc_service="etcdserverpb.Lease",grpc_type="bidi_stream"}) by (instance)`</td></tr><tr><td>watch</td><td>`sum(grpc_server_started_total{grpc_service="etcdserverpb.Watch",grpc_type="bidi_stream"}) by (instance) - sum(grpc_server_handled_total{grpc_service="etcdserverpb.Watch",grpc_type="bidi_stream"}) by (instance)`</td></tr></table> |
| 汇总 | <table><tr><td>lease-watch</td><td>`sum(grpc_server_started_total{grpc_service="etcdserverpb.Lease",grpc_type="bidi_stream"}) - sum(grpc_server_handled_total{grpc_service="etcdserverpb.Lease",grpc_type="bidi_stream"})`</td></tr><tr><td>watch</td><td>`sum(grpc_server_started_total{grpc_service="etcdserverpb.Watch",grpc_type="bidi_stream"}) - sum(grpc_server_handled_total{grpc_service="etcdserverpb.Watch",grpc_type="bidi_stream"})`</td></tr></table>                                                         |

### etcd Raft 选举提议

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 详情 | <table><tr><td>applied</td><td>`sum(increase(etcd_server_proposals_applied_total[5m])) by (instance)`</td></tr><tr><td>committed</td><td>`sum(increase(etcd_server_proposals_committed_total[5m])) by (instance)`</td></tr><tr><td>pending</td><td>`sum(increase(etcd_server_proposals_pending[5m])) by (instance)`</td></tr><tr><td>failed</td><td>`sum(increase(etcd_server_proposals_failed_total[5m])) by (instance)`</td></tr></table> |
| 汇总 | <table><tr><td>applied</td><td>`sum(increase(etcd_server_proposals_applied_total[5m]))`</td></tr><tr><td>committed</td><td>`sum(increase(etcd_server_proposals_committed_total[5m]))`</td></tr><tr><td>pending</td><td>`sum(increase(etcd_server_proposals_pending[5m]))`</td></tr><tr><td>failed</td><td>`sum(increase(etcd_server_proposals_failed_total[5m]))`</td></tr></table>                                                         |

### etcd RPC 速率

| 分类 | 表达式                                                                                                                                                                                                                                               |
| :--- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>total</td><td>`sum(rate(grpc_server_started_total{grpc_type="unary"}[5m])) by (instance)`</td></tr><tr><td>fail</td><td>`sum(rate(grpc_server_handled_total{grpc_type="unary",grpc_code!="OK"}[5m])) by (instance)`</td></tr></table> |
| 汇总 | <table><tr><td>total</td><td>`sum(rate(grpc_server_started_total{grpc_type="unary"}[5m]))`</td></tr><tr><td>fail</td><td>`sum(rate(grpc_server_handled_total{grpc_type="unary",grpc_code!="OK"}[5m]))`</td></tr></table>                             |

### etcd 磁盘操作

| 分类 | 表达式                                                                                                                                                                                                                                                              |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 详情 | <table><tr><td>commit-called-by-backend</td><td>`sum(rate(etcd_disk_backend_commit_duration_seconds_sum[1m])) by (instance)`</td></tr><tr><td>fsync-called-by-wal</td><td>`sum(rate(etcd_disk_wal_fsync_duration_seconds_sum[1m])) by (instance)`</td></tr></table> |
| 汇总 | <table><tr><td>commit-called-by-backend</td><td>`sum(rate(etcd_disk_backend_commit_duration_seconds_sum[1m]))`</td></tr><tr><td>fsync-called-by-wal</td><td>`sum(rate(etcd_disk_wal_fsync_duration_seconds_sum[1m]))`</td></tr></table>                             |

### etcd 磁盘同步持续时间

| 分类 | 表达式                                                                                                                                                                                                                                                                                                    |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>wal</td><td>`histogram_quantile(0.99, sum(rate(etcd_disk_wal_fsync_duration_seconds_bucket[5m])) by (instance, le))`</td></tr><tr><td>db</td><td>`histogram_quantile(0.99, sum(rate(etcd_disk_backend_commit_duration_seconds_bucket[5m])) by (instance, le))`</td></tr></table>           |
| 汇总 | <table><tr><td>wal</td><td>`sum(histogram_quantile(0.99, sum(rate(etcd_disk_wal_fsync_duration_seconds_bucket[5m])) by (instance, le)))`</td></tr><tr><td>db</td><td>`sum(histogram_quantile(0.99, sum(rate(etcd_disk_backend_commit_duration_seconds_bucket[5m])) by (instance, le)))`</td></tr></table> |

## Kubernetes 组件指标

### Kubernetes API Server 请求延迟

| 分类 | 表达式                                                                                                |
| :--- | :---------------------------------------------------------------------------------------------------- |
| 详情 | `avg(apiserver_request_latencies_sum / apiserver_request_latencies_count) by (instance, verb) /1e+06` |
| 汇总 | `avg(apiserver_request_latencies_sum / apiserver_request_latencies_count) by (instance) /1e+06`       |

### Kubernetes API Server 请求速率

| 分类 | 表达式                                                       |
| :--- | :----------------------------------------------------------- |
| 详情 | `sum(rate(apiserver_request_count[5m])) by (instance, code)` |
| 汇总 | `sum(rate(apiserver_request_count[5m])) by (instance)`       |

### Kubernetes Pods 调度失败次数

| 分类 | 表达式                                              |
| :--- | :-------------------------------------------------- |
| 详情 | `sum(kube_pod_status_scheduled{condition="false"})` |
| 汇总 | `sum(kube_pod_status_scheduled{condition="false"})` |

### Kubernetes Controller Manager 队列长度

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>volumes</td><td>`sum(volumes_depth) by instance`</td></tr><tr><td>deployment</td><td>`sum(deployment_depth) by instance`</td></tr><tr><td>replicaset</td><td>`sum(replicaset_depth) by instance`</td></tr><tr><td>service</td><td>`sum(service_depth) by instance`</td></tr><tr><td>serviceaccount</td><td>`sum(serviceaccount_depth) by instance`</td></tr><tr><td>endpoint</td><td>`sum(endpoint_depth) by instance`</td></tr><tr><td>daemonset</td><td>`sum(daemonset_depth) by instance`</td></tr><tr><td>statefulset</td><td>`sum(statefulset_depth) by instance`</td></tr><tr><td>replicationmanager</td><td>`sum(replicationmanager_depth) by instance`</td></tr></table> |
| 汇总 | <table><tr><td>volumes</td><td>`sum(volumes_depth)`</td></tr><tr><td>deployment</td><td>`sum(deployment_depth)`</td></tr><tr><td>replicaset</td><td>`sum(replicaset_depth)`</td></tr><tr><td>service</td><td>`sum(service_depth)`</td></tr><tr><td>serviceaccount</td><td>`sum(serviceaccount_depth)`</td></tr><tr><td>endpoint</td><td>`sum(endpoint_depth)`</td></tr><tr><td>daemonset</td><td>`sum(daemonset_depth)`</td></tr><tr><td>statefulset</td><td>`sum(statefulset_depth)`</td></tr><tr><td>replicationmanager</td><td>`sum(replicationmanager_depth)`</td></tr></table>                                                                                                             |

### Kubernetes Scheduler E2E 调度延迟

| 分类 | 表达式                                                                                                               |
| :--- | :------------------------------------------------------------------------------------------------------------------- |
| 详情 | `histogram_quantile(0.99, sum(scheduler_e2e_scheduling_latency_microseconds_bucket) by (le, instance)) / 1e+06`      |
| 汇总 | `sum(histogram_quantile(0.99, sum(scheduler_e2e_scheduling_latency_microseconds_bucket) by (le, instance)) / 1e+06)` |

### Kubernetes Scheduler 抢占请求

| 分类 | 表达式                                                             |
| :--- | :----------------------------------------------------------------- |
| 详情 | `sum(rate(scheduler_total_preemption_attempts[5m])) by (instance)` |
| 汇总 | `sum(rate(scheduler_total_preemption_attempts[5m]))`               |

### Ingress Controller 链接数

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>reading</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="reading"}) by (instance)`</td></tr><tr><td>waiting</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="waiting"}) by (instance)`</td></tr><tr><td>writing</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="writing"}) by (instance)`</td></tr><tr><td>accepted</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="accepted"}[5m]))) by (instance)`</td></tr><tr><td>active</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="active"}[5m]))) by (instance)`</td></tr><tr><td>handled</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="handled"}[5m]))) by (instance)`</td></tr></table> |
| 汇总 | <table><tr><td>reading</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="reading"})`</td></tr><tr><td>waiting</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="waiting"})`</td></tr><tr><td>writing</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="writing"})`</td></tr><tr><td>accepted</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="accepted"}[5m])))`</td></tr><tr><td>active</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="active"}[5m])))`</td></tr><tr><td>handled</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="handled"}[5m])))`</td></tr></table>                                                                                     |

### Ingress Controller 请求处理时长

| 分类 | 表达式                                                                                                                                      |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| 详情 | `topk(10, histogram_quantile(0.95,sum by (le, host, path)(rate(nginx_ingress_controller_request_duration_seconds_bucket{host!="_"}[5m]))))` |
| 汇总 | `topk(10, histogram_quantile(0.95,sum by (le, host)(rate(nginx_ingress_controller_request_duration_seconds_bucket{host!="_"}[5m]))))`       |

## Rancher 日志组件指标

### Fluentd 缓冲队列速率

| 分类 | 表达式                                                                   |
| :--- | :----------------------------------------------------------------------- |
| 详情 | `sum(rate(fluentd_output_status_buffer_queue_length[5m])) by (instance)` |
| 汇总 | `sum(rate(fluentd_output_status_buffer_queue_length[5m]))`               |

### Fluentd 输入速率

| 分类 | 表达式                                                                |
| :--- | :-------------------------------------------------------------------- |
| 详情 | `sum(rate(fluentd_input_status_num_records_total[5m])) by (instance)` |
| 汇总 | `sum(rate(fluentd_input_status_num_records_total[5m]))`               |

### Fluentd 错误输出速率

| 分类 | 表达式                                                      |
| :--- | :---------------------------------------------------------- |
| 详情 | `sum(rate(fluentd_output_status_num_errors[5m])) by (type)` |
| 汇总 | `sum(rate(fluentd_output_status_num_errors[5m]))`           |

### Fluentd 输出速率

| 分类 | 表达式                                                                 |
| :--- | :--------------------------------------------------------------------- |
| 详情 | `sum(rate(fluentd_output_status_num_records_total[5m])) by (instance)` |
| 汇总 | `sum(rate(fluentd_output_status_num_records_total[5m]))`               |

## 工作负载指标

### 工作负载 CPU 利用率

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 详情 | <table><tr><td>cfs throttled seconds</td><td>`sum(rate(container_cpu_cfs_throttled_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>user seconds</td><td>`sum(rate(container_cpu_user_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>system seconds</td><td>`sum(rate(container_cpu_system_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>usage seconds</td><td>`sum(rate(container_cpu_usage_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr></table> |
| 汇总 | <table><tr><td>cfs throttled seconds</td><td>`sum(rate(container_cpu_cfs_throttled_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>user seconds</td><td>`sum(rate(container_cpu_user_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>system seconds</td><td>`sum(rate(container_cpu_system_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>usage seconds</td><td>`sum(rate(container_cpu_usage_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr></table>                                                         |

### 工作负载内存利用率

| 分类 | 表达式                                                                                                                   |
| :--- | :----------------------------------------------------------------------------------------------------------------------- |
| 详情 | `sum(container_memory_working_set_bytes{namespace="$namespace",pod_name=~"$podName", container_name!=""}) by (pod_name)` |
| 汇总 | `sum(container_memory_working_set_bytes{namespace="$namespace",pod_name=~"$podName", container_name!=""})`               |

### 工作负载网络收发包

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>receive-packets</td><td>`sum(rate(container_network_receive_packets_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>receive-dropped</td><td>`sum(rate(container_network_receive_packets_dropped_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>receive-errors</td><td>`sum(rate(container_network_receive_errors_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>transmit-packets</td><td>`sum(rate(container_network_transmit_packets_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>transmit-dropped</td><td>`sum(rate(container_network_transmit_packets_dropped_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>transmit-errors</td><td>`sum(rate(container_network_transmit_errors_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr></table> |
| 汇总 | <table><tr><td>receive-packets</td><td>`sum(rate(container_network_receive_packets_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-dropped</td><td>`sum(rate(container_network_receive_packets_dropped_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-errors</td><td>`sum(rate(container_network_receive_errors_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-packets</td><td>`sum(rate(container_network_transmit_packets_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-dropped</td><td>`sum(rate(container_network_transmit_packets_dropped_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-errors</td><td>`sum(rate(container_network_transmit_errors_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr></table>                                                                                     |

### 工作负载网络 I/O

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                        |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 详情 | <table><tr><td>receive</td><td>`sum(rate(container_network_receive_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>transmit</td><td>`sum(rate(container_network_transmit_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr></table> |
| 汇总 | <table><tr><td>receive</td><td>`sum(rate(container_network_receive_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit</td><td>`sum(rate(container_network_transmit_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr></table>                             |

### 工作负载磁盘 I/O

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                    |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>read</td><td>`sum(rate(container_fs_reads_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>write</td><td>`sum(rate(container_fs_writes_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr></table> |
| 汇总 | <table><tr><td>read</td><td>`sum(rate(container_fs_reads_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>write</td><td>`sum(rate(container_fs_writes_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr></table>                             |

## Pod 指标

### Pod CPU 利用率

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>cfs throttled seconds</td><td>`sum(rate(container_cpu_cfs_throttled_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m])) by (container_name)`</td></tr><tr><td>usage seconds</td><td>`sum(rate(container_cpu_usage_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m])) by (container_name)`</td></tr><tr><td>system seconds</td><td>`sum(rate(container_cpu_system_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m])) by (container_name)`</td></tr><tr><td>user seconds</td><td>`sum(rate(container_cpu_user_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m])) by (container_name)`</td></tr></table> |
| 汇总 | <table><tr><td>cfs throttled seconds</td><td>`sum(rate(container_cpu_cfs_throttled_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m]))`</td></tr><tr><td>usage seconds</td><td>`sum(rate(container_cpu_usage_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m]))`</td></tr><tr><td>system seconds</td><td>`sum(rate(container_cpu_system_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m]))`</td></tr><tr><td>user seconds</td><td>`sum(rate(container_cpu_user_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m]))`</td></tr></table>                                                                                 |

### Pod 内存利用率

| 分类 | 表达式                                                                                                                                             |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | `sum(container_memory_working_set_bytes{container_name!="POD",namespace="$namespace",pod_name="$podName",container_name!=""}) by (container_name)` |
| 汇总 | `sum(container_memory_working_set_bytes{container_name!="POD",namespace="$namespace",pod_name="$podName",container_name!=""})`                     |

### Pod 网络收发包

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>receive-packets</td><td>`sum(rate(container_network_receive_packets_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-dropped</td><td>`sum(rate(container_network_receive_packets_dropped_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-errors</td><td>`sum(rate(container_network_receive_errors_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-packets</td><td>`sum(rate(container_network_transmit_packets_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-dropped</td><td>`sum(rate(container_network_transmit_packets_dropped_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-errors</td><td>`sum(rate(container_network_transmit_errors_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr></table> |
| 汇总 | <table><tr><td>receive-packets</td><td>`sum(rate(container_network_receive_packets_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-dropped</td><td>`sum(rate(container_network_receive_packets_dropped_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-errors</td><td>`sum(rate(container_network_receive_errors_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-packets</td><td>`sum(rate(container_network_transmit_packets_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-dropped</td><td>`sum(rate(container_network_transmit_packets_dropped_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-errors</td><td>`sum(rate(container_network_transmit_errors_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr></table> |

### Pod 网络 I/O

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                          |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 详情 | <table><tr><td>receive</td><td>`sum(rate(container_network_receive_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit</td><td>`sum(rate(container_network_transmit_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr></table> |
| 汇总 | <table><tr><td>receive</td><td>`sum(rate(container_network_receive_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit</td><td>`sum(rate(container_network_transmit_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr></table> |

### Pod 磁盘 I/O

| 分类 | 表达式                                                                                                                                                                                                                                                                                                                                              |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 详情 | <table><tr><td>read</td><td>`sum(rate(container_fs_reads_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m])) by (container_name)`</td></tr><tr><td>write</td><td>`sum(rate(container_fs_writes_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m])) by (container_name)`</td></tr></table> |
| 汇总 | <table><tr><td>read</td><td>`sum(rate(container_fs_reads_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>write</td><td>`sum(rate(container_fs_writes_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr></table>                                         |

## 容器指标

### 容器 CPU 利用率

| 分类                  | 表达式                                                                                                                                 |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| cfs throttled seconds | `sum(rate(container_cpu_cfs_throttled_seconds_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))` |
| usage seconds         | `sum(rate(container_cpu_usage_seconds_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))`         |
| system seconds        | `sum(rate(container_cpu_system_seconds_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))`        |
| user seconds          | `sum(rate(container_cpu_user_seconds_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))`          |

### 容器内存利用率

`sum(container_memory_working_set_bytes{namespace="$namespace",pod_name="$podName",container_name="$containerName"})`

### 容器磁盘 IO

| 分类  | 表达式                                                                                                                       |
| :---- | :--------------------------------------------------------------------------------------------------------------------------- |
| read  | `sum(rate(container_fs_reads_bytes_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))`  |
| write | `sum(rate(container_fs_writes_bytes_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))` |
