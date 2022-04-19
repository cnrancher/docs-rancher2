---
title: 通过 AWS EC2 Auto Scaling 组使用 Cluster Autoscaler
weight: 1
---

本指南介绍如何使用 AWS EC2 Auto Scaling 组在 Rancher 自定义集群上安装和使用 [Kubernetes cluster-autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/)。

我们将安装一个 Rancher RKE 自定义集群，该集群具有固定数量的具有 etcd 和 controlplane 角色的节点，以及数量可变的具有 worker 角色的节点，它们由 `cluster-autoscaler` 管理。

- [前提](#prerequisites)
- [1. 创建自定义集群](#1-create-a-custom-cluster)
- [2. 配置云提供商](#2-configure-the-cloud-provider)
- [3. 部署节点](#3-deploy-nodes)
- [4. 安装 cluster-autoscaler](#4-install-cluster-autoscaler)
   - [参数](#parameters)
   - [部署](#deployment)
- [测试](#testing)
   - [产生负载](#generating-load)
   - [检查扩缩容](#checking-scale)

## 前提

本指南要求：

* Rancher Server 正常运行。
* 你的 AWS EC2 用户具有创建虚拟机、Auto Scaling 组以及 IAM 配置文件和角色的适当权限。

### 1. 创建自定义集群

在 Rancher Server 上，我们需要创建一个自定义的 K8s v1.18.x 集群。请确保 cloud_provider 名称设置为 `amazonec2`。创建集群后，我们需要获得：

* clusterID：`c-xxxxx` 将用于 EC2 `kubernetes.io/cluster/<clusterID>` 实例标签。
* clusterName：将用于 EC2 `k8s.io/cluster-autoscaler/<clusterName>` 实例标签。
* nodeCommand：将添加到 EC2 实例 `user_data` 上，以包含集群上的新节点。

   ```sh
   sudo docker run -d --privileged --restart=unless-stopped --net=host -v /etc/kubernetes:/etc/kubernetes -v /var/run:/var/run rancher/rancher-agent:<RANCHER_VERSION> --server https://<RANCHER_URL> --token <RANCHER_TOKEN> --ca-checksum <RANCHER_CHECKSUM> <roles>
   ```

### 2. 配置云提供商

在 AWS EC2 上，我们需要创建一些对象来配置系统。为了在 AWS 上进行配置，我们定义了三个不同的组和 IAM 配置文件。

1. Autoscaling 组：将加入 EC2 Auto Scaling 组 (ASG) 的节点。`cluster-autoscaler` 将使用 ASG 来进行扩缩容。
* IAM 配置文件：运行 cluster-autoscaler 的 K8s 节点需要该文件。推荐用于 Kubernetes 主节点。此配置文件称为 `K8sAutoscalerProfile`。

   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "autoscaling:DescribeAutoScalingGroups",
                   "autoscaling:DescribeAutoScalingInstances",
                   "autoscaling:DescribeLaunchConfigurations",
                   "autoscaling:SetDesiredCapacity",
                   "autoscaling:TerminateInstanceInAutoScalingGroup",
                   "autoscaling:DescribeTags",
                   "autoscaling:DescribeLaunchConfigurations",
                   "ec2:DescribeLaunchTemplateVersions"
               ],
               "Resource": [
                   "*"
               ]
           }
       ]
   }
   ```

2. Master 组：将成为 Kubernetes etcd 和/或 controlplane 的节点。该组不会在 ASG 中。
* IAM 配置文件：集成 Kubernetes cloud_provider 需要该文件。或者，你也可以使用 `AWS_ACCESS_KEY` 和 `AWS_SECRET_KEY` 来代替 [using-aws-credentials](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#using-aws-credentials)。此配置文件称为 `K8sMasterProfile`。

   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "autoscaling:DescribeAutoScalingGroups",
                   "autoscaling:DescribeLaunchConfigurations",
                   "autoscaling:DescribeTags",
                   "ec2:DescribeInstances",
                   "ec2:DescribeRegions",
                   "ec2:DescribeRouteTables",
                   "ec2:DescribeSecurityGroups",
                   "ec2:DescribeSubnets",
                   "ec2:DescribeVolumes",
                   "ec2:CreateSecurityGroup",
                   "ec2:CreateTags",
                   "ec2:CreateVolume",
                   "ec2:ModifyInstanceAttribute",
                   "ec2:ModifyVolume",
                   "ec2:AttachVolume",
                   "ec2:AuthorizeSecurityGroupIngress",
                   "ec2:CreateRoute",
                   "ec2:DeleteRoute",
                   "ec2:DeleteSecurityGroup",
                   "ec2:DeleteVolume",
                   "ec2:DetachVolume",
                   "ec2:RevokeSecurityGroupIngress",
                   "ec2:DescribeVpcs",
                   "elasticloadbalancing:AddTags",
                   "elasticloadbalancing:AttachLoadBalancerToSubnets",
                   "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
                   "elasticloadbalancing:CreateLoadBalancer",
                   "elasticloadbalancing:CreateLoadBalancerPolicy",
                   "elasticloadbalancing:CreateLoadBalancerListeners",
                   "elasticloadbalancing:ConfigureHealthCheck",
                   "elasticloadbalancing:DeleteLoadBalancer",
                   "elasticloadbalancing:DeleteLoadBalancerListeners",
                   "elasticloadbalancing:DescribeLoadBalancers",
                   "elasticloadbalancing:DescribeLoadBalancerAttributes",
                   "elasticloadbalancing:DetachLoadBalancerFromSubnets",
                   "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
                   "elasticloadbalancing:ModifyLoadBalancerAttributes",
                   "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
                   "elasticloadbalancing:SetLoadBalancerPoliciesForBackendServer",
                   "elasticloadbalancing:AddTags",
                   "elasticloadbalancing:CreateListener",
                   "elasticloadbalancing:CreateTargetGroup",
                   "elasticloadbalancing:DeleteListener",
                   "elasticloadbalancing:DeleteTargetGroup",
                   "elasticloadbalancing:DescribeListeners",
                   "elasticloadbalancing:DescribeLoadBalancerPolicies",
                   "elasticloadbalancing:DescribeTargetGroups",
                   "elasticloadbalancing:DescribeTargetHealth",
                   "elasticloadbalancing:ModifyListener",
                   "elasticloadbalancing:ModifyTargetGroup",
                   "elasticloadbalancing:RegisterTargets",
                   "elasticloadbalancing:SetLoadBalancerPoliciesOfListener",
                   "iam:CreateServiceLinkedRole",
                   "ecr:GetAuthorizationToken",
                   "ecr:BatchCheckLayerAvailability",
                   "ecr:GetDownloadUrlForLayer",
                   "ecr:GetRepositoryPolicy",
                   "ecr:DescribeRepositories",
                   "ecr:ListImages",
                   "ecr:BatchGetImage",
                   "kms:DescribeKey"
               ],
               "Resource": [
                   "*"
               ]
           }
       ]
   }
   ```

   * IAM 角色：`K8sMasterRole: [K8sMasterProfile,K8sAutoscalerProfile]`
   * 安全组：`K8sMasterSg`。详情请参见 [RKE 端口（自定义节点选项卡）]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/ports/#downstream-kubernetes-cluster-nodes)
   * 标签：
      `kubernetes.io/cluster/<clusterID>: owned`
   * 用户数据：`K8sMasterUserData` Ubuntu 18.04(ami-0e11cbb34015ff725)，安装 Docker 并将 etcd 和 controlplane 节点添加到 K8s 集群。

      ```sh
      #!/bin/bash -x

      cat <<EOF > /etc/sysctl.d/90-kubelet.conf
      vm.overcommit_memory = 1
      vm.panic_on_oom = 0
      kernel.panic = 10
      kernel.panic_on_oops = 1
      kernel.keys.root_maxkeys = 1000000
      kernel.keys.root_maxbytes = 25000000
      EOF
      sysctl -p /etc/sysctl.d/90-kubelet.conf

      curl -sL https://releases.rancher.com/install-docker/19.03.sh | sh
      sudo usermod -aG docker ubuntu

      TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
      PRIVATE_IP=$(curl -H "X-aws-ec2-metadata-token: ${TOKEN}" -s http://169.254.169.254/latest/meta-data/local-ipv4)
      PUBLIC_IP=$(curl -H "X-aws-ec2-metadata-token: ${TOKEN}" -s http://169.254.169.254/latest/meta-data/public-ipv4)
      K8S_ROLES="--etcd --controlplane"

      sudo docker run -d --privileged --restart=unless-stopped --net=host -v /etc/kubernetes:/etc/kubernetes -v /var/run:/var/run rancher/rancher-agent:<RANCHER_VERSION> --server https://<RANCHER_URL> --token <RANCHER_TOKEN> --ca-checksum <RANCHER_CA_CHECKSUM> --address ${PUBLIC_IP} --internal-address ${PRIVATE_IP} ${K8S_ROLES}
      ```

3. Worker 组：将加入 K8s worker plane 的节点。Worker 节点将由 cluster-autoscaler 使用 ASG 进行扩缩容。
* IAM 配置文件：提供 cloud_provider worker 集成。
   此配置文件称为 `K8sWorkerProfile`。

   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "ec2:DescribeInstances",
                   "ec2:DescribeRegions",
                   "ecr:GetAuthorizationToken",
                   "ecr:BatchCheckLayerAvailability",
                   "ecr:GetDownloadUrlForLayer",
                   "ecr:GetRepositoryPolicy",
                   "ecr:DescribeRepositories",
                   "ecr:ListImages",
                   "ecr:BatchGetImage"
               ],
               "Resource": "*"
           }
       ]
   }
   ```

* IAM 角色：`K8sWorkerRole：[K8sWorkerProfile]`
* 安全组：`K8sWorkerSg`。详情请参见 [RKE 端口（自定义节点选项卡）]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/ports/#downstream-kubernetes-cluster-nodes)
* 标签：
   * `kubernetes.io/cluster/<clusterID>: owned`
   * `k8s.io/cluster-autoscaler/<clusterName>: true`
   * `k8s.io/cluster-autoscaler/enabled: true`
* 用户数据：`K8sWorkerUserData` Ubuntu 18.04(ami-0e11cbb34015ff725)，安装 Docker 并将 worker 节点添加到 K8s 集群。

   ```sh
   #!/bin/bash -x

   cat <<EOF > /etc/sysctl.d/90-kubelet.conf
   vm.overcommit_memory = 1
   vm.panic_on_oom = 0
   kernel.panic = 10
   kernel.panic_on_oops = 1
   kernel.keys.root_maxkeys = 1000000
   kernel.keys.root_maxbytes = 25000000
   EOF
   sysctl -p /etc/sysctl.d/90-kubelet.conf

   curl -sL https://releases.rancher.com/install-docker/19.03.sh | sh
   sudo usermod -aG docker ubuntu

   TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
   PRIVATE_IP=$(curl -H "X-aws-ec2-metadata-token: ${TOKEN}" -s http://169.254.169.254/latest/meta-data/local-ipv4)
   PUBLIC_IP=$(curl -H "X-aws-ec2-metadata-token: ${TOKEN}" -s http://169.254.169.254/latest/meta-data/public-ipv4)
   K8S_ROLES="--worker"

   sudo docker run -d --privileged --restart=unless-stopped --net=host -v /etc/kubernetes:/etc/kubernetes -v /var/run:/var/run rancher/rancher-agent:<RANCHER_VERSION> --server https://<RANCHER_URL> --token <RANCHER_TOKEN> --ca-checksum <RANCHER_CA_CHECKCSUM> --address ${PUBLIC_IP} --internal-address ${PRIVATE_IP} ${K8S_ROLES}
   ```

详情请参见 [AWS 上的 RKE 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/amazon/) 和 [AWS 上的 Cluster Autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md)。

### 3. 部署节点

我们配置 AWS 后，我们需要创建虚拟机来引导集群：

* master (etcd+controlplane)：根据需要部署三个适当大小的 master 实例。详情请参见[生产就绪集群的建议]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/production/)。
   * IAM 角色：`K8sMasterRole`
   * 安全组：`K8sMasterSg`
   * 标签：
      * `kubernetes.io/cluster/<clusterID>: owned`
   * 用户数据：`K8sMasterUserData`

* worker：使用以下设置在 EC2 上定义 ASG：
   * 名称：`K8sWorkerAsg`
   * IAM 角色：`K8sWorkerRole`
   * 安全组：`K8sWorkerSg`
   * 标签：
      * `kubernetes.io/cluster/<clusterID>: owned`
      * `k8s.io/cluster-autoscaler/<clusterName>: true`
      * `k8s.io/cluster-autoscaler/enabled: true`
   * 用户数据：`K8sWorkerUserData`
   * 实例：
      * 最少：2
      * 理想情况：2
      * 最大：10

部署 VM 后，你的 Rancher 自定义集群应该可以正常运行了，其中包含三个 master 节点和两个 worker 节点。

### 4. 安装 Cluster-autoscaler

此时，我们的 Rancher 集群应该已正常运行。我们将根据 cluster-autoscaler 的建议，在 master 节点和 `kube-system` 命名空间上安装 cluster-autoscaler。

#### 参数

下表显示了用于微调的 cluster-autoscaler 参数：

| 参数 | 默认 | 描述 |
|---|---|---|
| cluster-name | - | 自动扩缩的集群的名称（如果可用） |
| address | :8085 | 公开 Prometheus 指标的地址 |
| kubernetes | - | Kubernetes master 位置。如需使用默认值，则留空 |
| kubeconfig | - | 带有授权和 master 位置信息的 kubeconfig 文件的路径 |
| cloud-config | - | 云提供商配置文件的路径。如果没有配置文件，则为空字符串 |
| namespace | "kube-system" | 运行 cluster-autoscaler 的命名空间 |
| scale-down-enabled | true | CA 是否应该缩减集群 |
| scale-down-delay-after-add | "10m" | 扩容多久后恢复缩容评估 |
| scale-down-delay-after-delete | 0 | 节点删除多久后恢复缩容评估，默认为 scanInterval 的值 |
| scale-down-delay-after-failure | "3m" | 缩容失败多久后恢复缩容评估 |
| scale-down-unneeded-time | "10m" | 在能进行缩容之前，节点需要不被使用的时间 |
| scale-down-unready-time | "20m" | 在能进行缩容之前，非就绪节点应该需要不被使用的时间 |
| scale-down-utilization-threshold | 0.5 | 节点上运行的所有 pod 的 CPU 或内存之和除以节点对应的可分配资源，低于该值时可以考虑缩减一个节点 |
| scale-down-gpu-utilization-threshold | 0.5 | 节点上运行的所有 pod 的 GPU 请求总和除以节点的可分配资源，低于该值时可以考虑缩减一个节点 |
| scale-down-non-empty-candidates-count | 30 | 在一次迭代中被认为是空节点的最大数量，这些节点会成为使用清空来缩容的候选节点 |
| scale-down-candidates-pool-ratio | 0.1 | 当先前迭代的某些候选节点失效时，被视为要缩容的额外非空候选节点的比率 |
| scale-down-candidates-pool-min-count | 50 | 当先前迭代的某些候选节点失效时，被视为要缩容的额外非空候选节点的最大数量 |
| node-deletion-delay-timeout | "2m" | CA 在删除节点之前，等待删除 delay-deletion.cluster-autoscaler.kubernetes.io/ 注释的最长时间 |
| scan-interval | "10s" | 重新评估集群扩缩容的频率 |
| max-nodes-total | 0 | 所有节点组中的最大节点数。Cluster Autoscaler 不会让集群增长到超过此数量 |
| cores-total | "0:320000" | 集群中的最小和最大的核心数，格式为 <min>:<max>。Cluster Autoscaler 会在该范围内扩缩集群 |
| memory-total | "0:6400000" | 集群中最小和最大内存千兆字节数，格式为 <min>:<max>。Cluster Autoscaler 会在该范围内扩缩集群 |
| cloud-provider | - | 云提供商类型 |
| max-bulk-soft-taint-count | 10 | 可以同时添加/移除 PreferNoSchedule 污点的最大节点数。设置为 0 则关闭此类污点 |
| max-bulk-soft-taint-time | "3s" | 同时添加/移除 PreferNoSchedule 污点的最大持续时间。 |
| max-empty-bulk-delete | 10 | 可以同时删除的最大空节点数 |
| max-graceful-termination-sec | 600 | 尝试缩减节点时，CA 等待 pod 终止的最大秒数 |
| max-total-unready-percentage | 45 | 集群中未就绪节点的最大百分比。超过此值后，CA 将停止操作 |
| ok-total-unready-count | 3 | 允许的未就绪节点数，与 max-total-unready-percentage 无关 |
| scale-up-from-zero | true | 就绪节点数等于 0 时，CA 是否应该扩容 |
| max-node-provision-time | "15m" | CA 等待节点配置的最长时间 |
| nodes | - | 以云提供商接受的格式设置节点组的最小、最大大小和其他配置数据。可以多次使用。格式是  <min>:<max>:<other...> |
| node-group-auto-discovery | - | 节点组自动发现的一个或多个定义。定义表示为 `<name of discoverer>:[<key>[=<value>]]` |
| estimator | - | "binpacking" | 用于扩容的资源评估器类型。可用值：["binpacking"] |
| expander | "random" | 要在扩容中使用的节点组扩展器的类型。可用值：`["random","most-pods","least-waste","price","priority"]` |
| ignore-daemonsets-utilization | false | CA 为了缩容而计算资源利用率时，是否应忽略 DaemonSet pod |
| ignore-mirror-pods-utilization | false | CA 为了缩容而计算资源利用率时，是否应忽略 Mirror pod |
| write-status-configmap | true | CA 是否应该将状态信息写入 configmap |
| max-inactivity | "10m" | 从上次记录的 autoscaler 活动后，自动重启之前的最长时间 |
| max-failing-time | "15m" | 从上次记录的 autoscaler 成功运行后，自动重启之前的最长时间 |
| balance-similar-node-groups | false | 检测相似的节点组，并均衡它们的节点数量 |
| node-autoprovisioning-enabled | false | CA 是否应在需要时自动配置节点组 |
| max-autoprovisioned-node-group-count | 15 | 集群中自动配置组的最大数量 |
| unremovable-node-recheck-timeout | "5m" | 在再次检查无法删除的节点之前，节点的超时时间 |
| expendable-pods-priority-cutoff | -10 | 优先级低于 cutoff 的 Pod 将是消耗性 pod。这些 pod 可以在缩容期间不加考虑地被终止，并且不会导致扩容。优先级是 null（禁用 PodPriority）的 pod 不是消耗性的 |
| regional | false | 集群是区域性的 |
| new-pod-scale-up-delay | "0s" | 生命短于这个值的 Pod 将不考虑扩容 |
| ignore-taint | - | 在扩缩容节点组时，指定在节点模板中要忽略的污点 |
| balancing-ignore-label | - | 在比较两个节点组是否相似时，指定要忽略的标签（基本标签集和云提供商标签集除外） |
| aws-use-static-instance-list | false | CA 在运行时还是使用静态列表获取实例类型。仅适用于 AWS |
| profiling | false | 是否启用了 debug/pprof 端点 |

#### 部署

基于 [cluster-autoscaler-run-on-master.yaml](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-run-on-master.yaml) 示例，我们已经创建了自己的 `cluster-autoscaler-deployment.yaml` 以使用首选的 [auto-discovery 设置](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/aws#auto-discovery-setup)，更新容忍度、nodeSelector、镜像版本和命令配置：


```yml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  labels:
    k8s-addon: cluster-autoscaler.addons.k8s.io
    k8s-app: cluster-autoscaler
  name: cluster-autoscaler
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cluster-autoscaler
  labels:
    k8s-addon: cluster-autoscaler.addons.k8s.io
    k8s-app: cluster-autoscaler
rules:
  - apiGroups: [""]
    resources: ["events", "endpoints"]
    verbs: ["create", "patch"]
  - apiGroups: [""]
    resources: ["pods/eviction"]
    verbs: ["create"]
  - apiGroups: [""]
    resources: ["pods/status"]
    verbs: ["update"]
  - apiGroups: [""]
    resources: ["endpoints"]
    resourceNames: ["cluster-autoscaler"]
    verbs: ["get", "update"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["watch", "list", "get", "update"]
  - apiGroups: [""]
    resources:
      - "pods"
      - "services"
      - "replicationcontrollers"
      - "persistentvolumeclaims"
      - "persistentvolumes"
    verbs: ["watch", "list", "get"]
  - apiGroups: ["extensions"]
    resources: ["replicasets", "daemonsets"]
    verbs: ["watch", "list", "get"]
  - apiGroups: ["policy"]
    resources: ["poddisruptionbudgets"]
    verbs: ["watch", "list"]
  - apiGroups: ["apps"]
    resources: ["statefulsets", "replicasets", "daemonsets"]
    verbs: ["watch", "list", "get"]
  - apiGroups: ["storage.k8s.io"]
    resources: ["storageclasses", "csinodes"]
    verbs: ["watch", "list", "get"]
  - apiGroups: ["batch", "extensions"]
    resources: ["jobs"]
    verbs: ["get", "list", "watch", "patch"]
  - apiGroups: ["coordination.k8s.io"]
    resources: ["leases"]
    verbs: ["create"]
  - apiGroups: ["coordination.k8s.io"]
    resourceNames: ["cluster-autoscaler"]
    resources: ["leases"]
    verbs: ["get", "update"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: cluster-autoscaler
  namespace: kube-system
  labels:
    k8s-addon: cluster-autoscaler.addons.k8s.io
    k8s-app: cluster-autoscaler
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["create","list","watch"]
  - apiGroups: [""]
    resources: ["configmaps"]
    resourceNames: ["cluster-autoscaler-status", "cluster-autoscaler-priority-expander"]
    verbs: ["delete", "get", "update", "watch"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-autoscaler
  labels:
    k8s-addon: cluster-autoscaler.addons.k8s.io
    k8s-app: cluster-autoscaler
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-autoscaler
subjects:
  - kind: ServiceAccount
    name: cluster-autoscaler
    namespace: kube-system

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: cluster-autoscaler
  namespace: kube-system
  labels:
    k8s-addon: cluster-autoscaler.addons.k8s.io
    k8s-app: cluster-autoscaler
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: cluster-autoscaler
subjects:
  - kind: ServiceAccount
    name: cluster-autoscaler
    namespace: kube-system

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cluster-autoscaler
  namespace: kube-system
  labels:
    app: cluster-autoscaler
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cluster-autoscaler
  template:
    metadata:
      labels:
        app: cluster-autoscaler
      annotations:
        prometheus.io/scrape: 'true'
        prometheus.io/port: '8085'
    spec:
      serviceAccountName: cluster-autoscaler
      tolerations:
        - effect: NoSchedule
          operator: "Equal"
          value: "true"
          key: node-role.kubernetes.io/controlplane
      nodeSelector:
        node-role.kubernetes.io/controlplane: "true"
      containers:
        - image: eu.gcr.io/k8s-artifacts-prod/autoscaling/cluster-autoscaler:v1.18.1
          name: cluster-autoscaler
          resources:
            limits:
              cpu: 100m
              memory: 300Mi
            requests:
              cpu: 100m
              memory: 300Mi
          command:
            - ./cluster-autoscaler
            - --v=4
            - --stderrthreshold=info
            - --cloud-provider=aws
            - --skip-nodes-with-local-storage=false
            - --expander=least-waste
            - --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/<clusterName>
          volumeMounts:
            - name: ssl-certs
              mountPath: /etc/ssl/certs/ca-certificates.crt
              readOnly: true
          imagePullPolicy: "Always"
      volumes:
        - name: ssl-certs
          hostPath:
            path: "/etc/ssl/certs/ca-certificates.crt"

```

准备好清单文件后，将该文件部署到 Kubernetes 集群中（也可以使用 Rancher UI 进行操作）：

```sh
kubectl -n kube-system apply -f cluster-autoscaler-deployment.yaml
```

**注意**：你也可以通过[手动配置](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/aws#manual-configuration)来设置 Cluster-autoscaler deployment。

## 测试

此时，cluster-autoscaler 应该已经在 Rancher 自定义集群中启动并运行。当满足以下条件之一时，cluster-autoscaler 需要管理 `K8sWorkerAsg` ASG，以在 2 到 10 个节点之间进行扩缩容：

* 集群中有 Pod 因资源不足而无法运行。在这种情况下，集群被扩容。
* 集群中有一些节点长时间未得到充分利用，而且它们的 Pod 可以放到其他现有节点上。在这种情况下，集群被缩容。

### 产生负载

为了在 Kubernetes 集群上产生负载并查看 cluster-autoscaler 是否正常工作，我们准备了一个 `test-deployment.yaml`。`test-deployment` 通过三个副本请求 1000m CPU 和 1024Mi 内存。通过调整请求的资源和/或副本以确保耗尽 Kubernetes 集群资源：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: hello-world
  name: hello-world
spec:
  replicas: 3
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
        ports:
        - containerPort: 80
          protocol: TCP
        resources:
          limits:
            cpu: 1000m
            memory: 1024Mi
          requests:
            cpu: 1000m
            memory: 1024Mi
```

准备好 test deployment 后，将其部署在 Kubernetes 集群的默认命名空间中（可以使用 Rancher UI）：

```
kubectl -n default apply -f test-deployment.yaml
```

### 检查扩缩容

Kubernetes 资源耗尽后，cluster-autoscaler 应该扩容无法调度 pod 的 worker 节点。它应该进行扩容，直到所有 pod 都能被调度。你应该会在 ASG 和 Kubernetes 集群上看到新节点。检查 `kube-system` cluster-autoscaler pod 上的日志。

检查完扩容后，我们开始检查缩容。为此，请减少 test deployment 的副本数，直到你能释放足够的 Kubernetes 集群资源以进行缩容。你应该能看到 ASG 和 Kubernetes 集群上的节点消失了。检查 `kube-system` cluster-autoscaler pod 上的日志。
