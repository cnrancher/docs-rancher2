---
title: 轮换证书
description: 默认情况下，Kubernetes 集群所需要的证书由 Rancher 生成，如果出现证书过期，或证书泄露等情况，则需要使用新的证书轮换掉有问题的证书。轮换证书后，Kubernetes 组件将自动重新启动。
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
  - 轮换证书
---

## 概述

默认情况下，Kubernetes 集群所需要的证书由 Rancher 生成，如果出现证书过期，或证书泄露等情况，则需要使用新的证书轮换掉有问题的证书。轮换证书后，Kubernetes 组件将自动重新启动。

以下服务支持证书轮换：

- etcd
- kubelet
- kube-apiserver
- kube-proxy
- kube-scheduler
- kube-controller-manager

:::note 警告
轮换 Kubernetes 证书可能会导致集群在重新启动组件时暂时不可用。对于生产环境，建议在维护时段内执行此操作。
:::

## Rancher v2.2.x 中的证书轮换

Rancher 启动的 Kubernetes 集群（RKE 集群）能够通过 UI 轮换自动生成的证书。

1. 在**全局**视图中，导航到要轮换证书的集群。

2. 选择**省略号（...）>轮换证书**。

3. 选择要轮换的证书。

   - 轮换所有服务证书（保持相同的 CA）
   - 轮换单个服务，然后从下拉菜单中选择一项服务

4. 单击**保存**。

**结果：**所选证书将被轮换，相关服务将重新启动以开始使用新证书。

> **注意：** 尽管 RKE CLI 可以为 Kubernetes 集群组件使用自定义证书，但目前 Rancher 不支持在 Rancher UI 中创建 RKE 集群时上传这些证书。

## Rancher v2.1.x 和 v2.0.x 中的证书轮换

_在版本 v2.0.14 以及 v2.1.9 中支持_

Rancher 启动的 Kubernetes 集群能够通过 API 轮换自动生成的证书。

1.在**全局**视图中，导航到要轮换证书的集群。

2.选择**省略号（...）>在 API 中查看**。

3.单击 **RotateCertificates**。

4.单击**显示请求**。

5.单击**发送请求**。

**结果：**所有 Kubernetes 证书将被轮换。

## 升级较旧的 Rancher 版本后轮换过期的证书

如果要从 Rancher v2.0.13 或更早版本或 v2.1.8 或更早版本升级，并且您的集群已过期证书，则需要一些手动步骤来完成证书轮换。

1. 对于 `controlplane` 和 `etcd` 节点，登录到每个对应的主机，并检查证书 `kube-apiserver-requestheader-ca.pem` 是否在以下目录中：

   ```
   cd /etc/kubernetes/.tmp
   ```

   如果证书不在目录中，请执行以下命令：

   ```
   cp kube-ca.pem kube-apiserver-requestheader-ca.pem
   cp kube-ca-key.pem kube-apiserver-requestheader-ca-key.pem
   cp kube-apiserver.pem kube-apiserver-proxy-client.pem
   cp kube-apiserver-key.pem kube-apiserver-proxy-client-key.pem
   ```

   如果`.tmp`目录不存在，则可以将整个 SSL 证书复制到`.tmp`中：

   ```
   cp -r /etc/kubernetes/ssl /etc/kubernetes/.tmp
   ```

