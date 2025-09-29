---
title: PromQL 表达式参考
description: 本文档中的 PromQL 表达式可用于配置警报。
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
  - rancher 2.5
  - 监控和告警
  - PromQL 表达式参考
---

本文档中的 PromQL 表达式可用于配置告警。

关于查询 Prometheus 时间序列数据库的更多信息，请参阅官方[Prometheus 文档。](https://prometheus.io/docs/prometheus/latest/querying/basics/)

## 集群指标

### 集群 CPU 利用率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `1 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance))` |
| 摘要 | `1 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])))` |

### 集群平均负载

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>load1</td><td>`sum(node_load1) by (instance) / count(node_cpu_seconds_total{mode="system"}) by (instance)`</td></tr><tr><td>load5</td><td>`sum(node_load5) by (instance) / count(node_cpu_seconds_total{mode="system"}) by (instance)`</td></tr><tr><td>load15</td><td>`sum(node_load15) by (instance) / count(node_cpu_seconds_total{mode="system"}) by (instance)`</td></tr></table> |
| 摘要 | <table><tr><td>load1</td><td>`sum(node_load1) by (instance) / count(node_cpu_seconds_total{mode="system"})`</td></tr><tr><td>load5</td><td>`sum(node_load5) by (instance) / count(node_cpu_seconds_total{mode="system"})`</td></tr><tr><td>load15</td><td>`sum(node_load15) by (instance) / count(node_cpu_seconds_total{mode="system"})`</td></tr></table> |

### 集群内存利用率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `1 - sum(node_memory_MemAvailable_bytes) by (instance) / sum(node_memory_MemTotal_bytes) by (instance)` |
| 摘要 | `1 - sum(node_memory_MemAvailable_bytes) / sum(node_memory_MemTotal_bytes)` |

### 集群磁盘利用率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `(sum(node_filesystem_size_bytes{device!="rootfs"}) by (instance) - sum(node_filesystem_free_bytes{device!="rootfs"}) by (instance)) / sum(node_filesystem_size_bytes{device!="rootfs"}) by (instance)` |
| 摘要 | `(sum(node_filesystem_size_bytes{device!="rootfs"}) - sum(node_filesystem_free_bytes{device!="rootfs"})) / sum(node_filesystem_size_bytes{device!="rootfs"})` |

### 集群磁盘 I/O

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>read</td><td>`sum(rate(node_disk_read_bytes_total[5m])) by (instance)`</td></tr><tr><td>written</td><td>`sum(rate(node_disk_written_bytes_total[5m])) by (instance)`</td></tr></table> |
| 摘要 | <table><tr><td>read</td><td>`sum(rate(node_disk_read_bytes_total[5m]))`</td></tr><tr><td>written</td><td>`sum(rate(node_disk_written_bytes_total[5m]))`</td></tr></table> |

### 集群网络数据包

请参阅[英文官网](https://rancher.com/docs/rancher/v2.5/en/monitoring-alerting/expression/#cluster-network-packets)

### 集群网络 I/O

请参阅[英文官网](https://rancher.com/docs/rancher/v2.5/en/monitoring-alerting/expression/#cluster-network-i-o)

## 节点指标

### 节点 CPU 利用率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `avg(irate(node_cpu_seconds_total{mode!="idle", instance=~"$instance"}[5m])) by (mode)` |
| 摘要 | `1 - (avg(irate(node_cpu_seconds_total{mode="idle", instance=~"$instance"}[5m])))` |

### 节点平均负载

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>load1</td><td>`sum(node_load1{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr><tr><td>load5</td><td>`sum(node_load5{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr><tr><td>load15</td><td>`sum(node_load15{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr></table> |
| 摘要 | <table><tr><td>load1</td><td>`sum(node_load1{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr><tr><td>load5</td><td>`sum(node_load5{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr><tr><td>load15</td><td>`sum(node_load15{instance=~"$instance"}) / count(node_cpu_seconds_total{mode="system",instance=~"$instance"})`</td></tr></table> |

### 节点内存利用率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `1 - sum(node_memory_MemAvailable_bytes{instance=~"$instance"}) / sum(node_memory_MemTotal_bytes{instance=~"$instance"})` |
| 摘要 | `1 - sum(node_memory_MemAvailable_bytes{instance=~"$instance"}) / sum(node_memory_MemTotal_bytes{instance=~"$instance"}) ` |

### 节点磁盘利用率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `(sum(node_filesystem_size_bytes{device!="rootfs",instance=~"$instance"}) by (device) - sum(node_filesystem_free_bytes{device!="rootfs",instance=~"$instance"}) by (device)) / sum(node_filesystem_size_bytes{device!="rootfs",instance=~"$instance"}) by (device)` |
| 摘要 | `(sum(node_filesystem_size_bytes{device!="rootfs",instance=~"$instance"}) - sum(node_filesystem_free_bytes{device!="rootfs",instance=~"$instance"})) / sum(node_filesystem_size_bytes{device!="rootfs",instance=~"$instance"})` |

### 节点磁盘 I/O

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>read</td><td>`sum(rate(node_disk_read_bytes_total{instance=~"$instance"}[5m]))`</td></tr><tr><td>written</td><td>`sum(rate(node_disk_written_bytes_total{instance=~"$instance"}[5m]))`</td></tr></table> |
| 摘要 | <table><tr><td>read</td><td>`sum(rate(node_disk_read_bytes_total{instance=~"$instance"}[5m]))`</td></tr><tr><td>written</td><td>`sum(rate(node_disk_written_bytes_total{instance=~"$instance"}[5m]))`</td></tr></table> |

### 节点网络数据包

请参阅[英文官网](https://rancher.com/docs/rancher/v2.5/en/monitoring-alerting/expression/#node-network-packets)

### 节点网络 I/O

请参阅[英文官网](https://rancher.com/docs/rancher/v2.5/en/monitoring-alerting/expression/#node-network-i-o)

## Etcd 指标

### Etcd Leader

`max(etcd_server_has_leader)`

### Leader 改变次数

`max(etcd_server_leader_changes_seen_total)`

### 失败 Proposals 次数

`sum(etcd_server_proposals_failed_total)`

### GRPC 客户端流量

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>in</td><td>`sum(rate(etcd_network_client_grpc_received_bytes_total[5m])) by (instance)`</td></tr><tr><td>out</td><td>`sum(rate(etcd_network_client_grpc_sent_bytes_total[5m])) by (instance)`</td></tr></table> |
| 摘要 | <table><tr><td>in</td><td>`sum(rate(etcd_network_client_grpc_received_bytes_total[5m]))`</td></tr><tr><td>out</td><td>`sum(rate(etcd_network_client_grpc_sent_bytes_total[5m]))`</td></tr></table> |

### 对等流量

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>in</td><td>`sum(rate(etcd_network_peer_received_bytes_total[5m])) by (instance)`</td></tr><tr><td>out</td><td>`sum(rate(etcd_network_peer_sent_bytes_total[5m])) by (instance)`</td></tr></table> |
| 摘要 | <table><tr><td>in</td><td>`sum(rate(etcd_network_peer_received_bytes_total[5m]))`</td></tr><tr><td>out</td><td>`sum(rate(etcd_network_peer_sent_bytes_total[5m]))`</td></tr></table> |

### DB 大小

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `sum(etcd_debugging_mvcc_db_total_size_in_bytes) by (instance)` |
| 摘要 | `sum(etcd_debugging_mvcc_db_total_size_in_bytes)` |

### 活跃 Streams

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>lease-watch</td><td>`sum(grpc_server_started_total{grpc_service="etcdserverpb.Lease",grpc_type="bidi_stream"}) by (instance) - sum(grpc_server_handled_total{grpc_service="etcdserverpb.Lease",grpc_type="bidi_stream"}) by (instance)`</td></tr><tr><td>watch</td><td>`sum(grpc_server_started_total{grpc_service="etcdserverpb.Watch",grpc_type="bidi_stream"}) by (instance) - sum(grpc_server_handled_total{grpc_service="etcdserverpb.Watch",grpc_type="bidi_stream"}) by (instance)`</td></tr></table> |
| 摘要 | <table><tr><td>lease-watch</td><td>`sum(grpc_server_started_total{grpc_service="etcdserverpb.Lease",grpc_type="bidi_stream"}) - sum(grpc_server_handled_total{grpc_service="etcdserverpb.Lease",grpc_type="bidi_stream"})`</td></tr><tr><td>watch</td><td>`sum(grpc_server_started_total{grpc_service="etcdserverpb.Watch",grpc_type="bidi_stream"}) - sum(grpc_server_handled_total{grpc_service="etcdserverpb.Watch",grpc_type="bidi_stream"})`</td></tr></table> |

### Raft 建议

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>applied</td><td>`sum(increase(etcd_server_proposals_applied_total[5m])) by (instance)`</td></tr><tr><td>committed</td><td>`sum(increase(etcd_server_proposals_committed_total[5m])) by (instance)`</td></tr><tr><td>pending</td><td>`sum(increase(etcd_server_proposals_pending[5m])) by (instance)`</td></tr><tr><td>failed</td><td>`sum(increase(etcd_server_proposals_failed_total[5m])) by (instance)`</td></tr></table> |
| 摘要 | <table><tr><td>applied</td><td>`sum(increase(etcd_server_proposals_applied_total[5m]))`</td></tr><tr><td>committed</td><td>`sum(increase(etcd_server_proposals_committed_total[5m]))`</td></tr><tr><td>pending</td><td>`sum(increase(etcd_server_proposals_pending[5m]))`</td></tr><tr><td>failed</td><td>`sum(increase(etcd_server_proposals_failed_total[5m]))`</td></tr></table> |

### RPC 速率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>total</td><td>`sum(rate(grpc_server_started_total{grpc_type="unary"}[5m])) by (instance)`</td></tr><tr><td>fail</td><td>`sum(rate(grpc_server_handled_total{grpc_type="unary",grpc_code!="OK"}[5m])) by (instance)`</td></tr></table> |
| 摘要 | <table><tr><td>total</td><td>`sum(rate(grpc_server_started_total{grpc_type="unary"}[5m]))`</td></tr><tr><td>fail</td><td>`sum(rate(grpc_server_handled_total{grpc_type="unary",grpc_code!="OK"}[5m]))`</td></tr></table> |

### 磁盘操作

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>commit-called-by-backend</td><td>`sum(rate(etcd_disk_backend_commit_duration_seconds_sum[1m])) by (instance)`</td></tr><tr><td>fsync-called-by-wal</td><td>`sum(rate(etcd_disk_wal_fsync_duration_seconds_sum[1m])) by (instance)`</td></tr></table> |
| 摘要 | <table><tr><td>commit-called-by-backend</td><td>`sum(rate(etcd_disk_backend_commit_duration_seconds_sum[1m]))`</td></tr><tr><td>fsync-called-by-wal</td><td>`sum(rate(etcd_disk_wal_fsync_duration_seconds_sum[1m]))`</td></tr></table> |

### 磁盘同步持续时间

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>wal</td><td>`histogram_quantile(0.99, sum(rate(etcd_disk_wal_fsync_duration_seconds_bucket[5m])) by (instance, le))`</td></tr><tr><td>db</td><td>`histogram_quantile(0.99, sum(rate(etcd_disk_backend_commit_duration_seconds_bucket[5m])) by (instance, le))`</td></tr></table> |
| 摘要 | <table><tr><td>wal</td><td>`sum(histogram_quantile(0.99, sum(rate(etcd_disk_wal_fsync_duration_seconds_bucket[5m])) by (instance, le)))`</td></tr><tr><td>db</td><td>`sum(histogram_quantile(0.99, sum(rate(etcd_disk_backend_commit_duration_seconds_bucket[5m])) by (instance, le)))`</td></tr></table> |

## Kubernetes 组件指标

### API Server 请求延迟

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `avg(apiserver_request_latencies_sum / apiserver_request_latencies_count) by (instance, verb) /1e+06` |
| 摘要 | `avg(apiserver_request_latencies_sum / apiserver_request_latencies_count) by (instance) /1e+06` |

### API Server 请求率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `sum(rate(apiserver_request_count[5m])) by (instance, code)` |
| 摘要 | `sum(rate(apiserver_request_count[5m])) by (instance)` |

### 调度失败的 Pod

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `sum(kube_pod_status_scheduled{condition="false"})` |
| 摘要 | `sum(kube_pod_status_scheduled{condition="false"})` |

### 控制器管理器队列深度

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>volumes</td><td>`sum(volumes_depth) by instance`</td></tr><tr><td>deployment</td><td>`sum(deployment_depth) by instance`</td></tr><tr><td>replicaset</td><td>`sum(replicaset_depth) by instance`</td></tr><tr><td>service</td><td>`sum(service_depth) by instance`</td></tr><tr><td>serviceaccount</td><td>`sum(serviceaccount_depth) by instance`</td></tr><tr><td>endpoint</td><td>`sum(endpoint_depth) by instance`</td></tr><tr><td>daemonset</td><td>`sum(daemonset_depth) by instance`</td></tr><tr><td>statefulset</td><td>`sum(statefulset_depth) by instance`</td></tr><tr><td>replicationmanager</td><td>`sum(replicationmanager_depth) by instance`</td></tr></table> |
| 摘要 | <table><tr><td>volumes</td><td>`sum(volumes_depth)`</td></tr><tr><td>deployment</td><td>`sum(deployment_depth)`</td></tr><tr><td>replicaset</td><td>`sum(replicaset_depth)`</td></tr><tr><td>service</td><td>`sum(service_depth)`</td></tr><tr><td>serviceaccount</td><td>`sum(serviceaccount_depth)`</td></tr><tr><td>endpoint</td><td>`sum(endpoint_depth)`</td></tr><tr><td>daemonset</td><td>`sum(daemonset_depth)`</td></tr><tr><td>statefulset</td><td>`sum(statefulset_depth)`</td></tr><tr><td>replicationmanager</td><td>`sum(replicationmanager_depth)`</td></tr></table> |

### 调度器 E2E 调度延迟

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `histogram_quantile(0.99, sum(scheduler_e2e_scheduling_latency_microseconds_bucket) by (le, instance)) / 1e+06` |
| 摘要 | `sum(histogram_quantile(0.99, sum(scheduler_e2e_scheduling_latency_microseconds_bucket) by (le, instance)) / 1e+06)` |

### 调度程序抢占尝试

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `sum(rate(scheduler_total_preemption_attempts[5m])) by (instance)` |
| 摘要 | `sum(rate(scheduler_total_preemption_attempts[5m]))` |

### Ingress Controller 连接数

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>reading</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="reading"}) by (instance)`</td></tr><tr><td>waiting</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="waiting"}) by (instance)`</td></tr><tr><td>writing</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="writing"}) by (instance)`</td></tr><tr><td>accepted</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="accepted"}[5m]))) by (instance)`</td></tr><tr><td>active</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="active"}[5m]))) by (instance)`</td></tr><tr><td>handled</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="handled"}[5m]))) by (instance)`</td></tr></table> |
| 摘要 | <table><tr><td>reading</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="reading"})`</td></tr><tr><td>waiting</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="waiting"})`</td></tr><tr><td>writing</td><td>`sum(nginx_ingress_controller_nginx_process_connections{state="writing"})`</td></tr><tr><td>accepted</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="accepted"}[5m])))`</td></tr><tr><td>active</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="active"}[5m])))`</td></tr><tr><td>handled</td><td>`sum(ceil(increase(nginx_ingress_controller_nginx_process_connections_total{state="handled"}[5m])))`</td></tr></table> |

### Ingress Controller 请求处理时间

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `topk(10, histogram_quantile(0.95,sum by (le, host, path)(rate(nginx_ingress_controller_request_duration_seconds_bucket{host!="_"}[5m]))))` |
| 摘要 | `topk(10, histogram_quantile(0.95,sum by (le, host)(rate(nginx_ingress_controller_request_duration_seconds_bucket{host!="_"}[5m]))))` |

## Rancher Logging 指标

### Fluentd 缓冲区队列速率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `sum(rate(fluentd_output_status_buffer_queue_length[5m])) by (instance)` |
| 摘要 | `sum(rate(fluentd_output_status_buffer_queue_length[5m]))` |

### Fluentd 输入率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `sum(rate(fluentd_input_status_num_records_total[5m])) by (instance)` |
| 摘要 | `sum(rate(fluentd_input_status_num_records_total[5m]))` |

### Fluentd 输出错误率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `sum(rate(fluentd_output_status_num_errors[5m])) by (type)` |
| 摘要 | `sum(rate(fluentd_output_status_num_errors[5m]))` |

### Fluentd 输出率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `sum(rate(fluentd_output_status_num_records_total[5m])) by (instance)` |
| 摘要 | `sum(rate(fluentd_output_status_num_records_total[5m]))` |

## Workload 指标

### Workload CPU 利用率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>cfs throttled seconds</td><td>`sum(rate(container_cpu_cfs_throttled_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>user seconds</td><td>`sum(rate(container_cpu_user_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>system seconds</td><td>`sum(rate(container_cpu_system_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>usage seconds</td><td>`sum(rate(container_cpu_usage_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr></table> |
| 摘要 | <table><tr><td>cfs throttled seconds</td><td>`sum(rate(container_cpu_cfs_throttled_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>user seconds</td><td>`sum(rate(container_cpu_user_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>system seconds</td><td>`sum(rate(container_cpu_system_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>usage seconds</td><td>`sum(rate(container_cpu_usage_seconds_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr></table> |

### Workload 内存利用率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `sum(container_memory_working_set_bytes{namespace="$namespace",pod_name=~"$podName", container_name!=""}) by (pod_name)` |
| 摘要 | `sum(container_memory_working_set_bytes{namespace="$namespace",pod_name=~"$podName", container_name!=""})` |

### Workload 网络数据包

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>receive-packets</td><td>`sum(rate(container_network_receive_packets_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>receive-dropped</td><td>`sum(rate(container_network_receive_packets_dropped_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>receive-errors</td><td>`sum(rate(container_network_receive_errors_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>transmit-packets</td><td>`sum(rate(container_network_transmit_packets_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>transmit-dropped</td><td>`sum(rate(container_network_transmit_packets_dropped_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>transmit-errors</td><td>`sum(rate(container_network_transmit_errors_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr></table> |
| 摘要 | <table><tr><td>receive-packets</td><td>`sum(rate(container_network_receive_packets_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-dropped</td><td>`sum(rate(container_network_receive_packets_dropped_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-errors</td><td>`sum(rate(container_network_receive_errors_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-packets</td><td>`sum(rate(container_network_transmit_packets_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-dropped</td><td>`sum(rate(container_network_transmit_packets_dropped_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-errors</td><td>`sum(rate(container_network_transmit_errors_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr></table> |

### Workload 网络 I/O

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>receive</td><td>`sum(rate(container_network_receive_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>transmit</td><td>`sum(rate(container_network_transmit_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr></table> |
| 摘要 | <table><tr><td>receive</td><td>`sum(rate(container_network_receive_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit</td><td>`sum(rate(container_network_transmit_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr></table> |

### Workload 磁盘 I/O

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>read</td><td>`sum(rate(container_fs_reads_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr><tr><td>write</td><td>`sum(rate(container_fs_writes_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m])) by (pod_name)`</td></tr></table> |
| 摘要 | <table><tr><td>read</td><td>`sum(rate(container_fs_reads_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr><tr><td>write</td><td>`sum(rate(container_fs_writes_bytes_total{namespace="$namespace",pod_name=~"$podName",container_name!=""}[5m]))`</td></tr></table> |

## Pod 指标

### Pod CPU 利用率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>cfs throttled seconds</td><td>`sum(rate(container_cpu_cfs_throttled_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m])) by (container_name)`</td></tr><tr><td>usage seconds</td><td>`sum(rate(container_cpu_usage_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m])) by (container_name)`</td></tr><tr><td>system seconds</td><td>`sum(rate(container_cpu_system_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m])) by (container_name)`</td></tr><tr><td>user seconds</td><td>`sum(rate(container_cpu_user_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m])) by (container_name)`</td></tr></table> |
| 摘要 | <table><tr><td>cfs throttled seconds</td><td>`sum(rate(container_cpu_cfs_throttled_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m]))`</td></tr><tr><td>usage seconds</td><td>`sum(rate(container_cpu_usage_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m]))`</td></tr><tr><td>system seconds</td><td>`sum(rate(container_cpu_system_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m]))`</td></tr><tr><td>user seconds</td><td>`sum(rate(container_cpu_user_seconds_total{container_name!="POD",namespace="$namespace",pod_name="$podName", container_name!=""}[5m]))`</td></tr></table> |

### Pod 内存利用率

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | `sum(container_memory_working_set_bytes{container_name!="POD",namespace="$namespace",pod_name="$podName",container_name!=""}) by (container_name)` |
| 摘要 | `sum(container_memory_working_set_bytes{container_name!="POD",namespace="$namespace",pod_name="$podName",container_name!=""})` |

### Pod 网络数据包

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>receive-packets</td><td>`sum(rate(container_network_receive_packets_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-dropped</td><td>`sum(rate(container_network_receive_packets_dropped_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-errors</td><td>`sum(rate(container_network_receive_errors_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-packets</td><td>`sum(rate(container_network_transmit_packets_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-dropped</td><td>`sum(rate(container_network_transmit_packets_dropped_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-errors</td><td>`sum(rate(container_network_transmit_errors_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr></table> |
| 摘要 | <table><tr><td>receive-packets</td><td>`sum(rate(container_network_receive_packets_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-dropped</td><td>`sum(rate(container_network_receive_packets_dropped_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>receive-errors</td><td>`sum(rate(container_network_receive_errors_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-packets</td><td>`sum(rate(container_network_transmit_packets_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-dropped</td><td>`sum(rate(container_network_transmit_packets_dropped_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit-errors</td><td>`sum(rate(container_network_transmit_errors_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr></table> |

### Pod 网络 I/O

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>receive</td><td>`sum(rate(container_network_receive_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit</td><td>`sum(rate(container_network_transmit_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr></table> |
| 摘要 | <table><tr><td>receive</td><td>`sum(rate(container_network_receive_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>transmit</td><td>`sum(rate(container_network_transmit_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr></table> |

### Pod 磁盘 I/O

| 目录 | 表达式 |
| --- | --- |
| 详细信息 | <table><tr><td>read</td><td>`sum(rate(container_fs_reads_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m])) by (container_name)`</td></tr><tr><td>write</td><td>`sum(rate(container_fs_writes_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m])) by (container_name)`</td></tr></table> |
| 摘要 | <table><tr><td>read</td><td>`sum(rate(container_fs_reads_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr><tr><td>write</td><td>`sum(rate(container_fs_writes_bytes_total{namespace="$namespace",pod_name="$podName",container_name!=""}[5m]))`</td></tr></table> |

## Container 指标

### Container CPU 利用率

| 目录 | 表达式 |
| --- | --- |
| cfs throttled seconds | `sum(rate(container_cpu_cfs_throttled_seconds_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))` |
| usage seconds | `sum(rate(container_cpu_usage_seconds_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))` |
| system seconds | `sum(rate(container_cpu_system_seconds_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))` |
| user seconds | `sum(rate(container_cpu_user_seconds_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))` |

### Container 内存利用率

`sum(container_memory_working_set_bytes{namespace="$namespace",pod_name="$podName",container_name="$containerName"})`

### Container 磁盘 I/O

| 目录 | 表达式 |
| --- | --- |
| read | `sum(rate(container_fs_reads_bytes_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))` |
| write | `sum(rate(container_fs_writes_bytes_total{namespace="$namespace",pod_name="$podName",container_name="$containerName"}[5m]))` |