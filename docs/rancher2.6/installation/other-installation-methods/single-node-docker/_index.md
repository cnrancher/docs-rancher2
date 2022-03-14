---
title: 使用 Docker 将 Rancher 安装到单个节点中
description: 在开发和测试环境中，你可以使用 Docker 安装。在单个 Linux 主机上安装 Docker，然后使用一个 Docker 容器部署 Rancher。
weight: 2
---

Rancher 可以通过运行单个 Docker 容器进行安装。

在这种安装方案中，你需要将 Docker 安装到单个 Linux 主机，然后使用单个 Docker 容器将 Rancher 部署到主机中。

> **何时需要使用负载均衡器**
> 参见[使用外部负载均衡器进行 Docker 安装]({{<baseurl>}}/rancher/v2.6/en/installation/resources/advanced/single-node-install-external-lb)。

Rancher 的 Docker 安装仅推荐用于开发和测试环境中。Rancher 版本决定了能否将 Rancher 迁移到高可用集群。

Rancher backup operator 可将 Rancher 从单个 Docker 容器迁移到高可用 Kubernetes 集群上。详情请参见[把 Rancher 迁移到新集群]({{<baseurl>}}/rancher/v2.6/en/backups/migrating-rancher)。

### Rancher 特权访问

当 Rancher Server 部署在 Docker 容器中时，容器内会安装一个本地 Kubernetes 集群供 Rancher 使用。为 Rancher 的很多功能都是以 deployment 的方式运行的，而在容器内运行容器是需要特权模式的，因此你需要在安装 Rancher 时添加 `--privileged` 选项。

## 操作系统，Docker，硬件和网络要求

请确保你的节点满足常规的[安装要求]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/)。

## 1. 配置 Linux 主机

按照[要求]({{<baseurl>}}/rancher/v2.6/en/installation/requirements)配置一个 Linux 主机，用于运行 Rancher Server。

## 2. 选择一个 SSL 选项并安装 Rancher

出于安全考虑，使用 Rancher 时请使用 SSL（Secure Sockets Layer）。SSL 保护所有 Rancher 网络通信（如登录和与集群交互）的安全。

