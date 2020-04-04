---
title: 配置 NGINX
---

NGINX 将被配置为 4 层负载均衡器(TCP)，将连接转发到其中一个 Rancher Server 节点。

> **注意事项:**
> 在此配置中，负载均衡器位于节点的前面。负载均衡器可以是任何能够运行 NGINX 的主机。
>
> 警告：不要将 Rancher 节点之一用作负载均衡器。

## 安装 NGINX

首先在要用作负载均衡器的节点上安装 NGINX。NGINX 在所有已知操作系统中都提供了可用的软件包。已测试的版本是`1.14`和`1.15`。Nginx 安装帮助文档，参考这里[安装文档](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)。

需要使用`stream`模块，该模块在使用官方 NGINX 软件包时提供。请参考您的操作系统文档，了解如何在操作系统上安装和启用 NGINX`stream`模块。

## 创建 NGINX 配置文件

安装 NGINX 之后，您需要使用节点的 IP 地址更新 NGINX 配置文件`nginx.conf`。

1.  将下面的代码示例复制并粘贴到您喜欢的文本编辑器中。将其另存为`nginx.conf`。

2.  在`nginx.conf`中, 使用[节点](/docs/installation/options/helm2/create-nodes-lb/_index)IPs 替换(端口 80 和 端口 443)的`<IP_NODE_1>`, `<IP_NODE_2>`, 和`<IP_NODE_3>`。

    > **注意事项:** 可配置项请参考[NGINX 文档: TCP and UDP Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/_index)。

    <figcaption>NGINX 配置文件示例</figcaption>

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

3.  为负载均衡器保存`nginx.conf`到以下路径: `/etc/nginx/nginx.conf`。

4.  通过运行以下命令将更新加载到您的 NGINX 配置:

    ```
    # nginx -s reload
    ```

## 可选 - 以 Docker 方式运行 NGINX

与其将 NGINX 作为软件包安装在操作系统上，还不如将其作为 Docker 容器运行。把**NGINX 配置文件示例**保存为 `/etc/nginx.conf`，运行以下命令启动 NGINX 容器:

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /etc/nginx.conf:/etc/nginx/nginx.conf \
  nginx:1.14
```
