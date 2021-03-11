---
title: 通过 Kubectl 测试 HPA
description: 本文档介绍了使用负载测试工具触发 HPA 按比例扩容或缩容后如何检查其状态。有关如何从 Rancher UI（至少 2.3.x 版）检查状态的信息，请参阅使用 Rancher UI 管理 HPA。
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
  - 用户指南
  - Pod 弹性伸缩
  - 通过 Kubectl 测试 HPA
---

本文档介绍了使用负载测试工具触发 HPA 按比例扩容或缩容后如何检查其状态。有关如何从 Rancher UI（至少 2.3.x 版）检查状态的信息，请参阅 [使用 Rancher UI 管理 HPA](/docs/rancher2.5/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-kubectl/_index)。

为了使 HPA 正常工作，服务部署应具有容器的资源请求（request）定义。可以按照此 hello-world 示例测试 HPA 是否正常工作。

## 配置 `kubectl` 以连接到您的 Kubernetes 集群。

## 复制下面的 `hello-world` 部署清单。

```
apiVersion: apps/v1beta2
kind: Deployment
metadata:
  labels:
    app: hello-world
  name: hello-world
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-world
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      containers:
      - image: rancher/hello-world
        imagePullPolicy: Always
        name: hello-world
        resources:
          requests:
            cpu: 500m
            memory: 64Mi
        ports:
        - containerPort: 80
          protocol: TCP
      restartPolicy: Always
---
apiVersion: v1
kind: Service
metadata:
  name: hello-world
  namespace: default
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: hello-world
```

## 将其部署到您的集群。

```
# kubectl create -f <HELLO_WORLD_MANIFEST>
```

## 根据您使用的指标类型复制下面适合您的 HPA：

- Hello World HPA: 资源指标

  ```
  apiVersion: autoscaling/v2beta1
  kind: HorizontalPodAutoscaler
  metadata:
    name: hello-world
    namespace: default
  spec:
    scaleTargetRef:
      apiVersion: extensions/v1beta1
      kind: Deployment
      name: hello-world
    minReplicas: 1
    maxReplicas: 10
    metrics:
    - type: Resource
      resource:
        name: cpu
        targetAverageUtilization: 50
    - type: Resource
      resource:
        name: memory
        targetAverageValue: 1000Mi
  ```

- Hello World HPA: 自定义指标

  ```
  apiVersion: autoscaling/v2beta1
  kind: HorizontalPodAutoscaler
  metadata:
    name: hello-world
    namespace: default
  spec:
    scaleTargetRef:
      apiVersion: extensions/v1beta1
      kind: Deployment
      name: hello-world
    minReplicas: 1
    maxReplicas: 10
    metrics:
    - type: Resource
      resource:
        name: cpu
        targetAverageUtilization: 50
    - type: Resource
      resource:
        name: memory
        targetAverageValue: 100Mi
    - type: Pods
      pods:
        metricName: cpu_system
        targetAverageValue: 20m
  ```

## 查看 HPA 信息和说明。确认已显示指标数据。

- 资源指标

  1.  输入以下命令。

      ```
      # kubectl get hpa
      NAME          REFERENCE                TARGETS                     MINPODS   MAXPODS   REPLICAS   AGE
      hello-world   Deployment/hello-world   1253376 / 100Mi, 0% / 50%   1         10        1          6m
      # kubectl describe hpa
      Name:                                                  hello-world
      Namespace:                                             default
      Labels:                                                <none>
      Annotations:                                           <none>
      CreationTimestamp:                                     Mon, 23 Jul 2018 20:21:16 +0200
      Reference:                                             Deployment/hello-world
      Metrics:                                               ( current / target )
        resource memory on pods:                             1253376 / 100Mi
        resource cpu on pods  (as a percentage of request):  0% (0) / 50%
      Min replicas:                                          1
      Max replicas:                                          10
      Conditions:
        Type            Status  Reason              Message
        ----            ------  ------              -------
        AbleToScale     True    ReadyForNewScale    the last scale time was sufficiently old as to warrant a new scale
        ScalingActive   True    ValidMetricFound    the HPA was able to successfully calculate a replica count from memory resource
        ScalingLimited  False   DesiredWithinRange  the desired count is within the acceptable range
      Events:           <none>
      ```

