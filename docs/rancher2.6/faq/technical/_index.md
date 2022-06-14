---
title: 技术
weight: 8006
---

### 如何重置管理员密码？

Docker 安装：
```
$ docker exec -ti <container_id> reset-password
New password for default administrator (user-xxxxx):
<new_password>
```

Kubernetes 安装（Helm）：
```
$ KUBECONFIG=./kube_config_cluster.yml
$ kubectl --kubeconfig $KUBECONFIG -n cattle-system exec $(kubectl --kubeconfig $KUBECONFIG -n cattle-system get pods -l app=rancher --no-headers | head -1 | awk '{ print $1 }') -c rancher -- reset-password
New password for default administrator (user-xxxxx):
<new_password>
```



### 我删除/停用了最后一个 admin，该如何解决？
Docker 安装：
```
$ docker exec -ti <container_id> ensure-default-admin
New default administrator (user-xxxxx)
New password for default administrator (user-xxxxx):
<new_password>
```

Kubernetes 安装（Helm）：
```
$ KUBECONFIG=./kube_config_cluster.yml
$ kubectl --kubeconfig $KUBECONFIG -n cattle-system exec $(kubectl --kubeconfig $KUBECONFIG -n cattle-system get pods -l app=rancher | grep '1/1' | head -1 | awk '{ print $1 }') -- ensure-default-admin
New password for default administrator (user-xxxxx):
<new_password>
```
### 如何启用调试日志记录？

请参阅[故障排查：日志记录]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/logging/)。

### 我的 ClusterIP 不响应 ping，该如何解决？

ClusterIP 是一个虚拟 IP，不会响应 ping。要测试 ClusterIP 是否配置正确，最好的方法是使用 `curl` 访问 IP 和端口并检查它是否响应。

### 在哪里管理节点模板？

打开你的账号菜单（右上角）并选择`节点模板`。

### 为什么我的四层负载均衡器处于 `Pending` 状态？

四层负载均衡器创建为 `type: LoadBalancer`。Kubernetes 需要一个可以满足这些请求的云提供商或控制器，否则这些请求将永远处于 `Pending` 状态。有关更多信息，请参阅[云提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/)或[创建外部负载均衡器](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/)。

### Rancher 的状态存储在哪里？

- Docker 安装：在 `rancher/rancher` 容器的嵌入式 etcd 中，位于 `/var/lib/rancher`。
- Kubernetes install：在为运行 Rancher 而创建的 RKE 集群的 etcd 中。

### 支持的 Docker 版本是如何确定的？

