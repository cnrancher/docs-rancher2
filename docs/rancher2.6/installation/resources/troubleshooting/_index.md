---
title: Rancher Server Kubernetes 集群的问题排查
weight: 276
---

本文介绍如何对安装在 Kubernetes 集群上的 Rancher 进行故障排查。

### 相关命名空间

故障排查主要针对以下 3 个命名空间中的对象：

- `cattle-system`：`rancher` deployment 和 Pod。
- `ingress-nginx`：Ingress Controller Pod 和 services。
- `cert-manager`：`cert-manager` Pod。

### "default backend - 404"

很多操作都有可能导致 Ingress Controller 无法将流量转发到你的 Rancher 实例。但是大多数情况下都是由错误的 SSL 配置导致的。

检查事项：

- [Rancher 是否在运行中](#check-if-rancher-is-running)
- [证书的 Common Name（CN）是 "Kubernetes Ingress Controller Fake Certificate"](#cert-cn-is-kubernetes-ingress-controller-fake-certificate)

### 检查 Rancher 是否正在运行

使用 `kubectl` 检查 `cattle-system` 系统命名空间，并查看 Rancher Pod 的状态是否是 **Running**：

```
kubectl -n cattle-system get pods

NAME                           READY     STATUS    RESTARTS   AGE
pod/rancher-784d94f59b-vgqzh   1/1       Running   0          10m
```

如果状态不是 `Running`，在 Pod 上运行 `describe`，并检查 **Events**：

```
kubectl -n cattle-system describe pod

...
Events:
  Type     Reason                 Age   From                Message
  ----     ------                 ----  ----                -------
  Normal   Scheduled              11m   default-scheduler   Successfully assigned rancher-784d94f59b-vgqzh to localhost
  Normal   SuccessfulMountVolume  11m   kubelet, localhost  MountVolume.SetUp succeeded for volume "rancher-token-dj4mt"
  Normal   Pulling                11m   kubelet, localhost  pulling image "rancher/rancher:v2.0.4"
  Normal   Pulled                 11m   kubelet, localhost  Successfully pulled image "rancher/rancher:v2.0.4"
  Normal   Created                11m   kubelet, localhost  Created container
  Normal   Started                11m   kubelet, localhost  Started container
```

### 检查 Rancher 日志

使用 `kubectl` 列出 Pod：

```
kubectl -n cattle-system get pods

NAME                           READY     STATUS    RESTARTS   AGE
pod/rancher-784d94f59b-vgqzh   1/1       Running   0          10m
```

使用 `kubectl` 和 Pod 名称列出该 Pod 的日志：

```
kubectl -n cattle-system logs -f rancher-784d94f59b-vgqzh
```

### 证书的 CN 是 "Kubernetes Ingress Controller Fake Certificate"

使用浏览器检查证书的详细信息。如果显示 CN 是 "Kubernetes Ingress Controller Fake Certificate"，则说明读取或颁发 SSL 证书时出现了问题。

> :::note 注意
> 如果你使用的是 Let's Encrypt 证书，证书颁发的过程可能需要几分钟。
> :::

### 排查 Cert-Manager 颁发的证书（Rancher 或 Let's Encrypt 生成的）问题

`cert-manager` 有 3 部分：

- `cert-manager` 命名空间中的 `cert-manager` Pod。
- `cattle-system` 命名空间中的 `Issuer` 对象。
- `cattle-system` 命名空间中的 `Certificate` 对象。

往后操作，对每个对象运行 `kubectl describe` 并检查事件。这样，你可以追踪可能丢失的内容。

以下是 Issuer 有问题的示例：

```
kubectl -n cattle-system describe certificate
...
Events:
  Type     Reason          Age                 From          Message
  ----     ------          ----                ----          -------
  Warning  IssuerNotReady  18s (x23 over 19m)  cert-manager  Issuer rancher not ready
```

```
kubectl -n cattle-system describe issuer
...
Events:
  Type     Reason         Age                 From          Message
  ----     ------         ----                ----          -------
  Warning  ErrInitIssuer  19m (x12 over 19m)  cert-manager  Error initializing issuer: secret "tls-rancher" not found
  Warning  ErrGetKeyPair  9m (x16 over 19m)   cert-manager  Error getting keypair for CA issuer: secret "tls-rancher" not found
```

### 排查你自己提供的 SSL 证书问题

你的证书直接应用于 `cattle-system` 命名空间中的 Ingress 对象。

检查 Ingress 对象的状态，并查看它是否准备就绪：

```
kubectl -n cattle-system describe ingress
```

如果 Ingress 对象已就绪，但是 SSL 仍然无法正常工作，你的证书或密文的格式可能不正确。

这种情况下，请检查 nginx-ingress-controller 的日志。nginx-ingress-controller 的 Pod 中有多个容器，因此你需要指定容器的名称：

```
kubectl -n ingress-nginx logs -f nginx-ingress-controller-rfjrq nginx-ingress-controller
...
W0705 23:04:58.240571       7 backend_ssl.go:49] error obtaining PEM from secret cattle-system/tls-rancher-ingress: error retrieving secret cattle-system/tls-rancher-ingress: secret cattle-system/tls-rancher-ingress was not found
```

### 没有匹配的 "Issuer"

你所选的 SSL 配置要求在安装 Rancher 之前先安装 Cert-Manager，否则会出现以下错误:

```
Error: validation failed: unable to recognize "": no matches for kind "Issuer" in version "certmanager.k8s.io/v1alpha1"
```

在这种情况下，先安装 Cert-Manager，然后再重新安装 Rancher。


### Canal Pod 显示 READY 2/3

此问题的最常见原因是端口 8472/UDP 在节点之间未打开。因此，你可以检查你的本地防火墙、网络路由或安全组。

解决网络问题后，`canal` Pod 会超时并重启以建立连接。

### nginx-ingress-controller Pod 显示 RESTARTS

此问题的最常见原因是 `canal` pod 未能建立覆盖网络。参见 [canal Pod 显示 READY `2/3`](#canal-pods-show-ready-2-3) 进行排查。


### Failed to dial to /var/run/docker.sock: ssh: rejected: administratively prohibited (open failed)

此错误的原因可能是：

* 指定连接的用户无权访问 Docker Socket。如果是这个原因，你通过登录主机并运行 `docker ps` 命令来检查：

```
$ ssh user@server
user@server$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
```

如果需要了解如何进行正确设置，请参见[以非 root 用户身份管理 Docker](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)。

* 你使用的操作系统是 RedHat 或 CentOS：由于 [Bugzilla #1527565](https://bugzilla.redhat.com/show_bug.cgi?id=1527565)，你不能使用 `root` 用户连接到节点。因此，你需要添加一个单独的用户并配置其访问 Docker Socket。如果需要了解如何进行正确设置，请参见[以非 root 用户身份管理 Docker](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)。

* SSH 服务器版本不是 6.7 或更高版本：高版本是 Socket 转发所必须的，用于通过 SSH 连接到 Docker Socket。你可以在你要连接的主机上使用 `sshd -V` 或使用 netcat 进行检查：
```
$ nc xxx.xxx.xxx.xxx 22
SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.10
```

### Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: Error configuring SSH: ssh: no key found

`ssh_key_path` 密钥文件无法访问：请确保你已经指定了私钥文件（不是公钥 `.pub`），而且运行 `rke` 命令的用户可以访问该私钥文件。

### Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: ssh: handshake failed: ssh: unable to authenticate, attempted methods [none publickey], no supported methods remain

`ssh_key_path` 密钥文件不是访问节点的正确文件：请仔细检查，确保你已为节点指定了正确的 `ssh_key_path` 和连接用户。

### Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: Error configuring SSH: ssh: cannot decode encrypted private keys

如需使用加密的私钥，请使用 `ssh-agent` 来使用密码来加载密钥。如果在运行 `rke` 命令的环境中找到 `SSH_AUTH_SOCK` 环境变量，它将自动用于连接到节点。

### Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

节点无法通过配置的 `address` 和 `port` 访问。
