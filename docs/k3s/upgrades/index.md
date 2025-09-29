---
title: "升级介绍"
description: 本节介绍如何升级 K3s 集群。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - 升级介绍
---

## 升级 K3s 集群

[基础升级](/docs/k3s/upgrades/basic/)描述了手动升级集群的几种技术。它也可以作为通过第三方基础设施即代码工具（如[Terraform](https://www.terraform.io/)）进行升级的基础。

[自动升级](/docs/k3s/upgrades/automated/)描述了如何使用 Rancher 的[system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)执行 Kubernetes 原生的自动升级。

## 特定版本的注意事项

- **Traefik：**如果没有禁用 Traefik，K3s 1.20 及以前的版本将安装 Traefik v1，而 K3s 1.21 及以后的版本将安装 Traefik v2。要从旧的 Traefik v1 升级到 Traefik v2，请参考 [Traefik 文档](https://doc.traefik.io/traefik/migration/v1-to-v2/)并使用[迁移工具](https://github.com/traefik/traefik-migration-tool)。

- **K3s 引导数据：**如果你在 HA 配置中使用 K3s 与外部 SQL 数据存储，并且你的 k3s server（control-plane）节点没有用 `--token` CLI 标志启动，你将不再能够添加额外的 K3s server 到集群而不指定 token。确保你保留一份该令牌的副本，因为从备份恢复时需要它。以前，在使用外部 SQL 数据存储时，K3s 没有强制使用令牌。

  - 受影响的版本是<= v1.19.12+k3s1, v1.20.8+k3s1, v1.21.2+k3s1；修补后的版本是 v1.19.13+k3s1, v1.20.9+k3s1, v1.21.3+k3s1。

  - 你可以从任何已经加入集群的 server 中检索令牌值，方法如下:

    ```
    cat /var/lib/rancher/k3s/server/token
    ```

- **实验性 Dqlite：**实验性嵌入式 Dqlite 数据存储在 K3s v1.19.1 中被废弃。请注意，不支持从实验性 Dqlite 到实验性嵌入式 etcd 的升级。如果你尝试升级，它将不会成功，而且数据会丢失。
