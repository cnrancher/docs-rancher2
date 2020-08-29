---
title: 如何开发适配器
---

## 脚手架

Octopus 提供了一种开发新适配器的简单方法，运行`make template-adaptor`，在`adaptors`目录下获得一个脚手架。 脚手架的覆盖物如下：

```text
tree -d adaptors/<adaptor-name>
├── api                             ---  device model CRD
│   └── v1alpha1                    ------  implement the logic*
├── bin                             ---  output of `go build`
├── cmd                             ---  command entry code
│   └── <adaptor-name>              ------  implement the logic*
├── deploy                          ---  deployment manifest
│   ├── e2e                         ------  output of `kubectl kustomize` and demo cases
│   └── manifests                   ------  overlay for kustomize
├── dist                            ---  output of `go test` and versioned deployment manifest
├── hack                            ---  bash scripts for make rules
├── pkg                             ---  core code
│   ├── adaptor
│   └── <adaptor-name>              ------  implement the logic*
└── test                            ---  test code
    ├── e2e
    └── integration
```

## Build 管理

适配器遵循 Octopus 的构建管理，请查看[开发 Octopus](./develop)以获得更多详细信息。 与 Octopus 一样，Adaptor 的管理过程包括多个阶段和多个操作。 为方便起见，动作名称代表当前阶段。 动作流程的整体关系描述如下：

```text
        generate -> mod -> lint -> build -> package -> deploy
                                       \ -> test -> verify -> e2e
```

执行适配器的阶段可以运行`make adapter <adatpor-name> <stage name>`，例如，当对[dummy](./dummy)适配器执行`test`阶段时，请运行`make adapter dummy test `。

要执行一个阶段，将执行先前序列中的所有动作，如果运行`make adapter dummy test`，则实际上包括执行`generate`，`mod`，`lint`，`build`和`test`动作。

要通过添加`only`命令来运行操作，例如，如果仅运行`build`操作，请使用`make adapter <adatpor-name> build only`。

例如，如果仅通过[`dapper`](https://github.com/rancher/dapper)来运行`build`动作，则通过`BY`环境变量与`dapper`集成。请仅使用`BY=dapper make adapter <adatpor-name> build`。

## 贡献者工作流程

欢迎进行贡献，请查看[CONTRIBUTING](https://github.com/cnrancher/octopus/blob/master/CONTRIBUTING.md)以获取更多详细信息。
