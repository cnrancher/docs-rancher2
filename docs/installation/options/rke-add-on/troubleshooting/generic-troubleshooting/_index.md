---
title: 一般常见问题
---

> #### **重要：RKE add-on 安装 仅支持至 Rancher v2.0.8 版本**
>
> 你可以使用 Helm chart 在 Kubernetes 集群中安装 Rancher。获取更多细节，请参考[安装 Kubernetes - 安装概述](/docs/installation/k8s-install/_index)。
>
> 如果您正在使用 RKE add-on 安装的方法，请参阅[从一个 RKE Add-on 安装的 Rancher 迁移到 Helm 安装](/docs/upgrades/upgrades/migrating-from-rke-add-on/_index) 获取如何迁移至使用 helm chart 的更多细节。

您可以按下列步骤定位您集群中的问题原因.

## 防火墙端口是否打开

仔细检查所有[必需的端口](/docs/cluster-provisioning/node-requirements/_index)是否已经在（主机的）防火墙中开通。

## 节点是否处于 Ready 状态

请运行以下命令检测:

```
kubectl --kubeconfig kube_config_rancher-cluster.yml get nodes
```

如果有节点未显示或处于非 **Ready** 状态，可以检查 `kubelet` 容器的日志。登录该节点执行 `docker logs kubelet`。

## Pods/Jobs 是否处于理想状态

请运行以下命令检测：

```
kubectl --kubeconfig kube_config_rancher-cluster.yml get pods --all-namespaces
```

如果有 pod 不处于 **Running** 状态，可以通过运行以下命令来找出根本原因：

#### 描述 Pod

```
kubectl --kubeconfig kube_config_rancher-cluster.yml describe pod POD_NAME -n NAMESPACE
```

#### 显示 Pod 容器日志

```
kubectl --kubeconfig kube_config_rancher-cluster.yml logs POD_NAME -n NAMESPACE
```

如果有 job 处于非 **Completed** 状态，可以通过运行以下命令来找出根本原因：

#### 描述 Job

```
kubectl --kubeconfig kube_config_rancher-cluster.yml describe job JOB_NAME -n NAMESPACE
```

#### 显示 Job 的容器日志

```
kubectl --kubeconfig kube_config_rancher-cluster.yml logs -l job-name=JOB_NAME -n NAMESPACE
```

## 检查 Ingress

Ingress 应该具有正确的 `HOSTS`（显示已配置的 FQDN）和 `ADDRESS` （将被路由到的地址）。

```
kubectl --kubeconfig kube_config_rancher-cluster.yml get ingress --all-namespaces
```

## 显示所有 Kubernetes 集群事件

Kubernetes 集群事件会被存储，可以通过运行以下命令进行检索：

```
kubectl --kubeconfig kube_config_rancher-cluster.yml get events --all-namespaces
```

## 检查 Rancher 容器日志

```
kubectl --kubeconfig kube_config_rancher-cluster.yml logs -l app=cattle -n cattle-system
```

## 检查 NGINX ingress controller 日志

```
kubectl --kubeconfig kube_config_rancher-cluster.yml logs -l app=ingress-nginx -n ingress-nginx
```

## 检查 Overlay 网络是否正常运行

Pod 可以被调度到集群中的任何主机，这就意味着 NGINX ingress controller 需要能够将请求从 `NODE_1` 路由到 `NODE_2`。这发生在 Overlay 网络 上。如果 Overlay 网络 不工作，NGINX ingress controller 就无法路由到 Pod，那么您将可能遇到间歇性的 TCP/HTTP 连接失败的错误。

要测试 Overlay 网络，您可以启动以下的 `DaemonSet` 定义。这将在每个主机上运行一个 `alpine`容器，并在所有主机上的容器之间运行一个 `ping` 测试。

1. 将以下文件另存为 `ds-alpine.yml`

   ```
     apiVersion: apps/v1
     kind: DaemonSet
     metadata:
       name: alpine
     spec:
       selector:
           matchLabels:
             name: alpine
       template:
         metadata:
           labels:
             name: alpine
         spec:
           tolerations:
           - effect: NoExecute
             key: "node-role.kubernetes.io/etcd"
             value: "true"
           - effect: NoSchedule
             key: "node-role.kubernetes.io/controlplane"
             value: "true"
           containers:
           - image: alpine
             imagePullPolicy: Always
             name: alpine
             command: ["sh"，"-c"，"tail -f /dev/null"]
             terminationMessagePath: /dev/termination-log
   ```

1. 安装并启动它 `kubectl --kubeconfig kube_config_rancher-cluster.yml create -f ds-alpine.yml`

1. 等待直到 `kubectl --kubeconfig kube_config_rancher-cluster.yml rollout status ds/alpine -w` 返回：`daemon set "alpine" successfully rolled out`。

1. 运行以下命令，使每个主机上的每个容器相互 ping 通（这是一条单行命令）.

   ```
     echo "=> Start"; kubectl --kubeconfig kube_config_rancher-cluster.yml get pods -l name=alpine -o jsonpath='{range .items[*]}{@.metadata.name}{" "}{@.spec.nodeName}{"\n"}{end}' | while read spod shost; do kubectl --kubeconfig kube_config_rancher-cluster.yml get pods -l name=alpine -o jsonpath='{range .items[*]}{@.status.podIP}{" "}{@.spec.nodeName}{"\n"}{end}' | while read tip thost; do kubectl --kubeconfig kube_config_rancher-cluster.yml --request-timeout='10s' exec $spod -- /bin/sh -c "ping -c2 $tip > /dev/null 2>&1"; RC=$?; if [ $RC -ne 0 ]; then echo $shost cannot reach $thost; fi; done; done; echo "=> End"
   ```

1. 该命令运行完毕后，代表一切正确的输出为：

   ```
     => Start
     => End
   ```

如果在输出中看到错误，则表示在指示的主机之间未打开给 Overlay 网络使用的[必须端口](/docs/cluster-provisioning/node-requirements/_index)。

当 NODE1 的 UDP 端口被禁用时的错误示例。

```
=> Start
command terminated with exit code 1
NODE2 cannot reach NODE1
command terminated with exit code 1
NODE3 cannot reach NODE1
command terminated with exit code 1
NODE1 cannot reach NODE2
command terminated with exit code 1
NODE1 cannot reach NODE3
=> End
```
