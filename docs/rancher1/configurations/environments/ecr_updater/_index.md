---
title: AWS ECR证书更新器
---

# AWS ECR 证书更新器

ECR 证书更新器是一个容器服务，它会间歇性自动测验 AWS ECR API 并拉取新的 Docker 注册证书. 更新器通过 IAM 证书向 AWS 验证，IAM 证书能让更新器获取请求 Docker 证书的权限。Docker 证书假设发起请求的 IAM 用户有相同的镜像仓库权限。IAM 用户至少要有对所有 ECR 镜像库的读权限用户才能在 Rancher 中从代码库拉取镜像. 请查阅 [Amazon ECR IAM Policies and Roles](http://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_IAM_policies.html) 获取关于许可权的详情。

> **注意:**: 如果不启动 ECR 更新器。任何添加到 Rancher 的注册 token 都会过期，以至不能再拉取镜像.

## 安装 ECR 更新器

### 已存在环境(Environment)

如果您已经有一个正在运行的 Cattle 环境，到
**应用商店** -> **官方认证** 下找到 **Rancher ECR 证书更新器**. 启动这个应用商店应用时, 您需要配置服务的 AWS 访问密钥。
这些您已经提供了合适的访问策略密钥因该给用户使用。

> **注意:** 如果您要用 Kubernetes, 我们推荐您编辑环境模版，并在创建环境前把这个模版添加到环境模版中。如果您已经有了一个 Kubernetes, 您可以删除这个 Kubernetes 应用， 这样就可以把它转成 Cattle 来启动应用商店应用，同时在应用商店中重新启动这个 Kubernetes。

### 新环境

您可以用[环境模版](/docs/rancher1/configurations/environments/_index#什么是环境模版)创建一个新环境。这个新创建的环境已经有激活了的 **Rancher ECR 证书更新器** 模版。这样可就以用这个模版在任何环境中部署这个更新器了。

## 从 ECR 中启动镜像

在这个环境中，您需要添加 ECR 作为一个 [镜像库](/docs/rancher1/configurations/environments/registries/_index). 一旦您启动了这个服务，您的 ECR 证书将永远不会失效，这样就可以永远从 ECR 中启动镜像了。

在 Rancher 中指定镜像名时，使用 AWS 提供完整的限定地址。 比如 `aws-account-number.dkr.ecr.us-west-2.amazonaws.com/my-repo:latest`。

## IAM 策略示例

下面是一个您可能在服务的准生产遇到的泛例。这个示例中，Rancher 能够在各自的 AWS 账号中拉取镜像。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:GetRepositoryPolicy",
        "ecr:DescribeRepositories",
        "ecr:ListImages",
        "ecr:DescribeImages",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}
```
