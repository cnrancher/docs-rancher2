---
title: Elasticsearch
description: 如果您的组织在内部或云上使用Elasticsearch，可以配置 Rancher 向其发送 Kubernetes 日志。完成配置后，您可以进入 Elasticsearch 中查看日志。
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
  - 集群管理员指南
  - 集群工具
  - 日志
  - Elasticsearch
---

如果您的组织在内部或云上使用 [Elasticsearch](https://www.elastic.co/)，可以配置 Rancher 向其发送 Kubernetes 日志。完成配置后，您可以进入 Elasticsearch 中查看日志。

> **前提：** 配置 [Elasticsearch](https://www.elastic.co/guide/en/cloud/saas-release/ec-create-deployment.html)。

## Elasticsearch 配置

1. 在**访问地址**字段中，输入您的 Elasticsearch 实例的 IP 地址和端口。您可以从 Elasticsearch 的仪表板中找到此信息。

   - Elasticsearch 通常将端口 `9200` 用于 HTTP，将 `9243` 用于 HTTPS。

1. 如果您使用 [X-Pack Security](https://www.elastic.co/guide/en/x-pack/current/xpack-introduction.html) 请输入您的 Elasticsearch **用户名**和**密码**用于身份验证。

1.输入 [Index Pattern](https://www.elastic.co/guide/en/kibana/current/index-patterns.html)。

## SSL 配置

如果您的 Elasticsearch 实例使用 SSL，则您的**访问地址**必须以`https://` 开头。输入正确的访问地址，将展开**SSL 配置**表单。

1. 提供**客户端私钥**和**客户端证书**。您可以复制和粘贴它们，也可以使用**从文件读取**按钮上传它们。

   - 您可以使用自签名证书，也可以使用证书颁发机构提供的证书。

   - 您可以使用 openssl 命令生成自签名证书。例如：

     ```
     openssl req -x509 -newkey rsa:2048 -keyout myservice.key -out myservice.cert -days 365 -nodes -subj "/CN=myservice.example.com"
     ```

1. 输入您的**客户密钥密码**。

1. 输入您的**SSL 版本**。默认版本为 `TLSv1_2`。

1. 选择是否要验证 SSL 证书

   - 如果使用的是自签名证书，请选择**启用-输入受信任的服务器证书**，并提供 **PEM 格式的 CA 证书**。您可以直接以复制粘贴证书，也可以单击**从文件读取**按钮，上传证书。

   - 如果您使用的是来自证书颁发机构的证书，请选择**启用-输入受信任的服务器证书**。您无需提供**PEM 格式的 CA 证书**。
