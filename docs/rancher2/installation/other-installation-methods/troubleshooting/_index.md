---
title: 常见问题和问题排查
description: 常见问题和问题排查
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 安装指南
  - 其他安装方法
  - 单节点安装
  - 常见问题和问题排查
---

## 如何知道我的证书是不是 PEM 格式？

您可以通过以下特征识别 PEM 格式：

- 该文件以以下标头开头：`-----BEGIN CERTIFICATE-----`
- 标头后跟一长串字符。
- 该文件以页脚结尾：`-----END CERTIFICATE-----`
  符合上述三点特征的就是 PEM 格式的证书

### PEM 证书例子：

```
----BEGIN CERTIFICATE-----
MIIGVDCCBDygAwIBAgIJAMiIrEm29kRLMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNV
... more lines
VWQqljhfacYPgp8KJUJENQ9h5hZ2nSCrI+W00Jcw4QcEdCI8HL5wmg==
-----END CERTIFICATE-----
```

### PEM 证书密钥例子：

```
-----BEGIN RSA PRIVATE KEY-----
MIIGVDCCBDygAwIBAgIJAMiIrEm29kRLMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNV
... more lines
VWQqljhfacYPgp8KJUJENQ9h5hZ2nSCrI+W00Jcw4QcEdCI8HL5wmg==
-----END RSA PRIVATE KEY-----
```

如果您的密钥看起来像下面的例子，请查看[如何将证书密钥从 PKCS8 转换为 PKCS1](#如何将证书密钥从-pkcs8-转换为-pkcs1)

```
-----BEGIN PRIVATE KEY-----
MIIGVDCCBDygAwIBAgIJAMiIrEm29kRLMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNV
... more lines
VWQqljhfacYPgp8KJUJENQ9h5hZ2nSCrI+W00Jcw4QcEdCI8HL5wmg==
-----END PRIVATE KEY-----
```

## 如何将证书密钥从 PKCS8 转换为 PKCS1

如果您使用的是 PKCS8 证书密钥文件，Rancher 将打印以下日志：

```
ListenConfigController cli-config [listener] failed with : failed to read private key: asn1: structure error: tags don't match (2 vs {class:0 tag:16 length:13 isCompound:true})
```

为了使它正常工作，您需要使用以下命令将密钥从 PKCS8 转换为 PKCS1：

```
openssl rsa -in key.pem -out convertedkey.pem
```

您现在可以将`convertedkey.pem`用作 Rancher 的证书密钥文件。

## 如果我想添加中间证书，证书的顺序是什么？

添加证书的顺序如下：

```
-----BEGIN CERTIFICATE-----
%您的证书%
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
%您的中间证书%
-----END CERTIFICATE-----
```

## 如何验证我的证书链？

您可以使用 `openssl` 二进制文件来验证证书链。如果命令的输出（请参见下面的命令示例）以`Verify return code: 0 (ok)`，则您的证书链有效。`ca.pem`文件必须与您添加到`rancher/rancher`容器中的文件相同。使用由公认的证书颁发机构签名的证书时，可以省略`-CAfile`参数。

命令：

```
openssl s_client -CAfile ca.pem -connect rancher.yourdomain.com:443
...
    Verify return code: 0 (ok)
```
