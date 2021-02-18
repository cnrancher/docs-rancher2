---
title: etcd 节点问题排查
description: 本节包含对具有`etcd`角色的节点进行故障排查的命令和技巧。
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
  - 常见故障排查
  - Kubernetes组件
  - etcd 节点问题排查
---

本节包含对具有`etcd`角色的节点进行故障排查的命令和技巧。

## 检查 etcd 容器是否正在运行

etcd 的容器的状态应为**Up**。**Up**之后显示的持续时间是容器运行的时间。

```
docker ps -a -f=name=etcd$
```

输出示例:

```
CONTAINER ID        IMAGE                         COMMAND                  CREATED             STATUS              PORTS               NAMES
605a124503b9        rancher/coreos-etcd:v3.2.18   "/usr/local/bin/et..."   2 hours ago         Up 2 hours                              etcd
```

## etcd 容器日志

容器的日志记录可以包含有关可能出现的问题的信息。

```
docker logs etcd
```

| 日志                                                                                                                                   | 说明                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `health check for peer xxx could not connect: dial tcp IP:2380: getsockopt: connection refused`                                        | 无法建立与这个 IP 的 2380 端口进行连接。检查 etcd 容器是否在那个 IP 的主机上运行。                                                                  |
| `xxx is starting a new election at term x`                                                                                             | etcd 集群已经失去了法定人数，正在尝试建立新的领导者。当大多数运行 etcd 的节点出现故障或无法访问时，可能会发生这种情况。                             |
| `connection error: desc = "transport: Error while dialing dial tcp 0.0.0.0:2379: i/o timeout"; Reconnecting to {0.0.0.0:2379 0 <nil>}` | 主机防火墙阻止了网络通信。                                                                                                                          |
| `rafthttp: request cluster ID mismatch`                                                                                                | 运行着 etcd 实例并记录`rafthttp: request cluster ID mismatch`的节点正在尝试加入另一个由其他成员构成的集群。应该从集群中删除这个节点，然后重新添加。 |
| `rafthttp: failed to find member`                                                                                                      | 集群状态 (`/var/lib/etcd`) 包含错误信息，无法加入集群。应该从集群中删除这个节点，并删除状态目录，然后重新添加。                                     |

## etcd 集群和连接性检查

etcd 监听的地址取决于运行 etcd 的主机的地址配置。如果为运行 etcd 的主机配置了内部地址，则需要显式指定`etcdctl`的端点。如果有任何命令响应`Error: context deadline exceeded`，则代表 etcd 实例不正常（仲裁丢失或该实例未正确加入集群）

### 检查所有节点上的 etcd 成员

输出应包含所有具有 etcd 角色的节点，并且所有节点上的输出应相同。

命令：

```
docker exec etcd etcdctl member list
```

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

```
docker exec etcd sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT member list"
```

输出示例:

```
xxx, started, etcd-xxx, https://IP:2380, https://IP:2379,https://IP:4001
xxx, started, etcd-xxx, https://IP:2380, https://IP:2379,https://IP:4001
xxx, started, etcd-xxx, https://IP:2380, https://IP:2379,https://IP:4001
```

### 检查端点状态

`RAFT TERM`的值应相等，`RAFT INDEX`的距离不应太远。

命令：

```
docker exec -e ETCDCTL_ENDPOINTS=$(docker exec etcd /bin/sh -c "etcdctl member list | cut -d, -f5 | sed -e 's/ //g' | paste -sd ','") etcd etcdctl endpoint status --write-out table
```

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

```
docker exec etcd etcdctl endpoint status --endpoints=$(docker exec etcd /bin/sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT member list | cut -d, -f5 | sed -e 's/ //g' | paste -sd ','") --write-out table
```

输出示例:

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

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

```
docker exec etcd etcdctl endpoint health --endpoints=$(docker exec etcd /bin/sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT member list | cut -d, -f5 | sed -e 's/ //g' | paste -sd ','")
```

输出示例:

```
https://IP:2379 is healthy: successfully committed proposal: took = 2.113189ms
https://IP:2379 is healthy: successfully committed proposal: took = 2.649963ms
https://IP:2379 is healthy: successfully committed proposal: took = 2.451201ms
```

### 检查端口 TCP / 2379 的连接

命令：

```
for endpoint in $(docker exec etcd /bin/sh -c "etcdctl member list | cut -d, -f5"); do
   echo "Validating connection to ${endpoint}/health"
   docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl -s -w "\n" --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) "${endpoint}/health"
done
```

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

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

### 检查端口 TCP / 2380 的连接

命令：

