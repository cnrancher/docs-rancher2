---
title: Webhooks
description:
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 集群管理员指南
  - 集群访问控制
  - webhooks
---

## 1. 简述

本工具基于`https://github.com/adnanh/webhook.git`定制, `Dockerfile`地址: `https://github.com/cnrancher/docker-webhook.git`。

镜像下载地址: `registry.cn-shenzhen.aliyuncs.com/rancher/webhook:latest`

1. 支持镜像仓库类型:

   阿里云镜像仓库: `https://cr.console.aliyun.com`\
   Docker Hub: `http://hub.docker.com`\
   自定义 webhooks

1. 支持邮件通知

## 2. 准备配置文件

> 建议把 webhooks 作为系统服务运行在`system`项目下

1. 登录 Rancher UI 切换到`system`项目下，然后依次进入 `资源\配置映射`，点击页面右上角的`添加配置映射`。
1. 修改模板中对应的参数:

   - `<webhooks_id>`: 此`webhooks-id`具有唯一性，不能重复。建议设置为服务名，比如`cnrancher_website`；
   - `<token>`: 设置一个 token 值用于匹配校验；
   - `<workload>`: 指定一个应用，书写格式为`类型/Workload`,例如: `deployment/webhooks、daemonset/webhooks`；
   - `<namespaces>`: 指定服务所在的命名空间；
   - `<container>`: 指定容器名称，对于一个有多容器的 Pod，升级时需要指定容器名称；
   - `<MAIL_TO>`: 收件人邮箱地址；
   - `<NET_TYPE>`: 如果阿里云的镜像仓库，可在 url 中添加`net_type`指定网络类型: 1.公共网络: 不指定默认为公共网络，2.专有网络: `net_type=vpc`，3.经典网络: `net_type=internal`；

   ```json
   [
     {
       "id": "<webhooks-id>",
       "execute-command": "/webhooks.sh",
       "command-working-directory": "/home",
       "response-message": "I got the payload!",
       "include-command-output-in-response": true,
       "include-command-output-in-response-on-error": true,
       "trigger-rule-mismatch-http-response-code": 500,
       "response-headers": [
         {
           "name": "Access-Control-Allow-Origin",
           "value": "*"
         }
       ],
       "pass-arguments-to-command": [
         {
           "source": "entire-payload"
         }
       ],
       "pass-environment-to-command": [
         {
           "envname": "APP_NS",
           "source": "url",
           "name": "ns"
         },
         {
           "envname": "APP_WORKLOAD",
           "source": "url",
           "name": "workload"
         },
         {
           "envname": "APP_CONTAINER",
           "source": "url",
           "name": "container"
         },
         {
           "envname": "REPO_TYPE",
           "source": "url",
           "name": "repo_type"
         },
         {
           "envname": "NET_TYPE",
           "source": "url",
           "name": "net_type"
         },
         {
           "envname": "MAIL_TO",
           "source": "string",
           "name": "<MAIL_TO>"
         }
       ],
       "trigger-rule": {
         "and": [
           {
             "match": {
               "type": "value",
               "value": "<token>",
               "parameter": {
                 "source": "url",
                 "name": "token"
               }
             }
           },
           {
             "match": {
               "type": "value",
               "value": "<namespaces>",
               "parameter": {
                 "source": "url",
                 "name": "ns"
               }
             }
           },
           {
             "match": {
               "type": "value",
               "value": "<workload>",
               "parameter": {
                 "source": "url",
                 "name": "workload"
               }
             }
           },
           {
             "match": {
               "type": "value",
               "value": "<container>",
               "parameter": {
                 "source": "url",
                 "name": "container"
               }
             }
           }
         ]
       }
     }
   ]
   ```

1. 填写`添加配置映射`参数，其中:

   - `名称`: 可以随意填写;
   - `键`: 以`.json`结尾的文件名，比如`cnrancher.json`;
   - `值`: 设置为上一步中修改的配置文件;
   - 如果有多个服务，可以添加多个键值对，如图:

   ![image-20190314173250612](/img/rancher/old-doc/image-20190314173250612.png)

## 3. webhooks 安装

依次点击 `system项目\工作负载\工作负载`，点击右侧部署服务。

