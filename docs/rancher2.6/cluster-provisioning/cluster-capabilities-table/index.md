---
headless: true
---

| 操作                                                                                                                                                                                                | Rancher 启动的 Kubernetes 集群 | EKS、GKE 和 AKS 集群<sup>1</sup> | 其他托管的 Kubernetes 集群 | 非 EKS 或 GKE 注册集群 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------- | -------------------------- | ---------------------- |
| [使用 kubectl 和 kubeconfig 文件来访问集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/)                                                                                    | ✓                              | ✓                                | ✓                          | ✓                      |
| [管理集群成员]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/cluster-members/)                                                                                                         | ✓                              | ✓                                | ✓                          | ✓                      |
| [编辑和升级集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/)                                                                                                                     | ✓                              | ✓                                | ✓                          | ✓<sup>2</sup>          |
| [管理节点]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/nodes)                                                                                                                                       | ✓                              | ✓                                | ✓                          | ✓<sup>3</sup>          |
| [管理持久卷和存储类]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/)                                                                                                              | ✓                              | ✓                                | ✓                          | ✓                      |
| [管理项目、命名空间和工作负载]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/projects-and-namespaces/)                                                                                                | ✓                              | ✓                                | ✓                          | ✓                      |
| [使用应用目录]({{<baseurl>}}/rancher/v2.6/en/helm-charts/)                                                                                                                                          | ✓                              | ✓                                | ✓                          | ✓                      |
| 配置工具（[Alerts、Notifiers、Monitoring]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/)、[Logging]({{<baseurl>}}/rancher/v2.6/en/logging/) 和 [Istio]({{<baseurl>}}/rancher/v2.6/en/istio/)） | ✓                              | ✓                                | ✓                          | ✓                      |
| [运行安全扫描]({{<baseurl>}}/rancher/v2.6/en/security/security-scan/)                                                                                                                               | ✓                              | ✓                                | ✓                          | ✓                      |
| [使用现有配置来创建其他集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cloning-clusters/)                                                                                                         | ✓                              | ✓                                | ✓                          |                        |
| [轮换证书]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/certificate-rotation/)                                                                                                                       | ✓                              | ✓                                |                            |                        |
| [备份]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/backing-up-etcd/)和[恢复]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/restoring-etcd/) Rancher 启动的集群                                        | ✓                              | ✓                                |                            | ✓<sup>4</sup>          |
| [在 Rancher 无法访问集群时清理 Kubernetes 组件]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cleaning-cluster-nodes/)                                                                                | ✓                              |                                  |                            |                        |
| [配置 Pod 安全策略]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/pod-security-policy/)                                                                                                               | ✓                              | ✓                                |                            |

1. 注册的 GKE 和 EKS 集群与从 Rancher UI 创建的 GKE 和 EKS 集群的可用选项一致。不同之处是，从 Rancher UI 中删除已注册的集群后，集群不会被销毁。

2. 无法编辑已注册的集群的集群配置选项（[K3s 和 RKE2 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/registered-clusters/)除外）。

3. Rancher UI 为已注册的集群节点提供了封锁、清空和编辑节点的功能。

4. 对于使用 etcd 作为 controlplane 的注册集群，必须在 Rancher UI 之外手动创建快照以用于备份和恢复。
