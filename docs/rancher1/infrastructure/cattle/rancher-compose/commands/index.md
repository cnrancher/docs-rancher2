---
title: 命令参数
---

Rancher Compose 工具的工作方式是跟 Docker Compose 的工作方式是相似的，并且支持版本 V1 的 `docker-compose.yml` 文件。为了启用 Rancher 的特性，您需要额外一份`rancher-compose.yml`文件，这份文件扩展并覆盖了`docker-compose.yml`文件。例如，服务缩放和健康检查这些特性就会在`rancher-compose.yml`中体现。

### Rancher-Compose 命令

Rancher Compose 支持所有 Docker Compose 支持的命令。

| Name           | Description                          |
| -------------- | ------------------------------------ |
| `create`       | 创建所有服务但不启动                 |
| `up`           | 启动所有服务                         |
| `start`        | 启动服务                             |
| `logs`         | 输出服务日志                         |
| `restart`      | 重启服务                             |
| `stop`, `down` |  停止服务                            |
| `scale`        | 缩放服务                             |
| `rm`           | 删除服务                             |
| `pull`         | 拉取所有服务的镜像                   |
| `upgrade`      | 服务之间进行滚动升级                 |
| `help`, `h`    | 输出  命令列表或者指定命令的帮助列表 |

### Rancher Compose 选项

无论何时您使用 Rancher Compose 命令，这些不同的选项您都可以使用

| Name                                         | Description                                                        |
| -------------------------------------------- | ------------------------------------------------------------------ |
| `--verbose`, `--debug`                       |
| `--file`, `-f` [--file option --file option] | 指定一个 compose 文件 (默认: `docker-compose.yml`) [$COMPOSE_FILE] |
| `--project-name`, `-p`                       | 指定一个项目名称 (默认: directory name)                            |
| `--url`                                      | 执行 Rancher API 接口 URL [$RANCHER_URL]                           |
| `--access-key`                               | 指定 Rancher API access key [$RANCHER_ACCESS_KEY]                  |
| `--secret-key`                               | 指定 Rancher API secret key [$RANCHER_SECRET_KEY]                  |
| `--rancher-file`, `-r`                       | 指定一个 Rancher Compose 文件 (默认: `rancher-compose.yml`)        |
| `--env-file`, `-e`                           | 指定一个  环境变量  配置文件                                       |
| `--help`, `-h`                               |  输出帮助文本                                                      |
| `--version`, `-v`                            |  输出 Rancher Compose 版本                                         |

#### 例子

准备开始后，您需要  创建一个 `docker-compose.yml` 文件和一个可选的 `rancher-compose.yml` 文件，如果没有 `rancher-compose.yml` 文件，那么  所有服务默认只分配 1 个  容器

#####  样例文件 `docker-compose.yml`

```
version: '2'
services:
  web:
    image: nginx
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: test
```

#####  样例文件 `rancher-compose.yml`

```
# Reference the service that you want to extend
version: '2'
services:
  web:
    scale: 2
  db:
    scale: 1
```

当您  的这些文件创建好后，您就可以启动这些服务到 Rancher 服务了

```
# Creating and starting services without environment variables and selecting a stack
# If the stack does not exist in Rancher, it will be created in Rancher
$ rancher-compose --url URL_of_Rancher --access-key <username_of_environment_api_key> --secret-key <password_of_environment_api_key> -p stack1 up

# Creating and starting services with environment variables already set
$ rancher-compose -p stack1 up

# To change the scale of an existing service
$ rancher-compose -p stack1 scale web=3

# To launch a specific service in the docker-compose.yml
$ rancher-compose -p stack1 up web
```

> **注意:** 如果您  没有传入 `-p <STACK_NAME>`，应用名就是您执行 Rancher Compose 命令所在的文件夹名称。

#### 使用 `--env-file` 选项

当您运行 Rancher Compose 命令时，可以使用`--env-file` 选项传入一个环境变量配置文件。

##### 样例 `secrets` 文件

```
MYSQL_ROOT_PASSWORD=test
```

##### 样例文件 `docker-compose.yml`

```
version: '2'
services:
  db:
    image: mysql
    environment:
    # Just like Docker Compose, if there is only a key, Rancher Compose will resolve to
    # the values on the machine or the file passed in using --env-file
      MYSQL_ROOT_PASSWORD:
```

您可以启动  服务时传入 `secrets` 文件

```
$ rancher-compose --env-file secrets up -d
```

