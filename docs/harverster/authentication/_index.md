---
title: 鉴权与认证
description:
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

## 概述

Harvester 仪表盘支持 `local auth`模式的身份验证，默认的用户名和密码是`admin/password`。

Harvester 的登录页面如下图所示：

![auth](/img/harvester/authentication.png)

## App Mode 的认证选项

在仅用于开发和测试目的的 `App mode`中，您可以使用环境变量`HARVESTER_AUTHENTICATION_MODE`配置其他的认证模式。

目前支持的选项是`localUser`（与`local auth`模式相同）和`kubernetesCredentials`。

如果使用`kubernetesCredentials`认证选项，无论是 kubconfig 文件还是 bearer token 都可以提供对 Harvester 的访问。
