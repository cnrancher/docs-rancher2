---
title: Rancher Server 所在 Kubernetes 集群的问题排查
---

本节介绍如何对 Kubernetes 集群上的 Rancher 安装进行故障排查。

## 相关命名空间

大多数故障排查都将在这 3 个命名空间中的对象上完成。

- `cattle-system` - `rancher` 部署和 Pod。
- `ingress-nginx` - Ingress Controller Pod 和 SVC。
- `kube-system` - `tiller` 和 `cert-manager` Pod。

## default backend - 404

导致 Ingress Controller 无法将流量转发到您的 rancher 实例的原因有很多种，但是在大多数情况下，触发这条报错信息的原因是 SSL 配置错误。

请检查以下事项，定位问题：

- [Rancher 是否在运行](#检查-rancher-是否正在运行)
- [证书的 CN 是不是为 "Kubernetes Ingress Controller Fake Certificate"](#证书-cn-是-kubernetes-ingress-controller-fake-certificate)

## 检查 Rancher 是否正在运行

使用`kubectl`来检查`cattle-system`系统命名空间，并查看 Rancher 容器是否处于 Running 状态。

```
kubectl -n cattle-system get pods

NAME                           READY     STATUS    RESTARTS   AGE
pod/rancher-784d94f59b-vgqzh   1/1       Running   0          10m
```

如果状态不是`Running` ，请使用`describe`命令检查 Pod 事件。

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

## 检查 Rancher 日志

使用`kubectl`找到 Pod。

```
kubectl -n cattle-system get pods

NAME                           READY     STATUS    RESTARTS   AGE
pod/rancher-784d94f59b-vgqzh   1/1       Running   0          10m
```

使用`kubectl`和 Pod 名称来查看 Pod 中的日志。

```
kubectl -n cattle-system logs -f rancher-784d94f59b-vgqzh
```

## 证书 CN 是 “Kubernetes Ingress Controller Fake Certificate”

使用浏览器检查证书对的详细信息。如果通用名是“Kubernetes Ingress Controller Fake Certificate”，则说明读取或颁发 SSL 证书时可能出现了问题。

> **注意：** 如果您使用的是 LetsEncrypt 颁发的证书，则有时可能需要花些时间来发布证书。

## 检查 cert-manager 颁发的证书是否存在问题（适用于使用 Rancher 自生成证书或 LetsEncrypt 证书）

`cert-manager`有三个部分。

- `cert-manager` 在`kube-system` 命名空间中的 Pod。
- 在`cattle-system`命名空间中的 `Issuer` 对象。
- 在`cattle-system`命名空间中的 `Certificate` 对象。

对每个对象执行`kubectl describe`并检查事件，来检查可能缺少的内容。

首先，检查在`cattle-system`命名空间中的 `Certificate` 对象，如以下代码示例所示，在命令行输入`kubectl -n cattle-system describe certificate`，会返回`Certificate`的信息，如事件种类、原因、时间戳、发生事件的根因部件等信息。示例中返回的信息是：根因部件`cert-manager`在 18 秒前发生了一个 warning 事件，发生的原因是 IssuerNotReady，发送了一条“Issuer rancher not ready”信息。

```
kubectl -n cattle-system describe certificate
...
Events:
  Type     Reason          Age                 From          Message
  ----     ------          ----                ----          -------
  Warning  IssuerNotReady  18s (x23 over 19m)  cert-manager  Issuer rancher not ready
```

既然我们知道了发生 warning 的原因是 IssuerNotReady，那么我们需要检查`cattle-system`命名空间中的 `Issuer` 对象，找到触发 IssuerNotReady 警告的原因。如以下代码示例所示，在命令行输入`kubectl -n cattle-system describe issuer`,会返回`Issuer`的信息。例中返回的信息是：根因部件`cert-manager`发生了两个 wanring 事件：

- 19 分钟前发生了一个 warning 事件，而且在事件发生至今的 19 分钟内重复触发了 12 次，发生的原因是 ErrInitIssuer，发送了一条“Error initializing issuer: secret "tls-rancher" not found”信息。触发该事件的原因在信息里面已经描述得非常清楚了，因为找不到"tls-rancher"的密文，所以触发警告信息。
- 9 分钟发生了另一个 wanring 事件，而且在事件发生至今的 19 分钟内重复触发了 16 次，发生的原因是 ErrGetKeyPair，发送了一条“Error getting keypair for CA issuer: secret "tls-rancher" not found”信息。同理，触发这个事件的信息也在信息里面，和上面的原因相同，也是因为找不到"tls-rancher"的密文，才触发了警告信息。

```
kubectl -n cattle-system describe issuer
...
Events:
  Type     Reason         Age                 From          Message
  ----     ------         ----                ----          -------
  Warning  ErrInitIssuer  19m (x12 over 19m)  cert-manager  Error initializing issuer: secret "tls-rancher" not found
  Warning  ErrGetKeyPair  9m (x16 over 19m)   cert-manager  Error getting keypair for CA issuer: secret "tls-rancher" not found
```

综上所述，触发上述连锁报错的最终原因是缺少"tls-rancher"的密文，可能是密文格式有问题，导致 Rancher 无法读取密文；也可能是密文是错的，无法校验。总之，您需要找到密文出错的地方并加以修复，然后上述所有问题就迎刃而解了。

## 检查您自己的 SSL 证书是否存在问题

您的证书将直接应用于`cattle-system`命名空间中的 Ingress 对象。

检查 Ingress 对象的状态，并查看其是否准备就绪。

```
kubectl -n cattle-system describe ingress
```

如果其就绪但 SSL 仍无法正常工作，则您的证书或密文的格式可能有问题。

检查 nginx-ingress-controller 日志。由于 nginx-ingress-controller 的 Pod 中有多个容器，因此您需要指定容器的名称。

```
kubectl -n ingress-nginx logs -f nginx-ingress-controller-rfjrq nginx-ingress-controller
...
W0705 23:04:58.240571       7 backend_ssl.go:49] error obtaining PEM from secret cattle-system/tls-rancher-ingress: error retrieving secret cattle-system/tls-rancher-ingress: secret cattle-system/tls-rancher-ingress was not found
```

## 没有匹配的 “Issuer”

如果您选择的 [SSL 配置](/docs/rancher2/installation/k8s-install/helm-rancher/_index)选项需要 cert-manager，则您需要在安装 Rancher 之前安装 [cert-manager](/docs/rancher2/installation/k8s-install/helm-rancher/_index)，否则将显示以下错误：

```
Error: validation failed: unable to recognize "": no matches for kind "Issuer" in version "certmanager.k8s.io/v1alpha1"
```

请先安装 [cert-manager](/docs/rancher2/installation/k8s-install/helm-rancher/_index)， 然后再次尝试安装 Rancher。

## Canal Pod 显示 READY 2/3

此问题的最常见原因是节点之间的 8472 / UDP 端口没有打开。检查您的本地防火墙，网络路由或安全组。

解决网络问题后，待`canal` Pod 超时后，`canal`会自动重启并建立连接。

## nginx-ingress-controller Pod 显示 RESTARTS

此问题的最常见原因是`canal` Pod 未能建立 overlay 网络。有关疑难解答，请参见 [canal Pods show READY 2/3 ](#canal-pod-显示-ready-23)。

## Failed to dial to /var/run/docker.sock: ssh: rejected: administratively prohibited (open failed)

产生此错误的某些原因包括：

- 指定连接的用户无权访问 Docker 套接字。这可以通过登录主机并运行命令 `docker ps` 来检查：

  ```
  $ ssh user@server
  user@server$ docker ps
  CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
  ```

  请参阅[以非 root 用户身份管理 Docker](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)，了解如何正确地进行设置。

- 当使用 RedHat / CentOS 作为操作系统时，由于 [Bugzilla #1527565](https://bugzilla.redhat.com/show_bug.cgi?id=1527565)，您不能使用`root`用户连接到节点。您将需要添加一个单独的用户并将其配置为访问 Docker 套接字的用户。请参阅[以非 root 用户身份管理 Docker](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)，了解如何正确地进行设置。

- SSH 服务器版本不是 6.7 或更高版本。这是套接字转发功能所必需的版本要求，套接字转发用于通过 SSH 连接到 Docker 套接字。可以使用要连接的主机上的`sshd -V`或使用 netcat 来进行检查：

  ```
  $ nc xxx.xxx.xxx.xxx 22
  SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.10
  ```

## Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: Error configuring SSH: ssh: no key found

在`ssh_key_path`中指定的密钥文件无法访问。确保指定了私钥文件（不是公共密钥`.pub`），并且运行`rke`命令的用户可以访问这个密钥文件。

## Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: ssh: handshake failed: ssh: unable to authenticate, attempted methods [none publickey], no supported methods remain

在`ssh_key_path`中指定的密钥文件对于访问该节点无效。仔细检查是否为节点指定了正确的`ssh_key_path`，以及是否指定了与之连接的正确用户。

## Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: Error configuring SSH: ssh: cannot decode encrypted private keys

如果要使用加密的密钥，则应使用`ssh-agent`来用密码加载密钥。如果在运行 `rke` 命令的环境中有 `SSH_AUTH_SOCK` 环境变量，在连接节点时将自动使用它。

## Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

无法通过配置的`address`和`port`访问该节点。
