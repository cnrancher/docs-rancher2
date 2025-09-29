---
title: Linux Agent 配置参考
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
  - Linux Agent 配置参考
---

这是对所有可用于配置 rke2 agent 的参数的参考。请注意，虽然这是命令行参数的参考，但配置 RKE2 的最佳方式是使用[配置文件](/docs/rke2/install/install_options/install_options/#配置文件)。

## RKE2 Agent CLI 帮助

> 如果一个选项出现在下面的括号里，例如`[$RKE2_URL]`，这意味着该选项可以作为该名称的环境变量传入。

```console
NAME:
   rke2 agent - Run node agent

USAGE:
   rke2 agent [OPTIONS]

OPTIONS:
   --config FILE, -c FILE                 (config) 从FILE加载配置 (默认: "/etc/rancher/rke2/config.yaml") [$RKE2_CONFIG_FILE]
   --debug                                (logging) 开启调试日志 [$RKE2_DEBUG]
   --token value, -t value                (cluster) 用于认证的token [$RKE2_TOKEN]
   --token-file value                     (cluster) 用于认证的token文件 [$RKE2_TOKEN_FILE]
   --server value, -s value               (cluster) 要连接的server [$RKE2_URL]
   --data-dir value, -d value             (data) 数据目录 (默认: "/var/lib/rancher/rke2")
   --node-name value                      (agent/node) 节点名称 [$RKE2_NODE_NAME]
   --node-label value                     (agent/node) 节点标签
   --node-taint value                     (agent/node) 节点污点
   --image-credential-provider-bin-dir value     (agent/node) credential provider 插件二进制文件所在目录的路径 (默认: "/var/lib/rancher/credentialprovider/bin")
   --image-credential-provider-config value      (agent/node) credential provider 插件配置文件的路径 (默认: "/var/lib/rancher/credentialprovider/config.yaml")
   --container-runtime-endpoint value     (agent/runtime) 禁用嵌入式containerd并使用替代的CRI实现
   --snapshotter value                    (agent/runtime) 覆盖默认的containerd snapshotter (默认: "overlayfs")
   --private-registry value               (agent/runtime) 私有镜像仓库配置文件 (默认: "/etc/rancher/rke2/registries.yaml")
   --node-ip value, -i value              (agent/networking) 为节点公布的IPv4/IPv6地址
   --node-external-ip value               (agent/networking) 为节点公布的IPv4/IPv6外部IP地址
   --resolv-conf value                    (agent/networking) Kubelet resolv.conf 文件 [$RKE2_RESOLV_CONF]
   --kubelet-arg value                    (agent/flags) kubelet 进程的自定义标志
   --kube-proxy-arg value                 (agent/flags) kube-proxy 进程的自定义标志
   --protect-kernel-defaults              (agent/node) 内核调整行为。如果设置，如果内核调谐与kubelet默认值不同，则会出现错误。
   --selinux                              (agent/node) 在containerd中启用SELinux [$RKE2_SELINUX]
   --lb-server-port value                 (agent/node) Supervisor客户端负载均衡器的本地端口。如果supervisor 和apiserver不在同一地点，则apiserver客户端负载均衡器也将使用比该端口少1的额外端口. (默认: 6444) [$RKE2_LB_SERVER_PORT]
   --system-default-registry value        (image) 用于所有系统Docker镜像的私有镜像仓库 [$RKE2_SYSTEM_DEFAULT_REGISTRY]
   --kube-apiserver-image value           (image) 覆盖kube-apiserver使用的镜像 [$RKE2_KUBE_APISERVER_IMAGE]
   --kube-controller-manager-image value  (image) 覆盖kube-controller-manager使用的镜像 [$RKE2_KUBE_CONTROLLER_MANAGER_IMAGE]
   --kube-scheduler-image value           (image) 覆盖kube-scheduler使用的镜像 [$RKE2_KUBE_SCHEDULER_IMAGE]
   --pause-image value                    (image) 覆盖pause使用的镜像 [$RKE2_PAUSE_IMAGE]
   --runtime-image value                  (image) 覆盖用于运行时二进制文件的镜像 (containerd, kubectl, crictl, etc) [$RKE2_RUNTIME_IMAGE]
   --etcd-image value                     (image) 覆盖用于etcd的镜像 [$RKE2_ETCD_IMAGE]
   --kubelet-path value                   (experimental/agent) 覆盖kubelet的二进制路径 [$RKE2_KUBELET_PATH]
   --cloud-provider-name value            (cloud provider) Cloud provider 名称 [$RKE2_CLOUD_PROVIDER_NAME]
   --cloud-provider-config value          (cloud provider) Cloud provider 配置文件目录 [$RKE2_CLOUD_PROVIDER_CONFIG]
   --profile value                        (security) 根据选定的基准验证系统配置 (有效项目: cis-1.5, cis-1.6 ) [$RKE2_CIS_PROFILE]
   --audit-policy-file value              (security) 定义审计策略配置的文件的路径 [$RKE2_AUDIT_POLICY_FILE]
   --control-plane-resource-requests value       (components) Control Plane 资源请求 [$RKE2_CONTROL_PLANE_RESOURCE_REQUESTS]
   --control-plane-resource-limits value         (components) Control Plane 资源限制 [$RKE2_CONTROL_PLANE_RESOURCE_LIMITS]
   --kube-apiserver-extra-mount value            (components) kube-apiserver 额外的卷挂载 [$RKE2_KUBE_APISERVER_EXTRA_MOUNT]
   --kube-scheduler-extra-mount value            (components) kube-scheduler 额外的卷挂载 [$RKE2_KUBE_SCHEDULER_EXTRA_MOUNT]
   --kube-controller-manager-extra-mount value   (components) kube-controller-manager 额外的卷挂载 [$RKE2_KUBE_CONTROLLER_MANAGER_EXTRA_MOUNT]
   --kube-proxy-extra-mount value                (components) kube-proxy 额外的卷挂载 [$RKE2_KUBE_PROXY_EXTRA_MOUNT]
   --etcd-extra-mount value                      (components) etcd 额外的卷挂载 [$RKE2_ETCD_EXTRA_MOUNT]
   --cloud-controller-manager-extra-mount value  (components) cloud-controller-manager 额外的卷挂载 [$RKE2_CLOUD_CONTROLLER_MANAGER_EXTRA_MOUNT]
   --kube-apiserver-extra-env value              (components) kube-apiserver 额外的环境变量 [$RKE2_KUBE_APISERVER_EXTRA_ENV]
   --kube-scheduler-extra-env value              (components) kube-scheduler 额外的环境变量 [$RKE2_KUBE_SCHEDULER_EXTRA_ENV]
   --kube-controller-manager-extra-env value     (components) kube-controller-manager 额外的环境变量 [$RKE2_KUBE_CONTROLLER_MANAGER_EXTRA_ENV]
   --kube-proxy-extra-env value                  (components) kube-proxy 额外的环境变量 [$RKE2_KUBE_PROXY_EXTRA_ENV]
   --etcd-extra-env value                        (components) etcd 额外的环境变量 [$RKE2_ETCD_EXTRA_ENV]
   --cloud-controller-manager-extra-env value    (components) cloud-controller-manager额外的环境变量 [$RKE2_CLOUD_CONTROLLER_MANAGER_EXTRA_ENV]
   --help, -h                                    显示帮助
```
