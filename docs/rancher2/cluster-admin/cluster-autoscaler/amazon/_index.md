---
title: 使用 AWS Auto Scaling 组进行集群弹性伸缩
description: 本指南提供了使用 AWS EC2 自动伸缩组在 Rancher 自定义集群上安装和使用Kubernetes cluster-autoscaler的操作指导。我们将安装一个 Rancher RKE 自定义集群，其中有一个固定数量的节点，采用 etcd 和 controlplane 角色，还有一个可变的节点，采用 worker 角色，由cluster-autoscaler管理。
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
  - 集群管理员指南
  - 集群弹性伸缩
  - 使用 AWS Auto Scaling 组进行集群弹性伸缩
---

本文提供了使用 AWS EC2 自动伸缩组在 Rancher 自定义集群上安装和使用[Kubernetes cluster-autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/)的操作指导。

我们将安装一个 Rancher RKE 自定义集群，这个集群中有固定数量的节点，这些节点配置了 etcd 或 controlplane 角色，还有一个的节点，配置了 worker 角色，由`cluster-autoscaler`管理。

## 先决条件

使用 AWS Auto Scaling 组进行集群弹性伸缩需要满足以下条件：

- Rancher server 已经启动，并正在运行
- 已有 AWS EC2 账户，而且这个账户具有创建虚拟机、自动扩展组、IAM 配置文件和角色的权限。

## 创建一个自定义集群

使用 Kubernetes v1.18.x，在 Rancher server 上创建一个自定义 k8s 集群。请将`cloud_provider`名称配置为`amazonec2`。完成自定义集群的创建流程后，需要运行以下命令，获取如下参数信息：

```sh
  sudo docker run -d --privileged --restart=unless-stopped --net=host -v /etc/kubernetes:/etc/kubernetes -v /var/run:/var/run rancher/rancher-agent:<RANCHER_VERSION> --server https://<RANCHER_URL> --token <RANCHER_TOKEN> --ca-checksum <RANCHER_CHECKSUM> <roles>
```

- clusterID： `c-xxxxx` 用于 EC2`kubernetes.io/cluster/<clusterID>`实例标签
- clusterName：用于 EC2`k8s.io/cluster-autoscaler/<clusterName>`实例标签
- nodeCommand： 将被添加到 EC2 实例 user_data 上，以包括集群上的新节点

## 配置云服务提供商

在 AWS EC2 上，创建一些 objects 完成系统配置。下文定义了三个不同的组：Autoscaling group、Master group 和 Worker group，以及 IAM 配置文件，您需要用到这些组和配置文件完成系统配置。

1. Autoscaling group（下文简称 ASG）：属于 EC2 自动缩放组 ASG 的节点。`cluster-autoscaler`使用 ASG 以扩大或缩小集群规模。

- IAM 配置文件：运行 cluster-autoscaler 的 k8s 节点需要使用的配置文件，建议 Kubernetes master 节点使用。这个配置文件叫做`K8sAutoscalerProfile`。

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
        "Resource": ["*"]
      }
    ]
  }
  ```

2. Master group：独立于 ASG 之外的 etcd 或 controlplane 节点。

- IAM 配置文件：与云服务厂商集成的时候，需要提供的 IAM 配置文件。可以选择使用`AWS_ACCESS_KEY`和`AWS_SECRET_KEY`代替[using-aws-credentials.](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#using-aws-credentials)这个配置文件叫做`K8sMasterProfile`。

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
        "Resource": ["*"]
      }
    ]
  }
  ```

- IAM 角色：`K8sMasterRole。[K8sMasterProfile,K8sAutoscalerProfile]`。

  - 安全组：`K8sMasterSg`更多信息请见[RKE ports (custom nodes tab)](/docs/rancher2/installation_new/requirements/ports/_index)
  - 标签：
    `kubernetes.io/cluster/<clusterID>: owned`。
  - 用户数据：`K8sMasterUserData`Ubuntu 18.04(ami-0e11cbb34015ff725)，安装 docker 并将 etcd+controlplane 节点添加到 k8s 集群中。- IAM 角色：`K8sMasterRole。[K8sMasterProfile,K8sAutoscalerProfile]`。

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

3. Worker group：worker 节点，将由集群 autoscaler 使用 ASG 进行缩放。

- IAM 配置文件。提供 cloud_provider worker 集成。此配置文件称为`K8sWorkerProfile`。
  `json { "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Action": [ "ec2:DescribeInstances", "ec2:DescribeRegions", "ecr:GetAuthorizationToken", "ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:GetRepositoryPolicy", "ecr:DescribeRepositories", "ecr:ListImages", "ecr:BatchGetImage" ], "Resource": "*" } ] }`

