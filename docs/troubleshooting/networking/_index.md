---
title: 网络
description: 此页面上列出的命令/步骤可用于检查集群中与网络相关的问题。确保您配置了正确的 kubeconfig(例如，在使用 Rancher 高可用时，`export KUBECONFIG=$PWD/kube_config_rancher-cluster.yml`) 或者通过 Rancher UI 使用内嵌的 kubectl。
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
  - 常见故障排查
  - 网络
---

此页面上列出的命令/步骤可用于检查集群中与网络相关的问题。

确保您配置了正确的 kubeconfig(例如，在使用 Rancher 高可用时，`export KUBECONFIG=$PWD/kube_config_rancher-cluster.yml`) 或者通过 Rancher UI 使用内嵌的 kubectl。

## 仔细检查是否在主机防火墙中打开了所有必需的端口

仔细检查是否所有[所需的端口](/docs/cluster-provisioning/node-requirements/_index)在主机防火墙中打开。与其他所有必需的 TCP 端口相比，Overlay 网络使用 UDP。

## 检查 Overlay 网络是否正常运行

可以将 Pod 调度到集群的任何主机上，在 Overlay 网络上意味着 NGINX Ingress Controller 需要能够将请求从`NODE_1`路由到`NODE_2`。如果 Overlay 网络不起作用，可能导致 NGINX Ingress Controller 无法将请求路由到 Pod，您将遇到间歇性的 TCP/HTTP 连接失败。

要测试 Overlay 网络，您可以根据以下 yaml 文件启动一个`DaemonSet`。这将在每个主机上运行一个`busybox`容器，我们将在所有主机上的容器之间运行一个`ping`测试。

1. 将以下文件另存为`ds-overlaytest.yml`

   ```
   apiVersion: apps/v1
   kind: DaemonSet
   metadata:
     name: overlaytest
   spec:
     selector:
         matchLabels:
           name: overlaytest
     template:
       metadata:
         labels:
           name: overlaytest
       spec:
         tolerations:
         - operator: Exists
         containers:
         - image: busybox:1.28
           imagePullPolicy: Always
           name: busybox
           command: ["sh", "-c", "tail -f /dev/null"]
           terminationMessagePath: /dev/termination-log
   ```

2. 使用`kubectl`启动它`kubectl create -f ds-overlaytest.yml`。
3. 等待，直到 `kubectl rollout status ds/overlaytest -w` 返回： `daemon set "overlaytest" successfully rolled out`。
4. 运行以下命令，以使每个主机上的每个容器相互 ping 通。

   ```
   echo "=> Start network overlay test"; kubectl get pods -l name=overlaytest -o jsonpath='{range .items[*]}{@.metadata.name}{" "}{@.spec.nodeName}{"\n"}{end}' | while read spod shost; do kubectl get pods -l name=overlaytest -o jsonpath='{range .items[*]}{@.status.podIP}{" "}{@.spec.nodeName}{"\n"}{end}' | while read tip thost; do kubectl --request-timeout='10s' exec $spod -- /bin/sh -c "ping -c2 $tip > /dev/null 2>&1"; RC=$?; if [ $RC -ne 0 ]; then echo $shost cannot reach $thost; fi; done; done; echo "=> End network overlay test"
   ```

5. 该命令运行完毕后，一切正确的的输出应该是：

   ```
   => Start network overlay test
   => End network overlay test
   ```

如果您在输出中看到错误，则表示用于 Overlay 网络的[所需的端口](/docs/cluster-provisioning/node-requirements/_index)在指示的主机之间没有打开。

NODE1 的 UDP 端口被阻塞的情况的示例错误输出。

```
=> Start network overlay test
command terminated with exit code 1
NODE2 cannot reach NODE1
command terminated with exit code 1
NODE3 cannot reach NODE1
command terminated with exit code 1
NODE1 cannot reach NODE2
command terminated with exit code 1
NODE1 cannot reach NODE3
=> End network overlay test
```

运行命令来清理这个 DaemonSet 应用 `kubectl delete ds/overlaytest`。

## 检查主机和网络设备伤的的 MTU 是否正确配置

当 MTU 配置错误时（在运行 Rancher 的主机上，在已创建/导入的集群中的节点上或在两者之间的网络设备上），错误消息将记录在 Rancher Server 和 Rancher Agent 中，类似于：

- `websocket: bad handshake`
- `Failed to connect to proxy`
- `read tcp: i/o timeout`

点击查看有关在 Rancher 和集群节点之间使用 Google Cloud VPN 时如何正确配置 MTU 的示例 [Google Cloud VPN：MTU 问题](https://cloud.google.com/vpn/docs/concepts/mtu-considerations#gateway_mtu_vs_system_mtu) 。

## 已知问题

### 使用 Canal/Flannel 的 Overlay 网络缺少节点注释

[GitHub #13644](https://github.com/rancher/rancher/issues/13644)已在 v2.1.2 中解决。

要检查您的集群是否受到影响，以下命令将列出异常的节点（此命令要求安装`jq`）：

```
kubectl get nodes -o json | jq '.items[].metadata | select(.annotations["flannel.alpha.coreos.com/public-ip"] == null or .annotations["flannel.alpha.coreos.com/kube-subnet-manager"] == null or .annotations["flannel.alpha.coreos.com/backend-type"] == null or .annotations["flannel.alpha.coreos.com/backend-data"] == null) | .name'
```

如果没有输出，则集群不受影响。

### System 命名空间的 Pod 网络连接断开

> **注意:** 这仅适用于从 v2.0.6 或更早版本升级到 v2.0.7 或更高版本的 Rancher。从 v2.0.7 升级到更高版本不受影响。

已知问题 [GitHub #15146](https://github.com/rancher/rancher/issues/15146)。

如果系统命名空间中的 Pod 无法与其他系统命名空间中的 Pod 通信，则需要按照[升级到 v2.0.7+ ：命名空间迁移](/docs/upgrades/upgrades/namespace-migration/_index)描述的方式恢复连接。症状包括：

- NGINX ingress controller 在访问时显示 `504 Gateway Time-out`。
- NGINX ingress controller 访问时日志打印 `upstream timed out (110: Connection timed out) while connecting to upstream`。
