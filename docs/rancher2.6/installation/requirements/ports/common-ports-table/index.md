---
headless: true
---
| 协议 | 端口 | 描述 |
|:--------:	|:----------------:	|----------------------------------------------------------------------------------	|
| TCP | 22 | Node Driver SSH 配置 |
| TCP | 179 | Calico BGP 端口 |
| TCP | 2376 | Node Driver Docker daemon TLS 端口 |
| TCP | 2379 | etcd 客户端请求 |
| TCP | 2380 | etcd 对等通信 |
| UDP | 8472 | Canal/Flannel VXLAN 覆盖网络 |
| UDP | 4789 | Windows 集群中的 Flannel VXLAN 覆盖网络 |
| TCP | 8443 | Rancher webhook |
| TCP | 9099 | Canal/Flannel livenessProbe/readinessProbe |
| TCP | 9100 | Monitoring 从 Linux 节点导出器中抓取指标所需的默认端口 |
| TCP | 9443 | Rancher webhook |
| TCP | 9796 | Monitoring 从 Windows 节点导出器中抓取指标所需的默认端口 |
| TCP | 6783 | Weave 端口 |
| UDP | 6783-6784 | Weave UDP 端口 |
| TCP | 10250 | Metrics Server 与所有节点 API 的通信 |
| TCP | 10254 | Ingress controller livenessProbe/readinessProbe |
| TCP/UDP | 30000-</br>32767 | NodePort 端口范围 |
