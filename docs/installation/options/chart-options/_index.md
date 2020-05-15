---
title: 高可用安装 Helm Chart 选项
description: 高可用安装 Helm Chart 选项
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
  - 高可用安装 Helm Chart 选项
---

## 一般选项

| 选项                      | 默认值       | 描述                                                                  |
|---------------------------|--------------|-----------------------------------------------------------------------|
| `hostname`                | " "          | `string` - Rancher Server 完全限定域名                                |
| `ingress.tls.source`      | "rancher"    | `string` - ingress 获取证书的位置。- "rancher， letsEncrypt， secret" |
| `letsEncrypt.email`       | " "          | `string` - 您的邮箱地址                                               |
| `letsEncrypt.environment` | "production" | `string` - 有效选项： "staging， production"                          |
| `privateCA`               | false        | `bool` - 如果证书由私有 CA 签名，则设置为 true                        |

## 高级选项

| 选项                           | 默认值                                                   | 描述                                                                                                           |
|--------------------------------|----------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `additionalTrustedCAs`         | false                                                    | `bool` - 参考 [其他受信任的 CA](#其他受信任的-ca)                                                              |
| `addLocal`                     | "auto"                                                   | `string` - 让 Rancher 检测，并导入"local" Rancher Server 所在的集群。[导入 local 集群](#导入-local-集群)       |
| `antiAffinity`                 | "preferred"                                              | `string` - 针对 Rancher pods 的 AntiAffinity 规则 - "preferred， required"                                     |
| `auditLog.destination`         | "sidecar"                                                | `string` - 使日志流导向到 sidecar 容器的 console 或者 hostPath 卷 - "sidecar， hostPath"                       |
| `auditLog.hostPath`            | "/var/log/rancher/audit"                                 | `string` - 主机上的日志文件地址 (仅当`auditLog.destination`设置为`hostPath`时适用)                             |
| `auditLog.level`               | 0                                                        | `int` - 设置[API 审计日志](/docs/installation/options/api-audit-log/_index)等级。0 标示关闭。可选值为 0 ～ 3。 |
| `auditLog.maxAge`              | 1                                                        | `int` - 保留旧审计日志文件的最大天数 (仅当 `auditLog.destination` 设置为 `hostPath`时适用)                     |
| `auditLog.maxBackups`          | 1                                                        | `int` - 要保留的审计日志最大文件数 (仅当 `auditLog.destination` 设置为 `hostPath`时适用)                       |
| `auditLog.maxSize`             | 100                                                      | `int` - 轮换之前审计日志文件的最大大小（以兆字节为单位）(仅当 `auditLog.destination` 设置为 `hostPath`)        |
| `busyboxImage`                 | "busybox"                                                | `string` - 用于收集审计日志的 busybox 镜像的镜像位置 _注：自 v2.2.0 起可用_                                    |
| `debug`                        | false                                                    | `bool` - 在 Rancher Server 设置调试标志                                                                        |
| `certmanager.version`          | ""                                                       | `string` - 设置 cert-manager 兼容性                                                                            |
| `extraEnv`                     | []                                                       | `list` - 为 Rancher 设置其他环境变量 _注：自 v2.2.0 起可用_                                                    |
| `imagePullSecrets`             | []                                                       | `list` - 包含私有 Registry 凭据的密钥资源名称列表                                                              |
| `ingress.extraAnnotations`     | {}                                                       | `map` - 自定义 ingress 的其他 annotations                                                                      |
| `ingress.configurationSnippet` | ""                                                       | `string` - 添加其他的 Nginx 配置。可以用于代理配置。_注：自 v2.0.15， v2.1.10 和 v2.2.4 起可用_                |
| `proxy`                        | ""                                                       | `string` - Rancher 的 HTTP[S] 代理服务                                                                         |
| `noProxy`                      | "127.0.0.0/8，10.0.0.0/8，172.16.0.0/12，192.168.0.0/16" | `string` - 不使用代理的逗号分隔的主机名或 IP 地址列表                                                          |
| `resources`                    | {}                                                       | `map` - rancher pod 资源请求和限制                                                                             |
| `rancherImage`                 | "rancher/rancher"                                        | `string` - rancher 镜像源                                                                                      |
| `rancherImageTag`              | 跟 chart 版本一样                                        | `string` - rancher 镜像标签                                                                                    |
| `tls`                          | "ingress"                                                | `string` - 参考 [外部 TLS 终止](#在外部终止-tls)。- "ingress， external"                                       |
| `systemDefaultRegistry`        | ""                                                       | `string` - 用于所有系统 Docker 镜像的私有 Registry，例如： http://registry.example.com/ _自 v2.3.0 起可用_     |
| `useBundledSystemChart`        | `false`                                                  | `bool` - 选择使用 Rancher Server 内嵌的 system-charts。这个选项用于离线安装。_自 v2.3.0 起可用_                |

## 审计日志 API

启用[审计日志 API](/docs/installation/options/api-audit-log/_index)。

您可以像收集任何容器日志一样收集审计日志，在 Rancher Server Cluster 中为`System` 项目启用[Rancher 工具中的日志服务](/docs/cluster-admin/tools/logging/_index)。

```plain
--set auditLog.level=1
```

默认情况下，启用审计日志会在 Rancher pod 中创建一个 sidecar 容器。这个容器(`rancher-audit-log`)会将日志流传输到`stdout`。您可以像收集任何容器日志一样收集审计日志。将 sidecar 用作审计日志目标时，`hostPath`， `maxAge`， `maxBackups`，和 `maxSize`选项将会被忽略。建议使用您的操作系统或 Docker 守护程序的日志轮换功能来控制磁盘空间的使用。为 Rancher Server 集群或 System 项目启用[Rancher 工具中的日志服务](/docs/cluster-admin/tools/logging/_index)。

将`auditLog.destination`设置为`hostPath`，会将日志转发至与主机系统共享的卷中，而不是流至一个 sidecar 容器中。当将目标设置为`hostPath`时，您可能需要调整其他 auditLog 参数以进行日志轮换。

## 设置额外的环境变量

_自 v2.2.0 起可用_

您可以使用`extraEnv`为 Rancher Server 设置额外的环境变量。该列表使用与 Rancher 容器 YAML 定义中相同的`name`和 `value`键。请不要忘记了`引号`。

```plain
--set 'extraEnv[0].name=CATTLE_TLS_MIN_VERSION'
--set 'extraEnv[0].value=1.0'
```

## TLS 设置

_自 v2.2.0 起可用_

要设置不同 TLS 配置，可以使用`CATTLE_TLS_MIN_VERSION`和 `CATTLE_TLS_CIPHERS`环境变量。例如：要将 TLS 1.0 配置为可接受的最低 TLS 版本：

```plain
--set 'extraEnv[0].name=CATTLE_TLS_MIN_VERSION'
--set 'extraEnv[0].value=1.0'
```

有关更多信息和选项，请参见[TLS 设置](/docs/installation/options/tls-settings/_index)。

## 导入 `local` 集群

默认情况下，Rancher Server 会检测并导入正在运行的`local`集群。有权访问`local`集群权限的用户实际上将具有对 Rancher Server 管理的所有集群的`root`访问权限.
如果您的环境中存在此问题，则可以在初次安装时将此选项设置为`false`。

> 注意：这个选项只在初始安装 Rancher 时有效。有关更多信息，请参见[问题 16522](https://github.com/rancher/rancher/issues/16522)。

```plain
--set addLocal="false"
```

## 自定义您的 Ingress

为 Rancher Server 自定义或使用其他的 Ingress，您可以设置自己的 Ingress annotations。

设置自定义证书颁发者的示例：

```plain
--set ingress.extraAnnotations.'certmanager\.k8s\.io/cluster-issuer'=ca-key-pair
```

_自 v2.0.15， v2.1.10 和 v2.2.4 起可用_

使用`ingress.configurationSnippet`设置静态代理头的示例。该值也会像模板一样进行解析，因此可以使用变量。

```plain
--set ingress.configurationSnippet='more_set_input_headers X-Forwarded-Host {{ .Values.hostname }};'
```

## HTTP 代理

Rancher 需要访问网络，才能使用某些功能（helm charts）。使用`proxy`设置您的代理服务器。

将不需要代理的 IP 地址添加到`noProxy`列表里。确保把服务集群的 IP 区间（默认：10.43.0.1/16）和工作集群`controlplane`节点添加进去。Rancher 在此列表中支持 CIDR 表示法。

```plain
--set proxy="http://<username>:<password>@<proxy_url>:<proxy_port>/"
--set noProxy="127.0.0.0/8\，10.0.0.0/8\，172.16.0.0/12\，192.168.0.0/16"
```

## 其他受信任的 CA

如果您有私有 Registry，catalogs 或拦截证书的代理，则可能需要向 Rancher 添加其他受信任的 CA。

```plain
--set additionalTrustedCAs=true
```

创建完 Rancher Deployment 之后，将 pem 格式的 CA 证书复制到名为`ca-additional.pem`文件中，并用`kubectl`命令在`cattle-system`命名空间里创建`tls-ca-additional`密文。

```plain
kubectl -n cattle-system create secret generic tls-ca-additional --from-file=ca-additional.pem
```

## 私有 Registry 和 离线安装

有关使用私有 Registry 安装 Rancher，参见：

- [离线：单节点安装](/docs/installation/other-installation-methods/air-gap/_index)
- [离线：高可用安装](/docs/installation/other-installation-methods/air-gap/_index)

## 在外部终止 TLS

我们建议将您的负载均衡器配置为第 4 层均衡器，将 80/tcp 和 443/tcp 的流量转发到 Rancher 管里面集群节点。集群上的 Ingress Controller 会将 80 端口的 http 请求重定向为 443 端口上的 https 请求。

您可以在 Rancher 集群外部的 L7 负载均衡器（Ingress）上终止 SSL/TLS 通信。使用`--set tls=external`选项，并将负载均衡器指向所有 Rancher 集群节点上的 http 协议 80 端口。这将会在 http 协议 80 端口上暴露 Rancher API。请注意，这种情况下，允许直接连接到 Rancher 集群的客户端与的 Rancher 的通信不会被加密。如果您选择这样做，我们建议将网络访问限制为只能访问您的负载均衡器。

> **注意：**
>
> 如果您使用的是私有 CA 签名证书，请添加`--set privateCA=true`，然后参阅[添加 TLS 密文 - 使用私有 CA 签发的证书](/docs/installation/options/tls-secrets/_index)来为 Rancher 添加 CA 证书。

您的负载均衡器必须支持 websocket 长连接，并切需要插入代理头信息以便 Rancher 可以正确路由链接。

### 使用 NGINX v0.25 时，为外部 TLS 访问配置 Ingress

在 NGINX v0.25 版本中，关于转发头和终止外部 TLS 访问的 NGINX 行为已经[改变](https://github.com/kubernetes/ingress-nginx/blob/master/Changelog.md#0220)，因此，在 NGINX v0.25 版本要终止外部 TLS 访问，您必须编辑`cluster.yml`文件，为 Ingress 启用 `use-forwarded-headers`选项：

```yaml
ingress:
  provider: nginx
  options:
    use-forwarded-headers: "true"
```

### 必需的头

- `Host`
- `X-Forwarded-Proto`
- `X-Forwarded-Port`
- `X-Forwarded-For`

### 建议超时时间

- 读取超时：`1800 秒`
- 写入超时：`1800 秒`
- 连接超时：`30 秒`

### 健康检查

Rancher 将对`/healthz` 端点上的健康检查返回`200`响应。

### NGINX 配置示例

这个 NGINX 配置已经在 NGINX 1.14 测试过。

> **注意：** 这个 NGINX 配置仅仅是一个示例，可能不适合您的环境。有关完整的文档，请参阅[NGINX 负载均衡 - HTTP 负载均衡](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)。

- 将 `IP_NODE1`， `IP_NODE2` 和 `IP_NODE3` 替换为您的集群节点的 IP 地址。
- 将出现的两个`FQDN`替换为 Rancher 的 DNS 名称。
- 将`/certs/fullchain.pem`和`/certs/privkey.pem`分别替换为服务器证书和服务器证书密钥的位置。

```
worker_processes 4;
worker_rlimit_nofile 40000;

events {
    worker_connections 8192;
}

http {
    upstream rancher {
        server IP_NODE_1:80;
        server IP_NODE_2:80;
        server IP_NODE_3:80;
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
            # 这里将允许您在 Rancher UI 中打开命令行窗口时，窗口可以保留最多15分钟。没有这个参数时，默认值为1分钟，一分钟后在Rancher中的shell会自动关闭。
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
