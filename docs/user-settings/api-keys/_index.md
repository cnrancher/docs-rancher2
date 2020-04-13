---
title: API 密钥
---

## API 密钥和用户认证

如果您需要通过其他应用访问 Rancher 中的集群、项目或者其他组件，您可以使用 Rancher API。在使用前，您需要提供秘钥进行认证。您可以在 Rancher UI 中创建 API 秘钥。

如果您使用的是 Rancher 命令行工具（Rancher CLI），您也需要提供 API 秘钥进行认证。

API 秘钥由以下四个部分组成：

- **端点（endpoint）：**其他应用发送请求到 Rancher 时使用的的 IP 地址和路径信息。
- **Access Key：** 含有用户的 token。
- **Secret Key：** 含有密码的 token。有一些应用会引导您输入两个字符串进行认证，只需将 Access Key 和 Secret Key 两个字符串分别输入即可。
- **Bearer Token：** 含有用户名和密码的 token。有一些应用会引导您输入单个字符串进行认证，通常只需输入 Bearer Token 即可。

## 创建 API 秘钥

1. 单击 UI 界面右上方的**用户头像**,从下拉菜单中选择**用户设置 > API 秘钥**。

1. 单击 **添加秘钥**。

1. **可选：** 输入关于 API 秘钥的描述，设置 API 秘钥的有效期限和适用范围。

   超出有效期限后，API 秘钥会失效。添加有效期限可以提高安全性。

   适用范围对 API 可以调用的集群作了限制。如果集群配置了认证集群端点，您可以直接使用有适用范围的 token，不需要使用代理连接 Rancher Server。详情请查看[认证集群端点](/docs/overview/architecture/_index#4-authorized-cluster-endpoint)。

1. 单击 **创建**，创建 API 秘钥。

   **步骤结果：** 创建了新的 API 秘钥。页面上会显示 API 秘钥的相关信息，如**端点**、 **Access Key**, **Secret Key**和 **Bearer Token**。

   Use the **Bearer Token** to authenticate with Rancher CLI.在 Rancher 命令行工具中使用 **Bearer Token**进行认证。

1. 将 API 秘钥信息保存到一个安全的位置，因为这些信息只会显示一次。如果您丢失了 API 秘钥的信息，您只能创建一个新的 API 秘钥。

## 删除 API 秘钥

如果您需要撤销 API 秘钥，您必须删除该免秘钥。如果秘钥符合以下任意一种情况，您应该删除该秘钥：

- 秘钥被破解了
- 秘钥过期了

删除 API 秘钥只需单击**删除**即可

## 后续操作

- 选择**通过 API 查看**，学习更多关于 Rancher API 的端点和参数知识。
- API 秘钥用于 API 调用和[Rancher 命令行工具](/docs/cli/_index)。

。
