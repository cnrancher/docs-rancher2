---
title: 自定义 CA 根证书
weight: 1
---

如果你在内部生产环境使用 Rancher，且不打算公开暴露应用，你可以使用使用私有 CA 颁发的证书。

Rancher 可能会访问配置了自定义/内部 CA 根证书（也称为自签名证书）的服务。如果Rancher 无法验证服务的证书，则会显示错误信息 `x509: certificate signed by unknown authority`。

如需验证证书，你需要把 CA 根证书添加到 Rancher。由于 Rancher 是用 Go 编写的，我们可以使用环境变量 `SSL_CERT_DIR` 指向容器中 CA 根证书所在的目录。启动 Rancher 容器时，可以使用 Docker 卷选项（`-v host-source-directory:container-destination-directory`）来挂载 CA 根证书目录。

Rancher 可以访问的服务示例：

- 应用商店
- 验证提供程序
- 使用 Node Driver 访问托管/云 API

## 使用自定义 CA 证书安装

有关启动挂载了私有 CA 证书的 Rancher 容器的详情，请参见安装文档：

- [Docker 安装的自定义 CA 证书选项]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/advanced/#custom-ca-certificate)

- [Kubernetes 安装的其他受信 CA 选项]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#additional-trusted-cas)

