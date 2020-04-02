---
title: Syslog
---

如果您的组织使用 [Syslog](https://tools.ietf.org/html/rfc5424)， 则可以配置 Rancher 向其发送 Kubernetes 日志。之后，您可以到 Syslog 服务器以查看日志。

> **前提：** 您必须配置 Syslog 服务器。

如果您使用的是 rsyslog，请确保您的 rsyslog 身份验证模式为 `x509/name`.

### Syslog 服务器配置

1. 在**访问地址**字段中，输入 Syslog 服务器的 IP 地址和端口。此外，在下拉列表中，选择 Syslog 服务器使用的协议。

1. 在**程序名**字段中，输入将日志发送到 Syslog 服务器的应用程序的名称，例如 `Rancher`.

1. 如果您使用的是云日志记录服务，例如：[Sumologic](https://www.sumologic.com/), 输入一个与您的 Syslog 服务器进行身份验证的**Token**。您将需要在云日志记录服务中创建此 Token。

1. 为发送到 Syslog 服务器的日志选择 **Log Severity**。 有关每个严重性级别的更多信息，请参见 [Syslog 协议文档](https://tools.ietf.org/html/rfc5424#page-11).

### Encryption 配置

如果您的 Syslog 服务器使用 **TCP** 协议并使用 TLS，则需要选择 **Use TLS** 并完成 **Encryption 配置**。

1. 提供**客户端私钥**和**客户端证书**。您可以复制和粘贴它们，也可以使用**从文件读取**按钮上传它们。

   - 您可以使用自签名证书，也可以使用证书颁发机构提供的证书。

   - 您可以使用 openssl 命令生成自签名证书。例如：

     ```
     openssl req -x509 -newkey rsa:2048 -keyout myservice.key -out myservice.cert -days 365 -nodes -subj "/CN=myservice.example.com"
     ```

1. 选择是否要验证 SSL 证书

   - 如果使用的是自签名证书，请选择**启用-输入受信任的服务器证书**，并提供 **PEM 格式的 CA 证书**。您可以复制和粘贴证书，也可以使用**从文件读取**按钮上传证书。
   - 如果您使用的是来自证书颁发机构的证书，请选择**启用-输入受信任的服务器证书**。您无需提供**PEM 格式的 CA 证书**。