- IAM 角色：`K8sWorkerRole: [K8sWorkerProfile]`

  - 安全组：`K8sWorkerSg` 更多信息请见 [RKE ports (custom nodes tab)](/docs/rancher2/installation_new/requirements/ports/_index)
  - 标签：

    - `kubernetes.io/cluster/<clusterID>: owned`
    - `k8s.io/cluster-autoscaler/<clusterName>: true`
    - `k8s.io/cluster-autoscaler/enabled: true`

  - 用户数据：`K8sWorkerUserData`Ubuntu 18.04(ami-0e11cbb34015ff725)，安装 docker 并将 worker 节点添加到 k8s 集群中。

  ```sh
  #！/bin/bash -x cat <<EOF > /etc/sysctl.d/90-kubelet.conf
  vm.overcommit_memory = 1
  vm.panic_on_oom = 0
  kernel.panic = 10
  kernel. panic_on_oops = 1
  kernel.keys.root_maxkeys = 1000000
  kernel.keys.root_maxbytes = 25000000
  EOF
  sysctl -p /etc/sysctl.d/90-kubelet. conf
  curl -sL https://releases.rancher.com/install-docker/19.03.sh | sh sudo usermod -aG docker ubuntu
  TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
  PRIVATE_IP=$(curl -H "X-aws-ec2-metadata-token: ${TOKEN}" -s http://169. 254.169.254/latest/meta-data/local-ipv4)
  PUBLIC_IP=$(curl -H "X-aws-ec2-metadata-token: ${TOKEN}" -s http://169.254.169. 254/latest/meta-data/public-ipv4)
  K8S_ROLES="--worker"
  sudo docker run -d --privileged --restart=unless-stopped --net=host -v /etc/kubernetes:/etc/kubernetes -v /var/run:/var/run rancher/rancher-agent: <RANCHER_VERSION> --server https://<RANCHER_URL> --token <RANCHER_TOKEN> --ca-checksum <RANCHER_CA_CHECKCSUM> --address ${PUBLIC_IP} --internal-address ${PRIVATE_IP} ${K8S_ROLES}`
  ```

更多信息请参见[AWS 上的 RKE 集群](/docs/rancher2/cluster-provisioning/rke-clusters/cloud-providers/amazon/_index)和[AWS 上的 Cluster Autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md)。

## 部署节点

配置了 AWS 后，需要创建虚拟机来引导集群。

- master（etcd+controlplane）节点：部署三个 master 实例。更多信息请参见[生产就绪集群的建议](/docs/rancher2/cluster-provisioning/production/_index)。

  - IAM 角色：`K8sMasterRole`
  - 安全组：`K8sMasterSg`
  - 标签：
    - `kubernetes.io/cluster/<clusterID>: owned`
  - 用户数据： `K8sMasterUserData`

- worker 节点：在 EC2 上定义一个 ASG，设置如下：
  - 名称：`K8sWorkerAsg`
  - IAM 角色：`K8sWorkerRole`
  - 安全组：`K8sWorkerSg`
  - 标签：
    - `kubernetes.io/cluster/<clusterID>: owned`
    - `k8s.io/cluster-autoscaler/<clusterName>: true`
    - `k8s.io/cluster-autoscaler/enabled: true`
  - 用户数据：`K8sWorkerUserData`
  - 实例数量：
    _ minimum: 2
    _ desired: 2 \* maximum: 10
    部署了虚拟机后，您应该拥有一个由三个主节点和两个工作节点组成的 Rancher 自定义集群。

## 安装 Cluster-autoscaler

此时，我们应该已经有了 rancher 集群并开始运行。我们将按照 cluster-autoscaler 的建议，在主节点和`kube-system`命名空间安装 cluster-autoscaler。

## 参数对照表

下表说明了用于微调的集群 cluster-autoscaler 参数：

| 参数                                  | 默认值        | 描述                                                                                                                                        |
| :------------------------------------ | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| cluster-name                          | -             | 配置自动弹性伸缩的集群名称                                                                                                                  |
| address                               | :8085         | 暴露 Prometheus 指标的地址                                                                                                                  |
| kubernetes                            | -             | Kubernetes master 节点的位置，默认情况下不需要填写                                                                                          |
| kubeconfig                            | -             | 包含认证信息和 master 节点信息的 kubeconfig 文件的路径。                                                                                    |
| cloud-config                          | -             | 云提供商配置文件的路径，空字符串表示没有配置文件                                                                                            |
| namespace                             | "kube-system" | 运行 cluster-autoscaler 的命名空间名称                                                                                                      |
| scale-down-enabled                    | true          | cluster-autoscaler 是否具有对集群进行缩容操作的权限                                                                                         |
| scale-down-delay-after-add            | "10m"         | 扩容后，重新评估是否应该缩容前的等待时间，默认值为"10m"，表示 10 分钟                                                                       |
| scale-down-delay-after-delete         | 0             | 删除节点后，重新评估是否应该缩容前的等待时间，通过`scanInterval`参数配置该时间                                                              |
| scale-down-delay-after-failure        | "3m"          | 节点出现 failures 后，重新评估是否应该缩容前的等待时间，默认值为"3m"，表示 3 分钟                                                           |
| scale-down-unneeded-time              | "10m"         | 一个节点被判定为”unneeded“，满足缩容的时间条件                                                                                              |
| scale-down-unready-time               | "20m"         | 一个 unready 节点被判定为”unneeded“，满足缩容的时间条件                                                                                     |
| scale-down-utilization-threshold      | 0.5           | 节点上运行的所有 pods 的 cpu 或内存之和除以节点相应的可分配资源，低于此值的节点可以考虑缩减                                                 |
| scale-down-gpu-utilization-threshold  | 0.5           | 节点上运行的所有 pod 的 gpu 请求的总和除以节点的可分配资源，低于此值的节点可以考虑进行缩减                                                  |
| scale-down-non-empty-candidates-count | 30            | 每次批量缩容可以容纳的最大非空节点数量                                                                                                      |
| scale-down-candidates-pool-ratio      | 0.1           | 当上一次迭代中的一些候选者不再有效时，被认为是额外的非空候选者的节点比例                                                                    |
| scale-down-candidates-pool-min-count  | 50            | 当上一次迭代中的一些候选者不再有效时，被认为是额外的非空候选者的最小节点数                                                                  |
| node-deletion-delay-timeout           | "2m"          | 在删除节点之前，cluster-autoscaler 等待删除 delay-deletion.cluster-autoscaler.ko/注释的最长时间                                             |
| scan-interval                         | "10s"         | 对集群进行一次扩大或缩小规模的重新评估的间隔时长                                                                                            |
| max-nodes-total                       | 0             | 所有节点组中的最大节点数，cluster-autoscaler 不会将集群扩容到超过这个数字的数量                                                             |
| cores-total                           | "0:320000"    | 集群中的最小和最大核心数，格式为`<min>:<max>:<other...>`，集群自动扫描器不会将集群的规模扩大到这些数字之外                                  |
| memory-total                          | "0:6400000"   | 集群中内存的最小和最大千兆字节数，格式为`<min>:<max>:<other...>`，集群自动扫描器不会将集群的规模扩大到这些数字之外                          |
| cloud-provider                        | -             | 云服务提供商的类型                                                                                                                          |
| max-bulk-soft-taint-count             | 10            | 可以同时被污染/不污染 PreferNoSchedule 的节点的最大数量，设置为 0 可以关闭这种污点标记                                                      |
| max-bulk-soft-taint-time              | "3s"          | 同时作为 PreferNoSchedule 的污点/污点节点的最大持续时间                                                                                     |
| max-empty-bulk-delete                 | 10            | 可同时删除的空节点的最大数量                                                                                                                |
| max-graceful-termination-sec          | 600           | 当 cluster-autoscaler 试图缩减一个节点时，等待 pod 终止的最大秒数                                                                           |
| max-total-unready-percentage          | 45            | 集群中未准备好的节点的最大百分比。超过这个百分比后，CA 就会停止操作。                                                                       |
| ok-total-unready-count                | 3             | 允许的未准备好的节点数，不考虑最大总未准备好的百分比。                                                                                      |
| scale-up-from-zero                    | true          | 当有 0 个准备好的节点时，集群自动加速器是否应该扩大规模                                                                                     |
| max-node-provision-time               | "15m"         | cluster-autoscaler 等待配置节点的最长时间                                                                                                   |
| nodes                                 | -             | 以云提供商接受的格式为节点组设置最小、最大大小和其他配置数据。可多次使用。格式： `<min>:<max>:<其他...>`。`<min>:<max>:<其他...>`           |
| node-group-auto-discovery             | -             | 节点组自动发现的一个或多个定义。定义表示为`<name of discoverer>:[<key>[=<value>]]`                                                          |
| estimator                             | -             | "binpacking"                                                                                                                                | 扩大规模时使用的资源估算器类型，可用值：["binpacking"] |
| expander                              | "random"      | 扩大规模时要使用的节点组扩展器的类型。可用的值：`["random","most-pods","least-waste","price","priority"]`                                   |
| ignore-daemonsets-utilization         | false         | CA 在计算资源利用率进行伸缩时，是否应该忽略 DaemonSet pods                                                                                  |
| ignore-mirror-pods-utilization        | false         | 在计算缩减资源利用率时，CA 是否应该忽略 Mirror pods                                                                                         |
| write-status-configmap                | true          | CA 是否应该将状态信息写入 configmap                                                                                                         |
| max-inactivity                        | "10m"         | 在自动重启之前，从最后一次记录的 autoscaler 活动开始的最长时间                                                                              |
| max-failing-time                      | "15m"         | 在自动重启之前，从最后一次记录的 autoscaler 成功运行的最长时间                                                                              |
| balance-similar-node-groups           | false         | 检测相似的节点组，并平衡它们之间的节点数量                                                                                                  |
| node-autoprovisioning-enabled         | false         | CA 是否应该在需要的时候自动提供节点组                                                                                                       |
| max-autoprovisioned-node-group-count  | 15            | 集群中自动提供的组的最大数量                                                                                                                |
| unremovable-node-recheck-timeout      | "5m"          | 我们再次检查之前无法删除的节点之前的超时时间                                                                                                |
| expendable-pods-priority-cutoff       | -10           | 优先级低于截止值的 pods 将被消耗掉。他们可以在缩减规模的时候被杀死，而且不会导致规模扩大。优先级为空的 pods（PodPriority 禁用）是不可消耗的 |
| regional                              | false         | 是不是 regional 集群                                                                                                                        |
| new-pod-scale-up-delay                | "0s"          | 不扩容小存活时间小于这个设定时间的 pods                                                                                                     |
| ignore-taint                          | -             | 指定在考虑缩放节点组时，在节点模板中忽略的污点。                                                                                            |
| balancing-ignore-label                | -             | 指定在比较两个节点组是否相似时，除了基本标签和云提供商标签集外，还要忽略的标签                                                              |
| aws-use-static-instance-list          | false         | CA 应该在运行时获取实例类型还是使用静态列表，这个参数只有 AWS 可用                                                                          |
| profiling                             | false         | 是否启用了 debug/pprof 端点                                                                                                                 |

## 部署

基于[cluster-autoscaler-run-on-master.yaml](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/aws/examples)的例子，我们创建了自己的`cluster-autoscaler-deployment.yaml`，使用首选的[auto-discovery setup](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/aws#auto-discovery-setup)，更新容忍度、nodeSelector、镜像版本和命令配置。

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
    verbs: ["create", "list", "watch"]
  - apiGroups: [""]
    resources: ["configmaps"]
    resourceNames:
      ["cluster-autoscaler-status", "cluster-autoscaler-priority-expander"]
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
        prometheus.io/scrape: "true"
        prometheus.io/port: "8085"
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

准备好 manifest 文件后，将其部署在 Kubernetes 集群中（可以使用 Rancher UI 代替）。

```sh
kubectl -n kube-system apply -f cluster-autoscaler-deployment.yaml
```

**说明：**集群自动识别器的部署也可以使用[手动配置](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/aws#manual-configuration)进行设置。

## 测试

此时，我们应该在 Rancher 自定义集群中建立并运行一个集群缩放器。当以下条件之一为真时，Cluster-scale 应该管理`K8sWorkerAsg` ASG 在 2 到 10 个节点之间进行伸缩。

- 有一些 pods 由于资源不足而未能在集群中运行。在这种情况下，集群被放大。
- 集群中存在长时间未被充分利用的节点，它们 pods 可以放在其他现有节点上。在这种情况下，集群将被缩减。

## 生成负载

我们准备了一个`test-deployment.yaml`，只是为了在 Kubernetes 集群上产生负载，看看集群-autoscaler 是否正常工作。测试部署通过三个副本请求 1000m CPU 和 1024Mi 内存。调整请求的资源和/或副本，以确保你用尽 Kubernetes 集群资源。

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

准备好测试部署后，将其部署在 Kubernetes 集群的默认命名空间中（可以使用 Rancher UI 代替）。

```
kubectl -n default apply -f test-deployment.yaml
```

## 检查自动扩缩容能力

Kubernetes 资源耗尽后，cluster-autoscaler 应该在 pods 未能被调度的地方扩 worker 节点。它应该向上扩展，直到所有的 pods 都可以调度。您应该在 ASG 和 Kubernetes 集群上看到新节点。检查`kube-system` cluster-autoscaler pod 上的日志。

检查扩容能力后，需要继续检查缩容能力。减少测试部署上的副本数量，直到释放了足够的 Kubernetes 集群资源来缩小规模。您应该可以看到 ASG 上和 Kubernetes 集群上的节点消失。检查`kube-system` cluster-autoscaler pod 上的日志。
