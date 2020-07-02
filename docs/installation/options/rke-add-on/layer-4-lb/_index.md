---
title: 安装指南
description: 此过程将引导您使用 Rancher Kubernetes Engine（RKE）设置 3 节点集群。该集群的唯一目的是为 Rancher 运行 Pod。
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
  - Rancher 高可用 4层LB
  - 安装指南
---

:::important 重要提示
RKE add-on 安装仅支持 Rancher v2.0.8 之前的版本。
请使用 Rancher helm chart 将 Rancher 安装在 Kubernetes 集群上。有关详细信息，请参见[Rancher 高可用安装](/docs/installation/k8s-install/_index)。
如果您当前正在使用 RKE add-on 安装方法，参见[将 RKE add-on 安装的 Rancher 迁移到 Helm 安装](/docs/upgrades/upgrades/migrating-from-rke-add-on/_index)，获取有关如何使用 Helm chart 的详细信息。
:::

此过程将引导您使用 Rancher Kubernetes Engine（RKE）设置 3 节点集群。该集群的唯一目的是为 Rancher 运行 Pod。设置基于：

- 四层负载均衡器(TCP)
- [具有 SSL termination(HTTPS)的 NGINX ingress 控制器](https://kubernetes.github.io/ingress-nginx/)

在使用四层负载均衡器的 HA 设置中，负载均衡器通过 TCP/UDP 协议接受 Rancher 客户端连接，然后，负载均衡器将这些连接转发到各个集群节点，而不读取请求本身。由于负载均衡器无法读取其转发的数据包，因此它所能做出的路由决策是有限的。

<sup>Rancher 安装在具有四层负载均衡器的 Kubernetes 集群上，描述了在 ingress 控制器上的 SSL termination。</sup>

![Rancher HA](/img/rancher/ha/rancher2ha.svg)

## 1. 提供 Linux 主机

按照[要求](/docs/installation/requirements/_index)配置三台 Linux 主机。

## 2. 配置负载均衡器

我们将使用 NGINX 作为我们的四层负载均衡器(TCP)，NGINX 将所有连接转发到您的 Rancher 节点之一。如果要使用 Amazon NLB，则可以跳过此步骤并使用[Amazon NLB 配置](/docs/installation/options/rke-add-on/layer-4-lb/nlb/_index)。

> **注意：**
> 在此配置中，负载均衡器位于 Linux 主机的前面，负载均衡器可以是任何可用的能够运行 NGINX 的主机。
>
> 一个警告：不要将 Rancher 节点之一用作负载均衡器。

### 2.1 安装 NGINX

首先在负载均衡器主机上安装 NGINX，NGINX 为所有已知的操作系统提供了可用的安装包。有关安装 NGINX 的帮助，请参阅[安装文档](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)。

在使用官方 NGINX 软件包时，`stream`模块是必需的。请参考您的操作系统文档，了解如何在操作系统上安装和启用 NGINX `stream`模块。

### 2.2 创建 NGINX 配置

安装 NGINX 后，您需要使用节点的 IP 地址更新 NGINX 配置文件`nginx.conf`。

1. 将下面的代码示例复制并粘贴到您喜欢的文本编辑器中，另存为`nginx.conf`。

2. 将`nginx.conf`中的`IP_NODE_1`，`IP_NODE_2`和`IP_NODE_3`替换为您的 Linux 主机 IP 地址。

   > **注意：** 此 Nginx 配置仅是示例，可能不适合您的环境。有关完整的文档，请参阅[NGINX 负载均衡-TCP 和 UDP 负载均衡器](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)。

   **NGINX 配置示例：**

   ```
   worker_processes 4;
   worker_rlimit_nofile 40000;

   events {
       worker_connections 8192;
   }

   http {
       server {
           listen         80;
           return 301 https://$host$request_uri;
       }
   }

   stream {
       upstream rancher_servers {
           least_conn;
           server IP_NODE_1:443 max_fails=3 fail_timeout=5s;
           server IP_NODE_2:443 max_fails=3 fail_timeout=5s;
           server IP_NODE_3:443 max_fails=3 fail_timeout=5s;
       }
       server {
           listen     443;
           proxy_pass rancher_servers;
       }
   }
   ```

3. 保存`nginx.conf`到负载均衡器的以下路径：`/etc/nginx/nginx.conf`。

4. 通过运行以下命令更新加载您的 NGINX 配置：

   ```
   # nginx -s reload
   ```

### 2.3 可选 - 将 NGINX 作为 Docker 容器运行

与其将 NGINX 作为包安装在操作系统上，不如将其作为 Docker 容器运行。将已编辑的**NGINX 配置示例**保存为`/etc/nginx.conf`，并运行以下命令以启动 NGINX 容器：

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /etc/nginx.conf:/etc/nginx/nginx.conf \
  nginx:1.14
```

## 3. 配置 DNS

选择要用于访问 Rancher 的完全限定域名(FQDN)(例如，`rancher.yourdomain.com`)。<br/><br/>

1. 登录到 DNS 服务器，创建一个指向您的[负载均衡器]的 IP 地址的`DNS A`记录(#2-configure-load-balancer)。

2. 验证`DNS A`是否正常工作，在任何终端上运行以下命令，替换`HOSTNAME.DOMAIN.COM`为您选择的 FQDN：

   `nslookup HOSTNAME.DOMAIN.COM`

   **步骤结果：** 终端显示输出如下图所示：

   ```
   $ nslookup rancher.yourdomain.com
   Server:         YOUR_HOSTNAME_IP_ADDRESS
   Address:        YOUR_HOSTNAME_IP_ADDRESS#53

   Non-authoritative answer:
   Name:   rancher.yourdomain.com
   Address: HOSTNAME.DOMAIN.COM
   ```

<br/>

## 4. 安装 RKE

RKE(Rancher Kubernetes 引擎)是一个快速、通用的 Kubernetes 安装程序，您可以使用它在您的 Linux 主机上安装 Kubernetes。我们将使用 RKE 来设置集群并运行 Rancher。

1. 请遵循[RKE 安装](https://rancher.com/docs/rke/latest/en/installation)说明。

2. 通过运行以下命令，确认 RKE 现在是可执行的：

   ```
   rke --version
   ```

## 5. 下载 RKE 配置文件模板

RKE 使用`.yml`配置文件来安装和配置 Kubernetes 集群。根据要使用的 SSL 证书，有两种模板可供选择。

1. 根据您正在使用的 SSL 证书，下载以下模板之一。

   - [自签名证书模板<br/> `3-node-certificate.yml`](/docs/installation/options/cluster-yml-templates/3-node-certificate/_index)
   - [由公认的 CA 签署的证书模板<br/> `3-node-certificate-recognizedca.yml`](/docs/installation/options/cluster-yml-templates/3-node-certificate-recognizedca/_index)

   > **高级配置选项：**
   >
   > - 想要 Rancher API 的所有事务记录？通过编辑 RKE 配置文件来启用[API 审核](/docs/installation/options/api-audit-log/_index)功能。有关更多信息，请参见如何在[RKE 配置文件](/docs/installation/options/rke-add-on/api-auditing/_index)中启用它。
   > - 想知道您的 RKE 模板可用的其他配置选项吗？请参阅[RKE 文档：配置选项](https://rancher.com/docs/rke/latest/en/config-options/)。

2. 将文件重命名为`rancher-cluster.yml`。

## 6. 配置节点

有了`rancher-cluster.yml`配置文件模板后，编辑节点部分以指向您的 Linux 主机。

1.  在您喜欢的文本编辑器中打开`rancher-cluster.yml`。

1.  使用 Linux 主机信息更新`nodes`部分

    对于集群中的每个节点，更新以下占位符：`IP_ADDRESS_X`和`USER`。指定的用户应该能够访问 Docket 套接字，您可以使用指定的用户登录并运行`docker ps`来测试这一点。

    > **注意：**
    > 使用 RHEL/CentOS 时，由于 https://bugzilla.redhat.com/show_bug.cgi?id=1527565 导致 SSH 用户无法成为 root 用户。有关 RHEL/CentOS 的特定需求，请参阅[操作系统要求](https://rancher.com/docs/rke/latest/en/installation/os#redhat-enterprise-linux-rhel-centos)。

        nodes:
            # The IP address or hostname of the node
        - address: IP_ADDRESS_1
            # User that can login to the node and has access to the Docker socket (i.e. can execute `docker ps` on the node)
            # When using RHEL/CentOS, this can't be root due to https://bugzilla.redhat.com/show_bug.cgi?id=1527565
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

1.  **可选：** 默认情况下,`rancher-cluster.yml`被配置为备份您的数据快照，要禁用这些快照，请将`backup`指令设置更改为`false`，如下所示。

        services:
          etcd:
            backup: false

## 7. 配置证书

为了安全起见，使用 Rancher 时需要 SSL(Secure Sockets Layer)。SSL 保护所有 Rancher 网络通信的安全，例如在您登录集群或与集群交互时。

从以下选项中选择：

### 7.1 — 使用您已有的证书：自签名

> **先决条件：**
> 创建一个自签名证书
>
> - 证书文件必须为`PEM 格式`。
> - 证书文件必须使用`base64`编码。
> - 在您的证书文件中，包括链接中的所有中间证书。请先使用证书订购证书，然后再订购中间体。有关示例，请参见`中间证书`。

1. 在`kind: Secret`中`name: cattle-keys-ingress`：

   - 替换`<BASE64_CRT>`为证书文件的 base64 编码字符串(通常称为`cert.pem`或`domain.crt`)
   - 替换`<BASE64_KEY>`为证书密钥文件的 base64 编码字符串(通常称为`key.pem`或`domain.key`)

   > **注意：** `tls.crt`或`tls.key`的 base64 编码的字符串应该在同一行，在开头、中间或结尾没有任何换行。

   **步骤结果：** 在替换了这些值之后，文件应该如下面的示例所示(base64 编码的字符串应该不同)：

   ```yaml
   ---
   apiVersion: v1
   kind: Secret
   metadata:
     name: cattle-keys-ingress
     namespace: cattle-system
   type: Opaque
   data:
     tls.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM1RENDQWN5Z0F3SUJBZ0lKQUlHc25NeG1LeGxLTUEwR0NTcUdTSWIzRFFFQkN3VUFNQkl4RURBT0JnTlYKQkFNTUIzUmxjM1F0WTJFd0hoY05NVGd3TlRBMk1qRXdOREE1V2hjTk1UZ3dOekExTWpFd05EQTVXakFXTVJRdwpFZ1lEVlFRRERBdG9ZUzV5Ym1Ob2NpNXViRENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DCmdnRUJBTFJlMXdzekZSb2Rib2pZV05DSHA3UkdJaUVIMENDZ1F2MmdMRXNkUUNKZlcrUFEvVjM0NnQ3bSs3TFEKZXJaV3ZZMWpuY2VuWU5JSGRBU0VnU0ducWExYnhUSU9FaE0zQXpib3B0WDhjSW1OSGZoQlZETGdiTEYzUk0xaQpPM1JLTGdIS2tYSTMxZndjbU9zWGUwaElYQnpUbmxnM20vUzlXL3NTc0l1dDVwNENDUWV3TWlpWFhuUElKb21lCmpkS3VjSHFnMTlzd0YvcGVUalZrcVpuMkJHazZRaWFpMU41bldRV0pjcThTenZxTTViZElDaWlwYU9hWWQ3RFEKYWRTejV5dlF0YkxQNW4wTXpnOU43S3pGcEpvUys5QWdkWDI5cmZqV2JSekp3RzM5R3dRemN6VWtLcnZEb05JaQo0UFJHc01yclFNVXFSYjRSajNQOEJodEMxWXNDQXdFQUFhTTVNRGN3Q1FZRFZSMFRCQUl3QURBTEJnTlZIUThFCkJBTUNCZUF3SFFZRFZSMGxCQll3RkFZSUt3WUJCUVVIQXdJR0NDc0dBUVVGQndNQk1BMEdDU3FHU0liM0RRRUIKQ3dVQUE0SUJBUUNKZm5PWlFLWkowTFliOGNWUW5Vdi9NZkRZVEJIQ0pZcGM4MmgzUGlXWElMQk1jWDhQRC93MgpoOUExNkE4NGNxODJuQXEvaFZYYy9JNG9yaFY5WW9jSEg5UlcvbGthTUQ2VEJVR0Q1U1k4S292MHpHQ1ROaDZ6Ci9wZTNqTC9uU0pYSjRtQm51czJheHFtWnIvM3hhaWpYZG9kMmd3eGVhTklvRjNLbHB2aGU3ZjRBNmpsQTM0MmkKVVlCZ09iN1F5KytRZWd4U1diSmdoSzg1MmUvUUhnU2FVSkN6NW1sNGc1WndnNnBTUXhySUhCNkcvREc4dElSYwprZDMxSk1qY25Fb1Rhc1Jyc1NwVmNGdXZyQXlXN2liakZyYzhienBNcE1obDVwYUZRcEZzMnIwaXpZekhwakFsCk5ZR2I2OHJHcjBwQkp3YU5DS2ErbCtLRTk4M3A3NDYwCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
     tls.key: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBdEY3WEN6TVZHaDF1aU5oWTBJZW50RVlpSVFmUUlLQkMvYUFzU3gxQUlsOWI0OUQ5ClhmanEzdWI3c3RCNnRsYTlqV09keDZkZzBnZDBCSVNCSWFlcHJWdkZNZzRTRXpjRE51aW0xZnh3aVkwZCtFRlUKTXVCc3NYZEV6V0k3ZEVvdUFjcVJjamZWL0J5WTZ4ZDdTRWhjSE5PZVdEZWI5TDFiK3hLd2k2M21uZ0lKQjdBeQpLSmRlYzhnbWlaNk4wcTV3ZXFEWDJ6QVgrbDVPTldTcG1mWUVhVHBDSnFMVTNtZFpCWWx5cnhMTytvemx0MGdLCktLbG81cGgzc05CcDFMUG5LOUMxc3MvbWZRek9EMDNzck1Xa21oTDcwQ0IxZmIydCtOWnRITW5BYmYwYkJETnoKTlNRcXU4T2cwaUxnOUVhd3l1dEF4U3BGdmhHUGMvd0dHMExWaXdJREFRQUJBb0lCQUJKYUErOHp4MVhjNEw0egpwUFd5bDdHVDRTMFRLbTNuWUdtRnZudjJBZXg5WDFBU2wzVFVPckZyTnZpK2xYMnYzYUZoSFZDUEN4N1RlMDVxClhPa2JzZnZkZG5iZFQ2RjgyMnJleVByRXNINk9TUnBWSzBmeDVaMDQwVnRFUDJCWm04eTYyNG1QZk1vbDdya2MKcm9Kd09rOEVpUHZZekpsZUd0bTAwUm1sRysyL2c0aWJsOTVmQXpyc1MvcGUyS3ZoN2NBVEtIcVh6MjlpUmZpbApiTGhBamQwcEVSMjNYU0hHR1ZqRmF3amNJK1c2L2RtbDZURDhrSzFGaUtldmJKTlREeVNXQnpPbXRTYUp1K01JCm9iUnVWWG4yZVNoamVGM1BYcHZRMWRhNXdBa0dJQWxOWjRHTG5QU2ZwVmJyU0plU3RrTGNzdEJheVlJS3BWZVgKSVVTTHM0RUNnWUVBMmNnZUE2WHh0TXdFNU5QWlNWdGhzbXRiYi9YYmtsSTdrWHlsdk5zZjFPdXRYVzkybVJneQpHcEhUQ0VubDB0Z1p3T081T1FLNjdFT3JUdDBRWStxMDJzZndwcmgwNFZEVGZhcW5QNTBxa3BmZEJLQWpmanEyCjFoZDZMd2hLeDRxSm9aelp2VkowV0lvR1ZLcjhJSjJOWGRTUVlUanZUZHhGczRTamdqNFFiaEVDZ1lFQTFBWUUKSEo3eVlza2EvS2V2OVVYbmVrSTRvMm5aYjJ1UVZXazRXSHlaY2NRN3VMQVhGY3lJcW5SZnoxczVzN3RMTzJCagozTFZNUVBzazFNY25oTTl4WE4vQ3ZDTys5b2t0RnNaMGJqWFh6NEJ5V2lFNHJPS1lhVEFwcDVsWlpUT3ZVMWNyCm05R3NwMWJoVDVZb2RaZ3IwUHQyYzR4U2krUVlEWnNFb2lFdzNkc0NnWUVBcVJLYWNweWZKSXlMZEJjZ0JycGkKQTRFalVLMWZsSjR3enNjbGFKUDVoM1NjZUFCejQzRU1YT0kvSXAwMFJsY3N6em83N3cyMmpud09mOEJSM0RBMwp6ZTRSWDIydWw4b0hGdldvdUZOTTNOZjNaNExuYXpVc0F0UGhNS2hRWGMrcEFBWGthUDJkZzZ0TU5PazFxaUNHCndvU212a1BVVE84b1ViRTB1NFZ4ZmZFQ2dZQUpPdDNROVNadUlIMFpSSitIV095enlOQTRaUEkvUkhwN0RXS1QKajVFS2Y5VnR1OVMxY1RyOTJLVVhITXlOUTNrSjg2OUZPMnMvWk85OGg5THptQ2hDTjhkOWN6enI5SnJPNUFMTApqWEtBcVFIUlpLTFgrK0ZRcXZVVlE3cTlpaHQyMEZPb3E5OE5SZDMzSGYxUzZUWDNHZ3RWQ21YSml6dDAxQ3ZHCmR4VnVnd0tCZ0M2Mlp0b0RLb3JyT2hvdTBPelprK2YwQS9rNDJBOENiL29VMGpwSzZtdmxEWmNYdUF1QVZTVXIKNXJCZjRVYmdVYndqa1ZWSFR6LzdDb1BWSjUvVUxJWk1Db1RUNFprNTZXWDk4ZE93Q3VTVFpZYnlBbDZNS1BBZApTZEpuVVIraEpnSVFDVGJ4K1dzYnh2d0FkbWErWUhtaVlPRzZhSklXMXdSd1VGOURLUEhHCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==
   ```

2. 在`kind: Secret`中`name: cattle-keys-server`，替换`<BASE64_CA>`为 CA 证书文件的 base64 编码的字符串(通常称为`ca.pem`或`ca.crt`)。

   > **注意：** `cacerts.pem`的 base64 编码的字符串应该在同一行，在开头、中间或结尾没有任何换行。

   **步骤结果：** 文件应该如下面的示例所示(base64 编码的字符串应该不同)：

   ```yaml
   ---
   apiVersion: v1
   kind: Secret
   metadata:
     name: cattle-keys-server
     namespace: cattle-system
   type: Opaque
   data:
     cacerts.pem: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNvRENDQVlnQ0NRRHVVWjZuMEZWeU16QU5CZ2txaGtpRzl3MEJBUXNGQURBU01SQXdEZ1lEVlFRRERBZDAKWlhOMExXTmhNQjRYRFRFNE1EVXdOakl4TURRd09Wb1hEVEU0TURjd05USXhNRFF3T1Zvd0VqRVFNQTRHQTFVRQpBd3dIZEdWemRDMWpZVENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFNQmpBS3dQCndhRUhwQTdaRW1iWWczaTNYNlppVmtGZFJGckJlTmFYTHFPL2R0RUdmWktqYUF0Wm45R1VsckQxZUlUS3UzVHgKOWlGVlV4Mmo1Z0tyWmpwWitCUnFiZ1BNbk5hS1hocmRTdDRtUUN0VFFZdGRYMVFZS0pUbWF5NU45N3FoNTZtWQprMllKRkpOWVhHWlJabkdMUXJQNk04VHZramF0ZnZOdmJ0WmtkY2orYlY3aWhXanp2d2theHRUVjZlUGxuM2p5CnJUeXBBTDliYnlVcHlad3E2MWQvb0Q4VUtwZ2lZM1dOWmN1YnNvSjhxWlRsTnN6UjVadEFJV0tjSE5ZbE93d2oKaG41RE1tSFpwZ0ZGNW14TU52akxPRUc0S0ZRU3laYlV2QzlZRUhLZTUxbGVxa1lmQmtBZWpPY002TnlWQUh1dApuay9DMHpXcGdENkIwbkVDQXdFQUFUQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFHTCtaNkRzK2R4WTZsU2VBClZHSkMvdzE1bHJ2ZXdia1YxN3hvcmlyNEMxVURJSXB6YXdCdFJRSGdSWXVtblVqOGo4T0hFWUFDUEthR3BTVUsKRDVuVWdzV0pMUUV0TDA2eTh6M3A0MDBrSlZFZW9xZlVnYjQrK1JLRVJrWmowWXR3NEN0WHhwOVMzVkd4NmNOQQozZVlqRnRQd2hoYWVEQmdma1hXQWtISXFDcEsrN3RYem9pRGpXbi8walI2VDcrSGlaNEZjZ1AzYnd3K3NjUDIyCjlDQVZ1ZFg4TWpEQ1hTcll0Y0ZINllBanlCSTJjbDhoSkJqa2E3aERpVC9DaFlEZlFFVFZDM3crQjBDYjF1NWcKdE03Z2NGcUw4OVdhMnp5UzdNdXk5bEthUDBvTXl1Ty82Tm1wNjNsVnRHeEZKSFh4WTN6M0lycGxlbTNZQThpTwpmbmlYZXc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
   ```

### 7.2 — 使用您已有的证书：由公认的 CA 签发

> **注意：**
> 如果您使用的是自签名证书，[单击此处](#选项-a--使用您已有的证书：自签名)继续。

如果您使用的是由公认的证书颁发机构签名的证书，您需要为证书文件和证书密钥文件生成 base64 编码的字符串。确保您的证书文件包括链接中的所有`中间证书`，在这种情况下，证书的顺序首先是您已有的证书，然后是中间证书。请参阅您的 CSP(Certificate Service Provider)文档，了解需要包括哪些中间证书。

在`kind: Secret`中`name: cattle-keys-ingress`：

- 替换`<BASE64_CRT>`为证书文件的 base64 编码字符串(通常称为`cert.pem`或`domain.crt`)
- 替换`<BASE64_KEY>`为证书密钥文件的 base64 编码字符串(通常称为`key.pem`或`domain.key`)

在替换了这些值之后，文件应该如下面的示例所示(base64 编码的字符串应该不同)：

> **注意：** `tls.crt`或`tls.key`的 base64 编码的字符串应该在同一行，在开头、中间或结尾没有任何换行。

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: cattle-keys-ingress
  namespace: cattle-system
type: Opaque
data:
  tls.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM1RENDQWN5Z0F3SUJBZ0lKQUlHc25NeG1LeGxLTUEwR0NTcUdTSWIzRFFFQkN3VUFNQkl4RURBT0JnTlYKQkFNTUIzUmxjM1F0WTJFd0hoY05NVGd3TlRBMk1qRXdOREE1V2hjTk1UZ3dOekExTWpFd05EQTVXakFXTVJRdwpFZ1lEVlFRRERBdG9ZUzV5Ym1Ob2NpNXViRENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DCmdnRUJBTFJlMXdzekZSb2Rib2pZV05DSHA3UkdJaUVIMENDZ1F2MmdMRXNkUUNKZlcrUFEvVjM0NnQ3bSs3TFEKZXJaV3ZZMWpuY2VuWU5JSGRBU0VnU0ducWExYnhUSU9FaE0zQXpib3B0WDhjSW1OSGZoQlZETGdiTEYzUk0xaQpPM1JLTGdIS2tYSTMxZndjbU9zWGUwaElYQnpUbmxnM20vUzlXL3NTc0l1dDVwNENDUWV3TWlpWFhuUElKb21lCmpkS3VjSHFnMTlzd0YvcGVUalZrcVpuMkJHazZRaWFpMU41bldRV0pjcThTenZxTTViZElDaWlwYU9hWWQ3RFEKYWRTejV5dlF0YkxQNW4wTXpnOU43S3pGcEpvUys5QWdkWDI5cmZqV2JSekp3RzM5R3dRemN6VWtLcnZEb05JaQo0UFJHc01yclFNVXFSYjRSajNQOEJodEMxWXNDQXdFQUFhTTVNRGN3Q1FZRFZSMFRCQUl3QURBTEJnTlZIUThFCkJBTUNCZUF3SFFZRFZSMGxCQll3RkFZSUt3WUJCUVVIQXdJR0NDc0dBUVVGQndNQk1BMEdDU3FHU0liM0RRRUIKQ3dVQUE0SUJBUUNKZm5PWlFLWkowTFliOGNWUW5Vdi9NZkRZVEJIQ0pZcGM4MmgzUGlXWElMQk1jWDhQRC93MgpoOUExNkE4NGNxODJuQXEvaFZYYy9JNG9yaFY5WW9jSEg5UlcvbGthTUQ2VEJVR0Q1U1k4S292MHpHQ1ROaDZ6Ci9wZTNqTC9uU0pYSjRtQm51czJheHFtWnIvM3hhaWpYZG9kMmd3eGVhTklvRjNLbHB2aGU3ZjRBNmpsQTM0MmkKVVlCZ09iN1F5KytRZWd4U1diSmdoSzg1MmUvUUhnU2FVSkN6NW1sNGc1WndnNnBTUXhySUhCNkcvREc4dElSYwprZDMxSk1qY25Fb1Rhc1Jyc1NwVmNGdXZyQXlXN2liakZyYzhienBNcE1obDVwYUZRcEZzMnIwaXpZekhwakFsCk5ZR2I2OHJHcjBwQkp3YU5DS2ErbCtLRTk4M3A3NDYwCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
  tls.key: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBdEY3WEN6TVZHaDF1aU5oWTBJZW50RVlpSVFmUUlLQkMvYUFzU3gxQUlsOWI0OUQ5ClhmanEzdWI3c3RCNnRsYTlqV09keDZkZzBnZDBCSVNCSWFlcHJWdkZNZzRTRXpjRE51aW0xZnh3aVkwZCtFRlUKTXVCc3NYZEV6V0k3ZEVvdUFjcVJjamZWL0J5WTZ4ZDdTRWhjSE5PZVdEZWI5TDFiK3hLd2k2M21uZ0lKQjdBeQpLSmRlYzhnbWlaNk4wcTV3ZXFEWDJ6QVgrbDVPTldTcG1mWUVhVHBDSnFMVTNtZFpCWWx5cnhMTytvemx0MGdLCktLbG81cGgzc05CcDFMUG5LOUMxc3MvbWZRek9EMDNzck1Xa21oTDcwQ0IxZmIydCtOWnRITW5BYmYwYkJETnoKTlNRcXU4T2cwaUxnOUVhd3l1dEF4U3BGdmhHUGMvd0dHMExWaXdJREFRQUJBb0lCQUJKYUErOHp4MVhjNEw0egpwUFd5bDdHVDRTMFRLbTNuWUdtRnZudjJBZXg5WDFBU2wzVFVPckZyTnZpK2xYMnYzYUZoSFZDUEN4N1RlMDVxClhPa2JzZnZkZG5iZFQ2RjgyMnJleVByRXNINk9TUnBWSzBmeDVaMDQwVnRFUDJCWm04eTYyNG1QZk1vbDdya2MKcm9Kd09rOEVpUHZZekpsZUd0bTAwUm1sRysyL2c0aWJsOTVmQXpyc1MvcGUyS3ZoN2NBVEtIcVh6MjlpUmZpbApiTGhBamQwcEVSMjNYU0hHR1ZqRmF3amNJK1c2L2RtbDZURDhrSzFGaUtldmJKTlREeVNXQnpPbXRTYUp1K01JCm9iUnVWWG4yZVNoamVGM1BYcHZRMWRhNXdBa0dJQWxOWjRHTG5QU2ZwVmJyU0plU3RrTGNzdEJheVlJS3BWZVgKSVVTTHM0RUNnWUVBMmNnZUE2WHh0TXdFNU5QWlNWdGhzbXRiYi9YYmtsSTdrWHlsdk5zZjFPdXRYVzkybVJneQpHcEhUQ0VubDB0Z1p3T081T1FLNjdFT3JUdDBRWStxMDJzZndwcmgwNFZEVGZhcW5QNTBxa3BmZEJLQWpmanEyCjFoZDZMd2hLeDRxSm9aelp2VkowV0lvR1ZLcjhJSjJOWGRTUVlUanZUZHhGczRTamdqNFFiaEVDZ1lFQTFBWUUKSEo3eVlza2EvS2V2OVVYbmVrSTRvMm5aYjJ1UVZXazRXSHlaY2NRN3VMQVhGY3lJcW5SZnoxczVzN3RMTzJCagozTFZNUVBzazFNY25oTTl4WE4vQ3ZDTys5b2t0RnNaMGJqWFh6NEJ5V2lFNHJPS1lhVEFwcDVsWlpUT3ZVMWNyCm05R3NwMWJoVDVZb2RaZ3IwUHQyYzR4U2krUVlEWnNFb2lFdzNkc0NnWUVBcVJLYWNweWZKSXlMZEJjZ0JycGkKQTRFalVLMWZsSjR3enNjbGFKUDVoM1NjZUFCejQzRU1YT0kvSXAwMFJsY3N6em83N3cyMmpud09mOEJSM0RBMwp6ZTRSWDIydWw4b0hGdldvdUZOTTNOZjNaNExuYXpVc0F0UGhNS2hRWGMrcEFBWGthUDJkZzZ0TU5PazFxaUNHCndvU212a1BVVE84b1ViRTB1NFZ4ZmZFQ2dZQUpPdDNROVNadUlIMFpSSitIV095enlOQTRaUEkvUkhwN0RXS1QKajVFS2Y5VnR1OVMxY1RyOTJLVVhITXlOUTNrSjg2OUZPMnMvWk85OGg5THptQ2hDTjhkOWN6enI5SnJPNUFMTApqWEtBcVFIUlpLTFgrK0ZRcXZVVlE3cTlpaHQyMEZPb3E5OE5SZDMzSGYxUzZUWDNHZ3RWQ21YSml6dDAxQ3ZHCmR4VnVnd0tCZ0M2Mlp0b0RLb3JyT2hvdTBPelprK2YwQS9rNDJBOENiL29VMGpwSzZtdmxEWmNYdUF1QVZTVXIKNXJCZjRVYmdVYndqa1ZWSFR6LzdDb1BWSjUvVUxJWk1Db1RUNFprNTZXWDk4ZE93Q3VTVFpZYnlBbDZNS1BBZApTZEpuVVIraEpnSVFDVGJ4K1dzYnh2d0FkbWErWUhtaVlPRzZhSklXMXdSd1VGOURLUEhHCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==
```

## 8. 配置 FQDN

`<FQDN>`在配置文件中有两处引用(一个在这个步骤中，一个在下一个步骤中)。两者都需要替换为配置 DNS 中选择的 FQDN。

在`kind: Ingress`中`name: cattle-ingress-http`：

- 替换`<FQDN>`为配置 DNS 中选择的 FQDN。

将`<FQDN>`替换为配置 DNS 中选择的 FQDN 后，该文件应类似于以下示例(本例中使用的 FQDN 是`rancher.yourdomain.com`)：

```yaml
 ---
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
    tls:
    - secretName: cattle-keys-ingress
      hosts:
      - rancher.yourdomain.com
```

保存`.yml`文件并关闭它。

## 9. 配置 Rancher 版本

最后一个需要替换的引用是`<RANCHER_VERSION>`，这需要替换为标记为稳定的 Rancher 版本。最新的 Rancher 稳定版本可以在[GitHub README](https://github.com/rancher/rancher/blob/master/README.md)中找到。确保版本是实际的版本号，而不是带有`stable`或`latest`这样的命名标签。下面的示例显示了配置为`v2.0.6`的版本。

```
spec:
  serviceAccountName: cattle-admin
  containers:
  - image: rancher/rancher:v2.0.6
    imagePullPolicy: Always
```

## 10. 备份 RKE 配置文件

关闭`.yml`文件后，将其备份到安全位置。升级 Rancher 时，可以再次使用此文件。

## 11. 运行 RKE

完成所有配置后，使用 RKE 启动 Rancher。您可以通过运行`rke up`命令并使用`--config`参数指向您的配置文件来完成此操作。

1. 在您的工作站中，确保`rancher-cluster.yml`和下载的`rke`二进制文件位于同一目录中。

2. 打开一个终端实例，切换到包含您的配置文件和`rke`的目录。

3. 请输入下面的`rke up`命令。

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

在安装过程中，RKE 会自动生成一个与 RKE 二进制文件位于同一目录中的名为`kube_config_rancher-cluster.yml`的配置文件。复制此文件并将其备份到安全位置，稍后在升级 Rancher Server 时将使用此文件。

## 后续操作

您有两种选择：

- 在发生灾难的情况下，为您的 Rancher Server 创建备份：[K3s Rancher 高可用备份](/docs/backups/backups/k3s-backups/_index)。
- 创建 Kubernetes 集群：[提供 Kubernetes 集群](/docs/cluster-provisioning/_index)。

## 常见问题和故障排查

### 如何知道我的证书是不是 PEM 格式？

您可以通过以下特征识别 PEM 格式：

- 该文件以以下标头开头：`-----BEGIN CERTIFICATE-----`
- 标头后跟一长串字符。
- 该文件以页脚结尾：`-----END CERTIFICATE-----`

#### PEM 证书例子：

```
----BEGIN CERTIFICATE-----
MIIGVDCCBDygAwIBAgIJAMiIrEm29kRLMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNV
... more lines
VWQqljhfacYPgp8KJUJENQ9h5hZ2nSCrI+W00Jcw4QcEdCI8HL5wmg==
-----END CERTIFICATE-----
```

### 如何通过 base64 编码我的 PEM 文件？

运行以下命令之一。将`FILENAME`替换为您的证书名称。

```
# MacOS
cat FILENAME | base64
# Linux
cat FILENAME | base64 -w0
# Windows
certutil -encode FILENAME FILENAME.base64
```

### 如何验证生成的证书的 base64 字符串？

运行以下命令之一。用之前复制的 base64 字符串替换 `YOUR_BASE64_STRING`。

```
# MacOS
echo YOUR_BASE64_STRING | base64 -D
# Linux
echo YOUR_BASE64_STRING | base64 -d
# Windows
certutil -decode FILENAME.base64 FILENAME.verify
```

### 如果我想添加中间证书，证书的顺序是什么？

添加证书的顺序如下：

```
-----BEGIN CERTIFICATE-----
%您的证书%
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
%您的中间证书%
-----END CERTIFICATE-----
```

### 如何验证我的证书链？

您可以使用 `openssl` 二进制文件来验证证书链。如果命令的输出（请参见下面的命令示例）以`Verify return code: 0 (ok)`，则您的证书链有效。`ca.pem`文件必须与您添加到`rancher/rancher`容器中的文件相同。使用由公认的证书颁发机构签名的证书时，可以省略`-CAfile`参数。

命令：

```
openssl s_client -CAfile ca.pem -connect rancher.yourdomain.com:443
...
    Verify return code: 0 (ok)
```
