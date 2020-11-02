---
title: K8s Ingress Controllers
---

默认情况下，RKE 会在所有可调度节点上部署 NGINX ingress controller。

> **说明：** 从 v0.1.8 开始，只有 worker 节点是可调度节点，但在 v0.1.8 之前， worker 节点和 controlplane 节点都是是可调度节点。

RKE 将以 DaemonSet 的形式部署 Ingress Controller，并使用 `hostnetwork: true`，因此在部署控制器的每个节点上都会打开 `80`和`443`端口。

Ingress Controller 使用的镜像在[系统镜像](/docs/rke/config-options/system-images/_index)中。对于每个 Kubernetes 版本，都有与 Ingress Controller 相关联的默认镜像，这些镜像可以通过更改`system_images`中的镜像标签来覆盖默认设置。

## 调度 Ingress Controller

如果只想在特定的节点上部署 Ingress Controller ，可以在`dns`部分设置一个`node_selector`。`node_selector`中的标签需要与要部署 Ingress Controller 的节点上的标签相匹配。

```yaml
nodes:
  - address: 1.1.1.1
    role: [controlplane, worker, etcd]
    user: root
    labels:
      app: ingress

ingress:
  provider: nginx
  node_selector:
    app: ingress
```

## 禁用默认 Ingress Controller

您可以在集群配置中的 Ingress`provider`设置为`none`，禁用默认的 Ingress Controller。

```yaml
ingress:
  provider: none
```

## 配置 NGINX Ingress Controller

Kubernetes 中有 NGINX 选项：[NGINX 配置图的选项列表](https://github.com/kubernetes/ingress-nginx/blob/master/docs/user-guide/nginx-configuration/configmap.md)、[命令行 extra_args](https://github.com/kubernetes/ingress-nginx/blob/master/docs/user-guide/cli-arguments.md)和[注释](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/)。

```yaml
ingress:
  provider: nginx
  options:
    map-hash-bucket-size: "128"
    ssl-protocols: SSLv2
  extra_args:
    enable-ssl-passthrough: ""
```

## 配置 NGINX 默认证书

在配置具有 TLS 终止功能的 ingress 对象时，必须为其提供用于加密/解密的证书。与其在每次配置 ingress 时明确定义证书，不如设置一个默认使用的自定义证书。

在使用通配符证书的环境中，设置默认证书特别有用，因为该证书可以应用在多个子域中。

> **先决条件**
>
> - 访问用于创建集群的`cluster.yml`。
> - 你将使用的 PEM 编码证书作为默认证书。

1. 获取或生成 PEM 编码形式的证书密钥对。

2. 运行以下命令，从你的 PEM 编码证书中生成一个 Kubernetes 密钥，用`mycert.cert`和`mycert.key`代替你的证书。

   ```
   kubectl -n ingress-nginx create secret tls ingress-default-cert --cert=mycert.cert --key=mycert.key -o yaml --dry-run=true > ingress-default-cert.yaml
   ```

3. 将 `ingress-default-cert.yml`的内容嵌入到 RKE 的`cluster.yml`文件中：

   ```yaml
   addons: |-
     ---
     apiVersion: v1
     data:
       tls.crt: [ENCODED CERT]
       tls.key: [ENCODED KEY]
     kind: Secret
     metadata:
       creationTimestamp: null
       name: ingress-default-cert
       namespace: ingress-nginx
     type: kubernetes.io/tls
   ```

4. 用下面的`default-ssl-certificate`参数定义你的 ingress 资源，它引用了我们之前在`cluster.yml`中`extra_args`下创建的密钥。

   ```yaml
   ingress:
     provider: "nginx"
     extra_args:
       default-ssl-certificate: "ingress-nginx/ingress-default-cert"
   ```

5. **可选：** 如果想将默认证书应用到已经存在的集群中的入口，必须删除 NGINX 入口控制器 pods，让 Kubernetes 使用新配置的`extra_args`调度新的 pods。
   ```
   kubectl delete pod -l app=ingress-nginx -n ingress-nginx
   ```
