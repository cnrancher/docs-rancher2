---
title: FIPS 140-2 启用
description: FIPS 140-2 是美国联邦政府的安全标准，用于批准加密模块。这份文件解释了 RKE2 是如何使用 FIPS 验证的加密库构建的。
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
  - RKE2
  - FIPS 140-2 启用
---


FIPS 140-2 是美国联邦政府的安全标准，用于批准加密模块。这份文件解释了 RKE2 是如何使用 FIPS 验证的加密库构建的。

## 使用 FIPS 兼容的 Go 编译器。

所使用的 Go 编译器可以在[这里](https://hub.docker.com/u/goboring)找到。系统的每个组件都是用这个编译器的版本来构建的，与其他情况下使用的标准 Go 编译器版本一致。

这个版本的 Go 用经过 FIPS 验证的 BoringCrypto 模块取代了标准 Go 密码库。更多细节请参见 [readme](https://github.com/golang/go/blob/dev.boringcrypto/README.boringcrypto.md) 。

此外，这个模块目前正在[重新验证](https://docs.rke2.io/assets/fips_engagement.pdf)，作为 Rancher Kubernetes 加密库，用于 RKE2 支持的其他平台和系统。

### 集群组件中的 FIPS 支持

RKE2 系统的大部分组件都是用 GoBoring Go 编译器实现静态编译的，它利用了 BoringSSL 库的优势。RKE2，从组件的角度来看，被分成了许多部分。下面的列表包含了这些部分和相关的组件。

- Kubernetes

  - API Server
  - Controller Manager
  - Scheduler
  - Kubelet
  - Kube Proxy
  - Metric Server
  - Kubectl

- Helm Charts
  - Flannel
  - Calico
  - CoreDNS

## 运行时

为了确保系统架构的所有方面都使用符合 FIPS 140-2 标准的算法实现，RKE2 运行时包含了用符合 FIPS 标准的 Go 编译器静态编译的实用程序。这确保了从 Kubernetes 守护程序到容器协调机制的所有层面都是合规的。

- etcd
- containerd
  - containerd-shim
  - containerd-shim-runc-v1
  - containerd-shim-runc-v2
  - ctr
- crictl
- runc

## Ingress

RKE2 中包含的 NGINX Ingress 目前没有启用 FIPS。然而，它可以被集群运营商/所有者[禁用和替换]（.../advanced.md#disabling-server-charts）。
