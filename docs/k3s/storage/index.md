---
title: "卷和存储"
description: 当部署一个需要保留数据的应用程序时，你需要创建持久存储。持久存储允许您从运行应用程序的 pod 外部存储应用程序数据。即使应用程序的 pod 发生故障，这种存储方式也可以使您维护应用程序数据。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - 卷和存储
---

当部署一个需要保留数据的应用程序时，你需要创建持久存储。持久存储允许您从运行应用程序的 pod 外部存储应用程序数据。即使应用程序的 pod 发生故障，这种存储方式也可以使您维护应用程序数据。

持久卷(PV)是 Kubernetes 集群中的一块存储，而持久卷声明(PVC)是对存储的请求。关于 PV 和 PVC 的工作原理，请参阅有关[存储](https://kubernetes.io/docs/concepts/storage/volumes/)的 Kubernetes 官方文档。

本页介绍了如何通过 local storage provider 或 [Longhorn](#设置-longhorn)来设置持久存储。

## K3s 的存储有什么变化？

K3s 删除了几个可选的卷插件和所有内置的（有时被称为 "树内"）云提供商。我们这样做是为了实现更小的二进制文件大小，并避免对第三方云或数据中心技术和服务的依赖，这些技术和服务在许多 K3s 的使用案例中可能无法使用。我们之所以能够这样做，是因为删除这些插件既不影响 Kubernetes 的核心功能，也不影响一致性。

以下是已经从 K3s 中删除的卷插件：

- cephfs
- fc
- flocker
- git_repo
- glusterfs
- portworx
- quobyte
- rbd
- storageos

这两个组件都有树外的替代品，可以与 K3s 一起使用：Kubernetes 的[容器存储接口（CSI）](https://github.com/container-storage-interface/spec/blob/master/spec.md)和[云提供商接口（CPI）](https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/)。

Kubernetes 维护者正在积极将树内卷插件迁移到 CSI 驱动。有关这一迁移的更多信息，请参考[这里](https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/)。

## 设置 Local Storage Provider

K3s 自带 Rancher 的 Local Path Provisioner，这使得能够使用各自节点上的本地存储来开箱即用地创建持久卷声明。下面我们介绍一个简单的例子。有关更多信息，请参考[此处](https://github.com/rancher/local-path-provisioner/blob/master/README.md#usage)的官方文档。

创建一个由 hostPath 支持的持久卷声明和一个使用它的 pod：

#### pvc.yaml

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: local-path-pvc
  namespace: default
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: 2Gi
```

#### pod.yaml

```
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
  namespace: default
spec:
  containers:
  - name: volume-test
    image: nginx:stable-alpine
    imagePullPolicy: IfNotPresent
    volumeMounts:
    - name: volv
      mountPath: /data
    ports:
    - containerPort: 80
  volumes:
  - name: volv
    persistentVolumeClaim:
      claimName: local-path-pvc
```

应用 yaml:

```
kubectl create -f pvc.yaml
kubectl create -f pod.yaml
```

确认 PV 和 PVC 已创建：

```
kubectl get pv
kubectl get pvc
```

状态应该都为 Bound

## 设置 Longhorn

> **注意：** 目前 Longhorn 只支持 amd64 和 arm64（实验性）。

K3s 支持 [Longhorn](https://github.com/longhorn/longhorn). Longhorn 是 Kubernetes 的一个开源分布式块存储系统。

下面我们介绍一个简单的例子。有关更多信息，请参阅[此处](https://github.com/longhorn/longhorn/blob/master/README.md)的官方文档。

应用 longhorn.yaml 来安装 Longhorn：

```
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/master/deploy/longhorn.yaml
```

Longhorn 将被安装在命名空间`longhorn-system`中。

应用 yaml 创建 PVC 和 pod：

```
kubectl create -f pvc.yaml
kubectl create -f pod.yaml
```

#### pvc.yaml

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: longhorn-volv-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: longhorn
  resources:
    requests:
      storage: 2Gi
```

#### pod.yaml

```
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
  namespace: default
spec:
  containers:
  - name: volume-test
    image: nginx:stable-alpine
    imagePullPolicy: IfNotPresent
    volumeMounts:
    - name: volv
      mountPath: /data
    ports:
    - containerPort: 80
  volumes:
  - name: volv
    persistentVolumeClaim:
      claimName: longhorn-volv-pvc
```

确认 PV 和 PVC 已创建：

```
kubectl get pv
kubectl get pvc
```

状态应该都为 Bound
