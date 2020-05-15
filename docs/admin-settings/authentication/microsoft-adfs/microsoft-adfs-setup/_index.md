---
title: 为 Rancher 配置 AD FS
description: 在配置 Rancher 以支持 AD FS 用户之前，必须将 Rancher 添加为 AD FS 中的 Relying Party Trust。
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
  - 系统管理员指南
  - 登录认证
  - AD FS（SAML）
  - 为 Rancher 配置 AD FS
---

在配置 Rancher 以支持 AD FS 用户之前，必须将 Rancher 添加为 AD FS 中的 [Relying Party Trust](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/technical-reference/understanding-key-ad-fs-concepts)。

1. 以管理用户身份登录到 AD 服务器。

2. 打开 **AD FS Management** 控制台。从 **Actions** 菜单中选择 **Add Relying Party Trust...**，点击 **Start**。

   ![](/img/rancher/adfs/adfs-overview.png)

3. 选择 **Enter data about the relying party manually** 作为获取有关依赖方数据的选项。

   ![](/img/rancher/adfs/adfs-add-rpt-2.png)

4. 输入您的 Relying Party Trust 所需的**显示名称**。例如，`Rancher`。

   ![](/img/rancher/adfs/adfs-add-rpt-3.png)

5. 选择 **AD FS profile** 配置文件作为您的依赖方信任的配置文件。

   ![](/img/rancher/adfs/adfs-add-rpt-4.png)

6. 将 **optional token encryption certificate** 保持为空，因为 Rancher AD FS 不会使用它。

   ![](/img/rancher/adfs/adfs-add-rpt-5.png)

7. 选择 **Enable support for the SAML 2.0 WebSSO protocol**
   并输入`https://<rancher-server>/v1-saml/adfs/saml/acs` URL。

   ![](/img/rancher/adfs/adfs-add-rpt-6.png)

8. 添加 `https://<rancher-server>/v1-saml/adfs/saml/metadata` 为 **Relying party trust identifier**。

   ![](/img/rancher/adfs/adfs-add-rpt-7.png)

9. 本教程将不涉及多因子身份验证。如果您想配置多因子身份验证 参考 [Microsoft 文档](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/operations/configure-additional-authentication-methods-for-ad-fs)。

   ![](/img/rancher/adfs/adfs-add-rpt-8.png)

10. 在 **Choose Issuance Authorization RUles**，您可以根据用例选择任何一个可用选项。但是，出于本指南的目的，请选择 **Permit all users to access this relying party**。

    ![](/img/rancher/adfs/adfs-add-rpt-9.png)

11. 查看完设置后, 点击 **Next** 以添加以添加依赖方信任。

    ![](/img/rancher/adfs/adfs-add-rpt-10.png)

12. 在 **Open the Edit Claim Rules...** 然后点击 **Close**。

    ![](/img/rancher/adfs/adfs-add-rpt-11.png)

13. 在 **Issuance Transform Rules** 表, 单击 **Add Rule...**。

    ![](/img/rancher/adfs/adfs-edit-cr.png)

14. 选择 **Send LDAP Attributes as Claims** 作为 **Claim rule template**。

    ![](/img/rancher/adfs/adfs-add-tcr-1.png)

15. 将 **Claim rule name** 设置为所需的名称 (例如, `Rancher Attributes`) 然后选择 **Active Directory** 作为 **Attribute store**。 创建以下映射以反映下表：

| LDAP 属性                                    | 声明类型   |
|----------------------------------------------|------------|
| Given-Name                                   | Given Name |
| User-Principal-Name                          | UPN        |
| Token-Groups - Qualified by Long Domain Name | Group      |
| SAM-Account-Name                             | Name       |

    ![](/img/rancher/adfs/adfs-add-tcr-2.png)

16. 从以下位置的 AD 服务器下载： `federationmetadata.xml` ：

    ```bash
    https://<AD_SERVER>/federationmetadata/2007-06/federationmetadata.xml
    ```

**结果：** 您已将 Rancher 添加为依赖的信任方。现在，您可以配置 Rancher 以使用 AD FS。

## 后续操作

[配置 Rancher 使用 AD FS](/docs/admin-settings/authentication/microsoft-adfs/rancher-adfs-setup/_index)
