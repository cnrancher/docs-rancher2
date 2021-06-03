---
title: 默认的政策配置
description: 本文介绍了 RKE2 如何配置 PodSecurityPolicies 和 NetworkPolicies，以实现默认安全，同时也为运营商提供了最大的配置灵活性。
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
  - 默认的政策配置
---


本文介绍了 RKE2 如何配置 PodSecurityPolicies 和 NetworkPolicies，以实现默认安全，同时也为运营商提供了最大的配置灵活性。

#### Pod 安全策略

RKE2 可以在有或没有 `profile: cis-1.5` 配置参数的情况下运行。这将导致它在启动时应用不同的 PodSecurityPolicies（PSPs）。

- 如果运行时使用 `cis-1.5` 配置文件，RKE2 将对除 `kube-system` 之外的所有命名空间应用一个名为 `global-restricted-psp` 的限制性策略。`kube-system` 命名空间需要一个限制性较低的策略，即 `system-unrestricted-psp`，以便启动关键组件。
- 如果在没有 `cis-1.5` 配置文件的情况下运行，RKE2 将应用一个完全不受限制的策略，名为 `global-unrestricted-sp`，这相当于在没有启用 PSP 允许控制器的情况下运行。

RKE2 会在初始启动时将这些策略落实到位，但之后不会再修改，除非如下文所述由集群操作员明确触发。这是为了让操作员能够完全控制 PSP，而不被 RKE2 的默认值所干扰。

PSP 的创建和应用由 `kube-system` 命名空间中是否存在某些注释来控制。这些注释直接映射到可以创建的 PSP 上，它们是:

- `psp.rke2.io/global-restricted`
- `psp.rke2.io/system-unrestricted`
- `psp.rke2.io/global-unrestricted`

在启动时对策略及其注释执行以下逻辑：

- 如果注释存在，RKE2 将继续进行，不需要进一步的动作。
- 如果注解不存在，RKE2 会检查相关策略是否存在，如果存在，则删除并重新创建，同时将注解添加到命名空间中。
- 在 `global-unrestricted-psp` 的情况下，该策略不会被重新创建。这是为了说明在 CIS 和非 CIS 模式之间的移动，而不会使集群的安全性降低。
- 在创建策略的时候，集群角色和集群角色绑定也被创建，以确保适当的策略被默认投入使用。

因此，在初始启动后，操作员可以修改或删除 RKE2 的策略，RKE2 将尊重这些变化。此外，要 "重置" 一个策略，操作者只需要从 `kube-system` 命名空间中删除相关的注释，然后重新启动 RKE2。

这些政策概述如下:

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: global-restricted-psp
spec:
  privileged: false # CIS - 5.2.1
  allowPrivilegeEscalation: false # CIS - 5.2.5
  requiredDropCapabilities: # CIS - 5.2.7/8/9
    - ALL
  volumes:
    - "configMap"
    - "emptyDir"
    - "projected"
    - "secret"
    - "downwardAPI"
    - "persistentVolumeClaim"
  hostNetwork: false # CIS - 5.2.4
  hostIPC: false # CIS - 5.2.3
  hostPID: false # CIS - 5.2.2
  runAsUser:
    rule: "MustRunAsNonRoot" # CIS - 5.2.6
  seLinux:
    rule: "RunAsAny"
  supplementalGroups:
    rule: "MustRunAs"
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: "MustRunAs"
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: false
```

如果 RKE2 在非 CIS 模式下启动，注释会像上面一样被检查，但由此产生的 Pod 安全策略的应用是一个允许的。见下文：

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: global-unrestricted-psp
spec:
  privileged: true
  allowPrivilegeEscalation: true
  allowedCapabilities:
    - "*"
  volumes:
    - "*"
  hostNetwork: true
  hostPorts:
    - min: 0
      max: 65535
  hostIPC: true
  hostPID: true
  runAsUser:
    rule: "RunAsAny"
  seLinux:
    rule: "RunAsAny"
  supplementalGroups:
    rule: "RunAsAny"
  fsGroup:
    rule: "RunAsAny"
```

在这两种情况下，都适用 "系统不受限制的政策"。见下文：

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: system-unrestricted-psp
spec:
  privileged: true
  allowPrivilegeEscalation: true
  allowedCapabilities:
    - "*"
  volumes:
    - "*"
  hostNetwork: true
  hostPorts:
    - min: 0
      max: 65535
  hostIPC: true
  hostPID: true
  runAsUser:
    rule: "RunAsAny"
  seLinux:
    rule: "RunAsAny"
  supplementalGroups:
    rule: "RunAsAny"
  fsGroup:
    rule: "RunAsAny"
```

要查看当前部署在你的系统上的 podSecurityPolicies，请运行以下命令：

```bash
kubectl get psp -A
```

#### 网络策略

当 RKE2 以 `profile: cis-1.5` 参数运行时，它将对 `kube-system`、`kube-public` 和 `default` 命名空间应用两个网络策略，并应用相关注释。这些策略和注解的逻辑与 PSP 相同。启动时，检查每个命名空间的注释是否存在，如果存在，RKE2 不采取任何行动。如果注解不存在，RKE2 会检查策略是否存在，如果存在，则重新创建它。

第一个应用的策略是限制网络流量，只限于命名空间本身。见下文:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  managedFields:
    - apiVersion: networking.k8s.io/v1
      fieldsType: FieldsV1
      fieldsV1:
        f:spec:
          f:ingress: {}
          f:policyTypes: {}
  name: default-network-policy
  namespace: default
spec:
  ingress:
    - from:
        - podSelector: {}
  podSelector: {}
  policyTypes:
    - Ingress
```

第二个策略应用于`kube-system`命名空间，允许 DNS 流量。见下文：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  managedFields:
    - apiVersion: networking.k8s.io/v1
      fieldsV1:
        f:spec:
          f:ingress: {}
          f:podSelector:
            f:matchLabels:
          f:policyTypes: {}
  name: default-network-dns-policy
  namespace: kube-system
spec:
  ingress:
    - ports:
        - port: 53
          protocol: TCP
        - port: 53
          protocol: UDP
  podSelector:
    matchLabels:
  policyTypes:
    - Ingress
```

RKE2 将`default-network-policy`策略和`np.rke2.io`注解应用于所有内置命名空间。`kube-system` 命名空间额外获得 `default-network-dns-policy` 策略和 `np.rke2.io/dns` 注解。

要查看当前部署在你的系统上的网络策略，请运行以下命令：

```bash
kubectl get networkpolicies -A
```
