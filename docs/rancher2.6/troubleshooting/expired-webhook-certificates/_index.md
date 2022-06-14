---
title: 过期 Webhook 证书轮换
weight: 120
---

如果你的 Rancher 版本安装了 `rancher-webhook`，这些证书将在一年后过期。发生这种情况时，你需要轮换你的 webhook 证书。

如果我们有了这个已知问题的永久解决方案，我们将通知社区。目前，你可以通过下面两种方法解决这个问题。

##### 1. 如果用户具有集群访问权限，运行以下命令：
```
kubectl delete secret -n cattle-system cattle-webhook-tls
kubectl delete mutatingwebhookconfigurations.admissionregistration.k8s.io --ignore-not-found=true rancher.cattle.io
kubectl delete pod -n cattle-system -l app=rancher-webhook
```

##### 2. 如果用户没有集群访问权限，使用 `kubectl`：

1. 删除 local 集群 `cattle-system` 命名空间中的 `cattle-webhook-tls` 密文。

2. 删除 `rancher.cattle.io` mutating webhook。

3. 删除 local 集群 `cattle-system` 命名空间中的 `rancher-webhook` pod。

**注意**：webhook 证书过期问题不止示例中列出的 `cattle-webhook-tls`。你需要相应地填写你过期的证书密文。
