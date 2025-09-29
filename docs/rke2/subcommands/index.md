---
title: 子命令
description: 介绍 RKE2 二进制文件包含的子命令的选项
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
  - RKE2
  - RKE2 介绍
---

RKE2 二进制文件包含多个子命令，本文将介绍它们的选项。

## etcd-snapshot
此子命令用于手动创建快照、列出当前可用的所有快照、以及手动删除任何不需要的或较旧的快照。

```console
NAME:
   rke2 etcd-snapshot - Trigger an immediate etcd snapshot

USAGE:
   rke2 etcd-snapshot command [command options] [arguments...]

COMMANDS:
   delete       Delete given snapshot(s)
   ls, list, l  List snapshots
   prune        Remove snapshots that exceed the configured retention count
   save         Trigger an immediate etcd snapshot

OPTIONS:
   --debug                                              (logging) Turn on debug logs [$RKE2_DEBUG]
   --config FILE, -c FILE                               (config) Load configuration from FILE (default: "/etc/rancher/rke2/config.yaml") [$RKE2_CONFIG_FILE]
   --log value, -l value                                (logging) Log to file
   --alsologtostderr                                    (logging) Log to standard error as well as file (if set)
   --node-name value                                    (agent/node) Node name [$RKE2_NODE_NAME]
   --data-dir value, -d value                           (data) Folder to hold state (default: "/var/lib/rancher/rke2")
   --dir value, --etcd-snapshot-dir value               (db) Directory to save etcd on-demand snapshot. (default: ${data-dir}/db/snapshots)
   --name value                                         (db) Set the base name of the etcd on-demand snapshot (appended with UNIX timestamp). (default: "on-demand")
   --snapshot-compress, --etcd-snapshot-compress        (db) Compress etcd snapshot
   --s3, --etcd-s3                                      (db) Enable backup to S3
   --s3-endpoint value, --etcd-s3-endpoint value        (db) S3 endpoint url (default: "s3.amazonaws.com")
   --s3-endpoint-ca value, --etcd-s3-endpoint-ca value  (db) S3 custom CA cert to connect to S3 endpoint
   --s3-skip-ssl-verify, --etcd-s3-skip-ssl-verify      (db) Disables S3 SSL certificate validation
   --s3-access-key value, --etcd-s3-access-key value    (db) S3 access key [$AWS_ACCESS_KEY_ID]
   --s3-secret-key value, --etcd-s3-secret-key value    (db) S3 secret key [$AWS_SECRET_ACCESS_KEY]
   --s3-bucket value, --etcd-s3-bucket value            (db) S3 bucket name
   --s3-region value, --etcd-s3-region value            (db) S3 region / bucket location (optional) (default: "us-east-1")
   --s3-folder value, --etcd-s3-folder value            (db) S3 folder
   --s3-insecure, --etcd-s3-insecure                    (db) Disables S3 over HTTPS
   --s3-timeout value, --etcd-s3-timeout value          (db) S3 timeout (default: 30s)
   --help, -h                                           show help
```


## certificate
该子命令可用于轮换集群中运行的服务的证书，例如 kubelet、etcd 和 api-server。这些证书在每年到期之前会自动轮换，你也可以提前轮换它们。

```console
NAME:
   rke2 certificate - Certificates management

USAGE:
   rke2 certificate command [command options] [arguments...]

COMMANDS:
   rotate  Certificate Rotatation

OPTIONS:
   --debug                     (logging) Turn on debug logs [$RKE2_DEBUG]
   --config FILE, -c FILE      (config) Load configuration from FILE (default: "/etc/rancher/rke2/config.yaml") [$RKE2_CONFIG_FILE]
   --log value, -l value       (logging) Log to file
   --alsologtostderr           (logging) Log to standard error as well as file (if set)
   --data-dir value, -d value  (data) Folder to hold state (default: "/var/lib/rancher/rke2")
   --service value, -s value   List of services to rotate certificates for. Options include (admin, api-server, controller-manager, scheduler, rke2-controller, rke2-server, cloud-controller, etcd, auth-proxy, kubelet, kube-proxy)
   --help, -h                  show help
```


## secrets-encrypt
RKE2 默认启用 secret 加密。此子命令允许你禁用该功能，以及轮换使用的加密密钥。

```console
NAME:
   rke2 secrets-encrypt - Control secrets encryption and keys rotation

USAGE:
   rke2 secrets-encrypt command [command options] [arguments...]

COMMANDS:
   status     Print current status of secrets encryption
   enable     Enable secrets encryption
   disable    Disable secrets encryption
   prepare    Prepare for encryption keys rotation
   rotate     Rotate secrets encryption keys
   reencrypt  Reencrypt all data with new encryption key

OPTIONS:
   --help, -h  show help
```
