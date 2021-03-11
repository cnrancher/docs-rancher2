---
title: 变更 Rancher Server IP 或域名
description:
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 集群管理员指南
  - 集群访问控制
  - 变更Rancher Server 域名或IP
---

## 步骤 1：准备全部集群的直连 kubeconfig 配置文件

在默认情况下， Rancher UI 上复制的 kubeconfig 通过`cluster agent`代理连接到 K8S 集群。变更 SSL 证书会导致`cluster agent`无法连接 Rancher Server，从而导致`kubectl`无法使用 Rancher UI 上复制的 kubeconfig 去操作 K8S 集群。用户需要通过`kubectl`命令行修改配置，解决这个问题。在执行域名或 IP 变更之前，请准备好所有集群的直连 kubeconfig 配置文件，详情考参考：[恢复 kubectl 配置文件](/docs/rancher2.5/cluster-admin/restore-kubecfg/_index)

:::note 警告

1. 如果您使用的是 2.1.x 以前的版本，可以在 Master 节点的`/etc/kubernetes/.tmp`路径下找到`kubecfg-kube-admin.yml`文件。该文件是具有集群管理员权限的直连 kubeconfig 配置文件；

   ![image-20190309173154246](/img/rancher/old-doc/image-20190309173154246.png)

2. 执行域名变更或 IP 变更之前，请备份 Rancher Server，详情请参考[备份和恢复](/docs/rancher2.5/backups/_index)。

:::

## 步骤 2：准备证书

SSL 证书与`域名或IP`之间存在绑定关系，客户端通过`域名或IP`访问 Server 端时，需要进行 SSL 证书校验。如果客户端访问的`域名或IP`与 SSL 证书中预先绑定的`域名或IP`不一致，那么 SSL 会认为这个 Server 端是伪造的，导致证书校验失败，客户端无法连接 Server 端。如果您更换了域名或 IP，而且在生成 SSL 证书时没有绑定新的域名或 IP，出现上述问题就是一个正常的现象。解决该问题的方法也非常直接明了：生成一个新的 SSL 证书，绑定新的域名或 IP，替换已有的证书。如果您已经有后续域名或 IP 变更的具体规划，也可以在生成 SSL 证书 时绑定这次和以后需要替换的域名或 IP，这样可以减轻下次变更的工作量。总而言之，如果更换了 Server 端的`域名或IP`，一般会涉及到 SSL 证书更换。请参考下文，替换自签名 SSL 证书或权威认证证书。

