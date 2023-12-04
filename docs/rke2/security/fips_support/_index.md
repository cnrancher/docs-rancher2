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

## 使用 FIPS 兼容的 Go 编译器

所使用的 Go 编译器可以在[这里](https://go.googlesource.com/go/+/dev.boringcrypto)找到。系统的每个组件都是用这个编译器的版本来构建的，与其他情况下使用的标准 Go 编译器版本一致。

这个版本的 Go 用经过 FIPS 验证的 BoringCrypto 模块取代了标准 Go 密码库。更多细节请参见 [readme](https://github.com/golang/go/blob/dev.boringcrypto/README.boringcrypto.md) 。

此外，这个模块目前正在[重新验证](https://docs.rke2.io/assets/fips_engagement.pdf)，作为 Rancher Kubernetes 加密库，用于 RKE2 支持的其他平台和系统。

这个版本的 Go 用经过 FIPS 验证的 BoringCrypto 模块取代了标准的 Go 加密库。更多细节见 GoBoring 的 [readme](https://github.com/golang/go/blob/dev.boringcrypto/README.boringcrypto.md)。该模块已被重新验证为 [Rancher Kubernetes Cryptographic Library](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/3836)，以确保在更多的系统上得到支持。

### 集群组件中的 FIPS 支持

RKE2 系统的大部分组件是用 GoBoring Go 编译器实现静态编译的。从组件的角度来看，RKE2 被分成了若干部分。下面的列表包含了这些部分和相关的组件。

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

## CNI

从 v1.21.2 版本开始，RKE2 支持通过 `--cni` 标志选择不同的 CNI，并绑定了几个 CNI，包括 Canal（默认）、Calico、Cilium 和 Multus。其中，只有 Canal（默认）是为了符合 FIPS 标准而重建的。

## Ingress

RKE2 将 NGNIX 作为其默认的 Ingress Provider。从 V1.21 版本开始，该组件符合 FIPS 标准。NGINX ingress 有两个主要的子组件：

- controller - 负责监控/更新 Kubernetes 资源并相应配置服务器
- server - 负责接受和路由流量

Controller 是用 Go 编写的，因此使用我们的[FIPS 兼容 Go 编译器](/docs/rke2/security/fips_support/_index#使用-fips-兼容的-go-编译器)进行编译。

Server 是用 C 语言编写的，也需要 OpenSSL 才能正常工作。因此，它利用 FIPS 验证的 OpenSSL 版本来实现 FIPS 兼容。
