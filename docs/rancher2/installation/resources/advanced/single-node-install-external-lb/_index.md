---
title: 7 层 LB TLS 终止（单节点安装）
description: 对于需要在负载均衡器而不是在 Rancher Server 容器里终止 TLS / SSL 的特殊开发和测试环境，请部署 Rancher 并配置负载均衡器以与其配合使用。如果要在基础设施中对 TLS 进行终结，7 层负载均衡器可能会很有帮助。7 层负载均衡可以提供基于 HTTP 属性（例如 cookie 等）的路由决策能力，这是 4 层负载均衡器无法实现的。本文将引导您使用单个容器完成 Rancher 的部署，并且提供了一个 7 层 Nginx 负载均衡器的示例配置。
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
  - 7 层 LB TLS 终止（单节点安装）
---

对于需要在负载均衡器而不是在 Rancher Server 容器里终止 TLS / SSL 的特殊开发和测试环境，请部署 Rancher 并配置负载均衡器以与其配合使用。

如果要在基础设施中对 TLS 进行终结，请使用 7 层负载均衡器。7 层负载均衡可以提供基于 HTTP 属性（例如 cookie 等）的路由决策能力，这是 4 层负载均衡器无法实现的。

本文将引导您使用单个容器完成 Rancher 的部署，并且提供了一个 7 层 Nginx 负载均衡器的示例配置。

> 不需要使用外部负载均衡器？
>
> 请看[Rancher 单节点安装指南](/docs/rancher2/installation/other-installation-methods/single-node-docker/_index)

## 关于操作系统、Docker、硬件、网络的需求

确保您的节点满足常规的[安装要求](/docs/rancher2/installation/requirements/_index)。

## 安装概要

