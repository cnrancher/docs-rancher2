---
title: 跳过和不适用的测试
weight: 3
---

本文列出了在 RKE 的 permissive 测试配置文件中跳过的测试。

> 在 v2.5 生成的报告中，此页面上被跳过且不适用的测试将会计为不适用。跳过的测试计数只会涉及用户定义的跳过测试。这样，你可以区分用户要跳过的测试与 RKE permissive 测试配置文件中默认跳过的测试。

## CIS Benchmark v1.5

### CIS Benchmark v1.5 跳过的测试

| 数字 | 描述 | 跳过的原因 |
| ---------- | ------------- | --------- |
| 1.1.12 | 确保 etcd 数据目录所有权设置为 etcd:etcd（自动） | etcd 数据目录所有权需要系统服务账号。有关如何配置所有权的更多信息，请参阅 Rancher 的强化指南。 |
| 1.2.6 | 确保能根据需要设置 --kubelet-certificate-authority 参数（自动） | 在生成服务证书时，功能可能会与某些云提供商所需的主机名覆盖一起中断。 |
| 1.2.16 | 确保设置了准入控制插件 PodSecurityPolicy（自动） | 启用 Pod 安全策略可能会导致应用意外失败。 |
| 1.2.33 | 确保能根据需要设置 --encryption-provider-config 参数（手动） | 启用加密会改变恢复加密数据的方式。 |
| 1.2.34 | 确保正确配置了加密提供程序（手动） | 启用加密会改变恢复加密数据的方式。 |
| 4.2.6 | 确保 --protect-kernel-defaults 参数设置为 true（自动） | 在配置集群之前需要系统级别的配置，才能将此参数设置为 true。 |
| 4.2.10 | 确保能根据需要设置 --tls-cert-file 和 --tls-private-key-file 参数（自动） | 在生成服务证书时，功能可能会与某些云提供商所需的主机名覆盖一起中断。 |
| 5.1.5 | 确保未主动使用默认服务账号。（自动） | Kubernetes 提供了要使用的默认服务账号。 |
| 5.2.2 | 最小化需要共享主机进程 ID 命名空间的容器准入（自动） | 启用 Pod 安全策略可能会导致应用意外失败。 |
| 5.2.3 | 最小化需要共享主机 IPC 命名空间的容器准入（自动） | 启用 Pod 安全策略可能会导致应用意外失败。 |
| 5.2.4 | 最小化需要共享主机网络命名空间的容器准入（自动） | 启用 Pod 安全策略可能会导致应用意外失败。 |
| 5.2.5 | 使用 allowPrivilegeEscalation（自动）最小化容器的准入 | 启用 Pod 安全策略可能会导致应用意外失败。 |
| 5.3.2 | 确保所有命名空间都定义了网络策略（自动） | 启用网络策略可以防止某些应用进行相互通信。 |
| 5.6.4 | 确保不使用 Default 命名空间（自动） | Kubernetes 提供了一个 Default 命名空间。 |

### CIS Benchmark v1.5 不适用的测试

| 数字 | 描述 | 不适用的原因 |
| ---------- | ------------- | --------- |
| 1.1.1 | 确保 API Server pod 规范文件权限具有 644 或更严格的设置（自动） | RKE 配置的集群不需要或维护 kube-apiserver 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.1.2 | 确保 API Server pod 规范文件所有权设置为 root:root（自动） | RKE 配置的集群不需要或维护 kube-apiserver 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.1.3 | 确保 Controller Manager pod 规范文件权限具有 644 或更严格的设置（自动） | RKE 配置的集群不需要或维护 controller-manager 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.1.4 | 确保 Controller Manager pod 规范文件所有权设置为 root:root（自动） | RKE 配置的集群不需要或维护 controller-manager 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.1.5 | 确保 Scheduler pod 规范文件权限具有 644 或更严格的设置（自动） | RKE 配置的集群不需要或维护 Scheduler 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.1.6 | 确保 Scheduler pod 规范文件所有权设置为 root:root（自动） | RKE 配置的集群不需要或维护 Scheduler 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.1.7 | 确保 etcd pod 规范文件权限具有 644 或更严格的设置（自动） | RKE 配置的集群不需要或维护 etcd 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.1.8 | 确保 etcd pod 规范文件所有权设置为 root:root（自动） | RKE 配置的集群不需要或维护 etcd 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.1.13 | 确保 admin.conf 文件权限具有 644 或更严格的设置（自动） | RKE 配置的集群不会在节点上存储 kubernetes 的默认 kubeconfig 凭证文件。 |
| 1.1.14 | 确保 admin.conf 文件所有权设置为 root:root（自动） | RKE 配置的集群不会在节点上存储 kubernetes 的默认 kubeconfig 凭证文件。 |
| 1.1.15 | 确保 scheduler.conf 文件权限具有 644 或更严格的设置（自动） | RKE 配置的集群不需要或维护 Scheduler 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.1.16 | 确保 scheduler.conf 文件所有权设置为 root:root（自动） | RKE 配置的集群不需要或维护 Scheduler 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.1.17 | 确保 controller-manager.conf 文件权限具有 644 或更严格的设置（自动） | RKE 配置的集群不需要或维护 controller-manager 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.1.18 | 确保将 controller-manager.conf 文件所有权设置为 root:root（自动） | RKE 配置的集群不需要或维护 controller-manager 的配置文件。所有配置在容器运行时作为参数传入。 |
| 1.3.6 | 确保 RotateKubeletServerCertificate 参数设置为 true（自动） | RKE 配置的集群直接使用 RKE 处理证书轮换。 |
| 4.1.1 | 确保 kubelet 服务文件权限具有 644 或更严格的设置（自动） | RKE 配置的集群不需要或维护 kubelet 服务的配置文件。所有配置在容器运行时作为参数传入。 |
| 4.1.2 | 确保 kubelet 服务文件所有权设置为 root:root（自动） | RKE 配置的集群不需要或维护 kubelet 服务的配置文件。所有配置在容器运行时作为参数传入。 |
| 4.1.9 | 确保 kubelet 配置文件权限具有 644 或更严格的设置（自动） | RKE 配置的集群不需要或维护 kubelet 的配置文件。所有配置在容器运行时作为参数传入。 |
| 4.1.10 | 确保 kubelet 配置文件所有权设置为 root:root（自动） | RKE 配置的集群不需要或维护 kubelet 的配置文件。所有配置在容器运行时作为参数传入。 |
| 4.2.12 | 确保 RotateKubeletServerCertificate 参数设置为 true（自动） | RKE 配置的集群直接使用 RKE 处理证书轮换。 |