---
title: PXE Boot 安装
keywords:
  - Harvester
  - harvester
  - Rancher
  - rancher
  - Install harvester
  - Installing harvester
  - harvester Installation
  - PXE Boot 安装
Description: 从`0.2.0`版本开始，Harvester 支持批量安装。本文提供了一个使用 PXE 启动进行自动安装的例子。
---

## 概述

从`0.2.0`版本开始，Harvester 支持批量安装。本文提供了一个使用 PXE 启动进行自动安装的例子。

我们推荐使用[iPXE](https://ipxe.org/)来执行网络启动。它比传统的 PXE 启动程序有更多的功能，而且可能在现代的网卡中都有。如果网卡没有附带 iPXE 固件，可以先从 TFTP 服务器加载 iPXE 固件镜像。

请访问[iPXE 示例](https://github.com/harvester/ipxe-examples)，获取 iPXE 脚本样本示例。

## 准备 HTTP Servers

您需要一个 HTTP 服务器来提供启动文件。在继续之前，请确保这些服务器的设置是正确的。

我们假设一个 NGINX HTTP 服务器的 IP 是`10.100.0.10`，它为`/usr/share/nginx/html/`文件夹提供服务，路径是`http://10.100.0.10/`。

## 准备 boot 文件

- 从https://github.com/harvester/harvester/releases 下载所需文件。选择一个合适的版本。

  - ISO：`harvester-amd64.iso`.
  - 内核：`harvester-vmlinuz-amd64`。
  - initrd：`harvester-initrd-amd64`。

- 传送文件。

  将下载的文件复制或移动到一个适当的位置，以便它们可以通过 HTTP 服务器下载。

  ```bash
  sudo mkdir -p /usr/share/nginx/html/harvester/...。
  sudo cp /path/to/harvester-amd64.iso /usr/share/nginx/html/harvester/。
  sudo cp /path/to/harvester-vmlinuz-amd64 /usr/share/nginx/html/harvester/
  sudo cp /path/to/harvester-initrd-amd64 /usr/share/nginx/html/harvester/
  ```

## 准备 iPXE boot 脚本

当执行自动安装时，有两种模式：

- `CREATE`：安装一个节点，并且构建一个初始 Harvester 集群。
- `JOIN`：安装一个节点，并且将该节点加入到现有的 Harvester 集群。

### 前提条件

节点需要有至少**8G**的内存，因为在安装过程中，完整的 ISO 文件会被加载到 tmpfs 中。

### CREATE 模式

:::warning
以下的配置文件包含了密钥凭证。请不要公开配置文件。
:::

创建一个[Harvester 配置文件](/docs/harvester/installation/harvester-configuration/_index) `config-create.yaml`用于`CREATE`模式。根据需要修改这些值。

```YAML
# cat /usr/share/nginx/html/harvester/config-create.yaml
token: token
os:
  hostname: node1
  ssh_authorized_keys:
  - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDbeUa9A7Kee+hcCleIXYxuaPksn2m4PZTd4T7wPcse8KbsQfttGRax6vxQXoPO6ehddqOb2nV7tkW2mEhR50OE7W7ngDHbzK2OneAyONYF44bmMsapNAGvnsBKe9rNrev1iVBwOjtmyVLhnLrJIX+2+3T3yauxdu+pmBsnD5OIKUrBrN1sdwW0rA2rHDiSnzXHNQM3m02aY6mlagdQ/Ovh96h05QFCHYxBc6oE/mIeFRaNifa4GU/oELn3a6HfbETeBQz+XOEN+IrLpnZO9riGyzsZroB/Y3Ju+cJxH06U0B7xwJCRmWZjuvfFQUP7RIJD1gRGZzmf3h8+F+oidkO2i5rbT57NaYSqkdVvR6RidVLWEzURZIGbtHjSPCi4kqD05ua8r/7CC0PvxQb1O5ILEdyJr2ZmzhF6VjjgmyrmSmt/yRq8MQtGQxyKXZhJqlPYho4d5SrHi5iGT2PvgDQaWch0I3ndEicaaPDZJHWBxVsCVAe44Wtj9g3LzXkyu3k= root@admin
  password: rancher
install:
  mode: create
  mgmt_interface: eth0
  device: /dev/sda
  iso_url: http://10.100.0.10/harvester-amd64.iso

```

对于需要以`CREATE`模式安装的机器，下面是一个 iPXE 脚本，用上述配置启动内核。

```bash
#!ipxe
kernel vmlinuz k3os.mode=install console=ttyS0 console=tty1 harvester.install.automatic=true harvester.install.config_url=http://10.100.0.10/harvester/config-create.yaml
initrd initrd
boot
```

我们假设 iPXE 脚本存储在`/usr/share/nginx/html/harvester/ipxe-create`中。

### JOIN 模式

:::warning
以下的配置文件包含了密钥凭证。请不要公开配置文件。
:::

创建一个[Harvester 配置文件](/docs/harvester/installation/pxe-mode/_index) `config-join.yaml`用于`JOIN`模式。根据需要修改这些值。

```YAML
# cat /usr/share/nginx/html/harvester/config-join.yaml
server_url: https://10.100.0.130:6443
token: token
os:
  hostname: node2
  ssh_authorized_keys:
  - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDbeUa9A7Kee+hcCleIXYxuaPksn2m4PZTd4T7wPcse8KbsQfttGRax6vxQXoPO6ehddqOb2nV7tkW2mEhR50OE7W7ngDHbzK2OneAyONYF44bmMsapNAGvnsBKe9rNrev1iVBwOjtmyVLhnLrJIX+2+3T3yauxdu+pmBsnD5OIKUrBrN1sdwW0rA2rHDiSnzXHNQM3m02aY6mlagdQ/Ovh96h05QFCHYxBc6oE/mIeFRaNifa4GU/oELn3a6HfbETeBQz+XOEN+IrLpnZO9riGyzsZroB/Y3Ju+cJxH06U0B7xwJCRmWZjuvfFQUP7RIJD1gRGZzmf3h8+F+oidkO2i5rbT57NaYSqkdVvR6RidVLWEzURZIGbtHjSPCi4kqD05ua8r/7CC0PvxQb1O5ILEdyJr2ZmzhF6VjjgmyrmSmt/yRq8MQtGQxyKXZhJqlPYho4d5SrHi5iGT2PvgDQaWch0I3ndEicaaPDZJHWBxVsCVAe44Wtj9g3LzXkyu3k= root@admin
  dns_nameservers:
  - 1.1.1.1
  - 8.8.8.8
  password: rancher
install:
  mode: join
  mgmt_interface: eth0
  device: /dev/sda
  iso_url: http://10.100.0.10/harvester/harvester-amd64.iso
```

注意`mode`是`join`，`server_url`需要被提供。

对于需要在`JOIN`模式下安装的机器，下面是一个 iPXE 脚本，用上述配置启动内核。

```bash
#!ipxe
kernel vmlinuz k3os.mode=install console=ttyS0 console=tty1 harvester.install.automatic=true harvester.install.config_url=http://10.100.0.10/harvester/config-join.yaml
initrd initrd
boot
```

我们假设 iPXE 脚本存储在`/usr/share/nginx/html/harvester/ipxe-join`。

**问题排查**

- 有时安装程序可能无法获取 Harvester 配置文件，因为网络堆栈还没有准备好。为了解决这个问题，请在 iPXE 脚本中增加一个`boot_cmd`参数，例如：

  ```
  #!ipxe
  kernel vmlinuz k3os.mode=install console=ttyS0 console=tty1 harvester.install.automatic=true harvester.install.config_url=http://10.100.0.10/harvester/config-join.yaml boot_cmd="echo include_ping_test=yes >> /etc/conf.d/net-online"
  initrd initrd
  boot
  ```

## 配置 DHCP server

下面是一个配置 ISC DHCP 服务器以提供 iPXE 脚本的例子。

```sh
option architecture-type code 93 = unsigned integer 16;

subnet 10.100.0.0 netmask 255.255.255.0 {
	option routers 10.100.0.10;
        option domain-name-servers 192.168.2.1;
	range 10.100.0.100 10.100.0.253;
}

group {
  # create group
  if exists user-class and option user-class = "iPXE" {
    # iPXE Boot
    if option architecture-type = 00:07 {
      filename "http://10.100.0.10/harvester/ipxe-create-efi";
    } else {
      filename "http://10.100.0.10/harvester/ipxe-create";
    }
  } else {
    # PXE Boot
    if option architecture-type = 00:07 {
      # UEFI
      filename "ipxe.efi";
    } else {
      # Non-UEFI
      filename "undionly.kpxe";
    }
  }

  host node1 { hardware ethernet 52:54:00:6b:13:e2; }
}


group {
  # join group
  if exists user-class and option user-class = "iPXE" {
    # iPXE Boot
    if option architecture-type = 00:07 {
      filename "http://10.100.0.10/harvester/ipxe-join-efi";
    } else {
      filename "http://10.100.0.10/harvester/ipxe-join";
    }
  } else {
    # PXE Boot
    if option architecture-type = 00:07 {
      # UEFI
      filename "ipxe.efi";
    } else {
      # Non-UEFI
      filename "undionly.kpxe";
    }
  }

  host node2 { hardware ethernet 52:54:00:69:d5:92; }
}
```

配置文件声明了一个子网和两个组。第一组是用于主机以`CREATE`模式启动，另一组是用于`JOIN`模式。默认情况下，选择 iPXE 路径，但如果它看到一个 PXE 客户端，它也会根据客户端架构提供 iPXE 镜像。请先准备好这些镜像和一个 tftp 服务器。

## 配置 Harvester

关于 Harvester 配置的更多信息，请参考[Harvester 配置](/docs/harvester/installation/pxe-mode/_index)。

用户也可以通过内核参数提供配置。例如，为了指定`CREATE`安装模式，用户可以在启动时传递`harvester.install.mode=create`内核参数。通过内核参数传递的值比在配置文件中指定的值具有更高的优先级。

## UEFI HTTP Boot 支持

UEFI 固件支持从 HTTP 服务器加载一个启动镜像。本节演示了如何使用 UEFI 的 HTTP 启动来加载 iPXE 程序并执行自动安装。

### Serve the iPXE program

从http://boot.ipxe.org/ipxe.efi 下载 iPXE uefi 程序，并使`ipxe.efi`可以从 HTTP 服务器下载。

```bash
cd /usr/share/nginx/html/harvester/
wget http://boot.ipxe.org/ipxe.efi
```

该文件可以从`http://10.100.0.10/harvester/ipxe.efi`下载。

### 配置 DHCP server

如果用户计划通过先获得一个动态 IP 来使用 UEFI HTTP 启动功能，DHCP 服务器在看到这样的请求时需要提供 iPXE 程序的 URL。下面是一个更新的 ISC DHCP 服务器组的例子。

```sh
group {
  # create group
  if exists user-class and option user-class = "iPXE" {
    # iPXE Boot
    if option architecture-type = 00:07 {
      filename "http://10.100.0.10/harvester/ipxe-create-efi";
    } else {
      filename "http://10.100.0.10/harvester/ipxe-create";
    }
  } elsif substring (option vendor-class-identifier, 0, 10) = "HTTPClient" {
    # UEFI HTTP Boot
    option vendor-class-identifier "HTTPClient";
    filename "http://10.100.0.10/harvester/ipxe.efi";
  } else {
    # PXE Boot
    if option architecture-type = 00:07 {
      # UEFI
      filename "ipxe.efi";
    } else {
      # Non-UEFI
      filename "undionly.kpxe";
    }
  }

  host node1 { hardware ethernet 52:54:00:6b:13:e2; }
}
```

`elsif substring`语句是新的，它在看到 UEFI HTTP 启动 DHCP 请求时提供`http://10.100.0.10/harvester/ipxe.efi`。在客户端获取 iPXE 程序并运行后，iPXE 程序将再次发送 DHCP 请求，并从 URL`http://10.100.0.10/harvester/ipxe-create-efi`加载 iPXE 脚本。

### The iPXE script for UEFI boot

在内核参数中指定 UEFI 启动的 initrd 镜像是必须的。这里有一个更新的 iPXE 脚本，用于 "CREATE "模式。

```bash
#!ipxe
kernel vmlinuz initrd=initrd k3os.mode=install console=ttyS0 console=tty1 harvester.install.automatic=true harvester.install.config_url=http://10.100.0.10/harvester/config-create.yaml
initrd initrd
boot
```

参数`initrd=initrd`是 initrd 被 chroot 的必要条件。
