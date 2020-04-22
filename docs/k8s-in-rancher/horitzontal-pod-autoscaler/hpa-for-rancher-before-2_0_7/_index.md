---
title: 手动安装 HPA （仅适用于2.0.7之前版本）
description: 本节介绍如何为 v2.0.7 版本之前的 Rancher 创建的集群中手动安装 HPA。本节还介绍了如何配置 HPA 以便按比例进行自动扩缩容，以及如何为 HPA 分配角色。必须先满足一些要求，然后才能在 Kubernetes 集群中使用 HPA。
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
  - 用户指南
  - Pod 弹性伸缩
  - 手动安装 HPA
---

本节介绍如何为 v2.0.7 版本之前的 Rancher 创建的集群中手动安装 HPA。本节还介绍了如何配置 HPA 以便按比例进行自动扩缩容，以及如何为 HPA 分配角色。

必须先满足一些要求，然后才能在 Kubernetes 集群中使用 HPA。

## 要求

确保您的 Kubernetes 集群服务至少以以下参数运行：

- kube-api: `requestheader-client-ca-file`
- kubelet: `read-only-port` at 10255
- kube-controller: 可选，仅在需要与默认值不同的值时才需要。

  - `horizontal-pod-autoscaler-downscale-delay: "5m0s"`
  - `horizontal-pod-autoscaler-upscale-delay: "3m0s"`
  - `horizontal-pod-autoscaler-sync-period: "30s"`

对于 RKE 部署的 Kubernetes 集群，在 `services` 部分添加此代码段。要使用 Rancher v2.0 UI 添加此代码段，请打开**集群**视图，然后为要在其中使用 HPA 的集群选择**省略号（... ）> 编辑**。然后，从**集群选项**中，单击**编辑为 YAML**。将以下代码段添加 `services` 部分：

```
services:
...
  kube-api:
    extra_args:
      requestheader-client-ca-file: "/etc/kubernetes/ssl/kube-ca.pem"
  kube-controller:
    extra_args:
      horizontal-pod-autoscaler-downscale-delay: "5m0s"
      horizontal-pod-autoscaler-upscale-delay: "1m0s"
      horizontal-pod-autoscaler-sync-period: "30s"
  kubelet:
    extra_args:
      read-only-port: 10255
```

一旦配置和部署了 Kubernetes 集群，就可以部署指标服务（metrics services）。

> **注:** 以下各节中的 `kubectl` 命令示例在运行 Rancher v2.0.6 和 Kubernetes v1.10.1 的集群中进行了测试。

## 使用资源指标配置 HPA 进行自动扩缩容

要基于 CPU 和内存使用等资源指标创建 HPA 资源，您需要在 Kubernetes 集群的 `kube-system` 命名空间中部署 `metrics-server` 软件包。这种部署允许 HPA 使用 `metrics.k8s.io` API。

> **先决条件：**您必须运行 `kubectl` 1.8 或更高版本。

1. 使用 `kubectl` 连接到您的 Kubernetes 集群。

1. 克隆 GitHub `metrics-server` 仓库：

   ```
   # git clone https://github.com/kubernetes-incubator/metrics-server
   ```

1. 安装 `metrics-server` 软件包。

   ```
   # kubectl create -f metrics-server/deploy/1.8+/
   ```

1. 检查 `metrics-server` 是否正常运行。在 `kube-system` 命名空间里检查对应的 pod 和日志是否正常。

   1. 检查 pod 状态是否为 `running` 状态。输入以下命令：

      ```
      # kubectl get pods -n kube-system
      ```

      然后检查是否 pod 的状态 `running` .

      ```
      NAME READY STATUS RESTARTS AGE
      ...
      metrics-server-6fbfb84cdd-t2fk9 1/1 Running 0 8h
      ...
      ```

   1. 检查 pod 日志以确保服务可用性。输入以下命令：

      ```
      # kubectl -n kube-system logs metrics-server-6fbfb84cdd-t2fk9
      ```

      然后查看日志以确认 `metrics-server` 软件包正在运行。

      ```
      I0723 08:09:56.193136 1 heapster.go:71] /metrics-server --source=kubernetes.summary_api:''
      I0723 08:09:56.193574 1 heapster.go:72] Metrics Server version v0.2.1
      I0723 08:09:56.194480 1 configs.go:61] Using Kubernetes client with master "https://10.43.0.1:443" and version
      I0723 08:09:56.194501 1 configs.go:62] Using kubelet port 10255
      I0723 08:09:56.198612 1 heapster.go:128] Starting with Metric Sink
      I0723 08:09:56.780114 1 serving.go:308] Generated self-signed cert (apiserver.local.config/certificates/apiserver.crt, apiserver.local.config/certificates/apiserver.key)
      I0723 08:09:57.391518 1 heapster.go:101] Starting Heapster API server...
      [restful] 2018/07/23 08:09:57 log.go:33: [restful/swagger] listing is available at https:///swaggerapi
      [restful] 2018/07/23 08:09:57 log.go:33: [restful/swagger] https:///swaggerui/ is mapped to folder /swagger-ui/
      I0723 08:09:57.394080 1 serve.go:85] Serving securely on 0.0.0.0:443
      ```

