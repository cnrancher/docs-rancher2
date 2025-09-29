---
title: Rancher Server常见问题
order: 199
---

## 1、Docker 运行 Rancher Server 容器应该注意什么？

需要注意运行 Rancher Server 容器时，不要使用 host 模式。程序中有些地方定义的是 localhost 或者 127.0.0.1，如果容器网络设置为 host，将会去访问宿主机资源，因为宿主机并没有相应资源，Rancher Server 容器启动就出错。

```bash
PS:docker命令中，如果使用了 --network host参数，那后面再使用-p 8080:8080 就不会生效。
```

```bash
docker run -d -p 8080:8080 rancher/server:stable
```

此命令仅适用于单机测试环境，如果要生产使用 Rancher Server，请使用外置数据库(mysql)或者通过

```bash
-v /xxx/mysql/:/var/lib/mysql -v /xxx/log/:/var/log/mysql -v /xxx/cattle/:/var/lib/cattle
```

把数据挂载到宿主机上。如果用外置数据库，需提前对数据库做性能优化，以保证 Rancher 运行的最佳性能。

## 2、如何导出 Rancher Server 容器的内部数据库？

您可以通过简单的 Docker 命令从 Rancher Server 容器导出数据库。

```bash
docker exec <CONTAINER_ID_OF_SERVER> mysqldump cattle > dump.sql
```

## 3、我正在运行的 Rancher 是什么版本的?

Rancher 的版本位于 UI 的页脚的左侧。 如果您单击版本号，将可以查看其他组件的详细版本。

## 4、如果我没有在 Rancher UI 中删除主机而是直接删除会发生什么?

如果您的主机直接被删除，Rancher Server 会一直显示该主机。主机会处于`Reconnecting`状态，然后转到`Disconnected`状态。
您也可以通过添加主机再次把此节点添加到 RANCHER 集群，如果不在使用此节点，可以在 UI 中删除。

如果您有添加了健康检查功能的服务自动调度到状态`Disconnected`主机上，CATTLE 会将这些服务重新调度到其他主机上。

```bash
PS:如果使用了标签调度，如果您有多台主机就有相同的调度标签，那么服务会调度到其他具有调度标签的节点上；如果选择了指定运行到某台主机上，那主机删除后您的应用将无法在其他主机上自动运行。
```

## 5、我如何在代理服务器后配置主机?

要在代理服务器后配置主机，您需要配置 Docker 的守护进程。详细说明参考在代理服务器后[添加自定义主机](/docs/rancher1/installation/installing-server/)。

## 6、为什么同一主机在 UI 中多次出现?

宿主机上`var/lib/rancher/state`这个文件夹，这是 Rancher 用来存储用于标识主机的必要信息. .registration_token 中保存了主机的验证信息，如果里面的信息发生变化，RANCHER 会认为这是一台新主机， 在您执行添加主机后，UI 上将会出现另外一台相同的主机，第一台主机接着处于失联状态。

## 7、在哪能找到 Rancher Server 容器的详细日志？

运行`docker logs`可以查看在 Rancher Server 容器的基本日志。要获取更详细的日志，您可以进入到 Rancher Server 容器内部并查看日志文件。

```bash
进入 Rancher　Server　容器内部
docker exec -it <container_id> bash

跳转到 Cattle 日志所在的目录下
cd /var/lib/cattle/logs/
cat cattle-debug.log
```

在这个目录里面会出现`cattle-debug.log`和`cattle-error.log`。 如果您长时间使用此 Rancher Server，您会发现我们每天都会创建一个新的日志文件。

## 8、将 Rancher Server 的日志复制到主机上。

以下是将 Rancher Server 日志从容器复制到主机的命令。

```bash
docker cp <container_id>:/var/lib/cattle/logs /local/path
```

## 9、如果 Rancher Server 的 IP 改变了会怎么样？

如果更改了 Rancher Server 的 IP 地址，您需要用新的 IP 重新注册主机。

在 Rancher 中，单击**系统管理**->**系统设置**更新 Rancher Server 的**主机注册地址**。注意必须包括 Rancher Server 暴露的端口号。默认情况下我们建议按照安装手册中使用 8080 端口。

主机注册更新后，进入**基础架构**->**添加主机**->**自定义**。 添加主机的`docker run`命令将会更新。 使用更新的命令，在 Rancher Server 的所有环境中的所有主机上运行该命令。

## 10、Rancher Server 运行变得很慢，怎么去优化它？

很可能有一些任务由于某些原因而处于僵死状态，如果您能够用界面查看**系统管理** -> **系统进程**，您将可以看到`Running`中的内容，如果这些任务长时间运行(并且失败)，则 Rancher 会最终使用太多的内存来跟踪任务。这使得 Rancher Server 处于了内存不足的状态。

为了使服务变为可响应状态，您需要添加更多内存。通常 4GB 的内存就够了。

