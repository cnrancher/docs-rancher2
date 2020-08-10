---
title: 集群访问
weight: 21
---

存储在`/etc/rancher/k3s/k3s.yaml`的kubeconfig文件用于对Kubernetes集群的访问。如果你已经安装了上游的Kubernetes命令行工具，如kubectl或 helm，你需要用正确的kubeconfig路径配置它们。这可以通过导出`KUBECONFIG`环境变量或调用`--kubeconfig`命令行标志来完成。详情请参考下面的例子。


利用KUBECONFIG环境变量:

```
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get pods --all-namespaces
helm ls --all-namespaces
```

或者在命令中指定kubeconfig文件的位置:

```
kubectl --kubeconfig /etc/rancher/k3s/k3s.yaml get pods --all-namespaces
helm --kubeconfig /etc/rancher/k3s/k3s.yaml ls --all-namespaces
```

## 使用kubectl从外部访问集群

将`/etc/rancher/k3s/k3s.yaml`复制到集群外部的计算机上的`~/.kube/config`。然后用你的K3s服务器的IP或名称替换 "localhost"。`kubectl`现在可以管理你的K3s集群了。