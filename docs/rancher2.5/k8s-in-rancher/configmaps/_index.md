---
title: 配置映射
description: 和大多数 kubernetes 密文类型配置存储敏感信息不同，配置映射（ConfigMaps）主要用于存储常规的配置信息， 例如一组配置文件。由于配置映射不存储敏感信息， 因此它们在更新配置完成以后可以被自动刷新， 而不需要在更新后重新启动容器生效 (不像大多数密文类型配置， 需要手动更新并重新启动容器才能生效)。ConfigMap 接受通用字符串格式的键值对， 例如配置文件或者 JSON. 在您上传 config map 配置以后， 任何工作负载都可以将此配置引用为环境变量或者以数据卷形式挂载使用。
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
  - 用户指南
  - 配置映射
---

和大多数 kubernetes 密文类型配置存储敏感信息不同，[配置映射（ConfigMaps）](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) 主要用于存储常规的配置信息， 例如一组配置文件。由于配置映射不存储敏感信息， 因此它们在更新配置完成以后可以被自动刷新， 而不需要在更新后重新启动容器生效 (不像大多数密文类型配置， 需要手动更新并重新启动容器才能生效)。

ConfigMap 接受通用字符串格式的键值对， 例如配置文件或者 .JSON 文件。 在您上传 config map 配置以后， 任何工作负载都可以将此配置引用为环境变量或者以数据卷形式挂载使用。

如果您是将配置映射通过`subPath`的方式挂载的，那么对正在使用的配置映射的任何更新，都不会自动更新到正在使用它的 Pod 里。所以您需要重新启动这些 Pod，以使新配置映射生效。

> **注意：** 配置映射仅仅只能应用于命名空间（namespaces）而不能应用于项目。

1. 从 **全局** 视图， 选择包含要向其添加配置映射的命名空间所在的项目。

1. 从主菜单选择 **资源 > 配置映射**。单击 **添加配置映射**。

1. 输入配置映射的 **名称** 。

   > **注意：** Kubernetes 区别 ConfigMaps 作为 [密文](https://kubernetes.io/docs/concepts/configuration/secret/)， 并且项目或命名空间中的两个密文都不能具有重复的名称。因此， 为防止冲突，您的配置映射必须和在工作空间内的其他证书，配置映射，镜像库凭证和密文一样具有唯一的名称。

1. 选择您想要添加配置映射的 **命名空间**。您也可以通过单击 **创建新的命名空间**添加一个全新的命名空间（namespace）。

1. 从次级**配置映射**视图， 单击 **添加配置映射** 为您的配置映射添加一个键值对。也可以根据您的需要添加更多的值。

1. 单击 **保存**。

   > **注意：** 不要使用配置映射去存储敏感数据 [使用一个密文](/docs/rancher2.5/k8s-in-rancher/secrets/_index)。
   >
   > **提示：** 您可以通过复制和粘贴的方式将多个键值对添加到 ConfigMap 中。
   >
   > ![Bulk Key Value Pair Copy/Paste](/img/rancher/bulk-key-values.gif)

**效果：** 您的 ConfigMap 被添加到命名空间（namespace）。您可以通过 Rancher UI 的 **资源 > 配置映射** 视图查看到它。

## 后续操作

现在您已将配置映射添加到命名空间，您也可以将其添加到从原有命名空间部署的工作负载中。您可以使用配置映射来指定供应用程序使用的信息，例如：

- 应用程序的环境变量。
- 作为设定配置参数的数据卷以文件的形式挂载给工作负载使用。

有关 ConfigMap 添加到工作负载的更多信息，请参见[部署工作负载](/docs/rancher2.5/k8s-in-rancher/workloads/deploy-workloads/_index)。