1. 配置服务名称和镜像

   `registry.cn-shenzhen.aliyuncs.com/rancher/webhook`

   ![image-20190314173915552](/img/rancher/old-doc/image-20190314173915552.png)

1. 对外服务

   - 服务默认监听端口为`9000`，如果使用 NodePort 提供服务，则安以下方式配置；

   ![image-20190923184019854](/img/rancher/old-doc/image-20190923184019854.png)

   - 如果使用负载均衡服务，在负载均衡页面添加相应规则，如果使用 https，记得配置 ssl 证书；

   ![image-20190923184601819](/img/rancher/old-doc/image-20190923184601819.png)

1. 配置环境变量

   `WEBHOOK_CMD=-template`: 系统命令；\
   `MAIL_SMTP_PORT=`: 邮箱 SMTP 服务器端口；\
   `MAIL_SMTP_SERVER=`: 邮箱 SMTP 服务器地址，(需要 base64 加密: echo <SMTP 服务器地址> | base64 )；\
   `MAIL_FROM=` : 发件人邮箱，(需要 base64 加密: echo <发件人邮箱> | base64 )；\
   `MAIL_PASSWORD=`: 发件人邮箱密码，(需要 base64 加密: echo <密码> | base64 )；\
   `MAIL_CACERT=`: 自签名 CA 证书，邮箱服务器采用自签名 ssl 证书时使用(需要 base64 加密: cat <ca 文件> | base64 )；\
   `MAIL_TLS_CHECK=`: 是否开启 TLS 认证(false/true,默认 true)；

   > 请以文字说明为准，图片是早期版本截图，图片中有些地方未做 base64 加密

   - 常用邮箱配置(qq,163 等)

   ![image-20190315232842668](/img/rancher/old-doc/image-20190315232842668.png)

   - 自签名证书邮箱服务器

   ![image-20190315233201822](/img/rancher/old-doc/image-20190315233201822.png)

   - 不启用 TLS 认证邮箱

   ![image-20190315233320815](/img/rancher/old-doc/image-20190315233320815.png)

1. 配置健康检查

   端口: `9000`

   ![image-20190314174424562](/img/rancher/old-doc/image-20190314174424562.png)

1. 配置数据卷

   - 选择配置映射卷

   ![image-20190314174524973](/img/rancher/old-doc/image-20190314174524973.png)

   - 配置映射名: 选择前面创建的配置映射;

   - 容器路径: `/etc/webhook/source`;

   - 其他参数保持默认;

   ![image-20190314174834334](/img/rancher/old-doc/image-20190314174834334.png)

1. 最后点击启动，启动后查看日志，可以看到当前监听的服务

   ![image-20190314175308608](/img/rancher/old-doc/image-20190314175308608.png)

1. 设置`serviceaccounts`

   这一步相对比较重要，webhooks 服务需要`serviceaccounts`才可以正常的与 K8S 通信。因为目前 Rancher UI 不支持设置`serviceaccounts`，所以需要编辑`yaml`文件来配置`serviceaccounts`。为了方便，这里复用了 rancher 组件使用的`serviceaccounts`账号`cattle`，具有集群管理员角色，您也可以根据需要定制`serviceaccounts`角色。

   - 如图，选择 `查看/编辑YAML`

   ![image-20190314212013510](/img/rancher/old-doc/image-20190314212013510.png)

   - 在`securityContext: {}` 下边添加`serviceAccount: cattle`和`serviceAccountName: cattle`；

   ![image-20190314212124745](/img/rancher/old-doc/image-20190314212124745.png)

   - 最后点击`保存`

## 4. webhooks 触发地址

```bash
http(s)://<webhooks_url>/hooks/\
<webhooks_id>?\
token=<token>&\
ns=<namespaces>&\
workload=<workload>&\
container=<container>&\
repo_type=<repo_type>
```

1. 如果是阿里云的镜像仓库，可在 url 中添加`net_type`指定网络类型:

   - 公共网络:

     如果不指定，则默认为公共网络拉取镜像

   - 专有网络:

     `net_type=vpc`

   - 经典网络:

     `net_type=internal`

   其中`<webhooks_id>、<namespaces>、<workload>、<container>`对应模板中的参数，`<repo_type>`支持:`aliyun`、`dockerhub`、`custom`。

## 5. 配置仓库触发

### 5.1. Aliyun

