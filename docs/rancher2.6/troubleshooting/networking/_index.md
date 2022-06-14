---
title: 网络
weight: 102
---

本文列出的命令/步骤可用于检查集群中的网络问题。

请确保你配置了正确的 kubeconfig（例如，为 Rancher HA 配置了 `export KUBECONFIG=$PWD/kube_config_cluster.yml`）或通过 UI 使用了嵌入式 kubectl。

### 仔细检查你的（主机）防火墙中是否打开了所有必需的端口

仔细检查你的（主机）防火墙中是否打开了所有[必需的端口]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/node-requirements/#networking-requirements)。其他所需的端口都使用 TCP，而覆盖网络使用 UDP。
### 检查覆盖网络是否正常运行

你可以将 Pod 调度到集群中的任何主机，但是 NGINX Ingress Controller 需要能够将 `NODE_1` 请求路由到 `NODE_2`。这会在覆盖网络上进行。如果覆盖网络无法正常工作，由于 NGINX Ingress Controller 无法路由到 pod，因此 TCP/HTTP 连接会间歇性失败。

要测试覆盖网络，你可以启动以下 `DaemonSet` 定义。这样，每台主机上都会运行一个 `swiss-army-knife` 容器（镜像由 Rancher 工程师开发，可在[此处](https://github.com/rancherlabs/swiss-army-knife)找到），我们使用该镜像在所有主机上的容器之间运行 `ping` 测试。

> **注意**：此容器[不支持 ARM 节点](https://github.com/leodotcloud/swiss-army-knife/issues/18)（例如 Raspberry Pi）。Pod 日志会显示为 `exec user process caused: exec format error`。

1. 将以下内容另存为 `overlaytest.yml`：

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
         - image: rancherlabs/swiss-army-knife
           imagePullPolicy: Always
           name: overlaytest
           command: ["sh", "-c", "tail -f /dev/null"]
           terminationMessagePath: /dev/termination-log

   ```

2. 使用 `kubectl create -f overlaytest.yml` 启动它。
3. 等待 `kubectl rollout status ds/overlaytest -w` 返回 `daemon set "overlaytest" successfully rolled out`。
4. 从同一位置运行以下脚本。它会让每个主机上的所有 `overlaytest` 容器相互 ping 通：
   ```
   #!/bin/bash
   echo "=> Start network overlay test"
     kubectl get pods -l name=overlaytest -o jsonpath='{range .items[*]}{@.metadata.name}{" "}{@.spec.nodeName}{"\n"}{end}' |
     while read spod shost
       do kubectl get pods -l name=overlaytest -o jsonpath='{range .items[*]}{@.status.podIP}{" "}{@.spec.nodeName}{"\n"}{end}' |
       while read tip thost
         do kubectl --request-timeout='10s' exec $spod -c overlaytest -- /bin/sh -c "ping -c2 $tip > /dev/null 2>&1"
           RC=$?
           if [ $RC -ne 0 ]
             then echo FAIL: $spod on $shost cannot reach pod IP $tip on $thost
             else echo $shost can reach $thost
           fi
       done
     done
   echo "=> End network overlay test"
   ```

5. 命令运行完成后，它会输出每条路由的状态：

   ```
   => Start network overlay test
   Error from server (NotFound): pods "wk2" not found
   FAIL: overlaytest-5bglp on wk2 cannot reach pod IP 10.42.7.3 on wk2
   Error from server (NotFound): pods "wk2" not found
   FAIL: overlaytest-5bglp on wk2 cannot reach pod IP 10.42.0.5 on cp1
   Error from server (NotFound): pods "wk2" not found
   FAIL: overlaytest-5bglp on wk2 cannot reach pod IP 10.42.2.12 on wk1
   command terminated with exit code 1
   FAIL: overlaytest-v4qkl on cp1 cannot reach pod IP 10.42.7.3 on wk2
   cp1 can reach cp1
   cp1 can reach wk1
   command terminated with exit code 1
   FAIL: overlaytest-xpxwp on wk1 cannot reach pod IP 10.42.7.3 on wk2
   wk1 can reach cp1
   wk1 can reach wk1
   => End network overlay test
   ```
   如果你在输出中看到错误，则说明两台主机上的 Pod 路由存在问题。在上面的输出中，节点 `wk2` 在覆盖网络上没有连接。原因可能是没有为 `wk2` 打开覆盖网络的[必需端口]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/node-requirements/#networking-requirements)。
6. 你现在可以通过运行 `kubectl delete ds/overlaytest` 来清理 DaemonSet。


### 检查主机和对等/隧道设备/设备上的 MTU 是否正确配置

如果 MTU 在运行 Rancher 的主机、创建/导入集群中的节点或两者之间的设备上配置不正确，Rancher 和 Agent 会记录类似以下的错误信息：

* `websocket: bad handshake`
* `Failed to connect to proxy`
* `read tcp: i/o timeout`

有关在 Rancher 和集群节点之间使用 Google Cloud VPN 时如何正确配置 MTU 的示例，请参阅 [Google Cloud VPN：MTU 注意事项](https://cloud.google.com/vpn/docs/concepts/mtu-considerations#gateway_mtu_vs_system_mtu)。

### 已解决的问题

#### 由于缺少节点注释，使用 Canal/Flannel 时覆盖网络中断

| | |
|------------|------------|
| GitHub issue | [#13644](https://github.com/rancher/rancher/issues/13644) |
| 解决于 | v2.1.2 |

要检查你的集群是否受到影响，运行以下命令来列出损坏的节点（此命令要求安装 `jq`）：

```
kubectl get nodes -o json | jq '.items[].metadata | select(.annotations["flannel.alpha.coreos.com/public-ip"] == null or .annotations["flannel.alpha.coreos.com/kube-subnet-manager"] == null or .annotations["flannel.alpha.coreos.com/backend-type"] == null or .annotations["flannel.alpha.coreos.com/backend-data"] == null) | .name'
```

如果没有输出，则集群没有影响。