在传入一个文件并一个环境变量  只含一个 key，Rancher Compose  将从这个文件或者从  运行 Rancher Compose 命令的机器中的系统环境变量中提取这个值。当在文件和  系统  环境变量中同时存在同一个变量时，Rancher Compose 使用  文件中的值。

### 命令  选项

#### up 命令

| Name                                  | Description                                  |
| ------------------------------------- | -------------------------------------------- |
| `--pull`, `-p`                        | 升级前先在各个已有这个镜像的主机拉取最新镜像 |
| `-d`                                  | 不要阻塞或  输出日志                         |
| `--upgrade`, `-u`, `--recreate`       |  当服务改变时升级                            |
| `--force-upgrade`, `--force-recreate` | 强制升级服务，不管服务是否  改变             |
| `--confirm-upgrade`, `-c`             | 确认升级成功并删除老容器                     |
| `--rollback`, `-r`                    | 回滚到上一个已部署的版本                     |
| `--batch-size "2"`                    | 每次升级多少个容器                           |
| `--interval "1000"`                   | 升级间隔                                     |

当您运行 Rancher Compose 的 `up` 命令时，在  所有任务  完成后进程会继续运行。如果您希望  任务完成后进程退出，那么您需要传入 `-d` 选项， 防止阻塞和输出日志。

```
# If you do not use the -d flag, Rancher Compose will continue to run until you Ctrl+C to quit
$ rancher-compose up

# Use the -d flag for rancher-compose to exit after running
$ rancher-compose up -d
```

阅读更多关于 [利用 Rancher Compose 升级服务](/docs/rancher1/infrastructure/cattle/upgrading/#通过rancher-compose命令行进行服务升级).

#### start 命令

| Name | Description            |
| ---- | ---------------------- |
| `-d` | 防止阻塞或  输出  日志 |


如果您希望  任务完成后进程退出，那么您需要传入 `-d` 选项， 防止阻塞和输出日志。

#### logs 命令

| Name       | Description     |
| ---------- | --------------- |
| `--follow` |  持续  输出日志 |

#### restart 命令

| Name                 | Description        |
| -------------------- | ------------------ |
| `--batch-size` `"1"` | 每次重启多少个容器 |
| `--interval` `"0"`   | 重启间隔           |

缺省情况下，Rancher Compose 会顺序地  逐个  重启服务。您可以设置批量大小  和重启间隔。

#### stop 与 scale

| Name                     | Description      |
| ------------------------ | ---------------- |
| `--timeout`, `-t` `"10"` | 指定停止超时秒数 |

```
# To change the scale of an existing service
$ rancher-compose -p stack1 scale service1=3
```

#### rm 命令

| Name            | Description        |
| --------------- | ------------------ |
| `--force`, `-f` | 允许删除  所有服务 |
| `-v`            | 同时移除关联的容易 |

当移除服务时，Rancher Compose 仅移除在 `docker-compose.yml` 文件中出现的服务。如果有其他的服务在 Rancher 的 stack 里，他们不会被移除，因为 Rancher Compose 不知道他们的存在。

 所以 stack 不会被移除， 因为 Rancher Compose 不知道 stack 里是否还有其他容器。

缺省  情况下，附加到容器的卷不会被移除。您可以通过 `docker volume ls` 查看所有的卷。

#### pull 命令

| Name             | Description                                 |
| ---------------- | ------------------------------------------- |
| `--cached`, `-c` | 只更新存在该  镜像缓存的主机， 不要拉取新的 |

```
# Pulls new images for all services located in the docker-compose.yml file on ALL hosts in the environment
$ rancher-compose pull

# Pulls new images for all services located in docker-compose.yml file on hosts that already have the image
$ rancher-compose pull --cached
```

> **注意:** 不同于 `docker-compose pull`, 您不可以指定拉取哪些服务的镜像，Rancher Compose 会拉取所有在 `docker-compose.yml`  里的服务镜像。

#### upgrade 命令

您可以使用 Rancher Compose 升级在 Rancher 里的服务。请阅读更多关于在何时  和怎样[更新您的服务](/docs/rancher1/infrastructure/cattle/upgrading/#通过rancher-compose命令行进行服务升级).

### 删除服务／容器

默认情况下，Rancher Compose 不会  删除  任何东西。 这意味着  如果您在  一行里有两  个 `up` 命令， 第二个 `up` 是不会做  任何事情的。这是因为第一个 `up` 会创建所有东西并保持运行。甚至您没有传 `-d` 给 `up`，Rancher Compose  也不会删除您的服务。要删除服务，您只能使用 `rm` 。
