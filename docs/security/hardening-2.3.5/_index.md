---
title: 安全加固指南 - v2.3.5
description: 本文是 Rancher v2.3.5 生产环境的安全加固指南。它概述了如何使您的集群符合互联网安全中心发布的 Kubernetes 安全基准。本加固指南介绍了如何保护集群中节点的安全，建议在安装 Kubernetes 之前按照本指南进行操作。该加固指南旨在与特定版本的 CIS Kubernetes Benchmark，Kubernetes 和 Rancher 一起使用。
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
  - 安全
  - 安全加固指南
  - 安全加固指南 - v2.3.5
---

本文是 Rancher v2.3.5 生产环境的安全加固指南。它概述了如何使您的集群符合互联网安全中心发布的 Kubernetes 安全基准。

> 本加固指南介绍了如何保护集群中节点的安全，建议在安装 Kubernetes 之前按照本指南进行操作。

该加固指南旨在与特定版本的 CIS Kubernetes Benchmark，Kubernetes 和 Rancher 一起使用：

| 加固指南版本    | Rancher 版本   | CIS Benchmark 版本 | Kubernetes 版本  |
| --------------- | -------------- | ------------------ | ---------------- |
| 加固指南 v2.3.5 | Rancher v2.3.5 | Benchmark v1.5     | Kubernetes v1.15 |

