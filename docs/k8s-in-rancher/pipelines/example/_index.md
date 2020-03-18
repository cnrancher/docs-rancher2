---
title: YAML 文件示例
---

流水线（Pipelines）能够通过 Rancher UI 或者使用代码仓库中的 YMAL 文件，即 `.rancher-pipeline.yml` 或 `.rancher-pipeline.yaml` 的方式进行配置。

在 pipeline 配置文档中，我们提供了流水线（Pipelines）每个可用特性的示例。这是一个完整的示例供大家使用参考。

```yaml
## example
stages:
  - name: Build something
    # 阶段条件
    when:
      branch: master
      event: [push, pull_request]
    # 多步骤同时运行
    steps:
      - runScriptConfig:
          image: busybox
          shellScript: echo ${FIRST_KEY} && echo ${ALIAS_ENV}
        # 该步骤为容器设置环境变量
        env:
          FIRST_KEY: VALUE
          SECOND_KEY: VALUE2
        # 设置导入项目密钥的环境变量
        envFrom:
          - sourceName: my-secret
            sourceKey: secret-key
            targetKey: ALIAS_ENV
      - runScriptConfig:
          image: busybox
          shellScript: date -R
        # 阶段条件
        when:
          branch: [master, dev]
          event: push
  - name: Publish my image
    steps:
      - publishImageConfig:
          dockerfilePath: ./Dockerfile
          buildContext: .
          tag: rancher/rancher:v2.0.0
          #（可选项）推送镜像到远程镜像库
          pushRemote: true
          registry: reg.example.com
  - name: Deploy some workloads
    steps:
      - applyYamlConfig:
          path: ./deployment.yaml
## Pipeline分支条件
branch:
  include: [master, feature/*]
  exclude: [dev]
## 超时（单位：分钟）
timeout: 30
notification:
  recipients:
    - # 接收者
      recipient: '#mychannel'
      # 通知者ID
      notifier: 'c-wdcsr:n-c9pg7'
    - recipient: 'test@example.com'
      notifier: 'c-wdcsr:n-lkrhd'
  # 选择您要发送通知的状态
  condition: ['Failed', 'Success', 'Changed']
  #（可选项）覆盖默认消息
  message: 'my-message'
```
