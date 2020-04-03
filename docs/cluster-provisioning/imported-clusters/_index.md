---
title: 将现有集群导入 Rancher
---

当管理一个导入的集群时，Rancher 将连接到一个已经设置好的 Kubernetes 集群。因此，Rancher 不提供 Kubernetes，而只设置 Rancher Agent 来与集群通信。

请记住，编辑您的 Kubernetes 集群仍然需要在 Rancher 之外完成，包括添加和删除节点、升级 Kubernetes 版本以及更改 Kubernetes 组件参数。

## 先决条件

如果您现有的 Kubernetes 集群已经定义了一个`集群管理员`角色，那么您必须拥有这个`集群管理员`特权才能将集群导入 Rancher。

为了获得特权, 您需要运行：

```plain
kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole cluster-admin \
  --user [USER_ACCOUNT]
```

在运行`kubectl`命令以导入集群之前。

默认情况下，GKE 用户不会获得此权限，因此您需要在导入 GKE 集群之前运行该命令。要了解有关 GKE 基于角色的访问控制的详细信息，请单击[此处](https://cloud.google.com/kubernetes-engine/docs/how-to/role-based-access-control)。

## 导入一个集群

1. 在 **集群** 页, 点击 **添加**。
2. 选择 **导入**。
3. 输入 **集群名称**。
4. 通过**成员角色**来设置用户访问集群的权限。

   - 点击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

5. 单击 **创建**。
6. 这里显示了需要`集群管理员`特权的先决条件 (请参阅上面的**先决条件**)的提示，其中包括了达到该先决条件的示例命令。

7. 将`kubectl`命令复制到剪贴板，并在有着指向您要导入的集群的 kubeconfig 的节点上运行它。如果您不确定它是否正确配置，在运行 Rancher 中显示的命令之前，运行`kubectl get nodes`来验证一下。

8. 如果您正在使用自签名证书，您将收到`certificate signed by unknown authority`消息。要解决这个验证问题，请把 Rancher 中显示的`curl`开头的命令复制到剪贴板中。并在有着指向您要导入的集群的 kubeconfig 的节点上运行它。

9. 在节点上运行完命令后, 单击 **完成**。

**结果：**

- 您的集群创建成功并进入到**Pending**（等待中）的状态。Rancher 正在向您的集群部署资源。
- 在集群状态变为**Active**（激活）状态后，您将可以开始访问您的集群。
- 在**Active**的集群中，默认会有两个项目。`Default`项目（包括`default`命名空间）和`System`项目（包括`cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果这些命名空间存在的话）

> **注意:**
> 您不能重新导入当前在 Rancher 设置中处于活动状态的集群.