- 自签名 ssl 证书

  复制以下代码另存为`create_self-signed-cert.sh`或者其他您喜欢的文件名。修改代码开头的`CN`(域名)，如果需要使用 ip 去访问 Rancher Server，那么需要给 ssl 证书添加扩展 IP，多个 IP 用逗号隔开。如果想实现多个域名访问 Rancher Server，则添加扩展域名(SSL_DNS),多个`SSL_DNS`用逗号隔开。

  ```bash
  #!/bin/bash -e

  help ()
  {
      echo  ' ================================================================ '
      echo  ' --ssl-domain: 生成ssl证书需要的主域名，如不指定则默认为www.rancher.local，如果是ip访问服务，则可忽略；'
      echo  ' --ssl-trusted-ip: 一般ssl证书只信任域名的访问请求，有时候需要使用ip去访问Server，那么需要给ssl证书添加扩展IP，多个IP用逗号隔开；'
      echo  ' --ssl-trusted-domain: 如果想多个域名访问，则添加扩展域名（SSL_TRUSTED_DOMAIN）,多个扩展域名用逗号隔开；'
      echo  ' --ssl-size: ssl加密位数，默认2048；'
      echo  ' --ssl-cn: 国家代码(2个字母的代号),默认CN;'
      echo  ' 使用示例:'
      echo  ' ./create_self-signed-cert.sh --ssl-domain=www.test.com --ssl-trusted-domain=www.test2.com \ '
      echo  ' --ssl-trusted-ip=1.1.1.1,2.2.2.2,3.3.3.3 --ssl-size=2048 --ssl-date=3650'
      echo  ' ================================================================'
  }

  case "$1" in
      -h|--help) help; exit;;
  esac

  if [[ $1 == '' ]];then
      help;
      exit;
  fi

  CMDOPTS="$*"
  for OPTS in $CMDOPTS;
  do
      key=$(echo ${OPTS} | awk -F"=" '{print $1}' )
      value=$(echo ${OPTS} | awk -F"=" '{print $2}' )
      case "$key" in
          --ssl-domain) SSL_DOMAIN=$value ;;
          --ssl-trusted-ip) SSL_TRUSTED_IP=$value ;;
          --ssl-trusted-domain) SSL_TRUSTED_DOMAIN=$value ;;
          --ssl-size) SSL_SIZE=$value ;;
          --ssl-date) SSL_DATE=$value ;;
          --ca-date) CA_DATE=$value ;;
          --ssl-cn) CN=$value ;;
      esac
  done

  # CA相关配置
  CA_DATE=${CA_DATE:-3650}
  CA_KEY=${CA_KEY:-cakey.pem}
  CA_CERT=${CA_CERT:-cacerts.pem}
  CA_DOMAIN=cattle-ca

  # ssl相关配置
  SSL_CONFIG=${SSL_CONFIG:-$PWD/openssl.cnf}
  SSL_DOMAIN=${SSL_DOMAIN:-'www.rancher.local'}
  SSL_DATE=${SSL_DATE:-3650}
  SSL_SIZE=${SSL_SIZE:-2048}

  ## 国家代码(2个字母的代号),默认CN;
  CN=${CN:-CN}

  SSL_KEY=$SSL_DOMAIN.key
  SSL_CSR=$SSL_DOMAIN.csr
  SSL_CERT=$SSL_DOMAIN.crt

  echo -e "\033[32m ---------------------------- \033[0m"
  echo -e "\033[32m       | 生成 SSL Cert |       \033[0m"
  echo -e "\033[32m ---------------------------- \033[0m"

  if [[ -e ./${CA_KEY} ]]; then
      echo -e "\033[32m ====> 1. 发现已存在CA私钥，备份"${CA_KEY}"为"${CA_KEY}"-bak，然后重新创建 \033[0m"
      mv ${CA_KEY} "${CA_KEY}"-bak
      openssl genrsa -out ${CA_KEY} ${SSL_SIZE}
  else
      echo -e "\033[32m ====> 1. 生成新的CA私钥 ${CA_KEY} \033[0m"
      openssl genrsa -out ${CA_KEY} ${SSL_SIZE}
  fi

  if [[ -e ./${CA_CERT} ]]; then
      echo -e "\033[32m ====> 2. 发现已存在CA证书，先备份"${CA_CERT}"为"${CA_CERT}"-bak，然后重新创建 \033[0m"
      mv ${CA_CERT} "${CA_CERT}"-bak
      openssl req -x509 -sha256 -new -nodes -key ${CA_KEY} -days ${CA_DATE} -out ${CA_CERT} -subj "/C=${CN}/CN=${CA_DOMAIN}"
  else
      echo -e "\033[32m ====> 2. 生成新的CA证书 ${CA_CERT} \033[0m"
      openssl req -x509 -sha256 -new -nodes -key ${CA_KEY} -days ${CA_DATE} -out ${CA_CERT} -subj "/C=${CN}/CN=${CA_DOMAIN}"
  fi

  echo -e "\033[32m ====> 3. 生成Openssl配置文件 ${SSL_CONFIG} \033[0m"
  cat > ${SSL_CONFIG} <<EOM
  [req]
  req_extensions = v3_req
  distinguished_name = req_distinguished_name
  [req_distinguished_name]
  [ v3_req ]
  basicConstraints = CA:FALSE
  keyUsage = nonRepudiation, digitalSignature, keyEncipherment
  extendedKeyUsage = clientAuth, serverAuth
  EOM

  if [[ -n ${SSL_TRUSTED_IP} || -n ${SSL_TRUSTED_DOMAIN} ]]; then
      cat >> ${SSL_CONFIG} <<EOM
  subjectAltName = @alt_names
  [alt_names]
  EOM
      IFS=","
      dns=(${SSL_TRUSTED_DOMAIN})
      dns+=(${SSL_DOMAIN})
      for i in "${!dns[@]}"; do
        echo DNS.$((i+1)) = ${dns[$i]} >> ${SSL_CONFIG}
      done

      if [[ -n ${SSL_TRUSTED_IP} ]]; then
          ip=(${SSL_TRUSTED_IP})
          for i in "${!ip[@]}"; do
            echo IP.$((i+1)) = ${ip[$i]} >> ${SSL_CONFIG}
          done
      fi
  fi

  echo -e "\033[32m ====> 4. 生成服务SSL KEY ${SSL_KEY} \033[0m"
  openssl genrsa -out ${SSL_KEY} ${SSL_SIZE}

  echo -e "\033[32m ====> 5. 生成服务SSL CSR ${SSL_CSR} \033[0m"
  openssl req -sha256 -new -key ${SSL_KEY} -out ${SSL_CSR} -subj "/C=${CN}/CN=${SSL_DOMAIN}" -config ${SSL_CONFIG}

  echo -e "\033[32m ====> 6. 生成服务SSL CERT ${SSL_CERT} \033[0m"
  openssl x509 -sha256 -req -in ${SSL_CSR} -CA ${CA_CERT} \
      -CAkey ${CA_KEY} -CAcreateserial -out ${SSL_CERT} \
      -days ${SSL_DATE} -extensions v3_req \
      -extfile ${SSL_CONFIG}

  echo -e "\033[32m ====> 7. 证书制作完成 \033[0m"
  echo
  echo -e "\033[32m ====> 8. 以YAML格式输出结果 \033[0m"
  echo "----------------------------------------------------------"
  echo "ca_key: |"
  cat $CA_KEY | sed 's/^/  /'
  echo
  echo "ca_cert: |"
  cat $CA_CERT | sed 's/^/  /'
  echo
  echo "ssl_key: |"
  cat $SSL_KEY | sed 's/^/  /'
  echo
  echo "ssl_csr: |"
  cat $SSL_CSR | sed 's/^/  /'
  echo
  echo "ssl_cert: |"
  cat $SSL_CERT | sed 's/^/  /'
  echo

  echo -e "\033[32m ====> 9. 附加CA证书到Cert文件 \033[0m"
  cat ${CA_CERT} >> ${SSL_CERT}
  echo "ssl_cert: |"
  cat $SSL_CERT | sed 's/^/  /'
  echo

  echo -e "\033[32m ====> 10. 重命名服务证书 \033[0m"
  echo "cp ${SSL_DOMAIN}.key tls.key"
  cp ${SSL_DOMAIN}.key tls.key
  echo "cp ${SSL_DOMAIN}.crt tls.crt"
  cp ${SSL_DOMAIN}.crt tls.crt
  ```

