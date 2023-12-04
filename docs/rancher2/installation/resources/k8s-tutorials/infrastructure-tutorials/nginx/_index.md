---
title: 配置 NGINX 负载均衡
description: 我们将使用 NGINX 作为 4 层负载均衡器(TCP)，它将连接转发到您的某一台 Rancher 节点。在此配置中，负载均衡器位于节点的前面。负载均衡器可以是任何能够运行 NGINX 的主机。一个警告：不要使用任意一个 Rancher 节点作为负载均衡器节点，这会出现端口冲突。在这些示例中，负载均衡器将被配置为将流量定向到三个 Rancher Server 节点。如果将 Rancher 安装在 RKE Kubernetes 集群上，则需要三个节点。如果将 Rancher 安装在 K3s Kubernetes 集群上，则仅需要两个节点。
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
  - 安装指南
  - 资料、参考和高级选项
  - 配置 NGINX 负载均衡
---

我们将使用 NGINX 作为`L4`层负载均衡器(TCP)，它将请求轮训转发到后端的 Rancher server 节点。在此配置中，负载均衡器位于 Rancher server 节点的前面。负载均衡器可以是任何能够运行 NGINX 的主机。我们不建议使用任意一个 Rancher server 节点作为负载均衡器节点，因为默认配置下每个 K8S 节点都会运行 ingress 控制器，而 ingress 控制器以为`host`网络模式运行，并默认监听了`80`和`443`端口，所以默认情况下会出现端口冲突。如果一定要将 NGINX 安装在 Rancher server 某个节点上，那么可以编辑 ingress 控制器配置文件，在`args`中添加参数，端口根据实际情况修改 `--http-port=8880 --http-port=8443`。 ingress 控制器修改默认端口后，nginx 配置中代理的后端 server 端口也需要一并修改。

![image-20200515141942435](/img/rancher/nginx-config.png)

> **说明：**在这些示例中，负载均衡器将被配置为将流量定向到三个 Rancher Server 节点。如果将 Rancher 安装在 RKE Kubernetes 集群上，则需要三个节点。如果将 Rancher 安装在 K3s Kubernetes 集群上，则仅需要两个节点。

## 安装 NGINX

首先在负载均衡器主机上安装 NGINX，NGINX 具有适用于所有已知操作系统的软件包。我们测试了`1.14`和`1.15`版本。有关安装 NGINX 的帮助，请参阅[安装文档](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)。

`stream`模块是必需的，在 NGINX 官方安装包中包含了这个模块。请参阅您的操作系统文档来了解如何在操作系统上安装和启用 NGINX `stream`模块。

## 创建 NGINX 配置

安装 NGINX 之后，您需要使用节点的 IP 地址更新 NGINX 配置文件`nginx.conf`。

1. 将下面的配置示例复制并粘贴到您喜欢的文本编辑器中，保存为`nginx.conf`。

2. 在 nginx.conf 配置中，用之前准备的[节点](/docs/rancher2/installation/resources/advanced/helm2/create-nodes-lb/_index)的 IP 替换 `<IP_NODE_1>`，`<IP_NODE_2>`和`<IP_NODE_3>`。

   > **注意:** 有关所有配置选项，请参见[NGINX 文档：TCP 和 UDP 负载均衡。](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)

   <figcaption>NGINX 配置示例</figcaption>

   ```bash
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

3. 将`nginx.conf`保存到`/etc/nginx/nginx.conf`。

4. 运行以下命令重新加载 NGINX 配置：

   ```bash
   # nginx -s reload
   ```

## 可选 - 将 NGINX 作为 Docker 容器运行

除了可以将 NGINX 作为软件包安装在操作系统上外，您也可以将其作为 Docker 容器运行。将已编辑的**示例 NGINX 配置**另存为`/etc/nginx.conf`并运行以下命令启动 NGINX 容器：

```bash
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /etc/nginx.conf:/etc/nginx/nginx.conf \
  nginx:1.14
```
