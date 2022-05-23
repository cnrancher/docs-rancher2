---
title: 使用 kubectl 测试 HPA
weight: 3031
---

本文介绍如何在使用负载测试工具扩缩 HPA 后检查 HPA 的状态。有关使用 Rancher UI（最低版本 2.3.x）检查状态的信息，请参阅[使用 Rancher UI 管理 HPA]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-kubectl/)。

要让 HPA 正常工作，服务部署应该具有容器的资源请求定义。按照以下 hello-world 示例测试 HPA 是否正常工作。

1. 将 `kubectl` 连接到你的 Kubernetes 集群。

2. 复制下方的 `hello-world` 部署清单。
   {{% accordion id="hello-world" label="Hello World 清单" %}}
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
{{% /accordion %}}

1. 将其部署到您的集群。

   ```
   # kubectl create -f <HELLO_WORLD_MANIFEST>
   ```

1. 根据你使用的指标类型复制以下其中一个 HPA ：
   {{% accordion id="service-deployment-resource-metrics" label="Hello World HPA：资源指标" %}}
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
{{% /accordion %}}

{{% accordion id="service-deployment-custom-metrics" label="Hello World HPA：自定义指标" %}}
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
{{% /accordion %}}

1. 查看 HPA 信息和描述。确认显示的指标数据。
   {{% accordion id="hpa-info-resource-metrics" label="资源指标" %}}
1. 输入以下命令：
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
   {{% /accordion %}}
   {{% accordion id="hpa-info-custom-metrics" label="自定义指标" %}}
1. 输入以下命令：
   ```
   # kubectl describe hpa
   ```
   你应该会看到以下输出：
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
   {{% /accordion %}}


1. 为服务生成负载，从而测试你的 pod 是否按预期进行了自动扩缩。你可以使用任何负载测试工具（Hey、Gatling 等），我们使用的是 [Hey](https://github.com/rakyll/hey)。

1. 测试 pod 自动扩缩是否按预期工作。<br/></br>
   **使用资源指标测试自动扩缩：**
   {{% accordion id="observe-upscale-2-pods-cpu" label="扩展到两个 Pod：CPU 用量达到目标" %}}
   使用你的负载测试工具根据 CPU 使用情况扩展到两个 Pod。

1. 查看你的 HPA。
   ```
   # kubectl describe hpa
   ```
   你应该会看到类似以下的输出：
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
1. 输入以下命令，确认你已扩展到两个 pod：
   ```
      # kubectl get pods
   ```
   你应该会看到类似以下的输出：
   ```
      NAME                                                     READY     STATUS    RESTARTS   AGE
      hello-world-54764dfbf8-k8ph2                             1/1       Running   0          1m
      hello-world-54764dfbf8-q6l4v                             1/1       Running   0          3h
   ```
{{% /accordion %}}
{{% accordion id="observe-upscale-3-pods-cpu-cooldown" label="扩展到三个 pod：CPU 用量达到目标" %}}
使用你的负载测试工具根据 CPU 使用情况扩展到三个 Pod，将 `horizontal-pod-autoscaler-upscale-delay` 设置为 3 分钟。

1. 输入以下命令：
   ```
   # kubectl describe hpa
   ```
   你应该会看到类似以下的输出：
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
2. 输入以下命令，确认三个 pod 正在运行：
   ```
   # kubectl get pods
   ```
   你应该会看到类似以下的输出：
   ```
    NAME                                                     READY     STATUS    RESTARTS   AGE
    hello-world-54764dfbf8-f46kh                             0/1       Running   0          1m
    hello-world-54764dfbf8-k8ph2                             1/1       Running   0          5m
    hello-world-54764dfbf8-q6l4v                             1/1       Running   0          3h
   ```
{{% /accordion %}}
{{% accordion id="observe-downscale-1-pod" label="缩减到 1 个Pod：所有指标均低于目标" %}}
当 `horizontal-pod-autoscaler-downscale-delay` 的所有指标均低于目标（默认为 5 分钟）时，使用你的负载测试工具缩减到 1 个 pod。

1. 输入以下命令：
```
# kubectl describe hpa
```
你应该会看到类似以下的输出：
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
{{% /accordion %}}
<br/>
**要使用自定义指标来测试自动扩缩：**
{{% accordion id="custom-observe-upscale-2-pods-cpu" label="扩展到两个 Pod：CPU 用量达到目标" %}}
使用负载测试工具根据 CPU 使用情况扩展到两个 Pod。

1. 输入以下命令：
```
  # kubectl describe hpa
```
你应该会看到类似以下的输出：
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
1. 输入以下命令，确认两个 pod 正在运行：
```
  # kubectl get pods
```
你应该会看到类似以下的输出：
```
      NAME                           READY     STATUS    RESTARTS   AGE
      hello-world-54764dfbf8-5pfdr   1/1       Running   0          3s
      hello-world-54764dfbf8-q6l82   1/1       Running   0          6h
```
{{% /accordion %}}
{{% accordion id="observe-upscale-3-pods-cpu-cooldown-2" label="扩展到三个 Pod：CPU 用量达到目标" %}}
当 cpu_system 用量达到目标时，使用你的负载测试工具扩展到三个 pod。

1. 输入以下命令：
   ```
   # kubectl describe hpa
   ```
   你应该会看到类似以下的输出：
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
1. 输入以下命令，确认三个 pod 正在运行：
   ```
   # kubectl get pods
   ```
   你应该会看到类似以下的输出：
   ```
      # kubectl get pods
      NAME                           READY     STATUS    RESTARTS   AGE
      hello-world-54764dfbf8-5pfdr   1/1       Running   0          3m
      hello-world-54764dfbf8-m2hrl   1/1       Running   0          1s
      hello-world-54764dfbf8-q6l82   1/1       Running   0          6h
   ```
{{% /accordion %}}
{{% accordion id="observe-upscale-4-pods" label="扩展到四个 Pod：CPU 用量达到目标" %}}
使用负载测试工具根据 CPU 使用情况扩展到四个 Pod。`horizontal-pod-autoscaler-upscale-delay` 默认设置为 3 分钟。

1. 输入以下命令：
```
# kubectl describe hpa
```
你应该会看到类似以下的输出：
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
1.  输入以下命令，确认四个 pod 正在运行：
  ```
  # kubectl get pods
  ```
  你应该会看到类似以下的输出：
  ```
    NAME                           READY     STATUS    RESTARTS   AGE
    hello-world-54764dfbf8-2p9xb   1/1       Running   0          5m
    hello-world-54764dfbf8-5pfdr   1/1       Running   0          2m
    hello-world-54764dfbf8-m2hrl   1/1       Running   0          1s
    hello-world-54764dfbf8-q6l82   1/1       Running   0          6h
  ```
{{% /accordion %}}
{{% accordion id="custom-metrics-observe-downscale-1-pod" label="缩减到 1 个 Pod：所有指标均低于目标" %}}
当 `horizontal-pod-autoscaler-downscale-delay` 的所有指标均低于目标时，使用你的负载测试工具缩减到 1 个 pod。

1. 输入以下命令：
  ```
  # kubectl describe hpa
  ```
  你应该会看到类似以下的输出：
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
1. 输入以下命令，确认单个 pod 正在运行：
  ```
      # kubectl get pods
  ```
  你应该会看到类似以下的输出：
  ```
      NAME                           READY     STATUS    RESTARTS   AGE
      hello-world-54764dfbf8-q6l82   1/1       Running   0          6h
  ```
{{% /accordion %}}

