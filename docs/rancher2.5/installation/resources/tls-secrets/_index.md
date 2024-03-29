---
title: 添加 TLS 密文
description: 只有当我们在 `cattle-system` 命名空间，将自签名证书和对应密钥配置到 `tls-rancher-ingress` 的密文中，Kubernetes 才会为 Rancher 创建所有的对象和服务。将服务器证书和任何所需的中间证书合并到名为 `tls.crt` 的文件中，将您的证书密钥拷贝到名称为 `tls.key` 的文件中。使用 `kubectl` 来创建 `tls` 类型的密文。如果您想要更换证书，您可以使用 `kubectl -n cattle-system delete secret tls-rancher-ingress` 来删除 `tls-rancher-ingress` 密文，之后使用上面的命令创建一个新的密文。如果您使用的是私有 CA 签发的证书，仅当新证书与当前证书是由同一个 CA 签发的，才可以替换。
---

> 注意：
> 可以使用 [一键生成 ssl 自签名证书脚本](/docs/rancher2.5/installation/resources/advanced/self-signed-ssl/_index/#41-一键生成-ssl-自签名证书脚本) 来快速生成符合 rancher 要求的自签名证书。该脚本会自动生成本文中所需要的 `tls.crt`、`tls.key` 和 `cacerts.pem`

只有当我们在 `cattle-system` 命名空间，将自签名证书和对应密钥配置到 `tls-rancher-ingress` 的密文中，Kubernetes 才会为 Rancher 创建所有的对象和服务。

将服务器证书和任何所需的中间证书合并到名为 `tls.crt` 的文件中，将您的证书密钥拷贝到名称为 `tls.key` 的文件中。

例如，[acme.sh](https://acme.sh)在`fullchain.cer`文件中提供了服务器证书和中间证书。在这种情况下，您应该将`fullchain.cer`文件重命名为`tls.crt`，将证书秘钥文件重命名为`tls.key` 。

使用 `kubectl` 创建 `tls` 类型的密文。

```
kubectl -n cattle-system create secret tls tls-rancher-ingress \
  --cert=tls.crt \
  --key=tls.key
```

> **提示：** 如果您想要更换证书，您可以使用 `kubectl -n cattle-system delete secret tls-rancher-ingress` 来删除 `tls-rancher-ingress` 密文，之后使用上面的命令创建一个新的密文。如果您使用的是私有 CA 签发的证书，仅当新证书与当前证书是由同一个 CA 签发的，才可以替换。

## 使用私有 CA 签发证书

如果您使用的是私有 CA，Rancher 需要您提供 CA 证书的副本，用来校验 Rancher Agent 与 Server 的连接。

拷贝 CA 证书到名为 `cacerts.pem` 的文件，使用 `kubectl` 命令在 `cattle-system` 命名空间中创建名为 `tls-ca` 的密文。

```
kubectl -n cattle-system create secret generic tls-ca \
  --from-file=cacerts.pem=./cacerts.pem
```

> **注意：** Rancher 在启动时检索`tls-ca`密文。如果您的 Rancher Server 正在运行中，您需要重新启动 Rancher Server Pod 才能使新的 CA 生效。

## 更新私有 CA 签发证书

按照[本页](/docs/rancher2.5/installation/resources/update-ca-cert/_index)上的步骤更新 Rancher[高可用性 Kubernetes 安装](/docs/rancher2.5/installation/install-rancher-on-k8s/_index)中的入口的 SSL 证书，或从默认的自签名证书切换到自定义证书。
