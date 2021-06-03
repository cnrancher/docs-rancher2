# Cluster Access

存储在`/etc/rancher/rke2/rke2.yaml`的 kubeconfig 文件用来配置对 Kubernetes 集群的访问。 如果你已经安装了上游的 Kubernetes 命令行工具，如 kubectl 或 helm，你将需要用正确的 kubeconfig 路径配置它们。这可以通过导出`KUBECONFIG`环境变量或调用`--kubeconfig`命令行标志来完成。详情请参考下面的例子。

注意，一些工具，如 kubectl，默认安装在`/var/lib/rancher/rke2/bin`。

利用 KUBECONFIG 的环境变量：

```
export KUBECONFIG=/etc/rancher/rke2/rke2.yaml
kubectl get pods --all-namespaces
helm ls --all-namespaces
```

或者在命令中指定 kubeconfig 文件的位置：

```
kubectl --kubeconfig /etc/rancher/rke2/rke2.yaml get pods --all-namespaces
helm --kubeconfig /etc/rancher/rke2/rke2.yaml ls --all-namespaces
```

### 使用 kubectl 从外部访问集群

将`/etc/rancher/rke2/rke2.yaml`复制到你位于集群外的机器上，作为`~/.kube/config`。然后将`127.0.0.1`替换为你的 RKE2 服务器的 IP 或主机名。`kubectl`现在可以管理你的 RKE2 集群了。
