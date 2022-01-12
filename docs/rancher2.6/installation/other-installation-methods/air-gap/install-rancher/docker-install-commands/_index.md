---
title: Docker 安装命令
weight: 1
---

Docker 安装适用于想要测试 Rancher 的用户。

你可以使用 `docker run`命令，把 Rancher Server 组件安装到单个节点上，而不需要运行 Kubernetes 集群。由于只有一个节点和一个 Docker 容器，因此，如果该节点发生故障，由于其他节点上没有可用的 etcd 数据副本，你将丢失 Rancher Server 的所有数据。

你可以使用备份应用，按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/backups/migrating-rancher)，将 Rancher Server 从 Docker 安装迁移到 Kubernetes 安装。

出于安全考虑，使用 Rancher 时需要使用 SSL（Secure Sockets Layer）。SSL 保护所有 Rancher 网络通信（如登录和与集群交互）的安全。

| 环境变量键 | 环境变量值 | 描述 |
| -------------------------------- | -------------------------------- | ---- |
| `CATTLE_SYSTEM_DEFAULT_REGISTRY` | `<REGISTRY.YOURDOMAIN.COM:PORT>` | 将 Rancher Server 配置成在配置集群时，始终从私有镜像仓库中拉取镜像。 |
| `CATTLE_SYSTEM_CATALOG` | `bundled` | 配置 Rancher Server 使用打包的 Helm System Chart 副本。[system charts](https://github.com/rancher/system-charts) 仓库包含所有监控，日志管理，告警和全局 DNS 等功能所需的应用商店项目。这些 [Helm Chart](https://github.com/rancher/system-charts) 位于 GitHub 中。但是由于你处在离线环境，因此使用 Rancher 内置的 Chart 会比设置 Git mirror 容易得多。 |

> **你是否需要**：
>
> - 配置自定义 CA 根证书以访问服务。参见[自定义 CA 根证书]({{<baseurl>}}/rancher/v2.6/en/installation/resources/custom-ca-root-certificate/)。
> - 记录所有与 Rancher API 的事务。参见 [API 审计]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/advanced/#api-audit-log)。

选择以下的选项之一：

### 选项 A：使用 Rancher 默认的自签名证书

{{% accordion id="option-a" label="Click to expand" %}}

如果你在不考虑身份验证的开发或测试环境中安装 Rancher，可以使用 Rancher 生成的自签名证书安装 Rancher。这种安装方式避免了自己生成证书的麻烦。

登录到你的 Linux 主机，然后运行下面的安装命令。输入命令时，参考下表来替换每个占位符。

| 占位符 | 描述 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像仓库的 URL 和端口。 |
| `<RANCHER_VERSION_TAG>` | 你想要安装的 [Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)的版本标签。 |

特权访问是[必须](#privileged-access-for-rancher)的。

```
docker run -d --restart=unless-stopped \
    -p 80:80 -p 443:443 \
    -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置在 Rancher 中使用的默认私有镜像仓库
    -e CATTLE_SYSTEM_CATALOG=bundled \ # 使用打包的 Rancher System Chart
    --privileged \
    <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```



### 选项 B：使用你自己的证书 - 自签名



在你团队访问 Rancher Server 的开发或测试环境中，创建一个用于你的安装的自签名证书，以便团队验证他们对实例的连接。

> **前提**：
> 从能连接到互联网的计算机上，使用 [OpenSSL](https://www.openssl.org/) 或其他方法创建自签名证书。
>
> - 证书文件的格式必须是 PEM。
> - 在你的证书文件中，包括链中的所有中间证书。你需要对你的证书进行排序，把你的证书放在最前面，后面跟着中间证书。如需查看示例，请参见[证书故障排查]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/troubleshooting)。

创建证书后，登录 Linux 主机，然后运行以下安装命令。输入命令时，参考下表来替换每个占位符。使用 `-v` 标志并提供证书的路径，以将证书挂载到容器中。

| 占位符 | 描述 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `<CERT_DIRECTORY>` | 包含证书文件的目录的路径。 |
| `<FULL_CHAIN.pem>` | 完整证书链的路径。 |
| `<PRIVATE_KEY.pem>` | 证书私钥的路径。 |
| `<CA_CERTS.pem>` | CA 证书的路径。 |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像仓库的 URL 和端口。 |
| `<RANCHER_VERSION_TAG>` | 你想要安装的 [Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)的版本标签。 |

特权访问是[必须](#privileged-access-for-rancher)的。

```
docker run -d --restart=unless-stopped \
    -p 80:80 -p 443:443 \
    -v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
    -v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
    -v /<CERT_DIRECTORY>/<CA_CERTS.pem>:/etc/rancher/ssl/cacerts.pem \
    -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置在 Rancher 中使用的默认私有镜像仓库
    -e CATTLE_SYSTEM_CATALOG=bundled \ # 使用打包的 Rancher System Chart
    --privileged \
    <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```



### 选项 C：使用你自己的证书 - 可信 CA 签名的证书



在公开暴露应用的开发或测试环境中，请使用由可信 CA 签名的证书，以避免用户收到证书安全警告。

> **前提**：证书文件的格式必须是 PEM。

获取证书后，登录 Linux 主机，然后运行以下安装命令。输入命令时，参考下表来替换每个占位符。因为你的证书是由可信的 CA 签名的，因此你不需要安装额外的 CA 证书文件。

| 占位符 | 描述 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `<CERT_DIRECTORY>` | 包含证书文件的目录的路径。 |
| `<FULL_CHAIN.pem>` | 完整证书链的路径。 |
| `<PRIVATE_KEY.pem>` | 证书私钥的路径。 |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像仓库的 URL 和端口。 |
| `<RANCHER_VERSION_TAG>` | 你想要安装的 [Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)的版本标签。 |

> **注意**：使用 `--no-cacerts` 作为容器的参数，以禁用 Rancher 生成的默认 CA 证书。

特权访问是[必须](#privileged-access-for-rancher)的。

```
docker run -d --restart=unless-stopped \
    -p 80:80 -p 443:443 \
    --no-cacerts \
    -v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
    -v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
    -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置在 Rancher 中使用的默认私有镜像仓库
    -e CATTLE_SYSTEM_CATALOG=bundled \ # 使用打包的 Rancher System Chart
    --privileged
    <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```





> **注意**：如果你不想发送遥测数据，在首次登录时退出[遥测]({{<baseurl>}}/rancher/v2.6/en/faq/telemetry/)。

