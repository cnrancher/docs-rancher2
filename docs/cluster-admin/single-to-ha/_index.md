---
title: 单节点迁移HA
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
  - 单节点迁移HA
---

## 1. Rancher单节点安装

:::note 提示
以下步骤创建用于演示迁移的Rancher单节点环境，如果您需要迁移正式环境可以跳过此步骤。
:::

1. 执行以下docker命令运行单个Rancher Server服务

    ```bash
    docker run -d -p 8443:443 -p 8880:80 -v /home/rancher/:/var/lib/rancher/ rancher/rancher:v2.3.0
    ```

1. 等容器初始化完成后，通过节点IP访问Rancher Server UI，设置密码并登录。

    ![image-20191016142653127](/img/rancher/single-to-ha.assets/image-20191016142653127.png)
    ![image-20191016142719866](/img/rancher/single-to-ha.assets/image-20191016142719866.png)

## 2. 创建集群

:::note 提示
以下步骤创建用于演示的业务集群，用来验证Rancher迁移到HA后数据是否丢失，如果您需要迁移正式环境可以跳过此步骤。
:::

1. 登录Rancher UI后，添加一个自定义集群

   ![image-20191016142808830](/img/rancher/single-to-ha.assets/image-20191016142808830.png)

1. 授权集群访问地址 设置为启用，FQDN和证书可以不用填写。

    ![image-20191016142850886](/img/rancher/single-to-ha.assets/image-20191016142850886.png)

    :::note 警告
    这一步很关键。如果Rancher切换到HA后，因为地址或者token或者证书的变更，将会导致Agent无法连接Rancher Server。在迁移到HA后，需要通过kubectl去编辑配置文件更新一些Agent相关的参数。默认UI上的kube配置文件是通过Agent代理连接到K8S，如果Agent无法连接Rancher Server，则通过这个KUBE配置文件无法访问K8S集群。开启授权集群访问地址功能会生成多个Contexts Cluster，这些Contexts Cluster是直连K8S，不通过Agent代理。如果业务集群未开启这个功能，可以通过编辑集群来开启这个功能。
    :::

1. 点击 下一步 ，根据预先分配的节点角色选择需要的角色，然后复制命令到主机终端执行。

    ![image-20191016143133778](/img/rancher/single-to-ha.assets/image-20191016143133778.png)

1. 集群部署完成后，进入集群首页，点击`kubeconfig文件`按钮。在弹窗页面中复制kubeconfg配置文件到文本编辑备用。

    ![image-20191016143513361](/img/rancher/single-to-ha.assets/image-20191016143513361.png)

    ![image-20191016143636998](/img/rancher/single-to-ha.assets/image-20191016143636998.png)

## 3. 部署测试应用

1. 进入default项目，随意部署一个测试应用。

    ![image-20191016143950402](/img/rancher/single-to-ha.assets/image-20191016143950402.png)

1. 进入应用商店，部署一个测试应用。

    ![image-20191016144352807](/img/rancher/single-to-ha.assets/image-20191016144352807.png)

## 4. 备份Rancher 数据

执行 `docker exec -ti <Containers_ID> bash` 进入Rancher Server容器，然后执行`etcdctl snapshot save  /var/lib/rancher/snapshot.db`进行数据备份。

![image-20191016144702116](/img/rancher/single-to-ha.assets/image-20191016144702116.png)

因为`/var/lib/rancher/`是映射到主机的`/home/rancher/`目录，所以备份的数据可以直接在主机的/home/rancher/下获取。

## 5. ETCD数据恢复

1. 将Rancher备份文件拷贝到需要部署Rancher HA的主机上，比如放在`/home/`目录，所有节点都要拷贝。如果节点之前安装过K8S集群，请确保节点已经初始化过（了解[节点清理](/docs/cluster-admin/cleaning-cluster-nodes/_index)）。

    ![image-20191016145903388](/img/rancher/single-to-ha.assets/image-20191016145903388.png)

1. 获取etcdctl

    访问 `https://github.com/etcd-io/etcd/releases/` 下载ETCD二进制压缩包，解压后获得etcdctl二进制文件。拷贝etcdctl二进制文件到Rancher HA的主机上。并给文件可执行权限 `chmod +x etcdctl`。

    ![image-20191016150137910](/img/rancher/single-to-ha.assets/image-20191016150137910.png)

