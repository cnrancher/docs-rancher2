---
title: cli
---

# 安装

Rancher 的命令行界面(CLI)是用来管理 Rancher Server 的工具。 使用此工具，您可以管理您的[环境](/docs/rancher1/configurations/environments/_index)，[主机](/docs/rancher1/infrastructure/hosts/_index)，应用，服务和容器。

二进制文件可以直接从 UI 下载。 该链接可以在 UI 中的页脚右侧找到。 我们有 Windows，Mac 和 Linux 的二进制文件。 您还可以查看我们 CLI 的[发布页面](https://github.com/rancher/cli/releases) ，您可以从该页面直接下载二进制文件。

## 配置 Rancher 命令行界面

有几种方法可以配置 Rancher 命令行界面与 Rancher 进行交互时使用的参数。这些参数包括 Rancher URL 和帐户 API 密钥等。帐户的 API 密钥可以在 UI 中的**API**中创建。

参数配置有如下的加载优先级。

1. 在执行`rancher config`时，您需要设置 Rancher URL 和 API 密钥。如果您有多个环境，那么您可以选择一个默认环境。
2. 您可以在环境变量中设置相关参数，这将覆盖`rancher config`中设置的值。
3. 您可以将参数值直接传递给 Rancher 命令行，那么这些值将覆盖其他方式配置的参数。

### 使用 Rancher 配置命令

您可以运行`rancher config`来设置与 Rancher Server 连接的配置

```bash
$ rancher config
URL []: http://<server_ip>:8080
Access Key []: <accessKey_of_account_api_key>
Secret Key []:  <secretKey_of_account_api_key>
# If there are more than one environment,
# you will be asked to select which environment to work with
Environments:
[1] Default(1a5)
[2] k8s(1a10)
Select: 1
INFO[0017] Saving config to /Users/<username>/.rancher/cli.json
```

### 使用环境变量

您可以设置以下环境变量`RANCHER_URL`，`RANCHER_ACCESS_KEY`和`RANCHER_SECRET_KEY`。

```bash
# Set the url that Rancher is on
$ export RANCHER_URL=http://<server_ip>:8080
# Set the access key, i.e. username
$ export RANCHER_ACCESS_KEY=<accessKey_of_account_api_key>
# Set the secret key, i.e. password
$ export RANCHER_SECRET_KEY=<secretKey_of_account_api_key>
```

如果您的 Rancher Server 中有多个环境，您还需要设置一个环境变量来选择默认环境，即“RANCHER_ENVIRONMENT”。

```bash
# Set the environment to use, you can use either environment ID or environment name
$ export RANCHER_ENVIRONMENT=<environment_id>
```

### 可选参数传递

如果您选择不运行`rancher config`或设置环境变量，那么您可以传递相同的值作为`rancher`命令参数选项的一部分。

```bash
$ rancher --url http://server_ip:8080 --access-key <accessKey_of_account_api_key> --secret-key <secretKey_of_account_api_key> --env <environment_id> ps
```

## 使用 Rancher 命令行界面调试

当您使用 Rancher 命令行时，可以将环境变量“RANCHER_CLIENT_DEBUG”设置为“true”，这样当 API 被调用时，所有的 CLI 命令将打印出详细信息。

```
# Print verbose messages for all CLI calls
$ export RANCHER_CLIENT_DEBUG=true
```

如果您不想每个 CLI 命令都打印详细信息，请将环境变量“RANCHER_CLIENT_DEBUG”设置为“false”，然后将`--debug`传递给指定命令来获取详细消息。

```
$ rancher --debug env create newEnv
```

### 使用环境变量

如果您使用账户的 API 密钥，您将能够创建和更新环境。 如果您使用一个环境的 API 密钥，您将无法创建或更新其他环境，您将只能看到现有的环境。

```
$ rancher env ls
ID        NAME        STATE     CATALOG                           SYSTEM    DETAIL
1e1       zookeeper   healthy   catalog://community:zookeeper:1   false
1e2       Default     healthy                                     false
1e3       App1        healthy                                     false
```

## 使用指定的主机

有一些命令(比如说`rancher docker`和`rancher ssh`)需要选择指定的主机来使用。您可以设置一个环境变量来选择主机，即 RANCHER_DOCKER_HOST，或者传递 --host 参数来指定主机。

选择主机之前，您可以列出环境中的所有主机。

```
$ rancher hosts
ID        HOSTNAME      STATE     IP
1h1       host-1        active    111.222.333.444
1h2       host-3        active    111.222.333.445
1h3       host-2        active    111.222.333.446
```

现在您可以设置`RANCHER_DOCKER_HOST`环境变量，或者使用--host 参数传入主机 ID 或主机名来选择不同的主机

```
# Set the host to always select host-1 (1h1)
$ export RANCHER_DOCKER_HOST=1h1
# List the containers running on host-1
$ rancher docker ps
# List the containers running on host-2
$ rancher --host host-2 docker ps
```

### 使用服务和容器

#### 列出所有的服务

在您选择的环境中，您可以查看在环境中运行的所有服务。

```
$ rancher ps
ID   TYPE                 NAME                IMAGE                       STATE     SCALE   ENDPOINTS            DETAIL
1s1  service              zookeeper/zk        rawmind/alpine-zk:3.4.8-4   healthy   3
1s2  service              Default/nginxApp    nginx                       healthy   1
1s4  service              App1/db1            mysql                       healthy   1
1s5  service              App1/wordpress      wordpress                   healthy   4
1s6  loadBalancerService  App1/wordpress-lb                               healthy   1       111.222.333.444:80
```

#### 列出所有的容器

同样您可以查看环境中的所有容器。

```
$ rancher ps -c
ID      NAME                       IMAGE                              STATE     HOST   IP              DOCKER         DETAIL
1i1     zookeeper_zk_zk-volume_1   rawmind/alpine-volume:0.0.1-1      stopped   1h1                    a92b6d3dad18
1i2     zookeeper_zk_zk-conf_1     rawmind/rancher-zk:0.3.3           stopped   1h1                    2e8085a4b517
1i3     zookeeper_zk_1             rawmind/alpine-zk:3.4.8-4          healthy   1h1    10.42.150.2     e3ef1c6ff70e
1i5     zookeeper_zk_zk-volume_2   rawmind/alpine-volume:0.0.1-1      stopped   1h2                    e716f562e0a4
1i6     zookeeper_zk_zk-conf_2     rawmind/rancher-zk:0.3.3           stopped   1h2                    5cd1cebea5a3
1i7     zookeeper_zk_2             rawmind/alpine-zk:3.4.8-4          healthy   1h2    10.42.88.102    21984a4445d1
1i9     zookeeper_zk_zk-volume_3   rawmind/alpine-volume:0.0.1-1      stopped   1h3                    7c614003f08c
1i10    zookeeper_zk_zk-conf_3     rawmind/rancher-zk:0.3.3           stopped   1h3                    53fb77cd8ae0
1i11    zookeeper_zk_3             rawmind/alpine-zk:3.4.8-4          healthy   1h3    10.42.249.162   84a80eb8e037
1i13    Default_nginxApp_1         nginx                              running   1h1    10.42.107.28    e1195a563280
1i15    App1_db1_1                 mysql                              running   1h3    10.42.116.171   0624e0a7f2fc
1i16    App1_wordpress_1           wordpress                          running   1h1    10.42.66.199    4bb77abebc08
1i17    App1_wordpress-lb_1        rancher/lb-service-haproxy:v0.4.2  healthy   1h2    10.42.199.163   5d3a005278d3
1i18    App1_wordpress_2           wordpress                          running   1h2    10.42.88.114    01ec967c49ac
1i19    App1_wordpress_3           wordpress                          running   1h3    10.42.218.81    3aae3fc6163a
1i20    App1_wordpress_4           wordpress                          running   1h1    10.42.202.31    0b67ef86db22
```

#### 列出指定服务的容器

如果要查看特定服务的容器，可以通过添加服务 ID 或服务名称列出运行服务的所有容器。

```
$ rancher ps 1s5
ID      NAME               IMAGE       STATE     HOST      IP             DOCKER         DETAIL
1i16    App1_wordpress_1   wordpress   running   1h1       10.42.66.199   4bb77abebc08
1i18    App1_wordpress_2   wordpress   running   1h2       10.42.88.114   01ec967c49ac
1i19    App1_wordpress_3   wordpress   running   1h3       10.42.218.81   3aae3fc6163a
1i20    App1_wordpress_4   wordpress   running   1h1       10.42.202.31   0b67ef86db22
```

### 使用 docker compose 文件启动简单的服务

要开始向 Rancher 添加服务时，您可以创建一个简单的`docker-compose.yml`文件，以及可选的`rancher-compose.yml`文件。 如果没有`rancher-compose.yml`文件，则所有服务的数量将默认为 1。

docker-compose.yml 示例

```
version: '2'
services:
  service1:
    image: nginx
```

rancher-compose.yml 示例

```
version: '2'
services:
  # Reference the service that you want to extend
  service1:
    scale: 2
```

创建文件后，您可以在 Rancher Server 中启动对应的服务。

```
# Creating and starting a service without environment variables and selecting a stack
# If no stack is provided, the stack name will be the folder name that the command is running from
# If the stack does not exist in Rancher, it will be created
# Add in -d at the end to not block and log
$ rancher --url URL_of_Rancher --access-key <username_of_account_api_key> --secret-key <password_of_account_api_key> --env Default up -s stack1 -d

# Creating and starting a service with environment variables already set
# Add in -d at the end to not block and log
$ rancher up -s stack1 -d

# To change the scale of an existing service, you can use stackName/serviceName or service ID
$ rancher scale Default/service1=3
$ rancher scale 1s4=5
```

### 使用`Rancher run`来启动一个服务

您可以使用 Docker CLI 添加容器，也可以使用`rancher run`添加容器到 Rancher 中。

```
# Services should be stackName/service_name
$ rancher run --name stackA/service1 nginx
```

### 命令参考

要了解更多的命令行支持，请查看我们的[Rancher 命令](/docs/rancher2/cli/_index)文档.
