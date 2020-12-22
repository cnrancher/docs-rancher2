---
title: 外部DNS服务
---

在[应用商店](/docs/rancher1/configurations/catalog/_index)中，Rancher 提供了多种的 DNS 服务并且这些服务可以监听 rancher-metadata 的事件，并根据 metadata 的更变生成 DNS 记录。我们会以 Route53 作为例子说明外部 DNS 是如何工作的，但 Rancher 还有其他由其他 DNS 服务商提的供社区版服务。

### 最佳实践

- 在每个您启动的 Rancher 环境中，应该有且只有 1 个 `route53` 服务的实例。
- 多个 Rancher 实例不应该共享同一个 `hosted zone`。

### 需要配置 AWS IAM 权限

下面的 IAM 权限是 Route53 DNS 所需要的最小权限。
请确保您设置的主机 AWS 安全密钥(Access Key ID / Secret Access Key)或者主机 IAM 权限至少被配置了如下权限。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "route53:GetHostedZone",
        "route53:GetHostedZoneCount",
        "route53:ListHostedZonesByName",
        "route53:ListResourceRecordSets"
      ],
      "Resource": ["*"]
    },
    {
      "Effect": "Allow",
      "Action": ["route53:ChangeResourceRecordSets"],
      "Resource": ["arn:aws:route53:::hostedzone/<HOSTED_ZONE_ID>"]
    }
  ]
}
```

> **注意:** 当使用这个 JSON 文档在 AWS 中创建自定义 IAM 规则时，请使用 Route53 所在区域或者通配符('\*')来替换`<HOSTED_ZONE_ID>`。

### 启动 Route53 服务

在 **应用商店** 标签页中，您可以选择 **Route53 DNS Stack**。

为您的应用栈填写 **名称**，并填写必要的 **描述**。

在 **配置选项** 中，您需要提供以下信息:

| 名称           | 值                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| AWS Access Key | 访问 AWS API 的 Access key                                                                                        |
| AWS Secret Key | 访问 AWS API 的 Secret key                                                                                        |
| AWS Region     | 在 AWS 中的区域名称。我们建议您填写一个与您服务器相近的区域。他会转换成 Rancher Route53 发送 DNS 更新请求的地址。 |
| Hosted Zone    | Route53 hosted zone。这个必须在您的 Route53 实例上预创建。                                                        |

在完成表单后，单击 **创建**。一个带有 `route53` 服务的应用栈将会被创建，您只需要启动这个服务。

### 使用 Route53 的服务

`route53`服务只会为在 Host 上映射端口的服务生成 DNS 记录，每一个 Rancher 生成的 DNS 记录，他使用以下格式为服务创建一个 fqdn:

```bash
fqdn=<serviceName>.<stackName>.<environmentName>.<yourHostedZoneName>
```

在 AWS 的 Route 53 中，他会以 name=fqdn，value=[服务所在的 host 的 ip 地址列表]的一个记录集合呈现。Rancher `route53` 服务只会管理以`<environmentName>.<yourHostedZoneName>`结尾的记录集合。当前 TTL 的时间为 300 秒。

一旦 DNS 记录被设置在 AWS 的 Route 53 上，生成的 fqdn 会返回到 Rancher，并会设置 **服务.fqdn** 字段。您可以在服务下拉菜单的 **在 API 中查看** 并查询 **fqdn** 找到 fqdn 字段。

当在浏览器使用 fqdn，他会被指向到服务中的其中一个容器。如果服务中容器的 IP 地址发生了变化，这些变化会在 AWS 的 Route 53 服务同步更新。由于用户一直在使用 fqdn，所有这些更变对用户是透明的。

> **注意:** 在 `route53` 服务被启动后，任何已经部署并使用了 host 端口的服务都会获得一个 fqdn。

### 删除 Route53 服务

当 `route53` 从 Rancher 被移除，在 AWS Route 53 服务中的记录并**不会**被移除。这些记录需要在 AWS 中手工移除。

### 为外部 DNS 使用特定的 IP

在默认下，Rancher DNS 选择注册在 Rancher Server 中的主机 IP 去暴露服务。其中会有一个应用场景是主机在一个私有网络中，但主机将需要使用外部 DNS 在公网中暴露服务。您需要在启动外部 DNS 服务前添加一个[主机标签](/docs/rancher1/infrastructure/hosts/_index#主机标签)，来指定在外部 DNS 中使用的 IP 地址。

在启动外部服务前，需要添加以下标签到主机上。标签的值需要是 Rancher 的 Route53 DNS 服务上要用到的 IP。如果这个标签没有设置在主机上，Rancher 的 Route53 服务将会默认使用主机注册在 Rancher 上的 IP 的地址。

```bash
io.rancher.host.external_dns_ip=<IP_TO_BE_USED_FOR_EXTERNAL_DNS>
```
