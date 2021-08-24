---
title: 上传镜像
description: 要在Images页面中上传虚拟机镜像，请输入可从集群访问的 URL。镜像名称将使用 URL 地址的文件名自动填充。您可以根据需要随时修改。
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
  - 上传镜像
---

## 上传镜像

要在 **Images** 页面中上传虚拟机镜像，请输入可从集群访问的 URL。镜像名称将使用 URL 地址的文件名自动填充。您可以根据需要随时修改。

:::note

- 镜像名称将使用 URL 地址的文件名自动填充。你可以在需要时随时修改它。
- 目前还不支持从 UI 上传图片到 Harvester 集群。该功能请求正在被追踪[#570](https://github.com/harvester/harvester/issues/570)。

:::

目前，我们支持 qcow2、raw 和 ISO 镜像。

描述和标签不是必填项。

![](/img/harvester/upload-image.png)
