---
title: 配置 NGINX
description: 首先在负载均衡器主机上安装 NGINX。NGINX 具有可用于所有已知操作系统的软件包。
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
  - 安装指南
  - 资料、参考和高级选项
  - RKE Add-on 安装
  - Rancher 高可用 7层LB
  - 配置 NGINX
---

:::important 重要提示
RKE add-on 安装仅支持 Rancher v2.0.8 之前的版本。
请使用 Rancher helm chart 将 Rancher 安装在 Kubernetes 集群上。有关详细信息，请参见[Rancher 高可用安装](/docs/rancher2.5/installation/k8s-install/_index)。
如果您当前正在使用 RKE add-on 安装方法，参见[将 RKE add-on 安装的 Rancher 迁移到 Helm 安装](/docs/rancher2.5/installation_new/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/_index)，获取有关如何使用 Helm chart 的详细信息。
:::

## 安装 NGINX

首先在负载均衡器主机上安装 NGINX。NGINX 具有可用于所有已知操作系统的软件包。

有关安装 NGINX 的帮助，请参阅其 [安装文档](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)。

## 创建 NGINX 配置

请参见[NGINX 配置示例](/docs/rancher2.5/installation/options/chart-options/_index#nginx-配置示例)。

## 运行 NGINX

重新加载或重启 NGINX

```
# Reload NGINX
nginx -s reload

# Restart NGINX
# Depending on your Linux distribution
service nginx restart
systemctl restart nginx
```

## 浏览 Rancher UI

您现在应该能够浏览到 `https://FQDN`。
