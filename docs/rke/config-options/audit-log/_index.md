---
title: 审计日志
description: Kubernetes 审计提供了关于集群的安全相关的时间顺序记录集。Kube-apiserver 执行审计，每个请求都会产生一个事件，然后根据一定的策略进行预处理，并写入后端。策略决定了记录的内容，而后端则会将记录持久化。
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
  - 配置选项
  - 审计日志
---

## 概述

Kubernetes 审计提供了关于集群的安全相关的时间顺序记录集。Kube-apiserver 执行审计，每个请求都会产生一个事件，然后根据一定的策略进行预处理，并写入后端。策略决定了记录的内容，而后端则会将记录持久化。

为了遵守 CIS（Center for Internet Security）Kubernetes Benchmark，您需要配置审计日志。

有关配置细节，请参考[Kubernetes 官方文档](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)。

## 默认启用

在 RKE v1.1.0+中，使用特定 Kubernetes 版本时，审计日志是默认启用的。

| RKE 版本 | Kubernetes 版本 | 是否默认启用审计日志 |
| :------- | :-------------- | :------------------- |
| v1.1.0+  | v1.17.4+        | 是                   |
| v1.1.0 + | v1.16.8+        | 是                   |
| v1.1.0 + | v1.15.11+       | 是                   |

## YAML 配置示例

在`cluster.yml`中使用以下配置可以默认启用审计日志：

```yaml
services:
  kube-api:
    audit_log:
      enabled: true
```

启用审计日志后，可以在`/etc/kubernetes/audit-policy.yaml`中看到默认值（在 RKE v1.1.0 之前，路径是`/etc/kubernetes/audit.yaml`）。

```yaml
# 最简单的审计日志配置：采集事件元数据
---
rules:
  - level: Metadata
```

启用审计日志后，还将为审计日志路径、最大年龄、最大备份数量、最大大小（兆字节）和格式设置默认值。请运行以下命令查看默认值：

```
ps -ef | grep kube-apiserver
```

在 RKE v1.1.0 中，审计日志的默认值为：

```yaml
--audit-log-maxage=5 # 保留旧审计日志文件的最长天数
--audit-log-maxbackup=5 # 保留旧审计日志文件的最大数量
--audit-log-path=/var/log/kube-audit/audit-log.json # 日志后端用于写入审计事件的日志文件路径
--audit-log-maxsize=100 # 审计日志文件在被替换之前的最大大小（MB）
--audit-policy-file=/etc/kubernetes/audit.yaml # 包含您的审计日志规则的文件
--audit-log-format=json # 日志文件格式

```

您可以使用`configuration`自定义审计日志。

规则策略通过`--audit-policy-file`或`cluster.yml`中的`policy`指令传递给 kube-apiserver。下面是一个例子`cluster.yml`，其中包含自定义值和嵌套在`configuration`指令下的审计日志策略。这个审计日志策略示例来自官方[Kubernetes 文档](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/#audit-policy)。

```yaml
services:
  kube-api:
    audit_log:
      enabled: true
      configuration:
        max_age: 6
        max_backup: 6
        max_size: 110
        path: /var/log/kube-audit/audit-log.json
        format: json
        policy:
          apiVersion: audit.k8s.io/v1 # 必填
          kind: Policy
          omitStages:
            - "RequestReceived"
          rules:
            # 在RequestResponse级别记录pod变化
            - level: RequestResponse
              resources:
                - group: ""
                  # 资源 "pods "不匹配对pods的任何子资源的请求
                  # 与RBAC策略是一致的
                  resources: ["pods"]
            # 在元数据层记录 "pods/log"、"pods/status"
            - level: Metadata
              resources:
                - group: ""
                  resources: ["pods/log", "pods/status"]

            # 不要将请求记录到名为 "controller-leader "的配置图上
            - level: None
              resources:
                - group: ""
                  resources: ["configmaps"]
                  resourceNames: ["controller-leader"]

            # 不要在端点或服务上记录 "system:keube-proxy "的监视请求
            - level: None
              users: ["system:kube-proxy"]
              verbs: ["watch"]
              resources:
                - group: "" # core API group
                  resources: ["endpoints", "services"]

            # 不要记录对某些非资源URL路径的认证请求
            - level: None
              userGroups: ["system:authenticated"]
              nonResourceURLs:
                - "/api*" # Wildcard matching.
                - "/version"

            # 在kube-system中记录configmap变更的请求体
            - level: Request
              resources:
                - group: "" # core API group
                  resources: ["configmaps"]
              # 此规则只适用于 "kube-system "命名空间中的资源
              # 空字符串""可用于选择非命名间隔的资源
              namespaces: ["kube-system"]

            # 在元数据级别记录所有其他命名空间的configmap和密钥变化
            - level: Metadata
              resources:
                - group: "" # core API group
                  resources: ["secrets", "configmaps"]

            # 在请求层记录核心和扩展的所有其他资源
            - level: Request
              resources:
                - group: "" # core API group
                - group: "extensions" # 不应包括组的版本

            # 一个全面的规则，用于记录元数据级别的所有其他请求
            - level: Metadata
              # 在此规则下，像监控这样的长期运行的请求不会在RequestReceived中产生审计事件
              omitStages:
                - "RequestReceived"
```
