---
title: SSH 连接报错
---

### Failed to set up SSH tunneling for host [xxx.xxx.xxx.xxx]: Can't retrieve Docker Info

#### Failed to dial to /var/run/docker.sock: ssh: rejected: administratively prohibited (open failed)

- 没有访问 Docker socket 的权限，请登录主机，运行`docker ps`检查权限：

```
$ ssh -i ssh_privatekey_file user@server
user@server$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
```

请参考[如何以非 root 用户角色管理 Docker](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)，正确配置您的权限。

- 如果您使用的操作系统是 RedHat 或 CentOS，您不能使用 root 用户连接节点，因为这两种系统有这个 bug[Bugzilla #1527565](https://bugzilla.redhat.com/show_bug.cgi?id=1527565)。您需要添加一个用户，然后为它配置访问 Docker socket 的权限。详情请参考[RKE OS Requirements](/docs/rke/os/_index)。

* SSH server 的版本低于 v6.7。通过 SSH 连接 Docker socket 需要用到 v6.7 或以上的 SSH server。您可以运行`sshd -V`命令检查当前主机使用的 SSH server 版本，或使用 netcat 命令检查 SSH server 版本，如下方示例代码所示，请将“xxx.xxx.xxx.xxx”替换为主机 IP 地址：

```
$ nc xxx.xxx.xxx.xxx 22
SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.10
```

#### Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: Error configuring SSH: ssh: no key found

- 无法访问密钥文件`ssh_key_path`。请检查您是否已经指定了密钥文件，检查执行 `rke` 命令的用户是否有权限访问这个密钥文件。

* 密钥文件`ssh_key_path`异常。运行`ssh-keygen -y -e -f private_key_file`命令，检查密钥文件是否有效。该命令的返回消息包括了公钥和私钥，如果私钥失效，该命令会返回报错消息。

#### Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: ssh: handshake failed: ssh: unable to authenticate, attempted methods [none publickey], no supported methods remain

- 密钥文件`ssh_key_path`不正确。请检查节点使用的密钥文件是否为`ssh_key_path`，然后检查您是否指定了正确的用户使用这个密钥通过 SSH 连接。

#### Failed to dial ssh using address [xxx.xxx.xxx.xxx:xx]: Error configuring SSH: ssh: cannot decode encrypted private keys

如果您想使用加密的私钥，您应该使用`ssh-agent`命令加载密钥和密钥短语（passphrase）。您可以在命令行工具输入`--ssh-agent-auth`命令，配置 RKE 使用这个 agent。它会在运行`rke`命令的环境中使用`SSH_AUTH_SOCK`环境变量。

#### Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

- 无法连接节点，请检查配置的地址`address`和端口`port`是否有误。