1. 轮换证书。对于 Rancher v2.0.x 和 v2.1.x，请使用 [Rancher API](#rancher-v21x-和-v20x-中的证书轮换)，对于 Rancher 2.2.x 请使用[Rancher UI](#rancher-v22x-中的证书轮换)。

1. 命令完成后，检查 `worker` 节点是否处于活动状态。如果不是，请登录到每个 `worker` 节点，然后重新启动 kubelet 和 agent。

## RKE 证书轮换 (local 集群和业务集群通用)

_可用版本: rke v0.2.0+_

> **注意** 如果以前是通过`rke v0.2.0`之前的版本创建的 Kubernetes 集群，在轮换证书前先执行`rke up`操作，参考: https://rancher.com/docs/rke/latest/en/cert-mgmt/

- 通过 RKE 轮换证书，目前支持:

  - 批量更新所有服务证书(CA 证书不变)
  - 更新某个指定服务(CA 证书不变)
  - 轮换 CA 和所有服务证书

1. 批量更新所有服务证书(CA 证书不变)

   ```bash
   rke cert rotate

   INFO[0000] Initiating Kubernetes cluster
   INFO[0000] Rotating Kubernetes cluster certificates
   INFO[0000] [certificates] Generating Kubernetes API server certificates
   INFO[0000] [certificates] Generating Kube Controller certificates
   INFO[0000] [certificates] Generating Kube Scheduler certificates
   INFO[0001] [certificates] Generating Kube Proxy certificates
   INFO[0001] [certificates] Generating Node certificate
   INFO[0001] [certificates] Generating admin certificates and kubeconfig
   INFO[0001] [certificates] Generating Kubernetes API server proxy client certificates
   INFO[0001] [certificates] Generating etcd-xxxxx certificate and key
   INFO[0001] [certificates] Generating etcd-yyyyy certificate and key
   INFO[0002] [certificates] Generating etcd-zzzzz certificate and key
   INFO[0002] Successfully Deployed state file at [./cluster.rkestate]
   INFO[0002] Rebuilding Kubernetes cluster with rotated certificates
   .....
   INFO[0050] [worker] Successfully restarted Worker Plane..
   ```

2. 更新指定服务(CA 证书不变)

   ```bash

   rke cert rotate --service kubelet
   INFO[0000] Initiating Kubernetes cluster
   INFO[0000] Rotating Kubernetes cluster certificates
   INFO[0000] [certificates] Generating Node certificate
   INFO[0000] Successfully Deployed state file at [./cluster.rkestate]
   INFO[0000] Rebuilding Kubernetes cluster with rotated certificates
   .....
   INFO[0033] [worker] Successfully restarted Worker Plane..
   ```

3. 轮换 CA 和所有服务证书

   ```bash
   rke cert rotate --rotate-ca

   INFO[0000] Initiating Kubernetes cluster
   INFO[0000] Rotating Kubernetes cluster certificates
   INFO[0000] [certificates] Generating CA kubernetes certificates
   INFO[0000] [certificates] Generating Kubernetes API server aggregation layer requestheader client CA certificates
   INFO[0000] [certificates] Generating Kubernetes API server certificates
   INFO[0000] [certificates] Generating Kube Controller certificates
   INFO[0000] [certificates] Generating Kube Scheduler certificates
   INFO[0000] [certificates] Generating Kube Proxy certificates
   INFO[0000] [certificates] Generating Node certificate
   INFO[0001] [certificates] Generating admin certificates and kubeconfig
   INFO[0001] [certificates] Generating Kubernetes API server proxy client certificates
   INFO[0001] [certificates] Generating etcd-xxxxx certificate and key
   INFO[0001] [certificates] Generating etcd-yyyyy certificate and key
   INFO[0001] [certificates] Generating etcd-zzzzz certificate and key
   INFO[0001] Successfully Deployed state file at [./cluster.rkestate]
   INFO[0001] Rebuilding Kubernetes cluster with rotated certificates
   ```

4. 因为证书改变，相应的`token`也会变化，在集群证书更新完成后，需要对连接`API SERVER`的 Pod 进行重建，以获取新的`token`。

   - cattle-system/cattle-cluster-agent
   - cattle-system/cattle-node-agent
   - cattle-system/kube-api-auth
   - ingress-nginx/nginx-ingress-controller
   - kube-system/canal
   - kube-system/kube-dns
   - kube-system/kube-dns-autoscaler
   - 其他应用 Pod

## 独立容器 Rancher Server 证书更新

- 证书未过期

证书未过期时，rancher server 可以正常运行。升级到 Rancher v2.0.14+ 、v2.1.9+、v2.2.0+ 后会自动检查证书有效期，如果发现证书即将过期，将会自动生成新的证书。所以独立容器运行的 Rancher Server，只需在证书过期前把 rancher 版本升级到支持自动更新 ssl 证书的版本即可，无需做其他操作。

- 证书已过期

如果证书已过期，那么 rancher server 无法正常运行。即使升级到 Rancher v2.0.14+ 、v2.1.9+、v2.2.0+ 也可能会提示证书错误。如果出现这种情况，可通过以下操作进行处理：

1. 正常升级 rancher 版本到 v2.0.14+ 、v2.1.9+、v2.2.0+；
2. 执行以下命令：

   ```bash
   docker exec c -ti <rancher_server_id> mv /var/lib/rancher/management-state/certs/bundle.json /var/lib/rancher/management-state/certs/bundle.json-bak

   docker restart <rancher_server_id>
   ```

## 故障处理

### 提示 CA 证书为空

如果执行更新证书后出现如下错误提示，因为没有执行集群更新操作

![image-20190423133555060](/img/rancher/old-doc/image-20190423133555060.png)

**解决方法**

1. 选择对应问题集群，然后查看浏览器的集群 ID,如下图：![ran'chimage-20190423133810076](/img/rancher/old-doc/image-20190423133810076.png)
2. 执行命令 `kubectl edit clusters <clusters_ID>`
   - 如果 Rancher 是 HA 安装，直接在 local 集群中，通过`rke`生成的`kube`配置文件执行以上命令；
   - 如果 Rancher 是单容器运行，通过`docker exec -ti <容器ID> bash`进入容器中，然后执行`apt install vim -y`安装 vim 工具，然后再执行以上命令；
3. 删除`spec.rancherKubernetesEngineConfig.rotateCertificates`层级下的配置参数:![image-20190423135522178](/img/rancher/old-doc/image-20190423135522178.png)修改为![image-20190423135604503](/img/rancher/old-doc/image-20190423135604503.png)
4. 输入`:wq`保存 yaml 文件后集群将自动更新，更新完成后再进行证书更新。

### 证书已过期导致无法连接 K8S

如果集群证书已经过期，那么即使升级到`Rancher v2.0.14、v2.1.9`以及更高版本也无法轮换证书。rancher 是通过`Agent`去更新证书，如果证书过期将无法与`Agent`连接。

**解决方法**

可以手动设置节点的时间，把时间往后调整一些。因为`Agent`只与`K8S master`和`Rancher Server`通信，如果 Rancher Server 证书未过期，那就只需调整`K8S master`节点时间。

调整命令：

```bash
# 关闭ntp同步，不然时间会自动更新
timedatectl set-ntp false
# 修改节点时间
timedatectl set-time '2019-01-01 00:00:00'
```

然后再对 Rancher Server 进行升级，接着按照证书轮换步骤进行证书轮换，等到证书轮换完成后再把时间同步回来。

```bash
timedatectl set-ntp true
```

检查证书有效期

```bash
openssl x509 -in /etc/kubernetes/ssl/kube-apiserver.pem -noout -dates
```
