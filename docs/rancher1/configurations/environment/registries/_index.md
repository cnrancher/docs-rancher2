---
title: 镜像仓库
---

# 镜像仓库

---

您可以在 Rancher 配置镜像仓库的认证信息，使 Rancher 可以访问您的私有镜像仓库(DockerHub, Quay.io 和其他私有镜像库)。
在每个[环境](/docs/rancher1/configuration/environments/_index)中，您可以给每个私有仓库地址配置一个认证信息，从而使 Rancher 可以拉取私有镜像。如果您给同一个镜像仓库配置了多个认证信息，那么 Rancher 只会使用最近添加的一个认证信息。 Rancher 支持在 Cattle 和 Kubernetes 环境中使用多种镜像仓库。

## 添加镜像库

在**基础架构** -> **镜像库** 页面, 点击 **添加镜像库**.

对于不同的镜像库，您都需要提供**邮箱地址**, **用户名**, and **密码**。 对于一个 **自定义** 镜像库, 您还需要提供**镜像库地址**。 点击 **创建**。

> **注意:** 对于自定义的镜像库`地址`，不需要加上 `http://` 或 `https://`，因为我们假设地址只是一个 IP 或者主机名。

如果您对已经存在的镜像仓库地址添加了认证信息，Rancher 会开始使用新的认证信息。

### 不安全的镜像库

为了访问不安全的镜像库，您需要配置主机上的 Docker 守护进程。`DOMAIN` 和 `PORT` 是私有镜像库的域名和端口。

```
# 编辑配置文件"/etc/default/docker"
$ sudo vi /etc/default/docker
# 将这行添加到文件最后，如果已经存在选项，确定您将它添加到当前选项的列表中。
$ DOCKER_OPTS="$DOCKER_OPTS --insecure-registry=${DOMAIN}:${PORT}"
# 重启docker服务
$ sudo service docker restart
```

### 自签名证书

为了在镜像库使用自签名证书，您需要配置主机上的 Docker 守护进程。 `DOMAIN` 和 `PORT` 是私有镜像库的域名和端口。

```
# 下载域名的证书
$ openssl s_client -showcerts -connect ${DOMAIN}:${PORT} </dev/null 2>/dev/null|openssl x509 -outform PEM >ca.crt
# 拷贝证书到合适的目录
$ sudo cp ca.crt /etc/docker/certs.d/${DOMAIN}/ca.crt
# 将证书添加到文件中
$ cat ca.crt | sudo tee -a /etc/ssl/certs/ca-certificates.crt
# 重启docker服务，让改动生效
$ sudo service docker restart

```

#### 使用亚马逊的 ECR 镜像库

在 Rancher 使用亚马逊的 [EC2 容器镜像库](https://aws.amazon.com/ecr/) 需要额外的配置。ECR 使用 AWS 的原生认证服务 IAM 去管理访问权限。AWS 提供了 API，让用户可以基于请求的 IAM 权限为 Docker 生成临时的认证信息。由于认证信息在 12 小时后会无效，每 12 小时需要生成一个新的认证信息。您可以使用[AWS ECR 认证更新器](/docs/rancher1/configuration/environments/registries/ecr_updater/_index) 来发布一个自动更新认证信息的服务。

在 Rancher 中使用该镜像时，请使用 AWS 提供的全名地址，例如:

`aws-account-number.dkr.ecr.us-west-2.amazonaws.com/my-repo:latest`.

### 使用 Google 容器镜像仓库

如果您想使用[Google 容器镜像仓库](https://cloud.google.com/container-registry/)，您需要使用一个[服务账户 JSON 密钥文件](https://cloud.google.com/container-registry/docs/advanced-authentication#using_a_json_key_file)。请给这个文件配置正确的权限，使其可以正常访问容器镜像所在的 Google 云存储服务。

请根据您镜像所在的[区域](https://cloud.google.com/container-registry/docs/pushing-and-pulling#choosing_a_registry_name)来配置您的**镜像仓库地址**。使用`_json_key`作为**用户名**，并且使用服务账户 JSON 密钥文件中的全部内容作为**密码**。

## 使用镜像库

当您添加了镜像库以后，您就可以使用这个私有镜像库的镜像来部署服务和容器。镜像名字的格式和使用`docker run`命令是一样的。

`[registry-name]/[namespace]/[imagename]:[version]`

我们默认您尝试从`DockerHub`拉取镜像。

## 编辑镜像库

一个镜像库的所有操作选项可以通过镜像库列表右边的下拉菜单看到。
对于任意**启用中**的镜像库，您可以**停用**它，停用后 Rancher 将无法访问该镜像库的私有镜像，所以新的容器无法使用该镜像库的私有镜像(已经登陆过该镜像仓库的主机，仍然可以拉取私有镜像)。
对于任意**停用中**的镜像库，您有两个选项。 一个是**启用**，这会允许容器使用镜像库中的镜像。您的环境中的任何成员可以使用您的认证信息，而无需重新输入密码。如果您不想这样，您应该**删除**镜像库，这会从环境中删除镜像库的认证信息。您可以**编辑**任意镜像库，去修改认证信息，但不能改变镜像库的地址。密码不会出现在“编辑”页面中，所以您需要重新输入密码。

> **注意:** 如果一个镜像库无效了(如停用、移除或被新的认证信息覆盖)，任何使用私有镜像的[服务](/docs/rancher1/infrastructure/cattle/adding-services/_index) 会继续运行。 由于镜像已经被拉取到主机上了，因此不会受镜像库的权限变化所影响。因此，扩容的服务或者新的容器都能运行。 当运行容器时，Rancher 不会检查认证信息是否有效，我们假设您已经给了该主机访问该镜像的权限。

## 更改默认的镜像库

任何没有指定镜像库前缀的镜像，Rancher 会默认从 DockerHub 中拉取。通过在 API 中更新配置，可以把默认镜像库从 DockerHub 改到另外一个。

1. 在 **系统管理** -> **系统设置** -> **高级设置**, 点击 **我确认已经知道修改高级设置可能导致问题**.
2. 找到**registry.default** 设置然后点击编辑按钮。
3. 添加镜像库的值然后点击 **保存**.

一旦 **registry.default** 设置被更新，任何没有镜像库前缀的镜像(如 `ubuntu:14.0.4`)会从新的默认镜像库拉取。

如果您使用的私有镜像库需要认证信息，为了使默认镜像库生效，您需要把该镜像库添加到 Rancher 中。

> **注意:** 已存在在环境中的所有服务仍会使用原来的默认镜像库 (如 DockerHub)。为了使基础设施应用使用新的默认镜像库，需要删除它们然后再重新部署它们，这样才能使用新的默认镜像库。您可以通过 **应用商店** -> **官方认证**找到并部署基础设施服务。

## 限制镜像库的使用

默认的，Rancher 可以拉取任何被添加的镜像库里的镜像。但管理员可能想要限制哪个镜像库可以使用。 您可以通过 API 更新配置，来限制哪些镜像库可以用于拉取镜像。

1. 在 **系统管理** -> **系统设置** -> **高级设置**, 点击**我确认已经知道修改高级设置可能导致问题**。
2. 找到 **registry.whitelist** 设置然后点击编辑按钮。
3. 把您想加到白名单中的镜像库加上，如果多于一个，那么镜像库间用逗号分隔。

一旦**registry.whitelist** 设置被更新，在拉取镜像前，会确认镜像所在的镜像库是否在白名单中，如果不是那么拉取会失败。

> **注意:** 一旦您设置了镜像库白名单，您将无法使用 DockerHub。 为了包含 DockerHub， 您需要将`index.docker.io`加到设置中。