1. 浏览器访问`https://cr.console.aliyun.com`进入容器镜像服务管理界面；

1. 选择一个需要添加自动触发功能的仓库，点击右侧的管理；

1. 在切换的新窗口左上角选择触发器；

   ![image-20190314181124857](/img/rancher/old-doc/image-20190314181124857.png)

1. webhooks 触发消息示例：

   ```json
   {
     "push_data": {
       "digest": "sha256:f66daa126e9fcac4e2d0b7131e78ffd5d8e0012a1e6cb150a953e5be8da5d      980",
       "pushed_at": "2019-03-13 23:38:07",
       "tag": "latest"
     },
     "repository": {
       "date_created": "2019-03-05 13:47:43",
       "name": "webhook",
       "namespace": "rancher_cn",
       "region": "cn-shanghai",
       "repo_authentication_type": "NO_CERTIFIED",
       "repo_full_name": "rancher_cn/webhook",
       "repo_origin_type": "NO_CERTIFIED",
       "repo_type": "PUBLIC"
     }
   }
   ```

### 5.2. Docker

1. 浏览器访问https://cloud.docker.com/repository/list，输入账号和密码后将进入仓库列表;

1. 点击需要添加 webhooks 仓库，然后点击 webhooks;

   ![image-20190314182034766](/img/rancher/old-doc/image-20190314182034766.png)

1. 填写相关参数，点击右侧的加号；

   ![image-20190314182530479](/img/rancher/old-doc/image-20190314182530479.png)

1. webhooks 触发消息示例：

   ```json
   {
     "push_data": {
       "pushed_at": 1552553567,
       "images": [],
       "tag": "latest",
       "pusher": "hongxiaolu"
     },
     "callback_url": "",
     "repository": {
       "status": "Active",
       "description": "iperf3",
       "is_trusted": true,
       "full_description": "# iperf3\niperf3\n",
       "repo_url": "",
       "owner": "hongxiaolu",
       "is_official": false,
       "is_private": false,
       "name": "iperf3",
       "namespace": "hongxiaolu",
       "star_count": 0,
       "comment_count": 0,
       "date_created": 1540013520,
       "dockerfile": "# ",
       "repo_name": "hongxiaolu/iperf3"
     }
   }
   ```

### 5.3. 自定义 webhooks

如果是使用 Jenkins 自定义构建镜像，可以设置`repo_type`=`custom`。

在 Jenkins 构建`task`中，在镜像`push`操作后增加一个`执行shell命令`的步骤。这个操作主要是在镜像成功推送到镜像仓库后发出`POST消息`去触发 webhooks，这步中需要把上一步推送的`镜像仓库地址`,`镜像命名空间`,`镜像名`，以及镜像`tag`作为变量传递到这一步，这样在发送`POST消息`才可以把相关的镜像信息传递给 webhooks,从而触发服务升级。

示例`POST消息`:

```shell
curl -X POST \
  'http(s)://<webhooks_url>/hooks/<webhooks_id>?\
  token=<token>&\
  ns=<namespaces>&\
  workload=<workload>&\
  container=<container>&\
  repo_type=custom' \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
    "push_data": {
        "tag": "${images_tag}"
    },
    "repository": {
        "repo_url": ${images_repo_url},
        "name": "${images_name}",
        "namespace": "${images_namespace}"
    }
}'
```

## 6. 触发 webhooks

1. 配置完以上参数，提交代码到 git 仓库后将会自动触发阿里云仓库或者 dockerhub 的自动构建，创建自动构建方法请自行查阅相关文档。

   ![image-20190314212701691](/img/rancher/old-doc/image-20190314212701691.png)

   ![image-20190314213123621](/img/rancher/old-doc/image-20190314213123621.png)

1. 当镜像构建完成并推送到仓库后，会触发 webhooks 消息到预先配置的地址，从触发器也可以查看历史记录。

   ![image-20190314213215303](/img/rancher/old-doc/image-20190314213215303.png)

1. webhooks 服务收到消息后，会马上触发服务的升级。查看 webhooks 服务的日志，可以看到已经成功升级。

   ![image-20190314213051682](/img/rancher/old-doc/image-20190314213051682.png)

   ![image-20190314205425237](/img/rancher/old-doc/image-20190314205425237.png)
