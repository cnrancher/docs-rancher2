---
title: DNS
weight: 103
---

本文列出的命令/步骤可用于检查集群中的名称解析问题。

请确保你配置了正确的 kubeconfig（例如，为 Rancher HA 配置了 `export KUBECONFIG=$PWD/kube_config_cluster.yml`）或通过 UI 使用了嵌入式 kubectl。

在运行 DNS 检查之前，请检查集群的[默认 DNS 提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options/#default-dns-provider)，并确保[覆盖网络正常运行]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/networking/#check-if-overlay-network-is-functioning-correctly)，因为这也可能导致 DNS 解析（部分）失败。

### 检查 DNS pod 是否正在运行

```
kubectl -n kube-system get pods -l k8s-app=kube-dns
```

使用 CoreDNS 时的示例输出：
```
NAME                       READY   STATUS    RESTARTS   AGE
coredns-799dffd9c4-6jhlz   1/1     Running   0          76m
```

使用 kube-dns 时的示例输出：
```
NAME                        READY   STATUS    RESTARTS   AGE
kube-dns-5fd74c7488-h6f7n   3/3     Running   0          4m13s
```

### 检查 DNS 服务是否显示正确的 cluster-ip

```
kubectl -n kube-system get svc -l k8s-app=kube-dns
```

```
NAME               TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
service/kube-dns   ClusterIP   10.43.0.10   <none>        53/UDP,53/TCP   4m13s
```

### 检查是否正在解析域名

检查是否正在解析内部集群名称（在本例中为 `kubernetes.default`），`Server:` 后面显示的 IP 应与 `kube-dns` 服务的 `CLUSTER-IP` 一致。

```
kubectl run -it --rm --restart=Never busybox --image=busybox:1.28 -- nslookup kubernetes.default
```

输出示例：
```
Server:    10.43.0.10
Address 1: 10.43.0.10 kube-dns.kube-system.svc.cluster.local

Name:      kubernetes.default
Address 1: 10.43.0.1 kubernetes.default.svc.cluster.local
pod "busybox" deleted
```

检查是否正在解析外部名称（在本例中为 `www.google.com`）：

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

如果要检查所有主机的域名解析，请执行以下步骤：

1. 将以下文件另存为 `ds-dnstest.yml`：

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

2. 通过运行 `kubectl create -f ds-dnstest.yml` 启动它。
3. 等待 `kubectl rollout status ds/dnstest -w` 返回 `daemon set "dnstest" successfully rolled out`。
4. 将环境变量 `DOMAIN` 配置为主机能够解析的完全限定域名（Fully Qualified Domain Name，FQDN），例如 `www.google.com`，并运行以下命令让每个主机上的各个容器解析配置的域名（它是单行命令）：

   ```
   export DOMAIN=www.google.com; echo "=> Start DNS resolve test"; kubectl get pods -l name=dnstest --no-headers -o custom-columns=NAME:.metadata.name,HOSTIP:.status.hostIP | while read pod host; do kubectl exec $pod -- /bin/sh -c "nslookup $DOMAIN > /dev/null 2>&1"; RC=$?; if [ $RC -ne 0 ]; then echo $host cannot resolve $DOMAIN; fi; done; echo "=> End DNS resolve test"
   ```

5. 完成此命令后，如果一切正确，则输出如下：

   ```
   => Start DNS resolve test
   => End DNS resolve test
   ```

如果你在输出中看到错误，则表示主机无法解析给定的 FQDN。

在以下错误输出示例中，IP 为 209.97.182.150 的主机阻止了 UDP 端口：

```
=> Start DNS resolve test
command terminated with exit code 1
209.97.182.150 cannot resolve www.google.com
=> End DNS resolve test
```

运行 `kubectl delete ds/dnstest` 清理 alpine DaemonSet。

### CoreDNS 相关

#### 检查 CoreDNS 日志记录

```
kubectl -n kube-system logs -l k8s-app=kube-dns
```

#### 检查配置

CoreDNS 配置存储在 `kube-system` 命名空间中 configmap 的 `coredns` 中。

```
kubectl -n kube-system get configmap coredns -o go-template={{.data.Corefile}}
```

#### 检查 resolv.conf 中的上游名称服务器

默认情况下，配置在主机（在 `/etc/resolv.conf` 里）上的名称服务器会用作 CoreDNS 的上游名称服务器。你可以在主机上检查此文件，或将 `dnsPolicy` 设置为 `Default`（将继承其主机的 `/etc/resolv.conf`）并运行以下 Pod：

```
kubectl run -i --restart=Never --rm test-${RANDOM} --image=ubuntu --overrides='{"kind":"Pod", "apiVersion":"v1", "spec": {"dnsPolicy":"Default"}}' -- sh -c 'cat /etc/resolv.conf'
```

#### 启用日志查询

你可以通过在 configmap `coredns` 的 Corefile 配置中启用 [log plugin](https://coredns.io/plugins/log/) 来启用日志查询。为此，你可以使用 `kubectl -n kube-system edit configmap coredns`，或运行以下命令来替换配置：

```
kubectl get configmap -n kube-system coredns -o json | sed -e 's_loadbalance_log\\n    loadbalance_g' | kubectl apply -f -
```

这样，所有查询都会记入日志，并且可以使用[检查 CoreDNS 日志记录](#check-coredns-logging)中的命令进行检查。

### kube-dns 相关

#### 检查 kubedns 容器中的上游名称服务器

默认情况下，配置在主机（在 `/etc/resolv.conf` 里）上的名称服务器会用作 kube-dns 的上游名称服务器。有时，主机会运行本地缓存 DNS 名称服务器，这意味着 `/etc/resolv.conf` 中的地址将指向 Loopback 范围（`127.0.0.0/8`）内的地址，而容器将无法访问该范围。对于 Ubuntu 18.04，这是由 `systemd-resolved` 进行的。我们会检测 `systemd-resolved` 是否正在运行，并自动使用具有正确上游名称服务器的 `/etc/resolv.conf` 文件（位于 `/run /systemd/resolve/resolv.conf`）。

使用以下命令检查 kubedns 容器使用的上游名称服务器：

```
kubectl -n kube-system get pods -l k8s-app=kube-dns --no-headers -o custom-columns=NAME:.metadata.name,HOSTIP:.status.hostIP | while read pod host; do echo "Pod ${pod} on host ${host}"; kubectl -n kube-system exec $pod -c kubedns cat /etc/resolv.conf; done
```

输出示例：
```
Pod kube-dns-667c7cb9dd-z4dsf on host x.x.x.x
nameserver 1.1.1.1
nameserver 8.8.4.4
```

如果输出显示 Loopback 范围（`127.0.0.0/8`）内的地址 ，你可以通过以下两种方式解决此问题：

* 确保在集群节点上的 `/etc/resolv.conf` 列出了正确的名称服务器。如果需要了解如何进行操作，请参阅你的操作系统文档。请确保你在配置集群之前执行此操作，或在修改后重启节点。
* 通过配置 `kubelet` 来使用不同的文件进行名称解析，你可以使用如下的 `extra_args`（其中 `/run/resolvconf/resolv.conf` 是具有正确名称服务器的文件）：

```
services:
  kubelet:
    extra_args:
      resolv-conf: "/run/resolvconf/resolv.conf"
```

> **注意**：由于 `kubelet` 在容器内运行，因此 `/etc` 和 `/usr` 中文件的路径位于 `kubelet` 容器内的 `/host/etc` 和 `/host/usr` 中。

请参阅[使用 YAML 编辑集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/#editing-clusters-with-yaml)了解如何应用此修改。集群配置完成后，你必须删除 kube-dns pod 以激活 pod 中的新设置：

```
kubectl delete pods -n kube-system -l k8s-app=kube-dns
pod "kube-dns-5fd74c7488-6pwsf" deleted
```

你可以[检查是否正在解析域名](#check-if-domain-names-are-resolving)来尝试再次解析名称。

如果要检查集群中的 kube-dns 配置（例如，检查是否配置了不同的上游名称服务器），你可以运行以下命令来列出 kube-dns 配置：

```
kubectl -n kube-system get configmap kube-dns -o go-template='{{range $key, $value := .data}}{{ $key }}{{":"}}{{ $value }}{{"\n"}}{{end}}'
```

输出示例：
```
upstreamNameservers:["1.1.1.1"]
```
