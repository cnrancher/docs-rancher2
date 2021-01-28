---
title: 安装指南
description: 此过程将引导您使用 Rancher Kubernetes Engine（RKE）设置 3 节点的集群。该集群的唯一目的是运行 Rancher Server 的 Pod。
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
  - 资料、参考和高级选项
  - RKE Add-on 安装
  - Rancher 高可用 7层LB
  - 安装指南
---

:::important 重要提示
RKE add-on 安装仅支持 Rancher v2.0.8 之前的版本。
请使用 Rancher helm chart 将 Rancher 安装在 Kubernetes 集群上。有关详细信息，请参见[Rancher 高可用安装](/docs/rancher2/installation_new/install-rancher-on-k8s/_index)。
如果您当前正在使用 RKE add-on 安装方法，参见[将 RKE add-on 安装的 Rancher 迁移到 Helm 安装](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/_index)，获取有关如何使用 Helm chart 的详细信息。
:::

此过程将引导您使用 Rancher Kubernetes Engine（RKE）设置 3 节点的集群。该集群的唯一目的是运行 Rancher Server 的 Pod。这个安装基于：

- 可 SSL 终止的 7 层负载均衡器（HTTPS）
- [NGINX Ingress Controller（HTTP）](https://kubernetes.github.io/ingress-nginx/)

在使用 7 层负载均衡器的 HA 设置中，负载均衡器通过 HTTP 协议（即应用程序级别）接受 Rancher 客户端连接。这种应用程序级别的访问，允许负载均衡器读取客户端请求，然后使用优化分配负载的逻辑将其重定向到合适的集群节点。

<sup>下图描绘了在具有可 SSL 终止的 7 层负载均衡器的 Kubernetes 集群上，安装 Rancher Server。</sup>

![Rancher HA](/img/rancher/ha/rancher2ha-l7.svg)

## 1. 配置 Linux 主机

根据我们的[要求](/docs/rancher2/installation_new/requirements/_index)配置三台 Linux 主机。

## 2. 配置负载均衡器

当为 Rancher Server 配置 7 层负载均衡时，Rancher Server 无需重定向来自 80 或 443 端口的通讯。可 SSL 终止的 7 层负载均衡器传递 `X-Forwarded-Proto: https`请求头来禁用此重定向。

在 Rancher 前面使用负载均衡器时，容器无需从 80 端口或 443 端口重定向端口通信。通过传递标头`X-Forwarded-Proto: https`禁用此重定向。这是在外部终止 SSL 时的必要配置。

负载均衡器必须配置为支持以下各项：

- **WebSocket** 连接
- **SPDY** / **HTTP/2** 协议
- 传递/设置以下请求头：

  | HTTP 请求头         | 值                       | 描述                                                                                                                               |
  | :------------------ | :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
  | `Host`              | 可达 Rancher 的 hostname | 接收请求的 Rancher Server。                                                                                                        |
  | `X-Forwarded-Proto` | `https`                  | 标识客户端用来连接到负载均衡器或代理的协议。<br /> <br/> **注意：**如果存在此标头，则`rancher/rancher`不会将 HTTP 重定向到 HTTPS。 |
  | `X-Forwarded-Port`  | 可达 Rancher 的端口      | 标识客户端用来连接到负载均衡器或代理的端口。                                                                                       |
  | `X-Forwarded-For`   | 请求端 IP 地址           | 请求端的原始 IP。                                                                                                                  |

  可以在节点的`/healthz`端点上执行健康检查，这将返回 HTTP 200。

我们为以下负载均衡器提供了示例配置：

- [配置 Amazon ALB](/docs/rancher2/installation_new/resources/advanced/helm2/rke-add-on/layer-7-lb/alb/_index)
- [配置 NGINX](/docs/rancher2/installation_new/resources/advanced/helm2/rke-add-on/layer-7-lb/nginx/_index)

## 3. 配置 DNS

选择您要用来访问 Rancher 的标准域名（FQDN）（例如`rancher.yourdomain.com`）。

1. 登录到 DNS 服务器，创建一个`DNS A记录`指向您的负载均衡器 IP 地址的记录。

2. 验证`DNS A记录`能否正常工作。从任何终端运行以下命令，替换`HOSTNAME.DOMAIN.COM`为您选择的 FQDN：

   `nslookup HOSTNAME.DOMAIN.COM`

   **步骤结果：** 终端显示类似于以下内容的输出：

   ```
   $ nslookup rancher.yourdomain.com
   Server:         YOUR_HOSTNAME_IP_ADDRESS
   Address:        YOUR_HOSTNAME_IP_ADDRESS#53

   Non-authoritative answer:
   Name:   rancher.yourdomain.com
   Address: HOSTNAME.DOMAIN.COM
   ```

## 4. 安装 RKE

RKE（Rancher Kubernetes Engine）是一种快速，通用的 Kubernetes 安装程序，可用于在 Linux 主机上安装 Kubernetes。我们将使用 RKE 设置集群并运行 Rancher。

1. 请遵循[RKE 安装](/docs/rke/installation/_index)说明。

2. 通过运行以下命令，确认 RKE 现在是可执行的：

   ```
   rke --version
   ```

## 5. 下载 RKE 配置文件模板

RKE 使用 YAML 配置文件来安装和配置 Kubernetes 集群。根据要使用的 SSL 证书，有 2 种模板可供选择。

1. 下载以下模板之一，具体取决于您使用的 SSL 证书。

   - [自签名证书模板<br/> `3-node-certificate.yml`](/docs/rancher2/installation_new/resources/advanced/cluster-yml-templates/3-node-certificate/_index)
   - [由公认的 CA 签署的证书模板<br/> `3-node-certificate-recognizedca.yml`](/docs/rancher2/installation_new/resources/advanced/cluster-yml-templates/3-node-certificate-recognizedca/_index)
     > **高级配置选项：**
     >
     > - 想要记录 Rancher API 的所有事务? 通过编辑 RKE 配置文件来启用[API 审计日志](/docs/rancher2/installation_new/resources/advanced/api-audit-log/_index)功能。有关更多信息，请参见如何在[RKE 配置文件中](/docs/rancher2/installation_new/resources/advanced/api-audit-log/_index)中启用它。
     > - 想知道您的 RKE 模板可用的其他配置选项吗？ 请参阅[RKE 文档：配置选项](/docs/rke/config-options/_index)。

2. 将文件重命名为 `rancher-cluster.yml`。

## 6. 配置节点

有了 `rancher-cluster.yml` 配置文件模板后，编辑节点部分以指向您的 Linux 主机。

1.  在您喜欢的文本编辑器中打开 `rancher-cluster.yml` 。

1.  使用您的 Linux 主机信息更新配置模板中的 `nodes` 域。

    对于集群中的每个节点，更新以下占位符：`IP_ADDRESS_X` 和 `USER`。指定的用户应该能够访问 Docket socket，您可以通过使用指定的用户登录并运行来对其进行测试`docker ps`。

    > **注意：**
    >
    > 使用 RHEL / CentOS 时，由于https://bugzilla.redhat.com/show_bug.cgi?id=1527565 导致 SSH 用户无法成为 root 用户。有关 RHEL / CentOS 的特定要求，请参阅[操作系统](/docs/rke/os/_index)要求。

        nodes:
            # The IP address or hostname of the node
        - address: IP_ADDRESS_1
            # User that can login to the node and has access to the Docker socket (i.e. can execute `docker ps` on the node)
            # When using RHEL/CentOS，this can't be root due to https://bugzilla.redhat.com/show_bug.cgi?id=1527565
            user: USER
            role: [controlplane,etcd,worker]
            # Path the SSH key that can be used to access to node with the specified user
            ssh_key_path: ~/.ssh/id_rsa
        - address: IP_ADDRESS_2
            user: USER
            role: [controlplane,etcd,worker]
            ssh_key_path: ~/.ssh/id_rsa
        - address: IP_ADDRESS_3
            user: USER
            role: [controlplane,etcd,worker]
            ssh_key_path: ~/.ssh/id_rsa

1.  **可选：** 默认情况下，`rancher-cluster.yml` 配置为获取数据的备份快照。要禁用这些快照，请将 `backup` 伪指令设置更改为 `false`，如下所示。

        services:
          etcd:
            backup: false

## 7. 配置证书

为了安全起见，使用 Rancher 时需要 SSL（安全套接字层）。SSL 保护所有 Rancher 网络通信的安全，例如在您登录集群或与集群交互时。

从以下选项中选择：

#### 选项 A — 使用您已有的证书：自签名

> **先决条件：**
> 创建一个自签名证书。
>
> - 证书文件必须为 `PEM` 格式。
> - 证书文件必须使用 `Base64` 编码。
> - 在您的证书文件中，包括链中的所有中间证书。顺序为前面为证书，后面跟着其他中间证书。有关示例，请参阅[常见问题/故障排查](/docs/rancher2/installation_new/resources/advanced/helm2/rke-add-on/troubleshooting/_index)。

在有着`name: cattle-keys-ingress` 的 `kind: Secret` 中，用 CA 证书文件（通常称为 `ca.pem` 或 `ca.crt`）的 Base64 编码字符串替换`<BASE64_CA>`。

> **注意：** Base64 编码的字符串应与 `cacerts.pem` 在同一行，在开头，中间或结尾没有换行符。

替换值之后，文件应类似于以下示例（base64 编码的字符串应不同）：

        ---
        apiVersion: v1
        kind: Secret
        metadata:
            name: cattle-keys-server
            namespace: cattle-system
        type: Opaque
        data:
            cacerts.pem: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNvRENDQVlnQ0NRRHVVWjZuMEZWeU16QU5CZ2txaGtpRzl3MEJBUXNGQURBU01SQXdEZ1lEVlFRRERBZDAKWlhOMExXTmhNQjRYRFRFNE1EVXdOakl4TURRd09Wb1hEVEU0TURjd05USXhNRFF3T1Zvd0VqRVFNQTRHQTFVRQpBd3dIZEdWemRDMWpZVENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFNQmpBS3dQCndhRUhwQTdaRW1iWWczaTNYNlppVmtGZFJGckJlTmFYTHFPL2R0RUdmWktqYUF0Wm45R1VsckQxZUlUS3UzVHgKOWlGVlV4Mmo1Z0tyWmpwWitCUnFiZ1BNbk5hS1hocmRTdDRtUUN0VFFZdGRYMVFZS0pUbWF5NU45N3FoNTZtWQprMllKRkpOWVhHWlJabkdMUXJQNk04VHZramF0ZnZOdmJ0WmtkY2orYlY3aWhXanp2d2theHRUVjZlUGxuM2p5CnJUeXBBTDliYnlVcHlad3E2MWQvb0Q4VUtwZ2lZM1dOWmN1YnNvSjhxWlRsTnN6UjVadEFJV0tjSE5ZbE93d2oKaG41RE1tSFpwZ0ZGNW14TU52akxPRUc0S0ZRU3laYlV2QzlZRUhLZTUxbGVxa1lmQmtBZWpPY002TnlWQUh1dApuay9DMHpXcGdENkIwbkVDQXdFQUFUQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFHTCtaNkRzK2R4WTZsU2VBClZHSkMvdzE1bHJ2ZXdia1YxN3hvcmlyNEMxVURJSXB6YXdCdFJRSGdSWXVtblVqOGo4T0hFWUFDUEthR3BTVUsKRDVuVWdzV0pMUUV0TDA2eTh6M3A0MDBrSlZFZW9xZlVnYjQrK1JLRVJrWmowWXR3NEN0WHhwOVMzVkd4NmNOQQozZVlqRnRQd2hoYWVEQmdma1hXQWtISXFDcEsrN3RYem9pRGpXbi8walI2VDcrSGlaNEZjZ1AzYnd3K3NjUDIyCjlDQVZ1ZFg4TWpEQ1hTcll0Y0ZINllBanlCSTJjbDhoSkJqa2E3aERpVC9DaFlEZlFFVFZDM3crQjBDYjF1NWcKdE03Z2NGcUw4OVdhMnp5UzdNdXk5bEthUDBvTXl1Ty82Tm1wNjNsVnRHeEZKSFh4WTN6M0lycGxlbTNZQThpTwpmbmlYZXc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==

#### 选项 B — 使用您已有的证书：由公认的 CA 签发

如果您使用的是由认可的证书颁发机构签署的证书，则无需执行此步骤部分。

## 8. 配置 FQDN

`<FQDN>` RKE 配置文件中有一个引用。将此引用替换为您在配置 DNS 时选择的 FQDN 。

1. 打开 `rancher-cluster.yml`。

2. 在有着 `name: cattle-ingress-http:` 的 `kind: Ingress`中，替换 `<FQDN>` 为在配置 DNS 时选择的 FQDN 。

   **步骤结果：** 替换值后，文件应类似于以下示例（Base64 编码的字符串应不同）：

   ```
   apiVersion: extensions/v1beta1
     kind: Ingress
     metadata:
       namespace: cattle-system
       name: cattle-ingress-http
       annotations:
         nginx.ingress.kubernetes.io/proxy-connect-timeout: "30"
         nginx.ingress.kubernetes.io/proxy-read-timeout: "1800"   # Max time in seconds for ws to remain shell window open
         nginx.ingress.kubernetes.io/proxy-send-timeout: "1800"   # Max time in seconds for ws to remain shell window open
     spec:
       rules:
       - host: rancher.yourdomain.com
         http:
           paths:
           - backend:
               serviceName: cattle-service
               servicePort: 80
   ```

3. 保存文件并关闭它。

## 9. 配置 Rancher 版本

最后一个需要替换的参考是 `<RANCHER_VERSION>`。这需要替换为标记为稳定的 Rancher 版本。最新的 Rancher 稳定版本可以在 [GitHub README](https://github.com/rancher/rancher/blob/master/README.md)中找到。确保版本是实际的版本号，而不是诸如 `stable` 或 `latest`的命名标签。以下示例显示了配置为的版本 `v2.0.6`。

```
      spec:
        serviceAccountName: cattle-admin
        containers:
        - image: rancher/rancher:v2.0.6
          imagePullPolicy: Always
```

## 10. 备份您的 RKE 配置文件

关闭 RKE 配置文件 `rancher-cluster.yml` 后，将其备份到安全位置。升级 Rancher 时，可以再次使用此文件。

## 11. 运行 RKE

完成所有配置后，使用 RKE 启动 Rancher。您可以通过运行 `rke up` 命令并使用 `--config` 参数指向配置文件来完成此操作。

1. 在您的工作站上，确保 `rancher-cluster.yml` 与下载的 `rke` 二进制文件位于同一目录中。

2. 打开一个终端实例。转到包含配置文件和的目录 `rke`。

3. 输入下面的 `rke up` 命令之一。

   ```
   rke up --config rancher-cluster.yml
   ```

   **步骤结果：** 输出应与以下代码段相似：

   ```
   INFO[0000] Building Kubernetes cluster
   INFO[0000] [dialer] Setup tunnel for host [1.1.1.1]
   INFO[0000] [network] Deploying port listener containers
   INFO[0000] [network] Pulling image [alpine:latest] on host [1.1.1.1]
   ...
   INFO[0101] Finished building Kubernetes cluster successfully
   ```

## 12. 备份自动生成的配置文件

在安装过程中，RKE 自动生成一个 `kube_config_rancher-cluster.yml` 与该 `rancher-cluster.yml` 文件位于同一目录中的配置文件。复制此文件并将其备份到安全位置。稍后在升级 Rancher Server 时将使用此文件。

## 后续操作

- **推荐：** 查看[创建备份：高可用性备份和还原](/docs/rancher2/backups/2.0-2.4/ha-backups/_index)，以了解在灾难情况下如何备份 Rancher Server。
- 创建 Kubernetes 集群： [创建集群](/docs/rancher2/cluster-provisioning/_index)。

## 常见问题解答和故障排查

#### 如何知道我的证书是不是 PEM 格式？

您可以通过以下特征识别 PEM 格式：

- 该文件以以下标头开头：`-----BEGIN CERTIFICATE-----`
- 标头后跟一长串字符。
- 该文件以页脚结尾：`-----END CERTIFICATE-----`

##### PEM 证书例子：

```
----BEGIN CERTIFICATE-----
MIIGVDCCBDygAwIBAgIJAMiIrEm29kRLMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNV
... more lines
VWQqljhfacYPgp8KJUJENQ9h5hZ2nSCrI+W00Jcw4QcEdCI8HL5wmg==
-----END CERTIFICATE-----
```

#### 如何通过 Base64 编码我的 PEM 文件？

运行以下命令之一。将`FILENAME`替换为您的证书名称。

```
# MacOS
cat FILENAME | base64
# Linux
cat FILENAME | base64 -w0
# Windows
certutil -encode FILENAME FILENAME.base64
```

#### 如何验证生成的证书的 Base64 字符串？

运行以下命令之一。用之前复制的 Base64 字符串替换 `YOUR_BASE64_STRING`。

```
# MacOS
echo YOUR_BASE64_STRING | base64 -D
# Linux
echo YOUR_BASE64_STRING | base64 -d
# Windows
certutil -decode FILENAME.base64 FILENAME.verify
```

#### 如果我想添加中间证书，证书的顺序是什么？

添加证书的顺序如下：

```
-----BEGIN CERTIFICATE-----
%您的证书%
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
%您的中间证书%
-----END CERTIFICATE-----
```

#### 如何验证我的证书链？

您可以使用 `openssl` 二进制文件来验证证书链。如果命令的输出（请参见下面的命令示例）以`Verify return code: 0 (ok)`，则您的证书链有效。`ca.pem`文件必须与您添加到`rancher/rancher`容器中的文件相同。使用由公认的证书颁发机构签名的证书时，可以省略`-CAfile`参数。

命令：

```
openssl s_client -CAfile ca.pem -connect rancher.yourdomain.com:443
...
    Verify return code: 0 (ok)
```
