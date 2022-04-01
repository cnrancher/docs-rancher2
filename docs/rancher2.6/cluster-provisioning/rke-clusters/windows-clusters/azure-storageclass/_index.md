---
title: Azure 中存储类的配置
weight: 3
---

如果你的节点使用 Azure VM，则可以使用 [Azure 文件](https://docs.microsoft.com/en-us/azure/aks/azure-files-dynamic-pv)作为集群的存储类（StorageClass）。

为了让 Azure 创建所需的存储资源，请执行以下步骤操作：

1. [配置 Azure 云提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/azure)。
1. 配置 `kubectl` 以连接到你的集群。
1. 复制服务账号的 `ClusterRole` 和 `ClusterRoleBinding` 清单：

       ---
       apiVersion: rbac.authorization.k8s.io/v1
       kind: ClusterRole
       metadata:
         name: system:azure-cloud-provider
       rules:
       - apiGroups: ['']
         resources: ['secrets']
         verbs:     ['get','create']
       ---
       apiVersion: rbac.authorization.k8s.io/v1
       kind: ClusterRoleBinding
       metadata:
         name: system:azure-cloud-provider
       roleRef:
         kind: ClusterRole
         apiGroup: rbac.authorization.k8s.io
         name: system:azure-cloud-provider
       subjects:
       - kind: ServiceAccount
         name: persistent-volume-binder
         namespace: kube-system

1. 使用以下命令在集群中进行创建：

   ```
   # kubectl create -f <MANIFEST>
   ```