1. 检查是否可以通过 `kubectl` 访问 metrics api。

   - 如果要通过 Rancher 访问集群，请在 `kubectl` 配置中以以下格式输入服务器 URL： `https:// <RANCHER_URL>/k8s/clusters/<CLUSTER_ID>` 。将后缀 `/k8s/clusters/<CLUSTER_ID>` 添加到 API 路径。

     ```
     # kubectl get --raw /k8s/clusters/<CLUSTER_ID>/apis/metrics.k8s.io/v1beta1
     ```

     如果 API 正常运行，您应该收到与以下输出类似的输出。

     ```
     {"kind":"APIResourceList","apiVersion":"v1","groupVersion":"metrics.k8s.io/v1beta1","resources":[{"name":"nodes","singularName":"","namespaced":false,"kind":"NodeMetrics","verbs":["get","list"]},{"name":"pods","singularName":"","namespaced":true,"kind":"PodMetrics","verbs":["get","list"]}]}
     ```

   - 如果直接访问集群，请在 kubectl 配置中以以下格式输入服务器 URL： `https://<K8s_URL>:6443` 。

     ```
     # kubectl get --raw /apis/metrics.k8s.io/v1beta1
     ```

     如果 API 正常运行，您应该收到与以下输出类似的输出。

     ```
     {"kind":"APIResourceList","apiVersion":"v1","groupVersion":"metrics.k8s.io/v1beta1","resources":[{"name":"nodes","singularName":"","namespaced":false,"kind":"NodeMetrics","verbs":["get","list"]},{"name":"pods","singularName":"","namespaced":true,"kind":"PodMetrics","verbs":["get","list"]}]}
     ```

## 为您的 HPA 分配其他必需的角色

默认情况下，HPA 使用`system:anonymous`用户读取资源和自定义指标。在 ClusterRole 和 ClusterRoleBindings 清单中将`system:anonymous`分配给`view-resource-metrics`和`view-custom-metrics`。这些角色用于访问指标。

为此，请按照下列步骤操作：

### 配置`kubectl`以连接到您的集群。

### 复制 ClusterRole 和 ClusterRoleBinding 清单以获取用于 HPA 的指标类型。

1.  资源指标: ApiGroups `resource.metrics.k8s.io`

    ```
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRole
    metadata:
      name: view-resource-metrics
    rules:
    - apiGroups:
        - metrics.k8s.io
      resources:
        - pods
        - nodes
      verbs:
        - get
        - list
        - watch
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
      name: view-resource-metrics
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: view-resource-metrics
    subjects:
      - apiGroup: rbac.authorization.k8s.io
        kind: User
        name: system:anonymous
    ```

1.  自定义指标: ApiGroups `custom.metrics.k8s.io`

    ```
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRole
    metadata:
      name: view-custom-metrics
    rules:
    - apiGroups:
        - custom.metrics.k8s.io
      resources:
        - "*"
      verbs:
        - get
        - list
        - watch
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
      name: view-custom-metrics
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: view-custom-metrics
    subjects:
      - apiGroup: rbac.authorization.k8s.io
        kind: User
        name: system:anonymous
    ```

### 根据您使用的指标，使用以下命令之一在集群中创建它们。

```
# kubectl create -f <RESOURCE_METRICS_MANIFEST>
# kubectl create -f <CUSTOM_METRICS_MANIFEST>
```