```
for endpoint in $(docker exec etcd /bin/sh -c "etcdctl member list | cut -d, -f4"); do
  echo "Validating connection to ${endpoint}/version";
  docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl --http1.1 -s -w "\n" --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) "${endpoint}/version"
done
```

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

```
for endpoint in $(docker exec etcd /bin/sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT member list | cut -d, -f4"); do
  echo "Validating connection to ${endpoint}/version";
  docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl --http1.1 -s -w "\n" --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) "${endpoint}/version"
done
```

输出示例:

```
Validating connection to https://IP:2380/version
{"etcdserver":"3.2.18","etcdcluster":"3.2.0"}
Validating connection to https://IP:2380/version
{"etcdserver":"3.2.18","etcdcluster":"3.2.0"}
Validating connection to https://IP:2380/version
{"etcdserver":"3.2.18","etcdcluster":"3.2.0"}
```

## etcd 警报

例如，etcd 空间不足时，etcd 将触发警报。

命令：

```
docker exec etcd etcdctl alarm list
```

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

```
docker exec etcd sh -c "etcdctl --endpoints=\$ETCDCTL_ENDPOINT alarm list"
```

触发 NOSPACE 警报时的示例输出:

```
memberID:x alarm:NOSPACE
memberID:x alarm:NOSPACE
memberID:x alarm:NOSPACE
```

## etcd 空间错误

相关错误消息是`etcdserver: mvcc: database space exceeded`或`applying raft message exceeded backend quota`。警报`NOSPACE`将被触发。

解决方法：

### 压缩键空间

命令：

```
rev=$(docker exec etcd etcdctl endpoint status --write-out json | egrep -o '"revision":[0-9]*' | egrep -o '[0-9]*')
docker exec etcd etcdctl compact "$rev"
```

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

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

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

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

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

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

确认压缩和碎片整理后 DB 大小减小后，需要解除该告警，以便 etcd 允许再次写入。

命令：

```
docker exec etcd etcdctl alarm list
docker exec etcd etcdctl alarm disarm
docker exec etcd etcdctl alarm list
```

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

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

可以通过 API 动态更改 etcd 的日志级别。您可以使用以下命令配置调试日志记录。

命令：

```
docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl -s -XPUT -d '{"Level":"DEBUG"}' --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) $(docker exec etcd printenv ETCDCTL_ENDPOINTS)/config/local/log
```

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

```
docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl -s -XPUT -d '{"Level":"DEBUG"}' --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) $(docker exec etcd printenv ETCDCTL_ENDPOINT)/config/local/log
```

要将日志级别重置回默认值（INFO），可以使用以下命令。

命令：

```
docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl -s -XPUT -d '{"Level":"INFO"}' --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) $(docker exec etcd printenv ETCDCTL_ENDPOINTS)/config/local/log
```

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

```
docker run --net=host -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro appropriate/curl -s -XPUT -d '{"Level":"INFO"}' --cacert $(docker exec etcd printenv ETCDCTL_CACERT) --cert $(docker exec etcd printenv ETCDCTL_CERT) --key $(docker exec etcd printenv ETCDCTL_KEY) $(docker exec etcd printenv ETCDCTL_ENDPOINT)/config/local/log
```

## etcd 内容

如果要调查 etcd 的内容，则可以观看事件流或直接查询 etcd，请参见以下示例。

### 查看实时事件

命令：

```
docker exec etcd etcdctl watch --prefix /registry
```

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

```
docker exec etcd etcdctl --endpoints=\$ETCDCTL_ENDPOINT watch --prefix /registry
```

如果只想查看受影响的键（而不是二进制数据），则可以附加 `| grep -a ^/registry` 命令仅过滤键。

### 直接查询 etcd

命令：

```
docker exec etcd etcdctl get /registry --prefix=true --keys-only
```

当使用低于 3.3.x 的 etcd 版本（Kubernetes 1.13.x 及更低版本）并且添加节点时指定了`--internal-address` 时的命令：

```
docker exec etcd etcdctl --endpoints=\$ETCDCTL_ENDPOINT get /registry --prefix=true --keys-only
```

您可以使用以下命令处理数据以获取每个键计数的摘要：

```
docker exec etcd etcdctl get /registry --prefix=true --keys-only | grep -v ^$ | awk -F'/' '{ if ($3 ~ /cattle.io/) {h[$3"/"$4]++} else { h[$3]++ }} END { for(k in h) print h[k], k }' | sort -nr
```

## 更换不健康的 etcd 节点

当您的 etcd 集群中的某个节点不正常时，建议的方法是在将新的 etcd 节点添加到集群之前，先修复或删除出现故障或不正常的节点。
