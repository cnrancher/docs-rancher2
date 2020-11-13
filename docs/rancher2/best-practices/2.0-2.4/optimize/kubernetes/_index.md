---
title: Kubernetes 调优
description:
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
  - 最佳实践
  - kubernetes调优
---

> 完整的配置文件可查看 [RKE 示例配置](/docs/rke/example-yamls/_index)。

## 1. kube-apiserver

RKE 或者 Rancher UI 自定义部署集群的时候，在 yaml 文件中指定以下参数

```yaml
services:
  kube-api:
    extra_args:
      watch-cache: true
      default-watch-cache-size: 1500
      # 事件保留时间，默认1小时
      event-ttl: 1h0m0s
      # 默认值400，设置0为不限制，一般来说，每25~30个Pod有15个并行
      max-requests-inflight: 800
      # 默认值200，设置0为不限制
      max-mutating-requests-inflight: 400
      # kubelet操作超时，默认5s
      kubelet-timeout: 5s
```

## 2. kube-controller

RKE 或者 Rancher UI 自定义部署集群的时候，在 yaml 文件中指定以下参数

```yaml
services:
  kube-controller:
    extra_args:
      # 修改每个节点子网大小(cidr掩码长度)，默认为24，可用IP为254个；23，可用IP为510个；22，可用IP为1022个；
      node-cidr-mask-size: "24"

      feature-gates: "TaintBasedEvictions=false"
      # 控制器定时与节点通信以检查通信是否正常，周期默认5s
      node-monitor-period: "5s"
      ## 当节点通信失败后，再等一段时间kubernetes判定节点为notready状态。
      ## 这个时间段必须是kubelet的nodeStatusUpdateFrequency(默认10s)的整数倍，
      ## 其中N表示允许kubelet同步节点状态的重试次数，默认40s。
      node-monitor-grace-period: "20s"
      ## 再持续通信失败一段时间后，kubernetes判定节点为unhealthy状态，默认1m0s。
      node-startup-grace-period: "30s"
      ## 再持续失联一段时间，kubernetes开始迁移失联节点的Pod，默认5m0s。
      pod-eviction-timeout: "1m"

      # 默认5. 同时同步的deployment的数量。
      concurrent-deployment-syncs: 5
      # 默认5. 同时同步的endpoint的数量。
      concurrent-endpoint-syncs: 5
      # 默认20. 同时同步的垃圾收集器工作器的数量。
      concurrent-gc-syncs: 20
      # 默认10. 同时同步的命名空间的数量。
      concurrent-namespace-syncs: 10
      # 默认5. 同时同步的副本集的数量。
      concurrent-replicaset-syncs: 5
      # 默认5m0s. 同时同步的资源配额数。（新版本中已弃用）
      # concurrent-resource-quota-syncs: 5m0s
      # 默认1. 同时同步的服务数。
      concurrent-service-syncs: 1
      # 默认5. 同时同步的服务帐户令牌数。
      concurrent-serviceaccount-token-syncs: 5
      # 默认30s. 同步deployment的周期。
      deployment-controller-sync-period: 30s
      # 默认15s。同步PV和PVC的周期。
      pvclaimbinder-sync-period: 15s
```

## 3. kubelet

RKE 或者 Rancher UI 自定义部署集群的时候，在 yaml 文件中指定以下参数

