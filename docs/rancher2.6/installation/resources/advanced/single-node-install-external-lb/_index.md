---
title: 7 层 NGINX 负载均衡器上的 TLS 终止（Docker 安装）
weight: 252
---

如果你的开发或测试环境要求在负载均衡器上终止 TLS/SSL，而不是在 Rancher Server 上，请部署 Rancher 并配置负载均衡器。

如果要在基础设施中对 TLS 集中进行终止，请使用 7 层负载均衡器。7 层负载均衡还能让你的负载均衡器基于 HTTP 属性（例如 cookie 等）做出决策，而 4 层负载均衡器则不能。

本文中的安装步骤将引导你使用单个容器部署 Rancher，并提供 7 层 NGINX 负载均衡器的示例配置。

## 操作系统，Docker，硬件和网络要求

请确保你的节点满足常规的[安装要求]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/)。

## 安装概要

<!-- TOC -->

- [1. 配置 Linux 主机](#1-provision-linux-host)
- [2. 配置 SSL 选项并安装 Rancher](#2-choose-an-ssl-option-and-install-rancher)
- [3. 配置负载均衡器](#3-configure-load-balancer)

<!-- /TOC -->

## 1. 配置 Linux 主机

根据我们的[要求]({{<baseurl>}}/rancher/v2.6/en/installation/requirements)配置一个 Linux 主机来启动 Rancher Server。

## 2. 选择一个 SSL 选项并安装 Rancher

出于安全考虑，使用 Rancher 时请使用 SSL（Secure Sockets Layer）。SSL 保护所有 Rancher 网络通信（如登录和与集群交互）的安全。

> **你是否需要**：
>
> - 完成离线安装。
> - 记录所有 Rancher API 的事务。
>
> 继续之前，请参见[高级选项](#advanced-options)。

选择以下的选项之一：

### 选项 A：使用你自己的证书 - 自签名证书
如果要使用自签名证书来加密通信，你必须在负载均衡器（后续步骤）和 Rancher 容器上安装证书。运行 Docker 命令部署 Rancher，将 Docker 指向你的证书。

> **前提**：
> 创建自签名证书。
>
> - 证书文件的格式必须是 PEM。

**使用自签名证书安装 Rancher**：

1. 在运行 Docker 命令部署 Rancher 时，将 Docker 指向你的 CA 证书文件。

   ```
   docker run -d --restart=unless-stopped \
     -p 80:80 -p 443:443 \
     -v /etc/your_certificate_directory/cacerts.pem:/etc/rancher/ssl/cacerts.pem \
     rancher/rancher:latest
   ```

### 选项 B：使用你自己的证书 - 授信 CA 签发的证书
如果你的集群是公开的，建议你使用授信 CA 签发的证书。

> **前提**：
>
> - 证书文件的格式必须是 PEM。

**使用授信 CA 签发的证书安装 Rancher**：

如果你使用授信 CA 签发的证书，你无需在 Rancher 容器中安装证书。但是，请确保不要生成和存储默认的 CA 证书（你可以通过将 `--no-cacerts` 参数传递给容器来实现）。

1. 输入以下命令：

       ```
       docker run -d --restart=unless-stopped \
       -p 80:80 -p 443:443 \
       rancher/rancher:latest --no-cacerts
       ```



## 3. 配置负载均衡器

在 Rancher 容器前使用负载均衡器时，容器无需从端口 80 或端口 443 重定向端口通信。你可以通过传递 `X-Forwarded-Proto: https` 标头禁用此重定向。

负载均衡器或代理必须支持以下内容：

- **WebSocket** 连接
- **SPDY** / **HTTP/2** 协议
- 传递/设置以下标头：

   | 标头 | 值 | 描述 |
   |--------|-------|-------------|
   | `Host` | 用于访问 Rancher 的主机名。 | 识别客户端所请求的服务器。 |
   | `X-Forwarded-Proto` | `https` | 识别客户端连接负载均衡器或代理时所用的协议。<br /><br/>**注意**：如果此标头存在，`rancher/rancher` 不会将 HTTP 重定向到 HTTPS。 |
   | `X-Forwarded-Port` | 用于访问 Rancher 的端口。 | 识别客户端连接到负载均衡器或代理时所用的端口。 |
   | `X-Forwarded-For` | 客户端 IP 地址 | 识别客户端的原始 IP 地址。 |
### 示例 NGINX 配置

此 NGINX 配置已在 NGINX 1.14 上进行了测试。

> :::note 注意
> 此 NGINX 配置只是一个示例，可能不适合你的环境。如需查阅完整文档，请参见 [NGINX 负载均衡 - HTTP 负载均衡](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)。
> :::

- 将 `rancher-server` 替换为运行 Rancher 容器的节点的 IP 或主机名。
- 将两处的 `FQDN` 均替换为 Rancher 的 DNS 名称。
- 把 `/certs/fullchain.pem` 和 `/certs/privkey.pem` 分别替换为服务器证书和服务器证书密钥的位置。

```
worker_processes 4;
worker_rlimit_nofile 40000;

events {
    worker_connections 8192;
}

http {
    upstream rancher {
        server rancher-server:80;
    }

    map $http_upgrade $connection_upgrade {
        default Upgrade;
        ''      close;
    }

    server {
        listen 443 ssl http2;
        server_name FQDN;
        ssl_certificate /certs/fullchain.pem;
        ssl_certificate_key /certs/privkey.pem;

        location / {
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Port $server_port;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://rancher;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            # 此项允许执行的 shell 窗口保持开启，最长可达15分钟。不使用此参数的话，默认1分钟后自动关闭。
            proxy_read_timeout 900s;
            proxy_buffering off;
        }
    }

    server {
        listen 80;
        server_name FQDN;
        return 301 https://$server_name$request_uri;
    }
}
```

<br/>

## 后续操作

- **推荐**：[单节点备份和恢复]({{<baseurl>}}/rancher/v2.6/en/backups/docker-installs/)。你可能暂时没有需要备份的数据，但是我们建议你在常规使用 Rancher 后创建备份。
- 创建 Kubernetes 集群：[配置 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/)。

<br/>

## 常见问题和故障排查

如果你需要对证书进行故障排查，请参见[此章节]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/troubleshooting)。

## 高级选项

### API 审计

如果你需要记录所有 Rancher API 事务，请将以下标志添加到安装命令中，从而启用 [API 审计]({{<baseurl>}}/rancher/v2.6/en/installation/resources/advanced/api-audit-log)功能。

    -e AUDIT_LEVEL=1 \
    -e AUDIT_LOG_PATH=/var/log/auditlog/rancher-api-audit.log \
    -e AUDIT_LOG_MAXAGE=20 \
    -e AUDIT_LOG_MAXBACKUP=20 \
    -e AUDIT_LOG_MAXSIZE=100 \

### 离线环境

如果你访问此页面是为了完成[离线安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap)，则在运行安装命令时，先将你的私有镜像仓库 URL 附加到 Server 标志中。也就是说，在 `rancher/rancher:latest` 前面添加 `<REGISTRY.DOMAIN.COM:PORT>` 和私有镜像仓库 URL。

**示例**：

     <REGISTRY.DOMAIN.COM:PORT>/rancher/rancher:latest

### 持久化数据

Rancher 使用 etcd 作为数据存储。如果 Rancher 是使用 Docker 安装的，Rancher 会使用嵌入式 etcd。持久化数据位于容器的 `/var/lib/rancher` 路径中。

你可以将主机卷挂载到该位置，来将数据保留在运行它的主机上：

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /opt/rancher:/var/lib/rancher \
  --privileged \
  rancher/rancher:latest
```

Rancher 2.5 开始需要[特权访问]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher-v2-5)。

这个 7 层 NGINX 配置已经在 NGINX 1.13（Mainline）和 1.14（Stable）版本上进行了测试。

> :::note 注意
> 此 NGINX 配置只是一个示例，可能不适合你的环境。如果需要查阅完整文档，请参见 [NGINX 负载均衡 - TCP 和 UDP 负载均衡器](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)。

```
upstream rancher {
    server rancher-server:80;
}

map $http_upgrade $connection_upgrade {
    default Upgrade;
    ''      close;
}

server {
    listen 443 ssl http2;
    server_name rancher.yourdomain.com;
    ssl_certificate /etc/your_certificate_directory/fullchain.pem;
    ssl_certificate_key /etc/your_certificate_directory/privkey.pem;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://rancher;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        # 此项允许执行的 shell 窗口保持开启，最长可达15分钟。不使用此参数的话，默认1分钟后自动关闭。
        proxy_read_timeout 900s;
        proxy_buffering off;
    }
}

server {
    listen 80;
    server_name rancher.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

<br/>

