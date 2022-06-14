---
title: nginx-proxy 故障排除
weight: 3
---

每个没有 `control plane` 角色的节点上都部署了 `nginx-proxy` 容器。`nginx-proxy` 基于具有 `control plane` 角色的可用节点来动态生成 NGINX 配置，从而提供对这些 `control plane` 角色节点的访问。

## 检查容器是否正在运行

该容器称为 `nginx-proxy`，它的状态应该是 `Up`。`Up` 后面显示的时间指的是容器运行的时间。

```
docker ps -a -f=name=nginx-proxy
```

输出示例：

```
docker ps -a -f=name=nginx-proxy
CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS              PORTS               NAMES
c3e933687c0e        rancher/rke-tools:v0.1.15   "nginx-proxy CP_HO..."   3 hours ago         Up 3 hours                              nginx-proxy
```

## 检查生成的 NGINX 配置

生成的配置包括了具有 `control plane` 角色的节点的 IP 地址。你可以使用以下命令来检查配置：

```
docker exec nginx-proxy cat /etc/nginx/nginx.conf
```

输出示例：
```
error_log stderr notice;

worker_processes auto;
events {
  multi_accept on;
  use epoll;
  worker_connections 1024;
}

stream {
        upstream kube_apiserver {

            server ip_of_controlplane_node1:6443;

            server ip_of_controlplane_node2:6443;

        }

        server {
            listen        6443;
            proxy_pass    kube_apiserver;
            proxy_timeout 30;
            proxy_connect_timeout 2s;

        }

}
```

## nginx-proxy 容器日志记录

容器的日志记录可能包含问题的信息。

```
docker logs nginx-proxy
```
