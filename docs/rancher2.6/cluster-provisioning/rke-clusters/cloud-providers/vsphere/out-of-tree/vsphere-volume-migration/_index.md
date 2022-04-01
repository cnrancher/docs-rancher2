---
title: 将 vSphere 树内卷迁移到 CSI
weight: 5
---

Kubernetes 正在逐渐不在树内维护云提供商。vSphere 有一个树外云提供商，可通过安装 vSphere 云提供商和云存储插件来使用。

本页介绍如何从树内 vSphere 云提供商迁移到树外，以及如何在迁移后管理现有虚拟机。

本文遵循官方 [vSphere 迁移文档](https://vsphere-csi-driver.sigs.k8s.io/features/vsphere_csi_migration.html)中提供的步骤，并介绍了要在 Rancher 中执行的步骤。

### Cloud-config 格式限制

由于 vSphere CSI 中的现有错误，使用以下 cloud-config 格式配置的现有卷将不会迁移。

如果 cloud-config 具有以下格式的 datastore 和资源池路径，vsphere CSI 驱动将无法识别它：

```yaml
default-datastore: </datacenter>/datastore/<default-datastore-name>
resourcepool-path: "</datacenter>/host/<cluster-name>/Resources/<resource-pool-name>"
```

格式如下的使用树内提供商预置的卷将能正确迁移：

```yaml
default-datastore: <default-datastore-name>
resourcepool-path: "<cluster-name>/Resources/<resource-pool-name>"
```

上游 bug：https://github.com/kubernetes-sigs/vsphere-csi-driver/issues/628

跟踪此 bug 的 Rancher issue：https://github.com/rancher/rancher/issues/31105

## 前提

- vSphere CSI 迁移需要 vSphere 7.0u1。为了管理现有的树内 vSphere 卷，请将 vSphere 升级到 7.0u1。
- Kubernetes 版本必须为 1.19 或更高版本。

## 迁移

### 1. 安装 CPI 插件

在安装 CPI 之前，我们需要使用 `node.cloudprovider.kubernetes.io/uninitialized=true:NoSchedule` 为所有节点添加污点。

这可以通过运行以下命令来完成：

```
curl -O https://raw.githubusercontent.com/rancher/helm3-charts/56b622f519728378abeddfe95074f1b87ab73b1e/charts/vsphere-cpi/taints.sh
```

或者：

```
wget https://raw.githubusercontent.com/rancher/helm3-charts/56b622f519728378abeddfe95074f1b87ab73b1e/charts/vsphere-cpi/taints.sh
chmod +x taints.sh
./taints.sh <path to kubeconfig if running the command outside the cluster>
```

通过运行脚本为所有节点添加污点后，启动 Helm vSphere CPI Chart：

1. 点击 **☰ > 集群管理**。
1. 转到将安装 vSphere CPI chart 的集群，然后单击 **Explore**。
1. 单击**应用 & 应用商店 > Chart**。
1. 单击 **vSphere CPI**。
1. 单击**安装**。
1. 填写所需的 vCenter 详细信息，然后单击**安装**。

vSphere CPI 使用 vSphere CSI 驱动所需的 ProviderID 来初始化所有节点。

运行以下命令，检查是否已使用 ProviderID 初始化了所有节点：

```
kubectl describe nodes | grep "ProviderID"
```

### 2. 安装 CSI 驱动

1. 点击 **☰ > 集群管理**。
1. 转到将安装 vSphere CSI chart 的集群，然后单击 **Explore**。
1. 单击**应用 & 应用商店 > Chart**。
1. 单击 **vSphere CSI**。
1. 单击**安装**。
1. 填写所需的 vCenter 详细信息，然后单击**安装**。
1. 选中**在安装前自定义 Helm 选项**，然后单击**下一步**。
1. 在**功能**选项卡中，选中**启用 CSI 迁移**。
1. 你也可以转到**存储**选项卡并设置 datastore。此 Chart 使用 `csi.vsphere.vmware.com` 作为置备程序来创建一个 StorageClass。在创建此 StorageClass 时，你也可以提供用于配置 CSI 卷的 datastore URL。通过选择 datastore 并转到**概述**选项卡，你可以在 vSphere 客户端中找到 datastore URL。填写 StorageClass 的详细信息。
1. 单击**安装**。

### 3. 编辑集群以启用 CSI 迁移的功能开关

1. 在编辑集群时，如果 Kubernetes 版本低于 1.19，请从 **Kubernetes 版本**下拉菜单中选择 Kubernetes 1.19 或更高版本。
2. 要启用功能开关，请单击**以 YAML 文件编辑**，然后在 kube-controller 和 kubelet 下添加以下内容：

   ```yaml
   	  extra_args:
   	    feature-gates: "CSIMigration=true,CSIMigrationvSphere=true"
   ```

### 4. 清空 worker 节点

在更改 kubelet 和 kube-controller-manager 参数之前，必须在升级期间清空 worker 节点：

1. 点击 **☰ > 集群管理**。
1. 转到要清空 worker 节点的集群，然后单击 **⋮ > 编辑配置**。
1. 在**高级选项**中，将**最大不可用的 Worker 节点数**字段设置为 1。
1. 要在升级期间清空节点，请选择**清空节点 > 是**。
1. 将**强制**和**删除本地数据**设置为 **true**。
1. 点击**保存**以升级集群。
