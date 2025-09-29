---
title: API 密钥
description: 如果您需要通过其他应用访问 Rancher 中的集群、项目或者其他组件，您可以使用 Rancher API。在使用前，您需要提供密钥进行认证。您可以在 Rancher UI 中创建 API 密钥。如果您使用的是 Rancher 命令行工具（Rancher CLI），您也需要提供 API 密钥进行认证。API 密钥由以下四个部分组成
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
  - 用户设置
  - API 密钥
---

## API 密钥和用户认证

如果您需要通过其他应用访问 Rancher 中的集群、项目或者其他组件，您可以使用 Rancher API。在使用前，您需要提供密钥进行认证。您可以在 Rancher UI 中创建 API 密钥。

如果您使用的是 Rancher 命令行工具（Rancher CLI），您也需要提供 API 密钥进行认证。

API 密钥由以下四个部分组成：

- **端点（endpoint）：** 其他应用发送请求到 Rancher 时使用的的 IP 地址和路径信息。
- **Access Key：** token 的用户名。
- **Secret Key：** token 的密码。有一些应用会引导您输入两个字符串进行认证，只需将 Access Key 和 Secret Key 两个字符串分别输入即可。
- **Bearer Token：** 含有用户名和密码的 token。有一些应用会引导您输入单个字符串进行认证，通常只需输入 Bearer Token 即可。

## 创建 API 密钥

1. 单击 UI 界面右上方的**用户头像**,从下拉菜单中选择**用户设置 > API 密钥**。

1. 单击 **添加密钥**。

1. **可选：** 输入关于 API 密钥的描述，设置 API 密钥的有效期限和适用范围。

   如果设置了有效期，在超出有效期限后，API 密钥会过期和失效。添加有效期限可以提高安全性。

   _v2.4.6 可用_
   过期时间将由`v3/settings/auth-token-max-ttl-minutes`约束。如果超过 max-ttl，将以 max-ttl 为到期时间创建 API 密钥。

   适用范围对 API 可以调用的集群作了限制。如果集群配置了认证集群端点，您可以直接使用有适用范围的 token，直接访问集群的 API 端点，而不需要通过 Rancher Server 来代理连接。详情请查看[认证集群端点](/docs/rancher2/overview/architecture/)。

1. 单击 **创建**，创建 API 密钥。

   **步骤结果：** 创建了新的 API 密钥。页面上会显示 API 密钥的相关信息，如**端点**、 **Access Key**，**Secret Key**和 **Bearer Token**。

   在 Rancher 命令行工具中使用 **Bearer Token** 进行认证。

1. 将 API 密钥信息保存到一个安全的位置，因为这些信息只会显示一次。如果您丢失了 API 密钥的信息，您只能重新创建一个新的 API 密钥。

## 删除 API 密钥

如果您需要撤销 API 密钥，您必须删除该密钥。如果密钥符合以下任意一种情况，您应该删除该密钥：

- 密钥被破解了
- 密钥过期了

删除 API 密钥只需单击**删除**。

## 后续操作

- 选择**通过 API 查看**，学习更多关于 Rancher API 的端点和参数知识。
- API 密钥用于 API 调用和 [Rancher 命令行工具](/docs/rancher2/cli/)。
