---
title: 审计日志
---

## 概述

Kubernetes 审计提供了关于集群的安全相关的时间顺序记录集。Kube-apiserver 执行审计。在其执行的每个阶段的每个请求都会产生一个事件，然后根据一定的策略进行预处理，并写入后端。策略决定了记录的内容，而后端则会将记录持久化。

你可能想配置审计日志，作为遵守 CIS（Center for Internet Security）Kubernetes Benchmark 控制的一部分。

有关配置细节，请参考[Kubernetes 官方文档](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)。

## 默认启用

在 RKE v1.1.0+中，使用特定 Kubernetes 版本时，审计日志是默认启用的。

| RKE 版本 | Kubernetes 版本 | 是否默认启用审计日志 |
| -------- | --------------- | -------------------- |
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
          apiVersion: audit.k8s.io/v1 # This is required.
          kind: Policy
          omitStages:
            - "RequestReceived"
          rules:
            # Log pod changes at RequestResponse level
            - level: RequestResponse
              resources:
                - group: ""
                  # Resource "pods" doesn't match requests to any subresource of pods,
                  # which is consistent with the RBAC policy.
                  resources: ["pods"]
            # Log "pods/log", "pods/status" at Metadata level
            - level: Metadata
              resources:
                - group: ""
                  resources: ["pods/log", "pods/status"]

            # Don't log requests to a configmap called "controller-leader"
            - level: None
              resources:
                - group: ""
                  resources: ["configmaps"]
                  resourceNames: ["controller-leader"]

            # Don't log watch requests by the "system:kube-proxy" on endpoints or services
            - level: None
              users: ["system:kube-proxy"]
              verbs: ["watch"]
              resources:
                - group: "" # core API group
                  resources: ["endpoints", "services"]

            # Don't log authenticated requests to certain non-resource URL paths.
            - level: None
              userGroups: ["system:authenticated"]
              nonResourceURLs:
                - "/api*" # Wildcard matching.
                - "/version"

            # Log the request body of configmap changes in kube-system.
            - level: Request
              resources:
                - group: "" # core API group
                  resources: ["configmaps"]
              # This rule only applies to resources in the "kube-system" namespace.
              # The empty string "" can be used to select non-namespaced resources.
              namespaces: ["kube-system"]

            # Log configmap and secret changes in all other namespaces at the Metadata level.
            - level: Metadata
              resources:
                - group: "" # core API group
                  resources: ["secrets", "configmaps"]

            # Log all other resources in core and extensions at the Request level.
            - level: Request
              resources:
                - group: "" # core API group
                - group: "extensions" # Version of group should NOT be included.

            # A catch-all rule to log all other requests at the Metadata level.
            - level: Metadata
              # Long-running requests like watches that fall under this rule will not
              # generate an audit event in RequestReceived.
              omitStages:
                - "RequestReceived"
```
