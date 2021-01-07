---
title: HTTP 代理配置
description: 如果您在代理后面操作 Rancher，并且想要通过代理访问服务（例如拉取应用商店），则必须提供有关 Rancher 代理的信息。由于 Rancher 是用 Go 编写的，因此它使用了常见的代理环境变量，如下所示。
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
  - 安装指南
  - 其他安装方法
  - 单节点安装
  - HTTP 代理配置
---

如果您在代理后面操作 Rancher，并且想要通过代理访问服务（例如拉取应用商店），则必须提供有关 Rancher 代理的信息。Rancher 使用了常见的代理环境变量，如下表所示。

> 请确保`NO_PROXY`包含不应使用代理的网络地址，网络地址范围和域。

| 环境变量名称 | 描述                                   |
| :----------- | :------------------------------------- |
| HTTP_PROXY   | HTTP 连接的代理地址                    |
| HTTPS_PROXY  | HTTPS 连接的代理地址                   |
| NO_PROXY     | 不使用代理的网络地址，网络地址范围和域 |

> **注意** NO_PROXY 必须为大写才能使用网络范围（CIDR）表示法。

## 单节点安装

可以使用 `-e KEY = VALUE` 或 `--env KEY = VALUE` 将环境变量传递到 Rancher 容器。单节点安装中的`NO_PROXY`的值必须包括：

- `localhost`
- `127.0.0.1`
- `0.0.0.0`
- `10.0.0.0/8`

以下示例使用了可以通过`http://192.168.0.1:3128`访问的代理服务器，并且在访问网络范围“192.168.10.0/24”以及域“example.com”下的每个主机名时，不使用代理。

```
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -e HTTP_PROXY="http://192.168.10.1:3128" \
  -e HTTPS_PROXY="http://192.168.10.1:3128" \
  -e NO_PROXY="localhost,127.0.0.1,0.0.0.0,10.0.0.0/8,192.168.10.0/24,example.com" \
  rancher/rancher:latest
```
