---
title: 问题排查
description: 本文介绍了为 vSphere 虚拟机启用磁盘 UUIDs的操作步骤。
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
  - vSphere
  - 问题排查
---

如果在使用已启用的 vSphere Cloud Provider 配置集群时或为工作负载创建 vSphere 卷时遇到问题，应检查以下 K8s 服务的日志：

- controller-manager（负责管理 vCenter 中的存储卷）
- kubelet（负责将 vSphere 卷挂载到 pods）

如果你的集群没有配置外部[集群日志](/docs/rancher2/project-admin/tools/project-logging/_index)，你将需要通过 SSH 进入节点来获取 `kube-controller-manager`和 `kubelet`的日志。

使用 Rancher CLI 工具与节点创建 SSH 会话的是最简单方法。

1.  为您的集群[配置 Rancher CLI](/docs/rancher2/cli/_index)。
2.  运行下面的命令，可以得到对应节点的 shell。

    ```sh
    rancher ssh `<nodeName>`
    ```

3.  检查控制器-管理器和 kubelet 容器的日志，查找与 vSphere 云提供商相关的错误。

    ```sh
    docker logs --since 15m kube-controller-manager
    docker logs --since 15m kubelet
    ```
