---
title: Setting up an NGINX Load Balancer
weight: 270
aliases:
  - /rancher/v2.x/en/installation/ha/create-nodes-lb/nginx
  - /rancher/v2.x/en/installation/options/nginx
---

NGINX will be configured as Layer 4 load balancer (TCP) that forwards connections to one of your Rancher nodes.

In this configuration, the load balancer is positioned in front of your nodes. The load balancer can be any host capable of running NGINX.

One caveat: do not use one of your Rancher nodes as the load balancer.

> These examples show the load balancer being configured to direct traffic to three Rancher server nodes. If Rancher is installed on an RKE Kubernetes cluster, three nodes are required. If Rancher is installed on a K3s Kubernetes cluster, only two nodes are required.

## Install NGINX

Start by installing NGINX on the node you want to use as a load balancer. NGINX has packages available for all known operating systems. The versions tested are `1.14` and `1.15`. For help installing NGINX, refer to their [install documentation](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/).

The `stream` module is required, which is present when using the official NGINX packages. Please refer to your OS documentation on how to install and enable the NGINX `stream` module on your operating system.

## Create NGINX Configuration

After installing NGINX, you need to update the NGINX configuration file, `nginx.conf`, with the IP addresses for your nodes.

1.  Copy and paste the code sample below into your favorite text editor. Save it as `nginx.conf`.

2.  From `nginx.conf`, replace both occurrences (port 80 and port 443) of `<IP_NODE_1>`, `<IP_NODE_2>`, and `<IP_NODE_3>` with the IPs of your [nodes]({{<baseurl>}}/rancher/v2.x/en/installation/k8s-install/create-nodes-lb/).

    > **Note:** See [NGINX Documentation: TCP and UDP Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/) for all configuration options.

    <figcaption>Example NGINX config</figcaption>
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

    ```

3)  Save `nginx.conf` to your load balancer at the following path: `/etc/nginx/nginx.conf`.

4)  Load the updates to your NGINX configuration by running the following command:

    ```
    # nginx -s reload
    ```

## Option - Run NGINX as Docker container

Instead of installing NGINX as a package on the operating system, you can rather run it as a Docker container. Save the edited **Example NGINX config** as `/etc/nginx.conf` and run the following command to launch the NGINX container:

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /etc/nginx.conf:/etc/nginx/nginx.conf \
  nginx:1.14
```

我们将使用 NGINX 作为 4 层负载均衡器(TCP)，它将连接转发到您的某一台 Rancher 节点。

> **注意：**
> 在此配置中，负载均衡器位于节点的前面。负载均衡器可以是任何能够运行 NGINX 的主机。
>
> 一个警告：不要使用任意一个 Rancher 节点作为负载均衡器节点，这会出现端口冲突。

## 安装 NGINX

首先在负载均衡器主机上安装 NGINX，NGINX 具有适用于所有已知操作系统的软件包。我们测试了`1.14`和`1.15`版本。有关安装 NGINX 的帮助，请参阅[安装文档](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)。

`stream`模块是必需的，在 NGINX 官方安装包中包含了这个模块。请参阅您的操作系统文档来了解如何在操作系统上安装和启用 NGINX `stream`模块。

## 创建 NGINX 配置

安装 NGINX 之后，您需要使用节点的 IP 地址更新 NGINX 配置文件`nginx.conf`。

1.  将下面的配置示例复制并粘贴到您喜欢的文本编辑器中，保存为`nginx.conf`。

2.  在 nginx.conf 配置中，用之前准备的[节点](/docs/installation/k8s-install/create-nodes-lb/_index)的 IP 替换 `<IP_NODE_1>`，`<IP_NODE_2>`和`<IP_NODE_3>`。

    > **注意:** 有关所有配置选项，请参见[NGINX 文档：TCP 和 UDP 负载均衡。](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)

    <figcaption>NGINX 配置示例</figcaption>

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

3.  将`nginx.conf`保存到`/etc/nginx/nginx.conf`。

4.  运行以下命令重新加载 NGINX 配置：

    ```
    # nginx -s reload
    ```

## 可选 - 将 NGINX 作为 Docker 容器运行

与其将 NGINX 作为软件包安装在操作系统上，还不如将其作为 Docker 容器运行。将已编辑的**示例 NGINX 配置**另存为`/etc/nginx.conf`并运行以下命令启动 NGINX 容器：

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /etc/nginx.conf:/etc/nginx/nginx.conf \
  nginx:1.14
```
