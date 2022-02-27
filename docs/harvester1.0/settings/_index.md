---
title: 设置
keywords:
  - Harvester
  - harvester
  - Rancher
  - rancher
  - Harvester 高级设置
  - Harvester 设置
  - Harvester 自定义资源
description: 本文介绍可在 Harvester 中使用的高级设置。
---

## 概述

本文将介绍可在 Harvester 中使用的高级配置。
你可以从仪表盘 UI 或使用 `kubectl` 命令修改 `settings.harvesterhci.io` 自定义资源。

## `additional-ca`

为 Harvester 配置其他受信 CA 证书来访问外部服务。

默认值：none

#### 示例

```
-----BEGIN CERTIFICATE-----
SOME-CA-CERTIFICATES
-----END CERTIFICATE-----
```

## `backup-target`

设置自定义备份目标来存储虚拟机备份。支持 NFS 和 S3。
详情请参见 [Longhorn 文档][longhorn-backup-target]。

默认值：none

[longhorn-backup-target]: https://longhorn.io/docs/1.2.2/snapshots-and-backups/backup-and-restore/set-backup-target/#set-up-aws-s3-backupstore

#### 示例

```json
{
  "type": "s3",
  "endpoint": "https://s3.endpoint.svc",
  "accessKeyId": "test-access-key-id",
  "secretAccessKey": "test-access-key",
  "bucketName": "test-bup",
  "bucketRegion": "us‑east‑2",
  "cert": "",
  "virtualHostedStyle": false
}
```

## `cluster-registration-url`

将 Harvester 集群导入 Rancher 以进行多集群管理。

默认值：none

#### 示例

```
https://172.16.0.1/v3/import/w6tp7dgwjj549l88pr7xmxb4x6m54v5kcplvhbp9vv2wzqrrjhrc7c_c-m-zxbbbck9.yaml
```

## `http-proxy`

配置 HTTP 代理以访问外部服务，包括下载镜像和备份到 S3 服务。

默认值：`{}`

你可以设置以下的选项和值：

- HTTP 请求的代理 URL：`"httpProxy": "http://<username>:<pswd>@<ip>:<port>"`
- HTTPS 请求的代理 URL：`"httpsProxy": "https://<username>:<pswd>@<ip>:<port>"`
- 主机名和/或 CIDR 的逗号分隔列表：`"noProxy": "<hostname | CIDR>"`

#### 示例

```json
{
  "httpProxy": "http://my.proxy",
  "httpsProxy": "https://my.proxy",
  "noProxy": "some.internal.svc,172.16.0.0/16"
}
```

> 注意：
> Harvester 在用户配置的 `no-proxy` 后附加必要的地址，来确保内部流量能正常工作。
> 例如，`localhost,127.0.0.1,0.0.0.0,10.0.0.0/8,cattle-system.svc,.svc,.cluster.local`。

## `log-level`

配置 Harvester Server 的日志级别。

默认值：`info`

你可以设置以下值。日志级别按照简单到详细排列：

- `panic`
- `fatal`
- `error`
- `warn`, `warning`
- `info`
- `debug`
- `trace`

#### 示例

```
debug
```

## `overcommit-config`

配置 CPU、内存和存储的资源超量使用百分比。设置资源超量后，即使物理资源已经用完，也能安排额外的虚拟机。

默认值：`{ "cpu":1600, "memory":150, "storage":200 }`

默认超量使用 CPU 1600% 指的是，如果虚拟机的 CPU 资源限制是 `1600m` 核，Harvester 只会向 Kubernetes 调度器请求 `100m` CPU。

#### 示例

```json
{
  "cpu": 1000,
  "memory": 200,
  "storage": 300
}
```

## `server-version`

显示 Harvester Server 的版本。

#### 示例

```
v1.0.0-abcdef-head
```

## `ssl-certificates`

为 Harvester UI/API 配置服务证书。

默认值：`{}`

