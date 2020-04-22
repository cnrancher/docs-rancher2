---
title: 安装指南
description: 对于开发和测试环境，可以通过运行单个 Docker 容器来安装 Rancher。在这种安装方案中，您将 Docker 安装在单个 Linux 主机上，然后使用一个 Docker 容器在您的主机上部署 Rancher。
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
  - 其他安装方法
  - 单节点安装
  - 安装指南
---

仅对于开发和测试环境，可以通过运行单个 Docker 容器来安装 Rancher。

在这种安装方案中，您将 Docker 安装在单个 Linux 主机上，然后使用一个 Docker 容器在您的主机上部署 Rancher。

> **想要使用外部负载均衡？**
>
> 请参阅[使用外部负载均器的单节点安装](/docs/installation/options/single-node-install-external-lb/_index)。

## 操作系统，Docker，硬件和网络的要求

确保您的节点满足常规的[安装要求](/docs/installation/requirements/_index)。

## 配置 Linux 主机

根据我们的[要求](/docs/installation/requirements/_index)配置一个 Linux 主机，以启动 Rancher Server。

## 选择一个 SSL 选项并安装 Rancher

为了安全起见，使用 Rancher 时需要 SSL。SSL 保护所有 Rancher 网络通信的安全，例如在您登录集群或与集群交互时。

> **您想要...**
>
> - 使用代理? 请参阅 [HTTP 代理配置](/docs/installation/other-installation-methods/single-node-docker/proxy/_index)
> - 配置自定义 CA 根证书以访问您的服务？请参阅[自定义 CA 根证书](/docs/installation/other-installation-methods/single-node-docker/advanced/_index)
> - 在离线环境下安装 Rancher? 请参阅[单节点离线安装](/docs/installation/other-installation-methods/air-gap/_index)
> - 查看所有 Rancher API 的审计日志? 请参阅[审计日志](/docs/installation/other-installation-methods/single-node-docker/advanced/_index)

选择下面的一个选项：

### 选项 A - 使用 Rancher 默认的自签名证书

如果要在不涉及身份验证的开发或测试环境中安装 Rancher，请使用其生成的自签名证书安装 Rancher。此安装选项省去了自己生成证书的麻烦。

登录到 Linux 主机，然后运行下面这个非常简洁安装命令。

