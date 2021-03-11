---
title: DNS
description: 此页面上列出的命令/步骤可用于检查集群中的名称解析问题。
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
  - 常见故障排查
  - DNS
---

此页面上列出的命令/步骤可用于检查集群中的名称解析问题。

确保您配置了正确的 kubeconfig（例如，使用 Rancher 高可用时，`export KUBECONFIG=$PWD/kube_config_rancher-cluster.yml` ) 或者通过 Rancher UI 使用内嵌 kubectl。

在运行 DNS 检查之前，请检查您集群中的[默认 DNS 插件](/docs/rancher2.5/cluster-provisioning/rke-clusters/options/_index)，并确保[网络运行正常](/docs/rancher2.5/troubleshooting/networking/_index)，因为这也可能是 DNS 解析失败的原因之一。

## 检查 DNS Pod 是否正在运行

```
kubectl -n kube-system get pods -l k8s-app=kube-dns
```

使用 CoreDNS 时的输出示例：

```
NAME                       READY   STATUS    RESTARTS   AGE
coredns-799dffd9c4-6jhlz   1/1     Running   0          76m
```

使用 Kube-dns 时的输出示例：

```
NAME                        READY   STATUS    RESTARTS   AGE
kube-dns-5fd74c7488-h6f7n   3/3     Running   0          4m13s
```

## 检查 DNS 服务是否存在正确的 cluster-ip

```
kubectl -n kube-system get svc -l k8s-app=kube-dns
```

```
NAME               TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
service/kube-dns   ClusterIP   10.43.0.10   <none>        53/UDP,53/TCP   4m13s
```

## 检查是否能解析域名

检查内部集群名称是否正在解析（在此示例中为 `kubernetes.default`），在 `server:`后面显示的 IP 应该与来自`kube-dns`服务的`CLUSTER-IP`相同。

```
kubectl run -it --rm --restart=Never busybox --image=busybox:1.28 -- nslookup kubernetes.default
```

输出示例:

```
Server:    10.43.0.10
Address 1: 10.43.0.10 kube-dns.kube-system.svc.cluster.local

Name:      kubernetes.default
Address 1: 10.43.0.1 kubernetes.default.svc.cluster.local
pod "busybox" deleted
```

检查外部名称是否解析（在此示例中为`www.google.com`）

```
kubectl run -it --rm --restart=Never busybox --image=busybox:1.28 -- nslookup www.google.com
```

输出示例：

```
Server:    10.43.0.10
Address 1: 10.43.0.10 kube-dns.kube-system.svc.cluster.local

Name:      www.google.com
Address 1: 2a00:1450:4009:80b::2004 lhr35s04-in-x04.1e100.net
Address 2: 216.58.211.100 ams15s32-in-f4.1e100.net
pod "busybox" deleted
```

如果要检查所有主机上的域名解析，请执行以下步骤：

1. 将以下文件另存为 `ds-dnstest.yml`

   ```
   apiVersion: apps/v1
   kind: DaemonSet
   metadata:
     name: dnstest
   spec:
     selector:
         matchLabels:
           name: dnstest
     template:
       metadata:
         labels:
           name: dnstest
       spec:
         tolerations:
         - operator: Exists
         containers:
         - image: busybox:1.28
           imagePullPolicy: Always
           name: alpine
           command: ["sh", "-c", "tail -f /dev/null"]
           terminationMessagePath: /dev/termination-log
   ```

2. 使用 kubectl 创建 `kubectl create -f ds-dnstest.yml`
3. 等待启动，直到 `kubectl rollout status ds/dnstest -w` 返回: `daemon set "dnstest" successfully rolled out`.
4. 将环境变量 DOMAIN 配置为主机应能够解析的标准域名（FQDN）（以 www.google.com 为例），并运行以下命令，让每个主机上的每个容器配置需要解析的的域名（这是一个单行命令）。

   ```
   export DOMAIN=www.google.com; echo "=> Start DNS resolve test"; kubectl get pods -l name=dnstest --no-headers -o custom-columns=NAME:.metadata.name,HOSTIP:.status.hostIP | while read pod host; do kubectl exec $pod -- /bin/sh -c "nslookup $DOMAIN > /dev/null 2>&1"; RC=$?; if [ $RC -ne 0 ]; then echo $host cannot resolve $DOMAIN; fi; done; echo "=> End DNS resolve test"
   ```

5. 该命令运行完毕后，指示运行正常的输出为：

   ```
   => Start DNS resolve test
   => End DNS resolve test
   ```

如果您在输出中看到错误，则表明所提到的主机无法解析给定的 FQDN。

IP 209.97.182.150 主机的 UDP 端口被阻止的情况的示例错误输出。

