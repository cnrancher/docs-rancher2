---
title: '2. 安装 Kubernetes'
weight: 200
---

基础设施配置好后，你可以设置一个 RKE 集群来安装 Rancher。

### 安装 Docker

首先，你需要在所有三个 Linux 节点上安装 Docker 并设置 HTTP 代理。因此，你可以在这三个节点上执行以下步骤。

为方便起见，将代理的 IP 地址和端口导出到一个环境变量中，并为你当前的 shell 设置 HTTP_PROXY 变量：

```
export proxy_host="10.0.0.5:8888"
export HTTP_PROXY=http://${proxy_host}
export HTTPS_PROXY=http://${proxy_host}
export NO_PROXY=127.0.0.0/8,10.0.0.0/8,cattle-system.svc,172.16.0.0/12,192.168.0.0/16
```

接下来配置 apt 以在安装包时使用这个代理。如果你使用的不是 Ubuntu，请相应调整步骤。

```
cat <<'EOF' | sudo tee /etc/apt/apt.conf.d/proxy.conf > /dev/null
Acquire::http::Proxy "http://${proxy_host}/";
Acquire::https::Proxy "http://${proxy_host}/";
EOF
```

安装 Docker：

```
curl -sL https://releases.rancher.com/install-docker/19.03.sh | sh
```

然后，确保你的当前用户能够在没有 sudo 的情况下访问 Docker Daemon：

```
sudo usermod -aG docker YOUR_USERNAME
```

配置 Docker Daemon 使用代理来拉取镜像：

```
sudo mkdir -p /etc/systemd/system/docker.service.d
cat <<'EOF' | sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf > /dev/null
[Service]
Environment="HTTP_PROXY=http://${proxy_host}"
Environment="HTTPS_PROXY=http://${proxy_host}"
Environment="NO_PROXY=127.0.0.0/8,10.0.0.0/8,cattle-system.svc,172.16.0.0/12,192.168.0.0/16"
EOF
```

要应用配置，请重新启动 Docker Daemon：

```
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 创建 RKE 集群

在能通过 SSH 访问 Linux 节点的主机上，你需要有几个命令行工具，来创建集群并与之交互：

* [RKE CLI binary]({{<baseurl>}}/rke/latest/en/installation/#download-the-rke-binary)

```
sudo curl -fsSL -o /usr/local/bin/rke https://github.com/rancher/rke/releases/download/v1.1.4/rke_linux-amd64
sudo chmod +x /usr/local/bin/rke
```

* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

```
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
```

* [helm](https://helm.sh/docs/intro/install/)

```
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
chmod +x get_helm.sh
sudo ./get_helm.sh
```

接下来，创建一个描述 RKE 集群的 YAML 文件。确保节点的 IP 地址和 SSH 用户名是正确的。有关集群 YAML 的详情，请参见 [RKE 官方文档]({{<baseurl>}}/rke/latest/en/example-yamls/)。

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

之后，你可以通过运行以下命令来创建 Kubernetes 集群：

```
rke up --config rancher-cluster.yaml
```

RKE 会创建一个名为 `rancher-cluster.rkestate` 的状态文件。如果你需要更新或修改集群配置，或使用备份恢复集群，则需要使用该文件。RKE 还会创建一个 `kube_config_cluster.yaml` 文件，你可以使用该文件在本地使用 kubectl 或 Helm 等工具连接到远端的 Kubernetes 集群。请将这些文件保存在安全的位置，例如版本控制系统中。

如需查看集群，请运行以下命令：

```
export KUBECONFIG=kube_config_cluster.yaml
kubectl cluster-info
kubectl get pods --all-namespaces
```

你也可以验证你的外部负载均衡器是否工作，DNS 条目是否设置正确。如果你向其中之一发送请求，你会收到来自 Ingress Controller 的 HTTP 404 响应：

```
$ curl 10.0.1.100
default backend - 404
$ curl rancher.example.com
default backend - 404
```

### 保存你的文件

> :::important 重要提示
> 请妥善保管以下文件，以对集群进行维护，故障排查和升级。
> :::

将以下文件的副本保存在安全位置：

- `rancher-cluster.yml`：RKE 集群配置文件。
- `kube_config_cluster.yml`：集群的 [Kubeconfig 文件]({{<baseurl>}}/rke/latest/en/kubeconfig/)。该文件包含可完全访问集群的凭证。
- `rancher-cluster.rkestate`：[Kubernetes 集群状态文件]({{<baseurl>}}/rke/latest/en/installation/#kubernetes-cluster-state)。此文件包含集群的当前状态，包括 RKE 配置和证书。

> :::note 注意
> 后两个文件名中的 `rancher-cluster` 部分取决于你命名 RKE 集群配置文件的方式。
> :::

### 故障排查

参见[故障排查]({{<baseurl>}}/rancher/v2.6/en/installation/resources/troubleshooting/)页面。

### 后续操作
[安装 Rancher](../install-rancher)
