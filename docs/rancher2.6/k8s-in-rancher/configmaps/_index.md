---
title: ConfigMap
weight: 3061
---

大多数 Kubernetes 密文用于存储敏感信息，但是 [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) 会存储一般配置信息，例如一组配置文件。由于 ConfigMap 不存储敏感信息，因此 ConfigMap 可以自动更新，不需要在更新后重启其容器（其他类型的密文大多需要手动更新和重启容器后才能生效）。

ConfigMap 接受常见字符串格式的键值对，例如配置文件或 JSON Blob。上传配置映射后，任何工作负载都可以将其引用为环境变量或卷挂载。

1. 点击左上角 **☰ > 集群管理**。
1. 转到具有要引用 ConfigMap 的工作负载的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**更多资源 > 核心 > ConfigMaps**。
1. 单击**创建**。
1. 输入 ConfigMap 的**名称**。

   > **注意**：Kubernetes 将 ConfigMap 归类为[密文](https://kubernetes.io/docs/concepts/configuration/secret/)，项目或命名空间中的密文不能重名。因此，为了避免冲突，ConfigMap 的名称必须与工作空间中的其他证书、镜像仓库和密文不一样。

1. 选择要添加 ConfigMap 的**命名空间**。

1. 在**数据**选项卡上，将键值对添加到你的 ConfigMap。你可以根据需要添加任意数量的值。通过复制和粘贴的方式将多个键值对添加到 ConfigMap。你也可以使用**从文件读取**来添加数据。请注意，如果要存储敏感数据，请[使用密文]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/secrets/)，不要使用 ConfigMap。
1. 单击**创建**。

**结果**：已将 ConfigMap 添加到命名空间。你可以在 Rancher UI 的**资源 > ConfigMaps** 视图中查看它。

## 后续操作

现在你已经将 ConfigMap 添加到命名空间，你可以将其添加到原始命名空间部署的工作负载中。你可以使用 ConfigMap 指定应用程序使用的信息，例如：

- 应用程序环境变量。
- 指定安装到工作负载的卷的参数。

有关将 ConfigMap 添加到工作负载的更多信息，请参阅[部署工作负载]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/deploy-workloads/)。