> **你是否需要**：
>
> - 使用代理。参见 [HTTP 代理配置]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/proxy/)。
> - 配置自定义 CA 根证书以访问服务。参见[自定义 CA 根证书]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/advanced/#custom-ca-certificate/)。
> - 完成离线安装。参见 [离线：Docker 安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/)。
> - 记录所有 Rancher API 的事务。参加 [API 审计](./advanced/#api-audit-log)。

选择以下的选项之一：

- [选项 A：使用 Rancher 生成的默认自签名证书](#option-a-default-rancher-generated-self-signed-certificate)
- [选项 B：使用你自己的证书 - 自签名](#option-b-bring-your-own-certificate-self-signed)
- [选项 C：使用你自己的证书 - 可信 CA 签名的证书](#option-c-bring-your-own-certificate-signed-by-a-recognized-ca)
- [选项 D：Let's Encrypt 证书](#option-d-let-s-encrypt-certificate)
- [选项 E：Localhost 隧道，不使用证书](#option-e-localhost-tunneling-no-certificate)

### 选项 A：使用 Rancher 生成的默认自签名证书

如果你在不考虑身份验证的开发或测试环境中安装 Rancher，可以使用 Rancher 生成的自签名证书安装 Rancher。这种安装方式避免了自己生成证书的麻烦。

登录到你的主机，然后运行以下命令：

```bash
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  --privileged \
  rancher/rancher:latest
```

### 选项 B：使用你自己的证书 - 自签名
在你团队访问 Rancher Server 的开发或测试环境中，创建一个用于你的安装的自签名证书，以便团队验证他们对实例的连接。

> **前提**：
> 使用 [OpenSSL](https://www.openssl.org/) 或其他方法创建自签名证书。
>
> - 证书文件的格式必须是 PEM。
> - 在你的证书文件中，包括链中的所有中间证书。你需要对你的证书进行排序，把你的证书放在最前面，后面跟着中间证书。如需查看示例，请参见[证书故障排查]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/troubleshooting)。

创建证书后，运行以下 Docker 命令以安装 Rancher。使用 `-v` 标志并提供证书的路径，以将证书挂载到容器中。

| 占位符 | 描述 |
| ------------------- | --------------------- |
| `<CERT_DIRECTORY>` | 包含证书文件的目录的路径。 |
| `<FULL_CHAIN.pem>` | 完整证书链的路径。 |
| `<PRIVATE_KEY.pem>` | 证书私钥的路径。 |
| `<CA_CERTS.pem>` | CA 证书的路径。 |

登录到你的主机，然后运行以下命令：

```bash
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
  -v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
  -v /<CERT_DIRECTORY>/<CA_CERTS.pem>:/etc/rancher/ssl/cacerts.pem \
  --privileged \
  rancher/rancher:latest
```

### 选项 C：使用你自己的证书 - 可信 CA 签名的证书

在公开暴露应用的生产环境中，请使用由可信 CA 签名的证书，以避免用户收到证书安全警告。

> **前提**：
>
> - 证书文件的格式必须是 PEM。
> - 在你的证书文件中，包括可信 CA 提供的所有中间证书。你需要对你的证书进行排序，把你的证书放在最前面，后面跟着中间证书。如需查看示例，请参见[证书故障排查]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/troubleshooting)。

获取证书后，运行以下 Docker 命令。

- 使用 `-v` 标志并提供证书的路径，以将证书挂载到容器中。因为你的证书是由可信的 CA 签名的，因此你不需要安装额外的 CA 证书文件。
- 使用 `--no-cacerts` 作为容器的参数，以禁用 Rancher 生成的默认 CA 证书。

| 占位符 | 描述 |
| ------------------- | ----------------------------- |
| `<CERT_DIRECTORY>` | 包含证书文件的目录的路径。 |
| `<FULL_CHAIN.pem>` | 完整证书链的路径。 |
| `<PRIVATE_KEY.pem>` | 证书私钥的路径。 |

登录到你的主机，然后运行以下命令：

```bash
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
  -v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
  --privileged \
  rancher/rancher:latest \
  --no-cacerts
```

### 选项 D：Let's Encrypt 证书

> **注意**：Let's Encrypt 对新证书请求有频率限制。因此，请限制创建或销毁容器的频率。详情请参见 [Let's Encrypt 官方文档 - 频率限制](https://letsencrypt.org/docs/rate-limits/)。

你也可以在生产环境中使用 [Let's Encrypt](https://letsencrypt.org/) 证书。Let's Encrypt 使用 HTTP-01 质询来验证你对域名的控制权。如果要确认你对该域名有控制权，你可将用于访问 Rancher 的主机名（例如 `rancher.mydomain.com`）指向运行的机器的 IP。你可通过在 DNS 中创建 A 记录，以将主机名绑定到 IP 地址。

> **前提**：
>
> - Let's Encrypt 是联网服务。因此，在内网和离线环境中不能使用。
> - 在 DNS 中创建一条记录，将 Linux 主机 IP 地址绑定到要用于访问 Rancher 的主机名（例如，`rancher.mydomain.com`）。
> - 在 Linux 主机上打开 `TCP/80` 端口。Let's Encrypt 的 HTTP-01 质询可以来自任何源 IP 地址，因此端口 `TCP/80` 必须开放开所有 IP 地址。

满足前提后，你可以运行以下命令使用 Let's Encrypt 证书安装 Rancher。

| 占位符 | 描述 |
| ----------------- | ------------------- |
| `<YOUR.DNS.NAME>` | 你的域名地址 |

登录到你的主机，然后运行以下命令：

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  --privileged \
  rancher/rancher:latest \
  --acme-domain <YOUR.DNS.NAME>
```

### 选项 E：Localhost 隧道，不使用证书

如果你在开发或测试环境中安装 Rancher，且环境中有运行的 localhost 隧道解决方案（如 [ngrok](https://ngrok.com/)），不要生成证书。此安装选项不需要证书。

- 使用 `--no-cacerts` 作为参数，以禁用 Rancher 生成的默认 CA 证书。

登录到你的主机，然后运行以下命令：

```bash
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  --privileged \
  rancher/rancher:latest \
  --no-cacerts
```

## 高级选项

使用 Docker 将 Rancher 安装到单个节点时，有如下几个可开启的高级选项：

- 自定义 CA 证书
- API 审计日志
- TLS 设置
- 离线环境
- 持久化数据
- 在同一个节点中运行 `rancher/rancher` 和 `rancher/rancher-agent`

详情请参见[本页](./advanced)。

## 故障排查

如需了解常见问题及故障排查提示，请参见[本页](./troubleshooting)。

## 后续操作

- **推荐**：[单节点备份和恢复]({{<baseurl>}}/rancher/v2.6/en/backups/docker-installs)。你可能暂时没有需要备份的数据，但是我们建议你在常规使用 Rancher 后创建备份。
- 创建 Kubernetes 集群：[配置 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/)。
