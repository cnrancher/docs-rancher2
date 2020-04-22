---
title: 设置集群
description: 使用 Rancher 创建 Kubernetes 集群之后，仍然可以编辑该集群的选项和设置。要编辑您的集群，请打开 **全局** 视图， 确保选中 **集群** 选项卡， 然后为您要编辑的集群选择 **省略号 (...) > 编辑**
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
  - 集群管理员指南
  - 集群访问控制
  - 设置集群
---

使用 Rancher 创建 Kubernetes 集群之后，仍然可以编辑该集群的选项和设置。要编辑您的集群，请打开 **全局** 视图， 确保选中 **集群** 选项卡， 然后为您要编辑的集群选择 **省略号 (...) > 编辑**

<sup>编辑现有集群</sup>

![编辑集群](/img/rancher/edit-cluster.png)

现有集群的可用选项和设置将根据用于提供它的方法进行更改。例如，只有集群[由 RKE 创建](/docs/cluster-provisioning/rke-clusters/_index)才有可用于编辑的 **集群选项**。

下表总结了每种集群类型可用的选项和设置:

| Rancher 可做到 | RKE 启动的集群 | 托管的 Kubernetes 集群 | 导入的集群 |
| -------------- | -------------- | ---------------------- | ---------- |
| 管理成员角色   | ✓              | ✓                      | ✓          |
| 编辑集群选项   | ✓              |                        |            |
| 管理节点池     | ✓              |                        |            |

## 编辑集群成员

集群管理员可以[编辑集群的成员资格](/docs/cluster-admin/cluster-access/cluster-members/_index)控制哪些 Rancher 用户可以访问集群以及他们可以使用哪些功能模块。

## 集群选项

在编辑集群时，[使用 RKE 启动](/docs/cluster-provisioning/rke-clusters/_index)的集群比由 Kubernetes 提供商导入或托管的集群具有更多的选项。文档选项后面的标题仅对 RKE 集群可用。

### 更新 ingress-nginx

使用 Kubernetes 1.16 之前的版本创建的集群会有一个`OnDelete`的 `ingress-nginx` `updateStrategy`。使用 Kubernetes 1.16 或更新版本创建的集群会有 `RollingUpdate`.

如果 `ingress-nginx`的 `updateStrategy` 是 `OnDelete`, 那么您需要删除这些 pod 以获得正确的部署版本。

## 编辑其他集群选项

在[由 RKE 启动的集群](/docs/cluster-provisioning/rke-clusters/_index)，您可以编辑以下任何其它的选项。

> **注意：** 这些选项对于导入的集群或托管的 Kubernetes 集群是不可用的。

<sup>RKE 集群的选项</sup>

![集群选项](/img/rancher/cluster-options.png)

| 选项                 | 描述                                                                                                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kubernetes 版本      | 每个集群节点上安装的 Kubernetes 版本。更多细节，请参阅[升级 Kubernetes](/docs/cluster-admin/upgrading-kubernetes/_index).                                                                                                     |
| 网络提供商           | 为您的集群提供联网功能的[容器联网接口](/docs/faq/networking/_index)。<br/><br/>**注意：** 您只能在配置集群时选择此选项。以后无法编辑。                                                                                        |
| 项目网络隔离         | 从 Rancher v2.0.7 开始，如果您正在使用 Canal 网络提供商，您可以选择启用或禁用项目间通信。                                                                                                                                     |
| Nginx Ingress        | 如果您希望以高可用性配置发布应用程序，并且您使用的是没有本地负载均衡功能的云提供商来托管节点，那么请启用此选项，以便在集群中使用 Nginx ingress。                                                                              |
| 度量服务器监控       | 每个能够使用 RKE 启动集群的云提供商都可以收集指标并监视您的集群节点。启用此选项可从云提供商的门户查看您的节点指标。                                                                                                           |
| Pod 安全政策支持     | 为集群启用[pod 安全策略](/docs/admin-settings/pod-security-policies/_index)。启用此选项后，使用 **默认 Pod 安全策略** 下拉列表选择一个策略。                                                                                  |
| 节点上的 Docker 版本 | 配置不管节点是否允许运行 Rancher 不正式支持的 Docker 版本。如果您选择需要一个[受支持的 Docker 版本](/docs/installation/options/rke-add-on/layer-7-lb/_index)，Rancher 将停止在没有安装受支持的 Docker 版本的节点上运行 pods。 |
| Docker 根目录        | 集群节点上安装 Docker 的目录。如果在节点上将 Docker 安装到非默认目录，请更新此路径。                                                                                                                                          |
| 默认 Pod 安全策略    | 如果启用了 **Pod 安全策略支持**，请使用此下拉菜单选择应用于集群的 Pod 安全策略。                                                                                                                                              |
| 云提供商             | 如果您使用云提供商来托管由 RKE 启动的集群节点，请启用[此选项](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index)，以便您可以使用云提供商的本地特性。如果您希望为您的云托管集群存储持久数据，则需要此选项。       |

## 编辑集群 YAML

> **注意：** 在 Rancher v2.0.5 和 v2.0.6 中，配置文件(YAML)中的服务名称应该只包含下划线: `kube_api` 和`kube_controller`。

高级用户可以创建一个 RKE 配置文件，而不是使用 Rancher UI 为集群选择 Kubernetes 选项。通过使用配置文件，可以在 YAML 中指定 RKE 安装中可用的任何选项，system_images 配置除外。

- 要直接从 Rancher UI 编辑 RKE 配置文件， 请单击 **编辑 YAML**。
- 要从现有的 RKE 文件中读取， 请点击 **从文件读取**。

Rancher v2.0.0-v2.2.x，配置文件与[Rancher Kubernetes Engine 的集群配置文件](https://rancher.com/docs/rke/latest/en/config-options/)相同，Rancher 使用该配置文件来创建集群。在 Rancher v2.3.0 中，RKE 信息仍然包含在配置文件中，但是它与其他选项分离，因此 RKE 集群配置选项嵌套在`rancher_kubernetes_engine_config` 指令下。有关更多信息，请参阅[集群配置参考资料](/docs/cluster-provisioning/rke-clusters/options/_index)。

![image](/img/rancher/cluster-options-yaml.png)

有关 RKE 配置文件语法的示例，请参阅[RKE 文档](https://rancher.com/docs/rke/latest/en/example-yamls/)。
