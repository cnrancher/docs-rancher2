---
title: Harvester配置参考
description: 在手动或自动安装过程中，可以提供 Harvester 的配置文件来配置各种设置。下面是一个配置例子
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
  - Harvester
  - 安装指南
  - Harvester配置参考
---

## 配置示例

在手动或自动安装过程中，可以提供 Harvester 的配置文件来配置各种设置。下面是一个配置例子：

```yaml
server_url: https://someserver:6443
token: TOKEN_VALUE
os:
  ssh_authorized_keys:
    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQAB...
    - github:username
  hostname: myhost
  modules:
    - kvm
    - nvme
  sysctl:
    kernel.printk: "4 4 1 7"
    kernel.kptr_restrict: "1"
  dns_nameservers:
    - 8.8.8.8
    - 1.1.1.1
  ntp_servers:
    - 0.us.pool.ntp.org
    - 1.us.pool.ntp.org
  wifi:
    - name: home
      passphrase: mypassword
    - name: nothome
      passphrase: somethingelse
  password: rancher
  environment:
    http_proxy: http://myserver
    https_proxy: http://myserver
install:
  mode: create
  mgmtInterface: eth0
  force_efi: true
  device: /dev/vda
  silent: true
  iso_url: http://myserver/test.iso
  poweroff: true
  no_format: true
  debug: true
  tty: ttyS0
```

## 参数解释

下面是所有配置参数的参考，我们提供了每个参数的定义，以及一些示例。

:::warning
以下的配置文件包含了密钥凭证。请不要公开配置文件。
:::

### `server_url`

#### 定义

要作为代理加入的 Harvester 服务器的 URL。

当安装在 `JOIN`模式下时，这个配置是必须的。它负责将安装程序主服务器的位置传达给 Harvester。

#### 示例

```yaml
server_url: https://someserver:6443
install:
  mode: join
```

### `token`

#### 定义

集群密钥或节点令牌。如果该值符合节点令牌的格式，它将自动被认为是一个节点令牌。
自动被认为是一个节点令牌。否则，它将被视为集群密钥。

为了让一个新的节点加入 Harvester 集群，令牌应该与服务器所拥有的相匹配。

#### 示例

集群密钥：

```yaml
token: myclustersecret
```

节点令牌：

```yaml
token: "K1074ec55daebdf54ef48294b0ddf0ce1c3cb64ee7e3d0b9ec79fbc7baf1f7ddac6::node:77689533d0140c7019416603a05275d4"
```

### `os.ssh_authorized_keys`

#### 定义

应该添加到默认用户`rancher`的 SSH 授权密钥的列表。SSH 密钥可以通过使用以下格式从 GitHub 用户账户获得
`github:${USERNAME}`。这可以通过从`https://github.com/${USERNAME}.keys`中下载密钥来实现。

#### 示例

```yaml
os:
  ssh_authorized_keys:
    - "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC2TBZGjE+J8ag11dzkFT58J3XPONrDVmalCNrKxsfADfyy0eqdZrG8hcAxAR/5zuj90Gin2uBR4Sw6Cn4VHsPZcFpXyQCjK1QDADj+WcuhpXOIOY3AB0LZBly9NI0ll+8lo3QtEaoyRLtrMBhQ6Mooy2M3MTG4JNwU9o3yInuqZWf9PvtW6KxMl+ygg1xZkljhemGZ9k0wSrjqif+8usNbzVlCOVQmZwZA+BZxbdcLNwkg7zWJSXzDIXyqM6iWPGXQDEbWLq3+HR1qKucTCSxjbqoe0FD5xcW7NHIME5XKX84yH92n6yn+rxSsyUfhJWYqJd+i0fKf5UbN6qLrtd/D"
    - "github:ibuildthecloud"
```

### `os.hostname`

#### 定义

设置系统主机名。如果 DHCP 为系统提供了一个主机名，这个值将被 DHCP 覆盖。系统的主机名。如果 DHCP 没有提供一个主机名，并且这个值是空的，那么将生成一个随机的主机名。

#### 示例

```yaml
os:
  hostname: myhostname
```

### `os.modules`

#### 定义

启动时要加载的内核模块的列表。

#### 示例

```yaml
os:
  modules:
    - kvm
    - nvme
```

### `os.sysctls`

#### 定义

内核 sysctl 在启动时设置。这些配置与你通常在`/etc/sysctl.conf`中找到的相同。
必须指定为字符串值。

#### 示例

```yaml
os:
  sysctl:
    kernel.printk: 4 4 1 7 # the YAML parser will read as a string
    kernel.kptr_restrict: "1" # force the YAML parser to read as a string
```

### `os.dns_nameservers`

#### 定义

**备用**DNS nameserver，如果 DHCP 或操作系统中没有配置 DNS，则使用备用 DNS nameserver。

#### 示例

```yaml
os:
  dns_nameservers:
    - 8.8.8.8
    - 1.1.1.1
```

### `os.ntp_servers`

#### 定义

**备用**ntp servers，如果 DHCP 或操作系统中没有配置 DNS，则使用备用 ntp servers。

#### 示例

```yaml
os:
  ntp_servers:
    - 0.us.pool.ntp.org
    - 1.us.pool.ntp.org
```

### `os.wifi`

#### 定义

简单的 wifi 配置。所有接受的是`name`和`passphrase`。

#### 示例

```yaml
os:
  wifi:
    - name: home
      passphrase: mypassword
    - name: nothome
      passphrase: somethingelse
```

### `os.password`

#### 定义

默认用户`rancher`的密码。默认情况下，`rancher`用户没有密码。
如果你在运行时设置了一个密码，它将在下次启动时被重置。密码的值可以是明确的文本或加密的形式。获得这种加密形式的最简单方法是在 Linux 系统上改变你的密码，然后从`/etc/shadow`中复制第二个字段的值。你也可以用`openssl passwd -1`来加密一个密码。

#### 示例

```yaml
os:
  password: "$1$tYtghCfK$QHa51MS6MVAcfUKuOzNKt0"
```

Or clear text

```yaml
os:
  password: supersecure
```

### `os.environment`

#### 定义

在 k3s 和其他进程中设置的环境变量，如启动进程。
这个字段的主要用途是设置 http 代理。

#### 示例

```yaml
os:
  environment:
    http_proxy: http://myserver
    https_proxy: http://myserver
```

### `install.mode`

#### 定义

Harvester 安装模式。

- `create`: 创建一个新的 Harvester installer
- `join`: 加入一个现有的 Harvester installer，需要指定`server_url`。

#### 示例

```yaml
install:
  mode: create
```

### `install.mgmtInterface`

#### 定义

用来建立虚拟结构网络的接口。

#### 示例

```yaml
install:
  mgmtInterface: eth0
```

### `install.force_efi`

即使没有检测到 EFI，也强制安装 EFI。默认值：`false`。

### `install.device`

安装 OS 的设备。

### `install.silent`

预留值

### `install.iso_url`

如果从 kernel/vmlinuz 而不是 ISO 启动，则从 ISO 下载和安装。

### `install.poweroff`

安装后关闭机器而不是重启。

### `install.no_format`

不要分区和格式化，假设布局已经存在。

### `install.debug`

运行有更多日志记录的安装，并为已安装的系统配置调试。

### `install.tty`

#### 定义

用于控制台的 tty 设备。

#### 示例

```yaml
install:
  tty: ttyS0,115200n8
```
