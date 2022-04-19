---
title: 使用外部 Ceph 驱动
weight: 10
---

本文介绍如何在 RKE2 集群中使用外部 Ceph 驱动。如果你使用的是 RKE，则需要执行其他步骤。详情请参阅[本节](#using-the-ceph-driver-with-rke)。

- [要求](#requirements)
- [在 RKE 中使用 Ceph 驱动](#using-the-ceph-driver-with-rke)
- [在 RKE2 集群上安装 ceph-csi 驱动](#installing-the-ceph-csi-driver-on-an-rke2-cluster)
- [使用 Helm 安装 ceph-csi 驱动](#install-the-ceph-csi-driver-using-helm)
- [创建 RBD Ceph 资源](#creating-rbd-ceph-resources)
- [配置 RBD Ceph 访问密钥](#configure-rbd-ceph-access-secrets)
  - [用户账号](#user-account)
  - [管理员账号](#admin-account)
- [创建 RBD 测试资源](#create-rbd-testing-resources)
  - [在 Pod 中使用 RBD](#using-rbd-in-pods)
  - [在持久卷中使用 RBD](#using-rbd-in-persistent-volumes)
  - [在存储类中使用 RBD](#using-rbd-in-storage-classes)
  - [RKE2 Server/Master 配置](#rke2-server-master-provisioning)
  - [RKE2 Agent/Worker 配置](#rke2-agent-worker-provisioning)
- [测试版本](#tested-versions)
- [故障排查](#troubleshooting)

## 要求

确保 ceph-common 和 xfsprogs 软件包安装在 SLE worker 节点上。

## 在 RKE 中使用 Ceph 驱动

以下资源与 RKE 集群完全兼容，但需要为 RKE 执行额外的 kubelet 配置。

在 RKE 集群上，kubelet 组件在 Docker 容器中运行，默认情况下无法像 rbd 和 libceph 一样访问主机的内核模块。

为了解决这个限制，你可以在 worker 节点上运行 `modprobe rbd`，或者配置 kubelet 容器以将主机中的 `/lib/modules` 目录自动挂载到容器中。

对于 kubelet 配置，在 RKE 集群配置之前，将以下内容放入 `cluster.yml` 文件中。你稍后还可以在 Rancher UI 中通过单击**编辑集群 > 以 YAML 文件编辑**并重新启动 worker 节点来修改 `cluster.yml`。

```yaml
services:
  kubelet:
    extra_binds:
      - "/lib/modules:/lib/modules:ro"
```

有关 `extra_binds` 指令的更多信息，请参阅[本节]({{<baseurl>}}/rke/latest/en/config-options/services/services-extras/#extra-binds)。

## 在 RKE2 集群上安装 ceph-csi 驱动

> **注意**：只有动态 RBD 配置需要执行这些步骤。

有关 `ceph-csi-rbd` chart 的更多信息，请参阅[此页面](https://github.com/ceph/ceph-csi/blob/devel/charts/ceph-csi-rbd/README.md)。

要获取有关 SES 集群的详细信息，请运行：

```
ceph mon dump
```

查看输出：

```
dumped monmap epoch 3
epoch 3
fsid 79179d9d-98d8-4976-ab2e-58635caa7235
last_changed 2021-02-11T10:56:42.110184+0000
created 2021-02-11T10:56:22.913321+0000
min_mon_release 15 (octopus)
0: [v2:10.85.8.118:3300/0,v1:10.85.8.118:6789/0] mon.a
1: [v2:10.85.8.123:3300/0,v1:10.85.8.123:6789/0] mon.b
2: [v2:10.85.8.124:3300/0,v1:10.85.8.124:6789/0] mon.c
```

稍后你将需要 fsid 和 mon 地址值。

## 使用 Helm 安装 ceph-csi 驱动

运行以下命令：

```
helm repo add ceph-csi https://ceph.github.io/csi-charts
helm repo update
helm search repo ceph-csi -l
helm inspect values ceph-csi/ceph-csi-rbd > ceph-csi-rbd-values.yaml
```

修改 `ceph-csi-rbd-values.yaml` 文件并只保留所需的更改：

```yaml
# ceph-csi-rbd-values.yaml
csiConfig:
  - clusterID: "79179d9d-98d8-4976-ab2e-58635caa7235"
    monitors:
      - "10.85.8.118:6789"
      - "10.85.8.123:6789"
      - "10.85.8.124:6789"
provisioner:
  name: provisioner
  replicaCount: 2
```

确保可以从 RKE2 集群访问 ceph 监视器（例如通过 ping）。

```
kubectl create namespace ceph-csi-rbd
helm install --namespace ceph-csi-rbd ceph-csi-rbd ceph-csi/ceph-csi-rbd --values ceph-csi-rbd-values.yaml
kubectl rollout status deployment ceph-csi-rbd-provisioner -n ceph-csi-rbd
helm status ceph-csi-rbd -n ceph-csi-rbd
```

如果你想直接通过 Helm 修改配置，则可以使用 `ceph-csi-rbd-values.yaml` 文件并调用：

```
helm upgrade \
  --namespace ceph-csi-rbd ceph-csi-rbd ceph-csi/ceph-csi-rbd --values ceph-csi-rbd-values.yaml
```

## 创建 RBD Ceph 资源

```
# 创建一个 ceph 池：
ceph osd pool create myPool 64 64

# 创建一个块设备池：
rbd pool init myPool

# 创建一个块设备镜像：
rbd create -s 2G myPool/image

# 创建一个块设备用户并记录密钥：
ceph auth get-or-create-key client.myPoolUser mon "allow r" osd "allow class-read object_prefix rbd_children, allow rwx pool=myPool" | tr -d '\n' | base64
QVFDZ0R5VmdyRk9KREJBQTJ5b2s5R1E2NUdSWExRQndhVVBwWXc9PQ==

# Base64 加密 ceph 用户 myPoolUser：
echo "myPoolUser" | tr -d '\n' | base64
bXlQb29sVXNlcg==

# 创建一个块设备管理员并记录密钥：
ceph auth get-or-create-key client.myPoolAdmin mds 'allow *' mgr 'allow *' mon 'allow *' osd 'allow * pool=myPool' | tr -d '\n' | base64
QVFCK0hDVmdXSjQ1T0JBQXBrc0VtcVhlZFpjc0JwaStIcmU5M3c9PQ==

# Base64 加密 ceph 用户 myPoolAdmin：
echo "myPoolAdmin" | tr -d '\n' | base64
bXlQb29sQWRtaW4=
```

## 配置 RBD Ceph 访问密钥

### 用户账号

对于静态 RBD 配置（ceph 池中的镜像必须存在），运行以下命令：

```
cat > ceph-user-secret.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: ceph-user
  namespace: default
type: kubernetes.io/rbd
data:
  userID: bXlQb29sVXNlcg==
  userKey: QVFDZ0R5VmdyRk9KREJBQTJ5b2s5R1E2NUdSWExRQndhVVBwWXc9PQ==
EOF

kubectl apply -f ceph-user-secret.yaml
```

### 管理员账号

对于动态 RBD 配置（用于在给定 ceph 池中自动创建镜像），请运行以下命令：

```
cat > ceph-admin-secret.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: ceph-admin
  namespace: default
type: kubernetes.io/rbd
data:
  userID: bXlQb29sQWRtaW4=
  userKey: QVFCK0hDVmdXSjQ1T0JBQXBrc0VtcVhlZFpjc0JwaStIcmU5M3c9PQ==
EOF

kubectl apply -f ceph-admin-secret.yaml
```

## 创建 RBD 测试资源

### 在 Pod 中使用 RBD

```
# pod
cat > ceph-rbd-pod-inline.yaml << EOF
apiVersion: v1
kind: Pod
metadata:
  name: ceph-rbd-pod-inline
spec:
  containers:
  - name: ceph-rbd-pod-inline
    image: busybox
    command: ["sleep", "infinity"]
    volumeMounts:
    - mountPath: /mnt/ceph_rbd
      name: volume
  volumes:
  - name: volume
    rbd:
      monitors:
      - 10.85.8.118:6789
      - 10.85.8.123:6789
      - 10.85.8.124:6789
      pool: myPool
      image: image
      user: myPoolUser
      secretRef:
        name: ceph-user
      fsType: ext4
      readOnly: false
EOF

kubectl apply -f ceph-rbd-pod-inline.yaml
kubectl get pod
kubectl exec pod/ceph-rbd-pod-inline -- df -k | grep rbd
```

### 在持久卷中使用 RBD

```
# pod-pvc-pv
cat > ceph-rbd-pod-pvc-pv-allinone.yaml << EOF
apiVersion: v1
kind: PersistentVolume
metadata:
  name: ceph-rbd-pv
spec:
  capacity:
    storage: 2Gi
  accessModes:
    - ReadWriteOnce
  rbd:
    monitors:
    - 10.85.8.118:6789
    - 10.85.8.123:6789
    - 10.85.8.124:6789
    pool: myPool
    image: image
    user: myPoolUser
    secretRef:
      name: ceph-user
    fsType: ext4
    readOnly: false
---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: ceph-rbd-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: ceph-rbd-pod-pvc-pv
spec:
  containers:
  - name: ceph-rbd-pod-pvc-pv
    image: busybox
    command: ["sleep", "infinity"]
    volumeMounts:
    - mountPath: /mnt/ceph_rbd
      name: volume
  volumes:
  - name: volume
    persistentVolumeClaim:
      claimName: ceph-rbd-pvc
EOF

kubectl apply -f ceph-rbd-pod-pvc-pv-allinone.yaml
kubectl get pv,pvc,pod
kubectl exec pod/ceph-rbd-pod-pvc-pv -- df -k | grep rbd
```

### 在存储类中使用 RBD

此示例用于动态配置。需要 ceph-csi 驱动。

```
# pod-pvc-sc
cat > ceph-rbd-pod-pvc-sc-allinone.yaml <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ceph-rbd-sc
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: rbd.csi.ceph.com
parameters:
   clusterID: 79179d9d-98d8-4976-ab2e-58635caa7235
   pool: myPool
   imageFeatures: layering
   csi.storage.k8s.io/provisioner-secret-name: ceph-admin
   csi.storage.k8s.io/provisioner-secret-namespace: default
   csi.storage.k8s.io/controller-expand-secret-name: ceph-admin
   csi.storage.k8s.io/controller-expand-secret-namespace: default
   csi.storage.k8s.io/node-stage-secret-name: ceph-admin
   csi.storage.k8s.io/node-stage-secret-namespace: default
reclaimPolicy: Delete
allowVolumeExpansion: true
mountOptions:
   - discard
---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: ceph-rbd-sc-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
  storageClassName: ceph-rbd-sc
---
apiVersion: v1
kind: Pod
metadata:
  name: ceph-rbd-pod-pvc-sc
spec:
  containers:
  - name:  ceph-rbd-pod-pvc-sc
    image: busybox
    command: ["sleep", "infinity"]
    volumeMounts:
    - mountPath: /mnt/ceph_rbd
      name: volume
  volumes:
  - name: volume
    persistentVolumeClaim:
      claimName: ceph-rbd-sc-pvc
EOF

kubectl apply -f ceph-rbd-pod-pvc-sc-allinone.yaml
kubectl get pv,pvc,sc,pod
kubectl exec pod/ceph-rbd-pod-pvc-sc -- df -k | grep rbd
```

### RKE2 Server/Master 配置

```
sudo su
curl -sfL https://get.rke2.io | sh -
systemctl enable --now rke2-server

cat > /root/.bashrc << EOF
export PATH=$PATH:/var/lib/rancher/rke2/bin/
export KUBECONFIG=/etc/rancher/rke2/rke2.yaml
EOF

cat /var/lib/rancher/rke2/server/node-token
token: K10ca0c38d4ff90d8b80319ab34092e315a8b732622e6adf97bc9eb0536REDACTED::server:ec0308000b8a6b595da000efREDACTED
```

### RKE2 Agent/Worker 配置

```
mkdir -p /etc/rancher/rke2/

cat > /etc/rancher/rke2/config.yaml << EOF
server: https://10.100.103.23:9345
token: K10ca0c38d4ff90d8b80319ab34092e315a8b732622e6adf97bc9eb0536REDACTED::server:ec0308000b8a6b595da000efREDACTED
EOF

curl -sfL https://get.rke2.io | INSTALL_RKE2_TYPE="agent" sh -
systemctl enable --now rke2-agent.service
```

要将集群导入 Rancher，请单击 **☰ > 集群管理**。然后在**集群**页面上，单击**导入已有集群**。然后在 server/master 上运行提供的 kubectl 命令。

## 测试版本

运行 RKE2 节点的操作系统：安装了 kernel-default-5.3.18-24.49 的 JeOS SLE15-SP2

```
kubectl version
Client Version: version.Info{Major:"1", Minor:"18", GitVersion:"v1.18.4", GitCommit:"c96aede7b5205121079932896c4ad89bb93260af", GitTreeState:"clean", BuildDate:"2020-06-22T12:00:00Z", GoVersion:"go1.13.11", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.7+rke2r1", GitCommit:"1dd5338295409edcfff11505e7bb246f0d325d15", GitTreeState:"clean", BuildDate:"2021-01-20T01:50:52Z", GoVersion:"go1.15.5b5", Compiler:"gc", Platform:"linux/amd64"}

helm version
version.BuildInfo{Version:"3.4.1", GitCommit:"c4e74854886b2efe3321e185578e6db9be0a6e29", GitTreeState:"clean", GoVersion:"go1.14.12"}
```

RKE2 集群上的 Kubernetes 版本：v1.19.7+rke2r1

## 故障排查

如果你使用的是基于 SES7 的 SUSE ceph-rook，你可以通过编辑 `rook-1.4.5/ceph/cluster.yaml` 并设置 `spec.network.hostNetwork=true` 来公开 hostNetwork 上的监视器。

如果要操作 ceph-rook 集群，则可以在 Kubernetes 集群上部署一个工具箱，其中 ceph-rook 通过 `kubectl apply -f rook-1.4.5/ceph/toolbox.yaml` 配置。然后所有与 ceph 相关的命令都可以在 toolbox pod 中执行，例如，运行 `kubectl exec -it -n rook-ceph rook-ceph-tools-686d8b8bfb-2nvqp -- bash`。

ceph 操作 - 基本命令：

```
ceph osd pool stats
ceph osd pool delete myPool myPool --yes-i-really-really-mean-it
rbd list -p myPool
> csi-vol-f5d3766c-7296-11eb-b32a-c2b045952d38
> image
```

删除镜像：`rbd rm csi-vol-f5d3766c-7296-11eb-b32a-c2b045952d38 -p myPool`

rook 工具箱中的 CephFS 命令：

```
ceph -s
ceph fs ls
ceph fs fail cephfs
ceph fs rm cephfs --yes-i-really-mean-it
ceph osd pool delete cephfs_data cephfs_data --yes-i-really-really-mean-it
ceph osd pool delete cephfs_metadata cephfs_metadata --yes-i-really-really-mean-it
```

要准备 cephfs 文件系统，你可以在 rook 集群上运行以下命令：

```
kubectl apply -f rook-1.4.5/ceph/filesystem.yaml
```
