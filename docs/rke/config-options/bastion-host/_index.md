---
title: 配置堡垒机
---

## 概述

由于 RKE 使用 "ssh "连接到[节点](/docs/rke/config-options/nodes/_index)，所以您可以配置`cluster.yml`，使 RKE 使用堡垒主机。请注意，RKE 节点的[端口要求](/docs/rke/os/_index)会移动到配置的堡垒主机上。我们的私有 SSH 密钥只需要存在运行 RKE 的主机上。您不需要将您的 SSH 私钥复制到堡垒主机上。

```yaml
bastion_host:
  address: x.x.x.x
  user: ubuntu
  port: 22
  ssh_key_path: /home/user/.ssh/bastion_rsa
  # or
  # ssh_key: |-
  #   -----BEGIN RSA PRIVATE KEY-----
  #
  #   -----END RSA PRIVATE KEY-----
  # Optionally using SSH certificates
  # ssh_cert_path: /home/user/.ssh/id_rsa-cert.pub
  # or
  # ssh_cert: |-
  #   ssh-rsa-cert-v01@openssh.com AAAAHHNza...
```

## 堡垒机配置选项

### Address

`address`指令用于设置堡垒主机的主机名或 IP 地址。RKE 必须能够连接到这个地址。

### SSH Port

您可以指定连接到堡垒主机时要使用的 端口，如果不指定，会使用默认端口`22`。

### SSH Users

指定连接到这个节点时要使用的用户。

### SSH Key Path

指定路径，即`ssh_key_path`，用于连接堡垒主机时要使用的 SSH 私钥。

### SSH Key

你可以指定连接到堡垒主机使用的密钥，即`ssh_key`，这样的话就不需要设置 SSH 密钥的路径`ssh_key_path`。

### SSH Certificate Path

您可以指定路径，即`ssh_cert_path`，用于连接堡垒主机时要使用的签名 SSH 证书。

### SSH Certificate

你可以指定实际的证书，即`ssh_cert`，用来连接到堡垒主机，这样的话就不需要设置 SSH 密钥路径`ssh_cert_path`。
