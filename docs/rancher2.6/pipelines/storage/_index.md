---
title: 为管道组件配置持久数据
weight: 600
---

默认情况下，管道内部的 Docker 镜像仓库和 Minio 工作负载都使用临时卷。这是开箱即用的默认存储方式，能让测试变得更加便利。但如果运行 Docker 镜像仓库或 Minio 的节点出现故障，你将丢失构建镜像和构建日志。在大多数情况下，这不是太大的问题。如果你希望构建镜像和日志能够在节点故障中幸免于难，你可以让 Docker 镜像仓库和 Minio 使用持久卷。

本节假设你了解持久存储在 Kubernetes 中的工作原理。如需更多信息，请参阅[存储的工作原理]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/how-storage-works/)。

> **先决条件（适用于 A 和 B）：**
>
> [持久卷]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/)必须在集群中可用。

### A. 为 Docker 镜像仓库配置持久数据

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 点击**工作负载**。

1. 找到 `docker-registry` 工作负载并选择 **⋮ > 编辑**。

1. 滚动到**卷**部分并展开它。从底部的**添加卷**菜单中选择以下选项之一：

   - **添加卷 > 添加新的持久卷（声明）**
   - **添加卷 > 使用已有的持久卷（声明）**

1. 完成为内部 Docker 镜像仓库选择持久卷的表单。
   import Tabs from '@theme/Tabs';
   import TabItem from '@theme/TabItem';

   <Tabs
   defaultValue="new"
   values={[
   { label: '添加新的持久卷', value: 'new', },
   { label: '使用已有的持久卷', value: 'existing', },
   ]}>

   <TabItem value="new">
   <br/>

   1. 输入卷声明的**名称**。
      1. 选择一个卷声明**源**：

         - 如果你选择**使用存储类来配置新持久卷**，请选择存储类并输入**容量**。
         - 如果你选择**使用已有的持久卷**，请从下拉列表中选择**持久卷**。
      1. 从**自定义**中，选择卷的读/写访问权限。
      1. 单击**定义**。

</TabItem>

<TabItem value="existing"><br/>

   1. 输入卷声明的**名称**。

      1. 从下拉列表中选择**持久卷声明**。

      1. 从**自定义**中，选择卷的读/写访问权限。

      1. 单击**定义**。

</TabItem>

</Tabs>

1. 在**挂载点**字段中，输入 `/var/lib/registry`，这是 Docker 镜像仓库容器内的数据存储路径。

1. 点击**升级**。

### B. 为 Minio 配置持久数据

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 点击**工作负载**。
1. 转到 `minio` 工作负载并选择 **⋮ > 编辑**。

1. 滚动到**卷**部分并展开它。从底部的**添加卷**菜单中选择以下选项之一：

   - **添加卷 > 添加新的持久卷（声明）**
   - **添加卷 > 使用已有的持久卷（声明）**

1. 完成为内部 Docker 镜像仓库选择持久卷的表单。
   import Tabs from '@theme/Tabs';
   import TabItem from '@theme/TabItem';

   <Tabs
   defaultValue="new"
   values={[
   { label: '添加新的持久卷', value: 'new', },
   { label: '使用已有的持久卷', value: 'existing', },
   ]}>

<TabItem value="new">
<br/>

   1. 输入卷声明的**名称**。

      1. 选择一个卷声明**源**：

         - 如果你选择**使用存储类来配置新持久卷**，请选择存储类并输入**容量**。

         - 如果你选择**使用已有的持久卷**，请从下拉列表中选择**持久卷**。
      1. 从**自定义**中，选择卷的读/写访问权限。

      1. 单击**定义**。

</TabItem>

<TabItem value="existing">
<br/>

   1. 输入卷声明的**名称**。

      1. 从下拉列表中选择**持久卷声明**。

      1. 从**自定义**中，选择卷的读/写访问权限。

      1. 单击**定义**。

</TabItem>
</Tabs>

1. 在**挂载点**字段中，输入 `/data`，这是 Minio 容器内的数据存储路径。

1. 点击**升级**。

**结果**：已为你的管道组件配置了持久存储。
