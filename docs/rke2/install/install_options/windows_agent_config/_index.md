---
title: Windows Agent 配置参考
description: 这是对所有可用于配置 rke2 agent 的参数的参考。请注意，虽然这是命令行参数的参考，但配置 RKE2 的最佳方式是使用配置文件
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
  - Windows Agent 配置参考
---

这是所有可用于配置 Windows RKE2 Agent 的参数的参考。

## Windows RKE2 Agent CLI 帮助

**从 v1.21.3+rke2r1 开始，Windows 支持目前是实验性的**。**Windows 支持需要选择 Calico 作为 RKE2 集群的 CNI**。

```console
NAME:
   rke2.exe agent - Run node agent

USAGE:
   rke2.exe agent command [command options] [arguments...]

COMMANDS:
   service  Manage RKE2 as a Windows Service

选项:
   --config FILE, -c FILE                     (config) 从FILE加载配置（默认："/etc/rancher/rke2/config.yaml" ） [%RKE2_CONFIG_FILE%]
   --debug                                    (logging) 打开调试日志 [%RKE2_DEBUG%]
   --token value, -t value                    (cluster) 用于验证的令牌 [%RKE2_TOKEN%]
   --token-file value                         (cluster) 用于认证的令牌文件 [%RKE2_TOKEN_FILE%]
   --server value, -s value                   (cluster) 连接到的 Server [%RKE2_URL%]
   --data-dir value, -d value                 (data) 保存数据的文件夹(默认："/var/lib/rancher/rke2")
   --node-name value                          (agent/node) 节点名称 [%RKE2_NODE_NAME%]
   --node-label value                         (agent/node) 注册并启动带有标签集的kubelet
   --node-taint value                         (agent/node) 用一组taints注册kubelet
   --image-credential-provider-bin-dir value  (agent/node) 凭证提供者插件二进制文件所在目录的路径（默认："/var/lib/rancher/credentialprovider/bin"）
   --image-credential-provider-config value   (agent/node) 凭证提供者插件配置文件的路径（默认："/var/lib/rancher/credentialprovider/config.yaml"）
   --container-runtime-endpoint value         (agent/runtime) 禁用嵌入式containerd并使用其他CRI
   --snapshotter value                        (agent/runtime) 覆盖默认的containerd snapshotter（默认："native"）
   --private-registry value                   (agent/runtime) 私有注册表配置文件 (default: "/etc/rancher/rke2/registries.yaml")
   --node-ip value, -i value                  (agent/networking) 为节点公布的IPv4/IPv6地址
   --node-external-ip value                   (agent/networking) 为节点公布的IPv4/IPv6外部IP地址
   --resolv-conf value                        (agent/networking) Kubelet resolv.conf 文件 [%RKE2_RESOLV_CONF%]
   --kubelet-arg value                        (agent/flags) 为kubelet进程定制的标志
   --kube-proxy-arg value                     (agent/flags) 为kube-proxy进程定制的标志
   --protect-kernel-defaults                  (agent/node) 内核调整行为。如果设置，如果内核调优与kubelet默认值不同，则会出现错误
   --selinux                                  (agent/node) 在containerd中启用SELinux [%RKE2_SELINUX%]
   --lb-server-port value                     (agent/node) supervisor 客户端负载均衡器的本地端口。如果supervisor和apiserver不在同一地点，比这个端口小1的额外端口也将用于apiserver客户端负载均衡器。(默认：6444) [%RKE2_LB_SERVER_PORT%]
   --kube-apiserver-image value               (image) 覆盖kube-apiserver使用的镜像 [%RKE2_KUBE_APISERVER_IMAGE%]
   --kube-controller-manager-image value      (image) 覆盖kube-controller-manager的镜像 [%RKE2_KUBE_CONTROLLER_MANAGER_IMAGE%]
   --kube-proxy-image value                   (image) 覆盖kube-proxy使用的镜像 [%RKE2_KUBE_PROXY_IMAGE%]
   --kube-scheduler-image value               (image) 覆盖kube-scheduler使用的镜像 [%RKE2_KUBE_SCHEDULER_IMAGE%]
   --pause-image value                        (image) 覆盖pause 的镜像[%RKE2_PAUSE_IMAGE%]
   --runtime-image value                      (image) 覆盖runtime 二进制文件 (containerd, kubectl, crictl, etc) [%RKE2_RUNTIME_IMAGE%]
   --etcd-image value                         (image) 覆盖用于etcd的镜像 [%RKE2_ETCD_IMAGE%]
   --kubelet-path value                       (experimental/agent) 覆盖kubelet二进制路径 [%RKE2_KUBELET_PATH%]
   --cloud-provider-name value                (cloud provider) 云提供商名称 [%RKE2_CLOUD_PROVIDER_NAME%]
   --cloud-provider-config value              (cloud provider) 云提供商配置文件路径 [%RKE2_CLOUD_PROVIDER_CONFIG%]
   --profile value                            (security) 根据选定的基准验证系统配置 (有效项目: cis-1.5, cis-1.6 ) [%RKE2_CIS_PROFILE%]
   --audit-policy-file value                  (security) 定义审计策略配置的文件的路径 [%RKE2_AUDIT_POLICY_FILE%]
   --help, -h                                 显示帮助

```
