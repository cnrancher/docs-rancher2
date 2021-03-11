---
title: 问题排查
description: 大部分常见问题排查都将在这 3 个命名空间中的对象上进行。
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
  - 安装指南
  - 资料、参考和高级选项
  - Rancher高可用Helm2安装
  - 安装 Rancher
  - 问题排查
---

## 去哪里排查？

大部分常见问题排查都将在这 3 个命名空间中的对象上进行。

- `cattle-system` - `rancher` deployment 和 pods。
- `ingress-nginx` - Ingress controller pods 和 services。
- `kube-system` - `tiller` 和 `cert-manager` pods。

## "default backend - 404"

多数情况下，这是由于 ssl 配置错误所致。

请检查以下三项参数是否有误：

- [Rancher 是否在运行](#rancher-是否在运行)
- [Rancher 日志](#检查-rancher-日志)
- [证书 CN 为"Kubernetes Ingress Controller Fake Certificate"](#证书-cn-为伪证书)

### Rancher 是否在运行

使用`kubectl`检查`cattle-system`系统命名空间，并查看 Rancher 容器是否处于 Running 状态。

```
kubectl -n cattle-system get pods

NAME                           READY     STATUS    RESTARTS   AGE
pod/rancher-784d94f59b-vgqzh   1/1       Running   0          10m
```

如果状态不是`Running`，则需要在容器上运行`describe`并检查事件。

```
kubectl -n cattle-system describe pod

...
Events:
  Type     Reason                 Age   From                Message
  ----     ------                 ----  ----                -------
  Normal   Scheduled              11m   default-scheduler   Successfully assigned rancher-784d94f59b-vgqzh to localhost
  Normal   SuccessfulMountVolume  11m   kubelet, localhost  MountVolume.SetUp succeeded for volume "rancher-token-dj4mt"
  Normal   Pulling                11m   kubelet, localhost  pulling image "rancher/rancher:v2.0.4"
  Normal   Pulled                 11m   kubelet, localhost  Successfully pulled image "rancher/rancher:v2.0.4"
  Normal   Created                11m   kubelet, localhost  Created container
  Normal   Started                11m   kubelet, localhost  Started container
```

### 检查 Rancher 日志

使用`kubectl`查看 pods 列表

```
kubectl -n cattle-system get pods

NAME                           READY     STATUS    RESTARTS   AGE
pod/rancher-784d94f59b-vgqzh   1/1       Running   0          10m
```

使用`kubectl`和 Pod 名称来列出 Pod 中的日志。

```
kubectl -n cattle-system logs -f rancher-784d94f59b-vgqzh
```

## 证书 CN 为伪证书

使用浏览器检查证书详细信息。如果 Common Name 是`Kubernetes Ingress Controller Fake Certificate`，则说明读取或颁发 SSL 证书时可能出了点问题。

> **注意事项:** 如果您使用 LetsEncrypt 颁发证书，则有时可能需要花一些时间来等待证书发布。

### cert-manager 发布的证书

Rancher 生成的或是通过 LetsEncrypt 生成的

`cert-manager` 有 3 部分。

- `kube-system` 命名空间中的`cert-manager` pod。
- `cattle-system` 命名空间中的 `Issuer` 对象。
- `cattle-system` 命名空间中的 `Certificate` 对象。

对每个对象执行`kubectl describe`并检查事件。您可以追踪可能缺少的东西。

例如颁布证书存在问题：

```
kubectl -n cattle-system describe certificate
...
Events:
  Type     Reason          Age                 From          Message
  ----     ------          ----                ----          -------
  Warning  IssuerNotReady  18s (x23 over 19m)  cert-manager  Issuer rancher not ready
```

```
kubectl -n cattle-system describe issuer
...
Events:
  Type     Reason         Age                 From          Message
  ----     ------         ----                ----          -------
  Warning  ErrInitIssuer  19m (x12 over 19m)  cert-manager  Error initializing issuer: secret "tls-rancher" not found
  Warning  ErrGetKeyPair  9m (x16 over 19m)   cert-manager  Error getting keypair for CA issuer: secret "tls-rancher" not found
```

### 您自己提供的证书

您的证书将直接应用于`cattle-system`命名空间中的 Ingress 对象。

检查 Ingress 对象的状态，并查看其是否准备就绪。

```
kubectl -n cattle-system describe ingress
```

如果其就绪并且 SSL 仍无法正常工作，则您的证书或密码可能格式错误。

检查 nginx-ingress-controller 日志。由于 nginx-ingress-controller 的容器中有多个容器，因此您需要指定容器的名称。

```
kubectl -n ingress-nginx logs -f nginx-ingress-controller-rfjrq nginx-ingress-controller
...
W0705 23:04:58.240571       7 backend_ssl.go:49] error obtaining PEM from secret cattle-system/tls-rancher-ingress: error retrieving secret cattle-system/tls-rancher-ingress: secret cattle-system/tls-rancher-ingress was not found
```

## 没有匹配的"Issuer"

您选择的[SSL 配置](/docs/rancher2.5/installation/options/helm2/helm-rancher/_index)要求在安装 Rancher 之前先安装[cert-manager](/docs/rancher2.5/installation/options/helm2/helm-rancher/_index) ，否则将显示以下错误:

```
Error: validation failed: unable to recognize "": no matches for kind "Issuer" in version "certmanager.k8s.io/v1alpha1"
```

安装[cert-manager](/docs/rancher2.5/installation/options/helm2/helm-rancher/_index) 并重新尝试安装 Rancher。
