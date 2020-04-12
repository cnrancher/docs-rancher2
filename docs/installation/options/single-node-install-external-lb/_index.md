---
title: Docker Install with TLS Termination at Layer-7 NGINX Load Balancer
weight: 252
aliases:
  - /rancher/v2.x/en/installation/single-node/single-node-install-external-lb/
  - /rancher/v2.x/en/installation/options/single-node-install-external-lb
---

For development and testing environments that have a special requirement to terminate TLS/SSL at a load balancer instead of your Rancher Server container, deploy Rancher and configure a load balancer to work with it conjunction.

A layer-7 load balancer can be beneficial if you want to centralize your TLS termination in your infrastructure. Layer-7 load balancing also offers the capability for your load balancer to make decisions based on HTTP attributes such as cookies, etc. that a layer-4 load balancer is not able to concern itself with.

This install procedure walks you through deployment of Rancher using a single container, and then provides a sample configuration for a layer-7 NGINX load balancer.

> **Want to skip the external load balancer?**
> See [Docker Installation]({{<baseurl>}}/rancher/v2.x/en/installation/single-node) instead.

## Requirements for OS, Docker, Hardware, and Networking

Make sure that your node fulfills the general [installation requirements.]({{<baseurl>}}/rancher/v2.x/en/installation/requirements/)

## Installation Outline

<!-- TOC -->

