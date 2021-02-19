---
title: 一般常见问题
description: 您可以按下列步骤定位您集群中的问题原因。
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
  - RKE Add-on 安装
  - 高可用 RKE Add-On 安装 常见问题
  - 一般常见问题
---

:::important 重要提示
RKE add-on 安装仅支持 Rancher v2.0.8 之前的版本。
请使用 Rancher helm chart 将 Rancher 安装在 Kubernetes 集群上。有关详细信息，请参见[Helm 版本要求](/docs/rancher2/installation_new/resources/helm-version/_index)。
如果您当前正在使用 RKE add-on 安装方法，参见[将 RKE add-on 安装的 Rancher 迁移到 Helm 安装](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/_index)，获取有关如何使用 Helm chart 的详细信息。
:::

您可以按下列步骤定位您集群中的问题。

## 防火墙端口是否打开

仔细检查[所需端口](/docs/rancher2/cluster-provisioning/node-requirements/_index)是否已在主机防火墙或 VPC 安全组中打开。

## 节点是否处于 Ready 状态

请运行以下命令检测：

```
kubectl --kubeconfig kube_config_rancher-cluster.yml get nodes
```

如果有节点未显示或处于非 **Ready** 状态，可以检查 `kubelet` 容器的日志。登录该节点执行 `docker logs kubelet`。

## Pods/Jobs 是否处于理想状态

请运行以下命令检测：

```
kubectl --kubeconfig kube_config_rancher-cluster.yml get pods --all-namespaces
```

如果有 Pod 处于非 **Running** 状态，可以通过运行以下命令来找出根本原因：

#### 描述 Pod

```
kubectl --kubeconfig kube_config_rancher-cluster.yml describe pod POD_NAME -n NAMESPACE
```

#### 显示 Pod 容器日志

```
kubectl --kubeconfig kube_config_rancher-cluster.yml logs POD_NAME -n NAMESPACE
```

如果有 Job 处于非 **Completed** 状态，可以通过运行以下命令来找出根本原因：

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

## 显示 Kubernetes 集群的所有事件

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

Pod 可以被调度到集群中的任何主机，这就意味着 NGINX ingress controller 能将请求从 `NODE_1` 路由到 `NODE_2`，即，请求是在 Overlay 网络之上流转的。也就是说，如果 Overlay 网络不正常，NGINX ingress controller 就无法把请求路由到 Pod，那么您将遇到间歇性的 TCP/HTTP connection failed 的错误。

您如果要测试集群 Overlay 网络的连通性，可以运行下面的 `DaemonSet` ，在每个主机上跑起一个 `alpine` 容器，然后在这些容器之间执行 `ping` 测试。

1. 将以下文件另存为 `ds-alpine.yml`：

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

1. 执行 `kubectl --kubeconfig kube_config_rancher-cluster.yml create -f ds-alpine.yml` 。

1. 执行 `kubectl --kubeconfig kube_config_rancher-cluster.yml rollout status ds/alpine -w` 直到返回：`daemon set "alpine" successfully rolled out` 。

1. 运行以下命令，使每个主机上的每个容器相互 ping 通（这是一条单行命令）。

   ```
     echo "=> Start"; kubectl --kubeconfig kube_config_rancher-cluster.yml get pods -l name=alpine -o jsonpath='{range .items[*]}{@.metadata.name}{" "}{@.spec.nodeName}{"\n"}{end}' | while read spod shost; do kubectl --kubeconfig kube_config_rancher-cluster.yml get pods -l name=alpine -o jsonpath='{range .items[*]}{@.status.podIP}{" "}{@.spec.nodeName}{"\n"}{end}' | while read tip thost; do kubectl --kubeconfig kube_config_rancher-cluster.yml --request-timeout='10s' exec $spod -- /bin/sh -c "ping -c2 $tip > /dev/null 2>&1"; RC=$?; if [ $RC -ne 0 ]; then echo $shost cannot reach $thost; fi; done; done; echo "=> End"
   ```

1. 该命令运行完毕后，代表一切正确的输出如下：

   ```
     => Start
     => End
   ```

如果在输出中看到错误，则表示在测试的主机之间未打开 Overlay 网络的[所需端口](/docs/rancher2/cluster-provisioning/node-requirements/_index)。

下面是当 NODE1 的 UDP 端口被禁用时的错误示例：

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
