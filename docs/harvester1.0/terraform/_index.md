---
title: Terraform
keywords:
  - Harvester
  - harvester
  - Rancher
  - rancher
  - Terraform
  - Terraform Provider
  - Harvester Terraform 提供程序
  - Harvester Terraform 提供商
description: 本文介绍如何使用 Harvester Terraform Provider。
---

## 要求

- [Terraform](https://www.terraform.io/downloads.html) 版本大于等于 0.13.x
- [Go](https://golang.org/doc/install) 1.16，用来构建 provider 插件

## 安装 provider

### **选项 1：** 从 Terraform [镜像仓库](https://registry.terraform.io/providers/harvester/harvester/latest)下载并安装 provider

要安装这个 provider，请下方代码复制并粘贴到你的 Terraform 配置中。然后，运行 terraform init。

Terraform 0.13+

```text
terraform {
  required_providers {
    harvester = {
      source = "harvester/harvester"
      version = "0.2.9"
    }
  }
}

provider "harvester" {
  # Configuration options
}
```

详情请参见 [Harvester provider 文档](https://registry.terraform.io/providers/harvester/harvester/latest/docs)。

### **选项 2**：手动构建和安装 provider

#### **构建 provider**：

- 运行以下命令来克隆仓库：

  ```
  git clone git@github.com:harvester/terraform-provider-harvester
  ```

- 进入 provider 目录，然后构建 provider。这个操作将构建 provider 并将它的二进制文件放入 `./bin`。命令如下：
  ```
  cd terraform-provider-harvester
  make
  ```

#### **安装 provider:**

- 在本地目录中，目标平台 Harvester provider 的预期位置如下：

  ```
  registry.terraform.io/harvester/harvester/0.2.9/linux_amd64/terraform-provider-harvester_v0.2.9
  ```

- 本地安装的 provider 的默认位置如下，具体位置取决于你运行 Terraform 的操作系统：

  - Windows：`%APPDATA%\terraform.d\plugins`
  - 所有其他系统：`~/.terraform.d/plugins`

- 将 provider 放入 `plugins` 目录，如下：

  ```
  version=0.2.9
  arch=linux_amd64
  terraform_harvester_provider_bin=./bin/terraform-provider-harvester

  terraform_harvester_provider_dir="${HOME}/.terraform.d/plugins/registry.terraform.io/harvester/harvester/${version}/${arch}/"
  mkdir -p "${terraform_harvester_provider_dir}"
  cp ${terraform_harvester_provider_bin} "${terraform_harvester_provider_dir}/terraform-provider-harvester_v${version}"}
  ```

## 使用 provider

将 provider 放入 `plugins` 目录后，运行 `terraform init` 进行初始化。
有关 provider 配置选项的更多信息，请参见 [docs 目录](https://registry.terraform.io/providers/harvester/harvester/latest/docs)。
