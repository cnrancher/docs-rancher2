---
title: 快速入门
description: 在本演练中，我们将部署 Octopus 并通过其管理`一类虚拟设备`并执行以下任务：使用 k3d 搭建 k3s 集群、部署 Octopus、部署设备模型和设备控制器、创建 DeviceLink、管理设备。
keywords:
  - Octopus中文文档
  - Octopus 中文文档
  - 边缘计算
  - IOT
  - edge computing
  - Octopus中文
  - Octopus 中文
  - Octopus
  - Octopus教程
  - Octopus中国
  - rancher
  - Octopus 中文教程
  - 快速入门
---

## 前置条件

已有 k3s 集群或 Kubernetes 集群。

## 使用步骤

在本演练中，我们将部署 Octopus 并通过其管理`一类虚拟设备`并执行以下任务：

1. [使用 k3d 搭建 k3s 集群](#1-使用k3d搭建k3s集群可选)
1. [部署 Octopus](#2-部署-octopus)
1. [部署设备模型和设备控制器](#3-部署设备模型和设备控制器)
1. [创建 DeviceLink](#4-创建-devicelink)
1. [管理设备](#5-管理设备)

### 1. 使用 k3d 搭建 k3s 集群(可选)

[k3d](https://github.com/rancher/k3d)是快速搭建容器化 k3s 集群的工具。 您可以使用 Docker 在单台计算机上启动多节点 k3s 集群。如果您已有 k3 集群或 Kubernetes 集群，请跳过此步骤。

1. 运行以下指令，启动具有 3 个 worker 节点的本地 k3s 集群。

   ```shell script
   curl -fL https://octopus-assets.oss-cn-beijing.aliyuncs.com/k3d/cluster-k3s-spinup.sh | bash -
   ```

   :::note 说明
   如果安装成功，则应该看到以下日志，请使用`CTRL+C`键以停止本地集群。
   :::

   ```logs
   [INFO] [0604 17:09:41] creating edge cluster with v1.17.2
   INFO[0000] Created cluster network with ID d5fcd8f2a5951d9ef4dba873f57dd7984f25cf81ab51776c8bac88c559c2d363
   INFO[0000] Created docker volume  k3d-edge-images
   INFO[0000] Creating cluster [edge]
   INFO[0000] Creating server using docker.io/rancher/k3s:v1.17.2-k3s1...
   INFO[0008] SUCCESS: created cluster [edge]
   INFO[0008] You can now use the cluster with:

   export KUBECONFIG="$(k3d get-kubeconfig --name='edge')"
   kubectl cluster-info
   [WARN] [0604 17:09:50] default kubeconfig has been backup in /Users/guangbochen/.kube/rancher-k3s.yaml_k3d_bak
   [INFO] [0604 17:09:50] edge cluster's kubeconfig wrote in /Users/guangbochen/.kube/rancher-k3s.yaml now
   [INFO] [0604 17:09:50] waiting node edge-control-plane for ready
   INFO[0000] Adding 1 agent-nodes to k3d cluster edge...
   INFO[0000] Created agent-node with ID 3197e431b1a060fbb591b4c315c4949f1b472213312ff8e04c898e3353e05bdc
   [INFO] [0604 17:10:01] waiting node edge-worker for ready
   INFO[0000] Adding 1 agent-nodes to k3d cluster edge...
   INFO[0000] Created agent-node with ID d9bb3e589e745797f3b189962d14de77cfc6afe86d1b6af93a43d808a9c72b5c
   [INFO] [0604 17:10:13] waiting node edge-worker1 for ready
   INFO[0000] Adding 1 agent-nodes to k3d cluster edge...
   INFO[0000] Created agent-node with ID bc69aa9867aa2081df0cf425661ae002142bd667d3d618bc5a5b34bc092d7562
   [INFO] [0604 17:10:25] waiting node edge-worker2 for ready
   [WARN] [0604 17:10:37] please input CTRL+C to stop the local cluster
   ```

1. 打开一个新终端，并配置`KUBECONFIG`以访问本地 k3s 集群。
   ```shell script
   export KUBECONFIG="$(k3d get-kubeconfig --name='edge')"
   ```
1. 运行`kubectl get node`命令， 检查本地 k3s 集群的节点是否正常。
   ```shell script
   kubectl get node
   NAME                 STATUS   ROLES    AGE     VERSION
   edge-control-plane   Ready    master   3m46s   v1.17.2+k3s1
   edge-worker2         Ready    <none>   3m8s    v1.17.2+k3s1
   edge-worker          Ready    <none>   3m33s   v1.17.2+k3s1
   edge-worker1         Ready    <none>   3m21s   v1.17.2+k3s1
   ```

### 2. 部署 Octopus

有[两种部署 Octopus 的方法](/docs/octopus/install/)，为方便起见，我们将通过一份 `all-in-one`的 YAML 文件来部署。 安装程序 YAML 文件位于 Github 上的[`deploy/e2e`](https://github.com/cnrancher/octopus/tree/master/deploy/e2e)目录下：

```shell script
kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/deploy/e2e/all_in_one.yaml
```

预期结果：

```log
namespace/octopus-system created
customresourcedefinition.apiextensions.k8s.io/devicelinks.edge.cattle.io created
role.rbac.authorization.k8s.io/octopus-leader-election-role created
clusterrole.rbac.authorization.k8s.io/octopus-manager-role created
rolebinding.rbac.authorization.k8s.io/octopus-leader-election-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/octopus-manager-rolebinding created
service/octopus-brain created
service/octopus-limb created
deployment.apps/octopus-brain created
daemonset.apps/octopus-limb created
```

安装后，我们可以验证 Octopus 的状态，如下所示：

```shell script
kubectl get all -n octopus-system
NAME                                 READY   STATUS    RESTARTS   AGE
pod/octopus-limb-w8vcf               1/1     Running   0          14s
pod/octopus-limb-862kh               1/1     Running   0          14s
pod/octopus-limb-797d8               1/1     Running   0          14s
pod/octopus-limb-8w462               1/1     Running   0          14s
pod/octopus-brain-65fdb4ff99-zvw62   1/1     Running   0          14s

NAME                    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/octopus-brain   ClusterIP   10.43.92.81    <none>        8080/TCP   14s
service/octopus-limb    ClusterIP   10.43.143.49   <none>        8080/TCP   14s

NAME                          DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
daemonset.apps/octopus-limb   4         4         4       4            4           <none>          14s

NAME                            READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/octopus-brain   1/1     1            1           14s

NAME                                       DESIRED   CURRENT   READY   AGE
replicaset.apps/octopus-brain-65fdb4ff99   1         1         1       14s

```

### 3. 部署设备模型和设备控制器

接下来我们会使用设备模拟器进行测试(不需要将其连接到真实的物理设备)。

首先，我们需要将设备描述为 Kubernetes 中的一种资源。 此描述过程即为对设备进行建模。 在 Kubernetes 中，描述资源的最佳方法是使用[CustomResourceDefinitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions)，因此**定义 Octopus 的设备模型实际上是在定义 CustomResourceDefinition**, 可快速浏览一下下列的`DummySpecialDevice`模型（假设这是一个智能风扇）：

:::note 说明
下列 YAML 可通过[code-generator](https://github.com/kubernetes/code-generator)动态生成，无需手动编辑。
:::

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  annotations:
    controller-gen.kubebuilder.io/version: v0.2.5
    devices.edge.cattle.io/description: dummy device description
    devices.edge.cattle.io/device-property: ""
    devices.edge.cattle.io/enable: "true"
    devices.edge.cattle.io/icon: ""
  labels:
    app.kubernetes.io/name: octopus-adaptor-dummy
    app.kubernetes.io/version: master
  name: dummyspecialdevices.devices.edge.cattle.io
spec:
  group: devices.edge.cattle.io
  names:
    kind: DummySpecialDevice
    listKind: DummySpecialDeviceList
    plural: dummyspecialdevices
    singular: dummyspecialdevice
  scope: Namespaced
  versions:
  - name: v1alpha1
    schema:
      openAPIV3Schema:
        description: DummySpecialDevice is the Schema for the dummy special device
          API.
        properties:
          ...
          spec:
            description: DummySpecialDeviceSpec defines the desired state of DummySpecialDevice.
            properties:
              gear:
                description: Specifies how fast the dummy special device should be.
                enum:
                - slow
                - middle
                - fast
                type: string
              "on":
                description: Turn on the dummy special device.
                type: boolean
              protocol:
                description: Protocol for accessing the dummy special device.
                properties:
                  location:
                    type: string
                required:
                - location
                type: object
            required:
            - "on"
            - protocol
            type: object
          status:
            description: DummySpecialDeviceStatus defines the observed state of DummySpecialDevice.
            properties:
              gear:
                description: Reports the current gear of dummy special device.
                enum:
                - slow
                - middle
                - fast
                type: string
              rotatingSpeed:
                description: Reports the detail number of speed of dummy special device.
                format: int32
                type: integer
            type: object
        type: object
    ...
status:
  ...
```

虚拟设备适配器（Dummy Adaptor）的安装 YAML 文件位于[`adaptors/dummy/deploy/e2e`](https://github.com/cnrancher/octopus/blob/master/adaptors/dummy/deploy/e2e)目录下，即 `all_in_one.yaml`, 它包含了设备模型和设备适配器，我们可以通过以下指令将其直接部署到 k3s 集群中：

```shell script
kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/adaptors/dummy/deploy/e2e/all_in_one.yaml
```

预期结果：

```
customresourcedefinition.apiextensions.k8s.io/dummyspecialdevices.devices.edge.cattle.io created
customresourcedefinition.apiextensions.k8s.io/dummyprotocoldevices.devices.edge.cattle.io created
clusterrole.rbac.authorization.k8s.io/octopus-adaptor-dummy-manager-role created
clusterrolebinding.rbac.authorization.k8s.io/octopus-adaptor-dummy-manager-rolebinding created
daemonset.apps/octopus-adaptor-dummy-adaptor created

kubectl get all -n octopus-system
NAME                                      READY   STATUS    RESTARTS   AGE
pod/octopus-limb-w8vcf                    1/1     Running   0          2m27s
pod/octopus-limb-862kh                    1/1     Running   0          2m27s
pod/octopus-limb-797d8                    1/1     Running   0          2m27s
pod/octopus-limb-8w462                    1/1     Running   0          2m27s
pod/octopus-brain-65fdb4ff99-zvw62        1/1     Running   0          2m27s
pod/octopus-adaptor-dummy-adaptor-6xcdz   1/1     Running   0          21s
pod/octopus-adaptor-dummy-adaptor-mmk5l   1/1     Running   0          21s
pod/octopus-adaptor-dummy-adaptor-xnjrf   1/1     Running   0          21s
pod/octopus-adaptor-dummy-adaptor-srsjz   1/1     Running   0          21s

NAME                    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/octopus-brain   ClusterIP   10.43.92.81    <none>        8080/TCP   2m27s
service/octopus-limb    ClusterIP   10.43.143.49   <none>        8080/TCP   2m27s

NAME                                           DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
daemonset.apps/octopus-limb                    4         4         4       4            4           <none>          2m27s
daemonset.apps/octopus-adaptor-dummy-adaptor   4         4         4       4            4           <none>          21s

NAME                            READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/octopus-brain   1/1     1            1           2m27s

NAME                                       DESIRED   CURRENT   READY   AGE
replicaset.apps/octopus-brain-65fdb4ff99   1         1         1       2m27s

```

请注意，还需要授予 Octopus 管理 `DummySpecialDevice`/`DummyProtocolDevice`的权限：

```shell script
$ kubectl get clusterrolebinding | grep octopus
octopus-manager-rolebinding                            2m49s
octopus-adaptor-dummy-manager-rolebinding              43s

```

### 4. 创建 DeviceLink

前面我们提到过 DeviceLink 是 Octopus 自定义的一个 k8s 资源对象（简称 dl），用户可通过编辑 DeviceLink 的 YAML 文件来进行配置与和管理设备连接。

接下来，我们将通过 `DeviceLink` YAML 来连接一个虚拟设备。 DeviceLink 由 3 部分组成：Adaptor、Model 和 Device spec。

- `Adaptor` - 适配器定义了要使用的适配器（即协议）以及实际设备应连接的节点。
- `Model` - 模型描述了设备的模型，它是设备模型的[TypeMeta](https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/types.go) CRD。
- `Device Spec` - 设备参数描述了如何连接到设备及其所需的设备属性或状态，这些参数由设备模型的 CRD 来定义。

假设有一个名为 `living-room-fan` 的设备可以通过 `edge-worker` 节点连接，我们可以使用以下 YAML 来测试其工作方式。

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
metadata:
  name: living-room-fan
  namespace: default
spec:
  adaptor:
    node: edge-worker # select the node that the device will be connect to
    name: adaptors.edge.cattle.io/dummy
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "DummySpecialDevice"
  template:
    metadata:
      labels:
        device: living-room-fan
    spec: # specify device specs
      protocol:
        location: "living_room"
      gear: slow
      "on": true
EOF
```

DeviceLink 包含了[几种状态](/docs/octopus/device-link/state-of-dl/)，如果我们发现其`PHASE`为**DeviceConnected**和`STATUS`为**Healthy**的状态下，我们就可以使用设备模型的 CRD 对象来查询其状态（即此处的 dummyspecialdevice）：

```shell script
kubectl get devicelink living-room-fan -n default
NAME              KIND                 NODE          ADAPTOR                         PHASE             STATUS    AGE
living-room-fan   DummySpecialDevice   edge-worker   adaptors.edge.cattle.io/dummy   DeviceConnected   Healthy   10s

```

查看虚拟设备上报的状态或信息：

```shell script
kubectl get dummyspecialdevice living-room-fan -n default -w
NAME              GEAR   SPEED   AGE
living-room-fan   slow   10      32s
living-room-fan   slow   11      33s
living-room-fan   slow   12      36s

```

### 5. 管理设备

用户可以使用修改设备属性来管理其设备，例如，假设我们要关闭风扇，可以将其`on`(开关属性)配置设置为 `"on"：false`：

```shell script
kubectl patch devicelink living-room-fan -n default --type merge --patch '{"spec":{"template":{"spec":{"on":false}}}}'
```

日志显示 `devicelink.edge.cattle.io/living-room-fan is patched`，查询其状态，`GEAR`和`SPEED`值均显示为空值(表示已关闭)。

```
kubectl get devicelink living-room-fan -n default
  NAME              KIND                 NODE          ADAPTOR                         PHASE             STATUS    AGE
  living-room-fan   DummySpecialDevice   edge-worker   adaptors.edge.cattle.io/dummy   DeviceConnected   Healthy   89s

kubectl get dummyspecialdevice living-room-fan -n default
NAME              GEAR   SPEED   AGE
living-room-fan                  117s
```
