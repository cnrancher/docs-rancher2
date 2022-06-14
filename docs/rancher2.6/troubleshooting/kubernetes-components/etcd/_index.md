---
title: etcd 节点故障排除
weight: 1
---

本文介绍了对具有 `etcd` 角色的节点进行故障排除的命令和提示。

本文涵盖以下主题：

- [检查 etcd 容器是否正在运行](#checking-if-the-etcd-container-is-running)
- [etcd 容器日志记录](#etcd-container-logging)
- [etcd 集群和连接检查](#etcd-cluster-and-connectivity-checks)
   - [检查所有节点上的 etcd 成员](#check-etcd-members-on-all-nodes)
   - [检查端点状态](#check-endpoint-status)
   - [检查端点健康](#check-endpoint-health)
   - [检查端口 TCP/2379 上的连接](#check-connectivity-on-port-tcp-2379)
   - [检查端口 TCP/2380 上的连接](#check-connectivity-on-port-tcp-2380)
- [etcd 告警](#etcd-alarms)
- [etcd 空间错误](#etcd-space-errors)
- [日志级别](#log-level)
- [etcd 内容](#etcd-content)
   - [查看流事件](#watch-streaming-events)
   - [直接查询 etcd](#query-etcd-directly)
- [更换不健康的 etcd 节点](#replacing-unhealthy-etcd-nodes)

## 检查 etcd 容器是否正在运行

etcd 容器的状态应该是 **Up**。**Up** 后面显示的时间指的是容器运行的时间。

```
docker ps -a -f=name=etcd$
```

输出示例：
```
CONTAINER ID        IMAGE                         COMMAND                  CREATED             STATUS              PORTS               NAMES
605a124503b9        rancher/coreos-etcd:v3.2.18   "/usr/local/bin/et..."   2 hours ago         Up 2 hours                              etcd
```

## etcd 容器日志记录

容器的日志记录可能包含问题的信息。

```
docker logs etcd
```
| 日志 | 解释 |
|-----|------------------|
| `health check for peer xxx could not connect: dial tcp IP:2380: getsockopt: connection refused` | 无法连接到端口 2380 上显示的地址。检查 etcd 容器是否在显示地址的主机上运行。 |
| `xxx is starting a new election at term x` | etcd 集群失去了集群仲裁数量，并正在尝试建立一个新的 leader。运行 etcd 的大多数节点关闭/无法访问时，可能会发生这种情况。 |
| `connection error: desc = "transport: Error while dialing dial tcp 0.0.0.0:2379: i/o timeout"; Reconnecting to {0.0.0.0:2379 0  <nil>}` | 主机防火墙正在阻止网络通信。 |
| `rafthttp: request cluster ID mismatch` | 具有 etcd 实例日志 `rafthttp: request cluster ID mismatch` 的节点正在尝试加入已经添加另一个对等节点（peer）的集群。你需要从集群中删除该节点，然后再重新添加。 |
| `rafthttp: failed to find member` | 集群状态（`/var/lib/etcd`）包含加入集群的错误信息。你需要从集群中删除该节点，清理状态目录，然后再重新添加。 |

## etcd 集群和连接检查

运行 etcd 的主机的地址配置决定了 etcd 监听的地址。如果为运行 etcd 的主机配置了内部地址，则需要显式指定 `etcdctl` 的端点。如果任何命令的响应是 `Error:  context deadline exceeded`，则 etcd 实例不健康（仲裁丢失或实例未正确加入集群）。

### 检查所有节点上的 etcd 成员

输出应包含具有 `etcd` 角色的所有节点，而且所有节点上的输出应该是相同的。

命令：
```
docker exec etcd etcdctl member list
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
docker exec etcd sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT member list"
```

输出示例：
```
xxx, started, etcd-xxx, https://IP:2380, https://IP:2379,https://IP:4001
xxx, started, etcd-xxx, https://IP:2380, https://IP:2379,https://IP:4001
xxx, started, etcd-xxx, https://IP:2380, https://IP:2379,https://IP:4001
```

### 检查端点状态

`RAFT TERM` 的值应该是相等的，而且 `RAFT INDEX` 相差不能太大。

命令：
```
docker exec -e ETCDCTL_ENDPOINTS=$(docker exec etcd /bin/sh -c "etcdctl member list | cut -d, -f5 | sed -e 's/ //g' | paste -sd ','") etcd etcdctl endpoint status --write-out table
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
docker exec etcd etcdctl endpoint status --endpoints=$(docker exec etcd /bin/sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT member list | cut -d, -f5 | sed -e 's/ //g' | paste -sd ','") --write-out table
```

输出示例：
```
+-----------------+------------------+---------+---------+-----------+-----------+------------+
| ENDPOINT        |        ID        | VERSION | DB SIZE | IS LEADER | RAFT TERM | RAFT INDEX |
+-----------------+------------------+---------+---------+-----------+-----------+------------+
| https://IP:2379 | 333ef673fc4add56 |  3.2.18 |   24 MB |     false |        72 |      66887 |
| https://IP:2379 | 5feed52d940ce4cf |  3.2.18 |   24 MB |      true |        72 |      66887 |
| https://IP:2379 | db6b3bdb559a848d |  3.2.18 |   25 MB |     false |        72 |      66887 |
+-----------------+------------------+---------+---------+-----------+-----------+------------+
```

### 检查端点健康

命令：
```
docker exec -e ETCDCTL_ENDPOINTS=$(docker exec etcd /bin/sh -c "etcdctl member list | cut -d, -f5 | sed -e 's/ //g' | paste -sd ','") etcd etcdctl endpoint health
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
docker exec etcd etcdctl endpoint health --endpoints=$(docker exec etcd /bin/sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT member list | cut -d, -f5 | sed -e 's/ //g' | paste -sd ','")
```

输出示例：
```
https://IP:2379 is healthy: successfully committed proposal: took = 2.113189ms
https://IP:2379 is healthy: successfully committed proposal: took = 2.649963ms
https://IP:2379 is healthy: successfully committed proposal: took = 2.451201ms
```

### 检查端口 TCP/2379 上的连接

命令：
```
for endpoint in $(docker exec etcd /bin/sh -c "etcdctl member list | cut -d, -f5"); do
   echo "Validating connection to ${endpoint}/health"
   docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl -s -w "\n" --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) "${endpoint}/health"
done
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
for endpoint in $(docker exec etcd /bin/sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT member list | cut -d, -f5"); do
  echo "Validating connection to ${endpoint}/health";
  docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl -s -w "\n" --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) "${endpoint}/health"
done
```

输出示例：
```
Validating connection to https://IP:2379/health
{"health": "true"}
Validating connection to https://IP:2379/health
{"health": "true"}
Validating connection to https://IP:2379/health
{"health": "true"}
```

### 检查端口 TCP/2380 上的连接

命令：
```
for endpoint in $(docker exec etcd /bin/sh -c "etcdctl member list | cut -d, -f4"); do
  echo "Validating connection to ${endpoint}/version";
  docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl --http1.1 -s -w "\n" --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) "${endpoint}/version"
done
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
for endpoint in $(docker exec etcd /bin/sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT member list | cut -d, -f4"); do
  echo "Validating connection to ${endpoint}/version";
  docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl --http1.1 -s -w "\n" --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) "${endpoint}/version"
done
```

输出示例：
```
Validating connection to https://IP:2380/version
{"etcdserver":"3.2.18","etcdcluster":"3.2.0"}
Validating connection to https://IP:2380/version
{"etcdserver":"3.2.18","etcdcluster":"3.2.0"}
Validating connection to https://IP:2380/version
{"etcdserver":"3.2.18","etcdcluster":"3.2.0"}
```

## etcd 告警

etcd 会触发告警（例如空间不足时）。

命令：
```
docker exec etcd etcdctl alarm list
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
docker exec etcd sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT alarm list"
```

触发 NOSPACE 告警的输出示例：
```
memberID:x alarm:NOSPACE
memberID:x alarm:NOSPACE
memberID:x alarm:NOSPACE
```

## etcd 空间错误

相关的错误消息是 `etcdserver: mvcc: database space exceeded` 或 `applying raft message exceeded backend quota`。告警 `NOSPACE` 会被触发。

解决：

- [压缩键空间](#compact-the-keyspace)
- [对所有 etcd 成员进行碎片整理](#defrag-all-etcd-members)
- [检查端点状态](#check-endpoint-status)
- [解除告警](#disarm-alarm)

### 压缩键空间

命令：
```
rev=$(docker exec etcd etcdctl endpoint status --write-out json | egrep -o '"revision":[0-9]*' | egrep -o '[0-9]*')
docker exec etcd etcdctl compact "$rev"
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
rev=$(docker exec etcd sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT endpoint status --write-out json | egrep -o '\"revision\":[0-9]*' | egrep -o '[0-9]*'")
docker exec etcd sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT compact \"$rev\""
```

输出示例：
```
compacted revision xxx
```

### 对所有 etcd 成员进行碎片整理

命令：
```
docker exec -e ETCDCTL_ENDPOINTS=$(docker exec etcd /bin/sh -c "etcdctl member list | cut -d, -f5 | sed -e 's/ //g' | paste -sd ','") etcd etcdctl defrag
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
docker exec etcd sh -c "etcdctl defrag --endpoints=$(docker exec etcd /bin/sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT member list | cut -d, -f5 | sed -e 's/ //g' | paste -sd ','")"
```

输出示例：
```
Finished defragmenting etcd member[https://IP:2379]
Finished defragmenting etcd member[https://IP:2379]
Finished defragmenting etcd member[https://IP:2379]
```

### 检查端点状态

命令：
```
docker exec -e ETCDCTL_ENDPOINTS=$(docker exec etcd /bin/sh -c "etcdctl member list | cut -d, -f5 | sed -e 's/ //g' | paste -sd ','") etcd etcdctl endpoint status --write-out table
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
docker exec etcd sh -c "etcdctl endpoint status --endpoints=$(docker exec etcd /bin/sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT member list | cut -d, -f5 | sed -e 's/ //g' | paste -sd ','") --write-out table"
```

输出示例：
```
+-----------------+------------------+---------+---------+-----------+-----------+------------+
| ENDPOINT        |        ID        | VERSION | DB SIZE | IS LEADER | RAFT TERM | RAFT INDEX |
+-----------------+------------------+---------+---------+-----------+-----------+------------+
| https://IP:2379 |  e973e4419737125 |  3.2.18 |  553 kB |     false |        32 |    2449410 |
| https://IP:2379 | 4a509c997b26c206 |  3.2.18 |  553 kB |     false |        32 |    2449410 |
| https://IP:2379 | b217e736575e9dd3 |  3.2.18 |  553 kB |      true |        32 |    2449410 |
+-----------------+------------------+---------+---------+-----------+-----------+------------+
```

### 解除告警

如果压缩和整理碎片后确定数据库大小下降了，则需要解除告警来允许 etcd 再次写入。

命令：
```
docker exec etcd etcdctl alarm list
docker exec etcd etcdctl alarm disarm
docker exec etcd etcdctl alarm list
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
docker exec etcd sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT alarm list"
docker exec etcd sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT alarm disarm"
docker exec etcd sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT alarm list"
```

输出示例：
```
docker exec etcd etcdctl alarm list
memberID:x alarm:NOSPACE
memberID:x alarm:NOSPACE
memberID:x alarm:NOSPACE
docker exec etcd etcdctl alarm disarm
docker exec etcd etcdctl alarm list
```

## 日志级别

etcd 的日志级别可以通过 API 来动态更改。你可以使用以下命令来配置调试日志。

命令：
```
docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl -s -XPUT -d '{"Level":"DEBUG"}' --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) $(docker exec etcd printenv ETCDCTL_ENDPOINTS)/config/local/log
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl -s -XPUT -d '{"Level":"DEBUG"}' --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) $(docker exec etcd printenv ETCDCTL_ENDPOINT)/config/local/log
```

要将日志级别重置回默认值 (`INFO`)，你可以使用以下命令。

命令：
```
docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl -s -XPUT -d '{"Level":"INFO"}' --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) $(docker exec etcd printenv ETCDCTL_ENDPOINTS)/config/local/log
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl -s -XPUT -d '{"Level":"INFO"}' --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) $(docker exec etcd printenv ETCDCTL_ENDPOINT)/config/local/log
```

## etcd 内容

如果要查看 etcd 的内容，你可以查看流事件，也可以直接查询 etcd。详情请参阅以下示例。

### 查看流事件

命令：
```
docker exec etcd etcdctl watch --prefix /registry
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
docker exec etcd etcdctl --endpoints=\$ETCDCTL_ENDPOINT watch --prefix /registry
```

如果你只想查看受影响的键（而不是二进制数据），你可以将 `| grep -a ^/registry` 尾附到该命令来过滤键。

### 直接查询 etcd

命令：
```
docker exec etcd etcdctl get /registry --prefix=true --keys-only
```

如果 etcd 版本低于 3.3.x（Kubernetes 1.13.x 及更低版本）且添加节点时指定了 `--internal-address`，则使用以下命令：
```
docker exec etcd etcdctl --endpoints=\$ETCDCTL_ENDPOINT get /registry --prefix=true --keys-only
```

你可以使用以下命令来处理数据，从而获取每个键的计数摘要：

```
docker exec etcd etcdctl get /registry --prefix=true --keys-only | grep -v ^$ | awk -F'/' '{ if ($3 ~ /cattle.io/) {h[$3"/"$4]++} else { h[$3]++ }} END { for(k in h) print h[k], k }' | sort -nr
```

## 更换不健康的 etcd 节点

如果你 etcd 集群中的某个节点变得不健康，在将新的 etcd 节点添加到集群之前，我们建议你修复或删除故障/不健康的节点。
