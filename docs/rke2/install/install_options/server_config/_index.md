---
title: Server 配置参考
description: 这是对可用于配置 rke2 server的所有参数的引用。请注意，虽然这是对命令行参数的引用，但配置 RKE2 的最佳方式是使用配置文件
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
  - RKE2
  - Server 配置参考
---

这是对可用于配置 rke2 server 的所有参数的引用。请注意，虽然这是对命令行参数的引用，但配置 RKE2 的最佳方式是使用[配置文件](/docs/rke2/install/install_options/install_options/_index#配置文件)。

## RKE2 Server CLI 帮助

> 如果一个选项出现在下面的括号里，例如`[$RKE2_TOKEN]`，这意味着该选项可以作为该名称的环境变量传入。

```console
NAME:
   rke2 server - Run management server

USAGE:
   rke2 server [OPTIONS]

OPTIONS:
   --config FILE, -c FILE                 (config) 从FILE（默认："/etc/rancher/rke2/config.yaml"）加载配置 [$RKE2_CONFIG_FILE]
   --debug                                (logging) 开启调试日志 [$RKE2_DEBUG]
   --bind-address value                   (listener) rke2 bind 地址 (默认: 0.0.0.0)
   --advertise-address value              (listener) apiserver用来向集群成员公布的IPv4地址。 (默认: node-external-ip/node-ip)
   --tls-san value                        (listener) 在server TLS证书上添加额外的主机名或IPv4/IPv6地址作为备用名称
   --data-dir value, -d value             (data) 数据目录 (默认: "/var/lib/rancher/rke2")
   --cluster-cidr value                   (networking) IPv4/IPv6网络CIDRs用于pod IPs (默认: 10.42.0.0/16)
   --service-cidr value                   (networking) 用于 service IP的IPv4/IPv6网络CIDRs (默认: 10.43.0.0/16)
   --service-node-port-range value        (networking) NodePort端口范围 (默认: "30000-32767")
   --cluster-dns value                    (networking) coredns服务的IPv4集群IP。应该是在你的service-cidr范围内。 (默认: 10.43.0.10)
   --cluster-domain value                 (networking) Cluster Domain (默认: "cluster.local")
   --token value, -t value                (cluster) 用于将server或agent加入集群的共享token [$RKE2_TOKEN]
   --token-file value                     (cluster) 包含 cluster-secret/token 的文件 [$RKE2_TOKEN_FILE]
   --write-kubeconfig value, -o value     (client) 将管理客户端的kubeconfig写入此文件中 [$RKE2_KUBECONFIG_OUTPUT]
   --write-kubeconfig-mode value          (client) kubeconfig 的模式 [$RKE2_KUBECONFIG_MODE]
   --kube-apiserver-arg value             (flags) 为kube-apiserver进程设置参数
   --kube-scheduler-arg value             (flags) 为kube-scheduler进程设置参数
   --kube-controller-manager-arg value    (flags) 为kube-controller-manager进程设置参数
   --etcd-expose-metrics                  (db) 将etcd指标暴露给客户端接口. (默认 false)
   --etcd-disable-snapshots               (db) 禁用自动etcd快照
   --etcd-snapshot-name value             (db) 设置etcd快照的基本名称。 默认: etcd-snapshot-<unix-timestamp> (默认: "etcd-snapshot")
   --etcd-snapshot-schedule-cron value    (db) 在cron中的快照间隔时间，例如，每5小时一次 '* */5 * * *' (默认: "0 */12 * * *")
   --etcd-snapshot-retention value        (db) 要保留的快照数量 (默认: 5)
   --etcd-snapshot-dir value              (db) 保存数据库快照的目录。 (默认 location: ${data-dir}/db/snapshots)
   --etcd-s3                              (db) 启用备份到S3
   --etcd-s3-endpoint value               (db) S3 endpoint url (默认: "s3.amazonaws.com")
   --etcd-s3-endpoint-ca value            (db) S3自定义CA证书连接到S3 endpoint
   --etcd-s3-skip-ssl-verify              (db) 禁用S3的SSL证书验证
   --etcd-s3-access-key value             (db) S3 access key [$AWS_ACCESS_KEY_ID]
   --etcd-s3-secret-key value             (db) S3 secret key [$AWS_SECRET_ACCESS_KEY]
   --etcd-s3-bucket value                 (db) S3 bucket 名称
   --etcd-s3-region value                 (db) S3 region / bucket 位置 (可选) (默认: "us-east-1")
   --etcd-s3-folder value                 (db) S3 folder
   --disable value                        (components) 不要部署打包的组件，并删除任何已部署的组件 (有效项目: rke2-coredns, rke2-ingress-nginx, rke2-kube-proxy, rke2-metrics-server)
   --disable-scheduler                    (components) 禁用 Kubernetes scheduler
   --disable-cloud-controller             (components) 禁用 rke2 cloud controller manager
   --node-name value                      (agent/node) 节点名称 [$RKE2_NODE_NAME]
   --node-label value                     (agent/node) 节点标签
   --node-taint value                     (agent/node) 节点污点
   --container-runtime-endpoint value     (agent/runtime) 禁用嵌入式containerd并使用替代的CRI实现
   --snapshotter value                    (agent/runtime) 覆盖默认的 containerd snapshotter (默认: "overlayfs")
   --private-registry value               (agent/runtime) 私有镜像仓库配置文件 (默认: "/etc/rancher/rke2/registries.yaml")
   --node-ip value, -i value              (agent/networking) 要为节点公布的IPv4/IPv6地址
   --node-external-ip value               (agent/networking) 要为节点公布的IPv4/IPv6外部IP地址
   --resolv-conf value                    (agent/networking) Kubelet resolv.conf 文件 [$RKE2_RESOLV_CONF]
   --kubelet-arg value                    (agent/flags) kubelet 进程的自定义标志
   --protect-kernel-defaults              (agent/node) 内核调整行为。如果设置，如果内核调谐与kubelet默认值不同，则会出现错误。
   --agent-token value                    (experimental/cluster) 用于将agent加入集群的共享token，但不包括server [$RKE2_AGENT_TOKEN]
   --agent-token-file value               (experimental/cluster) 包含agent token的文件 [$RKE2_AGENT_TOKEN_FILE]
   --server value, -s value               (experimental/cluster) 连接的server，用于加入一个集群 [$RKE2_URL]
   --cluster-reset                        (experimental/cluster) 成为新集群的唯一成员 [$RKE2_CLUSTER_RESET]
   --cluster-reset-restore-path value     (db) 要恢复的快照文件的路径
   --secrets-encryption                   (experimental) 启用 Secret 加密
   --selinux                              (agent/node) 在containerd中启用SELinux [$RKE2_SELINUX]
   --lb-server-port value                 (agent/node) Supervisor客户端负载均衡器的本地端口。如果supervisor 和apiserver不在同一地点，则apiserver客户端负载均衡器也将使用比该端口少1的额外端口。 (default: 6444) [$RKE2_LB_SERVER_PORT]
   --cni value                            (networking) 部署CNI插件, none, canal, cilium (默认: "canal") [$RKE2_CNI]
   --system-default-registry value        (image) 用于所有系统Docker镜像的私有镜像仓库 [$RKE2_SYSTEM_DEFAULT_REGISTRY]
   --kube-apiserver-image value           (image) 覆盖kube-apiserver使用的镜像 [$RKE2_KUBE_APISERVER_IMAGE]
   --kube-controller-manager-image value  (image) 覆盖kube-controller-manager使用的镜像 [$RKE2_KUBE_CONTROLLER_MANAGER_IMAGE]
   --kube-scheduler-image value           (image) 覆盖kube-scheduler使用的镜像 [$RKE2_KUBE_SCHEDULER_IMAGE]
   --pause-image value                    (image) 覆盖pause使用的镜像 [$RKE2_PAUSE_IMAGE]
   --runtime-image value                  (image) 覆盖用于运行时二进制文件的镜像 (containerd, kubectl, crictl, etc) [$RKE2_RUNTIME_IMAGE]
   --etcd-image value                     (image) 覆盖用于etcd的图像 [$RKE2_ETCD_IMAGE]
   --kubelet-path value                   (experimental/agent) 覆盖kubelet的二进制路径 [$RKE2_KUBELET_PATH]
   --cloud-provider-name value            (cloud provider) Cloud provider 名称 [$RKE2_CLOUD_PROVIDER_NAME]
   --cloud-provider-config value          (cloud provider) Cloud provider 配置文件路径 [$RKE2_CLOUD_PROVIDER_CONFIG]
   --profile value                        (security) 根据选定的基准验证系统配置 (valid items: cis-1.5, cis-1.6 ) [$RKE2_CIS_PROFILE]
   --audit-policy-file value              (security) 定义审计策略配置的文件的路径 [$RKE2_AUDIT_POLICY_FILE]
```
