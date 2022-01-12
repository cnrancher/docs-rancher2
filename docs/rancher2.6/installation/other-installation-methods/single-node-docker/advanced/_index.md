---
title: Docker 安装高级选项
weight: 5
---

安装 Rancher 时，有如下几个可开启的高级选项：

- [自定义 CA 证书](#custom-ca-certificate)
- [API 审计日志](#api-audit-log)
- [TLS 设置](#tls-settings)
- [离线](#air-gap)
- [持久化数据](#persistent-data)
- [在同一个节点中运行 `rancher/rancher` 和 `rancher/rancher-agent`](#running-rancher-rancher-and-rancher-rancher-agent-on-the-same-node)

### 自定义 CA 证书

如需 Rancher 在验证服务时使用 CA 根证书，请在启动 Rancher 容器时共享包含 CA 根证书的目录。

使用命令示例来启动挂载了私有 CA 证书的 Rancher 容器。

- 卷标志 (`-v`) 应指定包含 CA 根证书的主机目录。
- 环境变量标志 (`-e`) 与 `SSL_CERT_DIR` 和目录共同声明一个环境变量，该变量指定容器内挂载了 CA 根证书的目录位置。
- 你可使用 `-e KEY=VALUE` 或 `--env KEY=VALUE`将环境变量传给 Rancher 容器。
- 你可使用 `-v host-source-directory:container-destination-directory` 或 `--volume host-source-directory:container-destination-directory`在容器内挂载主机目录。

在以下示例将位于 `/host/certs` 主机目录中的 CA 证书，挂载到 Rancher 容器内的 `/container/certs` 上。

特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /host/certs:/container/certs \
  -e SSL_CERT_DIR="/container/certs" \
  --privileged \
  rancher/rancher:latest
```

### API 审计日志

API 审计日志记录了通过 Rancher Server 进行的所有用户和系统事务。

默认情况下，API 审计日志会写入到 Rancher 容器内的 `/var/log/auditlog`。你可将此目录共享为卷，并设置 `AUDIT_LEVEL` 以启用日志。

有关更多信息和选项，请参见 [API 审计日志]({{<baseurl>}}/rancher/v2.6/en/installation/resources/advanced/api-audit-log)。

特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /var/log/rancher/auditlog:/var/log/auditlog \
  -e AUDIT_LEVEL=1 \
  --privileged \
  rancher/rancher:latest
```

### TLS 设置

如需使用不同的 TLS 配置，你可使用 `CATTLE_TLS_MIN_VERSION` 和 `CATTLE_TLS_CIPHERS` 环境变量。例如，将 TLS 1.0 设为可接受的最低 TLS 版本，如下：

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -e CATTLE_TLS_MIN_VERSION="1.0" \
  --privileged \
  rancher/rancher:latest
```

特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。

参见 [TLS 设置]({{<baseurl>}}/rancher/v2.6/en/installation/resources/tls-settings)了解更多信息和选项。

### 离线

如果要访问此页面以完成离线安装，在运行安装命令时，你必须把私有镜像仓库的 URL 添加到 Server 标志前面。例如，将带有私有镜像仓库 URL 的 `<REGISTRY.DOMAIN.COM:PORT>` 添加到 `rancher/rancher:latest` 前面。

**示例**：

     <REGISTRY.DOMAIN.COM:PORT>/rancher/rancher:latest

### 持久化数据

Rancher 使用 etcd 作为数据存储。如果 Rancher 是使用 Docker 安装的，将使用嵌入式 etcd。持久化数据位于容器的 `/var/lib/rancher` 路径中。

你可以将主机卷挂载到该位置，以将数据保留在运行它的主机上。

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /opt/rancher:/var/lib/rancher \
  --privileged \
  rancher/rancher:latest
```

特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。

### 在同一个节点中运行 `rancher/rancher` 和 `rancher/rancher-agent`

如需使用单个节点运行 Rancher 并将同一个节点添加到集群，你必须调整映射给 `rancher/rancher` 容器的主机端口。

如果将节点添加到集群中，节点将部署使用端口 80 和 443 的 NGINX Ingress Controller。而这将与我们建议用于暴露 `rancher/rancher` 容器的默认端口冲突。

请知悉我们不建议将此设置用于生产环境，这种方式仅用来方便进行开发/演示。

如需更改主机端口映射，将 `-p 80:80 -p 443:443` 替换为 `-p 8080:80 -p 8443:443`：

```
docker run -d --restart=unless-stopped \
  -p 8080:80 -p 8443:443 \
  --privileged \
  rancher/rancher:latest
```

特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。
