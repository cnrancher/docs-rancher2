---
title: Rancher Helm Chart 选项
weight: 1
aliases:
  - /rancher/v2.6/en/installation/resources/chart-options
---

本文提供了 Rancher Helm Chart 的配置参考。

如需选择 Helm Chart 版本，请参见[本页]({{<baseurl>}}/rancher/v2.6/en/installation/resources/choosing-version/)。

了解开启实验性功能的详情，请参见[本页]({{<baseurl>}}/rancher/v2.6/en/installation/resources/feature-flags/)。

- [常用选项](#common-options)
- [高级选项](#advanced-options)
- [API 审计日志](#api-audit-log)
- [额外设置环境变量](#setting-extra-environment-variables)
- [TLS 设置](#tls-settings)
- [自定义 Ingress](#customizing-your-ingress)
- [HTTP 代理](#http-proxy)
- [额外的授信 CA](#additional-trusted-cas)
- [私有仓库和离线安装](#private-registry-and-air-gap-installs)
- [外部 TLS 终止](#external-tls-termination)

### 常用选项

| 选项 | 默认值 | 描述 |
| ------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| `bootstrapPassword` | " " | `string` - 为第一个管理员用户设置[引导密码](#bootstrap-password)。登录后，管理员需要重置密码。如不设置，会使用随机生成的引导密码。 |
| `hostname` | " " | `string` - 你的 Rancher Server 的完全限定的域名（FQDN) |
| `ingress.tls.source` | "rancher" | `string` - 从哪里获取 Ingress 的证书- "rancher, letsEncrypt, secret" |
| `letsEncrypt.email` | " " | `string` - 你的邮箱地址 |
| `letsEncrypt.environment` | "production" | `string` - 可选项："staging, production" |
| `privateCA` | false | `bool` - 如果你的证书是由私有 CA 签发的，把这个值设置为 true |

<br/>

### 高级选项

| 选项 | 默认值 | 描述 |
| ------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `additionalTrustedCAs` | false | `bool` - 请参见[额外的授信 CA](#additional-trusted-cas) |
| `addLocal` | "true" | `string` - 让 Rancher 检测并导入 “local” Rancher Server 集群。_注意：此选项在 2.5.0 中已不可用。你可考虑使用 `restrictedAdmin` 选项，来避免用户修改本地集群。_ |
| `antiAffinity` | "preferred" | `string` - Rancher Pod 的反亲和性规则 - "preferred, required" |
| `auditLog.destination` | "sidecar" | `string` - 发送审计日志到 Sidecar 容器的控制台或 hostPath 卷 - "sidecar, hostPath" |
| `auditLog.hostPath` | "/var/log/rancher/audit" | `string` - 主机上的日志文件目标地址（仅当`auditLog.destination` 的值是 `hostPath` 时生效） |
| `auditLog.level` | 0 | `int` - 设置 [API 审计日志]({{<baseurl>}}/rancher/v2.6/en/installation/resources/advanced/api-audit-log)等级。0 代表关闭。[0-3] |
| `auditLog.maxAge` | 1 | `int` - 旧审计日志文件最多可保留的天数（仅当`auditLog.destination` 的值是 `hostPath` 时生效） |
| `auditLog.maxBackup` | 1 | `int` - 审计文件最大可保留的个数（仅当 `auditLog.destination` 的值是 `hostPath` 时生效） |
| `auditLog.maxSize` | 100 | `int` - 在审计日志被轮换前的最大容量，单位是 MB（仅当 `auditLog.destination` 的值是 `hostPath` 时生效） |
| `busyboxImage` | "busybox" | `string` - 用来收集审计日志的 busybox 镜像位置 |
| `certmanager.version` | "" | `string` - 设置 cert-manager compatibility |
| `debug` | false | `bool` - 在 Rancher Server 设置 debug 参数 |
| `extraEnv` | [] | `list` - 为 Rancher 额外设置环境变量 |
| `imagePullSecrets` | [] | `list` - 私有镜像仓库凭证的密文名称列表 |
| `ingress.configurationSnippet` | "" | `string` - 添加额外的 Nginx 配置。可用于代理配置。 |
| `ingress.extraAnnotations` | {} | `map` - 用于自定义 Ingress 的额外注释 |
| `ingress.enabled` | true | 如果值为 false，Helm 不会安装 Rancher Ingress。你可把值设为 false 以部署你自己的 Ingress。 |
| `letsEncrypt.ingress.class` | "" | `string` - cert-manager acmesolver ingress 的可选 ingress 类，用于响应 Let's Encrypt ACME 质询。选项：traefik，nginx。 |                      |
| `noProxy` | "127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.svc,.cluster.local,cattle-system.svc" | `string` - 不使用代理的主机名或 IP 地址的逗号分隔列表 |                                     |
| `proxy` | "" | `string` - 给 Rancher 配置的 HTTP[S] 代理 |
| `rancherImage` | "rancher/rancher" | `string` - Rancher 镜像源 |
| `rancherImagePullPolicy` | "IfNotPresent" | `string` - 覆盖 Rancher Server 镜像的 imagePullPolicy - "Always", "Never", "IfNotPresent" |
| `rancherImageTag` | 和 Chart 版本一致 | `string` - rancher/rancher 镜像标签 |
| `replicas` | 3 | `int` - Rancher Server 副本数。如果设为 -1，会根据集群中的可用节点数自动选择 1，2或3。 |
| `resources` | {} | `map` - Rancher Pod 资源请求和限制 |
| `restrictedAdmin` | `false` | `bool` - 如果值为 true，初始的 Rancher 用户访问本地 Kubernetes 集群会受到限制，以避免权限升级。详情请参见 [restricted-admin 角色]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/#restricted-admin)。 |
| `systemDefaultRegistry` | "" | `string` - 用于所有系统容器镜像的私有仓库，例如 http://registry.example.com/ |
| `tls` | "ingress" | `string` - 详情请参见[外部 TLS 终止](#external-tls-termination)。- "ingress, external" |
| `useBundledSystemChart` | `false` | `bool` - 选择 Rancher Server 打包的 system-charts。此参数用于离线环境安装。 |



### 引导密码

Rancher 首次启动时，会为第一个管理员用户随机生成一个密码。当管理员首次登录 Rancher 时，用于获取引导密码（Bootstrap）的命令会在 UI 上显示。管理员需要运行命令并使用引导密码登录。然后 Rancher 会让管理员重置密码。

如果你想指定引导密码而不使用随机生成的密码，请参考以下命令设置密码。

```plain
--set bootstrapPassword="rancher"
```

无论你是使用提供的密码还是生成的密码，密码均存储在 Kubernetes 密文中。安装 Rancher 后，如何使用 kubectl 获取密码的说明将会在 UI 中显示：

```
kubectl get secret --namespace cattle-system bootstrap-secret -o go-template='{{ .data.bootstrapPassword|base64decode}}{{ "\n" }}'
```

### API 审计日志

启用 [API 审计日志]({{<baseurl>}}/rancher/v2.6/en/installation/resources/advanced/api-audit-log)

你可以像收集其他容器日志一样收集此日志。在 Rancher Server 集群上为 `System` 项目启用[日志管理]({{<baseurl>}}/rancher/v2.6/en/logging)。

```plain
--set auditLog.level=1
```

默认情况下，启用审计日志会在 Rancher pod 中创建一个 Sidecar 容器。这个容器（`rancher-audit-log`）会把日志流传输到 `stdout`。你可以像收集其他容器日志一样收集此日志。如果你使用 Sidecar 作为审计日志的目标时， `hostPath`，`maxAge`，`maxBackups` 和 `maxSize` 选项不会生效。建议使用你的操作系统或 Docker Daemon 的日志轮换功能来控制磁盘空间的使用。请为 Rancher Server 集群或 System 项目启用[日志管理]({{<baseurl>}}/rancher/v2.6/en/logging)。

将 `auditLog.destination` 的值设为 `hostPath`，可以将日志转发到与主机系统共享的卷，而不是传输到 Sidecar 容器。如果目标设置为 `hostPath`，你可能需要调整其他 auditLog 参数以进行日志轮换。

### 额外设置环境变量

你可以使用 `extraEnv` 为 Rancher Server 额外设置环境变量。该列表使用与容器清单定义相同的 `name` 和 `value` 键。记住需要给值加上引号。

```plain
--set 'extraEnv[0].name=CATTLE_TLS_MIN_VERSION'
--set 'extraEnv[0].value=1.0'
```

### TLS 设置

当你在 Kubernetes 集群内安装 Rancher 时，TLS 会在集群的 Ingress Controller 上卸载。支持的 TLS 设置取决于使用的 Ingress Controller。

参见 [TLS 设置]({{<baseurl>}}/rancher/v2.6/en/installation/resources/tls-settings)了解更多信息和选项。

### 导入 `local` 集群

默认情况下，Rancher Server 会检测并导入其所在的 `local` 集群。有权访问 `local` 集群的用户对 Rancher Server 管理的所有集群具有“root”访问权限。

> **重要提示**：如果你关闭 addLocal，大多数 Rancher 2.5 功能都不能使用，包括 EKS Provisioner。

如果这在你的环境中是一个问题，你可以在初始安装时将此选项设置为“false”。

此选项仅在首次安装 Rancher 时有效。详情请参见 [Issue 16522](https://github.com/rancher/rancher/issues/16522)。

```plain
--set addLocal="false"
```

### 自定义 Ingress

要自定义或使用 Rancher Server 的其他 Ingress，你可以设置自己的 Ingress annotations。

设置自定义证书颁发者的示例：

```plain
--set ingress.extraAnnotations.'cert-manager\.io/cluster-issuer'=issuer-name
```

以下是使用 `ingress.configurationSnippet`设置静态代理头的实例。该值像模板一样进行解析，因此可以使用变量。

```plain
--set ingress.configurationSnippet='more_set_input_headers X-Forwarded-Host {{ .Values.hostname }};'
```

### HTTP 代理

Rancher 的一些功能（Helm Chart）需要使用互联网才能使用。使用 `proxy` 来设置你的代理服务器。

在 `noProxy` 列表中添加例外的 IP。确保你已添加了 Pod 集群 IP 范围（默认：`10.42.0.0/16`），服务集群 IP 范围（默认：`10.43.0.0/16`），内部集群域名（默认：`.svc,.cluster.local`）和所有 worker 集群 `controlplane` 节点。Rancher 支持在此列表中使用 CIDR 表示法范围。

```plain
--set proxy="http://<username>:<password>@<proxy_url>:<proxy_port>/"
--set noProxy="127.0.0.0/8\,10.0.0.0/8\,172.16.0.0/12\,192.168.0.0/16\,.svc\,.cluster.local"
```

### 额外的授信 CA

如果你有私有镜像仓库（registries）、应用商店（catalogs）或拦截证书的代理，则可能需要向 Rancher 添加额外的授信 CA。

```plain
--set additionalTrustedCAs=true
```

创建完 Rancher deployment 后，将 pem 格式的 CA 证书复制到一个名为 `ca-additional.pem` 的文件中，并使用 `kubectl` 在 `cattle-system` 命名空间中创建 `tls-ca-additional` 密文。

```plain
kubectl -n cattle-system create secret generic tls-ca-additional --from-file=ca-additional.pem=./ca-additional.pem
```

### 私有仓库和离线安装

有关使用私有仓库安装 Rancher 的详情，请参见[离线安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap)。

## 外部 TLS 终止

我们建议将负载均衡器配置为 4 层均衡，将普通 80/tcp 和 443/tcp 转发到 Rancher Management 集群节点。集群上的 Ingress Controller 会将端口 80 上的 HTTP 流量重定向到端口 443 上的 HTTPS。

你可以在 Rancher 集群（Ingress）外部的 L7 负载均衡器上终止 SSL/TLS。使用 `--set tls=external` 选项，将负载均衡器指向所有 Rancher 集群节点上的端口 HTTP 80。这将在 HTTP 端口 80 上暴露 Rancher 接口。请注意，允许直接连接到 Rancher 集群的客户端不会被加密。如果你选择这样做，我们建议你将网络级别的直接访问限制为仅你的负载均衡器。

> **注意**：如果你使用的是私有 CA 签名的证书，请添加 `--set privateCA=true` 并参见[添加 TLS 密文 - 使用私有 CA 签名证书]({{<baseurl>}}/rancher/v2.6/en/installation/resources/tls-secrets/)，为 Rancher 添加 CA 证书。

你的负载均衡器必须支持长期存在的 Websocket 连接，并且需要插入代理头，以便 Rancher 可以正确传送链接。

### 使用 NGINX v0.25 为外部 TLS 配置 Ingress

在 NGINX 0.25 中，NGINX 关于转发头和外部 TLS 终止的行为[已更改](https://github.com/kubernetes/ingress-nginx/blob/master/Changelog.md#0220)。因此，如果你同时使用 NGINX 0.25 和外部 TLS 终止配置，你必须编辑 `cluster.yml` 来为 Ingress 启用 `use-forwarded-headers` 选项。

```yaml
ingress:
  provider: nginx
  options:
    use-forwarded-headers: 'true'
```

### 必须的 Header

- `Host`
- `X-Forwarded-Proto`
- `X-Forwarded-Port`
- `X-Forwarded-For`

### 建议的超时时间

- 读超时：`1800 seconds`
- 写超时：`1800 seconds`
- 连接超时：`30 seconds`

### 健康检查

Rancher 将对 `/healthz` 端点的健康检查响应`200`。

### NGINX 配置示例

此 NGINX 配置已在 NGINX 1.14 上进行了测试。

> **注意**：此 NGINX 配置只是一个示例，可能不适合你的环境。如需查阅完整文档，请参见 [NGINX 负载均衡 - HTTP 负载均衡](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)。

- 将 `IP_NODE1`，`IP_NODE2` 和 `IP_NODE3` 替换为你集群中节点的 IP 地址。
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
