---
title: 引导密码
weight: 800
---

Rancher 首次启动时，会为第一个管理员用户随机生成一个密码。当管理员首次登录 Rancher 时，用于获取引导密码（Bootstrap）的命令会在 UI 上显示。管理员需要运行命令并使用引导密码登录。然后 Rancher 会让管理员重置密码。

如果你在安装过程中没有使用变量来设置引导密码，则会随机生成引导密码。如需了解使用变量设置引导密码的详情，请参见下文。

### 在 Helm 安装中指定引导密码

Helm 安装的情况下，你可以使用 `.Values.bootstrapPassword` 在 Helm Chart 值中指定引导密码变量。

密码将存储在 Kubernetes 密文中。安装 Rancher 后，如何使用 kubectl 获取密码的说明将会在 UI 中显示：

```
kubectl get secret --namespace cattle-system bootstrap-secret -o go-template='{{ .data.bootstrapPassword|base64decode}}{{ "\n" }}'
```

### 在 Docker 安装中指定引导密码

如果 Rancher 是使用 Docker 安装的，你可以通过在 Docker 安装命令中传递 `-e CATTLE_BOOTSTRAP_PASSWORD=password` 来指定引导密码。

密码将存储在 Docker 容器日志中。安装 Rancher 后，如何使用 Docker 容器 ID 获取密码的说明将会在 UI 中显示：

```
docker logs  container-id  2>&1 | grep "Bootstrap Password:"
```