我们遵循上游 Kubernetes 版本验证过的 Docker 版本。如果需要获取验证过的版本，请查看 Kubernetes 版本 CHANGELOG.md 中的 [External Dependencies](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.10.md#external-dependencies)。

### 如何访问 Rancher 创建的节点？

你可以转到**节点**视图，然后下载用于访问 Rancher 创建的节点的 SSH 密钥。选择要访问的节点并单击行尾 **⋮** 按钮，然后选择**下载密钥**，如下图所示。

![下载密钥]({{<baseurl>}}/img/rancher/downloadsshkeys.png)

解压缩下载的 zip 文件，并使用 `id_rsa` 文件连接到你的主机。请务必使用正确的用户名（如果是 RancherOS，则使用 `rancher` 或 `docker`；如果是 Ubuntu，则使用 `ubuntu`；如果是 Amazon Linux，则使用 `ec2-user`）。

```
$ ssh -i id_rsa user@ip_of_node
```

### 如何在 Rancher 中自动化任务 X？

UI 由静态文件组成，并根据 API 的响应工作。换言之，UI 中可以执行的每个操作/任务都可以通过 API 进行自动化。有两种方法可以实现这一点：

* 访问 `https://your_rancher_ip/v3` 并浏览 API 选项。
* 在使用 UI 时捕获 API 调用（通常使用 [Chrome 开发者工具](https://developers.google.com/web/tools/chrome-devtools/#network)，但你也可以使用其他工具）。

### 节点的 IP 地址改变了，该如何恢复？

节点需要配置静态 IP（或使用 DHCP 保留的 IP）。如果节点的 IP 已更改，你必须在集群中删除并重新添加它。删除后，Rancher 会将集群更新为正确的状态。如果集群不再处于 `Provisioning` 状态，则已从集群删除该节点。

节点的 IP 地址发生变化时，Rancher 会失去与节点的连接，因此无法正常清理节点。请参阅[清理集群节点]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cleaning-cluster-nodes/)来清理节点。

在集群中移除并清理节点时，你可以将节点重新添加到集群中。

### 如何将其他参数/绑定/环境变量添加到 Rancher 启动的 Kubernetes 集群的 Kubernetes 组件中？

你可以使用集群选项中的[配置文件]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options/#cluster-config-file)选项来添加其他参数/​​绑定/环境变量。有关详细信息，请参阅 RKE 文档中的[其他参数、绑定和环境变量]({{<baseurl>}}/rke/latest/en/config-options/services/services-extras/)，或浏览 [Cluster.ymls 示例]({{<baseurl>}}/rke/latest/en/example-yamls/)。

### 如何检查证书链是否有效？

使用 `openssl verify` 命令来验证你的证书链：

> **注意**：将 `SSL_CERT_DIR` 和 `SSL_CERT_FILE` 配置到虚拟位置，从而确保在手动验证时不使用操作系统安装的证书。

```
SSL_CERT_DIR=/dummy SSL_CERT_FILE=/dummy openssl verify -CAfile ca.pem rancher.yourdomain.com.pem
rancher.yourdomain.com.pem: OK
```

如果你看到 `unable to get local issuer certificate` 错误，则表示链不完整。通常情况下，这表示你的服务器证书由中间 CA 颁发。如果你已经拥有此证书，你可以在证书的验证中使用它，如下所示：

```
SSL_CERT_DIR=/dummy SSL_CERT_FILE=/dummy openssl verify -CAfile ca.pem -untrusted intermediate.pem rancher.yourdomain.com.pem
rancher.yourdomain.com.pem: OK
```

如果你已成功验证证书链，你需要在服务器证书中包含所需的中间 CA 证书，从而完成与 Rancher 连接的证书链（例如，使用 Rancher Agent）。服务器证书文件中证书的顺序首先是服务器证书本身（`rancher.yourdomain.com.pem` 的内容），然后是中间 CA 证书（`intermediate.pem` 的内容）：

```
-----BEGIN CERTIFICATE-----
%YOUR_CERTIFICATE%
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
%YOUR_INTERMEDIATE_CERTIFICATE%
-----END CERTIFICATE-----
```

如果在验证过程中仍然出现错误，你可以运行以下命令，检索服务器证书的主题和颁发者：

```
openssl x509 -noout -subject -issuer -in rancher.yourdomain.com.pem
subject= /C=GB/ST=England/O=Alice Ltd/CN=rancher.yourdomain.com
issuer= /C=GB/ST=England/O=Alice Ltd/CN=Alice Intermediate CA
```

### 如何在服务器证书中检查 `Common Name` 和 `Subject Alternative Names`？

虽然技术上仅需要 `Subject Alternative Names` 中有一个条目，但在 `Common Name` 和 `Subject Alternative Names` 中都包含主机名可以最大程度地提高与旧版浏览器/应用程序的兼容性。

检查 `Common Name`：

```
openssl x509 -noout -subject -in cert.pem
subject= /CN=rancher.my.org
```

检查 `Subject Alternative Names`：

```
openssl x509 -noout -in cert.pem -text | grep DNS
                DNS:rancher.my.org
```

### 为什么节点发生故障时重新调度一个 pod 需要 5 分钟以上的时间？

这是以下默认 Kubernetes 设置的组合导致的：

* kubelet
   * `node-status-update-frequency`：指定 kubelet 将节点状态发布到 master 的频率（默认 10s）。
* kube-controller-manager
   * `node-monitor-period`：在 NodeController 中同步 NodeStatus 的周期（默认 5s）。
   * `node-monitor-grace-period`：在将节点标记为不健康之前，允许节点无响应的时间长度（默认 40s）。
   * `pod-eviction-timeout`：在故障节点上删除 pod 的宽限期（默认 5m0s）。

有关这些设置的更多信息，请参阅 [Kubernetes：kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/) 和 [Kubernetes：kube-controller-manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/)。

Kubernetes 1.13 默认启用 `TaintBasedEvictions` 功能。有关详细信息，请参阅 [Kubernetes：基于污点的驱逐](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/#taint-based-evictions)。

* kube-apiserver（Kubernetes 1.13 及更高版本）
   * `default-not-ready-toleration-seconds`：表示 `notReady:NoExecute` 的容忍度的 `tolerationSeconds`，该设置默认添加到还没有该容忍度的 pod。
   * `default-unreachable-toleration-seconds`：表示 `unreachable:NoExecute` 的容忍度的 `tolerationSeconds`，该设置默认添加到还没有该容忍度的 pod。

### 我可以在 UI 中使用键盘快捷键吗？

是的，你可以使用键盘快捷键访问 UI 的大部分内容。要查看快捷方式的概览，请在 UI 任意位置按 `?`。
