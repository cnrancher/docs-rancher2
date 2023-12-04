---
title: 升级
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
  - 常见问题
  - 升级
---

## x509: certificate relies on legacy Common Name field, use SANs or temporarily enable Common Name matching with GODEBUG=x509ignoreCN=0"

当我们升级**自签名证书**安装的 Rancher Server 到 2.5.10 以上，或 2.6.x 后，cluster-agent/node-agent 有可能会报下面的错，导致 cluster-agent/node-agent 无法启动：

```
x509: certificate relies on legacy Common Name field, use SANs or temporarily enable Common Name matching with GODEBUG=x509ignoreCN=0"
```

这是因为 Rancher 把 v2.5.10 以上，或 2.6.x 之后将 go 版本从 1.14 提升到了 1.16。而且，go 1.15 版本开始废弃 CommonName，推荐使用 SAN 证书，参考：https://golang.org/doc/go1.15#commonname 。 如果你的自签名证书中不包含 SANs，就会出现上面的报错。

要解决这个问题，有两种方案：

### 方案 1：替换 Rancher HA 证书

使用[一键生成 ssl 自签名证书脚本](/docs/rancher2.5/installation/resources/advanced/self-signed-ssl/_index/#41-一键生成-ssl-自签名证书脚本) 重新生成证书，然后参考[无需重新搭建集群，轻松替换证书](https://mp.weixin.qq.com/s/7Ym6VKGdRsj2qnJT2_zqRA)替换 Rancher HA 的证书。

### 方案 2：添加环境变量 `GODEBUG=x509ignoreCN=0`

1. 更新 Rancher Server ，添加环境变量`GODEBUG=x509ignoreCN=0`

升级 Rancher 通过`extraEnv`设置环境变量`GODEBUG=x509ignoreCN=0`，例如：

```
helm upgrade rancher rancher-latest/rancher \
  --namespace cattle-system \
  ...
  --set 'extraEnv[0].name=GODEBUG'\
  --set 'extraEnv[0].value=x509ignoreCN=0' \
  ...
```

2. 更新 Rancher Agent，添加环境变量`GODEBUG=x509ignoreCN=0`

编辑下游集群，点击 `Add Environmenet Variable`，设置环境变量，如下：

![添加agent变量](/img/rancher/add-env-var.png)

保存，等待集群更新成功，此时， cattle-cluster-agent 和 cattle-node-agent 恢复为 `Active` 状态
