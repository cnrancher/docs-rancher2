---
title: 自定义证书
---

_v0.2.0 以上可用_

## 概述

默认情况下，Kubernetes 集群需要用到证书，而 RKE 会自动为所有集群组件生成证书。您也可以使用[自定义证书](/docs/rke/installation/certs/_index)。

使用[RKE 部署 Kubernetes](/docs/rke/installation/_index#使用-RKE-部署-Kubernetes)时，可以在`rke up`命令后面添加额外的选项，命令 RKE 使用自定义证书部署 Kubernetes。

| 选项               | 描述                                                                                                 |
| :----------------- | :--------------------------------------------------------------------------------------------------- |
| `--custom-certs`   | 如果您没有修改保存证书的路径，RKE 会使用默认路径`/cluster_certs`保存证书，自定义证书会保存在该路径。 |
| `--cert-dir` value | 如果您的自定义证书保存在其他路径下，可以使用这个选项将保存证书的默认路径改为您保存证书的路径。       |

## 如何使用自定义证书

以下是分别使用两种选项的代码示例：

```shell
# 如果您没有修改保存证书的路径，RKE 会使用默认路径`/cluster_certs`保存证书，自定义证书会保存在该路径
rke up --custom-certs
```

```shell
# 如果您的自定义证书保存在其他路径下，可以使用这个选项将保存证书的默认路径改为您保存证书的路径
rke up --custom-certs --cert-dir ~/my/own/certs
```

## 证书和密钥清单

无论您使用默认路径还是其他路径保存证书，都要确保该路径下已有以下证书和密钥：

| 名称                       | 证书                                  | 密钥                                    |
| :------------------------- | :------------------------------------ | :-------------------------------------- |
| Master CA                  | kube-ca.pem                           | N/A                                     |
| Kube API                   | kube-apiserver.pem                    | kube-apiserver-key.pem                  |
| Kube Controller Manager    | kube-controller-manager.pem           | kube-controller-manager-key.pem         |
| Kube Scheduler             | kube-scheduler.pem                    | kube-scheduler-key.pem                  |
| Kube Proxy                 | kube-proxy.pem                        | kube-proxy-key.pem                      |
| Kube Admin                 | kube-admin.pem                        | kube-admin-key.pem                      |
| Kube Node                  | kube-node.pem                         | kube-node-key.pem                       |
| Apiserver Proxy Client     | kube-apiserver-proxy-client.pem       | kube-apiserver-proxy-client-key.pem     |
| Etcd Nodes                 | kube-etcd-x-x-x-x.pem                 | kube-etcd-x-x-x-x-key.pem               |
| Kube Api Request Header CA | kube-apiserver-requestheader-ca.pem\* | kube-apiserver-requestheader-ca-key.pem |
| Service Account Token      | N/A                                   | kube-service-account-token-key.pem      |

\*：和 kube-ca.pem 相同。

## 生成证书签名请求和密钥

如果您想使用证书签发机构（Certificate Authority，简称 CA）创建和签发证书，您可以使用 RKE 命令`rke cert generate-csr`，创建证书签发请求（CSR）和密钥。

1. 参考[节点信息](/docs/rke/config-options/nodes/_index)，配置`cluster.yml`。

2. 运行`rke cert generate-csr`命令，生成`cluster.yml`文件中提及的节点需要的证书。默认情况下，RKE 会将 CSR 和密钥保存在`./cluster_certs`路径。如果您需要将它们保存在其他路径，请在命令后添加使用 `--cert-dir <PathName>`选项，将`<PathName>`替换成其他路径名称。

   ```shell
   rke cert generate-csr
   INFO[0000] Generating Kubernetes cluster CSR certificates
   INFO[0000] [certificates] Generating Kubernetes API server csr
   INFO[0000] [certificates] Generating Kube Controller csr
   INFO[0000] [certificates] Generating Kube Scheduler csr
   INFO[0000] [certificates] Generating Kube Proxy csr
   INFO[0001] [certificates] Generating Node csr and key
   INFO[0001] [certificates] Generating admin csr and kubeconfig
   INFO[0001] [certificates] Generating Kubernetes API server proxy client csr
   INFO[0001] [certificates] Generating etcd-x.x.x.x csr and key
   INFO[0001] Successfully Deployed certificates at [./cluster_certs]
   ```

3. 运行以下命令，生成`kube-service-account-token-key.pem`密钥。

   ```shell
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./cluster_certs/kube-service-account-token-key.pem -out ./cluster_certs/kube-service-account-token.pem
   ```

**结果：** 生成了多个 CSR 和密钥。它们被部署在您指定的路径。如果您没有指定路径，它们则会被部署在`./cluster_certs`。CSR 文件中包含了证书需要用到的 Alternative DNS 地址和 IP Names。您可以使用它们给证书颁发机构颁发的证书签名。完成此过程后，RKE 可以使用这些自定义证书。

```shell
tree cluster_certs

cluster_certs
├── kube-admin-csr.pem
├── kube-admin-key.pem
├── kube-apiserver-csr.pem
├── kube-apiserver-key.pem
├── kube-apiserver-proxy-client-csr.pem
├── kube-apiserver-proxy-client-key.pem
├── kube-controller-manager-csr.pem
├── kube-controller-manager-key.pem
├── kube-etcd-x-x-x-x-csr.pem
├── kube-etcd-x-x-x-x-key.pem
├── kube-node-csr.pem
├── kube-node-key.pem
├── kube-proxy-csr.pem
├── kube-proxy-key.pem
├── kube-scheduler-csr.pem
├── kube-service-account-token-key.pem
├── kube-service-account-token.pem
└── kube-scheduler-key.pem

0 directories, 18 files

```
