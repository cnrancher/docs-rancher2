---
title: 删除状态为 Failed、Evicted 的 Pod
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
