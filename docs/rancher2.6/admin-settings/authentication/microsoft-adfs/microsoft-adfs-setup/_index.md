---
title: 1. 在 Microsoft AD FS 中配置 Rancher
weight: 1205
---

在配置 Rancher 以支持 AD FS 用户之前，你必须在 AD FS 中将 Rancher 添加为 [relying party trust](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/technical-reference/understanding-key-ad-fs-concepts)（信赖方信任）。

1. 以管理用户身份登录 AD 服务器。

1. 打开 **AD FS Management** 控制台。在 **Actions** 菜单中选择 **Add Relying Party Trust...**。然后单击 **Start**。

   {{< img "/img/rancher/adfs/adfs-overview.png" "">}}

1. 选择 **Enter data about the relying party manually** 作为获取信赖方数据的选项。

   {{< img "/img/rancher/adfs/adfs-add-rpt-2.png" "">}}

1. 为 **Relying Party Trust** 设置**显示名称**，例如 `Rancher`。

   {{< img "/img/rancher/adfs/adfs-add-rpt-3.png" "">}}

1. 选择 **AD FS profile** 作为信赖方信任的配置文件。

   {{< img "/img/rancher/adfs/adfs-add-rpt-4.png" "">}}

1. 留空 **optional token encryption certificate**，因为 Rancher AD FS 不会使用它。

   {{< img "/img/rancher/adfs/adfs-add-rpt-5.png" "">}}

1. 选择 **Enable support for the SAML 2.0 WebSSO protocol** 并在 Service URL 处输入 `https://<rancher-server>/v1-saml/adfs/saml/acs`。

   {{< img "/img/rancher/adfs/adfs-add-rpt-6.png" "">}}

1. 将 `https://<rancher-server>/v1-saml/adfs/saml/metadata` 添加为 **Relying party trust identifier**。

   {{< img "/img/rancher/adfs/adfs-add-rpt-7.png" "">}}

1. 本教程不涉及多重身份验证。如果你想配置多重身份验证，请参见 [Microsoft 文档](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/operations/configure-additional-authentication-methods-for-ad-fs)。

   {{< img "/img/rancher/adfs/adfs-add-rpt-8.png" "">}}

1. 在 **Choose Issuance Authorization RUles** 中，你可以根据用例选择任何一个可用选项。但是考虑到本指南的目的，请选择 **Permit all users to access this relying party**。

   {{< img "/img/rancher/adfs/adfs-add-rpt-9.png" "">}}

1. 检查所有设置后，选择 **Next** 来添加信赖方信任。

   {{< img "/img/rancher/adfs/adfs-add-rpt-10.png" "">}}

1. 选择 **Open the Edit Claim Rules...**。然后单击 **Close**。

   {{< img "/img/rancher/adfs/adfs-add-rpt-11.png" "">}}

1. 在 **Issuance Transform Rules** 选项卡中，单击 **Add Rule...**。

   {{< img "/img/rancher/adfs/adfs-edit-cr.png" "">}}

1. 在 **Claim rule template** 中选择 **Send LDAP Attributes as Claims**。

   {{< img "/img/rancher/adfs/adfs-add-tcr-1.png" "">}}

1. 将 **Claim rule name** 设置为所需的名称（例如 `Rancher Attributes`）并选择 **Active Directory** 作为 **Attribute store**。创建对应下表的映射：

   | LDAP 属性                                    | 传出声明类型 |
   | -------------------------------------------- | ------------ |
   | Given-Name                                   | Given Name   |
   | User-Principal-Name                          | UPN          |
   | Token-Groups - Qualified by Long Domain Name | Group        |
   | SAM-Account-Name                             | Name         |

   <br/>
   {{< img "/img/rancher/adfs/adfs-add-tcr-2.png" "">}}

1. 从 AD 服务器的以下位置下载 `federationmetadata.xml`：

```
https://<AD_SERVER>/federationmetadata/2007-06/federationmetadata.xml
```

**结果**：你已将 Rancher 添加为依赖信任方。现在你可以配置 Rancher 来使用 AD。

### 后续操作

[在 Rancher 中配置 Microsoft AD FS ]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/microsoft-adfs/rancher-adfs-setup/)