1. 在Rancher HA所有节点执行以下命令将ETCD备份文件恢复到默认路径

    ```bash
    ETCDCTL_API=3 etcdctl snapshot restore snapshot.db --data-dir=/var/lib/etcd
    ```

    ![image-20191016150556120](/img/rancher/single-to-ha.assets/image-20191016150556120.png)

    以上操作将把数据恢复到ETCD默认存储路径。

## 6. LOCAL K8S集群部署

1. 根据文档[示例配置](/docs/installation/k8s-install/kubernetes-rke/_index#2、创建-rke-配置文件) 创建RKE配置文件。

1. 执行rke命令创建LOCAL K8S集群

   ```bash
   rke up --config cluster.yml
   ```

   ![image-20191016152133693](/img/rancher/single-to-ha.assets/image-20191016152133693.png)

1. 检查K8S集群运行状态

    ![image-20191016165114635](/img/rancher/single-to-ha.assets/image-20191016165114635.png)
    ![image-20191016165143557](/img/rancher/single-to-ha.assets/image-20191016165143557.png)

## 7. Rancher HA安装

:::note 警告
Rancher HA的版本需要大于或者等于Rancher单节点的版本。
:::

1. 根据[自签名ssl证书](/docs/installation/options/self-signed-ssl/_index)文档创建自签名证书或者配置权威证书；
2. 根据[安装文档](/docs/installation/k8s-install/_index)进行Rancher HA安装；
3. 安装完成后访问Rancher UI，可以看到之前添加的`test`集群。（错误提示是因为Rancher URL改变，cluster Agent无法连接Rancher Server。）

    ![image-20191016170347456](/img/rancher/single-to-ha.assets/image-20191016170347456.png)

## 8. Rancher HA配置

1. 修改Rancher URL配置

   在`全局|系统设置`中找到`server-url`，如果Rancher HA地址与Rancher单节点地址不一致，则修改地址为Rancher HA地址。

   ![image-20191016170849825](/img/rancher/single-to-ha.assets/image-20191016170849825.png)

1. 然后新开窗口，在浏览器地址栏输入 `https://rancher-url/v3/clusters/local/clusterregistrationtokens`切换到注册命令接口页面。

1. 在注册命令接口页找到`insecureCommand`字段，复制字段后面的yaml文件链接。

   ![image-20191016185613510](/img/rancher/single-to-ha.assets/image-20191016185613510.png)

1. 通过命令 `curl -o local.yaml https://192.168.3.115:30303/v3/import/8vvmfwjwd6mkf8g2f769cnhh4s64s5jcnxgv5t6v5bdxk84tf6zztl.yaml`把文件下载到本地，文件名建议以集群ID命名，用于区分。

1. 相应的，其他业务集群也需要按照以上步骤，通过访问`https://<rancher_url>/v3/clusters/<cluster_id>/clusterregistrationtokens`去获取`insecureCommand`对应的`yaml`文件，然后下载yaml文件到本地。在切换到对应集群后，在地址栏可以看到`<cluster_id>`。

   ![image-20191016191846530](/img/rancher/single-to-ha.assets/image-20191016191846530.png)

   :::note 注意
   在更换地址后，`clusterregistrationtokens`接口中可能会生成多组`insecureCommand`，如下图。对应的，在`insecureCommand`上方有`createdTS`字段，`createdTS`数值越大，对应的yaml配置最新，请选择最大数值`createdTS`下的`insecureCommand`后的`yaml`链接。
   :::

   ![image-20191017182734715](/img/rancher/single-to-ha.assets/image-20191017182734715.png)

1. 根据前面步骤中保存的kubecfg配置文件，和上一步骤中保存的对应集群注册`yaml文件`，通过kubectl工具去执行。

    ```bash
    --kubeconfig=xxxx # 指定集群配置文件
    --context=xxxx  # 切换授权集群访问地址（local集群不用切换，local集群配置默认是直连K8S集群）

    # local示例
    kubectl --kubeconfig=kube_config_cluster.yml apply -f local.yaml
    # 业务集群示例
    kubectl --kubeconfig=kube_c-b49gh.yml --context test-node apply -f c-b49gh.yaml
    ```

2. 执行完以上命令后业务集群将自动连接Rancher

    ![image-20191016195215819](/img/rancher/single-to-ha.assets/image-20191016195215819.png)

    之前部署的应用正常运行，未丢失。

    ![image-20191016195309268](/img/rancher/single-to-ha.assets/image-20191016195309268.png)