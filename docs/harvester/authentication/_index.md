---
title: 鉴权与认证
description: 在 ISO 安装模式下，用户在第一次登录时将被提示为默认的`admin`用户设置密码。
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
  - Harvester
  - 鉴权与认证
---

## Authentication

_从 v0.2.0 开始可用_

在 ISO 安装模式下，用户在第一次登录时将被提示为默认的`admin`用户设置密码。

![auth](/img/harvester/first-log-in.png)

用户首次登录 Harvester 所看见的页面如下图所示：

![auth](/img/harvester/authentication.png)

## 开发者模式

开发者模式，即`developer mode`。在仅用于开发和测试目的的 `developer mode`中，可通过环境变量 `HARVESTER_AUTHENTICATION_MODE`配置更多的认证模式。

默认情况下，Harvester Dashboard 使用`local auth`模式进行认证。默认的用户名和密码是`admin/password`。目前支持的选项是`localUser`（与`local auth`模式相同）和`kubernetesCredentials`。

如果使用`kubernetesCredentials`认证选项，`kubeconfig`文件或承载令牌可以提供对 Harvester 的访问。
