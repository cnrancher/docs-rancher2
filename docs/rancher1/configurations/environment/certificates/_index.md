---
title: 证书
---

# 添加证书

可以在**基础架构** -> **证书**页面把证书添加到您的[环境](/docs/rancher1/configuration/environments/_index)里。这个页面已经列出了所有已添加到 Rancher 环境的证书。您可以点击**添加证书**添加一个新证书。

1. 填写证书**名称**和**描述**。

2. 填写证书**私钥**。您可以点击**从文件读取**导入文件或粘贴私钥到文本框。

3. 填写**证书**。您可以点击**从文件读取** 导入文件或粘贴证书到文本框。

4. (可选) 如果您有其它的**证书链**，您也可以通过**从文件读取**导入文件或粘贴证书链到文本框。

## 使用证书

添加到环境的证书可用作[负载均衡的 SSL 终端](/docs/rancher1/infrastructure/cattle/adding-load-balancers/_index_index#ssl会话终止)或[Kubernetes 入口的 TSL 终端](/docs/rancher1/kubernetes/ingress/_index#tls)。
