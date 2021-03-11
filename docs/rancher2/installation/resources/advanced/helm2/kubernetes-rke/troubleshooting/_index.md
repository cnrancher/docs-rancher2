---
title: 问题排查
description: 可以使用 Kubernetes 的 helm 包管理工具来管理 Rancher 的安装。使用 `helm` 来可以一键安装 Rancher 及其依赖组件。
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
  - 安装指南
  - 资料、参考和高级选项
  - Rancher高可用Helm2安装
  - 安装 Kubernetes
  - 问题排查
---

## Canal Pods 显示 READY 2/3

此问题的最常见原因是节点之间的 8472/UDP 端口没有打开。检查您的本地防火墙，网络路由和安全组。解决网络问题后，`canal` pods 应超时并重新启动以建立其连接。

## nginx-ingress-controller Pods 显示 RESTARTS

造成此问题的最常见原因是 `canal` pods 未能建立 overlay 网络。解决方法同上。

## 无法创建 SSH 通道到节点，不能获取 Docker 信息

碰到这个问题时，命令行工具会返回以下报错信息：

```
Failed to set up SSH tunneling for host [xxx.xxx.xxx.xxx]: Can't retrieve Docker Info
```

触发这条报错信息的错误有以下几种，您可以按照实际情况排查。

### Failed to dial to /var/run/docker.sock: ssh: rejected: administratively prohibited (open failed)

- 指定连接的用户没有访问 Docker 套接字的权限。可以通过主机日志或者运行命令 `docker ps` 来检查:

  ```
  $ ssh user@server
  user@server$ docker ps
  CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
  ```

  在这种情况下，您可以切换为 root 用户处理，或使用非 root 用户管理 Docker，详情请参考 [使用非 root 用户管理 Docker](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)。

- 当使用 RedHat/CentOS 作为操作系统时，由于[Bugzilla＃1527565](https://bugzilla.redhat.com/show_bug.cgi?id=1527565)，您不能使用`root`用户来连接节点。您将需要为访问 Docker 套接字单独配置一个用户。参阅 [使用非 root 用户管理 Docker](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)。

- SSH 服务器版本过低。套接字转发正常工作的前提条件是 SSH 服务器的版本不低于 **6.7**，您可以在命令行中输入`sshd -V`，查询主机上 SSH 服务器的版本，返回结果的样例如下：

  ```
  $ nc xxx.xxx.xxx.xxx 22
  SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.10
  ```

  `SSH-2.0-OpenSSH_6.6.1p1`表示当前的 SSH 服务器版本是 6.6.1p10，低于 6.7。

### Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: Error configuring SSH: ssh: no key found

- 指定为 `ssh_key_path` 的密钥文件无法被访问。确保指定了私钥文件（而不是公共密钥`.pub`），并且正在运行`rke`命令的用户可以访问私钥文件。

### Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: ssh: handshake failed: ssh: unable to authenticate, attempted methods [none publickey], no supported methods remain

- 对于正在访问的节点，指定为 `ssh_key_path` 的密钥文件不正确。请检查是否为节点指定了正确的`ssh_key_path`，以及是否指定了与之连接的正确用户。

### Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: Error configuring SSH: ssh: cannot decode encrypted private keys

- 如果要使用加密的私钥，则应使用`ssh-agent`来用密码加载密钥。如果在运行`rke`命令的环境中找到`SSH_AUTH_SOCK`环境变量，它将自动用于连接到节点。

### Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

- 在已配置的`address`和`port`上无法访问该节点，有可能是因为这个节点因为某些原因停止了运行，导致无法方位该节点，请重启该节点，然后再重新访问。
