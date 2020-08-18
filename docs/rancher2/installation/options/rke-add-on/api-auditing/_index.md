---
title: 启用 API 审计日志
description: 如果使用 RKE 安装 Rancher，则可以使用指令为 Rancher 安装启用 API 审计日志。您可以知道容器中发生了什么事件，何时发生，事件发起人是谁以及它影响了哪些集群。API 审计日志记录了与 Rancher API 之间的所有请求和响应，包括对 Rancher UI 的使用以及通过程序使用对 Rancher API 的任何其他使用。
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
  - 安装指南
  - 资料、参考和高级选项
  - RKE Add-on 安装
  - 启用 API 审计日志
---

:::important 重要提示
RKE add-on 安装仅支持 Rancher v2.0.8 之前的版本。
请使用 Rancher helm chart 将 Rancher 安装在 Kubernetes 集群上。有关详细信息，请参见[Rancher 高可用安装](/docs/installation/k8s-install/_index)。
如果您当前正在使用 RKE add-on 安装方法，参见[将 RKE add-on 安装的 Rancher 迁移到 Helm 安装](/docs/upgrades/upgrades/migrating-from-rke-add-on/_index)，获取有关如何使用 Helm chart 的详细信息。
:::

如果使用 RKE 安装 Rancher，则可以使用指令为 Rancher 安装启用 API 审计日志。您可以知道容器中发生了什么事件，何时发生，事件发起人是谁以及它影响了哪些集群。API 审计日志记录了与 Rancher API 之间的所有请求和响应，包括对 Rancher UI 的使用以及通过程序使用对 Rancher API 的任何其他使用。

## 内联参数

通过向 Rancher 容器添加参数来使用 RKE 启用 API 审计日志。

启用 API 审计日志的的先决条件如下：

- 将 API 审计日志 参数 (`args`) 添加到 Rancher 容器中。
- 在容器的 `volumeMounts` 指令中声明一个 `mountPath`。
- 在 `volumes` 指令中声明一个 `path`。

有关每个参数的说明、使用参数的语法以及如何查看 API 审计日志的更多信息，请参阅[Rancher v2.0 文档：API 审计日志](/docs/installation/options/api-audit-log/_index)。

```yaml
...
containers:
        - image: rancher/rancher:latest
          imagePullPolicy: Always
          name: cattle-server
          args: ["--audit-log-path", "/var/log/auditlog/rancher-api-audit.log", "--audit-log-maxbackup", "5", "--audit-log-maxsize", "50", "--audit-level", "2"]
          ports:
          - containerPort: 80
            protocol: TCP
          - containerPort: 443
            protocol: TCP
          volumeMounts:
          - mountPath: /etc/rancher/ssl
            name: cattle-keys-volume
            readOnly: true
          - mountPath: /var/log/auditlog
            name: audit-log-dir
        volumes:
        - name: cattle-keys-volume
          secret:
            defaultMode: 420
            secretName: cattle-keys-server
        - name: audit-log-dir
          hostPath:
            path: /var/log/rancher/auditlog
            type: Directory
```
