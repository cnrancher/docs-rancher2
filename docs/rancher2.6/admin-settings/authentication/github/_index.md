---
title: 配置 GitHub
weight: 1116
---

在使用 GitHub 的环境中，你可以通过配置 Rancher 允许用户使用 GitHub 凭证登录。

> **前提**：参见[外部身份验证配置和主体用户]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/#external-authentication-configuration-and-principal-users)。

1. 使用分配了 `administrator` 角色（即 _本地主体_）的本地用户登录到 Rancher。
1. 在左上角，单击 **☰ > 用户 & 认证**。
1. 在左侧导航栏，单击**认证**。
1. 单击 **GitHub**。
1. 按照显示的说明设置 GitHub 应用。Rancher 会将你重定向到 GitHub 完成注册。

   > **什么是授权回调 URL？**
   >
   > 授权回调 URL 是用户开始使用你的应用（即初始屏幕）的 URL。

   > 使用外部身份验证时，实际上不会在你的应用中进行身份验证。相反，身份验证在外部进行（在本例中为 GitHub）。在外部身份验证成功完成后，用户将通过授权回调 URL 重新进入应用。

1. 从 GitHub 复制 **Client ID** 和 **Client Secret**。将它们粘贴到 Rancher 中。

   > **在哪里可以找到 Client ID 和 Client Secret？**
   >
   > 在 GitHub 中，选择 **Settings > Developer Settings > OAuth Apps**。你可以在此处找到 Client ID 和 Client Secret。

1. 单击**使用 GitHub 认证**。

1. 使用 **Site Access** 选项来配置用户授权的范围。

   - **允许任何有效用户**

      _任何_ GitHub 用户都能访问 Rancher。通常不建议使用此设置。

   - **允许集群和项目成员，以及授权的用户和组织**

      添加为**集群成员**或**项目成员**的任何 GitHub 用户或组都可以登录 Rancher。此外，任何添加到**授权用户和组织**列表中的 GitHub 用户和组都能登录到 Rancher。

   - **仅允许授权用户和组织**

      只有添加到**授权用户和组织**的 GitHub 用户和组能登录 Rancher。
      <br/>
1. 点击**启用**。

**结果**：

- GitHub 验证配置成功。
- 你将使用你的 GitHub 账号（即 _外部主体_）登录到 Rancher。
