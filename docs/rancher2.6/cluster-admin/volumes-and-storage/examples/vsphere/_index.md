---
title: vSphere 存储
weight: 3055
---

要为有状态的工作负载提供 vSphere 存储，我们建议创建一个 vSphereVolume StorageClass。当工作负载通过 PersistentVolumeClaim 请求卷时，这种做法会动态调配 vSphere 存储。

为了在 vSphere 中动态调配存储，必须[启用 vSphere 提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/vsphere)。

- [前提](#prerequisites)
- [创建一个 StorageClass](#creating-a-storageclass)
- [创建使用 vSphere 卷的工作负载](#creating-a-workload-with-a-vsphere-volume)
- [验证卷的持久性](#verifying-persistence-of-the-volume)
- [为什么使用 StatefulSet 替代 Deployment](#why-to-use-statefulsets-instead-of-deployments)

### 前提

为了在 [Rancher Kubernetes Engine (RKE)]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 集群中配置 vSphere 卷，[vSphere cloud provider]({{<baseurl>}}/rke/latest/en/config-options/cloud-providers/vsphere) 必须在[集群选项]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options/)中显式启用。

### 创建一个 StorageClass

> **注意**：
>
> 你也可以使用 `kubectl` 命令行工具来执行以下步骤。有关详细信息，请参阅[关于持久卷的 Kubernetes 文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)。

1. 点击 **☰ > 集群管理**。
1. 转到要配置 vSphere 存储的集群。
1. 在左侧导航栏中，单击**存储 > 存储类**。
1. 单击**创建**。
1. 输入存储类的**名称**。
1. 在 **Provisioner**下，选择 **VMWare vSphere 卷**。

   {{< img "/img/rancher/vsphere-storage-class.png" "vsphere-storage-class">}}

1. 可选地，你可以在**参数**下指定存储类的其他属性。有关详细信息，请参阅 [vSphere 存储文档](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/storageclass.html)。
1. 单击**创建**。

### 创建使用 vSphere 卷的工作负载

1. 在左侧导航栏中，单击**工作负载**。
1. 单击**创建**。
1. 单击 **StatefulSet**。
1. 在**卷声明模板**选项卡上，单击**添加声明模板**。
1. 输入持久卷名称。
1. 在**存储类**字段中，选择你创建的 vSphere 存储类。
1. 输入卷所需的**容量**。然后单击**定义**。
1. 在**挂载点**字段中指定路径。这是卷将安装在容器文件系统中的完整路径，例如 `/persistent`。
1. 单击**创建**。

### 验证卷的持久性

1. 在左侧导航栏中，单击**工作负载 > Pod**。
1. 转到你刚刚创建的工作负载，然后单击 **⋮ > 执行命令行**。
1. 请注意卷已挂载到的根目录下的目录（在本例中为 `/persistent`）。
1. 通过执行命令 `touch /<volumeMountPoint>/data.txt` 在卷中创建一个文件。
1. 关闭 shell 窗口。
1. 单击工作负载的名称以显示详细信息。
1. 单击 **⋮ > 删除**。
1. 观察 pod 是否被删除。为了让工作负载维持在所配置的单个有状态 pod 的规模，之后会调度一个新的 Pod 来替换该 Pod。
1. 替换的 pod 运行后，单击**执行命令行**。
1. 输入 `ls -l /<volumeMountPoint>` 以检查卷所挂载的目录的内容。请注意，你之前创建的文件仍然存在。

![workload-persistent-data]({{<baseurl>}}/img/rancher/workload-persistent-data.png)

### 为什么使用 StatefulSet 替代 Deployment

对于消耗 vSphere 存储的工作负载，你应该始终使用 [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)，因为这种资源类型旨在解决 VMDK 块存储警告。

由于 vSphere 卷由 VMDK 块存储支持，因此它们仅支持 `ReadWriteOnce` 的[访问模式](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。此设置限制卷，使其一次只能挂载到一个 pod（除非使用该卷的所有 pod 位于同一节点上）。如果 deployment 资源消耗 vSphere 卷，则 deployment 资源无法用于扩展到超出单个副本。

即使使用仅具有单个副本的 deployment 资源也可能在更新 deployment 时出现死锁情况。如果更新的 pod 被调度到不同的节点，由于 VMDK 仍然连接到另一个节点，因此 pod 将无法启动。

### 相关链接

- [用于 Kubernetes 的 vSphere 存储](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/)
- [Kubernetes 持久卷](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