[点击这里下载 PDF 版本的加固指南](https://releases.rancher.com/documents/security/2.3.5/Rancher_Hardening_Guide.pdf)

## 概览

下面的安全加固指南是针对在生产环境的 Rancher v2.3.5 中使用 Kubernetes v1.15 版本的集群。它概述了如何满足互联网安全中心（CIS）提出的 Kubernetes 安全标准。

有关如果根据官方 CIS 基准评估集群的更多详细信息，请参阅[CIS Benchmark Rancher 自测指南 - Rancher v2.3.5](/docs/security/benchmark-2.3.5/_index)。

## 已知问题

如果注册自定义节点时只提供了公共 IP，在 CIS 1.5 加固设置中，将无法正常在 Rancher UI 中使用**执行命令行**和**查看日志**功能。

## 配置内核运行时参数

对于集群中的所有类型的节点，都建议使用以下的`sysctl`配置。在`/etc/sysctl.d/90-kubelet.conf`中设置以下参数：

```
vm.overcommit_memory=1
vm.panic_on_oom=0
kernel.panic=10
kernel.panic_on_oops=1
kernel.keys.root_maxbytes=25000000
```

执行`sysctl -p /etc/sysctl.d/90-kubelet.conf`来启用配置。

## 配置`etcd`用户和组

在安装 RKE 之前，需要设置**etcd**服务的用户帐户和组。**etcd**用户的**uid**和**gid**将在 RKE 的**config.yml**中使用，以在安装期间为文件和目录设置适当的权限。

### 创建`etcd`用户和组

要创建**etcd**组，请运行以下控制台命令。

```
addgroup --gid 52034 etcd
useradd --comment "etcd service account" --uid 52034 --gid 52034 etcd
```

使用**etcd**用户的**uid**和**gid**更新 RKE 的 **config.yml**文件：

```yaml
services:
  etcd:
    gid: 52034
    uid: 52034
```

## 将`default`服务账号的`automountServiceAccountToken`设置为 false。

Kubernetes 提供了一个默认服务账号（Service Account），如果集群的工作负载中没有为 Pod 分配任何特定服务账号，那么它将会使用这个`default`的服务账号。在需要从 Pod 访问 Kubernetes API 的情况下，应为该 Pod 创建一个特定的服务账号，并向该服务账号授予权限。这个`default`的服务账户应该被设置为不提供服务账号令牌（service account token）和任何权限。将`automountServiceAccountToken`设置为 false 之后，Kubernetes 在启动 Pod 时，将不会自动注入`default`服务账户。

对于每个命名空间中的，**default**服务账号必须包含以下值：

```
automountServiceAccountToken: false
```

把下面的 yaml 另存为`account_update.yaml`

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: default
automountServiceAccountToken: false
```

创建一个名称为`account_update.sh`的脚本。通过运行`chmod +x account_update.sh`，使这个脚本有执行权限。

```
#!/bin/bash -e

for namespace in $(kubectl get namespaces -A -o json | jq -r '.items[].metadata.name'); do
  kubectl patch serviceaccount default -n ${namespace} -p "$(cat account_update.yaml)"
done
```

## 确保所有命名空间均已定义网络策略

在同一个 Kubernetes 集群上运行不同的应用程序会产生一个风险，那就是应用可能受到相邻应用程序的攻击。为了确保容器只能与预期的容器进行通信，网络细分是必不可少的。通过设置网络策略（Network Policy），可以设置哪些 Pod 之间可以通信，以及是否可以和其他网络端点进行通信。

网络策略是作用于命名空间范围的。将网络策略应用于给定命名空间时，所有不被这个策略允许的流量将被拒绝。然而，如果命名空间中没有设置网络策略，那么进出这个命名空间中 Pod 的所有流量都将被允许。要使用网络策略，必须启用 CNI（容器网络接口）插件。本指南使用[canal](https://github.com/projectcalico/canal)提供策略实施。您可以在[这里](https://rancher.com/blog/2019/2019-03-21-comparing-kubernetes-cni-providers-flannel-calico-canal-and-weave/)找到有关 CNI 插件的其他信息。

在集群上启用 CN​​I 插件后，您可以设置一个默认的网络策略。下面是一个**宽松**的网络策略示例，仅供参考。如果您想要允许到某个命名空间内所有 Pod 的流量（即使已经添加了一些策略，使得一些 Pods 被隔离了），您可以创建一个策略，明确允许该命名空间中的所有流量。将以下`yaml`另存为
`default-allow-all.yaml`。额外关于网络策略的信息，请查看[Kubernetes 官方文档](https://kubernetes.io/docs/concepts/services-networking/network-policies/)。

:::important 重要
这个`NetworkPolicy`示例不建议在生产环境中使用。
:::

```yaml
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-allow-all
spec:
  podSelector: {}
  ingress:
    - {}
  egress:
    - {}
  policyTypes:
    - Ingress
    - Egress
```

创建一个名称为`apply_networkPolicy_to_all_ns.sh`的脚本。通过运行`chmod +x apply_networkPolicy_to_all_ns.sh`，使这个脚本有执行权限。

```
#!/bin/bash -e

for namespace in $(kubectl get namespaces -A -o json | jq -r '.items[].metadata.name'); do
  kubectl apply -f default-allow-all.yaml -n ${namespace}
done
```

运行脚本，以使全部的命名空间使用这个`default-allow-all.yaml`文件中的**宽松**的`NetworkPolicy`。

## 加固的 RKE `cluster.yml` 配置参考

您可以用这个供您参考的`cluster.yml`，通过 RKE CLI 来创建安全加固的 Rancher Kubernetes Engine（RKE）集群。有关每个配置的详细信息，请参阅[RKE 文档](https://rancher.com/docs/rke/latest/en/installation/)。

```yaml
# 如果您打算在离线环境中部署Kubernetes，
# 请查阅有关如何配置自定义RKE镜像的文档。
kubernetes_version: "v1.15.9-rancher1-1"
enable_network_policy: true
default_pod_security_policy_template_id: "restricted"
services:
  etcd:
    uid: 52034
    gid: 52034
  kube-api:
    pod_security_policy: true
    secrets_encryption_config:
      enabled: true
    audit_log:
      enabled: true
    admission_configuration:
    event_rate_limit:
      enabled: true
  kube-controller:
    extra_args:
      feature-gates: "RotateKubeletServerCertificate=true"
  scheduler:
    image: ""
    extra_args: {}
    extra_binds: []
    extra_env: []
  kubelet:
    generate_serving_certificate: true
    extra_args:
      feature-gates: "RotateKubeletServerCertificate=true"
      protect-kernel-defaults: "true"
      tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
    extra_binds: []
    extra_env: []
    cluster_domain: ""
    infra_container_image: ""
    cluster_dns_server: ""
    fail_swap_on: false
  kubeproxy:
    image: ""
    extra_args: {}
    extra_binds: []
    extra_env: []
network:
  plugin: ""
  options: {}
  mtu: 0
  node_selector: {}
authentication:
  strategy: ""
  sans: []
  webhook: null
addons: |
  ---
  apiVersion: v1
  kind: Namespace
  metadata:
    name: ingress-nginx
  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    name: default-psp-role
    namespace: ingress-nginx
  rules:
  - apiGroups:
    - extensions
    resourceNames:
    - default-psp
    resources:
    - podsecuritypolicies
    verbs:
    - use
  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: default-psp-rolebinding
    namespace: ingress-nginx
  roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: Role
    name: default-psp-role
  subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:serviceaccounts
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:authenticated
  ---
  apiVersion: v1
  kind: Namespace
  metadata:
    name: cattle-system
  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    name: default-psp-role
    namespace: cattle-system
  rules:
  - apiGroups:
    - extensions
    resourceNames:
    - default-psp
    resources:
    - podsecuritypolicies
    verbs:
    - use
  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: default-psp-rolebinding
    namespace: cattle-system
  roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: Role
    name: default-psp-role
  subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:serviceaccounts
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:authenticated
  ---
  apiVersion: policy/v1beta1
  kind: PodSecurityPolicy
  metadata:
    name: restricted
  spec:
    requiredDropCapabilities:
    - NET_RAW
    privileged: false
    allowPrivilegeEscalation: false
    defaultAllowPrivilegeEscalation: false
    fsGroup:
      rule: RunAsAny
    runAsUser:
      rule: MustRunAsNonRoot
    seLinux:
      rule: RunAsAny
    supplementalGroups:
      rule: RunAsAny
    volumes:
    - emptyDir
    - secret
    - persistentVolumeClaim
    - downwardAPI
    - configMap
    - projected
  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRole
  metadata:
    name: psp:restricted
  rules:
  - apiGroups:
    - extensions
    resourceNames:
    - restricted
    resources:
    - podsecuritypolicies
    verbs:
    - use
  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRoleBinding
  metadata:
    name: psp:restricted
  roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: ClusterRole
    name: psp:restricted
  subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:serviceaccounts
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:authenticated
  ---
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: tiller
    namespace: kube-system
  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRoleBinding
  metadata:
    name: tiller
  roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: ClusterRole
    name: cluster-admin
  subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system

addons_include: []
system_images:
  etcd: ""
  alpine: ""
  nginx_proxy: ""
  cert_downloader: ""
  kubernetes_services_sidecar: ""
  kubedns: ""
  dnsmasq: ""
  kubedns_sidecar: ""
  kubedns_autoscaler: ""
  coredns: ""
  coredns_autoscaler: ""
  kubernetes: ""
  flannel: ""
  flannel_cni: ""
  calico_node: ""
  calico_cni: ""
  calico_controllers: ""
  calico_ctl: ""
  calico_flexvol: ""
  canal_node: ""
  canal_cni: ""
  canal_flannel: ""
  canal_flexvol: ""
  weave_node: ""
  weave_cni: ""
  pod_infra_container: ""
  ingress: ""
  ingress_backend: ""
  metrics_server: ""
  windows_pod_infra_container: ""
ssh_key_path: ""
ssh_cert_path: ""
ssh_agent_auth: false
authorization:
  mode: ""
  options: {}
ignore_docker_version: false
private_registries: []
ingress:
  provider: ""
  options: {}
  node_selector: {}
  extra_args: {}
  dns_policy: ""
  extra_envs: []
  extra_volumes: []
  extra_volume_mounts: []
cluster_name: ""
prefix_path: ""
addon_job_timeout: 0
bastion_host:
  address: ""
  port: ""
  user: ""
  ssh_key: ""
  ssh_key_path: ""
  ssh_cert: ""
  ssh_cert_path: ""
monitoring:
  provider: ""
  options: {}
  node_selector: {}
restore:
  restore: false
  snapshot_name: ""
dns: null
```

## 安全加固的 RKE 模板配置参考

这个 RKE 参考模板提供了安装安全加固的 Kubenetes 所需的配置。RKE 模板用于配置 Kubernetes 和定义 Rancher 设置。请参阅[Rancher 文档](https://rancher.com/docs/rancher/v2.x/en/installation)获得更多安装和 RKE 模板的详细信息。

```yaml
#
# Cluster Config
#
default_pod_security_policy_template_id: restricted
docker_root_dir: /var/lib/docker
enable_cluster_alerting: false
enable_cluster_monitoring: false
enable_network_policy: true
#
# Rancher Config
#
rancher_kubernetes_engine_config:
  addon_job_timeout: 30
  addons: |-
    ---
    apiVersion: v1
    kind: Namespace
    metadata:
      name: ingress-nginx
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: Role
    metadata:
      name: default-psp-role
      namespace: ingress-nginx
    rules:
    - apiGroups:
      - extensions
      resourceNames:
      - default-psp
      resources:
      - podsecuritypolicies
      verbs:
      - use
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: RoleBinding
    metadata:
      name: default-psp-rolebinding
      namespace: ingress-nginx
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: Role
      name: default-psp-role
    subjects:
    - apiGroup: rbac.authorization.k8s.io
      kind: Group
      name: system:serviceaccounts
    - apiGroup: rbac.authorization.k8s.io
      kind: Group
      name: system:authenticated
    ---
    apiVersion: v1
    kind: Namespace
    metadata:
      name: cattle-system
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: Role
    metadata:
      name: default-psp-role
      namespace: cattle-system
    rules:
    - apiGroups:
      - extensions
      resourceNames:
      - default-psp
      resources:
      - podsecuritypolicies
      verbs:
      - use
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: RoleBinding
    metadata:
      name: default-psp-rolebinding
      namespace: cattle-system
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: Role
      name: default-psp-role
    subjects:
    - apiGroup: rbac.authorization.k8s.io
      kind: Group
      name: system:serviceaccounts
    - apiGroup: rbac.authorization.k8s.io
      kind: Group
      name: system:authenticated
    ---
    apiVersion: policy/v1beta1
    kind: PodSecurityPolicy
    metadata:
      name: restricted
    spec:
      requiredDropCapabilities:
      - NET_RAW
      privileged: false
      allowPrivilegeEscalation: false
      defaultAllowPrivilegeEscalation: false
      fsGroup:
        rule: RunAsAny
      runAsUser:
        rule: MustRunAsNonRoot
      seLinux:
        rule: RunAsAny
      supplementalGroups:
        rule: RunAsAny
      volumes:
      - emptyDir
      - secret
      - persistentVolumeClaim
      - downwardAPI
      - configMap
      - projected
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRole
    metadata:
      name: psp:restricted
    rules:
    - apiGroups:
      - extensions
      resourceNames:
      - restricted
      resources:
      - podsecuritypolicies
      verbs:
      - use
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
      name: psp:restricted
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: psp:restricted
    subjects:
    - apiGroup: rbac.authorization.k8s.io
      kind: Group
      name: system:serviceaccounts
    - apiGroup: rbac.authorization.k8s.io
      kind: Group
      name: system:authenticated
    ---
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: tiller
      namespace: kube-system
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
      name: tiller
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: cluster-admin
    subjects:
    - kind: ServiceAccount
      name: tiller
      namespace: kube-system
  ignore_docker_version: true
  kubernetes_version: v1.15.9-rancher1-1
  #
  #   If you are using calico on AWS
  #
  #    network:
  #      plugin: calico
  #      calico_network_provider:
  #        cloud_provider: aws
  #
  # # To specify flannel interface
  #
  #    network:
  #      plugin: flannel
  #      flannel_network_provider:
  #      iface: eth1
  #
  # # To specify flannel interface for canal plugin
  #
  #    network:
  #      plugin: canal
  #      canal_network_provider:
  #        iface: eth1
  #
  network:
    mtu: 0
    plugin: canal
  #
  #    services:
  #      kube-api:
  #        service_cluster_ip_range: 10.43.0.0/16
  #      kube-controller:
  #        cluster_cidr: 10.42.0.0/16
  #        service_cluster_ip_range: 10.43.0.0/16
  #      kubelet:
  #        cluster_domain: cluster.local
  #        cluster_dns_server: 10.43.0.10
  #
  services:
    etcd:
      backup_config:
        enabled: false
        interval_hours: 12
        retention: 6
        safe_timestamp: false
      creation: 12h
      extra_args:
        election-timeout: "5000"
        heartbeat-interval: "500"
      gid: 52034
      retention: 72h
      snapshot: false
      uid: 52034
    kube_api:
      always_pull_images: false
      audit_log:
        enabled: true
      event_rate_limit:
        enabled: true
      pod_security_policy: true
      secrets_encryption_config:
        enabled: true
      service_node_port_range: 30000-32767
    kube_controller:
      extra_args:
        address: 127.0.0.1
        feature-gates: RotateKubeletServerCertificate=true
        profiling: "false"
        terminated-pod-gc-threshold: "1000"
    kubelet:
      extra_args:
        anonymous-auth: "false"
        event-qps: "0"
        feature-gates: RotateKubeletServerCertificate=true
        make-iptables-util-chains: "true"
        protect-kernel-defaults: "true"
        streaming-connection-idle-timeout: 1800s
        tls-cipher-suites: >-
          TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256
      fail_swap_on: false
      generate_serving_certificate: true
    scheduler:
      extra_args:
        address: 127.0.0.1
        profiling: "false"
  ssh_agent_auth: false
windows_prefered_cluster: false
```

## 安全加固的 Ubuntu 18.04 LTS **cloud-config**参考配置

这个供您参考的**cloud-config**通常被用于云基础架构环境中，来进行计算实例的配置管理。这个参考配置了在安装 kubernetes 之前需要的 Ubuntu 操作系统级别的设置。

```yaml
#cloud-config
packages:
  - curl
  - jq
runcmd:
  - sysctl -w vm.overcommit_memory=1
  - sysctl -w kernel.panic=10
  - sysctl -w kernel.panic_on_oops=1
  - curl https://releases.rancher.com/install-docker/18.09.sh | sh
  - usermod -aG docker ubuntu
  - return=1; while [ $return != 0 ]; do sleep 2; docker ps; return=$?; done
  - addgroup --gid 52034 etcd
  - useradd --comment "etcd service account" --uid 52034 --gid 52034 etcd
write_files:
  - path: /etc/sysctl.d/kubelet.conf
    owner: root:root
    permissions: "0644"
    content: |
      vm.overcommit_memory=1
      kernel.panic=10
      kernel.panic_on_oops=1
```
