---
title: Import集群更新ca证书后Rancher端所需操作配置
description: 
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 集群管理员指南
  - 集群访问控制
  - Import集群更新ca证书后Rancher端所需操作配置
---

## 1. Rancher相关备份操作

### 1.1. 单容器部署备份

如果在`docker run`部署Rancher时，有通过`-v`把容器中`/var/lib/rancher`目录映射到主机上，那么此步骤可以跳过；

如果没有映射目录，那么需要执行以下步骤进行备份：

```bash
RANCHER_CONTAINER_ID=
docker exec -ti ${RANCHER_CONTAINER_ID} tar zcvf /tmp/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz /var/lib/rancher
docker cp ${RANCHER_CONTAINER_ID}:/tmp/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz .
```

### 1.2. HA部署备份

指定rke配置文件进行local集群备份：

```bash
./rke_linux-amd64 etcd snapshot-save --name SNAPSHOT-201903xx.db --config cluster.yml
```

RKE会获取每个节点etcd的快照，并保存到每个节点的`/opt/rke/etcd-snapshots`目录下。

## 2. 操作步骤

升级完业务集群的证书之后，Rancher中集群会报x509错误，需要执行以下步骤修复。

文件准备:

- `kubeconfig`: 更新证书后的集群连接配置文件

### 2.1. 删除业务集群`cattle-system`命名空间中的`cattle-token-xxx`

通过以下命令删除`cattle-token-xxx`，它会基于最新的CA证书重新生成`cattle-token-xxx`。

```bash
kubeconfig=xxx.yaml
cattle_token=$( kubectl --kubeconfig=${kubeconfig} -n cattle-system get secret | grep 'cattle-token-' | awk '{print $1}' )
kubectl --kubeconfig=${kubeconfig} -n cattle-system delete secret ${cattle_token}
```

### 2.2. 重建Agent Pod

因为Agent Pod绑定了`SA`，而SA绑定了`secrets`，所以当删除`cattle-token-xxx`后需重建Pod，以加载新的`secrets`。

执行以下命令批量删除Agent Pod：

```bash
kubeconfig=xxx.yaml
kubectl --kubeconfig=${kubeconfig} -n cattle-system get pod | grep -v 'NAME' | awk '{print $1}' | xargs kubectl --kubeconfig=${kubeconfig} -n cattle-system delete pod
```

### 2.3. 获取`token`

重新生成`cattle-token-xxx`之后，取值`token`并`base64 -d`解密后备用。

```bash
kubeconfig=xxx.yaml
cattle_token=$( kubectl --kubeconfig=${kubeconfig} -n cattle-system get secret | grep 'cattle-token-' | awk '{print $1}' )
kubectl --kubeconfig=${kubeconfig} -n cattle-system get secret ${cattle_token} -o jsonpath={.data.token} | base64 -d
```

### 2.4. 获取新的CA证书

```bash
kubeconfig=xxx.yaml
cattle_token=$( kubectl --kubeconfig=${kubeconfig} -n cattle-system get secret | grep 'cattle-token-' | awk '{print $1}' )
kubectl --kubeconfig=${kubeconfig} -n cattle-system get secret ${cattle_token} -o jsonpath={.data.'ca\.crt'}
```

### 2.5. 在local集群中检查业务集群的clusters crd资源是否有更新

在重建Agent Pod后，cluster agent运行起来后会自动获取新`cattle-token-xxx`中的`ca`和`token`并上报给rancher，并保存在clusters crd资源中。

在local集群中执行以下命令查看对应集群的CRD配置YAML文件中`serviceAccountToken`和`caCert`是否有更新。

```bash
local_kubeconfig=xxx.yaml
Cluster_ID=     #浏览器地址栏查看集群ID
kubectl --kubeconfig=${local_kubeconfig} get clusters ${Cluster_ID} -o yaml
```

`serviceAccountToken`对应上面步骤获取的`token`，`caCert`对应`CA`证书，可以通过对比工具对比一下。

> 已知问题：在相对老的rancher版本中，非rke集群可能出现`ca`或者`token`未自动上报的问题，如果出现资源未更新需按照以下步骤手动修改。

- 备份crd clusters资源

```bash
local_kubeconfig=xxx.yaml
Cluster_ID=     #浏览器地址栏查看集群ID
kubectl --kubeconfig=${local_kubeconfig} get clusters ${Cluster_ID} -o yaml > ${Cluster_ID}.yaml
```

- 修改crd clusters资源

    - `serviceAccountToken`字段参数：使用上面步骤中获取的`token`替换；

    - `caCert`字段参数: 使用上面步骤获取的新CA证书替换；

## 3. 已知问题

业务集群升级证书并按照以上步骤操作后，可以正常进入Rancher UI，也可以正常的部署应用，但是无法查看日志和执行web shell终端。

这是在Rancher 2.1.x版本中已知问题，因为在内存中保存着一份CRD资源副本，Rancher运行时使用的内存中的CRD资源。在更新了CRD资源后，Rancher没有感知到CRD资源变化，会一直使用内存中的CRD副本。旧CRD副本保存着旧的CA证书和token，从而导致Agent无法连接K8S集群。

### 3.1. 解决方法

目前有效的方法只有重启Rancher server pod。
