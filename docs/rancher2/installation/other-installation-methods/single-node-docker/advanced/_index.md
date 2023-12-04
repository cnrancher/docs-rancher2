---
title: 单节点安装的高级选项
description: 安装 Rancher 时，可以启用几个高级选项：自定义 CA 证书、API 审计日志、TLS 配置、离线环境、持久化数据。
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
  - 其他安装方法
  - 单节点安装
  - 单节点安装的高级选项
---

安装 Rancher 时，您可以启用以下几个[高级选项](/docs/rancher2/installation/resources/advanced/_index)：

- [自定义 CA 证书](#自定义-ca-证书)
- [API 审计日志](#api-审计日志)
- [TLS 配置](#tls-设置)
- [离线环境](#离线环境)
- [持久化数据](#持久化数据)
- [在相同节点运行`rancher/rancher` 和 `rancher/rancher-agent`](#在相同节点运行rancherrancher-和-rancherrancher-agent)

## 自定义 CA 证书

如果要配置 Rancher 使用的 CA 根证书，则应在启动 Rancher 容器时挂载包含 CA 根证书的目录。

使用命令示例来启动安装了私有 CA 证书的 Rancher 容器。

- 卷标志（`-v`）应该指定包含 CA 根证书的主机目录。
- 环境变量标记（`-e`）与 `SSL_CERT_DIR` 和目录结合使用，声明一个环境变量，该变量指定容器内已安装的 CA 根证书目录的位置。
- 可以使用 `-e KEY = VALUE` 或 `--env KEY = VALUE` 将环境变量传递到 Rancher 容器。
- 使用`-v host-source-directory:container-destination-directory`或`--volume host-source-directory:container-destination-directory`，可以在容器内挂载主机目录。

以下示例是将主机上的`/host/certs`目录中的 CA 根证书，挂载到 Rancher 容器中的`/container/certs`上。

```
 --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /host/certs:/container/certs \
  -e SSL_CERT_DIR="/container/certs" \
  rancher/rancher:latest
```

## API 审计日志

API 审计日志记录通过 Rancher Server 进行的所有用户请求和系统事务。

默认情况下，API 审计日志会写入 rancher 容器内的`/var/log/auditlog`中。您可以设置`AUDIT_LEVEL`以启用日志，并将该目录作为卷共享。

参考[API 审计日志](/docs/rancher2/installation/resources/advanced/api-audit-log/_index)获取更多信息。

```
 --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /var/log/rancher/auditlog:/var/log/auditlog \
  -e AUDIT_LEVEL=1 \
  rancher/rancher:latest
```

## TLS 设置

_v2.1.7 可用_

要设置其他 TLS 配置，您可以使用`CATTLE_TLS_MIN_VERSION`和`CATTLE_TLS_CIPHERS`环境变量。例如，要将 TLS 1.0 配置为可接受的最低 TLS 版本：

```
 --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -e CATTLE_TLS_MIN_VERSION="1.0" \
  rancher/rancher:latest
```

参考[TLS 配置](/docs/rancher2/installation/resources/tls-settings/_index)查看更多信息和参数。

## 离线环境

如果要访问此页面以完成离线安装，则在您运行安装命令时，必须在 server 镜像之前添加私有镜像库的 URL。例如在您的`rancher/rancher:latest`前面添加带有您的私有镜像库的 URL`<REGISTRY.DOMAIN.COM:PORT>`。

**例子：**

     <REGISTRY.DOMAIN.COM:PORT>/rancher/rancher:latest

<div id="persist-data" />

## 持久化数据

Rancher 使用 etcd 作为数据存储。使用 Docker 安装时，将使用嵌入式 etcd。持久数据位于容器中的以下路径中：`/var/lib/rancher`。您可以将主机卷挂载到该位置，以将数据保留在运行 Rancher Server 容器的主机上。使用 RancherOS 时，请检查哪些[持久性存储目录](https://rancher.com/docs/os/v1.x/en/installation/system-services/system-docker-volumes/#user-volumes)可用。

命令：

```
 --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /opt/rancher:/var/lib/rancher \
  rancher/rancher:latest
```

## 在相同节点运行`rancher/rancher` 和 `rancher/rancher-agent`

在要使用单个节点运行 Rancher 并将同一个节点添加到集群的情况下，必须为`rancher/ rancher`容器调整映射的主机端口。

如果将节点添加到集群中，它将部署使用端口 80 和 443 的 nginx ingress 控制器。这将与我们建议为`rancher/ rancher`容器公开的默认端口冲突。

请注意，不建议将此设置用于生产环境，这种方式仅用来方便进行开发/演示。

要更改主机端口映射，请将以下部分`-p 80:80 -p 443:443`替换为`-p 8080:80 -p 8443:443`：

```
 --restart=unless-stopped \
  -p 8080:80 -p 8443:443 \
  rancher/rancher:latest
```
