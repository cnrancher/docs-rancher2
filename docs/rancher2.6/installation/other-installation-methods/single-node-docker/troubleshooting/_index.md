---
title: 证书故障排查
weight: 4
---
### 如何确定我的证书格式是否为 PEM？

你可以通过以下特征识别 PEM 格式：

- 文件开始的标头：
   ```
   -----BEGIN CERTIFICATE-----
   ```
- 表头后跟一长串字符。
- 文件结束的页脚：
   ```
   -----END CERTIFICATE-----
   ```

PEM 证书示例：

```
----BEGIN CERTIFICATE-----
MIIGVDCCBDygAwIBAgIJAMiIrEm29kRLMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNV
... more lines
VWQqljhfacYPgp8KJUJENQ9h5hZ2nSCrI+W00Jcw4QcEdCI8HL5wmg==
-----END CERTIFICATE-----
```

PEM 证书密钥示例：

```
-----BEGIN RSA PRIVATE KEY-----
MIIGVDCCBDygAwIBAgIJAMiIrEm29kRLMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNV
... more lines
VWQqljhfacYPgp8KJUJENQ9h5hZ2nSCrI+W00Jcw4QcEdCI8HL5wmg==
-----END RSA PRIVATE KEY-----
```

如果你的密钥与以下示例类似，请参见[将 PKCS8 证书密钥转换为 PKCS1](#converting-a-certificate-key-from-pkcs8-to-pkcs1)。

```
-----BEGIN PRIVATE KEY-----
MIIGVDCCBDygAwIBAgIJAMiIrEm29kRLMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNV
... more lines
VWQqljhfacYPgp8KJUJENQ9h5hZ2nSCrI+W00Jcw4QcEdCI8HL5wmg==
-----END PRIVATE KEY-----
```

### 将 PKCS8 证书密钥转换为 PKCS1

如果你使用的是 PKCS8 证书密钥文件，Rancher 将打印以下日志：

```
ListenConfigController cli-config [listener] failed with : failed to read private key: asn1: structure error: tags don't match (2 vs {class:0 tag:16 length:13 isCompound:true})
```

为了能正常工作，你需要运行以下命令，将密钥从 PKCS8 转换为 PKCS1：

```
openssl rsa -in key.pem -out convertedkey.pem
```

你可使用 `convertedkey.pem` 作为 Rancher 证书密钥文件。

### 添加中间证书的顺序是什么？

添加证书的顺序如下：

```
-----BEGIN CERTIFICATE-----
%YOUR_CERTIFICATE%
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
%YOUR_INTERMEDIATE_CERTIFICATE%
-----END CERTIFICATE-----
```

### 如何验证我的证书链？

你可使用 `openssl` 二进制文件来验证证书链。如果命令的输出以 `Verify return code: 0 (ok)` 结尾（参见以下示例），你的证书链是有效的。`ca.pem` 文件必须与你添加到 `rancher/rancher` 容器中的文件一致。

如果你使用由可信的 CA 签发的证书，可省略 `-CAfile` 参数。

命令：

```
openssl s_client -CAfile ca.pem -connect rancher.yourdomain.com:443
...
    Verify return code: 0 (ok)
```