- 权威认证证书

  把权威证书文件重命名为需要的文件名：

  ```bash
  cp xxx.key tls.key
  cp xxx.crt tls.crt
  ```

## 步骤 3：更新证书（可选）

:::note 提示
证书与域名或 IP 有绑定关系，一般情况更换域名或 IP 需更换证书。如果之前配置的证书是一个通配证书或者之前配置的证书已经包含了需要变更的域名或 IP，那么证书则可以不用更换。
:::

### 3.1. Rancher 单节点运行（默认容器自动生成自签名 SSL 证书）

默认情况，通过`docker run`运行的 Rancher Server 容器，会自动为 Rancher 生成 SSL 证书，这个证书会自动绑定 Rancher 系统设置中`server-url`配置的`域名或IP`。如果更换了`域名或IP`，证书会自动更新，无需单独操作。

### 3.2. Rancher 单节点运行（外置自签名 SSL 证书）

> 注意：操作前先备份，[备份和恢复](/docs/rancher2.5/backups/_index)。

如果是以`映射证书文件`的方式运行的单容器 Rancher Server，只需要停止原有 Rancher Server 容器，用新证书替换旧证书，保持文件名不变，然后重新运行容器即可。

### 3.3. Rancher HA 运行

> 注意：操作前先备份，[备份和恢复](/docs/rancher2.5/backups/_index)。

