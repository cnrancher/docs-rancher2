---
title: "2. 安装Kubernetes"
weight: 200
---

基础设施准备就绪后，您可以继续设置一个 RKE 集群来安装 Rancher。

## 安装 Docker

首先，你必须在所有三个 Linux 节点上安装 Docker 并设置 HTTP 代理。为此在所有三个节点上执行以下步骤。

为方便起见，将代理的 IP 地址和端口导出到一个环境变量中，并为你当前的 shell 设置 HTTP_PROXY 变量：

```shell
export proxy_host="10.0.0.5:8888"
export HTTP_PROXY=http://${proxy_host}
export HTTPS_PROXY=http://${proxy_host}
export NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

接下来配置 apt 在安装包时使用这个代理。如果你没有使用 Ubuntu，你必须相应地调整这一步：

```shell
cat <<'EOF' | sudo tee /etc/apt/apt.conf.d/proxy.conf > /dev/null
Acquire::http::Proxy "http://${proxy_host}/";
Acquire::https::Proxy "http://${proxy_host}/";
EOF
```

现在你可以安装 Docker 了：

```shell
curl -sL https://releases.rancher.com/install-docker/19.03.sh | sh
```

然后确保你的当前用户能够在没有 sudo 的情况下访问 Docker daemon：

```shell
sudo usermod -aG docker YOUR_USERNAME
```

配置 Docker daemon 使用代理来拉取镜像：

```shell
sudo mkdir -p mkdir /etc/systemd/system/docker.service.d
cat <<'EOF' | sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf > /dev/null
[Service]
Environment="HTTP_PROXY=http://${proxy_host}"
Environment="HTTPS_PROXY=http://${proxy_host}"
Environment="NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
EOF
```

要应用配置，请重新启动 Docker daemon。

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 创建 RKE 集群

你需要在主机上有几个命令行工具，在那里你可以通过 SSH 访问 Linux 节点来创建集群并与之交互：

- [RKE CLI binary](/docs/rke/installation/_index)

```shell
sudo curl -fsSL -o /usr/local/bin/rke https://github.com/rancher/rke/releases/download/v1.1.4/rke_linux-amd64
sudo chmod +x /usr/local/bin/rke
```

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

```
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
```

- [helm](https://helm.sh/docs/intro/install/)

```
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
chmod +x get_helm.sh
sudo ./get_helm.sh
```

接下来，创建一个描述 RKE 集群的 YAML 文件。确保节点的 IP 地址和 SSH 用户名是正确的。关于集群 YAML 的更多信息，请查看[RKE 文档](/docs/rke/example-yamls/_index)。

```
nodes:
  - address: 10.0.1.200
    user: ubuntu
    role: [controlplane,worker,etcd]
  - address: 10.0.1.201
    user: ubuntu
    role: [controlplane,worker,etcd]
  - address: 10.0.1.202
    user: ubuntu
    role: [controlplane,worker,etcd]
services:
  etcd:
    backup_config:
      interval_hours: 12
      retention: 6
```

之后，你可以通过运行创建 Kubernetes 集群。

```shell
rke up --config rancher-cluster.yaml
```

RKE 会创建一个名为 "rancher-cluster.rkestate "的状态文件，如果你想进行更新、修改集群配置或从备份中恢复，就需要这个文件。它还创建了一个`kube_config_rancher-cluster.yaml`文件，你可以用这个文件在本地使用 kubectl 或 Helm 等工具连接到远程 Kubernetes 集群。确保将所有这些文件保存在一个安全的位置，例如将它们放到一个版本控制系统中。

要查看你的集群，请运行以下命令：

```shell
export KUBECONFIG=kube_config_rancher-cluster.yaml
kubectl cluster-info
kubectl get pods --all-namespaces
```

你也可以验证你的外部负载均衡器是否工作，DNS 条目是否设置正确。如果你向其中之一发送请求，你应该会收到来自入口控制器的 HTTP 404 响应。

```shell
$ curl 10.0.1.100
default backend - 404
$ curl rancher.example.com
default backend - 404
```

## 保存文件

:::important 重要
需要用以下文件来进行集群维护，集群升级和故障排查。
:::

将以下文件的副本保存在安全的位置：

- `rancher-cluster.yml`： RKE 集群配置文件。
- `kube_config_rancher-cluster.yml`: 集群的[Kubeconfig 文件](/docs/rke/kubeconfig/_index)，此文件包含用于访问集群的凭据。
- `rancher-cluster.rkestate`： [Kubernetes 集群状态文件](/docs/rke/installation/_index)，此文件包含用于完全访问集群的凭据。<br/><br/>_Kubernetes 集群状态文件仅在使用 RKE v0.2.0 或更高版本时创建。_

> **注意：** 后两个文件名的“rancher-cluster”部分取决于您如何命名 RKE 集群的配置文件。

## 问题排查

请参见[故障排查](/docs/rancher2/installation_new/options/troubleshooting/_index)页面。

### 后续步骤

[安装 Rancher](../install-rancher/_index)
