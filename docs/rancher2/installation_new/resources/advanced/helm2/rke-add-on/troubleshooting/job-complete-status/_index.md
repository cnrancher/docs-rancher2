---
title: 无法获取 Job 完成状态
description: 插件定义执行过程中有问题，您可以运行以下命令来获取日志查看作业失败的原因。
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
  - 安装指南
  - 资料、参考和高级选项
  - RKE Add-on 安装
  - 高可用 RKE Add-On 安装 常见问题
  - 无法获取 Job 完成状态
---

:::important 重要提示
RKE add-on 安装仅支持 Rancher v2.0.8 之前的版本。
请使用 Rancher helm chart 将 Rancher 安装在 Kubernetes 集群上。有关详细信息，请参见[Rancher 高可用安装](/docs/rancher2/installation_new/install-rancher-on-k8s/_index)。
如果您当前正在使用 RKE add-on 安装方法，参见[将 RKE add-on 安装的 Rancher 迁移到 Helm 安装](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/_index)，获取有关如何使用 Helm chart 的详细信息。
:::

要调试此错误，您需要下载命令行工具 `kubectl`。请参阅[安装和设置 kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)，了解如何在您的平台上下载和配置 `kubectl`。

当您对 `rancher-cluster.yml` 进行更改后，您需要运行 `rke remove --config rancher-cluster.yml` 来清理节点，避免与以前的错误配置产生冲突。

## Failed to deploy addon execute job [rke-user-includes-addons]: Failed to get job complete status

安装插件的 Job 执行有误，您可以运行以下命令来获取日志：

```
kubectl --kubeconfig kube_config_rancher-cluster.yml logs -l job-name=rke-user-addon-deploy-job -n kube-system
```

## error: error converting YAML to JSON: yaml: line 9

`rancher-cluster.yml` 中安装插件 Job 定义有误。您可以根据 `yaml line 9` 所标识的引用行号寻找错误原因。

**需要检查**

- 是否将每个 Base64 编码的证书字符串直接放置在密钥之后，例如: `tls.crt: LS01...`，在此前后和之间确保没有任何换行符。
- YAML 的格式是否正确，缩进应为 **2** 个空格。
- 运行以下命令验证证书的完整性，如果存在任何错误，命令输出将显示。
  - Linux：`cat MyCertificate | base64 -d`
  - Mac OS：`cat MyCertificate | base64 -D`

## Error from server (BadRequest): error when creating “/etc/config/rke-user-addon.yaml”: Secret in version “v1” cannot be handled as a Secret

某个证书的 Base64 编码的字符串有误。日志消息将尝试向您显示字符串的哪一部分未被识别为有效的 Base64 编码。

**需要检查**

通过运行以下命令之一检查 Base64 字符串是否有效：

```

## MacOS

echo BASE64_CRT | base64 -D

## Linux

echo BASE64_CRT | base64 -d

## Windows

certutil -decode FILENAME.base64 FILENAME.verify
```

## The Ingress “cattle-ingress-http” is invalid: spec.rules[0].host: Invalid value: “IP”: must be a DNS name, not an IP address

在 `spec.rules[0].host` 中只能定义一个主机名，因为 ingress controller 需要该名称来匹配请求头中描述的 `Host` ，并传递给正确的应用服务。
