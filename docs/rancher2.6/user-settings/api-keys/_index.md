---
title: API 密钥
weight: 7005
---

## API 密钥和用户身份验证

如果你想通过外部应用程序来访问 Rancher 集群、项目或其他对象，你可以使用 Rancher API。但是，在你的应用程序可以访问 API 之前，你必须为应用程序提供用于向 Rancher 进行身份验证的密钥。你可以通过 Rancher UI 获取密钥。

使用 Rancher CLI 也需要 API 密钥。

API 密钥由四个组件组成：

- **端点**：其他应用程序用来向 Rancher API 发送请求的 IP 地址和路径。
- **访问密钥**：Token 的用户名。
- **密文密钥**：Token 的密码。如果应用程序提示你输入两个不同的字符串进行 API 身份验证，你通常需要将两个密钥一起输入。
- **持有者令牌**：连接在一起的令牌用户名和密码。如果应用程序提示你输入一个身份验证字符串，则使用此字符串。

> 注意：用户可以选择启用[令牌哈希（token hashing）]({{<baseurl>}}/rancher/v2.6/en/api/api-tokens)。

## 创建 API 密钥

1. 从右上角选择**用户头像 > 账号 & API 密钥**。

2. 单击**创建 API 密钥**。

3. **可选**：输入 API 密钥的描述并选择有效期或范围。我们建议设置到期日期。

   API 密钥过期后将失效。有效期短一点会更安全。

   有效期将受 `v3/settings/auth-token-max-ttl-minutes` 约束。如果超过 max-ttl，则会以 max-ttl 为有效期创建 API 密钥。

   范围将限制 API 密钥，使其仅适用于指定集群的 Kubernetes API。如果集群配置了授权集群端点，你将能够直接针对集群的 API 使用设定了范围的令牌，而无需通过 Rancher Server 进行代理。有关详细信息，请参阅[授权集群端点]({{<baseurl>}}/rancher/v2.6/en/overview/architecture/#4-authorized-cluster-endpoint)。

4. 单击**创建**。

   **步骤结果**：已创建 API 密钥。将会显示你的 API **端点**、**访问密钥**、**密文密钥**和**持有者令牌**。

   使用**持有者令牌**通过 Rancher CLI 进行身份验证。

5. 将显示的信息复制到安全位置。此信息仅显示一次，因此如果你丢失了密钥，则必须制作一个新的。

## 后续操作

- 将 API 密钥信息输入到将向 Rancher API 发送请求的应用程序中。
- 要了解 Rancher 端点和参数的更多信息，你可以为 Rancher UI 中的对象选择**在 API 中查看**。
- API 密钥可用于 API 调用和 [Rancher CLI]({{<baseurl>}}/rancher/v2.6/en/cli)。

## 删除 API 密钥

如果要撤销 API 密钥，请将其删除。如果出现以下情况，你需要删除 API 密钥：

- API 密钥可能已经泄露。
- API 密钥已过期。

要删除 API，选择密钥并单击**删除**。
