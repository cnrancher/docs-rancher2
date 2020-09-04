---
title: 启用SSL
---

# 启用 SSL

为了在 Rancher Server 启用 `https` 访问，您需要在 Rancher Server 前使用一个代理服务器代理 https 请求，并能设置 http 的头参数。我们会在以下的内容中提供一个使用 NGINX、HAProxy 或者 Apache 作为代理的例子。当然了，其他工具也是可以的。

## 需求

除了一般的 Rancher Server[需求](/docs/rancher1/installing-rancher/installing-server/_index#安装需求)外，您还需要:

- 有效的 SSL 证书:如果您的证书并不是标准的 Ubuntu CA bundle，请参考以下内容[使用自签名证书](/docs/rancher1/installing-rancher/installing-server/basic-ssl-config/_index#使用自签名证书-beta)。
- 相关域名的 DNS 配置

## Rancher Server 标签

Rancher Server 当前版本中有 2 个不同的标签。对于每一个主要的 release 标签，我们都会提供对应版本的文档。

- `rancher/server:latest` 此标签是我们的最新一次开发的构建版本。这些构建已经被我们的 CI 框架自动验证测试。但这些 release 并不代表可以在生产环境部署。
- `rancher/server:stable` 此标签是我们最新一个稳定的 release 构建。这个标签代表我们推荐在生产环境中使用的版本。

请不要使用任何带有 `rc{n}` 前缀的 release。这些构建都是 Rancher 团队的测试构建。

## 启动 Rancher Server

在我们的例子配置中，所有的流量都会通过一个 Docker link 从代理传入 Rancher Server 容器。有其他替代的方法，但在我们的例子中会尽量的简单易懂

启动 Rancher Server。我们需要添加 `--name=rancher-server` 参数到命令中，使得代理的容器可以与 Rancher Server 容器建立 Docker link

```bash
sudo docker run -d --restart=unless-stopped --name=rancher-server rancher/server
```

> **注意:** 在我们的例子中，我们假设代理会运行在其他容器中。如果您打算在其他的服务器上运行代理，则您需要在 Rancher Server 上暴露 8080 端口，本地的话，通过在 `docker run` 中添加 `-p 127.0.0.1:8080:8080` 参数。

如果您需要复用现有的 Rancher Server 实例，升级的步骤会根据您如何运行原有的 Rancher 实例而不同。

- 使用 [挂载 MYSQL 数据库的数据目录](/docs/rancher1/installing-rancher/installing-server/_index#single-container-bind-mount) 的实例，请参考 [升级 Rancher Server - 绑定挂载的 MYSQL 卷](/docs/rancher1/upgrading/_index#单独升级一个容器non-ha---绑定挂载的mysql卷)。
- 对于使用外部数据库的 Rancher 实例，停止并移除现有的 Rancher 容器，新建一个容器即可 [启动 Rancher Server - 使用外部数据库](/docs/rancher1/installing-rancher/installing-server/_index#single-container-external-database)。

## Nginx 配置模版

以下是最小的 NGINX 配置。您应该根据您的需要定制化您自己的配置。本配置需要 nginx 版本大于 1.9.5。

### 设置注意项

- `rancher-server` 是您的 Rancher Server 容器的名称。 当您启动 Rancher Server 容器时，命令中必须包括 `--name=rancher-server` 参数。当您启动 nginx 容器时，您的命令则必须包括 `--link=rancher-server` ，这样以下的配置才能生效。
- `<server>` 可以是任何的名字，但是必须与 http/https server 配置的名称一致。

```bash
upstream rancher {
    server rancher-server:8080;
}

map $http_upgrade $connection_upgrade {
    default Upgrade;
    ''      close;
}

server {
    listen 443 ssl spdy;
    server_name <server>;
    ssl_certificate <cert_file>;
    ssl_certificate_key <key_file>;

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
    }
}

server {
    listen 80;
    server_name <server>;
    return 301 https://$server_name$request_uri;
}
```

## Apache 配置例子

以下是使用 Apache 作为负载均衡的配置例子。

### 设置注意项

- `<server_name>` 是 Rancher Server 容器的名称。当您启动 Apache 容器，命令中必须包含 `--link=<server_name>`，这样以下的配置才能生效。
- 在代理的设置中，您需要在配置中替换 `rancher` 这个参数。
- 确保 `proxy_wstunnel` 这个参数是启用的(websocket 支持)。

```bash
<VirtualHost *:80>
  ServerName <server_name>
  Redirect / https://<server_name>/
</VirtualHost>

<VirtualHost *:443>
  ServerName <server_name>

  SSLEngine on
  SSLCertificateFile </path/to/ssl/cert_file>
  SSLCertificateKeyFile </path/to/ssl/key_file>

  ProxyRequests Off
  ProxyPreserveHost On

  RewriteEngine On
  RewriteCond %{HTTP:Connection} Upgrade [NC]
  RewriteCond %{HTTP:Upgrade} websocket [NC]
  RewriteRule /(.*) ws://rancher:8080/$1 [P,L]

  RequestHeader set X-Forwarded-Proto "https"
  RequestHeader set X-Forwarded-Port "443"

  <Location />
    ProxyPass "http://rancher:8080/"
    ProxyPassReverse "http://rancher:8080/"
  </Location>

</VirtualHost>
```

## HAProxy 配置例子

以下是 HAProxy 的最小配置。您应该根据您的需要去修改。

### 设置注意项

- `<rancher_server_X_IP>`是 Rancher Servers 的 IP 地址。

```bash
global
  maxconn 4096
  ssl-server-verify none

defaults
  mode http
  balance roundrobin
  option redispatch
  option forwardfor

  timeout connect 5s
  timeout queue 5s
  timeout client 36000s
  timeout server 36000s

frontend http-in
  mode http
  bind *:443 ssl crt /etc/haproxy/certificate.pem
  default_backend rancher_servers

  # Add headers for SSL offloading
  http-request set-header X-Forwarded-Proto https if { ssl_fc }
  http-request set-header X-Forwarded-Ssl on if { ssl_fc }

  acl is_websocket hdr(Upgrade) -i WebSocket
  acl is_websocket hdr_beg(Host) -i ws
  use_backend rancher_servers if is_websocket

backend rancher_servers
  server websrv1 <rancher_server_1_IP>:8080 weight 1 maxconn 1024
  server websrv2 <rancher_server_2_IP>:8080 weight 1 maxconn 1024
  server websrv3 <rancher_server_3_IP>:8080 weight 1 maxconn 1024
```

## F5 BIG-IP 配置示例

下面的 iRule 配置可以使在 F5 BIG-IP 后的 Rancher Server 被访问到

```bash
when HTTP_REQUEST {
  HTTP::header insert "X-Forwarded-Proto" "https";
  HTTP::header insert "X-Forwarded-Port" "443";
  HTTP::header insert "X-Forwarded-For" [IP::client_addr];
}
```

## 使用 AWS 的 Elastic Load Balancer 作为 Rancher Server HA 的负载均衡器并使用 SSL

我们建议使用 AWS 的 ELB 作为您 Rancher Server 的负载均衡器。为了让 ELB 与 Rancher 的 websockets 正常工作，您需要开启 proxy protocol 模式并且保证 HTTP support 被停用。 默认的，ELB 是在 HTTP/HTTPS 模式启用，在这个模式下不支持 websockets。listener 的配置需要被特别的关注。

### Listener 配置 - SSL

在 ELB 的 SSL 控制台，listener 配置与以下配置类似:

| Configuration Type | Load Balancer Protocol | Load Balancer Port | Instance Protocol | Instance Port                                                     |
| ------------------ | ---------------------- | ------------------ | ----------------- | ----------------------------------------------------------------- |
| SSL-Terminated     | SSL (Secure TCP)       | 443                | TCP               | 8080 (或者使用启动 Rancher 时配置 `--advertise-http-port` 的端口) |

- 需要添加相应的安全组设置以及 SSL 证书

### 启用 Proxy Protocol

为了使 websockets 正常工作，ELB 的 proxy protocol policy 必须被启用。

- 启用 [proxy protocol](http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/enable-proxy-protocol.html) 模式

```bash
$ aws elb create-load-balancer-policy --load-balancer-name <LB_NAME> --policy-name <POLICY_NAME> --policy-type-name ProxyProtocolPolicyType --policy-attributes AttributeName=ProxyProtocol,AttributeValue=true
$ aws elb set-load-balancer-policies-for-backend-server --load-balancer-name <LB_NAME> --instance-port 443 --policy-names <POLICY_NAME>
$ aws elb set-load-balancer-policies-for-backend-server --load-balancer-name <LB_NAME> --instance-port 8080 --policy-names <POLICY_NAME>
```

- Health check 可以配置使用 HTTP:8080 下的 `/ping` 路径进行健康检查

## 使用 AWS 的 Load Balancer(ALB)作为 Rancher Server HA 的负载均衡器

我们不再推荐使用 AWS 的 Application Load Balancer (ALB)替代 Elastic/Classic Load Balancer (ELB)。如果您依然选择使用 ALB，您需要直接指定流量到 Rancher Server 节点上的 HTTP 端口，默认是 8080。

> **注意:** 如果您使用 ALB 配合 Kubernetes，`kubectl --kubeconfig=kube_configxxx.yml exec ` 并不能使用那个功能，您需要使用 ELB。

## 使用自签名证书 (Beta)

### 免责声明

以下的配置只会在 Rancher 的核心服务并且是单节点部署模式下生效。当前并没有官方的 Rancher 模版[Rancher catalog](https://github.com/rancher/rancher-catalog)支持。

Rancher Compose CLI 将需要 CA 证书，这个 CA 证书需要被添加到操作系统默认证书当中。请参考[Golang root\_\*](https://golang.org/src/crypto/x509/)。

### 前置条件

- PEM 格式的 CA 证书
- 为 Rancher Server 签名的 CA 证书
- Nginx 或者 Apache 实例，反向代理 Rancher Server，并配置 SSL

### Rancher Server

1. 通过以下的 Docker 命令启动 Rancher Server 容器。证书**必须**放在容器内部`/var/lib/rancher/etc/ssl/ca.crt`的位置。

   ```bash
   sudo docker run -d --restart=unless-stopped -p 8080:8080 -v /some/dir/cert.crt:/var/lib/rancher/etc/ssl/ca.crt rancher/server
   ```

   > **注意:** 如果您在容器内部运行 NGINX 或者 Apache，您可以直接链接这个实例并且不需要暴露 Rancher UI 的 8080 端口。

   这个命令将会配置服务器的 ca-certificate，从而使 Rancher 的主机创建服务，应用商店服务和 Compose 执行服务可以与 Rancher Server 通信。

2. 如果您使用 Nginx 或者 Apache 代理 SSL，在容器启动命令中添加`--link=<rancher_server_container_name>`参数。

3. 使用`https`地址访问 Rancher，例如 `https://rancher.server.domain`。

4. 为 SSL 更新[主机注册地址](/docs/rancher1/configuration/settings/_index#主机注册)配置

> **注意:** 除非您的浏览器信任了该用于给 Rancher Server 签名的 CA 证书，否则在您访问 UI 的时候，浏览器会显示一个未信任的网站警告。

### 添加 Hosts

1. 在您准备添加到 Rancher 集群的主机上，使用 PEM 格式保存 CA 证书，并放入 `/var/lib/rancher/etc/ssl` 文件夹下并改名为 `ca.crt`。

2. 添加 [自定义主机](/docs/rancher1/infrastructure/hosts/custom/_index), 使用 UI 上提示的命令复制到主机上. 命令会自动挂载目录 `-v /var/lib/rancher:/var/lib/rancher`, 所以文件会自动的复制到您的主机上。
