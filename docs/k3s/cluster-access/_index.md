---
title: 集群访问
description: 本节包含一些高级信息，描述了你可以运行和管理 K3s 的不同方式
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - 集群访问
---

存储在`/etc/rancher/k3s/k3s.yaml`的 kubeconfig 文件用于对 Kubernetes 集群的访问。如果你已经安装了上游的 Kubernetes 命令行工具，如 kubectl 或 helm，你需要用正确的 kubeconfig 路径配置它们。这可以通过导出`KUBECONFIG`环境变量或调用`--kubeconfig`命令行标志来完成。详情请参考下面的例子。

利用 KUBECONFIG 环境变量：

```
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get pods --all-namespaces
helm ls --all-namespaces
```

或者在命令中指定 kubeconfig 文件的位置：

```
kubectl --kubeconfig /etc/rancher/k3s/k3s.yaml get pods --all-namespaces
helm --kubeconfig /etc/rancher/k3s/k3s.yaml ls --all-namespaces
```

## 使用 kubectl 从外部访问集群

将`/etc/rancher/k3s/k3s.yaml`复制到集群外部的计算机上的`~/.kube/config`。然后用你的 K3s 服务器的 IP 或名称替换 "localhost"。`kubectl`现在可以管理你的 K3s 集群了。