:::important 重要
在使用单节点安装时，Rancher Server 的数据默认保存在容器里。这意味着，在 Rancher Server 容器被删除时，Rancher Server 的数据将会丢失。您可以通过添加 `-v` 参数以挂载目录的方式将数据保存在 Rancher Server 所在的主机上。详情请参阅 [Rancher 单节点数据持久化](/docs/installation/other-installation-methods/single-node-docker/advanced/_index#persist-data)。
:::

```bash
docker run -d --restart=unless-stopped \
	-p 80:80 -p 443:443 \
	rancher/rancher:latest
```

### 选项 B - 使用已有的自签名证书

在开发或测试环境中，您的团队需要访问您的 Rancher Server 时，您可以创建一个自签名证书以供您的 Rancher Server 使用，以便您的团队可以验证正在连接的 Rancher 是否是您的实例。

> **先决条件：**
> 使用 [OpenSSL](https://www.openssl.org/) 或您选择的其他方法创建自签名证书。
>
> - 证书文件必须为 [PEM 格式](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。
> - 在您的证书文件中，包括链中的所有中间证书。您需要对您的证书进行排序，把您的证书放在最签名，后面跟着中间证书。有关示例，请参见[SSL 常见问题解答/故障排查](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

创建证书后，运行下面的 Docker 命令安装 Rancher。使用该 `-v` 标志并提供证书的路径，以将其挂载到容器中。

| 占位符              | 描述                       |
| ------------------- | -------------------------- |
| `<CERT_DIRECTORY>`  | 证书文件所在目录。         |
| `<FULL_CHAIN.pem>`  | 证书链文件路径。           |
| `<PRIVATE_KEY.pem>` | 证书私有密钥路径。         |
| `<CA_CERTS>`        | 证书颁发机构的证书的路径。 |

:::important 重要
在使用单节点安装时，Rancher Server 的数据默认保存在容器里。这意味着，在 Rancher Server 容器被删除时，Rancher Server 的数据将会丢失。您可以通过添加 `-v` 参数以挂载目录的方式将数据保存在 Rancher Server 所在的主机上。详情请参阅 [Rancher 单节点数据持久化](/docs/installation/other-installation-methods/single-node-docker/advanced/_index#persist-data)。
:::

```bash
docker run -d --restart=unless-stopped \
	-p 80:80 -p 443:443 \
	-v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
	-v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
	-v /<CERT_DIRECTORY>/<CA_CERTS.pem>:/etc/rancher/ssl/cacerts.pem \
	rancher/rancher:latest
```

### 选项 C - 使用已有的可信证书

在要公开展示应用程序的环境中，请使用由权威的 CA 签名的证书，这样您的用户就不会遇到安全警告。

> **先决条件：**
>
> - 证书文件必须为 [PEM 格式](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。
> - 在您的证书文件中，包括链中的所有中间证书。您需要对您的证书进行排序，把您的证书放在最签名，后面跟着中间证书。有关示例，请参见[SSL 常见问题解答/故障排查](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

获得证书后，运行下面的 Docker 命令。

- 使用该 `-v` 标志并提供证书的路径，以将其挂载到容器中，由于您的证书是由权威的 CA 签名的，因此不需要安装其他 CA 证书文件。
- 使用 `--no-cacerts` 作为容器的参数，来禁用由 Rancher 生成的默认 CA 证书。

| 占位符              | 描述               |
| ------------------- | ------------------ |
| `<CERT_DIRECTORY>`  | 证书文件所在目录。 |
| `<FULL_CHAIN.pem>`  | 证书链文件路径。   |
| `<PRIVATE_KEY.pem>` | 证书私有密钥路径。 |

:::important 重要
在使用单节点安装时，Rancher Server 的数据默认保存在容器里。这意味着，在 Rancher Server 容器被删除时，Rancher Server 的数据将会丢失。您可以通过添加 `-v` 参数以挂载目录的方式将数据保存在 Rancher Server 所在的主机上。详情请参阅 [Rancher 单节点数据持久化](/docs/installation/other-installation-methods/single-node-docker/advanced/_index#persist-data)。
:::

```bash
docker run -d --restart=unless-stopped \
	-p 80:80 -p 443:443 \
	-v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
	-v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
	rancher/rancher:latest \
	--no-cacerts
```

### 选项 D - 使用 Let's Encrypt 证书

> **注意：** Let's Encrypt 对请求新证书有速率限制。因此，请限制创建或销毁容器的频率。有关更多信息，请参阅[ Let’s Encrypt 关于速率限制的文档](https://letsencrypt.org/docs/rate-limits/)。

对于生产环境，您还可以选择使用 [Let's Encrypt](https://letsencrypt.org/) 证书。Let's Encrypt 使用 http-01 challenge 来验证您对域名的控制权。您可以通过将要用于 Rancher 访问的主机名（例如 rancher.mydomain.com）指向运行该计算机的 IP 来确认您控制该域。您可以通过在 DNS 中创建 A 记录来将主机名绑定到 IP 地址。

> **先决条件：**
>
> - Let's Encrypt 证书是一项 Internet 服务。因此，不能在离线环境中使用。
> - 在 DNS 中创建一条记录，该记录将 Linux 主机 IP 地址绑定到要用于 Rancher 访问的主机名 (例如，`rancher.mydomain.com`)。
> - 在 Linux 主机上打开 `TCP/80` 端口。Let's Encrypt 的 http-01 challenge 可以来自任何源 IP 地址，因此端口 `TCP/80` 必须开放给所有 IP 地址。

满足先决条件后，可以通过运行以下命令使用 Let's Encrypt 证书安装 Rancher。

| 占位符            | 描述     |
| ----------------- | -------- |
| `<YOUR.DNS.NAME>` | 您的域名 |

:::important 重要
在使用单节点安装时，Rancher Server 的数据默认保存在容器里。这意味着，在 Rancher Server 容器被删除时，Rancher Server 的数据将会丢失。您可以通过添加 `-v` 参数以挂载目录的方式将数据保存在 Rancher Server 所在的主机上。详情请参阅 [Rancher 单节点数据持久化](/docs/installation/other-installation-methods/single-node-docker/advanced/_index#persist-data)。
:::

```
docker run -d --restart=unless-stopped \
	-p 80:80 -p 443:443 \
	rancher/rancher:latest \
	--acme-domain <YOUR.DNS.NAME>
```

## 高级选项

使用 Docker 在单个节点上安装 Rancher 时，可以启用几个高级选项：

- 自定义 CA 根证书
- API 升级日志
- TLS 配置
- 离线安装
- 持久化数据
- 在同一个节点上运行 Rancher Server 和 Rancher Agent

有关详情，请参阅[此页面](/docs/installation/other-installation-methods/single-node-docker/advanced/_index)。

## 故障排查

请参阅[此页面](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)，以获取常见问题和问题排查的提示。

## 下一步？

- **推荐：** 查看[单节点备份和还原](/docs/backups/backups/single-node-backups/_index)。尽管您现在没有任何数据需要备份，但是我们建议您在常规使用 Rancher 之后创建备份。
- 创建 Kubernetes 集群：[创建 Kubernetes 集群](/docs/cluster-provisioning/_index)。
