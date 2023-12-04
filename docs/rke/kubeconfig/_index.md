---
title: kubeconfig文件
description: 与 Kubernetes 集群通信前，您需要在本地机器中下载和安装`kubectl`文件。
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
  - RKE
  - kubeconfig文件
---

与 Kubernetes 集群通信前，您需要在本地机器中下载和安装`kubectl`文件，请单击[此处](https://kubernetes.io/docs/tasks/tools/install-kubectl/)下载`kubectl`。

kubeconfig 文件，即 kubeconfig file，是用于配置集群访问的文件的统称，这并不意味着真的有一个名为“kubeconfig”的文件。例如，在部署 Kubernetes 集群的时候，RKE 会自动生成一个名为`kube_config_cluster.yml`的文件用于配置集群访问，那么这个文件就是是 RKE 使用的 kubeconfig 文件。

您可以配合 kubectl 命令行工具使用 kubeconfig 文件，详情请参考[Kubernetes 官方文档](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)。

> **说明：**如果您没有修改 RKE 默认配置，RKE 自动生成的 kubeconfig 文件文件会保存在`~/.kube/config`路径，kubectl 会检查该路径下是否存在 kubeconfig 文件`kube_config_cluster.yml`。如果您将 kubeconfig 文件保存在其他路径，可以输入以下命令，使 kubectl 使用其他路径下的 kubeconfig 文件配置集群访问。
>
> ```shell
> kubectl --kubeconfig /custom/path/kube.config get pods
> ```

运行以下命令，检查 Kubernetes 机器的版本，以确认 kubectl 的工作状态：

```shell

kubectl --kubeconfig kube_config_cluster.yml version

Client Version: version.Info{Major:"1", Minor:"10", GitVersion:"v1.10.0", GitCommit:"fc32d2f3698e36b93322a3465f63a14e9f0eaead", GitTreeState:"clean", BuildDate:"2018-03-27T00:13:02Z", GoVersion:"go1.9.4", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"8+", GitVersion:"v1.8.9-rancher1", GitCommit:"68595e18f25e24125244e9966b1e5468a98c1cd4", GitTreeState:"clean", BuildDate:"2018-03-13T04:37:53Z", GoVersion:"go1.8.3", Compiler:"gc", Platform:"linux/amd64"}

```

如果返回的信息中包含了 client 端和 server 端的版本号，则表示您在本地有一个`kubectl`client 端，并且能够使用它从新建的集群获取 server 版本号，kubectl 处于正常状态。现在您可以在 kubectl 命令行工具中使用[kubectl 命令](https://kubernetes.io/docs/reference/kubectl/kubectl/)控制集群，就像请求集群中的节点一样。

```shell

kubectl --kubeconfig kube_config_cluster.yml get nodes
NAME STATUS ROLES AGE VERSION
10.0.0.1 Ready controlplane,etcd,worker 35m v1.10.3-rancher1

```
