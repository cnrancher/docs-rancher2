---
title: 升级 Docker 安装的 Rancher
weight: 1010
---

本文介绍如何升级通过 Docker 安装的 Rancher Server。

# 前提

- 参见 Rancher 官方文档中的[已知升级问题]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/upgrades/#known-upgrade-issues)，了解升级 升级 Rancher 时最需要注意的问题。你可以访问 [GitHub](https://github.com/rancher/rancher/releases) 上的发行说明和 [Rancher 论坛](https://forums.rancher.com/c/announcements/12)，以了解每个 Rancher 版本已知问题的完整列表。不支持升级或升级到 [rancher-alpha 仓库]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#helm-chart-repositories/)中的任何 Chart。
- **[仅适用于离线安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap)：为新的 Rancher Server 版本收集和推送镜像**。按照指南为你想要升级的目标 Rancher 版本[推送镜像到私有镜像仓库]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/populate-private-registry/)。

# 占位符

在升级过程中，你将输入一系列命令。请按照你环境的实际情况替换占位符。占位符用尖括号和大写字母（如 `<EXAMPLE>`）表示。

以下是带有占位符的命令**示例**：

```
docker stop <RANCHER_CONTAINER_NAME>
```

在此命令中，`<RANCHER_CONTAINER_NAME>`  是你的 Rancher 容器的名称。

# 获取升级命令的数据

要获取替换占位符的数据，请运行：

```
docker ps
```

在开始升级之前记下或复制此信息。

<sup>终端 `docker ps` 命令，显示如何找到 `<RANCHER_CONTAINER_TAG>` 和 `<RANCHER_CONTAINER_NAME>`</sup>
![占位符参考]({{<baseurl>}}/img/rancher/placeholder-ref.png)

| 占位符 | 示例 | 描述 |
| -------------------------- | -------------------------- | --------------------------------------------------------- |
| `<RANCHER_CONTAINER_TAG>` | `v2.1.3` | 首次安装拉取的 rancher/rancher 镜像。 |
| `<RANCHER_CONTAINER_NAME>` | `festive_mestorf` | 你的 Rancher 容器的名称。 |
| `<RANCHER_VERSION>` | `v2.1.3` | 你为其创建备份的 Rancher 版本。 |
| `<DATE>` | `2018-12-19` | 数据容器或备份的创建日期。 |
<br/>

可以通过远程连接登录到 Rancher Server 所在的主机并输入命令 `docker ps` 以查看正在运行的容器，从而获得 `<RANCHER_CONTAINER_TAG>` 和 `<RANCHER_CONTAINER_NAME>`。你还可以运行 `docker ps -a` 命令查看停止了的容器。在创建备份期间，你可以随时运行这些命令以获得帮助。

# 升级概要

在升级期间，你可以为当前 Rancher 容器创建数据的副本及备份，以确保可以在升级出现问题时可以进行回滚。然后，你可使用现有数据将新版本的 Rancher 部署到新容器中。按照以下步骤升级 Rancher Server：

