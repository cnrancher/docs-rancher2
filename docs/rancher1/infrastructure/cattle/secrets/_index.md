---
title: 密文功能
---

Rancher 支持创建密文并在容器中使用该密文(在容器中使用该密文需要部署应用商店里的 Rancher Secrets 服务)。Rancher 通过对接加密后台来保障密文的安全。加密后台可以使用本地的 AES 密钥或者使用[Vault Transit](https://www.vaultproject.io/docs/secrets/transit/)

## 加密后台设置

默认情况下，Rancher Server 会使用本地的 AES256 密钥来对密文进行加密。加密的密文存储在 MySQL 数据库里。

### 使用 Vault Transit

如果不想使用本地密钥加密，您可以通过配置[Vault Transit](https://www.vaultproject.io/docs/secrets/transit/)来进行密文加密。

#### 在 Rancher 中配置 Vault Transit

在安装 Rancher Server 之前，需要进行如下 Vault Transit 相关的配置。

1. 在要运行 Rancher Server 的主机上安装 Vault transit 后台。
2. 通过 Vault 命令行或者 API，创建一个叫`rancher`的加密密钥。
3. 通过 Vault 命令行或者 API，创建一个 Vault 访问口令，这个访问口令可以通过`rancher`加密密钥进行加密和解密。

   - 这个访问口令必须具有一个给 Rancher Server 使用的安全策略，来限制 Rancher Server 的访问权限。下面列表中的`<KEY>`就是之前创建的`rancher`加密密钥

     ```json
     path "transit/random/*" {
       capabilities = ["create", "update"]
     }

     path "transit/hmac/*" {
       capabilities = ["create", "update"]
     }

     path "transit/encrypt/rancher" {
       capabilities = ["create", "update"]
     }

     path "transit/decrypt/rancher" {
       capabilities = ["create", "update"]
     }

     path "transit/verify/rancher/*" {
       capabilities = ["create", "update", "read"]
     }

     path "transit/keys/*" {
       capabilities = ["deny"]
     }

     path "sys/*" {
       capabilities = ["deny"]
     }
     ```

4. 启动 Rancher Server，并加入相关环境变量来连接 Vault。

   ```bash
   $ docker run -d --restart=unless-stopped -p 8080:8080 \
      -e VAULT_ADDR=https://<VAULT_SERVER> -e VAULT_TOKEN=<TOKEN_FOR_VAULT_ACCCESS> rancher/server
   ```

   > **注意:** 请检查运行的[Rancher Server 版本](/docs/rancher1/installation/installing-server/_index#rancher-server-标签)是否是您想要的。

5. 在 Rancher 服务启动成功之后，您需要修改 Rancher 中的`service-backend`设置。在**系统管理** -> **系统设置** -> **高级设置**中，找到`secrets.backend`。它的默认值是`localkey`，您可以把它修改为`vault`。

> **注意:** 目前 Rancher 不支持对不同加密后台之间进行切换。

## 创建密文

您可以在每个 Rancher 环境里创建密文。这也意味着，密文名称在环境中是唯一的。同一个环境下的任何容器都可以通过配置来共享密文。例如，一个数据库的密码`db_password`可以被用在数据库容器里，也可以被用在 Wordpress 容器里。一旦这个密文被创建了，这个密文的密文值就**不能**被修改了。如果您需要修改一个现有的密文，唯一的方法就是删除这个密文，然后再创建一个新密文。新密文被创建后，使用这个密文的服务需要重新部署。这样容器才能使用新的密文值。

### 通过 Rancher 命令行创建密文

在命令行当中有两种方法来创建密文。一种是在标准输入中(stdin)输入密文值，另一种是给命令行传递含有密文的文件名称。

#### 通过标准输入(stdin)创建密文

```bash
rancher secrets create name-of-secret - <<< secret-value
```

#### 通过传递密文所在的文件名称来创建密文

```bash
echo secret-value > file-with-secret
rancher secrets create name-of-secret file-with-secret
```

### 通过 UI 创建密文

点击**基础架构** -> **密文**。点击**添加密文**。输入**名称**和**密文值**然后点击**保存**。

## 删除密文

> **备注:** 目前 Rancher 命令行不支持删除密文。

您可以在 UI 里把密文从 Rancher 中删除，但是这并不会在已使用该密文的容器中删除该密文文件。如果一台主机上运行着使用该密文的容器，Rancher 也不会在该主机上删除该密文文件。

## 在 Rancher 中启用密文

为了在容器中使用密文，您要先部署**Rancher Secrets**服务。您可以把这个服务加到[环境模版](/docs/rancher1/configurations/environments/_index#什么是环境模版)中，在添加该服务之后部署的新[环境](/docs/rancher1/configurations/environments/_index)里都会含有**Rancher Secrets**服务。您也可以直接通过[应用商店](/docs/rancher1/configurations/catalog/_index)部署该服务。如果您想在现有的环境中部署**Rancher Secrets**服务，您可以通过**应用商店** -> **官方认证**，然后搜索**Rancher Secrets**找到**Rancher Secrets**服务。如果不部署**Rancher Secrets**服务的话，您仅仅可以创建密文，但是不能在您的容器里使用这些密文。

## 向服务／容器中添加密文

当密文被添加到容器中时，密文会被写到一个 tmpfs 卷中。您可以在容器里和主机上访问这个卷。

- 在使用该密文的容器中:这个卷被挂载在`/run/secrets/`.
- 在运行使用该密文的容器所在的主机上:这个卷被挂载在`/var/lib/rancher/volumes/rancher-secrets/`.

### 通过 Rancher 命令行添加密文到服务中

> **注意:** 密文是在 compose 文件版本 3 中被引入的。由于 Rancher 不支持 compose 文件版本，所以我们在版本 2 中加入了密文功能。

您可以在`docker-compose.yml`里，通过配置服务的`secrets`值来指定一个或者多个密文。密文文件的名称与在 Rancher 中加入的密文名称相同。在默认情况下，将使用用户 ID`0`和组 ID`0`创建该密文文件，文件权限为`0444`。在`secrets`里将`external`设置为`true`确保 Rancher 知道该密文已经被创建成功了。

#### 基础示例`docker-compose.yml`

```bash
version: '2'
services:
  web:
    image: sdelements/lets-chat
    stdin_open: true
    secrets:
    - name-of-secret
    labels:
      io.rancher.container.pull_image: always
secrets:
  name-of-secret:
    external: true
```

如果您想要修改密文的默认配置，您可以用`target`来修改文件名，`uid`和`gid`来设置用户 ID 和组 ID，`mode`来修改文件权限。

#### 修改密文文件配置示例`docker-compose.yml`

```yml
version: "2"
services:
  web:
    image: sdelements/lets-chat
    stdin_open: true
    secrets:
      - source: name-of-secret
        target: different-target-filename
        uid: "1"
        gid: "1"
        mode: 0400
    labels:
      io.rancher.container.pull_image: always
secrets:
  name-of-secret:
    external: true
```

Racnher 可以在创建应用的时候创建密文。您可以通过指定`file`参数，使 Rancher 在创建应用并启动服务之前创建密文。该密文值来自您指定的文件内容。

#### 指定多个密文并且在启动服务前创建密文的示例`docker-compose.yml`

```yml
version: "2"
services:
  web:
    image: sdelements/lets-chat
    stdin_open: true
    secrets:
      - name-of-secret
      - another-name-of-secret
    labels:
      io.rancher.container.pull_image: always
secrets:
  name-of-secret:
    external: true
  another-name-of-secret:
    file: ./another-secret
```

### 通过 Rancher UI 添加密文到服务中

您可以在创建服务/容器页面的密文页里，向服务/容器中添加密文。

1. 点击**添加密文**
2. 下拉列表中会列出，已经加入到 Rancher 中的全部可用密文。您可以选择一个您想要使用的密文。
3. (可选操作) 默认情况下，挂载到容器内的密文文件的名称为密文名。您可以在映射名称栏，给容器中的密文文件设置一个不同的文件名。
4. (可选操作) 如果您想要修改默认的文件所有者和文件权限。您可以点击**自定义文件所有者及权限**链接来更新配置。您可以修改用户 ID，组 ID 和文件权限。用户 ID 的默认值为`0`，组 ID 的默认值为 0，文件权限的默认值为`0444`。
5. 点击 **创建**.

## Docker Hub 镜像

Docker 在很多自己的官方镜像中都支持通过文件来传递密文。您可以添加以`_FILE`结尾的环境变量名并且以`/run/secrets/NAME>`为值的环境变量，来达到这一效果。当在容器启动时，文件中的密文值将会被赋给去掉`_FILE`的环境变量里。

例如，当您部署一个 MySQL 容器的时候，您可以配置如下环境变量。

```bash
-e MYSQL_ROOT_PASSWORD_FILE=/run/secrets/db_password
```

`MYSQL_ROOT_PASSWORD`环境变量的值，就是您所指定这个文件的内容。这个文件就是我们在 Rancher 中添加的密文。这样您就可以很方便的从环境变量中获取在 Rancher 中配置的密文，而不用自己去读取密文文件。但并不是所有镜像都支持这个功能。

## 已知的安全隐患

### 被入侵的 Rancher Server 容器

存储在 Rancher 中的密文和存储在 CI 系统(如 Travis CI 和 Drone)中的密文安全程度是一样。由于加密密钥直接存储在 Rancher Server 容器中，所以如果 Rancher Server 容器被入侵，全部的密文都能被黑客获取到。Rancher 将在以后的版本中努力降低这种情况的安全隐患。

> **注意:** 如果您使用 Vault 进行加密，您需要创建一个策略来限制 Rancher Server 所用的 token 的访问权限。

### 被入侵的主机

如果一台主机被入侵了，这台主机上所运行的容器中使用到的全部密文，都可以被读取。 但是黑客获取不到其他主机上的额外密文。

### 容器访问

如果一个用户可以 exec 进入到容器中，该用户可以通过容器中挂载的卷查看到密文值。可以通过如下方式访问容器:

- UI 点击"执行命令行"
- Rancher 命令行工具
- Docker 原生命令
