---
title: 日志管理
weight: 110
---

Rancher 使用了以下日志级别：

| 名称 | 描述 |
|---------|-------------|
| `info` | 记录信息性消息。这是默认的日志级别。 |
| `debug` | 记录可用于调试的更详细消息。 |
| `trace` | 记录内部功能的非常详细的消息。非常冗长，并且可能包含敏感信息。 |

### 如何配置日志级别

* Kubernetes 安装
* 配置 debug 日志级别
```
$ KUBECONFIG=./kube_config_cluster.yml
$ kubectl -n cattle-system get pods -l app=rancher --no-headers -o custom-columns=name:.metadata.name | while read rancherpod; do kubectl -n cattle-system exec $rancherpod -c rancher -- loglevel --set debug; done
OK
OK
OK
$ kubectl -n cattle-system logs -l app=rancher -c rancher
```

* 配置 info 日志级别
```
$ KUBECONFIG=./kube_config_cluster.yml
$ kubectl -n cattle-system get pods -l app=rancher --no-headers -o custom-columns=name:.metadata.name | while read rancherpod; do kubectl -n cattle-system exec $rancherpod -c rancher -- loglevel --set info; done
OK
OK
OK
```

* Docker 安装
* 配置 debug 日志级别
```
$ docker exec -ti <container_id> loglevel --set debug
OK
$ docker logs -f <container_id>
```

* 配置 info 日志级别
```
$ docker exec -ti <container_id> loglevel --set info
OK
```