您需要再次运行 Rancher Server 命令并且添加一个额外的选项`-e JAVA_OPTS="-Xmx4096m"`

```bash
docker run -d -p 8080:8080 --restart=unless-stopped -e JAVA_OPTS="-Xmx4096m" rancher/server
```

根据 MySQL 数据库的设置方式的不同，您可能需要进行升级才能添加该选项。

如果是由于缺少内存而无法看到**系统管理** -> **系统进程**的话，那么在重启 Rancher Server 之后，已经有了更多的内存。您现在应该可以看到这个页面了，并可以开始对运行时间最长的进程进行故障分析。

## 11、Rancher Server 数据库数据增长太快.

Rancher Server 会自动清理几个数据库表，以防止数据库增长太快。如果对您来说这些表没有被及时清理，请使用 API 来更新清理数据的时间间隔。

在默认情况下，产生在 2 周以前的`container_event`和`service_event`表中的数据则数据会被删除。在 API 中的设置是以秒为单位的(`1209600`)。API 中的设置为`events.purge.after.seconds`.

默认情况下，`process_instance`表在 1 天前产生的数据将会被删除，在 API 中的设置是以秒为单位的(`86400`)。API 中的设置为`process_instance.purge.after.seconds`.

为了更新 API 中的设置，您可以跳转到`http://<rancher-server-ip>:8080/v1/settings`页面， 搜索要更新的设置，单击`links -> self`跳转到您单击的链接去设置，单击侧面的“编辑”更改'值'。 请记住，值是以秒为单位。

## 12、为什么 Rancher Server 升级失败导致数据库被锁定？

如果您刚开始运行 Rancher 并发现它被永久冻结，可能是 liquibase 数据库上锁了。在启动时，liquibase 执行模式迁移。它的竞争条件可能会留下一个锁定条目，这将阻止后续的流程。

如果您刚刚升级，在 Rancher 　 Server 日志中，MySQL 数据库可能存在尚未释放的日志锁定。

```bash
....liquibase.exception.LockException: Could not acquire change log lock. Currently locked by <container_ID>
```

### 释放数据库锁

> **注意:** 请不要释放数据库锁，除非有相关日志锁的**异常**。如果是由于数据迁移导致升级时间过长，在这种情况下释放数据库锁，可能会使您遇到其他迁移问题。

如果您已根据升级文档创建了 Rancher Server 的数据容器，您需要`exec`到`rancher-data`容器中升级`DATABASECHANGELOGLOCK`表并移除锁，如果您没有创建数据容器，您用`exec`到包含有您数据库的容器中。

```bash
sudo docker exec -it <container_id> mysql
```

一旦进入到 Mysql 数据库, 您就要访问`cattle`数据库。

```bash
mysql> use cattle;

检查表中是否有锁
mysql> select * from DATABASECHANGELOGLOCK;

更新移除容器的锁
mysql> update DATABASECHANGELOGLOCK set LOCKED="", LOCKGRANTED=null, LOCKEDBY=null where ID=1;

检查锁已被删除
mysql> select * from DATABASECHANGELOGLOCK;
+----+--------+-------------+----------+
| ID | LOCKED | LOCKGRANTED | LOCKEDBY |
+----+--------+-------------+----------+
|  1 |        | NULL        | NULL     |
+----+--------+-------------+----------+
1 row in set (0.00 sec)
```

## 13、管理员密码忘记了，我该如何重置管理员密码？

如果您的身份认证出现问题(例如管理员密码忘记)，则可能无法访问 Rancher。 要重新获得对 Rancher 的访问权限，您需要在数据库中关闭访问控制。 为此，您需要访问运行 Rancher Server 的主机。

ps:假设在重置访问控制之前有创建过其他用户，那么在认证方式没有变化的情况下，重置访问控制除了超级管理员(第一个被创建的管理员，ID 为 1a1)，其他用户账号信息不会受影响。

- 假设数据库为 rancher 内置数据库

```bash
docker exec -it <rancher_server_container_ID> mysql
```

> **注意:** 这个 `<rancher_server_container_ID>`是具有 Rancher 数据库的容器。 如果您升级并创建了一个 Rancher 数据容器，则需要使用 Rancher 数据容器的 ID 而不是 Rancher Server 容器，rancher 内置数据库默认密码为空。

- 选择 Cattle 数据库。

```bash
mysql> use cattle;
```

- 查看`setting`表。

```bash
mysql> select * from setting;
```

- 更改`api.security.enabled`为`false`，并清除`api.auth.provider.configured`的值。

```bash
# 关闭访问控制
mysql> update setting set value="false" where name="api.security.enabled";
# 清除认证方式
mysql> update setting set value="" where name="api.auth.provider.configured";
```

- 确认更改在`setting`表中是否生效。

```bash
mysql> select * from setting;
```

- 可能需要约 1 分钟才能在用户界面中关闭身份认证，然后您可以通过刷新网页来登陆没有访问控制的 Rancher Server