- 自定义指标

  1. 输入以下命令。

     ```
     # kubectl describe hpa
     ```

  1. 您应该看到以下输出：

     ```
     Name:                                                  hello-world
     Namespace:                                             default
     Labels:                                                <none>
     Annotations:                                           <none>
     CreationTimestamp:                                     Tue, 24 Jul 2018 18:36:28 +0200
     Reference:                                             Deployment/hello-world
     Metrics:                                               ( current / target )
       resource memory on pods:                             3514368 / 100Mi
       "cpu_system" on pods:                                0 / 20m
       resource cpu on pods  (as a percentage of request):  0% (0) / 50%
     Min replicas:                                          1
     Max replicas:                                          10
     Conditions:
       Type            Status  Reason              Message
       ----            ------  ------              -------
       AbleToScale     True    ReadyForNewScale    the last scale time was sufficiently old as to warrant a new scale
       ScalingActive   True    ValidMetricFound    the HPA was able to successfully calculate a replica count from memory resource
       ScalingLimited  False   DesiredWithinRange  the desired count is within the acceptable range
     Events:           <none>
     ```

## 对 HPA 服务进行压测，以测试您的 Pod 是否可以按预期自动缩放。

您可以使用任何负载测试工具（Hey，Gatling 等），我们使用的是 [Hey](https://github.com/rakyll/hey)。

## 测试 Pod 自动扩缩容功能是否按预期工作。

### 使用资源指标测试自动扩缩容

#### 扩容到 2 个 Pod：CPU 使用量超过目标值

使用负载测试工具对工作负载进行压测，提高 CPU 使用率触发自动扩缩容，使得 pod 数量扩容至 2 个。

1.  查看您的 HPA。

    ```
    # kubectl describe hpa
    ```

    您应该收到与以下类似的输出。

    ```
    Name:                                                  hello-world
    Namespace:                                             default
    Labels:                                                <none>
    Annotations:                                           <none>
    CreationTimestamp:                                     Mon, 23 Jul 2018 22:22:04 +0200
    Reference:                                             Deployment/hello-world
    Metrics:                                               ( current / target )
      resource memory on pods:                             10928128 / 100Mi
      resource cpu on pods  (as a percentage of request):  56% (280m) / 50%
    Min replicas:                                          1
    Max replicas:                                          10
    Conditions:
      Type            Status  Reason              Message
      ----            ------  ------              -------
      AbleToScale     True    SucceededRescale    the HPA controller was able to update the target scale to 2
      ScalingActive   True    ValidMetricFound    the HPA was able to successfully calculate a replica count from cpu resource utilization (percentage of request)
      ScalingLimited  False   DesiredWithinRange  the desired count is within the acceptable range
    Events:
      Type    Reason             Age   From                       Message
      ----    ------             ----  ----                       -------
      Normal  SuccessfulRescale  13s   horizontal-pod-autoscaler  New size: 2; reason: cpu resource utilization (percentage of request) above target
    ```

1.  输入以下命令以确认您已扩容至 2 个 pod。

    ```
    # kubectl get pods
    ```

    您应该收到类似于以下内容的输出：

    ```
    NAME                                                     READY     STATUS    RESTARTS   AGE
    hello-world-54764dfbf8-k8ph2                             1/1       Running   0          1m
    hello-world-54764dfbf8-q6l4v                             1/1       Running   0          3h
    ```

#### 扩容到 3 个 Pod：CPU 使用量超过目标值

使用您的负载测试工具，根据 CPU 使用率将 `horizontal-pod-autoscaler-upscale-delay` 设置为 3 分钟，以将其扩展到 3 个 pod。

1.  输入以下命令。

    ```
    # kubectl describe hpa
    ```

    您应该收到类似于以下内容的输出

    ```
    Name:                                                  hello-world
    Namespace:                                             default
    Labels:                                                <none>
    Annotations:                                           <none>
    CreationTimestamp:                                     Mon, 23 Jul 2018 22:22:04 +0200
    Reference:                                             Deployment/hello-world
    Metrics:                                               ( current / target )
      resource memory on pods:                             9424896 / 100Mi
      resource cpu on pods  (as a percentage of request):  66% (333m) / 50%
    Min replicas:                                          1
    Max replicas:                                          10
    Conditions:
      Type            Status  Reason              Message
      ----            ------  ------              -------
      AbleToScale     True    SucceededRescale    the HPA controller was able to update the target scale to 3
      ScalingActive   True    ValidMetricFound    the HPA was able to successfully calculate a replica count from cpu resource utilization (percentage of request)
      ScalingLimited  False   DesiredWithinRange  the desired count is within the acceptable range
    Events:
      Type    Reason             Age   From                       Message
      ----    ------             ----  ----                       -------
      Normal  SuccessfulRescale  4m    horizontal-pod-autoscaler  New size: 2; reason: cpu resource utilization (percentage of request) above target
      Normal  SuccessfulRescale  16s   horizontal-pod-autoscaler  New size: 3; reason: cpu resource utilization (percentage of request) above target
    ```

1.  输入以下命令以确认您已扩容至 3 个 pod。

    ```
    # kubectl get pods
    ```

    您应该收到与以下类似的输出。

    ```
    NAME                                                     READY     STATUS    RESTARTS   AGE
    hello-world-54764dfbf8-f46kh                             0/1       Running   0          1m
    hello-world-54764dfbf8-k8ph2                             1/1       Running   0          5m
    hello-world-54764dfbf8-q6l4v                             1/1       Running   0          3h
    ```

#### 缩容到 1 个 Pod: 全部指标低于目标值

当所有指标均低于“ horizontal-pod-autoscaler-downscale-delay”的目标（默认为 5 分钟）时，请使用压测工具将其缩小到 1 个 pod。

1.  输入以下命令。

    ```
    # kubectl describe hpa
    ```

    您应该收到与以下类似的输出。

    ```
    Name:                                                  hello-world
    Namespace:                                             default
    Labels:                                                <none>
    Annotations:                                           <none>
    CreationTimestamp:                                     Mon, 23 Jul 2018 22:22:04 +0200
    Reference:                                             Deployment/hello-world
    Metrics:                                               ( current / target )
      resource memory on pods:                             10070016 / 100Mi
      resource cpu on pods  (as a percentage of request):  0% (0) / 50%
    Min replicas:                                          1
    Max replicas:                                          10
    Conditions:
      Type            Status  Reason              Message
      ----            ------  ------              -------
      AbleToScale     True    SucceededRescale    the HPA controller was able to update the target scale to 1
      ScalingActive   True    ValidMetricFound    the HPA was able to successfully calculate a replica count from memory resource
      ScalingLimited  False   DesiredWithinRange  the desired count is within the acceptable range
    Events:
      Type    Reason             Age   From                       Message
      ----    ------             ----  ----                       -------
      Normal  SuccessfulRescale  10m   horizontal-pod-autoscaler  New size: 2; reason: cpu resource utilization (percentage of request) above target
      Normal  SuccessfulRescale  6m    horizontal-pod-autoscaler  New size: 3; reason: cpu resource utilization (percentage of request) above target
      Normal  SuccessfulRescale  1s    horizontal-pod-autoscaler  New size: 1; reason: All metrics below target
    ```

### 使用自定义指标测试自动扩缩容

#### 扩容到 2 个 Pod：CPU 使用量超过目标值

使用您的负载测试工具加大应用负载，以触发 HPA 根据 CPU 使用率自动扩容至 2 个 Pod。

1. 输入以下命令。

   ```
   # kubectl describe hpa
   ```

   您应该收到与以下类似的输出。

   ```
   Name:                                                  hello-world
   Namespace:                                             default
   Labels:                                                <none>
   Annotations:                                           <none>
   CreationTimestamp:                                     Tue, 24 Jul 2018 18:01:11 +0200
   Reference:                                             Deployment/hello-world
   Metrics:                                               ( current / target )
     resource memory on pods:                             8159232 / 100Mi
     "cpu_system" on pods:                                7m / 20m
     resource cpu on pods  (as a percentage of request):  64% (321m) / 50%
   Min replicas:                                          1
   Max replicas:                                          10
   Conditions:
     Type            Status  Reason              Message
     ----            ------  ------              -------
     AbleToScale     True    SucceededRescale    the HPA controller was able to update the target scale to 2
     ScalingActive   True    ValidMetricFound    the HPA was able to successfully calculate a replica count from cpu resource utilization (percentage of request)
     ScalingLimited  False   DesiredWithinRange  the desired count is within the acceptable range
   Events:
     Type    Reason             Age   From                       Message
     ----    ------             ----  ----                       -------
     Normal  SuccessfulRescale  16s   horizontal-pod-autoscaler  New size: 2; reason: cpu resource utilization (percentage of request) above target
   ```

1. 输入以下命令以确认两个 Pod 正在运行。

   ```
   # kubectl get pods
   ```

   您应该收到与以下类似的输出。

   ```
   NAME                           READY     STATUS    RESTARTS   AGE
   hello-world-54764dfbf8-5pfdr   1/1       Running   0          3s
   hello-world-54764dfbf8-q6l82   1/1       Running   0          6h
   ```

#### 扩容到 3 个 Pod：CPU 使用量超过目标值

使用负载测试工具进行压测，当 cpu_system 的限制达到目标值时，pod 数量会继续扩容至 3 个

1. 输入以下命令。

   ```
   # kubectl describe hpa
   ```

   您应该收到类似于以下内容的输出：

   ```
   Name:                                                  hello-world
   Namespace:                                             default
   Labels:                                                <none>
   Annotations:                                           <none>
   CreationTimestamp:                                     Tue, 24 Jul 2018 18:01:11 +0200
   Reference:                                             Deployment/hello-world
   Metrics:                                               ( current / target )
     resource memory on pods:                             8374272 / 100Mi
     "cpu_system" on pods:                                27m / 20m
     resource cpu on pods  (as a percentage of request):  71% (357m) / 50%
   Min replicas:                                          1
   Max replicas:                                          10
   Conditions:
     Type            Status  Reason              Message
     ----            ------  ------              -------
     AbleToScale     True    SucceededRescale    the HPA controller was able to update the target scale to 3
     ScalingActive   True    ValidMetricFound    the HPA was able to successfully calculate a replica count from cpu resource utilization (percentage of request)
     ScalingLimited  False   DesiredWithinRange  the desired count is within the acceptable range
   Events:
     Type    Reason             Age   From                       Message
     ----    ------             ----  ----                       -------
     Normal  SuccessfulRescale  3m    horizontal-pod-autoscaler  New size: 2; reason: cpu resource utilization (percentage of request) above target
     Normal  SuccessfulRescale  3s    horizontal-pod-autoscaler  New size: 3; reason: pods metric cpu_system above target
   ```

1. 输入以下命令以确认三个 Pod 正在运行。

   ```
     # kubectl get pods
   ```

   您应该收到类似于以下内容的输出：

   ```
         # kubectl get pods
         NAME                           READY     STATUS    RESTARTS   AGE
         hello-world-54764dfbf8-5pfdr   1/1       Running   0          3m
         hello-world-54764dfbf8-m2hrl   1/1       Running   0          1s
         hello-world-54764dfbf8-q6l82   1/1       Running   0          6h
   ```

#### 扩容到 4 个 Pod：CPU 使用量超过目标值

使用您的负载测试工具进行压测，提升 CPU 使用率，触发 HPA 机制扩容至 4 个 Pod。默认情况下， `horizontal-pod-autoscaler-upscale-delay` 设置为三分钟。

1. 输入以下命令。

   ```
   # kubectl describe hpa
   ```

   您应该收到与以下类似的输出。

   ```
   Name:                                                  hello-world
   Namespace:                                             default
   Labels:                                                <none>
   Annotations:                                           <none>
   CreationTimestamp:                                     Tue, 24 Jul 2018 18:01:11 +0200
   Reference:                                             Deployment/hello-world
   Metrics:                                               ( current / target )
     resource memory on pods:                             8374272 / 100Mi
     "cpu_system" on pods:                                27m / 20m
     resource cpu on pods  (as a percentage of request):  71% (357m) / 50%
   Min replicas:                                          1
   Max replicas:                                          10
   Conditions:
     Type            Status  Reason              Message
     ----            ------  ------              -------
     AbleToScale     True    SucceededRescale    the HPA controller was able to update the target scale to 3
     ScalingActive   True    ValidMetricFound    the HPA was able to successfully calculate a replica count from cpu resource utilization (percentage of request)
     ScalingLimited  False   DesiredWithinRange  the desired count is within the acceptable range
   Events:
     Type    Reason             Age   From                       Message
     ----    ------             ----  ----                       -------
     Normal  SuccessfulRescale  5m    horizontal-pod-autoscaler  New size: 2; reason: cpu resource utilization (percentage of request) above target
     Normal  SuccessfulRescale  3m    horizontal-pod-autoscaler  New size: 3; reason: pods metric cpu_system above target
     Normal  SuccessfulRescale  4s    horizontal-pod-autoscaler  New size: 4; reason: cpu resource utilization (percentage of request) above target
   ```

1. 输入以下命令以确认四个 Pod 正在运行。

   ```
   # kubectl get pods
   ```

   您应该收到与以下类似的输出。

   ```
   NAME                           READY     STATUS    RESTARTS   AGE
   hello-world-54764dfbf8-2p9xb   1/1       Running   0          5m
   hello-world-54764dfbf8-5pfdr   1/1       Running   0          2m
   hello-world-54764dfbf8-m2hrl   1/1       Running   0          1s
   hello-world-54764dfbf8-q6l82   1/1       Running   0          6h
   ```

#### 缩容到 1 个 Pod: 全部指标低于目标值

当所有指标均低于 `horizontal-pod-autoscaler-downscale-delay` 目标值时，请使用负载测试工具将其缩小到 1 个 Pod。

1. 输入以下命令。

   ```
   # kubectl describe hpa
   ```

   您应该收到与以下类似的输出。

   ```
   Name:                                                  hello-world
   Namespace:                                             default
   Labels:                                                <none>
   Annotations:                                           <none>
   CreationTimestamp:                                     Tue, 24 Jul 2018 18:01:11 +0200
   Reference:                                             Deployment/hello-world
   Metrics:                                               ( current / target )
     resource memory on pods:                             8101888 / 100Mi
     "cpu_system" on pods:                                8m / 20m
     resource cpu on pods  (as a percentage of request):  0% (0) / 50%
   Min replicas:                                          1
   Max replicas:                                          10
   Conditions:
     Type            Status  Reason              Message
     ----            ------  ------              -------
     AbleToScale     True    SucceededRescale    the HPA controller was able to update the target scale to 1
     ScalingActive   True    ValidMetricFound    the HPA was able to successfully calculate a replica count from memory resource
     ScalingLimited  False   DesiredWithinRange  the desired count is within the acceptable range
   Events:
     Type    Reason             Age   From                       Message
     ----    ------             ----  ----                       -------
     Normal  SuccessfulRescale  10m    horizontal-pod-autoscaler  New size: 2; reason: cpu resource utilization (percentage of request) above target
     Normal  SuccessfulRescale  8m    horizontal-pod-autoscaler  New size: 3; reason: pods metric cpu_system above target
     Normal  SuccessfulRescale  5m    horizontal-pod-autoscaler  New size: 4; reason: cpu resource utilization (percentage of request) above target
     Normal   SuccessfulRescale             13s               horizontal-pod-autoscaler  New size: 1; reason: All metrics below target
   ```

1. 输入以下命令以确认单个 Pod 正在运行。

   ```
   # kubectl get pods
   ```

   您应该收到与以下类似的输出。

   ```
   NAME                           READY     STATUS    RESTARTS   AGE
   hello-world-54764dfbf8-q6l82   1/1       Running   0          6h
   ```
