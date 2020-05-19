---
title: 安装
description: 
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
  - 常见问题
  - 安装
---

## Agent无法连接Rancher server

### ERROR: https://x.x.x.x/ping is not accessible (Failed to connect to x.x.x.x port 443: Connection timed out)

```bash
ERROR: https://x.x.x.x/ping is not accessible (Failed to connect to x.x.x.x port 443: Connection timed out)
```
在`cattle-cluster-agent`或`cattle-node-agent`中出现以上错误，代表agent无法连接到rancher server，请按照以下步骤排查网络连接：

- 从agent宿主机访问rancher server的443端口，例如：`telnet x.x.x.x 443`
- 从容器内访问rancher server的443端口，例如：`telnet x.x.x.x 443`

### ERROR: https://rancher.my.org/ping is not accessible (Could not resolve host: rancher.my.org)

```bash
ERROR: https://rancher.my.org/ping is not accessible (Could not resolve host: rancher.my.org)
```

在`cattle-cluster-agent`或`cattle-node-agent`中出现以上错误，代表agent无法通过域名解析到rancher server，请按照以下步骤进行排查网络连接：

- 从容器内访问通过域名访问rancher server，例如：`ping rancher.my.org`

这个问题在内网并且无DNS服务器的环境下非常常见，即使在/etc/hosts文件中配置了映射关系也无法解决，这是因为`cattle-node-agent`从宿主机的/etc/resolv.conf中继承`nameserver`用作dns服务器。

所以要解决这个问题，可以在环境中搭建一个dns服务器，配置正确的域名和IP的对应关系，然后将每个节点的`nameserver`指向这个dns服务器。或者使用[HostAliases](https://kubernetes.io/zh/docs/concepts/services-networking/add-entries-to-pod-etc-hosts-with-host-aliases/)
