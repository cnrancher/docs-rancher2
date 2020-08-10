---
title: "卷和存储"
weight: 30
---

当部署一个需要保留数据的应用程序时，你需要创建持久存储。持久存储允许您从运行应用程序的 pod 外部存储应用程序数据。即使应用程序的pod发生故障，这种存储方式也可以使您维护应用程序数据。

持久卷(PV)是Kubernetes集群中的一块存储，而持久卷声明(PVC)是对存储的请求。关于PV和PVC的工作原理，请参阅有关[存储](https://kubernetes.io/docs/concepts/storage/volumes/)的Kubernetes官方文档。

本页介绍了如何通过local storage provider 或 [Longhorn](#设置-longhorn)来设置持久存储。

## 设置 Local Storage Provider
K3s自带Rancher的Local Path Provisioner，这使得能够使用各自节点上的本地存储来开箱即用地创建持久卷声明。下面我们介绍一个简单的例子。有关更多信息，请参考[此处](https://github.com/rancher/local-path-provisioner/blob/master/README.md#usage)的官方文档。 

创建一个由hostPath支持的持久卷声明和一个使用它的pod：

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

确认PV和PVC已创建:

```
kubectl get pv
kubectl get pvc
```

状态应该都为 Bound

## 设置 Longhorn

> **注意:** 目前Longhorn只支持amd64。

K3s 支持 [Longhorn](https://github.com/longhorn/longhorn). Longhorn是Kubernetes的一个开源分布式块存储系统。

下面我们介绍一个简单的例子。有关更多信息，请参阅[此处](https://github.com/longhorn/longhorn/blob/master/README.md)的官方文档。

应用longhorn.yaml来安装Longhorn:

```
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/master/deploy/longhorn.yaml
```

Longhorn将被安装在命名空间`longhorn-system`中。

在创建PVC之前，我们将用这个yaml为Longhorn创建一个存储类：

```
kubectl create -f https://raw.githubusercontent.com/longhorn/longhorn/master/examples/storageclass.yaml
```

应用yaml创建PVC和pod:

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

确认PV和PVC已创建:

```
kubectl get pv
kubectl get pvc
```

状态应该都为 Bound
