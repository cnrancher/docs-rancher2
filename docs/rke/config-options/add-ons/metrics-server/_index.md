---
title: Metrics Server 插件
---

## 概述

默认情况下，RKE 会部署 [Metrics Server](https://github.com/kubernetes-incubator/metrics-server)来提供集群中资源的指标。

RKE 会将 Metrics Server 部署为一个 Deployment。

Metrics Server 使用的镜像在[系统镜像](/docs/rke/config-options/system-images/_index)下。对于每个 Kubernetes 版本，都有一个与 Metrics Server 相关联的默认镜像，但这些镜像可以通过更改`system_images`中的镜像标签来覆盖。

## 容忍度

_从 v1.2.4 开始提供_

配置的容忍度适用于`kube-dns`和`kube-dns-autoscaler`部署。

```yaml
dns:
  provider: kube-dns
  tolerations:
    - key: "node.kubernetes.io/unreachable"
      operator: "Exists"
      effect: "NoExecute"
      tolerationseconds: 300
    - key: "node.kubernetes.io/not-ready"
      operator: "Exists"
      effect: "NoExecute"
      tolerationseconds: 300
```

要检查`coredns`和 `coredns-autoscaler`部署的应用容忍度，请使用以下命令：

```
kubectl get deploy kube-dns -n kube-system -o jsonpath='{.spec.template.spec.tolerations}'。
kubectl get deploy kube-dns-autoscaler -n kube-system -o jsonpath='{.spec.template.spec.tolerations}'。
```

## 禁用 Metrics Server

_v0.2.0 或更新版本可用_

您可以将`provider`的值修改为`none`，禁用默认控制器。

```yaml
monitoring:
  provider: none
```
