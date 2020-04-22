---
title: 添加 Kubernetes TLS 密文
description: 只有当我们在 `cattle-system` 命名空间，将自签名证书和对应密钥配置到 `tls-rancher-ingress` 的密文中，Kubernetes 才会为 Rancher 创建所有的对象和服务。
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
  - Rancher高可用Helm2安装
  - 安装 Rancher
  - 添加 Kubernetes TLS 密文
---

只有当我们在 `cattle-system` 命名空间，将自签名证书和对应密钥配置到 `tls-rancher-ingress` 的密文中，Kubernetes 才会为 Rancher 创建所有的对象和服务。

将服务器证书和任何所需的中间证书合并到名为 `tls.crt` 的文件中，将您的证书密钥拷贝到名称为 `tls.key` 的文件中。

使用 `kubectl` 来创建 `tls` 类型的密文。

```
kubectl -n cattle-system create secret tls tls-rancher-ingress \
  --cert=tls.crt \
  --key=tls.key
```

> **提示：** 如果您想要更换证书，您可以使用 `kubectl -n cattle-system delete secret tls-rancher-ingress` 来删除 `tls-rancher-ingress` 密文，之后使用上面的命令创建一个新的密文。如果您使用的是私有 CA 签发的证书，仅当新证书与当前证书是由同一个 CA 签发的，才可以替换。

## 使用私有 CA 签发证书

如果您使用的是私有 CA，Rancher 需要您提供 CA 证书的副本，用来校验 Rancher Agent 与 Server 的连接。

拷贝 CA 证书到名为 `cacerts.pem` 的文件，使用 `kubectl` 命令在 `cattle-system` 命名空间中创建名为 `tls-ca` 的密文。

> **重要：** 请确保文件名称为 `cacerts.pem`，因为 Rancher 使用该文件名来配置 CA 证书。

```
kubectl -n cattle-system create secret generic tls-ca \
  --from-file=cacerts.pem
```
