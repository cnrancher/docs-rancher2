---
title: 配置 NGINX
description: 负载均衡器可以是任何能够运行 NGINX 的主机。本文讲述了如何将 NGINX 配置为 4 层负载均衡器(TCP)，将流量转发到其中一个 Rancher Server 节点的过程。在此配置中，负载均衡器位于节点的前面请勿将 Rancher 节点用作负载均衡器。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 安装指南
  - 资料、参考和高级选项
  - Rancher高可用Helm2安装
  - 配置基础设施
  - 配置 NGINX
---

负载均衡器可以是任何能够运行 NGINX 的主机。本文讲述了如何将 NGINX 配置为 4 层负载均衡器（TCP），将流量转发到其中一个 Rancher Server 节点的过程。在此配置中，负载均衡器位于节点的前面。

:::note 说明
请勿将 Rancher 节点用作负载均衡器。
:::

## 安装 NGINX

配置基于 NGINX 的负载均衡前，您需要安装 NGINX 和 stream 模块。Rancher 支持的 NGINX 版本包括：**v1.14** 和 **v1.15**。 NGINX 官网提供了多种操作系统的安装包，您可以自行选择其中一种进行安装。所有的安装包里面都包含 stream 模块，所以不需要单独下载和安装 stream 模块。详情请参考[NGINX 官方中文文档](https://www.nginx.cn/doc/)。建议您在这两个版本中选择一个，参考下文完成配置。

## 创建 NGINX 配置文件

安装 NGINX 之后，您需要使用节点的 IP 地址更新 NGINX 配置文件`nginx.conf`。

1.  打开一个文本编辑器（如 Notepad++），复制下面的代码模板，粘贴到文本编辑器中，将其另存为`nginx.conf`。

2.  在`nginx.conf`中, 使用[节点](/docs/installation/options/helm2/create-nodes-lb/_index)IP 地址 替换(端口 80 和 端口 443)的`<IP_NODE_1>`, `<IP_NODE_2>`, 和`<IP_NODE_3>`。

    > **注意事项:** 可配置项请参考[NGINX 文档: TCP and UDP Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)。

    <figcaption>NGINX 配置文件模板</figcaption>

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

3.  替换完 IP 地址后，将`nginx.conf`保存到以下路径: `/etc/nginx/nginx.conf`。

4.  运行以下命令，更新 NGINX 配置：

    ```
    nginx -s reload
    ```

## 可选： 以 Docker 方式运行 NGINX

您可以使用软件包将 NGINX 安装在操作系统上，也可以将 NGINX 作为 Docker 容器运行，这样可以节省一些资源。

完成 IP 地址替换后，将文件另存为`/etc/nginx.conf`，运行以下命令即可启动 NGINX 容器。使用 NGINX v1.15 时，请将最后一行的“1.14”替换为“1.15”。

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /etc/nginx.conf:/etc/nginx/nginx.conf \
  nginx:1.14
```