- [1、设置 Linux 节点](#1、设置-linux-节点)
- [2、选择一个 SSL 选项并安装 Rancher](#2、选择一个-ssl-选项并安装-rancher)
- [3、配置负载均衡器](#3、配置负载均衡器)

## 1、设置 Linux 节点

根据 Rancher 的[要求](/docs/rancher2/installation/requirements/_index)设置一台 Linux 主机，以启动 Rancher Server。

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
> - 证书必须是 [PEM 格式](/docs/rancher2/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

**基于自签名证书安装 Rancher：**

1. 在运行 Docker 命令部署 Rancher 时，将 Docker 指向您的 CA 证书文件。

   ```
   docker run -d --privileged --restart=unless-stopped \
   -p 80:80 -p 443:443 \
   -v /etc/your_certificate_directory/cacerts.pem:/etc/rancher/ssl/cacerts.pem \
   rancher/rancher:latest
   ```

### 选项 B - 使用机构颁发的证书

如果您的集群是面向公众的，则最好使用由公认的 CA 签名的证书。

> **先决条件：**
> 创建自签名证书
>
> - 证书必须是 [PEM 格式](/docs/rancher2/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

**基于机构颁发证书安装 Rancher：**

如果您使用由公认的 CA 签署的证书，则无需在 Rancher 容器中安装证书。我们必须确保没有生成和存储默认的 CA 证书，您可以通过将`--no-cacerts`参数传递给容器来实现。

1. 输入下面的命令

   ```
   docker run -d --privileged --restart=unless-stopped \
   -p 80:80 -p 443:443 \
   rancher/rancher:latest --no-cacerts
   ```

## 3、配置负载均衡器

在 Rancher 容器前面使用负载均衡器时，不需要该容器从端口 80 或端口 443 重定向端口通信。通过传递 Header`X-Forwarded-Proto：https` ，可以禁用此重定向。

负载均衡器或代理必须配置为支持以下各项：

- **WebSocket** 连接
- **SPDY** / **HTTP/2** 协议
- 可以传递以下 HTTP 头：

  | HTTP 头             | 值                       | 描述                                                                                                                         |
  | :------------------ | :----------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
  | `Host`              | 可达 Rancher 的 hostname | 用来表示接受请求的 Rancher Server                                                                                            |
  | `X-Forwarded-Proto` | `https`                  | 标识客户端用来连接到负载均衡器或代理的协议。<br /> **注意：**如果存在此标头，则`rancher/rancher`不会将 HTTP 重定向到 HTTPS。 |
  | `X-Forwarded-Port`  | 可达 Rancher 的端口      | 标识客户端用来连接到负载均衡器或代理的端口。                                                                                 |
  | `X-Forwarded-For`   | 请求端 IP 地址           | 用来表示请求端原始 IP                                                                                                        |

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

## 相关链接

- **推荐阅读：** [单节点备份和还原](/docs/rancher2/backups/backup/docker-backups/_index)。尽管您现在没有任何数据需要备份，但是我们建议您在常规 Rancher 使用之后创建备份。
- [创建 Kubernetes 集群](/docs/rancher2/cluster-provisioning/_index)。

## 常见问题和问题排查

### 如何知道我的证书是不是 PEM 格式？

您可以通过以下特征识别 PEM 格式：

- 该文件以以下标头开头：`-----BEGIN CERTIFICATE-----`
- 标头后跟一长串字符。
- 该文件以页脚结尾：`-----END CERTIFICATE-----`

#### PEM 证书例子：

```
----BEGIN CERTIFICATE-----
MIIGVDCCBDygAwIBAgIJAMiIrEm29kRLMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNV
... more lines
VWQqljhfacYPgp8KJUJENQ9h5hZ2nSCrI+W00Jcw4QcEdCI8HL5wmg==
-----END CERTIFICATE-----
```

#### PEM 证书密钥例子：

```
-----BEGIN RSA PRIVATE KEY-----
MIIGVDCCBDygAwIBAgIJAMiIrEm29kRLMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNV
... more lines
VWQqljhfacYPgp8KJUJENQ9h5hZ2nSCrI+W00Jcw4QcEdCI8HL5wmg==
-----END RSA PRIVATE KEY-----
```

如果您的密钥看起来像下面的例子，请查看[如何将证书密钥从 PKCS8 转换为 PKCS1](#如何将证书密钥从-pkcs8-转换为-pkcs1)

```
-----BEGIN PRIVATE KEY-----
MIIGVDCCBDygAwIBAgIJAMiIrEm29kRLMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNV
... more lines
VWQqljhfacYPgp8KJUJENQ9h5hZ2nSCrI+W00Jcw4QcEdCI8HL5wmg==
-----END PRIVATE KEY-----
```

### 如何将证书密钥从 PKCS8 转换为 PKCS1？

如果您使用的是 PKCS8 证书密钥文件，Rancher 将打印以下日志：

```
ListenConfigController cli-config [listener] failed with : failed to read private key: asn1: structure error: tags don't match (2 vs {class:0 tag:16 length:13 isCompound:true})
```

为了使它正常工作，您需要使用以下命令将密钥从 PKCS8 转换为 PKCS1：

```
openssl rsa -in key.pem -out convertedkey.pem
```

您现在可以将`convertedkey.pem`用作 Rancher 的证书密钥文件。

### 如果我想添加中间证书，证书的顺序是什么？

添加证书的顺序如下：

```
-----BEGIN CERTIFICATE-----
%您的证书%
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
%您的中间证书%
-----END CERTIFICATE-----
```

### 如何验证我的证书链？

您可以使用 `openssl` 二进制文件来验证证书链。如果命令的输出（请参见下面的命令示例）以`Verify return code: 0 (ok)`，则您的证书链有效。`ca.pem`文件必须与您添加到`rancher/rancher`容器中的文件相同。使用由公认的证书颁发机构签名的证书时，可以省略`-CAfile`参数。

命令：

```
openssl s_client -CAfile ca.pem -connect rancher.yourdomain.com:443
...
    Verify return code: 0 (ok)
```

## 高级选项

### API 审计日志

如果要使用 Rancher API 记录所有事务，请通过在安装命令中添加以下标志来启用[API 审计](/docs/rancher2/installation/resources/advanced/helm2/rke-add-on/api-auditing/_index)功能。

    -e AUDIT_LEVEL=1 \
    -e AUDIT_LOG_PATH=/var/log/auditlog/rancher-api-audit.log \
    -e AUDIT_LOG_MAXAGE=20 \
    -e AUDIT_LOG_MAXBACKUP=20 \
    -e AUDIT_LOG_MAXSIZE=100 \

### 离线安装

如果要访问此页面以完成[离线安装](/docs/rancher2/installation/other-installation-methods/air-gap/_index/)，则在您运行安装命令时，必须在 server 镜像之前添加私有镜像库的 URL。例如在您的`rancher/rancher:latest`前面添加带有您的私有镜像库的 URL`<REGISTRY.DOMAIN.COM:PORT>`。

**示例：**

     <REGISTRY.DOMAIN.COM:PORT>/rancher/rancher:latest

### 持久化数据

Rancher 使用 etcd 作为数据存储。使用 Docker 安装时，将使用嵌入式 etcd。持久数据位于容器中的以下路径中：`/var/lib/rancher`。您可以将主机卷挂载到该位置，以将数据保留在运行 Rancher Server 容器的主机上。使用 RancherOS 时，请检查哪些[持久性存储目录](https://rancher.com/docs/os/v1.x/en/installation/system-services/system-docker-volumes/#user-volumes)可用。

命令：

```
docker run -d --privileged --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /opt/rancher:/var/lib/rancher \
  rancher/rancher:latest
```
