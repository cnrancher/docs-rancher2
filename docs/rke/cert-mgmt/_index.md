---
title: 证书管理
description: 证书是 Kubernetes 集群的重要组成部分，所有的 Kubernetes 组件都需要用到证书。您可以使用 RKE 的 rke cert命令管理证书。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - RKE
  - 证书管理
---

_v0.2.0 开始可用_

证书是 Kubernetes 集群的重要组成部分，所有的 Kubernetes 组件都需要用到证书。您可以使用 RKE 的 `rke cert`命令管理证书。

## 生成证书签发请求（CSRs）和密钥

如果您想使用证书签发机构创建和签发证书，您可以使用[RKE 创建证书签发请求和密钥](/docs/rke/installation/certs/_index)。

您可以使用证书签发请求和密钥给证书签发机构的证书签名。签名之后，RKE 可以在 Kubernetes 集群中使用这些[自定义证书](/docs/rke/installation/certs/_index)。

## 轮换证书

默认状态下，Kubenetes 集群使用由 RKE 自动生成的证书。当证书临近过期时，或当证书被泄露时，用户应该及时轮换证书。

完成证书轮换后，Kubernetes 组件会自动重启，重启后，新的证书就会生效。您可以为以下这些服务轮换证书：

- etcd
- kubelet (节点证书)
- kubelet ([启用 Kubelet 选项](/docs/rke/config-options/services/_index)后，可以轮换服务证书。)
- kube-apiserver
- kube-proxy
- kube-scheduler
- kube-controller-manager

RKE 具有轮换证书的能力，您可以使用`rke cert`命令轮换服务证书：

- `rke cert rotate`：轮换全部服务证书。
- `rke cert rotate --service <ServiceName>`：轮换单个服务证书。
- `rke cert rotate --rotate-ca`：轮换 CA 证书和全部服务证书。

只要您在进行证书轮换，都需要用到`cluster.yml` 文件。如果您修改了`cluster.yml` 默认的存储路径，在执行证书轮换的时候，您可以使用`rke cert rotate --config`指向`cluster.yml` 的路径。

### 轮换服务证书

#### 轮换全部服务证书

运行`rke cert rotate`命令，可以将所有服务正在使用的证书替换为同一证书签发机构颁发的新证书。在命令行工具输入该命令后，返回信息如下。完成证书轮换后，Kubernetes 组件会自动重启，然后新的证书就会生效。

#### 轮换单个服务证书

运行`rke cert rotate --service <ServiceName>`命令，可以将单个服务正在使用的证书替换为同一证书签发机构颁发的新证书。在命令行工具输入该命令后，返回信息如下。完成证书轮换后，Kubernetes 组件会自动重启，然后新的证书就会生效。

`<ServiceName>`的可选值包括：

- etcd
- kubelet
- kube-apiserver
- kube-proxy
- kube-scheduler
- kube-controller-manager

以下代码示例演示的是替换`kubelet`组件使用的证书：

```shell
rke cert rotate --service kubelet
INFO[0000] Initiating Kubernetes cluster
INFO[0000] Rotating Kubernetes cluster certificates
INFO[0000] [certificates] Generating Node certificate
INFO[0000] Successfully Deployed state file at [./cluster.rkestate]
INFO[0000] Rebuilding Kubernetes cluster with rotated certificates
.....
INFO[0033] [worker] Successfully restarted Worker Plane..
```

### 轮换 CA 证书

如果需要轮换 CA 证书，您需要为所有的服务轮换证书。使用`--rotate-ca`选项，可以轮换 CA 证书和所有服务的证书。完成证书轮换后，Kubernetes 组件会自动重启，然后新的证书就会生效。

轮换 CA 证书会导致其他 system pods 重启，这些 pods 重启后也会使用新的 CA 证书：

- 网络组件 Pods（canal、calico、flannel 和 weave）
- Ingress Controller pods
- KubeDNS pods

```shell
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
