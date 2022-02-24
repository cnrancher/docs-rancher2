---
title: Harvester 配置
keywords:
  - Harvester
  - harvester
  - Rancher
  - rancher
  - Harvester 配置
  - Harvester 配置示例
description: 你可以在手动或自动安装期间提供 Harvester 配置文件，来进行特定的配置。
---

## 配置示例

你可以在手动或自动安装期间提供 Harvester 配置文件，来进行特定的配置。以下是一个配置示例：

```yaml
server_url: https://someserver:8443
token: TOKEN_VALUE
os:
  ssh_authorized_keys:
    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQAB...
    - github:username
  write_files:
  - encoding: ""
    content: test content
    owner: root
    path: /etc/test.txt
    permissions: '0755'
  hostname: myhost
  modules:
    - kvm
    - nvme
  sysctls:
    kernel.printk: "4 4 1 7"
    kernel.kptr_restrict: "1"
  dns_nameservers:
    - 8.8.8.8
    - 1.1.1.1
  ntp_servers:
    - 0.us.pool.ntp.org
    - 1.us.pool.ntp.org
  password: rancher
  environment:
    http_proxy: http://myserver
    https_proxy: http://myserver
  labels:
    foo: bar
    mylabel: myvalue
install:
  mode: create
  networks:
    harvester-mgmt:
      interfaces:
      - name: ens5
      method: dhcp
  force_efi: true
  device: /dev/vda
  silent: true
  iso_url: http://myserver/test.iso
  poweroff: true
  no_format: true
  debug: true
  tty: ttyS0
  vip: 10.10.0.19
  vip_hw_addr: 52:54:00:ec:0e:0b
  vip_mode: dhcp
  force_mbr: false
  no_data_partition: false
system_settings:
  auto-disk-provision-paths: ""
```

## 配置参考

下文提供所有配置密钥的参考。

> 警告：
>
> **安全风险**：配置文件包含应保密的凭证。请不要公开配置文件。

### `server_url`

#### 定义

要作为 Agent 加入的 Harvester Server URL。

对于使用 `JOIN` 模式进行的安装，配置是必须的。配置可以将主服务器的位置告知 Harvester 安装程序。

