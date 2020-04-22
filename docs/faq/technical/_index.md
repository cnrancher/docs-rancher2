---
title: 技术问题
description: 本节旨在回答关于Rancher技术的相关问题。
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
  - 常见问题
  - 技术问题
---

## 如何重置系统管理员（admin）密码？

使用单节点 Docker 安装时：

```
$ docker exec -ti <container_id> reset-password
New password for default administrator (user-xxxxx):
<new_password>
```

使用 Helm 的高可用安装时：

```
$ KUBECONFIG=./kube_config_rancher-cluster.yml
$ kubectl --kubeconfig $KUBECONFIG -n cattle-system exec $(kubectl --kubeconfig $KUBECONFIG -n cattle-system get pods -l app=rancher | grep '1/1' | head -1 | awk '{ print $1 }') -- reset-password
New password for default administrator (user-xxxxx):
<new_password>
```

使用 RKE Add-ons 的高可用安装时：

```
$ KUBECONFIG=./kube_config_rancher-cluster.yml
$ kubectl --kubeconfig $KUBECONFIG exec -n cattle-system $(kubectl --kubeconfig $KUBECONFIG get pods -n cattle-system -o json | jq -r '.items[] | select(.spec.containers[].name=="cattle-server") | .metadata.name') -- reset-password
New password for default administrator (user-xxxxx):
<new_password>
```

## 我删除/禁用了 admin 用户，该如何修复？

使用单节点 Docker 安装时：

```
$ docker exec -ti <container_id> ensure-default-admin
New default administrator (user-xxxxx)
New password for default administrator (user-xxxxx):
<new_password>
```

使用 Helm 的高可用安装时：

```
$ KUBECONFIG=./kube_config_rancher-cluster.yml
$ kubectl --kubeconfig $KUBECONFIG -n cattle-system exec $(kubectl --kubeconfig $KUBECONFIG -n cattle-system get pods -l app=rancher | grep '1/1' | head -1 | awk '{ print $1 }') -- ensure-default-admin
New password for default administrator (user-xxxxx):
<new_password>
```

使用 RKE Add-ons 的高可用安装时：

```
$ KUBECONFIG=./kube_config_rancher-cluster.yml
$ kubectl --kubeconfig $KUBECONFIG exec -n cattle-system $(kubectl --kubeconfig $KUBECONFIG get pods -n cattle-system -o json | jq -r '.items[] | select(.spec.containers[].name=="cattle-server") | .metadata.name') -- ensure-default-admin
New password for default admin user (user-xxxxx):
<new_password>
```

## 如何开启 debug 调试日志？

请参阅[问题排查：日志级别](/docs/troubleshooting/logging/_index)。

## 我不能 ping 通 ClusterIP

ClusterIP 是一个虚拟 IP，不能够回应 ping。更好的测试 ClusterIP 是否生效，可以采用`curl`命令访问其 IP 和端口。

## 在哪里管理节点模板？

您可以在右上角账户菜单选择**节点模版**打开节点模版。

## 为什么创建的 L4 负载均衡器一直处在`Pending`状态？

L4 负载均衡器是通过`type: LoadBalancer`创建的。在 Kubernetes 里，它需要一个公有云提供商或者类似控制器（例如：MetalLB）来响应创建需求，否则就会一直处在`Pending`状态。更多信息请参阅[公有云提供商](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index)或[创建外部负载均衡器](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/)。

## Rancher 的状态数据存储在哪里？

- Docker 安装方式：存储在嵌入在 rancher 容器的 etcd 里，目录为`/var/lib/rancher`。
- 高可用安装（RKE）：存储在 Rancher 所在的 Kubernete 集群的 etcd 中。
- 高可用安装（K3s）：存储在 Rancher 使用的 MySQL 或其他数据库中。

## 如何确定受支持的 Dokcer 版本？

