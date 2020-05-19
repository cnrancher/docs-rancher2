---
title: 删除状态为 Failed、Evicted 的 Pod
description:
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 集群管理员指南
  - 集群访问控制
  - 删除状态为Failed、Evicted的Pod
---

```bash
#!/bin/bash
kubectl get pods --all-namespaces -o go-template='{{range .items}} \
{{if eq .status.phase "Failed"}} {{if eq .status.reason "Evicted"}} {{.metadata.name}}{{" "}} {{.metadata.namespace}}{{"\n"}} \
{{end}} \
{{end}} \
{{end}}' | while read epod namespace; do kubectl -n $namespace delete pod $epod; done
```
