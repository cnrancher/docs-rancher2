---
title: CI/CD 流水线
---

使用 Rancher，您可以与 GitHub 等版本控制系统集成，以设置持续集成（CI）流水线。

配置 Rancher 和 GitHub 等版本控制系统后，Rancher 将部署运行 Jenkins 的容器以自动化执行流水线：

- 构建镜像
- 验证镜像
- 部署镜像到集群
- 执行单元测试
- 执行回归测试

有关详细信息，请参阅[流水线](/docs/k8s-in-rancher/pipelines/_index)。
