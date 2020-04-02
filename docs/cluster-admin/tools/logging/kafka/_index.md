---
title: Kafka
---

如果您的组织使用 [Kafka](https://kafka.apache.org/) 则可以配置 Rancher 向其发送 Kubernetes 日志。之后，您可以到 Kafka 服务器以查看日志。

> **前提：** 配置 Kafka 服务器。

### Kafka 服务器配置

1. 选择您的 Kafka 服务器使用的**访问端点**类型：

- **Zookeeper**: 输入 IP 地址和端口。默认情况下，Zookeeper 使用端口`2181`。注意，Zookeeper 类型无法启用 TLS。
- **Broker**: 点击**添加访问地址**。对于每个 Kafka Broker，输入 IP 地址和端口。默认情况下，Kafka Broker 使用端口`9092`。

1. 在**主题**字段中，输入 Kubernetes 集群提交日志的 Kafka [topic](https://kafka.apache.org/documentation/#basic_ops_add_topic) 名称。

### **Broker**访问地址类型

#### SSL 配置

如果您的 Kafka 的**Broker**使用 SSL 则需要填写**SSL 配置**.

1. 提供**客户端私钥**和**客户端证书**。您可以复制和粘贴它们，也可以使用**从文件读取**按钮上载它们。

1. 提供**PEM 格式的 CA 证书**。您可以复制和粘贴证书，也可以使用**从文件读取**按钮上载证书。

> **注意：** 启用客户端身份验证时，Kafka 不支持自签名证书。

#### SASL 配置

如果您的 Kafka 集群的 Broker 使用[SASL 身份验证](https://kafka.apache.org/documentation/#security_sasl) ，则需要填写 **SASL 配置**

1. 输入 SASL 的**用户名**和**密码**。

1. 选择您的 Kafka 集群使用的 **SASL 类型**。

   - 如果您的 Kafka 使用的是 **Plain**，请确保您的 Kafka 集群配置了 SSL。

   - 如果您的 Kafka 使用 **Scram**，则需要选择使用的**Scram 机制**。
