---
title: 在线安装
---

Rancher 是使用一系列的 Docker 容器进行部署的。运行 Rancher 跟启动两个容器一样简单。一个容器作为管理服务器部署，另外一个作为集群节点的 Agent 部署。

> **注意:** 您可以运行 Rancher Server 的容器的命令`docker run rancher/server --help`来获得所有选项以及帮助信息。

## 安装需求

- 所有安装有[支持的 Docker 版本](/docs/rancher1/infrastructure/hosts/_index#docker版本适用对比)的现代 Linux 发行版。 [RancherOS](https://docs.rancher.com/os/), Ubuntu, RHEL/CentOS 7 都是经过严格的测试。
  - 对于 RHEL/CentOS, 默认的 storage driver, 例如 devicemapper using loopback, 并不被[Docker](https://docs.docker.com/engine/reference/commandline/dockerd/#/storage-driver-options)推荐。 请参考 Docker 的文档去修改使用其他的 storage driver。
  - 对于 RHEL/CentOS, 如果您想使用 SELinux, 您需要[安装额外的 SELinux 组件](/docs/rancher1/installation/selinux/_index).
- 1GB 内存
- MySQL 服务器需要 max_connections 的设置 > 150
  - MYSQL 配置需求
    - 选项 1: 用默认`COMPACT`选项运行 Antelope
    - 选项 2: 运行 MySQL 5.7，使用 Barracuda。默认选项`ROW_FORMAT`需设置成`Dynamic`
  - 推荐设定
    - max_packet_size >= 32M
    - innodb_log_file_size >= 256M (如果您已有现存数据库，请根据实际情况更改此设定)
    - innodb_file_per_table=1
    - innodb_buffer_pool_size >= 1GB (对于更高需求的配置，请在专属 MySQL 服务器机器上使用 4-8G 的值)

> **注意:** 目前 Rancher 中并不支持 Docker for Mac

## Rancher Server 标签

Rancher Server 当前版本中有 2 个不同的标签。对于每一个主要的 release 标签，我们都会提供对应版本的文档。

- `rancher/server:latest` 此标签是我们的最新一次开发的构建版本。这些构建已经被我们的 CI 框架自动验证测试。但这些 release 并不代表可以在生产环境部署。
- `rancher/server:stable` 此标签是我们最新一个稳定的 release 构建。这个标签代表我们推荐在生产环境中使用的版本。

请不要使用任何带有 `rc{n}` 前缀的 release。这些构建都是 Rancher 团队的测试构建。

## 单容器部署 Rancher Server - (非 HA)

在安装了 Docker 的 Linux 服务器上，使用一个简单的命令就可以启动一个单实例的 Rancher。

```bash
sudo docker run -d --restart=unless-stopped -p 8080:8080 rancher/server
```

### Rancher UI

UI 以及 API 会使用 `8080` 端口对外服务。下载 Docker 镜像完成后，需要 1 到 2 分钟的时间 Rancher 才能完全启动并提供服务。

访问如下的 URL: `http://<SERVER_IP>:8080`。`<SERVER_IP>` 是运行 Rancher Server 的主机的公共 IP 地址。

当 UI 已经启动并运行，您可以先[添加主机](/docs/rancher1/infrastructure/hosts/_index) 或者在应用商店中选择一个容器编排引擎。在默认情况下，rancher 容器会将 80 端口上的请求重定向到 443 端口上。如果没有选择不同的容器编排引擎，当前环境会使用 Cattle 引擎。在主机被添加都 Rancher 中后，您可以开始添加[服务](/docs/rancher1/infrastructure/cattle/adding-services/_index)或者从[应用商店](/docs/rancher1/configurations/catalog/_index)通过应用模版启动一个应用。

## 单容器部署 Rancher Server-使用外部数据库

除了使用内部的数据库，您可以启动一个 Rancher Server 并使用一个外部的数据库。启动命令与之前一样，但添加了一些额外的参数去说明如何连接您的外部数据库。

> **注意:** 在您的外部数据库中，只需要提前创建数据库名和数据库用户。Rancher 会自动创建 Rancher 所需要的数据库表。

以下是创建数据库和数据库用户的 SQL 命令例子

```bash
> CREATE DATABASE IF NOT EXISTS cattle COLLATE = 'utf8_general_ci' CHARACTER SET = 'utf8';
> GRANT ALL ON cattle.* TO 'cattle'@'%' IDENTIFIED BY 'cattle';
> GRANT ALL ON cattle.* TO 'cattle'@'localhost' IDENTIFIED BY 'cattle';
```

启动一个 Rancher 连接一个外部数据库，您需要在启动容器的命令中添加额外参数。

```bash
$ sudo docker run -d --restart=unless-stopped -p 8080:8080 rancher/server \
    --db-host myhost.example.com --db-port 3306 --db-user username --db-pass password --db-name cattle
```

大部分的输入参数都有默认值并且是可选的，只有 MySQL server 的地址是必须输入的。

```bash
--db-host               IP or hostname of MySQL server
--db-port               port of MySQL server (default: 3306)
--db-user               username for MySQL login (default: cattle)
--db-pass               password for MySQL login (default: cattle)
--db-name               MySQL database name to use (default: cattle)
```

> **注意:** 在之前版本的 Rancher Server 中，我们需要使用环境变量去连接外部数据库。在新版本中，这些环境变量会继续生效，但 Rancher 建议使用命令参数代替。

## 单容器部署 Rancher Server-挂载 MySQL 数据库的数据目录

在 Rancher Server 容器中，如果您想使用一个主机上的卷来持久化数据库，如下命令可以在启动 Rancher 时挂载 MySQL 的数据卷。

```bash
sudo docker run -d -v <host_vol>:/var/lib/mysql --restart=unless-stopped -p 8080:8080 rancher/server
```

使用这条命令，数据库就会持久化在主机上。如果您有一个现有的 Rancher Server 容器并且想挂在 MySQL 的数据卷，可以参考以下的[Rancher 升级](/docs/rancher1/upgrade/_index)介绍。

## 多节点部署 Rancher Server-HA 部署

在高可用(HA)的模式下运行 Rancher Server 与[使用外部数据库运行 Rancher Server](#启动-rancher-server---单容器部署---使用外部数据库)一样简单，需要暴露一个额外的端口，添加额外的参数到启动命令中，并且运行一个外部的负载均衡就可以了。

### HA 部署需求

- HA 节点:
  - 所有安装有[支持的 Docker 版本](/docs/rancher1/infrastructure/hosts/_index#docker版本适用对比)的现代 Linux 发行版 [RancherOS](https://docs.rancher.com/os/), Ubuntu, RHEL/CentOS 7 都是经过严格的测试。
  - 对于 RHEL/CentOS, 默认的 storage driver, 例如 devicemapper using loopback, 并不被[Docker](https://docs.docker.com/engine/reference/commandline/dockerd/#/storage-driver-options)推荐。 请参考 Docker 的文档去修改使用其他的 storage driver。
  - 对于 RHEL/CentOS, 如果您想使用 SELinux, 您需要 [安装额外的 SELinux 组件](/docs/rancher1/installation/selinux/_index).
  - `9345`, `8080` 端口需要在各个节点之间能够互相访问
  - 1GB 内存
- MySQL 数据库
  - 至少 1 GB 内存
  - 每个 Rancher Server 节点需要 50 个连接 (例如:3 个节点的 Rancher 则需要至少 150 个连接)
  - MYSQL 配置要求
    - 选项 1: 用默认`COMPACT`选项运行 Antelope
    - 选项 2: 运行 MySQL 5.7，使用 Barracuda。默认选项`ROW_FORMAT`需设置成`Dynamic`
- 外部负载均衡服务器
  - 负载均衡服务器需要能访问 Rancher Server 节点的 `8080` 端口

> **注意:** 目前 Rancher 中并不支持 Docker for Mac

### 大规模部署建议

- 每一个 Rancher Server 节点需要有 4 GB 或者 8 GB 的堆空间，意味着需要 8 GB 或者 16 GB 内存
- MySQL 数据库需要有高性能磁盘
- 对于一个完整的 HA，建议使用一个有副本的 Mysql 数据库。另一种选择则是使用 Galera 集群并强制写入一个 MySQL 节点。

1. 在每个需要加入 Rancher Server HA 集群的节点上，运行以下命令:

   ```bash
   # Launch on each node in your HA cluster
   $ docker run -d --restart=unless-stopped -p 8080:8080 -p 9345:9345 rancher/server \
        --db-host myhost.example.com --db-port 3306 --db-user username --db-pass password --db-name cattle \
        --advertise-address <IP_of_the_Node>
   ```

   在每个节点上，`<IP_of_the_Node>` 需要在每个节点上唯一，因为这个 IP 会被添加到 HA 的设置中。

   如果您修改了 `-p 8080:8080` 并在 host 上暴露了一个不一样的端口，您需要添加 `--advertise-http-port <host_port>` 参数到命令中。

   > **注意:** 您可以使用 `docker run rancher/server --help` 获得命令的帮助信息

2. 配置一个外部的负载均衡器，这个负责均衡负责将例如`80`或`443`端口的流量，转发到运行 Rancher Server 的节点的`8080`端口中。负载均衡器必须支持 websockets 以及 forwarded-for 的 Http 请求头以支持 Rancher 的功能。参考 [使用 SSL](/docs/rancher1/installation/installing-server/_index) 这个配置的例子。

### advertise-address 选项

| 选项       | 例子                                  | 描述                                                           |
| ---------- | ------------------------------------- | -------------------------------------------------------------- |
| IP address | `--advertise-address 192.168.100.100` | 使用指定 IP                                                    |
| Interface  | `--advertise-address eth0`            | 从指定网络接口获取                                             |
| awslocal   | `--advertise-address awslocal`        | 从这里获取`http://169.254.169.254/latest/meta-data/local-ipv4` |
| ipify      | `--advertise-address ipify`           | 从这里获取`https://api.ipify.org`                              |

### HA 模式下的 Rancher Server 节点

如果您的 Rancher Server 节点上的 IP 修改了，您的节点将不再存在于 Rancher HA 集群中。您必须停止在`--advertise-address`配置了不正确 IP 的 Rancher Server 容器并启动一个使用正确 IP 地址的 Rancher Server 的容器。

## Rancher Server HA 的负载均衡器

我们建议使用 AWS 的 ELB 作为您 Rancher Server 的负载均衡器。为了让 ELB 与 Rancher 的 websockets 正常工作，您需要开启 proxy protocol 模式并且保证 HTTP support 被停用。 默认的，ELB 是在 HTTP/HTTPS 模式启用，在这个模式下不支持 websockets。需要特别注意 listener 的配置。

如果您在配置 ELB 中遇到问题，我们建议您参考[terraform version](#使用terraform进行配置)。

> **注意:** 如果您正在使用自签名的证书, 请参考我们 SSL 部分里的[如何在 AWS 里配置 ELB](/docs/rancher1/installation/basic-ssl-config/_index)。

### Listener 配置 - Plaintext

简单的来说，使用非加密的负载均衡，需要以下的 listener 配置:

| Configuration Type | Load Balancer Protocol | Load Balancer Port | Instance Protocol | Instance Port                                                            |
| ------------------ | ---------------------- | ------------------ | ----------------- | ------------------------------------------------------------------------ |
| Plaintext          | TCP                    | 80                 | TCP               | 8080 (或者使用启动 Rancher Server 时 `--advertise-http-port` 指定的端口) |

### 启用 Proxy Protocol

为了使 websockets 正常工作，ELB 的 proxy protocol policy 必须被启用。

- 启用 [proxy protocol](http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/enable-proxy-protocol.html) 模式

```bash
aws elb create-load-balancer-policy --load-balancer-name <LB_NAME> --policy-name <POLICY_NAME> --policy-type-name ProxyProtocolPolicyType --policy-attributes AttributeName=ProxyProtocol,AttributeValue=true
aws elb set-load-balancer-policies-for-backend-server --load-balancer-name <LB_NAME> --instance-port 443 --policy-names <POLICY_NAME>
aws elb set-load-balancer-policies-for-backend-server --load-balancer-name <LB_NAME> --instance-port 8080 --policy-names <POLICY_NAME>
```

- Health check 可以配置使用 HTTP:8080 下的 `/ping` 路径进行健康检查

### 使用 Terraform 进行配置

以下是使用 Terraform 配置的例子:

```bash
resource "aws_elb" "lb" {
  name               = "<LB_NAME>"
  availability_zones = ["us-west-2a","us-west-2b","us-west-2c"]
  security_groups = ["<SG_ID>"]

  listener {
    instance_port     = 8080
    instance_protocol = "tcp"
    lb_port           = 443
    lb_protocol       = "ssl"
    ssl_certificate_id = "<IAM_PATH_TO_CERT>"
  }

}

resource "aws_proxy_protocol_policy" "websockets" {
  load_balancer  = "${aws_elb.lb.name}"
  instance_ports = ["8080"]
}
```

### 使用 AWS 的 Application Load Balancer(ALB)

我们不再推荐使用 AWS 的 Application Load Balancer (ALB)替代 Elastic/Classic Load Balancer (ELB)。如果您依然选择使用 ALB，您需要直接指定流量到 Rancher Server 节点上的 HTTP 端口，默认是 8080。

## 使用 TLS 认证的 AD/OPENLDAP

为了在 Rancher Server 上启用 Active Directory 或 OpenLDAP 并使用 TLS，Rancher Server 容器在启动的时候需要配置 LDAP 证书，证书是 LDAP 服务提供方提供。证书保存在需要运行 Rancher Server 的 Linux 机器上。

启动 Rancher 并挂载证书。证书在容器内部 **必须** 命名为`ca.crt`。

```bash
sudo docker run -d --restart=unless-stopped -p 8080:8080 \
  -v /some/dir/cert.crt:/var/lib/rancher/etc/ssl/ca.crt rancher/server
```

您可以使用 Rancher Server 的日志检查传入的 `ca.crt` 证书是否生效

```bash
docker logs <SERVER_CONTAINER_ID>
```

在日志的开头，会显示证书已经被正确加载的信息。

```bash
Adding ca.crt to Certs.
Updating certificates in /etc/ssl/certs... 1 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d....done.
Certificate was added to keystore
```

## 在 HTTP 代理后方启动 Rancher Server

为了设置 HTTP Proxy，Docker 守护进程需要修改配置并指向这个代理。在启动 Rancher Server 前，需要编辑配置文件 `/etc/default/docker` 添加您的代理信息并重启 Docker 服务。

```bash
sudo vi /etc/default/docker
```

在文件中，编辑 `#export http_proxy="http://127.0.0.1:3128/"` 并修改它指向您的代理。保存修改并重启 Docker。重启 Docker 的方式在每个 OS 上都不一样。

> **注意:** 如果您使用 systemd 运行 Docker, 请参考 Docker 官方的[文档](https://docs.docker.com/articles/systemd/#http-proxy) 去配置 http proxy 设置。

为了使得[应用商店](/docs/rancher1/configurations/catalog/_index)加载正常，HTTP 代理设置必须在 Rancher Server 运行的环境变量中。

```bash
sudo docker run -d \
    -e http_proxy=<proxyURL> \
    -e https_proxy=<proxyURL> \
    -e no_proxy="localhost,127.0.0.1" \
    -e NO_PROXY="localhost,127.0.0.1" \
    --restart=unless-stopped -p 8080:8080 rancher/server
```

如果您不使用[应用商店](/docs/rancher1/configurations/catalog/_index)，则使用您平常的 Rancher Server 命令即可。

当向 Rancher[添加主机](/docs/rancher1/infrastructure/hosts/_index)时，在 HTTP 代理中不需要额外的设置和要求。

## 通过 SSL 连接 MySQL 的 Rancher Server

> **注意:** 目前在 Rancher 1.6.3 以上版本才支持

### 重要提示

如果您正在使用 LDAP 或者 AD 认证方式，并且这些认证方式的证书发放方 CA 并不是 MySQL 服务器 SSL 的证书发放方 CA，这篇指南无法适用于您的情况。

### 前提条件

- MySQL 服务器的证书或 CA 证书

### 步骤

1. 拷贝 MySQL 服务器的证书或 CA 证书到 Rancher Server 的主机上。当启动`rancher/server`容器的时候您必须将证书挂载到`/var/lib/rancher/etc/ssl/ca.crt`。
2. 更改以下的模板的对应参数，构建一个 JDBC URL:

   ```bash
   jdbc:mysql://<DB_HOST>:<DB_PORT>/<DB_NAME>?useUnicode=true&characterEncoding=UTF-8&characterSetResults=UTF-8&prepStmtCacheSize=517&      cachePrepStmts=true&prepStmtCacheSqlLimit=4096&socketTimeout=60000&connectTimeout=60000&sslServerCert=/var/lib/rancher/etc/ssl/ca.crt&     useSSL=true
   ```

3. 使用环境变量`CATTLE_DB_CATTLE_MYSQL_URL`和`CATTLE_DB_LIQUIBASE_MYSQL_URL`来导入上面的 JDBC URL 到容器里面。

4. 加入环境变量`CATTLE_DB_CATTLE_GO_PARAMS="tls=true"`到容器里面。但是如果服务器证书的标题名字不符合服务器的主机名，您需要使用的是`CATTLE_DB_CATTLE_GO_PARAMS="tls=skip-verify"`.

### 例子

```bash

export JDBC_URL="jdbc:mysql://<DB_HOST>:<DB_PORT>/<DB_NAME>?useUnicode=true&characterEncoding=UTF-8&characterSetResults=UTF-8&prepStmtCacheSize=517&cachePrepStmts=true&prepStmtCacheSqlLimit=4096&socketTimeout=60000&connectTimeout=60000&sslServerCert=/var/lib/rancher/etc/ssl/ca.crt&useSSL=true"

cat <<EOF > docker-compose.yml
version: '2'
  services:
    rancher-server:
      image: rancher/server:stable
      restart: unless-stopped
      command: --db-host <DB_HOST> --db-port <DB_PORT> --db-name <DB_NAME> --db-user <DB_USER> --db-pass <DB_PASS>
      environment:
        CATTLE_DB_LIQUIBASE_MYSQL_URL: $JDBC_URL
        CATTLE_DB_CATTLE_MYSQL_URL: $JDBC_URL
        CATTLE_DB_CATTLE_GO_PARAMS: "tls=true"
      volumes:
        - /path/to/mysql/ca.crt:/var/lib/rancher/etc/ssl/ca.crt
      ports:
        - "8080:8080"
EOF

docker-compose up -d
```

**重要**: 您必须在两个环境变量里都写入构建好的 JDBC_URL，还必须加入`--db-xxx`参数!