> 关闭访问控制后，任何人都可以使用 UI/API 访问 Rancher Server。

- 刷新页面，在系统管理| 访问控制 重新开启访问控制。重新开启访问控制填写的管理员用户名将会替换原有的超级管理员用户名(ID 为 1a1 )。

## 14、Rancher Compose Executor 和 Go-Machine-Service 不断重启.

在高可用集群中，如果您正在使用代理服务器后，如果 rancher-compose-executor 和 go-machine-service 不断重启，请确保您的代理使用正确的协议。

## 15、我怎么样在代理服务器后运行 Rancher Server?

请参照[在 HTTP 代理后方启动 Rancher Server](/docs/rancher1/installation/installing-server/).

## 16、为什么在日志中看到 Go-Machine-Service 在不断重新启动？ 我该怎么办？

Go-machine-service 是一种通过 websocket 连接到 Rancher API 服务器的微服务。如果无法连接，则会重新启动并再次尝试。如果您运行的是单节点的 Rancher Server，它将使用您为主机注册地址来连接到 Rancher API 服务。 检查从 Rancher Sever 容器内部是否可以访问主机注册地址。

```bash
docker exec -it <rancher-server_container_id> bash
在 Rancher-Server 容器内
curl -i <Host Registration URL you set in UI>/v1
```

您应该得到一个 json 响应。 如果认证开启，响应代码应为 401。如果认证未打开，则响应代码应为 200。
验证 Rancher API Server 能够使用这些变量，通过登录 go-machine-service 容器并使用您提供给容器的参数进行`curl`命令来验证连接:

```bash
docker exec -it <go-machine-service_container_id> bash
在go-machine-service 容器内
curl -i -u '<value of CATTLE_ACCESS_KEY>:<value of CATTLE_SECRET_KEY>' <value of CATTLE_URL>
```

您应该得到一个 json 响应和 200 个响应代码。
如果 curl 命令失败，那么在`go-machine-service`和 Rancher API server 之间存在连接问题。
如果 curl 命令没有失败，则问题可能是因为 go-machine-service 尝试建立 websocket 连接而不是普通的 http 连接。 如果在 go-machine-service 和 Rancher API 服务器之间有代理或负载均衡，请验证代理是否支持 websocket 连接。

## 17、rancher catalog 多久同步一次

同步的间隔时间默认为 300 秒，您可以单击 setting 修改间隔时间，修改后马上生效。

## 18、Rancher Server cattle-debug.log 文件占满磁盘的问题

这个问题主要在 Rancher Server 1.6.11 之前(1.6.11 已经解决)

目前是按天来创建日志文件， 如果日志文件太多会进行日志分段，每一段默认 100M， 默认情况下，系统保留 5 个分段。
通过打开 `http://rancher_url:8080/v2-beta/settings` ，网页搜索 logback 可以看到以下内容，

```bash
{
"id": "logback.max.file.size",
"type": "activeSetting",
"links": {
"self": "…/v2-beta/settings/logback.max.file.size"
},

"actions": { },
"baseType": "setting",
"name": "logback.max.file.size",
"activeValue": "100MB",
"inDb": false,
"source": "Code Packaged Defaults",
"value": "100MB"
},
{
"id": "logback.max.history",
"type": "activeSetting",
"links": {
"self": "…/v2-beta/settings/logback.max.history"
},
"actions": { },
"baseType": "setting",
"name": "logback.max.history",
"activeValue": "5",
"inDb": false,
"source": "Code Packaged Defaults",
"value": "5"
},
```

单击 self 后的相应类型，比如"self": "…/v2-beta/settings/logback.max.history" 可以做相应参数调整。

相应 issue:https://github.com/rancher/rancher/issues/9887

## 19、Rancher Server 如何免密更新 Catalog

在配置私有仓库地址的时候，添加用户名和密码

```bash
https://{username}:{password}@github.com/{repo}
```

## 20、修改 server 日志等级

默认情况下，server 日志记录等级为 INFO，可以按照以下方法修改:

通过打开 `http://rancher_url:8080/v2-beta/settings/auth.service.log.level` ,

![mage-20180329174623](/img/rancher1/server.assets/image-201803291746238.png)

单击编辑 修改

![mage-20180329174705](/img/rancher1/server.assets/image-201803291747058.png)

![mage-20180329174723](/img/rancher1/server.assets/image-201803291747230.png)

单击 show Request，再单击 send Request.

![mage-20180329174815](/img/rancher1/server.assets/image-201803291748154.png)

## 21、禁止新用户不创建 default 环境

默认情况下，新用户第一次登录会创建 default 环境，通过设置 API 可以禁止此设置:

通过打开 `http://rancher_url:8080/v2-beta/settings/project.create.default`

![mage-20180329175124](/img/rancher1/server.assets/image-201803291751248.png)

修改 value 值为 false

![mage-20180329175151](/img/rancher1/server.assets/image-201803291751511.png)
