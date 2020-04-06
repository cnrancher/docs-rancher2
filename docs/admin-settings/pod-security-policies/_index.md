---
title: Pod 安全策略
---

**Pod 安全策略** (PSP) 是控制 Pod 安全的规范（如是否可以使用 root 权限等）的对象。如果 Pod 不符合 PSP 中指定的条件，Kubernetes 将不允许其启动，并且 Rancher 中将显示错误消息`Pod <NAME> is forbidden: unable to validate...`。

> 注意：
> 给集群分配 Pod 安全策略的功能，仅在 RKE 集群中可用。

- 您可以在集群或项目级别分配 PSP。
- PSP 通过继承的方式工作。

  - 默认情况下，分配给集群的 PSP 由其项目以及添加到这些项目的任何命名空间继承。
  - **例外：** 无论 PSP 是分配给集群还是项目，未分配给项目的命名空间不会继承 PSP。由于这些命名空间没有 PSP，因此将工作负载部署到这些命名空间将失败，这是 Kubernetes 的默认行为。
  - 您可以通过直接向项目分配其他 PSP 来覆盖默认 PSP。

- 在分配 PSP 之前，集群或项目中已经在运行的任何工作负荷是否符合 PSP 的规定，将不会进行检查。需要克隆或升级工作负载以查看它们是否通过了 PSP。

> **注意：** 必须先在集群级别启用 PSP，然后才能将它们分配给项目。可以通过[编辑集群](/docs/cluster-admin/editing-clusters/_index)进行配置。

在 [Kubernetes 文档](https://kubernetes.io/docs/concepts/policy/pod-security-policy/)中了解有关 Pod 安全策略的更多信息。

> **最佳实践：** 在集群级别设置 Pod 安全策略。

您可以使用 Rancher UI 创建 Pod 安全策略，而不必使用 YAML 文件。

## 默认 Pod 安全策略

_自 v2.0.7 起可用_

Rancher 内置了两个默认的 Pod 安全策略（PSP）：`受限制的`和`不受限制的`策略。

- `受限制的`

  该策略基于 Kubernetes [示例受限策略](https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/policy/restricted-psp.yaml)。它极大地限制了可以将哪些类型的 Pod 部署到集群或项目中。这项策略：

  - 阻止 Pod 以特权用户身份运行，并防止特权升级。
  - 验证服务器所需的安全性机制是否到位(例如，限制哪些卷可以被挂载，以及防止添加 root 补充组)。

- `不受限制的`

  该策略等效于在禁用 PSP 控制器的情况下运行 Kubernetes。对于可以将哪些 Pod 部署到集群或项目中，它没有任何限制

## 创建 Pod 安全策略

1. 在**全局**视图中，从主菜单中选择**安全性 > Pod 安全策略**。然后点击**添加策略**。

**步骤结果：** 将打开**添加策略**表单。

2.  命名策略。

3.  填写表格的每个部分。请参阅下面 Kubernetes 文档的链接，以获取有关每个策略的作用的更多信息。

    - 基本策略：

      - [提升权限](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#privilege-escalation)
      - [主机空间][2]
      - [只读根文件系统][1]

    - [能力策略](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#capabilities)
    - [卷策略][1]
    - [允许的主机路径策略][1]
    - [文件系统组策略][1]
    - [主机端口策略][2]
    - [允许的用户策略][3]
    - [SELinux 策略](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#selinux)
    - [附加组策略][3]

## 下一步是什么？

您可以在以下上下文中添加 Pod 安全策略（PSP)：

- [创建集群时](/docs/cluster-provisioning/rke-clusters/options/pod-security-policies/_index)
- [编辑现有集群时](/docs/cluster-admin/editing-clusters/_index)
- [创建项目时](/docs/cluster-admin/projects-and-namespaces/_index)
- [编辑现有项目时](/docs/project-admin/_index)

> **注意：** 我们建议在集群和项目创建期间添加 PSP，而不是将 PSP 添加到现有的集群和项目中。

<!-- links -->

[1]: https://kubernetes.io/docs/concepts/policy/pod-security-policy/#volumes-and-file-systems
[2]: https://kubernetes.io/docs/concepts/policy/pod-security-policy/#host-namespaces
[3]: https://kubernetes.io/docs/concepts/policy/pod-security-policy/#users-and-groups