- [1. 创建 Rancher Server 容器的数据副本](#1-create-a-copy-of-the-data-from-your-rancher-server-container)
- [2. 创建备份压缩包](#2-create-a-backup-tarball)
- [3. 拉取新的 Docker 镜像](#3-pull-the-new-docker-image)
- [4. 启动新的 Rancher Server 容器](#4-start-the-new-rancher-server-container)
- [5. 验证安装](#5-verify-the-upgrade)
- [6. 清理旧的 Rancher Server 容器](#6-clean-up-your-old-rancher-server-container)

# 1. 创建 Rancher Server 容器的数据副本

1. 使用远程终端连接，登录到运行 Rancher Server 的节点。

1. 停止正在运行 Rancher Server 的容器。将 `<RANCHER_CONTAINER_NAME>` 替换为你的 Rancher 容器的名称。

   ```
   docker stop <RANCHER_CONTAINER_NAME>
   ```

1. <a id="backup"></a>运行以下命令，从刚才停止的 Rancher 容器创建一个数据容器。请替换命令中的占位符。

   ```
   docker create --volumes-from <RANCHER_CONTAINER_NAME> --name rancher-data rancher/rancher:<RANCHER_CONTAINER_TAG>
   ```

# 2. 创建备份压缩包

1. <a id="tarball"></a>使用你刚才创建的数据容器（`rancher-data`）创建一个备份压缩包（`rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`）。

   如果升级期间出现问题，此压缩包可以用作回滚点。替换占位符来运行以下命令。


   ```
   docker run --volumes-from rancher-data -v "$PWD:/backup" --rm busybox tar zcvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz /var/lib/rancher
   ```

   **步骤结果**：你输入此命令时，会运行一系列命令。

1. 输入 `ls` 命令，以确认备份压缩包已创建成功。压缩包的名称格式类似 `rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`。

   ```
   [rancher@ip-10-0-0-50 ~]$ ls
   rancher-data-backup-v2.1.3-20181219.tar.gz
   ```

1. 将备份压缩包移动到 Rancher Server 外的安全位置。

# 3. 拉取新的 Docker 镜像

拉取你需要升级到的 Rancher 版本镜像。

| 占位符 | 描述 |
------------|-------------
| `<RANCHER_VERSION_TAG>` | 你想要升级到的 [Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)的版本标签。 |

```
docker pull rancher/rancher:<RANCHER_VERSION_TAG>
```

# 4. 启动新的 Rancher Server 容器

使用 `rancher-data` 容器中的数据启动一个新的 Rancher Server 容器。记住要传入启动原始容器时使用的所有环境变量。

> **重要**：启动升级后，即使升级耗时比预期长，也 _不要_ 停止升级。如果你停止升级，可能会导致之后的升级中出现数据库迁移错误。

如果你使用代理，请参见 [HTTP 代理配置]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/proxy/)。

如果你配置了自定义 CA 根证书来访问服务，请参见[自定义 CA 根证书]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/advanced/#custom-ca-certificate)。

如果你要记录所有 Rancher API 的事务，请参见 [API 审计]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/advanced/#api-audit-log)。

如需查看启动新 Rancher Server 容器时使用的命令，从以下的选项中进行选择：

- Docker 升级
- 离线安装的 Docker 升级

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


<Tabs
defaultValue="docker"
values={[
{ label: 'Docker 升级', value: 'docker', },
{ label: 'Docker 离线升级', value: 'airgap', },
]}>

<TabItem value="docker">

选择你安装 Rancher Server 时用的选项

### 选项 A：使用 Rancher 默认的自签名证书



如果你使用 Rancher 生成的自签名证书，则将 `--volumes-from rancher-data` 添加到你启动原始 Rancher Server 容器的命令中。

| 占位符 | 描述 |
------------|-------------
| `<RANCHER_VERSION_TAG>` | 你想要升级到的 [Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)的版本标签。 |

```
docker run -d --volumes-from rancher-data \
  --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  --privileged \
  rancher/rancher:<RANCHER_VERSION_TAG>
```

特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。



### 选项 B：使用你自己的证书 - 自签名



如果你选择使用自己的自签名证书，则在启动原始 Rancher Server 容器的命令中添加 `--volumes-from rancher-data`。此外，你需要能够访问你原始安装时使用的证书。

> **证书要求提示**：证书文件的格式必须是 PEM。在你的证书文件中，包括链中的所有中间证书。你需要对你的证书进行排序，把你的证书放在最前面，后面跟着中间证书。

| 占位符 | 描述 |
------------|-------------
| `<CERT_DIRECTORY>` | 包含证书文件的目录的路径。 |
| `<FULL_CHAIN.pem>` | 完整证书链的路径。 |
| `<PRIVATE_KEY.pem>` | 证书私钥的路径。 |
| `<CA_CERTS.pem>` | CA 证书的路径。 |
| `<RANCHER_VERSION_TAG>` | 你想要升级到的 [Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)的版本标签。 |

```
docker run -d --volumes-from rancher-data \
  --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
  -v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
  -v /<CERT_DIRECTORY>/<CA_CERTS.pem>:/etc/rancher/ssl/cacerts.pem \
  --privileged \
  rancher/rancher:<RANCHER_VERSION_TAG>
```

特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。



### 选项 C：使用你自己的证书 - 可信 CA 签名的证书



如果你选择使用可信 CA 签名的证书，则在启动原始 Rancher Server 容器的命令中添加 `--volumes-from rancher-data`。此外，你需要能够访问你原始安装时使用的证书。注意要使用 `--no-cacerts` 作为容器的参数，以禁用 Rancher 生成的默认 CA 证书。

> **证书要求提示**：证书文件的格式必须是 PEM。在你的证书文件中，包括可信 CA 提供的所有中间证书。你需要对你的证书进行排序，把你的证书放在最前面，后面跟着中间证书。如需查看示例，请参见[证书故障排查]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/troubleshooting)。

| 占位符 | 描述 |
------------|-------------
| `<CERT_DIRECTORY>` | 包含证书文件的目录的路径。 |
| `<FULL_CHAIN.pem>` | 完整证书链的路径。 |
| `<PRIVATE_KEY.pem>` | 证书私钥的路径。 |
| `<RANCHER_VERSION_TAG>` | 你想要升级到的 [Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)的版本标签。 |

```
docker run -d --volumes-from rancher-data \
  --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
  -v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
  --privileged \
  rancher/rancher:<RANCHER_VERSION_TAG> \
  --no-cacerts
```

特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。


### 选项 D：Let's Encrypt 证书



> **注意**：Let's Encrypt 对新证书请求有频率限制。因此，请限制创建或销毁容器的频率。详情请参见 [Let's Encrypt 官方文档 - 频率限制](https://letsencrypt.org/docs/rate-limits/)。

如果你选择使用 [Let's Encrypt](https://letsencrypt.org/) 证书，则在启动原始 Rancher Server 容器的命令中添加 `--volumes-from rancher-data`，并且提供最初安装 Rancher 时使用的域名。

> **证书要求提示**：
>
> - 在 DNS 中创建一条记录，将 Linux 主机 IP 地址绑定到要用于访问 Rancher 的主机名（例如，`rancher.mydomain.com`）。
> - 在 Linux 主机上打开 `TCP/80` 端口。Let's Encrypt 的 HTTP-01 质询可以来自任何源 IP 地址，因此端口 `TCP/80` 必须开放开所有 IP 地址。

| 占位符 | 描述 |
------------|-------------
| `<RANCHER_VERSION_TAG>` | 你想要升级到的 [Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)的版本标签。 |
| `<YOUR.DNS.NAME>` | 你最初使用的域名 |

```
docker run -d --volumes-from rancher-data \
  --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  --privileged \
  rancher/rancher:<RANCHER_VERSION_TAG> \
  --acme-domain <YOUR.DNS.NAME>
```

特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。



</TabItem>
<TabItem value="airgap">

出于安全考虑，使用 Rancher 时需要使用 SSL（Secure Sockets Layer）。SSL 保护所有 Rancher 网络通信（如登录和与集群交互）的安全。

启动新的 Rancher Server 容器时，从以下的选项中进行选择：

### 选项 A：使用 Rancher 默认的自签名证书



如果你使用 Rancher 生成的自签名证书，则将 `--volumes-from rancher-data` 添加到你启动原始 Rancher Server 容器的命令中。

| 占位符 | 描述 |
------------|-------------
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像仓库的 URL 和端口。 |
| `<RANCHER_VERSION_TAG>` | 你想要升级到的 [Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)的版本标签。 |

```
  docker run -d --volumes-from rancher-data \
      --restart=unless-stopped \
      -p 80:80 -p 443:443 \
      -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置在 Rancher 中使用的默认私有镜像仓库
      -e CATTLE_SYSTEM_CATALOG=bundled \ # 使用打包的 Rancher System Chart
      --privileged \
      <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```

特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。


### 选项 B：使用你自己的证书 - 自签名



如果你选择使用自己的自签名证书，则在启动原始 Rancher Server 容器的命令中添加 `--volumes-from rancher-data`。此外，你需要能够访问你原始安装时使用的证书。

> **证书要求提示**：证书文件的格式必须是 PEM。在你的证书文件中，包括链中的所有中间证书。你需要对你的证书进行排序，把你的证书放在最前面，后面跟着中间证书。如需查看示例，请参见[证书故障排查]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/troubleshooting)。

| 占位符 | 描述 |
------------|-------------
| `<CERT_DIRECTORY>` | 包含证书文件的目录的路径。 |
| `<FULL_CHAIN.pem>` | 完整证书链的路径。 |
| `<PRIVATE_KEY.pem>` | 证书私钥的路径。 |
| `<CA_CERTS.pem>` | CA 证书的路径。 |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像仓库的 URL 和端口。 |
| `<RANCHER_VERSION_TAG>` | 你想要升级到的 [Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)的版本标签。 |

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
特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。


### 选项 C：使用你自己的证书 - 可信 CA 签名的证书



如果你选择使用可信 CA 签名的证书，则在启动原始 Rancher Server 容器的命令中添加 `--volumes-from rancher-data`。此外，你需要能够访问你原始安装时使用的证书。

> **证书要求提示**：证书文件的格式必须是 PEM。在你的证书文件中，包括可信 CA 提供的所有中间证书。你需要对你的证书进行排序，把你的证书放在最前面，后面跟着中间证书。如需查看示例，请参见[证书故障排查]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/troubleshooting)。

| 占位符 | 描述 |
------------|-------------
| `<CERT_DIRECTORY>` | 包含证书文件的目录的路径。 |
| `<FULL_CHAIN.pem>` | 完整证书链的路径。 |
| `<PRIVATE_KEY.pem>` | 证书私钥的路径。 |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像仓库的 URL 和端口。 |
| `<RANCHER_VERSION_TAG>` | 你想要升级到的 [Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)的版本标签。 |

> **注意**：使用 `--no-cacerts` 作为容器的参数，以禁用 Rancher 生成的默认 CA 证书。

```
docker run -d --volumes-from rancher-data \
    --restart=unless-stopped \
     -p 80:80 -p 443:443 \
     --no-cacerts \
     -v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
     -v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
     -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置在 Rancher 中使用的默认私有镜像仓库
     -e CATTLE_SYSTEM_CATALOG=bundled \ # 使用打包的 Rancher System Chart
     --privileged
     <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```
特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。

</TabItem>
</Tabs>

**结果**：你已升级 Rancher。已升级 Server 中的数据将保存在 `rancher-data` 容器中，用于将来的升级。

# 5. 验证升级

登录到 Rancher。通过检查浏览器左下角的版本号，确认升级是否成功。

> **升级后下游集群出现网络问题？**
>
> 请参见[恢复集群网络]({{<baseurl>}}/rancher/v2.0-v2.4/en/installation/install-rancher-on-k8s/upgrades/namespace-migration)。


# 6. 清理旧的 Rancher Server 容器

移除旧的 Rancher Server 容器。如果你仅停止了旧的 Rancher Server 容器，但没有移除它，该容器还可能在服务器下次重启后重新启动。

# 回滚

如果升级没有成功完成，你可以将 Rancher Server 及其数据回滚到上次的健康状态。详情请参见 [Docker 回滚]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/single-node-rollbacks/)。