```
=> Start DNS resolve test
command terminated with exit code 1
209.97.182.150 cannot resolve www.google.com
=> End DNS resolve test
```

清理删除 alpine DaemonSet `kubectl delete ds/dnstest`.

## CoreDNS 的特别检查

### 检查 CoreDNS 日志记录

```
kubectl -n kube-system logs -l k8s-app=kube-dns
```

### 检查配置

CoreDNS 配置存储在`kube-system`命名空间中名称是`coredns`的 configmap 中；

```
kubectl -n kube-system get configmap coredns -o go-template={{.data.Corefile}}
```

### 检查 resolv.conf 中的 nameserver 配置

默认情况下，主机上的 nameserver 配置（在/etc/resolv.conf 中）将用作 CoreDNS 的 nameserver 配置。您可以在主机上检查该文件，或者将 dnsPolicy 设置为 Default 来运行以下 Pod，这将从其运行的主机继承/etc/resolv.conf。

```
kubectl run -i --restart=Never --rm test-${RANDOM} --image=ubuntu --overrides='{"kind":"Pod", "apiVersion":"v1", "spec": {"dnsPolicy":"Default"}}' -- sh -c 'cat /etc/resolv.conf'
```

### 启用查询日志记录

可以通过在 configmap`coredns`的 Corefile 配置中启用[日志插件](https://coredns.io/plugins/log/)来启用查询日志记录。您可以使用`kubectl -n kube-system edit configmap coredns`或使用以下命令替换现有配置：

```
kubectl get configmap -n kube-system coredns -o json |  kubectl get configmap -n kube-system coredns -o json | sed -e 's_loadbalance_log\\n    loadbalance_g' | kubectl apply -f -
```

现在可以查询所有记录，并可以使用命令进行检查。

## kube-dns 的特别检查

### 检查 kubedns 容器中的 nameservers 配置

默认情况下，主机上在/etc/resolv.conf 中配置的 nameserver 将用作 kube-dns 的 servername。有时主机会运行本地缓存 DNS 名称服务器，这意味着`/etc/resolv.conf`中的地址将指向容器无法访问的环回范围（`127.0.0.0/8`）中的地址。对于 Ubuntu 18.04，这是通过`systemd-resolved`完成的。从 Rancher v2.0.7 开始，我们将检测`systemd-resolved`是否正在运行，并将自动将`/etc/resolv.conf`文件用于正确的 nameserver（位于`/run/systemd/resolve/resolv.conf`）。

使用以下命令来检查 kubedns 容器使用的 nameserver：

```
kubectl -n kube-system get pods -l k8s-app=kube-dns --no-headers -o custom-columns=NAME:.metadata.name,HOSTIP:.status.hostIP | while read pod host; do echo "Pod ${pod} on host ${host}"; kubectl -n kube-system exec $pod -c kubedns cat /etc/resolv.conf; done
```

输出示例：

```
Pod kube-dns-667c7cb9dd-z4dsf on host x.x.x.x
nameserver 1.1.1.1
nameserver 8.8.4.4
```

如果输出显示的是环回范围的地址（`127.0.0.0/8`），则可以通过两种方式更正此地址：

- 确保集群中节点上的`/etc/resolv.conf`中列出了正确的名称服务器，请参阅操作系统文档以了解如何执行此操作。确保在配置集群之前执行此操作，或者在进行修改后重新启动节点。
- 如下所示，通过添加`extra_args`，将`kubelet`配置为使用其他文件来解析名称（其中`/run /resolvconf/resolv.conf`是具有正确 nameserver 配置的文件):

```
services:
  kubelet:
    extra_args:
      resolv-conf: "/run/resolvconf/resolv.conf"
```

> **注意：** 由于 kubelet 在容器中运行，因此/etc 和/usr 中的文件的路径位于 kubelet 容器中的/host/etc 和/host/usr 中。

查看[集群 YAML](/docs/rancher2.5/cluster-admin/editing-clusters/_index)可以看到如何更改这个配置。集群的配置完成后，您必须删除 kube-dns pod 才能使用 pod 中的新设置：

```
kubectl delete pods -n kube-system -l k8s-app=kube-dns
pod "kube-dns-5fd74c7488-6pwsf" deleted
```

尝试再次解析 domain，[检查是否能解析域名](#检查是否能解析域名).

如果要检查集群中的 kube-dns 配置（例如，检查是否配置了其他 nameserver），则可以运行以下命令列出 kube-dns 配置：

```
kubectl -n kube-system get configmap kube-dns -o go-template='{{range $key, $value := .data}}{{ $key }}{{":"}}{{ $value }}{{"\n"}}{{end}}'
```

示例输出：

```
upstreamNameservers:["1.1.1.1"]
```
