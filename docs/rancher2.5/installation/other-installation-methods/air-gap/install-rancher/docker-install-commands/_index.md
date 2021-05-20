---
title: 单节点安装命令
description: 本节介绍如何为离线环境部署 Rancher。您可以离线安装 Rancher Server，它可能处于防火墙之后或在代理之后。本文将介绍高可用离线安装（推荐）和单节点离线安装。
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
  - 离线安装
  - 安装 Rancher
  - 单节点安装命令
---

## 概述

Docker 安装是为那些想测试 Rancher 的用户准备的。

你没有在 Kubernetes 集群上运行，而是使用`docker run`命令在单个节点上安装 Rancher 服务器组件。由于只有一个节点和一个 Docker 容器，如果该节点发生故障，其他节点上没有可用的 etcd 数据副本，你将失去 Rancher 服务器的所有数据。

对于 Rancher v2.5+，可以使用备份应用程序将 Rancher 服务器从 Docker 安装迁移到 Kubernetes 安装，使用[这些步骤](/docs/rancher2.5/backups/migrating-rancher/_index)。

出于安全考虑，使用 Rancher 时需要使用 SSL（安全套接字层）。SSL 保护所有 Rancher 网络通信的安全，比如当你登录或与集群交互时。

| Environment Variable Key         | Environment Variable Value       | Description                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CATTLE_SYSTEM_DEFAULT_REGISTRY` | `<REGISTRY.YOURDOMAIN.COM:PORT>` | 配置 Rancher Server，使其在配置集群时总是从你的私有镜像仓库中提取。                                                                                                                                                                                                                                                                         |
| `CATTLE_SYSTEM_CATALOG`          | `bundled`                        | 配置 Rancher Server 以使用 Helm System Chart 的打包拷贝。[system charts](https://github.com/rancher/system-charts)资源库包含了监控、日志、警报和全局 DNS 等功能所需的所有目录项。这些[Helm charts](https://github.com/rancher/system-charts)位于 GitHub 中，但由于你处在离线环境中，使用 Rancher 内捆绑的 chart 要比设置 Git 镜像容易得多。 |

- 如果需要配置自定义 CA 根证书来访问您的服务，请参考[自定义 CA 根证书](/docs/rancher2.5/installation/options/custom-ca-root-certificate/_index)。

- 如果需要记录所有与 Rancher API 的交易，请参考[API 审计](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/advanced/_index) 。

从以下选项中选择。

### 选项 A - 使用 Rancher 默认的自签名证书

如果选择使用 Rancher 生成的自签名证书，则在启动原始 Rancher Server 容器的命令中添加`--volumes-from rancher-data`。

| 占位符                           | 描述                                                                                                    |
| :------------------------------- | :------------------------------------------------------------------------------------------------------ |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 您的私有仓库 URL 和端口。                                                                               |
| `<RANCHER_VERSION_TAG>`          | 您要升级到的[Rancher 版本](/docs/rancher2.5/installation/resources/choosing-version/_index)的发行标签。 |

```bash
  docker run -d --privileged --volumes-from rancher-data \
      --restart=unless-stopped \
      -p 80:80 -p 443:443 \
      -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
      -e CATTLE_SYSTEM_CATALOG=bundled \ #Available as of v2.3.0，use the packaged Rancher system charts
      <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```

#### 选项 B - 使用自己的自签名证书

如果您选择携带自己的自签名证书，则在启动原始 Rancher Server 容器的命令中添加`--volumes-from rancher-data`，并需要可以访问到原始安装时使用的证书。

> **证书先决条件提示：** 证书文件必须为[PEM 格式](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/_index)。在您的证书文件中，包括链中的所有中间证书。您需要对您的证书进行排序，把您的证书放在最签名，后面跟着中间证书。有关示例，请参见[SSL 常见问题解答/故障排查](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

| 占位符                           | 描述                                                                                                    |
| :------------------------------- | :------------------------------------------------------------------------------------------------------ |
| `<CERT_DIRECTORY>`               | 包含证书文件的目录的路径。                                                                              |
| `<FULL_CHAIN.pem>`               | 完整证书链的路径。                                                                                      |
| `<PRIVATE_KEY.pem>`              | 证书私钥的路径。                                                                                        |
| `<CA_CERTS.pem>`                 | 证书颁发机构的证书的路径。                                                                              |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 您的私有仓库 URL 和端口。                                                                               |
| `<RANCHER_VERSION_TAG>`          | 您要升级到的[Rancher 版本](/docs/rancher2.5/installation/resources/choosing-version/_index)的发行标签。 |

```bash
docker run -d --privileged --restart=unless-stopped \
    -p 80:80 -p 443:443 \
    -v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
    -v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
    -v /<CERT_DIRECTORY>/<CA_CERTS.pem>:/etc/rancher/ssl/cacerts.pem \
    -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
    -e CATTLE_SYSTEM_CATALOG=bundled \ #Available as of v2.3.0，use the packaged Rancher system charts
    <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```

#### 选项 C - 使用自己的由可信 CA 签名的证书

如果选择使用由可信 CA 签名的证书，则将 `--volumes-from rancher-data` 添加到启动原始 Rancher Server 容器的命令中，并需要可以访问到原始安装时使用的证书。请记住，要在容器启动命令中包含`--no-cacerts`参数，以禁用 Rancher 生成的默认 CA 证书。

> **证书先决条件提示：** 证书文件必须为[PEM 格式](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/_index)。在您的证书文件中，包括可信 CA 提供的所有中间证书。您需要对您的证书进行排序，把您的证书放在最签名，后面跟着中间证书。有关示例，请参见[SSL 常见问题解答/故障排查](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

| 占位符                           | 描述                                                                                                     |
| :------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `<CERT_DIRECTORY>`               | 包含证书文件的目录的路径。                                                                               |
| `<FULL_CHAIN.pem>`               | 完整证书链的路径。                                                                                       |
| `<PRIVATE_KEY.pem>`              | 证书私钥的路径。                                                                                         |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 您的私有仓库 URL 和端口。                                                                                |
| `<RANCHER_VERSION_TAG>`          | 您要升级到的[Rancher 版本](/docs/rancher2.5/installation/resources/choosing-version/_index) 的发行标签。 |

> **注意：** 使用`--no-cacerts`作为容器的参数来禁用 Rancher 生成的默认 CA 证书。

```bash
docker run -d --privileged --volumes-from rancher-data \
    --restart=unless-stopped \
     -p 80:80 -p 443:443 \
     --no-cacerts \
     -v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
     -v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
     -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
     -e CATTLE_SYSTEM_CATALOG=bundled \ #Available as of v2.3.0，use the packaged Rancher system charts
     <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```

**结果：** 您已经升级了 Rancher。现在，已升级服务器中的数据将保存到`rancher-data`容器中，以用于将来的升级。

**注意：**如果你不打算发送遥测数据，在初始登录时选择退出[遥测](/docs/rancher2.5/faq/telemetry/_index)。
