---
title: NGINX 代理问题排查
description: nginx-proxy 容器部署在除了controlplane角色的所有节点上。他通过动态生成 NGINX 的配置，从而提供对controlplane角色节点的访问。
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
  - NGINX 代理问题排查
---

`nginx-proxy` 容器部署在除了`controlplane`角色的所有节点上。他通过动态生成 NGINX 的配置，从而提供对`controlplane`角色节点的访问。

## 检查容器是否正在运行

nginx-proxy 容器在正常情况应该是 **Up** 状态。 并且 **Up** 状态应该是长时间运行，通过下面命令可以进行检查：

```
docker ps -a -f=name=nginx-proxy
```

输出示例：

```
docker ps -a -f=name=nginx-proxy
CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS              PORTS               NAMES
c3e933687c0e        rancher/rke-tools:v0.1.15   "nginx-proxy CP_HO..."   3 hours ago         Up 3 hours                              nginx-proxy
```

## 检查动态生成的 NGINX 配置

生成的配置应包括具有`controlplane`角色的节点的 IP 地址。 可以使用以下命令检查配置：

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

## nginx-proxy 容器日志

通过下面命令查看容器日志信息可以查看到可能包含的`nginx-proxy`错误信息：

```
docker logs nginx-proxy
```