我们依从上游 Kubernetes 版本的已验证的 Docker 版本。已验证的 Docker 版本可以在[外部依赖](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.10.md#external-dependencies)中的 Kubernetes 发布 CHANGELOG.md 查看。

## 如何访问通过 Rancher 创建的节点？

可以通过**节点**视图下载通过 Rancher 创建的节点的 SSH keys。选择您想要访问的节点并选择末尾的垂直省略号按钮，选择**下载密钥**即可下载。

![Download Keys](/img/rancher/downloadsshkeys.png)

解压下载后的 zip 文件，通过`id_rsa`文件连接您的节点。请确保使用正确的用户名（RancherOS 用`rancher` 或 `docker`，Ubuntu 用`ubuntu`，Amazon Linux 用`ec2-user`）

```
$ ssh -i id_rsa user@ip_of_node
```

## 如何在 Rancher 里完成自动化任务？

Rancher UI 包含静态文件，以及基于 API 响应工作。这意味着任何您在 UI 上执行的操作，都可以通过 API 自动化完成。一般有两种方式：

- 访问 `https://your_rancher_ip/v3`并浏览 API 选项。
- 当用 UI 访问时抓取 API 请求（大多数使用的方法是 [Chrome Developer Tools](https://developers.google.com/web/tools/chrome-devtools/#network) 当然您可以选择其他的工具。）

## 一个节点的 IP 地址改变了，该如何恢复？

节点必须配置一个静态 IP（或者 DHCP 预留的 IP）。如果节点 IP 改变了，您必须从集群中移除它并再次添加。当您移除节点后，Rancher 会更新集群到正确的状态。当集群不再显示`Provisioning`状态，表示节点已完全从集群中移除。

当节点 IP 改变时，Rancher 会丢失节点连接，所以无法在 Rancher 完全清理节点。请查阅[清理集群节点](/docs/cluster-admin/cleaning-cluster-nodes/_index)来完全清理节点。

当节点已经从集群中移除，并完全清理后，您就可以再次添加节点到集群中。

## 如何向 Rancher 启动的 Kubernetes 组件添加 参数/绑定/环境变量？

您可以通过[配置文件](/docs/cluster-provisioning/rke-clusters/options/_index)集群选项添加附加参数/绑定/环境变量。更多信息请参阅 RKE 文档里的[附加参数，附加绑定和附加环境变量](https://rancher.com/docs/rke/latest/en/config-options/services/services-extras/)以及浏览 [Cluster.yml 示例文件](https://rancher.com/docs/rke/latest/en/example-yamls/)。

## 如何检查我的证书链是有效的？

使用`openssl verify`命令来验证您的证书链：

> **注意：** 将`SSL_CERT_DIR` 和 `SSL_CERT_FILE` 配置为虚拟地址，以保证验证的时候不会使用操作系统自动安装的证书。

```
SSL_CERT_DIR=/dummy SSL_CERT_FILE=/dummy openssl verify -CAfile ca.pem rancher.yourdomain.com.pem
rancher.yourdomain.com.pem: OK
```

上述命令执行后，如何您收到`unable to get local issuer certificate`的错误，则证书链是不完整的。这通常意味着您的服务器证书中含有中间 CA 证书。如果您拥有该中间证书，可以采用下述的方法验证。

```
SSL_CERT_DIR=/dummy SSL_CERT_FILE=/dummy openssl verify -CAfile ca.pem -untrusted intermediate.pem rancher.yourdomain.com.pem
rancher.yourdomain.com.pem: OK
```

如何您成功地验证了证书链，您可以将中间 CA 证书包含在服务器证书中来为所有到 Rancher 的连接（如到 Rancher Agent 的连接）提供完整证书链。服务器证书文件的证书顺序应该是服务器证书（`rancher.yourdomain.com.pem`的内容）自身放在第一位，随后是中间 CA 证书（`intermediate.pem`内容）

```
-----BEGIN CERTIFICATE-----
%YOUR_CERTIFICATE%
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
%YOUR_INTERMEDIATE_CERTIFICATE%
-----END CERTIFICATE-----
```

如何您仍然遇到验证验证错误，您可以通过以下命令获取服务器证书的颁布者和主题：

```
openssl x509 -noout -subject -issuer -in rancher.yourdomain.com.pem
subject= /C=GB/ST=England/O=Alice Ltd/CN=rancher.yourdomain.com
issuer= /C=GB/ST=England/O=Alice Ltd/CN=Alice Intermediate CA
```

## 如何查看服务器证书的`Common Name` 和 `Subject Alternative Names` ？

尽管技术上只要一个`Subject Alternative Names`条目就可以了，但是将 Hostname 作为`Common Name` 和 `Subject Alternative Names` 的条目能够使您的服务兼容更多的老版本浏览器和应用。

查看`Common Name`：

```
openssl x509 -noout -subject -in cert.pem
subject= /CN=rancher.my.org
```

查看`Subject Alternative Names`：

```
openssl x509 -noout -in cert.pem -text | grep DNS
                DNS:rancher.my.org
```

## 为什么当一个节点故障时，一个 Pod 需要大于 5 分钟时间才能被重新调度？

这是因为下列默认 Kubernetes 设置共同产生的效果：

- kubelet
  - `node-status-update-frequency`：设置 kubelet 上报节点信息给 master 的频率。(默认 10s)
- kube-controller-manager
  - `node-monitor-period`：NodeController 中 NodeStatus 的同步周期(默认 5s)
  - `node-monitor-grace-period`：节点被认定为不健康前，节点不作响应的总的时间。(默认 40s)
  - `pod-eviction-timeout`：优雅删除故障节点上容器的周期。(默认 5m0s)

获取更多信息请参阅 [Kubernetes：kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/) 和 [Kubernetes: kube-controller-manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/)。

在 Kubernetes v1.13 版本中，`TaintBasedEvictions`特性是默认开启的。请查阅 [Kubernetes: Taint based Evictions](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/#taint-based-evictions) 获取更多信息。

- kube-apiserver (Kubernetes v1.13 版本及以后)
  - `default-not-ready-toleration-seconds`: 表示 notReady:NoExecute 容忍的容忍时间。notReady:NoExecute 被默认添加到没有该容忍的所有 Pod。
  - `default-unreachable-toleration-seconds`: 表示 unreachable:NoExecute 容忍的容忍时间。unreachable:NoExecute 被默认添加到没有该容忍的所有 Pod。

## 我可以在 UI 里使用键盘快捷键吗？

可以。大部分 UI 可以通过键盘快捷键访问。可在 UI 任意地方中按`?`查看所有可用的快捷键。