> 注意：
> 为确保高可用的 Harvester 集群，请使用 Harvester 主服务器 [VIP](#installvip) 或 `server_url` 中的一个域名。

#### 示例

```yaml
server_url: https://someserver:8443
install:
  mode: join
```

### `token`

#### 定义

集群密文或节点 Token。如果该值符合节点 Token 的格式，它将自动被认为是一个节点 Token。否则，它将被视为集群密文。

为了将一个新节点加入 Harvester 集群，Token 应该与服务器所拥有的相匹配。

#### 示例

```yaml
token: myclustersecret
```

节点 Token

```yaml
token: "K1074ec55daebdf54ef48294b0ddf0ce1c3cb64ee7e3d0b9ec79fbc7baf1f7ddac6::node:77689533d0140c7019416603a05275d4"
```

### `os.ssh_authorized_keys`

#### 定义

应该添加到默认用户 `rancher` 的 SSH 授权密钥的列表。SSH 密钥可以通过使用 `github:${USERNAME}` 格式从 GitHub 用户账户获取。这是通过从 `https://github.com/${USERNAME}.keys` 中下载密钥来实现的。

#### 示例

```yaml
os:
  ssh_authorized_keys:
    - "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC2TBZGjE+J8ag11dzkFT58J3XPONrDVmalCNrKxsfADfyy0eqdZrG8hcAxAR/5zuj90Gin2uBR4Sw6Cn4VHsPZcFpXyQCjK1QDADj+WcuhpXOIOY3AB0LZBly9NI0ll+8lo3QtEaoyRLtrMBhQ6Mooy2M3MTG4JNwU9o3yInuqZWf9PvtW6KxMl+ygg1xZkljhemGZ9k0wSrjqif+8usNbzVlCOVQmZwZA+BZxbdcLNwkg7zWJSXzDIXyqM6iWPGXQDEbWLq3+HR1qKucTCSxjbqoe0FD5xcW7NHIME5XKX84yH92n6yn+rxSsyUfhJWYqJd+i0fKf5UbN6qLrtd/D"
    - "github:ibuildthecloud"
```

### `os.write_files`

启动时写入磁盘的文件列表。`encoding` 字段指定内容的编码。`encoding` 的值可以为：

- `""`：内容数据以纯文本形式写入。在这种情况下，也可以省略 `encoding` 字段。
- `b64`、`base64`：内容数据采用 base64 编码。
- `gz`、`gzip`：内容数据经过 gzip 压缩。
- `gz+base64`、`gzip+base64`、`gz+b64`、`gzip+b64`：内容数据先经过 gzip 压缩然后再 base64 编码。

示例

```yaml
os:
  write_files:
  - encoding: b64
    content: CiMgVGhpcyBmaWxlIGNvbnRyb2xzIHRoZSBzdGF0ZSBvZiBTRUxpbnV4...
    owner: root:root
    path: /etc/connman/main.conf
    permissions: '0644'
  - content: |
      # My new /etc/sysconfig/samba file

      SMDBOPTIONS="-D"
    path: /etc/sysconfig/samba
  - content: !!binary |
      f0VMRgIBAQAAAAAAAAAAAAIAPgABAAAAwARAAAAAAABAAAAAAAAAAJAVAAAAAA
      AEAAHgAdAAYAAAAFAAAAQAAAAAAAAABAAEAAAAAAAEAAQAAAAAAAwAEAAAAAAA
      AAAAAAAAAwAAAAQAAAAAAgAAAAAAAAACQAAAAAAAAAJAAAAAAAAcAAAAAAAAAB
      ...
    path: /bin/arch
    permissions: '0555'
  - content: |
      15 * * * * root ship_logs
    path: /etc/crontab
```

### `os.hostname`

#### 定义

设置系统主机名。如果系统主机名是通过 DHCP 提供的，那么这里将使用该值。如果未设置此值，而且未通过 DHCP 提供该值，则将生成一个随机的主机名。

#### 示例

```yaml
os:
  hostname: myhostname
```

### `os.modules`

#### 定义

启动时要加载的内核模块列表。

#### 示例

```yaml
os:
  modules:
    - kvm
    - nvme
```

### `os.sysctls`

#### 定义

启动时要设置的内核 sysctl。这些配置与你在 `/etc/sysctl.conf` 中找到的配置类似。
指定的值必须是字符串。

#### 示例

```yaml
os:
  sysctls:
    kernel.printk: 4 4 1 7 # YAML 解析器读取为字符串。
    kernel.kptr_restrict: "1" # 强制 YAML 解析器读取为字符串。
```

### `os.dns_nameservers`

#### 定义

**备用** DNS 名称服务器。如果 DHCP 或操作系统中没有配置 DNS，则使用备用 DNS 名称服务器。

#### 示例

```yaml
os:
  dns_nameservers:
    - 8.8.8.8
    - 1.1.1.1
```

### `os.ntp_servers`

#### 定义

**备用** NTP 服务器。如果操作系统中的其他位置没有配置 NTP，则使用备用 NTP 服务器。

#### 示例

```yaml
os:
  ntp_servers:
    - 0.us.pool.ntp.org
    - 1.us.pool.ntp.org
```

### `os.password`

#### 定义

默认用户 `rancher` 的密码。默认情况下，`rancher` 用户没有密码。
如果你在运行时设置密码，密码会在下次启动时重置。密码可以是明文或加密形式。获得这种加密密码最容易的方法，是在 Linux 系统上更改你的密码，并从 `/etc/shadow` 复制第二个字段的值。你也可以使用 `openssl passwd -1` 来加密密码。

#### 示例

加密形式：
```yaml
os:
  password: "$1$tYtghCfK$QHa51MS6MVAcfUKuOzNKt0"
```

明文形式：

```yaml
os:
  password: supersecure
```

### `os.environment`

#### 定义

要在 K3s 和其他进程（如启动进程）上设置的环境变量。
此字段主要用于设置 HTTP 代理。

#### 示例

```yaml
os:
  environment:
    http_proxy: http://myserver
    https_proxy: http://myserver
```

> 注意：
> 此示例为**基本的操作系统组件**设置 HTTP(S) 代理。
> 如果需要为 Harvester 组件（如获取外部镜像和备份到 S3）配置 HTTP(S) 代理，请参见 [Settings/http-proxy](../../settings/_index#http-proxy)。

### `os.labels`

#### 定义

要添加到节点的标签。

### `install.mode`

#### 定义

Harvester 安装模式：

- `create`：创建新的 Harvester 安装。
- `join`：加入现有的 Harvester 安装。此模式需要指定 `server_url`。

#### 示例

```yaml
install:
  mode: create
```

### `install.networks`

#### 定义

为主机配置网络接口。每个键值对均代表一个网络接口。键的名称会成为网络名称，而值是每个网络的配置。有效的配置字段是：

- `method`：为该网络分配 IP 的方法。支持：
   - `static`：手动分配 IP 和 网关。
   - `dhcp`：向 DHCP 服务器请求一个 IP。
   - `none`：不进行操作。该配置适用于接口不需要 IP 的情况，例如在 Harvester 中创建 [VLAN 网络](../../networking/_index#VLAN-网络) NIC 时。
- `ip`：此网络的静态 IP。如果选择了 `static` 方法，则必须设置此字段。
- `subnet_mask`：此网络的子网掩码。如果选择了 `static` 方法，则必须设置此字段。
- `gateway`：此网络的网关。如果选择了 `static` 方法，则必须设置此字段。
- `interfaces`：接口名称数组。如果指定了该字段，安装程序会将这些 NIC 组合成单个逻辑绑定接口。
   - `interfaces.name`：绑定网络的从接口的名称。
- `bond_options`：绑定接口的选项。详情请参见[此处](https://www.kernel.org/doc/Documentation/networking/bonding.txt)。如果不指定，则使用以下选项：
   - `mode: balance-tlb`
   - `miimon: 100`

> 注意：
> 一个名为 `harvester-mgmt` 的网络是建立有效的[管理网络](../../networking/_index#管理网络)所必须的。

> 注意：
> Harvester 使用 [systemd 网络命名方案](https://www.freedesktop.org/software/systemd/man/systemd.net-naming-scheme.html)。
> 安装前请确保目标机器上存在接口名称。

#### 示例

```yaml
install:
  mode: create
  networks:
    harvester-mgmt:       # 管理绑定名称。这是必须的。
      interfaces:
      - name: ens5
      method: dhcp
      bond_options:
        mode: balance-tlb
        miimon: 100
    harvester-vlan:       # VLAN 网络绑定名称。然后，用户可以在 GUI 的 VLAN NIC 设置中输入`harvester-vlan`。
      interfaces:
      - name: ens6
      method: none
      bond_options:
        mode: balance-tlb
        miimon: 100
    bond0:
      interfaces:
      - name: ens8
      method: static
      ip: 10.10.18.2
      subnet_mask: 255.255.255.0
      gateway: 192.168.11.1
```

### `install.force_efi`

即使未检测到 EFI，也强制安装 EFI。默认值：`false`。

### `install.device`

用于安装操作系统的设备。

### `install.silent`

保留。

### `install.iso_url`

如果从 kernel/vmlinuz 而不是 ISO 启动，则从这个 ISO 下载和安装。

### `install.poweroff`

安装完成后关闭机器，而不是重启机器。

### `install.no_format`

如果布局已经存在，不进行分区和格式化。

### `install.debug`

为安装的系统启用日志管理和调试来运行安装。

### `install.tty`

#### 定义

用于控制台的 tty 设备。

#### 示例

```yaml
install:
  tty: ttyS0,115200n8
```

### `install.vip`
### `install.vip_mode`
### `install.vip_hw_addr`

#### 定义

- `install.vip`：Harvester 管理 endpoint 的 VIP。安装后，用户可以通过 URL `https://<VIP>` 访问 Harvester GUI。
- `install.vip_mode`
   - `dhcp`：Harvester 会发送 DHCP 请求来获取 VIP。需要指定 `install.vip_hw_addr` 字段。
   - `static`：Harvester 使用静态 VIP。
- `install.vip_hw_addr`：与 VIP 对应的硬件地址。用户需要配置本地的 DHCP 服务器来提供配置的 VIP。当 `install.vip_mode` 设为 `dhcp` 时，必须指定该字段。

详情请参见[管理地址](../management-address/_index.md)。

#### 示例

配置静态 VIP。

```yaml
install:
  vip: 192.168.0.100
  vip_mode: static
```

配置 DHCP VIP。

```yaml
install:
  vip: 10.10.0.19
  vip_mode: dhcp
  vip_hw_addr: 52:54:00:ec:0e:0b
```

### `install.force_mbr`

#### 定义

默认情况下，Harvester 在 UEFI 和 BIOS 系统上都使用 GPT 分区方案。
但是，如果你遇到兼容性问题，可以在 BIOS 系统上强制使用 MBR 分区方案。

> 注意：
> Harvester 默认创建一个额外的分区来存储虚拟机数据。
> 强制使用 MBR 时，[`install.no_data_partition`](#installno_data_partition) 会强制设为 `true`。
> 换言之，不会创建额外的分区，而且虚拟机数据将存储在与操作系统数据共享的分区中。

#### 示例

```yaml
install:
  force_mbr: true
```

### `install.no_data_partition`

#### 定义

不创建额外的磁盘分区来存储虚拟机数据。
虚拟机数据将存储在操作系统的分区中。
如果你想使用额外的磁盘来存储虚拟机数据，[auto-disk-provision-paths](../../settings/_index#auto-disk-provision-paths-实验功能) 设置就非常有用。

默认值：`false`。

> 警告：
> 如果虚拟机数据是存储在操作系统分区中的，而你创建了很多虚拟机，操作系统很有可能由于磁盘空间不足而发生故障。

#### 示例

```yaml
install:
  no_data_partition: true
```

### `system_settings`

#### 定义

你可以通过配置 `system_settings` 覆盖默认的 Harvester 系统设置。
有关其他信息和所有选项的列表，请参见[设置](../../settings/_index)页面。

> 注意：
> 仅当 Harvester 以 `Create` 模式安装时，覆盖系统设置才有效。
> 如果你使用 `join` 模式安装 Harvester，则会忽略此设置。
> `join` 模式安装会采用现有 Harvester 系统的设置。

#### 示例

下面的示例覆盖了 `http-proxy` 和 `ui-source` 设置。值必须是一个`字符串`。

```yaml
system_settings:
  http-proxy: '{"httpProxy": "http://my.proxy", "httpsProxy": "https://my.proxy", "noProxy": "some.internal.svc"}'
  ui-source: auto
```
