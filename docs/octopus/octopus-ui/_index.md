---
title: Octopus UI
---

:::note 说明
Octopus-UI 当前仅适用于 k3s 集群。
:::

## 从 Helm 图表中安装 Octopus-UI

默认情况下，`Octopus-UI`在 Octopus[Helm 图表](../install/_index)安装时会自动部署，您始终可以使用以下命令将其打开或关闭：

```shell script
$ helm upgrade -n octopus-system --set octopus-ui.enabled=true octopus octopus/octopus
```

## 从 YAML 文件安装 Octopus-UI

通过`all-in-one` YAML 文件来部署 `Octopus-UI`：

```shell script
kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus-api-server/master/deploy/e2e/all_in_one.yaml
```

通过检查其 pod 和服务状态来验证 `Octopus-UI`的状态。

```shell script
kubectl get po -n kube-system -l app.kubernetes.io/name=octopus-ui

NAME                                      READY   STATUS      RESTARTS   AGE
rancher-octopus-api-server-5c845c998b-pj2gr          1/1     Running     1          20s

kubectl get svc -n kube-system -l app.kubernetes.io/name=octopus-ui
NAME              TYPE           CLUSTER-IP    EXTERNAL-IP                PORT(S)          AGE
rancher-octopus-api-server   LoadBalancer   10.43.98.95   172.16.1.89,192.168.0.90   8443:31520/TCP   22s
```

默认情况下，`Octopus-UI`使用服务发现类型为`LoadBalancer`的`8443`端口，您可以通过其`EXTERNAL-IP:8443`来访问它：

![Octopus-UI](/img/octopus/edge-ui.jpg)

## 登入验证

`Octopus-UI`使用 k3s 生成的用户名和密码进行身份验证，您可以从生成的 k3s[[KUBECONFIG]](/docs/k3s/cluster-access/_index)文件中找到它。
