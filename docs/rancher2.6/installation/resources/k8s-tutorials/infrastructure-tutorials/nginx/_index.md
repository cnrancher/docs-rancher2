---
title: 配置 NGINX 负载均衡器
weight: 4
---

将 NGINX 配置为四层负载均衡器（TCP），用于将连接转发到 Rancher 节点。

在此配置中，负载均衡器位于节点的前面。负载均衡器可以是任何能运行 NGINX 的主机。

注意：不要使用 Rancher 节点作为负载均衡器。

> 这些示例中，负载均衡器将流量转发到三个 Rancher Server 节点。如果 Rancher 安装在 RKE Kubernetes 集群上，则需要三个节点。如果 Rancher 安装在 K3s Kubernetes 集群上，则只需要两个节点。

## 安装 NGINX

首先，在要用作负载均衡器的节点上安装 NGINX。NGINX 有适用于所有已知操作系统的软件包。已测试的版本为 `1.14` 和 `1.15`。如需获得安装 NGINX 的帮助，请参见[安装文档](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)。

`stream` 模块是必需的，NGINX 官方安装包包含了该模块。请参见你操作系统的文档，了解如何在操作系统上安装和启用 NGINX 的 `stream` 模块。

## 创建 NGINX 配置

安装 NGINX 后，使用节点的 IP 地址更新 NGINX 配置文件 `nginx.conf`。

1. 将以下的示例代码复制并粘贴到你使用的文本编辑器中。将文件保存为 `nginx.conf`。

2. 在 `nginx.conf` 中，将所有（端口 80 和端口 443）的 `<IP_NODE_1>`，`<IP_NODE_2>`和 `<IP_NODE_3>` 替换为你节点的 IP 地址。

   > **注意**：参见 [NGINX 文档：TCP 和 UDP 负载均衡](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)了解所有配置选项。

NGINX 配置示例:
```
    worker_processes 4;
    worker_rlimit_nofile 40000;

    events {
        worker_connections 8192;
    }

    stream {
        upstream rancher_servers_http {
            least_conn;
            server <IP_NODE_1>:80 max_fails=3 fail_timeout=5s;
            server <IP_NODE_2>:80 max_fails=3 fail_timeout=5s;
            server <IP_NODE_3>:80 max_fails=3 fail_timeout=5s;
        }
        server {
            listen 80;
            proxy_pass rancher_servers_http;
        }

        upstream rancher_servers_https {
            least_conn;
            server <IP_NODE_1>:443 max_fails=3 fail_timeout=5s;
            server <IP_NODE_2>:443 max_fails=3 fail_timeout=5s;
            server <IP_NODE_3>:443 max_fails=3 fail_timeout=5s;
        }
        server {
            listen     443;
            proxy_pass rancher_servers_https;
        }

    }
```


3. 将 `nginx.conf` 保存到你的负载均衡器的 `/etc/nginx/nginx.conf` 路径上。

4. 运行以下命令重新加载 NGINX 配置：

   ```
   # nginx -s reload
   ```

## 可选 - 将 NGINX 作为 Docker 容器运行

除了将 NGINX 作为软件包安装在操作系统上外，你也可以将其作为 Docker 容器运行。将编辑后的 **NGINX 配置示例** 保存为`/etc/nginx.conf`，并运行以下命令来启动 NGINX 容器：

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /etc/nginx.conf:/etc/nginx/nginx.conf \
  nginx:1.14
```
