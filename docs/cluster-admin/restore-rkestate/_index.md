---
title: 恢复rkestate状态文件
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
  - 恢复rkestate状态文件
---

Kubernetes集群状态由Kubernetes集群中的集群配置文件`cluster.yml`和`组件证书`组成。由RKE生成，但根据RKE版本不同，集群状态的保存方式不同。

- 在v0.2.0之前，RKE将Kubernetes集群状态保存为`secret`。更新状态时，RKE会提取`secret`，`更新/更改`状态并保存新`secret`。
- 从v0.2.0开始，RKE在集群配置文件`cluster.yml`的同一目录中创建`cluster.rkestate`文件。该`.rkestate`文件包含集群的当前状态，包括`RKE配置和证书`。需要保留此文件以更新集群或通过RKE对集群执行任何操作。

## 1. 状态文件转换

如果是通过`rke v0.2.0`之前版本创建的Kubernetes集群，那么建议升级rke版本到最新版本。

`rke v0.2.0`以前的版本，是通过`pki.bundle.tar.gz`来保存组件证书。而`rke v0.2.0`及以后的版本通过`.rkestate`来保存组件证书。

在rke升级到最新版本后，需要有一个过渡操作。通过原始是rke配置文件，重新运行`rke up`将会自动生成`.rkestate`文件。

## 2. 找回.rkestate

假如`.rkestate`无意间丢失或者损坏，可以通过集群中的配置映射文件恢复.rkestate。

- 通过本地kubectl找回

    如果只是`.rkestate`丢失，kubectl还可以正常连接集群，运行以下命令找回

    ```bash
    kubectl --kubeconfig kube_config_cluster.yml get configmap -n kube-system \
    full-cluster-state -o json | jq -r .data.\"full-cluster-state\" | jq -r . > <rke-config-name>.rkestate
    ```

    >注意: `<rke-config-name>`需要与rke配置文件名相同

- 通过master节点找回

    如果本地的`.rkestate和kubecfg文件一并丢失`，则需要登录到master节点进行恢复

    ```bash
    docker run --rm --net=host \
    -v $(docker inspect kubelet --format '{{ range .Mounts }}{{ if eq .Destination "/etc/kubernetes" }}{{ .Source }}{{ end }}{{ end }}')/ssl:/etc/kubernetes/ssl:ro \
    --entrypoint bash \
    rancher/rancher-agent:v2.2.2 \
    -c 'kubectl --kubeconfig /etc/kubernetes/ssl/kubecfg-kube-node.yaml get configmap \
    -n kube-system full-cluster-state -o json | jq -r .data.\"full-cluster-state\" | jq -r .' > <rke-config-name>.rkestate
    ```

    >注意: `<rke-config-name>`需要与rke配置文件名相同
