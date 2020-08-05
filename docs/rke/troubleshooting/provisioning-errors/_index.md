---
title: 启动集群报错
---

## Failed to get job complete status 无法获取”job complete“状态

触发这个报错信息的最常见原因是节点内有些问题，阻止了节点内的 job 成功运行。请运行下文的命令，检查节点状态，排查问题。

运行以下命令以列出节点 Conditions，关于节点 Conditions 请查看[节点 Conditions](https://kubernetes.io/docs/concepts/architecture/nodes/#condition)

```shell
kubectl get nodes -o go-template='{{range .items}}{{$node := .}}{{range .status.conditions}}{{$node.metadata.name}}{{": "}}{{.type}}{{":"}}{{.status}}{{"\n"}}{{end}}{{end}}'
```

运行以下命令以列出节点有问题的 Conditions，关于节点 Conditions 请查看[节点 Conditions](https://kubernetes.io/docs/concepts/architecture/nodes/#condition)

```shell
kubectl get nodes -o go-template='{{range .items}}{{$node := .}}{{range .status.conditions}}{{if ne .type "Ready"}}{{if eq .status "True"}}{{$node.metadata.name}}{{": "}}{{.type}}{{":"}}{{.status}}{{"\n"}}{{end}}{{else}}{{if ne .status "True"}}{{$node.metadata.name}}{{": "}}{{.type}}{{": "}}{{.status}}{{"\n"}}{{end}}{{end}}{{end}}{{end}}'
```

输出示例：

```shell
worker-0: DiskPressure:True
```

您也可以运行以下命令，查看日志中是否有关于 job 报错的信息，请将命令中的日志名称`rke-network-plugin-deploy-job`替换为您的日志名称。

```shell
kubectl -n kube-system get pods -l job-name=rke-network-plugin-deploy-job --no-headers -o custom-columns=NAME:.metadata.name | xargs -L1 kubectl -n kube-system logs
```

## Failed to apply the ServiceAccount needed for job execution

因为这个操作需要将运行了`rke up`命令的主机和 controplane 节点连接，这个问题在多数情况下是由于主机代理配置信息有误而造成的。出现这个错误之后返回的信息是由阻止这个请求的代理发出的。请检查`HTTP_PROXY`、`HTTPS_PROXY`和`NO_PROXY`这三个环境变量是否配置正确。如果主机通过配置的代理无法访问 controlplane 节点，请重点检查`NO_PROXY`（要在`NO_PROXY`中添加这个 IP 区间）。
