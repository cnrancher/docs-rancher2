---
title: 自定义 CA 根证书
---

如果您在内部生产环境使用 Rancher，而不需要在公网暴露应用，可以使用私有证书颁发机构（CA）的证书。

如果 Rancher 访问的服务使用的是自定义/内部 CA 根证书（也称为自签名证书）进行配置的，如果 Rancher 无法验证服务中提供的证书，会显示如下的错误信息：`x509: certificate signed by unknown authority`.

要正常验证应用证书，需要将 CA 根证书添加到 Rancher。由于 Rancher 是用 Go 编写的，我们可以使用环境变量`SSL_CERT_DIR`指向容器中 CA 根证书所在的目录，并且在启动 Rancher 容器时，可以使用`-v host-source-directory:container-destination-directory`挂载主机上 CA 根证书目录到容器中。

Rancher 需要访问的服务如下：

- 自定义应用商店
- 第三方认证平台
- 使用节点驱动访问托管/云 API

## 使用自定义 CA 证书安装

有关使用私有 CA 证书启动 Rancher 容器的详细信息，请参阅安装文档：

- [Rancher 单节点](/docs/installation/other-installation-methods/single-node-docker/_index)
- [Rancher 高可用](/docs/installation/options/chart-options/_index)
