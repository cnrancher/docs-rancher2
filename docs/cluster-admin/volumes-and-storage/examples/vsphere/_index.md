---
title: vSphere 存储
---

在为 StatefulSet 提供 vSphere 存储时，建议创建 vSphereVolume [存储类](/docs/cluster-admin/volumes-and-storage/_index)。当工作负载通过[持久卷声明](/docs/cluster-admin/volumes-and-storage/how-storage-works/_index)请求卷时，此做法可动态配置 vSphere 存储。

## 先决条件

在 [RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)中配置 vSphere 卷时，需要先在[集群选项](/docs/cluster-provisioning/rke-clusters/options/_index)中配置好[vSphere Cloud Provider](https://rancher.com/docs/rke/latest/en/config-options/cloud-providers/vsphere)的信息。

## 创建存储类

> **注意：**
>
> 也可以使用`kubectl`命令行工具来执行以下步骤。相关的详细信息，请参阅[Kubernetes 关于持久卷的文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)。

1. 在**全局**页面中，点选要提供 vSphere 存储的集群。
2. 在主菜单中，下拉**存储**，选择**存储类**。然后点击**添加存储类**。
3. 输入类型的**名称**。
4. 在**提供者**列表中，选择**VMWare vSphere 卷**。

   ![vsphere-storage-class](/img/rancher/vsphere-storage-class.png)

5. 可选：可以在**参数**下为此存储类型指定其他属性。相关的详细信息，请参阅[vSphere 存储文档](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/storageclass.html)。
6. 点击**保存**。

## 使用 vSphere 卷创建工作负载

1. 在配置了 vSphere 存储的集群里，按照[部署工作负载](/docs/k8s-in-rancher/workloads/deploy-workloads/_index)的流程来创建工作负载。
2. 在**工作负载类型**中，选择**StatefulSet**，Pod 数量为 1。
3. 展开**卷**列表，并点击**添加卷**。
4. 选择**添加一个新的持久卷(声明)**. 在部署工作负载后，该选项将隐式地创建一个卷声明。
5. 为卷声明分配一个**名称**，例如`test-volume`，然后选择在上一步中创建的 vSphere 存储类。
6. 输入所需的卷**容量**，随后点击**定义**。

   ![workload-add-volume](/img/rancher/workload-add-volume.png)

7. 在**挂载点**中填写路径，这将是容器文件系统中挂载卷的完整路径，例如：`/persistent`。
8. 点击**启动**以创建工作负载。

## 检验卷的持久性

1. 在刚刚创建的工作负载的菜单中选择**执行 Shell**。
2. 记下卷挂载的完整路径，在本例中是`/persistent`。
3. 在卷中创建一个文件：`touch /persistent/data.txt`。
4. 点击**关闭**，关闭这个 shell。
5. 单击工作负载的名称以显示详细信息。
6. 打开**运行中**Pod 旁边的菜单。
7. 选择**删除**，删除这个 Pod。
8. 观察 Pod 被重新调度并功运行。
9. 再次点击**执行 Shell**。
10. 通过输入`ls -l /persistent`，检查挂载卷的目录。请注意，您之前创建的文件应该存在。

    ![workload-persistent-data](/img/rancher/workload-persistent-data.png)

### 为什么使用 StatefulSet 替代 Deployment

在选择使用 vSphere 存储的工作负载时，应该始终选择 [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)，因为此资源类型旨在解决 VMDK 块存储的告警。

由于 vSphere 卷由 VMDK 块存储支持，因此它们仅支持 ReadWriteOnce 的[访问模式](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。此设置限制了卷，除非消耗该卷的所有 Pod 都位于同一节点上，否则一次只能将其挂载到一个 Pod 上。如果使用 vSphere 卷，此行为将导致 Deployment 类型的工作负载不可用，因为无法扩展为多个副本。

即便仅使用一个副本的 Deployment，也可能在更新部署时导致死锁。如果将更新后的 Pod 调度到与原来 Pod 不同的节点，那它将无法启动，因为 VMDK 仍附加在原来 Pod 的节点上。

### 相关链接

- [适用于 Kubernetes 的 vSphere 存储](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/)
- [Kubernetes 持久卷](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
