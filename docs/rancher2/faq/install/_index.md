---
title: 安装
description:
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
  - 常见问题
  - 安装
---

## Agent 无法连接 Rancher server

### ERROR: `https://x.x.x.x/ping` is not accessible (Failed to connect to x.x.x.x port 443: Connection timed out)

```bash
ERROR: https://x.x.x.x/ping is not accessible (Failed to connect to x.x.x.x port 443: Connection timed out)
```

在`cattle-cluster-agent`或`cattle-node-agent`中出现以上错误，代表 agent 无法连接到 rancher server，请按照以下步骤排查网络连接：

- 从 agent 宿主机访问 rancher server 的 443 端口，例如：`telnet x.x.x.x 443`
- 从容器内访问 rancher server 的 443 端口，例如：`telnet x.x.x.x 443`

### ERROR: `https://rancher.my.org/ping` is not accessible (Could not resolve host: rancher.my.org)

```bash
ERROR: https://rancher.my.org/ping is not accessible (Could not resolve host: rancher.my.org)
```

在`cattle-cluster-agent`或`cattle-node-agent`中出现以上错误，代表 agent 无法通过域名解析到 rancher server，请按照以下步骤进行排查网络连接：

- 从容器内访问通过域名访问 rancher server，例如：`ping rancher.my.org`

这个问题在内网并且无 DNS 服务器的环境下非常常见，即使在/etc/hosts 文件中配置了映射关系也无法解决，这是因为`cattle-node-agent`从宿主机的/etc/resolv.conf 中继承`nameserver`用作 dns 服务器。

所以要解决这个问题，可以在环境中搭建一个 dns 服务器，配置正确的域名和 IP 的对应关系，然后将每个节点的`nameserver`指向这个 dns 服务器。

或者使用[HostAliases](https://kubernetes.io/docs/tasks/network/customize-hosts-file-for-pods/)

```bash
kubectl -n cattle-system patch  deployments cattle-cluster-agent --patch '{
    "spec": {
        "template": {
            "spec": {
                "hostAliases": [
                    {
                      "hostnames":
                      [
                        "{{ rancher_server_hostname }}"
                      ],
                      "ip": "{{ rancher_server_ip }}"
                    }
                ]
            }
        }
    }
}'

kubectl -n cattle-system patch  daemonsets cattle-node-agent --patch '{
 "spec": {
     "template": {
         "spec": {
             "hostAliases": [
                 {
                    "hostnames":
                      [
                        "{{ rancher_server_hostname }}"
                      ],
                    "ip": "{{ rancher_server_ip }}"
                 }
             ]
         }
     }
 }
}'
```

## 创建 Kubernetes 集群，ETCD 无法启动

通过[rke 创建 Kubernetes 集群](/docs/rancher2/cluster-provisioning/rke-clusters/_index)，集群状态为`Provisioning`，并且 UI 显示如下错误信息：

```bash
[etcd] Failed to bring up Etcd Plane: etcd cluster is unhealthy: hosts [10.0.2.15] failed to report healthy. Check etcd container logs on each host for more information
```

查看 etcd 日志，显示如下错误信息：

```bash
2020-05-25 08:43:41.515364 I | embed: ready to serve client requests
2020-05-25 08:43:41.523589 I | embed: serving client requests on [::]:2379
2020-05-25 08:43:41.536538 I | embed: rejected connection from "10.0.2.15:39550" (error "tls: failed to verify client's certificate: x509: certificate signed by unknown authority (possibly because of \"crypto/rsa: verification error\" while trying to verify candidate authority certificate \"kube-ca\")", ServerName "")
2020-05-25 08:43:46.545930 I | embed: rejected connection from "10.0.2.15:39554" (error "tls: failed to verify client's certificate: x509: certificate signed by unknown authority (possibly because of \"crypto/rsa: verification error\" while trying to verify candidate authority certificate \"kube-ca\")", ServerName "")
2020-05-25 08:43:51.554070 I | embed: rejected connection from "10.0.2.15:39556" (error "tls: failed to verify client's certificate: x509: certificate signed by unknown authority (possibly because of \"crypto/rsa: verification error\" while trying to verify candidate authority certificate \"kube-ca\")", ServerName "")
2020-05-25 08:44:34.072012 I | embed: rejected connection from "10.0.2.15:39703" (error "EOF", ServerName "")
2020-05-25 08:44:46.520865 I | embed: rejected connection from "10.0.2.15:39560" (error "tls: failed to verify client's certificate: x509: certificate signed by unknown authority (possibly because of \"crypto/rsa: verification error\" while trying to verify candidate authority certificate \"kube-ca\")", ServerName "")
```

以上报错是因为证书的问题，导致 etcd 启动失败。原因主要有两种可能：

1. 主机时钟不同步
2. 该主机之前添加过 kubernetes 集群，在残留数据没有清理干净的情况下重新安装集群。

**解决办法：**

1. 检查主机时钟，并使各主机时钟同步。
2. 参考[清理节点](/docs/rancher2/cluster-admin/cleaning-cluster-nodes/_index)说明，将主机数据残留数据清理干净，然后再从新添加集群。