#### 示例

```json
{
  "ca": "-----BEGIN CERTIFICATE-----\nSOME-CERTIFICATE-ENCODED-IN-PEM-FORMAT\n-----END CERTIFICATE-----",
  "publicCertificate": "-----BEGIN CERTIFICATE-----\nSOME-CERTIFICATE-ENCODED-IN-PEM-FORMAT\n-----END CERTIFICATE-----",
  "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nSOME-PRIVATE-KEY-ENCODED-IN-PEM-FORMAT\n-----END RSA PRIVATE KEY-----"
}
```

## `ssl-parameters`

修改 Harvester GUI 和 API 启用的 SSL/TLS 协议和密码。

你可以设置以下的选项和值：

- `protocols`：启用的协议。参见 NGINX Ingress Controller 的配置 [`ssl-protocols`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#ssl-protocols) 来了解支持的输入。

- `ciphers`：启用的密码。参见 NGINX Ingress Controller 的配置 [`ssl-ciphers`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#ssl-ciphers) 来了解支持的输入。

如果没有提供值，`protocols` 仅会设为 `TLSv1.2`，而 `ciphers` 列表会是 `ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305`。

默认值：none

> 注意：
> 如果你进行了错误配置，或者不再能访问 Harvester GUI 和 API，请参见[故障排查](/docs/harvester1.0/troubleshooting/harvester/_index#修改-SSL/TLS-启用的协议和密码后无法访问-Harvester)。

#### 示例

以下示例将启用的 SSL/TLS 协议设置为 `TLSv1.2` 和 `TLSv1.3`，并把密码列表设置为 `ECDHE-ECDSA-AES128-GCM-SHA256` 和 `ECDHE-ECDSA-CHACHA20-POLY1305`：

```
{
  "protocols": "TLSv1.2 TLSv1.3",
  "ciphers": "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-CHACHA20-POLY1305"
}
```

## `ui-index`

为 UI 配置 HTML 索引位置。

默认：`https://releases.rancher.com/harvester-ui/dashboard/latest/index.html`

#### 示例

```
https://your.static.dashboard-ui/index.html
```

## `ui-source`

配置如何加载 UI 源。

你可以设置以下值：

- `auto`：默认。自动检测是否使用绑定的 UI。
- `external`：使用外部 UI 源。
- `bundled`：使用绑定的 UI 源。

#### 示例

```
external
```

## `upgrade-checker-enabled`

自动检查是否有可用的 Harvester 升级。

默认值：`true`

#### 示例

```
false
```

## `upgrade-checker-url`

为 Harvester 升级检查配置 URL。只有 `upgrade-checker-enabled` 设为 true 时才可用。

默认值：`https://harvester-upgrade-responder.rancher.io/v1/checkupgrade`

#### 示例

```
https://your.upgrade.checker-url/v99/checkupgrade
```

## `vlan`

配置 VLAN 网络的默认物理网卡名称。

默认值：none

#### 示例

```
ens3
```

## `auto-disk-provision-paths` [实验功能]

此设置允许 Harvester 自动添加符合给定 glob 模式的磁盘作为虚拟机存储。
你可以使用逗号分隔来提供多个模式。

> 警告：
>
> - 此设置应用于集群中的**每个集群**。
> - 这些设备中的所有数据**都会被销毁**。请谨慎使用。

默认值：none

#### 示例

以下示例添加符合 glob 模式 `/dev/sd*` 或 `/dev/hd*` 的磁盘：

```
/dev/sd*,/dev/hd*
```

## `vm-force-reset-policy`

当节点不可用时，强制重新调度虚拟机。当节点状态变成`未就绪`时，此设置会强制删除该节点上的虚拟机，并在几秒后将虚拟机重新调度到另一个可用的节点。 Harvester 升级检查配置 URL。

默认值：`{"enable":true, "period":300}`

#### 示例

```json
{
  "enable": "true",
  "period": 300
}
```
