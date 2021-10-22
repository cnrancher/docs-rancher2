---
title: "Kubernetes 仪表盘"
description: 本安装指南将帮助您在K3s上部署和配置Kubernetes 仪表盘
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
  - Kubernetes 仪表盘
---

本安装指南将帮助您在 K3s 上部署和配置[Kubernetes 仪表盘](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)。

## 部署 Kubernetes 仪表盘

```bash
GITHUB_URL=https://github.com/kubernetes/dashboard/releases
VERSION_KUBE_DASHBOARD=$(curl -w '%{url_effective}' -I -L -s -S ${GITHUB_URL}/latest -o /dev/null | sed -e 's|.*/||')
sudo k3s kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/${VERSION_KUBE_DASHBOARD}/aio/deploy/recommended.yaml
```

## 仪表盘 RBAC 配置

> **重要：** 本指南中创建的 `admin-user` 将在仪表盘中拥有管理权限。

创建以下资源清单文件：

`dashboard.admin-user.yml`

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
```

`dashboard.admin-user-role.yml`

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: admin-user
    namespace: kubernetes-dashboard
```

部署`admin-user` 配置：

```bash
sudo k3s kubectl create -f dashboard.admin-user.yml -f dashboard.admin-user-role.yml
```

## 获得 Bearer Token

```bash
sudo k3s kubectl -n kubernetes-dashboard describe secret admin-user-token | grep '^token'
```

## 本地访问仪表盘

要访问仪表盘，你必须创建一个安全通道到你的 K3s 集群。

```bash
sudo k3s kubectl proxy
```

现在可以通过以下网址访问仪表盘：

- `http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/`
- 使用`admin-user` Bearer Token `Sign In`

### 高级：远程访问仪表盘

请参阅仪表盘文档。使用[端口转发](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)来访问集群中的应用程序。

## 升级仪表盘

```bash
sudo k3s kubectl delete ns kubernetes-dashboard
GITHUB_URL=https://github.com/kubernetes/dashboard/releases
VERSION_KUBE_DASHBOARD=$(curl -w '%{url_effective}' -I -L -s -S ${GITHUB_URL}/latest -o /dev/null | sed -e 's|.*/||')
sudo k3s kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/${VERSION_KUBE_DASHBOARD}/aio/deploy/recommended.yaml -f dashboard.admin-user.yml -f dashboard.admin-user-role.yml
```

## 删除仪表盘和 admin-user 配置

```bash
sudo k3s kubectl delete ns kubernetes-dashboard
```
