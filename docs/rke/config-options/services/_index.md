---
title: 默认的Kubernetes服务
---

为了部署 Kubernetes，RKE 在节点上的 Docker 容器中部署了几个核心组件或服务。根据节点的角色，部署的容器可能不同。

所有服务都支持额外的[自定义参数、Docker 挂载绑定和额外的环境变量](/docs/rke/config-options/services/services-extras/_index)。

| 组件                    | cluster.yml 中的服务名 |
| :---------------------- | :--------------------- |
| etcd                    | `etcd`                 |
| kube-apiserver          | `kube-api`             |
| kube-controller-manager | `kube-controller`      |
| kubelet                 | `kubelet`              |
| kube-scheduler          | `scheduler`            |
| kube-proxy              | `kubeproxy`            |

## etcd

Kubernetes 使用[etcd](https://etcd.io/)作为集群状态和数据的存储。etcd 是一个可靠的、一致的、分布式的键值存储。

RKE 支持在单节点模式或 HA 集群模式下运行 etcd。它还支持向集群中添加和移除 etcd 节点。

您可以启用 etcd 来[拍摄循环快照](/docs/rke/etcd-snapshots/_index)。

默认情况下，RKE 会部署一个新的 etcd 服务，但你也可以使用[外部 etcd 服务](/docs/rke/config-options/services/external-etcd/_index)来运行 Kubernetes。

## Kubernetes API Server

> **Rancher 2 用户注意**如果您在创建[Rancher Launched Kubernetes](docs/cluster-provisioning/rke-clusters/options/_index)配置集群选项时，创建[Rancher Launched Kubernetes](/docs/cluster-provisioning/rke-clusters/_index)时，服务名称应只包含下划线：`kube_api`。这只适用于 Rancher v2.0.5 和 v2.0.6。

[Kubernetes API](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/) REST 服务，处理所有 Kubernetes 对象的请求和数据，并为所有其他 Kubernetes 组件提供共享状态。

```yaml
services:
  kube-api:
    # IP range for any services created on Kubernetes
    # This must match the service_cluster_ip_range in kube-controller
    service_cluster_ip_range: 10.43.0.0/16
    # Expose a different port range for NodePort services
    service_node_port_range: 30000-32767
    pod_security_policy: false
    # Enable AlwaysPullImages Admission controller plugin
    # Available as of v0.2.0
    always_pull_images: false
    secrets_encryption_config:
      enabled: true
```

### Kubernetes API Server 选项

RKE 支持`kube-api`服务的以下选项。

- **服务集群 IP 范围** (`service_cluster_ip_range`) - 这是将分配给 Kubernetes 上创建的服务的虚拟 IP 地址。默认情况下，服务集群 IP 范围是`10.43.0.0/16`。如果你改变了这个值，那么也必须在 Kubernetes 控制器管理器（`kube-controller`）上设置相同的值。
- **节点端口范围** (`service_node_port_range`) - 使用[type](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types) `NodePort`创建的 Kubernetes 服务的端口范围。默认情况下，端口范围是`30000-32767`。
- **Pod 安全策略** (`pod_security_policy`) - 启用[Kubernetes Pod 安全策略](https://kubernetes.io/docs/concepts/policy/pod-security-policy/)的选项。默认情况下，我们不会启用 pod 安全策略，因为它被设置为`false`。
  > **注意：**如果你将`pod_security_policy`值设置为`true`，RKE 将配置一个开放的策略，允许任何 pod 在集群上工作。你需要配置你自己的策略来充分利用 PSP。
- **拉取镜像** (`always_pull_images`) - 启用`AlwaysPullImages` Admission 控制器插件。启用`AlwaysPullImages`是一个安全的最佳实践。它强制 Kubernetes 与远程图像注册表验证图像和拉动凭证。本地图像层缓存仍将被使用，但它确实会在启动容器拉取和比较图像哈希时增加一点开销。_注：从 v0.2.0 开始提供_。
- **Secrets Encryption Config** (`secrets_encryption_config`) - 管理 Kubernetes 静态数据加密。文档化[这里](/docs/rke/config-options/secrets-encryption/_index)

## Kubernetes Controller Manager

> **Note for Rancher 2 users** If you are configuring Cluster Options using a [Config File]({{<baseurl>}}/rancher/v2.x/en/cluster-provisioning/rke-clusters/options/#config-file) when creating [Rancher Launched Kubernetes]({{<baseurl>}}/rancher/v2.x/en/cluster-provisioning/rke-clusters/), the names of services should contain underscores only: `kube_controller`. This only applies to Rancher v2.0.5 and v2.0.6.

The [Kubernetes Controller Manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/) service is the component responsible for running Kubernetes main control loops. The controller manager monitors the cluster desired state through the Kubernetes API server and makes the necessary changes to the current state to reach the desired state.

> **Rancher 2 用户注意**如果您在创建[Rancher Launched Kubernetes](/docs/cluster-provisioning/rke-clusters/options/_index)时，在创建[Rancher Launched Kubernetes](/docs/cluster-provisioning/rke-clusters/options/_index)时，服务名称应只包含下划线：`kube_controller`。这只适用于 Rancher v2.0.5 和 v2.0.6。

[Kubernetes 控制器管理器](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/)服务是负责运行 Kubernetes 主控制循环的组件。控制器管理器通过 Kubernetes API 服务器监控集群所需的状态，并对当前状态进行必要的修改，以达到所需的状态。

```yaml
services:
  kube-controller:
    # CIDR pool used to assign IP addresses to pods in the cluster
    cluster_cidr: 10.42.0.0/16
    # IP range for any services created on Kubernetes
    # This must match the service_cluster_ip_range in kube-api
    service_cluster_ip_range: 10.43.0.0/16
```

### Kubernetes Controller Manager 选项

RKE 支持`kube-controller`服务的以下选项。

- **集群 CIDR** (`cluster_cidr`) - 用于为集群中的 pod 分配 IP 地址的 CIDR 池。默认情况下，集群中的每个节点都会从该池中分配一个`/24`网络，用于分配 pod IP。该选项的默认值是`10.42.0.0/16`。
- **服务集群 IP 范围** (`service_cluster_ip_range`) - 这是将分配给 Kubernetes 上创建的服务的虚拟 IP 地址。默认情况下，服务集群 IP 范围是`10.43.0.0/16`。如果你改变了这个值，那么也必须在 Kubernetes API 服务器（`kube-api`）上设置相同的值。

## Kubelet

[kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/)服务作为 Kubernetes 的 "节点代理"。它运行在 RKE 部署的所有节点上，并让 Kubernetes 有能力管理节点上的容器运行时。

```yaml
services:
  kubelet:
    # Base domain for the cluster
    cluster_domain: cluster.local
    # IP address for the DNS service endpoint
    cluster_dns_server: 10.43.0.10
    # Fail if swap is on
    fail_swap_on: false
    # Generate per node serving certificate
    generate_serving_certificate: false
```

### Kubelet 选项

RKE 支持 "kubelet "服务的以下选项。

- **集群域** (`cluster_domain`) - 集群的[基本域](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)。集群上创建的所有服务和 DNS 记录。默认情况下，域被设置为`cluster.local`。
- **集群 DNS 服务器** (`cluster_dns_server`) - 分配给集群内 DNS 服务端点的 IP 地址。DNS 查询将被发送到这个 IP 地址，该地址被 KubeDNS 使用。这个选项的默认值是`10.43.0.10`。
- **Fail if Swap is On** (`fail_swap_on`) - 在 Kubernetes 中，如果节点上启用了 swap，kubelet 的默认行为是**失败**。RKE 不会遵循这个默认值，而是允许在启用 swap 的节点上进行部署。默认情况下，这个值是`false`。如果你想恢复到默认的 kubelet 行为，请将此选项设置为 "true"。
- **Generate Serving Certificate** (`generate_serving_certificate`) - 为 kubelet 生成一个由`kube-ca`证书颁发机构签署的证书作为服务器证书。这个选项的默认值是`false`。在启用这个选项之前，请参考下文的 Kubelet Serving Certificate 需求。

### Kubelet Serving Certificate 需求

如果在`cluster.yml`中为一个或多个节点配置了`hostname_override`，请确保在`address`中配置了正确的 IP 地址（以及`internal_address`中的内部地址），以确保生成的证书包含正确的 IP 地址。

一个错误的例子是，在 EC2 实例中，如果在`address`中配置了公共 IP 地址，并且使用了`hostname_override`，那么`kube-apiserver`和`kubelet`之间的连接将失败，因为`kubelet`将在私有 IP 地址上被联系，生成的证书将无效（将看到错误`x509：证书对 value_in_address 有效，而不是 private_ip`）。解决方法是在`internal_address`中提供内部 IP 地址。

关于主机覆盖的更多信息，请参考[节点配置页](/docs/rke/config-options/nodes/_index)。

## Kubernetes Scheduler

[Kubernetes Scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)服务负责根据各种配置、指标、资源需求和工作负载的特定要求来调度集群工作负载。

目前，RKE 并不支持`scheduler`服务的任何特定选项。

## Kubernetes Network Proxy

[Kubernetes 网络代理](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/)服务运行在所有节点上，管理 Kubernetes 创建的 TCP/UDP 端口的端点。

目前，RKE 不支持 "kubeproxy "服务的任何特定选项。
