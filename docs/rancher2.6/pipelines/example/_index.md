---
title: 示例 YAML 文件
weight: 501
---

你可以通过 UI 或使用仓库中的 YAML 文件（即 `.rancher-pipeline.yml` 或 `.rancher-pipeline.yaml`）配置管道。

在[管道配置参考]({{<baseurl>}}/rancher/v2.6/en/pipelines/config)中，我们提供了使用 Rancher UI 或 YAML 来配置每个功能的示例。

以下是一个完整的 `rancher-pipeline.yml` 示例，供想要直接使用的用户使用：

```yaml
# 示例
stages:
  - name: Build something
    # 阶段的条件
    when:
      branch: master
      event: [ push, pull_request ]
    # 多个步骤并发运行
    steps:
    - runScriptConfig:
        image: busybox
        shellScript: echo ${FIRST_KEY} && echo ${ALIAS_ENV}
      # 在容器中为步骤设置环境变量
      env:
        FIRST_KEY: VALUE
        SECOND_KEY: VALUE2
      # 从项目密文中设置环境变量
      envFrom:
      - sourceName: my-secret
        sourceKey: secret-key
        targetKey: ALIAS_ENV
    - runScriptConfig:
        image: busybox
        shellScript: date -R
      # 步骤条件
      when:
        branch: [ master, dev ]
        event: push
  - name: Publish my image
    steps:
    - publishImageConfig:
        dockerfilePath: ./Dockerfile
        buildContext: .
        tag: rancher/rancher:v2.0.0
        # 可选择推送到远端镜像仓库
        pushRemote: true
        registry: reg.example.com
  - name: Deploy some workloads
    steps:
    - applyYamlConfig:
        path: ./deployment.yaml
# 管道的分支条件
branch:
  include: [ master, feature/*]
  exclude: [ dev ]
# 以分钟为单位的超时
timeout: 30
notification:
  recipients:
  - # Recipient
    recipient: "#mychannel"
    # Notifier 的 ID
    notifier: "c-wdcsr:n-c9pg7"
  - recipient: "test@example.com"
    notifier: "c-wdcsr:n-lkrhd"
  # 选择发送通知的条件
  condition: ["Failed", "Success", "Changed"]
  # 覆盖默认消息（可选）
  message: "my-message"
```
