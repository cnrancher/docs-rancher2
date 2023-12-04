---
title: Kubernetes常见问题
---

## 1、部署 Kubernetes 时候出现以下有关 cgroup 的问题

```bash
Failed to get system container stats for "/system.slice/kubelet.service":
failed to get cgroup stats for "/system.slice/kubelet.service": failed to
get container info for "/system.slice/kubelet.service": unknown container
"/system.slice/kubelet.service"
```

```bash
Expected state running but got error: Error response from daemon:
oci runtime error: container_linux.go:247: starting container
process caused "process_linux.go:258: applying cgroup configuration
for process caused \"mountpoint for devices not found\""
```

以上问题为 Kubernetes 版本与 docker 版本不兼容导致 cgroup 功能失效

## 2、Kubernetes err: [nodes \"iZ2ze3tphuqvc7o5nj38t8Z\" not found]"

Rancher-Kubernetes 中，节点之间通信需要通过 hostname，如果没有内部 DNS 服务器，那么需要为每台节点配置 hosts 文件。

配置示例:假如某个节点主机名为 node1,ip 地址为 192.168.1.100

```bash
cat /etc/hosts<<EOF
127.0.0.1 localhost
192.168.1.100 node1
EOF
```

## 3、如何验证您的主机注册地址设置是否正确？

如果您正面临 Rancher Agent 和 Rancher Server 的连接问题，请检查主机设置。当您第一次尝试在 UI 中添加主机时，您需要设置主机注册的 URL，该 URL 用于建立从主机到 Rancher Server 的连接。这个 URL 必须可以从您的主机访问到。为了验证它，您需要登录到主机并执行 curl 命令:

```bash
curl -i <Host Registration URL you set in UI>/v1
```

您应该得到一个 json 响应。 如果开启了认证，响应代码应为 401。如果认证未打开，则响应代码应为 200。

**注意:** 普通的 HTTP 请求和 websocket 连接(ws://)都将被使用。 如果此 URL 指向代理或负载均衡器，请确保它们可以支持 Websocket 连接。

## Kuberbetes UI 显示 Service unavailable

很多同学正常部署 Kuberbetes 环境后无法进入 Dashboard，基础设施应用栈均无报错。但通过查看 基础架构|容器 发现并没有 Dashboard 相关的容器.因为 Kuberbetes 在拉起相关服务(如 Dashboard、内置 DNS 等服务)是通过应用商店里面的 YML 文件来定义的，YML 文件中定义了相关的镜像名和版本。

而 Rancher 部署的 Kuberbetes 应用栈属于 Kuberbetes 的基础框架，相关的镜像通过 dockerhub/rancher 仓库拉取。默认 Rancher-catalog Kuberbetes YML 中服务镜像都是从谷歌仓库拉取，在没有科学上网的情况下，国内环境几乎无法成功拉取镜像。

为了解决这一问题，优化中国区用户的使用体验，在 RANCHER v1.6.11 之前的版本，我们修改了 `http://git.oschina.net/rancher/rancher-catalog` 仓库中的 YML 文件，将相关的镜像也同步到国内仓库，通过替换默认商店地址来实现加速部署；在 RANCHER v1.6.11 及之后的版本，不用替换商店 catalog 地址，直接通过在模板中定义仓库地址和命名空间就行实现加速；在后期的版本种，Kuberbetes 需要的镜像都会同步到 docker hub 中。
