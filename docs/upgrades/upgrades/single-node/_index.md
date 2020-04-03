---
title: 升级单节点 Rancher
---

以下说明将指导您升级 Docker 安装的 Rancher Server。

## 先决条件

- 从 Rancher 文档中的 **[已知升级问题](/docs/upgrades/upgrades/_index#已知的升级问题) 和 [警告](/docs/upgrades/upgrades/_index#警告)** 查看升级 Rancher 中最值得注意的问题。可以在[GitHub](https://github.com/rancher/rancher/releases) 和 [Rancher 论坛](https://forums.rancher.com/c/announcements/12)的发行说明中找到每个 Rancher 版本的已知问题的更完整列表。
- **[仅对于离线安装](/docs/installation/other-installation-methods/air-gap/_index)，拉取并上传新的 Rancher Server 版本的镜像**。请按照指南[准备私有仓库](/docs/installation/other-installation-methods/air-gap/populate-private-registry/_index)，来准备您要升级的版本的镜像。

## 占位符

在升级过程中，您将输入一系列命令，按照您的情况替换命令中的占位符。这些占位符用尖括号和大写字母（`<EXAMPLE>`）表示。

这是带有占位符的命令的**示例**：

```
docker stop <RANCHER_CONTAINER_NAME>
```

在此命令中，`<RANCHER_CONTAINER_NAME>` 是您的 Rancher 容器的名称。

请交叉参考下面的图片和参考表，以了解如何获取此占位符数据。在开始升级之前，写下或复制此信息。

<sup>终端 “docker ps” 命令，显示在何处找到 {`<RANCHER_CONTAINER_TAG>`} 和 {`<RANCHER_CONTAINER_NAME>`} </sup>

![占位符参考](/img/rancher/placeholder-ref.png)

| 占位符                     | 例子              | 描述                          |
| -------------------------- | ----------------- | ----------------------------- |
| `<RANCHER_CONTAINER_TAG>`  | `v2.1.3`          | 初始安装拉取的 Rancher 镜像。 |
| `<RANCHER_CONTAINER_NAME>` | `festive_mestorf` | Rancher 容器的名称。          |
| `<RANCHER_VERSION>`        | `v2.1.3`          | 创建备份的 Rancher 的版本。   |
| `<DATE>`                   | `2018-12-19`      | 数据容器或备份的创建日期。    |

您可以通过远程连接登录到 Rancher Server 所在的主机并输入命令以查看正在运行的容器：`docker ps`，从而获得 `<RANCHER_CONTAINER_TAG>` 和 `<RANCHER_CONTAINER_NAME>`的值。您还可以使用其他命令查看停止的容器：`docker ps -a`。在创建备份期间，您可以随时使用这些命令获得帮助。

## 升级大纲

在升级期间，您可以从当前 Rancher 容器中创建数据的副本和备份，确保可以在升级出现问题时回滚。然后，您可以使用现有数据部署新版本的 Rancher。请按照以下步骤升级 Rancher Server：

- [A. 从 Rancher Server 容器中创建数据的副本](#a-从-rancher-server-容器中创建数据的副本)
- [B. 创建备份压缩包](#b-创建一个备份压缩包)
- [C. 拉取新的 Docker 镜像](#c-拉取新的-docker-映像)
- [D. 启动新的 Rancher Server 容器](#d-启动新的-rancher-server-容器)
- [E. 验证升级](#e-验证升级)
- [F. 清理旧的 Rancher Server 容器](#f-清理旧的-rancher-server-容器)

### A. 从 Rancher Server 容器中创建数据的副本

1. 使用远程终端连接，登录运行 Rancher Server 的节点。

1. 停止当前正在运行的 Rancher Server 的容器。将`<RANCHER_CONTAINER_NAME>` 替换为 Rancher 容器的名称。

   ```
   docker stop <RANCHER_CONTAINER_NAME>
   ```

1. 替换下面命令中每个占位符，运行命令，从刚刚停止的 Rancher 容器中创建一个数据容器。

   ```
   docker create --volumes-from <RANCHER_CONTAINER_NAME> --name rancher-data rancher/rancher:<RANCHER_CONTAINER_TAG>
   ```

### B. 创建一个备份压缩包

1. 根据您刚创建的数据容器(`rancher-data`)，创建一个备份压缩包 (`rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`)。

   如果升级期间出现问题，则此备份包将用作回滚点。使用以下命令，替换每个[占位符](#占位符)。

   ```
   docker run --volumes-from rancher-data -v $PWD:/backup busybox tar zcvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz /var/lib/rancher
   ```

   **步骤结果：** 当您输入此命令时，应运行一系列命令。

1. 输入`ls`命令以确认备份压缩包创建成功。它的名称类似于 `rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`。

   ```
   [rancher@ip-10-0-0-50 ~]$ ls
   rancher-data-backup-v2.1.3-20181219.tar.gz
   ```

1. 将备份压缩包移到 Rancher Server 外部的安全位置。

### C. 拉取新的 Docker 映像

拉取要升级到的 Rancher 版本的映像。

| 占位符                  | 描述                                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `<RANCHER_VERSION_TAG>` | 您要升级到的[Rancher 版本](/docs/installation/options/server-tags/_index) 的发行标签。 |

```
docker pull rancher/rancher:<RANCHER_VERSION_TAG>
```

### D. 启动新的 Rancher Server 容器

使用来自`rancher-data`容器的数据启动一个新的 Rancher Server 容器。记住要传入启动原始容器时使用的所有环境变量。

> **重要提示：** _不要_ 在启动升级后停止升级，即使升级过程似乎比预期的要长。停止升级可能会导致将来在升级期间出现数据库迁移错误。

如果使用代理，请参阅 [HTTP 代理配置](/docs/installation/other-installation-methods/single-node-docker/proxy/_index)。

如果您配置了自定义 CA 根证书来访问服务，请参阅[自定义 CA 根证书](/docs/installation/other-installation-methods/single-node-docker/advanced/_index)。

如果您在通过 Rancher API 记录操作事件，请参阅 [API 审计](/docs/installation/other-installation-methods/single-node-docker/advanced/_index)。

要查看启动新的 Rancher Server 容器时要使用的命令，请从以下选项中选择：

- 单节点 Rancher 升级
- 离线安装的单节点 Rancher 升级

#### 单节点 Rancher 升级

选择您安装 Rancher Server 时所用的选项

#### 选项 A - 使用 Rancher 默认的自签名证书

如果选择使用 Rancher 生成的自签名证书，则在启动原始 Rancher Server 容器的命令中添加`--volumes-from rancher-data`。

| 占位符                  | 描述                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `<RANCHER_VERSION_TAG>` | 您要升级到的[Rancher 版本](/docs/installation/options/server-tags/_index)的发行标签。 |

```
docker run -d --volumes-from rancher-data \
  --restart=unless-stopped \
  -p 80:80 -p 443:443 \
	rancher/rancher:<RANCHER_VERSION_TAG>
```

#### 选项 B - 使用自己的自签名证书

如果您选择携带自己的自签名证书，则在启动原始 Rancher Server 容器的命令中添加`--volumes-from rancher-data`，并需要可以访问到原始安装时使用的证书。

> **证书先决条件提示：** 证书文件必须为[PEM 格式](/docs/installation/other-installation-methods/single-node-docker/_index)。在您的证书文件中，包括链中的所有中间证书。您需要对您的证书进行排序，把您的证书放在最签名，后面跟着中间证书。有关示例，请参见[SSL 常见问题解答/故障排除](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

| 占位符                  | 描述                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `<CERT_DIRECTORY>`      | 包含证书文件的目录的路径。                                                            |
| `<FULL_CHAIN.pem>`      | 完整证书链的路径。                                                                    |
| `<PRIVATE_KEY.pem>`     | 证书私钥的路径。                                                                      |
| `<CA_CERTS>`            | 证书颁发机构的证书的路径。                                                            |
| `<RANCHER_VERSION_TAG>` | 您要升级到的[Rancher 版本](/docs/installation/options/server-tags/_index)的发行标签。 |
|                         |

```
docker run -d --volumes-from rancher-data \
  --restart=unless-stopped \
	-p 80:80 -p 443:443 \
	-v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
	-v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
	-v /<CERT_DIRECTORY>/<CA_CERTS.pem>:/etc/rancher/ssl/cacerts.pem \
	rancher/rancher:<RANCHER_VERSION_TAG>
```

#### 选项 C - 使用自己的由可信 CA 签名的证书

如果选择使用由可信 CA 签名的证书，则将 `--volumes-from rancher-data` 添加到启动原始 Rancher Server 容器的命令中，并需要可以访问到原始安装时使用的证书。请记住，要在容器启动命令中包含`--no-cacerts`参数，以禁用 Rancher 生成的默认 CA 证书。

> **证书先决条件提示：** 证书文件必须为[PEM 格式](/docs/installation/other-installation-methods/single-node-docker/_index)。在您的证书文件中，包括可信 CA 提供的所有中间证书。您需要对您的证书进行排序，把您的证书放在最签名，后面跟着中间证书。有关示例，请参见[SSL 常见问题解答/故障排除](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

| 占位符                  | 描述                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `<CERT_DIRECTORY>`      | 包含证书文件的目录的路径。                                                            |
| `<FULL_CHAIN.pem>`      | 完整证书链的路径。                                                                    |
| `<PRIVATE_KEY.pem>`     | 证书私钥的路径。                                                                      |
| `<RANCHER_VERSION_TAG>` | 您要升级到的[Rancher 版本](/docs/installation/options/server-tags/_index)的发行标签。 |
|                         |

```
docker run -d --volumes-from rancher-data \
  --restart=unless-stopped \
	-p 80:80 -p 443:443 \
 	-v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
	-v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
	rancher/rancher:<RANCHER_VERSION_TAG> \
  --no-cacerts
```

#### 选项 D - 使用 Let's Encrypt 证书

> **提示：** Let's Encrypt 对请求新证书有速率限制。因此，请限制创建或销毁容器的频率。有关更多信息，请参阅[ Let’s Encrypt 关于速率限制的文档](https://letsencrypt.org/docs/rate-limits/)。

如果您选择使用[Let's Encrypt](https://letsencrypt.org/)证书，则将`--volumes-from rancher-data`添加到启动原始 Rancher Server 容器的命令中，并且需要提供最初安装 Rancher 时使用的域。

> **证书先决条件提示：**
>
> - 在您的 DNS 中创建一条记录，将您的 Linux 主机 IP 地址绑定到您要用于 Rancher 访问的主机名（例如，`rancher.mydomain.com`）。
> - 在 Linux 主机上打开端口 `TCP/80`。Let's Encrypt 的 http-01 challenge 可以来自任何源 IP 地址，因此端口`TCP/80`必须对所有 IP 地址开放。

| 占位符                  | 描述                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `<RANCHER_VERSION_TAG>` | 您要升级到的[Rancher 版本](/docs/installation/options/server-tags/_index)的发行标签。 |
| `<YOUR.DNS.NAME>`       | 您最初开始使用的域地址                                                                |

```
docker run -d --volumes-from rancher-data \
  --restart=unless-stopped \
	-p 80:80 -p 443:443 \
	rancher/rancher:<RANCHER_VERSION_TAG> \
  --acme-domain <YOUR.DNS.NAME>
```

#### 离线安装的单节点 Rancher 升级

为了安全起见，使用 Rancher 时需要 SSL（安全套接字层）。SSL 保护所有 Rancher 网络通信的安全，例如在您登录集群或与集群交互时。

> 对于从 v2.2.0 到 v2.2.x 的 Rancher 版本，您需要将`system-charts`代码库镜像到网络中 Rancher 可以访问的位置。然后，在安装 Rancher 之后，您将需要配置 Rancher 以使用该代码库。有关详细信息，请参考 [在 v2.3.0 之前为 Rancher 设置 System Charts](/docs/installation/options/local-system-charts/_index)。

启动新的 Rancher Server 容器时，请从以下选项中选择：

#### 选项 A - 使用 Rancher 默认的自签名证书

如果选择使用 Rancher 生成的自签名证书，则在启动原始 Rancher Server 容器的命令中添加`--volumes-from rancher-data`。

| 占位符                           | 描述                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 您的私有仓库 URL 和端口。                                                             |
| `<RANCHER_VERSION_TAG>`          | 您要升级到的[Rancher 版本](/docs/installation/options/server-tags/_index)的发行标签。 |

```
  docker run -d --volumes-from rancher-data \
      --restart=unless-stopped \
      -p 80:80 -p 443:443 \
      -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
      -e CATTLE_SYSTEM_CATALOG=bundled \ #Available as of v2.3.0，use the packaged Rancher system charts
      <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```

#### 选项 B - 使用自己的自签名证书

如果您选择携带自己的自签名证书，则在启动原始 Rancher Server 容器的命令中添加`--volumes-from rancher-data`，并需要可以访问到原始安装时使用的证书。

> **证书先决条件提示：** 证书文件必须为[PEM 格式](/docs/installation/other-installation-methods/single-node-docker/_index)。在您的证书文件中，包括链中的所有中间证书。您需要对您的证书进行排序，把您的证书放在最签名，后面跟着中间证书。有关示例，请参见[SSL 常见问题解答/故障排除](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

| 占位符                           | 描述                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| `<CERT_DIRECTORY>`               | 包含证书文件的目录的路径。                                                            |
| `<FULL_CHAIN.pem>`               | 完整证书链的路径。                                                                    |
| `<PRIVATE_KEY.pem>`              | 证书私钥的路径。                                                                      |
| `<CA_CERTS>`                     | 证书颁发机构的证书的路径。                                                            |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 您的私有仓库 URL 和端口。                                                             |
| `<RANCHER_VERSION_TAG>`          | 您要升级到的[Rancher 版本](/docs/installation/options/server-tags/_index)的发行标签。 |

```
docker run -d --restart=unless-stopped \
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

> **证书先决条件提示：** 证书文件必须为[PEM 格式](/docs/installation/other-installation-methods/single-node-docker/_index)。在您的证书文件中，包括可信 CA 提供的所有中间证书。您需要对您的证书进行排序，把您的证书放在最签名，后面跟着中间证书。有关示例，请参见[SSL 常见问题解答/故障排除](/docs/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

| 占位符                           | 描述                                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| `<CERT_DIRECTORY>`               | 包含证书文件的目录的路径。                                                             |
| `<FULL_CHAIN.pem>`               | 完整证书链的路径。                                                                     |
| `<PRIVATE_KEY.pem>`              | 证书私钥的路径。                                                                       |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 您的私有仓库 URL 和端口。                                                              |
| `<RANCHER_VERSION_TAG>`          | 您要升级到的[Rancher 版本](/docs/installation/options/server-tags/_index) 的发行标签。 |

> **注意：** 使用`--no-cacerts`作为容器的参数来禁用 Rancher 生成的默认 CA 证书。

```
docker run -d --volumes-from rancher-data \
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

### E. 验证升级

登录到 Rancher。通过检查浏览器窗口左下角显示的版本，确认升级成功.

> **升级后您的用户集群中有网络问题吗？**
>
> 如果您是从 v2.0.6 或更旧的版本升级上来的，请参阅[还原集群网络](/docs/upgrades/upgrades/namespace-migration/_index)。

### F. 清理旧的 Rancher Server 容器

删除以前的 Rancher Server 容器。如果仅停止上一个 Rancher Server 容器（并且不删除它），则该容器可能会在下一个服务器重启后重新启动。

### 回滚

如果升级未成功完成，则可以将 Rancher Server 及其数据回滚到最后的正常状态。有关更多信息，请参阅[单节点回滚](/docs/upgrades/rollbacks/single-node-rollbacks/_index)。