1. 备份原有证书 YAML 文件

   ```bash
   kubectl --kubeconfig=kube_configxxx.yml -n cattle-system \
   get secret tls-rancher-ingress -o yaml > tls-ingress.yml

   kubectl --kubeconfig=kube_configxxx.yml -n cattle-system \
   get secret tls-ca -o yaml > tls-ca.yml
   ```

1. 删除旧的 secret，然后创建新的 secret

   ```bash
   # 指定kube配置文件路径

   kubeconfig=xxx.yaml

   # 删除旧的secret
   kubectl --kubeconfig=$kubeconfig -n cattle-system \
   delete secret tls-rancher-ingress

   kubectl --kubeconfig=$kubeconfig -n cattle-system \
   delete secret tls-ca

   # 创建新的secret
   kubectl --kubeconfig=$kubeconfig -n cattle-system \
   create secret tls tls-rancher-ingress --cert=./tls.crt --key=./tls.key

   kubectl --kubeconfig=$kubeconfig -n cattle-system \
   create secret generic tls-ca --from-file=cacerts.pem

   # 重启Pod
   kubectl --kubeconfig=$kubeconfig -n cattle-system \
   delete pod `kubectl --kubeconfig=$kubeconfig -n cattle-system \
   get pod |grep -E "cattle-cluster-agent|cattle-node-agent|rancher" | awk '{print $1}'`
   ```

> **重要提示:** 如果环境不是按照标准的 rancher 安装文档安装，`secret`名称可能不相同，请根据实际 secret 名称操作。

## 步骤 4：修改 Rancher Server IP 或域名

1. 依次访问`全局 > 系统设置`，页面往下翻找到`server-url`文件；

   ![image-20200220190647637](/img/rancher/old-doc/image-20200220190647637.png)

1. 单击右侧的省略号菜单，选择升级；

   ![image-20200220190801613](/img/rancher/old-doc/image-20200220190801613.png)

1. 修改`server-url`地址；

   ![image-20200220190821898](/img/rancher/old-doc/image-20200220190821898.png)

1. 最后单击`保存`

## 步骤 5：更新 ingress 配置文件

将 ingress 中的 host 字段修改成新的域名

```bash
kubectl --kubeconfig=kube_configxxx.yml  edit ingress rancher -n cattle-system

spec:
  rules:
  - host: x.x.x
    http:
      paths:
      - backend:
          serviceName: rancher
          servicePort: 80
  tls:
  - hosts:
    - x.x.x
    secretName: tls-rancher-ingress
```

## 步骤 6：更新 agent 配置文件

1. 通过`新域名或IP`登录 Rancher Server；

   :::note 警告
   这一步非常重要！
   :::

2. 通过浏览器地址栏查询`集群ID`， `c/`后面以`c`开头的字段即为集群 ID；

   ![image-20200220205103937](/img/rancher/old-doc/image-20200220205103937.png)

3. 访问`https://<新的server_url>/v3/clusters/<集群ID>/clusterregistrationtokens`页面；

4. 打开**clusterRegistrationTokens**页面后，定位到`data`字段；

   ![image-20191214193741315](/img/rancher/old-doc/image-20191214193741315.png)

5. 找到`insecureCommand`字段，复制 YAML 连接备用；

   ![image-20191214194320570](/img/rancher/old-doc/image-20191214194320570.png)

> 可能会有多组`"baseType": "clusterRegistrationToken"`，如下图。这种情况以`createdTS`最大、时间最新的一组为准，一般是最后一组。
> ![image-20191214193550681](/img/rancher/old-doc/image-20191214193550681.png)

6. 使用`kubectl`工具，通过第一步准备的`直连kubeconfig配置文件`和上面步骤中获取的 YAML 文件，执行以下命令更新`agent`相关配置。

   ```bash
   curl -L -k <替换为上面步骤获取的YAML文件链接> | kubectl --kubeconfig=<直连kubeconfig配置文件> apply -f -
   ```

## 后续操作

上述步骤 1~6 演示了如何为单个集群更新 agent 配置，您需要按照这些步骤，为所有集群更新 agent 配置，才能够完成域名或 IP 变更。