- [1. Provision Linux Host](#1-provision-linux-host)
- [2. Choose an SSL Option and Install Rancher](#2-choose-an-ssl-option-and-install-rancher)
- [3. Configure Load Balancer](#3-configure-load-balancer)

<!-- /TOC -->

## 1. Provision Linux Host

Provision a single Linux host according to our [Requirements]({{<baseurl>}}/rancher/v2.x/en/installation/requirements) to launch your {{< product >}} Server.

## 2. Choose an SSL Option and Install Rancher

For security purposes, SSL (Secure Sockets Layer) is required when using Rancher. SSL secures all Rancher network communication, like when you login or interact with a cluster.

> **Do you want to...**
>
> - Complete an Air Gap Installation?
> - Record all transactions with the Rancher API?
>
> See [Advanced Options](#advanced-options) below before continuing.

Choose from the following options:

{{% accordion id="option-a" label="Option A-Bring Your Own Certificate: Self-Signed" %}}
If you elect to use a self-signed certificate to encrypt communication, you must install the certificate on your load balancer (which you'll do later) and your Rancher container. Run the Docker command to deploy Rancher, pointing it toward your certificate.

> **Prerequisites:**
> Create a self-signed certificate.
>
> - The certificate files must be in [PEM format](#pem).

**To Install Rancher Using a Self-Signed Cert:**

1. While running the Docker command to deploy Rancher, point Docker toward your CA certificate file.

   ```
   docker run -d --restart=unless-stopped \
     -p 80:80 -p 443:443 \
     -v /etc/your_certificate_directory/cacerts.pem:/etc/rancher/ssl/cacerts.pem \
     rancher/rancher:latest
   ```

{{% /accordion %}}
{{% accordion id="option-b" label="Option B-Bring Your Own Certificate: Signed by Recognized CA" %}}
If your cluster is public facing, it's best to use a certificate signed by a recognized CA.

> **Prerequisites:**
>
> - The certificate files must be in [PEM format](#pem).

**To Install Rancher Using a Cert Signed by a Recognized CA:**

If you use a certificate signed by a recognized CA, installing your certificate in the Rancher container isn't necessary. We do have to make sure there is no default CA certificate generated and stored, you can do this by passing the `--no-cacerts` parameter to the container.

1.  Enter the following command.

        ```
        docker run -d --restart=unless-stopped \
        -p 80:80 -p 443:443 \
        rancher/rancher:latest --no-cacerts
        ```

    {{% /accordion %}}

## 3. Configure Load Balancer

When using a load balancer in front of your Rancher container, there's no need for the container to redirect port communication from port 80 or port 443. By passing the header `X-Forwarded-Proto: https` header, this redirect is disabled.

The load balancer or proxy has to be configured to support the following:

- **WebSocket** connections
- **SPDY** / **HTTP/2** protocols
- Passing / setting the following headers:

  | Header              | Value                           | Description                                                                                                                                                                             |
  | ------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `Host`              | Hostname used to reach Rancher. | To identify the server requested by the client.                                                                                                                                         |
  | `X-Forwarded-Proto` | `https`                         | To identify the protocol that a client used to connect to the load balancer or proxy.<br /><br/>**Note:** If this header is present, `rancher/rancher` does not redirect HTTP to HTTPS. |
  | `X-Forwarded-Port`  | Port used to reach Rancher.     | To identify the protocol that client used to connect to the load balancer or proxy.                                                                                                     |
  | `X-Forwarded-For`   | IP of the client connection.    | To identify the originating IP address of a client.                                                                                                                                     |

### Example NGINX configuration

This NGINX configuration is tested on NGINX 1.14.

> **Note:** This NGINX configuration is only an example and may not suit your environment. For complete documentation, see [NGINX Load Balancing - HTTP Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/).

- Replace `rancher-server` with the IP address or hostname of the node running the Rancher container.
- Replace both occurrences of `FQDN` to the DNS name for Rancher.
- Replace `/certs/fullchain.pem` and `/certs/privkey.pem` to the location of the server certificate and the server certificate key respectively.

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
            # This allows the ability for the execute shell window to remain open for up to 15 minutes. Without this parameter, the default is 1 minute and will automatically close.
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

## What's Next?

- **Recommended:** Review [Single Node Backup and Restoration]({{<baseurl>}}/rancher/v2.x/en/installation/backups-and-restoration/single-node-backup-and-restoration/). Although you don't have any data you need to back up right now, we recommend creating backups after regular Rancher use.
- Create a Kubernetes cluster: [Provisioning Kubernetes Clusters]({{<baseurl>}}/rancher/v2.x/en/cluster-provisioning/).

<br/>

## FAQ and Troubleshooting

{{< ssl_faq_single >}}

## Advanced Options

### API Auditing

If you want to record all transactions with the Rancher API, enable the [API Auditing]({{<baseurl>}}/rancher/v2.x/en/installation/api-auditing) feature by adding the flags below into your install command.

    -e AUDIT_LEVEL=1 \
    -e AUDIT_LOG_PATH=/var/log/auditlog/rancher-api-audit.log \
    -e AUDIT_LOG_MAXAGE=20 \
    -e AUDIT_LOG_MAXBACKUP=20 \
    -e AUDIT_LOG_MAXSIZE=100 \

### Air Gap

If you are visiting this page to complete an [Air Gap Installation]({{<baseurl>}}/rancher/v2.x/en/installation/air-gap-installation/), you must pre-pend your private registry URL to the server tag when running the installation command in the option that you choose. Add `<REGISTRY.DOMAIN.COM:PORT>` with your private registry URL in front of `rancher/rancher:latest`.

**Example:**

     <REGISTRY.DOMAIN.COM:PORT>/rancher/rancher:latest

### Persistent Data

{{< persistentdata >}}

This layer 7 NGINX configuration is tested on NGINX version 1.13 (mainline) and 1.14 (stable).

> **Note:** This NGINX configuration is only an example and may not suit your environment. For complete documentation, see [NGINX Load Balancing - TCP and UDP Load Balancer](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/).

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
        # This allows the ability for the execute shell window to remain open for up to 15 minutes. Without this parameter, the default is 1 minute and will automatically close.
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

对于需要在负载均衡器而不是 Rancher Server 容器处终止 TLS / SSL 的特殊开发和测试环境，请部署 Rancher 并配置负载均衡器以与其配合使用。此安装过程将引导您使用单个容器完成 Rancher 的部署，然后为 7 层 Nginx 负载均衡器提供示例配置。

> 不需要使用外部负载均衡器？
>
> 请看[Rancher 单节点安装指南](/docs/installation/other-installation-methods/single-node-docker/_index)

## 关于操作系统、Docker、硬件、网络的需求

确保您的节点满足常规的[安装要求](/docs/installation/requirements/_index)。

## 安装概要

- [1、设置 Linux 节点](#1、设置-linux-节点)
- [2、选择一个 SSL 选项并安装 Rancher](#2、选择一个-ssl-选项并安装-rancher)
- [3、配置负载均衡器](#3、配置负载均衡器)

## 1、设置 Linux 节点

根据 Rancher 的[要求](/docs/installation/requirements/_index)设置一台 Linux 主机，以启动 Rancher Server。

## 2、选择一个 SSL 选项并安装 Rancher

为了安全起见，使用 Rancher 时需要 SSL。SSL 保护所有 Rancher 网络通信的安全，例如在您登录集群或与集群交互时。

> **您想要...**
>
> - 离线环境安装？
> - 记录通过 Rancher API 进行的全部操作？
>
> 在继续之前请，参考[高级选项](#高级选项)。

选择下面的一个选项：

### 选项 A - 使用自己的自签名证明

如果选择使用自签名证书来加密通信，则必须在负载均衡器（稍后再做）和 Rancher 容器上安装证书。运行 Docker 命令以部署 Rancher，将其指向您的证书。

> **先决条件：**
> 创建自签名证书
>
> - 证书必须是 [PEM 格式](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

**基于自签名证书安装 Rancher：**

1. 在运行 Docker 命令部署 Rancher 时，将 Docker 指向您的 CA 证书文件。

   ```
   docker run -d --restart=unless-stopped \
   -p 80:80 -p 443:443 \
   -v /etc/your_certificate_directory/cacerts.pem:/etc/rancher/ssl/cacerts.pem \
   rancher/rancher:latest
   ```

### 选项 B - 使用机构颁发的证书

如果您的集群是面向公众的，则最好使用由公认的 CA 签名的证书。

> **先决条件：**
> 创建自签名证书
>
> - 证书必须是 [PEM 格式](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

**基于机构颁发证书安装 Rancher：**

如果您使用由公认的 CA 签署的证书，则无需在 Rancher 容器中安装证书。我们必须确保没有生成和存储默认的 CA 证书，您可以通过将`--no-cacerts`参数传递给容器来实现。

1. 输入下面的命令

   ```
   docker run -d --restart=unless-stopped \
   -p 80:80 -p 443:443 \
   rancher/rancher:latest --no-cacerts
   ```

## 3、配置负载均衡器

在 Rancher 容器前面使用负载均衡器时，不需要该容器从端口 80 或端口 443 重定向端口通信。通过传递 Header`X-Forwarded-Proto：https` ，可以禁用此重定向。

负载均衡器或代理必须配置为支持以下各项：

- **WebSocket** 连接
- **SPDY** / **HTTP/2** 协议
- 可以传递以下 HTTP 头：

  | HTTP 头             | 值                       | 描述                                                                                                                               |
  | ------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
  | `Host`              | 可达 Rancher 的 hostname | 用来表示接受请求的 Rancher Server                                                                                                  |
  | `X-Forwarded-Proto` | `https`                  | 标识客户端用来连接到负载均衡器或代理的协议。<br /> <br/> **注意：**如果存在此标头，则`rancher/rancher`不会将 HTTP 重定向到 HTTPS。 |
  | `X-Forwarded-Port`  | 可达 Rancher 的端口      | 标识客户端用来连接到负载均衡器或代理的端口。                                                                                       |
  | `X-Forwarded-For`   | 请求端 IP 地址           | 用来表示请求端原始 IP                                                                                                              |

### Nginx 配置示例

此 NGINX 配置已在 NGINX 1.14 上进行了测试。

> **注意：**此 Nginx 配置仅是示例，可能不适合您的环境。有关完整的文档，请参阅[NGINX 负载均衡-HTTP 负载均衡](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)。

- 将`rancher-server`替换为运行 Rancher 容器的节点的 IP 地址或主机名。
- 将两次出现的`FQDN`替换为 Rancher 的 DNS 名称。
- 将`/certs/fullchain.pem`和`/certs/privkey.pem`分别替换为服务器证书和服务器证书密钥的位置。

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
            # This allows the ability for the execute shell window to remain open for up to 15 minutes. Without this parameter, the default is 1 minute and will automatically close.
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

## 还有什么？

- **推荐阅读：** [单节点备份和还原](/docs/backups/backups/single-node-backups/_index)。尽管您现在没有任何数据需要备份，但是我们建议您在常规 Rancher 使用之后创建备份。
- [创建 Kubernetes 集群](/docs/cluster-provisioning/_index)。

## 常见问题和问题排查

请参阅[常见问题和问题排查](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)

## 高级选项

### API 审计日志

如果要使用 Rancher API 记录所有事务，请通过在安装命令中添加以下标志来启用[API 审计](/docs/installation/api-auditing/_index)功能。

    -e AUDIT_LEVEL=1 \
    -e AUDIT_LOG_PATH=/var/log/auditlog/rancher-api-audit.log \
    -e AUDIT_LOG_MAXAGE=20 \
    -e AUDIT_LOG_MAXBACKUP=20 \
    -e AUDIT_LOG_MAXSIZE=100 \

### 离线安装

如果要访问此页面以完成[离线安装](/docs/installation/air-gap-installation/_index)，则在您运行安装命令时，必须在 server 镜像之前添加私有镜像库的 URL。例如在您的`rancher/rancher:latest`前面添加带有您的私有镜像库的 URL`<REGISTRY.DOMAIN.COM:PORT>`。

**例子：**

     <REGISTRY.DOMAIN.COM:PORT>/rancher/rancher:latest

### 持久化数据

Rancher 使用 etcd 作为数据存储。使用 Docker 安装时，将使用嵌入式 etcd。持久数据位于容器中的以下路径中：`/var/lib/rancher`。您可以将主机卷挂载到该位置，以将数据保留在运行 Rancher Server 容器的主机上。使用 RancherOS 时，请检查哪些[持久性存储目录](https://rancher.com/docs/os/v1.x/en/installation/system-services/system-docker-volumes/#user-volumes)可用。

命令：

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /opt/rancher:/var/lib/rancher \
  rancher/rancher:latest
```