```yaml
services:
  kubelet:
    extra_args:
      feature-gates: "TaintBasedEvictions=false"
      # 指定pause镜像
      pod-infra-container-image: "rancher/pause:3.1"
      # 传递给网络插件的MTU值，以覆盖默认值，设置为0(零)则使用默认的1460
      network-plugin-mtu: "1500"
      # 修改节点最大Pod数量
      max-pods: "250"
      # 密文和配置映射同步时间，默认1分钟
      sync-frequency: "3s"
      # Kubelet进程可以打开的文件数（默认1000000）,根据节点配置情况调整
      max-open-files: "2000000"
      # 与apiserver会话时的并发数，默认是10
      kube-api-burst: "30"
      # 与apiserver会话时的 QPS,默认是5，QPS = 并发量/平均响应时间
      kube-api-qps: "15"
      # kubelet默认一次拉取一个镜像，设置为false可以同时拉取多个镜像，
      # 前提是存储驱动要为overlay2，对应的Dokcer也需要增加下载并发数，参考[docker配置](/rancher2x/install-prepare/best-practices/docker/)
      serialize-image-pulls: "false"
      # 拉取镜像的最大并发数，registry-burst不能超过registry-qps。
      # 仅当registry-qps大于0(零)时生效，(默认10)。如果registry-qps为0则不限制(默认5)。
      registry-burst: "10"
      registry-qps: "0"
      cgroups-per-qos: "true"
      cgroup-driver: "cgroupfs"

      # 节点资源预留
      enforce-node-allocatable: "pods"
      system-reserved: "cpu=0.25,memory=200Mi"
      kube-reserved: "cpu=0.25,memory=1500Mi"

      # POD驱逐，这个参数只支持内存和磁盘。
      ## 硬驱逐阈值
      ### 当节点上的可用资源降至保留值以下时，就会触发强制驱逐。强制驱逐会强制kill掉POD，不会等POD自动退出。
      eviction-hard: "memory.available<300Mi,nodefs.available<10%,imagefs.available<15%,nodefs.inodesFree<5%"
      ## 软驱逐阈值
      ### 以下四个参数配套使用，当节点上的可用资源少于这个值时但大于硬驱逐阈值时候，会等待eviction-soft-grace-period设置的时长；
      ### 等待中每10s检查一次，当最后一次检查还触发了软驱逐阈值就会开始驱逐，驱逐不会直接Kill POD，先发送停止信号给POD，然后等待eviction-max-pod-grace-period设置的时长；
      ### 在eviction-max-pod-grace-period时长之后，如果POD还未退出则发送强制kill POD"
      eviction-soft: "memory.available<500Mi,nodefs.available<80%,imagefs.available<80%,nodefs.inodesFree<10%"
      eviction-soft-grace-period: "memory.available=1m30s,nodefs.available=1m30s,imagefs.available=1m30s,nodefs.inodesFree=1m30s"
      eviction-max-pod-grace-period: "30"
      eviction-pressure-transition-period: "30s"
      # 指定kubelet多长时间向master发布一次节点状态。注意: 它必须与kube-controller中的nodeMonitorGracePeriod一起协调工作。(默认 10s)
      node-status-update-frequency: 10s
      # 设置cAdvisor全局的采集行为的时间间隔，主要通过内核事件来发现新容器的产生。默认1m0s
      global-housekeeping-interval: 1m0s
      # 每个已发现的容器的数据采集频率。默认10s
      housekeeping-interval: 10s
      # 所有运行时请求的超时，除了长时间运行的 pull, logs, exec and attach。超时后，kubelet将取消请求，抛出错误，然后重试。(默认2m0s)
      runtime-request-timeout: 2m0s
      # 指定kubelet计算和缓存所有pod和卷的卷磁盘使用量的间隔。默认为1m0s
      volume-stats-agg-period: 1m0s

    # 可以选择定义额外的卷绑定到服务
    extra_binds:
      - "/usr/libexec/kubernetes/kubelet-plugins:/usr/libexec/kubernetes/kubelet-plugins"
      - "/etc/iscsi:/etc/iscsi"
      - "/sbin/iscsiadm:/sbin/iscsiadm"
```

## 4. kube-proxy

```yaml
services:
  kubeproxy:
    extra_args:
      # 默认使用iptables进行数据转发，如果要启用ipvs，则此处设置为`ipvs`，一并添加下面的`extra_binds`
      proxy-mode: ""
      # 与kubernetes apiserver通信并发数,默认10;
      kube-api-burst: 20
      # 与kubernetes apiserver通信时使用QPS，默认值5，QPS=并发量/平均响应时间
      kube-api-qps: 10
    extra_binds:
      - "/lib/modules:/lib/modules"
```

## 5. kube-scheduler

```yaml
services:
  scheduler:
    extra_args:
      kube-api-burst:
    extra_binds: []
    extra_env: []
```
