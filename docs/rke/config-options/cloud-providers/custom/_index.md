---
title: 自定义云服务提供商
description: 本文介绍了配置自定义云服务提供商的操作步骤。
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
  - RKE
  - 配置选项
  - 云服务提供商
  - 自定义云服务提供商
---

如果您想启用其他的云提供商，RKE 允许用户配置自定义云提供商选项。用必须提供一个名称，自定义云提供商选项可以作为`customCloudProvider`中的多行字符串传递进来。

例如，为了使用 oVirt 云提供商与 Kubernetes，需要提供以下信息：

```
[connection]
uri = https://localhost:8443/ovirt-engine/api
username = admin@internal
password = admin
```

要将这个云配置文件添加到 RKE 中，需要设置`cloud_provider`。

```yaml
cloud_provider:
  name: ovirt
  # Note the pipe as this is what indicates a multiline string
  customCloudProvider: |-
    [connection]
    uri = https://localhost:8443/ovirt-engine/api
    username = admin@internal
    password = admin
```
